# 彩蛋系统文档

> 千禧时光机 - Windows 98 桌面彩蛋收集系统
> 最后更新: 2025-12-28

## 概述

彩蛋系统是一个成就收集系统，玩家通过探索桌面功能发现隐藏彩蛋，获得时光币奖励。
- 时光币可用于在网管系统兑换网费
- 发现的彩蛋会以徽章形式展示
- 数据同步到云端，跨设备保存

---

## 彩蛋列表 (20个)

### 🟢 普通彩蛋 (12个)

| ID | 名称 | 奖励 | 触发方式 | 状态 | 实现位置 |
|----|------|------|----------|------|----------|
| LION_DANCE | 舞动的小狮子 | 1000💎 | 点击小狮子3-5次 | ✅ 已实现 | [pages/index/index.js](miniprogram/pages/index/index.js) |
| LION_TALK | 它会说话 | 1000💎 | 长按小狮子 | ✅ 已实现 | [pages/index/index.js](miniprogram/pages/index/index.js) |
| TASKBAR_SURPRISE | 底部秘密 | 1000💎 | 点击任务栏3次以上 | ✅ 已实现 | [pages/index/index.js](miniprogram/pages/index/index.js) |
| BG_SWITCH | 换了个心情 | 500💎 | 双击桌面切换背景5次以上 | ✅ 已实现 | [pages/index/index.js](miniprogram/pages/index/index.js) |
| RECYCLE_BIN | 垃圾清理员 | 400💎 | 连续点击回收站多次 | ✅ 已实现 | [pages/index/index.js](miniprogram/pages/index/index.js) |
| MY_COMPUTER | 电脑专家 | 400💎 | 连续点击我的电脑多次 | ✅ 已实现 | [pages/index/index.js](miniprogram/pages/index/index.js) |
| BROWSER_CLICK | 网瘾少年 | 400💎 | 连续点击浏览器多次 | ✅ 已实现 | [pages/index/index.js](miniprogram/pages/index/index.js) |
| AVATAR_MASTER | 非主流达人 | 800💎 | 在非主流相机保存5张照片 | ✅ 已实现 | [pages/avatar/index.js](miniprogram/pages/avatar/index.js) |
| QCIO_SPACE_VISITOR | 空间常客 | 600💎 | 累计访问QCIO空间10次 | ✅ 已实现 | [pages/qcio/index.js](miniprogram/pages/qcio/index.js) |
| START_MENU_FAN | 开始菜单爱好者 | 500💎 | 累计打开开始菜单20次 | ✅ 已实现 | [pages/index/index.js](miniprogram/pages/index/index.js) |
| MARS_TRANSLATOR | 火星文大师 | 700💎 | 累计使用火星翻译10次 | ✅ 已实现 | [pages/mars/index.js](miniprogram/pages/mars/index.js) |
| NETWORK_EXCHANGER | 网费兑换者 | 500💎 | 首次在网管系统兑换网费 | ✅ 已实现 | [components/network-neighborhood/](miniprogram/components/network-neighborhood/index.js) |

### 🔵 稀有彩蛋 (6个)

| ID | 名称 | 奖励 | 触发方式 | 状态 | 实现位置 |
|----|------|------|----------|------|----------|
| BLUE_SCREEN | 那个年代的噩梦 | 2000💎 | 点击桌面左上角触发蓝屏 | ✅ 已实现 | [pages/index/index.js](miniprogram/pages/index/index.js) |
| HIDDEN_ICON | 消失的角落 | 2000💎 | 点击桌面右下角 | ✅ 已实现 | [pages/index/index.js](miniprogram/pages/index.js) |
| TIME_SPECIAL | 特殊时刻 | 1500💎 | 在特殊时间点查看 | ✅ 已实现 | [pages/index/index.js](miniprogram/pages/index/index.js) |
| CHAT_LOVER | 聊天狂魔 | 2500💎 | 累计发送100条聊天消息 | ✅ 已实现 | [pages/chat/index.js](miniprogram/pages/chat/index.js) |
| RECYCLE_BIN_EMPTYER | 回收站清理者 | 1500💎 | 在回收站页面清空回收站5次 | ✅ 已实现 | [pages/recycle-bin/index.js](miniprogram/pages/recycle-bin/index.js) |
| GROUP_CHAT_PARTY | 群聊狂欢 | 2000💎 | 累计发送50条群聊消息 | ✅ 已实现 | [pages/group-chat/index.js](miniprogram/pages/group-chat/index.js) |

