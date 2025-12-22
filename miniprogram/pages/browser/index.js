// miniprogram/pages/browser/index.js
const app = getApp();

Page({
  data: {
    // --- 浏览器状态 ---
    currentUrl: 'http://www.time-machine.com/portal',
    isLoading: true,
    progress: 0,
    statusText: 'Connecting to server...',
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

  // --- 浏览器核心逻辑 ---

  generateDailyContent: function() {
    const quotes = [
      "Y2K Bug fixed. Systems nominal.",
      "Welcome to the new millennium.",
      "Downloading more RAM...",
      "Netscape Navigator recommended.",
      "Signal strength: 98%"
    ];
    this.setData({ dailyQuote: quotes[Math.floor(Math.random() * quotes.length)] });
  },

  simulateLoading: function() {
    this.setData({ isLoading: true, progress: 0, statusText: 'Resolving host...' });
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 20;
      if (p >= 100) {
        clearInterval(interval);
        this.setData({ isLoading: false, statusText: 'Done', progress: 100 });
      } else {
        this.setData({ progress: p });
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
    const url = this.data.historyStack[index];
    this.setData({
      currentIndex: index,
      currentUrl: url,
      statusText: 'Restoring session...'
    });
    this.updateHistoryButtons();
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