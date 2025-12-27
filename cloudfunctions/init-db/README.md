# 数据库初始化云函数使用指南

## 功能说明

`init-db` 云函数用于自动创建项目所需的所有数据库集合。

## 支持的操作

### 1. 检查集合状态
检查哪些集合已创建，哪些缺失。

**调用方式：**
```javascript
wx.cloud.callFunction({
  name: 'init-db',
  data: {
    action: 'check'
  }
})
```

**返回示例：**
```json
{
  "success": true,
  "action": "check",
  "total": 17,
  "exists": 5,
  "missing": 12,
  "collections": [
    {
      "name": "users",
      "description": "桌面级用户数据（双代币、彩蛋）",
      "exists": true
    },
    {
      "name": "qcio_users",
      "description": "QCIO用户资料",
      "exists": false
    }
  ]
}
```

### 2. 初始化所有集合
自动创建所有缺失的集合。

**调用方式：**
```javascript
wx.cloud.callFunction({
  name: 'init-db',
  data: {
    action: 'init',
    force: false  // 可选，是否强制重新创建已存在的集合
  }
})
```

**参数说明：**
- `action`: 固定值 `'init'`
- `force`: 默认 `false`，跳过已存在的集合；设为 `true` 时会重新创建所有集合

**返回示例：**
```json
{
  "success": true,
  "action": "init",
  "summary": {
    "total": 17,
    "created": 12,
    "skipped": 5,
    "errors": 0
  },
  "collections": [
    {
      "name": "qcio_users",
      "description": "QCIO用户资料",
      "status": "created",
      "message": "qcio_users 创建成功",
      "indexes": ["_openid", "qcio_id", "nickname"]
    }
  ],
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## 集合列表

| 集合名 | 描述 |
|--------|------|
| `users` | 桌面级用户数据（双代币、彩蛋） |
| `qcio_users` | QCIO用户资料 |
| `qcio_wallet` | QCIO钱包 |
| `qcio_daily_tasks` | QCIO每日任务状态 |
| `qcio_achievements` | QCIO成就系统 |
| `qcio_mood_logs` | 心情日志 |
| `qcio_guestbook` | 留言板 |
| `qcio_experience_logs` | 经验获取日志 |
| `qcio_user_level_rewards` | 等级奖励记录 |
| `qcio_visit_stats` | 访问统计 |
| `qcio_space_logs` | 空间日志 |
| `qcio_ai_contacts` | AI联系人 |
| `qcio_groups` | 群组 |
| `qcio_chat_history` | 私聊历史 |
| `qcio_group_chat_history` | 群聊历史 |
| `mood_garden` | 心情农场游戏数据 |
| `ifthen_games` | 如果当时游戏记录 |
| `ifthen_endings` | 如果当时结局统计 |
| `ifthen_shares` | 如果当时分享记录 |

## 使用场景

### 首次部署
```javascript
// 1. 先检查状态
const checkRes = await wx.cloud.callFunction({
  name: 'init-db',
  data: { action: 'check' }
});
console.log('需要创建', checkRes.result.missing, '个集合');

// 2. 执行初始化
const initRes = await wx.cloud.callFunction({
  name: 'init-db',
  data: { action: 'init' }
});
console.log('创建完成', initRes.result.summary);
```

### 重新初始化
```javascript
// force=true 会重新创建所有集合（慎用！）
const initRes = await wx.cloud.callFunction({
  name: 'init-db',
  data: {
    action: 'init',
    force: true
  }
});
```

## 注意事项

1. **数据安全**：使用 `force: true` 会清空现有数据，请谨慎使用
2. **权限要求**：需要云开发权限
3. **执行时间**：首次创建可能需要几秒钟
4. **索引创建**：微信云数据库会自动为常用查询字段创建索引

## 部署步骤

1. 在微信开发者工具中右键 `cloudfunctions/init-db` 目录
2. 选择 "上传并部署：云端安装依赖"
3. 等待部署完成
4. 调用云函数执行初始化

## 测试代码

可以在小程序的任何页面中添加测试按钮：

```javascript
Page({
  async initDatabase() {
    wx.showLoading({ title: '初始化中...', mask: true });

    try {
      const res = await wx.cloud.callFunction({
        name: 'init-db',
        data: { action: 'init' }
      });

      wx.hideLoading();

      if (res.result.success) {
        const { summary } = res.result;
        wx.showModal({
          title: '初始化完成',
          content: `总数: ${summary.total}\n创建: ${summary.created}\n跳过: ${summary.skipped}\n错误: ${summary.errors}`,
          showCancel: false
        });
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({
        title: '初始化失败',
        icon: 'none'
      });
      console.error(err);
    }
  }
});
```
