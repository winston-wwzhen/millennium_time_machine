// 导入事件和结局数据
const eventsData = require('../../data/ifthen-events.js');
const endingsData = require('../../data/ifthen-endings.js');

// 游戏引擎 - 事件处理和结局计算
const gameEngine = {
  // 用户状态
  userState: {
    birthYear: 1990,
    gender: 'male',
    currentYear: 2005,
    age: 15,
    attributes: {
      tech_skill: 50,
      social: 50,
      wealth: 50,
      health: 80,
      happiness: 70,
      charm: 50,
      luck: 50,
      education: 60
    },
    flags: {},
    history: {
      choices: [],
      events: []
    }
  },

  // 初始化游戏
  initGame: function(birthYear, gender) {
    this.userState.birthYear = birthYear;
    this.userState.gender = gender;
    this.userState.currentYear = 2005;
    this.userState.age = 2005 - birthYear;
    this.userState.flags = {};
    this.userState.history = { choices: [], events: [] };

    // 根据年龄初始化属性
    const age = this.userState.age;
    if (age <= 12) {
      this.userState.attributes.education = 20;
      this.userState.attributes.social = 30;
    } else if (age <= 18) {
      this.userState.attributes.education = 40;
      this.userState.attributes.social = 50;
    } else if (age <= 25) {
      this.userState.attributes.education = 60;
      this.userState.attributes.wealth = 40;
    } else if (age <= 40) {
      this.userState.attributes.wealth = 60;
      this.userState.attributes.health = 70;
    } else {
      this.userState.attributes.wealth = 50;
      this.userState.attributes.health = 60;
    }

    return this.userState;
  },

  // 获取下一个事件
  getNextEvent: function() {
    const currentYear = this.userState.currentYear;
    const age = this.userState.age;
    const gender = this.userState.gender;

    // 从事件数据中筛选符合条件的事件
    const availableEvents = eventsData.filter(event => {
      // 检查年份
      if (event.year !== currentYear) return false;

      // 检查年龄范围
      if (event.trigger.ageRange) {
        const [minAge, maxAge] = event.trigger.ageRange;
        if (age < minAge || age > maxAge) return false;
      }

      // 检查性别
      if (event.trigger.gender && event.trigger.gender !== gender) {
        return false;
      }

      // 检查必需的标记
      if (event.trigger.requireFlags && event.trigger.requireFlags.length > 0) {
        for (let flag of event.trigger.requireFlags) {
          if (!this.userState.flags[flag]) return false;
        }
      }

      // 检查排除的标记
      if (event.trigger.excludeFlags && event.trigger.excludeFlags.length > 0) {
        for (let flag of event.trigger.excludeFlags) {
          if (this.userState.flags[flag]) return false;
        }
      }

      return true;
    });

    // 随机选择一个事件
    if (availableEvents.length > 0) {
      return availableEvents[Math.floor(Math.random() * availableEvents.length)];
    }

    return null;
  },

  // 应用选择的效果
  applyChoice: function(choice) {
    // 更新属性
    if (choice.effects) {
      for (let attr in choice.effects) {
        if (this.userState.attributes[attr] !== undefined) {
          this.userState.attributes[attr] += choice.effects[attr];
          // 限制属性范围 0-100
          this.userState.attributes[attr] = Math.max(0, Math.min(100, this.userState.attributes[attr]));
        }
      }
    }

    // 设置标记
    if (choice.flags) {
      for (let flag in choice.flags) {
        this.userState.flags[flag] = choice.flags[flag];
      }
    }

    // 记录历史
    this.userState.history.choices.push({
      year: this.userState.currentYear,
      eventId: this.getCurrentEvent().id,
      choice: choice.text
    });

    return choice.result || '';
  },

  // 前进一年
  advanceYear: function() {
    this.userState.currentYear++;
    this.userState.age++;

    // 健康属性随年龄下降
    if (this.userState.age > 40) {
      this.userState.attributes.health -= 1;
    }
  },

  // 计算结局
  calculateEnding: function() {
    const applicableEndings = endingsData.filter(ending => {
      // 检查年龄条件
      if (ending.conditions.ageRange) {
        const ageIn2005 = 2005 - this.userState.birthYear;
        const [min, max] = ending.conditions.ageRange;
        if (ageIn2005 < min || ageIn2005 > max) return false;
      }

      // 检查最小属性要求
      if (ending.conditions.minAttributes) {
        for (let attr in ending.conditions.minAttributes) {
          if (this.userState.attributes[attr] < ending.conditions.minAttributes[attr]) {
            return false;
          }
        }
      }

      // 检查最大属性限制
      if (ending.conditions.maxAttributes) {
        for (let attr in ending.conditions.maxAttributes) {
          if (this.userState.attributes[attr] > ending.conditions.maxAttributes[attr]) {
            return false;
          }
        }
      }

      // 检查必需标记
      if (ending.conditions.requireFlags) {
        for (let flag of ending.conditions.requireFlags) {
          if (!this.userState.flags[flag]) return false;
        }
      }

      // 检查排除标记
      if (ending.conditions.excludeFlags) {
        for (let flag of ending.conditions.excludeFlags) {
          if (this.userState.flags[flag]) return false;
        }
      }

      return true;
    });

    // 根据权重随机选择结局
    if (applicableEndings.length > 0) {
      const weights = applicableEndings.map(e => e.weight || 1);
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);

      let random = Math.random() * totalWeight;
      for (let i = 0; i < applicableEndings.length; i++) {
        random -= (applicableEndings[i].weight || 1);
        if (random <= 0) {
          return applicableEndings[i];
        }
      }
    }

    // 默认结局
    return endingsData.find(e => e.id === 'ending_normal') || endingsData[0];
  },

  // 获取当前事件（临时存储）
  getCurrentEvent: function() {
    return this.currentEvent;
  },

  // 设置当前事件
  setCurrentEvent: function(event) {
    this.currentEvent = event;
  }
};

