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

For testing, use `clear-db` to reset all data:
```javascript
wx.cloud.callFunction({
  name: 'clear-db',
  data: { action: 'clear', confirm: true }
})
```

**See Also**: Development Conventions section for adding new tables.

## Architecture

### Cloud Functions

| Function | Purpose |
|----------|---------|
| `chat` | AI chat with 36 modes, single/group chat, GLM API integration |
| `qcio` | All QCIO social features (visit, wallet, tasks, guestbook, farm) |
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
1. New users get 30 days free 网费
2. Daily login deducts 1 day of 网费 automatically
3. Explore desktop to discover easter eggs → earn 时光币
4. Use 网管系统 to exchange 时光币 for 网费
5. Continue using AI features with purchased 网费

**Net Fee Logic**:
- Daily login deduction allows negative balance (no check)
- Feature usage (chat, mood logs, etc.) requires sufficient balance
- When balance insufficient: users blocked with "网费不足" error

**Cloud Function Operations** (`user`):
- `login` - Daily login with net fee deduction
- `getBalance` - Fetch both currency balances (NO CACHE)
- `exchangeNetFee` - Exchange 时光币 → 网费
- `deductNetFee` - Consume 网费 for AI features
- `discoverEgg` - Record easter egg discovery, award 时光币

**Transaction History**:
- Stored in `user_transactions` collection
- Types: `daily_deduct`, `exchange`, `usage`, `egg_reward`
- Viewable in 网管系统 via "扣费记录" button

### Network Simulation

The app simulates **33.6 Kbps dial-up networking**:
- Users must connect via "网管系统" (Network Management System) before AI features work
- Connection status shown in system tray (bottom-right)
- AI errors are wrapped as "network disconnected" prompts
- **Network state management**: `miniprogram/utils/network.js`

### AI Chat System

**36 Chat Modes** (cloudfunctions/chat/index.js):
- `qingwu` - 轻舞飞扬 (火星文/非主流)
- `sadsoul` - 忧郁王子
- `netadmin` - 网管小哥
- `fortune_teller` - 算命大师
- `mars` - 火星文转换
- `joker` - 段子手
- ...and more

**100 AI Contacts** - 12 groups (葬爱家族, 网游开黑, 网吧常驻, 网络评论家, 神秘人士, 情感咨询, 学霸联盟, 文艺青年, 娱乐达人, 佛系一族, 普通人, 工具人)

**6 Group Chats** - Each with 18-24 members

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

### Content Safety

Uses WeChat `msgSecCheck` API for content moderation:
- Input check: When user sends messages, updates nickname/signature
- Output check: When AI generates replies
- **Fail-open strategy**: If API call fails, content is allowed (prevents false blocking)

**Cloud Functions with Safety Check**: `chat`, `qcio`

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
- 我的电脑 💻 | 网管系统 ⚙️ | 我的文档 📁 | 回收站 🗑️ | 浏览器 🌐 | QCIO 📟 | 非主流相机 📸

**Start Menu Programs**: 星际探索 🌌 | 火星翻译 🪐

**Desktop UI Features** (v3.0+):
- **Network Plugin** (top-right): Displays net fee and time coins balance (Z-index: 80)
- **Volume Toggle** (system tray): Click speaker icon to toggle mute/unmute
- **Dynamic Z-Index Management**: Last opened desktop component appears on top (baseZIndex starts at 2000)
- **My Documents Help Window**: Accessible via "帮助(H)" menu item
- **Folder Icons**: Uses `folder_flat.png` for consistent styling across my-computer and my-documents

**Helper**: Draggable lion assistant with random interaction messages, auto-talks every 8-15 seconds, easter egg triggers

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
| `miniprogram/pages/qcio-chat/index.js` | QCIO chat with net fee deduction and network check |
| `miniprogram/utils/network.js` | Network connection state management |
| `miniprogram/utils/egg-system.js` | Easter egg system with cloud storage |
| `miniprogram/utils/api-client.js` | Unified API client for cloud functions (NO cache for balance) |
| `miniprogram/components/my-computer/` | My computer component with KONAMI_CODE egg |
| `miniprogram/components/egg-discovery-dialog/` | Win98 style reusable discovery modal |
| `miniprogram/components/gobang/` | Three-player Gomoku (五子棋) with canvas-based board |
| `miniprogram/components/minesweeper/` | Real Minesweeper (真正的扫雷) with reverse rules |
| `cloudfunctions/chat/index.js` | AI chat core with 36 modes |
| `cloudfunctions/qcio/index.js` | QCIO social features router |
| `cloudfunctions/user/index.js` | User login, dual currency, easter eggs, transaction history |
| `cloudfunctions/ifthen/index.js` | If-Then game cloud function: save endings, get history/stats, record shares |
| `cloudfunctions/init-db/index.js` | Database initialization (32 collections) |
| `cloudfunctions/clear-db/index.js` | Database clearing for testing |

