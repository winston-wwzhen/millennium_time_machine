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
    case 'recordShare':
      return await recordShare(OPENID, event);
    case 'getShareReward':
      return await getShareReward(OPENID);
    case 'recordShareVisit':
      return await recordShareVisit(event);
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
  const { endingId, birthYear, gender, avatarName, finalAttributes, playTime, playDuration, currentYear, finalAge } = data;

  try {
    // 检查用户是否已获得过该结局
    const existingResult = await db.collection('ifthen_endings')
      .where({
        _openid: openid,
        endingId: endingId
      })
      .get();

    const isFirstTime = existingResult.data.length === 0;

    // 保存本次游玩记录（包含游戏相关信息）
    // 显式设置 _openid 字段以确保数据正确关联
    await db.collection('ifthen_play_history').add({
      data: {
        _openid: openid,
        endingId,
        birthYear,
        gender,
        avatarName: avatarName || 'Admin',
        finalAttributes,
        playTime,
        playDuration: playDuration || 0,
        currentYear: currentYear || 2005,
        finalAge: finalAge || 15,
        createTime: db.serverDate()
      }
    });

    // 如果是第一次获得该结局，添加到结局收集
    if (isFirstTime) {
      await db.collection('ifthen_endings').add({
        data: {
          _openid: openid,
          endingId,
          birthYear,
          gender,
          finalAttributes,
          firstGetTime: db.serverDate(),
          playDuration: playDuration || 0,
          currentYear: currentYear || 2005,
          finalAge: finalAge || 15
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

    // 统计各类型结局数量（从云函数目录读取）
    const endingsData = require('./ifthen-endings.js');
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

/**
 * 记录分享行为
 */
async function recordShare(openid, data) {
  const { endingId, shareType = 'ending' } = data;

  try {
    // 检查用户是否已分享过该结局
    const existingResult = await db.collection('ifthen_shares')
      .where({
        _openid: openid,
        endingId: endingId
      })
      .get();

    const isFirstShare = existingResult.data.length === 0;

    // 记录分享行为
    await db.collection('ifthen_shares').add({
      data: {
        _openid: openid,
        endingId,
        shareType,
        shareTime: db.serverDate(),
        visitCount: 0
      }
    });

    // 如果是首次分享，奖励Q点
    let reward = 0;
    if (isFirstShare) {
      reward = 5; // 首次分享奖励5Q点

      // 更新QCIO钱包
      await cloud.callFunction({
        name: 'qcio',
        data: {
          action: 'addQpoints',
          amount: reward,
          reason: '首次分享结局'
        }
      }).catch(err => {
        console.error('奖励Q点失败:', err);
      });
    }

    return {
      success: true,
      isFirstShare,
      reward,
      message: isFirstShare ? `首次分享成功！获得${reward}Q点奖励` : '分享成功！'
    };
  } catch (err) {
    console.error('记录分享失败:', err);
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * 获取分享奖励
 */
async function getShareReward(openid) {
  try {
    // 获取用户所有分享记录
    const sharesResult = await db.collection('ifthen_shares')
      .where({ _openid: openid })
      .get();

    // 统计不同结局的分享次数（首次分享才计数）
    const uniqueEndings = new Set();
    let totalVisits = 0;

    sharesResult.data.forEach(record => {
      uniqueEndings.add(record.endingId);
      totalVisits += record.visitCount || 0;
    });

    // 计算奖励
    const baseReward = uniqueEndings.size * 5; // 每个结局首次分享5Q点
    const visitReward = Math.floor(totalVisits / 5) * 2; // 每5个访问奖励2Q点
    const totalReward = baseReward + visitReward;

    return {
      success: true,
      stats: {
        uniqueEndings: uniqueEndings.size,
        totalShares: sharesResult.data.length,
        totalVisits,
        totalReward
      }
    };
  } catch (err) {
    console.error('获取分享奖励失败:', err);
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * 记录分享链接访问（回流追踪）
 */
async function recordShareVisit(data) {
  const { shareId, endingId } = data;
  const wxContext = cloud.getWXContext();
  const visitorOpenid = wxContext.OPENID;

  try {
    // 更新分享记录的访问计数
    if (shareId) {
      await db.collection('ifthen_shares')
        .doc(shareId)
        .update({
          data: {
            visitCount: _.inc(1)
          }
        });
    }

    // 记录访问日志
    await db.collection('ifthen_share_visits').add({
      data: {
        _openid: visitorOpenid,
        shareId,
        endingId,
        visitorOpenid,
        visitTime: db.serverDate()
      }
    });

    // 如果访问者不是分享者，奖励分享者
    if (shareId) {
      const shareRecord = await db.collection('ifthen_shares')
        .doc(shareId)
        .get();

      if (shareRecord.data && shareRecord.data._openid !== visitorOpenid) {
        // 每5个访问奖励2Q点
        const visitCount = (shareRecord.data.visitCount || 0) + 1;
        if (visitCount % 5 === 0) {
          await cloud.callFunction({
            name: 'qcio',
            data: {
              action: 'addQpoints',
              openid: shareRecord.data._openid,
              amount: 2,
              reason: '分享回流奖励'
            }
          }).catch(err => {
            console.error('回流奖励失败:', err);
          });
        }
      }
    }

    return {
      success: true
    };
  } catch (err) {
    console.error('记录访问失败:', err);
    return {
      success: false,
      error: err.message
    };
  }
}
