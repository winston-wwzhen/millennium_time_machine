# 运营工具与数据统计系统

> 绕过小程序限制，在外部平台做排行榜和数据展示
>
> 讨论日期：2025-12-26

---

## 一、设计思路

### 核心逻辑

```
用户在小程序内互动
        ↓
   数据沉淀到云数据库
        ↓
   定时任务统计生成报告
        ↓
   在公众号/小红书等外部平台发布
        ↓
   吸引用户关注和传播
```

### 优势

| 优势 | 说明 |
|------|------|
| **绕过审核** | 排行榜不在小程序内，不影响审核 |
| **多平台分发** | 可在多个平台同时发布 |
| **内容运营** | 数据本身是优质内容 |
| **导流效果** | 排行榜可引导关注公众号 |
| **社交货币** | 用户愿意分享自己的排名 |

---

## 二、数据统计维度

### 用户维度

| 数据 | 说明 | 展示形式 |
|------|------|---------|
| **总用户数** | 累计注册用户 | 数字+趋势图 |
| **日活跃** | 每日活跃用户 | 数字+趋势图 |
| **留存率** | 次日/7日/30日留存 | 百分比 |
| **使用时长** | 平均停留时长 | 分钟 |
| **分享次数** | 用户分享次数 | 数字 |

### 游戏维度

| 数据 | 说明 | 展示形式 |
|------|------|---------|
| **结局达成** | 各结局达成人数 | 排行榜 |
| **最热结局** | 达成人数最多的结局 | TOP10 |
| **稀有结局** | 达成人数最少的结局 | TOP10 |
| **平均属性** | 用户的平均属性值 | 雷达图 |
| **通关次数** | 用户完成游戏次数 | 统计 |

### QCIO维度

| 数据 | 说明 | 展示形式 |
|------|------|---------|
| **等级排行** | 用户等级排名 | TOP100 |
| **Q点排行** | 用户Q点数量排名 | TOP100 |
| **聊天热度** | 聊天次数排名 | TOP100 |
| **彩蛋发现** | 彩蛋发现数量排名 | TOP100 |
| **头像使用** | 各头像使用次数 | 统计 |

### 内容维度

| 数据 | 说明 | 展示形式 |
|------|------|---------|
| **热门签名** | 使用最多的QQ签名 | TOP10 |
| **热门头像** | 使用最多的头像 | TOP10 |
| **热门对话** | 最有趣的AI对话 | 精选 |
| **彩蛋发现** | 各彩蛋发现人数 | 统计 |

---

## 三、排行榜设计

### 排行榜类型

#### 1. 等级排行榜

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     🏆 千禧时光机 · 等级排行榜
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【2025-01-15 更新】

🥇 LV.28   用户***86
🥈 LV.25   用户***52
🥉 LV.24   用户***33
 4. LV.23  用户***19
 5. LV.22  用户***07
...
100. LV.10 用户***45

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
你的排名：LV.15 排第 1,234 名
查看完整排行：关注公众号回复「排行榜」
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 2. 结局达成排行榜

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     📜 如果当时 · 最热结局
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【2025-01-15 更新】

🔥 达成人数最多的结局：

1. 互联网大厂CEO      1,234人达成
   "从2005年的第一批网民..."

2. 平凡而幸福         1,189人达成
   "虽然平凡，但很幸福..."

3. 自由职业者          987人达成
   "不受束缚的自由..."

💎 最稀有结局：

1. 穿越者             仅3人达成
2. 短命鬼             仅12人达成
3. 寿星               仅18人达成

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
你最接近哪个结局？来试试吧！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 3. 彩蛋猎人排行榜

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     🥚 彩蛋图鉴 · 发现排行
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【2025-01-15 更新】

🏆 彩蛋发现数量排行：

🥇 75个  用户***86  「彩蛋大师」
🥈 68个  用户***52  「探索达人」
🥉 62个  用户***33  「寻宝猎人」

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
总彩蛋数：80个
已发现彩蛋：52个（65%）
未发现彩蛋：28个

