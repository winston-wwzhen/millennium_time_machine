const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

// 经验配置
const EXP_CONFIG = {
  // 挂机经验
  ONLINE_PER_MINUTE: 1,       // 每分钟1经验（10分钟=10经验）
  ONLINE_DAILY_LIMIT: 600,    // 每日上限600经验
  ONLINE_REWARD_INTERVAL: 10, // 每10分钟结算一次

  // 互动经验
  CHAT_PER_MESSAGE: 2,        // 每条聊天2经验
  CHAT_DAILY_LIMIT: 100,      // 每日上限100经验

  POST_LOG: 10,               // 发布日志10经验
  POST_DAILY_LIMIT: 50,       // 每日上限50经验

  GET_LIKE: 1,                // 被点赞1经验
  LIKE_DAILY_LIMIT: 50,       // 每日上限50经验

  VISIT_SPACE: 3,             // 访问空间3经验
  VISIT_DAILY_LIMIT: 60,      // 每日上限60经验

  BE_STOMPED: 2,              // 被踩空间2经验
  STOMPED_DAILY_LIMIT: 100,   // 每日上限100经验

  FARM_HARVEST: 5,            // 农场收获5经验
  FARM_DAILY_LIMIT: 100,      // 每日上限100经验

  FARM_STOLEN: 1,             // 被偷菜1经验
  STOLEN_DAILY_LIMIT: 30,     // 每日上限30经验

  DAILY_CHECKIN: 10,          // 每日签到10经验

  // VIP加成
  VIP_BONUS_MONTHLY: 1.5,     // 月度VIP ×1.5
  VIP_BONUS_YEARLY: 2.0,      // 年度VIP ×2.0
};

// 计算升级所需经验
function getExpForLevel(level) {
  if (level <= 10) {
    return 50 * level;
  } else if (level <= 20) {
    return 100 * (level - 10);
  } else if (level <= 30) {
    return 200 * (level - 20);
  } else {
    return 500 * (level - 30);
  }
}

// 获取等级图标
function getLevelIcon(level) {
  if (level <= 4) {
    return `${level}★`;
  } else if (level <= 8) {
    return `${level - 4}☾`;
  } else if (level <= 12) {
    return `${level - 8}☼`;
  } else if (level <= 16) {
    return `${level - 12}♔`;
  } else {
    const crowns = Math.floor((level - 13) / 4) + 1;
    const diamonds = (level - 13) % 4;
    return diamonds > 0 ? `${crowns}♔${diamonds}♢` : `${crowns}♔`;
  }
}

// 获取等级称号
function getLevelTitle(level) {
  if (level <= 4) return '初入江湖';
  if (level <= 8) return '渐入佳境';
  if (level <= 12) return '声名鹊起';
  if (level <= 16) return '风云人物';
  if (level <= 20) return '一代宗师';
  if (level <= 30) return '登峰造极';
  if (level <= 50) return '传说级别';
  return '殿堂神话';
}

// 初始化用户等级数据
async function initUserLevel(qcio_id) {
  const userRes = await db.collection('qcio_users').where({ qcio_id }).get();

  if (!userRes.data || userRes.data.length === 0) {
    throw new Error('用户不存在');
  }

  const user = userRes.data[0];

  // 检查是否已初始化
  if (user.level !== undefined) {
    return user;
  }

  // 初始化等级数据
  const initdata = {
    level: 1,
    experience: 0,
    total_experience: 0,
    level_title: '初入江湖',
    level_icon: '1★',
    vip_exp_bonus: 1.0,
  };

  await db.collection('qcio_users').where({ qcio_id }).update({
    data: initdata
  });

  return { ...user, ...initdata };
}

// 云函数入口
exports.main = async (event, context) => {
  const { action, qcio_id, data } = event;

  try {
    switch (action) {
      case 'getLevelInfo':
        return await getLevelInfo(qcio_id);

      case 'addExperience':
        return await addExperience(qcio_id, data.source, data.amount);

      case 'syncOnlineTime':
        return await syncOnlineTime(qcio_id, data.minutes);

      case 'claimDailyReward':
        return await claimDailyReward(qcio_id);

      case 'claimLevelReward':
        return await claimLevelReward(qcio_id, data.level);

      case 'initUser':
        return await initUserLevel(qcio_id);

      default:
        return { success: false, error: 'Unknown action' };
    }
  } catch (err) {
    console.error('云函数执行错误:', err);
    return { success: false, error: err.message };
  }
};

