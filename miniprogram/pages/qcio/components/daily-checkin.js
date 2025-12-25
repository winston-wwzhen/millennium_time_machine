/**
 * QCIO 每日签到组件
 * 实现签到功能、连续签到奖励
 */
Component({
  properties: {
    qcioId: {
      type: String,
      value: ''
    }
  },

  data: {
    checkInData: {
      lastCheckInDate: null,
      consecutiveDays: 0,
      totalDays: 0,
      rewards: []
    },
    canCheckIn: true,
    todayChecked: false
  },

  lifetimes: {
    attached() {
      this.loadCheckInData();
    }
  },

  methods: {
    // 加载签到数据
    loadCheckInData() {
      const today = this.getTodayDate();
      const savedData = wx.getStorageSync('qcio_checkin_data');

      if (savedData) {
        const lastDate = savedData.lastCheckInDate;
        const todayChecked = lastDate === today;

        this.setData({
          checkInData: savedData,
          todayChecked,
          canCheckIn: !todayChecked
        });
      }
    },

    // 获取今天的日期字符串
    getTodayDate() {
      const now = new Date();
      return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    },

    // 执行签到
    checkIn() {
      if (!this.data.canCheckIn) return;

      const today = this.getTodayDate();
      const { checkInData } = this.data;

      // 计算连续天数
      const lastDate = checkInData.lastCheckInDate;
      let consecutiveDays = checkInData.consecutiveDays || 0;

      if (this.isYesterday(lastDate)) {
        consecutiveDays += 1;
      } else if (lastDate !== today) {
        consecutiveDays = 1;
      }

      // 计算奖励
      const reward = this.calculateReward(consecutiveDays);

      const newData = {
        lastCheckInDate: today,
        consecutiveDays,
        totalDays: (checkInData.totalDays || 0) + 1,
        rewards: [...(checkInData.rewards || []), {
          date: today,
          reward: reward,
          days: consecutiveDays
        }]
      };

      wx.setStorageSync('qcio_checkin_data', newData);

      this.setData({
        checkInData: newData,
        todayChecked: true,
        canCheckIn: false
      });

      // 显示奖励
      wx.showModal({
        title: '签到成功！',
        content: `连续签到 ${consecutiveDays} 天，获得 ${reward} 金币！`,
        showCancel: false,
        confirmText: '太棒了'
      });

      // 触发签到事件
      this.triggerEvent('checkin', { reward, days: consecutiveDays });
    },

    // 判断是否是昨天
    isYesterday(dateStr) {
      if (!dateStr) return false;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

      return dateStr === yesterdayStr;
    },

    // 计算签到奖励
    calculateReward(days) {
      // 基础奖励：10 金币
      let reward = 10;

      // 连续签到额外奖励
      if (days >= 7) reward += 20;
      else if (days >= 5) reward += 15;
      else if (days >= 3) reward += 10;
      else if (days >= 2) reward += 5;

      // 特殊日额外奖励
      if (days % 7 === 0) reward += 50;  // 每周额外奖励
      if (days % 30 === 0) reward += 200; // 每月额外奖励

      return reward;
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
