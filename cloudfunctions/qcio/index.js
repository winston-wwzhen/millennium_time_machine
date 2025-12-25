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
      return {
        success: true,
        data: userRes.data[0],
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

    // 随机分配 20 个 AI 网友
    let myContacts = [];
    try {
      const contactsRes = await db.collection('qcio_ai_contacts')
        .where({ isEnabled: true })
        .field({ _id: true })
        .get();

      if (contactsRes.data.length > 0) {
        // 随机选择20个网友
        const shuffled = shuffleArray(contactsRes.data);
        myContacts = shuffled.slice(0, Math.min(20, shuffled.length)).map(c => c._id);
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
      level: 1,
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

    await db.collection('qcio_guestbook').add({
      data: {
        _openid: ownerOpenid,
        visitorId: visitorId,
        visitorName: visitorName || '神秘访客',
        avatar: visitRecord.avatar,
        content: randomMessage,
        createTime: db.serverDate()
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
 * 如果用户没有 myContacts，自动随机分配20个网友
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
        // 随机选择20个
        const shuffled = shuffleArray(contactsRes.data);
        myContacts = shuffled.slice(0, Math.min(20, shuffled.length)).map(c => c._id);

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