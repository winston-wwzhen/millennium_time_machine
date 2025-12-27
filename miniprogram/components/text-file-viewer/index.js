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
    isSecretFile: false,
    eggList: []
  },

  observers: {
    'fileName': function(newVal) {
      this.setData({
        isSecretFile: newVal === '彩蛋秘籍-第一册.txt'
      });
      if (newVal === '彩蛋大全.txt') {
        this.loadEggList();
      }
    },
    'show': function(newVal) {
      if (newVal && this.data.fileName === '彩蛋大全.txt') {
        this.loadEggList();
      }
    }
  },

  lifetimes: {
    attached: function() {
      this.updateProgress();
      if (this.data.fileName === '彩蛋大全.txt') {
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

    // 加载彩蛋列表（带状态）
    loadEggList: async function() {
      // 确保先加载云端数据
      await eggSystem.load();

      const allConfigs = eggSystem.getAllConfigs();
      const badges = eggSystem.getBadges();
      const discoveredIds = new Set(badges.map(b => b.eggId));

      // 按稀有度分组
      const eggList = [
        // 普通彩蛋
        { id: EGG_IDS.LION_DANCE, ...allConfigs[EGG_IDS.LION_DANCE], discovered: discoveredIds.has(EGG_IDS.LION_DANCE) },
        { id: EGG_IDS.LION_TALK, ...allConfigs[EGG_IDS.LION_TALK], discovered: discoveredIds.has(EGG_IDS.LION_TALK) },
        { id: EGG_IDS.TASKBAR_SURPRISE, ...allConfigs[EGG_IDS.TASKBAR_SURPRISE], discovered: discoveredIds.has(EGG_IDS.TASKBAR_SURPRISE) },
        { id: EGG_IDS.BG_SWITCH, ...allConfigs[EGG_IDS.BG_SWITCH], discovered: discoveredIds.has(EGG_IDS.BG_SWITCH) },
        { id: EGG_IDS.RECYCLE_BIN, ...allConfigs[EGG_IDS.RECYCLE_BIN], discovered: discoveredIds.has(EGG_IDS.RECYCLE_BIN) },
        { id: EGG_IDS.MY_COMPUTER, ...allConfigs[EGG_IDS.MY_COMPUTER], discovered: discoveredIds.has(EGG_IDS.MY_COMPUTER) },
        { id: EGG_IDS.BROWSER_CLICK, ...allConfigs[EGG_IDS.BROWSER_CLICK], discovered: discoveredIds.has(EGG_IDS.BROWSER_CLICK) },
        // 稀有彩蛋
        { id: EGG_IDS.BLUE_SCREEN, ...allConfigs[EGG_IDS.BLUE_SCREEN], discovered: discoveredIds.has(EGG_IDS.BLUE_SCREEN) },
        { id: EGG_IDS.HIDDEN_ICON, ...allConfigs[EGG_IDS.HIDDEN_ICON], discovered: discoveredIds.has(EGG_IDS.HIDDEN_ICON) },
        { id: EGG_IDS.TIME_SPECIAL, ...allConfigs[EGG_IDS.TIME_SPECIAL], discovered: discoveredIds.has(EGG_IDS.TIME_SPECIAL) },
        // 史诗彩蛋
        { id: EGG_IDS.TIME_MIDNIGHT, ...allConfigs[EGG_IDS.TIME_MIDNIGHT], discovered: discoveredIds.has(EGG_IDS.TIME_MIDNIGHT) },
        // 传说彩蛋
        { id: EGG_IDS.KONAMI_CODE, ...allConfigs[EGG_IDS.KONAMI_CODE], discovered: discoveredIds.has(EGG_IDS.KONAMI_CODE) }
      ];

      this.setData({ eggList });
    }
  }
});