💡 提示：试试在浏览器输入 eggs.2005.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 4. 聊天话痨排行榜

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     💬 QCIO · 聊天热度排行
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【2025-01-15 更新】

🏆 聊天次数最多的用户：

🥇 12,456次  用户***86
🥈 10,234次  用户***52
🥉 9,876次   用户***33

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
最受欢迎的AI好友：
1. 小狮子      5,234人添加
2. 暗恋对象    4,567人添加
3. 死党        4,123人添加

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 5. 签名精选

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ✍️ QQ签名 · 每日精选
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【2025-01-15 更新】

🔥 最热门的签名：

1. "那些年，我们一起追的女孩..."
   使用人数：1,234人

2. "非主流，我乐意！"
   使用人数：1,089人

3. "葬爱家族，永不言弃！"
   使用人数：987人

4. "火星文，你懂不懂？"
   使用人数：876人

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
你的签名上榜了吗？来写个签名吧！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 四、云函数设计

### 1. 数据统计云函数

```javascript
// cloudfunctions/daily-stats/index.js

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

exports.main = async (event, context) => {
  const { type = 'all' } = event

  const stats = {}

  // 用户统计
  if (type === 'all' || type === 'user') {
    stats.user = await getUserStats()
  }

  // 游戏统计
  if (type === 'all' || type === 'game') {
    stats.game = await getGameStats()
  }

  // QCIO统计
  if (type === 'all' || type === 'qcio') {
    stats.qcio = await getQCIOStats()
  }

  // 排行榜
  if (type === 'all' || type === 'rank') {
    stats.rank = await getRankings()
  }

  return {
    code: 0,
    data: stats,
    generatedAt: new Date().toISOString()
  }
}

// 用户统计
async function getUserStats() {
  const totalUsers = await db.collection('users').count()
  const todayUsers = await db.collection('users')
    .where({
      createdAt: db.gte(new Date().setHours(0, 0, 0, 0))
    })
    .count()

  return {
    total: totalUsers.total,
    todayNew: todayUsers.total
  }
}

// 游戏统计
async function getGameStats() {
  // 统计各结局达成人数
  const endings = await db.collection('game_results')
    .aggregate()
    .group({
      _id: '$endingId',
      count: $.sum(1)
    })
    .sort({ count: -1 })
    .limit(20)
    .end()

  return {
    endings: endings.list
  }
}

// QCIO统计
async function getQCIOStats() {
  // 等级排行
  const levelRank = await db.collection('users')
    .orderBy('level', 'desc')
    .limit(100)
    .field({
      _id: false,
      openid: true,
      level: true,
      nickname: true
    })
    .get()

  // Q点排行
  const qpointsRank = await db.collection('users')
    .orderBy('qpoints', 'desc')
    .limit(100)
    .field({
      _id: false,
      openid: true,
      qpoints: true,
      nickname: true
    })
    .get()

  return {
    levelRank: levelRank.data,
    qpointsRank: qpointsRank.data
  }
}

// 排行榜
async function getRankings() {
  // 彩蛋发现排行
  const eggRank = await db.collection('users')
    .orderBy('discoveredEggs.length', 'desc')
    .limit(100)
    .field({
      _id: false,
      openid: true,
      discoveredEggs: true,
      nickname: true
    })
    .get()

  return {
    eggRank: eggRank.data
  }
}
```

### 2. 定时任务云函数

