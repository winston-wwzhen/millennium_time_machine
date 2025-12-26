import { callCloudFunction } from './cloudbase'

export async function getStats() {
  try {
    const result = await callCloudFunction('admin-stats', {
      type: 'all'
    })
    return result.data || {}
  } catch (error) {
    // 开发环境模拟数据
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
}

export async function getRankings() {
  try {
    const result = await callCloudFunction('admin-stats', {
      type: 'rankings'
    })
    return result.data || {}
  } catch (error) {
    // 开发环境模拟数据
    return {
      level: [
        { nickname: 'User12345678', level: 28, qpoints: 5230 },
        { nickname: 'User87654321', level: 25, qpoints: 4100 },
        { nickname: 'User11112222', level: 24, qpoints: 3800 }
      ],
      qpoints: [
        { nickname: 'User12345678', qpoints: 5230, level: 28 },
        { nickname: 'User87654321', qpoints: 4100, level: 25 }
      ],
      eggs: [
        { nickname: 'User12345678', eggCount: 75, level: 28 },
        { nickname: 'User33334444', eggCount: 68, level: 22 }
      ]
    }
  }
}