### 🟣 史诗彩蛋 (1个)

| ID | 名称 | 奖励 | 触发方式 | 状态 | 实现位置 |
|----|------|------|----------|------|----------|
| TIME_MIDNIGHT | 深夜党专属 | 5000💎 | 凌晨0点查看 | ✅ 已实现 | [pages/index/index.js](miniprogram/pages/index/index.js) |

### 🟠 传说彩蛋 (1个)

| ID | 名称 | 奖励 | 触发方式 | 状态 | 实现位置 |
|----|------|------|----------|------|----------|
| KONAMI_CODE | 传说中的秘籍 | 10000💎 | 在"我的电脑"窗口按顺序: C→关→C→关→D→关→USB→关→D→关→C→关 → 关闭窗口 → 小狮子 → 开始 | ✅ 已实现 | [pages/index/index.js](miniprogram/pages/index/index.js), [components/my-computer/](miniprogram/components/my-computer/index.js) |

---

## 实现统计

- **总彩蛋数**: 20个
- **已实现**: 20个 (100%)
- **未实现**: 0个

### 按稀有度分布
- 普通: 12个 (400-1000💎)
- 稀有: 6个 (1500-2500💎)
- 史诗: 1个 (5000💎)
- 传说: 1个 (10000💎)

### 按类型分布
- 点击类 (click): 8个
- 长按类 (longpress): 1个
- 时间类 (time): 2个
- 序列类 (sequence): 1个
- 行为类 (action): 8个

---

## 文件结构

```
miniprogram/
├── utils/
│   └── egg-system.js          # 彩蛋系统核心逻辑
├── pages/
│   ├── index/
│   │   └── index.js            # 桌面彩蛋触发 (小狮子、任务栏、背景、图标、时间等)
│   ├── chat/
│   │   └── index.js            # 聊天狂魔彩蛋
│   ├── group-chat/
│   │   └── index.js            # 群聊狂欢彩蛋
│   ├── qcio/
│   │   └── index.js            # 空间常客彩蛋
│   ├── avatar/
│   │   └── index.js            # 非主流达人彩蛋
│   ├── mars/
│   │   └── index.js            # 火星文大师彩蛋
│   └── recycle-bin/
│       └── index.js            # 回收站清理者彩蛋
└── components/
    ├── network-neighborhood/
    │   └── index.js            # 网费兑换者彩蛋
    ├── my-computer/
    │   └── index.js            # Konami Code 序列检测（前8步）
    ├── egg-folder/
    │   └── index.wxml          # 彩蛋文件夹，包含彩蛋秘籍文件
    ├── text-file-viewer/
    │   ├── index.js            # 彩蛋大全显示，彩蛋秘籍分册加载
    │   └── index.wxml          # 彩蛋秘籍第一册内容（10条普通彩蛋）
    └── egg-discovery-dialog/
        ├── index.js            # Win98风格彩蛋发现弹窗组件
        ├── index.wxml          # 弹窗模板
        └── index.wxss          # 稀有度渐变样式

cloudfunctions/
└── user/
    └── index.js                # 云函数: checkChatEgg, checkQcioEgg, checkGroupChatEgg, checkRecycleBinEgg, checkMarsTranslatorEgg, discoverEgg
```

---

## 数据结构

### 云端数据 (users collection)

```javascript
{
  badges: [
    {
      name: '舞者',
      eggId: 'lion_dance',
      discoveredAt: Date
    }
  ],
  eggStats: {
    totalDiscovered: Number,
    totalEarned: Number,
    daysUsed: Number,
    chatMessageCount: Number,           // 聊天狂魔计数
    qcioSpaceVisitCount: Number,        // 空间常客计数
    groupChatMessageCount: Number,      // 群聊狂欢计数
    recycleBinEmptyCount: Number,       // 回收站清理者计数
    marsTranslatorCount: Number         // 火星文大师计数
  }
}
```

---

## 开发指南

### 添加新彩蛋

