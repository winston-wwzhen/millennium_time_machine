const { addLog } = require("../../utils/logger");

Page({
  data: {
    birthYear: 1990,
    gender: 'male',
    isLoading: false,
    showInstructions: false, // 玩法说明弹窗显示状态
    avatarName: 'Admin', // 用户昵称

    // 可选的出生年份范围
    minYear: 1940,
    maxYear: 2005,

    // 年份滑块配置
    yearStep: 1,
  },

  onLoad: function(options) {
    // 加载用户昵称
    this.loadUserName();

    // 加载用户上次选择的参数
    this.loadUserPreferences();

    // 记录打开游戏日志
    addLog('open', '如果当时');

    // 追踪分享链接访问
    if (options.shareId || options.endingId) {
      wx.cloud.callFunction({
        name: 'ifthen',
        data: {
          action: 'recordShareVisit',
          shareId: options.shareId || '',
          endingId: options.endingId || ''
        }
      }).then(res => {
        console.log('分享访问记录成功');
      }).catch(err => {
        console.error('记录分享访问失败:', err);
      });
    }
  },

  // 加载用户上次选择的参数
  loadUserPreferences: function() {
    wx.cloud.callFunction({
      name: 'user',
      data: {
        type: 'getIfthenPreferences'
      }
    }).then(res => {
      if (res.result && res.result.success && res.result.preferences) {
        const { birthYear, gender } = res.result.preferences;
        this.setData({
          birthYear: birthYear || 1990,
          gender: gender || 'male'
        });
      }
    }).catch(err => {
      console.error('加载用户偏好失败:', err);
      // 保持默认值
      this.setData({
        birthYear: 1990,
        gender: 'male'
      });
    });
  },

  // 保存用户选择的参数
  saveUserPreferences: function() {
    wx.cloud.callFunction({
      name: 'user',
      data: {
        type: 'setIfthenPreferences',
        birthYear: this.data.birthYear,
        gender: this.data.gender
      }
    }).then(res => {
      console.log('用户偏好保存成功');
    }).catch(err => {
      console.error('保存用户偏好失败:', err);
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

    // 保存用户选择
    this.saveUserPreferences();

    // 记录开始游戏日志
    addLog('game', '如果当时', `回到 ${this.data.birthYear} 年，那年我 ${ageIn2005} 岁`);

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
    addLog('view', '如果当时', '查看过去的结局');
    wx.navigateTo({
      url: '/pages/ifthen/history'
    });
  },

  // 加载用户昵称
  loadUserName: function() {
    try {
      wx.cloud.callFunction({
        name: 'user',
        data: { type: 'getBalance' }
      }).then(res => {
        if (res.result && res.result.success) {
          this.setData({
            avatarName: res.result.avatarName || 'Admin'
          });
        }
      }).catch(err => {
        console.error('加载用户昵称失败:', err);
      });
    } catch (e) {
      console.error('加载用户昵称异常:', e);
    }
  },

  // 返回首页
  goHome: function() {
    wx.navigateBack();
  }
});
