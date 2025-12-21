// miniprogram/pages/index/index.js
const app = getApp();

// 🦁 电子宠物语录库
const LION_QUOTES = [
  "踩踩空间~ 记得回访哦!",
  "偶是系咪~ (Simi)",
  "可以帮我挂QQ吗? 我要太阳!",
  "上网要注意休息哦!",
  "点我点我! 嘻嘻~",
  "神马都是浮云...",
  "Zzz... (打瞌睡)",
  "你有新的短消息!",
  "你是GG还是MM?",
  "不要迷恋哥，哥只是个传说"
];

Page({
  data: {
    // === 系统基础数据 ===
    username: 'Admin', // 默认用户名
    showStartMenu: false, // 开始菜单显隐状态
    currentTime: '', // 任务栏右下角时间
    timer: null, // 时间定时器引用

    // === 🦁 电子宠物数据 ===
    petX: 0, // 初始位置 X (会在 onLoad 中计算)
    petY: 0, // 初始位置 Y (会在 onLoad 中计算)
    petMessage: '', // 宠物气泡文字
    petTimer: null, // 随机说话定时器
  },

  // === 生命周期：页面加载 ===
  onLoad() {
    // 📐 计算小狮子的初始位置 (默认右下角)
    try {
      const sys = wx.getSystemInfoSync();
      const ratio = sys.windowWidth / 750; // rpx 转 px 的比例
      
      const petSize = 120 * ratio; // 狮子大小 120rpx
      const taskbarHeight = 60 * ratio; // 任务栏高度 (约56rpx) + 一点缝隙
      const margin = 20 * ratio; // 边距 20rpx
      
      this.setData({
        // 放在右下角，且位于任务栏上方
        petX: sys.windowWidth - petSize - margin,
        petY: sys.windowHeight - petSize - taskbarHeight - margin
      });
    } catch (e) {
      // 兜底：如果获取失败，随便放个位置
      this.setData({ petX: 200, petY: 400 });
    }
  },

  // === 生命周期：显示页面时 ===
  onShow() {
    // 1. 读取用户信息 (从登录页保存的缓存中获取)
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.username) {
      this.setData({ username: userInfo.username });
    } else {
      // 如果未登录进入（调试情况），默认为 Admin
      this.setData({ username: 'Admin' });
    }

    // 2. 启动任务栏时钟
    this.updateTime(); // 先执行一次
    this.data.timer = setInterval(() => {
      this.updateTime();
    }, 60000); // 每分钟更新一次

    // 3. 启动小狮子随机说话
    this.startPetTalking();
  },

  // === 生命周期：隐藏/卸载时 ===
  onHide() {
    this.clearTimer();
    this.stopPetTalking();
  },
  onUnload() {
    this.clearTimer();
    this.stopPetTalking();
  },

  // --- 时钟逻辑 ---
  updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // 转换为 12小时制
    hours = hours % 12;
    hours = hours ? hours : 12; 
    
    // 补零
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    const timeStr = `${hours}:${minutesStr} ${ampm}`;
    this.setData({ currentTime: timeStr });
  },

  clearTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.data.timer = null;
    }
  },

  // --- 🦁 电子宠物互动逻辑 ---

  // 点击小狮子
  onPetTap() {
    // 1. 震动反馈
    wx.vibrateShort();
    
    // 2. 随机说一句话
    const randomIndex = Math.floor(Math.random() * LION_QUOTES.length);
    const msg = LION_QUOTES[randomIndex];
    
    this.setData({ petMessage: msg });

    // 3. 3秒后气泡自动消失
    setTimeout(() => {
      // 只有当前消息没变时才清除（防止覆盖新触发的消息）
      if (this.data.petMessage === msg) {
        this.setData({ petMessage: '' });
      }
    }, 3000);
  },

  // 启动自动唠叨模式
  startPetTalking() {
    // 防止重复启动
    if (this.data.petTimer) return;

    this.data.petTimer = setInterval(() => {
      // 30% 的概率自动说话，避免太吵
      if (Math.random() > 0.7) {
        this.onPetTap();
      }
    }, 8000); // 每8秒尝试一次
  },

  // 停止唠叨
  stopPetTalking() {
    if (this.data.petTimer) {
      clearInterval(this.data.petTimer);
      this.data.petTimer = null;
    }
  },

  // --- 交互逻辑 ---

  // 🖱️ 点击开始按钮
  toggleStartMenu() {
    this.setData({
      showStartMenu: !this.data.showStartMenu
    });
  },

  // 🖱️ 点击桌面空白处 (关闭开始菜单)
  closeStartMenu() {
    if (this.data.showStartMenu) {
      this.setData({ showStartMenu: false });
    }
  },

  // 🔑 注销 (Log Off)
  onLogOff() {
    this.setData({ showStartMenu: false }); // 先关菜单
    
    wx.showModal({
      title: 'Log Off Windows',
      content: `Are you sure you want to log off ${this.data.username}?`,
      confirmText: 'Yes',
      cancelText: 'No',
      success: (res) => {
        if (res.confirm) {
          // 1. 清除登录缓存
          wx.removeStorageSync('userInfo');
          
          // 2. 震动反馈
          wx.vibrateShort();

          // 3. 跳转回登录页 (关闭所有页面)
          wx.reLaunch({
            url: '/pages/login/index'
          });
        }
      }
    });
  },

  // --- 桌面图标跳转 ---

  // ℹ️ 关于系统 (我的电脑)
  openAbout() {
    wx.navigateTo({ url: '/pages/about/index' });
    this.closeStartMenu();
  },

  // 💬 我的网友 (AI聊天)
  openChat() {
    wx.navigateTo({ url: '/pages/chat/index' });
    this.closeStartMenu();
  },

  // 🪐 火星文转换
  openMars() {
    wx.navigateTo({ url: '/pages/mars/index' });
    this.closeStartMenu();
  },

  // 💔 心情转译机
  openTranslator() {
    wx.navigateTo({ url: '/pages/translator/index' });
    this.closeStartMenu();
  },

  // 📸 非主流大头贴
  openAvatar() {
    wx.navigateTo({ url: '/pages/avatar/index' });
    this.closeStartMenu();
  },

  // 🗑️ 回收站 (装饰性功能)
  openRecycle() {
    wx.showToast({
      title: 'Recycle Bin is empty',
      icon: 'none'
    });
    this.closeStartMenu();
  }
});