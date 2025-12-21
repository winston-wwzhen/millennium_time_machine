const app = getApp();

Page({
  data: {
    myStatus: null,     // 我的种植状态
    timer: null,
    progress: 0,        // 进度条 0-100
    timeLeftStr: '',    // 剩余时间字符串
    
    // 扫描相关
    scanning: false,
    targetUser: null,   // 扫描到的目标
    showTargetWindow: false,
    
    // 种子选项 (写死在前端方便展示)
    moodOptions: [
      { type: 'sadness', name: '忧伤.exe (1分钟)', icon: '💧' },
      { type: 'lonely', name: '寂寞.bat (30分钟)', icon: '🚬' },
      { type: 'love', name: '初恋.dll (60分钟)', icon: '🍬' }
    ],
    selectedMood: 'sadness',

    // [新增] 背包/资产相关
    showInventory: false,
    inventory: { coins: 0, fragments: {} },
    
    // [新增] 用户信息 (默认为匿名)
    userInfo: { nickName: '神秘黑客', avatarUrl: '' }
  },

  onLoad() {
    // 尝试从全局获取用户信息（如果之前在 login 页面登录过）
    if (app.globalData && app.globalData.userInfo) {
      this.setData({ userInfo: app.globalData.userInfo });
    }
  },

  onShow() {
    this.refreshMyStatus();
  },
  
  onHide() {
    this.stopTimer();
  },

  onUnload() {
    this.stopTimer();
  },

  // 刷新我的状态
  refreshMyStatus() {
    wx.cloud.callFunction({
      name: 'mood_logic',
      data: { action: 'getMyStatus' }
    }).then(res => {
      if (res.result.code === 200) {
        this.setData({ myStatus: res.result.data });
        this.startTimerLogic();
      }
    });
  },

  // 选择心情
  selectMood(e) {
    this.setData({ selectedMood: e.currentTarget.dataset.type });
  },

  // 开始编译 (种)
  startCompile() {
    // 使用当前实际的用户信息
    const { nickName, avatarUrl } = this.data.userInfo;

    wx.showLoading({ title: '初始化...' });
    wx.cloud.callFunction({
      name: 'mood_logic',
      data: { 
        action: 'startCompile', 
        moodType: this.data.selectedMood,
        nickName,
        avatarUrl
      }
    }).then(res => {
      wx.hideLoading();
      this.refreshMyStatus();
    });
  },

  // 收取 (收)
  collect() {
    wx.cloud.callFunction({
      name: 'mood_logic',
      data: { action: 'collect' }
    }).then(res => {
      if (res.result.code === 200) {
        // 这里的交互可以做得更有趣一点
        wx.showModal({
          title: '回收报告',
          content: res.result.msg, // "回收成功！获得 8 个碎片。(部分数据丢失)"
          showCancel: false,
          confirmText: '确认归档'
        });
        this.setData({ myStatus: null, progress: 0, timeLeftStr: '' });
        this.stopTimer();
      } else {
        wx.showToast({ title: res.result.msg, icon: 'none' });
      }
    });
  },

  // 网上邻居 (扫描)
  scanNetwork() {
    this.setData({ scanning: true });
    wx.showLoading({ title: '扫描端口...' });
    
    wx.cloud.callFunction({
      name: 'mood_logic',
      data: { action: 'scanNetwork' }
    }).then(res => {
      wx.hideLoading();
      this.setData({ scanning: false });
      
      if (res.result.code === 200) {
        this.setData({ 
          targetUser: res.result.data,
          showTargetWindow: true
        });
      } else {
        wx.showToast({ title: '附近的端口都已关闭...', icon: 'none' });
      }
    });
  },

  // 复制数据 (偷)
  copyData() {
    if (!this.data.targetUser) return;
    
    wx.cloud.callFunction({
      name: 'mood_logic',
      data: { 
        action: 'copyData',
        targetId: this.data.targetUser._id
      }
    }).then(res => {
      if (res.result.code === 200) {
        wx.showToast({ title: res.result.msg, icon: 'none', duration: 3000 });
        this.closeTargetWindow();
      } else {
        wx.showToast({ title: res.result.msg, icon: 'none' });
      }
    });
  },

  closeTargetWindow() {
    this.setData({ showTargetWindow: false, targetUser: null });
  },

  // [新增] 打开背包 (绑定到菜单栏的"查看")
  openInventory() {
    this.setData({ showInventory: true });
    wx.showLoading({ title: '读取扇区...' });
    
    wx.cloud.callFunction({
      name: 'mood_logic',
      data: { action: 'getMyInventory' }
    }).then(res => {
      wx.hideLoading();
      if (res.result.code === 200) {
        this.setData({ inventory: res.result.data });
      }
    });
  },

  // [新增] 关闭背包
  closeInventory() {
    this.setData({ showInventory: false });
  },

  // 倒计时逻辑
  startTimerLogic() {
    this.stopTimer();
    const status = this.data.myStatus;
    if (!status || status.status !== 'compiling') return;

    // 立即执行一次更新，避免 1s 延迟
    this.updateProgress(status);

    this.timer = setInterval(() => {
      this.updateProgress(status);
    }, 1000);
  },

  updateProgress(status) {
    const now = Date.now();
    const total = status.endTime - status.startTime;
    const pass = now - status.startTime;
    
    let percent = Math.floor((pass / total) * 100);
    if (percent > 100) percent = 100;
    
    let left = Math.ceil((status.endTime - now) / 1000);
    if (left < 0) left = 0;

    const min = Math.floor(left / 60).toString().padStart(2, '0');
    const sec = (left % 60).toString().padStart(2, '0');

    this.setData({
      progress: percent,
      timeLeftStr: `${min}:${sec}`
    });

    if (percent >= 100) this.stopTimer();
  },

  stopTimer() {
    if (this.timer) clearInterval(this.timer);
  }
});