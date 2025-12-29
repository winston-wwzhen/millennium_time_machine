# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

千禧时光机 (Millennium Time Machine) - A nostalgic WeChat Mini Program that recreates the 2006 QQ/QQ Space experience with a Windows 98 desktop interface and AI-powered social interactions.

**Platform**: WeChat Mini Program (微信小程序) - Native Framework
**Language**: JavaScript (WXML + WXSS + JavaScript)
**Backend**: WeChat Cloud Development (wx-server-sdk)
**AI**: Zhipu AI GLM series models

## Development

### Opening the Project

1. Open **WeChat Developer Tools** (微信开发者工具)
2. Import project with `miniprogram/` as the root directory
3. Configure `appid` in `project.config.json` (or use test AppID)

### Deploying Cloud Functions

```bash
# Batch deploy all cloud functions
bash uploadCloudFunction.sh [envId]

# Or manually in WeChat Developer Tools:
# Right-click each cloudfunction folder -> Upload and Deploy
```

### Database Initialization

**Total Collections: 32**

Use the `init-db` cloud function to automatically create all collections:

```javascript
wx.cloud.callFunction({
  name: 'init-db',
  data: { action: 'init' }
})
```

**Collections**:
- User System: `users`, `user_transactions`, `user_activity_logs`, `user_photos`, `user_shares`, `user_share_visits`
- QCIO Social: `qcio_users`, `qcio_wallet`, `qcio_transactions`, `qcio_daily_tasks`, `qcio_achievements`, `qcio_user_achievements`, `qcio_mood_logs`, `qcio_guestbook`, `qcio_experience_logs`, `qcio_user_level_rewards`, `qcio_visit_stats`
- QCIO Farm: `qcio_farm_profiles`, `qcio_farm_plots`, `qcio_farm_inventory`, `qcio_farm_logs`
- VIP System: `qcio_vip_codes`, `qcio_vip_records`
- AI & Groups: `qcio_ai_contacts`, `qcio_groups`, `qcio_chat_history`, `qcio_group_chat_history`
- Games: `mood_garden`, `ifthen_endings`, `ifthen_shares`, `ifthen_play_history`, `ifthen_share_visits`

For testing, use `clear-db` to reset all data:
```javascript
wx.cloud.callFunction({
  name: 'clear-db',
  data: { action: 'clear', confirm: true }
})
```

**See Also**: Development Conventions section for adding new tables.

## Architecture

### Project Structure

```
miniprogram/          # Frontend (import this in WeChat Developer Tools)
├── pages/
│   ├── index/        # Windows 98 desktop homepage
│   ├── chat/         # Single-person chat
│   ├── group-chat/   # Group chat
│   ├── qcio/         # QCIO social space
│   │   ├── visit/    # Visit others' space (standalone page)
│   │   └── components/
│   ├── qcio-chat/    # QCIO chat interface
│   ├── farm/         # Mood farm game
│   ├── network-neighborhood/  # Network Management System (dual currency, exchange)
│   ├── star-explorer/  # Star explorer game
│   ├── mars/         # Mars translator
│   └── avatar/       # Non-mainstream avatar generator
├── utils/
│   └── network.js    # Network state management
└── components/       # Shared components

cloudfunctions/       # Backend
├── chat/             # AI chat engine (36 modes, 100 AI contacts)
├── qcio/             # QCIO social features
│   └── modules/
│       ├── wallet.js       # Wallet system
│       ├── dailyTasks.js   # Daily tasks (踩一踩)
│       ├── achievements.js # Achievements
│       ├── moodLog.js      # Mood logs
│       └── guestbook.js    # Guestbook/留言板
├── user/             # User login, QCIO account management
├── mood_logic/       # Mood farm game logic
├── init-db/          # Database initialization (32 collections)
└── clear-db/         # Database clearing for testing

db-init/              # Database initialization data
├── qcio_ai_contacts/ # 100 AI contacts JSON
└── qcio_groups/      # 6 group chats JSON
```

### Cloud Functions

