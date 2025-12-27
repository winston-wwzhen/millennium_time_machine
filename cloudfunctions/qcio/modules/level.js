/**
 * QCIO 等级系统模块
 * 处理用户等级计算、经验获取、升级逻辑
 */

// ==================== 配置常量 ====================

/**
 * 经验配置
 */
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

/**
 * 等级奖励配置
 */
const LEVEL_REWARDS = {
  5: { daily_bonus_coins: 20 },
  10: { daily_bonus_coins: 50, daily_bonus_qpoints: 2 },
  15: { daily_bonus_coins: 100, daily_bonus_qpoints: 5 },
  20: { daily_bonus_coins: 150, daily_bonus_qpoints: 10 },
  25: { daily_bonus_coins: 200, daily_bonus_qpoints: 15 },
  30: { daily_bonus_coins: 300, daily_bonus_qpoints: 20 },
  35: { daily_bonus_coins: 400, daily_bonus_qpoints: 30 },
};

// ==================== 工具函数 ====================

/**
 * 计算升级所需累计经验
 * @param {Number} level - 目标等级
 * @returns {Number} 升级到该等级所需的累计经验
 */
function getExpForLevel(level) {
  if (level <= 1) return 0;
  if (level <= 10) {
    // Lv1-10: 每级需 50 × 等级 经验
    // 例如: Lv2=50, Lv3=100, Lv10=450
    let total = 0;
    for (let i = 2; i <= level; i++) {
      total += 50 * (i - 1);
    }
    return total;
  } else if (level <= 20) {
    // Lv11-20: 每级需 100 × (等级-10) 经验
    // Lv10=450, Lv11=550, Lv20=1350
    let total = 450; // Lv10的经验
    for (let i = 11; i <= level; i++) {
      total += 100 * (i - 10);
    }
    return total;
  } else if (level <= 30) {
    // Lv21-30: 每级需 200 × (等级-20) 经验
    // Lv20=1350, Lv21=1550, Lv30=3350
    let total = 1350; // Lv20的经验
    for (let i = 21; i <= level; i++) {
      total += 200 * (i - 20);
    }
    return total;
  } else {
    // Lv31+: 每级需 500 × (等级-30) 经验
    // Lv30=3350, Lv31=3850
    let total = 3350; // Lv30的经验
    for (let i = 31; i <= level; i++) {
      total += 500 * (i - 30);
    }
    return total;
  }
}

/**
 * 计算当前等级升级所需额外经验
 * @param {Number} level - 当前等级
 * @returns {Number} 升级到下一级所需的经验
 */
function getExpNeededForNextLevel(level) {
  return getExpForLevel(level + 1) - getExpForLevel(level);
}

/**
 * 获取等级图标
 * @param {Number} level - 等级
 * @returns {String} 等级图标字符串
 */
function getLevelIcon(level) {
  // 经典QQ等级: 4星星=1月亮, 4月亮=1太阳
  // 优先显示高级图标
  const suns = Math.floor(level / 16);
  const moons = Math.floor((level % 16) / 4);
  const stars = level % 4;

  let icon = '';
  if (suns > 0) icon += '☼'.repeat(suns);
  if (moons > 0) icon += '☾'.repeat(moons);
  if (stars > 0) icon += '★'.repeat(stars);

  return icon;
}

/**
 * 获取等级称号
 * @param {Number} level - 等级
 * @returns {String} 等级称号
 */
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

/**
 * 获取 VIP 经验加成倍率
 * @param {Object} user - 用户信息
 * @returns {Number} 加成倍率
 */
function getVipBonus(user) {
  // 检查用户是否是VIP
  if (user.isVip && user.vipExpireTime) {
    const now = new Date();
    const expireTime = new Date(user.vipExpireTime);
    if (expireTime > now) {
      // 检查是月度还是年度VIP（通过计算剩余天数）
      const daysLeft = Math.ceil((expireTime - now) / (1000 * 60 * 60 * 24));
      if (daysLeft > 180) {
        return EXP_CONFIG.VIP_BONUS_YEARLY; // 2.0
      } else {
        return EXP_CONFIG.VIP_BONUS_MONTHLY; // 1.5
      }
    }
  }
  return 1.0; // 非VIP
}

// ==================== 核心功能 ====================

/**
 * 获取等级信息
 * @param {String} openid - 用户openid
 * @param {Object} db - 数据库实例
 */
