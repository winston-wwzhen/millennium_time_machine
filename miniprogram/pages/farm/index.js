// pages/farm/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusText: 'Online [128kbps]'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack();
  },

  /**
   * 接收农场组件的状态变化事件
   */
  onStatusChange(e) {
    const text = e.detail.text || 'Online [128kbps]';
    this.setData({
      statusText: text
    });
  }
});
