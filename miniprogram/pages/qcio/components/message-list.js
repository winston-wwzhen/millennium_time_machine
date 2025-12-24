/**
 * QCIO 消息列表组件
 * 显示与 AI 好友的聊天会话列表
 */
Component({
  properties: {
    userProfile: {
      type: Object,
      value: null
    }
  },

  data: {
    // AI 好友列表（与联系人保持一致）
    aiContacts: [
      { id: 1, name: '轻舞飞扬', avatar: '💃', mode: 'qingwu', lastMsg: '或许...寂寞就湜莪們菂共哘語', unread: 2 },
      { id: 2, name: '龙傲天', avatar: '🎮', mode: 'longaotian', lastMsg: '本尊刚才带飞了三把，真Carry！', unread: 0 },
      { id: 3, name: '网管小哥', avatar: '🔧', mode: 'netadmin', lastMsg: '重启试试，网线插好了吗？', unread: 1 },
      { id: 6, name: '水晶之恋', avatar: '💎', mode: 'chat', lastMsg: '遇見伱，湜莪這輩孒最渼、', unread: 5 }
    ],
    messageList: []
  },

  lifetimes: {
    attached() {
      this.loadMessageList();
    }
  },

  methods: {
    // 加载消息列表
    async loadMessageList() {
      // 模拟加载与每个 AI 的最后一条消息
      const list = this.data.aiContacts.map(contact => ({
        ...contact,
        time: this.getRandomTime(),
        unreadCount: contact.unread
      }));

      this.setData({ messageList: list });
    },

    // 生成随机时间（模拟最近消息时间）
    getRandomTime() {
      const times = ['刚刚', '5分钟前', '半小时前', '1小时前', '昨天', '前天'];
      return times[Math.floor(Math.random() * times.length)];
    },

    // 打开聊天
    openChat(e) {
      const contact = e.currentTarget.dataset.contact;
      wx.navigateTo({
        url: `/pages/qcio-chat/index?name=${contact.name}&avatar=${contact.avatar}&id=${contact.id}`,
      });
    }
  }
});
