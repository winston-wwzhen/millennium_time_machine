// cloudfunctions/chat/index.js
const cloud = require("wx-server-sdk");
const prompts = require("./prompts");
const { checkContentSafety } = require("./safety");
const { callGLM } = require("./glm");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

exports.main = async (event, context) => {
  const { userMessage, history, mode = 'chat' } = event;

  // 1. 获取当前模式的配置 (如果找不到模式，默认回退到 chat)
  const currentConfig = prompts[mode] || prompts['chat'];

  // --- 🛡️ 步骤一：输入安全校验 ---
  const inputCheck = await checkContentSafety(cloud, userMessage);
  if (!inputCheck.safe) {
    return {
      success: true, // 逻辑成功，业务拒绝
      reply: "（系统提示：内容包含敏感词，已被网管屏蔽 v_v）"
    };
  }

  // --- 🤖 步骤二：构建消息并调用 AI ---
  // 根据模式决定是否携带历史记录 (火星文翻译不需要历史)
  const messageList = [
    { role: "system", content: currentConfig.system },
    ...(mode === 'chat' ? (history || []) : []),
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