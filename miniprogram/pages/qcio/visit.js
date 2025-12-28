/**
 * QCIO 访问他人空间页面
 * 允许访客查看被访问者的留言板和访问统计
 * 支持踩一脚功能
 */
const { preventDuplicateBehavior } = require('../../utils/prevent-duplicate');
const { addVisitSpaceExperience } = require('../../utils/experience');
const { qcioApi } = require('../../utils/api-client');

Page({
  behaviors: [preventDuplicateBehavior],

  data: {
    ownerQcioId: '',          // 被访问者的 qcio_id
    ownerProfile: {           // 被访问者的资料
      qcio_id: '',
      nickname: '',
      avatar: ''
    },
    myProfile: {              // 当前用户的资料
      qcio_id: ''
    },
    isLoggedIn: false,        // 是否已登录
    isOwnSpace: false,        // 是否访问自己的空间
    visitStats: {             // 访问统计
      totalVisits: 0,
      todayVisits: 0
    },
    hasSteppedToday: false,   // 今天是否已经踩过
    messages: [],             // 留言列表
    recentVisitors: [],       // 最近访客
    myAvatar: '👤'
  },

  onLoad: function(options) {
    const ownerQcioId = options.owner;

    if (!ownerQcioId) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }

    this.setData({ ownerQcioId });
    this.loadData();
  },

  // 加载数据（使用 API 客户端）
  async loadData() {
    wx.showLoading({ title: '加载中...', mask: true });

    try {
      // 先获取当前用户信息
      const myResult = await qcioApi.init();

      if (myResult && myResult.success) {
        const myProfile = myResult.data;

        // 判断是否已注册
        const isRegistered = !!myProfile.qcio_id;
        const isLoggedIn = isRegistered && !!myProfile.isOnline;

        // 判断是否访问自己的空间
        const isOwnSpace = isRegistered && myProfile.qcio_id === this.data.ownerQcioId;

        this.setData({
          myProfile: myProfile,
          isLoggedIn: isLoggedIn,
          isOwnSpace: isOwnSpace,
          myAvatar: myProfile.avatar || '👤'
        });

        // 如果访问自己的空间，不需要加载其他数据
        if (isOwnSpace) {
          wx.hideLoading();
          return;
        }

        // 加载被访问者信息和留言
        await Promise.all([
          this.loadOwnerProfile(),
          this.loadVisitStats(),
          this.loadMessages(),
          this.loadRecentVisitors(),
          this.checkIfSteppedToday()
        ]);

        // 访问他人空间获取经验
        if (!isOwnSpace) {
          addVisitSpaceExperience();
        }
      }
    } catch (err) {
      console.error('Load data error:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  // 加载被访问者的资料（使用 API 客户端）
  async loadOwnerProfile() {
    try {
      const result = await qcioApi.getUserByQcioId(this.data.ownerQcioId);

      if (result && result.success && result.data) {
        this.setData({
          ownerProfile: result.data
        });
      } else {
        wx.showToast({ title: '用户不存在', icon: 'none' });
      }
    } catch (err) {
      console.error('Load owner profile error:', err);
    }
  },

  // 加载访问统计（使用 API 客户端）
  async loadVisitStats() {
    try {
      const result = await qcioApi.getVisitStatsByQcioId(this.data.ownerQcioId);

      if (result && result.success) {
        this.setData({
          visitStats: result.data || { totalVisits: 0, todayVisits: 0 }
        });
      }
    } catch (err) {
      console.error('Load visit stats error:', err);
    }
  },

  // 加载留言（使用 API 客户端）
  async loadMessages() {
    try {
      const result = await qcioApi.getGuestbookByQcioId(this.data.ownerQcioId);

      if (result && result.success) {
        this.setData({
          messages: result.data || []
        });
      }
    } catch (err) {
      console.error('Load messages error:', err);
    }
  },

  // 加载最近访客（使用 API 客户端）
  async loadRecentVisitors() {
    try {
      const result = await qcioApi.getRecentVisitorsByQcioId(this.data.ownerQcioId);

      if (result && result.success) {
        this.setData({
          recentVisitors: result.data || []
        });
      }
    } catch (err) {
      console.error('Load recent visitors error:', err);
    }
  },

  // 检查今天是否已经踩过（使用 API 客户端）
  async checkIfSteppedToday() {
    if (!this.data.isLoggedIn) {
      return;
    }

    try {
      const result = await qcioApi.checkIfSteppedToday(this.data.ownerQcioId);

      if (result && result.success) {
        this.setData({
          hasSteppedToday: result.data.hasStepped || false
        });
      }
    } catch (err) {
      console.error('Check if stepped error:', err);
    }
  },

  // 踩一脚
  doStep() {
    // 使用防重复点击包装
    this._runWithLock('doStep', async () => {
      if (!this.data.isLoggedIn) {
        wx.showToast({ title: '请先登录', icon: 'none' });
        return;
      }

      if (this.data.isOwnSpace) {
        wx.showToast({ title: '不能踩自己的空间', icon: 'none' });
        return;
      }

      if (this.data.hasSteppedToday) {
        wx.showToast({ title: '今天已经踩过了', icon: 'none' });
        return;
      }

      wx.showLoading({ title: '踩一脚中...', mask: true });

      try {
        const result = await qcioApi.recordVisit(
          this.data.myProfile.qcio_id,
          this.data.myProfile.nickname,
          this.data.myProfile.avatar,
          this.data.ownerQcioId
        );

        if (result && result.success) {
          this.setData({ hasSteppedToday: true });

          // 重新加载数据
          await Promise.all([
            this.loadVisitStats(),
            this.loadMessages(),
            this.loadRecentVisitors()
          ]);

          wx.showToast({ title: '踩了一脚！', icon: 'success' });
        } else {
          wx.showToast({ title: res.result?.message || '踩脚失败', icon: 'none' });
        }
      } catch (err) {
        console.error('Do step error:', err);
        wx.showToast({ title: '踩脚失败', icon: 'none' });
      } finally {
        wx.hideLoading();
      }
    }, 2000); // 2秒防重复点击
  },

  // 去登录
  goToLogin() {
    // 使用 redirectTo 而不是 navigateBack，确保从分享链接进入时也能正常跳转
    // 传递 owner 参数，登录成功后返回踩一踩页面
    const url = `/pages/qcio/index?visit=${this.data.ownerQcioId}`;
    wx.redirectTo({
      url: url,
      fail: () => {
        // 如果 redirectTo 失败，尝试 reLaunch
        wx.reLaunch({
          url: url
        });
      }
    });
  },

  // 去我的空间
  goToMySpace() {
    wx.redirectTo({
      url: '/pages/qcio/index'
    });
  },

  // 返回我的空间
  goBack() {
    wx.redirectTo({
      url: '/pages/qcio/index'
    });
  }
});
