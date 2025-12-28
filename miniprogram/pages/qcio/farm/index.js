/**
 * QCIO 农场页面
 * Win98 风格
 */
const app = getApp();
const { qcioApi } = require('../../../utils/api-client');

Page({
  data: {
    // 农场档案
    farmProfile: null,

    // 土地数据
    plots: [],
    unlockedPlots: 6,

    // 仓库数据
    inventory: {
      seeds: [],
      crops: [],
      decorations: []
    },

    // 弹窗状态
    showShopModal: false,
    showWarehouseModal: false,
    showLogModal: false,
    showInfoModal: false,

    // 信息弹窗数据
    infoType: '',
    infoModalTitle: '',

    // 农场日志
    farmLogs: [],

    // 商店Tab
    shopActiveTab: 'seeds',

    // 作物配置
    traditionalCrops: [],
    moodCrops: [],
    decorations: [],

    // 选中的土地
    selectedPlotIndex: -1,

    // 加载状态
    loading: true,

    // 用户信息
    qcioId: '',
    nickname: '',

    // 钱包数据
    coins: 0,

    // 收获结果
    harvestResult: {
      show: false,
      cropName: '',
      icon: '',
      sellPrice: 0,
      expGain: 0,
      quality: 1
    }
  },

  onLoad(options) {
    this.setData({
      qcioId: app.globalData.qcioId || '',
      nickname: app.globalData.nickname || ''
    });

    // 加载作物配置
    this.loadCropConfigs();

    // 初始化农场
    this.initFarm();
  },

  onShow() {
    // 刷新数据
    this.refreshData();
  },

  onHide() {
    // 停止定时器
    this.stopGrowthMonitor();
  },

  onUnload() {
    this.stopGrowthMonitor();
  },

  /**
   * 加载作物配置
   */
  loadCropConfigs() {
    // 传统作物
    const traditionalCrops = Object.keys({
      wheat: { name: '小麦', icon: '🌾', cost: 10, sell: 25, duration: 30000, exp: 5 },
      corn: { name: '玉米', icon: '🌽', cost: 20, sell: 55, duration: 60000, exp: 8 },
      tomato: { name: '番茄', icon: '🍅', cost: 50, sell: 150, duration: 120000, exp: 12 },
      pumpkin: { name: '南瓜', icon: '🎃', cost: 100, sell: 350, duration: 300000, exp: 20 },
      strawberry: { name: '草莓', icon: '🍓', cost: 200, sell: 700, duration: 600000, exp: 35 },
      cotton: { name: '棉花', icon: '🌿', cost: 300, sell: 1200, duration: 1800000, exp: 50 },
      sunflower: { name: '向日葵', icon: '🌻', cost: 500, sell: 2500, duration: 7200000, exp: 80 },
      grape: { name: '葡萄', icon: '🍇', cost: 800, sell: 5000, duration: 21600000, exp: 150 },
      apple: { name: '苹果', icon: '🍎', cost: 1200, sell: 9000, duration: 43200000, exp: 250 },
      ginseng: { name: '人参', icon: '🌱', cost: 2000, sell: 20000, duration: 86400000, exp: 500 }
    }).map(key => ({
      id: key,
      type: 'traditional',
      ...{ wheat: { name: '小麦', icon: '🌾', cost: 10, sell: 25, duration: 30000, exp: 5 },
          corn: { name: '玉米', icon: '🌽', cost: 20, sell: 55, duration: 60000, exp: 8 },
          tomato: { name: '番茄', icon: '🍅', cost: 50, sell: 150, duration: 120000, exp: 12 },
          pumpkin: { name: '南瓜', icon: '🎃', cost: 100, sell: 350, duration: 300000, exp: 20 },
          strawberry: { name: '草莓', icon: '🍓', cost: 200, sell: 700, duration: 600000, exp: 35 },
          cotton: { name: '棉花', icon: '🌿', cost: 300, sell: 1200, duration: 1800000, exp: 50 },
          sunflower: { name: '向日葵', icon: '🌻', cost: 500, sell: 2500, duration: 7200000, exp: 80 },
          grape: { name: '葡萄', icon: '🍇', cost: 800, sell: 5000, duration: 21600000, exp: 150 },
          apple: { name: '苹果', icon: '🍎', cost: 1200, sell: 9000, duration: 43200000, exp: 250 },
          ginseng: { name: '人参', icon: '🌱', cost: 2000, sell: 20000, duration: 86400000, exp: 500 }
        }[key],
      durationText: this.formatDuration({ wheat: 30000, corn: 60000, tomato: 120000, pumpkin: 300000, strawberry: 600000, cotton: 1800000, sunflower: 7200000, grape: 21600000, apple: 43200000, ginseng: 86400000 }[key])
    }));

    // 心情作物
    const moodCrops = Object.keys({
      sadness: { name: '忧伤.exe', icon: '😢', cost: 5, sell: 15, duration: 60000, exp: 3 },
      lonely: { name: '寂寞.bat', icon: '😔', cost: 10, sell: 35, duration: 1800000, exp: 8 },
      love: { name: '初恋.dll', icon: '💕', cost: 20, sell: 80, duration: 3600000, exp: 15 },
      memory: { name: '记忆.dat', icon: '🧠', cost: 100, sell: 500, duration: 10800000, exp: 50 },
      dream: { name: '梦境.exe', icon: '💭', cost: 200, sell: 1500, duration: 43200000, exp: 150 },
      destiny: { name: '命运.dll', icon: '✨', cost: 500, sell: 5000, duration: 86400000, exp: 400 }
    }).map(key => ({
      id: key,
      type: 'mood',
      ...{ sadness: { name: '忧伤.exe', icon: '😢', cost: 5, sell: 15, duration: 60000, exp: 3 },
          lonely: { name: '寂寞.bat', icon: '😔', cost: 10, sell: 35, duration: 1800000, exp: 8 },
          love: { name: '初恋.dll', icon: '💕', cost: 20, sell: 80, duration: 3600000, exp: 15 },
          memory: { name: '记忆.dat', icon: '🧠', cost: 100, sell: 500, duration: 10800000, exp: 50 },
          dream: { name: '梦境.exe', icon: '💭', cost: 200, sell: 1500, duration: 43200000, exp: 150 },
          destiny: { name: '命运.dll', icon: '✨', cost: 500, sell: 5000, duration: 86400000, exp: 400 }
        }[key],
      durationText: this.formatDuration({ sadness: 60000, lonely: 1800000, love: 3600000, memory: 10800000, dream: 43200000, destiny: 86400000 }[key])
    }));

    // 装饰
    const decorations = [
      { id: 'fence_wood', name: '木栅栏', icon: '🚧', cost: 100, effect: '无' },
      { id: 'fence_gold', name: '金栅栏', icon: '✨', cost: 500, effect: '产量+10%' },
      { id: 'scarecrow', name: '稻草人', icon: '🎭', cost: 200, effect: '被偷概率-20%' },
      { id: 'sprinkler', name: '喷灌系统', icon: '⛲', cost: 1000, effect: '生长速度+15%' }
    ];

    this.setData({
      traditionalCrops,
      moodCrops,
      decorations
    });
  },

  /**
   * 格式化时长
   */
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}秒`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    return `${hours}小时`;
  },

  /**
   * 初始化农场（使用 API 客户端）
   */
  async initFarm() {
    wx.showLoading({ title: '加载中...' });

    try {
      // 获取农场数据
      const profileResult = await qcioApi.getFarmProfile();

      if (profileResult && profileResult.success) {
        const profile = profileResult.data;

        if (!profile) {
          // 需要初始化
          const initResult = await qcioApi.initFarm(this.data.qcioId);

          if (initResult && initResult.success) {
            this.setData({
              farmProfile: initResult.data,
              unlockedPlots: initResult.data.plotCount || 6
            });
          }
        } else {
          this.setData({
            farmProfile: profile,
            unlockedPlots: profile.unlockedPlots || 6
          });
        }
      }

      // 获取土地数据
      await this.loadPlots();

      // 获取钱包数据
      await this.loadWallet();

      // 启动生长监控
      this.startGrowthMonitor();

    } catch (err) {
      console.error('Init farm error:', err);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
      this.setData({ loading: false });
    }
  },

  /**
   * 刷新数据（使用 API 客户端）
   */
  async refreshData() {
    try {
      // 获取农场数据
      const profileResult = await qcioApi.getFarmProfile();

      if (profileResult && profileResult.success) {
        this.setData({
          farmProfile: profileResult.data
        });
      }

      // 获取土地数据
      await this.loadPlots();

      // 获取钱包数据
      await this.loadWallet();

    } catch (err) {
      console.error('Refresh data error:', err);
    }
  },

  /**
   * 加载土地数据（使用 API 客户端）
   */
  async loadPlots() {
    try {
      const result = await qcioApi.getFarmPlots();

      console.log('loadPlots response:', result);

      if (result && result.success) {
        console.log('Plots data:', result.data);
        this.setData({
          plots: result.data
        });
        console.log('Plots after setData:', this.data.plots);
      }
    } catch (err) {
      console.error('Load plots error:', err);
    }
  },

  /**
   * 加载钱包数据（使用 API 客户端）
   */
  async loadWallet() {
    try {
      const result = await qcioApi.getWalletInfo();

      if (result && result.success) {
        this.setData({
          coins: result.data.coins || 0
        });
      }
    } catch (err) {
      console.error('Load wallet error:', err);
    }
  },

  /**
   * 启动生长监控
   */
  startGrowthMonitor() {
    if (this.growthTimer) return;

    this.growthTimer = setInterval(() => {
      this.updateCropProgress();
    }, 3000); // 每3秒更新一次
  },

  /**
   * 停止生长监控
   */
  stopGrowthMonitor() {
    if (this.growthTimer) {
      clearInterval(this.growthTimer);
      this.growthTimer = null;
    }
  },

  /**
   * 更新作物进度
   */
  updateCropProgress() {
    const plots = this.data.plots.map(plot => {
      if (plot.status === 'growing' && plot.maturityTime) {
        const now = Date.now();
        const maturityTime = new Date(plot.maturityTime).getTime();

        if (now >= maturityTime) {
          // 作物成熟
          return { ...plot, status: 'mature', progress: 100, timeLeft: 0 };
        }

        // 计算进度
        const plantTime = new Date(plot.plantTime).getTime();
        const totalDuration = maturityTime - plantTime;
        const elapsed = now - plantTime;
        const progress = Math.floor((elapsed / totalDuration) * 100);
        const timeLeft = Math.max(0, maturityTime - now);

        return { ...plot, progress, timeLeft };
      }

      return plot;
    });

    this.setData({ plots });
  },

  /**
   * 点击土地
   */
  onPlotTap(e) {
    const { index } = e.currentTarget.dataset;
    const plot = this.data.plots[index];

    console.log('onPlotTap called:', { index, plot });

    if (!plot) return;

    this.setData({
      selectedPlotIndex: index
    });

    console.log('Set selectedPlotIndex to:', index);

    if (plot.status === 'empty') {
      console.log('Plot is empty, opening shop');
      // 空地，打开商店选择种子
      this.setData({
        showShopModal: true,
        shopActiveTab: 'seeds'
      });
    } else if (plot.status === 'mature') {
      console.log('Plot is mature, harvesting');
      // 成熟，收获
      this.harvestCrop(index);
    } else {
      console.log('Plot is growing, showing message');
      // 生长中
      wx.showToast({
        title: '作物正在生长中...',
        icon: 'none'
      });
    }
  },

  /**
   * 种植作物（使用 API 客户端）
   */
  async plantCrop(cropType, cropId, plotIndex = null) {
    const selectedPlotIndex = plotIndex !== null ? plotIndex : this.data.selectedPlotIndex;

    console.log('plantCrop called:', { cropType, cropId, selectedPlotIndex, plotIndex });

    if (selectedPlotIndex < 0) return false;

    wx.showLoading({ title: '种植中...' });

    try {
      const result = await qcioApi.plantCrop(selectedPlotIndex, cropType, cropId);

      console.log('plantCrop response:', result);

      wx.hideLoading();

      if (result && result.success) {
        console.log('Plant successful, calling loadPlots...');

        // 刷新土地数据
        await this.loadPlots();

        // 关闭商店
        this.setData({
          showShopModal: false,
          selectedPlotIndex: -1
        });

        return true;
      } else {
        console.error('Plant failed:', result?.message);
        wx.showToast({
          title: result?.message || '种植失败',
          icon: 'none'
        });
        return false;
      }
    } catch (err) {
      wx.hideLoading();
      console.error('Plant crop error:', err);
      wx.showToast({
        title: '种植失败',
        icon: 'none'
      });
      return false;
    }
  },

  /**
   * 购买种子（使用 API 客户端）
   */
  async buySeed(e) {
    const { cropType, cropId } = e.currentTarget.dataset;
    // 在函数开始时保存 selectedPlotIndex
    const savedPlotIndex = this.data.selectedPlotIndex;

    console.log('buySeed called:', { cropType, cropId, selectedPlotIndex: savedPlotIndex });

    wx.showLoading({ title: '购买中...' });

    try {
      const result = await qcioApi.buySeed(cropType, cropId, 1);

      console.log('buySeed response:', result);

      wx.hideLoading();

      if (result && result.success) {
        // 刷新钱包
        await this.loadWallet();

        console.log('Wallet refreshed, savedPlotIndex:', savedPlotIndex);

        // 如果有选中的土地（从空地打开的商店），则自动种植
        if (savedPlotIndex >= 0) {
          console.log('Auto-planting crop to plot:', savedPlotIndex);
          // 传递保存的土地索引
          await this.plantCrop(cropType, cropId, savedPlotIndex);
        } else {
          console.log('No plot selected, just storing seed');
          // 没有选中土地，只购买不种植
        }
      } else {
        wx.showToast({
          title: result?.message || '购买失败',
          icon: 'none'
        });
      }
    } catch (err) {
      wx.hideLoading();
      console.error('Buy seed error:', err);
      wx.showToast({
        title: '购买失败',
        icon: 'none'
      });
    }
  },

  /**
   * 收获作物（使用 API 客户端）
   */
  async harvestCrop(plotIndex) {
    wx.showLoading({ title: '收获中...' });

    try {
      const result = await qcioApi.harvestCrop(plotIndex);

      wx.hideLoading();

      if (result && result.success) {
        const { cropName, sellPrice, expGain, quality, icon } = result.data;

        // 设置收获结果数据
        this.setData({
          harvestResult: {
            show: true,
            cropName,
            icon,
            sellPrice,
            expGain,
            quality
          },
          selectedPlotIndex: -1
        });

        // 刷新数据
        await this.refreshData();
      } else {
        wx.showToast({
          title: result?.message || '收获失败',
          icon: 'none'
        });
      }
    } catch (err) {
      wx.hideLoading();
      console.error('Harvest crop error:', err);
      wx.showToast({
        title: '收获失败',
        icon: 'none'
      });
    }
  },

  /**
   * 关闭收获弹窗
   */
  closeHarvestModal() {
    this.setData({
      'harvestResult.show': false
    });
  },

  /**
   * 打开商店
   */
  openShop() {
    this.setData({
      showShopModal: true,
      shopActiveTab: 'decorations',  // 底部按钮打开商店，显示装饰
      selectedPlotIndex: -1
    });
  },

  /**
   * 关闭商店
   */
  closeShop() {
    this.setData({
      showShopModal: false,
      selectedPlotIndex: -1
    });
  },

  /**
   * 切换商店Tab
   */
  switchShopTab(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({
      shopActiveTab: tab
    });
  },

  /**
   * 购买装饰（使用 API 客户端）
   */
  async buyDecoration(e) {
    const { id } = e.currentTarget.dataset;

    wx.showLoading({ title: '购买中...' });

    try {
      const result = await qcioApi.buyDecoration(id);

      wx.hideLoading();

      if (result && result.success) {
        wx.showToast({
          title: '购买成功',
          icon: 'success'
        });

        // 刷新钱包
        await this.loadWallet();
      } else {
        wx.showToast({
          title: result?.message || '购买失败',
          icon: 'none'
        });
      }
    } catch (err) {
      wx.hideLoading();
      console.error('Buy decoration error:', err);
      wx.showToast({
        title: '购买失败',
        icon: 'none'
      });
    }
  },

  /**
   * 打开日志弹窗
   */
  async openLogModal() {
    wx.showLoading({ title: '加载中...' });
    await this.loadFarmLogs();
    wx.hideLoading();
    this.setData({
      showLogModal: true
    });
  },

  /**
   * 关闭日志弹窗
   */
  closeLogModal() {
    this.setData({
      showLogModal: false
    });
  },

  /**
   * 加载农场日志（使用 API 客户端）
   */
  async loadFarmLogs() {
    try {
      const result = await qcioApi.getFarmLogs();

      if (result && result.success) {
        // 格式化日志数据
        const logs = result.data.map(log => {
          const date = new Date(log.createTime);
          const timeStr = `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

          let icon = '';
          let type = '';
          let detail = '';

          switch (log.action) {
            case 'plant':
              icon = '🌱';
              type = 'plant';
              detail = log.detail || '种植了作物';
              break;
            case 'harvest':
              icon = '🌾';
              type = 'harvest';
              detail = log.detail || '收获了作物';
              break;
            case 'buy':
              icon = '🛒';
              type = 'buy';
              detail = log.detail || '购买了种子';
              break;
            default:
              icon = '📋';
          }

          return {
            time: timeStr,
            icon,
            action: log.actionName || log.action,
            type,
            detail
          };
        });

        this.setData({
          farmLogs: logs
        });
      } else {
        this.setData({
          farmLogs: []
        });
      }
    } catch (err) {
      console.error('Load farm logs error:', err);
      this.setData({
        farmLogs: []
      });
    }
  },

  /**
   * 添加农场日志（使用 API 客户端）
   */
  addFarmLog(action, detail) {
    // 这里可以添加本地临时日志
    const now = new Date();
    const timeStr = `${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let icon = '';
    let type = '';
    let actionName = '';

    switch (action) {
      case 'plant':
        icon = '🌱';
        type = 'plant';
        actionName = '种植作物';
        break;
      case 'harvest':
        icon = '🌾';
        type = 'harvest';
        actionName = '收获作物';
        break;
      case 'buy':
        icon = '🛒';
        type = 'buy';
        actionName = '购买种子';
        break;
      default:
        icon = '📋';
        actionName = action;
    }

    const newLog = {
      time: timeStr,
      icon,
      action: actionName,
      type,
      detail
    };

    // 添加到日志列表开头
    this.setData({
      farmLogs: [newLog, ...this.data.farmLogs]
    });

    // 同步到云端
    qcioApi.addFarmLog({
      action,
      actionName,
      detail,
      createTime: now
    }).catch(err => {
      console.error('Add farm log error:', err);
    });
  },

  /**
   * 返回QCIO空间
   */
  goBack() {
    wx.navigateBack();
  },

  /**
   * 显示等级信息
   */
  showLevelInfo() {
    // 等级配置表
    const levelTable = [
      { level: 1, exp: 0, plots: 6 },
      { level: 2, exp: 100, plots: 6 },
      { level: 3, exp: 300, plots: 9 },
      { level: 5, exp: 800, plots: 12 },
      { level: 10, exp: 3000, plots: 15 },
      { level: 15, exp: 8000, plots: 18 },
      { level: 20, exp: 15000, plots: 21 },
      { level: 30, exp: 50000, plots: 24 }
    ];

    this.setData({
      showInfoModal: true,
      infoType: 'level',
      infoModalTitle: '🌾 农场等级',
      levelTable: levelTable
    });
  },

  /**
   * 显示经验信息
   */
  showExpInfo() {
    const currentLevel = this.data.farmProfile?.farmLevel || 1;
    const currentExp = this.data.farmProfile?.farmExp || 0;

    // 计算下一级所需经验
    let nextLevelExp = 0;
    let isMaxLevel = false;

    const levelThresholds = [
      { level: 2, exp: 100 },
      { level: 3, exp: 300 },
      { level: 5, exp: 800 },
      { level: 10, exp: 3000 },
      { level: 15, exp: 8000 },
      { level: 20, exp: 15000 },
      { level: 30, exp: 50000 }
    ];

    // 找到下一个等级阈值
    for (const threshold of levelThresholds) {
      if (currentLevel < threshold.level) {
        nextLevelExp = threshold.exp;
        break;
      }
    }

    if (currentLevel >= 30) {
      isMaxLevel = true;
      nextLevelExp = 0;
    }

    // 经验来源
    const expSources = [
      { name: '小麦', exp: 5 },
      { name: '玉米', exp: 8 },
      { name: '番茄', exp: 12 },
      { name: '南瓜', exp: 20 },
      { name: '草莓', exp: 35 },
      { name: '棉花', exp: 50 },
      { name: '向日葵', exp: 80 },
      { name: '葡萄', exp: 150 },
      { name: '苹果', exp: 250 },
      { name: '人参', exp: 500 }
    ];

    this.setData({
      showInfoModal: true,
      infoType: 'exp',
      infoModalTitle: '⭐ 农场经验',
      nextLevelExp: nextLevelExp,
      isMaxLevel: isMaxLevel,
      expSources: expSources
    });
  },

  /**
   * 显示金币信息
   */
  showCoinInfo() {
    // 金币获取方式
    const coinSources = [
      { name: '收获作物', desc: '根据作物品质获得金币' },
      { name: '每日任务', desc: '完成农场相关任务获得奖励' },
      { name: '升级奖励', desc: '农场等级提升时获得金币' }
    ];

    this.setData({
      showInfoModal: true,
      infoType: 'coin',
      infoModalTitle: '💰 金币说明',
      coinSources: coinSources
    });
  },

  /**
   * 关闭信息弹窗
   */
  closeInfoModal() {
    this.setData({
      showInfoModal: false
    });
  }
});
