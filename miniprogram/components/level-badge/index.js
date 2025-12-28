/**
 * 等级徽章组件
 * 显示用户等级图标（星星/月亮/太阳/皇冠/钻石）
 */
Component({
  properties: {
    level: {
      type: Number,
      value: 1
    },
    size: {
      type: String,
      value: 'medium' // small/medium/large
    },
    showTitle: {
      type: Boolean,
      value: false
    },
    showLevelNumber: {
      type: Boolean,
      value: false
    }
  },

  data: {
    icon: '',
    title: '',
    iconClass: ''
  },

  observers: {
    'level, size': function(level, size) {
      this.updateLevelDisplay(level);
      this.updateIconClass(size);
    }
  },

  methods: {
    updateLevelDisplay(level) {
      const icon = this.getLevelIcon(level);
      const title = this.getLevelTitle(level);

      this.setData({ icon, title });
    },

    updateIconClass(size) {
      this.setData({ iconClass: `size-${size}` });
    },

    getLevelIcon(level) {
      // 经典QCIO等级: 4星星=1月亮, 4月亮=1太阳
      const suns = Math.floor(level / 16);
      const moons = Math.floor((level % 16) / 4);
      const stars = level % 4;

      let icon = '';
      if (suns > 0) icon += '☼'.repeat(suns);
      if (moons > 0) icon += '☾'.repeat(moons);
      if (stars > 0) icon += '★'.repeat(stars);

      return icon;
    },

    getLevelTitle(level) {
      if (level <= 4) return '初入江湖';
      if (level <= 8) return '渐入佳境';
      if (level <= 12) return '声名鹊起';
      if (level <= 16) return '风云人物';
      if (level <= 20) return '一代宗师';
      if (level <= 30) return '登峰造极';
      if (level <= 50) return '传说级别';
      return '殿堂神话';
    },

    onBadgeTap() {
      this.triggerEvent('tap', {
        level: this.data.level,
        title: this.data.title
      });
    }
  }
});
