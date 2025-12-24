// miniprogram/pages/typing/index.js

// 经典千禧年时代文案
const TYPING_PASSAGES = [
  {
    title: "经典 QQ 签名",
    text: "错的不是我，是这个世界。45度角仰望天空，眼泪才不会掉下来。"
  },
  {
    title: "火星文问候",
    text: "╰☆╮ 莪們昰糖，甜到傷悲 ╭★╯ ①①呿看，朲間処処冽愛橫流。"
  },
  {
    title: "非主流语录",
    text: "别流泪，坏人会笑。你的眼睛是用来发现美的，不是用来流泪的。"
  },
  {
    title: "网络流行语",
    text: "偶稀饭粗去玩，泥萌素不素也稀饭？偶觉得素滴，哈哈呵呵嘎嘎。"
  },
  {
    title: "经典歌词",
    text: "天空是绵绵的糖，就算塌下来又怎样。雨下在眼眶里，我也觉得很好看。"
  },
  {
    title: "网名大全",
    text: "葬爱家族、非主流、火星人、杀马特、泪之舞、寂寞在唱歌、微笑着流泪。"
  },
  {
    title: "网络用语",
    text: "886拜拜了，520我爱你，555呜呜呜，996工作制，内卷躺平摆烂。"
  },
  {
    title: "怀旧短信",
    text: "短信一毛一条，我舍不得发。今天发给你这条，因为我想你了。"
  }
];

Page({
  data: {
    currentPassage: null,
    passageIndex: 0,

    // 游戏状态
    gameState: 'ready', // ready, typing, finished

    // 输入相关
    userInput: '',
    correctChars: 0,
    totalChars: 0,
    errors: 0,

    // 统计数据
    timeElapsed: 0,
    wpm: 0,
    accuracy: 0,
    charIndex: 0, // 当前应该输入的字符位置

    // 定时器
    timer: null,

    // 最佳记录
    bestWpm: 0,
    bestAccuracy: 0
  },

  onLoad() {
    // 加载最佳记录
    const bestWpm = wx.getStorageSync('typingBestWpm') || 0;
    const bestAccuracy = wx.getStorageSync('typingBestAccuracy') || 0;
    this.setData({ bestWpm, bestAccuracy });

    // 加载第一段文字
    this.loadPassage(0);
  },

  onUnload() {
    this.stopTimer();
  },

  // 加载新的打字段落
  loadPassage(index) {
    const passageIndex = index % TYPING_PASSAGES.length;
    const currentPassage = TYPING_PASSAGES[passageIndex];
    this.setData({
      currentPassage,
      passageIndex,
      userInput: '',
      correctChars: 0,
      totalChars: 0,
      errors: 0,
      timeElapsed: 0,
      wpm: 0,
      accuracy: 0,
      charIndex: 0,
      gameState: 'ready'
    });
    this.stopTimer();
  },

  // 开始打字
  startTyping() {
    if (this.data.gameState === 'ready') {
      this.setData({ gameState: 'typing' });
      this.startTimer();
    }
  },

  // 输入处理
  onInputChange(e) {
    if (this.data.gameState === 'finished') return;

    // 第一次输入时开始计时
    if (this.data.gameState === 'ready') {
      this.startTyping();
    }

    const userInput = e.detail.value;
    const targetText = this.data.currentPassage.text;

    // 计算正确字符数和错误数
    let correctChars = 0;
    let errors = 0;

    for (let i = 0; i < userInput.length; i++) {
      if (i < targetText.length && userInput[i] === targetText[i]) {
        correctChars++;
      } else if (i < targetText.length) {
        errors++;
      }
    }

    // 计算准确率
    const totalTyped = userInput.length;
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

    this.setData({
      userInput,
      correctChars,
      errors,
      accuracy,
      charIndex: userInput.length
    });

    // 检查是否完成
    if (userInput.length >= targetText.length) {
      this.finishGame();
    }
  },

  // 计时器
  startTimer() {
    this.stopTimer();
    this.data.timer = setInterval(() => {
      const timeElapsed = this.data.timeElapsed + 1;
      this.setData({ timeElapsed });

      // 实时计算 WPM
      this.calculateWPM();
    }, 1000);
  },

  stopTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.data.timer = null;
    }
  },

  // 计算 WPM (Words Per Minute)
  calculateWPM() {
    const { timeElapsed, correctChars } = this.data;
    if (timeElapsed > 0) {
      // 中文按字符计算，标准是 5 个字符算一个 word
      const words = correctChars / 5;
      const wpm = Math.round(words / (timeElapsed / 60));
      this.setData({ wpm });
    }
  },

  // 完成游戏
  finishGame() {
    this.stopTimer();

    const { correctChars, errors, timeElapsed, userInput } = this.data;
    const totalChars = userInput.length;
    const finalAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;

    // 最终 WPM
    const words = correctChars / 5;
    const finalWpm = timeElapsed > 0 ? Math.round(words / (timeElapsed / 60)) : 0;

    this.setData({
      gameState: 'finished',
      wpm: finalWpm,
      accuracy: finalAccuracy
    });

    // 保存最佳记录
    this.saveBestRecord(finalWpm, finalAccuracy);

    // 震动反馈
    wx.vibrateShort();
  },

  // 保存最佳记录
  saveBestRecord(wpm, accuracy) {
    const { bestWpm, bestAccuracy } = this.data;

    if (wpm > bestWpm) {
      this.setData({ bestWpm: wpm });
      wx.setStorageSync('typingBestWpm', wpm);
    }

    if (accuracy > bestAccuracy) {
      this.setData({ bestAccuracy: accuracy });
      wx.setStorageSync('typingBestAccuracy', accuracy);
    }
  },

  // 重新开始当前段落
  restartCurrent() {
    this.setData({
      userInput: '',
      correctChars: 0,
      totalChars: 0,
      errors: 0,
      timeElapsed: 0,
      wpm: 0,
      accuracy: 0,
      charIndex: 0,
      gameState: 'ready'
    });
    this.stopTimer();
  },

  // 下一段
  nextPassage() {
    this.loadPassage(this.data.passageIndex + 1);
  },

  // 上一段
  prevPassage() {
    let newIndex = this.data.passageIndex - 1;
    if (newIndex < 0) newIndex = TYPING_PASSAGES.length - 1;
    this.loadPassage(newIndex);
  },

  // 返回
  goBack() {
    wx.navigateBack();
  }
});
