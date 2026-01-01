// miniprogram/app.js
const { userApi } = require('./utils/api-client');
const { preloadCommonData } = require('./utils/cache-manager');

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
      avatarName: null,
      // 挂机定时器数据
      onlineTimer: null,
      onlineMinutes: 0,
      lastSyncTime: null,
      lastOnlineDate: null,
      // 欢迎弹窗状态
      showWelcomeDialog: false,
      // 初始化完成 Promise
      initPromise: null,
    };

    // 预加载常用数据（异步，不阻塞启动）
    this.preloadData();

    // 初始化用户数据（创建 users 集合记录）
    // 保存 Promise 供页面使用
    this.globalData.initPromise = this.initUserData();

    // 启动在线计时
    this.startOnlineTimer();
  },

  /**
   * 预加载常用数据
   * 提升首屏加载速度
   */
  preloadData: async function() {
    try {
      // 预加载常用数据
      await preloadCommonData();
    } catch (err) {
      console.error('预加载数据失败:', err);
    }
  },

  /**
   * 初始化用户数据
   * 首次登录时创建 users 集合记录，包含双代币系统初始数据
   */
  initUserData: async function() {
    try {
      const result = await userApi.login();

      if (result && result.success) {
        console.log('用户数据初始化成功:', {
          isNew: result.isNew,
          avatarName: result.avatarName,
          coins: result.coins,
          netFee: result.netFee,
          dailyDeducted: result.dailyDeducted
        });

        // 保存用户头像名称到 globalData
        if (result.avatarName) {
          this.globalData.avatarName = result.avatarName;
        }

        // 保存欢迎弹窗状态到 globalData
        if (result.showWelcomeDialog !== undefined) {
          this.globalData.showWelcomeDialog = result.showWelcomeDialog;
        }

        // 如果是新用户，显示欢迎提示
        if (result.isNew) {
          wx.showToast({
            title: `欢迎！你是${result.avatarName}`,
            icon: 'success',
            duration: 2000
          });
        }
      }
    } catch (e) {
      console.error('用户数据初始化失败:', e);
    }
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
   * 显示成长通知
   */
  showGrowthUpNotification: function(result) {
    const { new_level } = result;

    // 判断成长类型并生成对应消息
    let title = '🎉 恭喜成长！';
    let message = `你成长到了 Lv${new_level}！`;

    if ([20, 30, 50].includes(new_level)) {
      title = '🏆 里程碑成就！';
      message = `恭喜达到里程碑成长值 Lv${new_level}！`;
    } else if (new_level >= 13) {
      title = '👑 重大成长！';
      message = `恭喜获得皇冠成长值 Lv${new_level}！`;
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
