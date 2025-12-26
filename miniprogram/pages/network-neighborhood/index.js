/**
 * 网管系统 - 网络连接管理页面
 * Win98 风格的网管系统窗口
 *
 * 功能：
 * - 拨号连接管理
 * - 双代币显示（时光币、网费）
 * - 时光币兑换网费
 */
Page({
  data: {
    networkConnected: true,
    isConnecting: false,
    connectionProgress: 0,
    dialStatus: '',
    networkName: '千禧拨号网络',
    currentNetwork: '千禧拨号网络',

    // 双代币系统
    coins: 0,           // 时光币
    netFee: 0,          // 网费（分钟）
    netFeeDays: 0,      // 网费天数
    netFeeMinutes: 0,   // 网费剩余分钟

    // 兑换相关
    showExchangeDialog: false,
    exchangeAmount: 0,
    exchangeOptions: [
      { label: '1天', minutes: 1440, coins: 1000 },
      { label: '3天', minutes: 4320, coins: 3000 },
      { label: '7天', minutes: 10080, coins: 7000 },
      { label: '15天', minutes: 21600, coins: 15000 },
      { label: '30天', minutes: 43200, coins: 30000 }
    ],
    selectedExchangeIndex: -1
  },

  onLoad: function() {
    this.loadNetworkStatus();
    this.loadBalance();
  },

  onShow: function() {
    this.loadNetworkStatus();
    this.loadBalance();
  },

  // 加载网络状态
  loadNetworkStatus: function() {
    try {
      const status = wx.getStorageSync('network_status');
      if (status) {
        this.setData({
          networkConnected: status.connected,
          currentNetwork: status.networkName || '千禧拨号网络'
        });
      } else {
        this.setData({
          networkConnected: true,
          currentNetwork: '千禧拨号网络'
        });
      }
    } catch (err) {
      console.error('Load network status error:', err);
      this.setData({
        networkConnected: true,
        currentNetwork: '千禧拨号网络'
      });
    }
  },

  // 加载双代币余额
  loadBalance: async function() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'user',
        data: { type: 'getBalance' }
      });

      if (res.result.success) {
        const netFee = res.result.netFee || 0;
        this.setData({
          coins: res.result.coins || 0,
          netFee: netFee,
          netFeeDays: Math.floor(netFee / 1440),
          netFeeMinutes: netFee % 1440
        });
      }
    } catch (e) {
      console.error('加载余额失败:', e);
    }
  },

  // 拨号连接
  dialConnection: function() {
    if (this.data.networkConnected || this.data.isConnecting) {
      return;
    }

    this.setData({
      isConnecting: true,
      connectionProgress: 0,
      dialStatus: '正在初始化调制解调器...'
    });

    this.simulateDialProcess();
  },

  // 模拟拨号过程（怀旧感）
  simulateDialProcess: function() {
    const steps = [
      { progress: 10, status: '正在检测调制解调器...', delay: 300 },
      { progress: 20, status: '调制解调器就绪', delay: 400 },
      { progress: 30, status: '正在拨号...', delay: 500 },
      { progress: 40, status: '听到拨号音...', delay: 600 },
      { progress: 50, status: '正在连接远程服务器...', delay: 800 },
      { progress: 60, status: '正在验证用户名和密码...', delay: 700 },
      { progress: 70, status: '正在登录网络...', delay: 600 },
      { progress: 80, status: '正在注册您的计算机...', delay: 500 },
      { progress: 90, status: '连接成功！正在完成设置...', delay: 400 },
      { progress: 100, status: '连接成功！', delay: 300 }
    ];

    let currentStep = 0;

    const nextStep = () => {
      if (currentStep >= steps.length) {
        this.onConnectionSuccess();
        return;
      }

      const step = steps[currentStep];
      this.setData({
        connectionProgress: step.progress,
        dialStatus: step.status
      });

      if (step.progress === 30) {
        wx.vibrateShort({ type: 'light' });
      }

      currentStep++;
      setTimeout(nextStep, step.delay);
    };

    nextStep();
  },

  // 连接成功
  onConnectionSuccess: function() {
    this.setData({
      networkConnected: true,
      isConnecting: false,
      currentNetwork: this.data.networkName
    });

    this.saveNetworkStatus(true);
    wx.vibrateShort();
    wx.showToast({
      title: '网络已连接',
      icon: 'success',
      duration: 1500
    });
  },

  // 保存网络状态
  saveNetworkStatus: function(connected) {
    try {
      wx.setStorageSync('network_status', {
        connected: connected,
        status: connected ? 'online' : 'offline',
        networkName: this.data.networkName,
        timestamp: Date.now()
      });
    } catch (err) {
      console.error('Save network status error:', err);
    }
  },

  // 显示兑换对话框
  showExchange: function() {
    this.setData({
      showExchangeDialog: true,
      selectedExchangeIndex: -1
    });
  },

  // 隐藏兑换对话框
  hideExchange: function() {
    this.setData({
      showExchangeDialog: false,
      selectedExchangeIndex: -1
    });
  },

  // 选择兑换选项
  selectExchangeOption: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedExchangeIndex: index
    });
  },

  // 确认兑换
  confirmExchange: async function() {
    const index = this.data.selectedExchangeIndex;
    if (index < 0) {
      wx.showToast({
        title: '请选择兑换套餐',
        icon: 'none'
      });
      return;
    }

    const option = this.data.exchangeOptions[index];

    // 检查时光币是否足够
    if (this.data.coins < option.coins) {
      wx.showModal({
        title: '时光币不足',
        content: `当前时光币: ${this.data.coins}\n需要: ${option.coins}\n\n通过发现彩蛋可以获得时光币哦！`,
        showCancel: false,
        confirmText: '去发现彩蛋'
      });
      return;
    }

    try {
      wx.showLoading({ title: '兑换中...' });

      const res = await wx.cloud.callFunction({
        name: 'user',
        data: {
          type: 'exchangeNetFee',
          amount: option.minutes
        }
      });

      wx.hideLoading();

      if (res.result.success) {
        const newNetFee = res.result.newNetFee;
        this.setData({
          coins: res.result.remainingCoins,
          netFee: newNetFee,
          netFeeDays: Math.floor(newNetFee / 1440),
          netFeeMinutes: newNetFee % 1440,
          showExchangeDialog: false,
          selectedExchangeIndex: -1
        });

        wx.showModal({
          title: '🎉 兑换成功',
          content: `成功兑换 ${option.label} 网费！\n\n当前网费: ${this.data.netFeeDays}天${this.data.netFeeMinutes}分钟`,
          showCancel: false,
          confirmText: '太棒了'
        });
      } else {
        wx.showToast({
          title: res.result.errMsg || '兑换失败',
          icon: 'none'
        });
      }
    } catch (e) {
      wx.hideLoading();
      console.error('兑换失败:', e);
      wx.showToast({
        title: '兑换失败，请重试',
        icon: 'none'
      });
    }
  },

  // 返回
  goBack: function() {
    wx.navigateBack();
  }
});