async function getLevelInfo(openid, db) {
  try {
    // 获取用户信息
    const userRes = await db.collection('qcio_users')
      .where({ _openid: openid })
      .get();

    if (userRes.data.length === 0) {
      return {
        success: false,
        message: '用户不存在'
      };
    }

    const user = userRes.data[0];

    // 获取用户等级数据
    const level = user.level || 1;
    const experience = user.experience || 0;
    const totalExp = user.total_experience || 0;

    // 计算升级进度
    const currentLevelExp = getExpForLevel(level);
    const nextLevelExp = getExpForLevel(level + 1);
    const levelExp = experience - currentLevelExp; // 当前等级已获得的经验
    const needExp = nextLevelExp - experience; // 升级还需要的经验
    const progress = Math.min(100, Math.floor((levelExp / (nextLevelExp - currentLevelExp)) * 100));

    // 获取等级奖励配置
    const rewardConfig = LEVEL_REWARDS[level] || {};

    // 检查今日是否已领取每日奖励
    const today = new Date().toISOString().split('T')[0];
    let hasClaimedDaily = false;
    try {
      const claimRes = await db.collection('qcio_user_level_rewards')
        .where({
          _openid: openid,
          level: level,
          last_daily_claim: db.command.gte(new Date(today))
        })
        .get();
      hasClaimedDaily = claimRes.data.length > 0;
    } catch (err) {
      // 表不存在或查询失败，忽略
    }

    return {
      success: true,
      data: {
        level,
        experience,
        total_experience: totalExp,
        level_title: getLevelTitle(level),
        level_icon: getLevelIcon(level),
        progress,
        need_exp: needExp,
        level_exp: levelExp,
        next_level_exp: nextLevelExp - currentLevelExp,
        daily_reward: rewardConfig,
        has_claimed_daily: hasClaimedDaily
      }
    };
  } catch (err) {
    console.error('getLevelInfo Error:', err);
    return { success: false, error: err, message: '获取等级信息失败' };
  }
}

/**
 * 增加经验
 * @param {String} openid - 用户openid
 * @param {String} source - 经验来源 (chat/farm/visit等)
 * @param {Number} baseAmount - 基础经验值
 * @param {Object} db - 数据库实例
 * @param {Object} _ - 数据库命令对象
 */
async function addExperience(openid, source, baseAmount, db, _) {
  try {
    // 获取用户信息
    const userRes = await db.collection('qcio_users')
      .where({ _openid: openid })
      .get();

    if (userRes.data.length === 0) {
      return { success: false, message: '用户不存在' };
    }

    const user = userRes.data[0];

    // 计算VIP加成
    const vipBonus = getVipBonus(user);
    const totalAmount = Math.floor(baseAmount * vipBonus);

    // 检查每日限制
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // 获取今日该来源已获得的经验
    const dailyLimitKey = `${source.toUpperCase()}_DAILY_LIMIT`;
    const dailyLimit = EXP_CONFIG[dailyLimitKey] || Infinity;

    if (dailyLimit < Infinity) {
      try {
        const todayLogs = await db.collection('qcio_experience_logs')
          .where({
            _openid: openid,
            action: source,
            timestamp: db.command.gte(todayStart)
          })
          .get();

        const todayExp = todayLogs.data.reduce((sum, log) => sum + log.total_exp, 0);

        if (todayExp >= dailyLimit) {
          return {
            success: false,
            message: '今日经验已达上限',
            reached_limit: true
          };
        }

        // 如果本次添加会超限，只添加剩余部分
        const remainingExp = dailyLimit - todayExp;
        const actualAmount = Math.min(totalAmount, remainingExp);

        if (actualAmount <= 0) {
          return {
            success: false,
            message: '今日经验已达上限',
            reached_limit: true
          };
        }
      } catch (err) {
        // 经验日志表可能不存在，继续执行
        console.error('Check daily limit error:', err);
      }
    }

    // 更新用户经验
    const currentExp = user.experience || 0;
    const currentTotalExp = user.total_experience || 0;
    const newExp = currentExp + totalAmount;
    const newTotalExp = currentTotalExp + totalAmount;
    const currentLevel = user.level || 1;

    // 检查是否升级
    let newLevel = currentLevel;
    let levelUpRewards = [];
    let nextLevelExp = getExpForLevel(currentLevel + 1);

    while (newExp >= nextLevelExp) {
      newLevel++;
      nextLevelExp = getExpForLevel(newLevel + 1);

      // 检查是否有等级奖励
      if (LEVEL_REWARDS[newLevel]) {
        levelUpRewards.push({
          level: newLevel,
          ...LEVEL_REWARDS[newLevel]
        });
      }
    }

    // 更新用户数据
    const updateData = {
      experience: newExp,
      total_experience: newTotalExp,
      level_icon: getLevelIcon(newLevel),
      level_title: getLevelTitle(newLevel)
    };

    if (newLevel !== currentLevel) {
      updateData.level = newLevel;
    }

    await db.collection('qcio_users')
      .where({ _openid: openid })
      .update({ data: updateData });

    // 记录经验日志
    try {
      await db.collection('qcio_experience_logs').add({
        data: {
          _openid: openid,
          action: source,
          base_exp: baseAmount,
          vip_bonus: totalAmount - baseAmount,
          total_exp: totalAmount,
          before_level: currentLevel,
          after_level: newLevel,
          timestamp: db.serverDate()
        }
      });
    } catch (err) {
      // 经验日志表可能不存在，不影响主流程
      console.error('Save experience log error:', err);
    }

    return {
      success: true,
      new_level: newLevel,
      level_up: newLevel > currentLevel,
      level_up_rewards: levelUpRewards,
      experience: totalAmount,
      level_icon: getLevelIcon(newLevel),
      level_title: getLevelTitle(newLevel)
    };
  } catch (err) {
    console.error('addExperience Error:', err);
    return { success: false, error: err, message: '增加经验失败' };
  }
}

