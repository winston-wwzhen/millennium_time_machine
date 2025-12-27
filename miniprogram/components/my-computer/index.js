// 我的电脑组件
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
      }
    },
    'zIndex': function(newVal) {
      this.setData({
        overlayStyle: `z-index: ${newVal};`
      });
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
      this.triggerEvent('close');
    },

    // 阻止事件冒泡
    stopPropagation: function() {
      // 空函数，仅用于阻止事件冒泡
    },

    // 点击驱动器
    onDriveTap: function(e) {
      const drive = e.currentTarget.dataset.drive;
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
