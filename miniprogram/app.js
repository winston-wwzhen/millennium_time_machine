// miniprogram/app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        traceUser: true,
      });
    }

    this.globalData = {
      userInfo: null,
      // 挂机定时器数据
      onlineTimer: null,
      onlineMinutes: 0,
      lastSyncTime: null,
      lastOnlineDate: null,
    };

    // 启动在线计时
    this.startOnlineTimer();
  },

  onShow: function() {
    // 小程序显示时恢复计时
    this.startOnlineTimer();
  },

  onHide: function() {
    // 小程序隐藏时停止计时
    this.stopOnlineTimer();
  },

  /**
   * 启动在线定时器
   */
  startOnlineTimer: function() {
    if (this.globalData.onlineTimer) {
      clearInterval(this.globalData.onlineTimer);
    }

    // 从本地存储恢复在线时长
    const lastOnlineDate = wx.getStorageSync('last_online_date');
    const today = new Date().toDateString();

    // 检查是否是新的一天
    if (lastOnlineDate && lastOnlineDate !== today) {
      // 新的一天，重置在线时长
      this.globalData.onlineMinutes = 0;
      this.globalData.lastOnlineDate = today;
      wx.setStorageSync('last_online_date', today);
      wx.setStorageSync('online_minutes', 0);
    } else {
      // 同一天，恢复在线时长
      this.globalData.onlineMinutes = wx.getStorageSync('online_minutes') || 0;
      this.globalData.lastOnlineDate = today;
    }

    const lastSyncTime = wx.getStorageSync('last_sync_time') || Date.now();
    this.globalData.lastSyncTime = lastSyncTime;

    // 启动定时器，每分钟记录一次
    const timer = setInterval(() => {
      const newMinutes = this.globalData.onlineMinutes + 1;
      this.globalData.onlineMinutes = newMinutes;

      // 保存到本地存储
      wx.setStorageSync('online_minutes', newMinutes);
      wx.setStorageSync('last_sync_time', Date.now());

      // 每10分钟同步一次到服务器
      if (newMinutes % 10 === 0) {
        this.syncOnlineTime(newMinutes);
      }
    }, 60000); // 60秒 = 1分钟

    this.globalData.onlineTimer = timer;
  },

  /**
   * 停止在线定时器
   */
  stopOnlineTimer: function() {
    if (this.globalData.onlineTimer) {
      clearInterval(this.globalData.onlineTimer);
      this.globalData.onlineTimer = null;
    }
  },

  /**
   * 同步在线时长到服务器
   */
  syncOnlineTime: function(minutes) {
    // 获取当前登录的 QCIO ID
    const qcioId = wx.getStorageSync('current_qcio_id');
    if (!qcioId) {
      console.log('No QCIO ID found, skipping online time sync');
      return;
    }

    wx.cloud.callFunction({
      name: 'level',
      data: {
        action: 'syncOnlineTime',
        qcio_id: qcioId,
        data: { minutes }
      }
    }).then(res => {
      if (res.result && res.result.success) {
        // 同步成功，显示获得经验提示
        if (res.result.experience > 0) {
          wx.showToast({
            title: `+${res.result.experience}经验`,
            icon: 'none',
            duration: 1500
          });
        }

        // 检查是否升级
        if (res.result.level_up) {
          this.showLevelUpNotification(res.result);
        }

        // 检查是否是新的一天
        if (res.result.is_new_day) {
          this.globalData.onlineMinutes = 0;
          wx.setStorageSync('online_minutes', 0);
        }
      } else {
        // 达到上限或其他原因
        if (res.result && res.result.message && res.result.message.includes('上限')) {
          console.log('Online time daily limit reached:', res.result.message);
        }
      }
    }).catch(err => {
      console.error('Sync online time error:', err);
    });
  },

  /**
   * 显示升级通知
   */
  showLevelUpNotification: function(result) {
    const { new_level } = result;

    // 判断升级类型并生成对应消息
    let title = '🎉 恭喜升级！';
    let message = `你升级到了 Lv${new_level}！`;

    if ([20, 30, 50].includes(new_level)) {
      title = '🏆 里程碑成就！';
      message = `恭喜达到里程碑等级 Lv${new_level}！`;
    } else if (new_level >= 13) {
      title = '👑 重大升级！';
      message = `恭喜获得皇冠等级 Lv${new_level}！`;
    }

    // 使用本地通知或页面弹窗
    wx.showModal({
      title: title,
      content: message,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  /**
   * 获取当前在线时长（分钟）
   */
  getOnlineMinutes: function() {
    return this.globalData.onlineMinutes || 0;
  },

  /**
   * 设置当前 QCIO ID（用于挂机经验同步）
   */
  setCurrentQcioId: function(qcioId) {
    wx.setStorageSync('current_qcio_id', qcioId);
  }
});
