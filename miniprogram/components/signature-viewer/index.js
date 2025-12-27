// 非主流签名查看器组件
Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    fileName: {
      type: String,
      value: '非主流签名.doc'
    }
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
