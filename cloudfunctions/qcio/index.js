// cloudfunctions/qcio/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

// 引入模块
const { getRandomAvatar, getRandomTime, getRandomLastMsg, formatRelativeTime, shuffleArray } = require('./modules/utils');
const { getWallet, addTransaction } = require('./modules/wallet');
const { dailyCheckin, getDailyTasks } = require('./modules/dailyTasks');
const { redeemVipCode } = require('./modules/vip');
const { getAchievements, checkAchievements } = require('./modules/achievements');
const { saveMoodLog, getMoodLogs, deleteMoodLog, getMoodLogStatus } = require('./modules/moodLog');
const { getGuestbook, deleteGuestbookMessage } = require('./modules/guestbook');
const {
  getLevelInfo,
  addExperience,
  syncOnlineTime,
  claimDailyReward,
  LEVEL_REWARDS
} = require('./modules/level');

/**
 * QCIO 核心业务云函数
 * 处理账号初始化、登录状态同步、个人资料修改、空间日志、访问记录
 */
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();

  switch (event.action) {
    case 'init':
      // 初始化或获取账号信息（包含在线状态）
      return await initAccount(OPENID);

    case 'register':
      // 注册新用户
      return await registerUser(OPENID, event.qcio_id, event.nickname, event.avatar);

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
      return await saveMoodLog(OPENID, event.data, db, _);

    case 'getMoodLogs':
      // 获取心情日志列表
      return await getMoodLogs(OPENID, db);

    case 'deleteMoodLog':
      // 删除心情日志
      return await deleteMoodLog(OPENID, event.logId, db);

    case 'getMoodLogStatus':
      // 获取日志发布状态
      return await getMoodLogStatus(OPENID, db);

    case 'getGuestbook':
      // 获取留言列表
      return await getGuestbook(OPENID, db);

    case 'deleteGuestbookMessage':
      // 删除留言
      return await deleteGuestbookMessage(OPENID, event.messageId, db);

    case 'recordVisit':
      // 记录访问（踩一踩）
      return await recordVisit(OPENID, event.visitorId, event.visitorName, event.visitorAvatar, event.ownerQcioId);

    case 'getVisitStats':
      // 获取访问统计
      return await getVisitStats(OPENID);

    case 'getUserByQcioId':
      // 通过 qcio_id 获取用户信息（访问页面用）
      return await getUserByQcioId(event.qcioId, db);

    case 'getVisitStatsByQcioId':
      // 通过 qcio_id 获取访问统计（访问页面用）
      return await getVisitStatsByQcioId(event.qcioId, db);

    case 'getGuestbookByQcioId':
      // 通过 qcio_id 获取留言（访问页面用）
      return await getGuestbookByQcioId(event.qcioId, db);

    case 'getRecentVisitorsByQcioId':
      // 通过 qcio_id 获取最近访客（访问页面用）
      return await getRecentVisitorsByQcioId(event.qcioId, db);

    case 'checkIfSteppedToday':
      // 检查今天是否已经踩过
      return await checkIfSteppedToday(OPENID, event.ownerQcioId, db);

    case 'saveChatHistory':
      // 保存聊天历史
      return await saveChatHistory(OPENID, event.data);

    case 'getChatHistory':
      // 获取聊天历史
      return await getChatHistory(OPENID, event.contactName);

    case 'getAIContacts':
      // 获取 AI 好友列表（使用用户分配的网友）
      return await getMyAIContacts(OPENID);

    case 'getGroupList':
      // 获取群聊列表
      return await getGroupList();

    case 'saveGroupChatHistory':
      // 保存群聊历史
      return await saveGroupChatHistory(OPENID, event.data);

    case 'getGroupChatHistory':
      // 获取群聊历史
      return await getGroupChatHistory(OPENID, event.groupName);

    case 'getWallet':
      return await getWallet(OPENID, db);

    case 'addTransaction':
      return await addTransaction(OPENID, event.data, db, _);

    case 'dailyCheckin':
      return await dailyCheckin(OPENID, db, _);

    case 'getDailyTasks':
      return await getDailyTasks(OPENID, db);

    case 'redeemVipCode':
      return await redeemVipCode(OPENID, event.code, db, _);

    case 'getAchievements':
      return await getAchievements(OPENID, db);

    case 'checkAchievements':
      return await checkAchievements(OPENID, db, _);

    case 'addQpoints':
      // 添加Q点（奖励）
      return await addQpoints(OPENID, event.amount, event.reason, event.openid, db, _);

    case 'getLevelInfo':
      // 获取等级信息
      return await getLevelInfo(OPENID, db);

    case 'addExperience':
      // 增加经验
      return await addExperience(OPENID, event.source, event.amount, db, _);

    case 'syncOnlineTime':
      // 同步在线时长并结算经验
      return await syncOnlineTime(OPENID, event.minutes, db);

    case 'claimDailyReward':
      // 领取每日等级奖励
      return await claimDailyReward(OPENID, db, _);

    default:
      return { success: false, message: '未知的操作类型' };
  }
};

