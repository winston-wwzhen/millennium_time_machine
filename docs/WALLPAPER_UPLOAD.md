# 壁纸上传指南 (Wallpaper Upload Guide)

## 概述

将桌面壁纸上传到微信云存储，使其与桌面图标使用相同的云存储路径。

## 上传步骤

### 1. 压缩壁纸

将 `miniprogram/images/壁纸.png` 压缩为 `壁纸.jpg`：

- 使用图片编辑工具（如 Photoshop、GIMP、在线压缩工具）
- 建议压缩后的文件大小控制在 500KB 以内
- 保持图片质量，确保在桌面显示清晰

### 2. 上传到云存储

在**微信开发者工具**中上传：

1. 打开微信开发者工具
2. 点击左侧工具栏的 **云开发** 按钮
3. 进入 **云存储** 标签
4. 点击 **上传文件** 按钮
5. 选择压缩后的 `壁纸.jpg` 文件
6. **重要**：在上传对话框中，设置云存储路径为：
   ```
   wallpapers/壁纸.jpg
   ```
   （注意：需要先创建 `wallpapers` 文件夹，或直接在路径中指定）

### 3. 验证上传

上传成功后，在云存储中应该看到：
```
cloud1-4gvtpokae6f7dbab.636c-cloud1-4gvtpokae6f7dbab-1392774085/
└── wallpapers/
    └── 壁纸.jpg
```

### 4. 确认云存储环境ID

如果您的云环境ID不同，需要更新配置文件：

打开 `miniprogram/config/cloud-icons.js`，找到：

```javascript
const CLOUD_BASE_URL = 'cloud://cloud1-4gvtpokae6f7dbab.636c-cloud1-4gvtpokae6f7dbab-1392774085';
```

将 `CLOUD_BASE_URL` 替换为您实际的云存储环境ID（可在云存储控制台查看）。

## 代码配置

已完成的代码更改：

### 1. 云图标配置文件
- 文件：`miniprogram/config/cloud-icons.js`
- 提供 `getCloudIconUrl()` 函数获取桌面图标云URL
- 路径格式：`cloud://[env]/icons/[filename].png`

### 2. 壁纸云存储配置
- 文件：`miniprogram/pages/index/index.js`
- 壁纸使用完整云存储URL：
  ```javascript
  "cloud://cloud1-4gvtpokae6f7dbab.636c-cloud1-4gvtpokae6f7dbab-1392774085/wallpapers/壁纸.jpg"
  ```

### 3. 背景样式处理
- 文件：`miniprogram/pages/index/index.js`
- `updateBgStyle()` 已支持 `cloud://` 协议的云存储图片

## 测试验证

上传完成后：

1. 重新编译小程序
2. 在桌面双击切换背景
3. 第二次切换应显示您的自定义壁纸
4. 如果壁纸不显示，检查：
   - 云存储路径是否正确
   - `cloud-icons.js` 中的环境ID是否匹配
   - 浏览器控制台是否有错误信息

## 云存储文件夹结构

```
cloud://cloud1-4gvtpokae6f7dbab.636c-cloud1-4gvtpokae6f7dbab-1392774085/
├── icons/               # 桌面图标
│   ├── my-computer.png
│   ├── my-documents.png
│   ├── QCIO.png
│   └── ...
└── wallpapers/          # 桌面壁纸
    └── 壁纸.jpg
```

## 注意事项

- 云存储文件名区分大小写
- 云存储路径需要与环境ID匹配
- 建议壁纸尺寸：1080x1920 或更高
- 建议壁纸格式：JPG（压缩率高）
- 文件大小建议控制在 1MB 以内
