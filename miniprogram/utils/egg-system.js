/**
 * 彩蛋系统
 *
 * 管理小程序中所有彩蛋的触发、状态和奖励
 * 使用云数据库存储，支持跨设备同步
 *
 * 双代币系统：
 * - 时光币: 通过发现彩蛋获得，可用于在网管系统兑换网费和其他CDK
 * - 网费: 初始30天（43200分钟），每日自动扣除1天（1440分钟），用于AI功能
 *
 * 游戏循环：
 * 1. 新用户获得30天免费网费
 * 2. 每日登录自动扣除1天网费
 * 3. 通过发现彩蛋获得时光币
 * 4. 在网管系统用时光币兑换网费，继续使用AI功能
 */

// 彩蛋ID定义
const EGG_IDS = {
  LION_DANCE: 'lion_dance',           // 小狮子跳舞
  LION_TALK: 'lion_talk',             // 小狮子说话
  BLUE_SCREEN: 'blue_screen',         // 桌面蓝屏
  TIME_MIDNIGHT: 'time_midnight',     // 午夜秘密
  TASKBAR_SURPRISE: 'taskbar_surprise', // 任务栏惊喜
  HIDDEN_ICON: 'hidden_icon',         // 隐藏图标
  BG_SWITCH: 'bg_switch',             // 背景切换
  KONAMI_CODE: 'konami_code',         // 上帝模式
  MY_COMPUTER: 'my_computer',         // 电脑专家
  BROWSER_CLICK: 'browser_click',     // 网瘾少年
  TIME_SPECIAL: 'time_special',       // 特殊时刻
  AVATAR_MASTER: 'avatar_master',     // 非主流达人
  CHAT_LOVER: 'chat_lover',           // 聊天狂魔
  QCIO_SPACE_VISITOR: 'qcio_space_visitor', // 空间常客
  START_MENU_FAN: 'start_menu_fan',   // 开始菜单爱好者
  GROUP_CHAT_PARTY: 'group_chat_party',       // 群聊狂欢
  MARS_TRANSLATOR: 'mars_translator',         // 火星文大师
  NETWORK_EXCHANGER: 'network_exchanger',     // 网费兑换者
  RECYCLE_BIN_EMPTYER: 'recycle_bin_emptyer', // 回收站清理者
  // v3.6 新增浏览器工具彩蛋
  STAR_EXPLORER: 'star_explorer',           // 星际探险家
  CALCULATOR_MASTER: 'calculator_master',   // 计算器高手
  CALENDAR_TIME_TRAVELER: 'calendar_time_traveler', // 时光旅行者
  BROWSER_NAVIGATOR: 'browser_navigator',           // 浏览器领航员
};

