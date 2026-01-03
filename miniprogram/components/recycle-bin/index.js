// components/recycle-bin/index.js
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
    { name: '暑假作业.doc', icon: '📄' },
    { name: '高中作文.txt', icon: '📄' },
    { name: '英语单词本.doc', icon: '📄' },
    { name: '数学公式.txt', icon: '📄' },
    { name: '历史笔记.doc', icon: '📄' },
  ],
  music: [
    { name: '过时的MP3.mp3', icon: '🎵' },
    { name: '周杰伦歌曲.mp3', icon: '🎵' },
    { name: '网络神曲.wma', icon: '🎵' },
    { name: '手机铃声.mp3', icon: '🎵' },
    { name: '盗版歌曲.mid', icon: '🎵' },
    { name: 'QQ空间背景音乐.mp3', icon: '🎵' },
    { name: '彩铃.wma', icon: '🎵' },
    { name: '韩舞歌曲.mp3', icon: '🎵' },
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
  const year = 2006;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// 生成30个垃圾文件
function generate30TrashFiles() {
  const trash = [];
  const allFiles = [
    ...TRASH_FILES_POOL.documents,
    ...TRASH_FILES_POOL.music,
    ...TRASH_FILES_POOL.images
  ];

  // 随机选择30个普通文件
  for (let i = 0; i < 30; i++) {
    const file = allFiles[Math.floor(Math.random() * allFiles.length)];
    trash.push({
      id: `trash_${i}`,
      ...file,
      date: generateRandomDate(),
      isSpecial: false,
      canDelete: true
    });
  }

  // 随机打乱数组
  trash.sort(() => Math.random() - 0.5);

  // 将彩蛋秘籍插入到后面位置（第24个位置，即倒数第7个）
  const eggBook = {
    id: 'hidden_file_egg_book_2',
    name: '彩蛋秘籍第二册.txt',
    icon: '📕',
    date: '2006-06-06',
    isSpecial: true, // 标记为特殊文件，不能删除
    canRestore: true // 只能恢复
  };
  trash.splice(24, 1, eggBook);

  return trash;
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
    trashFiles: [],  // 垃圾文件列表
    deletedCount: 0,  // 已删除文件计数
    showHelpDialog: false,
    overlayStyle: '',
    capsulePadding: 50,  // 胶囊按钮padding

    // 恢复确认弹窗
    showRestoreDialog: false,
    restoreFileIndex: -1,
    restoreFile: {
      name: ''
    },

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
      }
    },
    'zIndex, capsulePadding': function(zIndex, capsulePadding) {
      this.setData({
        overlayStyle: `z-index: ${zIndex}; padding-top: ${capsulePadding}px;`
      });
    }
  },

  lifetimes: {
    attached() {
      // 计算胶囊按钮padding
      this.calculateCapsulePadding();

      // 加载彩蛋系统状态
      eggSystem.load();

      // 生成30个垃圾文件
      this.generateTrash();

      // 注册彩蛋发现回调
      this.registerEggDiscoveryCallback();
    },

    detached() {
      // 组件卸载时清理彩蛋回调
      if (this.eggCallbackKey) {
        eggSystem.unregisterEggDiscoveryCallback(this.eggCallbackKey);
      }
    }
  },

  methods: {
    // 注册彩蛋发现回调（提取为独立方法，便于在 attached 中复用）
    registerEggDiscoveryCallback: function() {
      // 先取消旧回调（如果存在）
      if (this.eggCallbackKey) {
        eggSystem.unregisterEggDiscoveryCallback(this.eggCallbackKey);
      }
      // 注册新回调
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

    // 添加操作日志
    addLog: function(action, target, details) {
      const { addLog: logAction } = require("../../utils/logger");
      logAction(action, target, details);
    },

    // 计算胶囊按钮padding
    calculateCapsulePadding: function() {
      try {
        // 获取系统信息
        const systemInfo = wx.getSystemInfoSync();
        const statusBarHeight = systemInfo.statusBarHeight || 0;

        // 获取胶囊按钮位置信息
        const menuButton = wx.getMenuButtonBoundingClientRect();

        // 计算需要的间距：状态栏高度 + 胶囊按钮底部到顶部的距离 + 一些额外间距
        const capsuleBottom = menuButton.top + menuButton.height;
        const padding = capsuleBottom + 8; // 加8px额外间距

        this.setData({
          capsulePadding: padding
        });

        console.log('[回收站] 胶囊间距:', padding, '状态栏:', statusBarHeight, '胶囊:', menuButton);
      } catch (e) {
        // 如果获取失败，使用默认值
        console.error('[回收站] 获取胶囊信息失败:', e);
        this.setData({
          capsulePadding: 50 // 默认50px
        });
      }
    },

    // 关闭窗口
    onClose: function() {
      this.triggerEvent('close');
    },

    // 阻止事件冒泡
    stopPropagation: function() {
      // 空函数，仅用于阻止事件冒泡
    },

    // 生成30个垃圾文件
    generateTrash: function() {
      const trashFiles = generate30TrashFiles();
      this.setData({
        trashFiles: trashFiles,
        deletedCount: 0
      });
    },

    // 删除单个文件
    deleteFile: function(e) {
      const { index } = e.currentTarget.dataset;
      const file = this.data.trashFiles[index];

      // 特殊文件不能删除
      if (file.isSpecial) {
        wx.showModal({
          title: '提示',
          content: '这本秘籍承载着重要回忆，无法删除。请选择"恢复"来保存它。',
          showCancel: false,
          confirmText: '我知道了'
        });
        return;
      }

      // 删除文件
      const trashFiles = this.data.trashFiles.filter((_, i) => i !== index);
      const deletedCount = this.data.deletedCount + 1;

      this.setData({
        trashFiles,
        deletedCount
      });

      // 检查是否删除了5个文件，触发彩蛋
      if (deletedCount === 5) {
        this.triggerCleanerEgg();
      }

      wx.showToast({
        title: '已删除',
        icon: 'success',
        duration: 1000
      });
    },

    // 恢复文件
    restoreFile: function(e) {
      const { index } = e.currentTarget.dataset;
      const file = this.data.trashFiles[index];

      // 显示Win98风格确认弹窗
      this.setData({
        showRestoreDialog: true,
        restoreFileIndex: index,
        restoreFile: {
          name: file.name
        }
      });
    },

    // 取消恢复
    onCancelRestore: function() {
      this.setData({
        showRestoreDialog: false,
        restoreFileIndex: -1,
        restoreFile: { name: '' }
      });
    },

    // 确认恢复
    onConfirmRestore: function() {
      const { restoreFileIndex } = this.data;
      const file = this.data.trashFiles[restoreFileIndex];

      // 关闭弹窗
      this.onCancelRestore();

      // 移除该文件
      const trashFiles = this.data.trashFiles.filter((_, i) => i !== restoreFileIndex);
      this.setData({ trashFiles });

      wx.showToast({
        title: file.isSpecial ? '秘籍已保存到我的文档' : '文件已恢复',
        icon: 'success',
        duration: 1500
      });

      // 如果是彩蛋秘籍第二册，触发发现彩蛋
      if (file.isSpecial && file.id === 'hidden_file_egg_book_2') {
        this.triggerEggBookEgg();
      }
    },

    // 触发回收站清理者彩蛋
    triggerCleanerEgg: async function() {
      try {
        await eggSystem.discover(EGG_IDS.RECYCLE_BIN_EMPTYER);
      } catch (e) {
        console.error('触发回收站清理者彩蛋失败:', e);
      }
    },

    // 触发彩蛋秘籍第二册彩蛋
    triggerEggBookEgg: async function() {
      try {
        await eggSystem.discover(EGG_IDS.HIDDEN_FILE_EGG_BOOK_2);
      } catch (e) {
        console.error('触发彩蛋秘籍第二册彩蛋失败:', e);
      }
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
    }
  }
});
