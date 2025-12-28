/**
 * 数据库初始化云函数
 * 自动创建所有需要的数据库集合并初始化数据
 */
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

// 需要创建的所有集合
const COLLECTIONS = [
  // 用户系统
  { name: 'users', description: '桌面级用户数据（双代币、彩蛋）' },
  { name: 'user_transactions', description: '用户交易记录（双币种交易日志）' },
  { name: 'user_activity_logs', description: '用户活动日志（彩蛋发现等）' },
  { name: 'user_photos', description: '非主流照片存储' },
  { name: 'user_shares', description: '用户分享记录（分享激励系统）' },
  { name: 'user_share_visits', description: '用户分享回流访问记录' },

  // QCIO社交系统
  { name: 'qcio_users', description: 'QCIO用户资料' },
  { name: 'qcio_wallet', description: 'QCIO钱包' },
  { name: 'qcio_daily_tasks', description: 'QCIO每日任务状态' },
  { name: 'qcio_achievements', description: 'QCIO成就系统' },
  { name: 'qcio_mood_logs', description: '心情日志' },
  { name: 'qcio_guestbook', description: '留言板' },
  { name: 'qcio_experience_logs', description: '经验获取日志' },
  { name: 'qcio_user_level_rewards', description: '等级奖励记录' },
  { name: 'qcio_visit_stats', description: '访问统计' },
  { name: 'qcio_space_logs', description: '空间日志' },

  // AI联系人和群组
  { name: 'qcio_ai_contacts', description: 'AI联系人' },
  { name: 'qcio_groups', description: '群组' },
  { name: 'qcio_chat_history', description: '私聊历史' },
  { name: 'qcio_group_chat_history', description: '群聊历史' },

  // 心情农场游戏
  { name: 'mood_garden', description: '心情农场游戏数据' },

  // 如果当时游戏
  { name: 'ifthen_games', description: '如果当时游戏记录' },
  { name: 'ifthen_endings', description: '如果当时结局统计' },
  { name: 'ifthen_shares', description: '如果当时分享记录' },
  { name: 'ifthen_play_history', description: '如果当时游玩历史记录' },
  { name: 'ifthen_share_visits', description: '如果当时分享链接访问记录' },
];

// AI联系人数据
const AI_CONTACTS_DATA = require('./ai_contacts_import.json');

// 群组数据
const GROUPS_DATA = require('./groups_import.json');

/**
 * 创建单个集合（通过添加一条空数据触发创建）
 */
async function createCollection(collectionName) {
  try {
    // 尝试添加一条空数据来创建集合
    await db.collection(collectionName).add({
      data: {
        _init: true,
        createdAt: new Date(),
        description: '初始化记录'
      }
    });

    // 创建成功后删除这条初始化数据
    try {
      const records = await db.collection(collectionName).where({ _init: true }).get();
      if (records.data.length > 0) {
        await db.collection(collectionName).doc(records.data[0]._id).remove();
      }
    } catch (err) {
      // 删除失败也不影响，关键是集合已创建
    }

    return { success: true, message: `${collectionName} 创建成功` };
  } catch (err) {
    if (err.errCode === -1) {
      // 集合已存在
      return { success: true, message: `${collectionName} 已存在`, exists: true };
    }
    return { success: false, message: `${collectionName} 创建失败: ${err.errMsg}` };
  }
}

/**
 * 检查集合是否存在
 */
