/**
 * QCIO 空间 - 留言板组件
 * 从数据库加载留言，支持删除功能
 */
Component({
  data: {
    messages: [],
    loading: true
  },

  lifetimes: {
    attached() {
      this.loadMessages();
    }
  },

  pageLifetimes: {
    show() {
      // 每次页面显示时重新加载留言
      this.loadMessages();
    }
  },

  methods: {
    // 加载留言列表
    async loadMessages() {
      this.setData({ loading: true });

      try {
        const res = await wx.cloud.callFunction({
          name: 'qcio',
          data: { action: 'getGuestbook' }
        });

        if (res.result && res.result.success) {
          const messages = res.result.data || [];

          // 如果没有留言，显示预设的欢迎消息
          if (messages.length === 0) {
            this.setData({
              messages: this.getDefaultMessages(),
              loading: false
            });
          } else {
            this.setData({
              messages: messages,
              loading: false
            });
          }
        } else {
          this.setData({
            messages: this.getDefaultMessages(),
            loading: false
          });
        }
      } catch (err) {
        console.error('Load messages error:', err);
        this.setData({
          messages: this.getDefaultMessages(),
          loading: false
        });
      }
    },

    // 获取默认欢迎消息
    getDefaultMessages() {
      return [
        {
          id: 'welcome_1',
          nickname: '系统消息',
          avatar: '📢',
          content: '欢迎来到你的 QCIO 空间！',
          time: '刚刚',
          isSystem: true
        },
        {
          id: 'welcome_2',
          nickname: '系统消息',
          avatar: '📢',
          content: '去踩一踩其他好友的空间吧，他们会自动给你留言哦~',
          time: '刚刚',
          isSystem: true
        }
      ];
    },

    // 刷新留言
    refreshMessages() {
      this.loadMessages();
      wx.showToast({ title: '刷新成功', icon: 'success' });
    },

    // 删除留言
    async deleteMessage(e) {
      const { id, isSystem } = e.currentTarget.dataset;

      // 系统消息不能删除
      if (isSystem) {
        wx.showToast({ title: '系统消息不能删除', icon: 'none' });
        return;
      }

      const confirmed = await new Promise((resolve) => {
        wx.showModal({
          title: '确认删除',
          content: '确定要删除这条留言吗？',
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
            action: 'deleteGuestbookMessage',
            messageId: id
          }
        });

        // 重新加载留言列表
        await this.loadMessages();

        wx.showToast({ title: '删除成功', icon: 'success' });
      } catch (err) {
        console.error('Delete message error:', err);
        wx.showToast({ title: '删除失败', icon: 'none' });
      } finally {
        wx.hideLoading();
      }
    }
  }
});
