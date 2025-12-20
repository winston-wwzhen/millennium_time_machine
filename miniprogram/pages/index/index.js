Page({
  data: {
    
  },

  onLoad() {
    // 可以在这里获取当前时间来更新任务栏的时间
  },

  // 点击火星文转换
  onTapMars() {
    // 简单的震动反馈，增加实体感
    wx.vibrateShort(); 
    wx.navigateTo({ url: '/pages/mars/index' })
  },

  // 点击大头贴
  onTapAvatar() {
    wx.showToast({
      title: '正在加载摄像头...',
      icon: 'none'
    });
    // 后面我们要创建这个页面
    // wx.navigateTo({ url: '/pages/avatar/avatar' })
  },

  // 点击关于
  onTapAbout() {
    wx.showModal({
      title: '关于 电子包浆工坊',
      content: '版本: v1.0\n版权所有 (C) 2005-2025\n\n致敬那个没有美颜滤镜的年代。',
      showCancel: false,
      confirmText: '确定'
    });
  }
});