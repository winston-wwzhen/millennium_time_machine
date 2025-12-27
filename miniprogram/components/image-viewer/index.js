// 图片查看器组件 - Win98 画图风格
Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    fileName: {
      type: String,
      value: '头像.bmp'
    },
    avatarEmoji: {
      type: String,
      value: '👤'
    },
    imageUrl: {
      type: String,
      value: ''
    }
  },

  data: {
    imageInfo: '256 x 256 x 24 位 BMP'
  },

  methods: {
    onClose: function() {
      this.triggerEvent('close');
    },

    stopPropagation: function() {
      // 阻止事件冒泡
    }
  }
});
