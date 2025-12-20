Page({
  data: {
    inputText: '',
    outputText: '等待输扖...',
    // 简易字典，后期可以扩展
    marsDictionary: {
      "我": "莪", "爱": "瑷", "你": "伱", "的": "菂", "是": "素",
      "不": "卟", "人": "銀", "好": "女子", "了": "ㄋ", "在": "茬",
      "有": "冇", "和": "咊", "去": "呿", "做": "莋", "心": "惢",
      "想": "想", "说": "説", "这": "這", "那": "哪", "个": "嗰",
      "美": "媄", "女": "钕", "男": "侽", "朋": "萠", "友": "叐",
      "吗": "嘛", "吧": "罷", "谢": " tйe", "对": "対", "起": "起",
      "哈": "hā", "老": "佬", "公": "厷", "婆": "嘙"
    }
  },

  // 1. 监听输入
  onInput(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  // 2. 核心：转换逻辑
  convertToMars() {
    const text = this.data.inputText;
    if (!text) {
      wx.showToast({ title: '先打字呀笨蛋', icon: 'none' });
      return;
    }

    let result = '';
    const dict = this.data.marsDictionary;

    // 遍历每一个字符进行替换
    for (let char of text) {
      // 如果字典里有，就换；没有就保留原字
      result += dict[char] || char;
    }

    // 随机加点颜文字后缀，增加非主流浓度
    const emojis = ['..', '...', 'o(╥﹏╥)o', '!!', '@@', '^_^'];
    result += emojis[Math.floor(Math.random() * emojis.length)];

    this.setData({
      outputText: result
    });

    // 3. 自动复制到剪贴板
    wx.setClipboardData({
      data: result,
      success: () => {
        wx.showToast({
          title: '已转换并复制',
          icon: 'success'
        });
      }
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  }
});