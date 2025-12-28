// 日记查看器组件
const app = getApp();
const { userApi } = require('../../utils/api-client');

Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    fileName: {
      type: String,
      value: '日记.txt'
    }
  },

  data: {
    logs: []
  },

  lifetimes: {
    attached: function() {
      if (this.properties.show) {
        this.loadLogs();
      }
    }
  },

  observers: {
    'show': function(newVal) {
      if (newVal) {
        this.loadLogs();
      }
    }
  },

  methods: {
    onClose: function() {
      this.triggerEvent('close');
    },

    stopPropagation: function() {
      // 阻止事件冒泡
    },

    loadLogs: function() {
      userApi.getLogs(100).then(result => {
        if (result && result.success) {
          const formattedLogs = this.formatLogs(result.logs);
          this.setData({ logs: formattedLogs });
        }
      }).catch(err => {
        console.error('加载日志失败:', err);
      });
    },

    formatLogs: function(logs) {
      return logs.map(log => {
        const createTime = log.createTime;
        const date = new Date(createTime);

        // 格式化日期：2024年1月15日
        const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

        // 格式化时间：14:30:25
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}:${seconds}`;

        // 操作类型转中文
        const actionMap = {
          'open': '打开了',
          'close': '关闭了',
          'click': '点击了',
          'visit': '访问了'
        };
        const actionText = actionMap[log.action] || log.action;

        return {
          dateStr,
          timeStr,
          actionText,
          target: log.target || '',
          details: log.details || ''
        };
      });
    }
  }
});
