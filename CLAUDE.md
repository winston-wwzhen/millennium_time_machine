# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

千禧时光机 (Millennium Time Machine) - A nostalgic WeChat Mini Program that recreates the 2005 QQ/QQ Space experience with a Windows 98 desktop interface and AI-powered social interactions.

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

1. Create collections in WeChat Cloud Console:
   - `users` - Desktop-level user data (dual currency, easter eggs)
   - `qcio_users`, `qcio_wallet`, `qcio_daily_tasks`, `qcio_achievements`, `qcio_mood_logs`
   - `qcio_ai_contacts`, `qcio_groups`
   - `qcio_chat_history`, `qcio_group_chat_history`, `qcio_guestbook`
   - `mood_garden`

2. Import AI data from `db-init/`:
   - `db-init/qcio_ai_contacts/contacts_import.json` → `qcio_ai_contacts` collection
   - `db-init/qcio_groups/groups_import.json` → `qcio_groups` collection

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
│   ├── tetris/       # Tetris game
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
└── mood_logic/       # Mood farm game logic

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

**Cloud Function Operations** (`user`):
- `login` - Daily login with net fee deduction
- `getBalance` - Fetch both currency balances
- `exchangeNetFee` - Exchange 时光币 → 网费 (1:1 ratio)
- `deductNetFee` - Consume 网费 for AI features
- `discoverEgg` - Record easter egg discovery, award 时光币

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
- Input check: When user sends messages
- Output check: When AI generates replies

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
- 俄罗斯方块 🎮
- 星际探索 🌌
- 火星翻译 🪐

**Taskbar**:
- Start button
- Running tasks display
- System tray (network status, volume, time)

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
| `miniprogram/utils/network.js` | Network connection state management |
| `miniprogram/utils/egg-system.js` | Easter egg system with cloud storage |
| `cloudfunctions/chat/index.js` | AI chat core with 36 modes |
| `cloudfunctions/qcio/index.js` | QCIO social features router |
| `cloudfunctions/user/index.js` | User login, dual currency, easter eggs |

## Documentation

- `README.md` - Project overview, features, changelog
- `CLAUDE.md` - This file, guidance for Claude Code
