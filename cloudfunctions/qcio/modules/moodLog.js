/**
 * QCIO 心情日志模块
 * 处理心情日志的保存、查询、删除
 * 集成经济系统：发布日志奖励金币
 */

const { addTransaction } = require('./wallet');

/**
 * 获取心情图标
 */
function getMoodIcon(moodType) {
  const moodIcons = {
    sad: '💔',
    passionate: '🔥',
    sweet: '💕',
    confused: '🌫️'
  };
  return moodIcons[moodType] || '💭';
}

/**
 * 格式化时间显示
 */
function formatTime(date) {
  if (!date) return '';

  const d = new Date(date);
  const now = new Date();
  const diff = now - d;

  // 1小时内显示"刚刚"
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return minutes < 1 ? '刚刚' : `${minutes}分钟前`;
  }

  // 24小时内显示"X小时前"
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}小时前`;
  }

  // 7天内显示"X天前"
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}天前`;
  }

  // 其他显示完整日期
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 获取今日日志发布数量
 */
async function getMoodLogDailyCount(openid, db) {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const countRes = await db.collection('qcio_mood_logs')
      .where({
        _openid: openid,
        createTime: db.command.gte(todayStart)
      })
      .count();

    return countRes.total || 0;
  } catch (err) {
    console.error('getMoodLogDailyCount Error:', err);
    return 0;
  }
}

/**
 * 保存心情日志（带经济系统奖励）
 * @param {String} openid - 用户openid
 * @param {Object} data - 日志数据
 * @param {Object} _ - 数据库操作符
 */
async function saveMoodLog(openid, data, db, _) {
  try {
    // 检查今日发布次数（每天最多3次奖励）
    const dailyCount = await getMoodLogDailyCount(openid, db);
    const canEarnReward = dailyCount < 3;

    const logData = {
      _openid: openid,
      mood_type: data.mood_type,
      mood_name: data.mood_name,
      mood_icon: getMoodIcon(data.mood_type),
      keywords: data.keywords,
      content: data.content,
      createTime: db.serverDate(),
      visits: 0,
      likes: 0,
      earnedReward: canEarnReward // 记录是否获得奖励
    };

    const addRes = await db.collection('qcio_mood_logs').add({ data: logData });

    let newBalance = null;

    // 发放金币奖励（每天前3篇）
    if (canEarnReward) {
      const txResult = await addTransaction(openid, {
        type: 'earn',
        currency: 'coins',
        amount: 5,
        source: 'publish_mood_log',
        description: `发布心情日志 (${dailyCount + 1}/3)`
      }, db, _);

      // 获取更新后的钱包余额
      if (txResult.success && txResult.data) {
        newBalance = txResult.data.newBalance;
      }
    }

    return {
      success: true,
      data: {
        _id: addRes._id,
        earnedReward: canEarnReward,
        reward: canEarnReward ? { coins: 5 } : null,
        remainingRewardCount: Math.max(0, 3 - dailyCount - 1),
        newBalance: newBalance // 返回更新后的余额
      }
    };
  } catch (err) {
    console.error('saveMoodLog Error:', err);
    return { success: false, error: err, message: '保存日志失败' };
  }
}

/**
 * 获取心情日志列表
 */
async function getMoodLogs(openid, db) {
  try {
    const res = await db.collection('qcio_mood_logs')
      .where({ _openid: openid })
      .orderBy('createTime', 'desc')
      .limit(50)
      .get();

    const logs = res.data.map(log => ({
      ...log,
      createTimeStr: formatTime(log.createTime)
    }));

    return { success: true, data: logs };
  } catch (err) {
    console.error('getMoodLogs Error:', err);
    return { success: false, error: err, message: '获取日志列表失败' };
  }
}

/**
 * 删除心情日志
 */
async function deleteMoodLog(openid, logId, db) {
  try {
    // 验证是否是自己的日志
    const logRes = await db.collection('qcio_mood_logs')
      .where({
        _id: logId,
        _openid: openid
      })
      .get();

    if (logRes.data.length === 0) {
      return { success: false, message: '日志不存在或无权删除' };
    }

    await db.collection('qcio_mood_logs').doc(logId).remove();

    return { success: true };
  } catch (err) {
    console.error('deleteMoodLog Error:', err);
    return { success: false, error: err, message: '删除日志失败' };
  }
}

/**
 * 获取日志发布状态（今日剩余奖励次数）
 */
async function getMoodLogStatus(openid, db) {
  try {
    const dailyCount = await getMoodLogDailyCount(openid, db);
    const remainingCount = Math.max(0, 3 - dailyCount);

    return {
      success: true,
      data: {
        todayCount: dailyCount,
        maxCount: 3,
        remainingCount: remainingCount,
        canEarnReward: remainingCount > 0
      }
    };
  } catch (err) {
    console.error('getMoodLogStatus Error:', err);
    return { success: false, error: err, message: '获取状态失败' };
  }
}

module.exports = {
  saveMoodLog,
  getMoodLogs,
  deleteMoodLog,
  getMoodLogStatus
};
