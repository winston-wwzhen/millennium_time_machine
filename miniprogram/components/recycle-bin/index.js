// components/recycle-bin/index.js
const { eggSystem, EGG_IDS } = require('../../utils/egg-system');
const { userApi } = require('../../utils/api-client');

// 垃圾文件数据池
const TRASH_FILES_POOL = {
  documents: [
    { name: '旧日记.txt', icon: '📄', isSpecial: false },
    { name: '未完成作业.doc', icon: '📄', isSpecial: false },
    { name: 'QQ聊天记录.txt', icon: '📄', isSpecial: false },
    { name: '备忘录.txt', icon: '📄', isSpecial: false },
    { name: '考试复习资料.doc', icon: '📄', isSpecial: false },
    { name: '个人简历.txt', icon: '📄', isSpecial: false },
    { name: '暗恋日记.txt', icon: '📄', isSpecial: false },
    { name: '网络账号密码.txt', icon: '📄', isSpecial: false },
    { name: '编程学习笔记.txt', icon: '📄', isSpecial: false },
    { name: '游戏攻略.txt', icon: '📄', isSpecial: false },
  ],
  specialDocuments: [
    { name: '彩蛋秘籍第二册.txt', icon: '📜', isSpecial: true }
  ],
  music: [
    { name: '过时的MP3.mp3', icon: '🎵', isSpecial: false },
    { name: '周杰伦歌曲.mp3', icon: '🎵', isSpecial: false },
    { name: '网络神曲.wma', icon: '🎵', isSpecial: false },
    { name: '手机铃声.mp3', icon: '🎵', isSpecial: false },
    { name: '盗版歌曲.mid', icon: '🎵', isSpecial: false },
    { name: 'QQ空间背景音乐.mp3', icon: '🎵', isSpecial: false },
    { name: '彩铃.wma', icon: '🎵', isSpecial: false },
  ],
  images: [
    { name: '模糊照片.jpg', icon: '🖼️', isSpecial: false },
    { name: '非主流自拍.jpg', icon: '🖼️', isSpecial: false },
    { name: '风景壁纸.bmp', icon: '🖼️', isSpecial: false },
    { name: 'QQ空间头像.gif', icon: '🖼️', isSpecial: false },
    { name: '偷拍照片.jpg', icon: '🖼️', isSpecial: false },
    { name: '网络图片.png', icon: '🖼️', isSpecial: false },
    { name: '表情包.jpg', icon: '🖼️', isSpecial: false },
  ]
};

// 随机日期生成器
function generateRandomDate() {
  const year = 2006;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// 随机选择文件
function generateRandomTrash() {
  const trash = [];
  // 检查彩蛋秘籍第二册是否已还原
  const secretBookRestored = wx.getStorageSync('eggSecretBook2Restored') || false;

  // 随机选择1-3个文档
  const docCount = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < docCount; i++) {
    const file = TRASH_FILES_POOL.documents[Math.floor(Math.random() * TRASH_FILES_POOL.documents.length)];
    trash.push({
      ...file,
      date: generateRandomDate()
    });
  }

  // 20%概率出现彩蛋秘籍第二册（如果还没还原）
  if (!secretBookRestored && Math.random() < 0.2) {
    const specialFile = TRASH_FILES_POOL.specialDocuments[0];
    trash.push({
      ...specialFile,
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

Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    zIndex: {
      type: Number,
      value: 2000
    }
  },

  data: {
    hasTrash: true,
    eggAchieved: false,
    showHelpDialog: false,
    trashFiles: [],
    overlayStyle: '',
    showRestoreDialog: false, // 还原确认弹窗
    selectedFile: null, // 选中的文件

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

  observers: {
    'show': function(newVal) {
      if (newVal) {
        this.addLog('open', '回收站');
        // 每次显示时恢复垃圾文件（除非已达成彩蛋）
        if (!this.data.eggAchieved && !this.data.hasTrash) {
          this.generateTrash();
        }
      }
    },
    'zIndex': function(newVal) {
      this.setData({
        overlayStyle: `z-index: ${newVal};`
      });
    }
  },

  lifetimes: {
    attached() {
      // 加载彩蛋系统状态
      eggSystem.load();
      // 检查回收站清理者彩蛋是否已达成
      this.setData({
        eggAchieved: eggSystem.isDiscovered(EGG_IDS.RECYCLE_BIN_EMPTYER)
      });

      // 生成初始随机垃圾文件
      this.generateTrash();

      // 注册彩蛋发现回调
      this.eggCallbackKey = eggSystem.setEggDiscoveryCallback((config) => {
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

    detached() {
      // 组件卸载时清理彩蛋回调
      if (this.eggCallbackKey) {
        const { eggSystem } = require('../../utils/egg-system');
        eggSystem.unregisterEggDiscoveryCallback(this.eggCallbackKey);
      }
    }
  },

  methods: {
    // 添加操作日志
    addLog: function(action, target, details) {
      const { addLog: logAction } = require("../../utils/logger");
      logAction(action, target, details);
    },

    // 关闭窗口
    onClose: function() {
      this.triggerEvent('close');
    },

    // 阻止事件冒泡
    stopPropagation: function() {
      // 空函数，仅用于阻止事件冒泡
    },

    // 生成随机垃圾文件
    generateTrash: function() {
      const trashFiles = generateRandomTrash();
      this.setData({
        trashFiles: trashFiles,
        hasTrash: true
      });
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

        wx.showToast({ title: '回收站已清空', icon: 'success' });
      }, 800);
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

    // 关闭彩蛋发现弹窗
    hideEggDiscoveryDialog: function() {
      this.setData({ showEggDiscoveryDialog: false });
    },

    // 点击垃圾文件
    onTrashItemTap: function(e) {
      const { file, index } = e.currentTarget.dataset;

      // 只处理特殊文件（彩蛋秘籍第二册）
      if (file && file.isSpecial) {
        this.setData({
          selectedFile: file,
          showRestoreDialog: true
        });
      }
    },

    // 确认还原彩蛋秘籍第二册
    confirmRestoreSecretBook: function() {
      wx.showLoading({ title: '正在还原...', mask: true });

      setTimeout(() => {
        // 保存还原状态到本地存储
        wx.setStorageSync('eggSecretBook2Restored', true);

        wx.hideLoading();
        this.setData({ showRestoreDialog: false });

        wx.showToast({
          title: '✓ 文件已还原到我的文档/彩蛋文件夹',
          icon: 'success',
          duration: 2000
        });

        // 重新生成垃圾文件（移除特殊文件）
        this.generateTrash();
      }, 800);
    },

    // 取消还原
    cancelRestoreSecretBook: function() {
      this.setData({ showRestoreDialog: false });
    }
  }
});