| Function | Purpose |
|----------|---------|
| `chat` | AI chat with 36 modes, single/group chat, GLM API integration |
| `qcio` | All QCIO social features (visit, wallet, tasks, guestbook) |
| `user` | User login, 5-digit QCIO account (10000-99999), random friend assignment, dual currency system, easter eggs |
| `mood_logic` | Mood farm game logic |
| `init-db` | Initialize all 32 database collections with AI data |
| `clear-db` | Clear all data for testing (requires confirm=true) |

### Dual Currency System

The app features a dual currency system that creates a gameplay loop:

**Currencies**:
- **💎 时光币**: Earned through discovering easter eggs, used to purchase 网费 and CDKs
- **🌐 网费**: Initial 30 days (43,200 min), deducted daily (1,440 min), consumed by AI features

**Exchange Rate**: 1000 时光币 = 1 day (1440 min) of 网费, i.e., 1 时光币 ≈ 1.44 minutes

**Game Loop**:
1. New users get 30 days free 网费 (recorded in transaction history as "新用户赠送30天网费")
2. Daily login deducts 1 day of 网费 automatically
3. Explore desktop to discover easter eggs → earn 时光币
4. Use 网管系统 to exchange 时光币 for 网费
5. Continue using AI features with purchased 网费

**Net Fee Zero Logic**:
- Daily login deduction allows negative balance (no check)
- Feature usage (chat, mood logs, etc.) requires sufficient balance
- When balance insufficient: users blocked with "网费不足" error
- Transaction history shows all fee changes (daily_deduct, exchange, usage types)

**Cloud Function Operations** (`user`):
- `login` - Daily login with net fee deduction, records transaction for new users
- `getBalance` - Fetch both currency balances
- `exchangeNetFee` - Exchange 时光币 → 网费 (1:1 ratio)
- `deductNetFee` - Consume 网费 for AI features, records usage transaction
- `discoverEgg` - Record easter egg discovery, award 时光币

**Transaction History**:
- Stored in `user_transactions` collection
- Types: `daily_deduct` (daily login), `exchange` (top-up), `usage` (chat/AI features)
- Viewable in 网管系统 via "扣费记录" button

### Easter Egg System

**12 Hidden Eggs** distributed across the desktop:
- **Common** (400-1000 coins): Lion dance, Lion talk, Taskbar surprise, Background switch, Recycle bin, My computer, Browser click
- **Rare** (1500-2000 coins): Blue screen, Hidden icon, Special time
- **Epic** (5000 coins): Midnight secret
- **Legendary** (10000 coins): Konami code sequence

**Features**:
- Cloud-based storage (syncs across devices)
- Achievement badges collection
- Progress tracking with percentage display
- Discovery effects with rarity-colored modals

**Egg System File**: `miniprogram/utils/egg-system.js`

### Legendary Easter Egg: KONAMI_CODE

**⚠️ IMPORTANT: When modifying the "my-computer" component or "index" page, be aware of this egg!**

The **KONAMI_CODE** (传说中的秘籍) is the most complex easter egg in the system. It involves a multi-step sequence that spans across the desktop and the "我的电脑" (My Computer) window.

**Trigger Sequence** (11 steps):
```
C盘 → 关闭弹窗 → C盘 → 关闭弹窗 → D盘 → 关闭弹窗 → USB → 关闭弹窗 → D盘 → 关闭弹窗 → C盘 → 关闭弹窗 → 关闭窗口 → 点击小狮子 → 点击开始菜单
```

**Implementation Files**:
1. **`miniprogram/components/my-computer/index.js`** - Detects the first 9 steps (drive clicks + dialog closes)
2. **`miniprogram/pages/index/index.js`** - Completes the final 3 steps (window close → lion → start menu)

**How It Works**:

**Phase 1: My Computer Window** (first 9 steps)
- Each drive click opens a dialog (C, D, or USB)
- The dialog close event is tracked
- Sequence is stored in a `konamiSequence` array: `['C', 'D', 'USB']`
- Expected sequence: `['C', 'C', 'D', 'USB', 'D', 'C']` (5 drives, each followed by dialog close)
- After each correct sequence completion, a flag `konamiCodeCompleted` is set to `true`
- This flag is passed back to parent page via `bindwindowclose` event

