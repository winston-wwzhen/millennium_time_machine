Page({
  data: {
    currentTime: '00:00', // 任务栏时间
    isStartMenuOpen: false, // 开始菜单开关状态

    // --- 宠物数据 ---
    petX: 20, // 初始位置 X
    petY: 20, // 初始位置 Y
    petText: '',
    showBubble: false,
    isPetTalking: false
  },

  onLoad() {
    this.updateTime();
    this.timer = setInterval(() => {
      this.updateTime();
    }, 10000);
    try {
      const sys = wx.getSystemInfoSync();
      // 屏幕宽高
      const screenW = sys.windowWidth;
      const screenH = sys.windowHeight;

      // 宠物尺寸：宽80px, 高100px (对应 wxss 里的 .pet-container)
      // 任务栏高度：35px (对应 wxss 里的 .task-bar)
      const petW = 80;
      const petH = 100;
      const taskBarH = 35;
      const margin = 10; // 留一点间隙

      // 计算坐标
      const targetX = screenW - petW - margin; 
      // Y轴要减去宠物高度、任务栏高度和间隙
      const targetY = screenH - petH - taskBarH - margin;

      this.setData({
        petX: targetX,
        petY: targetY
      });
    } catch (e) {
      // 容错：如果获取失败，默认放中间
      this.setData({ petX: 100, petY: 200 });
    }
    this.startPetLoop();
  },

  onUnload() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    if (this.petTimer) clearTimeout(this.petTimer);
  },


  onTapPet() {
    // 如果正在说话，就强制换一句
    this.saySomething(true); 
    // 播放音效 (可选)
    wx.vibrateShort();
  },

  // 2. 随机说话循环
  startPetLoop() {
    const loop = () => {
      // 随机间隔 10~30秒 说一次话
      const delay = Math.random() * 20000 + 10000;
      
      this.petTimer = setTimeout(() => {
        if (!this.data.showBubble) {
          this.saySomething();
        }
        loop(); // 递归调用
      }, delay);
    };
    loop();
  },

  // 3. 说话动作
  saySomething(isInteractive = false) {
    // 语录库：2005年流行语 + AI 梗 + 贴心提示
    const quotes = [
      '偶会一直在桌面上陪着你哒~',
      '神马都是浮云...',
      '你在做神马？带偶一起玩嘛！',
      '该休息一下了，眼睛会痛痛哦。',
      '听说踩空间能增加人气值？',
      '客官，给个好评亲~',
      'CPU 运转正常，心情 100%！',
      '你是GG还是MM呀？',
      '主人，右下角的开始菜单里有彩蛋哦！',
      '不要迷恋哥，哥只是个传说。'
    ];

    // 如果是用户点击触发的，加入一些互动语录
    const interactiveQuotes = [
      '别戳偶，痒~ >_<',
      '再戳偶就罢工啦！',
      '是不是无聊了？去聊聊 AI 网友吧！',
      '蹭蹭~'
    ];

    const source = isInteractive ? quotes.concat(interactiveQuotes) : quotes;
    const text = source[Math.floor(Math.random() * source.length)];

    this.setData({
      petText: text,
      showBubble: true,
      isPetTalking: true
    });

    // 3秒后消失
    setTimeout(() => {
      this.setData({
        showBubble: false,
        isPetTalking: false
      });
    }, 4000);
  },

  // 更新任务栏时间逻辑
  updateTime() {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    this.setData({
      currentTime: `${hour}:${minute}`
    });
  },

  toggleStartMenu() {
    this.setData({
      isStartMenuOpen: !this.data.isStartMenuOpen
    });
    // 可以在这里加入点击音效
  },

  // 处理开始菜单项点击
  onMenuClick(e) {
    const action = e.currentTarget.dataset.action;
    this.setData({ isStartMenuOpen: false });

    switch(action) {
      case 'shutdown':
        wx.showModal({
          title: '正在关机...',
          content: '现在您可以安全地关闭微信了。',
          showCancel: false,
          confirmText: '重启' 
        });
        break;
      case 'run':
        wx.showToast({ title: 'C:\\> System32', icon: 'none' });
        break;
      // 可以在这里扩展更多菜单功能
    }
  },

  onTapMars() {
    wx.vibrateShort(); 
    wx.navigateTo({ url: '/pages/mars/index' })
  },

  onTapAvatar() {
    wx.vibrateShort();
    wx.navigateTo({ url: '/pages/avatar/index' })
  },

  onTapAIChat() {
    wx.vibrateShort();
    wx.navigateTo({
      url: '/pages/chat/index'
    });
  },

  onTapTranslator() {
    wx.vibrateShort();
    wx.navigateTo({ url: '/pages/translator/index' });
  },

  onTapAbout() {
// 如果是从开始菜单点击，先关闭菜单
    if (this.data.isStartMenuOpen) {
      this.setData({ isStartMenuOpen: false });
    }
    
    // 播放一个警告音效会更有趣（如果有的话）
    
    // 跳转到蓝屏页面
    wx.navigateTo({
      url: '/pages/about/index'
    });
  }
});