Page({
  data: {
    // 游戏状态
    gameStarted: false,
    gameEnded: false,

    // 当前事件
    currentEvent: null,
    showEventCard: false,

    // 用户信息
    birthYear: 1990,
    gender: 'male',
    age: 15,
    currentYear: 2005,

    // 人物属性
    attributes: {
      tech_skill: 50,
      social: 50,
      wealth: 50,
      health: 80,
      happiness: 70,
      charm: 50,
      luck: 50,
      education: 60
    },

    // 结局信息
    ending: null,
    showEnding: false,

    // 动画控制
    eventCardVisible: false,
    choiceResultVisible: false,
    currentResult: '',
  },

  onLoad: function(options) {
    const birthYear = parseInt(options.birthYear) || 1990;
    const gender = options.gender || 'male';

    this.setData({
      birthYear,
      gender,
      age: 2005 - birthYear
    });

    // 初始化游戏引擎
    gameEngine.initGame(birthYear, gender);

    // 开始游戏循环
    setTimeout(() => {
      this.gameLoop();
    }, 500);
  },

  // 游戏主循环
  gameLoop: function() {
    if (this.data.currentYear > 2025) {
      this.endGame();
      return;
    }

    // 获取下一个事件
    const event = gameEngine.getNextEvent();
    gameEngine.setCurrentEvent(event);

    if (event) {
      this.setData({
        currentEvent: event,
        showEventCard: true,
        eventCardVisible: true,
        choiceResultVisible: false
      });

      // 记录事件到历史
      this.data.gameStarted = true;
    } else {
      // 没有符合条件的事件，直接前进到下一年
      this.advanceToNextYear();
    }
  },

  // 做出选择
  makeChoice: function(e) {
    const choiceIndex = e.currentTarget.dataset.index;
    const event = this.data.currentEvent;
    const choice = event.choices[choiceIndex];

    // 应用选择效果
    const result = gameEngine.applyChoice(choice);

    // 更新用户状态
    this.setData({
      attributes: { ...gameEngine.userState.attributes },
      choiceResultVisible: true,
      currentResult: result
    });

    // 延迟后前进到下一年
    setTimeout(() => {
      this.advanceToNextYear();
    }, 2000);
  },

  // 前进到下一年
  advanceToNextYear: function() {
    gameEngine.advanceYear();

    this.setData({
      currentYear: gameEngine.userState.currentYear,
      age: gameEngine.userState.age,
      showEventCard: false
    });

    // 继续游戏循环
    setTimeout(() => {
      this.gameLoop();
    }, 500);
  },

  // 结束游戏
  endGame: function() {
    const ending = gameEngine.calculateEnding();

    this.setData({
      ending,
      showEnding: true,
      gameEnded: true
    });
  },

  // 重新开始
  restartGame: function() {
    wx.redirectTo({
      url: '/pages/ifthen/start'
    });
  },

  // 返回首页
  goHome: function() {
    wx.navigateBack();
  }
});
