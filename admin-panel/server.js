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

// 开发环境代理到Vite
if (isDev) {
  app.use('/', createProxyMiddleware({
    target: 'http://localhost:5173',
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
