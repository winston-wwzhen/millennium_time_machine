// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { type } = event

  try {
    switch (type) {
      case 'all':
        return await getAllStats()
      case 'rankings':
        return await getRankings()
      case 'users':
        return await getUserList(event.page || 1, event.limit || 20)
      default:
        return { error: '无效的请求类型' }
    }
  } catch (error) {
    console.error('admin-stats 错误:', error)
    return { error: error.message }
  }
}

// 获取所有统计数据
async function getAllStats() {
  // 获取总用户数
  const userCount = await db.collection('qcio_users').count()

  // 获取今日活跃用户（简化处理：返回最近更新的用户）
  const todayActive = await db.collection('qcio_users')
    .where({
      updateTime: db.command.gte(new Date(new Date().setHours(0, 0, 0, 0)))
    })
    .count()

  return {
    data: {
      totalUsers: userCount.total || 0,
      todayActive: todayActive.total || 0,
      gameCompleted: 0,
      todayShares: 0,
      usersGrowth: 0,
      activeGrowth: 0,
      gameGrowth: 0,
      shareGrowth: 0
    }
  }
}

// 获取排行榜数据
async function getRankings() {
  // 等级排行榜
  const levelResult = await db.collection('qcio_users')
    .orderBy('level', 'desc')
    .limit(10)
    .get()

  // Q点排行榜
  const qpointsResult = await db.collection('qcio_wallet')
    .orderBy('qpoints', 'desc')
    .limit(10)
    .get()

  return {
    data: {
      level: levelResult.data || [],
      qpoints: qpointsResult.data || [],
      eggs: []
    }
  }
}

// 获取用户列表
async function getUserList(page = 1, limit = 20) {
  const skip = (page - 1) * limit

  const result = await db.collection('qcio_users')
    .orderBy('updateTime', 'desc')
    .skip(skip)
    .limit(limit)
    .get()

  return {
    data: {
      list: result.data || [],
      total: result.data.length,
      page: page,
      limit: limit
    }
  }
}
