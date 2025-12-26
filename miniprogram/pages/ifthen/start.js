Page({
  data: {
    birthYear: 1990,
    gender: 'male',
    isLoading: false,
    showInstructions: false, // 玩法说明弹窗显示状态

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

  // 增加年份
  increaseYear: function() {
    if (this.data.birthYear >= this.data.maxYear) return;

    this.setData({
      birthYear: this.data.birthYear + 1
    });
  },

  // 减少年份
  decreaseYear: function() {
    if (this.data.birthYear <= this.data.minYear) return;

    this.setData({
      birthYear: this.data.birthYear - 1
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

  // 切换玩法说明弹窗
  toggleInstructions: function() {
    this.setData({
      showInstructions: !this.data.showInstructions
    });
  },

  // 阻止事件冒泡
  stopPropagation: function() {
    // 空函数，用于防止点击内容区域时关闭弹窗
  },

  // 查看历史结局
  viewHistory: function() {
    wx.navigateTo({
      url: '/pages/ifthen/history'
    });
  },

  // 返回首页
  goHome: function() {
    wx.navigateBack();
  }
});
