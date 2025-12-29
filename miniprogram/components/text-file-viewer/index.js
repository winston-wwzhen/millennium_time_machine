// components/text-file-viewer/index.js
const { eggSystem, EGG_IDS } = require("../../utils/egg-system");

Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    fileName: {
      type: String,
      value: '彩蛋大全.txt'
    }
  },

  data: {
    discovered: 0,
    total: 0,
    isSecretFile: false,
    eggList: []
  },

  observers: {
    'fileName': function(newVal) {
      const isSecretFile = newVal === '彩蛋秘籍-第一册.txt';
      const isSecretFile2 = newVal === '彩蛋秘籍-第二册.txt';
      this.setData({ isSecretFile });
      if (isSecretFile) {
        this.loadSecretEggList();
      } else if (isSecretFile2) {
        this.loadSecretEggList2();
      } else if (newVal === '彩蛋大全.txt') {
        this.loadEggList();
      }
    },
    'show': function(newVal) {
      if (newVal) {
        if (this.data.fileName === '彩蛋秘籍-第一册.txt') {
          this.loadSecretEggList();
        } else if (this.data.fileName === '彩蛋秘籍-第二册.txt') {
          this.loadSecretEggList2();
        } else if (this.data.fileName === '彩蛋大全.txt') {
          this.loadEggList();
        }
      }
    }
  },

  lifetimes: {
    attached: function() {
      this.updateProgress();
      if (this.data.fileName === '彩蛋秘籍-第一册.txt') {
        this.loadSecretEggList();
      } else if (this.data.fileName === '彩蛋秘籍-第二册.txt') {
        this.loadSecretEggList2();
      } else if (this.data.fileName === '彩蛋大全.txt') {
        this.loadEggList();
      }
    }
  },

  methods: {
    onClose: function() {
      this.triggerEvent('close');
    },

    stopPropagation: function() {
      // 阻止事件冒泡
    },

    updateProgress: function() {
      const progress = eggSystem.getProgress();
      this.setData({
        discovered: progress.discovered
      });
    },

    // 加载彩蛋列表（带状态）- 动态加载所有彩蛋
    loadEggList: async function() {
      // 确保先加载云端数据
      await eggSystem.load();

      const allConfigs = eggSystem.getAllConfigs();
      const badges = eggSystem.getBadges();
      const discoveredIds = new Set(badges.map(b => b.eggId));

      // 动态构建彩蛋列表
      const eggList = Object.values(EGG_IDS).map(eggId => ({
        id: eggId,
        ...allConfigs[eggId],
        discovered: discoveredIds.has(eggId)
      }));

      // 按稀有度排序：common -> rare -> epic -> legendary
      const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 };
      eggList.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

      this.setData({
        eggList,
        discovered: discoveredIds.size,
        total: Object.keys(EGG_IDS).length
      });
    },

    // 加载彩蛋秘籍（第一册：仅10条普通彩蛋）
    loadSecretEggList: async function() {
      // 确保先加载云端数据
      await eggSystem.load();

      const allConfigs = eggSystem.getAllConfigs();
      const badges = eggSystem.getBadges();
      const discoveredIds = new Set(badges.map(b => b.eggId));

      // 第一册：10条普通彩蛋
      const eggList = [
        { id: EGG_IDS.LION_DANCE, ...allConfigs[EGG_IDS.LION_DANCE], discovered: discoveredIds.has(EGG_IDS.LION_DANCE) },
        { id: EGG_IDS.LION_TALK, ...allConfigs[EGG_IDS.LION_TALK], discovered: discoveredIds.has(EGG_IDS.LION_TALK) },
        { id: EGG_IDS.TASKBAR_SURPRISE, ...allConfigs[EGG_IDS.TASKBAR_SURPRISE], discovered: discoveredIds.has(EGG_IDS.TASKBAR_SURPRISE) },
        { id: EGG_IDS.BG_SWITCH, ...allConfigs[EGG_IDS.BG_SWITCH], discovered: discoveredIds.has(EGG_IDS.BG_SWITCH) },
        { id: EGG_IDS.MY_COMPUTER, ...allConfigs[EGG_IDS.MY_COMPUTER], discovered: discoveredIds.has(EGG_IDS.MY_COMPUTER) },
        { id: EGG_IDS.BROWSER_CLICK, ...allConfigs[EGG_IDS.BROWSER_CLICK], discovered: discoveredIds.has(EGG_IDS.BROWSER_CLICK) },
        { id: EGG_IDS.AVATAR_MASTER, ...allConfigs[EGG_IDS.AVATAR_MASTER], discovered: discoveredIds.has(EGG_IDS.AVATAR_MASTER) },
        { id: EGG_IDS.QCIO_SPACE_VISITOR, ...allConfigs[EGG_IDS.QCIO_SPACE_VISITOR], discovered: discoveredIds.has(EGG_IDS.QCIO_SPACE_VISITOR) },
        { id: EGG_IDS.START_MENU_FAN, ...allConfigs[EGG_IDS.START_MENU_FAN], discovered: discoveredIds.has(EGG_IDS.START_MENU_FAN) },
        { id: EGG_IDS.MARS_TRANSLATOR, ...allConfigs[EGG_IDS.MARS_TRANSLATOR], discovered: discoveredIds.has(EGG_IDS.MARS_TRANSLATOR) }
      ];

      this.setData({ eggList });
    },

    // 加载彩蛋秘籍（第二册：稀有、史诗、传说彩蛋，以及第一册外的普通彩蛋）
    loadSecretEggList2: async function() {
      // 确保先加载云端数据
      await eggSystem.load();

      const allConfigs = eggSystem.getAllConfigs();
      const badges = eggSystem.getBadges();
      const discoveredIds = new Set(badges.map(b => b.eggId));

      // 第二册：第一册外的普通彩蛋 + 稀有 + 史诗 + 传说
      const eggList = [
        // 普通彩蛋（第一册外）
        { id: EGG_IDS.NETWORK_EXCHANGER, ...allConfigs[EGG_IDS.NETWORK_EXCHANGER], discovered: discoveredIds.has(EGG_IDS.NETWORK_EXCHANGER) },
        { id: EGG_IDS.CALCULATOR_MASTER, ...allConfigs[EGG_IDS.CALCULATOR_MASTER], discovered: discoveredIds.has(EGG_IDS.CALCULATOR_MASTER) },
        // 稀有彩蛋
        { id: EGG_IDS.BLUE_SCREEN, ...allConfigs[EGG_IDS.BLUE_SCREEN], discovered: discoveredIds.has(EGG_IDS.BLUE_SCREEN) },
        { id: EGG_IDS.HIDDEN_ICON, ...allConfigs[EGG_IDS.HIDDEN_ICON], discovered: discoveredIds.has(EGG_IDS.HIDDEN_ICON) },
        { id: EGG_IDS.TIME_SPECIAL, ...allConfigs[EGG_IDS.TIME_SPECIAL], discovered: discoveredIds.has(EGG_IDS.TIME_SPECIAL) },
        { id: EGG_IDS.CHAT_LOVER, ...allConfigs[EGG_IDS.CHAT_LOVER], discovered: discoveredIds.has(EGG_IDS.CHAT_LOVER) },
        { id: EGG_IDS.GROUP_CHAT_PARTY, ...allConfigs[EGG_IDS.GROUP_CHAT_PARTY], discovered: discoveredIds.has(EGG_IDS.GROUP_CHAT_PARTY) },
        { id: EGG_IDS.STAR_EXPLORER, ...allConfigs[EGG_IDS.STAR_EXPLORER], discovered: discoveredIds.has(EGG_IDS.STAR_EXPLORER) },
        { id: EGG_IDS.CALENDAR_TIME_TRAVELER, ...allConfigs[EGG_IDS.CALENDAR_TIME_TRAVELER], discovered: discoveredIds.has(EGG_IDS.CALENDAR_TIME_TRAVELER) },
        { id: EGG_IDS.BROWSER_NAVIGATOR, ...allConfigs[EGG_IDS.BROWSER_NAVIGATOR], discovered: discoveredIds.has(EGG_IDS.BROWSER_NAVIGATOR) },
        // 史诗彩蛋
        { id: EGG_IDS.TIME_MIDNIGHT, ...allConfigs[EGG_IDS.TIME_MIDNIGHT], discovered: discoveredIds.has(EGG_IDS.TIME_MIDNIGHT) },
        // 传说彩蛋
        { id: EGG_IDS.KONAMI_CODE, ...allConfigs[EGG_IDS.KONAMI_CODE], discovered: discoveredIds.has(EGG_IDS.KONAMI_CODE) }
      ];

      this.setData({ eggList });
    }
  }
});
