/**
 * QCIO 空间 - 心情日志生成器组件
 * 用户选择心情 + 关键词，AI 生成火星文日志
 * 集成经济系统：发布日志奖励金币（每天前3篇）
 */
const { preventDuplicateBehavior } = require('../../../utils/prevent-duplicate');
const { isNetworkError, setNetworkDisconnected, showDisconnectDialog } = require('../../../utils/network');

Component({
  behaviors: [preventDuplicateBehavior],

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
    showFullLog: null, // 当前展开查看的日志索引
    logStatus: {
      todayCount: 0,
      maxCount: 3,
      remainingCount: 3,
      canEarnReward: true
    }
  },

  lifetimes: {
    attached() {
      this.loadLogStatus();
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

    // 加载日志发布状态
    async loadLogStatus() {
      try {
        const res = await wx.cloud.callFunction({
          name: 'qcio',
          data: { action: 'getMoodLogStatus' }
        });

        if (res.result && res.result.success) {
          this.setData({ logStatus: res.result.data });
        }
      } catch (err) {
        console.error('Load log status error:', err);
      }
    },

    // 生成日志
    generateLog() {
      // 使用防重复点击包装
      this._runWithLock('generateLog', async () => {
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
        wx.showLoading({ title: '生成中...', mask: true });

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
            const saveRes = await this.saveLog(selectedMood, keywords, content);

            if (saveRes && saveRes.success) {
              // 重新加载日志列表和状态
              await this.loadLogs();
              await this.loadLogStatus();

              // 清空输入
              this.setData({ keywords: '', selectedMood: null });

              // 显示发布成功和奖励信息
              const { reward, newBalance } = saveRes.data;
              let msg = '日志发布成功';
              if (reward && reward.coins > 0) {
                msg += `，获得 ${reward.coins} 金币！`;
                // 触发事件刷新钱包，传递新余额
                this.triggerEvent('logpublished', { reward, newBalance });
              } else {
                msg += '（今日奖励次数已用完）';
              }

              wx.showToast({ title: msg, icon: 'success', duration: 2000 });
            } else {
              throw new Error(saveRes?.message || '保存日志失败');
            }
          } else {
            throw new Error(res.result?.message || 'AI生成失败');
          }
        } catch (err) {
          console.error('Generate log error:', err);

          // 检查是否是网络错误（429、超时等）
          if (isNetworkError(err)) {
            const reason = err?.message || '网络连接中断';
            setNetworkDisconnected(reason);
            wx.showToast({ title: '网络连接中断，请重新连接', icon: 'none', duration: 2000 });

            // 延迟显示断网对话框
            setTimeout(() => {
              showDisconnectDialog(reason);
            }, 500);
          } else {
            wx.showToast({ title: '生成失败，请重试', icon: 'none' });
          }
        } finally {
          this.setData({ isGenerating: false });
          wx.hideLoading();
        }
      }, 3000); // 3秒防重复点击（因为涉及AI生成）
    },

    // 保存日志到数据库
    async saveLog(mood, keywords, content) {
      try {
        const res = await wx.cloud.callFunction({
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

        return res.result;
      } catch (err) {
        console.error('Save log error:', err);
        return { success: false };
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

    // 删除日志
    deleteLog(e) {
      // 使用防重复点击包装
      this._runWithLock('deleteLog', async () => {
        const { id, content } = e.currentTarget.dataset;

        const confirmed = await new Promise((resolve) => {
          wx.showModal({
            title: '确认删除',
            content: '确定要删除这篇日志吗？',
            confirmText: '删除',
            confirmColor: '#ff0000',
            success: (res) => resolve(res.confirm)
          });
        });

        if (!confirmed) return;

        try {
          wx.showLoading({ title: '删除中...', mask: true });

          await wx.cloud.callFunction({
            name: 'qcio',
            data: {
              action: 'deleteMoodLog',
              logId: id
            }
          });

          // 重新加载日志列表和状态
          await this.loadLogs();
          await this.loadLogStatus();

          wx.showToast({ title: '删除成功', icon: 'success' });
        } catch (err) {
          console.error('Delete log error:', err);
          wx.showToast({ title: '删除失败', icon: 'none' });
        } finally {
          wx.hideLoading();
        }
      }, 1500); // 1.5秒防重复点击
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
