// miniprogram/pages/index/index.js
const app = getApp();

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
        name: 'QCIQ', // 合规化名称，避开官方商标
        icon: '📟',   // 使用传呼机图标模拟复古通讯工具
        path: '/pages/qcio/index'
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
        id: 'star-explorer',
        name: 'Star\nExplorer',
        icon: '🌌',
        path: '/pages/star-explorer/index'
      },
      {
        id: 'avatar',
        name: 'My Identity',
        icon: '👤',
        path: '/pages/avatar/index'
      },
      {
        id: 'translator',
        name: 'Babel Fish',
        icon: '🈂️',
        path: '/pages/translator/index'
      },
      {
        id: 'about',
        name: 'System Info',
        icon: 'ℹ️',
        path: '/pages/about/index'
      }
    ],
    showStartMenu: false,
    systemTime: ''
  },

  onLoad: function() {
    this.updateTime();
    // 每分钟更新一次系统时间
    setInterval(() => {
      this.updateTime();
    }, 60000);
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