import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import path from 'path'
import dotenv from 'dotenv'
import 'vite'

// 加载环境变量
dotenv.config()

const app = express()
const PORT = process.env.PORT || 6688
const isDev = process.env.NODE_ENV !== 'production'

// Access Token 缓存
let cachedToken = null
let tokenExpireTime = 0

// 获取 access_token
async function getAccessToken() {
  const axios = (await import('axios')).default
  const APPID = process.env.WECHAT_APPID
  const SECRET = process.env.WECHAT_APPSECRET

  // 检查缓存
  if (cachedToken && Date.now() < tokenExpireTime) {
    return cachedToken
  }

  try {
    const response = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
      params: {
        grant_type: 'client_credential',
        appid: APPID,
        secret: SECRET
      }
    })

    if (response.data.access_token) {
      cachedToken = response.data.access_token
      // 提前5分钟过期
      tokenExpireTime = Date.now() + (response.data.expires_in - 300) * 1000
      console.log('Access token 获取成功')
      return cachedToken
    } else {
      throw new Error(response.data.errmsg || '获取 access_token 失败')
    }
  } catch (error) {
    console.error('获取 access_token 失败:', error.message)
    throw error
  }
}

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// 解析 JSON
app.use(express.json())

// API 代理到微信云开发
app.use('/api', async (req, res) => {
  try {
    const axios = (await import('axios')).default
    const API_BASE = process.env.API_BASE || 'https://api.weixin.qq.com'
    const ENV_ID = process.env.CLOUDBASE_ENV_ID

    // 获取 access_token
    const ACCESS_TOKEN = await getAccessToken()

    // 打印调试信息
    console.log('📤 API代理请求:', req.method, req.path)
    console.log('📤 请求体:', req.body)

    // 构建云函数参数字符串
    let funcDataString = '{}'
    if (req.body.funcData) {
      funcDataString = JSON.stringify(req.body.funcData)
    } else if (req.body.data) {
      if (typeof req.body.data === 'string') {
        funcDataString = req.body.data
      } else {
        funcDataString = JSON.stringify(req.body.data)
      }
    }

    // 微信云开发 HTTP API - 参考小游戏文档格式
    // URL: POST https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=ACCESS_TOKEN&env=ENV&name=FUNCTION_NAME
    // Body: JSON string of parameters
    const requestBody = funcDataString  // 直接传递JSON字符串

    const url = `${API_BASE}${req.path}?access_token=${ACCESS_TOKEN}&env=${ENV_ID}&name=${req.body.name}`
    console.log('📤 微信API URL:', url.replace(ACCESS_TOKEN, '***'))
    console.log('📤 发送请求体:', requestBody)

    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('📥 微信API响应:', response.data)
    res.json(response.data)
  } catch (error) {
    console.error('❌ API 代理错误:', error.message)
    if (error.response) {
      console.error('❌ 错误详情:', error.response.data)
    }
    res.status(500).json({ error: error.message })
  }
})

// 开发环境代理到Vite
if (isDev) {
  app.use('/', createProxyMiddleware({
    target: 'http://localhost:5175',
    changeOrigin: true,
    ws: true
  }))
} else {
  // 生产环境使用静态文件
  const distPath = path.join(process.cwd(), 'dist')
  app.use(express.static(distPath))

  // SPA路由支持
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║                                        ║
║   千禧时光机 - 管理后台                  ║
║                                        ║
║   开发环境: http://localhost:${PORT}    ║
║   生产环境: http://服务器IP:${PORT}    ║
║                                        ║
╚════════════════════════════════════════╝
  `)
})
