/**
 * 彩蛋发现弹窗组件 - Win98 风格
 * 通用的彩蛋发现提示弹窗，可在所有页面和组件中使用
 */
Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    eggName: {
      type: String,
      value: ''
    },
    eggDescription: {
      type: String,
      value: ''
    },
    eggRarity: {
      type: String,
      value: 'common' // common, rare, epic, legendary
    },
    eggRarityName: {
      type: String,
      value: ''
    },
    eggRewardText: {
      type: String,
      value: ''
    }
  },

  methods: {
    // 关闭弹窗
    onClose: function() {
      this.setData({ show: false });
      this.triggerEvent('close');
    },

    // 阻止事件冒泡
    stopPropagation: function() {
      // 空函数，仅用于阻止事件冒泡
    }
  }
});
