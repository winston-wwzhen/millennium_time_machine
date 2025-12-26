# 管理员工具实现计划

> 部署在自有服务器上的Web管理后台
>
> 制定日期：2025-12-26
> 访问地址：http://服务器IP:6688

---

## 一、技术方案

### 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx (80/443)                       │
│                   /admin → 6688端口                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │   前端 (Node.js + Express 静态服务)             │   │
│  │   Vue 3 + Element Plus                           │   │
│  │   端口：6688                                     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │   后端 API                                       │   │
│  │   直接调用微信云开发 HTTP API                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
                      │
                      ▼
        ┌───────────────────────────────┐
        │   微信云开发                   │
        │   - 云数据库                   │
        │   - 云函数                     │
        │   - 云存储                     │
        └───────────────────────────────┘
```

### 技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| **前端框架** | Vue 3 + Vite | 轻量、快速 |
| **UI组件** | Element Plus | 成熟、文档好 |
| **路由** | Vue Router | 官方路由 |
| **状态管理** | Pinia | Vue 3官方推荐 |
| **HTTP客户端** | Axios | 请求云开发API |
| **构建工具** | Vite | 快速开发 |
| **服务端** | Express + Node.js | 静态文件服务 |
| **反向代理** | Nginx | 已有 |

---

## 二、项目结构

```
admin-panel/
├── public/                      # 静态资源
│   └── favicon.ico
├── src/
│   ├── api/                     # API调用
│   │   ├── index.js            # 云开发配置
│   │   ├── cloudbase.js        # 云开发API封装
│   │   ├── stats.js            # 统计API
│   │   ├── users.js            # 用户API
│   │   ├── cdk.js              # CDK API
│   │   └── content.js          # 内容API
│   ├── views/                   # 页面组件
│   │   ├── Login.vue           # 登录页
│   │   ├── Dashboard.vue       # 数据看板
│   │   ├── Users.vue           # 用户管理
│   │   ├── Game.vue            # 游戏分析
│   │   ├── Rankings.vue        # 排行榜
│   │   ├── Content.vue         # 内容管理
│   │   ├── Creator.vue         # 内容创作中心 ⭐
│   │   ├── CDK.vue             # CDK管理
│   │   ├── Tools.vue           # 运营工具
│   │   └── Settings.vue        # 系统设置
│   ├── components/              # 公共组件
│   │   ├── Layout.vue          # 布局
│   │   ├── Header.vue          # 头部
│   │   ├── Sidebar.vue         # 侧边栏
│   │   ├── ChartCard.vue       # 图表卡片
│   │   └── ...
│   ├── router/                  # 路由
│   │   └── index.js
│   ├── stores/                  # 状态管理
│   │   ├── user.js             # 用户状态
│   │   └── app.js              # 应用状态
│   ├── utils/                   # 工具函数
│   │   ├── request.js          # 请求封装
│   │   └── auth.js             # 认证工具
│   ├── styles/                  # 样式
│   │   └── global.css
│   ├── App.vue                  # 根组件
│   └── main.js                  # 入口
├── server.js                     # Express服务
├── package.json
├── vite.config.js
└── README.md
```

---

## 三、云开发HTTP API

### 调用方式

```javascript
// 使用云开发Access Token调用
const API_BASE = 'https://api.weixin.qq.com/tcb/invokecloudfunction'
const ENV_ID = 'millennium-xxx'

// 请求云函数
async function callCloudFunction(name, data) {
  const res = await axios.post(API_BASE, {
    env: ENV_ID,
    name: name,
    query_string: JSON.stringify(data)
  }, {
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    }
  })
  return res.data
}
```

### 需要的云函数

| 云函数 | 用途 | 优先级 |
|--------|------|--------|
| **admin-login** | 管理员登录 | 🔴 P0 |
| **admin-stats** | 数据统计 | 🔴 P0 |
| **admin-users** | 用户管理 | 🔴 P0 |
| **generate-poster** | 生成海报 | 🟡 P1 |
| **ai-copywriter** | AI文案生成 | 🟡 P1 |
| **admin-cdk** | CDK管理 | 🟡 P1 |

---

## 四、功能模块

### P0 核心功能（第一期）

| 模块 | 功能 | 说明 |
|------|------|------|
| **登录** | 管理员登录 | 用户名密码验证 |
| **数据看板** | 核心数据展示 | 用户数、日活、完成数 |
| **用户管理** | 用户列表 | 查看、搜索 |
| **排行榜** | 各类排行 | 等级、Q点、彩蛋 |

### P1 核心功能（第二期）

| 模块 | 功能 | 说明 |
|------|------|------|
| **内容创作中心** | 海报生成 | 排行榜海报 |
| | AI文案生成 | 多平台文案 |
| **CDK管理** | 生成CDK | 批量生成 |
| | 查看使用 | 使用记录 |

### P2 增强功能（第三期）

| 模块 | 功能 | 说明 |
|------|------|------|
| **游戏分析** | 游戏数据 | 结局统计 |
| **运营工具** | 发送通知 | 小程序通知 |
| **系统设置** | 基本配置 | 系统参数 |

---

## 五、开发步骤

### 第一阶段：项目搭建（今天）

| 步骤 | 任务 | 时间 |
|------|------|------|
| 1 | 初始化Vue 3项目 | 10分钟 |
| 2 | 安装依赖（Element Plus等） | 10分钟 |
| 3 | 配置路由和布局 | 20分钟 |
| 4 | 创建登录页面 | 30分钟 |
| 5 | 创建数据看板页面 | 40分钟 |
| 6 | 配置Express静态服务 | 20分钟 |
| 7 | 配置Nginx反向代理 | 20分钟 |

**小计**：约2.5小时

### 第二阶段：核心功能（明天）

| 步骤 | 任务 | 时间 |
|------|------|------|
| 1 | 用户管理页面 | 1小时 |
| 2 | 排行榜页面 | 1小时 |
| 3 | 云函数admin-login | 30分钟 |
| 4 | 云函数admin-stats | 30分钟 |
| 5 | 云函数admin-users | 30分钟 |
| 6 | API封装和联调 | 1小时 |

**小计**：约4.5小时

### 第三阶段：内容创作（后天）

| 步骤 | 任务 | 时间 |
|------|------|------|
| 1 | 内容创作中心页面 | 2小时 |
| 2 | 云函数generate-poster | 1.5小时 |
| 3 | 云函数ai-copywriter | 1.5小时 |
| 4 | CDK管理页面 | 1小时 |

**小计**：约6小时

---

## 六、Nginx配置

### 配置文件

```nginx
# /etc/nginx/sites-available/admin-panel

