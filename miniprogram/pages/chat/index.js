Page({
  data: {
    // 联系人信息
    contactName: '水晶之恋',
    contactAvatar: 'O',
    chatMode: 'chat',
    // 用户自己的头像
    myAvatar: '👤',

    chatInput: '',
    scrollToView: '',
    isSending: false,
    chatList: []
  },

  onLoad(options) {
    // 获取联系人信息（从 QCIO 页面跳转过来时）
    if (options.name) {
      this.setData({
        contactName: decodeURIComponent(options.name),
        contactAvatar: decodeURIComponent(options.avatar || '👤'),
        chatMode: options.mode || 'chat',
        myAvatar: decodeURIComponent(options.myAvatar || '👤')
      });

      // 设置页面标题
      wx.setNavigationBarTitle({
        title: `${this.data.contactName} (在线)`
      });

      // 根据不同联系人设置不同的欢迎消息
      const welcomeMsg = this.getWelcomeMessage(this.data.contactName, this.data.chatMode);
      this.setData({
        chatList: [{ type: 'ai', content: welcomeMsg }]
      });
    } else {
      // 默认消息
      this.setData({
        chatList: [{ type: 'ai', content: '滴滴滴... 偶是水晶之恋。你是GG还是MM呀？踩踩空间互粉哦~' }]
      });
    }

    // 播放上线音效
    this.playSound('login');
  },

  // 获取不同联系人的欢迎消息
  getWelcomeMessage(name, mode) {
    const messages = {
      'qingwu': '滴~ 莪湜輕舞飛颺。莪喜歡看嗼筱說，沵覽悳阣ㄋ嗎？~',
      'longaotian': '本尊龙傲天上线！今天又要Carry全场了。',
      'netadmin': '3号机重启好了。有什么问题先重启试试。',
      'chat': '滴滴滴... 偶是水晶之恋。你是GG还是MM呀？踩踩空间互粉哦~'
    };
    return messages[mode] || messages['chat'];
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
      scrollToView: 'msg-bottom', // 滚动到底部
      isSending: true
    });

    // 2. 整理历史记录 (OpenAI/GLM 格式)
    // 取最近 6 条，避免上下文太长消耗 token
    const history = this.data.chatList.slice(-6).map(item => ({
      role: item.type === 'me' ? 'user' : 'assistant',
      content: item.content
    }));

    try {
      // 3. UI 状态：对方正在输入...
      wx.setNavigationBarTitle({ title: `${this.data.contactName} (输入中...)` });
      wx.showNavigationBarLoading();

      // 4. 调用 chat 云函数，使用不同的 mode（人设）
      const res = await wx.cloud.callFunction({
        name: 'chat',
        data: {
          userMessage: text,
          history: history,
          mode: this.data.chatMode  // 使用当前联系人的聊天模式
        }
      });

      // 5. 处理结果
      wx.hideNavigationBarLoading();
      wx.setNavigationBarTitle({ title: `${this.data.contactName} (在线)` });

      if (res.result && res.result.success) {
        this.replyFromAI(res.result.reply);
      } else {
        // 错误处理
        console.warn('AI Error:', res.result.errMsg);
        this.replyFromAI("系统繁忙，请稍后再试 o(╥﹏╥)o");
      }

    } catch (err) {
      console.error('Cloud Function Error:', err);
      wx.hideNavigationBarLoading();
      wx.setNavigationBarTitle({ title: `${this.data.contactName} (离线)` });
      this.replyFromAI("掉线了... 可能是网线被妈妈拔了...");
    } finally {
      this.setData({ isSending: false });
    }
  },

  replyFromAI(replyText) {
    const aiMsg = { type: 'ai', content: replyText };
    this.setData({
      chatList: this.data.chatList.concat(aiMsg),
      scrollToView: 'msg-bottom'
    });
    wx.vibrateShort();
  }
});