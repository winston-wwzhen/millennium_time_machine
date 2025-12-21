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
    selectedMood: 'sadness'
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
    // 获取用户信息用于展示（这里为了过审简化，实际可先getUserProfile）
    const nickName = '神秘黑客'; 
    const avatarUrl = '';

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
        wx.showToast({ title: '内存回收成功', icon: 'success' });
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
        wx.showToast({ title: '数据抓取成功!', icon: 'success' });
        this.closeTargetWindow();
      } else {
        wx.showToast({ title: res.result.msg, icon: 'none' });
      }
    });
  },

  closeTargetWindow() {
    this.setData({ showTargetWindow: false, targetUser: null });
  },

  // 倒计时逻辑
  startTimerLogic() {
    this.stopTimer();
    const status = this.data.myStatus;
    if (!status || status.status !== 'compiling') return;

    this.timer = setInterval(() => {
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

      if (percent === 100) this.stopTimer();
    }, 1000);
  },

  stopTimer() {
    if (this.timer) clearInterval(this.timer);
  }
});