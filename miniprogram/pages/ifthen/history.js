// 导入结局数据
const endingsData = require('../../data/ifthen-endings.js');

Page({
  data: {
    // 统计数据
    stats: {
      totalEndings: 0,
      totalPlays: 0,
      unlockRate: 0,
      typeStats: {
        special: 0,
        good: 0,
        normal: 0,
        bad: 0
      }
    },

    // 历史记录
    historyList: [],
    page: 1,
    limit: 20,
    hasMore: true,
    loading: false,

    // 所有结局列表（用于展示收集进度）
    allEndings: [],
    unlockedEndings: new Set()
  },

  onLoad: function() {
    // 加载统计数据
    this.loadStats();

    // 加载历史记录
    this.loadHistory();

    // 初始化所有结局列表
    this.setData({
      allEndings: endingsData
    });
  },

  // 加载统计数据
  loadStats: function() {
    wx.cloud.callFunction({
      name: 'ifthen',
      data: {
        action: 'getEndingStats'
      }
    }).then(res => {
      if (res.result.success) {
        this.setData({
          stats: res.result.stats
        });

        // 构建已获得结局集合
        this.loadUnlockedEndings();
      }
    }).catch(err => {
      console.error('加载统计数据失败:', err);
    });
  },

  // 加载已获得的结局列表
  loadUnlockedEndings: function() {
    wx.cloud.callFunction({
      name: 'ifthen',
      data: {
        action: 'getEndingHistory',
        limit: 1000,
        page: 1
      }
    }).then(res => {
      if (res.result.success) {
        const unlockedSet = new Set();
        res.result.list.forEach(record => {
          unlockedSet.add(record.endingId);
        });

        this.setData({
          unlockedEndings: unlockedSet
        });
      }
    }).catch(err => {
      console.error('加载已获得结局失败:', err);
    });
  },

  // 加载历史记录
  loadHistory: function() {
    if (this.data.loading || !this.data.hasMore) {
      return;
    }

    this.setData({
      loading: true
    });

    wx.cloud.callFunction({
      name: 'ifthen',
      data: {
        action: 'getEndingHistory',
        limit: this.data.limit,
        page: this.data.page
      }
    }).then(res => {
      if (res.result.success) {
        const newList = res.result.list.map(record => {
          // 从结局数据中查找详细信息
          const ending = endingsData.find(e => e.id === record.endingId);
          return {
            ...record,
            endingInfo: ending || null
          };
        });

        this.setData({
          historyList: [...this.data.historyList, ...newList],
          page: this.data.page + 1,
          hasMore: newList.length >= this.data.limit,
          loading: false
        });
      }
    }).catch(err => {
      console.error('加载历史记录失败:', err);
      this.setData({
        loading: false
      });
    });
  },

  // 滚动到底部加载更多
  onReachBottom: function() {
    this.loadHistory();
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.setData({
      historyList: [],
      page: 1,
      hasMore: true
    });

    this.loadStats();
    this.loadHistory();

    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  // 查看结局详情
  viewEndingDetail: function(e) {
    const endingId = e.currentTarget.dataset.endingId;
    const ending = endingsData.find(e => e.id === endingId);

    if (ending) {
      wx.showModal({
        title: ending.title,
        content: ending.description,
        showCancel: false
      });
    }
  },

  // 开始新游戏
  startNewGame: function() {
    wx.redirectTo({
      url: '/pages/ifthen/start'
    });
  },

  // 前往图鉴收集页面
  goToCollection: function() {
    wx.showToast({
      title: '图鉴功能开发中',
      icon: 'none'
    });
    // TODO: 创建图鉴页面
  },

  // 分享结局
  onShareAppMessage: function(e) {
    const { stats } = this.data;

    return {
      title: `我在千禧时光机已解锁${stats.totalEndings}个结局，完成度${stats.unlockRate}%！`,
      path: '/pages/ifthen/start',
      imageUrl: ''
    };
  }
});
