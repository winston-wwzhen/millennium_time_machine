// pages/recycle-bin/index.js
Page({
  data: {
    hasTrash: false  // 暂时设为空，可以后续添加功能
  },

  onLoad: function(options) {
  },

  goBack: function() {
    wx.navigateBack();
  }
});
