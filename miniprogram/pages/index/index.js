// miniprogram/pages/index/index.js
const { eggSystem, EGG_IDS } = require('../../utils/egg-system');

Page({
  data: {
    // 小狮子位移 (用于 transform，初始为 0)
    agentTranslateX: 0,
    agentTranslateY: 0,
    isDragging: false,
    // 小狮子互动状态
    agentMood: "normal", // normal, happy, sleepy, surprised, dancing
    agentMessage: "",
    showMessage: false,
    isDancing: false,  // 小狮子跳舞状态
    showBlueScreen: false,  // 蓝屏彩蛋状态
    isMidnightEgg: false,  // 午夜彩蛋状态（小狮子发光）
    showHiddenIcon: false,  // 隐藏图标彩蛋状态
    konamiProgress: [],     // Konami Code 输入进度
    showGodMode: false,     // 上帝模式状态
    desktopBgIndex: 0,      // 桌面背景索引
    lastTapTime: 0,         // 上次点击时间（用于检测双击）
    // 桌面背景列表（彩蛋用）
    desktopBackgrounds: [
      '#008080',  // 经典 Win98 青色
      '#006400',  // 深绿色
      '#4B0082',  // 靛紫色
      '#8B4513',  // 古铜色
      '#2F4F4F',  // 深岩灰
      '#4A0E4E',  // 复古紫
      '#1B1B1B'   // 纯黑
    ],
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

    // 检查时间彩蛋
    this.checkTimeEggs();
  },

  // 页面显示时重新加载网络状态
  onShow: function () {
    this.loadNetworkStatus();
    // 每次显示也检查时间彩蛋
    this.checkTimeEggs();
  },

  // 检查时间相关彩蛋
  checkTimeEggs: function() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    // 特殊时刻彩蛋：12:34, 4:44, 11:11, 22:22, 3:33
    const specialTimes = ['12:34', '04:44', '11:11', '22:22', '03:33', '05:55', '15:15'];
    if (specialTimes.includes(timeStr)) {
      // 检查是否在当前分钟内已经触发过（使用临时标记防止重复触发）
      const lastTriggerKey = `last_special_time_${timeStr}`;
      const lastTrigger = wx.getStorageSync(lastTriggerKey) || 0;
      const nowTimestamp = Date.now();

      // 5分钟内不重复触发
      if (nowTimestamp - lastTrigger > 5 * 60 * 1000) {
        wx.setStorageSync(lastTriggerKey, nowTimestamp);
        const isNewDiscovery = eggSystem.discover(EGG_IDS.TIME_SPECIAL);

        const messages = {
          '12:34': '1234，顺顺当当！',
          '04:44': '发发发，好运来~',
          '11:11': '光棍节快乐！',
          '22:22': '对称之美~',
          '03:33': '三分天下~',
          '05:55': '五福临门！',
          '15:15': '三点一刻~'
        };

        this.setData({
          agentMood: 'happy',
          agentMessage: isNewDiscovery ? `🎉 ${messages[timeStr]} 发现特殊时刻彩蛋！` : messages[timeStr],
          showMessage: true
        });

        setTimeout(() => {
          this.setData({ showMessage: false });
        }, 3000);
      }
    }

    // 午夜彩蛋：0点-1点之间
    if (hour === 0) {
      const isNewDiscovery = eggSystem.discover(EGG_IDS.TIME_MIDNIGHT);

      this.setData({
        isMidnightEgg: true,
        agentMood: 'surprised',
        agentMessage: isNewDiscovery ? '🎉 深夜党专属彩蛋！小狮子陪你熬夜~' : '深夜党还在吗？',
        showMessage: true
      });

      // 3秒后隐藏消息
      setTimeout(() => {
        this.setData({ showMessage: false });
      }, 3000);
    } else {
      this.setData({ isMidnightEgg: false });
    }
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
    const iconId = e.currentTarget.id;

    // Konami Code 检测 - 通过特定图标模拟方向输入
    const direction = this.getDirectionFromIcon(iconId);
    if (direction) {
      this.checkKonamiCode(direction);
    }

    // 图标点击彩蛋检测
    this.checkIconClickEggs(iconId);

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

  // 检测图标点击彩蛋
  checkIconClickEggs: function(iconId) {
    let eggId = null;
    let clickCount = 5;  // 默认5次触发

    switch(iconId) {
      case 'recycle-bin':
        eggId = EGG_IDS.RECYCLE_BIN;
        break;
      case 'my-computer':
        eggId = EGG_IDS.MY_COMPUTER;
        break;
      case 'browser':
        eggId = EGG_IDS.BROWSER_CLICK;
        break;
      default:
        return;  // 不是有彩蛋的图标
    }

    const shouldTrigger = eggSystem.incrementCounter(eggId, clickCount);

    if (shouldTrigger) {
      const isNewDiscovery = eggSystem.discover(eggId);
      const config = eggSystem.getConfig(eggId);

      // 显示发现提示
      wx.showToast({
        title: isNewDiscovery ? `🎉 ${config.name}` : config.description,
        icon: 'none',
        duration: 2000
      });
    }
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

  // 显示彩蛋收集界面
  showEasterEggs: function () {
    this.hideContextMenu();

    const progress = eggSystem.getProgress();
    const allConfigs = eggSystem.getAllConfigs();

    // 按稀有度分组
    const rarityOrder = ['legendary', 'epic', 'rare', 'common'];
    const rarityNames = {
      common: '🟢 普通',
      rare: '🔵 稀有',
      epic: '🟣 史诗',
      legendary: '🟠 传说'
    };

    let content = `🎯 彩蛋收集进度: ${progress.discovered}/${progress.total} (${progress.percentage}%)\n\n`;

    // 按稀有度显示
    for (const rarity of rarityOrder) {
      const eggs = Object.values(allConfigs).filter(e => e.rarity === rarity);
      if (eggs.length > 0) {
        content += `【${rarityNames[rarity]}】\n`;
        for (const egg of eggs) {
          const isDiscovered = eggSystem.isDiscovered(egg.id);
          const status = isDiscovered ? '✅' : '❓';
          const name = isDiscovered ? egg.name : '???';
          const hint = isDiscovered ? '' : `\n   💡 ${egg.hint}`;
          content += `${status} ${name}${hint}\n`;
        }
        content += '\n';
      }
    }

    wx.showModal({
      title: '🥚 彩蛋收集册',
      content: content,
      showCancel: false,
      confirmText: '继续探索',
      confirmColor: '#008080'
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
    // 检查小狮子跳舞彩蛋（点击10次触发）
    const shouldTriggerDance = eggSystem.incrementCounter(EGG_IDS.LION_DANCE, 10);

    if (shouldTriggerDance) {
      // 触发跳舞彩蛋
      this.triggerLionDance();
      return;
    }

    // 普通互动
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

  // 触发小狮子跳舞彩蛋
  triggerLionDance: function() {
    const isNewDiscovery = eggSystem.discover(EGG_IDS.LION_DANCE);

    this.setData({
      isDancing: true,
      agentMood: 'dancing',
      agentMessage: isNewDiscovery ? '🎉 发现彩蛋：舞动的小狮子！' : '看我跳舞！💃',
      showMessage: true
    });

    // 跳舞动画持续5秒
    setTimeout(() => {
      this.setData({
        isDancing: false,
        agentMood: 'happy',
        showMessage: false
      });
    }, 5000);
  },

  // 小狮子长按 - 触发说话彩蛋
  onAgentLongPress: function() {
    if (this.data.isDragging) return;  // 拖动中不触发

    // 触发说话彩蛋
    const isNewDiscovery = eggSystem.discover(EGG_IDS.LION_TALK);

    // 怀旧语录库
    const nostalgicQuotes = [
      '承諾、絠什嚒用？還bùsんì洅見。',
      '莪們還能回去嗎？那個屬於莪們啲年代...',
      '45度仰望天空，眼泪才不会掉下来。',
      '那些年，我们一起追过的女孩...',
      '哥抽的不是烟，是寂寞。',
      '华丽的语言背后，是空洞的灵魂。',
      '非主流，是一种态度，不是一种风格。',
      '每一个不曾起舞的日子，都是对生命的辜负。',
      '网线那一端的你，还好吗？',
      '记得当年在网吧通宵的日子吗？',
      '那些年我们一起聊过的QQ，还在吗？',
      '时光不老，我们不散。',
      '有些话，只能在这里说...'
    ];

    const randomQuote = nostalgicQuotes[Math.floor(Math.random() * nostalgicQuotes.length)];

    this.setData({
      agentMood: 'surprised',
      agentMessage: isNewDiscovery ? `🎉 发现彩蛋：${randomQuote}` : randomQuote,
      showMessage: true
    });

    // 5秒后隐藏消息
    setTimeout(() => {
      this.setData({
        showMessage: false,
        agentMood: 'normal'
      });
    }, 5000);
  },

  // 隐藏小狮子消息
  hideAgentMessage: function () {
    this.setData({ showMessage: false });
  },

  // 桌面点击 - 检测双击（背景切换）和蓝屏彩蛋
  onDesktopTap: function(e) {
    // 如果已经显示蓝屏，不处理
    if (this.data.showBlueScreen) return;

    const now = Date.now();
    const timeDiff = now - this.data.lastTapTime;

    // 检测双击（300ms 内两次点击）
    if (timeDiff < 300 && timeDiff > 0) {
      // 双击 - 切换背景
      this.switchDesktopBackground();
      this.data.lastTapTime = 0;
      return;
    }

    this.data.lastTapTime = now;

    // 检查蓝屏彩蛋（点击50次触发）
    const shouldTriggerBSOD = eggSystem.incrementCounter(EGG_IDS.BLUE_SCREEN, 50);

    if (shouldTriggerBSOD) {
      this.triggerBlueScreen();
    }
  },

  // 切换桌面背景
  switchDesktopBackground: function() {
    const newIndex = (this.data.desktopBgIndex + 1) % this.data.desktopBackgrounds.length;

    this.setData({
      desktopBgIndex: newIndex
    });

    // 首次切换发现彩蛋
    if (newIndex === 1) {
      eggSystem.discover('bg_switch');
      wx.showToast({
        title: '🎨 发现彩蛋：换了个心情',
        icon: 'none',
        duration: 2000
      });
    }
  },

  // 图标区域点击 - 阻止桌面点击事件
  onIconGridTap: function(e) {
    // 阻止事件冒泡到桌面
    // 图标点击由各自的 onIconTap 处理
  },

  // 触发蓝屏彩蛋
  triggerBlueScreen: function() {
    const isNewDiscovery = eggSystem.discover(EGG_IDS.BLUE_SCREEN);

    this.setData({
      showBlueScreen: true
    });

    // 蓝屏持续3秒后恢复
    setTimeout(() => {
      this.setData({
        showBlueScreen: false
      });

      // 如果是首次发现，显示发现提示
      if (isNewDiscovery) {
        wx.showToast({
          title: '🎉 发现彩蛋：那个年代的噩梦',
          icon: 'none',
          duration: 3000
        });
      }
    }, 3000);
  },

  // 点击任务栏 - 检测任务栏惊喜彩蛋
  onTaskbarTap: function() {
    // 点击任务栏10次触发惊喜
    const shouldTrigger = eggSystem.incrementCounter('taskbar_surprise', 10);

    if (shouldTrigger) {
      const isNewDiscovery = eggSystem.discover('taskbar_surprise');

      // 显示怀旧文字
      wx.showModal({
        title: '🎉 发现彩蛋！',
        content: isNewDiscovery ? '任务栏惊喜：\n\n"Windows正在检测你的硬件..."\n\n那个年代的等待记忆...' : '"Windows正在检测你的硬件..."',
        showCancel: false,
        confirmText: '回忆满满'
      });
    }
  },

  // 切换隐藏图标彩蛋
  toggleHiddenIcon: function() {
    const newValue = !this.data.showHiddenIcon;

    if (newValue) {
      eggSystem.discover('hidden_icon');
    }

    this.setData({
      showHiddenIcon: newValue
    });

    if (newValue) {
      wx.showToast({
        title: '🎉 发现隐藏图标！',
        icon: 'none',
        duration: 2000
      });
    }
  },

  // 点击隐藏图标
  onHiddenIconTap: function() {
    wx.showModal({
      title: '🎮 神秘游戏',
      content: '这是一个隐藏的入口...\n\n更多内容敬请期待！',
      showCancel: false,
      confirmText: '期待'
    });
  },

  // Konami Code 序列检测
  // ↑↑↓↓←→←→BA
  // 通过点击屏幕四个区域来模拟方向输入
  checkKonamiCode: function(direction) {
    const KONAMI_SEQUENCE = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

    // 添加当前输入
    this.data.konamiProgress.push(direction);

    // 只保留最近10个输入
    if (this.data.konamiProgress.length > 10) {
      this.data.konamiProgress = this.data.konamiProgress.slice(-10);
    }

    // 检查是否匹配
    const input = this.data.konamiProgress.join('');
    const target = KONAMI_SEQUENCE.join('');

    if (input === target) {
      this.triggerGodMode();
      this.data.konamiProgress = [];  // 重置
    }

    this.setData({
      konamiProgress: this.data.konamiProgress
    });
  },

  // 触发上帝模式
  triggerGodMode: function() {
    const isNewDiscovery = eggSystem.discover(EGG_IDS.KONAMI_CODE);

    this.setData({
      showGodMode: true,
      agentMood: 'happy',
      agentMessage: isNewDiscovery ? '🎉 上帝模式已激活！你发现了传说中的秘籍！' : '上帝模式已激活！',
      showMessage: true
    });

    // 显示上帝模式弹窗
    wx.showModal({
      title: '🎮 上帝模式！',
      content: isNewDiscovery ?
        '↑↑↓↓←→←→BA\n\n你发现了传说中的秘籍！\n\n奖励：100 Q点 + 上帝之手徽章' :
        '上帝模式已激活！\n\n所有能力解锁...',
      showCancel: false,
      confirmText: '太强了！'
    });

    // 3秒后隐藏消息
    setTimeout(() => {
      this.setData({
        showMessage: false,
        agentMood: 'normal'
      });
    }, 3000);
  },

  // 方向输入辅助函数 - 通过图标ID映射方向
  getDirectionFromIcon: function(iconId) {
    const directionMap = {
      'my-computer': 'up',      // 上 ↑
      'my-documents': 'left',   // 左 ←
      'recycle-bin': 'down',     // 下 ↓
      'network-neighborhood': 'right', //右 →
      'lion': 'b',              // 小狮子 = B
      'start': 'a'              // 开始按钮 = A
    };
    return directionMap[iconId] || null;
  },

  // 通过小狮子触发 B 按钮
  onLionTapKonami: function() {
    this.checkKonamiCode('b');
  },

  // 通过开始按钮触发 A 按钮
  onStartTapKonami: function() {
    this.checkKonamiCode('a');
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