server {
    listen 80;
    server_name your-domain.com;  # 或使用IP

    # 管理后台
    location /admin {
        proxy_pass http://localhost:6688;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 可选：API代理
    location /api {
        proxy_pass http://localhost:6688/api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/admin-panel /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载nginx
sudo nginx -s reload
```

---

## 七、Express服务配置

### server.js

```javascript
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const path = require('path')

const app = express()
const PORT = 6688

// 开发环境代理到Vite dev server
if (process.env.NODE_ENV === 'development') {
  app.use('/', createProxyMiddleware({
    target: 'http://localhost:5173',
    changeOrigin: true
  }))
} else {
  // 生产环境使用静态文件
  app.use(express.static(path.join(__dirname, 'dist')))

  // SPA路由支持
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
}

// CORS配置
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

app.listen(PORT, () => {
  console.log(`Admin panel running on port ${PORT}`)
})
```

---

## 八、云函数开发

### admin-login

```javascript
// cloudfunctions/admin-login/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

exports.main = async (event, context) => {
  const { username, password } = event

  // 验证管理员
  const admin = await db.collection('admins')
    .where({ username })
    .get()

  if (admin.data.length === 0) {
    return { code: -1, message: '管理员不存在' }
  }

  // 验证密码（实际应该用加密）
  if (admin.data[0].password !== password) {
    return { code: -1, message: '密码错误' }
  }

  // 生成token（简单实现）
  const token = Buffer.from(`${username}_${Date.now()}`).toString('base64')

  return {
    code: 0,
    data: {
      token,
      userInfo: {
        username: admin.data[0].username,
        role: admin.data[0].role
      }
    }
  }
}
```

---

## 九、安全考虑

### 认证方案

| 方案 | 说明 | 推荐 |
|------|------|------|
| **简单Token** | Base64编码，易破解 | 开发阶段 |
| **JWT** | 标准方案，支持过期 | ✅ 生产环境 |
| **Session** | 需要存储 | 不推荐 |

### 访问控制

```javascript
// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token')

  if (!token && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})
```

### API安全

| 措施 | 说明 |
|------|------|
| **Access Token** | 定期更换 |
| **IP白名单** | 限制服务器访问 |
| **HTTPS** | 生产环境启用 |

---

## 十、部署流程

### 开发环境

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 访问 http://localhost:5173
```

### 生产环境

```bash
# 1. 构建
npm run build

# 2. 启动Express服务
node server.js

# 3. 使用PM2守护
pm2 start server.js --name admin-panel

# 4. 配置Nginx反向代理
# 见上文Nginx配置
```

---

## 十一、开发计划

| 阶段 | 内容 | 时间 | 状态 |
|------|------|------|------|
| **项目搭建** | Vue项目、路由、布局、登录 | 今天 | ⬜ |
| **核心功能** | 数据看板、用户管理、排行榜 | 明天 | ⬜ |
| **内容创作** | 海报生成、AI文案、CDK | 后天 | ⬜ |
| **测试上线** | 功能测试、部署 | 12/29 | ⬜ |

---

## 十二、预期成果

### 访问地址

```
http://你的服务器IP:6688
或
http://你的域名/admin
```

### 功能截图

```
┌─────────────────────────────────────┐
│  千禧时光机 - 管理后台               │
├─────────────────────────────────────┤
│  [登录页]                           │
│  用户名: [_________]                │
│  密码:   [_________]                │
│  [登录]                             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  千禧时光机 - 数据看板               │
├─────────────────────────────────────┤
│  总用户: 12,345                     │
│  日活:   1,234                      │
│  游戏完成: 456                      │
│                                     │
│  [用户增长趋势图]                   │
│  [结局分布饼图]                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  内容创作中心                       │
├─────────────────────────────────────┤
│  📊 排行榜海报生成                  │
│  [生成] [预览] [下载]               │
│                                     │
│  ✨ AI文案生成                      │
│  [生成文案] [复制]                  │
└─────────────────────────────────────┘
```

---

## 十三、风险和注意事项

| 风险 | 应对 |
|------|------|
| **Access Token泄露** | 定期更换、保存在环境变量 |
| **未授权访问** | IP白名单、强密码 |
| **云函数调用限制** | 控制调用频率 |
| **跨域问题** | Nginx代理或CORS配置 |

---

## 十四、待确认事项

| 事项 | 状态 |
|------|------|
| 服务器有Node.js环境 | ⬜ 待确认 |
| 服务器端口6688可用 | ⬜ 待确认 |
| 云开发Access Token | ⬜ 待获取 |
| 管理员账号密码 | ⬜ 待设置 |

---

> 审核通过后开始开发
>
> © 2025 千禧时光机 · 管理员工具实现计划
