Page({
  data: {
    currentTime: '00:00', // 任务栏时间
    isStartMenuOpen: false // 开始菜单开关状态
  },

  onLoad() {
    // 初始化时间
    this.updateTime();
    // 启动定时器，每10秒更新一次时间，确保任务栏时间准确
    this.timer = setInterval(() => {
      this.updateTime();
    }, 10000);
  },

  onUnload() {
    // 页面卸载时清除定时器，防止内存泄漏
    if (this.timer) {
      clearInterval(this.timer);
    }
  },

  // 更新任务栏时间逻辑
  updateTime() {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    this.setData({
      currentTime: `${hour}:${minute}`
    });
  },

  // 切换开始菜单显示/隐藏
  toggleStartMenu() {
    this.setData({
      isStartMenuOpen: !this.data.isStartMenuOpen
    });
    // 可以在这里加入点击音效
  },

  // 处理开始菜单项点击
  onMenuClick(e) {
    const action = e.currentTarget.dataset.action;
    // 点击任意菜单项后，关闭菜单
    this.setData({ isStartMenuOpen: false });

    switch(action) {
      case 'shutdown':
        wx.showModal({
          title: '正在关机...',
          content: '现在您可以安全地关闭微信了。',
          showCancel: false,
          confirmText: '重启' // 只是个玩笑，实际还是留在小程序
        });
        break;
      case 'run':
        // 模拟 "运行" 对话框
        wx.showToast({ title: 'C:\\> System32', icon: 'none' });
        break;
      // 可以在这里扩展更多菜单功能
    }
  },

  // 点击火星文转换
  onTapMars() {
    // 简单的震动反馈，增加实体感
    wx.vibrateShort(); 
    wx.navigateTo({ url: '/pages/mars/index' })
  },

  // 点击大头贴 (已更新为跳转到真实页面)
  onTapAvatar() {
    wx.vibrateShort();
    wx.navigateTo({ url: '/pages/avatar/index' })
  },

  // 点击关于
  onTapAbout() {
    // 如果是从开始菜单点击关于，也需要关闭菜单
    if (this.data.isStartMenuOpen) {
      this.setData({ isStartMenuOpen: false });
    }
    
    wx.showModal({
      title: '关于 电子包浆工坊',
      content: '版本: v1.0\n版权所有 (C) 2005-2025\n\n致敬那个没有美颜滤镜的年代。',
      showCancel: false,
      confirmText: '确定'
    });
  }
});