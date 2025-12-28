/**
 * QCIO 空间 - 踩一踩组件
 * 显示访问统计，支持分享邀请好友来踩
 */
const { qcioApi } = require('../../../utils/api-client');

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
    // 加载访问统计（使用 API 客户端）
    async loadVisitStats() {
      try {
        const result = await qcioApi.getVisitStats();

        if (result && result.success) {
          const stats = result.data || {};
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
