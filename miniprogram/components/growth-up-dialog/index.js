Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    level: {
      type: Number,
      value: 1
    },
    rewards: {
      type: Array,
      value: []
    },
    type: {
      type: String,
      value: 'normal' // normal/major/milestone
    }
  },

  methods: {
    onClose() {
      this.setData({ visible: false });
      this.triggerEvent('close');
    },

    onShare() {
      this.triggerEvent('share');
    }
  }
});
