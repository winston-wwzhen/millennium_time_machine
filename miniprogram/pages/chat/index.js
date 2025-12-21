Page({
  data: {
    chatInput: '',
    scrollToView: '',
    isSending: false, 
    chatList: [
      { type: 'ai', content: '滴滴滴... 偶是水晶之恋。你是GG还是MM呀？踩踩空间互粉哦~' }
    ]
  },

  onLoad() {
    // 这里的上线音效代码可以保留
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
      wx.setNavigationBarTitle({ title: '💙 水晶之恋 💙 (输入中...)' });
      wx.showNavigationBarLoading();

      // 4. 【关键修改】调用名为 'chat' 的云函数
      const res = await wx.cloud.callFunction({
        name: 'chat', // 👈 这里改成了新建的云函数名
        data: {
          userMessage: text,
          history: history
        }
      });

      // 5. 处理结果
      wx.hideNavigationBarLoading();
      wx.setNavigationBarTitle({ title: '💙 水晶之恋 💙 (在线)' });
      
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
      wx.setNavigationBarTitle({ title: '💙 水晶之恋 💙 (离线)' });
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