# 千禧时光机 - 管理后台

Web管理后台，用于管理小程序数据、生成运营内容。

## 技术栈

- Vue 3 + Vite
- Element Plus
- Express
- 微信云开发 HTTP API

## 快速开始

### 1. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的云开发配置：

```env
VITE_CLOUDBASE_ENV_ID=your-env-id
VITE_CLOUDBASE_ACCESS_TOKEN=your-access-token
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
# 终端1：启动Vite开发服务器
npm run dev

# 终端2：启动Express服务
npm run server
```

访问：http://localhost:6688

### 4. 构建生产版本

```bash
npm run build
npm run server
```

## 默认账号

- 用户名：`admin`
- 密码：`admin123`

⚠️ 生产环境请修改默认密码！

## 功能

- 数据看板
- 用户管理
- 排行榜
- 内容创作中心（海报生成、AI文案）
- CDK管理

## 部署

### Nginx配置

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

### 使用PM2守护

```bash
pm2 start server.js --name admin-panel
```

## 开发说明

- 前端端口：5173
- 后端端口：6688
- API基础路径：`src/api/`

## License

MIT
