// miniprogram/pages/star-explorer/index.js

const DIFFICULTY_LEVELS = {
  beginner: {
    name: '★微笑着流泪★', // 原新手
    desc: '9x9 (入门)',
    rows: 9,
    cols: 9,
    mines: 10
  },
  intermediate: {
    name: '◆寂寞在唱歌◆', // 原资深
    desc: '16x16 (进阶)',
    rows: 16,
    cols: 16,
    mines: 40
  },
  expert: {
    name: '☣被伤过的心☣', // 原传奇
    desc: '16x30 (极限)',
    rows: 16,
    cols: 30,
    mines: 99
  }
};

// 随机生成的抽象语录
const EMO_QUOTES = [
  "错的不是我，是这个世界...",
  "莪們是糖，甜到忧伤。",
  "别流泪，坏人会笑。",
  "45度角仰望天空。",
  "葬爱家族，永远不死。"
];

Page({
  data: {
    difficulty: DIFFICULTY_LEVELS,
    currentDifficulty: 'beginner',
    showGameMenu: false,
    
    grid: [],
    cellSize: 32,
    gameState: 'ready', // ready, playing, won, lost
    beaconsLeft: 10,
    timeElapsed: 0,
    
    // 动态标题
    headerTitle: '葬爱·扫雷.exe',
    randomQuote: EMO_QUOTES[0],
    
    bestRecords: {}
  },

  timer: null,

  onLoad() {
    this.loadBestRecords();
    this.initGame(DIFFICULTY_LEVELS[this.data.currentDifficulty]);
    
    // 随机显示一句非主流语录
    const randomIdx = Math.floor(Math.random() * EMO_QUOTES.length);
    this.setData({ randomQuote: EMO_QUOTES[randomIdx] });
  },

  onUnload() {
    this.stopTimer();
  },

  // --- 菜单逻辑 ---

  toggleGameMenu() {
    this.setData({
      showGameMenu: !this.data.showGameMenu
    });
  },

  closeMenu() {
    this.setData({
      showGameMenu: false
    });
  },

  menuRestart() {
    this.closeMenu();
    this.resetGame();
  },

  changeDifficulty(e) {
    const level = e.currentTarget.dataset.level;
    
    this.setData({
      currentDifficulty: level,
      showGameMenu: false
    });

    const config = DIFFICULTY_LEVELS[level];
    const cellSize = this.calculateCellSize(config.rows, config.cols);
    this.setData({ cellSize });

    this.initGame(config);
  },

  exitGame() {
    wx.navigateBack();
  },

  // --- 核心逻辑 ---

  calculateCellSize(rows, cols) {
    const { windowWidth, windowHeight } = wx.getSystemInfoSync();
    
    // 减去窗口边框和内边距
    const maxWidth = windowWidth - 40; 
    const maxHeight = windowHeight - 200; // 稍微留多一点空间给顶部的语录

    let sizeW = Math.floor(maxWidth / cols);
    let sizeH = Math.floor(maxHeight / rows);
    let size = Math.min(sizeW, sizeH);

    // 保证新手模式下格子够大，撑满屏幕
    return Math.min(Math.max(size, 28), 80);
  },

  initGame(config) {
    this.stopTimer();
    
    // 确保尺寸正确
    const cellSize = this.calculateCellSize(config.rows, config.cols);
    this.setData({ cellSize });

    const { rows, cols, mines } = config;
    const grid = [];

    // 生成格子
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

    // 随机布雷 (心碎)
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
      beaconsLeft: mines,
      timeElapsed: 0,
      gameState: 'playing'
    });

    this.timer = setInterval(() => {
      if (this.data.timeElapsed < 999) {
        this.setData({
          timeElapsed: this.data.timeElapsed + 1
        });
      }
    }, 1000);
  },

  resetGame() {
    const config = DIFFICULTY_LEVELS[this.data.currentDifficulty];
    // 重置时换一句语录
    const randomIdx = Math.floor(Math.random() * EMO_QUOTES.length);
    this.setData({ randomQuote: EMO_QUOTES[randomIdx] });
    this.initGame(config);
  },

  // --- 交互事件 ---

  handleTap(e) {
    if (this.data.gameState !== 'playing') return;
    if (this.data.showGameMenu) {
      this.closeMenu();
      return;
    }

    const { row, col } = e.currentTarget.dataset;
    const config = DIFFICULTY_LEVELS[this.data.currentDifficulty];
    const idx = row * config.cols + col;
    const cell = this.data.grid[idx];

    if (cell.revealed || cell.marked) return;

    if (cell.isBlackHole) {
      this.gameOver(false);
    } else {
      this.revealCell(idx, config.rows, config.cols);
      this.checkWin();
    }
  },

  handleLongPress(e) {
    if (this.data.gameState !== 'playing') return;
    if (this.data.showGameMenu) {
        this.closeMenu();
        return;
    }

    wx.vibrateShort({ type: 'heavy' });

    const { row, col } = e.currentTarget.dataset;
    const config = DIFFICULTY_LEVELS[this.data.currentDifficulty];
    const idx = row * config.cols + col;
    const cellPath = `grid[${idx}]`;
    const cell = this.data.grid[idx];

    if (!cell.revealed) {
      const isMarked = !cell.marked;
      this.setData({
        [`${cellPath}.marked`]: isMarked,
        beaconsLeft: this.data.beaconsLeft + (isMarked ? -1 : 1)
      });
    }
  },

  revealCell(idx, rows, cols) {
    const grid = this.data.grid;
    if (grid[idx].revealed || grid[idx].marked) return;

    grid[idx].revealed = true;

    if (grid[idx].count === 0) {
      const neighbors = this.getNeighbors(grid[idx].row, grid[idx].col, rows, cols);
      neighbors.forEach(nIdx => {
        if (!grid[nIdx].revealed) {
          this.revealCell(nIdx, rows, cols);
        }
      });
    }

    this.setData({ grid });
  },

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

  checkWin() {
    const grid = this.data.grid;
    const unrevealedSafeCells = grid.filter(c => !c.isBlackHole && !c.revealed);
    if (unrevealedSafeCells.length === 0) {
      this.gameOver(true);
    }
  },

  gameOver(win) {
    this.stopTimer();
    const grid = this.data.grid;

    if (win) {
      grid.forEach(c => { if (c.isBlackHole) c.marked = true; });
      this.setData({ 
        grid,
        gameState: 'won',
        beaconsLeft: 0,
        headerTitle: '☆伱是莪的唯一☆'
      });
      this.saveBestRecord();
      
      wx.showToast({ title: '爱 没 有 终 点', icon: 'none' });
    } else {
      grid.forEach(c => { if (c.isBlackHole) c.revealed = true; });
      this.setData({ 
        grid, 
        gameState: 'lost',
        headerTitle: '💔心碎了无痕💔'
      });
      wx.vibrateLong();
    }
  },

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  
  loadBestRecords() {
    const records = wx.getStorageSync('starExplorerRecords') || {};
    this.setData({ bestRecords: records });
  },

  saveBestRecord() {
    const level = this.data.currentDifficulty;
    const time = this.data.timeElapsed;
    const records = this.data.bestRecords;

    if (!records[level] || time < records[level]) {
      records[level] = time;
      this.setData({ bestRecords: records });
      wx.setStorageSync('starExplorerRecords', records);
    }
  }
});