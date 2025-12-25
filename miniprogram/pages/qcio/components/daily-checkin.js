/**
 * QCIO 每日签到组件
 * 实现签到功能、连续签到奖励（云端存储）
 */
const { preventDuplicateBehavior } = require('../../../utils/prevent-duplicate');

Component({
  behaviors: [preventDuplicateBehavior],

  properties: {
    qcioId: {
      type: String,
      value: ''
    }
  },

  data: {
    checkInData: {
      consecutiveDays: 0,
      totalDays: 0
    },
    canCheckIn: true,
    todayChecked: false,
    isLoading: false,
    isCheckingIn: false
  },

  lifetimes: {
    attached() {
      this.loadCheckInData();
    }
  },

  methods: {
    // 加载签到数据（从云端）
    loadCheckInData() {
      this.setData({ isLoading: true });

      wx.cloud.callFunction({
        name: 'qcio',
        data: { action: 'getDailyTasks' }
      }).then(res => {
        if (res.result && res.result.success) {
          const tasks = res.result.data;
          this.setData({
            checkInData: {
              consecutiveDays: tasks.checkinStreak || 0,
              totalDays: tasks.totalCheckinDays || 0
            },
            todayChecked: tasks.hasCheckedIn || false,
            canCheckIn: !tasks.hasCheckedIn
          });
        }
      }).catch(err => {
        console.error('Load Check-in Data Error:', err);
        wx.showToast({ title: '加载签到数据失败', icon: 'none' });
      }).finally(() => {
        this.setData({ isLoading: false });
      });
    },

    // 执行签到（云端）
    checkIn() {
      // 使用防重复点击包装
      this._runWithLock('checkIn', () => {
        if (!this.data.canCheckIn || this.data.isCheckingIn) return;

        this.setData({ isCheckingIn: true });
        wx.showLoading({ title: '签到中...', mask: true });

        return wx.cloud.callFunction({
          name: 'qcio',
          data: { action: 'dailyCheckin' }
        }).then(res => {
          if (res.result && res.result.success) {
            const data = res.result.data;

            this.setData({
              checkInData: {
                consecutiveDays: data.streak || 0,
                totalDays: data.totalDays || 0
              },
              todayChecked: true,
              canCheckIn: false
            });

            // 显示奖励
            const reward = data.reward || { coins: 10, qpoints: 0 };
            let rewardText = `获得 ${reward.coins} 金币`;
            if (reward.qpoints > 0) {
              rewardText += `、${reward.qpoints} Q点`;
            }

            // 先触发事件刷新钱包，传递新余额
            this.triggerEvent('checkin', {
              reward: reward,
              days: data.streak,
              newCoinsBalance: data.newCoinsBalance,
              newQpointsBalance: data.newQpointsBalance
            });

            // 延迟显示弹窗，确保事件先传播
            setTimeout(() => {
              wx.showModal({
                title: '签到成功！',
                content: `连续签到 ${data.streak} 天，${rewardText}！`,
                showCancel: false,
                confirmText: '太棒了'
              });
            }, 100);
          } else {
            throw new Error(res.result ? res.result.message : '签到失败');
          }
        }).catch(err => {
          console.error('Check-in Error:', err);
          wx.showToast({
            title: err.message || '签到失败',
            icon: 'none'
          });
        }).finally(() => {
          this.setData({ isCheckingIn: false });
          wx.hideLoading();
        });
      }, 2000); // 2秒防重复点击
    },

    // 获取签到状态文本
    getStatusText() {
      const { consecutiveDays } = this.data.checkInData;
      if (consecutiveDays === 0) return '开始签到领取奖励';
      if (consecutiveDays < 7) return `已连续签到 ${consecutiveDays} 天`;
      if (consecutiveDays < 30) return `坚持签到 ${consecutiveDays} 天`;
      return `忠实粉丝 ${consecutiveDays} 天`;
    }
  }
});