### 如果当时 Module

**Overview**: Life simulation game where players experience 2006-2026 with event-driven narrative and multiple endings.

**Core Pages**:
- `miniprogram/pages/ifthen/start.js` | Start page with birth year/gender selection |
| `miniprogram/pages/ifthen/timeline.js` | Main gameplay with events, choices, and endings |
| `miniprogram/pages/ifthen/history.js` | Ending collection and play history |

**Data Files**:
| File | Purpose |
|------|---------|
| `miniprogram/data/ifthen-events.js` | 300+ events (year-specific + daily), trigger conditions, attribute effects |
| `miniprogram/data/ifthen-endings.js` | 100+ endings with conditions (special/good/normal/bad) |
| `miniprogram/data/ifthen-narratives.js` | Age-based and year-based narrative fragments |

**Game Mechanics**:
- **Timeline**: 2006-2026 (20 years), players start at age based on birth year
- **Attributes**: 8 stats (tech_skill, social, wealth, health, happiness, charm, luck, education)
- **Flags**: Marks player choices (e.g., `corporate_slave`, `entrepreneur`, `qq_space_user`)
- **Event Types**: Year-specific historical events, daily life events, 90后专属 (90s generation exclusive)
- **Ending Logic**: Filter by age/birthYear/attributes/flags, then weighted random selection

**Event Structure**:
```javascript
{
  id: 'event_id',
  year: 2006,              // null for daily events
  category: 'daily',
  trigger: {
    ageRange: [15, 25],
    gender: null,          // or 'male'/'female'
    randomChance: 0.1,     // 10% chance
    birthYearRange: [1990, 2000]  // optional: 90后专属
  },
  choices: [
    { text: '选择A', effects: { wealth: 10, happiness: 5 }, flags: { flag_name: true } }
  ]
}
```

**Ending Structure**:
```javascript
{
  id: 'ending_id',
  title: '结局名称',
  type: 'special',         // special/good/normal/bad
  weight: 10,              // higher = more likely
  conditions: {
    ageRange: [22, 35],
    birthYearRange: [1990, 2000],
    minAttributes: { social: 85, wealth: 80 },
    maxAttributes: { health: 50 },
    requireFlags: ['flag1', 'flag2'],
    excludeFlags: ['flag3']
  }
}
```

### Desktop Game Components

**Overview**: Two Windows 98-style games accessible from the Start Menu.

#### Three-Player Gomoku (五子棋)

**Location**: `miniprogram/components/gobang/`

**Implementation**: Canvas-based rendering for performance

**Features**:
- 3 players: Player (Black) vs AI 1 (White) vs AI 2 (Red)
- 15x15 board with standard Gomoku rules
- 3 difficulty levels: Easy, Medium, Hard
- Canvas redraws on component show to prevent rendering issues
- Active player indicator with smooth transitions

**Key Files**:
- `gobang/index.wxml` - Game board with canvas element
- `gobang/index.wxss` - Player badge styling (no scale transform to prevent board shake)
- `gobang/index.js` - Game logic, canvas rendering, AI decisions

**Important**: The canvas is redrawn every time the component is shown via the observer pattern.

#### Real Minesweeper (真正的扫雷)

**Location**: `miniprogram/components/minesweeper/`

**Implementation**: View-based grid with CSS Grid layout

**Features**:
- **Reverse Rules**: Hit numbers → switch turns, Hit mines → score + continue
- 2 modes: PvE (Player vs AI) and PvP (2 players)
- 2 difficulties: Small (10x10, 15 mines), Medium (16x16, 51 mines)
- Grid cells use `aspect-ratio: 1` to maintain square shape
- Game over modal shows final state (grid remains visible)
- Compact game over dialog for mobile

