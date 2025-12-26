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
    }
  },

  data: {
    icon: '',
    title: ''
  },

  observers: {
    'level': function(level) {
      this.updateLevelDisplay(level);
    }
  },

  methods: {
    updateLevelDisplay(level) {
      const icon = this.getLevelIcon(level);
      const title = this.getLevelTitle(level);

      this.setData({ icon, title });
    },

    getLevelIcon(level) {
      if (!level || level < 1) level = 1;

      if (level <= 4) return `${level}★`;
      if (level <= 8) return `${level - 4}☾`;
      if (level <= 12) return `${level - 8}☼`;
      if (level <= 16) return `${level - 12}♔`;

      const crowns = Math.floor((level - 13) / 4) + 1;
      const diamonds = (level - 13) % 4;
      return diamonds > 0 ? `${crowns}♔${diamonds}♢` : `${crowns}♔`;
    },

    getLevelTitle(level) {
      if (!level || level < 1) level = 1;

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
