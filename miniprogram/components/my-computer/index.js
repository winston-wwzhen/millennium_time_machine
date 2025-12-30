// 我的电脑组件
const { eggSystem, EGG_IDS } = require("../../utils/egg-system");
const { userApi } = require("../../utils/api-client");
const { addLog } = require("../../utils/logger");

Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    zIndex: {
      type: Number,
      value: 2000
    }
  },

  data: {
    // 驱动器弹窗
    showDriveDialog: false,
    driveDialogData: {
      title: '',
      icon: '',
      message: ''
    },
    // 帮助弹窗
    showHelpDialog: false,
    // 系统属性弹窗
    showSystemProperties: false,
    systemInfo: null,
    userInfo: null,
    loadingSystemInfo: false,
    // 磁盘清理
    showDiskCleanupConfirm: false,
    showDiskCleanupScanning: false,
    showDiskCleanupResult: false,
    diskCleanupProgress: 0,
    diskCleanupResult: null,
    diskCleanupTodayCount: 0,
    // 设备管理器
    showDeviceManager: false,
    showDeviceDetail: false,
    selectedDevice: null,
    devices: [
      {
        id: 'cpu',
        name: '时光机 CPU v3.7 @ 566MHz',
        category: 'cpu',
        icon: '⚡',
        description: '中央处理器',
        remark: '别嫌慢，这可是2005年的顶配！想要更快的？先把彩蛋找全了再说吧~'
      },
      {
        id: 'memory',
        name: '256MB SDRAM',
        category: 'memory',
        icon: '💾',
        description: '内存条',
        remark: '256MB足以运行所有怀旧程序！什么？你要玩3A大作？'
      },
      {
        id: 'graphics',
        name: '怀旧显卡 GForce MX440',
        category: 'graphics',
        icon: '🎮',
        description: '显示卡',
        remark: 'GForce MX440，当年玩CS的神器！现在...只能看看了'
      },
      {
        id: 'sound',
        name: '火星文兼容声卡 v2.0',
        category: 'sound',
        icon: '🔊',
        description: '声卡',
        remark: '完美支持火星文语音播报，虽然听不懂在说什么'
      },
      {
        id: 'network',
        name: '56K 调制解调器 (拨号)',
        category: 'network',
        icon: '🌐',
        description: '网络适配器',
        remark: '56K拨号上网，正在连接...嘟...嘟...嘟...'
      },
      {
        id: 'harddisk',
        name: '本地磁盘 (C: 2GB / D: 5GB)',
        category: 'disk',
        icon: '💽',
        description: '磁盘驱动器',
        remark: 'C盘装系统，D盘装游戏，USB存照片...经典配置！'
      },
      {
        id: 'mouse',
        name: 'PS/2 兼容鼠标',
        category: 'mouse',
        icon: '🖱️',
        description: '鼠标和其他指针设备',
        remark: 'PS/2接口，拔插需重启...小心别插坏了'
      },
      {
        id: 'keyboard',
        name: '标准 101/102 键盘',
        category: 'keyboard',
        icon: '⌨️',
        description: '键盘',
        remark: '标准101键，能打出所有火星文！不信你试试？'
      }
    ],
    viewedDevices: [], // 已查看过的设备
    // 文件浏览器
    showFileExplorer: false,
    fileExplorerPath: '',
    fileExplorerCurrentDrive: '',
    fileExplorerItems: [],
    fileExplorerBreadcrumbs: [],
    exploredDrives: [], // 已探索过的驱动器

    overlayStyle: '',
    // 文件菜单下拉
    showFileMenu: false,
    // 基础用户信息（用于系统信息面板）
    userInfo: null,
    // 磁盘容量（动态）
    diskUsagePercent: 99,
    diskUsageText: '99% 已用 - 空间不足!'
  },

  observers: {
    'show': function(newVal) {
      if (newVal) {
        addLog('open', '我的电脑');
        // 打开窗口时重置 Konami 序列
        this.resetKonamiSequence();
        // 加载基础用户信息
        this.loadUserInfo();
      }
    },
    'zIndex': function(newVal) {
      this.setData({
        overlayStyle: `z-index: ${newVal};`
      });
    }
  },

  lifetimes: {
    attached() {
      // 初始化 Konami 序列计数
      this.konamiSequence = [];
      this.waitingForWindowClose = false; // 等待关闭窗口的标志
      this.eggCallbackKey = null; // 彩蛋回调key

      // 加载彩蛋系统检查是否已达成
      eggSystem.load();
      this.konamiAchieved = eggSystem.isDiscovered(EGG_IDS.KONAMI_CODE);

      // 注册彩蛋发现回调
      this.eggCallbackKey = eggSystem.registerEggDiscoveryCallback((config) => {
        this.onEggDiscovered(config);
      });
    },

    detached() {
      // 取消注册彩蛋回调
      if (this.eggCallbackKey) {
        eggSystem.unregisterEggDiscoveryCallback(this.eggCallbackKey);
      }
    }
  },

  methods: {
    // ==================== 窗口控制 ====================

    // 关闭窗口
    onClose: function() {
      // 检查 Konami 序列：等待关闭窗口（第二次关闭）
      if (this.waitingForWindowClose) {
        this.triggerEvent('konamihalf', { completed: true });
        this.resetKonamiSequence();
      }

      this.triggerEvent('close');
    },

    // 阻止事件冒泡
    stopPropagation: function() {
      // 空函数，仅用于阻止事件冒泡
    },

    // ==================== 文件菜单相关 ====================

    // 切换文件菜单显示
    onFileMenuTap: function() {
      this.setData({
        showFileMenu: !this.data.showFileMenu
      });
    },

    // 点击窗口主体关闭菜单
    onWindowBodyTap: function() {
      if (this.data.showFileMenu) {
        this.setData({
          showFileMenu: false
        });
      }
    },

    // ==================== Konami 序列相关 ====================

    // 重置 Konami 序列
    resetKonamiSequence: function() {
      this.konamiSequence = [];
      this.waitingForWindowClose = false;
    },

    // 点击驱动器
    onDriveTap: function(e) {
      const drive = e.currentTarget.dataset.drive;

      // 检查磁盘容量是否达到99%
      if (drive === 'C' && this.data.diskUsagePercent >= 99) {
        this.setData({
          showDriveDialog: true,
          driveDialogData: {
            title: '💥 系统警告',
            icon: '⚠️',
            message: 'C盘已满！\n\n磁盘容量达到99%\n系统无法正常运行\n\n请使用"磁盘清理"功能释放空间'
          }
        });
        return;
      }

      // 如果已经达成，不再检测
      if (this.konamiAchieved) {
        this.showDriveDialogAndReset(drive);
        return;
      }

      // 添加到序列
      this.konamiSequence.push(drive);

      // 只保留最近6个输入
      if (this.konamiSequence.length > 6) {
        this.konamiSequence = this.konamiSequence.slice(-6);
      }

      // 检查是否匹配序列
      const KONAMI_DRIVE_SEQUENCE = ['C', 'C', 'D', 'USB', 'D', 'C'];
      const input = this.konamiSequence.join(',');
      const target = KONAMI_DRIVE_SEQUENCE.join(',');

      if (input === target) {
        // 序列匹配，设置等待标志
        this.waitingForWindowClose = true;
      } else if (this.konamiSequence.length === 6 && input !== target) {
        // 序列不匹配，重置
        this.resetKonamiSequence();
      }

      // 打开文件浏览器
      this.openFileExplorer(drive);
    },

    // 显示驱动器对话框（如果序列不匹配则重置）
    showDriveDialogAndReset: function(drive) {
      let dialogData = {};

      switch(drive) {
        case 'C':
          const diskUsage = this.data.diskUsagePercent;
          const freeSpace = 100 - diskUsage;
          dialogData = {
            title: '本地磁盘 (C:)',
            icon: '💾',
            message: `已用空间: ${diskUsage}%\n可用空间: ${freeSpace}%\n\n点击进入文件浏览器`
          };
          break;
        case 'D':
          dialogData = {
            title: '本地磁盘 (D:)',
            icon: '💾',
            message: '已用空间: 5GB\n可用空间: 7GB\n\n点击进入文件浏览器'
          };
          break;
        case 'USB':
          dialogData = {
            title: '可移动磁盘 (USB:)',
            icon: '📱',
            message: '已用空间: 128MB\n可用空间: 872MB\n\n点击进入文件浏览器'
          };
          break;
      }

      this.setData({
        driveDialogData: dialogData,
        showDriveDialog: true
      });
    },

    // 关闭驱动器弹窗
    closeDriveDialog: function() {
      this.setData({
        showDriveDialog: false
      });
    },

    // ==================== 系统属性 ====================

    // 显示系统属性
    async onShowSystemProperties() {
      this.setData({
        loadingSystemInfo: true,
        showSystemProperties: true,
        showFileMenu: false  // 关闭文件菜单
      });

      try {
        const res = await userApi.getSystemInfo();
        if (res && res.success) {
          this.setData({
            systemInfo: res.systemInfo,
            userInfo: res.userInfo
          });
        }
      } catch (e) {
        console.error('获取系统信息失败:', e);
      } finally {
        this.setData({
          loadingSystemInfo: false
        });
      }
    },

    // 关闭系统属性
    onCloseSystemProperties() {
      this.setData({
        showSystemProperties: false
      });
    },

    // ==================== 磁盘清理 ====================

    // 显示磁盘清理确认对话框
    onShowDiskCleanup() {
      this.setData({
        showDiskCleanupConfirm: true,
        showFileMenu: false  // 关闭文件菜单
      });
    },

    // 开始磁盘清理
    async onStartDiskCleanup() {
      this.setData({
        showDiskCleanupConfirm: false,
        showDiskCleanupScanning: true,
        diskCleanupProgress: 0
      });

      // 模拟扫描进度
      this.simulateDiskCleanup();
    },

    // 模拟磁盘清理扫描
    simulateDiskCleanup() {
      const totalSteps = 100;
      let progress = 0;

      const timer = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress > totalSteps) progress = totalSteps;

        this.setData({
          diskCleanupProgress: progress
        });

        if (progress >= totalSteps) {
          clearInterval(timer);
          this.completeDiskCleanup();
        }
      }, 200);
    },

    // 完成磁盘清理
    async completeDiskCleanup() {
      try {
        const res = await userApi.diskCleanup();

        if (res.success) {
          // 检查是否有奖励
          if (res.hasReward) {
            // 更新磁盘容量显示
            const newDiskUsage = res.diskUsage?.after || this.data.diskUsagePercent;
            this.setData({
              showDiskCleanupScanning: false,
              showDiskCleanupResult: true,
              diskUsagePercent: newDiskUsage,
              diskUsageText: this.getDiskUsageText(newDiskUsage),
              diskCleanupResult: {
                success: true,
                hasReward: true,
                ...res.details,
                diskUsageBefore: res.diskUsage?.before,
                diskUsageAfter: res.diskUsage?.after
              }
            });
          } else {
            // 无奖励的情况
            this.setData({
              showDiskCleanupScanning: false,
              showDiskCleanupResult: true,
              diskCleanupResult: {
                success: true,
                hasReward: false,
                message: res.message || '今天已经清理过了，再次清理不会获得奖励'
              }
            });
          }
        } else {
          this.setData({
            showDiskCleanupScanning: false,
            showDiskCleanupResult: true,
            diskCleanupResult: {
              success: false,
              message: res.errMsg || '清理失败，请重试'
            }
          });
        }
      } catch (e) {
        console.error('磁盘清理失败:', e);
        this.setData({
          showDiskCleanupScanning: false,
          showDiskCleanupResult: true,
          diskCleanupResult: {
            success: false,
            message: '清理失败，请重试'
          }
        });
      }
    },

    // 关闭磁盘清理弹窗
    closeDiskCleanupDialogs() {
      this.setData({
        showDiskCleanupConfirm: false,
        showDiskCleanupScanning: false,
        showDiskCleanupResult: false
      });
    },

    // ==================== 设备管理器 ====================

    // 显示设备管理器
    onShowDeviceManager() {
      this.setData({
        showDeviceManager: true,
        showFileMenu: false  // 关闭文件菜单
      });
    },

    // 关闭设备管理器
    onCloseDeviceManager() {
      this.setData({
        showDeviceManager: false
      });
    },

    // 显示设备详情
    onShowDeviceDetail(e) {
      const deviceId = e.currentTarget.dataset.deviceId;
      const device = this.data.devices.find(d => d.id === deviceId);

      if (device) {
        // 记录已查看的设备
        const viewedDevices = [...this.data.viewedDevices];
        if (!viewedDevices.includes(deviceId)) {
          viewedDevices.push(deviceId);
        }

        // 检查是否已查看完所有设备（触发彩蛋）
        if (viewedDevices.length === this.data.devices.length) {
          this.triggerDeviceManagerEgg();
        }

        // 获取设备类型的中文名称
        const categoryMap = {
          cpu: '处理器',
          memory: '内存',
          graphics: '显卡',
          sound: '声卡',
          network: '网卡',
          disk: '磁盘',
          mouse: '鼠标',
          keyboard: '键盘',
          monitor: '显示器'
        };

        const deviceWithType = {
          ...device,
          typeText: categoryMap[device.category] || device.category
        };

        this.setData({
          selectedDevice: deviceWithType,
          showDeviceDetail: true,
          viewedDevices: viewedDevices
        });
      }
    },

    // 关闭设备详情
    onCloseDeviceDetail() {
      this.setData({
        showDeviceDetail: false,
        selectedDevice: null
      });
    },

    // 触发设备管理专家彩蛋
    async triggerDeviceManagerEgg() {
      try {
        await eggSystem.discover(EGG_IDS.DEVICE_MANAGER_EXPERT);
      } catch (e) {
        console.error('触发设备管理专家彩蛋失败:', e);
      }
    },

    // ==================== 文件浏览器 ====================

    // 打开文件浏览器
    openFileExplorer(drive) {
      const drivePath = drive === 'USB' ? 'USB:\\' : `${drive}:\\`;

      // 记录已探索的驱动器
      const exploredDrives = [...this.data.exploredDrives];
      if (!exploredDrives.includes(drive)) {
        exploredDrives.push(drive);
      }

      // 检查是否探索完所有驱动器（触发彩蛋）
      if (exploredDrives.length >= 3) {
        this.triggerFileExplorerEgg();
      }

      this.setData({
        showDriveDialog: false,
        showFileExplorer: true,
        fileExplorerCurrentDrive: drive,
        fileExplorerPath: drivePath,
        fileExplorerBreadcrumbs: [{ label: drivePath, path: drivePath }],
        exploredDrives: exploredDrives
      });

      this.loadFileExplorerItems(drivePath);
    },

    // 加载文件浏览器内容
    loadFileExplorerItems(path) {
      const items = this.getFileItemsForPath(path);
      this.setData({
        fileExplorerItems: items
      });
    },

    // 根据路径获取文件项
    getFileItemsForPath(path) {
      // 根据路径返回文件列表
      if (path === 'C:\\' || path === 'C:') {
        return [
          { type: 'folder', name: 'Windows', icon: '📁' },
          { type: 'folder', name: 'Program Files', icon: '📁' },
          { type: 'folder', name: 'Documents', icon: '📁' },
          { type: 'file', name: 'boot.ini', icon: '📄' },
          { type: 'file', name: 'system.log', icon: '📄' },
          { type: 'file', name: 'config.ini', icon: '📄' }
        ];
      } else if (path === 'C:\\Windows') {
        return [
          { type: 'folder', name: 'System32', icon: '📁' },
          { type: 'folder', name: 'Fonts', icon: '📁', disabled: true, message: '笨蛋程序员加了一晚上班也没开发完成字体预览，今晚让他通宵，明天再来点点看，明天还不行就明年再来看看吧~' },
          { type: 'folder', name: 'Temp', icon: '📁', disabled: true, message: '笨蛋程序员正在通宵清理临时文件，让他加个班吧，明天再来看看~' },
          { type: 'file', name: 'system.ini', icon: '📄' },
          { type: 'file', name: 'win.ini', icon: '📄' }
        ];
      } else if (path === 'C:\\Windows\\System32') {
        return [
          { type: 'folder', name: 'Drivers', icon: '📁', disabled: true, message: '驱动程序是系统的核心，笨蛋程序员通宵研究了一晚上也不敢动，明天再让他试试吧~' },
          { type: 'file', name: 'cmd.exe', icon: '📄', disabled: true, message: '命令提示符需要笨蛋程序员通宵加班开发黑科技，明天再来看看吧（后天就是2026年了）' },
          { type: 'file', name: 'kernel32.dll', icon: '📄', disabled: true, message: '这是Windows内核！笨蛋程序员通宵研究了一晚上也不敢动，明年再来看看吧~' },
          { type: 'file', name: 'notepad.exe', icon: '📄', disabled: true, message: '笨蛋程序员加了一晚上班也没开发完成记事本，今晚让他通宵，明天再试试，不行就等2026年吧~' },
          { type: 'file', name: 'config.sys', icon: '📄' }
        ];
      } else if (path === 'C:\\Program Files') {
        return [
          { type: 'folder', name: '千禧时光机', icon: '📁' },
          { type: 'folder', name: 'Internet Explorer', icon: '📁', disabled: true, message: '你用的就是这个IE浏览器呀！笨蛋程序员今晚通宵做别的功能呢，别点啦~' },
          { type: 'folder', name: 'Windows Media Player', icon: '📁', disabled: true, message: '笨蛋程序员加了一晚上班也没开发完成WMP，今晚让他通宵，明天再来试试（后天就2026了）' },
          { type: 'folder', name: 'Common Files', icon: '📁', disabled: true, message: '笨蛋程序员正在通宵研究共享文件夹怎么实现，明天再来看看吧~' },
          { type: 'file', name: 'readme.txt', icon: '📄', disabled: true, message: '笨蛋程序员通宵写了一晚上README，但还没写完哈哈，明天再来看看~' }
        ];
      } else if (path === 'C:\\Program Files\\千禧时光机') {
        return [
          { type: 'folder', name: 'data', icon: '📁', disabled: true, message: '游戏数据文件夹，笨蛋程序员今晚通宵保护数据安全，明天再来看看~' },
          { type: 'file', name: 'QCIO.exe', icon: '📄', disabled: true, message: '点桌面QCIO图标就行啦，别让笨蛋程序员再加班了，他都加一晚上了~' },
          { type: 'file', name: '如果当时.exe', icon: '📄', disabled: true, message: '点桌面"如果当时"图标开始人生模拟，让程序员休息会儿吧，他都通宵一晚上了~' },
          { type: 'file', name: '农场游戏.exe', icon: '📄', disabled: true, message: '去QCIO空间玩农场吧，别点这个了，笨蛋程序员今晚通宵做别的功能呢~' },
          { type: 'file', name: 'changelog.txt', icon: '📄' }
        ];
      } else if (path === 'D:\\' || path === 'D:') {
        return [
          { type: 'folder', name: '下载', icon: '📁' },
          { type: 'folder', name: '软件', icon: '📁' },
          { type: 'folder', name: '游戏', icon: '📁' },
          { type: 'folder', name: '资料', icon: '📁' }
        ];
      } else if (path === 'D:\\下载') {
        return [
          { type: 'file', name: '学习资料.rar', icon: '📄', disabled: true, message: '笨蛋程序员加了一晚上班也没开发完成解压功能，今晚让他通宵，明天再来看看（后天就2026了）' },
          { type: 'file', name: '电影合集.zip', icon: '📄', disabled: true, message: '笨蛋程序员通宵解压了一晚上也没成功，可能是文件坏了（其实是他不会）' },
          { type: 'file', name: '图片包.rar', icon: '📄', disabled: true, message: '笨蛋程序员正在通宵研究解压算法，明天再来看看吧，明年也行~' },
          { type: 'file', name: '安装包.exe', icon: '📄', disabled: true, message: '笨蛋程序员加了一晚上班也没安装成功，今晚让他通宵再试试，明天再来看~' },
          { type: 'file', name: '下载的图片.jpg', icon: '🖼️' },
          { type: 'file', name: '音乐.mp3', icon: '🎵', disabled: true, message: '用"十分动听"播放器吧，虽然笨蛋程序员加了一晚上班也没让它真正播放音乐~' },
          { type: 'file', name: '视频.rm', icon: '🎬', disabled: true, message: '笨蛋程序员通宵研究了一晚上RealMedia也没做出来播放器，明天再来看看吧~' },
          { type: 'file', name: '破解补丁.zip', icon: '📄', disabled: true, message: '笨蛋程序员通宵研究了一晚上，这确实是病毒（开玩笑的，就是没做功能）' },
          { type: 'file', name: '未完成下载.dat', icon: '📄', disabled: true, message: '笨蛋程序员通宵下载了一晚上，进度永远卡在99%，明天再来看看吧（后天就是2026年了）' }
        ];
      } else if (path === 'D:\\软件') {
        return [
          { type: 'file', name: '十分动听.exe', icon: '📄', disabled: true, message: '点桌面图标吧，别点这个了，笨蛋程序员都加一晚上班了，让他休息会儿~' },
          { type: 'file', name: '非主流相机.exe', icon: '📄', disabled: true, message: '点桌面"非主流相机"就行，笨蛋程序员今晚通宵做别的功能呢，别让他加班了~' },
          { type: 'file', name: 'QCIO.exe', icon: '📄', disabled: true, message: '点桌面QCIO图标吧，别点这个，让程序员休息会儿，他都通宵一晚上了~' },
          { type: 'file', name: '慢播.exe', icon: '📄', disabled: true, message: '笨蛋程序员加了一晚上班也没开发完成"慢播"，今晚让他通宵，明天再来看看（后天就2026了）' }
        ];
      } else if (path === 'D:\\游戏') {
        return [
          { type: 'file', name: '俄罗斯方块.exe', icon: '📄', disabled: true, message: '笨蛋程序员通宵写了一晚上俄罗斯方块，但全是bug，明天再来看看吧（后天就是2026年了）' },
          { type: 'file', name: '扫雷.exe', icon: '📄', disabled: true, message: '经典扫雷？笨蛋程序员加了一晚上班也没开发完成，去玩"星际探索"吧，明天再来看看~' },
          { type: 'file', name: '扫雷破解版.exe', icon: '📄', disabled: true, message: '破解版？原版都没做出来呢！笨蛋程序员今晚通宵做原版，明天再来看看~' }
        ];
      } else if (path === 'D:\\资料') {
        return [
          { type: 'file', name: '毕业论文.doc', icon: '📄', content: '论非主流文化的兴衰\n\n摘要：\n本文探讨2000年代初期非主流文化在网络时代的兴起与衰落...' },
          { type: 'file', name: '简历.txt', icon: '📄', content: '求职简历\n\n姓名：葬爱·殇\n年龄：18岁\n特长：火星文翻译、QQ空间装扮\n求职意向：网络管理员' },
          { type: 'file', name: '学习笔记.txt', icon: '📄', content: '火星文学习笔记\n\n第一章：基础字符\n莪=我\n妳=你\n嗳=爱\n...' },
          { type: 'file', name: '代码备份.zip', icon: '📄', disabled: true, message: '笨蛋程序员通宵试了一晚上密码，还是没解开，明天再来看看吧（后天就是2026年了）' },
          { type: 'file', name: '电子书合集.chm', icon: '📄', disabled: true, message: '笨蛋程序员加了一晚上班也没开发完成CHM阅读器，今晚让他通宵，明天再来看看~' },
          { type: 'file', name: '网页模板.htm', icon: '📄', disabled: true, message: '笨蛋程序员通宵看了一晚上也没看懂这HTML，明天再来看看吧（后天就2026了）' },
          { type: 'file', name: '设计作品.psd', icon: '📄', disabled: true, message: '笨蛋程序员通宵打工了一晚上想买PS，但还是买不起，明天再来看看吧~' },
          { type: 'file', name: '个人简历.doc', icon: '📄', content: '另一份简历\n\n姓名：轻舞飞扬\n年龄：17岁\n爱好：写诗、画画' }
        ];
      } else if (path === 'USB:\\' || path === 'USB:') {
        return [
          { type: 'folder', name: '学习资料', icon: '📁' },
          { type: 'folder', name: '我的作品', icon: '📁', disabled: true, message: '空的...笨蛋程序员通宵想了一晚上也没想出放什么，明天再来看看吧~' },
          { type: 'file', name: 'README.txt', icon: '📄', disabled: true, message: '笨蛋程序员通宵写了一晚上README，但还是空的，明天再来看看吧（后天就是2026年了）' },
          { type: 'file', name: '快捷方式.lnk', icon: '📄', disabled: true, message: '笨蛋程序员通宵找了一晚上也没找到目标文件，明天再来看看吧~' }
        ];
      } else if (path === 'USB:\\学习资料') {
        return [
          { type: 'file', name: '程序设计入门.pdf', icon: '📄', disabled: true, message: '笨蛋程序员加了一晚上班也没开发完成PDF阅读器，今晚让他通宵，明天再来看看（后天就2026了）' },
          { type: 'file', name: '英语单词.txt', icon: '📄', content: '英语单词本\n\nabandon - 放弃\nability - 能力\n...' },
          { type: 'file', name: '毕业论文.doc', icon: '📄', disabled: true, message: '笨蛋程序员通宵写了一晚上论文，但写的是另一篇，明天再来看看吧~' }
        ];
      }
      return [];
    },

    // 点击文件浏览器项
    onFileItemTap(e) {
      const item = e.currentTarget.dataset.item;

      // 如果是禁用的项
      if (item.disabled) {
        wx.showToast({
          title: item.message || '无法访问',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      // 如果是文件夹
      if (item.type === 'folder') {
        const currentPath = this.data.fileExplorerPath;
        const newPath = currentPath.endsWith('\\') ? currentPath + item.name : currentPath + '\\' + item.name;

        // 更新面包屑
        const breadcrumbs = [...this.data.fileExplorerBreadcrumbs];
        breadcrumbs.push({ label: item.name, path: newPath });

        this.setData({
          fileExplorerPath: newPath,
          fileExplorerBreadcrumbs: breadcrumbs
        });

        this.loadFileExplorerItems(newPath);
      } else if (item.type === 'file') {
        // 如果是文件
        if (item.content) {
          // 有内容的文件，显示内容
          this.showFileContent(item);
        } else {
          wx.showToast({
            title: '无法打开此文件',
            icon: 'none'
          });
        }
      }
    },

    // 点击面包屑导航
    onBreadcrumbTap(e) {
      const index = e.currentTarget.dataset.index;
      const breadcrumb = this.data.fileExplorerBreadcrumbs[index];

      // 截断面包屑到点击位置
      const breadcrumbs = this.data.fileExplorerBreadcrumbs.slice(0, index + 1);

      this.setData({
        fileExplorerPath: breadcrumb.path,
        fileExplorerBreadcrumbs: breadcrumbs
      });

      this.loadFileExplorerItems(breadcrumb.path);
    },

    // 返回上一级
    onGoBack() {
      const breadcrumbs = this.data.fileExplorerBreadcrumbs;
      if (breadcrumbs.length <= 1) return;

      // 移除最后一个面包屑（当前目录）
      const newBreadcrumbs = breadcrumbs.slice(0, -1);
      const parentBreadcrumb = newBreadcrumbs[newBreadcrumbs.length - 1];

      this.setData({
        fileExplorerPath: parentBreadcrumb.path,
        fileExplorerBreadcrumbs: newBreadcrumbs
      });

      this.loadFileExplorerItems(parentBreadcrumb.path);
    },

    // 显示文件内容
    showFileContent(item) {
      wx.showModal({
        title: item.name,
        content: item.content || '文件内容为空',
        showCancel: false,
        confirmText: '关闭'
      });
    },

    // 关闭文件浏览器
    onCloseFileExplorer() {
      this.setData({
        showFileExplorer: false,
        fileExplorerPath: '',
        fileExplorerBreadcrumbs: [],
        fileExplorerItems: []
      });
    },

    // 触发文件浏览器大师彩蛋
    async triggerFileExplorerEgg() {
      try {
        await eggSystem.discover(EGG_IDS.FILE_EXPLORER_MASTER);
      } catch (e) {
        console.error('触发文件浏览器大师彩蛋失败:', e);
      }
    },

    // ==================== 彩蛋发现处理 ====================

    // 处理彩蛋发现
    onEggDiscovered(config) {
      const rarityNames = { common: '普通', rare: '稀有', epic: '史诗', legendary: '传说' };
      const rewardText = config.reward.coins ? `+${config.reward.coins}时光币` : '';

      // 显示 Win98 风格的彩蛋发现弹窗
      this.setData({
        showEggDiscovery: true,
        eggDiscoveryData: {
          name: config.name,
          description: config.description,
          rarity: config.rarity,
          rarityName: rarityNames[config.rarity],
          rewardText
        }
      });
    },

    // 关闭彩蛋发现弹窗
    hideEggDiscovery() {
      this.setData({
        showEggDiscovery: false,
        eggDiscoveryData: null
      });
    },

    // ==================== 基础信息加载 ====================

    // 加载用户基础信息（用于系统信息面板）
    async loadUserInfo() {
      try {
        const res = await userApi.getSystemInfo();
        if (res && res.success) {
          // 更新磁盘容量显示
          const diskUsagePercent = res.diskUsage !== undefined ? res.diskUsage : 99;
          this.setData({
            userInfo: res.userInfo,
            diskUsagePercent,
            diskUsageText: this.getDiskUsageText(diskUsagePercent)
          });
        }
      } catch (err) {
        console.error('加载用户信息失败:', err);
      }
    },

    // 获取磁盘容量文本
    getDiskUsageText(percent) {
      if (percent >= 99) {
        return '99% 已用 - 空间不足!';
      } else if (percent >= 90) {
        return `${percent}% 已用 - 建议清理`;
      } else if (percent >= 75) {
        return `${percent}% 已用`;
      } else {
        return `${percent}% 已用 - 空间充足`;
      }
    },

    // ==================== 帮助弹窗 ====================

    // 显示帮助弹窗
    onShowHelp() {
      this.setData({
        showHelpDialog: true
      });
    },

    // 关闭帮助弹窗
    onCloseHelpDialog() {
      this.setData({
        showHelpDialog: false
      });
    }
  }
});
