import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.weixin.qq.com'
const ENV_ID = import.meta.env.VITE_CLOUDBASE_ENV_ID
const ACCESS_TOKEN = import.meta.env.VITE_CLOUDBASE_ACCESS_TOKEN

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000
})

// 调用云函数
async function callCloudFunction(name, data = {}) {
  try {
    const response = await api.post('/tcb/invokecloudfunction', {
      env: ENV_ID,
      name: name,
      query_string: JSON.stringify(data)
    }, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    })

    if (response.data.errcode === 0) {
      return JSON.parse(response.data.data.resp_data)
    } else {
      throw new Error(response.data.errmsg)
    }
  } catch (error) {
    console.error('调用云函数失败:', error)
    throw error
  }
}

export { callCloudFunction }