1. 在 `egg-system.js` 中定义 EGG_ID 和 EGG_CONFIG
2. 在对应页面添加触发逻辑
3. 如需云端计数，在 `user` 云函数添加 check 逻辑
4. 更新 `text-file-viewer` 组件显示

### 行为类彩蛋 (云端计数)

适用于需要跨设备累计的彩蛋（如聊天消息、访问次数）：

```javascript
// 1. 云函数添加计数逻辑
if (type === 'checkXxxEgg') {
  // 查询当前计数
  // 更新计数
  // 检查阈值
  // 返回是否触发
}

// 2. 页面调用
const res = await wx.cloud.callFunction({
  name: 'user',
  data: { type: 'checkXxxEgg' }
});
if (res.result.shouldTrigger) {
  eggSystem.discover(EGG_IDS.XXX);
}
```

### 交互类彩蛋 (本地计数)

适用于桌面交互类彩蛋（点击、长按等）：

```javascript
// 在页面中维护本地计数
data: {
  xxxCount: 0,
  xxxEggAchieved: false
},

// 触发时检查
checkXxxEgg: function() {
  if (this.data.xxxEggAchieved) return;
  this.setData({ xxxCount: this.data.xxxCount + 1 });
  if (this.data.xxxCount >= THRESHOLD) {
    this.setData({ xxxEggAchieved: true });
    eggSystem.discover(EGG_IDS.XXX);
  }
}
```

---

## 已废弃的功能

以下功能已被移除，相关彩蛋也已删除：

| 原彩蛋 | 原功能 | 移除原因 |
|--------|--------|----------|
| TETRIS_MASTER | 方块达人 | 俄罗斯方块游戏已删除 |

---

## 更新日志

### 2025-12-28 (v2.2)
- ✅ 创建可复用的 `egg-discovery-dialog` Win98风格组件
- ✅ 所有页面/组件统一使用Win98风格彩蛋弹窗
- ✅ 彩蛋秘籍分册：第一册仅显示10条普通彩蛋，为后续第二册、第三册预留空间
- ✅ 移除默认 toast 提示，所有彩蛋发现均使用自定义组件弹窗

### 2025-12-28 (v2.1)
- ✅ 重构 KONAMI_CODE (传说中的秘籍) - 改为在"我的电脑"窗口内通过"点击驱动器→关闭弹窗→关闭窗口"触发，不影响正常使用
- ✅ 新序列: C→关→C→关→D→关→USB→关→D→关→C→关 → 关闭窗口 → 小狮子 → 开始
- ✅ 用户正常点击驱动器会弹窗，关闭后可以继续操作或关闭窗口，只有刻意按照序列操作才会触发彩蛋

### 2025-12-28 (v2.0)
- ✅ 添加 RECYCLE_BIN_EMPTYER (回收站清理者) - 清空回收站5次
- ✅ 添加 GROUP_CHAT_PARTY (群聊狂欢) - 累计发送50条群聊消息
- ✅ 添加 MARS_TRANSLATOR (火星文大师) - 累计使用火星翻译10次
- ✅ 添加 NETWORK_EXCHANGER (网费兑换者) - 首次兑换网费
- ✅ 更新彩蛋大全显示20个彩蛋
- ✅ 实现云函数 checkRecycleBinEgg, checkGroupChatEgg, checkMarsTranslatorEgg

### 2025-12-28 (v1.0)
- ✅ 添加 START_MENU_FAN (开始菜单爱好者) - 累计打开开始菜单20次
- ✅ 添加 QCIO_SPACE_VISITOR (空间常客) - 累计访问QCIO空间10次
- ✅ 实现云函数 checkQcioEgg 支持云端计数
- ✅ 更新彩蛋大全显示16个彩蛋
- ❌ 移除 TETRIS_MASTER (俄罗斯方块已删除)

### 2025-12-27
- ✅ 添加 AVATAR_MASTER (非主流达人) - 连续保存5张照片
- ✅ 添加 CHAT_LOVER (聊天狂魔) - 累计发送100条消息
- ✅ 实现云函数 checkChatEgg 支持云端计数
- ✅ 彩蛋弹窗改为Win98风格自定义组件
- ✅ 移除桌面长按菜单中的"彩蛋收集"选项

### 更早版本
- ✅ 实现16个彩蛋的基础框架
- ✅ 双代币系统集成
- ✅ 云端数据同步
