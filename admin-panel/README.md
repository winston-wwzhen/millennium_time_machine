# 千禧时光机 - 管理后台

Web管理后台，用于管理小程序数据、生成运营内容。

## 技术栈

- **前端**: Vue 3 + Vite + Element Plus + ECharts
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **后端**: Express + 微信云开发 HTTP API

## 快速开始

### 1. 配置环境变量

创建 `.env` 文件：

```env
VITE_CLOUDBASE_ENV_ID=your-env-id
WECHAT_APPID=your-appid
WECHAT_APPSECRET=your-appsecret
```

### 2. 安装依赖

```bash
npm install
```

### 3. 部署云函数

在微信开发者工具中部署 `myadmin` 云函数。

### 4. 启动开发服务器

```bash
# 终端1：启动Vite开发服务器
npm run dev

# 终端2：启动Express服务
npm run server
```

访问：http://localhost:6688

### 5. 构建生产版本

```bash
npm run build
npm run server
```

## 默认账号

- 用户名：`admin`
- 密码：`admin123`

⚠️ 生产环境请修改默认密码！

## 功能模块

### 数据看板
- 用户统计（总用户数、今日新增、增长率）
- QCIO 用户统计
- 聊天统计
- 彩蛋发现统计
- 双币统计（时光币、网费）
- 访问统计
- 用户增长趋势图（近7天）
- 活动分布图
- 实时活动日志

### 用户管理
- 用户列表（支持搜索、分页、排序）
- 用户详情页面
  - 基本信息查看
  - 双币余额查看
  - QCIO 资料查看
  - 彩蛋统计
  - 徽章展示
  - 交易记录筛选
  - 活动日志

### 排行榜
- 等级排行榜
- Q点 排行榜
- 彩蛋发现排行榜

### 彩蛋管理
- 彩蛋统计卡片（总用户数、总发现数、人均发现）
- 稀有度分布（普通、稀有、史诗、传说）
  - 发现数量统计
  - 发现用户数统计
  - 分布饼图
  - 进度条展示
- 热门彩蛋排行 TOP10
- 彩蛋发现排行榜（TOP20/50/100）
- 彩蛋发现历史（支持稀有度筛选、分页）

### 聊天记录
- **私聊记录**
  - 按 QCIO ID 筛选
  - 按联系人筛选
  - 聊天记录展示
- **群聊记录**
  - 按群组筛选
  - 群聊消息展示
- 聊天统计

### QCIO 管理
- **QCIO 用户列表**
  - 搜索功能
  - 查看等级、经验、签名
  - 用户详情弹窗（含钱包、成就、经验日志）
- **农场管理**
  - 农场统计（农场主总数、正在种植数）
  - 农场操作日志
- **访问统计**
  - 空间访问统计列表
  - 按空间主人筛选

### 内容创作中心
- 排行榜海报生成
  - 多种排行榜类型
  - 多种展示数量
  - 多种海报风格
  - 海报预览和下载
- AI 文案生成
  - 多平台支持
  - 多种内容类型
  - 一键复制

### CDK 管理
- CDK 生成
- CDK 列表管理
- 状态追踪

## 云函数 API

### myadmin 云函数

管理后台专用云函数，提供以下接口：

| Action | 说明 | 参数 |
|--------|------|------|
| getDashboardStats | 数据看板统计 | - |
| getGrowthTrend | 增长趋势 | days (默认7) |
| getUserList | 用户列表 | page, limit, keyword, sortBy, sortOrder |
| getUserDetail | 用户详情 | openid |
| getUserTransactions | 用户交易记录 | openid, page, limit, type |
| getEggStats | 彩蛋统计 | - |
| getEggRankings | 彩蛋排行榜 | limit (默认20) |
| getEggDiscoveryHistory | 彩蛋发现历史 | page, limit, rarity, eggId |
| getQCIOUserList | QCIO用户列表 | page, limit, keyword, sortBy, sortOrder |
| getQCIOUserDetail | QCIO用户详情 | qcioId |
| getFarmStats | 农场统计 | - |
| getFarmLogs | 农场日志 | page, limit, qcioId |
| getChatHistory | 私聊历史 | page, limit, userQcioId, contactName |
| getGroupChatHistory | 群聊历史 | page, limit, groupId |
| getVisitStats | 访问统计 | - |
| getVisitHistory | 访问历史 | page, limit, ownerQcioId |
| exportUsers | 导出用户数据 | - |
| exportTransactions | 导出交易记录 | limit, type, startDate, endDate |
| exportEggs | 导出彩蛋数据 | - |
| getActivityLogs | 活动日志 | page, limit, action, openid |
| getRecentActivity | 最近活动 | limit (默认50) |

