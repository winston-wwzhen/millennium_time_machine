// miniprogram/pages/index/index.js
Page({
  data: {
    // 小狮子位移 (用于 transform，初始为 0)
    agentTranslateX: 0,
    agentTranslateY: 0,
    isDragging: false,
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
        id: 'avatar',
        name: 'Avatar\n头像',
        icon: '🎭',
        path: '/pages/avatar/index'
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
    systemTime: ''
  },

  onLoad: function() {
    // 获取系统信息计算安全区域
    const systemInfo = wx.getSystemInfoSync();
    const safeAreaBottom = systemInfo.safeArea ? systemInfo.windowHeight - systemInfo.safeArea.bottom : 0;
    const bottomInset = Math.max(safeAreaBottom, 0);

    // 设置小狮子初始位置（考虑底部安全区）
    // bottomInset 是 px，需要加上基础偏移量
    this.setData({
      agentTranslateY: -bottomInset
    });

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

  // 小狮子拖动相关
  onAgentDragStart: function(e) {
    this.dragStartX = e.touches[0].clientX;
    this.dragStartY = e.touches[0].clientY;
    this.startTranslateX = this.data.agentTranslateX;
    this.startTranslateY = this.data.agentTranslateY;

    this.setData({ isDragging: true });
  },

  onAgentDragMove: function(e) {
    if (!this.data.isDragging) return;

    const deltaX = e.touches[0].clientX - this.dragStartX;
    const deltaY = e.touches[0].clientY - this.dragStartY;

    // 使用 transform，单位直接用 px，GPU 加速更平滑
    const newTranslateX = this.startTranslateX + deltaX;
    const newTranslateY = this.startTranslateY + deltaY;

    this.setData({
      agentTranslateX: newTranslateX,
      agentTranslateY: newTranslateY
    });
  },

  onAgentDragEnd: function() {
    this.setData({ isDragging: false });
  },

  onShareAppMessage: function () {
    return {
      title: 'Welcome to the Year 2000',
      path: '/pages/index/index'
    };
  }
});