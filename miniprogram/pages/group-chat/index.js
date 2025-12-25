/**
 * QCIO 群聊页面
 * 复古风格群聊界面，AI 成员随机发言
 */
Page({
  data: {
    // 群聊信息
    groupName: '群聊',
    groupAvatar: '👥',
    chatMode: 'chat',
    memberCount: 0,
    groupMembers: [], // 群成员列表
    // 用户自己的头像
    myAvatar: '👤',

    chatInput: '',
    scrollToView: '',
    isSending: false,
    chatList: []
  },

  onLoad(options) {
    // 获取群聊信息
    let members = [];
    if (options.members) {
      try {
        members = JSON.parse(decodeURIComponent(options.members));
      } catch (e) {
        console.error('Members parse error:', e);
      }
    }

    this.setData({
      groupName: decodeURIComponent(options.name || '群聊'),
      groupAvatar: decodeURIComponent(options.avatar || '👥'),
      chatMode: options.mode || 'chat',
      groupMembers: members,
      memberCount: options.memberCount || members.length || 0,
      myAvatar: decodeURIComponent(options.myAvatar || '👤')
    });

    // 设置页面标题
    wx.setNavigationBarTitle({
      title: `${this.data.groupName} (${this.data.memberCount}人)`
    });

    // 显示群聊欢迎消息
    const welcomeMsg = this.getWelcomeMessage();
    this.setData({
      chatList: [{ type: 'ai', content: welcomeMsg, speakerName: '系统消息' }]
    });

    // 播放上线音效
    this.playSound('login');
  },

  // 获取群聊欢迎消息
  getWelcomeMessage() {
    const messages = [
      '欢迎加入群聊！群成员正在活跃中~',
      '滴~ 群聊已连接，大家可以开始聊天了',
      '欢迎~ 这里是AI群聊，请大家文明发言',
      '欢迎光临~ 点击发送即可开始聊天'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  },

  // 随机选择发言成员
  getRandomSpeaker() {
    const members = this.data.groupMembers;
    if (!members || members.length === 0) {
      return { name: '群友', avatar: '👤', mode: 'chat' };
    }
    const randomIndex = Math.floor(Math.random() * members.length);
    return members[randomIndex];
  },

  // 播放音效
  playSound(type) {
    // 可选：添加音效播放逻辑
  },

  goBack() {
    wx.navigateBack();
  },

  onChatInput(e) {
    this.setData({ chatInput: e.detail.value });
  },

  // 发送消息核心逻辑
  async sendMessage() {
    const text = this.data.chatInput.trim();
    if (!text || this.data.isSending) return;

    // 1. 先把我的消息显示在界面上
    const newMsg = { type: 'me', content: text };
    const newList = this.data.chatList.concat(newMsg);

    this.setData({
      chatList: newList,
      chatInput: '',
      scrollToView: 'msg-bottom',
      isSending: true
    });

    // 2. 整理历史记录
    const history = this.data.chatList.slice(-6).map(item => ({
      role: item.type === 'me' ? 'user' : 'assistant',
      content: item.content
    }));

    try {
      // 3. UI 状态：对方正在输入...
      wx.setNavigationBarTitle({ title: `${this.data.groupName} (输入中...)` });
      wx.showNavigationBarLoading();

      // 4. 随机选择发言成员
      const speaker = this.getRandomSpeaker();

      // 5. 调用 chat 云函数
      const res = await wx.cloud.callFunction({
        name: 'chat',
        data: {
          userMessage: text,
          history: history,
          mode: speaker.mode || this.data.chatMode
        }
      });

      // 6. 处理结果
      wx.hideNavigationBarLoading();
      wx.setNavigationBarTitle({ title: `${this.data.groupName} (${this.data.memberCount}人)` });

      let reply = '（网线好像断了，对方没回应...）';
      if (res.result && res.result.success) {
        reply = res.result.reply;
      }

      // 7. 添加 AI 回复（带发言者名字）
      const aiMsg = {
        type: 'ai',
        content: reply,
        speakerName: speaker.name
      };

      this.setData({
        chatList: [...this.data.chatList, aiMsg],
        isSending: false,
        scrollToView: 'msg-bottom'
      });

      // 播放接收音效
      wx.vibrateShort();

    } catch (err) {
      console.error('Cloud Function Error:', err);
      wx.hideNavigationBarLoading();
      wx.setNavigationBarTitle({ title: `${this.data.groupName} (离线)` });

      // 添加错误消息
      const errorMsg = {
        type: 'ai',
        content: "掉线了... 可能是网线被妈妈拔了...",
        speakerName: '系统消息'
      };
      this.setData({
        chatList: [...this.data.chatList, errorMsg],
        isSending: false
      });
    }
  }
});