**Key Files**:
- `minesweeper/index.wxml` - Grid layout with dynamic columns
- `minesweeper/index.wxss` - Win98 styling, responsive cells
- `minesweeper/index.js` - Game logic, AI decision making

**Important**: Unlike gobang, this uses view components instead of canvas. Cells auto-size to fill grid container.

**Menu Integration**:
- Accessible via Start Menu → 程序 → 五子棋 / 真正的扫雷
- Uses `catchlongtap="stopPropagation"` to prevent desktop context menu

## Development Conventions

### Dialog/Modal Style Convention

**All new dialogs and modals MUST use Win98 style to maintain visual consistency.**

**Win98 Style Elements**:
- Gray background (#c0c0c0)
- 3D beveled borders (white top/left, dark bottom/right)
- Blue gradient title bar
- SimSun/Courier New font family
- Standard Win98 button styling

**Reference Implementations**:
- `miniprogram/components/egg-discovery-dialog/` - Win98 style discovery modal
- `miniprogram/components/my-computer/index.wxml` - Help dialog example
- `miniprogram/components/my-documents/` - Help window example

### Database Table Management

**When adding new database tables, you MUST update both init-db and clear-db cloud functions.**

Current table count: **32 collections**

**Steps to add a new table**:
1. Add collection name and description to `COLLECTIONS` array in `init-db/index.js`
2. Add index configuration (if needed) to `createIndexes()` function in `init-db/index.js`
3. Add collection name to `COLLECTIONS` array in `clear-db/index.js`
4. Test with `wx.cloud.callFunction({ name: 'clear-db', data: { action: 'check' } })` to verify

### API Calling Convention

**Parameter Naming**:
- User cloud function uses `type` parameter: `userApi.deductNetFee()` → `{ type: 'deductNetFee', amount }`
- QCIO cloud function uses `action` parameter: `qcioApi.updateProfile()` → `{ action: 'updateProfile', data }`

### Cache Strategy Convention

**NO CACHE for**:
- User balance (`netFee`, `coins`) - Real-time requirement
- User profile (`avatarName`, `avatar`) - May be modified

**Rationale**: Balance and profile data changes frequently, cache causes stale data display.

### Net Fee Deduction Convention

**Deduction Amount**:
- Single chat: 10 minutes per message
- Group chat: 10 minutes per message
- QCIO chat: 10 minutes per message

**Deduction Logic Pattern**:
```javascript
try {
  const deductResult = await userApi.deductNetFee(10);

  if (!deductResult || !deductResult.success) {
    wx.showModal({
      title: '网费不足',
      content: '您的网费不足，请通过桌面"网管系统"充值',
      confirmText: '去充值',
      confirmColor: '#000080',
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({ url: '/pages/index/index' });
        }
      }
    });
    return;
  }
} catch (err) {
  console.error('Deduct net fee error:', err);
  wx.showToast({ title: '网费扣除失败', icon: 'none' });
  return;
}
```

### Transaction Record Type Convention

`user_transactions` collection `type` field standards:

| type 值 | 含义 | 货币类型 |
|---------|------|----------|
| `daily_deduct` | 每日登录扣费 | netfee |
| `exchange` | 兑换网费 | coins/netfee |
| `usage` | AI 功能使用扣费 | netfee |
| `egg_reward` | 彩蛋奖励 | coins |

## Easter Egg System

### Overview

**20 Hidden Eggs** distributed across the desktop:
- **Common** (400-1000 coins): Lion dance, Lion talk, Taskbar surprise, Background switch, Recycle bin, My computer, Browser click, Star explorer, Calculator, Calendar
- **Rare** (1500-2000 coins): Blue screen, Hidden icon, Special time
- **Epic** (5000 coins): Midnight secret, Mars translator
- **Legendary** (10000 coins): Konami code sequence, Avatar master, Navigator

**Features**:
- Cloud-based storage (syncs across devices)
- Achievement badges collection
- Progress tracking with percentage display
- Discovery effects with rarity-colored Win98 modals

**Egg System File**: `miniprogram/utils/egg-system.js`

### ⚠️ Legendary Easter Egg: KONAMI_CODE

**IMPORTANT: When modifying "my-computer" component or "index" page, be aware of this egg!**

The **KONAMI_CODE** spans across the desktop and "我的电脑" window.

**Trigger Sequence** (11 steps):
```
C盘 → 关闭弹窗 → C盘 → 关闭弹窗 → D盘 → 关闭弹窗 → USB → 关闭弹窗 → D盘 → 关闭弹窗 → C盘 → 关闭弹窗 → 关闭窗口 → 点击小狮子 → 点击开始菜单
```

**Implementation Files**:
1. `miniprogram/components/my-computer/index.js` - First 9 steps (drive clicks + dialog closes)
2. `miniprogram/pages/index/index.js` - Final 3 steps (window close → lion → start menu)

**⚠️ Modification Guidelines**:

When modifying `miniprogram/components/my-computer/`:
- **DO NOT** remove or rename `konamiSequence`, `currentKonamiIndex`, `konamiCodeCompleted` data properties
- **DO NOT** change `onDriveClick()` or `closeDriveDialog()` without preserving the Konami code logic
- **DO NOT** modify `bindwindowclose` event to remove the `konamiCodeCompleted` parameter

When modifying `miniprogram/pages/index/`:
- **DO NOT** remove or rename `konamiCodePhase1Completed`, `konamiCodeLionClicked` data properties
- **DO NOT** modify `onMyComputerWindowClose()`, `onLionClick()`, or `onStartMenuClick()` without preserving the logic

**Reward**: 10000 💎 (时光币) + Win98-style discovery modal

### Egg Discovery Dialog Implementation

**⚠️ Critical Rule: Use Win98 Style Dialogs**

ALL easter egg discovery modals MUST use Win98 style, NOT WeChat native modals.

❌ **WRONG**:
```javascript
wx.showModal({ title: "发现彩蛋！", content: "..." });
```

✅ **CORRECT** - Register callback and use setData:
```javascript
this.eggCallbackKey = eggSystem.setEggDiscoveryCallback((config) => {
  const rarityNames = { common: '普通', rare: '稀有', epic: '史诗', legendary: '传说' };
  const rewardText = config.reward.coins ? `+${config.reward.coins}时光币` : '';
  this.setData({
    showEggDiscoveryDialog: true,
    eggDiscoveryData: {
      name: config.name,
      description: config.description,
      rarity: config.rarity,
      rarityName: rarityNames[config.rarity],
      rewardText
    }
  });
});
```

**Standard Pattern**:
1. Add `showEggDiscoveryDialog` and `eggDiscoveryData` to data
2. Register callback in onLoad, unregister in onUnload
3. Add Win98 dialog WXML structure (reference: `browser/index.wxml`)
4. Add Win98 dialog WXSS styles (reference: `browser/index.wxss`)
5. Implement `hideEggDiscoveryDialog()` and `stopPropagation()` methods

**Reference Files**:
- `egg-system.js` - Egg system core
- `pages/browser/index.js` - Complete example with Win98 dialog
- `components/egg-discovery-dialog/` - Reusable Win98 modal component

### Pages with Win98 Egg Dialogs

| Page/Component | Egg Types |
|----------------|-----------|
| pages/index/index.js | Lion dance, Blue screen, Time-based, Icon clicks, Konami code |
| pages/browser/index.js | Star explorer, Calculator, Calendar, Mars translator, Navigator |
| pages/avatar/index.js | Avatar master |
| pages/recycle-bin/index.js | Recycle bin emptier |
| pages/qcio/index.js | QCIO space visitor |
| pages/chat/index.js | Chat lover |
| pages/group-chat/index.js | Group chat party |
| pages/mars/index.js | Mars translator |
| components/network-neighborhood/index.js | Network exchanger |

### Badge System

Each easter egg awards a **badge** permanently stored in cloud database:

```javascript
// users collection
{
  badges: [
    {
      name: '舞者',
      eggId: 'lion_dance',
      discoveredAt: Date
    }
  ]
}
```

**View badges**: `eggSystem.getBadges()`
**Storage**: `users.badges` field, synced across devices

### Common Mistakes

1. **Using wx.showModal** - Always use Win98 dialog pattern
2. **Forgetting cleanup** - Always unregister callback in onUnload
3. **Missing stopPropagation** - Needed to prevent dialog close when clicking dialog content
4. **Incomplete styles** - Copy ALL CSS including @keyframes for legendary glow
