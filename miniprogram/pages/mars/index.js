// miniprogram/pages/mars/index.js
const { eggSystem, EGG_IDS } = require('../../utils/egg-system');
const { chatApi, userApi } = require('../../utils/api-client');

Page({
  data: {
    inputText: "",
    outputText: "",
    isLoading: false,
    statusText: "就绪",

    // 菜单控制
    isMenuOpen: false,

    // 模式配置
    modes: [
      { key: "mars", label: "切换到: 火星文" },
      { key: "kaomoji", label: "切换到: 颜文字" },
      { key: "abstract", label: "切换到: Emoji" },
      { key: "human", label: "切换到: 说人话" },
    ],
    modeIndex: 0,
    currentModeLabel: "火星文", // 默认显示
    // 彩蛋达成状态
    marsEggAchieved: false,

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

  onLoad() {
    // 加载彩蛋系统状态
    eggSystem.load();
    // 检查火星文大师彩蛋是否已达成
    this.setData({
      marsEggAchieved: eggSystem.isDiscovered(EGG_IDS.MARS_TRANSLATOR)
    });

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

  // 监听输入
  onInput(e) {
    this.setData({
      inputText: e.detail.value,
    });
  },

  // 1. 切换菜单显示/隐藏
  toggleMenu() {
    this.setData({
      isMenuOpen: !this.data.isMenuOpen,
    });
  },

  // 2. 点击外部关闭菜单
  closeMenu() {
    this.setData({
      isMenuOpen: false,
    });
  },

  // 3. 选择转换模式
  onModeSelect(e) {
    const index = e.currentTarget.dataset.index;
    const mode = this.data.modes[index];

    this.setData({
      modeIndex: index,
      currentModeLabel: mode.label.replace("切换到: ", ""), // 简化标题显示
      statusText: `已装载模块：${mode.label}`,
      isMenuOpen: false, // 选完自动关闭菜单
    });
  },

  // 4. 核心：调用 AI 进行转换
  async startConvert() {
    const text = this.data.inputText.trim();
    if (!text) {
      wx.showToast({ title: "请输入内容", icon: "none" });
      return;
    }

    if (this.data.isLoading) return;

    this.setData({
      isLoading: true,
      outputText: "正在连接异次元...",
      statusText: "正在发送数据包...",
    });

    try {
      const currentModeKey = this.data.modes[this.data.modeIndex].key;

      // 调用云函数（使用 API 客户端）
      const result = await chatApi.sendMessage(text, [], currentModeKey);

      if (result && result.reply) {
        const reply = result.reply;
        this.setData({
          outputText: reply,
          statusText: "转换成功",
        });

        // 彩蛋：火星文大师
        this.checkMarsTranslatorEgg();
      } else {
        throw new Error("No reply");
      }
    } catch (err) {
      console.error("AI调用失败", err);
      this.setData({
        outputText: "转换失败：信号被外星人拦截了...",
        statusText: "错误 404: 服务器未响应",
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // ✨ 新增：手动复制功能
  copyToClipboard() {
    const text = this.data.outputText;
    // 如果是正在加载的提示文案，或者为空，就不复制
    if (!text || text === "正在连接异次元..." || text === "等待输扖...") {
      return;
    }

    wx.setClipboardData({
      data: text,
      success: () => {
        this.setData({ statusText: "内容已复制到剪贴板" });
      },
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // ==================== 彩蛋检查 ====================
  // 检查火星文大师彩蛋（累计使用翻译10次）（使用 API 客户端）
  async checkMarsTranslatorEgg() {
    if (this.data.marsEggAchieved) return;

    try {
      const result = await userApi.checkMarsTranslatorEgg();

      if (result.success) {
        if (result.shouldTrigger) {
          this.setData({ marsEggAchieved: true });
          await eggSystem.discover(EGG_IDS.MARS_TRANSLATOR);
        }
      }
    } catch (err) {
      console.error('Check mars translator egg error:', err);
    }
  },

  // 关闭彩蛋发现弹窗
  hideEggDiscoveryDialog: function() {
    this.setData({ showEggDiscoveryDialog: false });
  },

  onUnload: function() {
    if (this.eggCallbackKey) {
      eggSystem.unregisterEggDiscoveryCallback(this.eggCallbackKey);
    }
  }
});
