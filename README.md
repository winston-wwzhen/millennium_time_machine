# 千禧时光机 (Millennium Time Machine)

一个充满怀旧风格的微信小程序，提供各种文字处理工具，让您重温Windows 98时代的经典界面。

## 📱 项目简介

千禧时光机是一个复古风格的实用工具小程序，采用Windows 98风格的设计，提供多种文本处理功能。小程序基于微信云开发构建，无需搭建服务器即可快速上线。

## ✨ 主要功能

### 🪐 火星文转换器
- 将普通文本转换为火星文风格
- 支持实时预览和一键复制
- 经典的非主流文字效果

### 📸 非主流大头贴（开发中）
- 复古风格头像生成
- 经典的2000年代网络风格特效

### ℹ️ 关于页面
- 项目介绍和使用说明

## 🛠 技术栈

### 前端
- **框架**: 微信小程序原生框架
- **语言**: JavaScript
- **样式**: WXSS
- **UI设计**: Windows 98复古风格

### 后端
- **云服务**: 微信云开发
- **数据库**: 云数据库
- **云函数**: Node.js (wx-server-sdk)
- **版本**: ~2.4.0

## 📁 项目结构

```
old_story/
├── miniprogram/              # 小程序前端代码
│   ├── app.js               # 小程序入口文件
│   ├── app.json             # 小程序全局配置
│   ├── app.wxss             # 全局样式文件
│   ├── images/              # 图片资源
│   │   └── icons/           # 图标资源
│   └── pages/               # 页面目录
│       ├── index/           # 首页（桌面界面）
│       └── mars/            # 火星文转换器
│
├── cloudfunctions/          # 云函数目录
│   └── quickstartFunctions/ # 云函数
│       ├── index.js         # 函数主文件
│       ├── package.json     # 依赖配置
│       └── config.json      # 云函数配置
│
├── project.config.json      # 项目配置文件
├── project.private.config.json # 私有项目配置
├── uploadCloudFunction.sh   # 云函数部署脚本
└── README.md               # 项目说明文档
```

## 🚀 快速开始

### 环境要求
- 微信开发者工具最新版本
- Node.js 12.0 或更高版本（用于云函数开发）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone [项目地址]
   cd old_story
   ```

2. **打开微信开发者工具**
   - 导入项目文件夹
   - 填入你的AppID（如果没有可以使用测试号）
   - 后端服务选择"云开发"

3. **创建云环境**
   - 在开发者工具中点击"云开发"按钮
   - 创建新的云环境（建议选择按量计费）
   - 记录环境ID

4. **配置云环境**
   - 打开 `miniprogram/envList.js`
   - 填入你的云环境ID：
   ```javascript
   const envList = [
     {
       envId: 'your-cloud-env-id',
       name: '正式环境'
     }
   ]
   module.exports = {
     envList,
     envId: envList[0].envId
   }
   ```

5. **上传云函数**
   - 右键点击 `cloudfunctions` 文件夹
   - 选择"上传并部署：云端安装依赖"
   - 或运行提供的脚本：
   ```bash
   bash uploadCloudFunction.sh
   ```

6. **初始化云数据库**
   - 在云开发控制台创建 `sales` 集合
   - 设置适当的读写权限

7. **预览和调试**
   - 点击编译按钮运行项目
   - 在模拟器中预览效果
   - 使用真机扫码进行调试

## 📝 开发指南

### 添加新页面

1. 在 `miniprogram/pages/` 下创建新页面文件夹
2. 添加 `index.js`, `index.wxml`, `index.wxss`, `index.json` 文件
3. 在 `miniprogram/app.json` 的 `pages` 数组中注册页面

### 创建云函数

1. 在 `cloudfunctions/` 下创建新文件夹
2. 创建 `index.js` 和 `package.json`
3. 实现云函数逻辑
4. 右键上传并部署

### 项目配置

主要配置文件说明：
- `project.config.json`: 项目基础配置
- `project.private.config.json`: 个人开发配置（不提交到版本控制）
- `miniprogram/app.json`: 小程序页面和窗口配置
- `cloudfunctions/quickstartFunctions/config.json`: 云函数配置

## 🎨 设计规范

### 复古风格指南
- 使用系统默认字体
- 灰度配色方案
- 立体边框效果（ outset/inset ）
- 像素化图标和按钮
- 经典的窗口布局

### 图标资源
- 使用 16x16 像素图标
- 保持与Windows 98风格一致
- 可在 `images/icons/` 目录下添加新图标

## 📦 部署

### 云函数部署
```bash
# 部署所有云函数
bash uploadCloudFunction.sh

# 或单独部署
# 右键云函数文件夹 -> 上传并部署
```

### 小程序发布
1. 在开发者工具中点击"上传"
2. 填写版本号和项目备注
3. 登录微信公众平台
4. 提交审核
5. 审核通过后发布

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 微信小程序团队提供的优秀开发框架
- Windows 98 带来的经典设计灵感
- 所有为本项目做出贡献的开发者

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：
- 提交 Issue
- 发送邮件至：[你的邮箱]

---

> 带你重温那个简单而又美好的互联网时代 🕹️