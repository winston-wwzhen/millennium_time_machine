/**
 * QCIO 群聊列表组件
 * 显示 QQ 风格的群聊会话列表
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
    // 加载群聊列表
    loadGroupList() {
      const groups = [
        {
          id: 1,
          name: '葬爱家族',
          avatar: '🖤',
          // 群成员列表（包含 name、avatar、mode）
          members: [
            { name: '轻舞飞扬', avatar: '💃', mode: 'qingwu' },
            { name: '忧郁王子', avatar: '🚬', mode: 'qingwu' },
            { name: '往事随风', avatar: '🎸', mode: 'qingwu' },
            { name: '水晶之恋', avatar: '🦊', mode: 'chat' }
          ],
          memberCount: 128,
          lastMsg: '[轻舞飞扬]: 或许...寂寞就湜莪們菂共哘語',
          unread: 5,
          mode: 'qingwu'
        },
        {
          id: 2,
          name: '网游开黑群',
          avatar: '🎮',
          members: [
            { name: '龙傲天', avatar: '🎮', mode: 'longaotian' },
            { name: '网管小哥', avatar: '🕹️', mode: 'netadmin' },
            { name: '游戏达人', avatar: '👾', mode: 'longaotian' }
          ],
          memberCount: 56,
          lastMsg: '[龙傲天]: 本尊刚才带飞了三把，真Carry！',
          unread: 2,
          mode: 'longaotian'
        },
        {
          id: 3,
          name: '网吧常驻民',
          avatar: '💻',
          members: [
            { name: '网管小哥', avatar: '🔧', mode: 'netadmin' },
            { name: '技术宅', avatar: '💻', mode: 'netadmin' },
            { name: '键盘侠', avatar: '🖱️', mode: 'chat' }
          ],
          memberCount: 23,
          lastMsg: '[网管小哥]: 3号机重启好了',
          unread: 0,
          mode: 'netadmin'
        },
        {
          id: 4,
          name: '火星文交流群',
          avatar: '🌌',
          members: [
            { name: '水晶之恋', avatar: '💎', mode: 'chat' },
            { name: '轻舞飞扬', avatar: '🌟', mode: 'qingwu' },
            { name: '忧郁王子', avatar: '✨', mode: 'qingwu' },
            { name: '往事随风', avatar: '💫', mode: 'chat' }
          ],
          memberCount: 312,
          lastMsg: '[水晶之恋]: 遇見伱，湜莪這輩孒最渼麗菂偶遇...',
          unread: 99,
          mode: 'chat'
        },
        {
          id: 5,
          name: '非主流一族',
          avatar: '🖤',
          members: [
            { name: '忧郁王子', avatar: '🖤', mode: 'qingwu' },
            { name: '轻舞飞扬', avatar: '💀', mode: 'qingwu' },
            { name: '往事随风', avatar: '🎭', mode: 'qingwu' },
            { name: '水晶之恋', avatar: '🔗', mode: 'chat' },
            { name: '葬爱族人', avatar: '⛓️', mode: 'qingwu' }
          ],
          memberCount: 456,
          lastMsg: '[忧郁王子]: 莪，呮想靜靜。',
          unread: 12,
          mode: 'qingwu'
        },
        {
          id: 6,
          name: '90后回忆杀',
          avatar: '📼',
          members: [
            { name: '往事随风', avatar: '📼', mode: 'chat' },
            { name: '轻舞飞扬', avatar: '📺', mode: 'qingwu' },
            { name: '水晶之恋', avatar: '🎵', mode: 'chat' },
            { name: '忧郁王子', avatar: '📟', mode: 'qingwu' }
          ],
          memberCount: 88,
          lastMsg: '[往事随风]: 記得回踩哦！',
          unread: 0,
          mode: 'chat'
        }
      ];

      // 添加随机时间
      const list = groups.map(group => ({
        ...group,
        time: this.getRandomTime(),
        unreadCount: group.unread
      }));

      this.setData({ groupList: list });
    },

    // 生成随机时间（模拟最近消息时间）
    getRandomTime() {
      const times = ['刚刚', '5分钟前', '15:30', '12:20', '昨天', '周一'];
      return times[Math.floor(Math.random() * times.length)];
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
