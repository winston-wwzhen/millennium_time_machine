import { callCloudFunction } from './cloudbase'

// 临时使用模拟数据（云函数部署后改为调用 API）
const USE_MOCK_DATA = false

export async function getStats() {
  if (USE_MOCK_DATA) {
    return {
      totalUsers: 12345,
      todayActive: 1234,
      gameCompleted: 456,
      todayShares: 789,
      usersGrowth: 15,
      activeGrowth: 12,
      gameGrowth: 8,
      shareGrowth: 20
    }
  }

  try {
    const result = await callCloudFunction('admin-stats', {
      type: 'all'
    })
    return result.data || {}
  } catch (error) {
    console.error('获取统计数据失败:', error)
    return {
      totalUsers: 0,
      todayActive: 0,
      gameCompleted: 0,
      todayShares: 0
    }
  }
}

export async function getRankings() {
  if (USE_MOCK_DATA) {
    return {
      level: [
        { nickname: '葬爱杀杀', level: 28, qpoints: 5230 },
        { nickname: '忧伤王子', level: 25, qpoints: 4100 },
        { nickname: '轻舞飞扬', level: 24, qpoints: 3800 }
      ],
      qpoints: [
        { nickname: '葬爱杀杀', qpoints: 5230, level: 28 },
        { nickname: '忧伤王子', qpoints: 4100, level: 25 }
      ],
      eggs: [
        { nickname: '葬爱杀杀', eggCount: 75, level: 28 },
        { nickname: '网管小哥', eggCount: 68, level: 22 }
      ]
    }
  }

  try {
    const result = await callCloudFunction('admin-stats', {
      type: 'rankings'
    })
    return result.data || {}
  } catch (error) {
    console.error('获取排行榜失败:', error)
    return { level: [], qpoints: [], eggs: [] }
  }
}
