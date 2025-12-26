import { callCloudFunction } from './cloudbase'

export async function login(username, password) {
  try {
    // 先调用云函数验证
    const result = await callCloudFunction('admin-login', {
      username,
      password
    })
    return result
  } catch (error) {
    // 开发环境模拟登录
    if (username === 'admin' && password === 'admin123') {
      return {
        code: 0,
        data: {
          token: btoa(`${username}_${Date.now()}`),
          userInfo: {
            username,
            role: 'admin'
          }
        }
      }
    }
    throw error
  }
}

export function logout() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
}
