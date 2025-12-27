// 慢播 - 2005年风格视频播放器（致敬快播）
Page({
  data: {
    showWarning: false
  },

  onLoad: function () {
    // 页面加载后显示警告
    setTimeout(() => {
      this.setData({ showWarning: true });
    }, 500);
  },

  // 打开文件
  onOpenFile: function () {
    wx.showToast({
      title: '演示版本，不支持文件打开',
      icon: 'none',
      duration: 2000
    });
  },

  // 打开网络地址
  onOpenUrl: function () {
    wx.showToast({
      title: '演示版本，不支持网络播放',
      icon: 'none',
      duration: 2000
    });
  },

  // 隐藏警告
  onHideWarning: function () {
    this.setData({ showWarning: false });
  },

  // 关闭页面
  onClose: function () {
    wx.navigateBack();
  },

  // 阻止事件冒泡
  stopPropagation: function () {}
});
