/**
 * QCIO 群聊列表组件
 * 显示 QCIO 风格的群聊会话列表
 */
Component({
  properties: {
    userProfile: {
      type: Object,
      value: null
    }
  },

  data: {
    // 群聊列表
    groupList: []
  },

  lifetimes: {
    attached() {
      this.loadGroupList();
    }
  },

  methods: {
    // 从数据库加载群聊列表
    async loadGroupList() {
      try {
        const res = await wx.cloud.callFunction({
          name: 'qcio',
          data: {
            action: 'getGroupList'
          }
        });

        if (res.result && res.result.success) {
          this.setData({ groupList: res.result.data });
        } else {
          console.error('Load group list failed:', res.result);
          this.setData({ groupList: [] });
        }
      } catch (err) {
        console.error('Load group list error:', err);
        this.setData({ groupList: [] });
      }
    },

    // 打开群聊
    openChat(e) {
      const group = e.currentTarget.dataset.group;
      // 获取用户头像
      const myAvatar = this.data.userProfile?.avatar || '👤';
      // 跳转到群聊页面，传递群聊信息和用户头像
      wx.navigateTo({
        url: `/pages/group-chat/index?name=${encodeURIComponent(group.name)}&avatar=${encodeURIComponent(group.avatar)}&mode=${group.mode}&memberCount=${group.memberCount}&members=${encodeURIComponent(JSON.stringify(group.members))}&myAvatar=${encodeURIComponent(myAvatar)}`,
      });
    }
  }
});
