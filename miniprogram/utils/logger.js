/**
 * 日志记录辅助模块
 * 为操作日志添加随机的话语，让日志更像日记
 */

// 不同操作类型的随机话语库
const LOG_MESSAGES = {
  open: {
    QCIO: [
      "登录QCIO，看看有没有人找我~",
      "今天农场该收菜了吧",
      "打开QCIO，查看谁在线",
      "那个年代，QCIO就是我们的全世界"
    ],
    '我的电脑': [
      "整理一下桌面图标",
      "看看系统属性",
      "我的电脑 - 那个年代的数字家园"
    ],
    '我的文档': [
      "翻开日记，回忆往事",
      "看看以前写的文章",
      "我的文档 - 存储着青春的回忆"
    ],
    '网管系统': [
      "查查还剩多少网费",
      "该充值了，不然怎么聊天啊",
      "拨号上网的年代，每一分钟都很珍贵"
    ],
    '如果当时': [
      "如果能重来，我要选李白~",
      "打开如果当时，重温那段时光",
      "如果当时，我们没有走散..."
    ],
    default: [
      "探索千禧世界的每一个角落",
      "那个简单又美好的年代",
      "怀念2005，怀念我们的青春"
    ]
  },

  exchange: {
    '网费兑换': [
      "充值网费，继续我的网聊生涯",
      "为了和TA聊天，值得！",
      "这周零花钱都充网费了..."
    ]
  },

  view: {
    '扣费记录': [
      "看看钱都花哪了",
      "账单总是来得太快"
    ],
    '系统信息': [
      "我的配置可是当时最顶的！",
      "Windows 98，永恒的经典"
    ],
    '助手设置': [
      "和小狮子聊聊天",
      "小狮子今天心情怎么样呢"
    ],
    '关于': [
      "了解一下这个小程序",
      "致敬我们的青春"
    ],
    default: [
      "查看详情",
      "了解一下"
    ]
  },

  action: {
    '刷新桌面': [
      "刷新一下，看看有没有新变化",
      "强迫症犯了，必须刷新一下"
    ]
  },

  edit: {
    '用户信息': [
      "换个新昵称，重新开始",
      "签名也要换新的",
      "今天也是元气满满的一天"
    ]
  },

  game: {
    default: [
      "游戏时间！放松一下",
      "来一局游戏消磨时间",
      "那个年代的游戏，简单却快乐",
      "通关！今天的我太厉害了",
      "输了再来，我是不服输的",
      "高分！一定要截屏炫耀"
    ]
  },

  egg: {
    default: [
      "发现彩蛋！运气爆棚！",
      "隐藏的秘密被我发现啦~",
      "又解锁了一个彩蛋，离100%又近了一步",
      "这个彩蛋藏得好深啊",
      "收集癖表示很满足"
    ]
  }
};

/**
 * 获取随机话语
 * @param {string} action - 操作类型
 * @param {string} target - 操作目标
 * @returns {string} 随机话语
 */
function getRandomMessage(action, target) {
  const actionMessages = LOG_MESSAGES[action];
  if (!actionMessages) return '';

  const targetMessages = actionMessages[target] || actionMessages.default;
  if (!targetMessages) return '';

  const messages = Array.isArray(targetMessages) ? targetMessages : [targetMessages];
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * 添加操作日志（带随机话语）
 * @param {string} action - 操作类型
 * @param {string} target - 操作目标
 * @param {string} details - 详细信息（可选）
 */
function addLog(action, target, details = '') {
  const randomMessage = getRandomMessage(action, target);

  // 组合日志内容
  let logContent = details || '';
  if (randomMessage) {
    logContent = details ? `${details}\n${randomMessage}` : randomMessage;
  }

  wx.cloud.callFunction({
    name: 'user',
    data: {
      type: 'addLog',
      action: action,
      target: target,
      details: logContent
    }
  }).catch(err => {
    console.error('添加日志失败:', err);
  });
}

module.exports = {
  addLog,
  getRandomMessage
};
