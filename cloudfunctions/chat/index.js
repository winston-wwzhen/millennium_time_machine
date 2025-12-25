// cloudfunctions/chat/index.js
const cloud = require("wx-server-sdk");
const prompts = require("./prompts");
const { checkContentSafety } = require("./safety");
const { callGLM } = require("./glm");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

// 不需要历史记录的模式列表（一次性转换类）
const NO_HISTORY_MODES = ['mars', 'kaomoji', 'abstract', 'human', 'emo', 'mood_log', 'toxic_soup', 'joker', 'poet', 'flirt_master'];

exports.main = async (event, context) => {
  const { userMessage, history, mode = 'chat', contactName, groupChat } = event;

  // --- 🎭 群聊模式：一次调用生成多个角色回复 ---
  if (groupChat && groupChat.enabled && groupChat.speakers && groupChat.speakers.length > 0) {
    return await handleGroupChat(event, groupChat.speakers);
  }

  // --- 👤 单人聊天模式（原有逻辑） ---
  // 1. 获取当前模式的配置
  let currentConfig = prompts[mode] || prompts['chat'];
  let systemPrompt = currentConfig.system;

  // 2. 如果提供了 contactName，尝试从数据库获取该好友的 systemPrompt
  if (contactName) {
    try {
      const contactRes = await db.collection('qcio_ai_contacts')
        .where({ name: contactName, isEnabled: true })
        .limit(1)
        .get();

      if (contactRes.data.length > 0 && contactRes.data[0].systemPrompt) {
        // 使用数据库中的 systemPrompt
        systemPrompt = contactRes.data[0].systemPrompt;
        // 仍然使用数据库记录的 chatMode 对应的 temperature（如果没有则用原配置）
        const dbChatMode = contactRes.data[0].chatMode || mode;
        currentConfig = prompts[dbChatMode] || currentConfig;
      }
    } catch (err) {
      console.error('Fetch contact prompt error:', err);
      // 出错时使用默认配置
    }
  }

  // --- 🛡️ 步骤一：输入安全校验 ---
  const inputCheck = await checkContentSafety(cloud, userMessage);
  if (!inputCheck.safe) {
    return {
      success: true, // 逻辑成功，业务拒绝
      reply: "（系统提示：内容包含敏感词，已被网管屏蔽 v_v）"
    };
  }

  // --- 🤖 步骤二：构建消息并调用 AI ---
  // 根据模式决定是否携带历史记录
  // 聊天类模式（chat、qingwu、longaotian、netadmin）需要历史记录
  // 转换类模式（mars、emo 等）不需要历史记录
  const shouldIncludeHistory = !NO_HISTORY_MODES.includes(mode);

  const messageList = [
    { role: "system", content: systemPrompt },
    ...(shouldIncludeHistory ? (history || []) : []),
    { role: "user", content: userMessage }
  ];

  const aiResult = await callGLM(messageList, currentConfig.temperature);

  if (!aiResult.success) {
    return {
      success: false,
      errMsg: "系统繁忙，可能是网线断了..."
    };
  }

  let finalReply = aiResult.content;

  // --- 🛡️ 步骤三：输出安全校验 ---
  const outputCheck = await checkContentSafety(cloud, finalReply);
  if (!outputCheck.safe) {
    finalReply = "（内容正在审核中，暂时无法显示...）";
  }

  return {
    success: true,
    reply: finalReply,
  };
};

/**
 * 处理群聊模式：一次调用生成多个角色回复
 */
async function handleGroupChat(event, speakers) {
  const { userMessage, history, mode = 'chat' } = event;

  // 1. 获取模式配置
  const currentConfig = prompts[mode] || prompts['chat'];

  // 2. 构建群聊 system prompt
  const speakersList = speakers.map((s, i) => `${i + 1}. ${s.name}（${s.mode}模式）`).join('\n');
  const groupSystemPrompt = `你是一个群聊场景的AI助手。请模拟以下${speakers.length}位群成员，对用户的消息进行回复。

群成员列表：
${speakersList}

要求：
1. 每位成员根据自己的性格模式回复
2. 回复要简短自然，像真实的群聊
3. 不同成员的回复要有差异性
4. 必须以JSON数组格式返回，格式如下：
[
  {"content": "成员1的回复内容"},
  {"content": "成员2的回复内容"},
  ...
]

请严格按照JSON格式返回，不要包含其他内容。`;

  // 3. 构建消息
  const messageList = [
    { role: "system", content: groupSystemPrompt },
    { role: "user", content: userMessage }
  ];

  // 4. 调用 AI
  const aiResult = await callGLM(messageList, 0.7);

  if (!aiResult.success) {
    return {
      success: false,
      errMsg: "系统繁忙，可能是网线断了..."
    };
  }

  // 5. 解析 AI 返回的 JSON
  let replies = [];
  try {
    // 尝试提取 JSON（AI 可能会返回markdown格式的json）
    let content = aiResult.content.trim();
    // 去除可能的 markdown 代码块标记
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0) {
      replies = parsed.map(item => ({
        content: item.content || item.message || ''
      }));

      // 确保回复数量与发言人数一致（多退少补）
      while (replies.length < speakers.length) {
        replies.push({ content: '...' });
      }
      if (replies.length > speakers.length) {
        replies = replies.slice(0, speakers.length);
      }
    }
  } catch (err) {
    console.error('Parse group chat replies error:', err);
    // 解析失败时，为每个成员生成默认回复
    replies = speakers.map(() => ({
      content: aiResult.content || '...'
    }));
  }

  return {
    success: true,
    replies: replies
  };
}