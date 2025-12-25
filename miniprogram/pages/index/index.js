// miniprogram/pages/index/index.js
const app = getApp();
const easterEggs = require('../../utils/easter-eggs.js');

Page({
  data: {
    // 桌面图标配置
    desktopIcons: [
      {
        id: 'browser',
        name: 'Millennium\nExplorer',
        icon: '🌐',
        path: '/pages/browser/index'
      },
      {
        id: 'qcio',
        name: 'QCIO',
        icon: '📟',
        path: '/pages/qcio/index'
      },
      {
        id: 'tetris',
        name: 'Tetris\n方块',
        icon: '🎮',
        path: '/pages/tetris/index'
      },
      {
        id: 'star-explorer',
        name: 'Star\nExplorer',
        icon: '🌌',
        path: '/pages/star-explorer/index'
      },
      {
        id: 'chat',
        name: 'Time Chat',
        icon: '💬',
        path: '/pages/chat/index'
      },
      {
        id: 'mars',
        name: 'Mars\nTranslator',
        icon: '🪐',
        path: '/pages/mars/index'
      },
      {
        id: 'about',
        name: 'System Info',
        icon: 'ℹ️',
        path: '/pages/about/index'
      }
    ],
    showStartMenu: false,
    systemTime: '',
    // 彩蛋相关
    secretClickCount: 0,
    showEasterEgg: false,
    easterEggMessage: ''
  },

  onLoad: function() {
    // 分割图标为左右两列（左列优先填充）
    const icons = this.data.desktopIcons;
    // 左列放 5 个，右列放 2 个（总共 7 个）
    const midPoint = 5;
    this.setData({
      leftColumn: icons.slice(0, midPoint),
      rightColumn: icons.slice(midPoint)
    });

    this.updateTime();
    // 每分钟更新一次系统时间
    setInterval(() => {
      this.updateTime();
    }, 60000);

    // 检查日期彩蛋
    this.checkDateEasterEgg();
  },

  updateTime: function() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.setData({
      systemTime: `${hours}:${minutes}`
    });
  },

  onIconTap: function(e) {
    const path = e.currentTarget.dataset.path;
    const id = e.currentTarget.dataset.id;

    // 检查彩蛋触发
    const egg = easterEggs.handleClick();
    if (egg) {
      this.showEasterEggDialog(egg);
      return;
    }

    // 简单的点击反馈延迟，模拟老式系统的加载感
    setTimeout(() => {
      wx.navigateTo({
        url: path,
        fail: (err) => {
          console.error("Navigation failed:", err);
          wx.showToast({
            title: 'Path not found: ' + path,
            icon: 'none'
          });
        }
      });
    }, 100);
  },

  // 检查日期彩蛋
  checkDateEasterEgg() {
    const egg = easterEggs.checkDateEgg();
    if (egg) {
      // 延迟显示日期彩蛋
      setTimeout(() => {
        this.showEasterEggDialog(egg);
      }, 2000);
    }
  },

  // 显示彩蛋对话框
  showEasterEggDialog(egg) {
    this.setData({
      showEasterEgg: true,
      easterEggMessage: egg.message
    });

    wx.vibrateShort();

    setTimeout(() => {
      this.setData({ showEasterEgg: false });
    }, 5000);
  },

  // 关闭彩蛋对话框
  closeEasterEgg() {
    this.setData({ showEasterEgg: false });
  },

  toggleStartMenu: function() {
    this.setData({
      showStartMenu: !this.data.showStartMenu
    });
  },

  onShareAppMessage: function () {
    return {
      title: 'Welcome to the Year 2000',
      path: '/pages/index/index'
    };
  }
});