/**
 * 获取账号信息（不自动创建）
 */
async function initAccount(openid) {
  try {
    const qcioCollection = db.collection('qcio_users');

    // 检查数据库记录
    const userRes = await qcioCollection.where({
      _openid: openid
    }).limit(1).get();

    if (userRes.data.length > 0) {
      const user = userRes.data[0];

      // 检查是否需要迁移等级字段（针对老用户）
      if (user.experience === undefined || user.level_icon === undefined) {
        try {
          const { getLevelIcon, getLevelTitle } = require('./modules/level');
          const level = user.level || 1;

          await qcioCollection.where({ _openid: openid }).update({
            data: {
              experience: user.experience || 0,
              total_experience: user.total_experience || 0,
              level_icon: user.level_icon || getLevelIcon(level),
              level_title: user.level_title || getLevelTitle(level)
            }
          });

          // 返回更新后的用户数据
          user.experience = user.experience || 0;
          user.total_experience = user.total_experience || 0;
          user.level_icon = user.level_icon || getLevelIcon(level);
          user.level_title = user.level_title || getLevelTitle(level);
        } catch (err) {
          console.error('Migrate level fields error:', err);
          // 迁移失败不影响主流程
        }
      }

      return {
        success: true,
        data: user,
        message: '获取账号成功'
      };
    }

    // 未注册，返回空数据
    return {
      success: true,
      data: {
        qcio_id: '',
        nickname: '',
        avatar: '👤',
        signature: '',
        level: 1,
        isOnline: false
      },
      needsRegister: true,
      message: '需要注册'
    };

  } catch (err) {
    console.error('initAccount Error:', err);
    return { success: false, error: err, message: '系统初始化失败' };
  }
}

/**
 * 注册新用户
 */
