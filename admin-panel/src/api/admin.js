import { callCloudFunction } from './cloudbase'

const USE_MOCK_DATA = false

// ==================== 统计数据 ====================

/**
 * 获取数据看板统计
 */
export async function getDashboardStats() {
  if (USE_MOCK_DATA) {
    return {
      users: { total: 12345, todayNew: 123, growth: 15 },
      qcio: { total: 12300, todayActive: 234 },
      chats: { total: 45678, today: 567 },
      visits: { total: 3456, today: 123 },
      eggs: { totalDiscovered: 2345, todayDiscovered: 45 },
      currency: { totalCoins: 123456, totalNetFee: 345678 },
      moodGarden: 789
    }
  }

  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getDashboardStats'
    })
    return result.data
  } catch (error) {
    console.error('获取统计数据失败:', error)
    throw error
  }
}

/**
 * 获取增长趋势
 */
export async function getGrowthTrend(days = 7) {
  if (USE_MOCK_DATA) {
    const trends = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      trends.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        newUsers: Math.floor(Math.random() * 100),
        activeUsers: Math.floor(Math.random() * 500),
        newChats: Math.floor(Math.random() * 200),
        newVisits: Math.floor(Math.random() * 50)
      })
    }
    return trends
  }

  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getGrowthTrend',
      data: { days }
    })
    return result.data
  } catch (error) {
    console.error('获取增长趋势失败:', error)
    return []
  }
}

// ==================== 用户管理 ====================

/**
 * 获取用户列表
 */
export async function getUserList(params) {
  if (USE_MOCK_DATA) {
    return {
      list: Array(20).fill(null).map((_, i) => ({
        _openid: `mock_openid_${i}`,
        nickname: `测试用户${i + 1}`,
        coins: Math.floor(Math.random() * 10000),
        netFee: Math.floor(Math.random() * 50000),
        createTime: new Date().toISOString()
      })),
      total: 100,
      page: 1,
      limit: 20
    }
  }

  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getUserList',
      data: params
    })
    return result.data
  } catch (error) {
    console.error('获取用户列表失败:', error)
    throw error
  }
}

/**
 * 获取用户详情
 */
export async function getUserDetail(openid) {
  if (USE_MOCK_DATA) {
    return {
      user: {
        _openid: 'mock_openid',
        nickname: '测试用户',
        coins: 5000,
        netFee: 30000,
        eggStats: { eggsDiscovered: 15 }
      },
      qcioUser: {
        qcio_id: '12345',
        nickname: '测试用户',
        avatar: '',
        level: 10
      },
      qcioWallet: {
        gold: 1000,
        qpoints: 500
      },
      transactions: [],
      activities: []
    }
  }

  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getUserDetail',
      data: { openid }
    })
    return result.data
  } catch (error) {
    console.error('获取用户详情失败:', error)
    throw error
  }
}

/**
 * 获取用户交易记录
 */
export async function getUserTransactions(params) {
  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getUserTransactions',
      data: params
    })
    return result.data
  } catch (error) {
    console.error('获取交易记录失败:', error)
    throw error
  }
}

// ==================== 彩蛋管理 ====================

/**
 * 获取彩蛋统计
 */
export async function getEggStats() {
  if (USE_MOCK_DATA) {
    return {
      totalUsers: 100,
      totalDiscovered: 500,
      byRarity: {
        common: { count: 300, users: 80 },
        rare: { count: 150, users: 40 },
        epic: { count: 40, users: 15 },
        legendary: { count: 10, users: 5 }
      },
      topEggs: [
        { id: 'lion_dance', name: '舞狮少年', count: 50, rarity: 'common' },
        { id: 'konami_code', name: '秘籍高手', count: 5, rarity: 'legendary' }
      ]
    }
  }

  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getEggStats'
    })
    return result.data
  } catch (error) {
    console.error('获取彩蛋统计失败:', error)
    throw error
  }
}

/**
 * 获取彩蛋排行榜
 */
export async function getEggRankings(limit = 20) {
  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getEggRankings',
      data: { limit }
    })
    return result.data
  } catch (error) {
    console.error('获取彩蛋排行榜失败:', error)
    throw error
  }
}