// 彩蛋配置 - 时光币奖励（单位：分钟）
// 奖励非常慷慨，时光币是成就收集系统
const EGG_CONFIG = {
  [EGG_IDS.LION_DANCE]: {
    id: EGG_IDS.LION_DANCE,
    name: '舞动的小狮子？',
    description: '小狮子好像会跳舞...',
    hint: '试试多点几次小狮子',
    rarity: 'common',        // common, rare, epic, legendary
    type: 'click',           // click, longpress, time, sequence
    reward: {
      coins: 1000,           // 1000分钟时光币
      badge: '舞者'
    }
  },
  [EGG_IDS.LION_TALK]: {
    id: EGG_IDS.LION_TALK,
    name: '它会说话',
    description: '小狮子好像有话想说',
    hint: '长按小狮子试试？',
    rarity: 'common',
    type: 'longpress',
    reward: {
      coins: 1000,
      badge: '倾听者'
    }
  },
  [EGG_IDS.BLUE_SCREEN]: {
    id: EGG_IDS.BLUE_SCREEN,
    name: '那个年代的噩梦',
    description: '怀念那种蓝屏的感觉吗？',
    hint: '桌面好像藏着一个秘密...',
    rarity: 'rare',
    type: 'click',
    reward: {
      coins: 2000,
      badge: '蓝屏幸存者'
    }
  },
  [EGG_IDS.TIME_MIDNIGHT]: {
    id: EGG_IDS.TIME_MIDNIGHT,
    name: '深夜党专属',
    description: '凌晨0点，有惊喜',
    hint: '午夜时分再来看看',
    rarity: 'epic',
    type: 'time',
    reward: {
      coins: 5000,
      badge: '夜猫子'
    }
  },
  [EGG_IDS.TASKBAR_SURPRISE]: {
    id: EGG_IDS.TASKBAR_SURPRISE,
    name: '底部秘密',
    description: '任务栏里藏着什么？',
    hint: '多点几次任务栏试试？',
    rarity: 'common',
    type: 'click',
    reward: {
      coins: 1000,
      badge: '探索者'
    }
  },
  [EGG_IDS.HIDDEN_ICON]: {
    id: EGG_IDS.HIDDEN_ICON,
    name: '消失的角落',
    description: '右下角好像有什么...',
    hint: '桌面右下角点击试试？',
    rarity: 'rare',
    type: 'click',
    reward: {
      coins: 2000,
      badge: '寻宝者'
    }
  },
  [EGG_IDS.BG_SWITCH]: {
    id: EGG_IDS.BG_SWITCH,
    name: '换了个心情',
    description: '双击桌面试试？',
    hint: '双击桌面空白处',
    rarity: 'common',
    type: 'click',
    reward: {
      coins: 500,
      badge: '艺术家'
    }
  },
  [EGG_IDS.MY_COMPUTER]: {
    id: EGG_IDS.MY_COMPUTER,
    name: '硬件大师',
    description: '你对电脑很执着...',
    hint: '多点几次我的电脑',
    rarity: 'common',
    type: 'click',
    reward: {
      coins: 400,
      badge: '硬件控'
    }
  },
  [EGG_IDS.BROWSER_CLICK]: {
    id: EGG_IDS.BROWSER_CLICK,
    name: '网瘾少年',
    description: '你是想上网冲浪吗？',
    hint: '多点几次浏览器',
    rarity: 'common',
    type: 'click',
    reward: {
      coins: 400,
      badge: '冲浪达人'
    }
  },
  [EGG_IDS.TIME_SPECIAL]: {
    id: EGG_IDS.TIME_SPECIAL,
    name: '特殊时刻',
    description: '这个时间点有点东西',
    hint: '在特殊时间看看...',
    rarity: 'rare',
    type: 'time',
    reward: {
      coins: 1500,
      badge: '时刻见证者'
    }
  },
  [EGG_IDS.KONAMI_CODE]: {
    id: EGG_IDS.KONAMI_CODE,
    name: '传说中的秘籍',
    description: 'C盘→关→C盘→关→D盘→关→USB→关→D盘→关→C盘→关→关窗→小狮子→开始',
    hint: '在我的电脑窗口按特定序列操作...',
    rarity: 'legendary',
    type: 'sequence',
    reward: {
      coins: 10000,
      badge: '上帝之手',
      unlock: 'god_mode'
    }
  },
  [EGG_IDS.AVATAR_MASTER]: {
    id: EGG_IDS.AVATAR_MASTER,
    name: '非主流达人',
    description: '你真的很爱拍非主流照片...',
    hint: '在非主流相机连续保存5张照片',
    rarity: 'common',
    type: 'action',
    reward: {
      coins: 800,
      badge: '非主流达人'
    }
  },
  [EGG_IDS.CHAT_LOVER]: {
    id: EGG_IDS.CHAT_LOVER,
    name: '聊天狂魔',
    description: '你真的是话痨本痨...',
    hint: '累计发送100条聊天消息',
    rarity: 'rare',
    type: 'action',
    reward: {
      coins: 2500,
      badge: '话痨'
    }
  },
  [EGG_IDS.QCIO_SPACE_VISITOR]: {
    id: EGG_IDS.QCIO_SPACE_VISITOR,
    name: '空间常客',
    description: '你是QCIO空间的常客...',
    hint: '累计访问10次QCIO空间',
    rarity: 'common',
    type: 'action',
    reward: {
      coins: 600,
      badge: '踩空间达人'
    }
  },
  [EGG_IDS.START_MENU_FAN]: {
    id: EGG_IDS.START_MENU_FAN,
    name: '开始菜单爱好者',
    description: '你真的很喜欢开始菜单...',
    hint: '累计打开开始菜单20次',
    rarity: 'common',
    type: 'action',
    reward: {
      coins: 500,
      badge: '菜单控'
    }
  },
  [EGG_IDS.GROUP_CHAT_PARTY]: {
    id: EGG_IDS.GROUP_CHAT_PARTY,
    name: '群聊狂欢',
    description: '群聊才是真正的战场...',
    hint: '在群聊累计发送50条消息',
    rarity: 'rare',
    type: 'action',
    reward: {
      coins: 2000,
      badge: '群星'
    }
  },
  [EGG_IDS.MARS_TRANSLATOR]: {
    id: EGG_IDS.MARS_TRANSLATOR,
    name: '火星文大师',
    description: '你已经掌握了火星文的奥秘...',
    hint: '使用火星翻译功能10次',
    rarity: 'common',
    type: 'action',
    reward: {
      coins: 700,
      badge: '火星使者'
    }
  },
  [EGG_IDS.NETWORK_EXCHANGER]: {
    id: EGG_IDS.NETWORK_EXCHANGER,
    name: '网费兑换者',
    description: '你懂得如何管理网费...',
    hint: '首次在网管系统兑换网费',
    rarity: 'common',
    type: 'action',
    reward: {
      coins: 500,
      badge: '理财达人'
    }
  },
  [EGG_IDS.RECYCLE_BIN_EMPTYER]: {
    id: EGG_IDS.RECYCLE_BIN_EMPTYER,
    name: '回收站清理者',
    description: '你真的很爱清理回收站...',
    hint: '在回收站页面清空回收站5次',
    rarity: 'rare',
    type: 'action',
    reward: {
      coins: 1500,
      badge: '清洁工'
    }
  },
  // v3.6 新增浏览器工具彩蛋
  [EGG_IDS.STAR_EXPLORER]: {
    id: EGG_IDS.STAR_EXPLORER,
    name: '星际探险家',
    description: '你在星际探索中展现了智慧...',
    hint: '在星际探索通关任意难度',
    rarity: 'rare',
    type: 'action',
    reward: {
      coins: 1500,
      badge: '扫雷高手'
    }
  },
  [EGG_IDS.CALCULATOR_MASTER]: {
    id: EGG_IDS.CALCULATOR_MASTER,
    name: '计算器高手',
    description: '你对数字很敏感...',
    hint: '在计算器连续计算10次',
    rarity: 'common',
    type: 'action',
    reward: {
      coins: 800,
      badge: '精算师'
    }
  },
  [EGG_IDS.CALENDAR_TIME_TRAVELER]: {
    id: EGG_IDS.CALENDAR_TIME_TRAVELER,
    name: '时光旅行者',
    description: '你回到了2006年的那一天...',
    hint: '在万年历查看2006年6月6日',
    rarity: 'rare',
    type: 'action',
    reward: {
      coins: 1200,
      badge: '时空旅人'
    }
  },
  [EGG_IDS.BROWSER_NAVIGATOR]: {
    id: EGG_IDS.BROWSER_NAVIGATOR,
    name: '浏览器领航员',
    description: '你精通浏览器的一切操作...',
    hint: '在浏览器内使用前进、后退、刷新各3次',
    rarity: 'rare',
    type: 'action',
    reward: {
      coins: 1000,
      badge: '导航大师'
    }
  }
};