async function registerUser(openid, qcio_id, nickname, avatar) {
  try {
    const qcioCollection = db.collection('qcio_users');

    // 检查是否已注册
    const existingRes = await qcioCollection.where({ _openid: openid }).limit(1).get();
    if (existingRes.data.length > 0) {
      return {
        success: false,
        message: '账号已注册'
      };
    }

    // 验证 qcio_id 是否唯一
    const idCheckRes = await qcioCollection.where({ qcio_id }).limit(1).get();
    if (idCheckRes.data.length > 0) {
      return {
        success: false,
        message: 'QCIO 号码已存在'
      };
    }

    // 随机分配 12 个 AI 网友
    let myContacts = [];
    try {
      const contactsRes = await db.collection('qcio_ai_contacts')
        .where({ isEnabled: true })
        .field({ _id: true })
        .get();

      if (contactsRes.data.length > 0) {
        // 随机选择12个网友
        const shuffled = shuffleArray(contactsRes.data);
        myContacts = shuffled.slice(0, Math.min(12, shuffled.length)).map(c => c._id);
      }
    } catch (err) {
      console.error('Get AI contacts error:', err);
      // 获取失败不影响注册，只是没有分配网友
    }

    // 创建新用户
    const newUser = {
      _openid: openid,
      qcio_id: qcio_id,
      password: '123456',
      nickname: nickname,
      signature: '',
      avatar: avatar,
      // 等级系统字段
      level: 1,
      experience: 0,
      total_experience: 0,
      level_icon: '1★',
      level_title: '初入江湖',
      // 其他字段
      isOnline: false,
      myContacts: myContacts, // 用户的好友列表（AI网友ID数组）
      createTime: db.serverDate(),
      lastLoginTime: db.serverDate(),
      totalVisits: 0,
      todayVisits: 0
    };

    await qcioCollection.add({ data: newUser });

    return {
      success: true,
      data: newUser,
      message: '注册成功'
    };

  } catch (err) {
    console.error('registerUser Error:', err);
    return { success: false, error: err, message: '注册失败' };
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
 * 记录访问（踩一踩）
 * 同时自动在留言板添加一条留言
 * @param {String} ownerOpenid - 被访问用户的openid（可选，如果提供ownerQcioId则不需要）
 * @param {String} visitorId - 访客的qcio_id
 * @param {String} visitorName - 访客昵称
 * @param {String} visitorAvatar - 访客头像（可选）
 * @param {String} ownerQcioId - 被访问用户的qcio_id（可选，用于通过qcioId查找openid）
 */
async function recordVisit(ownerOpenid, visitorId, visitorName, visitorAvatar, ownerQcioId) {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 如果提供了 qcioId，先通过 qcio_id 查找 openid
    if (ownerQcioId && !ownerOpenid) {
      const qcioIdRes = await db.collection('qcio_users').where({ qcio_id: ownerQcioId }).get();
      if (qcioIdRes.data.length > 0) {
        ownerOpenid = qcioIdRes.data[0]._openid;
      } else {
        return { success: false, message: '用户不存在' };
      }
    }

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
      avatar: visitorAvatar || getRandomAvatar(),
      visitTime: db.serverDate(),
      timeStr: '刚刚'
    };

    // 获取当前访客列表，添加新记录并保持最多10条
    const visitorRes = await db.collection('qcio_users').where({ _openid: ownerOpenid }).get();
    const currentVisitors = visitorRes.data[0].recentVisitors || [];
    const updatedVisitors = [visitRecord, ...currentVisitors].slice(0, 10);

    await db.collection('qcio_users').where({ _openid: ownerOpenid }).update({
      data: {
        recentVisitors: updatedVisitors
      }
    });

    // 自动生成一条踩踩留言
    const autoMessages = [
      '路过，踩踩~',
      '来串个门，支持下！',
      '悄悄路过，留个脚印~',
      '路过来看看，不错哦~',
      '踩踩踩，友谊长存！',
      '飘过~',
      '来啦来啦，踩一踩~',
      '路过，回踩哦！'
    ];
    const randomMessage = autoMessages[Math.floor(Math.random() * autoMessages.length)];

    // 注意：云数据库会自动注入当前用户(访客)的openid到_openid
    // 所以我们使用ownerQcioId来标记这条留言属于哪个用户的留言板
    await db.collection('qcio_guestbook').add({
      data: {
        ownerQcioId: ownerQcioId,  // 留言板主人的qcio_id
        visitorId: visitorId,
        visitorName: visitorName || '神秘访客',
        avatar: visitRecord.avatar,
        content: randomMessage,
        createTime: db.serverDate()
      }
    });

    // 记录到访客的踩脚历史（用于检查今天是否已经踩过）
    try {
      // 通过 visitorId 查找访客的 openid
      const visitorRes = await db.collection('qcio_users').where({ qcio_id: visitorId }).get();
      if (visitorRes.data.length > 0) {
        const visitorOpenid = visitorRes.data[0]._openid;
        const todayStr = todayStart.toISOString().split('T')[0];

        // 更新或创建访客的 daily_tasks 记录
        const taskRes = await db.collection('qcio_daily_tasks')
          .where({
            _openid: visitorOpenid,
            date: todayStr
          })
          .get();

        const stepRecord = {
          ownerQcioId: ownerQcioId,
          stepTime: db.serverDate()
        };

        if (taskRes.data.length > 0) {
          // 更新现有记录
          const existingSteps = taskRes.data[0].stepRecords || [];
          const updatedSteps = [stepRecord, ...existingSteps].slice(0, 50);
          await db.collection('qcio_daily_tasks')
            .doc(taskRes.data[0]._id)
            .update({
              data: {
                stepRecords: updatedSteps
              }
            });
        } else {
          // 创建新记录
          await db.collection('qcio_daily_tasks').add({
            data: {
              _openid: visitorOpenid,
              date: todayStr,
              stepRecords: [stepRecord],
              createTime: db.serverDate(),
              updateTime: db.serverDate()
            }
          });
        }
      }
    } catch (stepErr) {
      // 记录踩脚历史失败不影响主流程
      console.error('Record step history error:', stepErr);
    }

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
 * 通过 qcio_id 获取用户信息（访问页面用）
 */
async function getUserByQcioId(qcioId, db) {
  try {
    const res = await db.collection('qcio_users').where({ qcio_id: qcioId }).get();

    if (res.data.length === 0) {
      return { success: false, message: '用户不存在' };
    }

    const user = res.data[0];

    return {
      success: true,
      data: {
        qcio_id: user.qcio_id,
        nickname: user.nickname,
        avatar: user.avatar,
        signature: user.signature,
        level: user.level || 1
      }
    };
  } catch (err) {
    console.error('getUserByQcioId Error:', err);
    return { success: false, error: err, message: '获取用户信息失败' };
  }
}

/**
 * 通过 qcio_id 获取访问统计（访问页面用）
 */
async function getVisitStatsByQcioId(qcioId, db) {
  try {
    const res = await db.collection('qcio_users').where({ qcio_id: qcioId }).get();

    if (res.data.length === 0) {
      return { success: true, data: { totalVisits: 0, todayVisits: 0, recentVisitors: [] } };
    }

    const user = res.data[0];

    return {
      success: true,
      data: {
        totalVisits: user.totalVisits || 0,
        todayVisits: user.todayVisits || 0
      }
    };
  } catch (err) {
    console.error('getVisitStatsByQcioId Error:', err);
    return { success: false, error: err };
  }
}

/**
 * 通过 qcio_id 获取留言（访问页面用）
 */
async function getGuestbookByQcioId(qcioId, db) {
  try {
    // 直接通过 ownerQcioId 获取留言
    const res = await db.collection('qcio_guestbook')
      .where({ ownerQcioId: qcioId })
      .orderBy('createTime', 'desc')
      .limit(50)
      .get();

    // 格式化时间
    const messages = res.data.map(msg => ({
      id: msg._id,
      visitorId: msg.visitorId,
      nickname: msg.visitorName,
      avatar: msg.avatar,
      content: msg.content,
      time: formatRelativeTime(msg.createTime)
    }));

    return {
      success: true,
      data: messages
    };
  } catch (err) {
    console.error('getGuestbookByQcioId Error:', err);
    return { success: false, error: err };
  }
}

/**
 * 通过 qcio_id 获取最近访客（访问页面用）
 */
async function getRecentVisitorsByQcioId(qcioId, db) {
  try {
    const res = await db.collection('qcio_users').where({ qcio_id: qcioId }).get();

    if (res.data.length === 0) {
      return { success: true, data: [] };
    }

    const user = res.data[0];

    const visitors = (user.recentVisitors || []).map(v => ({
      _id: v.visitorId,
      avatar: v.avatar,
      nickname: v.visitorName
    }));

    return {
      success: true,
      data: visitors
    };
  } catch (err) {
    console.error('getRecentVisitorsByQcioId Error:', err);
    return { success: false, error: err };
  }
}

/**
 * 检查今天是否已经踩过
 */
async function checkIfSteppedToday(visitorOpenid, ownerQcioId, db) {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 检查访客的 daily_tasks 记录
    const taskRes = await db.collection('qcio_daily_tasks')
      .where({
        _openid: visitorOpenid,
        date: todayStart.toISOString().split('T')[0]
      })
      .get();

    if (taskRes.data.length === 0) {
      return { success: true, data: { hasStepped: false } };
    }

    const task = taskRes.data[0];

    // 检查是否已经有踩记录（通过 stepRecords 字段）
    const stepRecords = task.stepRecords || [];
    const hasStepped = stepRecords.some(record => record.ownerQcioId === ownerQcioId);

    return {
      success: true,
      data: { hasStepped: hasStepped }
    };
  } catch (err) {
    console.error('checkIfSteppedToday Error:', err);
    return { success: false, error: err };
  }
}

/**
 * 保存聊天历史
 */
async function saveChatHistory(openid, data) {
  try {
    const { contactName, messages } = data;

    // 先查询是否已有记录
    const existingRes = await db.collection('qcio_chat_history')
      .where({
        _openid: openid,
        contact_name: contactName
      })
      .get();

    if (existingRes.data.length > 0) {
      // 记录存在，更新
      await db.collection('qcio_chat_history')
        .doc(existingRes.data[0]._id)
        .update({
          data: {
            messages: messages,
            updateTime: db.serverDate()
          }
        });
    } else {
      // 记录不存在，创建新记录
      await db.collection('qcio_chat_history').add({
        data: {
          _openid: openid,
          contact_name: contactName,
          messages: messages,
          updateTime: db.serverDate()
        }
      });
    }

    return { success: true };
  } catch (err) {
    console.error('saveChatHistory Error:', err);
    return { success: false, error: err };
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

/**
 * 获取用户的 AI 好友列表
 * 先获取用户分配的网友ID，再返回这些网友的详细信息
 * 如果用户没有 myContacts，自动随机分配12个网友
 */
async function getMyAIContacts(openid) {
  try {
    // 获取用户信息
    const userRes = await db.collection('qcio_users')
      .where({ _openid: openid })
      .field({ myContacts: true })
      .limit(1)
      .get();

    let myContacts = null;
    let needUpdate = false;

    if (userRes.data.length > 0) {
      const user = userRes.data[0];
      // 检查是否有 myContacts 字段且不为空
      if (user.myContacts && user.myContacts.length > 0) {
        myContacts = user.myContacts;
      } else {
        // 用户没有 myContacts 或为空，需要分配
        needUpdate = true;
      }
    }

    // 如果需要分配网友
    if (needUpdate || !myContacts) {
      console.log('User has no contacts, assigning random contacts...');
      // 获取所有可用的网友
      const contactsRes = await db.collection('qcio_ai_contacts')
        .where({ isEnabled: true })
        .field({ _id: true })
        .get();

      if (contactsRes.data.length > 0) {
        // 随机选择12个
        const shuffled = shuffleArray(contactsRes.data);
        myContacts = shuffled.slice(0, Math.min(12, shuffled.length)).map(c => c._id);

        // 更新用户记录
        if (userRes.data.length > 0) {
          await db.collection('qcio_users')
            .doc(userRes.data[0]._id)
            .update({
              data: { myContacts: myContacts }
            });
        }
      }
    }

    console.log('User contacts count:', myContacts ? myContacts.length : 0);

    // 调用 getAIContacts，传入用户的好友ID列表
    return await getAIContacts(myContacts);
  } catch (err) {
    console.error('getMyAIContacts Error:', err);
    return { success: false, error: err, message: '获取好友列表失败' };
  }
}

/**
 * 获取 AI 好友列表
 * @param {Array} myContacts - 用户的好友ID列表（可选），如果不传则返回所有好友
 */
async function getAIContacts(myContacts = null) {
  try {
    let query = db.collection('qcio_ai_contacts').where({ isEnabled: true });

    // 如果提供了用户的好友ID列表，只获取这些好友
    if (myContacts && myContacts.length > 0) {
      query = query.where({
        _id: db.command.in(myContacts)
      });
    }

    const res = await query
      .orderBy('groupOrder', 'asc')
      .orderBy('contactOrder', 'asc')
      .get();

    // 按分组整理数据
    const groupsMap = {};
    res.data.forEach(contact => {
      const groupName = contact.groupName || '陌生人';
      if (!groupsMap[groupName]) {
        groupsMap[groupName] = {
          name: groupName,
          expanded: groupName === '葬爱家族', // 默认展开葬爱家族
          onlineCount: 0,
          contacts: []
        };
      }

      groupsMap[groupName].contacts.push({
        id: contact._id,
        name: contact.name,
        avatar: contact.avatar || '👤',
        online: contact.online !== false,
        status: contact.status || '',
        chatMode: contact.chatMode || contact.mode || 'chat',
        welcomeMessage: contact.welcomeMessage || '',
        systemPrompt: contact.systemPrompt || ''
      });

      if (contact.online !== false) {
        groupsMap[groupName].onlineCount++;
      }
    });

    // 转换为数组格式
    const contactGroups = Object.values(groupsMap);
    // 按分组排序
    contactGroups.sort((a, b) => {
      // 葬爱家族排第一
      if (a.name === '葬爱家族') return -1;
      if (b.name === '葬爱家族') return 1;
      return 0;
    });

    return { success: true, data: contactGroups };
  } catch (err) {
    console.error('getAIContacts Error:', err);
    return { success: false, error: err, message: '获取好友列表失败' };
  }
}

/**
 * 获取群聊列表
 */
async function getGroupList() {
  try {
    const res = await db.collection('qcio_groups')
      .where({ isEnabled: true })
      .orderBy('groupOrder', 'asc')
      .get();

    // 添加随机时间、最后消息和未读数
    const list = res.data.map(group => ({
      id: group._id,
      name: group.name,
      avatar: group.avatar || '👥',
      members: group.members || [],
      memberCount: group.memberCount || 0,
      mode: group.mode || 'chat',
      time: getRandomTime(),
      lastMsg: getRandomLastMsg(group.members),
      unread: Math.floor(Math.random() * 100), // 随机未读数
      unreadCount: Math.floor(Math.random() * 100)
    }));

    return { success: true, data: list };
  } catch (err) {
    console.error('getGroupList Error:', err);
    return { success: false, error: err, message: '获取群聊列表失败' };
  }
}

/**
 * 保存群聊历史
 */
async function saveGroupChatHistory(openid, data) {
  try {
    const { groupName, messages } = data;

    // 先查询是否已有记录
    const existingRes = await db.collection('qcio_group_chat_history')
      .where({
        _openid: openid,
        group_name: groupName
      })
      .get();

    if (existingRes.data.length > 0) {
      // 记录存在，更新
      await db.collection('qcio_group_chat_history')
        .doc(existingRes.data[0]._id)
        .update({
          data: {
            messages: messages,
            updateTime: db.serverDate()
          }
        });
    } else {
      // 记录不存在，创建新记录
      await db.collection('qcio_group_chat_history').add({
        data: {
          _openid: openid,
          group_name: groupName,
          messages: messages,
          updateTime: db.serverDate()
        }
      });
    }

    return { success: true };
  } catch (err) {
    console.error('saveGroupChatHistory Error:', err);
    return { success: false, error: err };
  }
}

/**
 * 获取群聊历史
 */
async function getGroupChatHistory(openid, groupName) {
  try {
    const res = await db.collection('qcio_group_chat_history')
      .where({
        _openid: openid,
        group_name: groupName
      })
      .get();

    if (res.data.length > 0) {
      return { success: true, data: res.data[0].messages || [] };
    }

    return { success: true, data: [] };
  } catch (err) {
    console.error('getGroupChatHistory Error:', err);
    return { success: false, error: err };
  }
}

/**
 * 添加Q点（奖励）
 * @param {string} callerOpenid - 调用者openid（通常是当前用户）
 * @param {number} amount - Q点数量
 * @param {string} reason - 原因
 * @param {string} targetOpenid - 目标用户openid（可选，用于奖励其他用户）
 */
async function addQpoints(callerOpenid, amount, reason, targetOpenid = null, db, _) {
  try {
    const openid = targetOpenid || callerOpenid;

    // 获取当前钱包
    const walletRes = await db.collection('qcio_wallet')
      .where({ _openid: openid })
      .get();

    if (walletRes.data.length === 0) {
      // 钱包不存在，创建新钱包
      await db.collection('qcio_wallet').add({
        data: {
          _openid: openid,
          coins: 0,
          qpoints: amount,
          updateTime: db.serverDate()
        }
      });
    } else {
      // 更新现有钱包
      await db.collection('qcio_wallet')
        .doc(walletRes.data[0]._id)
        .update({
          data: {
            qpoints: _.inc(amount),
            updateTime: db.serverDate()
          }
        });
    }

    // 记录交易
    await addTransaction(openid, {
      type: 'qpoints_in',
      amount: amount,
      balance: (walletRes.data[0]?.qpoints || 0) + amount,
      description: reason || 'Q点奖励'
    }, db, _);

    return { success: true, amount };
  } catch (err) {
    console.error('addQpoints Error:', err);
    return { success: false, error: err };
  }
}