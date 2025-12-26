/**
 * 彩蛋系统
 *
 * 管理小程序中所有彩蛋的触发、状态和奖励
 * 使用云数据库存储，支持跨设备同步
 * 奖励：网费（用于拨号上网、AI聊天等）
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
  RECYCLE_BIN: 'recycle_bin',         // 回收站狂点
  MY_COMPUTER: 'my_computer',         // 电脑专家
  BROWSER_CLICK: 'browser_click',     // 网瘾少年
  TIME_SPECIAL: 'time_special',       // 特殊时刻
};

// 彩蛋配置 - 网费奖励（单位：分 = 1分钟网费）
const EGG_CONFIG = {
  [EGG_IDS.LION_DANCE]: {
    id: EGG_IDS.LION_DANCE,
    name: '舞动的小狮子？',
    description: '小狮子好像会跳舞...',
    hint: '试试多点几次小狮子',
    rarity: 'common',        // common, rare, epic, legendary
    type: 'click',           // click, longpress, time, sequence
    reward: {
      coins: 10,             // 10分钟网费
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
      coins: 10,
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
      coins: 20,
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
      coins: 50,
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
      coins: 10,
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
      coins: 20,
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
      coins: 10,
      badge: '艺术家'
    }
  },
  [EGG_IDS.RECYCLE_BIN]: {
    id: EGG_IDS.RECYCLE_BIN,
    name: '垃圾清理员',
    description: '回收站被你点爆了...',
    hint: '多点几次回收站试试',
    rarity: 'common',
    type: 'click',
    reward: {
      coins: 5,
      badge: '清洁工'
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
      coins: 5,
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
      coins: 5,
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
      coins: 15,
      badge: '时刻见证者'
    }
  },
  [EGG_IDS.KONAMI_CODE]: {
    id: EGG_IDS.KONAMI_CODE,
    name: '传说中的秘籍',
    description: '我的电脑↑↑我的文档↓↓网上邻居←→我的文档←→网上邻居→→小狮子→开始',
    hint: '按顺序点击特定图标...',
    rarity: 'legendary',
    type: 'sequence',
    reward: {
      coins: 100,
      badge: '上帝之手',
      unlock: 'god_mode'
    }
  }
};

class EggSystem {
  constructor() {
    this.discovered = new Set(); // 本地已发现彩蛋缓存（badge名称）
    this.stats = {              // 统计数据
      totalDiscovered: 0,
      totalEarned: 0
    };
    this.badges = [];           // 徽章列表
    this.loaded = false;        // 是否已从云端加载
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
    // 显示发现弹窗
    const rarityColors = {
      common: '#909399',
      rare: '#409EFF',
      epic: '#A855F7',
      legendary: '#F59E0B'
    };

    const rarityNames = {
      common: '普通',
      rare: '稀有',
      epic: '史诗',
      legendary: '传说'
    };

    const reward = config.reward;
    const rewardText = reward.coins ? `+${reward.coins}分钟网费` : '';

    wx.showModal({
      title: '🎉 发现彩蛋！',
      content: `${config.name}\n\n"${config.description}"\n\n稀有度: ${rarityNames[config.rarity]}\n奖励: ${rewardText}`,
      showCancel: false,
      confirmText: '太棒了！',
      confirmColor: rarityColors[config.rarity]
    });
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