## 项目结构

```
admin-panel/
├── src/
│   ├── api/               # API 接口层
│   │   ├── admin.js       # 管理后台统一 API
│   │   ├── cloudbase.js   # 微信云开发 API 封装
│   │   ├── stats.js       # 统计数据 API（旧版）
│   │   ├── auth.js        # 认证 API
│   │   └── users.js       # 用户管理 API（旧版）
│   ├── views/             # 页面组件
│   │   ├── Layout.vue     # 主布局
│   │   ├── Login.vue      # 登录页
│   │   ├── Dashboard.vue  # 数据看板
│   │   ├── Users.vue      # 用户管理
│   │   ├── UserDetail.vue # 用户详情
│   │   ├── Rankings.vue   # 排行榜
│   │   ├── Eggs.vue       # 彩蛋管理
│   │   ├── Chats.vue      # 聊天记录
│   │   ├── QCIO.vue       # QCIO管理
│   │   ├── Creator.vue    # 内容创作
│   │   └── CDK.vue        # CDK管理
│   ├── router/            # 路由配置
│   │   └── index.js
│   ├── main.js            # 入口文件
│   └── App.vue            # 根组件
├── cloudfunctions/
│   └── myadmin/          # 管理后台云函数
├── server.js              # Express 服务器
├── vite.config.js         # Vite 配置
└── package.json           # 依赖配置
```

## 部署

### Nginx 配置

```nginx
location /admin {
    proxy_pass http://localhost:6688;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### 使用 PM2 守护

```bash
pm2 start server.js --name admin-panel
```

### 云函数部署

在微信开发者工具中：
1. 右键 `cloudfunctions/myadmin` 文件夹
2. 选择 "上传并部署：云端安装依赖"
3. 等待部署完成

## 开发说明

- **前端端口**: 5173
- **后端端口**: 6688
- **API 基础路径**: `src/api/`
- **图表库**: ECharts (vue-echarts)
- **模拟数据**: 在 `src/api/admin.js` 中设置 `USE_MOCK_DATA = true` 启用

## 更新日志

### v1.1.0 (2026-01-01)

**新增功能**：
- 创建 `myadmin` 云函数，提供完整的管理后台 API
- 完善数据看板：
  - 添加 ECharts 图表（用户增长趋势、活动分布）
  - 新增第二行统计卡片（访问、时光币、网费）
  - 实时活动日志展示
- 新增用户详情页：
  - 基本信息展示
  - QCIO 资料展示
  - 双币信息展示
  - 彩蛋统计和徽章
  - 交易记录筛选
  - 活动日志时间线
- 新增彩蛋管理页面：
  - 稀有度分布统计和饼图
  - 热门彩蛋排行
  - 彩蛋发现排行榜
  - 彩蛋发现历史查询
- 新增聊天记录页面：
  - 私聊记录查询
  - 群聊记录查询
  - 聊天统计
- 新增 QCIO 管理页面：
  - QCIO 用户列表和详情
  - 农场统计和日志
  - 访问统计查询
- 更新用户管理页面：
  - 使用新的 admin API
  - 添加用户详情跳转
- 更新侧边栏导航，添加新页面菜单项

**技术更新**：
- 添加 ECharts 和 vue-echarts 依赖
- 添加 @element-plus/icons-vue 图标支持
- 创建统一的管理 API 文件 `src/api/admin.js`

## License

MIT
