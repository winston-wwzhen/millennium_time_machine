const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID; // 用户的唯一标识
  const { type, userData, amount, eggId, eggData } = event;

  // 🚪 登录/注册逻辑
  if (type === 'login') {
    try {
      const res = await db.collection('users').where({
        _openid: openid
      }).get();

      if (res.data.length > 0) {
        const user = res.data[0];
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
        const lastDailyDate = user.eggStats?.lastDailyDate;

        // 检查是否需要每日扣除网费
        let dailyDeducted = false;
        let newDaysUsed = user.eggStats?.daysUsed || 0;

        if (lastDailyDate !== todayStr) {
          // 新的一天，扣除1天网费（1440分钟）
          dailyDeducted = true;
          newDaysUsed++;

          await db.collection('users').doc(user._id).update({
            data: {
              lastLoginTime: db.serverDate(),
              avatarName: userData.username,
              netFee: _.inc(-1440),  // 每日扣除1天网费（1440分钟）
              'eggStats.daysUsed': _.inc(1),
              'eggStats.lastDailyDate': todayStr
            }
          });
        } else {
          // 同一天，只更新登录时间
          await db.collection('users').doc(user._id).update({
            data: {
              lastLoginTime: db.serverDate(),
              avatarName: userData.username
            }
          });
        }

        return {
          success: true,
          isNew: false,
          openid,
          dailyDeducted,
          daysUsed: newDaysUsed,
          netFee: user.netFee || 0,
          coins: user.coins || 0
        };
      } else {
        // 新用户：创建记录，赠送初始网费
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

        await db.collection('users').add({
          data: {
            _openid: openid,
            avatarName: userData.username || 'Admin',
            createTime: db.serverDate(),
            lastLoginTime: db.serverDate(),
            settings: { theme: 'win98' },
            // 双代币系统
            coins: 0,             // 时光币（通过彩蛋获得）
            netFee: 43200,         // 网费：初始30天（30 * 1440 = 43200分钟）
            badges: [],            // 彩蛋徽章收集
            eggStats: {
              totalDiscovered: 0,
              totalEarned: 0,      // 累计获得时光币
              daysUsed: 1,         // 第一天也算使用
              lastDailyDate: todayStr
            }
          }
        });
        return {
          success: true,
          isNew: true,
          openid,
          coins: 0,
          netFee: 43200,
          daysUsed: 1,
          dailyDeducted: true
        };
      }
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 💰 获取用户余额（时光币 + 网费）
  if (type === 'getBalance') {
    try {
      const res = await db.collection('users').where({
        _openid: openid
      }).field({
        coins: true,
        netFee: true,
        badges: true,
        eggStats: true
      }).get();

      if (res.data.length === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      return {
        success: true,
        coins: res.data[0].coins || 0,
        netFee: res.data[0].netFee || 0,
        badges: res.data[0].badges || [],
        eggStats: res.data[0].eggStats || { totalDiscovered: 0, totalEarned: 0, daysUsed: 0 }
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 💰 增加时光币（彩蛋奖励）
  if (type === 'addCoins') {
    try {
      const updateRes = await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          coins: _.inc(amount),
          'eggStats.totalEarned': _.inc(amount),
          lastUpdateTime: db.serverDate()
        }
      });

      if (updateRes.stats.updated === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      return { success: true, coins: amount };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🌐 兑换网费（时光币 → 网费）
  if (type === 'exchangeNetFee') {
    try {
      // 查询当前余额
      const res = await db.collection('users').where({
        _openid: openid
      }).field({ coins: true, netFee: true }).get();

      if (res.data.length === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      const currentCoins = res.data[0].coins || 0;

      // 检查时光币是否足够
      if (currentCoins < amount) {
        return {
          success: false,
          errMsg: '时光币不足',
          insufficient: true,
          currentCoins,
          required: amount
        };
      }

      // 兑换：时光币 → 网费（1:1兑换）
      // amount 是要兑换的分钟数
      const exchangeRate = 1; // 1时光币 = 1分钟网费
      const coinsNeeded = amount * exchangeRate;
      const netFeeToAdd = amount;

      await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          coins: _.inc(-coinsNeeded),
          netFee: _.inc(netFeeToAdd),
          lastUpdateTime: db.serverDate()
        }
      });

      return {
        success: true,
        exchanged: amount,
        coinsDeducted: coinsNeeded,
        remainingCoins: currentCoins - coinsNeeded,
        newNetFee: (res.data[0].netFee || 0) + netFeeToAdd
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🌐 扣除网费（AI功能使用）
  if (type === 'deductNetFee') {
    try {
      const res = await db.collection('users').where({
        _openid: openid
      }).field({ netFee: true }).get();

      if (res.data.length === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      const currentNetFee = res.data[0].netFee || 0;

      if (currentNetFee < amount) {
        return {
          success: false,
          errMsg: '网费不足，请通过网管系统兑换',
          insufficient: true,
          currentNetFee
        };
      }

      const updateRes = await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          netFee: _.inc(-amount),
          lastUpdateTime: db.serverDate()
        }
      });

      if (updateRes.stats.updated === 0) {
        return { success: false, errMsg: '扣除失败' };
      }

      return {
        success: true,
        deducted: amount,
        remainingNetFee: currentNetFee - amount
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🥚 获取用户彩蛋数据
  if (type === 'getEggs') {
    try {
      const res = await db.collection('users').where({
        _openid: openid
      }).field({
        badges: true,
        eggStats: true
      }).get();

      if (res.data.length === 0) {
        return {
          success: true,
          data: {
            badges: [],
            stats: { totalDiscovered: 0, totalEarned: 0, daysUsed: 0 }
          }
        };
      }

      return {
        success: true,
        data: {
          badges: res.data[0].badges || [],
          stats: res.data[0].eggStats || { totalDiscovered: 0, totalEarned: 0, daysUsed: 0 }
        }
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🥚 发现新彩蛋
  if (type === 'discoverEgg') {
    try {
      // 检查是否已经发现过（通过badge字段）
      const userRes = await db.collection('users').where({
        _openid: openid
      }).field({ badges: true }).get();

      if (userRes.data.length === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      const badges = userRes.data[0].badges || [];
      const reward = eggData?.reward || {};
      const badgeName = reward.badge || '';

      // 检查徽章是否已存在
      if (badgeName && badges.some(b => b.name === badgeName)) {
        return { success: true, isNew: false };
      }

      // 获取时光币奖励
      const coinsReward = reward.coins || 0;

      // 原子操作：添加徽章 + 增加时光币 + 更新统计
      const updateData = {
        'eggStats.totalDiscovered': _.inc(1),
        'eggStats.totalEarned': _.inc(coinsReward)
      };

      if (coinsReward > 0) {
        updateData.coins = _.inc(coinsReward);
      }

      if (badgeName) {
        updateData.badges = _.push({
          name: badgeName,
          eggId: eggId,
          discoveredAt: db.serverDate()
        });
      }

      const updateRes = await db.collection('users').where({
        _openid: openid
      }).update({
        data: updateData
      });

      if (updateRes.stats.updated === 0) {
        return { success: false, errMsg: '更新失败' };
      }

      return { success: true, isNew: true, reward: reward };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  return { success: false, errMsg: 'Unknown type' };
};
