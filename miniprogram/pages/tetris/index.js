/**
 * 俄罗斯方块游戏 - Y2K Edition
 * 怀旧风格的经典方块游戏
 */
Page({
  data: {
    board: [],
    currentPiece: null,
    nextPiece: null,
    score: 0,
    level: 1,
    lines: 0,
    isGameOver: false,
    isPaused: false,
    gameLoopId: null
  },

  // 方块定义
  PIECES: {
    I: { shape: [[1,1,1,1]], color: '#00ffff' },
    O: { shape: [[1,1],[1,1]], color: '#ffff00' },
    T: { shape: [[0,1,0],[1,1,1]], color: '#800080' },
    S: { shape: [[0,1,1],[1,1,0]], color: '#00ff00' },
    Z: { shape: [[1,1,0],[0,1,1]], color: '#ff0000' },
    J: { shape: [[1,0,0],[1,1,1]], color: '#0000ff' },
    L: { shape: [[0,0,1],[1,1,1]], color: '#ff8000' }
  },

  onLoad() {
    this.initGame();
  },

  onUnload() {
    this.stopGame();
  },

  initGame() {
    // 创建 10x20 的游戏板
    const board = Array(20).fill(0).map(() => Array(10).fill(0));
    this.setData({
      board,
      score: 0,
      level: 1,
      lines: 0,
      isGameOver: false
    });

    this.spawnPiece();
    this.startGameLoop();
  },

  spawnPiece() {
    const pieces = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const type = pieces[Math.floor(Math.random() * pieces.length)];
    const piece = this.PIECES[type];

    const currentPiece = {
      type,
      shape: piece.shape,
      color: piece.color,
      x: 3,
      y: 0
    };

    this.setData({ currentPiece });

    // 检查游戏结束
    if (this.checkCollision(currentPiece.x, currentPiece.y, currentPiece.shape)) {
      this.gameOver();
    }
  },

  startGameLoop() {
    const speed = Math.max(100, 1000 - (this.data.level - 1) * 100);
    const gameLoopId = setInterval(() => {
      if (!this.data.isPaused && !this.data.isGameOver) {
        this.moveDown();
      }
    }, speed);
    this.setData({ gameLoopId });
  },

  stopGame() {
    if (this.data.gameLoopId) {
      clearInterval(this.data.gameLoopId);
    }
  },

  moveDown() {
    const { currentPiece } = this.data;
    if (!this.checkCollision(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
      currentPiece.y++;
      this.setData({ currentPiece });
    } else {
      this.lockPiece();
      this.clearLines();
      this.spawnPiece();
    }
  },

  moveLeft() {
    const { currentPiece } = this.data;
    if (!this.checkCollision(currentPiece.x - 1, currentPiece.y, currentPiece.shape)) {
      currentPiece.x--;
      this.setData({ currentPiece });
    }
  },

  moveRight() {
    const { currentPiece } = this.data;
    if (!this.checkCollision(currentPiece.x + 1, currentPiece.y, currentPiece.shape)) {
      currentPiece.x++;
      this.setData({ currentPiece });
    }
  },

  rotate() {
    const { currentPiece } = this.data;
    const rotated = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    );

    if (!this.checkCollision(currentPiece.x, currentPiece.y, rotated)) {
      currentPiece.shape = rotated;
      this.setData({ currentPiece });
    }
  },

  checkCollision(x, y, shape) {
    const { board } = this.data;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;

          if (newX < 0 || newX >= 10 || newY >= 20) {
            return true;
          }

          if (newY >= 0 && board[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  },

  lockPiece() {
    const { board, currentPiece } = this.data;
    const newBoard = [...board];

    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col]) {
          const boardY = currentPiece.y + row;
          const boardX = currentPiece.x + col;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      }
    }

    this.setData({ board: newBoard });
  },

  clearLines() {
    const { board } = this.data;
    let linesCleared = 0;
    let newBoard = [...board];

    for (let row = board.length - 1; row >= 0; row--) {
      if (board[row].every(cell => cell !== 0)) {
        newBoard.splice(row, 1);
        newBoard.unshift(Array(10).fill(0));
        linesCleared++;
        row++; // 重新检查这一行
      }
    }

    if (linesCleared > 0) {
      const points = [0, 100, 300, 500, 800];
      const newScore = this.data.score + points[linesCleared] * this.data.level;
      const newLines = this.data.lines + linesCleared;
      const newLevel = Math.floor(newLines / 10) + 1;

      this.setData({
        board: newBoard,
        score: newScore,
        lines: newLines,
        level: newLevel
      });

      // 重启游戏循环以适应新速度
      this.stopGame();
      this.startGameLoop();

      wx.vibrateShort();
    }
  },

  gameOver() {
    this.stopGame();
    this.setData({ isGameOver: true });

    // 保存最高分
    const highScore = wx.getStorageSync('tetris_high_score') || 0;
    if (this.data.score > highScore) {
      wx.setStorageSync('tetris_high_score', this.data.score);
    }
  },

  restartGame() {
    this.initGame();
  },

  goBack() {
    wx.navigateBack();
  }
});
