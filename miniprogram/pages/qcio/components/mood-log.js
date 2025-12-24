/**
 * QCIO 空间 - 心情日志生成器组件
 * 用户选择心情 + 关键词，AI 生成火星文日志
 */
Component({
  properties: {
    qcioId: {
      type: String,
      value: ''
    }
  },

  data: {
    // 心情选项
    moods: [
      { id: 'sad', name: '忧伤', icon: '💔', color: '#6666cc' },
      { id: 'passionate', name: '热血', icon: '🔥', color: '#ff6644' },
      { id: 'sweet', name: '甜蜜', icon: '💕', color: '#ff66aa' },
      { id: 'confused', name: '迷茫', icon: '🌫️', color: '#999999' }
    ],
    selectedMood: null,
    keywords: '',
    isGenerating: false,
    logs: [],
    showFullLog: null // 当前展开查看的日志索引
  },

  lifetimes: {
    attached() {
      this.loadLogs();
    }
  },

  methods: {
    // 选择心情
    selectMood(e) {
      const mood = e.currentTarget.dataset.mood;
      this.setData({ selectedMood: mood });
    },

    // 输入关键词
    onKeywordsInput(e) {
      this.setData({ keywords: e.detail.value });
    },

    // 生成日志
    async generateLog() {
      const { selectedMood, keywords } = this.data;

      if (!selectedMood) {
        wx.showToast({ title: '请选择心情', icon: 'none' });
        return;
      }

      if (!keywords.trim()) {
        wx.showToast({ title: '请输入关键词', icon: 'none' });
        return;
      }

      if (keywords.length > 10) {
        wx.showToast({ title: '关键词限10字以内', icon: 'none' });
        return;
      }

      this.setData({ isGenerating: true });

      try {
        // 构建提示词
        const prompt = `心情：${selectedMood.name}\n关键词：${keywords}`;

        // 调用 chat 云函数
        const res = await wx.cloud.callFunction({
          name: 'chat',
          data: {
            userMessage: prompt,
            mode: 'mood_log'
          }
        });

        if (res.result && res.result.success) {
          const content = res.result.reply;

          // 保存到数据库
          await this.saveLog(selectedMood, keywords, content);

          // 重新加载日志列表
          await this.loadLogs();

          // 清空输入
          this.setData({ keywords: '', selectedMood: null });

          wx.showToast({ title: '日志发布成功', icon: 'success' });
        } else {
          throw new Error('生成失败');
        }
      } catch (err) {
        console.error('Generate log error:', err);
        wx.showToast({ title: '生成失败，请重试', icon: 'none' });
      } finally {
        this.setData({ isGenerating: false });
      }
    },

    // 保存日志到数据库
    async saveLog(mood, keywords, content) {
      try {
        await wx.cloud.callFunction({
          name: 'qcio',
          data: {
            action: 'saveMoodLog',
            data: {
              mood_type: mood.id,
              mood_name: mood.name,
              keywords: keywords,
              content: content
            }
          }
        });
      } catch (err) {
        console.error('Save log error:', err);
      }
    },

    // 加载历史日志
    async loadLogs() {
      try {
        const res = await wx.cloud.callFunction({
          name: 'qcio',
          data: {
            action: 'getMoodLogs'
          }
        });

        if (res.result && res.result.success) {
          this.setData({ logs: res.result.data || [] });
        }
      } catch (err) {
        console.error('Load logs error:', err);
      }
    },

    // 展开/收起日志
    toggleLog(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({
        showFullLog: this.data.showFullLog === index ? null : index
      });
    },

    // 复制日志内容
    copyLog(e) {
      const content = e.currentTarget.dataset.content;
      wx.setClipboardData({
        data: content,
        success: () => {
          wx.showToast({ title: '已复制', icon: 'success' });
        }
      });
    }
  }
});
