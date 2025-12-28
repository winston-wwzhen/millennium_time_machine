# clear-db 云函数

清空数据库云函数，用于测试时一键清空所有集合数据。

## ⚠️ 警告

此操作**不可逆**！执行后将删除所有数据且无法恢复！

## 使用方法

### 1. 检查数据库状态

```javascript
wx.cloud.callFunction({
  name: 'clear-db',
  data: {
    action: 'check'
  }
}).then(res => {
  console.log(res.result);
  // 返回所有集合的记录数量
});
```

### 2. 清空所有数据

```javascript
wx.cloud.callFunction({
  name: 'clear-db',
  data: {
    action: 'clear',
    confirm: true  // 必须设置为 true 确认操作
  }
}).then(res => {
  console.log(res.result);
  // 返回删除统计
});
```

### 3. 清空指定集合

```javascript
wx.cloud.callFunction({
  name: 'clear-db',
  data: {
    action: 'clear',
    confirm: true,
    collections: ['users', 'qcio_users']  // 只清空指定集合
  }
}).then(res => {
  console.log(res.result);
});
```

## 支持的集合

| 分类 | 集合名称 |
|------|----------|
| 用户系统 | users, user_transactions, user_activity_logs, user_photos |
| QCIO社交 | qcio_users, qcio_wallet, qcio_daily_tasks, qcio_achievements, qcio_mood_logs, qcio_guestbook, qcio_experience_logs, qcio_user_level_rewards, qcio_visit_stats, qcio_space_logs |
| AI联系人和群组 | qcio_ai_contacts, qcio_groups, qcio_chat_history, qcio_group_chat_history |
| 心情农场 | mood_garden |
| 如果当时游戏 | ifthen_games, ifthen_endings, ifthen_shares, ifthen_play_history, ifthen_share_visits |

## 测试流程

1. 调用 `clear-db` 清空所有数据
2. 调用 `init-db` 重新初始化数据库
3. 重新登录小程序进行测试
