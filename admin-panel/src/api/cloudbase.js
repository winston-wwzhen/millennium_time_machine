import axios from 'axios'

const ENV_ID = import.meta.env.VITE_CLOUDBASE_ENV_ID

// 创建axios实例 - 调用本地API代理
const api = axios.create({
  baseURL: '/api',
  timeout: 30000
})

// 调用云函数
async function callCloudFunction(name, data = {}) {
  try {
    const response = await api.post('/tcb/invokecloudfunction', {
      name: name,
      query_string: JSON.stringify(data)
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
