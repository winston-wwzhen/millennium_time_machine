// 导入事件、结局和叙事数据
const eventsData = require('../../data/ifthen-events.js');
const endingsData = require('../../data/ifthen-endings.js');
const narrativesData = require('../../data/ifthen-narratives.js');
const { userApi, gameApi } = require('../../utils/api-client');

// 游戏引擎 - 事件处理和结局计算
const gameEngine = {
  // 用户状态
  userState: {
    birthYear: 1990,
    gender: 'male',
    currentYear: 2006,
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
    this.userState.currentYear = 2006;
    this.userState.age = 2006 - birthYear;
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
    const yearSpecificEvents = eventsData.filter(event => {
      // 检查年份 - 必须匹配当前年份
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

    // 筛选日常事件(year为null的事件，包含 daily 类别)
    const lifeEvents = eventsData.filter(event => {
      // 检查年份 - 必须为null(日常事件)
      if (event.year !== null) return false;

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

    // 优先返回年份特定事件(60%),如果没有则返回日常事件(40%)
    if (yearSpecificEvents.length > 0 && Math.random() < 0.6) {
      return yearSpecificEvents[Math.floor(Math.random() * yearSpecificEvents.length)];
    }

    if (lifeEvents.length > 0) {
      return lifeEvents[Math.floor(Math.random() * lifeEvents.length)];
    }

    // 如果都没有,返回年份特定事件
    if (yearSpecificEvents.length > 0) {
      return yearSpecificEvents[Math.floor(Math.random() * yearSpecificEvents.length)];
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
      choice: choice.text,
      eventTitle: this.getCurrentEvent().title
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
      // 检查年龄条件 - 使用游戏结束时的实际年龄
      if (ending.conditions.ageRange) {
        const finalAge = this.userState.age;
        const [min, max] = ending.conditions.ageRange;
        if (finalAge < min || finalAge > max) return false;
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
  },

  // 获取年龄相关叙事片段
  getAgeNarrative: function() {
    const age = this.userState.age;
    const gender = this.userState.gender;

    // 筛选符合年龄和性别的叙事片段
    const matchedNarratives = narrativesData.filter(narrative => {
      // 排除年份特定的叙事（年份特定叙事应该由 getYearNarrative 处理）
      if (narrative.year) {
        return false;
      }

      // 必须有年龄范围
      if (!narrative.ageRange) {
        return false;
      }

      const [minAge, maxAge] = narrative.ageRange;
      if (age < minAge || age > maxAge) return false;

      if (narrative.gender && narrative.gender !== gender) {
        return false;
      }
      return true;
    });

    if (matchedNarratives.length > 0) {
      const narrative = matchedNarratives[Math.floor(Math.random() * matchedNarratives.length)];
      const narratives = narrative.narratives;
      return narratives[Math.floor(Math.random() * narratives.length)];
    }

    return null;
  },

  // 获取年份相关叙事片段
  getYearNarrative: function() {
    const year = this.userState.currentYear;

    // 查找特定年份的叙事
    const yearNarrative = narrativesData.find(n => n.year === year);
    if (yearNarrative && yearNarrative.narratives) {
      return yearNarrative.narratives[Math.floor(Math.random() * yearNarrative.narratives.length)];
    }

    return null;
  },

  // 获取生活叙事（优先年份叙事，其次年龄叙事）
  getLifeNarrative: function() {
    // 30%概率显示年份叙事，70%显示年龄叙事
    if (Math.random() < 0.3) {
      const yearNarrative = this.getYearNarrative();
      if (yearNarrative) return yearNarrative;
    }

    return this.getAgeNarrative();
  }
};

Page({
  data: {
    // 游戏状态
    gameStarted: false,
    gameEnded: false,
    isNavigating: false, // 防止重复跳转

    // 当前事件
    currentEvent: null,
    showEventCard: false,

    // 用户信息
    birthYear: 1990,
    gender: 'male',
    age: 15,
    currentYear: 2006,

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

    // 叙事系统
    showNarrative: false,
    currentNarrative: '',
    narrativeType: 'age', // 'age' or 'year'

    // 时光轴
    timelineData: [],
    currentTimelineIndex: -1,

    // 打字机控制
    isTyping: false,
    typingTimers: [] // 存储打字机的定时器，用于清除
  },

  onLoad: async function(options) {
    // 记录游戏开始时间（用于计算游戏时长）
    this.gameStartTime = Date.now();

    const birthYear = parseInt(options.birthYear) || 1990;
    const gender = options.gender || 'male';
    const age = 2006 - birthYear;
    const genderText = gender === 'male' ? '男孩' : '女孩';

    // 等待获取用户信息完成后再开始游戏
    await this.loadUserInfo();

    this.setData({
      birthYear,
      gender,
      age: age
    });

    // 初始化游戏引擎
    gameEngine.initGame(birthYear, gender);

    // 初始时间轴为空，稍后通过打字机添加
    this.setData({
      timelineData: [],
      currentTimelineIndex: -1
    });

    // 延迟后开始第一个叙事
    setTimeout(() => {
      const birthNarrative = gender === 'male'
        ? `一声啼哭划破了${birthYear}年的宁静，你作为男孩降生到这个世界。从此，一段独一无二的人生旅程开始了，无数个第一次、无数个抉择、无数个可能都在等待着你去书写...`
        : `一声啼哭划破了${birthYear}年的宁静，你作为女孩降生到这个世界。从此，一段独一无二的人生旅程开始了，无数个第一次、无数个抉择、无数个可能都在等待着你去书写...`;

      // 添加2006年事件（先添加这个，因为它是最新的）
      const startNarrative = `时光荏苒，岁月如梭。转眼间已经是2006年了，${age}岁的你站在人生的十字路口。这个时代充满了机遇与挑战，互联网浪潮席卷而来，世界正在发生翻天覆地的变化。你的人生，将由你来主宰...`;

      const currentStatusItem = {
        year: 2006,
        age: age,
        eventTitle: `2006年，你${age}岁了`,
        choice: startNarrative,
        displayTitle: '',
        displayChoice: '',
        isNarrative: true,
        advanceYear: false
      };

      this.setData({
        timelineData: [currentStatusItem],
        currentTimelineIndex: 0
      });

      // 开始打字2006年事件
      this.startNarrativeTypewriter(0, `2006年，你${age}岁了`, startNarrative, false, () => {
        // 2006年事件完成后，添加并开始出生事件
        const initialTimelineItem = {
          year: birthYear,
          age: 0,
          eventTitle: `${birthYear}年，你出生了`,
          choice: birthNarrative,
          displayTitle: '',
          displayChoice: '',
          isNarrative: true,
          advanceYear: false
        };

        // 倒序添加，所以出生事件在2006年之后（实际显示在下方）
        const newTimelineData = [initialTimelineItem, ...this.data.timelineData];
        this.setData({
          timelineData: newTimelineData,
          currentTimelineIndex: 1
        });

        this.startNarrativeTypewriter(1, `${birthYear}年，你出生了`, birthNarrative, false, () => {
          // 两个都完成后，开始游戏循环
          setTimeout(() => {
            this.gameLoop();
          }, 1000);
        });
      });
    }, 500);
  },

  // 加载用户信息（使用 API 客户端）
  loadUserInfo: async function() {
    try {
      const result = await userApi.getBalance();

      if (result && result.success) {
        this.userData = {
          avatarName: result.avatarName || 'Admin'
        };
        console.log('用户信息加载成功:', this.userData);
      } else {
        this.userData = { avatarName: 'Admin' };
      }
    } catch (e) {
      console.error('加载用户信息失败:', e);
      this.userData = { avatarName: 'Admin' };
    }
  },

  // 游戏主循环
  gameLoop: function() {
    // 使用游戏引擎的当前年份判断游戏是否结束
    if (gameEngine.userState.currentYear > 2026) {
      this.endGame();
      return;
    }

    // 随机决定这一年的内容类型
    const random = Math.random();

    if (random < 0.6) {
      // 60%概率: 显示事件选择（提高大事件概率）
      this.showNextEvent();
    } else if (random < 0.9) {
      // 30%概率: 显示单个日常成长叙事
      const narrative = gameEngine.getLifeNarrative();
      if (narrative) {
        this.addNarrativeToTimeline(narrative, false);
      } else {
        this.showNextEvent();
      }
    } else {
      // 10%概率: 显示两个连续的日常成长（降低概率）
      const narrative1 = gameEngine.getLifeNarrative();
      const narrative2 = gameEngine.getLifeNarrative();

      if (narrative1 && narrative2) {
        this.addDoubleNarrativeToTimeline(narrative1, narrative2);
      } else if (narrative1) {
        this.addNarrativeToTimeline(narrative1, false);
      } else {
        this.showNextEvent();
      }
    }
  },

  // 添加叙事到时间轴
  addNarrativeToTimeline: function(narrative, advanceYear = true) {
    // 使用游戏引擎的当前年份，确保数据同步
    const currentYear = gameEngine.userState.currentYear;
    const currentAge = gameEngine.userState.age;

    const timelineItem = {
      year: currentYear,
      age: currentAge,
      eventTitle: '日常成长',
      choice: narrative,
      displayTitle: '',
      displayChoice: '',
      isNarrative: true,
      advanceYear: advanceYear
    };

    // 倒序添加到时光轴（最新的在最前面）
    const newTimelineData = [timelineItem, ...this.data.timelineData];

    this.setData({
      timelineData: newTimelineData,
      currentTimelineIndex: 0
    });

    // 开始打字机效果
    this.startNarrativeTypewriter(0, '日常成长', narrative, advanceYear);
  },

  // 添加双重叙事到时间轴
  addDoubleNarrativeToTimeline: function(narrative1, narrative2) {
    // 使用游戏引擎的当前年份，确保数据同步
    const currentYear = gameEngine.userState.currentYear;
    const currentAge = gameEngine.userState.age;

    const timelineItem1 = {
      year: currentYear,
      age: currentAge,
      eventTitle: '日常成长',
      choice: narrative1,
      displayTitle: '',
      displayChoice: '',
      isNarrative: true,
      advanceYear: false
    };

    // 倒序添加第一个叙事到时光轴
    const newTimelineData1 = [timelineItem1, ...this.data.timelineData];
    this.setData({
      timelineData: newTimelineData1,
      currentTimelineIndex: 0
    });

    // 开始第一个叙事的打字机效果,完成后继续第二个
    this.startNarrativeTypewriter(0, '日常成长', narrative1, false, () => {
      // 第一个叙事完成后,添加第二个叙事
      const timelineItem2 = {
        year: currentYear,
        age: currentAge,
        eventTitle: '日常成长',
        choice: narrative2,
        displayTitle: '',
        displayChoice: '',
        isNarrative: true,
        advanceYear: true
      };

      // 倒序添加第二个叙事
      const newTimelineData2 = [timelineItem2, ...this.data.timelineData];
      this.setData({
        timelineData: newTimelineData2,
        currentTimelineIndex: 0
      });

      this.startNarrativeTypewriter(0, '日常成长', narrative2, true);
    });
  },

  // 叙事打字机效果
  startNarrativeTypewriter: function(index, titleText, narrativeText, advanceYear, onComplete) {
    this.setData({ isTyping: true });

    const timelineData = [...this.data.timelineData];
    let titleIndex = 0;
    let narrativeIndex = 0;
    const titleSpeed = 100;
    const narrativeSpeed = 80;
    const pauseBetweenTexts = 600;
    const timers = [];

    // 打字标题
    const typeTitle = () => {
      if (titleIndex < titleText.length) {
        timelineData[index].displayTitle = titleText.substring(0, titleIndex + 1);
        titleIndex++;
        this.setData({
          timelineData: timelineData
        });
        const timer = setTimeout(typeTitle, titleSpeed);
        timers.push(timer);
      } else {
        // 标题打完,停顿后开始打叙事内容
        const pauseTimer = setTimeout(() => {
          typeNarrative();
        }, pauseBetweenTexts);
        timers.push(pauseTimer);
      }
    };

    // 打字叙事内容
    const typeNarrative = () => {
      if (narrativeIndex < narrativeText.length) {
        timelineData[index].displayChoice = narrativeText.substring(0, narrativeIndex + 1);
        narrativeIndex++;
        this.setData({
          timelineData: timelineData
        });
        const timer = setTimeout(typeNarrative, narrativeSpeed);
        timers.push(timer);
      } else {
        // 全部打完
        this.setData({ isTyping: false });
        this.data.typingTimers = []; // 清空定时器数组

        const endTimer = setTimeout(() => {
          if (advanceYear) {
            this.advanceToNextYear();
          } else {
            // 不需要前进年份时，直接继续游戏循环
            if (onComplete) {
              onComplete();
            } else {
              // 没有 onComplete 回调时，继续游戏循环
              setTimeout(() => {
                this.gameLoop();
              }, 500);
            }
          }
        }, 1000);
        timers.push(endTimer);
      }
    };

    // 保存定时器数组
    this.data.typingTimers = timers;

    // 开始打字
    typeTitle();
  },

  // 跳过打字效果
  skipTyping: function() {
    if (!this.data.isTyping) return;

    // 清除所有定时器
    this.data.typingTimers.forEach(timer => {
      if (timer) clearTimeout(timer);
    });
    this.data.typingTimers = [];

    // 获取当前正在打字的索引
    const index = this.data.currentTimelineIndex;
    const timelineData = [...this.data.timelineData];

    // 直接显示完整内容
    if (timelineData[index]) {
      timelineData[index].displayTitle = timelineData[index].eventTitle;
      timelineData[index].displayChoice = timelineData[index].choice;
    }

    this.setData({
      isTyping: false,
      timelineData: timelineData
    });

    // 执行后续逻辑
    if (timelineData[index] && timelineData[index].advanceYear) {
      this.advanceToNextYear();
    } else if (timelineData[index] && timelineData[index].isEventContext) {
      // 事件背景显示完成后，弹出选择框
      setTimeout(() => {
        this.setData({
          showEventCard: true,
          choiceResultVisible: false
        });
      }, 300);
    } else {
      // 不需要前进年份时，直接继续游戏循环
      setTimeout(() => {
        this.gameLoop();
      }, 500);
    }
  },

  // 点击时间轴区域
  onTimelineTap: function() {
    this.skipTyping();
  },

  // 显示下一个事件
  showNextEvent: function() {
    // 获取下一个事件
    const event = gameEngine.getNextEvent();
    gameEngine.setCurrentEvent(event);

    if (event) {
      this.setData({
        currentEvent: event
      });

      // 记录事件到历史
      this.data.gameStarted = true;

      // 先在时光轴上显示事件标题和历史背景
      this.showEventContextOnTimeline(event);
    } else {
      // 没有符合条件的事件，直接前进到下一年
      this.advanceToNextYear();
    }
  },

  // 在时光轴上显示事件背景
  showEventContextOnTimeline: function(event) {
    // 构建显示文本：标题 + 描述 + 历史背景
    let displayText = event.description;

    if (event.context) {
      displayText += '\n\n【历史背景】\n' + event.context;
    }

    // 使用事件的实际年份，避免数据不同步问题
    // 对于日常事件(year为null)，使用游戏引擎的当前年份
    const eventYear = event.year !== null ? event.year : gameEngine.userState.currentYear;

    // 添加到时光轴
    const timelineItem = {
      year: eventYear,
      age: this.data.age,
      eventTitle: event.title,
      choice: displayText,
      displayTitle: '',
      displayChoice: '',
      isNarrative: true,
      advanceYear: false,
      isEventContext: true // 标记这是事件背景
    };

    // 倒序添加到时光轴
    const newTimelineData = [timelineItem, ...this.data.timelineData];

    this.setData({
      timelineData: newTimelineData,
      currentTimelineIndex: 0
    });

    // 开始打字显示背景
    this.startNarrativeTypewriter(0, event.title, displayText, false, () => {
      // 背景显示完成后，弹出选择框
      setTimeout(() => {
        this.setData({
          showEventCard: true,
          choiceResultVisible: false
        });
      }, 500);
    });
  },

  // 关闭事件弹窗
  closeEvent: function() {
    this.setData({
      showEventCard: false
    });
  },

  // 做出选择
  makeChoice: function(e) {
    const choiceIndex = e.currentTarget.dataset.index;
    const event = this.data.currentEvent;
    const choice = event.choices[choiceIndex];

    // 关闭事件弹窗
    this.setData({
      showEventCard: false
    });

    // 应用选择效果
    gameEngine.applyChoice(choice);

    // 更新用户状态
    this.setData({
      attributes: { ...gameEngine.userState.attributes }
    });

    // 将选择结果追加到时光轴上当前事件背景之后
    this.appendChoiceResult(event.title, choice);
  },

  // 追加选择结果到时光轴
  appendChoiceResult: function(eventTitle, choice) {
    // 获取当前时光轴第一个项目（事件背景）
    const timelineData = [...this.data.timelineData];
    const eventContextItem = timelineData[0];

    if (!eventContextItem || !eventContextItem.isEventContext) {
      // 如果第一个不是事件背景，直接前进年份
      this.advanceToNextYear();
      return;
    }

    // 构建选择结果文本
    let resultText = '\n\n━━━━━━━━━━━━━━━━\n\n【你的选择】\n' + choice.text;

    if (choice.result) {
      resultText += '\n\n' + choice.result;
    }

    // 追加到当前事件背景的 choice 内容
    eventContextItem.choice += resultText;
    eventContextItem.advanceYear = true; // 标记需要前进年份
    eventContextItem.isEventContext = false; // 标记已经不是事件背景了
    eventContextItem.isEventCompleted = true; // 标记事件已完成

    // 获取当前已经显示的内容长度
    const currentDisplayLength = eventContextItem.displayChoice ? eventContextItem.displayChoice.length : 0;

    this.setData({
      timelineData: timelineData,
      currentTimelineIndex: 0
    });

    // 从当前显示位置继续打字追加内容
    this.continueTypewriter(0, resultText, currentDisplayLength, true);
  },

  // 继续打字（在已有内容后追加）
  continueTypewriter: function(index, appendText, startIndex, advanceYear) {
    this.setData({ isTyping: true });

    const timelineData = [...this.data.timelineData];
    let textIndex = 0;
    const typingSpeed = 80; // 打字速度
    const timers = [];

    // 获取基础文本（不包含新追加的部分）
    const baseText = timelineData[index].choice.substring(0, startIndex);

    // 继续打字
    const typeAppend = () => {
      if (textIndex < appendText.length) {
        // 显示：基础文本 + 追加文本的一部分
        timelineData[index].displayChoice = baseText + appendText.substring(0, textIndex + 1);
        textIndex++;
        this.setData({
          timelineData: timelineData
        });
        const timer = setTimeout(typeAppend, typingSpeed);
        timers.push(timer);
      } else {
        // 全部打完
        this.setData({ isTyping: false });
        this.data.typingTimers = [];

        const endTimer = setTimeout(() => {
          if (advanceYear) {
            this.advanceToNextYear();
          }
        }, 1000);
        timers.push(endTimer);
      }
    };

    // 保存定时器
    this.data.typingTimers = timers;

    // 开始打字
    typeAppend();
  },

  // 前进到下一年
  advanceToNextYear: function() {
    gameEngine.advanceYear();

    this.setData({
      currentYear: gameEngine.userState.currentYear,
      age: gameEngine.userState.age
    });

    // 继续游戏循环
    setTimeout(() => {
      this.gameLoop();
    }, 500);
  },

  // 结束游戏
  endGame: function() {
    const ending = gameEngine.calculateEnding();

    // 保存结局到数据库
    this.saveEndingToDatabase(ending);

    this.setData({
      ending,
      showEnding: true,
      gameEnded: true
    });
  },

  // 保存结局到数据库（使用 API 客户端）
  saveEndingToDatabase: function(ending) {
    gameApi.ifthen('saveEnding', {
      endingId: ending.id,
      birthYear: this.data.birthYear,
      gender: this.data.gender,
      avatarName: (this.userData && this.userData.avatarName) || 'Admin', // 用户头像名称
      finalAttributes: {
        ...gameEngine.userState.attributes
      },
      playTime: new Date().getTime(),
      // 游戏相关信息
      playDuration: Math.floor((Date.now() - this.gameStartTime) / 1000), // 游戏时长（秒）
      currentYear: gameEngine.userState.currentYear,
      finalAge: gameEngine.userState.age
    }).then(result => {
      console.log('结局保存成功:', result);

      if (result && result.success && result.isFirstTime) {
        // 首次获得结局，显示提示
        wx.showToast({
          title: '🎉 解锁新结局！',
          icon: 'success',
          duration: 2000
        });
      }
    }).catch(err => {
      console.error('结局保存失败:', err);
      // 静默失败，不影响用户体验
    });
  },

  // 重新开始
  restartGame: function() {
    // 防止重复点击
    if (this.data.isNavigating) {
      return;
    }

    this.setData({ isNavigating: true });

    wx.redirectTo({
      url: '/pages/ifthen/start',
      fail: () => {
        // 如果跳转失败，重置标志
        this.setData({ isNavigating: false });
      }
    });
  },

  // 关闭结局弹窗
  closeEnding: function() {
    this.setData({
      showEnding: false
    });
  },

  // 重新打开结局弹窗
  reopenEnding: function() {
    if (this.data.ending) {
      this.setData({
        showEnding: true
      });
    }
  },

  // 分享结局（使用 API 客户端）
  shareEnding: function() {
    const ending = this.data.ending;

    // 记录分享行为
    gameApi.ifthen('recordShare', {
      endingId: ending.id,
      shareType: 'ending'
    }).then(result => {
      if (result && result.success) {
        if (result.isFirstShare) {
          wx.showToast({
            title: `+${result.reward}Q点`,
            icon: 'success',
            duration: 2000
          });
        }
      }
    }).catch(err => {
      console.error('记录分享失败:', err);
    });

    return {
      title: `我在「如果当时」中达成了：${ending.title}`,
      path: '/pages/ifthen/start',
      imageUrl: ''
    };
  },

  // 阻止事件冒泡
  stopPropagation: function() {
    // 空函数，用于阻止点击事件冒泡
  },

  // 返回首页
  goHome: function() {
    // 防止重复点击
    if (this.data.isNavigating) {
      return;
    }

    this.setData({ isNavigating: true });

    wx.navigateBack({
      fail: () => {
        // 如果无法返回，跳转到开始页面
        wx.redirectTo({
          url: '/pages/ifthen/start'
        });
      },
      complete: () => {
        // 重置标志
        this.setData({ isNavigating: false });
      }
    });
  },

  // 分享功能
  onShareAppMessage: function() {
    if (this.data.ending) {
      return this.shareEnding();
    }

    // 默认分享内容
    return {
      title: '如果当时 - 千禧年代人生模拟',
      path: '/pages/ifthen/start',
      imageUrl: ''
    };
  }
});
