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
    showViewMenu: false,
    showHiddenFiles: false
  },

  observers: {
    'show': function(newVal) {
      if (!newVal) {
        // 关闭窗口时重置隐藏文件状态
        this.setData({
          showHiddenFiles: false,
          showViewMenu: false
        });
      }
    }
  },

  lifetimes: {
    attached: function() {
      this.updateProgress();
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
      this.setData({
        showHiddenFiles: true,
        showViewMenu: false
      });
    },

    onFileTap: function() {
      this.setData({ showTextViewer: true });
    },

    // 点击彩蛋秘籍文件
    onSecretFileTap: function() {
      this.setData({ showSecretViewer: true });
    },

    onCloseTextViewer: function() {
      this.setData({ showTextViewer: false });
    },

    onCloseSecretViewer: function() {
      this.setData({ showSecretViewer: false });
    },

    updateProgress: function() {
      const progress = eggSystem.getProgress();
      this.setData({
        discovered: progress.discovered
      });
    }
  }
});