```javascript
// cloudfunctions/scheduled-stats/index.js

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  // 生成每日数据报告
  const stats = await generateDailyStats()

  // 保存到历史记录
  await db.collection('daily_stats').add({
    data: {
      date: new Date().toISOString().split('T')[0],
      stats: stats,
      createdAt: new Date()
    }
  })

  // 生成排行榜数据（供外部平台使用）
  const rankings = await generateRankings()

  // 保存排行榜
  await db.collection('rankings').add({
    data: {
      date: new Date().toISOString().split('T')[0],
      rankings: rankings,
      createdAt: new Date()
    }
  })

  return { success: true }
}

async function generateDailyStats() {
  // 今日新增用户
  const todayNew = await db.collection('users')
    .where({
      createdAt: _.gte(new Date().setHours(0, 0, 0, 0))
    })
    .count()

  // 今日活跃用户
  const todayActive = await db.collection('activity_logs')
    .where({
      timestamp: _.gte(new Date().setHours(0, 0, 0, 0))
    })
    .count()

  // 今日分享次数
  const todayShares = await db.collection('share_logs')
    .where({
      timestamp: _.gte(new Date().setHours(0, 0, 0, 0))
    })
    .count()

  return {
    newUsers: todayNew.total,
    activeUsers: todayActive.total,
    shares: todayShares.total
  }
}

async function generateRankings() {
  // 等级排行
  const levelRank = await db.collection('users')
    .orderBy('level', 'desc')
    .limit(100)
    .field({ openid: true, level: true, nickname: true })
    .get()

  // 结局排行
  const endings = await db.collection('game_results')
    .aggregate()
    .group({
      _id: '$endingId',
      endingTitle: $.first('$endingTitle'),
      count: $.sum(1)
    })
    .sort({ count: -1 })
    .end()

  return {
    level: levelRank.data,
    endings: endings.list
  }
}
```

---

## 五、数据获取接口

### 小程序内调用

```javascript
// 获取我的排名
async function getMyRanking() {
  const res = await wx.cloud.callFunction({
    name: 'daily-stats',
    data: {
      type: 'my_ranking'
    }
  })

  return res.result.data
}
```

### 外部获取（HTTP API）

```javascript
// 云函数：http-api（提供HTTP接口）
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { action, type } = event

  if (action === 'get_rankings') {
    const rankings = await cloud.database()
      .collection('rankings')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get()

    return rankings.data[0]
  }

  if (action === 'get_stats') {
    const stats = await cloud.database()
      .collection('daily_stats')
      .orderBy('createdAt', 'desc')
      .limit(7)
      .get()

    return stats.data
  }

  return { error: 'Invalid action' }
}
```

---

## 六、外部平台发布策略

### 发布平台

| 平台 | 内容形式 | 频率 | 特点 |
|------|---------|------|------|
| **公众号** | 图文 | 每日 | 详细数据，可加链接 |
| **小红书** | 图文 | 每日 | 吸引年轻用户 |
| **微博** | 图文 | 每日 | 传播快 |
| **朋友圈** | 海报 | 每日 | 私域传播 |

### 发布内容模板

#### 公众号每日推文模板

```
标题：千禧时光机 · 每日数据（2025-01-15）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【今日数据】
• 新增用户：123人
• 活跃用户：1,234人
• 完成游戏：456次
• 发现彩蛋：89个
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【等级排行榜 TOP10】
🥇 LV.28   用户***86
🥈 LV.25   用户***52
...

【最热结局 TOP5】
1. 互联网大厂CEO  (1,234人)
2. 平凡而幸福     (1,189人)
...

【彩蛋发现排行 TOP10】
🥇 75个  用户***86
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
你的排名？回复「我的排名」查询
进入小程序：点击小程序卡片
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 小红书内容模板

```
标题：千禧时光机排行榜来啦！你排第几？

配图：排行榜海报图

内容：
今天是千禧时光机上线第X天！
来围观一下各路大神～

🏆 等级最高的大神已经LV.28了！
📜 最热的结局是「互联网大厂CEO」
🥚 彩蛋大师已经发现了75个彩蛋！

你发现了几个彩蛋？
快来评论区晒一晒！

