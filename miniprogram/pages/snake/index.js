/**
 * 贪吃蛇游戏 - Retro Snake
 * 经典贪吃蛇游戏，Y2K 风格
 */
Page({
  data: {
    board: [],
    snake: [],
    food: null,
    direction: 'right',
    nextDirection: 'right',
    score: 0,
    highScore: 0,
    isGameOver: false,
    isPaused: false,
    gameLoopId: null,
    boardSize: 20,
    gridSize: 15
  },

  onLoad() {
    const highScore = wx.getStorageSync('snake_high_score') || 0;
    this.setData({ highScore });
    this.initGame();
  },

  onUnload() {
    this.stopGame();
  },

  initGame() {
    const boardSize = 20;
    const board = Array(boardSize).fill(0).map(() => Array(boardSize).fill(0));

    // 初始化蛇（3节）
    const snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];

    this.setData({
      board,
      snake,
      direction: 'right',
      nextDirection: 'right',
      score: 0,
      isGameOver: false
    });

    this.spawnFood();
    this.startGameLoop();
  },

  startGameLoop() {
    const gameLoopId = setInterval(() => {
      if (!this.data.isPaused && !this.data.isGameOver) {
        this.gameStep();
      }
    }, 150);
    this.setData({ gameLoopId });
  },

  stopGame() {
    if (this.data.gameLoopId) {
      clearInterval(this.data.gameLoopId);
    }
  },

  gameStep() {
    const { snake, direction, nextDirection, food, boardSize } = this.data;

    // 更新方向
    this.setData({ direction: nextDirection });

    // 计算新头部位置
    const head = { ...snake[0] };
    switch (this.data.direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }

    // 检查碰撞
    if (this.checkCollision(head)) {
      this.gameOver();
      return;
    }

    // 移动蛇
    const newSnake = [head, ...snake];

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
      this.setData({
        snake: newSnake,
        score: this.data.score + 10
      });
      this.spawnFood();
      wx.vibrateShort();
    } else {
      newSnake.pop();
      this.setData({ snake: newSnake });
    }
  },

  checkCollision(head) {
    const { snake, boardSize } = this.data;

    // 撞墙
    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
      return true;
    }

    // 撞自己
    for (let segment of snake) {
      if (segment.x === head.x && segment.y === head.y) {
        return true;
      }
    }

    return false;
  },

  spawnFood() {
    const { snake, boardSize } = this.data;
    let food;

    do {
      food = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize)
      };
    } while (snake.some(s => s.x === food.x && s.y === food.y));

    this.setData({ food });
  },

  changeDirection(e) {
    const newDir = e.currentTarget.dataset.dir;
    const { direction } = this.data;

    // 防止反向
    const opposites = {
      'up': 'down',
      'down': 'up',
      'left': 'right',
      'right': 'left'
    };

    if (opposites[direction] !== newDir) {
      this.setData({ nextDirection: newDir });
    }
  },

  gameOver() {
    this.stopGame();

    const highScore = Math.max(this.data.score, this.data.highScore);
    wx.setStorageSync('snake_high_score', highScore);

    this.setData({
      isGameOver: true,
      highScore
    });
  },

  restartGame() {
    this.stopGame();
    this.initGame();
  },

  goBack() {
    wx.navigateBack();
  }
});