// 获取等级信息
async function getLevelInfo(qcio_id) {
  const userRes = await db.collection('qcio_users').where({ qcio_id }).get();

  if (!userRes.data || userRes.data.length === 0) {
    throw new Error('用户不存在');
  }

  const user = userRes.data[0];

  // 如果未初始化等级，先初始化
  let userData = user;
  if (userData.level === undefined) {
    userData = await initUserLevel(qcio_id);
  }

  const { level, experience, total_experience, level_title, level_icon } = userData;

  const nextLevelExp = getExpForLevel(level + 1);
  const currentLevelExp = getExpForLevel(level);
  const progressExp = experience - currentLevelExp;
  const needExp = nextLevelExp - currentLevelExp;

  return {
    success: true,
    level,
    experience,
    total_experience,
    level_title,
    level_icon,
    progress: Math.floor((progressExp / needExp) * 100),
    need_exp: needExp - progressExp,
  };
}

// 增加经验
async function addExperience(qcio_id, source, baseAmount) {
  // 获取用户信息
  const userRes = await db.collection('qcio_users').where({ qcio_id }).get();

  if (!userRes.data || userRes.data.length === 0) {
    throw new Error('用户不存在');
  }

  let user = userRes.data[0];

  // 如果未初始化等级，先初始化
  if (user.level === undefined) {
    user = await initUserLevel(qcio_id);
  }

  // 计算VIP加成
  const vipBonus = user.vip_exp_bonus || 1.0;
  const totalAmount = Math.floor(baseAmount * vipBonus);

  // 检查每日限制
  const today = new Date().toDateString();
  const todayStart = new Date(today);

  // 检查是否超限
  const dailyLimitKey = `${source.toUpperCase()}_DAILY_LIMIT`;
  const dailyLimit = EXP_CONFIG[dailyLimitKey];

  if (dailyLimit && dailyLimit < Infinity) {
    const todayLogs = await db.collection('qcio_experience_logs')
      .where({
        qcio_id: qcio_id,
        action: source,
        timestamp: _.gte(todayStart)
      })
      .count();

    if (todayLogs.total >= dailyLimit) {
      return { success: false, message: '今日经验已达上限', experience: 0 };
    }
  }

  // 更新用户经验
  const newExp = (user.experience || 0) + totalAmount;
  const newTotalExp = (user.total_experience || 0) + totalAmount;

  // 检查是否升级
  let newLevel = user.level || 1;
  let levelUpRewards = [];
  let currentNeedExp = getExpForLevel(newLevel + 1);

  while (newExp >= currentNeedExp) {
    newLevel++;
    currentNeedExp = getExpForLevel(newLevel + 1);

    // 检查是否有等级奖励（里程碑等级）
    const milestoneLevels = [5, 10, 15, 20, 25, 30, 35];
    if (milestoneLevels.includes(newLevel)) {
      levelUpRewards.push({ level: newLevel });
    }
  }

  // 更新用户数据
  const updateData = {
    experience: newExp,
    total_experience: newTotalExp,
    level: newLevel,
    level_icon: getLevelIcon(newLevel),
    level_title: getLevelTitle(newLevel),
  };

  await db.collection('qcio_users').where({ qcio_id }).update({
    data: updateData
  });

  // 记录经验日志
  await db.collection('qcio_experience_logs').add({
    data: {
      qcio_id,
      action: source,
      base_exp: baseAmount,
      vip_bonus: totalAmount - baseAmount,
      total_exp: totalAmount,
      before_level: user.level || 1,
      after_level: newLevel,
      timestamp: new Date(),
    }
  });

  return {
    success: true,
    new_level: newLevel,
    level_up: newLevel > (user.level || 1),
    level_up_rewards: levelUpRewards,
    experience: totalAmount,
  };
}

// 同步在线时长
async function syncOnlineTime(qcio_id, minutes) {
  const userRes = await db.collection('qcio_users').where({ qcio_id }).get();

  if (!userRes.data || userRes.data.length === 0) {
    throw new Error('用户不存在');
  }

  let user = userRes.data[0];

  // 如果未初始化等级，先初始化
  if (user.level === undefined) {
    user = await initUserLevel(qcio_id);
  }

  // 计算获得的经验（每10分钟10经验）
  const expGain = Math.floor(minutes / EXP_CONFIG.ONLINE_REWARD_INTERVAL) * EXP_CONFIG.ONLINE_PER_MINUTE * EXP_CONFIG.ONLINE_REWARD_INTERVAL;

  if (expGain === 0) {
    return { success: false, message: '在线时长不足10分钟' };
  }

  // 检查今日挂机经验是否已达上限
  const today = new Date().toDateString();
  const todayStart = new Date(today);

  const todayLogs = await db.collection('qcio_experience_logs')
    .where({
      qcio_id,
      action: 'online',
      timestamp: _.gte(todayStart)
    })
    .get();

  const todayOnlineExp = todayLogs.data.reduce((sum, log) => sum + log.total_exp, 0);
  const remainingExp = EXP_CONFIG.ONLINE_DAILY_LIMIT - todayOnlineExp;

  if (remainingExp <= 0) {
    return { success: false, message: '今日挂机经验已达上限' };
  }

  const actualGain = Math.min(expGain, remainingExp);
  if (actualGain > 0) {
    return await addExperience(qcio_id, 'online', actualGain);
  }

  return { success: false, message: '在线时长不足' };
}

