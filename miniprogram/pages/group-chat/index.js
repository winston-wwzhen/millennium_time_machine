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
    chatList: [],
    showMembers: false, // 控制群成员列表展开/收起
    maxLength: 50, // 最大输入长度
    inputLength: 0 // 当前输入长度
  },

  // 配置常量
  MESSAGE_COOLDOWN: 2000, // 发送冷却时间（毫秒）
  lastSendTime: 0, // 上次发送时间

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

    // 加载历史聊天记录
    this.loadChatHistory();

    // 播放上线音效
    this.playSound('login');
  },

  // 加载聊天历史
  async loadChatHistory() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'qcio',
        data: {
          action: 'getGroupChatHistory',
          groupName: this.data.groupName
        }
      });

      if (res.result && res.result.success && res.result.data.length > 0) {
        // 有历史记录，直接使用
        this.setData({
          chatList: res.result.data,
          scrollToView: 'msg-bottom'  // 滚动到最后一条消息
        });
      } else {
        // 没有历史记录，显示欢迎消息
        const welcomeMsg = this.getWelcomeMessage();
        this.setData({
          chatList: [{ type: 'ai', content: welcomeMsg, speakerName: '系统消息', speakerAvatar: '📢' }],
          scrollToView: 'msg-bottom'  // 滚动到最后一条消息
        });
      }
    } catch (err) {
      console.error('Load group chat history error:', err);
      // 出错时显示欢迎消息
      const welcomeMsg = this.getWelcomeMessage();
      this.setData({
        chatList: [{ type: 'ai', content: welcomeMsg, speakerName: '系统消息', speakerAvatar: '📢' }],
        scrollToView: 'msg-bottom'  // 滚动到最后一条消息
      });
    }
  },

  // 获取群聊欢迎消息
  getWelcomeMessage() {
    const messages = [
      `欢迎加入${this.data.groupName}！群成员正在活跃中~`,
      `滴~ ${this.data.groupName}已连接，大家可以开始聊天了`,
      '欢迎~ 这里是AI群聊，成员随机发言，仅供娱乐',
      '欢迎光临~ 点击发送即可开始聊天'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  },

  // 播放音效
  playSound(type) {
    // 可选：添加音效播放逻辑
  },

  goBack() {
    wx.navigateBack();
  },

  // 切换群成员列表展开/收起
  toggleMembers() {
    this.setData({
      showMembers: !this.data.showMembers
    });
  },

  onChatInput(e) {
    const value = e.detail.value;
    // 限制输入长度
    if (value.length > this.data.maxLength) {
      wx.showToast({
        title: `最多${this.data.maxLength}字`,
        icon: 'none',
        duration: 1500
      });
      return;
    }
    this.setData({
      chatInput: value,
      inputLength: value.length
    });
  },

  // 发送消息核心逻辑
  async sendMessage() {
    const text = this.data.chatInput.trim();
    if (!text || this.data.isSending) return;

    // 检查发送频率限制
    const now = Date.now();
    const timeSinceLastSend = now - this.lastSendTime;
    if (timeSinceLastSend < this.MESSAGE_COOLDOWN) {
      const remainingTime = Math.ceil((this.MESSAGE_COOLDOWN - timeSinceLastSend) / 1000);
      wx.showToast({
        title: `请稍等${remainingTime}秒后再发送`,
        icon: 'none',
        duration: 1500
      });
      return;
    }

    // 1. 先把我的消息显示在界面上
    const newMsg = { type: 'me', content: text };
    const newList = this.data.chatList.concat(newMsg);

    // 更新发送时间
    this.lastSendTime = Date.now();

    this.setData({
      chatList: newList,
      chatInput: '',
      inputLength: 0,
      scrollToView: 'msg-bottom',
      isSending: true
    });

    // 2. 整理历史记录 (取最近 20 条)
    const history = this.data.chatList.slice(-20).map(item => ({
      role: item.type === 'me' ? 'user' : 'assistant',
      content: item.content
    }));

    try {
      // 3. UI 状态：对方正在输入...
      wx.setNavigationBarTitle({ title: `${this.data.groupName} (输入中...)` });
      wx.showNavigationBarLoading();

      // 4. 随机选择发言成员
      const speakers = this.getRandomSpeakers();

      // 5. 一次性调用后端，获取多个回复
      const res = await wx.cloud.callFunction({
        name: 'chat',
        data: {
          userMessage: text,
          history: history,
          mode: this.data.chatMode,
          groupChat: {
            enabled: true,
            speakers: speakers.map(s => ({
              name: s.name,
              avatar: s.avatar,
              mode: s.mode || this.data.chatMode
            }))
          }
        }
      });

      // 6. 处理结果
      wx.hideNavigationBarLoading();
      wx.setNavigationBarTitle({ title: `${this.data.groupName} (${this.data.memberCount}人)` });

      let replies = [];
      if (res.result && res.result.success) {
        replies = res.result.replies || [];
      }

      // 7. 依次显示每个回复
      for (let i = 0; i < replies.length; i++) {
        const replyItem = replies[i];
        const speaker = speakers[i];

        const aiMsg = {
          type: 'ai',
          content: replyItem.content || '（网线好像断了，对方没回应...）',
          speakerName: speaker.name,
          speakerAvatar: speaker.avatar
        };

        const currentList = [...this.data.chatList, aiMsg];
        this.setData({
          chatList: currentList,
          scrollToView: 'msg-bottom'
        });

        // 播放接收音效
        wx.vibrateShort();

        // 如果不是最后一位，延迟一下再让下一位发言
        if (i < replies.length - 1) {
          await this.delay(800 + Math.random() * 1000); // 0.8-1.8秒随机延迟
        }
      }

      this.setData({ isSending: false });

      // 保存聊天历史到数据库
      this.saveChatHistory(this.data.chatList);

    } catch (err) {
      console.error('Cloud Function Error:', err);
      wx.hideNavigationBarLoading();
      wx.setNavigationBarTitle({ title: `${this.data.groupName} (离线)` });

      // 添加错误消息
      const errorMsg = {
        type: 'ai',
        content: "掉线了... 可能是网线被妈妈拔了...",
        speakerName: '系统消息',
        speakerAvatar: '📢'
      };
      this.setData({
        chatList: [...this.data.chatList, errorMsg],
        isSending: false
      });
    }
  },

  // 随机选择 1-6 位发言成员
  getRandomSpeakers() {
    const members = this.data.groupMembers;
    if (!members || members.length === 0) {
      return [{ name: '群友', avatar: '👤', mode: 'chat' }];
    }

    // 随机决定发言人数（人数越多概率越低）
    // 1人: 40%, 2人: 30%, 3人: 15%, 4人: 8%, 5人: 5%, 6人: 2%
    const rand = Math.random();
    let speakerCount = 1;
    if (rand > 0.60) speakerCount = 2;      // 40% (0.60-1.00)
    if (rand > 0.85) speakerCount = 3;      // 15% (0.85-1.00)
    if (rand > 0.93) speakerCount = 4;      // 8%  (0.93-1.00)
    if (rand > 0.98) speakerCount = 5;      // 5%  (0.98-1.00)
    if (rand > 0.995) speakerCount = 6;     // 1.5% (0.995-1.00)，调整为1.5%避免太小

    // 限制不超过群成员总数
    speakerCount = Math.min(speakerCount, members.length);

    // 随机抽取成员（不重复）
    const selected = [];
    const available = [...members];

    for (let i = 0; i < speakerCount; i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      selected.push(available[randomIndex]);
      available.splice(randomIndex, 1); // 移除已选的，避免重复
    }

    return selected;
  },

  // 延迟函数
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // 保存聊天历史到数据库
  async saveChatHistory(chatList) {
    try {
      const res = await wx.cloud.callFunction({
        name: 'qcio',
        data: {
          action: 'saveGroupChatHistory',
          data: {
            groupName: this.data.groupName,
            messages: chatList
          }
        }
      });
      console.log('Save group chat history result:', res.result);
    } catch (err) {
      console.error('Save group chat history error:', err);
      // 静默失败，不影响用户体验
    }
  }
});
