/**
 * 网管系统组件 - Win98 风格的网络连接管理窗口
 */
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    zIndex: {
      type: Number,
      value: 2500
    }
  },

  data: {
    networkConnected: true,
    isConnecting: false,
    connectionProgress: 0,
    dialStatus: '',
    networkName: '千禧拨号网络',
    currentNetwork: '千禧拨号网络',
    overlayStyle: '',

    // 用户信息
    avatarName: '',
    avatar: '👤',

    // 双代币系统
    coins: 0,
    netFee: 0,
    netFeeDays: 0,
    netFeeMinutes: 0,

    // 兑换相关
    showExchangeDialog: false,
    exchangeAmount: 0,
    exchangeOptions: [
      { label: '1天', minutes: 1440, coins: 1000 },
      { label: '3天', minutes: 4320, coins: 3000 },
      { label: '7天', minutes: 10080, coins: 7000 },
      { label: '15天', minutes: 21600, coins: 15000 },
      { label: '30天', minutes: 43200, coins: 30000 }
    ],
    selectedExchangeIndex: -1,

    // 兑换成功对话框
    showSuccessDialog: false,
    successMessage: '',

    // 时光币不足对话框
    showInsufficientDialog: false,
    insufficientMessage: '',

    // 交易记录相关
    showTransactionDialog: false,
    transactionRecords: [],
    transactionLoading: false
  },

  observers: {
    'show': function(newVal) {
      if (newVal) {
        this.addLog('open', '网管系统');
      }
    },
    'zIndex': function(newVal) {
      this.setData({
        overlayStyle: `z-index: ${newVal};`
      });
    }
  },

  lifetimes: {
    attached() {
      this.loadNetworkStatus();
      this.loadBalance();
      this.loadTransactionHistory();
    },
  },

  methods: {
    // 添加操作日志（使用 logger 模块，带随机有趣话语）
    addLog: function(action, target, details) {
      const { addLog: logAction } = require("../../utils/logger");
      logAction(action, target, details);
    },
    // 关闭窗口
    onClose: function() {
      this.triggerEvent('close');
    },

    // 阻止事件冒泡
    stopPropagation: function() {},

    // 加载网络状态
    loadNetworkStatus: function() {
      try {
        const status = wx.getStorageSync('network_status');
        if (status) {
          this.setData({
            networkConnected: status.connected,
            currentNetwork: status.networkName || '千禧拨号网络'
          });
        } else {
          this.setData({
            networkConnected: true,
            currentNetwork: '千禧拨号网络'
          });
        }
      } catch (err) {
        console.error('Load network status error:', err);
        this.setData({
          networkConnected: true,
          currentNetwork: '千禧拨号网络'
        });
      }
    },

    // 加载双代币余额和用户信息
    loadBalance: async function() {
      try {
        const res = await wx.cloud.callFunction({
          name: 'user',
          data: { type: 'getBalance' }
        });

        if (res.result.success) {
          const netFee = res.result.netFee || 0;
          this.setData({
            coins: res.result.coins || 0,
            netFee: netFee,
            netFeeDays: Math.floor(netFee / 1440),
            netFeeMinutes: netFee % 1440,
            avatarName: res.result.avatarName || 'Admin',
            avatar: res.result.avatar || '👤'
          });
        }
      } catch (e) {
        console.error('加载余额失败:', e);
      }
    },

    // 加载交易记录
    loadTransactionHistory: async function() {
      try {
        this.setData({ transactionLoading: true });
        const res = await wx.cloud.callFunction({
          name: 'user',
          data: {
            type: 'getTransactionHistory',
            limit: 50
          }
        });

        if (res.result.success) {
          this.setData({
            transactionRecords: this.formatTransactionRecords(res.result.records || []),
            transactionLoading: false
          });
        } else {
          this.setData({ transactionLoading: false });
        }
      } catch (e) {
        console.error('加载交易记录失败:', e);
        this.setData({ transactionLoading: false });
      }
    },

    // 格式化交易记录
    formatTransactionRecords: function(records) {
      return records.map(record => {
        const date = new Date(record.createTime);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

        let typeLabel = '';
        let typeColor = '';
        switch (record.type) {
          case 'daily_deduct':
            typeLabel = '每日扣费';
            typeColor = '#cc0000';
            break;
          case 'exchange':
            typeLabel = '兑换充值';
            typeColor = '#00aa00';
            break;
          case 'usage':
            typeLabel = '使用扣费';
            typeColor = '#cc6600';
            break;
          default:
            typeLabel = '其他';
            typeColor = '#666';
        }

        return {
          ...record,
          dateStr,
          timeStr,
          typeLabel,
          typeColor,
          amountDisplay: record.amount >= 0 ? `+${record.amount}分钟` : `${record.amount}分钟`
        };
      });
    },

    // 显示交易记录对话框
    showTransactionRecords: function() {
      this.addLog('view', '扣费记录');
      this.setData({ showTransactionDialog: true });
      this.loadTransactionHistory();
    },

    // 隐藏交易记录对话框
    hideTransactionDialog: function() {
      this.setData({ showTransactionDialog: false });
    },

    // 显示兑换对话框
    showExchange: function() {
      this.addLog('view', '网费兑换');
      this.setData({
        showExchangeDialog: true,
        selectedExchangeIndex: -1
      });
    },

    // 隐藏兑换对话框
    hideExchange: function() {
      this.setData({
        showExchangeDialog: false,
        selectedExchangeIndex: -1
      });
    },

    // 隐藏成功对话框
    hideSuccessDialog: function() {
      this.setData({
        showSuccessDialog: false
      });
    },

    // 隐藏时光币不足对话框
    hideInsufficientDialog: function() {
      this.setData({
        showInsufficientDialog: false
      });
    },

    // 选择兑换选项
    selectExchangeOption: function(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({
        selectedExchangeIndex: index
      });
    },

    // 确认兑换
    confirmExchange: async function() {
      const index = this.data.selectedExchangeIndex;
      if (index < 0) {
        wx.showToast({
          title: '请选择兑换套餐',
          icon: 'none'
        });
        return;
      }

      const option = this.data.exchangeOptions[index];

      // 检查时光币是否足够
      if (this.data.coins < option.coins) {
        this.setData({
          showInsufficientDialog: true,
          insufficientMessage: `当前时光币: ${this.data.coins}\n需要: ${option.coins}\n\n通过发现彩蛋可以获得时光币哦！`
        });
        return;
      }

      try {
        wx.showLoading({ title: '兑换中...' });

        const res = await wx.cloud.callFunction({
          name: 'user',
          data: {
            type: 'exchangeNetFee',
            amount: option.minutes
          }
        });

        wx.hideLoading();

        if (res.result.success) {
          const newNetFee = res.result.newNetFee;
          const newDays = Math.floor(newNetFee / 1440);
          const newMinutes = newNetFee % 1440;

          // 记录网费兑换日志
          this.addLog('exchange', '网费兑换', `${option.label} (-${option.coins}时光币)`);

          this.setData({
            coins: res.result.remainingCoins,
            netFee: newNetFee,
            netFeeDays: newDays,
            netFeeMinutes: newMinutes,
            showExchangeDialog: false,
            selectedExchangeIndex: -1,
            showSuccessDialog: true,
            successMessage: `成功兑换 ${option.label} 网费！\n\n当前网费: ${newDays}天${newMinutes}分钟`
          });

          // 刷新交易记录
          this.loadTransactionHistory();
        } else {
          wx.showToast({
            title: res.result.errMsg || '兑换失败',
            icon: 'none'
          });
        }
      } catch (e) {
        wx.hideLoading();
        console.error('兑换失败:', e);
        wx.showToast({
          title: '兑换失败，请重试',
          icon: 'none'
        });
      }
    }
  }
});