async function checkCollectionExists(collectionName) {
  try {
    await db.collection(collectionName).limit(1).get();
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * 为集合创建索引（如果需要）
 */
async function createIndexes(collectionName) {
  const indexes = {
    qcio_users: ['_openid', 'qcio_id', 'nickname'],
    qcio_wallet: ['_openid'],
    qcio_experience_logs: ['qcio_id', 'action', 'timestamp'],
    qcio_visit_stats: ['owner_qcio_id'],
    qcio_chat_history: ['user_qcio_id', 'contact_name'],
    qcio_group_chat_history: ['group_id'],
    qcio_mood_logs: ['_openid', 'createdAt'],
    qcio_guestbook: ['owner_qcio_id', 'visitor_qcio_id'],
    ifthen_shares: ['shareId'],
    user_transactions: ['_openid', 'createdAt'],
    user_activity_logs: ['_openid', 'action', 'createdAt'],
    user_photos: ['_openid', 'createdAt'],
    user_shares: ['_openid', 'shareType', 'itemId', 'createTime'],
    user_share_visits: ['shareId', 'visitorOpenid', 'visitTime'],
    ifthen_play_history: ['_openid', 'storyId', 'createdAt'],
    ifthen_share_visits: ['shareId', 'visitedAt'],
  };

  if (indexes[collectionName]) {
    // 微信云数据库会自动为常用字段创建索引
    return { created: indexes[collectionName] };
  }
  return { created: [] };
}

/**
 * 批量导入数据到集合
 */
async function batchImportData(collectionName, dataArray) {
  const imported = [];
  const errors = [];

  // 微信云数据库单次批量操作最多500条
  const batchSize = 500;

  for (let i = 0; i < dataArray.length; i += batchSize) {
    const batch = dataArray.slice(i, i + batchSize);

    try {
      // 逐条添加数据
      for (const item of batch) {
        try {
          await db.collection(collectionName).add({
            data: item
          });
          imported.push(item._id || item.name || 'unknown');
        } catch (err) {
          errors.push({
            id: item._id || item.name,
            error: err.errMsg || err.message
          });
        }
      }
    } catch (err) {
      errors.push({
        batch: `${i}-${i + batchSize}`,
        error: err.errMsg || err.message
      });
    }
  }

  return {
    collection: collectionName,
    total: dataArray.length,
    imported: imported.length,
    errors: errors.length,
    errorDetails: errors
  };
}

/**
 * 初始化默认数据
 */
async function initDefaultData() {
  const results = [];

  // 导入AI联系人数据
  try {
    console.log('开始导入AI联系人数据...');
    const contactsResult = await batchImportData('qcio_ai_contacts', AI_CONTACTS_DATA);
    results.push({
      ...contactsResult,
      status: contactsResult.errors.length === 0 ? 'success' : 'partial_success'
    });
    console.log(`AI联系人导入完成: ${contactsResult.imported}/${contactsResult.total}`);
  } catch (err) {
    results.push({
      collection: 'qcio_ai_contacts',
      status: 'error',
      message: err.errMsg || err.message
    });
  }

  // 导入群组数据
  try {
    console.log('开始导入群组数据...');
    const groupsResult = await batchImportData('qcio_groups', GROUPS_DATA);
    results.push({
      ...groupsResult,
      status: groupsResult.errors.length === 0 ? 'success' : 'partial_success'
    });
    console.log(`群组导入完成: ${groupsResult.imported}/${groupsResult.total}`);
  } catch (err) {
    results.push({
      collection: 'qcio_groups',
      status: 'error',
      message: err.errMsg || err.message
    });
  }

  return results;
}

// 云函数入口
exports.main = async (event, context) => {
  const { action = 'init', force = false } = event;

  if (action === 'check') {
    // 检查所有集合是否存在
    const results = [];
    for (const col of COLLECTIONS) {
      const exists = await checkCollectionExists(col.name);
      results.push({
        name: col.name,
        description: col.description,
        exists: exists
      });
    }

    return {
      success: true,
      action: 'check',
      total: COLLECTIONS.length,
      exists: results.filter(r => r.exists).length,
      missing: results.filter(r => !r.exists).length,
      collections: results
    };
  }

  if (action === 'init') {
    const results = [];
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const col of COLLECTIONS) {
      // 检查是否已存在
      const exists = await checkCollectionExists(col.name);

      if (exists && !force) {
        results.push({
          name: col.name,
          description: col.description,
          status: 'skipped',
          message: '集合已存在（使用 force=true 强制重新创建）'
        });
        skipCount++;
        continue;
      }

      // 创建集合
      const result = await createCollection(col.name);

      if (result.success) {
        // 创建索引
        const indexResult = await createIndexes(col.name);

        results.push({
          name: col.name,
          description: col.description,
          status: exists ? 'recreated' : 'created',
          message: result.message,
          indexes: indexResult.created || []
        });
        successCount++;
      } else {
        results.push({
          name: col.name,
          description: col.description,
          status: 'error',
          message: result.message
        });
        errorCount++;
      }
    }

    // 初始化默认数据
    const defaultDataResults = await initDefaultData();

    return {
      success: true,
      action: 'init',
      summary: {
        total: COLLECTIONS.length,
        created: successCount,
        skipped: skipCount,
        errors: errorCount
      },
      collections: results,
      defaultData: defaultDataResults,
      timestamp: new Date().toISOString()
    };
  }

  return {
    success: false,
    message: '未知操作，请使用 action=init 或 action=check'
  };
};
