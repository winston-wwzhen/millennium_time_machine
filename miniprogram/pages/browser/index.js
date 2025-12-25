// miniprogram/pages/browser/index.js
const app = getApp();

Page({
  data: {
    // --- 浏览器状态 ---
    currentUrl: 'http://www.time-machine.com/portal',
    isLoading: true,
    progress: 0,
    statusText: '正在连接服务器...',
    historyStack: ['http://www.time-machine.com/portal'],
    currentIndex: 0,
    canGoBack: false,
    canGoForward: false,
    
    // 每日彩蛋
    dailyQuote: '',
  },

  onLoad: function () {
    this.generateDailyContent();
    this.simulateLoading();
  },

  onUnload: function () {
    // 防止页面销毁后 interval 仍在跑导致 setData 报错/泄漏
    if (this._loadingTimer) {
      clearInterval(this._loadingTimer);
      this._loadingTimer = null;
    }
  },

  // --- 浏览器核心逻辑 ---

  generateDailyContent: function() {
    const quotes = [
      "Y2K Bug 已修复。系统正常。",
      "欢迎来到新千禧年。",
      "正在下载更多内存...",
      "推荐使用 Netscape Navigator。",
      "信号强度: 98%"
    ];
    this.setData({ dailyQuote: quotes[Math.floor(Math.random() * quotes.length)] });
  },

  simulateLoading: function() {
    // 确保同一时间只有一个 loading 定时器
    if (this._loadingTimer) {
      clearInterval(this._loadingTimer);
      this._loadingTimer = null;
    }

    this.setData({ isLoading: true, progress: 0, statusText: '正在解析主机...' });
    let p = 0;

    this._loadingTimer = setInterval(() => {
      p += Math.random() * 20;

      // 进度做边界与整数化，避免 >100 / 小数 UI 乱跳
      const next = Math.min(100, Math.floor(p));

      if (next >= 100) {
        clearInterval(this._loadingTimer);
        this._loadingTimer = null;
        this.setData({ isLoading: false, statusText: '完成', progress: 100 });
      } else {
        this.setData({ progress: next });
      }
    }, 100);
  },

  navigateInternal: function(url) {
    const { historyStack, currentIndex } = this.data;
    if (historyStack[currentIndex] === url) {
      this.onRefresh();
      return;
    }
    const newStack = historyStack.slice(0, currentIndex + 1);
    newStack.push(url);

    this.setData({
      historyStack: newStack,
      currentIndex: newStack.length - 1,
      currentUrl: url
    });
    
    this.updateHistoryButtons();
    this.simulateLoading();
  },

  onBrowserBack: function() {
    if (!this.data.canGoBack) return;
    this.restoreHistory(this.data.currentIndex - 1);
  },

  onBrowserForward: function() {
    if (!this.data.canGoForward) return;
    this.restoreHistory(this.data.currentIndex + 1);
  },

  restoreHistory: function(index) {
    const { historyStack } = this.data;

    // 防御性：避免越界导致 undefined url
    if (index < 0 || index >= historyStack.length) return;

    const url = historyStack[index];
    this.setData({
      currentIndex: index,
      currentUrl: url,
      statusText: '正在恢复会话...'
    });

    this.updateHistoryButtons();
    // 后退/前进也应触发加载，否则 URL 变了但 loading/UI 不变
    this.simulateLoading();
  },

  updateHistoryButtons: function() {
    const { currentIndex, historyStack } = this.data;
    this.setData({
      canGoBack: currentIndex > 0,
      canGoForward: currentIndex < historyStack.length - 1
    });
  },

  onRefresh: function() {
    this.simulateLoading();
  },

  goHome: function() {
    this.navigateInternal('http://www.time-machine.com/portal');
  },
  
  onLinkTap: function(e) {
    const url = e.currentTarget.dataset.url;
    if (url === 'http://galaxy.farm') {
      this.navigateInternal(url);
    } else {
      const path = e.currentTarget.dataset.path;
      if (path) {
        wx.navigateTo({ url: path });
      }
    }
  },

  // 接收游戏组件传来的状态更新
  onGameStatusChange: function(e) {
    if (e.detail && e.detail.text) {
      this.setData({ statusText: e.detail.text });
    }
  },

  goBack: function() {
    wx.navigateBack();
  }
});