/**
 * QCIO 成就系统模块
 * 处理成就获取、解锁、奖励发放
 */

const { addTransaction } = require('./wallet');

/**
 * 获取成就列表（包括用户解锁状态）
 */
async function getAchievements(openid, db) {
  try {
    // 获取所有启用的成就
    const achievementsRes = await db.collection('qcio_achievements')
      .where({ isEnabled: true })
      .orderBy('order', 'asc')
      .get();

    // 获取用户的成就记录
    const userAchievementsRes = await db.collection('qcio_user_achievements')
      .where({ _openid: openid })
      .get();

    // 构建用户成就进度映射
    const userProgressMap = {};
    userAchievementsRes.data.forEach(record => {
      userProgressMap[record.achievementId] = {
        progress: record.progress || 0,
        isCompleted: record.isCompleted || false,
        unlockTime: record.unlockTime
      };
    });

    // 组合数据
    const achievements = achievementsRes.data.map(ach => ({
      id: ach._id,
      name: ach.name,
      description: ach.description,
      icon: ach.icon,
      type: ach.type,
      condition: ach.condition,
      reward: ach.reward,
      progress: userProgressMap[ach._id]?.progress || 0,
      isCompleted: userProgressMap[ach._id]?.isCompleted || false,
      unlockTime: userProgressMap[ach._id]?.unlockTime
    }));

    return {
      success: true,
      data: achievements
    };
  } catch (err) {
    console.error('getAchievements Error:', err);
    return { success: false, error: err, message: '获取成就列表失败' };
  }
}

/**
 * 检查并解锁成就
 */
async function checkAchievements(openid, db, _) {
  try {
    const unlockedAchievements = [];

    // 获取所有启用的成就
    const achievementsRes = await db.collection('qcio_achievements')
      .where({ isEnabled: true })
      .get();

    // 获取用户的成就记录
    const userAchievementsRes = await db.collection('qcio_user_achievements')
      .where({ _openid: openid })
      .get();

    // 构建已解锁成就的集合
    const unlockedSet = new Set();
    userAchievementsRes.data.forEach(record => {
      if (record.isCompleted) {
        unlockedSet.add(record.achievementId);
      }
    });

    // 检查每个成就
    for (const achievement of achievementsRes.data) {
      // 已解锁的跳过
      if (unlockedSet.has(achievement._id)) {
        continue;
      }

      // 检查是否达成条件
      const checkResult = await checkAchievementCondition(openid, achievement, db);

      if (checkResult.achieved) {
        // 解锁成就
        await unlockAchievement(openid, achievement, db);

        // 发放奖励
        if (achievement.reward) {
          if (achievement.reward.coins > 0) {
            await addTransaction(openid, {
              type: 'earn',
              currency: 'coins',
              amount: achievement.reward.coins,
              source: 'achievement',
              description: `成就解锁：${achievement.name}`
            }, db, _);
          }
          if (achievement.reward.qpoints > 0) {
            await addTransaction(openid, {
              type: 'earn',
              currency: 'qpoints',
              amount: achievement.reward.qpoints,
              source: 'achievement',
              description: `成就解锁：${achievement.name}`
            }, db, _);
          }
        }

        unlockedAchievements.push({
          id: achievement._id,
          name: achievement.name,
          icon: achievement.icon,
          reward: achievement.reward
        });
      }
    }

    return {
      success: true,
      data: {
        unlockedCount: unlockedAchievements.length,
        achievements: unlockedAchievements
      },
      message: unlockedAchievements.length > 0 ? `解锁了${unlockedAchievements.length}个新成就！` : '暂无新成就解锁'
    };
  } catch (err) {
    console.error('checkAchievements Error:', err);
    return { success: false, error: err, message: '检查成就失败' };
  }
}

/**
 * 检查单个成就条件是否达成
 */
async function checkAchievementCondition(openid, achievement, db) {
  try {
    const { type, condition } = achievement;

    switch (type) {
      case 'count':
        // 计数类成就（如聊天1000条）
        const count = await getUserCount(openid, condition.countType, db);
        return { achieved: count >= condition.count };

      case 'login':
        // 登录类成就（如连续登录7天）
        const tasksRes = await db.collection('qcio_daily_tasks')
          .where({ _openid: openid })
          .orderBy('date', 'desc')
          .limit(30)
          .get();

        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 30; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - i);
          const dateStr = `${checkDate.getFullYear()}-${(checkDate.getMonth() + 1).toString().padStart(2, '0')}-${checkDate.getDate().toString().padStart(2, '0')}`;

          const task = tasksRes.data.find(t => t.date === dateStr);
          if (task && task.checkinDone) {
            streak++;
          } else if (i > 0) {
            break;
          }
        }

        return { achieved: streak >= condition.days };

      case 'social':
        // 社交类成就（如空间被访问100次）
        const userRes = await db.collection('qcio_users')
          .where({ _openid: openid })
          .field({ totalVisits: true })
          .get();

        const totalVisits = userRes.data[0]?.totalVisits || 0;
        return { achieved: totalVisits >= condition.visits };

      case 'collect':
        // 收集类成就（如收集10个头像）
        // TODO: 实现物品收集检查
        return { achieved: false };

      default:
        return { achieved: false };
    }
  } catch (err) {
    console.error('checkAchievementCondition Error:', err);
    return { achieved: false };
  }
}

/**
 * 获取用户计数数据
 */
async function getUserCount(openid, countType, db) {
  try {
    switch (countType) {
      case 'chat_messages':
        // 统计聊天消息数
        const chatRes = await db.collection('qcio_chat_history')
          .where({ _openid: openid })
          .get();

        let totalCount = 0;
        chatRes.data.forEach(record => {
          if (record.messages && Array.isArray(record.messages)) {
            totalCount += record.messages.filter(m => m.type === 'me').length;
          }
        });
        return totalCount;

      case 'mood_logs':
        // 统计心情日志数
        const moodRes = await db.collection('qcio_mood_logs')
          .where({ _openid: openid })
          .count();
        return moodRes.total || 0;

      default:
        return 0;
    }
  } catch (err) {
    console.error('getUserCount Error:', err);
    return 0;
  }
}

/**
 * 解锁成就
 */
async function unlockAchievement(openid, achievement, db) {
  try {
    const userAchievementsCollection = db.collection('qcio_user_achievements');

    // 检查是否已有记录
    const existingRes = await userAchievementsCollection.where({
      _openid: openid,
      achievementId: achievement._id
    }).limit(1).get();

    const progressValue = achievement.condition?.count || achievement.condition?.days || achievement.condition?.visits || 0;

    if (existingRes.data.length > 0) {
      // 更新已有记录
      await userAchievementsCollection.doc(existingRes.data[0]._id).update({
        data: {
          progress: progressValue,
          isCompleted: true,
          unlockTime: db.serverDate()
        }
      });
    } else {
      // 创建新记录
      await userAchievementsCollection.add({
        data: {
          _openid: openid,
          achievementId: achievement._id,
          progress: progressValue,
          isCompleted: true,
          unlockTime: db.serverDate()
        }
      });
    }
  } catch (err) {
    console.error('unlockAchievement Error:', err);
  }
}

module.exports = {
  getAchievements,
  checkAchievements
};
