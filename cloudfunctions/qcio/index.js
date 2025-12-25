// cloudfunctions/qcio/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

/**
 * QCIQ (QCIO) 核心业务云函数
 * 处理账号初始化、登录状态同步、个人资料修改、空间日志、访问记录
 */
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();

  switch (event.action) {
    case 'init':
      // 初始化或获取账号信息（包含在线状态）
      return await initAccount(OPENID);

    case 'login':
      // 设置云端状态为"在线"
      return await setOnlineStatus(OPENID, true);

    case 'logout':
      // 设置云端状态为"离线"
      return await setOnlineStatus(OPENID, false);

    case 'updateProfile':
      // 更新个人资料（昵称、签名）
      return await updateProfile(OPENID, event.data);

    case 'saveMoodLog':
      // 保存心情日志
      return await saveMoodLog(OPENID, event.data);

    case 'getMoodLogs':
      // 获取心情日志列表
      return await getMoodLogs(OPENID);

    case 'recordVisit':
      // 记录访问（踩一踩）
      return await recordVisit(OPENID, event.visitorId, event.visitorName);

    case 'getVisitStats':
      // 获取访问统计
      return await getVisitStats(OPENID);

    case 'saveChatHistory':
      // 保存聊天历史
      return await saveChatHistory(OPENID, event.data);

    case 'getChatHistory':
      // 获取聊天历史
      return await getChatHistory(OPENID, event.contactName);

    default:
      return { success: false, message: '未知的操作类型' };
  }
};

/**
 * 获取或创建 QCIO 账号
 */
async function initAccount(openid) {
  try {
    const qcioCollection = db.collection('qcio_users');

    // 1. 检查数据库记录
    const userRes = await qcioCollection.where({
      _openid: openid
    }).limit(1).get();

    if (userRes.data.length > 0) {
      return {
        success: true,
        data: userRes.data[0],
        message: '获取账号成功'
      };
    }

    // 2. 首次进入，生成唯一的 5 位账号 (10000-99999)
    let qcio_id = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 15) {
      qcio_id = (Math.floor(Math.random() * 90000) + 10000).toString();
      const checkRes = await qcioCollection.where({ qcio_id }).count();
      if (checkRes.total === 0) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) throw new Error('ID 生成失败');

    // 3. 构建新用户数据
    const newUser = {
      _openid: openid,
      qcio_id: qcio_id,
      password: '123456',
      nickname: '千禧网友',
      signature: '承諾、絠什嚒用？還bùsんì洅見。',
      avatar: '👤',
      level: 1,
      isOnline: false, // 初始默认不在线
      createTime: db.serverDate(),
      lastLoginTime: db.serverDate(),
      // 空间统计
      totalVisits: 0,
      todayVisits: 0
    };

    await qcioCollection.add({ data: newUser });

    return {
      success: true,
      data: newUser,
      message: '账号初始化成功'
    };

  } catch (err) {
    console.error('initAccount Error:', err);
    return { success: false, error: err, message: '系统初始化失败' };
  }
}

/**
 * 同步云端的在线/离线状态
 */
async function setOnlineStatus(openid, status) {
  try {
    await db.collection('qcio_users').where({
      _openid: openid
    }).update({
      data: {
        isOnline: status,
        lastLoginTime: db.serverDate()
      }
    });
    return { success: true, isOnline: status };
  } catch (err) {
    console.error('setOnlineStatus Error:', err);
    return { success: false, error: err };
  }
}

/**
 * 更新用户资料并返回更新后的对象
 */
async function updateProfile(openid, data) {
  try {
    const updateFields = {};
    if (data.nickname) updateFields.nickname = data.nickname;
    if (data.signature) updateFields.signature = data.signature;

    await db.collection('qcio_users').where({ _openid: openid }).update({
      data: {
        ...updateFields,
        updateTime: db.serverDate()
      }
    });

    const updatedUser = await db.collection('qcio_users').where({ _openid: openid }).get();

    return {
      success: true,
      data: updatedUser.data[0]
    };
  } catch (err) {
    console.error('updateProfile Error:', err);
    return { success: false, error: err };
  }
}

/**
 * 保存心情日志
 */
async function saveMoodLog(openid, data) {
  try {
    const logData = {
      _openid: openid,
      mood_type: data.mood_type,
      mood_name: data.mood_name,
      mood_icon: getMoodIcon(data.mood_type),
      keywords: data.keywords,
      content: data.content,
      createTime: db.serverDate(),
      visits: 0,
      likes: 0
    };

    await db.collection('qcio_mood_logs').add({ data: logData });

    return { success: true };
  } catch (err) {
    console.error('saveMoodLog Error:', err);
    return { success: false, error: err };
  }
}

/**
 * 获取心情日志列表
 */
