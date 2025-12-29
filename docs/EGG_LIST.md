# 彩蛋列表 (Easter Eggs)

千禧时光机 - 完整彩蛋触发指南

## 概述

- **总彩蛋数**: 20个
- **代币系统**: 时光币（发现彩蛋获得）→ 网费（AI功能消费）
- **存储方式**: 云端同步，跨设备共享进度
- **查看方式**: 桌面右键菜单 → 彩蛋收集册

---

## 稀有度说明

| 稀有度 | 标识 | 奖励范围 |
|--------|------|----------|
| 普通 | 🟢 | 400-1000 时光币 |
| 稀有 | 🔵 | 1200-2500 时光币 |
| 史诗 | 🟣 | 5000 时光币 |
| 传说 | 🟠 | 10000 时光币 |

---

## 完整彩蛋列表

### 🟢 普通

#### 1. 舞动的小狮子？
- **ID**: `lion_dance`
- **描述**: 小狮子好像会跳舞...
- **触发**: 点击小狮子 10 次
- **位置**: [桌面首页](../miniprogram/pages/index/index.js)
- **奖励**: 1000 时光币 + 徽章「舞者」
- **代码**: `index.js:1019` (onAgentTap)

#### 2. 它会说话
- **ID**: `lion_talk`
- **描述**: 小狮子好像有话想说
- **触发**: 长按小狮子 350ms+
- **位置**: [桌面首页](../miniprogram/pages/index/index.js)
- **奖励**: 1000 时光币 + 徽章「倾听者」
- **代码**: `index.js:1002` (onAgentDragEnd)

#### 3. 底部秘密
- **ID**: `taskbar_surprise`
- **描述**: 任务栏里藏着什么？
- **触发**: 点击任务栏 10 次
- **位置**: [桌面首页](../miniprogram/pages/index/index.js)
- **奖励**: 1000 时光币 + 徽章「探索者」
- **代码**: `index.js:1215` (onTaskbarTap)

#### 4. 换了个心情
- **ID**: `bg_switch`
- **描述**: 双击桌面试试？
- **触发**: 双击桌面空白处（首次切换）
- **位置**: [桌面首页](../miniprogram/pages/index/index.js)
- **奖励**: 500 时光币 + 徽章「艺术家」
- **代码**: `index.js:1150` (onDesktopTap)

#### 5. 硬件大师
- **ID**: `my_computer`
- **描述**: 你对电脑很执着...
- **触发**: 点击「我的电脑」图标 5 次
- **位置**: [桌面首页](../miniprogram/pages/index/index.js)
- **奖励**: 400 时光币 + 徽章「硬件控」
- **代码**: `index.js:660` (checkIconClickEggs)

#### 6. 网瘾少年
- **ID**: `browser_click`
- **描述**: 你是想上网冲浪吗？
- **触发**: 点击「浏览器」图标 5 次
- **位置**: [桌面首页](../miniprogram/pages/index/index.js)
- **奖励**: 400 时光币 + 徽章「冲浪达人」
- **代码**: `index.js:660` (checkIconClickEggs)

#### 7. 非主流达人
- **ID**: `avatar_master`
- **描述**: 你真的很爱拍非主流照片...
- **触发**: 在非主流相机连续保存 5 张照片
- **位置**: [非主流相机页面](../miniprogram/pages/avatar/index.js)
- **奖励**: 800 时光币 + 徽章「非主流达人」
- **代码**: `avatar/index.js:994` (checkAvatarEgg)

#### 8. 空间常客
- **ID**: `qcio_space_visitor`
- **描述**: 你是 QCIO 空间的常客...
- **触发**: 累计访问 10 次 QCIO 空间
- **位置**: [QCIO 页面](../miniprogram/pages/qcio/index.js)
- **奖励**: 600 时光币 + 徽章「踩空间达人」
- **代码**: `qcio/index.js` (访问计数触发)

#### 9. 开始菜单爱好者
- **ID**: `start_menu_fan`
- **描述**: 你真的很喜欢开始菜单...
- **触发**: 累计打开开始菜单 20 次
- **位置**: [桌面首页](../miniprogram/pages/index/index.js)
- **奖励**: 500 时光币 + 徽章「菜单控」
- **代码**: `index.js:710` (toggleStartMenu)

