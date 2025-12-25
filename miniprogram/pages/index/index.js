// miniprogram/pages/index/index.js
Page({
  data: {
    // 小狮子位移 (用于 transform，初始为 0)
    agentTranslateX: 0,
    agentTranslateY: 0,
    isDragging: false,
    // 小狮子互动状态
    agentMood: "normal", // normal, happy, sleepy, surprised
    agentMessage: "",
    showMessage: false,
    // 桌面图标配置
    desktopIcons: [
      {
        id: "my-computer",
        name: "我的电脑",
        icon: "💻",
        path: "/pages/my-computer/index",
      },
      {
        id: "network-neighborhood",
        name: "网上邻居",
        icon: "🌏",
        path: "/pages/network-neighborhood/index",
      },
      {
        id: "my-documents",
        name: "我的文档",
        icon: "📁",
        path: "/pages/my-documents/index",
      },
      {
        id: "recycle-bin",
        name: "回收站",
        icon: "🗑️",
        path: "/pages/recycle-bin/index",
      },
      {
        id: "browser",
        name: "浏览器",
        icon: "🌐",
        path: "/pages/browser/index",
      },
      {
        id: "qcio",
        name: "QCIO",
        icon: "📟",
        path: "/pages/qcio/index",
      },
      {
        id: "avatar",
        name: "非主流相机",
        icon: "📸",
        path: "/pages/avatar/index",
      },
    ],
    showStartMenu: false,
    showSubmenu: false, // 子菜单显示状态
    systemTime: "",
    // 网络连接状态
    networkConnected: true, // 默认连接
    networkStatus: "online", // online, offline, connecting
    // 右键菜单
    showContextMenu: false,
    contextMenuX: 0,
    contextMenuY: 0,
  },

  onLoad: function () {
    // 获取系统信息计算安全区域
    const systemInfo = wx.getSystemInfoSync();
    const safeAreaBottom = systemInfo.safeArea
      ? systemInfo.windowHeight - systemInfo.safeArea.bottom
      : 0;
    const bottomInset = Math.max(safeAreaBottom, 0);

    // 设置小狮子初始位置（考虑底部安全区）
    // bottomInset 是 px，需要加上基础偏移量
    this.setData({
      agentTranslateY: -bottomInset,
    });

    this.updateTime();
    // 每分钟更新一次系统时间
    setInterval(() => {
      this.updateTime();
    }, 60000);

    // 加载网络状态
    this.loadNetworkStatus();
  },

  // 页面显示时重新加载网络状态
  onShow: function () {
    this.loadNetworkStatus();
  },

  // 加载网络状态
  loadNetworkStatus: function () {
    try {
      const status = wx.getStorageSync("network_status");
      if (status) {
        this.setData({
          networkConnected: status.connected,
          networkStatus: status.status || "online",
        });
      }
    } catch (err) {
      console.error("Load network status error:", err);
    }
  },

  updateTime: function () {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    this.setData({
      systemTime: `${hours}:${minutes}`,
    });
  },

  onIconTap: function (e) {
    const path = e.currentTarget.dataset.path;

    // 简单的点击反馈延迟，模拟老式系统的加载感
    setTimeout(() => {
      wx.navigateTo({
        url: path,
        fail: (err) => {
          console.error("Navigation failed:", err);
          wx.showToast({
            title: "路径不存在: " + path,
            icon: "none",
          });
        },
      });
    }, 100);
  },

  toggleStartMenu: function () {
    this.setData({
      showStartMenu: !this.data.showStartMenu,
      showContextMenu: false,
      showSubmenu: false, // 关闭开始菜单时也关闭子菜单
    });
  },

  // 切换子菜单显示
  toggleSubmenu: function () {
    this.setData({
      showSubmenu: !this.data.showSubmenu,
    });
  },

  // 阻止事件冒泡
  stopPropagation: function () {
    // 空函数，仅用于阻止事件冒泡
  },

  // 长按桌面显示右键菜单
  onDesktopLongPress: function (e) {
    const { x, y } = e.detail;
    this.setData({
      showContextMenu: true,
      contextMenuX: x,
      contextMenuY: y,
      showStartMenu: false,
    });
  },

  // 关闭右键菜单
  hideContextMenu: function () {
    this.setData({ showContextMenu: false });
  },

  // 刷新桌面
  refreshDesktop: function () {
    this.hideContextMenu();
    wx.showToast({
      title: "桌面已刷新",
      icon: "success",
      duration: 1000,
    });
  },

  // 排列图标
  arrangeIcons: function () {
    this.hideContextMenu();
    wx.showToast({
      title: "图标已自动排列",
      icon: "success",
      duration: 1000,
    });
  },

  // 新建文件夹
  newFolder: function () {
    this.hideContextMenu();
    wx.showToast({
      title: "功能开发中...",
      icon: "none",
      duration: 1500,
    });
  },

  // 显示属性
  showProperties: function () {
    this.hideContextMenu();
    wx.showToast({
      title: "功能开发中...",
      icon: "none",
      duration: 1500,
    });
  },

  // 小狮子拖动相关
  onAgentDragStart: function (e) {
    this.dragStartX = e.touches[0].clientX;
    this.dragStartY = e.touches[0].clientY;
    this.dragStartTime = Date.now();
    this.startTranslateX = this.data.agentTranslateX;
    this.startTranslateY = this.data.agentTranslateY;
    this.hasMoved = false;

    this.setData({ isDragging: true });
  },

  onAgentDragMove: function (e) {
    if (!this.data.isDragging) return;

    const deltaX = e.touches[0].clientX - this.dragStartX;
    const deltaY = e.touches[0].clientY - this.dragStartY;

    // 如果移动超过 5px，标记为拖动
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      this.hasMoved = true;
    }

    // 使用 transform，单位直接用 px，GPU 加速更平滑
    const newTranslateX = this.startTranslateX + deltaX;
    const newTranslateY = this.startTranslateY + deltaY;

    this.setData({
      agentTranslateX: newTranslateX,
      agentTranslateY: newTranslateY,
    });
  },

  onAgentDragEnd: function () {
    const dragDuration = Date.now() - this.dragStartTime;

    // 如果没有明显移动且时间很短，当作点击处理
    if (!this.hasMoved && dragDuration < 300) {
      this.onAgentTap();
    }

    this.setData({ isDragging: false });
  },

  // 小狮子点击互动
  onAgentTap: function () {
    const moods = [
      { mood: "happy", message: "今天也要加油鸭！~ (≧▽≦)/", icon: "😊" },
      { mood: "sleepy", message: "zzZ...好困啊...", icon: "😴" },
      { mood: "surprised", message: "哇！发现新大陆！", icon: "😲" },
      { mood: "happy", message: "主人陪我玩会儿呗~", icon: "🥺" },
      { mood: "normal", message: "正在运行千禧系统 v1.0...", icon: "🤖" },
      { mood: "happy", message: "记得签个到哦！", icon: "✨" },
      {
        mood: "sleepy",
        message: "已经陪你了 " + Math.floor(Math.random() * 100) + " 分钟啦~",
        icon: "💤",
      },
      { mood: "surprised", message: "发现彩蛋！🎁", icon: "🎉" },
    ];

    const randomIndex = Math.floor(Math.random() * moods.length);
    const selected = moods[randomIndex];

    this.setData({
      agentMood: selected.mood,
      agentMessage: selected.message,
      showMessage: true,
    });

    // 3秒后隐藏消息
    setTimeout(() => {
      this.setData({ showMessage: false });
    }, 3000);
  },

  // 隐藏小狮子消息
  hideAgentMessage: function () {
    this.setData({ showMessage: false });
  },

  // 点击网络图标
  onNetworkIconTap: function () {
    if (!this.data.networkConnected) {
      wx.showModal({
        title: "网络未连接",
        content: '检测到网络断开连接。请通过"网上邻居"重新连接网络。',
        showCancel: false,
        confirmText: "去连接",
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: "/pages/network-neighborhood/index",
            });
          }
        },
      });
    } else {
      wx.showToast({
        title: "网络已连接",
        icon: "success",
        duration: 1500,
      });
    }
  },

  onShareAppMessage: function () {
    return {
      title: "欢迎来到千禧年",
      path: "/pages/index/index",
    };
  },
});
