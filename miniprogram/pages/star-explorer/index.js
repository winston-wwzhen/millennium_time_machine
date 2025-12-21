// 难度配置
const DIFFICULTY_LEVELS = {
  beginner: {
    name: '新手探索者',
    rows: 9,
    cols: 9,
    mines: 10,
    icon: '🌟',
    description: '适合初次接触星域探索的冒险者'
  },
  intermediate: {
    name: '资深领航员',
    rows: 16,
    cols: 16,
    mines: 40,
    icon: '🚀',
    description: '具备丰富经验的宇宙旅行者'
  },
  expert: {
    name: '传奇指挥官',
    rows: 16,
    cols: 30,
    mines: 99,
    icon: '💫',
    description: '只有最勇敢的才能挑战极限'
  }
};

Page({
  data: {
    showDifficulty: true, // 是否显示难度选择界面
    currentDifficulty: null,
    difficulty: DIFFICULTY_LEVELS,
    bestRecords: {}, // 最佳记录

    // 游戏数据
    grid: [], // 一维数组存储格子数据
    cellSize: 32, // 根据屏幕宽度动态计算
    gameState: 'playing', // playing, won, lost
    beaconsLeft: 0, // 剩余信标数（原旗帜）
    timeElapsed: 0,
    shake: false, // 控制震动动画类

    // 动画效果
    stars: [], // 星星动画数组
    blackholes: [] // 黑洞动画数组
  },

  timer: null,
  difficultyTimer: null,

  onLoad() {
    // 加载最佳记录
    this.loadBestRecords();
  },

  onUnload() {
    this.stopTimer();
    if (this.difficultyTimer) {
      clearTimeout(this.difficultyTimer);
    }
  },

  // 加载最佳记录
  loadBestRecords() {
    try {
      const records = wx.getStorageSync('starExplorerRecords') || {};
      this.setData({ bestRecords: records });
    } catch (e) {
      console.error('加载记录失败', e);
    }
  },

  // 保存最佳记录
  saveBestRecord() {
    if (this.data.gameState !== 'won') return;

    const level = this.data.currentDifficulty;
    const time = this.data.timeElapsed;
    const records = this.data.bestRecords;

    if (!records[level] || time < records[level]) {
      records[level] = time;
      this.setData({ bestRecords: records });
      wx.setStorageSync('starExplorerRecords', records);

      wx.showToast({
        title: '新纪录！',
        icon: 'success'
      });
    }
  },

  // 选择难度
  selectDifficulty(e) {
    const level = e.currentTarget.dataset.level;
    const difficulty = DIFFICULTY_LEVELS[level];

    this.setData({
      currentDifficulty: level,
      showDifficulty: false,
      beaconsLeft: difficulty.mines
    });

    // 延迟初始化，让界面先切换
    this.difficultyTimer = setTimeout(() => {
      this.initGame(difficulty);
    }, 300);
  },

  // 返回难度选择
  backToDifficulty() {
    this.stopTimer();
    this.setData({
      showDifficulty: true,
      currentDifficulty: null,
      gameState: 'playing',
      shake: false,
      stars: [],
      blackholes: []
    });
  },

  // 计算格子大小以适应屏幕
  calculateCellSize(rows, cols) {
    const { windowWidth, windowHeight } = wx.getSystemInfoSync();
    // 考虑顶部信息栏高度
    const availableHeight = windowHeight * 0.65;
    const availableWidth = windowWidth * 0.9;

    const cellHeight = Math.floor(availableHeight / rows);
    const cellWidth = Math.floor(availableWidth / cols);

    return Math.min(cellHeight, cellWidth, 40); // 最大不超过40px
  },

  // 初始化游戏
  initGame(difficulty) {
    this.stopTimer();
    const { rows, cols, mines } = difficulty;
    const cellSize = this.calculateCellSize(rows, cols);
    const grid = [];

    // 创建格子
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        grid.push({
          row: r,
          col: c,
          isBlackHole: false, // 改为黑洞
          revealed: false,
          marked: false, // 改为标记
          count: 0,
          starRevealed: false // 星星揭示动画标记
        });
      }
    }

    // 布置黑洞
    let blackHolesPlaced = 0;
    while (blackHolesPlaced < mines) {
      const idx = Math.floor(Math.random() * (rows * cols));
      if (!grid[idx].isBlackHole) {
        grid[idx].isBlackHole = true;
        blackHolesPlaced++;
      }
    }

    // 计算周围黑洞数
    for (let i = 0; i < grid.length; i++) {
      if (!grid[i].isBlackHole) {
        const neighbors = this.getNeighbors(grid[i].row, grid[i].col, rows, cols);
        let count = 0;
        neighbors.forEach(nIdx => {
          if (grid[nIdx].isBlackHole) count++;
        });
        grid[i].count = count;
      }
    }

    this.setData({
      grid,
      cellSize,
      gameState: 'playing',
      timeElapsed: 0,
      shake: false,
      stars: [],
      blackholes: []
    });

    // 启动计时器
    this.timer = setInterval(() => {
      this.setData({ timeElapsed: this.data.timeElapsed + 1 });
    }, 1000);
  },

  // 获取周围格子索引
  getNeighbors(r, c, rows, cols) {
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

  // 处理点击 (探索)
  handleTap(e) {
    if (this.data.gameState !== 'playing') return;

    const { row, col } = e.currentTarget.dataset;
    const difficulty = DIFFICULTY_LEVELS[this.data.currentDifficulty];
    const { rows, cols } = difficulty;
    const idx = row * cols + col;
    const cell = this.data.grid[idx];

    if (cell.revealed || cell.marked) return;

    if (cell.isBlackHole) {
      this.gameOver(false);
    } else {
      this.revealCell(idx);
      this.checkWin();
    }
  },

  // 处理长按 (放置信标)
  handleLongPress(e) {
    if (this.data.gameState !== 'playing') return;

    const { row, col } = e.currentTarget.dataset;
    const difficulty = DIFFICULTY_LEVELS[this.data.currentDifficulty];
    const { cols } = difficulty;
    const idx = row * cols + col;
    const grid = this.data.grid;

    // 短震动反馈
    wx.vibrateShort();

    if (!grid[idx].revealed) {
      grid[idx].marked = !grid[idx].marked;
      const beaconsChange = grid[idx].marked ? -1 : 1;

      // 创建标记动画
      if (grid[idx].marked) {
        this.createStarAnimation(e.currentTarget.offsetLeft, e.currentTarget.offsetTop);
      }

      this.setData({
        [`grid[${idx}]`]: grid[idx],
        beaconsLeft: this.data.beaconsLeft + beaconsChange
      });
    }
  },

  // 创建星星动画
  createStarAnimation(x, y) {
    const star = {
      id: Date.now() + Math.random(),
      x,
      y,
      opacity: 1
    };

    this.setData({
      stars: [...this.data.stars, star]
    });

    // 2秒后移除星星
    setTimeout(() => {
      this.setData({
        stars: this.data.stars.filter(s => s.id !== star.id)
      });
    }, 2000);
  },

  // 递归揭开
  revealCell(idx) {
    const grid = this.data.grid;
    if (grid[idx].revealed || grid[idx].marked) return;

    grid[idx].revealed = true;
    grid[idx].starRevealed = true; // 触发星星动画

    // 如果是0，连片揭开
    if (grid[idx].count === 0) {
      const difficulty = DIFFICULTY_LEVELS[this.data.currentDifficulty];
      const { rows, cols } = difficulty;
      const neighbors = this.getNeighbors(grid[idx].row, grid[idx].col, rows, cols);

      // 延迟揭开相邻格子，创造连锁效果
      neighbors.forEach((nIdx, i) => {
        setTimeout(() => {
          this.revealCell(nIdx);
        }, i * 20);
      });
    }

    this.setData({ grid });
  },

  checkWin() {
    const difficulty = DIFFICULTY_LEVELS[this.data.currentDifficulty];
    const unrevealedSafeCells = this.data.grid.filter(c => !c.isBlackHole && !c.revealed);
    if (unrevealedSafeCells.length === 0) {
      this.gameOver(true);
    }
  },

  gameOver(won) {
    this.stopTimer();
    const grid = this.data.grid;

    if (!won) {
      // 失败：显示所有黑洞
      grid.forEach((c, i) => {
        if (c.isBlackHole) {
          c.revealed = true;
          // 创建黑洞吞噬动画
          this.createBlackHoleAnimation(i);
        }
      });
      // 长震动
      wx.vibrateLong();
      this.setData({ shake: true }); // 触发CSS震动动画
    } else {
      // 胜利：自动标记所有黑洞
      grid.forEach(c => {
        if (c.isBlackHole) c.marked = true;
      });
      this.setData({ beaconsLeft: 0 });

      // 保存记录
      this.saveBestRecord();

      // 创建庆祝星星雨
      this.createStarRain();
    }

    this.setData({
      grid,
      gameState: won ? 'won' : 'lost'
    });
  },

  // 创建黑洞动画
  createBlackHoleAnimation(index) {
    const blackhole = {
      id: Date.now() + Math.random() + index,
      index,
      scale: 0.5
    };

    this.setData({
      blackholes: [...this.data.blackholes, blackhole]
    });
  },

  // 创建星星雨
  createStarRain() {
    const stars = [];
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const star = {
          id: Date.now() + Math.random() + i,
          x: Math.random() * 100,
          opacity: 1
        };

        this.setData({
          stars: [...this.data.stars, star]
        });

        // 3秒后移除星星
        setTimeout(() => {
          this.setData({
            stars: this.data.stars.filter(s => s.id !== star.id)
          });
        }, 3000);
      }, i * 100);
    }
  },

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  goBack() {
    if (this.data.showDifficulty) {
      wx.navigateBack();
    } else {
      this.backToDifficulty();
    }
  }
});