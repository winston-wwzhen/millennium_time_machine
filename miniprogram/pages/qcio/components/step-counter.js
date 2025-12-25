/**
 * QCIO 空间 - 踩一踩组件
 * 显示访问统计，支持分享邀请好友来踩
 */
Component({
  properties: {
    qcioId: {
      type: String,
      value: ''
    },
    nickname: {
      type: String,
      value: ''
    }
  },

  data: {
    totalVisits: 0,
    todayVisits: 0,
    recentVisitors: []
  },

  lifetimes: {
    attached() {
      this.loadVisitStats();
    }
  },

  pageLifetimes: {
    show() {
      // 每次页面显示时重新加载访问统计
      this.loadVisitStats();
    }
  },

  methods: {
    // 加载访问统计
    async loadVisitStats() {
      try {
        const res = await wx.cloud.callFunction({
          name: 'qcio',
          data: {
            action: 'getVisitStats'
          }
        });

        if (res.result && res.result.success) {
          const stats = res.result.data || {};
          this.setData({
            totalVisits: stats.totalVisits || 0,
            todayVisits: stats.todayVisits || 0,
            recentVisitors: stats.recentVisitors || []
          });
        }
      } catch (err) {
        console.error('Load visit stats error:', err);
      }
    }
  }
});
