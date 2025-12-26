Component({
  properties: {
    currentExp: {
      type: Number,
      value: 0
    },
    level: {
      type: Number,
      value: 1
    },
    showText: {
      type: Boolean,
      value: true
    }
  },

  data: {
    progress: 0,
    needExp: 0,
    levelExp: 0
  },

  observers: {
    'currentExp, level': function(exp, level) {
      this.updateProgress(exp, level);
    }
  },

  methods: {
    updateProgress(exp, level) {
      if (!level || level < 1) level = 1;
      if (!exp || exp < 0) exp = 0;

      const levelExp = this.getExpForLevel(level);
      const nextLevelExp = this.getExpForLevel(level + 1);

      if (nextLevelExp <= levelExp) {
        // 达到最高等级的情况
        this.setData({
          progress: 100,
          needExp: 0,
          levelExp: exp - levelExp
        });
        return;
      }

      const progress = Math.floor(((exp - levelExp) / (nextLevelExp - levelExp)) * 100);
      const needExp = nextLevelExp - exp;

      this.setData({
        progress: Math.min(100, Math.max(0, progress)),
        needExp: Math.max(0, needExp),
        levelExp: Math.max(0, exp - levelExp)
      });
    },

    getExpForLevel(level) {
      if (!level || level < 1) level = 1;

      if (level <= 10) {
        return 50 * level;
      } else if (level <= 20) {
        return 500 + 100 * (level - 10);
      } else if (level <= 30) {
        return 1500 + 200 * (level - 20);
      } else {
        return 3500 + 500 * (level - 30);
      }
    }
  }
});
