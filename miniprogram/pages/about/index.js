// miniprogram/pages/about/index.js
Page({
  onAnyKey() {
    // 模拟重启的感觉，先震动一下
    wx.vibrateLong();
    
    // 显示加载提示，模拟重启过程
    wx.showLoading({
      title: '正在重启...',
    });

    // 1.5秒后返回首页
    setTimeout(() => {
      wx.hideLoading();
      wx.navigateBack({
        fail: () => {
          // 如果无法返回（比如直接分享卡片进来的），就重定向到首页
          wx.reLaunch({ url: '/pages/index/index' });
        }
      });
    }, 1500);
  }
});