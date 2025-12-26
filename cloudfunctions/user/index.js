const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID; // 用户的唯一标识
  const { type, userData, eggId, eggData } = event;

  // 🚪 登录/注册逻辑
  if (type === 'login') {
    try {
      // 1. 先查查这个用户存在不
      const res = await db.collection('users').where({
        _openid: openid
      }).get();

      if (res.data.length > 0) {
        // A. 老用户：更新最后登录时间
        await db.collection('users').doc(res.data[0]._id).update({
          data: {
            lastLoginTime: db.serverDate(),
            avatarName: userData.username // 更新用户设置的昵称
          }
        });
        return { success: true, isNew: false, openid };
      } else {
        // B. 新用户：创建记录
        await db.collection('users').add({
          data: {
            _openid: openid,
            avatarName: userData.username || 'Admin', // 默认叫 Admin
            createTime: db.serverDate(),
            lastLoginTime: db.serverDate(),
            settings: { theme: 'win98' } // 预留配置项
          }
        });
        return { success: true, isNew: true, openid };
      }
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🥚 获取用户彩蛋数据
  if (type === 'getEggs') {
    try {
      const res = await db.collection('user_eggs').where({
        _openid: openid
      }).get();

      if (res.data.length === 0) {
        // 新用户，返回空数据
        return {
          success: true,
          data: {
            discovered: [],
            counters: {},
            stats: { totalDiscovered: 0, totalQpoints: 0 }
          }
        };
      }

      return { success: true, data: res.data[0] };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🥚 发现新彩蛋
  if (type === 'discoverEgg') {
    try {
      const collection = db.collection('user_eggs');

      // 检查是否已经发现过
      const existing = await collection.where({
        _openid: openid,
        'discoveredEggs.eggId': eggId
      }).get();

      if (existing.data.length > 0) {
        // 已经发现过
        return { success: true, isNew: false };
      }

      // 获取彩蛋配置中的奖励信息
      const qpoints = eggData?.reward?.qpoints || 0;
      const badge = eggData?.reward?.badge || '';

      // 使用原子操作更新：添加到已发现列表
      const updateRes = await collection.where({
        _openid: openid
      }).update({
        data: {
          discoveredEggs: _.push({
            eggId: eggId,
            discoveredAt: db.serverDate(),
            qpoints: qpoints,
            badge: badge
          }),
          'stats.totalDiscovered': _.inc(1),
          'stats.totalQpoints': _.inc(qpoints),
          lastUpdateTime: db.serverDate()
        }
      });

      // 如果没有更新任何记录，说明用户还没有彩蛋数据，需要创建
      if (updateRes.stats.updated === 0) {
        await collection.add({
          data: {
            _openid: openid,
            discoveredEggs: [{
              eggId: eggId,
              discoveredAt: db.serverDate(),
              qpoints: qpoints,
              badge: badge
            }],
            counters: {},
            stats: {
              totalDiscovered: 1,
              totalQpoints: qpoints
            },
            createTime: db.serverDate(),
            lastUpdateTime: db.serverDate()
          }
        });
      }

      return { success: true, isNew: true, reward: eggData?.reward };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🥚 更新彩蛋计数器
  if (type === 'updateCounter') {
    try {
      const { eggId, count } = eggData;

      const updateRes = await db.collection('user_eggs').where({
        _openid: openid
      }).update({
        data: {
          [`counters.${eggId}`]: count,
          lastUpdateTime: db.serverDate()
        }
      });

      // 如果没有更新任何记录，创建新记录
      if (updateRes.stats.updated === 0) {
        await db.collection('user_eggs').add({
          data: {
            _openid: openid,
            discoveredEggs: [],
            counters: {
              [eggId]: count
            },
            stats: {
              totalDiscovered: 0,
              totalQpoints: 0
            },
            createTime: db.serverDate(),
            lastUpdateTime: db.serverDate()
          }
        });
      }

      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🥚 重置彩蛋计数器
  if (type === 'resetCounter') {
    try {
      const { eggId } = eggData;

      await db.collection('user_eggs').where({
        _openid: openid
      }).update({
        data: {
          [`counters.${eggId}`]: 0,
          lastUpdateTime: db.serverDate()
        }
      });

      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  return { success: false, errMsg: 'Unknown type' };
};