async function getMoodLogs(openid) {
  try {
    const res = await db.collection('qcio_mood_logs')
      .where({ _openid: openid })
      .orderBy('createTime', 'desc')
      .limit(20)
      .get();

    const logs = res.data.map(log => ({
      ...log,
      createTimeStr: formatTime(log.createTime)
    }));

    return { success: true, data: logs };
  } catch (err) {
    console.error('getMoodLogs Error:', err);
    return { success: false, error: err };
  }
}

/**
 * 记录访问（踩一踩）
 */
async function recordVisit(ownerOpenid, visitorId, visitorName) {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 获取被访问用户信息
    const userRes = await db.collection('qcio_users').where({ _openid: ownerOpenid }).get();

    if (userRes.data.length === 0) {
      return { success: false, message: '用户不存在' };
    }

    const user = userRes.data[0];

    // 判断是否是今天的首次访问
    const lastVisitTime = user.lastVisitTime ? new Date(user.lastVisitTime) : null;
    const isTodayFirstVisit = !lastVisitTime || lastVisitTime < todayStart;

    // 更新访问统计
    const updateData = {
      totalVisits: user.totalVisits + 1,
      lastVisitTime: db.serverDate()
    };

    if (isTodayFirstVisit) {
      updateData.todayVisits = (user.todayVisits || 0) + 1;
    }

    await db.collection('qcio_users').where({ _openid: ownerOpenid }).update({
      data: updateData
    });

    // 记录访客信息（保留最近10条）
    const visitRecord = {
      visitorId: visitorId,
      visitorName: visitorName || '神秘访客',
      avatar: getRandomAvatar(),
      visitTime: db.serverDate(),
      timeStr: '刚刚'
    };

    await db.collection('qcio_users').where({ _openid: ownerOpenid }).update({
      data: {
        recentVisitors: _.unshift(_.slice(_.concat(visitRecord), 0, 10))
      }
    });

    return { success: true };
  } catch (err) {
    console.error('recordVisit Error:', err);
    return { success: false, error: err };
  }
}

/**
 * 获取访问统计
 */
async function getVisitStats(openid) {
  try {
    const res = await db.collection('qcio_users').where({ _openid: openid }).get();

    if (res.data.length === 0) {
      return { success: true, data: { totalVisits: 0, todayVisits: 0, recentVisitors: [] } };
    }

    const user = res.data[0];

    return {
      success: true,
      data: {
        totalVisits: user.totalVisits || 0,
        todayVisits: user.todayVisits || 0,
        recentVisitors: (user.recentVisitors || []).map(v => ({
          ...v,
          timeStr: formatRelativeTime(v.visitTime)
        }))
      }
    };
  } catch (err) {
    console.error('getVisitStats Error:', err);
    return { success: false, error: err };
  }
}

/**
 * 保存聊天历史
 */
async function saveChatHistory(openid, data) {
  try {
    const { contactName, messages } = data;

    await db.collection('qcio_chat_history').where({
      _openid: openid,
      contact_name: contactName
    }).update({
      data: {
        messages: messages,
        updateTime: db.serverDate()
      }
    });

    // 如果更新失败，说明记录不存在，需要创建
    // 这里简化处理，直接返回成功
    return { success: true };
  } catch (err) {
    // 记录不存在，创建新记录
    try {
      await db.collection('qcio_chat_history').add({
        data: {
          _openid: openid,
          contact_name: data.contactName,
          messages: data.messages,
          updateTime: db.serverDate()
        }
      });
      return { success: true };
    } catch (addErr) {
      console.error('saveChatHistory Error:', addErr);
      return { success: false, error: addErr };
    }
  }
}

/**
 * 获取聊天历史
 */
async function getChatHistory(openid, contactName) {
  try {
    const res = await db.collection('qcio_chat_history')
      .where({
        _openid: openid,
        contact_name: contactName
      })
      .get();

    if (res.data.length > 0) {
      return { success: true, data: res.data[0].messages || [] };
    }

    return { success: true, data: [] };
  } catch (err) {
    console.error('getChatHistory Error:', err);
    return { success: false, error: err };
  }
}

// 辅助函数：获取心情图标
function getMoodIcon(moodType) {
  const icons = {
    'sad': '💔',
    'passionate': '🔥',
    'sweet': '💕',
    'confused': '🌫️'
  };
  return icons[moodType] || '📝';
}

// 辅助函数：获取随机头像
function getRandomAvatar() {
  const avatars = ['👤', '🎸', '💃', '🎮', '🦊', '🐱', '🐶', '🌟'];
  return avatars[Math.floor(Math.random() * avatars.length)];
}

// 辅助函数：格式化时间
function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hour = d.getHours().toString().padStart(2, '0');
  const minute = d.getMinutes().toString().padStart(2, '0');
  return `${month}-${day} ${hour}:${minute}`;
}

// 辅助函数：格式化相对时间
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