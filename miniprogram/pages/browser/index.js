// miniprogram/pages/browser/index.js
const app = getApp();
const { eggSystem, EGG_IDS } = require('../../utils/egg-system');
const { chatApi, userApi } = require('../../utils/api-client');

Page({
  data: {
    // --- 浏览器状态 ---
    currentUrl: 'http://www.navi-2006.com',
    isLoading: true,
    progress: 0,
    statusText: '正在连接服务器...',
    historyStack: ['http://www.navi-2006.com'],
    currentIndex: 0,
    canGoBack: false,
    canGoForward: false,

    // 每日彩蛋
    dailyQuote: '',

    // 刷新动画状态
    isRefreshing: false,

    // ========== 工具页面状态 ==========

    // --- 火星翻译 ---
    marsInput: '',
    marsOutput: '',
    marsModeIndex: 0,
    marsModes: [
      { key: 'mars', label: '火星文' },
      { key: 'kaomoji', label: '颜文字' },
      { key: 'abstract', label: 'Emoji' },
      { key: 'human', label: '说人话' }
    ],
    marsIsConverting: false,

    // --- 非主流相机 ---
    avatarPreview: '',
    avatarTempPath: '',
    avatarFilter: '',
    avatarBorder: '',
    avatarFilters: [
      { id: '', name: '原图' },
      { id: 'old-noise', name: '怀旧噪点' },
      { id: 'sepia', name: '复古黄' },
      { id: 'cold', name: '冷色调' },
      { id: 'warm', name: '暖色调' }
    ],
    avatarBorders: [
      { id: '', name: '无边框' },
      { id: 'cyber', name: '暗黑赛博' },
      { id: 'win98', name: 'Win98' }
    ],
    avatarPhotosSavedCount: 0,
    avatarEggAchieved: false,

    // --- 星际探索 ---
    starDiff: 'beginner',
    starGrid: [],
    starCols: 9,
    starTime: 0,
    starBeacons: 10,
    starGameState: 'ready',
    starDiffConfig: {
      beginner: { rows: 9, cols: 9, mines: 10 },
      intermediate: { rows: 16, cols: 16, mines: 40 },
      expert: { rows: 16, cols: 30, mines: 99 }
    },
    starTimer: null,

    // --- 在线计算器 ---
    calcDisplay: '0',
    calcExpression: '',
    calcLastResult: '',
    calcCount: 0,           // 计算器使用次数（彩蛋计数）

    // --- 天气预报 ---
    weatherCity: '',
    weatherDate: '',
    weatherTemp: 25,
    weatherIcon: '☀️',
    weatherDesc: '晴朗',
    weatherHumidity: 45,
    weatherWind: '东南风 3级',
    weatherAqi: '良',
    weatherForecast: [],

    // --- 万年历 ---
    calendarYear: 2006,
    calendarMonth: 1,
    calendarDays: [],
    calendarToday: '',
    calendarTodayLunar: '',
    calendarTodayTerm: '',
    calendarEggAchieved: false,  // 时光旅行者彩蛋

    // --- 彩蛋相关 ---
    starEggAchieved: false,      // 星际探险家彩蛋
    calcEggAchieved: false,      // 计算器高手彩蛋
    navigatorEggAchieved: false, // 浏览器领航员彩蛋
    navigatorCounts: {
      forward: 0,
      back: 0,
      refresh: 0
    },
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

  onLoad: function () {
    this.generateDailyContent();
    this.simulateLoading();

    // 初始化彩蛋系统
    eggSystem.load();
    this.setData({
      avatarEggAchieved: eggSystem.isDiscovered(EGG_IDS.AVATAR_MASTER)
    });

    // 注册彩蛋发现回调（使用 Win98 风格弹窗）
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

    // 初始化天气预报
    this.initWeather();
    // 初始化万年历
    this.initCalendar();
  },

  onUnload: function () {
    // 防止页面销毁后 interval 仍在跑导致 setData 报错/泄漏
    if (this._loadingTimer) {
      clearInterval(this._loadingTimer);
      this._loadingTimer = null;
    }
    // 清理游戏定时器
    if (this.data.starTimer) {
      clearInterval(this.data.starTimer);
    }
    // 清理彩蛋回调
    if (this.eggCallbackKey) {
      eggSystem.unregisterEggDiscoveryCallback(this.eggCallbackKey);
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

    // 初始化星际探索游戏
    if (url === 'http://tools.navi-2006.com/star' && this.data.starGrid.length === 0) {
      this.initStarGame();
    }
  },

  onBrowserBack: function() {
    if (!this.data.canGoBack) return;

    // 触发浏览器领航员彩蛋（计数）
    if (!this.data.navigatorEggAchieved) {
      const counts = { ...this.data.navigatorCounts };
      counts.back++;
      this.setData({ navigatorCounts: counts });
      this.checkNavigatorEgg();
    }

    this.restoreHistory(this.data.currentIndex - 1);
  },

  onBrowserForward: function() {
    if (!this.data.canGoForward) return;

    // 触发浏览器领航员彩蛋（计数）
    if (!this.data.navigatorEggAchieved) {
      const counts = { ...this.data.navigatorCounts };
      counts.forward++;
      this.setData({ navigatorCounts: counts });
      this.checkNavigatorEgg();
    }

    this.restoreHistory(this.data.currentIndex + 1);
  },

  checkNavigatorEgg: function() {
    const { forward, back, refresh } = this.data.navigatorCounts;
    if (forward >= 3 && back >= 3 && refresh >= 3 && !this.data.navigatorEggAchieved) {
      this.setData({ navigatorEggAchieved: true });
      eggSystem.discover(EGG_IDS.BROWSER_NAVIGATOR);
    }
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
    // 触发浏览器领航员彩蛋（计数）
    if (!this.data.navigatorEggAchieved) {
      const counts = { ...this.data.navigatorCounts };
      counts.refresh++;
      this.setData({ navigatorCounts: counts });
      this.checkNavigatorEgg();
    }

    // 触发旋转动画
    this.setData({ isRefreshing: true });

    // 600ms 后移除动画状态（与 CSS 动画时长一致）
    setTimeout(() => {
      this.setData({ isRefreshing: false });
    }, 600);

    this.simulateLoading();
  },

  goHome: function() {
    this.navigateInternal('http://www.navi-2006.com');
  },

  // 工具快捷方式点击 - 在浏览器内打开工具页面
  onToolTap: function(e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      this.navigateInternal(url);
    }
  },

  goBack: function() {
    wx.navigateBack();
  },

  // ==================== 工具页面事件处理 ====================

  // --- 火星翻译事件 ---
  onMarsInput: function(e) {
    this.setData({ marsInput: e.detail.value });
  },

  onMarsModeSelect: function(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      marsModeIndex: index
    });
  },

  onMarsConvert: async function() {
    const text = this.data.marsInput.trim();
    if (!text) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }
    if (this.data.marsIsConverting) return;

    this.setData({
      marsIsConverting: true,
      marsOutput: '正在连接异次元...'
    });

    try {
      const modeKey = this.data.marsModes[this.data.marsModeIndex].key;
      const result = await chatApi.sendMessage(text, [], modeKey);

      if (result && result.reply) {
        this.setData({
          marsOutput: result.reply
        });
        // 触发彩蛋检查
        this.checkMarsEgg();
      } else {
        throw new Error('No reply');
      }
    } catch (err) {
      console.error('Mars convert error:', err);
      this.setData({
        marsOutput: '转换失败：信号被外星人拦截了...'
      });
    } finally {
      this.setData({ marsIsConverting: false });
    }
  },

  onMarsCopy: function() {
    const text = this.data.marsOutput;
    if (!text || text === '正在连接异次元...') {
      return;
    }
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' });
      }
    });
  },

  checkMarsEgg: async function() {
    try {
      const result = await userApi.checkMarsTranslatorEgg();
      if (result.success && result.shouldTrigger) {
        await eggSystem.discover(EGG_IDS.MARS_TRANSLATOR);
      }
    } catch (err) {
      console.error('Check mars egg error:', err);
    }
  },

  // --- 非主流相机事件 ---
  onAvatarChoose: function() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'front',
      success: (res) => {
        this.setData({
          avatarTempPath: res.tempFiles[0].tempFilePath,
          avatarPreview: res.tempFiles[0].tempFilePath
        });
      }
    });
  },

  onAvatarFilter: function(e) {
    this.setData({
      avatarFilter: e.currentTarget.dataset.filter
    });
  },

  onAvatarBorder: function(e) {
    this.setData({
      avatarBorder: e.currentTarget.dataset.border
    });
  },

  onAvatarSave: async function() {
    if (!this.data.avatarTempPath) {
      wx.showToast({ title: '请先选择图片', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '正在处理...' });

    try {
      // 简化版：直接保存原图，仅应用简单滤镜
      let tempPath = this.data.avatarTempPath;

      // 应用滤镜（简化版，仅显示toast提示）
      if (this.data.avatarFilter) {
        wx.showToast({ title: '滤镜已应用', icon: 'success' });
      }

      // 保存到相册
      wx.saveImageToPhotosAlbum({
        filePath: tempPath,
        success: async () => {
          // 上传到云存储
          try {
            const cloudPath = `user-photos/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
            const uploadRes = await wx.cloud.uploadFile({
              cloudPath: cloudPath,
              filePath: tempPath
            });
            await userApi.savePhoto(cloudPath, uploadRes.fileID);
            wx.hideLoading();
            wx.showToast({ title: '已保存！', icon: 'success' });
            this.checkAvatarEgg();
          } catch (err) {
            console.error('Upload error:', err);
            wx.hideLoading();
            wx.showToast({ title: '已保存到相册', icon: 'success' });
            this.checkAvatarEgg();
          }
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({ title: '保存失败', icon: 'none' });
        }
      });
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '处理失败', icon: 'none' });
    }
  },

  checkAvatarEgg: function() {
    if (this.data.avatarEggAchieved) return;
    const newCount = this.data.avatarPhotosSavedCount + 1;
    this.setData({ avatarPhotosSavedCount: newCount });
    if (newCount >= 5) {
      this.setData({ avatarEggAchieved: true });
      eggSystem.discover(EGG_IDS.AVATAR_MASTER);
    }
  },

  // --- 星际探索事件 ---
  onStarDiff: function(e) {
    const diff = e.currentTarget.dataset.diff;
    this.setData({
      starDiff: diff,
      starCols: this.data.starDiffConfig[diff].cols
    });
    this.initStarGame();
  },

  onStarCellTap: function(e) {
    if (this.data.starGameState !== 'playing') return;
    const index = parseInt(e.currentTarget.dataset.index);
    const config = this.data.starDiffConfig[this.data.starDiff];
    const cell = this.data.starGrid[index];

    if (cell.revealed || cell.marked) return;

    if (cell.isBlackHole) {
      this.starGameOver(false);
    } else {
      this.revealStarCell(index, config.rows, config.cols);
      this.checkStarWin();
    }
  },

  onStarCellLongPress: function(e) {
    if (this.data.starGameState !== 'playing') return;
    const index = parseInt(e.currentTarget.dataset.index);
    const cell = this.data.starGrid[index];

    if (!cell.revealed) {
      const grid = this.data.starGrid;
      grid[index].marked = !grid[index].marked;
      this.setData({
        starGrid: grid,
        starBeacons: this.data.starBeacons + (grid[index].marked ? -1 : 1)
      });
    }
  },

  onStarRestart: function() {
    this.initStarGame();
  },

  initStarGame: function() {
    // 清理旧定时器
    if (this.data.starTimer) {
      clearInterval(this.data.starTimer);
    }

    const config = this.data.starDiffConfig[this.data.starDiff];
    const { rows, cols, mines } = config;

    // 生成网格
    const grid = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        grid.push({
          row: r,
          col: c,
          index: r * cols + c,
          isBlackHole: false,
          revealed: false,
          marked: false,
          count: 0
        });
      }
    }

    // 布雷
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const idx = Math.floor(Math.random() * (rows * cols));
      if (!grid[idx].isBlackHole) {
        grid[idx].isBlackHole = true;
        minesPlaced++;
      }
    }

    // 计算数字
    for (let i = 0; i < grid.length; i++) {
      if (!grid[i].isBlackHole) {
        const neighbors = this.getStarNeighbors(grid[i].row, grid[i].col, rows, cols);
        let count = 0;
        neighbors.forEach(nIdx => {
          if (grid[nIdx].isBlackHole) count++;
        });
        grid[i].count = count;
      }
    }

    this.setData({
      starGrid: grid,
      starTime: 0,
      starBeacons: mines,
      starGameState: 'playing'
    });

    // 启动计时器
    const timer = setInterval(() => {
      if (this.data.starTime < 999) {
        this.setData({
          starTime: this.data.starTime + 1
        });
      }
    }, 1000);

    this.setData({ starTimer: timer });
  },

  revealStarCell: function(idx, rows, cols) {
    const grid = this.data.starGrid;
    if (grid[idx].revealed || grid[idx].marked) return;

    grid[idx].revealed = true;

    if (grid[idx].count === 0) {
      const neighbors = this.getStarNeighbors(grid[idx].row, grid[idx].col, rows, cols);
      neighbors.forEach(nIdx => {
        if (!grid[nIdx].revealed) {
          this.revealStarCell(nIdx, rows, cols);
        }
      });
    }

    this.setData({ starGrid: grid });
  },

  getStarNeighbors: function(r, c, rows, cols) {
    const neighbors = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const nr = r + i;
        const nc = c + j;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          neighbors.push(nr * cols + nc);
        }
      }
    }
    return neighbors;
  },

  checkStarWin: function() {
    const grid = this.data.starGrid;
    const unrevealedSafe = grid.filter(c => !c.isBlackHole && !c.revealed);
    if (unrevealedSafe.length === 0) {
      this.starGameOver(true);
    }
  },

  starGameOver: function(win) {
    if (this.data.starTimer) {
      clearInterval(this.data.starTimer);
      this.setData({ starTimer: null });
    }

    const grid = this.data.starGrid;
    if (win) {
      grid.forEach(c => { if (c.isBlackHole) c.marked = true; });
      this.setData({
        starGrid: grid,
        starGameState: 'won',
        starBeacons: 0
      });

      // 触发星际探险家彩蛋
      if (!this.data.starEggAchieved) {
        this.setData({ starEggAchieved: true });
        eggSystem.discover(EGG_IDS.STAR_EXPLORER);
      }

      wx.showToast({ title: '爱没有终点！', icon: 'none' });
    } else {
      grid.forEach(c => { if (c.isBlackHole) c.revealed = true; });
      this.setData({
        starGrid: grid,
        starGameState: 'lost'
      });
      wx.vibrateLong();
    }
  },

  // --- 在线计算器事件 ---
  onCalcInput: function(e) {
    const val = e.currentTarget.dataset.val;
    let expr = this.data.calcExpression;
    let display = this.data.calcDisplay;

    // 如果显示是 '0' 或 'Error'，或者上一次有计算结果，重新开始
    if (display === '0' || display === 'Error') {
      display = val;
      expr = val;
    } else if (this.data.calcLastResult && !expr) {
      // 如果上一次有计算结果且当前表达式为空，使用结果作为起始值
      if (val === '+' || val === '-' || val === '*' || val === '/') {
        // 运算符：基于上一次结果开始新计算
        display = this.data.calcLastResult + val;
        expr = this.data.calcLastResult + val;
      } else {
        // 数字：重新开始
        display = val;
        expr = val;
      }
    } else {
      // 简单验证：防止连续运算符
      const lastChar = expr.slice(-1);
      const operators = '+-*/';

      if (val === '.') {
        // 小数点验证：检查当前数字段是否已有小数点
        const segments = expr.split(new RegExp('[' + operators + ']'));
        const currentSegment = segments[segments.length - 1];
        if (currentSegment.includes('.')) {
          // 当前数字段已有小数点，忽略
          return;
        }
        display += val;
        expr += val;
      } else if (operators.includes(val)) {
        // 运算符输入
        if (operators.includes(lastChar)) {
          // 连续运算符：替换
          display = display.slice(0, -1) + val;
          expr = expr.slice(0, -1) + val;
        } else {
          // 正常追加
          display += val;
          expr += val;
        }
      } else {
        // 数字输入
        display += val;
        expr += val;
      }
    }

    this.setData({
      calcDisplay: display,
      calcExpression: expr
    });
  },

  onCalcClear: function() {
    this.setData({
      calcDisplay: '0',
      calcExpression: '',
      calcLastResult: ''
    });
  },

  onCalcBackspace: function() {
    let display = this.data.calcDisplay;
    let expr = this.data.calcExpression;

    if (display.length > 1) {
      display = display.slice(0, -1);
      expr = expr.slice(0, -1);
    } else {
      display = '0';
      expr = '';
    }

    this.setData({
      calcDisplay: display,
      calcExpression: expr
    });
  },

  onCalcEqual: function() {
    try {
      const expr = this.data.calcExpression;
      if (!expr) return;

      // 检查表达式是否以运算符结尾
      const operators = '+-*/';
      const lastChar = expr.slice(-1);
      if (operators.includes(lastChar)) {
        // 表达式不完整，不计算
        return;
      }

      // 安全计算 - 解析并计算表达式
      const result = this.evaluateExpression(expr);

      if (result === null || isNaN(result) || !isFinite(result)) {
        this.setData({
          calcDisplay: 'Error',
          calcExpression: '',
          calcLastResult: ''
        });
      } else {
        const formatted = String(Math.round(result * 100000000) / 100000000);
        this.setData({
          calcDisplay: formatted,
          calcExpression: '',  // 清空表达式，方便连续计算
          calcLastResult: formatted
        });

        // 触发计算器高手彩蛋（计数）
        if (!this.data.calcEggAchieved) {
          const newCount = this.data.calcCount + 1;
          this.setData({ calcCount: newCount });

          if (newCount >= 10) {
            this.setData({ calcEggAchieved: true });
            eggSystem.discover(EGG_IDS.CALCULATOR_MASTER);
          }
        }
      }
    } catch (err) {
      console.error('计算错误:', err, '表达式:', this.data.calcExpression);
      this.setData({
        calcDisplay: 'Error',
        calcExpression: '',
        calcLastResult: ''
      });
    }
  },

  // 安全的表达式计算器（支持四则运算、小数、连续计算）
  evaluateExpression: function(expr) {
    try {
      // 移除所有空格
      expr = expr.replace(/\s/g, '');

      if (!expr) return null;

      // 解析数字和运算符
      const tokens = [];
      let currentNum = '';
      let hasDecimal = false;

      for (let i = 0; i < expr.length; i++) {
        const char = expr[i];

        if (char === '+' || char === '-' || char === '*' || char === '/') {
          // 遇到运算符，保存当前数字
          if (currentNum !== '') {
            const num = parseFloat(currentNum);
            if (!isNaN(num)) {
              tokens.push(num);
            }
            currentNum = '';
            hasDecimal = false;
          }
          tokens.push(char);
        } else if (char === '.') {
          // 小数点处理
          if (hasDecimal) {
            // 已经有小数点，忽略
            continue;
          }
          currentNum += char;
          hasDecimal = true;
        } else {
          // 数字
          currentNum += char;
        }
      }

      // 保存最后一个数字
      if (currentNum !== '') {
        const num = parseFloat(currentNum);
        if (!isNaN(num)) {
          tokens.push(num);
        }
      }

      // 验证tokens
      if (tokens.length === 0) return null;
      if (tokens.length === 1) return tokens[0];

      // 检查是否以运算符开头或结尾
      const operators = '+-*/';
      if (operators.includes(tokens[0]) || operators.includes(tokens[tokens.length - 1])) {
        return null;
      }

      // 先计算乘除（优先级高）
      let i = 0;
      while (i < tokens.length) {
        if (tokens[i] === '*' || tokens[i] === '/') {
          const left = tokens[i - 1];
          const right = tokens[i + 1];

          if (typeof left !== 'number' || typeof right !== 'number') {
            return null;
          }

          let result;
          if (tokens[i] === '*') {
            result = left * right;
          } else {
            if (right === 0) {
              return 'Error'; // 除以零
            }
            result = left / right;
          }

          tokens.splice(i - 1, 3, result);
          i--;
        }
        i++;
      }

      // 再计算加减（从左到右）
      let result = tokens[0];
      if (typeof result !== 'number') return null;

      for (let i = 1; i < tokens.length; i += 2) {
        const op = tokens[i];
        const num = tokens[i + 1];

        if (typeof num !== 'number') return null;

        if (op === '+') {
          result += num;
        } else if (op === '-') {
          result -= num;
        }
      }

      return result;
    } catch (err) {
      console.error('表达式解析错误:', err, '表达式:', expr);
      return null;
    }
  },

  // --- 天气预报事件 ---
  onWeatherCityInput: function(e) {
    this.setData({ weatherCity: e.detail.value });
  },

  onWeatherSearch: function() {
    this.generateWeatherData();
  },

  initWeather: function() {
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`;
    this.setData({ weatherDate: dateStr });
    this.generateWeatherData();
  },

  generateWeatherData: function() {
    const weathers = [
      { icon: '☀️', desc: '晴朗' },
      { icon: '⛅', desc: '多云' },
      { icon: '☁️', desc: '阴天' },
      { icon: '🌧️', desc: '小雨' },
      { icon: '⛈️', desc: '雷阵雨' },
      { icon: '🌤️', desc: '晴转多云' }
    ];

    const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
    const temp = Math.floor(Math.random() * 20) + 15; // 15-35度

    // 生成未来三天
    const forecast = [];
    const days = ['明天', '后天', '大后天'];
    for (let i = 0; i < 3; i++) {
      const fw = weathers[Math.floor(Math.random() * weathers.length)];
      forecast.push({
        day: days[i],
        icon: fw.icon,
        temp: Math.floor(Math.random() * 15) + 15
      });
    }

    this.setData({
      weatherIcon: randomWeather.icon,
      weatherDesc: randomWeather.desc,
      weatherTemp: temp,
      weatherHumidity: Math.floor(Math.random() * 40) + 30,
      weatherWind: ['东南风', '西北风', '南风', '北风'][Math.floor(Math.random() * 4)] + ' ' + (Math.floor(Math.random() * 3) + 1) + '级',
      weatherAqi: ['优', '良', '轻度污染'][Math.floor(Math.random() * 3)],
      weatherForecast: forecast
    });
  },

  // --- 万年历事件 ---
  onCalendarPrevMonth: function() {
    let month = this.data.calendarMonth - 1;
    let year = this.data.calendarYear;
    if (month < 1) {
      month = 12;
      year--;
    }
    this.setData({
      calendarYear: year,
      calendarMonth: month
    });
    this.generateCalendar();
  },

  onCalendarNextMonth: function() {
    let month = this.data.calendarMonth + 1;
    let year = this.data.calendarYear;
    if (month > 12) {
      month = 1;
      year++;
    }
    this.setData({
      calendarYear: year,
      calendarMonth: month
    });
    this.generateCalendar();
  },

  initCalendar: function() {
    const now = new Date();
    const year = 2006;
    const month = now.getMonth() + 1;

    this.setData({
      calendarYear: year,
      calendarMonth: month
    });

    this.setTodayInfo();
    this.generateCalendar();
  },

  setTodayInfo: function() {
    const now = new Date();
    const year = 2006;
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    this.setData({
      calendarToday: `${year}年${month}月${day}日 ${weekdays[now.getDay()]}`,
      calendarTodayLunar: this.getLunarDate(month, day),
      calendarTodayTerm: this.getSolarTerm(month, day)
    });
  },

  generateCalendar: function() {
    const year = this.data.calendarYear;
    const month = this.data.calendarMonth;

    // 触发时光旅行者彩蛋（查看2006年6月6日）
    if (!this.data.calendarEggAchieved && year === 2006 && month === 6) {
      this.setData({ calendarEggAchieved: true });
      eggSystem.discover(EGG_IDS.CALENDAR_TIME_TRAVELER);
    }

    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay();

    const days = [];

    // 上个月的日期
    const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
    for (let i = startWeekday - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isOtherMonth: true,
        isToday: false
      });
    }

    // 当月日期
    const now = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = (year === 2006 && month === now.getMonth() + 1 && i === now.getDate());
      days.push({
        day: i,
        isOtherMonth: false,
        isToday: isToday,
        lunar: this.getLunarDate(month, i),
        festival: this.getFestival(month, i)
      });
    }

    // 下个月日期
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        isOtherMonth: true,
        isToday: false
      });
    }

    this.setData({ calendarDays: days });
  },

  getLunarDate: function(month, day) {
    // 简化版农历映射
    const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
    const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];

    // 简化计算（非真实农历）
    const baseIndex = (month * 30 + day) % 30;
    return lunarDays[baseIndex];
  },

  getSolarTerm: function(month, day) {
    // 简化版节气
    const terms = {
      1: [[5, '小寒'], [20, '大寒']],
      2: [[4, '立春'], [19, '雨水']],
      3: [[6, '惊蛰'], [21, '春分']],
      4: [[5, '清明'], [20, '谷雨']],
      5: [[6, '立夏'], [21, '小满']],
      6: [[6, '芒种'], [21, '夏至']],
      7: [[7, '小暑'], [23, '大暑']],
      8: [[8, '立秋'], [23, '处暑']],
      9: [[8, '白露'], [23, '秋分']],
      10: [[8, '寒露'], [23, '霜降']],
      11: [[7, '立冬'], [22, '小雪']],
      12: [[7, '大雪'], [22, '冬至']]
    };

    const monthTerms = terms[month];
    if (monthTerms) {
      for (const [d, name] of monthTerms) {
        if (Math.abs(day - d) <= 1) return name;
      }
    }
    return '';
  },

  getFestival: function(month, day) {
    const festivals = {
      1: { 1: '元旦' },
      2: { 14: '情人节' },
      3: { 8: '妇女节', 12: '植树节' },
      4: { 1: '愚人节' },
      5: { 1: '劳动节', 4: '青年节' },
      6: { 1: '儿童节' },
      7: { 1: '建党节' },
      8: { 1: '建军节' },
      9: { 10: '教师节' },
      10: { 1: '国庆节' },
      12: { 25: '圣诞节' }
    };

    return festivals[month]?.[day] || '';
  },

  // 关闭彩蛋发现弹窗
  hideEggDiscoveryDialog: function() {
    this.setData({ showEggDiscoveryDialog: false });
  },

  // 阻止事件冒泡
  stopPropagation: function() {
    // 空函数，仅用于阻止事件冒泡
  }
});