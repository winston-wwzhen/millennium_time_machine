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
    console.log('🔵 调用云函数:', name, data)

    const response = await api.post('/tcb/invokecloudfunction', {
      name: name,
      // 直接传递 data 对象，server.js 会处理 JSON.stringify
      funcData: data
    })

    console.log('🟢 云函数响应:', response.data)

    if (response.data.errcode === 0) {
      const respData = response.data.resp_data  // 注意:微信HTTP API返回的是 resp_data 不是 data
      // resp_data 可能是字符串或对象
      if (typeof respData === 'string') {
        return JSON.parse(respData)
      }
      return respData
    } else {
      console.error('❌ 云函数错误:', response.data.errcode, response.data.errmsg)
      throw new Error(response.data.errmsg || `云函数调用失败 (${response.data.errcode})`)
    }
  } catch (error) {
    console.error('❌ 调用云函数失败:', error)
    throw error
  }
}

export { callCloudFunction }