**Phase 2: Desktop** (final 3 steps)
- `onMyComputerWindowClose()` receives the `konamiCodeCompleted` flag
- Sets `konamiCodePhase1Completed` to `true`
- `onLionClick()` checks if phase 1 is complete
- `onStartMenuClick()` triggers the egg if both phase 1 and lion click are complete

**Key Implementation Details**:

```javascript
// my-computer/index.js
konamiSequence: ['C', 'C', 'D', 'USB', 'D', 'C']  // Expected sequence
currentKonamiIndex: 0  // Current position in sequence
konamiCodeCompleted: false  // Set to true when sequence complete

// Pages/index/index.js
konamiCodePhase1Completed: false  // Receives from my-computer component
konamiCodeLionClicked: false  // Set to true after lion click
```

**⚠️ Modification Guidelines**:

When modifying **`miniprogram/components/my-computer/`**:
- **DO NOT** remove or rename the `konamiSequence`, `currentKonamiIndex`, or `konamiCodeCompleted` data properties
- **DO NOT** change the `onDriveClick()` or `closeDriveDialog()` methods without preserving the Konami code logic
- **DO NOT** modify the `bindwindowclose` event to remove the `konamiCodeCompleted` parameter
- If adding new drive dialogs, update the sequence logic accordingly

When modifying **`miniprogram/pages/index/`**:
- **DO NOT** remove or rename the `konamiCodePhase1Completed`, `konamiCodeLionClicked` data properties
- **DO NOT** modify `onMyComputerWindowClose()`, `onLionClick()`, or `onStartMenuClick()` without preserving the Konami code logic
- The egg requires my-computer to close cleanly via its X button, not programmatic closing

**Reward**: 10000 💎 (时光币) + Win98-style discovery modal

**Why This Design?**
- Users can normally click drives and close dialogs for legitimate file viewing
- The egg only triggers when the specific sequence is followed intentionally
- Does not interfere with normal "我的电脑" window usage

### Network Simulation

The app simulates **33.6 Kbps dial-up networking**:

- Users must connect via "网管系统" (Network Management System) before AI features work
- Connection status shown in system tray (bottom-right)
- AI errors (429 rate limit, timeout) are wrapped as "network disconnected" prompts
- Guides users to reconnect through Network Management System

**Network state management**: `miniprogram/utils/network.js`

### AI Chat System

**36 Chat Modes** (cloudfunctions/chat/index.js):
- `qingwu` - 轻舞飞扬 (火星文/非主流)
- `sadsoul` - 忧郁王子
- `netadmin` - 网管小哥
- `fortune_teller` - 算命大师
- `mars` - 火星文转换
- `joker` - 段子手
- ...and more

**100 AI Contacts** - 12 groups:
| Group | Count | Style |
|-------|-------|-------|
| 葬爱家族 | 22 | 非主流火星文 |
| 网游开黑 | 6 | 游戏爱好者 |
| 网吧常驻 | 6 | 技术、网吧 |
| 网络评论家 | 7 | 键盘侠、吐槽 |
| 神秘人士 | 9 | 玄学、中二 |
| 情感咨询 | 6 | 恋爱、八卦 |
| 学霸联盟 | 7 | 学习、技术 |
| 文艺青年 | 8 | 诗歌、古风 |
| 娱乐达人 | 7 | 电影、音乐 |
| 佛系一族 | 5 | 禅意、极简 |
| 普通人 | 7 | 日常生活 |
| 工具人 | 10 | 转换功能 |

**6 Group Chats** - 18-24 members each:
- 葬爱网游家族 (24) - qingwu style
- 网吧技术联盟 (20) - netadmin style
- 神秘学园 (20) - fortune_teller style
- 情感八卦圈 (21) - love_expert style
- 学霸文艺社 (19) - nerd style
- 普通生活馆 (18) - down_to_earth style

**Group Chat Response Mechanism**:
- Each message triggers 1-6 random members to reply
- Probability distribution: 1人40%, 2人30%, 3人15%, 4人8%, 5人5%, 6人2%
- Random delay between AI responses: 0.8-1.8 seconds

### QCIO Social System

**Account System**:
- 5-digit accounts (10000-99999)
- Fixed password: 123456
- Randomly assigns 20 friends from 100 AI contacts on first login