/**
 * 同步在线时长并结算经验
 * @param {String} openid - 用户openid
 * @param {Number} minutes - 在线分钟数
 * @param {Object} db - 数据库实例
 */
async function syncOnlineTime(openid, minutes, db) {
  try {
    // 计算获得的经验（每10分钟10经验）
    const intervals = Math.floor(minutes / EXP_CONFIG.ONLINE_REWARD_INTERVAL);
    if (intervals === 0) {
      return {
        success: false,
        message: '在线时长不足10分钟'
      };
    }

    const expGain = intervals * EXP_CONFIG.ONLINE_PER_MINUTE * EXP_CONFIG.ONLINE_REWARD_INTERVAL;

    // 调用 addExperience 获取经验
    return await addExperience(openid, 'online', expGain, db);
  } catch (err) {
    console.error('syncOnlineTime Error:', err);
    return { success: false, error: err, message: '同步在线时长失败' };
  }
}

/**
 * 领取每日等级奖励
 * @param {String} openid - 用户openid
 * @param {Object} db - 数据库实例
 * @param {Object} _ - 数据库命令对象
 */
async function claimDailyReward(openid, db, _) {
  try {
    // 获取用户信息
    const userRes = await db.collection('qcio_users')
      .where({ _openid: openid })
      .get();

    if (userRes.data.length === 0) {
      return { success: false, message: '用户不存在' };
    }

    const user = userRes.data[0];
    const level = user.level || 1;

    // 检查等级是否满足领取条件
    const rewardConfig = LEVEL_REWARDS[level];
    if (!rewardConfig || (!rewardConfig.daily_bonus_coins && !rewardConfig.daily_bonus_qpoints)) {
      return { success: false, message: '当前等级无每日奖励' };
    }

    // 检查今日是否已领取
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    try {
      const claimRes = await db.collection('qcio_user_level_rewards')
        .where({
          _openid: openid,
          level: level,
          last_daily_claim: db.command.gte(todayStart)
        })
        .get();

      if (claimRes.data.length > 0) {
        return { success: false, message: '今日已领取奖励' };
      }
    } catch (err) {
      // 表不存在，继续执行
    }

    const { addTransaction } = require('./wallet');
    const coins = rewardConfig.daily_bonus_coins || 0;
    const qpoints = rewardConfig.daily_bonus_qpoints || 0;

    // 发放奖励
    if (coins > 0) {
      await addTransaction(openid, {
        type: 'coins_in',
        amount: coins,
        description: `等级每日奖励(Lv${level})`
      }, db, _);
    }

    if (qpoints > 0) {
      await addTransaction(openid, {
        type: 'qpoints_in',
        amount: qpoints,
        description: `等级每日奖励(Lv${level})`
      }, db, _);
    }

    // 记录领取
    try {
      // 检查是否已有记录
      const existingRes = await db.collection('qcio_user_level_rewards')
        .where({
          _openid: openid,
          level: level
        })
        .get();

      if (existingRes.data.length > 0) {
        // 更新现有记录
        await db.collection('qcio_user_level_rewards')
          .doc(existingRes.data[0]._id)
          .update({
            data: {
              claimed_daily: true,
              last_daily_claim: db.serverDate()
            }
          });
      } else {
        // 创建新记录
        await db.collection('qcio_user_level_rewards').add({
          data: {
            _openid: openid,
            level: level,
            claimed_daily: true,
            last_daily_claim: db.serverDate()
          }
        });
      }
    } catch (err) {
      // 记录失败不影响奖励发放
      console.error('Record claim error:', err);
    }

    return {
      success: true,
      coins,
      qpoints
    };
  } catch (err) {
    console.error('claimDailyReward Error:', err);
    return { success: false, error: err, message: '领取每日奖励失败' };
  }
}

module.exports = {
  // 配置
  EXP_CONFIG,
  LEVEL_REWARDS,

  // 工具函数
  getExpForLevel,
  getExpNeededForNextLevel,
  getLevelIcon,
  getLevelTitle,
  getVipBonus,

  // 核心功能
  getLevelInfo,
  addExperience,
  syncOnlineTime,
  claimDailyReward
};
