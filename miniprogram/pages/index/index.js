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
        id: "ifthen",
        name: "如果当时.exe",
        icon: "⏳",
        path: "/pages/ifthen/start",
      },
      {
        id: "avatar",
        name: "非主流相机",
        icon: "📸",
        path: "/pages/avatar/index",
      },
      {
        id: "ttplayer",
        name: "千千静听",
        icon: "🎵",
        path: "/pages/ttplayer/index",
      },
    ],
    showStartMenu: false,
    showSubmenu: false, // 子菜单显示状态
    systemTime: "",
    // 网络连接状态
    networkConnected: true, // 默认连接
    networkStatus: "online", // online, offline, connecting
    showNetworkInfo: false, // 显示网络信息气泡
    networkSpeed: { down: "0.00", up: "0.00" }, // 网络速度
    // 右键菜单
    showContextMenu: false,
    contextMenuX: 0,
    contextMenuY: 0,
    // 错误弹窗
    showErrorDialog: false,
    // 日期弹窗
    showDateDialog: false,
    calendarYear: '',
    calendarMonth: '',
    calendarDay: '',
    calendarDayName: '',
    fullDateTime: '',
    lunarDate: '',
    calendarDays: [], // 日历网格数据
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

  // 页面卸载时清理定时器
  onUnload: function () {
    if (this.networkInfoTimer) {
      clearTimeout(this.networkInfoTimer);
    }
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

    // 千千静听 - 文件损坏提示
    if (path && path.includes('ttplayer')) {
      this.setData({ showErrorDialog: true });
      return;
    }

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
    const newShowStartMenu = !this.data.showStartMenu;
    this.setData({
      showStartMenu: newShowStartMenu,
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
      // 生成随机网速（模拟千禧年拨号上网到宽带的速度）
      const downSpeed = (Math.random() * 2 + 0.5).toFixed(2); // 0.5-2.5 MB/s
      const upSpeed = (Math.random() * 0.5 + 0.1).toFixed(2); // 0.1-0.6 MB/s

      this.setData({
        showNetworkInfo: true,
        networkSpeed: {
          down: downSpeed,
          up: upSpeed,
        },
      });

      // 3秒后自动隐藏气泡
      if (this.networkInfoTimer) {
        clearTimeout(this.networkInfoTimer);
      }
      this.networkInfoTimer = setTimeout(() => {
        this.setData({ showNetworkInfo: false });
      }, 3000);
    }
  },

  // 关闭错误弹窗
  hideErrorDialog: function () {
    this.setData({ showErrorDialog: false });
  },

  // 点击系统时间显示日期详情
  onTimeTap: function () {
    const now = new Date();
    const year = 2005; // 固定为2005年，符合千禧时光机主题
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const dayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const dayName = dayNames[now.getDay()];

    // 简单的农历模拟（非真实计算，仅供娱乐）
    const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
    const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                       '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                       '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
    const lunarMonth = lunarMonths[(month - 1 + 3) % 12];
    const lunarDay = lunarDays[(day - 1) % 30];

    // 生成日历网格
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 当月第一天是星期几
    const daysInMonth = new Date(year, month, 0).getDate(); // 当月有多少天
    const calendarDays = [];

    // 添加空白单元格（在第一天之前）
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push({ day: 0, isToday: false });
    }

    // 添加当月的天数
    for (let d = 1; d <= daysInMonth; d++) {
      calendarDays.push({
        day: d,
        isToday: d === day
      });
    }

    this.setData({
      showDateDialog: true,
      calendarYear: year,
      calendarMonth: month,
      calendarDay: day,
      calendarDayName: dayName,
      fullDateTime: `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`,
      lunarDate: `${lunarMonth}${lunarDay}`,
      calendarDays: calendarDays
    });
  },

  // 关闭日期弹窗
  hideDateDialog: function () {
    this.setData({ showDateDialog: false });
  },

  onShareAppMessage: function () {
    return {
      title: "欢迎来到千禧年",
      path: "/pages/index/index",
    };
  },
});
