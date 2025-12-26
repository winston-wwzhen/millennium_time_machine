import { callCloudFunction } from './cloudbase'

export async function getUsers(params = {}) {
  try {
    const result = await callCloudFunction('admin-users', params)
    return result.data || { list: [], total: 0 }
  } catch (error) {
    // 开发环境模拟数据
    const mockList = []
    for (let i = 1; i <= 20; i++) {
      mockList.push({
        nickname: `User${String(i).padStart(8, '0')}AB`,
        level: Math.floor(Math.random() * 30) + 1,
        qpoints: Math.floor(Math.random() * 5000),
        createdAt: `2025-12-${String(Math.floor(Math.random() * 25) + 1).padStart(2, '0')}`,
        lastActive: `${Math.floor(Math.random() * 24)}小时前`
      })
    }
    return {
      list: mockList,
      total: 12345
    }
  }
}
