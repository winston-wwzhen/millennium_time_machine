/**
 * 全局彩蛋管理器
 * 管理各种隐藏功能和秘籍
 */
class EasterEggsManager {
  constructor() {
    this.eggs = {
      konami: this.initKonami(),
      clickCount: this.initClickCount(),
      secretDate: this.initSecretDate(),
      retroMode: this.initRetroMode()
    };

    this.activeEggs = new Set();
  }

  // Konami 代码秘籍
  initKonami() {
    return {
      code: ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'],
      input: [],
      unlocked: false,
      reward: 'konami'
    };
  }

  // 点击计数彩蛋
  initClickCount() {
    return {
      target: 7,
      current: 0,
      unlocked: false,
      reward: 'lucky7'
    };
  }

  // 特殊日期彩蛋
  initSecretDate() {
    return {
      dates: ['01-01', '04-01', '12-25', '06-01'],
      rewards: {
        '01-01': 'newyear',
        '04-01': 'fool',
        '12-25': 'christmas',
        '06-01': 'children'
      }
    };
  }

  // 复古模式彩蛋
  initRetroMode() {
    return {
      trigger: 'retro',
      unlocked: false
    };
  }

  // 处理 Konami 代码输入
  handleKonamiInput(direction) {
    const konami = this.eggs.konami;

    if (konami.unlocked) return null;

    konami.input.push(direction);

    // 检查输入序列
    const sequence = konami.input.slice(-10);
    const matchLength = this.checkSequence(sequence, konami.code);

    if (matchLength === konami.code.length) {
      konami.unlocked = true;
      this.activeEggs.add('konami');
      return {
        type: 'konami',
        message: '🎮 秘籍触发！你解锁了无限生命模式！',
        reward: { lives: 999, stars: 1000 }
      };
    }

    return null;
  }

  // 检查序列匹配
  checkSequence(input, target) {
    let matchLength = 0;
    const inputLength = input.length;
    const targetLength = target.length;

    for (let i = 0; i < Math.min(inputLength, targetLength); i++) {
      if (input[inputLength - 1 - i] === target[targetLength - 1 - i]) {
        matchLength++;
      } else {
        break;
      }
    }

    return matchLength;
  }

  // 处理点击计数
  handleClick() {
    const clickCount = this.eggs.clickCount;

    if (clickCount.unlocked) return null;

    clickCount.current++;

    if (clickCount.current === clickCount.target) {
      clickCount.unlocked = true;
      this.activeEggs.add('lucky7');
      return {
        type: 'lucky7',
        message: '🍀 幸运 7！你发现了隐藏的秘密！',
        reward: { coins: 777, title: '幸运儿' }
      };
    }

    return null;
  }

  // 检查特殊日期
  checkDateEgg() {
    const secretDate = this.eggs.secretDate;
    const now = new Date();
    const dateStr = `${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

    if (secretDate.dates.includes(dateStr)) {
      const reward = secretDate.rewards[dateStr];
      const messages = {
        'newyear': '🎊 新年快乐！新的一年，新的开始！',
        'fool': '🤡 愚人节快乐！今天说的一切都是真的...才怪！',
        'christmas': '🎄 圣诞快乐！愿你的愿望都能实现！',
        'children': '👶 儿童节快乐！保持一颗童心！'
      };
      return {
        type: reward,
        message: messages[reward],
        reward: { title: '节日使者', badge: reward }
      };
    }

    return null;
  }

  // 获取激活的彩蛋列表
  getActiveEggs() {
    return Array.from(this.activeEggs);
  }

  // 重置所有彩蛋
  reset() {
    this.eggs.konami.input = [];
    this.eggs.konami.unlocked = false;
    this.eggs.clickCount.current = 0;
    this.eggs.clickCount.unlocked = false;
    this.activeEggs.clear();
  }
}

module.exports = new EasterEggsManager();
