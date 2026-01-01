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
    db.collection('user_activity_logs').where({ action: 'egg_discovered', createTime: _.gte(todayStart) }).count(),
    db.collection('mood_garden').count()
  ]);

  const totalUsers = results[0];
  const todayUsers = results[1];
  const yesterdayUsers = results[2];
  const totalQCIOUsers = results[3];
  const activeQCIO = results[4];
  const totalChats = results[5];
  const todayChats = results[6];
  const todayEggs = results[7];
  const moodGardenCount = results[8];

  // 获取所有用户计算总和（coins, netFee, badges）
  const allUsers = await db.collection('users').field({
    coins: true,
    netFee: true,
    badges: true
  }).get();

  let totalCoins = 0;
  let totalNetFee = 0;
  let totalEggsDiscovered = 0;

  for (var i = 0; i < allUsers.data.length; i++) {
    var user = allUsers.data[i];
    totalCoins += user.coins || 0;
    totalNetFee += user.netFee || 0;
    // 彩蛋数据存储在 badges 数组中
    if (user.badges && Array.isArray(user.badges)) {
      totalEggsDiscovered += user.badges.length;
    }
  }

  // 获取 QCIO 用户计算访问总和
  const qcioUsers = await db.collection('qcio_users').field({
    totalVisits: true,
    todayVisits: true
  }).get();

  let totalVisits = 0;
  let todayVisits = 0;

  for (var j = 0; j < qcioUsers.data.length; j++) {
    var qcioUser = qcioUsers.data[j];
    totalVisits += qcioUser.totalVisits || 0;
    todayVisits += qcioUser.todayVisits || 0;
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
        total: totalVisits,
        today: todayVisits
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
      db.collection('user_activity_logs').where({ action: 'visit_space', createTime: _.gte(dayStart).lt(dayEnd) }).count()
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
    var badges = user.badges || [];
    stats.totalDiscovered += badges.length;

    for (var j = 0; j < badges.length; j++) {
      var badge = badges[j];
      var eggId = badge.eggId;

      // 从 EGG_CONFIG 获取彩蛋信息（这里简化处理）
      var eggInfo = getEggInfo(eggId);

      if (stats.byRarity[eggInfo.rarity]) {
        stats.byRarity[eggInfo.rarity].count++;
      }

      if (!eggCounts[eggId]) {
        eggCounts[eggId] = { id: eggId, name: eggInfo.name, count: 0, rarity: eggInfo.rarity };
      }
      eggCounts[eggId].count++;
    }
  }

  // 统计发现过各稀有度的用户数
  for (var i = 0; i < users.data.length; i++) {
    var user = users.data[i];
    var badges = user.badges || [];
    var raritySet = {};

    for (var j = 0; j < badges.length; j++) {
      var eggId = badges[j].eggId;
      var eggInfo = getEggInfo(eggId);
      raritySet[eggInfo.rarity] = true;
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
 * 根据 eggId 获取彩蛋信息（包含奖励）
 */
function getEggInfo(eggId) {
  // 彩蛋配置（需要和 miniprogram/utils/egg-system.js 保持一致）
  var EGG_CONFIG = {
    lion_dance: { name: '舞狮少年', rarity: 'common', reward: { coins: 1000 } },
    lion_talk: { name: '倾听者', rarity: 'common', reward: { coins: 1000 } },
    blue_screen: { name: '蓝屏幸存者', rarity: 'rare', reward: { coins: 2000 } },
    time_midnight: { name: '夜猫子', rarity: 'epic', reward: { coins: 5000 } },
    taskbar_surprise: { name: '探索者', rarity: 'common', reward: { coins: 1000 } },
    hidden_icon: { name: '寻宝者', rarity: 'rare', reward: { coins: 2000 } },
    bg_switch: { name: '艺术家', rarity: 'common', reward: { coins: 500 } },
    konami_code: { name: '上帝之手', rarity: 'legendary', reward: { coins: 10000 } },
    my_computer: { name: '硬件控', rarity: 'common', reward: { coins: 400 } },
    browser_click: { name: '冲浪达人', rarity: 'common', reward: { coins: 400 } },
    time_special: { name: '时刻见证者', rarity: 'rare', reward: { coins: 1500 } },
    avatar_master: { name: '非主流达人', rarity: 'common', reward: { coins: 800 } },
    chat_lover: { name: '话痨', rarity: 'rare', reward: { coins: 2500 } },
    qcio_space_visitor: { name: '踩空间达人', rarity: 'common', reward: { coins: 600 } },
    start_menu_fan: { name: '菜单控', rarity: 'common', reward: { coins: 500 } },
    group_chat_party: { name: '群星', rarity: 'rare', reward: { coins: 2000 } },
    mars_translator: { name: '火星使者', rarity: 'common', reward: { coins: 700 } },
    network_exchanger: { name: '理财达人', rarity: 'common', reward: { coins: 500 } },
    recycle_bin_emptyer: { name: '清洁工', rarity: 'rare', reward: { coins: 1500 } },
    star_explorer: { name: '扫雷高手', rarity: 'rare', reward: { coins: 1500 } },
    calculator_master: { name: '精算师', rarity: 'common', reward: { coins: 800 } },
    calendar_time_traveler: { name: '时空旅人', rarity: 'rare', reward: { coins: 1200 } },
    browser_navigator: { name: '导航大师', rarity: 'rare', reward: { coins: 1000 } },
    hidden_file_egg_book: { name: '收藏家', rarity: 'common', reward: { coins: 300 } },
    hidden_file_system_diary: { name: '系统知音', rarity: 'epic', reward: { coins: 500 } },
    hidden_file_coder_note: { name: '程序员的知音', rarity: 'common', reward: { coins: 1000 } },
    hidden_file_dev_egg: { name: '彩蛋猎手', rarity: 'common', reward: { coins: 800 } },
    hidden_file_forgotten: { name: '记忆收藏家', rarity: 'common', reward: { coins: 400 } },
    hidden_file_youth: { name: '时光旅人', rarity: 'common', reward: { coins: 600 } },
    hidden_file_summer: { name: '夏日追忆', rarity: 'common', reward: { coins: 700 } },
    disk_cleanup_master: { name: '清洁达人', rarity: 'rare', reward: { coins: 1200 } },
    device_manager_expert: { name: '硬件专家', rarity: 'rare', reward: { coins: 1000 } },
    file_explorer_master: { name: '文件浏览器大师', rarity: 'rare', reward: { coins: 1000 } },
    c_hidden_dot: { name: 'C盘隐士', rarity: 'common', reward: { coins: 300 } },
    c_empty_folder: { name: '空文件夹猎人', rarity: 'common', reward: { coins: 200 } },
    c_temp_nesting: { name: '套娃专家', rarity: 'epic', reward: { coins: 3000 } },
    c_system_longpress: { name: '配置大师', rarity: 'rare', reward: { coins: 1500 } },
    c_fonts_spam: { name: '字体收集者', rarity: 'rare', reward: { coins: 2000 } },
    d_secret_file: { name: 'D盘寻宝者', rarity: 'common', reward: { coins: 300 } },
    d_readme_click5: { name: '阅读爱好者', rarity: 'common', reward: { coins: 500 } },
    d_games_click10: { name: '游戏达人', rarity: 'common', reward: { coins: 800 } },
    d_future_games: { name: '游戏收藏家', rarity: 'epic', reward: { coins: 3000 } },
    d_music_repeat: { name: '音乐爱好者', rarity: 'common', reward: { coins: 600 } },
    d_videos_deep: { name: '深潜者', rarity: 'rare', reward: { coins: 1500 } },
    d_videos_anime: { name: '动漫迷', rarity: 'common', reward: { coins: 500 } },
    d_videos_drama: { name: '剧迷', rarity: 'common', reward: { coins: 500 } },
    d_videos_movie: { name: '影迷', rarity: 'common', reward: { coins: 500 } },
    d_autoexec_long: { name: '批处理专家', rarity: 'rare', reward: { coins: 1200 } },
    usb_invisible_folder: { name: 'USB隐士', rarity: 'common', reward: { coins: 300 } },
    usb_file_click7: { name: '文件测试员', rarity: 'common', reward: { coins: 400 } },
    usb_nesting_10: { name: 'USB套娃大师', rarity: 'epic', reward: { coins: 3000 } }
  };

  return EGG_CONFIG[eggId] || { name: '未知彩蛋', rarity: 'common', reward: { coins: 0 } };
}

/**
 * 获取彩蛋排行榜
 */
async function getEggRankings(limit) {
  // 获取所有用户数据
  const result = await db.collection('users')
    .field({
      _openid: true,
      nickname: true,
      qcioProfile: true,
      badges: true,
      coins: true
    })
    .get();

  // 处理数据并按 badges 数量排序
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

    var eggsDiscovered = 0;
    if (user.badges && Array.isArray(user.badges)) {
      eggsDiscovered = user.badges.length;
    }

    list.push({
      rank: 0, // 后面排序后再设置
      openid: user._openid,
      nickname: nickname,
      qcioId: (user.qcioProfile && user.qcioProfile.qcio_id) ? user.qcioProfile.qcio_id : null,
      avatar: (user.qcioProfile && user.qcioProfile.avatar) ? user.qcioProfile.avatar : null,
      eggsDiscovered: eggsDiscovered,
      coins: user.coins || 0
    });
  }

  // 按彩蛋发现数量降序排序
  list.sort(function(a, b) {
    return b.eggsDiscovered - a.eggsDiscovered;
  });

  // 设置排名并限制返回数量
  var rankedList = [];
  for (var j = 0; j < Math.min(list.length, limit); j++) {
    list[j].rank = j + 1;
    rankedList.push(list[j]);
  }

  return {
    success: true,
    data: rankedList
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

  // 获取所有用户的 badges
  const users = await db.collection('users')
    .field({
      _openid: true,
      badges: true
    })
    .get();

  // 展开 badges 成单独的记录
  var records = [];
  for (var i = 0; i < users.data.length; i++) {
    var user = users.data[i];
    var badges = user.badges || [];

    for (var j = 0; j < badges.length; j++) {
      var badge = badges[j];
      var eggInfo = getEggInfo(badge.eggId);

      // 过滤条件
      if (rarity && eggInfo.rarity !== rarity) {
        continue;
      }
      if (eggId && badge.eggId !== eggId) {
        continue;
      }

      records.push({
        _id: badge._id || user._openid + '_' + j,
        _openid: user._openid,
        createdAt: badge.discoveredAt,
        data: {
          egg: {
            id: badge.eggId,
            name: eggInfo.name,
            rarity: eggInfo.rarity,
            reward: {
              coins: eggInfo.reward || 0
            }
          }
        }
      });
    }
  }

  // 按发现时间降序排序
  records.sort(function(a, b) {
    var timeA = new Date(a.createdAt).getTime();
    var timeB = new Date(b.createdAt).getTime();
    return timeB - timeA;
  });

  // 分页
  var total = records.length;
  var startIndex = (page - 1) * limit;
  var endIndex = Math.min(startIndex + limit, records.length);
  var pageRecords = records.slice(startIndex, endIndex);

  return {
    success: true,
    data: {
      list: pageRecords,
      total: total,
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

/**
 * 获取最近活动
 */
async function getRecentActivity(limit) {
  const result = await db.collection('user_activity_logs')
    .orderBy('createTime', 'desc')
    .limit(limit)
    .get();

  return {
    success: true,
    data: result.data
  };
}