/**
 * 获取彩蛋发现历史
 */
export async function getEggDiscoveryHistory(params) {
  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getEggDiscoveryHistory',
      data: params
    })
    return result.data
  } catch (error) {
    console.error('获取彩蛋发现历史失败:', error)
    throw error
  }
}

// ==================== QCIO 数据管理 ====================

/**
 * 获取 QCIO 用户列表
 */
export async function getQCIOUserList(params) {
  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getQCIOUserList',
      data: params
    })
    return result.data
  } catch (error) {
    console.error('获取 QCIO 用户列表失败:', error)
    throw error
  }
}

/**
 * 获取 QCIO 用户详情
 */
export async function getQCIOUserDetail(qcioId) {
  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getQCIOUserDetail',
      data: { qcioId }
    })
    return result.data
  } catch (error) {
    console.error('获取 QCIO 用户详情失败:', error)
    throw error
  }
}

/**
 * 获取农场统计
 */
export async function getFarmStats() {
  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getFarmStats'
    })
    return result.data
  } catch (error) {
    console.error('获取农场统计失败:', error)
    throw error
  }
}

/**
 * 获取农场日志
 */
export async function getFarmLogs(params) {
  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getFarmLogs',
      data: params
    })
    return result.data
  } catch (error) {
    console.error('获取农场日志失败:', error)
    throw error
  }
}

// ==================== 聊天记录 ====================

/**
 * 获取私聊历史
 */
export async function getChatHistory(params) {
  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getChatHistory',
      data: params
    })
    return result.data
  } catch (error) {
    console.error('获取私聊历史失败:', error)
    throw error
  }
}

/**
 * 获取群聊历史
 */
export async function getGroupChatHistory(params) {
  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getGroupChatHistory',
      data: params
    })
    return result.data
  } catch (error) {
    console.error('获取群聊历史失败:', error)
    throw error
  }
}

// ==================== 访问统计 ====================

/**
 * 获取访问统计
 */
export async function getVisitStats() {
  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getVisitStats'
    })
    return result.data
  } catch (error) {
    console.error('获取访问统计失败:', error)
    throw error
  }
}

/**
 * 获取访问历史
 */
export async function getVisitHistory(params) {
  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getVisitHistory',
      data: params
    })
    return result.data
  } catch (error) {
    console.error('获取访问历史失败:', error)
    throw error
  }
}

// ==================== 数据导出 ====================

/**
 * 导出用户数据
 */
export async function exportUsers() {
  try {
    const result = await callCloudFunction('myadmin', {
      action: 'exportUsers'
    })
    return result.data
  } catch (error) {
    console.error('导出用户数据失败:', error)
    throw error
  }
}

/**
 * 导出交易记录
 */
export async function exportTransactions(params) {
  try {
    const result = await callCloudFunction('myadmin', {
      action: 'exportTransactions',
      data: params
    })
    return result.data
  } catch (error) {
    console.error('导出交易记录失败:', error)
    throw error
  }
}

/**
 * 导出彩蛋数据
 */
export async function exportEggs() {
  try {
    const result = await callCloudFunction('myadmin', {
      action: 'exportEggs'
    })
    return result.data
  } catch (error) {
    console.error('导出彩蛋数据失败:', error)
    throw error
  }
}

// ==================== 活动日志 ====================

/**
 * 获取活动日志
 */
export async function getActivityLogs(params) {
  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getActivityLogs',
      data: params
    })
    return result.data
  } catch (error) {
    console.error('获取活动日志失败:', error)
    throw error
  }
}

/**
 * 获取最近活动
 */
export async function getRecentActivity(limit = 50) {
  if (USE_MOCK_DATA) {
    return Array(10).fill(null).map((_, i) => ({
      _openid: `mock_${i}`,
      action: 'egg_discovered',
      createdAt: new Date().toISOString(),
      data: {
        egg: { name: '测试彩蛋', rarity: 'common' }
      }
    }))
  }

  try {
    const result = await callCloudFunction('myadmin', {
      action: 'getRecentActivity',
      data: { limit }
    })
    return result.data
  } catch (error) {
    console.error('获取最近活动失败:', error)
    return []
  }
}