class EggSystem {
  constructor() {
    this.discovered = new Set(); // 本地已发现彩蛋缓存（badge名称）
    this.stats = {              // 统计数据
      totalDiscovered: 0,
      totalEarned: 0,
      daysUsed: 0
    };
    this.badges = [];           // 徽章列表
    this.loaded = false;        // 是否已从云端加载
    this.discoveryCallbacks = new Map(); // 彩蛋发现回调Map: key -> callback
    this.callbackCounter = 0;   // 回调计数器，用于生成唯一key
  }

  // 注册彩蛋发现回调（返回用于取消注册的key）
  // 用于自定义弹窗样式，支持多个页面同时注册
  registerEggDiscoveryCallback(callback) {
    const key = `callback_${++this.callbackCounter}`;
    this.discoveryCallbacks.set(key, callback);
    return key;
  }

  // 设置彩蛋发现回调（用于自定义弹窗样式）
  // 保留此方法以兼容旧代码，但建议使用 registerEggDiscoveryCallback
  setEggDiscoveryCallback(callback) {
    // 清除所有旧回调，设置新的单一回调
    this.discoveryCallbacks.clear();
    this.callbackCounter = 0;
    return this.registerEggDiscoveryCallback(callback);
  }

  // 取消注册彩蛋发现回调
  unregisterEggDiscoveryCallback(key) {
    if (key) {
      this.discoveryCallbacks.delete(key);
    }
  }

