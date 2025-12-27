// components/my-documents/index.js
Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    zIndex: {
      type: Number,
      value: 2000
    }
  },

  data: {
    showEggFolder: false,
    showDiary: false,
    showSignature: false,
    showImageViewer: false,
    showMyPhotos: false,
    showHelp: false,
    userAvatar: '👤',
    imageUrl: '',
    overlayStyle: ''
  },

  observers: {
    'show': function(newVal) {
      if (newVal) {
        this.addLog('open', '我的文档');
      }
    },
    'zIndex': function(newVal) {
      this.setData({
        overlayStyle: `z-index: ${newVal};`
      });
    }
  },

  methods: {
    // 添加操作日志
    addLog: function(action, target, details) {
      wx.cloud.callFunction({
        name: 'user',
        data: {
          type: 'addLog',
          action: action,
          target: target,
          details: details || ''
        }
      }).catch(err => {
        console.error('添加日志失败:', err);
      });
    },
    onClose: function() {
      this.triggerEvent('close');
    },

    stopPropagation: function() {
      // 阻止事件冒泡
    },

    onEggFolderTap: function() {
      this.setData({ showEggFolder: true });
    },

    onCloseEggFolder: function() {
      this.setData({ showEggFolder: false });
    },

    onDiaryTap: function() {
      this.setData({ showDiary: true });
    },

    onCloseDiary: function() {
      this.setData({ showDiary: false });
    },

    onSignatureTap: function() {
      this.setData({ showSignature: true });
    },

    onCloseSignature: function() {
      this.setData({ showSignature: false });
    },

    onAvatarTap: async function() {
      try {
        // 从云数据库获取用户头像
        const res = await wx.cloud.callFunction({
          name: 'user',
          data: { type: 'getBalance' }
        });

        if (res.result.success) {
          const avatar = res.result.avatar || '👤';

          // 判断是否为图片URL（以http开头）
          const isImageUrl = avatar.startsWith('http') || avatar.startsWith('cloud://');

          this.setData({
            showImageViewer: true,
            userAvatar: isImageUrl ? '' : avatar,
            imageUrl: isImageUrl ? avatar : ''
          });
        } else {
          // 失败时使用默认头像
          this.setData({
            showImageViewer: true,
            userAvatar: '👤',
            imageUrl: ''
          });
        }
      } catch (e) {
        console.error('获取头像失败:', e);
        // 出错时使用默认头像
        this.setData({
          showImageViewer: true,
          userAvatar: '👤',
          imageUrl: ''
        });
      }
    },

    onCloseImageViewer: function() {
      this.setData({ showImageViewer: false });
    },

    onMyPhotosTap: function() {
      this.setData({ showMyPhotos: true });
    },

    onCloseMyPhotos: function() {
      this.setData({ showMyPhotos: false });
    },

    onHelpTap: function() {
      this.setData({ showHelp: true });
    },

    onCloseHelp: function() {
      this.setData({ showHelp: false });
    }
  }
});
