# 千禧时光机代码优化报告

## 📊 代码规模分析

### 超大文件（需要拆分）

| 文件 | 行数 | 优化建议 |
|------|------|---------|
| `pages/index/index.js` | 1542行 | 拆分为8个子模块 |
| `pages/qcio/index.js` | 1073行 | 拆分为5个子模块 |
| `cloudfunctions/qcio/index.js` | 1144行 | 已有modules，继续优化 |
| `cloudfunctions/user/index.js` | 1076行 | 拆分业务模块 |

### 数据文件（正常，无需优化）

| 文件 | 行数 | 说明 |
|------|------|------|
| `data/ifthen-events.js` | 7719行 | 游戏事件数据，正常 |
| `data/ifthen-endings.js` | 1718行 | 游戏结局数据，正常 |

## 🔁 重复代码分析

### 1. 云函数调用重复（15+处）

**问题模式：**
```javascript
// 在多个页面重复出现
const res = await wx.cloud.callFunction({
  name: 'user',
  data: { type: 'getBalance' }
});
if (res.result && res.result.success) {
  // 处理数据
}
```

**优化方案：**
使用新创建的 `api-client.js`：
```javascript
const { userApi } = require('../../utils/api-client');
const result = await userApi.getBalance();
```

**受影响文件：**
- `pages/index/index.js` (2处)
- `components/network-neighborhood/index.js` (1处)
- `pages/qcio/index.js` (多处)

### 2. 错误处理重复（20+处）

**问题模式：**
```javascript
} catch (err) {
  console.error('Load ... error:', err);
  wx.showToast({ title: '加载失败', icon: 'none' });
}
```

**优化方案：**
使用新创建的 `error-handler.js`：
```javascript
const { pageErrorHandler } = require('../../utils/error-handler');
// 在页面中混入
handleLoadError(err, '数据加载');
```

### 3. setData 重复（80+处）

**问题：** 单个属性更新导致多次渲染

**优化方案：**
```javascript
// 不好
this.setData({ a: 1 });
this.setData({ b: 2 });
this.setData({ c: 3 });

// 好
this.setData({ a: 1, b: 2, c: 3 });
```

## 🚀 性能优化方案

### 1. 首页加载优化（pages/index/index.js）

**当前问题：**
- 80+ setData 调用
- 重复的云函数调用
- 没有数据缓存

**优化方案：**

#### 1.1 合并 setData
```javascript
// 优化前
this.setData({ showMyComputer: true });
this.setData({ showMyDocuments: true });
this.setData({ showNetworkNeighborhood: true });

// 优化后
this.setData({
  showMyComputer: true,
  showMyDocuments: true,
  showNetworkNeighborhood: true
});
```

#### 1.2 使用缓存
```javascript
const { userBalanceCache } = require('../../utils/cache-manager');

// 从缓存获取
const balance = userBalanceCache.get();
if (balance) {
  this.setData({ balance });
  return;
}

// 缓存未命中，调用API
const result = await userApi.getBalance();
userBalanceCache.set(result);
this.setData({ balance });
```

#### 1.3 预加载常用数据
```javascript
// app.js 中预加载
const { preloadCommonData } = require('../../utils/cache-manager');

onLaunch() {
  preloadCommonData();
}
```

**预期收益：**
- setData 调用减少 50%
- 首屏加载时间减少 20%
- API 调用减少 30%

### 2. QCIO 页面优化（pages/qcio/index.js）

**当前问题：**
- 1073行代码，逻辑复杂
- 多个重复的业务逻辑
- 频繁的云函数调用

**优化方案：**

#### 2.1 拆分模块
```
pages/qcio/
├── index.js (主入口，200行)
├── modules/
│   ├── auth.js (登录注册逻辑)
│   ├── profile.js (用户资料管理)
│   ├── contacts.js (联系人管理)
│   ├── chat.js (聊天功能)
│   └── zone.js (空间功能)
```

#### 2.2 使用 api-client
```javascript
// 优化前
const res = await wx.cloud.callFunction({
  name: 'qcio',
  data: { action: 'getMoodLogStatus' }
});

// 优化后
const { qcioApi } = require('../../utils/api-client');
const result = await qcioApi.getMoodLogStatus();
```

### 3. 云函数优化

#### 3.1 qcio 云函数拆分
```
cloudfunctions/qcio/
├── index.js (路由，150行)
└── modules/
    ├── wallet.js (已完成)
    ├── dailyTasks.js (已完成)
    ├── moodLog.js (已完成)
    ├── profile.js (需新增)
    ├── contacts.js (需新增)
    └── chat.js (需新增)
```

#### 3.2 合并相似请求
```javascript
// 优化：一次调用获取多个数据
async function getQcioData(openid) {
  const [profile, contacts, logs, wallet] = await Promise.all([
    getProfile(openid),
    getContacts(openid),
    getMoodLogs(openid),
    getWalletInfo(openid)
  ]);
  return { profile, contacts, logs, wallet };
}
```

## 📋 实施计划

### 第一阶段：使用公共模块（1周）

1. ✅ 创建 api-client.js
2. ✅ 创建 error-handler.js
3. ✅ 创建 cache-manager.js
4. ⏳ 在现有代码中应用新模块
   - 替换 pages/index/index.js 中的云函数调用
   - 替换 pages/qcio/index.js 中的云函数调用
   - 替换 components/network-neighborhood 中的云函数调用

### 第二阶段：性能优化（1周）

1. 优化 pages/index/index.js 的 setData
2. 实现数据缓存机制
3. 预加载常用数据

### 第三阶段：代码重构（2周）

1. 拆分 pages/index/index.js
2. 拆分 pages/qcio/index.js
3. 优化云函数结构

## 📈 预期收益

### 代码质量
- 重复代码减少 30%
- 代码可读性提升 40%
- 新功能开发效率提升 50%

### 性能指标
- 首屏加载时间减少 20%
- setData 调用减少 50%
- API 调用次数减少 30%
- 内存占用减少 15%

### 维护性
- Bug 修复效率提升 40%
- 新人上手时间减少 50%

## 🎯 优化检查清单

### 代码质量
- [ ] 消除所有重复的云函数调用代码
- [ ] 统一错误处理逻辑
- [ ] 拆分超过1000行的文件
- [ ] 提取可复用的组件

### 性能优化
- [ ] 合并 setData 调用
- [ ] 实现数据缓存机制
- [ ] 预加载常用数据
- [ ] 优化云函数响应

### 测试验证
- [ ] 功能回归测试
- [ ] 性能对比测试
- [ ] 兼容性测试

## 💡 最佳实践建议

### 1. 云函数调用
- ✅ 使用 api-client 封装
- ✅ 统一错误处理
- ❌ 避免直接调用 wx.cloud.callFunction

### 2. 数据缓存
- ✅ 缓存用户信息、余额等常用数据
- ✅ 设置合理的过期时间
- ❌ 不要缓存动态变化的数据

### 3. 状态更新
- ✅ 合并多个 setData
- ✅ 使用 setData 的回调
- ❌ 避免在循环中调用 setData

### 4. 错误处理
- ✅ 使用统一的错误处理工具
- ✅ 记录错误日志
- ✅ 向用户显示友好的错误提示

---

**生成时间：** 2025-12-28
**分支：** refactor/code-optimization