  // 从云端加载彩蛋数据
  async load() {
    if (this.loaded) return;

    try {
      const res = await wx.cloud.callFunction({
        name: 'user',
        data: { type: 'getEggs' }
      });

      if (res.result.success) {
        const data = res.result.data;

        // 加载徽章列表
        if (data.badges) {
          this.badges = data.badges;
          this.discovered = new Set(data.badges.map(b => b.eggId));
        }

        // 加载统计数据
        if (data.stats) {
          this.stats = { ...data.stats };
        }

        this.loaded = true;
      }
    } catch (e) {
      console.error('加载彩蛋数据失败:', e);
      // 失败时标记为已加载，避免重复请求
      this.loaded = true;
    }
  }

  // 检查彩蛋是否已发现
  isDiscovered(eggId) {
    return this.discovered.has(eggId);
  }

  // 发现彩蛋（异步，同步到云端）
  async discover(eggId) {
    // 先检查本地缓存
    if (this.discovered.has(eggId)) {
      return { isNew: false, reward: null };
    }

    try {
      const config = EGG_CONFIG[eggId];
      const res = await wx.cloud.callFunction({
        name: 'user',
        data: {
          type: 'discoverEgg',
          eggId: eggId,
          eggData: config
        }
      });

      if (res.result.success) {
        const { isNew, reward } = res.result;

        if (isNew) {
          // 更新本地缓存
          this.discovered.add(eggId);
          this.stats.totalDiscovered++;
          if (reward?.coins) {
            this.stats.totalEarned += reward.coins;
          }
          if (reward?.badge) {
            this.badges.push({
              name: reward.badge,
              eggId: eggId,
              discoveredAt: new Date()
            });
          }

          // 显示发现效果
          if (config) {
            this.showDiscoveryEffect(config);
          }
        }

        return { isNew, reward };
      }
    } catch (e) {
      console.error('发现彩蛋失败:', e);
    }

    return { isNew: false, reward: null };
  }

  // 显示发现效果
  showDiscoveryEffect(config) {
    // 调用所有注册的回调
    if (this.discoveryCallbacks.size > 0) {
      this.discoveryCallbacks.forEach((callback) => {
        try {
          callback(config);
        } catch (e) {
          console.error('彩蛋发现回调执行失败:', e);
        }
      });
      return;
    }

    // 否则使用简单的 toast 提示（保底方案）
    const reward = config.reward;
    const rewardText = reward.coins ? `+${reward.coins}时光币` : '';

    wx.showToast({
      title: `发现彩蛋！${config.name}`,
      icon: 'success',
      duration: 2000
    });

    // 控制台输出详细信息
    console.log(`🎉 发现彩蛋：${config.name}`);
    console.log(`"${config.description}"`);
    console.log(`稀有度: ${config.rarity}`);
    console.log(`奖励: ${rewardText}`);
  }

  // 获取已发现彩蛋数量
  getDiscoveredCount() {
    return this.discovered.size;
  }

  // 获取总彩蛋数量
  getTotalCount() {
    return Object.keys(EGG_CONFIG).length;
  }

  // 获取发现进度
  getProgress() {
    const total = this.getTotalCount();
    const discovered = this.getDiscoveredCount();
    return {
      discovered,
      total,
      percentage: Math.floor((discovered / total) * 100)
    };
  }

  // 获取彩蛋配置
  getConfig(eggId) {
    return EGG_CONFIG[eggId];
  }

  // 获取所有彩蛋配置
  getAllConfigs() {
    return EGG_CONFIG;
  }

  // 获取用户统计数据
  getStats() {
    return this.stats;
  }

  // 获取徽章列表
  getBadges() {
    return this.badges;
  }
}

// 创建单例
const eggSystem = new EggSystem();

module.exports = {
  EGG_IDS,
  eggSystem
};
