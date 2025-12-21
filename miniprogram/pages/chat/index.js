Page({
  data: {
    chatInput: '',
    scrollToView: '',
    chatList: [
      { type: 'ai', content: '滴滴滴... 偶是水晶之恋。你是GG还是MM呀？踩踩空间互粉哦~' }
    ]
  },

  onLoad() {
    // 可以在这里播放上线音效 "叩叩叩"
  },

  goBack() {
    wx.navigateBack();
  },

  onChatInput(e) {
    this.setData({ chatInput: e.detail.value });
  },

  sendMessage() {
    const text = this.data.chatInput.trim();
    if (!text) return;

    // 1. 添加我的消息
    const newMsg = { type: 'me', content: text };
    const list = this.data.chatList.concat(newMsg);

    this.setData({
      chatList: list,
      chatInput: '', 
      scrollToView: 'msg-bottom' 
    });

    // 2. 模拟 AI 思考延迟
    setTimeout(() => {
      this.replyFromAI(text);
    }, 1000 + Math.random() * 1000); // 随机延迟 1-2秒
  },

  replyFromAI(userText) {
    let replyText = '';

    // 简单的规则匹配 (Rule-based Mock)
    if (userText.includes('你好') || userText.includes('在吗')) {
      replyText = '偶在的，刚刚在挂QQ等级，嘻嘻。';
    } else if (userText.includes('爱') || userText.includes('喜欢')) {
      replyText = '爱是痛，爱是恨，爱是折磨... o(╥﹏╥)o';
    } else if (userText.includes('作业') || userText.includes('工作')) {
      replyText = '神马作业？不如去网吧通宵打魔兽！';
    } else if (userText.includes('周杰伦') || userText.includes('jay')) {
      replyText = '哇！你也稀饭Jay吗？他的《夜曲》太好听了叭！为杰沉沦~';
    } else if (userText.includes('AI') || userText.includes('智能')) {
      replyText = '虾米AI？偶只知道劲舞团的挂...';
    } else {
      const randomReplies = [
        '暈，你在説什麽呀？',
        '886，偶要去吃饭了。',
        '你的头像好非主流哦，我稀饭！',
        '人生若只如初见，何事秋风悲画扇...',
        '踩踩踩踩踩踩，记得回踩哦！'
      ];
      replyText = randomReplies[Math.floor(Math.random() * randomReplies.length)];
    }

    const aiMsg = { type: 'ai', content: replyText };
    this.setData({
      chatList: this.data.chatList.concat(aiMsg),
      scrollToView: 'msg-bottom'
    });
    
    wx.vibrateShort();
  }
});