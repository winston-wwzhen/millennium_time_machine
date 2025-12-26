// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const OPENID = wxContext.OPENID;
  const action = event.action;

  switch (action) {
    case 'saveEnding':
      return await saveEnding(OPENID, event);
    case 'getEndingHistory':
      return await getEndingHistory(OPENID, event);
    case 'getEndingStats':
      return await getEndingStats(OPENID);
    case 'getAllEndings':
      return await getAllEndings();
    default:
      return {
        success: false,
        error: 'Invalid action'
      };
  }
};

/**
 * 保存结局到数据库
 */
async function saveEnding(openid, data) {
  const { endingId, birthYear, gender, finalAttributes, playTime } = data;

  try {
    // 检查用户是否已获得过该结局
    const existingResult = await db.collection('ifthen_endings')
      .where({
        _openid: openid,
        endingId: endingId
      })
      .get();

    const isFirstTime = existingResult.data.length === 0;

    // 保存本次游玩记录
    await db.collection('ifthen_play_history').add({
      data: {
        endingId,
        birthYear,
        gender,
        finalAttributes,
        playTime,
        createTime: db.serverDate()
      }
    });

    // 如果是第一次获得该结局，添加到结局收集
    if (isFirstTime) {
      await db.collection('ifthen_endings').add({
        data: {
          endingId,
          birthYear,
          gender,
          finalAttributes,
          firstGetTime: db.serverDate()
        }
      });
    }

    return {
      success: true,
      isFirstTime,
      message: isFirstTime ? '恭喜！解锁新结局！' : '你已经获得过这个结局了'
    };
  } catch (err) {
    console.error('保存结局失败:', err);
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * 获取用户的结局历史记录
 */
async function getEndingHistory(openid, data) {
  const { limit = 20, page = 1 } = data;

  try {
    const countResult = await db.collection('ifthen_play_history')
      .where({ _openid: openid })
      .count();

    const result = await db.collection('ifthen_play_history')
      .where({ _openid: openid })
      .orderBy('createTime', 'desc')
      .skip((page - 1) * limit)
      .limit(limit)
      .get();

    return {
      success: true,
      list: result.data,
      total: countResult.total,
      page,
      limit
    };
  } catch (err) {
    console.error('获取历史记录失败:', err);
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * 获取用户的结局统计
 */
async function getEndingStats(openid) {
  try {
    // 获取已获得的结局列表
    const endingsResult = await db.collection('ifthen_endings')
      .where({ _openid: openid })
      .get();

    // 获取总游玩次数
    const historyResult = await db.collection('ifthen_play_history')
      .where({ _openid: openid })
      .count();

    // 统计各类型结局数量
    const endingsData = require('../miniprogram/data/ifthen-endings.js');
    const typeStats = {
      special: 0,
      good: 0,
      normal: 0,
      bad: 0
    };

    endingsResult.data.forEach(record => {
      const ending = endingsData.find(e => e.id === record.endingId);
      if (ending && typeStats[ending.type] !== undefined) {
        typeStats[ending.type]++;
      }
    });

    return {
      success: true,
      stats: {
        totalEndings: endingsResult.data.length,
        totalPlays: historyResult.total,
        typeStats,
        unlockRate: ((endingsResult.data.length / endingsData.length) * 100).toFixed(1)
      }
    };
  } catch (err) {
    console.error('获取统计数据失败:', err);
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * 获取所有结局列表（用于查看收集进度）
 */
async function getAllEndings() {
  try {
    // 这里需要从前端数据文件读取
    // 由于云函数无法直接读取miniprogram目录，我们返回固定结构
    // 实际的结局数据由前端传入或存储在数据库中

    return {
      success: true,
      message: '请从前端数据文件获取结局列表'
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}
