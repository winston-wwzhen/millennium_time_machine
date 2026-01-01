/**
 * 管理后台专用云函数
 * 提供完整的管理后台数据查询和操作接口
 */
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

/**
 * 云函数入口
 */
exports.main = async function(event, context) {
  const action = event.action;
  const data = event.data || {};

  console.log('收到请求:', action, data);

  try {
    switch (action) {
      case 'getDashboardStats':
        return await getDashboardStats();
      case 'getGrowthTrend':
        return await getGrowthTrend(data.days || 7);
      case 'getUserList':
        return await getUserList(data);
      case 'getUserDetail':
        return await getUserDetail(data.openid);
      case 'getUserTransactions':
        return await getUserTransactions(data);
      case 'getEggStats':
        return await getEggStats();
      case 'getEggRankings':
        return await getEggRankings(data.limit || 20);
      case 'getEggDiscoveryHistory':
        return await getEggDiscoveryHistory(data);
      case 'getQCIOUserList':
        return await getQCIOUserList(data);
      case 'getQCIOUserDetail':
        return await getQCIOUserDetail(data.qcioId);
      case 'getFarmStats':
        return await getFarmStats();
      case 'getFarmLogs':
        return await getFarmLogs(data);
      case 'getChatHistory':
        return await getChatHistory(data);
      case 'getGroupChatHistory':
        return await getGroupChatHistory(data);
      case 'getVisitStats':
        return await getVisitStats();
      case 'getVisitHistory':
        return await getVisitHistory(data);
      case 'exportUsers':
        return await exportUsers();
      case 'exportTransactions':
        return await exportTransactions(data);
      case 'exportEggs':
        return await exportEggs();
      case 'getActivityLogs':
        return await getActivityLogs(data);
      case 'getRecentActivity':
        return await getRecentActivity(data.limit || 50);
      default:
        return {
          success: false,
          error: '未知操作类型: ' + action
        };
    }
  } catch (error) {
    console.error('云函数错误:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ==================== 统计数据模块 ====================

/**
 * 获取数据看板统计
 */
async function getDashboardStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

  // 并行查询所有统计
  const results = await Promise.all([
    db.collection('users').count(),
    db.collection('users').where({ createTime: _.gte(todayStart) }).count(),
    db.collection('users').where({ createTime: _.gte(yesterdayStart).lt(todayStart) }).count(),
    db.collection('qcio_users').count(),
    db.collection('qcio_users').where({ updateTime: _.gte(todayStart) }).count(),
    db.collection('qcio_chat_history').count(),
    db.collection('qcio_chat_history').where({ timestamp: _.gte(todayStart) }).count(),
    db.collection('qcio_visit_stats').count(),
    db.collection('qcio_visit_stats').where({ lastVisitTime: _.gte(todayStart) }).count(),
    db.collection('user_activity_logs').where({ action: 'egg_discovered', createdAt: _.gte(todayStart) }).count(),
    db.collection('mood_garden').count()
  ]);

  const totalUsers = results[0];
  const todayUsers = results[1];
  const yesterdayUsers = results[2];
  const totalQCIOUsers = results[3];
  const activeQCIO = results[4];
  const totalChats = results[5];
  const todayChats = results[6];
  const totalVisits = results[7];
  const todayVisits = results[8];
  const todayEggs = results[9];
  const moodGardenCount = results[10];

  // 获取所有用户计算总和
  const allUsers = await db.collection('users').field({
    coins: true,
    netFee: true,
    eggStats: true
  }).get();

  let totalCoins = 0;
  let totalNetFee = 0;
  let totalEggsDiscovered = 0;

  for (let i = 0; i < allUsers.data.length; i++) {
    var user = allUsers.data[i];
    totalCoins += user.coins || 0;
    totalNetFee += user.netFee || 0;
    if (user.eggStats && user.eggStats.eggsDiscovered) {
      totalEggsDiscovered += user.eggStats.eggsDiscovered;
    }
  }

  const todayNew = todayUsers.total || 0;
  const yesterdayNew = yesterdayUsers.total || 0;
  const growth = yesterdayNew > 0 ? ((todayNew - yesterdayNew) / yesterdayNew * 100).toFixed(1) : 0;

  return {
    success: true,
    data: {
      users: {
        total: totalUsers.total || 0,
        todayNew: todayNew,
        growth: growth
      },
      qcio: {
        total: totalQCIOUsers.total || 0,
        todayActive: activeQCIO.total || 0
      },
      chats: {
        total: totalChats.total || 0,
        today: todayChats.total || 0
      },
      visits: {
        total: totalVisits.total || 0,
        today: todayVisits.total || 0
      },
      eggs: {
        totalDiscovered: totalEggsDiscovered,
        todayDiscovered: todayEggs.total || 0
      },
      currency: {
        totalCoins: totalCoins,
        totalNetFee: totalNetFee
      },
      moodGarden: moodGardenCount.total || 0
    }
  };
}

/**
 * 获取增长趋势
 */
async function getGrowthTrend(days) {
  const trends = [];
  const now = new Date();

  for (var i = days - 1; i >= 0; i--) {
    var date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    var dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const results = await Promise.all([
      db.collection('users').where({ createTime: _.gte(dayStart).lt(dayEnd) }).count(),
      db.collection('qcio_users').where({ updateTime: _.gte(dayStart).lt(dayEnd) }).count(),
      db.collection('qcio_chat_history').where({ timestamp: _.gte(dayStart).lt(dayEnd) }).count(),
      db.collection('qcio_visit_stats').where({ lastVisitTime: _.gte(dayStart).lt(dayEnd) }).count()
    ]);

    trends.push({
      date: (date.getMonth() + 1) + '/' + date.getDate(),
      newUsers: results[0].total || 0,
      activeUsers: results[1].total || 0,
      newChats: results[2].total || 0,
      newVisits: results[3].total || 0
    });
  }

  return { success: true, data: trends };
}

// ==================== 用户管理模块 ====================

/**
 * 获取用户列表
 */
async function getUserList(data) {
  const page = data.page || 1;
  const limit = data.limit || 20;
  const keyword = data.keyword || '';
  const sortBy = data.sortBy || 'createTime';
  const sortOrder = data.sortOrder || 'desc';

  const skip = (page - 1) * limit;

  var query = db.collection('users');

  if (keyword) {
    query = query.where(_.or([
      { nickname: db.RegExp({ regexp: keyword, options: 'i' }) }
    ]));
  }

  const order = sortOrder === 'asc' ? 'asc' : 'desc';
  const result = await query.orderBy(sortBy, order).skip(skip).limit(limit).get();
  const countResult = await query.count();

  return {
    success: true,
    data: {
      list: result.data,
      total: countResult.total,
      page: page,
      limit: limit
    }
  };
}

/**
 * 获取用户详情
 */
async function getUserDetail(openid) {
  if (!openid) {
    return { success: false, error: '缺少用户 openid' };
  }

  const userResult = await db.collection('users').where({ _openid: openid }).get();

  if (userResult.data.length === 0) {
    return { success: false, error: '用户不存在' };
  }

  const user = userResult.data[0];
  var qcioUser = null;
  var qcioWallet = null;

  if (user.qcioProfile && user.qcioProfile.qcio_id) {
    const results = await Promise.all([
      db.collection('qcio_users').where({ qcio_id: user.qcioProfile.qcio_id }).get(),
      db.collection('qcio_wallet').where({ _openid: openid }).get()
    ]);
    if (results[0].data.length > 0) qcioUser = results[0].data[0];
    if (results[1].data.length > 0) qcioWallet = results[1].data[0];
  }

  const transactionsResult = await db.collection('user_transactions')
    .where({ _openid: openid })
    .orderBy('createTime', 'desc')
    .limit(50)
    .get();

  const activityResult = await db.collection('user_activity_logs')
    .where({ _openid: openid })
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();

  return {
    success: true,
    data: {
      user: user,
      qcioUser: qcioUser,
      qcioWallet: qcioWallet,
      transactions: transactionsResult.data,
      activities: activityResult.data
    }
  };
}

/**
 * 获取用户交易记录
 */
async function getUserTransactions(data) {
  const openid = data.openid;
  const page = data.page || 1;
  const limit = data.limit || 20;
  const type = data.type;

  if (!openid) {
    return { success: false, error: '缺少用户 openid' };
  }

  const skip = (page - 1) * limit;
  var query = db.collection('user_transactions').where({ _openid: openid });

  if (type) {
    query = query.where({ type: type });
  }

  const result = await query.orderBy('createTime', 'desc').skip(skip).limit(limit).get();
  const countResult = await query.count();

  return {
    success: true,
    data: {
      list: result.data,
      total: countResult.total,
      page: page,
      limit: limit
    }
  };
}

// ==================== 彩蛋管理模块 ====================

/**
 * 获取彩蛋统计
 */
async function getEggStats() {
  const users = await db.collection('users')
    .field({
      eggStats: true,
      badges: true
    })
    .get();

  var stats = {
    totalUsers: users.data.length,
    totalDiscovered: 0,
    byRarity: {
      common: { count: 0, users: 0 },
      rare: { count: 0, users: 0 },
      epic: { count: 0, users: 0 },
      legendary: { count: 0, users: 0 }
    },
    topEggs: []
  };

  var eggCounts = {};

  for (var i = 0; i < users.data.length; i++) {
    var user = users.data[i];
    var eggs = (user.eggStats && user.eggStats.discoveredEggs) ? user.eggStats.discoveredEggs : [];
    stats.totalDiscovered += eggs.length;

    for (var j = 0; j < eggs.length; j++) {
      var egg = eggs[j];
      if (stats.byRarity[egg.rarity]) {
        stats.byRarity[egg.rarity].count++;
      }

      var key = egg.id;
      if (!eggCounts[key]) {
        eggCounts[key] = { id: egg.id, name: egg.name, count: 0, rarity: egg.rarity };
      }
      eggCounts[key].count++;
    }
  }

  // 统计发现过各稀有度的用户数
  for (var i = 0; i < users.data.length; i++) {
    var user = users.data[i];
    var eggs = (user.eggStats && user.eggStats.discoveredEggs) ? user.eggStats.discoveredEggs : [];
    var raritySet = {};

    for (var j = 0; j < eggs.length; j++) {
      raritySet[eggs[j].rarity] = true;
    }

    for (var rarity in raritySet) {
      if (stats.byRarity[rarity]) {
        stats.byRarity[rarity].users++;
      }
    }
  }

  // 排序获取热门彩蛋
  var topEggsArray = [];
  for (var key in eggCounts) {
    topEggsArray.push(eggCounts[key]);
  }
  topEggsArray.sort(function(a, b) { return b.count - a.count; });
  stats.topEggs = topEggsArray.slice(0, 10);

  return { success: true, data: stats };
}

/**
 * 获取彩蛋排行榜
 */
async function getEggRankings(limit) {
  const result = await db.collection('users')
    .field({
      _openid: true,
      nickname: true,
      qcioProfile: true,
      eggStats: true,
      coins: true
    })
    .orderBy('eggStats.eggsDiscovered', 'desc')
    .limit(limit)
    .get();

  var list = [];
  for (var i = 0; i < result.data.length; i++) {
    var user = result.data[i];
    var nickname = user.nickname;
    if (!nickname && user.qcioProfile && user.qcioProfile.nickname) {
      nickname = user.qcioProfile.nickname;
    }
    if (!nickname) {
      nickname = '未知';
    }

    list.push({
      rank: i + 1,
      openid: user._openid,
      nickname: nickname,
      qcioId: (user.qcioProfile && user.qcioProfile.qcio_id) ? user.qcioProfile.qcio_id : null,
      avatar: (user.qcioProfile && user.qcioProfile.avatar) ? user.qcioProfile.avatar : null,
      eggsDiscovered: (user.eggStats && user.eggStats.eggsDiscovered) ? user.eggStats.eggsDiscovered : 0,
      coins: user.coins || 0
    });
  }

  return {
    success: true,
    data: list
  };
}

/**
 * 获取彩蛋发现历史
 */
async function getEggDiscoveryHistory(data) {
  const page = data.page || 1;
  const limit = data.limit || 20;
  const rarity = data.rarity;
  const eggId = data.eggId;

  const skip = (page - 1) * limit;
  var query = db.collection('user_activity_logs').where({ action: 'egg_discovered' });

  if (rarity) {
    query = query.where({ 'data.egg.rarity': rarity });
  }

  if (eggId) {
    query = query.where({ 'data.egg.id': eggId });
  }

  const result = await query.orderBy('createdAt', 'desc').skip(skip).limit(limit).get();
  const countResult = await query.count();

  return {
    success: true,
    data: {
      list: result.data,
      total: countResult.total,
      page: page,
      limit: limit
    }
  };
}

// ==================== QCIO 数据管理模块 ====================

/**
 * 获取 QCIO 用户列表
 */
async function getQCIOUserList(data) {
  const page = data.page || 1;
  const limit = data.limit || 20;
  const keyword = data.keyword || '';
  const sortBy = data.sortBy || 'updateTime';
  const sortOrder = data.sortOrder || 'desc';

  const skip = (page - 1) * limit;
  var query = db.collection('qcio_users');

  if (keyword) {
    query = query.where(_.or([
      { nickname: db.RegExp({ regexp: keyword, options: 'i' }) },
      { qcio_id: db.RegExp({ regexp: keyword, options: 'i' }) }
    ]));
  }

  const order = sortOrder === 'asc' ? 'asc' : 'desc';
  const result = await query.orderBy(sortBy, order).skip(skip).limit(limit).get();
  const countResult = await query.count();

  return {
    success: true,
    data: {
      list: result.data,
      total: countResult.total,
      page: page,
      limit: limit
    }
  };
}

/**
 * 获取 QCIO 用户详情
 */
async function getQCIOUserDetail(qcioId) {
  if (!qcioId) {
    return { success: false, error: '缺少 QCIO ID' };
  }

  const results = await Promise.all([
    db.collection('qcio_users').where({ qcio_id: qcioId }).get(),
    db.collection('qcio_wallet').where({ qcio_id: qcioId }).get(),
    db.collection('qcio_user_achievements').where({ qcio_id: qcioId }).get(),
    db.collection('qcio_experience_logs').where({ qcio_id: qcioId })
      .orderBy('timestamp', 'desc')
      .limit(30)
      .get()
  ]);

  if (results[0].data.length === 0) {
    return { success: false, error: 'QCIO 用户不存在' };
  }

  return {
    success: true,
    data: {
      user: results[0].data[0],
      wallet: results[1].data.length > 0 ? results[1].data[0] : null,
      achievements: results[2].data,
      experience: results[3].data
    }
  };
}

/**
 * 获取农场统计
 */
async function getFarmStats() {
  const results = await Promise.all([
    db.collection('qcio_farm_profiles').count(),
    db.collection('qcio_farm_plots').where({ crop: _.exists(true) }).count()
  ]);

  return {
    success: true,
    data: {
      totalFarmers: results[0].total || 0,
      activePlots: results[1].total || 0
    }
  };
}

/**
 * 获取农场日志
 */
async function getFarmLogs(data) {
  const page = data.page || 1;
  const limit = data.limit || 20;
  const qcioId = data.qcioId;

  const skip = (page - 1) * limit;
  var query = db.collection('qcio_farm_logs');

  if (qcioId) {
    query = query.where({ qcio_id: qcioId });
  }

  const result = await query.orderBy('logTime', 'desc').skip(skip).limit(limit).get();
  const countResult = await query.count();

  return {
    success: true,
    data: {
      list: result.data,
      total: countResult.total,
      page: page,
      limit: limit
    }
  };
}

// ==================== 聊天记录模块 ====================

/**
 * 获取私聊历史
 */
async function getChatHistory(data) {
  const page = data.page || 1;
  const limit = data.limit || 50;
  const userQcioId = data.userQcioId;
  const contactName = data.contactName;

  const skip = (page - 1) * limit;
  var query = db.collection('qcio_chat_history');

  var conditions = {};
  if (userQcioId) conditions.user_qcio_id = userQcioId;
  if (contactName) conditions.contact_name = contactName;

  if (Object.keys(conditions).length > 0) {
    query = query.where(conditions);
  }

  const result = await query.orderBy('timestamp', 'desc').skip(skip).limit(limit).get();
  const countResult = await query.count();

  // 反转数组，使时间正序
  var reversedList = result.data.slice().reverse();

  return {
    success: true,
    data: {
      list: reversedList,
      total: countResult.total,
      page: page,
      limit: limit
    }
  };
}

/**
 * 获取群聊历史
 */
async function getGroupChatHistory(data) {
  const page = data.page || 1;
  const limit = data.limit || 50;
  const groupId = data.groupId;

  const skip = (page - 1) * limit;
  var query = db.collection('qcio_group_chat_history');

  if (groupId) {
    query = query.where({ group_id: groupId });
  }

  const result = await query.orderBy('timestamp', 'desc').skip(skip).limit(limit).get();
  const countResult = await query.count();

  var reversedList = result.data.slice().reverse();

  return {
    success: true,
    data: {
      list: reversedList,
      total: countResult.total,
      page: page,
      limit: limit
    }
  };
}

// ==================== 访问统计模块 ====================

/**
 * 获取访问统计
 */
async function getVisitStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const results = await Promise.all([
    db.collection('qcio_visit_stats').count(),
    db.collection('qcio_visit_stats').where({ lastVisitTime: _.gte(todayStart) }).count()
  ]);

  return {
    success: true,
    data: {
      total: results[0].total || 0,
      today: results[1].total || 0
    }
  };
}

/**
 * 获取访问历史
 */
async function getVisitHistory(data) {
  const page = data.page || 1;
  const limit = data.limit || 20;
  const ownerQcioId = data.ownerQcioId;

  const skip = (page - 1) * limit;
  var query = db.collection('qcio_visit_stats');

  if (ownerQcioId) {
    query = query.where({ owner_qcio_id: ownerQcioId });
  }

  const result = await query.orderBy('lastVisitTime', 'desc').skip(skip).limit(limit).get();
  const countResult = await query.count();

  return {
    success: true,
    data: {
      list: result.data,
      total: countResult.total,
      page: page,
      limit: limit
    }
  };
}

// ==================== 数据导出模块 ====================

/**
 * 导出用户数据
 */
async function exportUsers() {
  const result = await db.collection('users')
    .field({
      _openid: true,
      nickname: true,
      qcioProfile: true,
      coins: true,
      netFee: true,
      eggStats: true,
      createTime: true
    })
    .limit(1000)
    .get();

  return {
    success: true,
    data: result.data,
    count: result.data.length
  };
}

/**
 * 导出交易记录
 */
async function exportTransactions(data) {
  const limit = data.limit || 1000;
  const type = data.type;
  const startDate = data.startDate;
  const endDate = data.endDate;

  var query = db.collection('user_transactions');
  var conditions = {};

  if (type) conditions.type = type;
  if (startDate) conditions.createTime = _.gte(new Date(startDate));
  if (endDate) {
    if (conditions.createTime) {
      conditions.createTime = _.and(conditions.createTime, _.lte(new Date(endDate)));
    } else {
      conditions.createTime = _.lte(new Date(endDate));
    }
  }

  if (Object.keys(conditions).length > 0) {
    query = query.where(conditions);
  }

  const result = await query.orderBy('createTime', 'desc').limit(limit).get();

  return {
    success: true,
    data: result.data,
    count: result.data.length
  };
}

/**
 * 导出彩蛋数据
 */
async function exportEggs() {
  const result = await db.collection('user_activity_logs')
    .where({ action: 'egg_discovered' })
    .orderBy('createdAt', 'desc')
    .limit(1000)
    .get();

  return {
    success: true,
    data: result.data,
    count: result.data.length
  };
}

// ==================== 活动日志模块 ====================

/**
 * 获取活动日志
 */
async function getActivityLogs(data) {
  const page = data.page || 1;
  const limit = data.limit || 50;
  const action = data.action;
  const openid = data.openid;

  const skip = (page - 1) * limit;
  var query = db.collection('user_activity_logs');

  var conditions = {};
  if (action) conditions.action = action;
  if (openid) conditions._openid = openid;

  if (Object.keys(conditions).length > 0) {
    query = query.where(conditions);
  }

  const result = await query.orderBy('createdAt', 'desc').skip(skip).limit(limit).get();
  const countResult = await query.count();

  return {
    success: true,
    data: {
      list: result.data,
      total: countResult.total,
      page: page,
      limit: limit
    }
  };
}

/**
 * 获取最近活动
 */
async function getRecentActivity(limit) {
  const result = await db.collection('user_activity_logs')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return {
    success: true,
    data: result.data
  };
}
