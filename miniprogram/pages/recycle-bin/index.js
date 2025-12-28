// pages/recycle-bin/index.js
const { eggSystem, EGG_IDS } = require('../../utils/egg-system');
const { userApi } = require('../../utils/api-client');

// 垃圾文件数据池
const TRASH_FILES_POOL = {
  documents: [
    { name: '旧日记.txt', icon: '📄' },
    { name: '未完成作业.doc', icon: '📄' },
    { name: 'QQ聊天记录.txt', icon: '📄' },
    { name: '备忘录.txt', icon: '📄' },
    { name: '考试复习资料.doc', icon: '📄' },
    { name: '个人简历.txt', icon: '📄' },
    { name: '暗恋日记.txt', icon: '📄' },
    { name: '网络账号密码.txt', icon: '📄' },
    { name: '编程学习笔记.txt', icon: '📄' },
    { name: '游戏攻略.txt', icon: '📄' },
  ],
  music: [
    { name: '过时的MP3.mp3', icon: '🎵' },
    { name: '周杰伦歌曲.mp3', icon: '🎵' },
    { name: '网络神曲.wma', icon: '🎵' },
    { name: '手机铃声.mp3', icon: '🎵' },
    { name: '盗版歌曲.mid', icon: '🎵' },
    { name: 'QQ空间背景音乐.mp3', icon: '🎵' },
    { name: '彩铃.wma', icon: '🎵' },
  ],
  images: [
    { name: '模糊照片.jpg', icon: '🖼️' },
    { name: '非主流自拍.jpg', icon: '🖼️' },
    { name: '风景壁纸.bmp', icon: '🖼️' },
    { name: 'QQ空间头像.gif', icon: '🖼️' },
    { name: '偷拍照片.jpg', icon: '🖼️' },
    { name: '网络图片.png', icon: '🖼️' },
    { name: '表情包.jpg', icon: '🖼️' },
  ]
};

// 随机日期生成器
function generateRandomDate() {
  const year = 2005;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// 随机选择文件
function generateRandomTrash() {
  const trash = [];

  // 随机选择1-3个文档
  const docCount = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < docCount; i++) {
    const file = TRASH_FILES_POOL.documents[Math.floor(Math.random() * TRASH_FILES_POOL.documents.length)];
    trash.push({
      ...file,
      date: generateRandomDate()
    });
  }

  // 随机选择1-2个音乐文件
  const musicCount = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < musicCount; i++) {
    const file = TRASH_FILES_POOL.music[Math.floor(Math.random() * TRASH_FILES_POOL.music.length)];
    trash.push({
      ...file,
      date: generateRandomDate()
    });
  }

  // 随机选择1-2个图片文件
  const imgCount = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < imgCount; i++) {
    const file = TRASH_FILES_POOL.images[Math.floor(Math.random() * TRASH_FILES_POOL.images.length)];
    trash.push({
      ...file,
      date: generateRandomDate()
    });
  }

  // 随机打乱数组
  return trash.sort(() => Math.random() - 0.5);
}

Page({
  data: {
    hasTrash: true,  // 有垃圾文件
    emptyCount: 0,   // 清空次数
    eggAchieved: false,
    showHelpDialog: false,
    trashFiles: [],  // 垃圾文件列表

    // 彩蛋发现弹窗
    showEggDiscoveryDialog: false,
    eggDiscoveryData: {
      name: '',
      description: '',
      rarity: '',
      rarityName: '',
      rewardText: ''
    }
  },

  onLoad: function(options) {
    // 加载彩蛋系统状态
    eggSystem.load();
    // 检查回收站清理者彩蛋是否已达成
    this.setData({
      eggAchieved: eggSystem.isDiscovered(EGG_IDS.RECYCLE_BIN_EMPTYER)
    });

    // 生成初始随机垃圾文件
    this.generateTrash();

    // 注册彩蛋发现回调
    eggSystem.setEggDiscoveryCallback((config) => {
      const rarityNames = {
        common: '普通',
        rare: '稀有',
        epic: '史诗',
        legendary: '传说'
      };
      const reward = config.reward;
      const rewardText = reward.coins ? `+${reward.coins}时光币` : '';
      this.setData({
        showEggDiscoveryDialog: true,
        eggDiscoveryData: {
          name: config.name,
          description: config.description,
          rarity: config.rarity,
          rarityName: rarityNames[config.rarity],
          rewardText: rewardText
        }
      });
    });
  },

  // 生成随机垃圾文件
  generateTrash: function() {
    const trashFiles = generateRandomTrash();
    this.setData({
      trashFiles: trashFiles,
      hasTrash: true
    });
  },

  onShow: function() {
    // 每次显示页面时恢复垃圾文件（除非已达成彩蛋）
    if (!this.data.eggAchieved && !this.data.hasTrash) {
      this.generateTrash();
    }
  },

  // 清空回收站
  emptyRecycleBin: async function() {
    if (!this.data.hasTrash) {
      wx.showToast({ title: '回收站已经是空的', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '正在清空...', mask: true });

    // 模拟清空操作
    setTimeout(() => {
      this.setData({ hasTrash: false });
      wx.hideLoading();

      // 检查彩蛋
      this.checkRecycleBinEgg();

      wx.showToast({ title: '回收站已清空', icon: 'success' });
    }, 800);
  },

  // 检查回收站清理者彩蛋（使用 API 客户端）
  checkRecycleBinEgg: async function() {
    if (this.data.eggAchieved) return;

    try {
      const result = await userApi.checkRecycleBinEgg();

      if (result.success) {
        if (result.shouldTrigger) {
          this.setData({ eggAchieved: true });
          await eggSystem.discover(EGG_IDS.RECYCLE_BIN_EMPTYER);
        }
      }
    } catch (err) {
      console.error('Check recycle bin egg error:', err);
    }
  },

  goBack: function() {
    wx.navigateBack();
  },

  // 显示帮助弹窗
  onShowHelp: function() {
    this.setData({
      showHelpDialog: true
    });
  },

  // 关闭帮助弹窗
  onCloseHelpDialog: function() {
    this.setData({
      showHelpDialog: false
    });
  },

  // 阻止事件冒泡
  stopPropagation: function() {
    // 空函数，仅用于阻止事件冒泡
  },

  // 关闭彩蛋发现弹窗
  hideEggDiscoveryDialog: function() {
    this.setData({ showEggDiscoveryDialog: false });
  }
});
