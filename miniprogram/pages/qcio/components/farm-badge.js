/**
 * QCIO 农场成就徽章组件
 * 显示农场等级、金币，支持分享到空间
 */
Component({
  properties: {
    qcioId: {
      type: String,
      value: ''
    }
  },

  data: {
    farmData: {
      level: 1,
      coins: 200,
      exp: 0
    },
    showShareDialog: false
  },

  lifetimes: {
    attached() {
      this.loadFarmData();
    }
  },

  methods: {
    // 从本地存储加载农场数据
    loadFarmData() {
      try {
        const savedData = wx.getStorageSync('galaxy_farm_data');
        if (savedData) {
          this.setData({
            farmData: {
              level: savedData.level || 1,
              coins: savedData.coins || 200,
              exp: savedData.exp || 0
            }
          });
        }
      } catch (err) {
        console.error('Load farm data error:', err);
      }
    },

    // 分享农场成就
    shareAchievement() {
      this.setData({ showShareDialog: true });
    },

    // 关闭对话框
    closeDialog() {
      this.setData({ showShareDialog: false });
    },

    // 生成成就分享文本
    generateAchievementText() {
      const { level, coins } = this.data.farmData;
      const titles = {
        1: '农场新手',
        5: '种田达人',
        10: '农业大亨',
        20: '银河农场主'
      };

      const title = titles[level] || '农场主';
      return `【${title}】我的千禧农场已达到 ${level} 级，拥有 ${coins} 金币！快来踩踩我的空间~ ┈━═☆`;
    },

    // 复制成就文本
    copyAchievement() {
      const text = this.generateAchievementText();
      wx.setClipboardData({
        data: text,
        success: () => {
          wx.showToast({ title: '已复制，可粘贴到签名~', icon: 'none' });
          this.closeDialog();
        }
      });
    },

    // 分享到微信
    shareToWeChat() {
      const { level, coins } = this.data.farmData;
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
      this.closeDialog();

      wx.showToast({
        title: '点击右上角分享',
        icon: 'none'
      });
    },

    // 跳转到农场
    goToFarm() {
      wx.navigateTo({
        url: '/pages/browser/index?url=http://galaxy.farm'
      });
    }
  }
});
