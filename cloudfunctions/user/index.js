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
        // 老用户：更新最后登录时间
        await db.collection('users').doc(res.data[0]._id).update({
          data: {
            lastLoginTime: db.serverDate(),
            avatarName: userData.username
          }
        });
        return { success: true, isNew: false, openid };
      } else {
        // 新用户：创建记录，赠送初始网费
        await db.collection('users').add({
          data: {
            _openid: openid,
            avatarName: userData.username || 'Admin',
            createTime: db.serverDate(),
            lastLoginTime: db.serverDate(),
            settings: { theme: 'win98' },
            // 网费系统
            coins: 500,  // 赠送500分网费（超过8小时，基本用不完）
            badges: [], // 彩蛋徽章收集
            eggStats: {
              totalDiscovered: 0,
              totalEarned: 0  // 累计获得网费
            }
          }
        });
        return { success: true, isNew: true, openid, coins: 500 };
      }
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 💰 获取用户网费余额
  if (type === 'getBalance') {
    try {
      const res = await db.collection('users').where({
        _openid: openid
      }).field({
        coins: true,
        badges: true,
        eggStats: true
      }).get();

      if (res.data.length === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      return {
        success: true,
        coins: res.data[0].coins || 0,
        badges: res.data[0].badges || [],
        eggStats: res.data[0].eggStats || { totalDiscovered: 0, totalEarned: 0 }
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 💰 增加网费（彩蛋奖励）
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

  // 💰 扣除网费（使用网络功能）
  if (type === 'deductCoins') {
    try {
      // 先查询余额是否足够
      const res = await db.collection('users').where({
        _openid: openid
      }).field({ coins: true }).get();

      if (res.data.length === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      const currentCoins = res.data[0].coins || 0;

      if (currentCoins < amount) {
        return { success: false, errMsg: '网费不足', insufficient: true, currentCoins };
      }

      // 余额足够，执行扣除
      const updateRes = await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          coins: _.inc(-amount),
          lastUpdateTime: db.serverDate()
        }
      });

      if (updateRes.stats.updated === 0) {
        return { success: false, errMsg: '扣除失败' };
      }

      return { success: true, deducted: amount, remainingCoins: currentCoins - amount };
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
            stats: { totalDiscovered: 0, totalEarned: 0 }
          }
        };
      }

      return {
        success: true,
        data: {
          badges: res.data[0].badges || [],
          stats: res.data[0].eggStats || { totalDiscovered: 0, totalEarned: 0 }
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

      // 获取网费奖励
      const coinsReward = reward.coins || 0;

      // 原子操作：添加徽章 + 增加网费 + 更新统计
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