#千禧时光机 #排行榜 #非主流 #怀旧
```

#### 朋友圈海报模板

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   千禧时光机 · 每日数据
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

今日新增：123人
总用户数：12,345人

🏆 等级第一：LV.28
📜 最热结局：互联网大厂CEO
🥚 彩蛋之王：75个

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
扫码查看你的排名
[小程序码]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 七、自动化工具设计

### 1. 海报生成工具

```javascript
// cloudfunctions/generate-poster/index.js

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { type = 'daily' } = event

  // 生成排行榜海报
  const posterData = await generateRankingPoster()

  return {
    posterUrl: posterData.url,
    data: posterData
  }
}

async function generateRankingPoster() {
  // 获取排行榜数据
  const rankings = await cloud.database()
    .collection('rankings')
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get()

  // 调用海报生成服务
  // 可以用canvas或者第三方服务
  // 返回海报URL

  return {
    url: 'https://xxx.com/poster/daily_20250115.png',
    data: rankings.data[0]
  }
}
```

### 2. 自动发布工具

```javascript
// 本地脚本：scripts/auto-publish.js

const axios = require('axios')

async function publishDailyStats() {
  // 1. 获取数据
  const stats = await getDailyStats()

  // 2. 生成海报
  const poster = await generatePoster(stats)

  // 3. 发布到公众号（需要公众号API）
  await publishToWeixin(stats, poster)

  // 4. 发布到小红书（手动或半自动）
  // await publishToXiaohongshu(stats, poster)

  console.log('发布完成')
}

async function getDailyStats() {
  const res = await axios.post('https://xxx.cloudfunction.com/http-api', {
    action: 'get_rankings'
  })
  return res.data
}

async function generatePoster(stats) {
  // 调用海报生成云函数
}

async function publishToWeixin(stats, poster) {
  // 调用公众号API发布图文
}
```

### 3. 定时执行

```javascript
// 使用云函数定时触发器
// cloudfunctions/scheduled-pubish/config.json

{
  "triggers": [{
    "name": "dailyPublishTimer",
    "type": "timer",
    "config": "0 0 20 * * * *"
  }]
}

// 每天20:00执行
```

---

## 八、隐私保护

### 数据脱敏

| 数据 | 处理方式 |
|------|---------|
| openid | 完全隐藏 |
| nickname | 显示前3位+*** |
| avatar | 可选显示 |
| 等级/Q点 | 正常显示 |
| 成就 | 正常显示 |

### 用户授权

```javascript
// 用户可以选择是否参与排行榜
{
  "allowRanking": true,  // 是否参与排行榜
  "showNickname": false, // 是否显示昵称
  "showAvatar": false    // 是否显示头像
}
```

---

## 九、开发优先级

### 第一期：基础统计

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 数据统计云函数 | 🔴 高 | 统计各类数据 |
| 排行榜数据生成 | 🔴 高 | 生成每日排行 |
| 简单展示接口 | 🔴 高 | 提供数据查询 |

### 第二期：外部发布

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 海报生成工具 | 🟡 中 | 生成排行海报 |
| 公众号发布 | 🟡 中 | 每日推文 |
| 小红书发布 | 🟡 中 | 每日内容 |

### 第三期：自动化

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 自动发布脚本 | 🟢 低 | 自动化运营 |
| 定时任务 | 🟢 低 | 定时生成发布 |
| 数据分析 | 🟢 低 | 更深度的分析 |

---

## 十、注意事项

### 合规注意

| 注意 | 说明 |
|------|------|
| **隐私保护** | 必须脱敏用户信息 |
| **用户授权** | 需要用户同意参与排行榜 |
| **数据安全** | 不要泄露敏感数据 |
| **避免诱导** | 不要过度强调竞争 |

### 运营建议

1. **不过度强调排名** - 以展示为主，不制造焦虑
2. **突出趣味性** - 排行榜要有趣，不是竞技
3. **定期更新** - 保持数据新鲜度
4. **多平台分发** - 扩大影响力

---

> 数据本身是优质内容，用得好就是运营利器。
>
> © 2025 千禧时光机 · 运营工具系统
