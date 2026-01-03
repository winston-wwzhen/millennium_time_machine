// miniprogram/pages/index/index.js
const { eggSystem, EGG_IDS } = require("../../utils/egg-system");
const { userApi } = require("../../utils/api-client");
const { pageErrorHandler } = require("../../utils/error-handler");
const cloudIcons = require("../../config/cloud-icons");

Page({
  data: {
    // 云存储图标URL
    cloudIconUrls: {
      lion: cloudIcons.getCloudIconUrl('lion.png'),
      qcio: cloudIcons.getCloudIconUrl('QCIO.png'),
    },
    // 小狮子位移 (用于 transform，初始为 0)
    agentTranslateX: 0,
    agentTranslateY: 0,
    isDragging: false,
    // 小狮子互动状态
    agentMood: "normal", // normal, happy, sleepy, surprised, dancing
    agentMessage: "",
    showMessage: false,
    isDancing: false, // 小狮子跳舞状态
    showBlueScreen: false, // 蓝屏彩蛋状态
    isMidnightEgg: false, // 午夜彩蛋状态（小狮子发光）

    // 小狮子自动说话定时器
    lionTalkTimer: null,
    showHiddenIcon: false, // 隐藏图标彩蛋状态
    konamiHalfCompleted: false, // Konami Code 前半部分完成状态
    showGodMode: false, // 上帝模式状态
    desktopBgIndex: 0, // 桌面背景索引
    lastTapTime: 0, // 上次点击时间（用于检测双击）
    currentBgStyle: '', // 当前桌面背景样式（动态计算）
    // 桌面背景列表（彩蛋用）
    desktopBackgrounds: [
      "#008080", // 经典 Win98 青色
      "#006400", // 深绿色
      "#4B0082", // 靛紫色
      "#8B4513", // 古铜色
      "#2F4F4F", // 深岩灰
      "#4A0E4E", // 复古紫
      "#1B1B1B", // 纯黑
      "https://636c-cloud1-4gvtpokae6f7dbab-1392774085.tcb.qcloud.la/wallpapers/%E5%A3%81%E7%BA%B8.jpg?sign=237f99f2194e08b01d9145b0e0e8bc6e&t=1767263627", // 自定义壁纸（云存储 HTTPS）
    ],
    // 桌面图标配置
    desktopIcons: [
      {
        id: "my-computer",
        name: "我的电脑",
        icon: cloudIcons.getCloudIconUrl('my-computer.png'),
        isImage: true,
        path: "/pages/my-computer/index",
      },
      {
        id: "my-documents",
        name: "我的文档",
        icon: cloudIcons.getCloudIconUrl('my-documents.png'),
        isImage: true,
        path: "/pages/my-documents/index",
      },
      {
        id: "qcio",
        name: "QCIO",
        icon: cloudIcons.getCloudIconUrl('QCIO.png'),
        isImage: true,
        path: "/pages/qcio/index",
      },
      {
        id: "ifthen",
        name: "如果当时",
        icon: cloudIcons.getCloudIconUrl('green_gem.png'),
        isImage: true,
        path: "/pages/ifthen/start",
      },
      {
        id: "network-neighborhood",
        name: "网管系统",
        icon: cloudIcons.getCloudIconUrl('locked_monitor.png'),
        isImage: true,
        path: "/pages/network-neighborhood/index",
      },
      {
        id: "browser",
        name: "浏览器",
        icon: cloudIcons.getCloudIconUrl('browser.png'),
        isImage: true,
        path: "/pages/browser/index",
      },
      {
        id: "ttplayer",
        name: "十分动听",
        icon: cloudIcons.getCloudIconUrl('ttplayer.png'),
        isImage: true,
        path: "/pages/ttplayer/index",
      },
      {
        id: "avatar",
        name: "非主流相机",
        icon: cloudIcons.getCloudIconUrl('avatar.png'),
        isImage: true,
        path: "components/avatar",
      },
      {
        id: "recycle-bin",
        name: "回收站",
        icon: cloudIcons.getCloudIconUrl('recycle-bin.png'),
        isImage: true,
        path: "components/recycle-bin",
      },
      {
        id: "egg-collection",
        name: "彩蛋大全",
        icon: cloudIcons.getCloudIconUrl('彩蛋.png'),
        isImage: true,
        path: "egg-collection",
      },
      {
        id: "manbo",
        name: "慢播",
        icon: cloudIcons.getCloudIconUrl('ifthen.png'),
        isImage: true,
        path: "component://manbo",
      },
    ],
    showStartMenu: false,
    showSubmenu: false, // 子菜单显示状态
    showTTPlayer: false, // 十分动听播放器显示状态
    showManbo: false, // 慢播播放器显示状态
    showMyComputer: false, // 我的电脑显示状态
    showNetworkSystem: false, // 网管系统显示状态
    showMyDocuments: false, // 我的文档显示状态
    showRecycleBin: false, // 回收站显示状态
    showAvatar: false, // 非主流相机显示状态
    showCmdConsole: false, // CMD 控制台显示状态
    showEggCollection: false, // 彩蛋大全显示状态
    showGobang: false, // 五子棋显示状态
    showMinesweeper: false, // 扫雷显示状态
    eggCollectionFileName: '彩蛋大全.txt', // 彩蛋大全文件名
    // 组件z-index管理（确保后打开的组件显示在上层）
    baseZIndex: 2000,
    ttplayerZIndex: 2000,
    manboZIndex: 2000,
    myComputerZIndex: 2000,
    networkSystemZIndex: 2000,
    myDocumentsZIndex: 2000,
    recycleBinZIndex: 2000,
    avatarZIndex: 2000,
    cmdConsoleZIndex: 2000,
    gobangZIndex: 2000,
    minesweeperZIndex: 2000,
    // 网络连接状态
    networkConnected: true, // 默认连接
    networkStatus: "online", // online, offline, connecting
    showNetworkInfo: false, // 显示网络信息气泡
    networkSpeed: { down: "0.00", up: "0.00" }, // 网络速度
    userNetFee: 0, // 用户网费（分钟）
    userCoins: 0, // 用户时光币
    showNetworkPlugin: true, // 网管系统插件显示状态
    // 程序升级状态（通过Downloads安装包升级后解锁）
    ttplayerUpgraded: false, // 十分动听是否已升级
    manboUpgraded: false, // 慢播是否已升级
    showVersionTooLowDialog: false, // 版本过低弹窗
    versionLowProgramName: "", // 版本过低的程序名称
    // 音量状态
    soundEnabled: true, // 音量开启状态
    showVolumeInfo: false, // 显示音量信息气泡
    // 右键菜单
    showContextMenu: false,
    contextMenuX: 0,
    contextMenuY: 0,
    // 错误弹窗
    showErrorDialog: false,
    // 日期弹窗
    showDateDialog: false,
    calendarYear: "",
    calendarMonth: "",
    calendarDay: "",
    calendarDayName: "",
    fullDateTime: "",
    lunarDate: "",
    calendarDays: [], // 日历网格数据
    // 彩蛋发现弹窗
    showEggDiscoveryDialog: false,
    eggDiscoveryData: {
      name: '',
      description: '',
      rarity: '',
      rarityName: '',
      rewardText: ''
    },
    // 开始菜单计数（彩蛋用）
    startMenuOpenCount: 0,
    startMenuEggAchieved: false,

    // 用户信息
    userInfo: {
      nickname: "载入中...",
      avatar: "👤",
    },
    // 用户编辑弹窗
    showUserEditDialog: false,
    editNickname: "",
    editAvatar: "👤",
    avatarList: [
      "👤",
      "😊",
      "🤖",
      "👻",
      "👽",
      "🎃",
      "😎",
      "🤠",
      "🥳",
      "🦊",
      "🐱",
      "🐶",
      "🐸",
      "🦄",
      "🌟",
      "🔥",
      "💎",
      "🎵",
      "🎮",
      "🚀",
    ],
    // 刷新状态
    isRefreshing: false,
    // 系统信息弹窗
    showSystemInfoDialog: false,
    systemInfoData: {},
    // 助手设置弹窗
    showAgentSettingsDialog: false,
    agentSettingsMessage: '',
    // 关于弹窗
    showAboutDialog: false,
    // 关机弹窗
    showShutdownDialog: false,
    // 欢迎弹窗（时间穿越提示）
    showWelcomeDialog: false,
    // 动态时间文案
    welcomeCurrentDate: '',    // 当前真实日期
    welcomeTargetDate: '',     // 穿越20年后的日期
    welcomeYearsPassed: '',    // 跨越年数（约20年）
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
    this.updateTimeTimer = setInterval(() => {
      this.updateTime();
    }, 60000);

    // 启动小狮子自动说话定时器（每隔8-15秒随机说话）
    this.startLionAutoTalk();

    // 加载网络状态
    this.loadNetworkStatus();

    // 从云端加载彩蛋数据
    this.loadEggData();

    // 检查时间彩蛋
    this.checkTimeEggs();

    // 加载用户信息
    this.loadUserInfo();

    // 加载音量状态
    const soundEnabled = wx.getStorageSync('soundEnabled');
    if (soundEnabled !== undefined) {
      this.setData({ soundEnabled });
    }

    // 初始化桌面背景样式
    this.updateBgStyle();

    // 注册彩蛋发现回调
    this.registerEggDiscoveryCallback();

    // 检查是否需要显示欢迎弹窗
    // 等待 app 初始化完成后再检查，避免时序问题
    const app = getApp();
    if (app.globalData.initPromise) {
      app.globalData.initPromise.then(() => {
        if (app.globalData.showWelcomeDialog) {
          this.calculateWelcomeTime();
          this.setData({ showWelcomeDialog: true });
        }
      }).catch(err => {
        console.error('等待初始化完成失败:', err);
      });
    } else {
      // 降级处理：如果 initPromise 不存在，直接检查
      if (app.globalData.showWelcomeDialog) {
        this.calculateWelcomeTime();
        this.setData({ showWelcomeDialog: true });
      }
    }
  },

  // 注册彩蛋发现回调（提取为独立方法，便于在 onLoad 和 onShow 中复用）
  registerEggDiscoveryCallback: function() {
    const { eggSystem } = require('../../utils/egg-system');
    // 先取消旧回调（如果存在）
    if (this.eggCallbackKey) {
      eggSystem.unregisterEggDiscoveryCallback(this.eggCallbackKey);
    }
    // 注册新回调
    this.eggCallbackKey = eggSystem.setEggDiscoveryCallback((config) => {
      const rarityNames = {
        common: '普通',
        rare: '稀有',
        epic: '史诗',
        legendary: '传说'
      };
      const reward = config.reward;
      const rewardText = reward.coins ? `+${reward.coins}时光币` : '';
      this.setData({
        showEggDiscoveryDialog: true,
        eggDiscoveryData: {
          name: config.name,
          description: config.description,
          rarity: config.rarity,
          rarityName: rarityNames[config.rarity],
          rewardText: rewardText
        }
      });
    });
  },

  // 页面卸载时清理彩蛋回调
  onUnload: function() {
    const { eggSystem } = require('../../utils/egg-system');
    if (this.eggCallbackKey) {
      eggSystem.unregisterEggDiscoveryCallback(this.eggCallbackKey);
    }

    // 清除小狮子自动说话定时器
    if (this.data.lionTalkTimer) {
      clearTimeout(this.data.lionTalkTimer);
    }

    // 清除系统时间更新定时器
    if (this.updateTimeTimer) {
      clearInterval(this.updateTimeTimer);
    }
  },

  // 加载用户信息（每次都从服务器获取最新数据）
  loadUserInfo: async function () {
    try {
      const balanceResult = await userApi.getBalance();
      if (balanceResult && balanceResult.success) {
        this.setData({
          "userInfo.nickname": balanceResult.avatarName || "用户",
          "userInfo.avatar": balanceResult.avatar || "👤",
          userNetFee: balanceResult.netFee || 0,
          userCoins: balanceResult.coins || 0,
          ttplayerUpgraded: balanceResult.ttplayerUpgraded || false,
          manboUpgraded: balanceResult.manboUpgraded || false,
        });
      }
    } catch (e) {
      console.error("加载用户信息失败:", e);
      // 保留默认值
    }
  },

  // ========== 统一日志记录方法 ==========
  // 添加操作日志（记录到云端，在我的文档中可见）
  // 使用 logger 模块的 addLog 函数，带随机有趣话语
  addLog: function(action, target, details) {
    const { addLog: logAction } = require("../../utils/logger");
    logAction(action, target, details);
  },

  // 点击用户横幅 - 打开编辑弹窗
  onUserBannerTap: function () {
    this.setData({
      showUserEditDialog: true,
      editNickname: this.data.userInfo.nickname,
      editAvatar: this.data.userInfo.avatar,
    });
  },

  // 选择头像
  selectAvatar: function (e) {
    const avatar = e.currentTarget.dataset.avatar;
    this.setData({ editAvatar: avatar });
  },

  // 昵称输入
  onNicknameInput: function (e) {
    this.setData({ editNickname: e.detail.value });
  },

  // 关闭用户编辑弹窗
  closeUserEditDialog: function () {
    this.setData({ showUserEditDialog: false });
  },

  // 保存用户信息（使用 API 客户端）
  saveUserInfo: async function () {
    const nickname = this.data.editNickname.trim();
    const avatar = this.data.editAvatar;

    if (!nickname) {
      wx.showToast({ title: "请输入昵称", icon: "none" });
      return;
    }

    if (nickname.length > 12) {
      wx.showToast({ title: "昵称最多12个字符", icon: "none" });
      return;
    }

    wx.showLoading({ title: "保存中...", mask: true });

    try {
      const result = await userApi.updateProfile({ nickname, avatar });

      if (result && result.success) {
        this.setData({
          "userInfo.nickname": result.avatarName,
          "userInfo.avatar": result.avatar,
          showUserEditDialog: false,
        });
        // 记录用户信息修改日志
        this.addLog('edit', '用户信息', `昵称: ${nickname}`);
        wx.showToast({ title: "保存成功", icon: "success" });
      }
    } catch (e) {
      console.error("保存用户信息失败:", e);
      // wx.showToast 已由 callCloudFunction 处理
    } finally {
      wx.hideLoading();
    }
  },

  // 从云端加载彩蛋数据
  loadEggData: async function () {
    try {
      await eggSystem.load();
      console.log("彩蛋数据加载完成");
    } catch (e) {
      console.error("加载彩蛋数据失败:", e);
    }
  },

  // 本地计数器（用于触发点击类彩蛋，不保存到云端）
  eggCounters: {},

  // 本地计数器辅助函数
  incrementEggCounter: function (eggId, max) {
    // 确保 eggCounters 对象存在
    if (!this.eggCounters) {
      this.eggCounters = {};
    }
    if (!this.eggCounters[eggId]) {
      this.eggCounters[eggId] = 0;
    }
    this.eggCounters[eggId]++;
    if (this.eggCounters[eggId] >= max) {
      this.eggCounters[eggId] = 0;
      return true;
    }
    return false;
  },

  // 页面显示时重新加载网络状态和用户余额
  onShow: function () {
    // 重新注册彩蛋回调（防止从其他页面返回后回调丢失）
    this.registerEggDiscoveryCallback();

    this.loadNetworkStatus();
    // 每次显示也检查时间彩蛋
    this.checkTimeEggs();

    // 刷新用户余额，确保网管插件显示最新数据
    this.loadUserInfo();

    // 如果网管系统打开，确保插件也显示
    if (this.data.showNetworkSystem) {
      this.setData({ showNetworkPlugin: true });
    }
  },

  // 检查时间相关彩蛋
  checkTimeEggs: async function () {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeStr = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    // 特殊时刻彩蛋：12:34, 4:44, 11:11, 22:22, 3:33
    const specialTimes = [
      "12:34",
      "04:44",
      "11:11",
      "22:22",
      "03:33",
      "05:55",
      "15:15",
    ];
    if (specialTimes.includes(timeStr)) {
      // 检查是否在当前分钟内已经触发过（使用临时标记防止重复触发）
      const lastTriggerKey = `last_special_time_${timeStr}`;
      const lastTrigger = wx.getStorageSync(lastTriggerKey) || 0;
      const nowTimestamp = Date.now();

      // 5分钟内不重复触发
      if (nowTimestamp - lastTrigger > 5 * 60 * 1000) {
        wx.setStorageSync(lastTriggerKey, nowTimestamp);
        const result = await eggSystem.discover(EGG_IDS.TIME_SPECIAL);
        const isNewDiscovery = result?.isNew || false;

        // 记录彩蛋发现日志
        if (isNewDiscovery) {
          this.addLog('egg', '特殊时刻', timeStr);
        }

        const messages = {
          "12:34": "1234，顺顺当当！",
          "04:44": "发发发，好运来~",
          "11:11": "光棍节快乐！",
          "22:22": "对称之美~",
          "03:33": "三分天下~",
          "05:55": "五福临门！",
          "15:15": "三点一刻~",
        };

        this.setData({
          agentMood: "happy",
          agentMessage: isNewDiscovery
            ? `🎉 ${messages[timeStr]} 发现特殊时刻彩蛋！`
            : messages[timeStr],
          showMessage: true,
        });

        setTimeout(() => {
          this.setData({ showMessage: false });
        }, 3000);
      }
    }

    // 午夜彩蛋：0点-1点之间
    if (hour === 0) {
      const result = await eggSystem.discover(EGG_IDS.TIME_MIDNIGHT);
      const isNewDiscovery = result?.isNew || false;

      // 记录彩蛋发现日志
      if (isNewDiscovery) {
        this.addLog('egg', '午夜时光', '深夜党专属');
      }

      this.setData({
        isMidnightEgg: true,
        agentMood: "surprised",
        agentMessage: isNewDiscovery
          ? "🎉 深夜党专属彩蛋！小狮子陪你熬夜~"
          : "深夜党还在吗？",
        showMessage: true,
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

  onIconTap: async function (e) {
    const path = e.currentTarget.dataset.path;
    const iconId = e.currentTarget.id;
    const icon = this.data.desktopIcons.find(i => i.id === iconId);

    // 图标点击彩蛋检测
    this.checkIconClickEggs(iconId);

    // 十分动听 - 检查升级状态
    if (path && path.includes("ttplayer")) {
      this.addLog('open', '十分动听');
      // 实时获取升级状态，确保数据最新
      const { userApi } = require('../../utils/api-client.js');
      const balanceResult = await userApi.getBalance();
      const isUpgraded = balanceResult && balanceResult.ttplayerUpgraded;

      if (!isUpgraded) {
        this.setData({
          showVersionTooLowDialog: true,
          versionLowProgramName: "十分动听"
        });
        return;
      }
      this.setData({ showTTPlayer: true });
      return;
    }

    // 我的电脑 - 打开组件
    if (path && path.includes("my-computer")) {
      this.addLog('open', '我的电脑');
      this.setData({
        showStartMenu: false,
        showSubmenu: false,
        showMyComputer: true,
        baseZIndex: this.data.baseZIndex + 10,
        myComputerZIndex: this.data.baseZIndex + 10
      });
      return;
    }

    // 我的文档 - 打开组件
    if (path && path.includes("my-documents")) {
      this.addLog('open', '我的文档');
      this.setData({
        showStartMenu: false,
        showSubmenu: false,
        showMyDocuments: true,
        baseZIndex: this.data.baseZIndex + 10,
        myDocumentsZIndex: this.data.baseZIndex + 10
      });
      return;
    }

    // 网管系统 - 打开组件
    if (path && path.includes("network-neighborhood")) {
      this.addLog('open', '网管系统');
      this.setData({
        showStartMenu: false,
        showSubmenu: false,
        showNetworkSystem: true,
        showNetworkPlugin: true,
        baseZIndex: this.data.baseZIndex + 10,
        networkSystemZIndex: this.data.baseZIndex + 10
      });
      return;
    }

    // 回收站 - 打开组件
    if (path && path.includes("recycle-bin")) {
      this.addLog('open', '回收站');
      this.setData({
        showStartMenu: false,
        showSubmenu: false,
        showRecycleBin: true,
        baseZIndex: this.data.baseZIndex + 10,
        recycleBinZIndex: this.data.baseZIndex + 10
      });
      return;
    }

    // 浏览器 - 打开页面
    if (path && path.includes("browser")) {
      this.addLog('open', '浏览器');
    }

    // 非主流相机 - 打开组件
    if (path && path.includes("avatar")) {
      this.addLog('open', '非主流相机');
      this.setData({
        showStartMenu: false,
        showSubmenu: false,
        showAvatar: true,
        baseZIndex: this.data.baseZIndex + 10,
        avatarZIndex: this.data.baseZIndex + 10
      });
      return;
    }

    // 五子棋 - 打开组件
    if (path && path.includes("gobang")) {
      this.addLog('open', '五子棋');
      this.setData({
        showStartMenu: false,
        showSubmenu: false,
        showGobang: true,
        baseZIndex: this.data.baseZIndex + 10,
        gobangZIndex: this.data.baseZIndex + 10
      });
      return;
    }

    // 扫雷 - 打开组件
    if (path && path.includes("minesweeper")) {
      this.addLog('open', '扫雷');
      this.setData({
        showStartMenu: false,
        showSubmenu: false,
        showMinesweeper: true,
        baseZIndex: this.data.baseZIndex + 10,
        minesweeperZIndex: this.data.baseZIndex + 10
      });
      return;
    }

    // QCIO - 打开页面
    if (path && path.includes("qcio")) {
      this.addLog('open', 'QCIO');
    }

    // 如果当时 - 打开页面
    if (path && path.includes("ifthen")) {
      this.addLog('open', '如果当时');
    }

    // 慢播 - 检查升级状态
    if (path && path.includes("manbo")) {
      this.addLog('open', '慢播');
      // 实时获取升级状态，确保数据最新
      const { userApi } = require('../../utils/api-client.js');
      const balanceResult = await userApi.getBalance();
      const isUpgraded = balanceResult && balanceResult.manboUpgraded;

      if (!isUpgraded) {
        this.setData({
          showVersionTooLowDialog: true,
          versionLowProgramName: "慢播"
        });
        return;
      }
      // 升级后显示慢播组件
      const currentZIndex = this.data.myComputerZIndex || 2000;
      this.setData({
        showManbo: true,
        manboZIndex: currentZIndex + 10
      });
      return;
    }

    // 彩蛋大全 - 直接打开彩蛋大全.txt
    if (path === "egg-collection") {
      this.addLog('open', '彩蛋大全');
      this.setData({
        showStartMenu: false,
        showSubmenu: false,
        showEggCollection: true,
        baseZIndex: this.data.baseZIndex + 10
      });
      return;
    }

    // 其他页面 - 记录日志
    if (icon) {
      this.addLog('open', icon.name);
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
  checkIconClickEggs: async function (iconId) {
    let eggId = null;
    let clickCount = 5; // 默认5次触发

    switch (iconId) {
      case "my-computer":
        eggId = EGG_IDS.MY_COMPUTER;
        break;
      case "browser":
        eggId = EGG_IDS.BROWSER_CLICK;
        break;
      default:
        return; // 不是有彩蛋的图标
    }

    const shouldTrigger = this.incrementEggCounter(eggId, clickCount);

    if (shouldTrigger) {
      const result = await eggSystem.discover(eggId);
      const isNewDiscovery = result?.isNew || false;
      const config = eggSystem.getConfig(eggId);

      // 记录彩蛋发现日志
      if (isNewDiscovery) {
        this.addLog('egg', config.name, '首次发现');
      }

      // 使用彩蛋弹窗显示（与其他彩蛋保持一致）
      if (isNewDiscovery) {
        const rarityNames = { common: '普通', rare: '稀有', epic: '史诗', legendary: '传说' };
        const rewardText = config.reward.coins ? `+${config.reward.coins}时光币` : '';

        this.setData({
          showEggDiscoveryDialog: true,
          eggDiscoveryData: {
            name: config.name,
            description: config.description,
            rarity: config.rarity,
            rarityName: rarityNames[config.rarity],
            rewardText
          }
        });
      }
    }
  },

  toggleStartMenu: async function () {
    const newShowStartMenu = !this.data.showStartMenu;
    this.setData({
      showStartMenu: newShowStartMenu,
      showContextMenu: false,
      showSubmenu: false, // 关闭开始菜单时也关闭子菜单
    });

    // Konami Code: 检查 A 输入（点击开始按钮）
    if (newShowStartMenu) {
      this.checkKonamiFinal('a');
    }

    // 彩蛋：开始菜单爱好者（仅在打开时计数）
    if (newShowStartMenu && !this.data.startMenuEggAchieved) {
      const newCount = this.data.startMenuOpenCount + 1;
      this.setData({ startMenuOpenCount: newCount });

      if (newCount >= 20) {
        this.setData({ startMenuEggAchieved: true });
        const { eggSystem, EGG_IDS } = require('../../utils/egg-system');
        await eggSystem.discover(EGG_IDS.START_MENU_FAN);
      }
    }
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
    this.addLog('action', '刷新桌面');

    // 触发刷新动画
    this.setData({ isRefreshing: true });

    // 模拟刷新加载
    setTimeout(() => {
      // 刷新完成，重新加载一些数据
      this.updateTime();
      this.loadNetworkStatus();

      // 刷新隐藏图标彩蛋状态（随机）
      if (this.data.showHiddenIcon && Math.random() > 0.5) {
        this.setData({ showHiddenIcon: false });
      }

      this.setData({ isRefreshing: false });
    }, 800);
  },

  // 显示系统信息
  showSystemInfo: function () {
    this.hideContextMenu();
    this.addLog('view', '系统信息');

    const systemInfo = wx.getSystemInfoSync();
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    this.setData({
      systemInfoData: {
        os: 'Windows 98',
        cpu: 'Pentium III 800MHz',
        memory: '128MB RAM',
        gpu: 'NVIDIA RIVA TNT2',
        display: `${systemInfo.windowWidth}x${systemInfo.windowHeight}`,
        time: `${hours}:${minutes}`,
        network: this.data.networkConnected ? '33.6K 拨号连接' : '未连接'
      },
      showSystemInfoDialog: true
    });
  },

  // 关闭系统信息弹窗
  hideSystemInfoDialog: function () {
    this.setData({ showSystemInfoDialog: false });
  },

  // 打开网管系统
  openNetworkSystem: function () {
    this.hideContextMenu();
    this.addLog('open', '网管系统', '右键菜单');
    this.setData({
      showNetworkSystem: true,
      showNetworkPlugin: true,
      baseZIndex: this.data.baseZIndex + 10,
      networkSystemZIndex: this.data.baseZIndex + 10
    });
  },

  // 显示助手设置
  showAgentSettings: function () {
    this.hideContextMenu();
    this.addLog('view', '助手设置');

    const messages = [
      '小狮子设置：\n\n• 拖动：移动位置\n• 点击：随机互动\n• 长按：怀旧语录\n• 点击10次：触发跳舞',
      '小狮子心情：\n\n😊 开心 - 日常互动\n😴 困倦 - 偶尔状态\n😲 惊讶 - 发现彩蛋\n💃 跳舞 - 特殊互动\n✨ 发光 - 午夜彩蛋',
      '提示：\n\n小狮子会在不同时段\n给你带来不同的惊喜哦~'
    ];

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    this.setData({
      agentSettingsMessage: randomMsg,
      showAgentSettingsDialog: true
    });
  },

  // 关闭助手设置弹窗
  hideAgentSettingsDialog: function () {
    this.setData({ showAgentSettingsDialog: false });
  },

  // 显示关于
  showAbout: function () {
    this.hideContextMenu();
    this.addLog('view', '关于');
    this.setData({ showAboutDialog: true });
  },

  // 关闭关于弹窗
  hideAboutDialog: function () {
    this.setData({ showAboutDialog: false });
  },

  // 关机
  onShutdown: function () {
    this.hideContextMenu();
    this.setData({ showShutdownDialog: true });
  },

  // 关机弹窗 - 确认关机
  onShutdownConfirm: function () {
    wx.exitMiniProgram({
      success: () => {
        console.log('小程序已关闭');
      },
      fail: (err) => {
        console.log('关闭小程序失败:', err);
        // 开发者工具中会失败，给提示
        wx.showToast({
          title: '关机功能仅真机有效',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 欢迎弹窗 - 确认并标记已显示
  onWelcomeDialogConfirm: async function () {
    try {
      // 调用云函数标记弹窗已显示
      await userApi.markWelcomeDialogShown();

      // 更新 globalData
      const app = getApp();
      app.globalData.showWelcomeDialog = false;

      // 关闭弹窗
      this.setData({ showWelcomeDialog: false });
    } catch (e) {
      console.error('标记欢迎弹窗失败:', e);
      // 即使失败也关闭弹窗，避免重复显示
      this.setData({ showWelcomeDialog: false });
    }
  },

  // 欢迎弹窗 - 计算动态时间
  calculateWelcomeTime: function() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 0-11 -> 1-12
    const currentDay = now.getDate();

    // 当前日期（真实）
    const currentDateStr = `${currentYear}年${currentMonth}月${currentDay}日`;

    // 穿越20年后的日期（2006年同月同日）
    const targetDateStr = `2006年${currentMonth}月${currentDay}日`;

    // 计算跨越年数（约20年）
    const yearsPassed = currentYear - 2006;

    this.setData({
      welcomeCurrentDate: currentDateStr,
      welcomeTargetDate: targetDateStr,
      welcomeYearsPassed: yearsPassed
    });
  },

  // 欢迎弹窗 - 阻止事件冒泡
  stopPropagation: function () {},

  // 关机弹窗 - 取消关机
  onShutdownCancel: function () {
    this.setData({ showShutdownDialog: false });
  },

  // 关闭彩蛋发现弹窗
  hideEggDiscoveryDialog: function () {
    this.setData({ showEggDiscoveryDialog: false });
  },

  // 显示彩蛋收集界面（使用 API 客户端和缓存）
  showEasterEggs: async function () {
    this.hideContextMenu();

    const progress = eggSystem.getProgress();
    const allConfigs = eggSystem.getAllConfigs();
    const badges = eggSystem.getBadges();
    const stats = eggSystem.getStats();

    // 直接从API获取余额（不使用缓存）
    let coins = 0;
    let netFee = 0;
    try {
      const result = await userApi.getBalance();
      if (result && result.success) {
        coins = result.coins || 0;
        netFee = result.netFee || 0;
      }
    } catch (e) {
      console.error("获取余额失败:", e);
    }

    // 按稀有度分组
    const rarityOrder = ["legendary", "epic", "rare", "common"];
    const rarityNames = {
      common: "🟢 普通",
      rare: "🔵 稀有",
      epic: "🟣 史诗",
      legendary: "🟠 传说",
    };

    let content = `🎯 彩蛋收集进度: ${progress.discovered}/${progress.total} (${progress.percentage}%)\n\n`;
    content += `💎 时光币余额: ${coins}\n`;
    content += `🌐 网费余额: ${Math.floor(netFee / 1440)}天${
      netFee % 1440
    }分钟\n`;
    content += `📅 已使用: ${stats.daysUsed || 0}天\n`;
    content += `🏆 累计获得时光币: ${stats.totalEarned}\n\n`;

    // 按稀有度显示
    for (const rarity of rarityOrder) {
      const eggs = Object.values(allConfigs).filter((e) => e.rarity === rarity);
      if (eggs.length > 0) {
        content += `【${rarityNames[rarity]}】\n`;
        for (const egg of eggs) {
          const isDiscovered = eggSystem.isDiscovered(egg.id);
          const status = isDiscovered ? "✅" : "❓";
          const name = isDiscovered ? egg.name : "???";
          const reward = isDiscovered ? `+${egg.reward.coins}时光币` : "";
          const hint = isDiscovered ? "" : `\n   💡 ${egg.hint}`;
          content += `${status} ${name} ${reward}${hint}\n`;
        }
        content += "\n";
      }
    }

    wx.showModal({
      title: "🥚 彩蛋收集册",
      content: content,
      showCancel: false,
      confirmText: "继续探索",
      confirmColor: "#008080",
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

    // 先重置拖动状态
    this.setData({ isDragging: false });

    // 如果有移动，不做任何处理
    if (this.hasMoved) {
      return;
    }

    // 长按：超过 350ms 当作长按处理
    if (dragDuration >= 350) {
      this.onAgentLongPress();
      return;
    }

    // 点击：时间短且没有移动
    if (dragDuration < 300) {
      this.onAgentTap();
    }
  },

  // 小狮子点击互动（注意：由于 catchtouch 阻止了 tap 事件，主要靠 onAgentDragEnd 调用）
  onAgentTap: function () {
    // Konami Code: 检查 B 输入（点击小狮子）
    this.checkKonamiFinal('b');

    // 检查小狮子跳舞彩蛋（点击10次触发）
    const shouldTriggerDance = this.incrementEggCounter(EGG_IDS.LION_DANCE, 10);

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

  // 启动小狮子自动说话
  startLionAutoTalk: function() {
    // 设置定时器，每隔8-15秒随机说话
    const scheduleNextTalk = () => {
      const randomInterval = Math.floor(Math.random() * 7000) + 8000; // 8000-15000ms
      const timer = setTimeout(() => {
        this.lionAutoTalk();
        scheduleNextTalk(); // 递归调用，实现循环
      }, randomInterval);
      this.setData({ lionTalkTimer: timer });
    };
    scheduleNextTalk();
  },

  // 小狮子自动说话（与点击互动类似，但使用不同的消息集）
  lionAutoTalk: function() {
    // 如果当前正在显示消息，则跳过（避免消息重叠）
    if (this.data.showMessage) {
      return;
    }

    const autoTalkMessages = [
      { mood: "happy", message: "今天天气不错呢~", icon: "😊" },
      { mood: "sleepy", message: "好无聊啊...", icon: "😴" },
      { mood: "normal", message: "系统运行正常~", icon: "🤖" },
      { mood: "happy", message: "要不要去我的电脑逛逛？", icon: "🥺" },
      { mood: "surprised", message: "记得去签到哦！", icon: "✨" },
      { mood: "normal", message: "Win98 系统运行中...", icon: "💻" },
      { mood: "sleepy", message: "等你陪玩呢...", icon: "💤" },
      { mood: "happy", message: "发现有趣的东西了吗？", icon: "🎁" },
      { mood: "normal", message: "CPU温度正常...", icon: "🌡️" },
      { mood: "happy", message: "千禧时光机 v1.0~", icon: "⚡" },
    ];

    const randomIndex = Math.floor(Math.random() * autoTalkMessages.length);
    const selected = autoTalkMessages[randomIndex];

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
  triggerLionDance: async function () {
    const result = await eggSystem.discover(EGG_IDS.LION_DANCE);
    const isNewDiscovery = result?.isNew || false;

    // 记录彩蛋发现日志
    if (isNewDiscovery) {
      this.addLog('egg', '舞动的小狮子', '小狮子跳舞');
    }

    this.setData({
      isDancing: true,
      agentMood: "dancing",
      agentMessage: isNewDiscovery
        ? "🎉 发现彩蛋：舞动的小狮子！"
        : "看我跳舞！💃",
      showMessage: true,
    });

    // 跳舞动画持续5秒
    setTimeout(() => {
      this.setData({
        isDancing: false,
        agentMood: "happy",
        showMessage: false,
      });
    }, 5000);
  },

  // 小狮子长按 - 触发说话彩蛋
  // 注意：由 onAgentDragEnd 根据时长调用
  onAgentLongPress: async function () {
    // 触发说话彩蛋
    const result = await eggSystem.discover(EGG_IDS.LION_TALK);
    const isNewDiscovery = result?.isNew || false;

    // 记录彩蛋发现日志
    if (isNewDiscovery) {
      this.addLog('egg', '小狮子的心里话', '怀旧语录');
    }

    // 怀旧语录库
    const nostalgicQuotes = [
      "承諾、絠什嚒用？還bùsんì洅見。",
      "莪們還能回去嗎？那個屬於莪們啲年代...",
      "45度仰望天空，眼泪才不会掉下来。",
      "那些年，我们一起追过的女孩...",
      "哥抽的不是烟，是寂寞。",
      "华丽的语言背后，是空洞的灵魂。",
      "非主流，是一种态度，不是一种风格。",
      "每一个不曾起舞的日子，都是对生命的辜负。",
      "网线那一端的你，还好吗？",
      "记得当年在网吧通宵的日子吗？",
      "那些年我们一起聊过的天，还在吗？",
      "时光不老，我们不散。",
      "有些话，只能在这里说...",
    ];

    const randomQuote =
      nostalgicQuotes[Math.floor(Math.random() * nostalgicQuotes.length)];

    this.setData({
      agentMood: "surprised",
      agentMessage: isNewDiscovery
        ? `🎉 发现彩蛋：${randomQuote}`
        : randomQuote,
      showMessage: true,
    });

    // 5秒后隐藏消息
    setTimeout(() => {
      this.setData({
        showMessage: false,
        agentMood: "normal",
      });
    }, 5000);
  },

  // 隐藏小狮子消息
  hideAgentMessage: function () {
    this.setData({ showMessage: false });
  },

  // 桌面点击 - 检测双击（背景切换）和蓝屏彩蛋
  onDesktopTap: function (e) {
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
    const shouldTriggerBSOD = this.incrementEggCounter(EGG_IDS.BLUE_SCREEN, 50);

    if (shouldTriggerBSOD) {
      this.triggerBlueScreen();
    }
  },

  // 切换桌面背景
  switchDesktopBackground: async function () {
    const newIndex =
      (this.data.desktopBgIndex + 1) % this.data.desktopBackgrounds.length;

    this.setData({
      desktopBgIndex: newIndex,
    });

    // 更新背景样式
    this.updateBgStyle();

    // 首次切换发现彩蛋
    if (newIndex === 1) {
      await eggSystem.discover(EGG_IDS.BG_SWITCH);
    }
  },

  // 更新桌面背景样式
  updateBgStyle: function() {
    const bgValue = this.data.desktopBackgrounds[this.data.desktopBgIndex];

    // 判断是图片还是颜色
    // 支持本地路径 (/images/...)、云存储路径 (cloud://...) 和 HTTPS/HTTP URL
    if (bgValue.startsWith('/') || bgValue.startsWith('cloud://') || bgValue.startsWith('http://') || bgValue.startsWith('https://')) {
      // 图片背景
      this.setData({
        currentBgStyle: `background-image: url('${bgValue}'); background-size: cover; background-position: center; background-repeat: no-repeat;`
      });
    } else {
      // 纯色背景
      this.setData({
        currentBgStyle: `background-color: ${bgValue};`
      });
    }
  },

  // 图标区域点击 - 阻止桌面点击事件
  onIconGridTap: function (e) {
    // 阻止事件冒泡到桌面
    // 图标点击由各自的 onIconTap 处理
  },

  // 触发蓝屏彩蛋
  triggerBlueScreen: async function () {
    await eggSystem.discover(EGG_IDS.BLUE_SCREEN);

    this.setData({
      showBlueScreen: true,
    });

    // 蓝屏持续3秒后恢复
    setTimeout(() => {
      this.setData({
        showBlueScreen: false,
      });
    }, 3000);
  },

  // 点击任务栏 - 检测任务栏惊喜彩蛋
  onTaskbarTap: async function () {
    // 点击任务栏10次触发惊喜
    const shouldTrigger = this.incrementEggCounter(
      EGG_IDS.TASKBAR_SURPRISE,
      10
    );

    if (shouldTrigger) {
      // 触发彩蛋，自动调用已注册的 Win98 风格弹窗回调
      await eggSystem.discover(EGG_IDS.TASKBAR_SURPRISE);
    }
  },

  // 切换隐藏图标彩蛋
  toggleHiddenIcon: async function () {
    const newValue = !this.data.showHiddenIcon;

    if (newValue) {
      await eggSystem.discover(EGG_IDS.HIDDEN_ICON);
    }

    this.setData({
      showHiddenIcon: newValue,
    });
  },

  // 点击隐藏图标
  onHiddenIconTap: function () {
    wx.showModal({
      title: "🎮 神秘游戏",
      content: "这是一个隐藏的入口...\n\n更多内容敬请期待！",
      showCancel: false,
      confirmText: "期待",
    });
  },

  // ==================== Konami Code 相关 ====================
  // Konami Code 序列检测（两阶段）
  // 阶段1: 在我的电脑窗口按顺序点击驱动器并关闭弹窗，最后关闭窗口
  //        序列: C→关→C→关→D→关→USB→关→D→关→C→关 → 关闭窗口
  // 阶段2: 点击小狮子(B) + 点击开始按钮(A)
  //
  // 设计理念: 正常用户点击驱动器后关闭弹窗，可以继续操作或关闭窗口
  //           只有刻意按照序列 C→C→D→USB→D→C 操作后立即关闭窗口才会触发彩蛋

  // Konami 半程完成事件（由 my-computer 组件触发）
  onKonamiHalfComplete: function() {
    // 清除之前的超时定时器
    if (this.konamiTimer) {
      clearTimeout(this.konamiTimer);
    }

    this.setData({ konamiHalfCompleted: true });

    // 10秒内未完成则重置
    this.konamiTimer = setTimeout(() => {
      this.setData({ konamiHalfCompleted: false });
    }, 10000);

    // 提示用户
    this.setData({
      agentMood: "surprised",
      agentMessage: "已输入一半...继续完成秘籍？",
      showMessage: true,
    });

    setTimeout(() => {
      this.setData({ showMessage: false });
    }, 2000);
  },

  // 检查 Konami 最终输入（B 和 A）
  checkKonamiFinal: function(input) {
    if (!this.data.konamiHalfCompleted) return;

    // 静态变量跟踪输入
    if (!this.konamiFinalInputs) {
      this.konamiFinalInputs = [];
    }

    this.konamiFinalInputs.push(input);

    // 检查是否匹配 BA
    if (this.konamiFinalInputs.length === 2 &&
        this.konamiFinalInputs[0] === 'b' &&
        this.konamiFinalInputs[1] === 'a') {
      this.triggerGodMode();
      this.konamiFinalInputs = [];
      this.setData({ konamiHalfCompleted: false });
      if (this.konamiTimer) {
        clearTimeout(this.konamiTimer);
      }
    } else if (this.konamiFinalInputs.length >= 2) {
      // 输入错误，重置
      this.konamiFinalInputs = [];
      this.setData({ konamiHalfCompleted: false });
      if (this.konamiTimer) {
        clearTimeout(this.konamiTimer);
      }
    }
  },

  // 触发上帝模式（传说中的秘籍彩蛋）
  triggerGodMode: async function () {
    // 触发彩蛋发现（会自动显示 Win98 风格弹窗，与其他彩蛋保持一致）
    await eggSystem.discover(EGG_IDS.KONAMI_CODE);

    // 激活上帝模式效果
    this.setData({ showGodMode: true });
  },

  // 点击网络图标
  onNetworkIconTap: function () {
    if (!this.data.networkConnected) {
      wx.showModal({
        title: "网络未连接",
        content: '检测到网络断开连接。请通过"网管系统"重新连接网络。',
        showCancel: false,
        confirmText: "去连接",
        success: (res) => {
          if (res.confirm) {
            this.setData({ showNetworkSystem: true });
          }
        },
      });
    } else {
      // 显示网络信息气泡（33.6K拨号连接）
      this.setData({
        showNetworkInfo: true,
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

  // 点击音量图标
  onVolumeIconTap: function () {
    // 切换静音状态
    const newSoundEnabled = !this.data.soundEnabled;
    this.setData({
      soundEnabled: newSoundEnabled,
      showVolumeInfo: true
    });

    // 保存到本地存储
    wx.setStorageSync('soundEnabled', newSoundEnabled);

    // 2秒后自动隐藏气泡
    if (this.volumeInfoTimer) {
      clearTimeout(this.volumeInfoTimer);
    }
    this.volumeInfoTimer = setTimeout(() => {
      this.setData({ showVolumeInfo: false });
    }, 2000);
  },

  // 点击QCIO图标
  onQcioIconTap: function () {
    this.addLog('open', 'QCIO');
    wx.navigateTo({
      url: '/pages/qcio/index'
    });
  },

  // 点击网管系统插件
  onNetworkPluginTap: function () {
    this.setData({
      showNetworkSystem: true,
      showNetworkPlugin: true,
      baseZIndex: this.data.baseZIndex + 10,
      networkSystemZIndex: this.data.baseZIndex + 10
    });
  },

  // 关闭网管系统插件
  onCloseNetworkPlugin: function () {
    this.setData({ showNetworkPlugin: false });
  },

  // 关闭错误弹窗
  hideErrorDialog: function () {
    this.setData({ showErrorDialog: false });
  },

  hideVersionTooLowDialog: function () {
    this.setData({ showVersionTooLowDialog: false });
  },

  // 点击系统时间显示日期详情
  onTimeTap: function () {
    const now = new Date();
    const year = 2006; // 固定为2006年，符合千禧时光机主题
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    const dayNames = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];
    const dayName = dayNames[now.getDay()];

    // 简单的农历模拟（非真实计算，仅供娱乐）
    const lunarMonths = [
      "正月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "冬月",
      "腊月",
    ];
    const lunarDays = [
      "初一",
      "初二",
      "初三",
      "初四",
      "初五",
      "初六",
      "初七",
      "初八",
      "初九",
      "初十",
      "十一",
      "十二",
      "十三",
      "十四",
      "十五",
      "十六",
      "十七",
      "十八",
      "十九",
      "二十",
      "廿一",
      "廿二",
      "廿三",
      "廿四",
      "廿五",
      "廿六",
      "廿七",
      "廿八",
      "廿九",
      "三十",
    ];
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
        isToday: d === day,
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
      calendarDays: calendarDays,
    });
  },

  // 关闭日期弹窗
  hideDateDialog: function () {
    this.setData({ showDateDialog: false });
  },

  // 关闭十分动听播放器
  onCloseTTPlayer: function () {
    console.log("onCloseTTPlayer 被调用");
    this.setData({ showTTPlayer: false });
  },

  // 关闭慢播播放器
  onCloseManbo: function () {
    this.setData({ showManbo: false });
  },

  // 显示视频回忆弹窗（从manbo组件触发）
  onShowVideoMemory: function (e) {
    const { videoType, videoName } = e.detail;

    // 构造视频item对象
    const videoItem = {
      name: videoName,
      icon: "🎬"
    };

    // 使用my-computer组件的showVideoMemoryDialog方法
    // 需要先打开我的电脑组件，然后显示弹窗
    this.setData({
      showMyComputer: true,
      myComputerZIndex: (this.data.manboZIndex || 2000) + 10,
      showManbo: false // 关闭manbo
    });

    // 等待my-computer组件渲染后显示弹窗
    setTimeout(() => {
      const myComputer = this.selectComponent('#my-computer');
      if (myComputer && myComputer.showVideoMemoryDialog) {
        myComputer.showVideoMemoryDialog(videoItem, videoType);
      }
    }, 300);
  },

  // 打开十分动听播放器
  onOpenTTPlayer: function () {
    // 让十分动听的z-index高于我的电脑
    const currentZIndex = this.data.myComputerZIndex || 2000;
    this.setData({
      showTTPlayer: true,
      ttplayerZIndex: currentZIndex + 10
    });
  },

  // 打开慢播播放器
  onOpenManbo: function () {
    const currentZIndex = this.data.myComputerZIndex || 2000;
    this.setData({
      showManbo: true,
      manboZIndex: currentZIndex + 10
    });
  },

  // 关闭我的电脑
  onCloseMyComputer: function () {
    this.setData({ showMyComputer: false });
  },

  // 从我的电脑打开浏览器
  onOpenBrowser: function () {
    wx.navigateTo({
      url: '/pages/browser/index'
    });
  },

  // 从我的电脑打开我的文档
  onOpenDocuments: function () {
    this.setData({
      showMyDocuments: true,
      baseZIndex: this.data.baseZIndex + 10,
      myDocumentsZIndex: this.data.baseZIndex + 10
    });
  },

  // 关闭网管系统
  onCloseNetworkSystem: function () {
    this.setData({ showNetworkSystem: false });
  },

  // 关闭我的文档
  onCloseMyDocuments: function () {
    this.setData({ showMyDocuments: false });
  },

  // 关闭回收站
  onCloseRecycleBin: function () {
    this.setData({ showRecycleBin: false });
  },

  // 关闭非主流相机
  onCloseAvatar: function () {
    this.setData({ showAvatar: false });
  },

  // 关闭五子棋
  onCloseGobang: function () {
    this.setData({ showGobang: false });
  },

  // 关闭扫雷
  onCloseMinesweeper: function () {
    this.setData({ showMinesweeper: false });
  },

  // 关闭彩蛋大全
  onCloseEggCollection: function () {
    this.setData({ showEggCollection: false });
  },

  // 打开 CMD 控制台
  openCmdConsole: function () {
    this.setData({
      showStartMenu: false,
      showSubmenu: false,  // 关闭子菜单
      showCmdConsole: true,
      baseZIndex: this.data.baseZIndex + 10,
      cmdConsoleZIndex: this.data.baseZIndex + 10,
    });
  },

  // 关闭 CMD 控制台
  closeCmdConsole: function () {
    this.setData({ showCmdConsole: false });
  },

  onShareAppMessage: function () {
    return {
      title: "欢迎来到千禧年",
      path: "/pages/index/index",
    };
  },

  // 图标加载成功回调
  onIconLoad: function(e) {
    console.log('[Icon] 图标加载成功:', e.detail.src);
  },

  // 图标加载失败回调
  onIconError: function(e) {
    console.error('[Icon] 图标加载失败:', e.detail.src);
    // 可以在这里添加降级处理，比如使用默认图标
    wx.showToast({
      title: '图标加载失败',
      icon: 'none',
      duration: 1000
    });
  },

  // 分享到朋友圈
  onShareTimeline: function () {
    return {
      title: "千禧时光机 - 穿越回2006年",
      imageUrl: "", // 可选：自定义分享图片
    };
  },
});