#### 10. 火星文大师
- **ID**: `mars_translator`
- **描述**: 你已经掌握了火星文的奥秘...
- **触发**: 使用浏览器内火星翻译功能 10 次
- **位置**: [浏览器页面](../miniprogram/pages/browser/index.js)
- **奖励**: 700 时光币 + 徽章「火星使者」
- **代码**: `browser/index.js:383` (checkMarsEgg)

#### 11. 网费兑换者
- **ID**: `network_exchanger`
- **描述**: 你懂得如何管理网费...
- **触发**: 首次在网管系统兑换网费
- **位置**: [网管系统](../miniprogram/pages/network-neighborhood/index.js)
- **奖励**: 500 时光币 + 徽章「理财达人」
- **代码**: 网管兑换逻辑

#### 12. 计算器高手
- **ID**: `calculator_master`
- **描述**: 你对数字很敏感...
- **触发**: 在浏览器计算器连续计算 10 次
- **位置**: [浏览器页面](../miniprogram/pages/browser/index.js)
- **奖励**: 800 时光币 + 徽章「精算师」
- **代码**: `browser/index.js:734` (onCalcEqual)

---

### 🔵 稀有

#### 13. 那个年代的噩梦
- **ID**: `blue_screen`
- **描述**: 怀念那种蓝屏的感觉吗？
- **触发**: 点击桌面空白处 50 次
- **位置**: [桌面首页](../miniprogram/pages/index/index.js)
- **奖励**: 2000 时光币 + 徽章「蓝屏幸存者」
- **代码**: `index.js:1160` (onDesktopTap)

#### 14. 消失的角落
- **ID**: `hidden_icon`
- **描述**: 右下角好像有什么...
- **触发**: 桌面右下角点击触发（隐藏图标）
- **位置**: [桌面首页](../miniprogram/pages/index/index.js)
- **奖励**: 2000 时光币 + 徽章「寻宝者」
- **代码**: `index.js:1239` (toggleHiddenIcon)

#### 15. 特殊时刻
- **ID**: `time_special`
- **描述**: 这个时间点有点东西
- **触发**: 在特殊时间点访问：12:34, 04:44, 11:11, 22:22, 03:33, 05:55, 15:15
- **位置**: [桌面首页](../miniprogram/pages/index/index.js)
- **奖励**: 1500 时光币 + 徽章「时刻见证者」
- **代码**: `index.js:434` (checkTimeEggs)

#### 16. 聊天狂魔
- **ID**: `chat_lover`
- **描述**: 你真的是话痨本痨...
- **触发**: 累计发送 100 条聊天消息
- **位置**: [聊天页面](../miniprogram/pages/chat/index.js)
- **奖励**: 2500 时光币 + 徽章「话痨」
- **代码**: 聊天消息计数

#### 17. 群聊狂欢
- **ID**: `group_chat_party`
- **描述**: 群聊才是真正的战场...
- **触发**: 在群聊累计发送 50 条消息
- **位置**: [群聊页面](../miniprogram/pages/group-chat/index.js)
- **奖励**: 2000 时光币 + 徽章「群星」
- **代码**: 群聊消息计数

#### 18. 回收站清理者
- **ID**: `recycle_bin_emptyer`
- **描述**: 你真的很爱清理回收站...
- **触发**: 在回收站页面清空回收站 5 次
- **位置**: [回收站页面](../miniprogram/pages/recycle-bin/index.js)
- **奖励**: 1500 时光币 + 徽章「清洁工」
- **代码**: `recycle-bin/index.js:150` (emptyRecycleBin)

#### 19. 星际探险家
- **ID**: `star_explorer`
- **描述**: 你在星际探索中展现了智慧...
- **触发**: 在浏览器内星际探索游戏通关任意难度
- **位置**: [浏览器页面](../miniprogram/pages/browser/index.js)
- **奖励**: 1500 时光币 + 徽章「扫雷高手」
- **代码**: `browser/index.js:626` (starGameOver)

#### 20. 时光旅行者
- **ID**: `calendar_time_traveler`
- **描述**: 你回到了 2006 年的那一天...
- **触发**: 在浏览器万年历查看 2006 年 6 月
- **位置**: [浏览器页面](../miniprogram/pages/browser/index.js)
- **奖励**: 1200 时光币 + 徽章「时空旅人」
- **代码**: `browser/index.js:861` (generateCalendar)

