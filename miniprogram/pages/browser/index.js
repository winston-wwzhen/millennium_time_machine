// browser/index.js
Page({
  data: {
    pageTitle: 'Home Page',
    currentUrl: 'http://www.millennium.com', // 显示在地址栏的文本
    route: 'home', // 实际渲染的内部页面: home, 404, etc.
    isLoading: false,
    loadingPercent: 0,
    
    // 路由映射表
    sitemap: {
      'http://www.millennium.com': 'home',
      'http://mars.lang': 'mars',
      'http://love.tear': 'translator',
      'http://chat.qcio': 'chat',
      'http://my.space': 'space'
    },
    statusBarHeight: 20,
  },

  onLoad() {
    // 🆕 新增：获取系统信息，适配不同机型的刘海屏/状态栏
    try {
      const res = wx.getSystemInfoSync();
      // 某些机型获取失败给个保底值 20
      this.setData({ statusBarHeight: res.statusBarHeight || 20 });
    } catch (e) {
      console.error('获取系统信息失败', e);
    }

    this.startLoading();
  },

  // 模拟拨号上网加载
  startLoading() {
    this.setData({ isLoading: true, loadingPercent: 0 });
    
    // 进度条动画
    let p = 0;
    const timer = setInterval(() => {
      p += Math.random() * 20;
      if (p >= 100) {
        p = 100;
        clearInterval(timer);
        this.setData({ isLoading: false, loadingPercent: 100 });
      } else {
        this.setData({ loadingPercent: p });
      }
    }, 200);
  },

  // 用户输入地址
  onUrlInput(e) {
    this.setData({ currentUrl: e.detail.value });
  },

  // 回车或点击“转到”
  onUrlEnter() {
    const rawUrl = this.data.currentUrl.trim();
    // 简单容错：如果不带http，给它加上
    const url = rawUrl.startsWith('http') ? rawUrl : `http://${rawUrl}`;
    
    this.setData({ currentUrl: url });
    this.startLoading();

    // 路由匹配
    const routeKey = this.data.sitemap[url];
    
    if (routeKey) {
      // 如果是功能页面，延迟跳转（模拟浏览器打开app）
      if (['mars', 'translator', 'chat', 'space'].includes(routeKey)) {
        setTimeout(() => {
          wx.redirectTo({ url: `/pages/${routeKey}/index` });
        }, 1500);
      } else {
        // 内部渲染页面
        this.setData({ route: routeKey, pageTitle: 'Portal' });
      }
    } else {
      // 404
      this.setData({ route: '404', pageTitle: '404 Not Found' });
    }
  },

  // 点击页面内的链接
  navTo(e) {
    const url = e.currentTarget.dataset.url;
    this.setData({ currentUrl: url });
    this.onUrlEnter();
  },

  // 刷新
  refreshPage() {
    this.startLoading();
  },
  
  // 停止 (仅视觉效果)
  stopLoading() {
    this.setData({ isLoading: false });
  },

  // 主页
  goHome() {
    this.setData({ 
      currentUrl: 'http://www.millennium.com',
    });
    this.onUrlEnter();
  },

  // 返回上一页 (退出浏览器)
  goBack() {
    wx.navigateBack();
  },
  
  // 底部工具栏后退 (简易版，直接退出或回首页)
  navBack() {
    if (this.data.route !== 'home') {
      this.goHome();
    } else {
      wx.navigateBack();
    }
  }
});