// 领取每日奖励
async function claimDailyReward(qcio_id) {
  const userRes = await db.collection('qcio_users').where({ qcio_id }).get();

  if (!userRes.data || userRes.data.length === 0) {
    throw new Error('用户不存在');
  }

  let user = userRes.data[0];

  // 如果未初始化等级，先初始化
  if (user.level === undefined) {
    user = await initUserLevel(qcio_id);
  }

  const level = user.level || 1;

  // 检查今日是否已领取
  const today = new Date().toDateString();
  const todayStart = new Date(today);

  const claimRes = await db.collection('qcio_user_level_rewards')
    .where({
      qcio_id,
      claimed_daily: true,
      last_daily_claim: _.gte(todayStart)
    })
    .get();

  if (claimRes.data.length > 0) {
    return { success: false, message: '今日已领取奖励' };
  }

  // 根据等级发放奖励
  const rewards = {
    5: { coins: 20, qpoints: 0 },
    10: { coins: 50, qpoints: 2 },
    15: { coins: 100, qpoints: 5 },
    20: { coins: 150, qpoints: 10 },
    25: { coins: 200, qpoints: 15 },
    30: { coins: 300, qpoints: 20 },
  };

  const maxRewardLevel = Object.keys(rewards).reduce((max, key) => {
    return parseInt(key) <= level && parseInt(key) > max ? parseInt(key) : max;
  }, 0);

  if (maxRewardLevel === 0) {
    return { success: false, message: '等级不足，暂无每日奖励' };
  }

  const reward = rewards[maxRewardLevel];

  // 发放奖励
  await db.collection('qcio_wallet').where({ qcio_id }).update({
    data: {
      coins: _.inc(reward.coins || 0),
      qpoints: _.inc(reward.qpoints || 0),
    }
  });

  // 记录领取
  await db.collection('qcio_user_level_rewards').add({
    data: {
      qcio_id,
      level: maxRewardLevel,
      claimed_daily: true,
      last_daily_claim: new Date(),
    }
  });

  return {
    success: true,
    coins: reward.coins || 0,
    qpoints: reward.qpoints || 0,
    level: maxRewardLevel,
  };
}

// 领取等级奖励
async function claimLevelReward(qcio_id, level) {
  // 检查是否已领取
  const claimRes = await db.collection('qcio_user_level_rewards')
    .where({
      qcio_id,
      level: level,
      claimed_daily: false,  // 排除每日奖励记录
    })
    .get();

  if (claimRes.data.length > 0) {
    return { success: false, message: '已领取过此等级奖励' };
  }

  // 等级奖励配置
  const rewards = {
    5: { coins: 100, qpoints: 5, unlock: ['高级农场'] },
    10: { coins: 200, qpoints: 10, unlock: ['特殊聊天模式'] },
    15: { coins: 500, qpoints: 20, unlock: ['专属徽章'] },
    20: { coins: 1000, qpoints: 50, unlock: ['皇冠头像框'] },
    25: { coins: 2000, qpoints: 100, unlock: ['特殊聊天背景'] },
    30: { coins: 5000, qpoints: 200, unlock: ['金色昵称'] },
  };

  const reward = rewards[level];
  if (!reward) {
    return { success: false, message: '此等级无奖励' };
  }

  // 发放奖励
  await db.collection('qcio_wallet').where({ qcio_id }).update({
    data: {
      coins: _.inc(reward.coins || 0),
      qpoints: _.inc(reward.qpoints || 0),
    }
  });

  // 记录领取
  await db.collection('qcio_user_level_rewards').add({
    data: {
      qcio_id,
      level,
      claimed_daily: false,
      claimed_at: new Date(),
    }
  });

  return {
    success: true,
    reward,
  };
}
