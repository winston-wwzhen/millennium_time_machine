// 五子棋游戏组件
const GRID_COUNT = 19; // 19x19棋盘
const PLAYER_BLACK = 1; // 玩家
const PLAYER_WHITE = 2; // 电脑1
const PLAYER_RED = 3;   // 电脑2

const PLAYER_NAMES = {
  [PLAYER_BLACK]: '玩家 (黑)',
  [PLAYER_WHITE]: '电脑1 (白)',
  [PLAYER_RED]: '电脑2 (红)'
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
    currentPlayer: PLAYER_BLACK,
    difficultyIndex: 1, // 0:简单, 1:中等, 2:困难
    difficultyOptions: ['简单', '中等', '困难'],
    showGameOver: false,
    showDropdown: false,
    winnerTitle: '',
    winnerSubtitle: '',
    winnerIcon: '',
    winnerClass: ''
  },

  observers: {
    'show': function(show) {
      if (show) {
        // 每次显示都重新初始化，确保canvas正确绘制
        this.initGame();
      }
    }
  },

  methods: {
    // 初始化游戏
    initGame() {
      // 重置棋盘和游戏状态
      this.board = Array(GRID_COUNT).fill().map(() => Array(GRID_COUNT).fill(0));
      this.lastMove = null;
      this.gameActive = true;
      this.cellSize = 0;
      this.padding = 0;
      this.canvasWidth = 0;

      // 重置数据状态
      this.setData({
        currentPlayer: PLAYER_BLACK,
        showGameOver: false
      });

      this.initCanvas();
    },

    // 初始化画布
    initCanvas() {
      const query = this.createSelectorQuery();
      query.select('#gobangCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res[0]) return;

          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');

          // 计算画布尺寸
          const dpr = wx.getSystemInfoSync().pixelRatio;
          const containerWidth = Math.min(wx.getSystemInfoSync().windowWidth * 0.9, 650);
          this.canvasWidth = containerWidth;

          canvas.width = this.canvasWidth * dpr;
          canvas.height = this.canvasWidth * dpr;
          ctx.scale(dpr, dpr);

          this.canvas = canvas;
          this.ctx = ctx;

          // 计算棋盘参数
          this.padding = this.canvasWidth * 0.05;
          this.cellSize = (this.canvasWidth - 2 * this.padding) / (GRID_COUNT - 1);

          this.drawBoard();
        });
    },

    // 绘制棋盘
    drawBoard() {
      if (!this.ctx) return;

      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasWidth);

      // 绘制网格线
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#4b3621';

      for (let i = 0; i < GRID_COUNT; i++) {
        // 横线
        ctx.moveTo(this.padding, this.padding + i * this.cellSize);
        ctx.lineTo(this.canvasWidth - this.padding, this.padding + i * this.cellSize);
        // 竖线
        ctx.moveTo(this.padding + i * this.cellSize, this.padding);
        ctx.lineTo(this.padding + i * this.cellSize, this.canvasWidth - this.padding);
      }
      ctx.stroke();

      // 绘制星位 (19路棋盘的星位: 3, 9, 15)
      const stars = [3, 9, 15];
      ctx.fillStyle = '#4b3621';
      for (let r of stars) {
        for (let c of stars) {
          ctx.beginPath();
          ctx.arc(
            this.padding + c * this.cellSize,
            this.padding + r * this.cellSize,
            3, 0, Math.PI * 2
          );
          ctx.fill();
        }
      }

      // 绘制棋子
      for (let r = 0; r < GRID_COUNT; r++) {
        for (let c = 0; c < GRID_COUNT; c++) {
          if (this.board[r][c] !== 0) {
            this.drawPiece(r, c, this.board[r][c]);
          }
        }
      }

      // 标记最后一步
      if (this.lastMove) {
        const x = this.padding + this.lastMove.c * this.cellSize;
        const y = this.padding + this.lastMove.r * this.cellSize;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        if (this.board[this.lastMove.r][this.lastMove.c] === PLAYER_WHITE) {
          ctx.fillStyle = '#ff0000';
        } else {
          ctx.fillStyle = '#00ff00';
        }
        ctx.fill();
      }
    },

    // 绘制棋子
    drawPiece(r, c, player) {
      const ctx = this.ctx;
      const x = this.padding + c * this.cellSize;
      const y = this.padding + r * this.cellSize;
      const radius = this.cellSize * 0.4;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);

      const gradient = ctx.createRadialGradient(
        x - radius / 3, y - radius / 3, radius / 10,
        x, y, radius
      );

      if (player === PLAYER_BLACK) {
        gradient.addColorStop(0, '#666');
        gradient.addColorStop(1, '#000');
      } else if (player === PLAYER_WHITE) {
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, '#ddd');
      } else if (player === PLAYER_RED) {
        gradient.addColorStop(0, '#ff8888');
        gradient.addColorStop(1, '#aa0000');
      }

      ctx.fillStyle = gradient;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fill();
      ctx.shadowColor = 'transparent';
    },

    // 处理点击
    onCanvasTouchStart(e) {
      if (!this.gameActive || this.data.currentPlayer !== PLAYER_BLACK) return;

      const touch = e.touches[0];

      // 获取画布位置
      const query = this.createSelectorQuery();
      query.select('#gobangCanvas')
        .boundingClientRect()
        .exec((res) => {
          if (!res[0]) return;

          const rect = res[0];
          const x = touch.clientX - rect.left;
          const y = touch.clientY - rect.top;

          // 考虑到canvas的实际渲染尺寸
          const scaleX = this.canvasWidth / rect.width;
          const scaleY = this.canvasWidth / rect.height;

          const col = Math.round((x * scaleX - this.padding) / this.cellSize);
          const row = Math.round((y * scaleY - this.padding) / this.cellSize);

          const gridX = this.padding + col * this.cellSize;
          const gridY = this.padding + row * this.cellSize;
          const dist = Math.sqrt((x * scaleX - gridX) ** 2 + (y * scaleY - gridY) ** 2);

          if (dist < this.cellSize / 2.2 && this.isValidMove(row, col)) {
            this.placePiece(row, col, PLAYER_BLACK);
          }
        });
    },

    onCanvasTouchMove() {
      // 防止触摸移动
    },

    onCanvasTouchEnd() {
      // 触摸结束
    },

    // 检查是否有效移动
    isValidMove(r, c) {
      return r >= 0 && r < GRID_COUNT && c >= 0 && c < GRID_COUNT && this.board[r][c] === 0;
    },

    // 落子
    placePiece(r, c, player) {
      this.board[r][c] = player;
      this.lastMove = { r, c };
      this.drawBoard();

      if (this.checkWin(r, c, player)) {
        this.endGame(player);
      } else if (this.checkDraw()) {
        this.endGame(0);
      } else {
        this.switchTurn();
      }
    },

    // 切换回合
    switchTurn() {
      if (!this.gameActive) return;

      const nextPlayer = (this.data.currentPlayer % 3) + 1;
      this.setData({ currentPlayer: nextPlayer });

      if (nextPlayer !== PLAYER_BLACK) {
        // AI回合
        setTimeout(() => this.aiMove(), 500);
      }
    },

    // 检查胜利
    checkWin(row, col, player) {
      const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
      for (let [dr, dc] of directions) {
        let count = 1;
        // 正向
        for (let i = 1; i < 5; i++) {
          const r = row + dr * i;
          const c = col + dc * i;
          if (r < 0 || r >= GRID_COUNT || c < 0 || c >= GRID_COUNT || this.board[r][c] !== player) break;
          count++;
        }
        // 反向
        for (let i = 1; i < 5; i++) {
          const r = row - dr * i;
          const c = col - dc * i;
          if (r < 0 || r >= GRID_COUNT || c < 0 || c >= GRID_COUNT || this.board[r][c] !== player) break;
          count++;
        }
        if (count >= 5) return true;
      }
      return false;
    },

    // 检查平局
    checkDraw() {
      return this.board.every(row => row.every(cell => cell !== 0));
    },

    // 游戏结束
    endGame(winner) {
      this.gameActive = false;

      if (winner === 0) {
        this.setData({
          showGameOver: true,
          winnerTitle: '平局！',
          winnerSubtitle: '棋盘已满，未分胜负。',
          winnerIcon: '🤝',
          winnerClass: 'draw'
        });
      } else {
        this.setData({
          showGameOver: true,
          winnerTitle: `${PLAYER_NAMES[winner]} 获胜！`,
          winnerSubtitle: '五子连珠，精彩绝伦！',
          winnerIcon: winner === PLAYER_BLACK ? '👑' : '🤖',
          winnerClass: winner === PLAYER_BLACK ? 'black' : (winner === PLAYER_WHITE ? 'white' : 'red')
        });
      }
    },

    // AI移动
    aiMove() {
      if (!this.gameActive) return;

      const difficulty = this.data.difficultyIndex; // 0:简单, 1:中等, 2:困难
      const currentPlayer = this.data.currentPlayer;

      // AI参数配置
      let defenseWeight = 0.8;
      let noiseFactor = 500;

      if (difficulty === 0) {
        defenseWeight = 0.4;
        noiseFactor = 4000;
      } else if (difficulty === 1) {
        defenseWeight = 0.85;
        noiseFactor = 500;
      } else if (difficulty === 2) {
        defenseWeight = 1.3;
        noiseFactor = 0;
      }

      let bestScore = -Infinity;
      let bestMoves = [];
      const opponents = [1, 2, 3].filter(p => p !== currentPlayer);

      for (let r = 0; r < GRID_COUNT; r++) {
        for (let c = 0; c < GRID_COUNT; c++) {
          if (this.board[r][c] === 0) {
            const attackScore = this.evaluatePosition(r, c, currentPlayer);
            const defenseScore1 = this.evaluatePosition(r, c, opponents[0]);
            const defenseScore2 = this.evaluatePosition(r, c, opponents[1]);
            const defenseScore = Math.max(defenseScore1, defenseScore2);

            const noise = (Math.random() - 0.5) * noiseFactor;
            let totalScore = attackScore + (defenseScore * defenseWeight) + noise;

            // 关键覆盖
            if (attackScore >= 100000) totalScore = 1000000;
            else if (defenseScore >= 100000) totalScore = 500000;
            else if (difficulty === 2 && defenseScore >= 10000) totalScore = 400000;

            if (totalScore > bestScore) {
              bestScore = totalScore;
              bestMoves = [{ r, c }];
            } else if (Math.abs(totalScore - bestScore) < 10) {
              bestMoves.push({ r, c });
            }
          }
        }
      }

      if (bestMoves.length > 0) {
        const index = difficulty === 2 ? 0 : Math.floor(Math.random() * bestMoves.length);
        const move = bestMoves[index];
        this.placePiece(move.r, move.c, currentPlayer);
      }
    },

    // 评估位置
    evaluatePosition(row, col, player) {
      let score = 0;
      const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

      for (let [dr, dc] of directions) {
        let line = [];
        for (let i = -4; i <= 4; i++) {
          const r = row + dr * i;
          const c = col + dc * i;
          if (r < 0 || r >= GRID_COUNT || c < 0 || c >= GRID_COUNT) {
            line.push(-1);
          } else if (i === 0) {
            line.push(player);
          } else if (this.board[r][c] === player) {
            line.push(player);
          } else if (this.board[r][c] === 0) {
            line.push(0);
          } else {
            line.push(-2);
          }
        }
        score += this.calculateLineScore(line, player);
      }

      // 位置权重（中心优先）
      const center = Math.floor(GRID_COUNT / 2);
      const centerDist = Math.abs(row - center) + Math.abs(col - center);
      score += (GRID_COUNT - 1) - centerDist;

      return score;
    },

    // 计算线段分数
    calculateLineScore(lineArr, player) {
      const str = lineArr.map(val => {
        if (val === player) return 'M';
        if (val === 0) return '.';
        return 'X';
      }).join('');

      let score = 0;

      if (str.includes('MMMMM')) return 100000;
      if (str.includes('.MMMM.') || str.includes('MMMM.') || str.includes('.MMMM')) score += 10000;
      if (str.includes('.MMM.')) score += 5000;
      if (str.includes('XMMMM.') || str.includes('.MMMMX')) score += 2000;
      if (str.includes('XMMM..') || str.includes('..MMMX')) score += 1000;
      if (str.includes('.MM.')) score += 500;
      if (str.match(/M\.MM/) || str.match(/MM\.M/)) score += 800;

      return score;
    },

    // 重新开始
    restartGame() {
      this.board = Array(GRID_COUNT).fill().map(() => Array(GRID_COUNT).fill(0));
      this.lastMove = null;
      this.gameActive = true;

      this.setData({
        currentPlayer: PLAYER_BLACK,
        showGameOver: false
      });

      // 重新初始化canvas以确保正确绘制
      this.initCanvas();
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
    },

    // 阻止冒泡
    stopPropagation() {
      // 空函数，用于阻止事件冒泡
    }
  }
});
