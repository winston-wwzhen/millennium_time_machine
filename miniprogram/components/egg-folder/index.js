// components/egg-folder/index.js
const { eggSystem } = require("../../utils/egg-system");

Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  data: {
    discovered: 0,
    showTextViewer: false,
    showSecretViewer: false,
    showSecretViewer2: false, // 第二册查看器
    showSecretViewer3: false, // 第三册查看器
    showViewMenu: false,
    showHiddenFiles: false,
    secretBook2Restored: false, // 第二册是否已还原
    secretBook1Revealed: false, // 第一册是否已显示过
    hasOpenedEggHelper: false // 是否已打开过C盘的彩蛋助手
  },

  observers: {
    'show': function(newVal) {
      if (newVal) {
        // 每次打开时检查第二册是否已还原
        const secretBook2Restored = wx.getStorageSync('eggSecretBook2Restored') || false;
        // 检查第一册是否已显示过
        const secretBook1Revealed = wx.getStorageSync('eggSecretBook1Revealed') || false;
        // 检查是否已打开过C盘的彩蛋助手
        const hasOpenedEggHelper = wx.getStorageSync('hasOpenedEggHelper') || false;
        this.setData({
          secretBook2Restored,
          secretBook1Revealed,
          hasOpenedEggHelper,
          showHiddenFiles: secretBook1Revealed // 如果已显示过，自动显示
        });
      }
      if (!newVal) {
        // 关闭窗口时重置菜单状态，但保留隐藏文件显示状态
        this.setData({
          showViewMenu: false
        });
      }
    }
  },

  lifetimes: {
    attached: function() {
      this.updateProgress();
      // 检查第二册是否已还原
      const secretBook2Restored = wx.getStorageSync('eggSecretBook2Restored') || false;
      // 检查第一册是否已显示过
      const secretBook1Revealed = wx.getStorageSync('eggSecretBook1Revealed') || false;
      // 检查是否已打开过C盘的彩蛋助手
      const hasOpenedEggHelper = wx.getStorageSync('hasOpenedEggHelper') || false;
      this.setData({
        secretBook2Restored,
        secretBook1Revealed,
        hasOpenedEggHelper,
        showHiddenFiles: secretBook1Revealed // 如果已显示过，自动显示
      });
    }
  },

  methods: {
    onClose: function() {
      this.triggerEvent('close');
    },

    stopPropagation: function() {
      // 阻止事件冒泡
    },

    // 点击查看菜单
    onViewMenuTap: function() {
      this.setData({
        showViewMenu: !this.data.showViewMenu
      });
    },

    // 显示隐藏文件
    onShowHiddenFiles: function() {
      // 保存第一册已显示的状态
      wx.setStorageSync('eggSecretBook1Revealed', true);
      this.setData({
        showHiddenFiles: true,
        showViewMenu: false,
        secretBook1Revealed: true
      });
    },

    onFileTap: function() {
      this.setData({ showTextViewer: true });
    },

    // 点击彩蛋秘籍文件
    onSecretFileTap: function() {
      this.setData({ showSecretViewer: true });
    },

    // 点击彩蛋秘籍第二册文件
    onSecretFile2Tap: function() {
      this.setData({ showSecretViewer2: true });
    },

    onCloseTextViewer: function() {
      this.setData({ showTextViewer: false });
    },

    onCloseSecretViewer: function() {
      this.setData({ showSecretViewer: false });
    },

    onCloseSecretViewer2: function() {
      this.setData({ showSecretViewer2: false });
    },

    // 点击彩蛋秘籍第三册文件
    onSecretFile3Tap: function() {
      this.setData({ showSecretViewer3: true });
    },

    onCloseSecretViewer3: function() {
      this.setData({ showSecretViewer3: false });
    },

    updateProgress: function() {
      const progress = eggSystem.getProgress();
      this.setData({
        discovered: progress.discovered
      });
    }
  }
});
