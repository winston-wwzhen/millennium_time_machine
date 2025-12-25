/**
 * QCIO 每日任务模块
 * 处理签到、连续天数计算
 */

const { addTransaction } = require('./wallet');

/**
 * 每日签到
 */
async function dailyCheckin(openid, db, _) {
  try {
    const now = new Date();
    const today = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

    const dailyTasksCollection = db.collection('qcio_daily_tasks');

    // 查询今日任务记录
    const res = await dailyTasksCollection.where({
      _openid: openid,
      date: today
    }).limit(1).get();

    if (res.data.length > 0) {
      const task = res.data[0];
      if (task.checkinDone) {
        return { success: false, message: '今日已签到' };
      }
    }

    // 计算连续签到天数和奖励
    let streak = 1;
    let bonusCoins = 0;
    let bonusQpoints = 0;

    if (res.data.length > 0) {
      const task = res.data[0];
      streak = (task.checkinStreak || 0) + 1;

      // 连续签到奖励
      if (streak === 3) {
        bonusCoins = 5;
      } else if (streak === 7) {
        bonusCoins = 20;
        bonusQpoints = 3;
      } else if (streak % 30 === 0) {
        bonusCoins = 50;
        bonusQpoints = 10;
      }
    }

    const baseCoins = 10;
    const totalCoins = baseCoins + bonusCoins;

    // 更新或创建每日任务记录
    if (res.data.length > 0) {
      await dailyTasksCollection.doc(res.data[0]._id).update({
        data: {
          checkinDone: true,
          checkinStreak: streak,
          updateTime: db.serverDate()
        }
      });
    } else {
      await dailyTasksCollection.add({
        data: {
          _openid: openid,
          date: today,
          checkinDone: true,
          checkinStreak: streak,
          moodLogCount: 0,
          chatCount: 0,
          lastChatTime: null,
          farmHarvestCount: 0,
          createTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      });
    }

    let newCoinsBalance = null;
    let newQpointsBalance = null;

    // 添加金币奖励
    if (totalCoins > 0) {
      const txResult = await addTransaction(openid, {
        type: 'earn',
        currency: 'coins',
        amount: totalCoins,
        source: 'daily_checkin',
        description: bonusCoins > 0 ? `每日签到+连续${streak}天奖励` : '每日签到'
      }, db, _);

      if (txResult.success && txResult.data) {
        newCoinsBalance = txResult.data.newBalance;
      }
    }

    // 添加Q点奖励
    if (bonusQpoints > 0) {
      const txResult = await addTransaction(openid, {
        type: 'earn',
        currency: 'qpoints',
        amount: bonusQpoints,
        source: 'daily_checkin_bonus',
        description: `连续签到${streak}天奖励`
      }, db, _);

      if (txResult.success && txResult.data) {
        newQpointsBalance = txResult.data.newBalance;
      }
    }

    return {
      success: true,
      data: {
        streak: streak,
        coinsEarned: totalCoins,
        qpointsEarned: bonusQpoints,
        reward: {
          coins: totalCoins,
          qpoints: bonusQpoints
        },
        newCoinsBalance: newCoinsBalance,
        newQpointsBalance: newQpointsBalance
      }
    };
  } catch (err) {
    console.error('dailyCheckin Error:', err);
    return { success: false, error: err, message: '签到失败' };
  }
}

/**
 * 获取每日任务状态
 */
async function getDailyTasks(openid, db) {
  try {
    const now = new Date();
    const today = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

    const dailyTasksCollection = db.collection('qcio_daily_tasks');

    const res = await dailyTasksCollection.where({
      _openid: openid,
      date: today
    }).limit(1).get();

    if (res.data.length > 0) {
      const task = res.data[0];
      return {
        success: true,
        data: {
          checkinDone: task.checkinDone || false,
          checkinStreak: task.checkinStreak || 0,
          totalCheckinDays: task.checkinStreak || 0, // 兼容前端字段名
          moodLogCount: task.moodLogCount || 0,
          chatCount: task.chatCount || 0,
          farmHarvestCount: task.farmHarvestCount || 0,
          hasCheckedIn: task.checkinDone || false // 兼容前端字段名
        }
      };
    }

    // 今日还没有记录，返回初始状态
    return {
      success: true,
      data: {
        checkinDone: false,
        checkinStreak: 0,
        totalCheckinDays: 0,
        moodLogCount: 0,
        chatCount: 0,
        farmHarvestCount: 0,
        hasCheckedIn: false
      }
    };
  } catch (err) {
    console.error('getDailyTasks Error:', err);
    return { success: false, error: err, message: '获取任务状态失败' };
  }
}

module.exports = {
  dailyCheckin,
  getDailyTasks
};