**Space Visiting (踩一踩)**:
- Daily limit: One visit per space per day
- Auto-generates random guestbook message after visiting
- Tracks visit count and recent visitors (last 10)
- Share link: `pages/qcio/visit?account=XXXXX&from=share`

**Data Structure**:
```javascript
// qcio_users collection
{
  _openid: String,
  account: String,      // 5-digit QCIO number
  nickname: String,
  avatar: String,
  sign: String,         // Personal signature
  level: Number,
  online: Boolean,
  visitCount: Number,   // Total space visits
  todayVisitCount: Number,
  recentVisitors: Array,
  myContacts: Array     // 20 assigned AI friends
}
```

### Content Safety

Uses WeChat `msgSecCheck` API for content moderation:
- Input check: When user sends messages, updates nickname/signature
- Output check: When AI generates replies
- **Fail-open strategy**: If API call fails, content is allowed (prevents false blocking)
- **Required permissions**: Cloud functions using `msgSecCheck` need `"security.msgSecCheck"` in `config.json`

**Cloud Functions with Safety Check**:
- `chat` - Chat messages (input + output)
- `qcio` - Nickname/signature updates

**Config Example**:
```json
{
  "permissions": {
    "openapi": [
      "security.msgSecCheck"
    ]
  }
}
```

### Rate Limits

- Cooldown: 2 seconds between messages
- Max input length: 50 characters

### Windows 98 Desktop UI

**Desktop Icons**:
- 我的电脑 💻
- 网管系统 ⚙️ (Network Management System - dual currency management, exchange)
- 我的文档 📁
- 回收站 🗑️
- 浏览器 🌐
- QCIO 📟
- 非主流相机 📸

**Start Menu Programs**:
- 星际探索 🌌
- 火星翻译 🪐

**Taskbar**:
- Start button
- Running tasks display
- System tray (network status, volume toggle, time)

