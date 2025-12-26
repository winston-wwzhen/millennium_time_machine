Page({
  data: {
    birthYear: 1990,
    gender: 'male',
    isLoading: false,

    // 可选的出生年份范围
    minYear: 1940,
    maxYear: 2005,

    // 年份滑块配置
    yearStep: 1,
  },

  onLoad: function(options) {
    // 设置默认年份为1990年（千禧一代的代表）
    this.setData({
      birthYear: 1990
    });
  },

  // 年份滑块变化
  onYearChange: function(e) {
    this.setData({
      birthYear: parseInt(e.detail.value)
    });
  },

  // 选择性别
  selectGender: function(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({ gender });
  },

  // 开始游戏
  startGame: function() {
    if (this.data.isLoading) return;

    const ageIn2005 = 2005 - this.data.birthYear;

    // 验证年龄
    if (ageIn2005 < 0) {
      wx.showToast({
        title: '出生年份不能晚于2005年',
        icon: 'none'
      });
      return;
    }

    this.setData({ isLoading: true });

    // 跳转到时间线页面，传递参数
    wx.navigateTo({
      url: `/pages/ifthen/timeline?birthYear=${this.data.birthYear}&gender=${this.data.gender}`
    });
  },

  // 查看说明
  showInstructions: function() {
    wx.showModal({
      title: '游戏说明',
      content: '穿越回2005年，经历20年间的重大历史事件，通过选择走向不同的人生结局。每次选择都会影响你的人物属性，最终决定你的人生走向。',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 返回首页
  goHome: function() {
    wx.navigateBack();
  }
});