#### 21. 浏览器领航员
- **ID**: `browser_navigator`
- **描述**: 你精通浏览器的一切操作...
- **触发**: 在浏览器使用前进、后退、刷新各 3 次
- **位置**: [浏览器页面](../miniprogram/pages/browser/index.js)
- **奖励**: 1000 时光币 + 徽章「导航大师」
- **代码**: `browser/index.js:222-291` (onBrowserBack/Forward/Refresh)

---

### 🟣 史诗

#### 22. 深夜党专属
- **ID**: `time_midnight`
- **描述**: 凌晨 0 点，有惊喜
- **触发**: 在 0:00-0:59 之间访问小程序
- **位置**: [桌面首页](../miniprogram/pages/index/index.js)
- **奖励**: 5000 时光币 + 徽章「夜猫子」
- **代码**: `index.js:494` (checkTimeEggs)

---

### 🟠 传说

#### 23. 传说中的秘籍 (KONAMI_CODE)
- **ID**: `konami_code`
- **描述**: C盘→关→C盘→关→D盘→关→USB→关→D盘→关→C盘→关→关窗→小狮子→开始
- **触发**:
  1. 打开「我的电脑」窗口
  2. 按顺序点击：C盘→关闭→C盘→关闭→D盘→关闭→USB→关闭→D盘→关闭→C盘→关闭
  3. 关闭窗口
  4. 点击小狮子
  5. 点击开始菜单
- **位置**: [我的电脑组件](../miniprogram/components/my-computer/index.js) + [桌面首页](../miniprogram/pages/index/index.js)
- **奖励**: 10000 时光币 + 徽章「上帝之手」
- **代码**:
  - 阶段1: `my-computer/index.js` (驱动器序列检测)
  - 阶段2: `index.js:1269-1333` (Konami 最终输入)

---

## 技术实现

### 核心文件

| 文件 | 说明 |
|------|------|
| [egg-system.js](../miniprogram/utils/egg-system.js) | 彩蛋系统核心，所有彩蛋配置和状态管理 |
| [index.js](../miniprogram/pages/index/index.js) | 桌面彩蛋触发：小狮子、任务栏、时间、蓝屏等 |
| [browser/index.js](../miniprogram/pages/browser/index.js) | 浏览器工具彩蛋：星际、计算器、万年历、火星翻译等 |
| [avatar/index.js](../miniprogram/pages/avatar/index.js) | 非主流相机彩蛋 |
| [recycle-bin/index.js](../miniprogram/pages/recycle-bin/index.js) | 回收站彩蛋 |
| [qcio/index.js](../miniprogram/pages/qcio/index.js) | QCIO 社交彩蛋 |

### 彩蛋数据结构

```javascript
{
  id: 'egg_id',           // 唯一标识
  name: '彩蛋名称',
  description: '描述文本',
  hint: '触发提示',
  rarity: 'common',       // common, rare, epic, legendary
  type: 'click',          // click, longpress, time, sequence, action
  reward: {
    coins: 1000,          // 时光币奖励
    badge: '徽章名称'
  }
}
```

### 发现回调系统

所有页面都可以注册彩蛋发现回调，用于自定义发现弹窗样式：

```javascript
const key = eggSystem.registerEggDiscoveryCallback((config) => {
  // 自定义弹窗逻辑
});
```

---

## 开发指南

### 添加新彩蛋

1. **在 egg-system.js 中添加配置**:
   ```javascript
   const EGG_IDS = {
     NEW_EGG: 'new_egg'
   };

   const EGG_CONFIG = {
     [EGG_IDS.NEW_EGG]: {
       id: EGG_IDS.NEW_EGG,
       name: '新彩蛋',
       description: '描述',
       hint: '提示',
       rarity: 'common',
       type: 'action',
       reward: { coins: 500, badge: '徽章' }
     }
   };
   ```

2. **在对应页面触发**:
   ```javascript
   const result = await eggSystem.discover(EGG_IDS.NEW_EGG);
   if (result.isNew) {
     // 首次发现逻辑
   }
   ```

---

## 更新日志

- **v3.6**: 新增浏览器工具彩蛋（星际探险家、计算器高手、时光旅行者、浏览器领航员）
- **v3.5**: 新增非主流达人彩蛋（浏览器内非主流相机）
- **v3.0**: 完整彩蛋系统上线，20个彩蛋

---

> 💡 **提示**: 彩蛋收集进度可在桌面右键菜单 → 彩蛋收集册 中查看
