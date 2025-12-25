/**
 * 网上邻居 - 网络连接管理页面
 * Win98 风格的网络邻居窗口
 */
Page({
  data: {
    networkConnected: true,
    isConnecting: false,
    connectionProgress: 0,
    dialStatus: '',
    networkName: '千禧拨号网络',
    currentNetwork: '千禧拨号网络'
  },

  onLoad: function() {
    this.loadNetworkStatus();
  },

  onShow: function() {
    this.loadNetworkStatus();
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
        // 默认已连接
        this.setData({
          networkConnected: true,
          currentNetwork: '千禧拨号网络'
        });
      }
    } catch (err) {
      console.error('Load network status error:', err);
      // 默认已连接
      this.setData({
        networkConnected: true,
        currentNetwork: '千禧拨号网络'
      });
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

      // 播放拨号音效（第30%时）
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

  // 返回
  goBack: function() {
    wx.navigateBack();
  }
});
