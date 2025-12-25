/**
 * QCIO 通用工具函数模块
 */

/**
 * 获取心情图标
 */
function getMoodIcon(moodType) {
  const icons = {
    'sad': '💔',
    'passionate': '🔥',
    'sweet': '💕',
    'confused': '🌫️'
  };
  return icons[moodType] || '📝';
}

/**
 * 获取随机头像
 */
function getRandomAvatar() {
  const avatars = ['👤', '🎸', '💃', '🎮', '🦊', '🐱', '🐶', '🌟'];
  return avatars[Math.floor(Math.random() * avatars.length)];
}

/**
 * 生成随机时间（模拟最近消息时间）
 */
function getRandomTime() {
  const times = ['刚刚', '5分钟前', '15:30', '12:20', '昨天', '周一'];
  return times[Math.floor(Math.random() * times.length)];
}

/**
 * 生成随机最后消息
 */
function getRandomLastMsg(members) {
  if (!members || members.length === 0) {
    return '暂无消息';
  }
  const randomMember = members[Math.floor(Math.random() * members.length)];
  const messages = [
    '大家好~',
    '在吗？',
    '有人在吗？',
    '来聊聊吧~',
    '今天天气不错',
    '踩踩空间~'
  ];
  const randomMsg = messages[Math.floor(Math.random() * messages.length)];
  return `[${randomMember.name}]: ${randomMsg}`;
}

/**
 * 格式化时间
 */
function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hour = d.getHours().toString().padStart(2, '0');
  const minute = d.getMinutes().toString().padStart(2, '0');
  return `${month}-${day} ${hour}:${minute}`;
}

/**
 * 格式化相对时间
 */
function formatRelativeTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return formatTime(date);
}

/**
 * 随机打乱数组（Fisher-Yates 洗牌算法）
 */
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

module.exports = {
  getMoodIcon,
  getRandomAvatar,
  getRandomTime,
  getRandomLastMsg,
  formatTime,
  formatRelativeTime,
  shuffleArray
};
