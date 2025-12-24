/**
 * QCIO 独立聊天页面
 * 复古风格聊天界面，支持多 AI 人设
 */
Page({
  data: {
    contactName: '',
    contactAvatar: '',
    contactId: '',
    chatMode: '', // qingwu, longaotian, netadmin

    messages: [],
    inputText: '',
    isLoading: false,
    isSending: false,
    scrollToView: ''
  },

  onLoad(options) {
    const { name, avatar, id } = options;

    // 根据联系人名字确定聊天模式（人设）
    const modeMap = {
      '轻舞飞扬': 'qingwu',
      '龙傲天': 'longaotian',
      '网管小哥': 'netadmin'
    };

    this.setData({
      contactName: name || '轻舞飞扬',
      contactAvatar: avatar || '💃',
      contactId: id || '1',
      chatMode: modeMap[name] || 'qingwu'
    });

    // 设置页面标题
    wx.setNavigationBarTitle({
      title: `与 ${this.data.contactName} 聊天`
    });

    // 加载聊天历史
    this.loadChatHistory();

    // 播放上线音效
    this.playSound('login');
  },

  onUnload() {
    // 页面卸载时保存聊天历史
    this.saveChatHistory();
  },

  onHide() {
    // 页面隐藏时保存聊天历史
    this.saveChatHistory();
  },

  // 加载聊天历史
  async loadChatHistory() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'qcio',
        data: {
          action: 'getChatHistory',
          contactName: this.data.contactName
        }
      });

      if (res.result && res.result.success) {
        const history = res.result.data || [];
        this.setData({
          messages: history
        });
        this.scrollToBottom();
      }
    } catch (err) {
      console.error('Load chat history error:', err);
    }
  },

  // 保存聊天历史
  async saveChatHistory() {
    if (this.data.messages.length === 0) return;

    try {
      await wx.cloud.callFunction({
        name: 'qcio',
        data: {
          action: 'saveChatHistory',
          data: {
            contactName: this.data.contactName,
            messages: this.data.messages
          }
        }
      });
    } catch (err) {
      console.error('Save chat history error:', err);
    }
  },

  // 输入框输入
  onInput(e) {
    this.setData({ inputText: e.detail.value });
  },

  // 发送消息
  async sendMessage() {
    const text = this.data.inputText.trim();
    if (!text || this.data.isSending) return;

    // 添加用户消息
    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    this.setData({
      messages: [...this.data.messages, userMsg],
      inputText: '',
      isSending: true
    });
    this.scrollToBottom();

    // 播放发送音效
    this.playSound('send');

    try {
      // 调用 AI
      const history = this.data.messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await wx.cloud.callFunction({
        name: 'chat',
        data: {
          userMessage: text,
          history: history,
          mode: this.data.chatMode
        }
      });

      let reply = '（网线好像断了，对方没回应...）';

      if (res.result && res.result.success) {
        reply = res.result.reply;
      }

      // 添加 AI 回复
      const aiMsg = {
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString()
      };

      this.setData({
        messages: [...this.data.messages, aiMsg],
        isSending: false
      });

      // 播放接收音效
      this.playSound('receive');
      this.scrollToBottom();

    } catch (err) {
      console.error('Send message error:', err);
      this.setData({ isSending: false });
      wx.showToast({ title: '发送失败', icon: 'none' });
    }
  },

  // 滚动到底部
  scrollToBottom() {
    this.setData({
      scrollToView: `msg-${this.data.messages.length - 1}`
    });
  },

  // 播放音效
  playSound(type) {
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = this.getSoundUrl(type);
    innerAudioContext.volume = 0.3;
    innerAudioContext.onError((res) => {
      // 音效播放失败不影响功能
    });
    innerAudioContext.play();
  },

  // 获取音效 URL（这里使用 data URL 或云存储）
  getSoundUrl(type) {
    // 简化处理：使用系统提示音代替
    // 实际项目中可以使用云存储的音频文件
    return '';
  },

  // 震动窗口
  vibrate() {
    wx.vibrateShort({
      type: 'heavy'
    });
  },

  // 复制消息
  copyMessage(e) {
    const content = e.currentTarget.dataset.content;
    wx.setClipboardData({
      data: content,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' });
      }
    });
  },

  // 返回
  goBack() {
    wx.navigateBack();
  }
});
