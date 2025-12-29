/**
 * 清空数据库云函数
 * 用于测试时一键清空所有集合数据
 * 警告：此操作不可逆！
 */
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

// 需要清空的所有集合
const COLLECTIONS = [
  // 用户系统
  'users',
  'user_transactions',
  'user_activity_logs',
  'user_photos',
  'user_shares',
  'user_share_visits',

  // QCIO社交系统
  'qcio_users',
  'qcio_wallet',
  'qcio_transactions',
  'qcio_daily_tasks',
  'qcio_achievements',
  'qcio_user_achievements',
  'qcio_mood_logs',
  'qcio_guestbook',
  'qcio_experience_logs',
  'qcio_user_level_rewards',
  'qcio_visit_stats',
  // 农场系统
  'qcio_farm_profiles',
  'qcio_farm_plots',
  'qcio_farm_inventory',
  'qcio_farm_logs',
  // VIP系统
  'qcio_vip_codes',
  'qcio_vip_records',

  // AI联系人和群组
  'qcio_ai_contacts',
  'qcio_groups',
  'qcio_chat_history',
  'qcio_group_chat_history',

  // 心情农场游戏
  'mood_garden',

  // 如果当时游戏
  'ifthen_endings',
  'ifthen_shares',
  'ifthen_play_history',
  'ifthen_share_visits',
];

/**
 * 清空单个集合（删除所有数据）
 * 微信云数据库不支持直接删除集合，只能删除所有记录
 */
async function clearCollection(collectionName) {
  try {
    // 先获取集合中的记录数量
    const countResult = await db.collection(collectionName).count();
    const total = countResult.total || 0;

    if (total === 0) {
      return {
        success: true,
        collection: collectionName,
        deleted: 0,
        message: '集合已为空'
      };
    }

    let deleted = 0;
    let hasMore = true;
    const limit = 100; // 每次最多删除100条

    // 循环删除，直到清空
    while (hasMore) {
      // 获取一批数据
      const res = await db.collection(collectionName)
        .limit(limit)
        .get();

      if (res.data.length === 0) {
        hasMore = false;
        break;
      }

      // 批量删除
      for (const doc of res.data) {
        try {
          await db.collection(collectionName).doc(doc._id).remove();
          deleted++;
        } catch (err) {
          // 单条删除失败继续下一条
          console.error(`删除记录失败 [${collectionName}/${doc._id}]:`, err);
        }
      }

      // 如果返回数量小于 limit，说明已经删完了
      if (res.data.length < limit) {
        hasMore = false;
      }
    }

    return {
      success: true,
      collection: collectionName,
      deleted: deleted,
      message: `成功删除 ${deleted} 条记录`
    };
  } catch (err) {
    return {
      success: false,
      collection: collectionName,
      deleted: 0,
      error: err.errMsg || err.message
    };
  }
}

/**
 * 检查集合是否为空
 */
async function checkCollectionEmpty(collectionName) {
  try {
    const countResult = await db.collection(collectionName).count();
    return {
      collection: collectionName,
      total: countResult.total || 0,
      empty: (countResult.total || 0) === 0
    };
  } catch (err) {
    return {
      collection: collectionName,
      total: -1,
      empty: false,
      error: err.errMsg || err.message
    };
  }
}

// 云函数入口
exports.main = async (event, context) => {
  const { action = 'clear', confirm = false, collections = [] } = event;

  if (action === 'check') {
    // 检查所有集合的状态
    const results = [];
    let totalRecords = 0;

    for (const colName of COLLECTIONS) {
      const result = await checkCollectionEmpty(colName);
      results.push(result);
      if (result.total > 0) {
        totalRecords += result.total;
      }
    }

    return {
      success: true,
      action: 'check',
      totalCollections: COLLECTIONS.length,
      totalRecords: totalRecords,
      collections: results
    };
  }

  if (action === 'clear') {
    // 安全检查：需要明确确认
    if (!confirm) {
      return {
        success: false,
        message: '危险操作！请设置 confirm=true 来确认清空所有数据库',
        warning: '此操作将删除所有数据且不可恢复！'
      };
    }

    // 如果指定了集合列表，只清空指定的集合
    const targetCollections = collections.length > 0 ? collections : COLLECTIONS;

    const results = [];
    let totalDeleted = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const colName of targetCollections) {
      // 检查集合是否在列表中
      if (!COLLECTIONS.includes(colName)) {
        results.push({
          success: false,
          collection: colName,
          message: '集合不在允许的列表中'
        });
        errorCount++;
        continue;
      }

      const result = await clearCollection(colName);
      results.push(result);

      if (result.success) {
        successCount++;
        totalDeleted += result.deleted;
      } else {
        errorCount++;
      }
    }

    return {
      success: true,
      action: 'clear',
      summary: {
        totalCollections: targetCollections.length,
        success: successCount,
        errors: errorCount,
        totalDeleted: totalDeleted
      },
      details: results,
      timestamp: new Date().toISOString()
    };
  }

  return {
    success: false,
    message: '未知操作，请使用 action=clear 或 action=check'
  };
};
