// 我的电脑组件
const { eggSystem, EGG_IDS } = require("../../utils/egg-system");

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
    showDriveDialog: false,
    driveDialogData: {
      title: '',
      icon: '',
      message: ''
    },
    overlayStyle: ''
  },

  observers: {
    'show': function(newVal) {
      if (newVal) {
        this.addLog('open', '我的电脑');
        // 打开窗口时重置 Konami 序列
        this.resetKonamiSequence();
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

      // 加载彩蛋系统检查是否已达成
      eggSystem.load();
      this.konamiAchieved = eggSystem.isDiscovered(EGG_IDS.KONAMI_CODE);
    }
  },

  methods: {
    // 添加操作日志
    addLog: function(action, target, details) {
      wx.cloud.callFunction({
        name: 'user',
        data: {
          type: 'addLog',
          action: action,
          target: target,
          details: details || ''
        }
      }).catch(err => {
        console.error('添加日志失败:', err);
      });
    },

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

    // 重置 Konami 序列
    resetKonamiSequence: function() {
      this.konamiSequence = [];
      this.waitingForWindowClose = false;
    },

    // 点击驱动器
    onDriveTap: function(e) {
      const drive = e.currentTarget.dataset.drive;

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

      // 显示对话框
      this.showDriveDialogAndReset(drive);
    },

    // 显示驱动器对话框（如果序列不匹配则重置）
    showDriveDialogAndReset: function(drive) {
      let dialogData = {};

      switch(drive) {
        case 'C':
          dialogData = {
            title: '本地磁盘 (C:)',
            icon: '💾',
            message: '错误：磁盘空间不足！\n\n请清理磁盘空间后重试。\n\n已用空间: 99%\n可用空间: 0 MB'
          };
          break;
        case 'D':
          dialogData = {
            title: '光盘驱动器 (D:)',
            icon: '💿',
            message: '驱动器中没有光盘。\n\n请插入光盘后重试。'
          };
          break;
        case 'USB':
          dialogData = {
            title: '可移动磁盘',
            icon: '📱',
            message: '未检测到 USB 设备。\n\n请将设备连接到计算机后重试。'
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
    }
  }
});
