// pages/recycle-bin/index.js
const { eggSystem, EGG_IDS } = require('../../utils/egg-system');

Page({
  data: {
    hasTrash: true,  // 有垃圾文件
    emptyCount: 0,   // 清空次数
    eggAchieved: false,

    // 彩蛋发现弹窗
    showEggDiscoveryDialog: false,
    eggDiscoveryData: {
      name: '',
      description: '',
      rarity: '',
      rarityName: '',
      rewardText: ''
    }
  },

  onLoad: function(options) {
    // 加载彩蛋系统状态
    eggSystem.load();
    // 检查回收站清理者彩蛋是否已达成
    this.setData({
      eggAchieved: eggSystem.isDiscovered(EGG_IDS.RECYCLE_BIN_EMPTYER)
    });

    // 注册彩蛋发现回调
    eggSystem.setEggDiscoveryCallback((config) => {
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
  },

  // 清空回收站
  emptyRecycleBin: async function() {
    if (!this.data.hasTrash) {
      wx.showToast({ title: '回收站已经是空的', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '正在清空...', mask: true });

    // 模拟清空操作
    setTimeout(() => {
      this.setData({ hasTrash: false });
      wx.hideLoading();

      // 检查彩蛋
      this.checkRecycleBinEgg();

      wx.showToast({ title: '回收站已清空', icon: 'success' });
    }, 800);
  },

  // 检查回收站清理者彩蛋
  checkRecycleBinEgg: async function() {
    if (this.data.eggAchieved) return;

    try {
      const res = await wx.cloud.callFunction({
        name: 'user',
        data: { type: 'checkRecycleBinEgg' }
      });

      if (res.result.success) {
        if (res.result.shouldTrigger) {
          this.setData({ eggAchieved: true });
          await eggSystem.discover(EGG_IDS.RECYCLE_BIN_EMPTYER);
        }
      }
    } catch (err) {
      console.error('Check recycle bin egg error:', err);
    }
  },

  goBack: function() {
    wx.navigateBack();
  },

  // 关闭彩蛋发现弹窗
  hideEggDiscoveryDialog: function() {
    this.setData({ showEggDiscoveryDialog: false });
  }
});
