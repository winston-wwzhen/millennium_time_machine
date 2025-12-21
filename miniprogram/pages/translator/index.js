Page({
  data: {
    inputText: '',
    outputText: '',
    isProcessing: false,
    statusText: '就绪'
  },

  onInput(e) {
    this.setData({ inputText: e.detail.value });
  },

  // 核心功能：模拟 AI 情绪转译
  translateEmotion() {
    const text = this.data.inputText.trim();
    if (!text) {
      wx.showToast({ title: '先写点什么吧...', icon: 'none' });
      return;
    }

    // 1. 开始处理动画
    this.setData({ 
      isProcessing: true,
      statusText: '正在分析情绪粒子...'
    });

    // 2. 模拟网络请求延迟
    setTimeout(() => {
      const result = this.mockAIProcess(text);
      
      this.setData({
        isProcessing: false,
        outputText: result,
        statusText: '净化完成'
      });
      
      wx.vibrateShort(); // 震动反馈
    }, 1500);
  },

  // 这里的逻辑未来可以替换为真实的 AI 接口 (DeepSeek/ChatGPT)
  // Prompt 设为: "请把这段充满负面情绪的话，改写成 2005 年左右流行的、委婉的、或者带有非主流伤感风格的文明用语。要平和，甚至带点幽默。"
  mockAIProcess(text) {
    let result = text;

    // 简单关键词替换库
    const dictionary = [
      { key: /傻逼|笨蛋|脑残|蠢/g, value: "小可爱" },
      { key: /滚|去死|消失/g, value: "去追寻诗和远方" },
      { key: /烦|讨厌|恶心/g, value: "让偶感到一丝丝忧郁" },
      { key: /老板|领导/g, value: "那个充满个性的大佬" },
      { key: /加班|工作/g, value: "为梦想窒息的时刻" },
      { key: /没钱|穷/g, value: "口袋空空心却自由" },
      { key: /他妈的|TMD|卧槽/g, value: "哎呀呀" },
      { key: /分手|渣男|渣女/g, value: "不懂珍惜偶的过客" }
    ];

    let replaced = false;
    dictionary.forEach(item => {
      if (item.key.test(result)) {
        result = result.replace(item.key, item.value);
        replaced = true;
      }
    });

    // 如果没有触发关键词，随机生成一段“千禧年佛系语录”
    if (!replaced) {
      const templates = [
        "人生就像一场戏，因为有缘才相聚。莫生气，莫生气~",
        "神马都是浮云，开心最重要啦！^_^",
        "听说深呼吸能让心情变好，不如试试看？",
        "虽然偶不知道发生了什么，但愿你面朝大海，春暖花开。",
        "淡定，淡定，冲动是魔鬼哦亲。"
      ];
      return templates[Math.floor(Math.random() * templates.length)];
    }

    // 加上一些千禧年后缀
    const suffixes = ["~", " ^_^", " (仰望天空)", " ..."];
    return result + suffixes[Math.floor(Math.random() * suffixes.length)];
  },

  goBack() {
    wx.navigateBack();
  }
});