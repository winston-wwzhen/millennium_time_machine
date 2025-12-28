const { preventDuplicateBehavior } = require('../../utils/prevent-duplicate');
const { isNetworkError, setNetworkDisconnected, showDisconnectDialog } = require('../../utils/network');
const { eggSystem, EGG_IDS } = require('../../utils/egg-system');
const { userApi, qcioApi, chatApi } = require('../../utils/api-client');

Page({
  behaviors: [preventDuplicateBehavior],
  data: {
    // 联系人信息
    contactName: '水晶之恋',
    contactAvatar: 'O',
    chatMode: 'chat',
    // 用户自己的头像
    myAvatar: '👤',
    // 欢迎消息（从数据库获取，为空时使用默认）
    welcomeMessage: '',

    chatInput: '',
    scrollToView: '',
    isSending: false,
    chatList: [],
    // 自定义弹窗显示状态
    showEmojiModal: false,
    maxLength: 50, // 最大输入长度
    inputLength: 0, // 当前输入长度
    // 彩蛋达成状态
    chatLoverAchieved: false,

    // 彩蛋发现弹窗
    showEggDiscoveryDialog: false,
    eggDiscoveryData: {
      name: '',
      description: '',
      rarity: '',
      rarityName: '',
      rewardText: ''
    }
  },

  // 配置常量
  MESSAGE_COOLDOWN: 2000, // 发送冷却时间（毫秒）
  lastSendTime: 0, // 上次发送时间

  onLoad(options) {
    // 加载彩蛋系统
    eggSystem.load();
    // 检查聊天狂魔彩蛋是否已达成
    this.setData({
      chatLoverAchieved: eggSystem.isDiscovered(EGG_IDS.CHAT_LOVER)
    });

    // 注册彩蛋发现回调
    this.eggCallbackKey = eggSystem.setEggDiscoveryCallback((config) => {
      const rarityNames = {
        common: '普通',
        rare: '稀有',
        epic: '史诗',
        legendary: '传说'
      };
      const reward = config.reward;
      const rewardText = reward.coins ? `+${reward.coins}时光币` : '';
      this.setData({
        showEggDiscoveryDialog: true,
        eggDiscoveryData: {
          name: config.name,
          description: config.description,
          rarity: config.rarity,
          rarityName: rarityNames[config.rarity],
          rewardText: rewardText
        }
      });
    });

    // 获取联系人信息（从 QCIO 页面跳转过来时）
    if (options.name) {
      this.setData({
        contactName: decodeURIComponent(options.name),
        contactAvatar: decodeURIComponent(options.avatar || '👤'),
        chatMode: options.mode || 'chat',
        myAvatar: decodeURIComponent(options.myAvatar || '👤'),
        welcomeMessage: options.welcomeMessage ? decodeURIComponent(options.welcomeMessage) : ''
      });

      // 设置页面标题
      wx.setNavigationBarTitle({
        title: `${this.data.contactName} (在线)`
      });

      // 加载历史聊天记录
      this.loadChatHistory();
    } else {
      // 默认消息
      this.setData({
        chatList: [{ type: 'ai', content: '滴滴滴... 偶是水晶之恋。你是GG还是MM呀？踩踩空间互粉哦~' }]
      });
    }

    // 播放上线音效
    this.playSound('login');
  },

  // 加载聊天历史（使用 API 客户端）
  async loadChatHistory() {
    try {
      const result = await qcioApi.getChatHistory(this.data.contactName);

      if (result && result.success && result.data.length > 0) {
        // 有历史记录，直接使用
        this.setData({
          chatList: result.data,
          scrollToView: 'msg-bottom'  // 滚动到最后一条消息
        });
      } else {
        // 没有历史记录，显示欢迎消息
        const welcomeMsg = this.getWelcomeMessage();
        this.setData({
          chatList: [{ type: 'ai', content: welcomeMsg }],
          scrollToView: 'msg-bottom'  // 滚动到最后一条消息
        });
      }
    } catch (err) {
      console.error('Load chat history error:', err);
      // 出错时显示欢迎消息
      const welcomeMsg = this.getWelcomeMessage();
      this.setData({
        chatList: [{ type: 'ai', content: welcomeMsg }],
        scrollToView: 'msg-bottom'  // 滚动到最后一条消息
      });
    }
  },

  // 获取欢迎消息（优先使用数据库中的，否则使用默认）
  getWelcomeMessage() {
    // 如果有数据库的欢迎消息，直接使用
    if (this.data.welcomeMessage) {
      return this.data.welcomeMessage;
    }
    // 否则使用硬编码的默认欢迎消息
    const messages = {
      '忧郁王子': '滴~ 莪湜憂傷王子。今天的心情，像天气一樣陰沉... o(╥﹏╥)o',
      '轻舞飞扬': '滴~ 莪湜輕舞飛颺。莪喜歡看嗼筱說，沵覽悳阣ㄋ嗎？~',
      '往事随风': '嘿，好久不見。最近怎麼樣？還好嗎。記得偶de空間，常來看看~',
      '水晶之恋': '滴滴滴... 偶是水晶之恋。你是GG还是MM呀？踩踩空间互粉哦~'
    };
    return messages[this.data.contactName] || `滴滴~ 我是${this.data.contactName}。來聊聊吧~`;
  },

  // 播放音效
  playSound(type) {
    // 可选：添加音效播放逻辑
  },

  // 表情功能（怀旧提示）
  onEmoji() {
    this.setData({ showEmojiModal: true });
  },

  // 关闭弹窗
  closeModal() {
    this.setData({ showEmojiModal: false });
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 阻止点击事件冒泡到遮罩层
  },

  // 窗口抖动
  onShake() {
    // 震动反馈
    wx.vibrateShort({ type: 'light' });

    // 添加抖动消息到聊天列表
    const shakeMsg = { type: 'me', content: '📳 发送了一个窗口抖动' };
    const newList = this.data.chatList.concat(shakeMsg);

    this.setData({
      chatList: newList,
      scrollToView: 'msg-bottom'
    });

    // AI 回复抖动反应
    setTimeout(() => {
      const responses = [
        '哎哟！吓死莪孒...',
        '咋啦？有事吗？',
        '哆嗦啥呢...',
        '莪在呢，别抖啦~',
        '有事说事，别抖！',
        '震啥震，把莪震晕了...'
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      this.replyFromAI(randomResponse);
    }, 500);

    // 保存聊天历史
    this.saveChatHistory(newList);
  },

  goBack() {
    wx.navigateBack();
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
    this._runWithLock('sendMessage', async () => {
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
        scrollToView: 'msg-bottom', // 滚动到底部
        isSending: true
      });

      // 2. 整理历史记录 (OpenAI/GLM 格式)
      // 取最近 20 条，避免上下文太长消耗 token
      const history = this.data.chatList.slice(-20).map(item => ({
        role: item.type === 'me' ? 'user' : 'assistant',
        content: item.content
      }));

      try {
        // 3. UI 状态：对方正在输入...
        wx.setNavigationBarTitle({ title: `${this.data.contactName} (输入中...)` });
        wx.showNavigationBarLoading();

        // 4. 调用 chat 云函数，使用不同的 mode（人设）
        const result = await chatApi.sendMessage(text, history, this.data.chatMode, this.data.contactName);

        // 5. 处理结果
        wx.hideNavigationBarLoading();
        wx.setNavigationBarTitle({ title: `${this.data.contactName} (在线)` });

        if (result && result.success) {
          this.replyFromAI(result.reply);
          // 彩蛋：聊天狂魔
          this.checkChatEgg();
        } else {
          // 错误处理
          console.warn('AI Error:', result.errMsg);
          this.replyFromAI("系统繁忙，请稍后再试 o(╥﹏╥)o");
        }

      } catch (err) {
        console.error('Cloud Function Error:', err);
        wx.hideNavigationBarLoading();
        wx.setNavigationBarTitle({ title: `${this.data.contactName} (离线)` });

        // 检查是否是网络错误（429、超时等）
        if (isNetworkError(err)) {
          // 设置网络为断开状态
          const reason = err?.message || '网络连接中断';
          setNetworkDisconnected(reason);

          // 显示断网提示
          this.replyFromAI("网络连接中断... 请通过网上邻居重新连接后再发送消息。");
          showDisconnectDialog(reason);
        } else {
          this.replyFromAI("掉线了... 可能是网线被妈妈拔了...");
        }
      } finally {
        this.setData({ isSending: false });
      }
    }, this.MESSAGE_COOLDOWN); // 使用现有的冷却时间作为防重复点击间隔
  },

  replyFromAI(replyText) {
    const aiMsg = { type: 'ai', content: replyText };
    const newChatList = this.data.chatList.concat(aiMsg);

    this.setData({
      chatList: newChatList,
      scrollToView: 'msg-bottom'
    });
    wx.vibrateShort();

    // 保存聊天历史到数据库
    this.saveChatHistory(newChatList);
  },

  // 保存聊天历史到数据库（使用 API 客户端）
  async saveChatHistory(chatList) {
    try {
      const result = await qcioApi.saveChatHistory(this.data.contactName, chatList);
      console.log('Save chat history result:', result);
    } catch (err) {
      console.error('Save chat history error:', err);
      // 静默失败，不影响用户体验
    }
  },

  // ==================== 彩蛋检查 ====================
  // 检查聊天狂魔彩蛋（累计发送100条消息）- 使用 API 客户端
  async checkChatEgg() {
    if (this.data.chatLoverAchieved) return;

    try {
      const result = await userApi.checkChatEgg();

      if (result && result.success) {
        // 如果云函数返回shouldTrigger为true，说明达到了100条消息
        if (result.shouldTrigger) {
          this.setData({ chatLoverAchieved: true });
          eggSystem.discover(EGG_IDS.CHAT_LOVER);
        }
      }
    } catch (err) {
      console.error('Check chat egg error:', err);
    }
  },

  // 关闭彩蛋发现弹窗
  hideEggDiscoveryDialog: function() {
    this.setData({ showEggDiscoveryDialog: false });
  },

  // 页面卸载时清理彩蛋回调
  onUnload: function() {
    if (this.eggCallbackKey) {
      eggSystem.unregisterEggDiscoveryCallback(this.eggCallbackKey);
    }
  }
});