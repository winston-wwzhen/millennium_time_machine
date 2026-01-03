// 抢雷大作战 - 扫雷组件
// 规则：挖到数字换人，挖到地雷得分并继续！

const CONFIG = {
  small: { rows: 10, cols: 10, mines: 15, name: '小' },
  medium: { rows: 16, cols: 16, mines: 51, name: '中' }
};

Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    zIndex: {
      type: Number,
      value: 2000,
    },
  },

  data: {
    // 游戏模式
    difficulties: ['small', 'medium'],
    difficultyIndex: 1, // 0:小, 1:中
    difficultyNames: ['小 (10x10)', '中 (16x16)'],

    // 游戏状态
    grid: [], // 二维网格数据
    rows: 0,
    cols: 0,
    totalMines: 0,
    minesFound: 0, // 已发现的地雷数

    // 玩家分数
    scores: { p1: 0, p2: 0 },

    // 当前回合
    turn: 'p1', // 'p1' 或 'p2'

    // 游戏控制
    gameActive: false,
    gameOver: false,

    // AI状态
    aiThinking: false,

    // 下拉菜单
    showDropdown: false,

    // 游戏结束弹窗
    showGameOver: false,
    winnerTitle: '',
    winnerSubtitle: '',
    winnerIcon: '',
    winnerClass: '',
  },

  observers: {
    'show': function(show) {
      if (show && !this.initialized) {
        this.initGame();
      }
    }
  },

  methods: {
    // 初始化游戏
    initGame() {
      const diffKey = this.data.difficulties[this.data.difficultyIndex];
      const config = CONFIG[diffKey];

      this.setData({
        rows: config.rows,
        cols: config.cols,
        totalMines: config.mines,
        minesFound: 0,
        scores: { p1: 0, p2: 0 },
        turn: 'p1',
        gameActive: true,
        gameOver: false,
        showGameOver: false,
        grid: this.createEmptyGrid(config.rows, config.cols),
        aiThinking: false
      });

      this.generateMines();
      this.initialized = true;
    },

    // 创建空网格
    createEmptyGrid(rows, cols) {
      const grid = [];
      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          grid[r][c] = {
            row: r,
            col: c,
            isMine: false,
            isRevealed: false,
            owner: null, // 'p1' 或 'p2'，谁挖到的雷
            neighborMines: 0
          };
        }
      }
      return grid;
    },

    // 生成地雷
    generateMines() {
      const { rows, cols, totalMines, grid } = this.data;

      let minesPlaced = 0;
      while (minesPlaced < totalMines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        if (!grid[r][c].isMine) {
          grid[r][c].isMine = true;
          minesPlaced++;
        }
      }

      // 计算每个格子周围的雷数
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!grid[r][c].isMine) {
            grid[r][c].neighborMines = this.countNeighborMines(r, c);
          }
        }
      }

      this.setData({ grid });
    },

    // 计算周围雷数
    countNeighborMines(row, col) {
      const { grid, rows, cols } = this.data;
      let count = 0;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;

          const nr = row + dr;
          const nc = col + dc;

          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (grid[nr][nc].isMine) count++;
          }
        }
      }

      return count;
    },

    // 处理格子点击
    onCellTap(e) {
      if (!this.data.gameActive || this.data.gameOver) return;

      // AI回合禁止玩家点击
      if (this.data.turn === 'p2') return;
      if (this.data.aiThinking) return;

      const { row, col } = e.currentTarget.dataset;
      this.processMove(row, col);
    },

    // 处理移动
    processMove(row, col) {
      const { grid } = this.data;
      const cell = grid[row][col];

      // 已揭开的格子不能点击
      if (cell.isRevealed) return;

      // 揭开格子
      cell.isRevealed = true;
      this.setData({ grid });

      if (cell.isMine) {
        // 挖到地雷！得分并继续
        this.handleMineHit(cell);
      } else {
        // 挖到数字，换人
        cell.owner = null;
        this.setData({ grid });

        // 如果是空格子（周围无雷），自动展开
        if (cell.neighborMines === 0) {
          this.floodFill(row, col);
        }

        // 切换回合
        this.switchTurn();
      }

      // 检查游戏结束
      this.checkWinCondition();
    },

    // 处理挖到地雷
    handleMineHit(cell) {
      const { grid, turn, minesFound } = this.data;

      cell.owner = turn;

      // 更新分数
      const newScores = this.data.scores;
      newScores[turn]++;

      this.setData({
        grid,
        scores: newScores,
        minesFound: minesFound + 1
      });

      // 挖到地雷奖励：继续回合！不切换

      // 如果当前是AI回合，AI继续
      if (this.data.turn === 'p2' && this.data.gameActive) {
        setTimeout(() => this.aiTurn(), 600);
      }
    },

    // 泛洪填充（展开空格子）
    floodFill(startRow, startCol) {
      const { grid, rows, cols } = this.data;
      const queue = [[startRow, startCol]];
      const visited = new Set([`${startRow},${startCol}`]);

      while (queue.length > 0) {
        const [r, c] = queue.shift();

        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              const neighbor = grid[nr][nc];
              const key = `${nr},${nc}`;

              if (!neighbor.isRevealed && !neighbor.isMine && !visited.has(key)) {
                visited.add(key);
                neighbor.isRevealed = true;

                if (neighbor.neighborMines === 0) {
                  queue.push([nr, nc]);
                }
              }
            }
          }
        }
      }

      this.setData({ grid });
    },

    // 切换回合
    switchTurn() {
      if (!this.data.gameActive) return;

      const newTurn = this.data.turn === 'p1' ? 'p2' : 'p1';
      this.setData({ turn: newTurn });

      // 如果轮到AI
      if (newTurn === 'p2' && this.data.gameActive) {
        setTimeout(() => this.aiTurn(), 600);
      }
    },

    // 检查胜利条件
    checkWinCondition() {
      if (this.data.minesFound === this.data.totalMines) {
        this.endGame();
      }
    },

    // 游戏结束
    endGame() {
      const { scores, mode } = this.data;

      this.setData({
        gameActive: false,
        gameOver: true,
        showGameOver: true
      });

      if (scores.p1 > scores.p2) {
        this.setData({
          winnerTitle: '蓝方 (P1) 获胜!',
          winnerSubtitle: `精彩对决！${scores.p1} : ${scores.p2}`,
          winnerIcon: '🥇',
          winnerClass: 'p1'
        });
      } else if (scores.p2 > scores.p1) {
        this.setData({
          winnerTitle: mode === 'pve' ? '电脑 (P2) 获胜!' : '红方 (P2) 获胜!',
          winnerSubtitle: `精彩对决！${scores.p1} : ${scores.p2}`,
          winnerIcon: mode === 'pve' ? '🤖' : '🥈',
          winnerClass: 'p2'
        });
      } else {
        this.setData({
          winnerTitle: '平局!',
          winnerSubtitle: `势均力敌！${scores.p1} : ${scores.p2}`,
          winnerIcon: '🤝',
          winnerClass: 'draw'
        });
      }
    },

    // AI回合
    aiTurn() {
      if (!this.data.gameActive || this.data.turn !== 'p2') return;

      this.setData({ aiThinking: true });

      const move = this.getBestMove();

      setTimeout(() => {
        this.setData({ aiThinking: false });
        this.processMove(move.row, move.col);
      }, 500);
    },

    // AI决策
    getBestMove() {
      const { grid, rows, cols } = this.data;
      let safeMoves = [];
      let mineMoves = [];

      // 扫描棋盘找确定性的移动
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = grid[r][c];

          if (cell.isRevealed && !cell.isMine && cell.neighborMines > 0) {
            const neighbors = this.getNeighbors(r, c);
            const unrevealed = neighbors.filter(n => !n.isRevealed);
            const revealedMines = neighbors.filter(n => n.isRevealed && n.isMine);

            if (unrevealed.length === 0) continue;

            // 逻辑1: 已找到所有雷，剩余都是安全的
            if (revealedMines.length === cell.neighborMines) {
              unrevealed.forEach(n => safeMoves.push({ row: n.row, col: n.col, priority: 10 }));
            }

            // 逻辑2: 未揭开的数量等于剩余雷数，一定是雷
            if (unrevealed.length === cell.neighborMines - revealedMines.length) {
              unrevealed.forEach(n => mineMoves.push({ row: n.row, col: n.col, priority: 20 }));
            }
          }
        }
      }

      // 优先挖雷（因为得分），其次是安全格子
      if (mineMoves.length > 0) {
        return mineMoves[0];
      }

      if (safeMoves.length > 0) {
        return safeMoves[0];
      }

      // 随机选择一个未揭开的格子
      let allUnrevealed = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!grid[r][c].isRevealed) {
            allUnrevealed.push({ row: r, col: c });
          }
        }
      }

      return allUnrevealed[Math.floor(Math.random() * allUnrevealed.length)];
    },

    // 获取邻居格子
    getNeighbors(row, col) {
      const { grid, rows, cols } = this.data;
      const neighbors = [];

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;

          const nr = row + dr;
          const nc = col + dc;

          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            neighbors.push(grid[nr][nc]);
          }
        }
      }

      return neighbors;
    },

    // 重新开始
    restartGame() {
      this.setData({ showGameOver: false });
      this.initGame();
    },

    // 隐藏游戏结束弹窗
    hideGameOver() {
      this.setData({ showGameOver: false });
    },

    // 关闭组件
    onClose() {
      this.triggerEvent('close');
    },

    // 切换下拉菜单
    toggleDropdown() {
      this.setData({ showDropdown: !this.data.showDropdown });
    },

    // 选择难度
    selectDifficulty(e) {
      const index = parseInt(e.currentTarget.dataset.index);
      this.setData({
        difficultyIndex: index,
        showDropdown: false
      });
      this.initGame();
    },

    // 阻止冒泡
    stopPropagation() {
      // 空函数，用于阻止事件冒泡
    },

    // ==================== 分享相关 ====================

    /**
     * 分享给好友配置
     * 由 button open-type="share" 触发
     */
    onShareAppMessage() {
      const { scores, difficulties, difficultyIndex, winnerTitle } = this.data;
      const diffKey = difficulties[difficultyIndex];
      const diffNames = { small: '小 (10x10)', medium: '中 (16x16)' };

      // 确定胜负结果
      let resultText = '';
      if (winnerTitle.includes('蓝方')) {
        resultText = '蓝方获胜！';
      } else if (winnerTitle.includes('电脑')) {
        resultText = '电脑获胜！';
      } else {
        resultText = '平局！';
      }

      return {
        title: `${resultText} 蓝方${scores.p1} vs 电脑${scores.p2}`,
        path: '/pages/index/index',
        imageUrl: '' // 使用默认截图
      };
    }
  }
});