**Desktop UI Features** (v3.0+):
- **Network Plugin** (top-right): Sticky note style widget displaying net fee (网费) and time coins (时光币) balance
  - Z-index: 80 (lower than desktop apps at 2000+)
  - Click to open network system, X button to close
  - Style: Low-saturation beige (#f5f0dc), paper texture, 85% opacity
  - Data loaded from `user` cloud function `login` action
- **Volume Toggle** (system tray): Click speaker icon (🔊/🔇) to toggle mute/unmute
  - State persisted via `wx.setStorageSync('soundEnabled')`
  - Win98-style bubble notification shows for 2 seconds
- **Dynamic Z-Index Management**: Last opened desktop component appears on top
  - Global counter `baseZIndex` starts at 2000, increments by 10
  - Applied to: 我的电脑, 我的文档, 网管系统
  - Components observe `zIndex` property and update local styles
- **My Documents Help Window**: Win98-styled help dialog with usage instructions
  - Accessible via "帮助(H)" menu item in my-documents toolbar

**Helper**: Draggable lion assistant with random interaction messages, easter egg triggers

### Data Isolation Pattern

All cloud functions use:
```javascript
const wxContext = cloud.getWXContext();
const OPENID = wxContext.OPENID;
// Queries use .where({ _openid: OPENID }) for user data isolation
```

## Important Files

| File | Purpose |
|------|---------|
| `miniprogram/app.js` | Global app configuration, network state |
| `miniprogram/pages/index/index.js` | Windows 98 desktop homepage, z-index management, network plugin |
| `miniprogram/pages/index/index.wxml` | Desktop UI structure, network plugin HTML |
| `miniprogram/pages/index/index.wxss` | Desktop styling, network plugin CSS |
| `miniprogram/pages/qcio/index.wxml` | QCIO main panel with dialog labels (昵称/签名) |
| `miniprogram/pages/qcio-chat/index.js` | QCIO chat with net fee deduction and network check |
| `miniprogram/utils/network.js` | Network connection state management |
| `miniprogram/utils/egg-system.js` | Easter egg system with cloud storage |
| `miniprogram/components/my-documents/` | My documents component with help window |
| `miniprogram/components/my-computer/` | My computer component with help dialog and Konami code egg |
| `miniprogram/components/egg-discovery-dialog/` | Win98 style reusable discovery modal |
| `cloudfunctions/chat/index.js` | AI chat core with 36 modes |
| `cloudfunctions/chat/safety.js` | Content safety check with fail-open strategy |
| `cloudfunctions/qcio/index.js` | QCIO social features router with nickname/signature validation |
| `cloudfunctions/qcio/modules/safety.js` | Content safety check for QCIO features |
| `cloudfunctions/qcio/config.json` | QCIO cloud function API permissions |
| `cloudfunctions/user/index.js` | User login, dual currency, easter eggs, transaction history |
| `cloudfunctions/init-db/index.js` | Database initialization (32 collections) |
| `cloudfunctions/clear-db/index.js` | Database clearing for testing |

## Documentation

- `README.md` - Project overview, features, changelog
- `CLAUDE.md` - This file, guidance for Claude Code

## Development Conventions

### Dialog/Modal Style Convention

**All new dialogs and modals MUST use Win98 style to maintain visual consistency.**

The app uses Windows 98 styled dialogs throughout. When adding new dialogs:

1. Use the existing Win98 dialog pattern from components like `egg-discovery-dialog`, `my-computer`, `my-documents`
2. Include characteristic Win98 elements:
   - Gray background (#c0c0c0)
   - 3D beveled borders (white top/left, dark bottom/right)
   - Blue gradient title bar
   - SimSun/Courier New font family
   - Standard Win98 button styling

3. Reference existing implementations:
   - `miniprogram/components/egg-discovery-dialog/` - Win98 style discovery modal
   - `miniprogram/components/my-computer/index.wxml` - Help dialog example
   - `miniprogram/components/my-documents/` - Help window example

### Database Table Management

**When adding new database tables, you MUST update both init-db and clear-db cloud functions.**

All database tables must be registered in:
1. `cloudfunctions/init-db/index.js` - Add to `COLLECTIONS` array with description and indexes
2. `cloudfunctions/clear-db/index.js` - Add to `COLLECTIONS` array

Current table count: **32 collections**

Steps to add a new table:
1. Add collection name and description to `COLLECTIONS` array in `init-db/index.js`
2. Add index configuration (if needed) to `createIndexes()` function in `init-db/index.js`
3. Add collection name to `COLLECTIONS` array in `clear-db/index.js`
4. Test with `wx.cloud.callFunction({ name: 'clear-db', data: { action: 'check' } })` to verify

**Example**:
```javascript
// init-db/index.js
{ name: 'new_table', description: '新功能数据表' }

// createIndexes function
new_table: ['_openid', 'createdAt'],

// clear-db/index.js
const COLLECTIONS = [
  // ... existing tables
  'new_table',
];
```

---

## Easter Egg System Implementation Guide

### ⚠️ Critical Rule: Use Win98 Style Dialogs

**ALL easter egg discovery modals MUST use Win98 style, NOT WeChat native modals.**

❌ **WRONG** - Do NOT use:
```javascript
// NEVER use wx.showModal for easter eggs!
wx.showModal({
  title: "🎉 发现彩蛋！",
  content: "彩蛋内容",
  showCancel: false,
  confirmText: "确定"
});
```

✅ **CORRECT** - Always use:
```javascript
// Register callback and use setData
this.eggCallbackKey = eggSystem.setEggDiscoveryCallback((config) => {
  const rarityNames = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
  };
  const reward = config.reward;
  const rewardText = reward.coins ? `+${reward.coins}时光币` : '';
  this.setData({
    showEggDiscoveryDialog: true,
    eggDiscoveryData: {
      name: config.name,
      description: config.description,
      rarity: config.rarity,
      rarityName: rarityNames[config.rarity],
      rewardText: rewardText
    }
  });
});
```

### Standard Implementation Pattern

**1. Add data fields to page/component:**
```javascript
data: {
  // Easter egg discovery dialog
  showEggDiscoveryDialog: false,
  eggDiscoveryData: {
    name: '',
    description: '',
    rarity: '',
    rarityName: '',
    rewardText: ''
  }
}
```

**2. Register callback in onLoad:**
```javascript
onLoad: function() {
  eggSystem.load();

  this.eggCallbackKey = eggSystem.setEggDiscoveryCallback((config) => {
    const rarityNames = {
      common: '普通',
      rare: '稀有',
      epic: '史诗',
      legendary: '传说'
    };
    const reward = config.reward;
    const rewardText = reward.coins ? `+${reward.coins}时光币` : '';
    this.setData({
      showEggDiscoveryDialog: true,
      eggDiscoveryData: {
        name: config.name,
        description: config.description,
        rarity: config.rarity,
        rarityName: rarityNames[config.rarity],
        rewardText: rewardText
      }
    });
  });
}
```

**3. Add WXML structure (at end of page):**
```xml
<!-- Easter Egg Discovery Dialog -->
<view class="win98-overlay" wx:if="{{showEggDiscoveryDialog}}" bindtap="hideEggDiscoveryDialog">
  <view class="win98-window egg-discovery-dialog" catchtap="stopPropagation">
    <view class="win98-title-bar">
      <view class="win98-title-text">🎉 发现彩蛋！</view>
      <view class="win98-title-controls">
        <button class="win98-btn-close" bindtap="hideEggDiscoveryDialog">×</button>
      </view>
    </view>
    <view class="win98-window-body">
      <view class="egg-discovery-content">
        <view class="egg-icon-wrapper">
          <text class="egg-icon-emoji">🥚</text>
        </view>
        <view class="egg-discovery-info">
          <text class="egg-name">{{eggDiscoveryData.name}}</text>
          <text class="egg-description">"{{eggDiscoveryData.description}}"</text>
          <view class="egg-rarity-badge rarity-{{eggDiscoveryData.rarity}}">
            <text class="rarity-text">{{eggDiscoveryData.rarityName}}</text>
          </view>
          <text class="egg-reward">奖励: {{eggDiscoveryData.rewardText}}</text>
        </view>
      </view>
      <view class="dialog-actions">
        <button class="win98-btn-std" bindtap="hideEggDiscoveryDialog">太棒了！</button>
      </view>
    </view>
  </view>
</view>
```

**4. Add helper methods:**
```javascript
// Close easter egg discovery dialog
hideEggDiscoveryDialog: function() {
  this.setData({ showEggDiscoveryDialog: false });
},

// Stop event propagation
stopPropagation: function() {
  // Empty function, only for stopping event propagation
},

// Cleanup on unload
onUnload: function() {
  if (this.eggCallbackKey) {
    eggSystem.unregisterEggDiscoveryCallback(this.eggCallbackKey);
  }
}
```

**5. Add WXSS styles (copy from existing pages):**
```css
/* Win98 Overlay */
.win98-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20000;
}

.win98-window.egg-discovery-dialog {
  width: 320px;
}

.win98-title-bar {
  background: linear-gradient(90deg, #000080, #1084d0);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 3px 2px 6px;
  height: 20px;
}

.win98-title-text {
  color: white;
  font-weight: bold;
  font-size: 12px;
  font-family: 'SimSun', 'Courier New', monospace;
}

.win98-title-controls {
  display: flex;
  gap: 2px;
}

.win98-title-controls button {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 14px;
  background: #c0c0c0;
  border-top: 1px solid #ffffff;
  border-left: 1px solid #ffffff;
  border-right: 1px solid #808080;
  border-bottom: 1px solid #808080;
  font-size: 10px;
  color: #000;
  padding: 0;
  margin: 0;
}

.win98-btn-close::after {
  content: "×";
  font-size: 14px;
  font-weight: bold;
}

.win98-window-body {
  padding: 0;
  display: flex;
  flex-direction: column;
  background: #c0c0c0;
}

.egg-discovery-content {
  padding: 20px 16px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.egg-icon-wrapper {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
  border-radius: 50%;
  border: 3px solid #daa520;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.5),
              0 2px 8px rgba(0, 0, 0, 0.2);
}

.egg-icon-emoji {
  font-size: 36px;
}

.egg-discovery-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.egg-name {
  font-size: 16px;
  font-weight: bold;
  color: #000080;
  font-family: 'SimSun', serif;
}

.egg-description {
  font-size: 12px;
  color: #333;
  font-family: 'SimSun', serif;
  font-style: italic;
  line-height: 1.5;
}

.egg-rarity-badge {
  padding: 4px 12px;
  border-radius: 12px;
  align-self: flex-start;
  border: 2px solid;
}

.egg-rarity-badge.rarity-common {
  background: #909399;
  border-color: #606266;
}

.egg-rarity-badge.rarity-rare {
  background: #409EFF;
  border-color: #1e7dd4;
}

.egg-rarity-badge.rarity-epic {
  background: #A855F7;
  border-color: #7c3aed;
}

.egg-rarity-badge.rarity-legendary {
  background: linear-gradient(135deg, #F59E0B 0%, #fbbf24 50%, #F59E0B 100%);
  border-color: #d97706;
  animation: legendaryGlow 1.5s ease-in-out infinite;
}

@keyframes legendaryGlow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(245, 158, 11, 0.5);
  }
  50% {
    box-shadow: 0 0 15px rgba(245, 158, 11, 0.8), 0 0 25px rgba(245, 158, 11, 0.6);
  }
}

.rarity-text {
  font-size: 11px;
  font-weight: bold;
  color: #fff;
  font-family: 'SimSun', serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.egg-reward {
  font-size: 13px;
  font-weight: bold;
  color: #228b22;
  font-family: 'SimSun', serif;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  padding: 8px 16px 12px;
  background: #c0c0c0;
}

.win98-btn-std {
  font-size: 12px;
  color: #000;
  height: 24px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #c0c0c0;
  border-top: 1px solid #ffffff;
  border-left: 1px solid #ffffff;
  border-right: 1px solid #808080;
  border-bottom: 1px solid #808080;
  font-family: 'SimSun', serif;
}

.win98-btn-std:active {
  border-top: 1px solid #808080;
  border-left: 1px solid #808080;
  border-right: 1px solid #ffffff;
  border-bottom: 1px solid #ffffff;
}
```

### Pages with Win98 Egg Dialogs

| Page/Component | Egg Types |
|----------------|-----------|
| [pages/index/index.js](miniprogram/pages/index/index.js) | Lion dance, Blue screen, Time-based, Icon clicks, Konami code |
| [pages/browser/index.js](miniprogram/pages/browser/index.js) | Star explorer, Calculator, Calendar, Mars translator, Navigator |
| [pages/avatar/index.js](miniprogram/pages/avatar/index.js) | Avatar master |
| [pages/recycle-bin/index.js](miniprogram/pages/recycle-bin/index.js) | Recycle bin emptier |
| [pages/qcio/index.js](miniprogram/pages/qcio/index.js) | QCIO space visitor |
| [pages/chat/index.js](miniprogram/pages/chat/index.js) | Chat lover |
| [pages/group-chat/index.js](miniprogram/pages/group-chat/index.js) | Group chat party |
| [pages/mars/index.js](miniprogram/pages/mars/index.js) | Mars translator |
| [components/network-neighborhood/index.js](miniprogram/components/network-neighborhood/index.js) | Network exchanger |
| [components/recycle-bin/index.js](miniprogram/components/recycle-bin/index.js) | Recycle bin emptier |

### Badge System

Each easter egg awards a **badge** that is permanently stored in the cloud database:

```javascript
// Database structure (users collection)
{
  badges: [
    {
      name: '舞者',           // Badge name
      eggId: 'lion_dance',    // Egg ID
      discoveredAt: Date      // Discovery timestamp
    }
  ]
}
```

**View badges**: `eggSystem.getBadges()` returns all earned badges
**Storage**: `users.badges` field, synced across devices

### Common Mistakes

1. **Using wx.showModal** - Always use Win98 dialog pattern
2. **Forgetting cleanup** - Always unregister callback in onUnload
3. **Missing stopPropagation** - Needed to prevent dialog close when clicking dialog content
4. **Incomplete styles** - Copy ALL CSS including @keyframes for legendary glow

### Reference Files

- [egg-system.js](miniprogram/utils/egg-system.js) - Egg system core
- [browser/index.js](miniprogram/pages/browser/index.js) - Complete example with Win98 dialog
- [browser/index.wxml](miniprogram/pages/browser/index.wxml) - Dialog HTML structure
- [browser/index.wxss](miniprogram/pages/browser/index.wxss) - Dialog styles
