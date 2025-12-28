// 火星文翻译器页面
const { chatApi } = require('../../utils/api-client');

Page({
  data: {
    inputText: '',
    resultText: '', // 存放 AI 生成的结果
    isLoading: false,
    // 预设一些非主流背景图或装饰，这里保持原样即可
  },

  onInput(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  // ✨ 核心：点击"转译"
  async onTranslate() {
    const text = this.data.inputText.trim();

    if (!text) {
      wx.showToast({ title: '写点心事吧...', icon: 'none' });
      return;
    }

    if (this.data.isLoading) return;

    this.setData({
      isLoading: true,
      resultText: '正在连接葬爱家族服务器...'
    });

    try {
      // 调用聊天 API，模式设为 'emo'
      const result = await chatApi.sendMessage(text, [], 'emo');

      if (result && result.success) {
        this.setData({
          resultText: result.reply
        });

        // 自动震动反馈
        wx.vibrateShort();
      } else {
        this.setData({ resultText: '心情太沉重，转译失败了...' });
      }

    } catch (err) {
      console.error(err);
      this.setData({ resultText: '断网了，连悲伤都无法传递...' });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // 复制功能
  onCopy() {
    if (!this.data.resultText) return;
    wx.setClipboardData({
      data: this.data.resultText,
      success: () => {
        wx.showToast({ title: '已复制到签名', icon: 'success' });
      }
    });
  },

  // [新增] 关闭页面
  onClose() {
    wx.navigateBack();
  },

  // [新增] 最小化（装饰性功能）
  onMinimize() {
    wx.showToast({
      title: '已最小化到任务栏',
      icon: 'none'
    });
  },

  // [新增] 最大化（装饰性功能）
  onMaximize() {
    wx.showToast({
      title: '当前已是最大化',
      icon: 'none'
    });
  },
});