// miniprogram/pages/index/index.js
const app = getApp();
// 如果您创建了 SoundManager，可以取消下面的注释
// import { soundManager } from '../../utils/SoundManager';

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
        id: 'chat',
        name: 'Time Chat',
        icon: '💬',
        path: '/pages/chat/index'
      },
      {
        id: 'avatar',
        name: 'My Identity', // 新增的 Avatar 入口
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
    
    // if (typeof soundManager !== 'undefined') soundManager.play('startup');
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
    // if (typeof soundManager !== 'undefined') soundManager.playClick();
    
    // 简单的点击反馈延迟
    setTimeout(() => {
      wx.navigateTo({
        url: path,
        fail: (err) => {
          console.error("Navigation failed:", err);
          wx.showToast({ title: 'Error executing program', icon: 'none' });
        }
      });
    }, 100);
  },

  toggleStartMenu: function() {
    // if (typeof soundManager !== 'undefined') soundManager.playClick();
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