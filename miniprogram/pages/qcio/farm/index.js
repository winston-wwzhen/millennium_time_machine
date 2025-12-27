/**
 * QCIO 农场页面
 * Win98 风格
 */
const app = getApp();

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
    coins: 0
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
      strawberry: { name: '草莓', icon: '🍓', cost: 200, sell: 700, duration: 600000, exp: 35 }
    }).map(key => ({
      id: key,
      type: 'traditional',
      ...{ wheat: { name: '小麦', icon: '🌾', cost: 10, sell: 25, duration: 30000, exp: 5 },
          corn: { name: '玉米', icon: '🌽', cost: 20, sell: 55, duration: 60000, exp: 8 },
          tomato: { name: '番茄', icon: '🍅', cost: 50, sell: 150, duration: 120000, exp: 12 },
          pumpkin: { name: '南瓜', icon: '🎃', cost: 100, sell: 350, duration: 300000, exp: 20 },
          strawberry: { name: '草莓', icon: '🍓', cost: 200, sell: 700, duration: 600000, exp: 35 }
        }[key],
      durationText: this.formatDuration({ wheat: 30000, corn: 60000, tomato: 120000, pumpkin: 300000, strawberry: 600000 }[key])
    }));

    // 心情作物
    const moodCrops = Object.keys({
      sadness: { name: '忧伤.exe', icon: '😢', cost: 5, sell: 15, duration: 60000, exp: 3 },
      lonely: { name: '寂寞.bat', icon: '😔', cost: 10, sell: 35, duration: 1800000, exp: 8 },
      love: { name: '初恋.dll', icon: '💕', cost: 20, sell: 80, duration: 3600000, exp: 15 }
    }).map(key => ({
      id: key,
      type: 'mood',
      ...{ sadness: { name: '忧伤.exe', icon: '😢', cost: 5, sell: 15, duration: 60000, exp: 3 },
          lonely: { name: '寂寞.bat', icon: '😔', cost: 10, sell: 35, duration: 1800000, exp: 8 },
          love: { name: '初恋.dll', icon: '💕', cost: 20, sell: 80, duration: 3600000, exp: 15 }
        }[key],
      durationText: this.formatDuration({ sadness: 60000, lonely: 1800000, love: 3600000 }[key])
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
   * 初始化农场
   */
  async initFarm() {
    wx.showLoading({ title: '加载中...' });

    try {
      // 获取农场数据
      const profileRes = await wx.cloud.callFunction({
        name: 'qcio',
        data: { action: 'getFarmProfile' }
      });

      if (profileRes.result.success) {
        const profile = profileRes.result.data;

        if (!profile) {
          // 需要初始化
          const initRes = await wx.cloud.callFunction({
            name: 'qcio',
            data: {
              action: 'initFarm',
              qcio_id: this.data.qcioId
            }
          });

          if (initRes.result.success) {
            this.setData({
              farmProfile: initRes.result.data,
              unlockedPlots: initRes.result.data.plotCount || 6
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
   * 刷新数据
   */
  async refreshData() {
    try {
      // 获取农场数据
      const profileRes = await wx.cloud.callFunction({
        name: 'qcio',
        data: { action: 'getFarmProfile' }
      });

      if (profileRes.result.success) {
        this.setData({
          farmProfile: profileRes.result.data
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
   * 加载土地数据
   */
  async loadPlots() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'qcio',
        data: { action: 'getFarmPlots' }
      });

      if (res.result.success) {
        this.setData({
          plots: res.result.data
        });
      }
    } catch (err) {
      console.error('Load plots error:', err);
    }
  },

  /**
   * 加载钱包数据
   */
  async loadWallet() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'qcio',
        data: { action: 'getWallet' }
      });

      if (res.result.success) {
        this.setData({
          coins: res.result.data.coins || 0
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

    if (!plot) return;

    this.setData({
      selectedPlotIndex: index
    });

    if (plot.status === 'empty') {
      // 空地，打开商店选择种子
      this.setData({
        showShopModal: true,
        shopActiveTab: 'seeds'
      });
    } else if (plot.status === 'mature') {
      // 成熟，收获
      this.harvestCrop(index);
    } else {
      // 生长中
      wx.showToast({
        title: '作物正在生长中...',
        icon: 'none'
      });
    }
  },

  /**
   * 种植作物
   */
  async plantCrop(cropType, cropId) {
    const { selectedPlotIndex } = this.data;

    if (selectedPlotIndex < 0) return;

    wx.showLoading({ title: '种植中...' });

    try {
      const res = await wx.cloud.callFunction({
        name: 'qcio',
        data: {
          action: 'plantCrop',
          plotIndex: selectedPlotIndex,
          cropType: cropType,
          cropId: cropId
        }
      });

      wx.hideLoading();

      if (res.result.success) {
        wx.showToast({
          title: '种植成功',
          icon: 'success'
        });

        // 刷新土地数据
        await this.loadPlots();

        // 关闭商店
        this.setData({
          showShopModal: false,
          selectedPlotIndex: -1
        });
      } else {
        wx.showToast({
          title: res.result.message || '种植失败',
          icon: 'none'
        });
      }
    } catch (err) {
      wx.hideLoading();
      console.error('Plant crop error:', err);
      wx.showToast({
        title: '种植失败',
        icon: 'none'
      });
    }
  },

  /**
   * 购买种子
   */
  async buySeed(cropType, cropId) {
    wx.showLoading({ title: '购买中...' });

    try {
      const res = await wx.cloud.callFunction({
        name: 'qcio',
        data: {
          action: 'buySeed',
          cropType: cropType,
          cropId: cropId,
          quantity: 1
        }
      });

      wx.hideLoading();

      if (res.result.success) {
        wx.showToast({
          title: '购买成功',
          icon: 'success'
        });

        // 刷新钱包
        await this.loadWallet();

        // 自动种植
        await this.plantCrop(cropType, cropId);
      } else {
        wx.showToast({
          title: res.result.message || '购买失败',
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
   * 收获作物
   */
  async harvestCrop(plotIndex) {
    wx.showLoading({ title: '收获中...' });

    try {
      const res = await wx.cloud.callFunction({
        name: 'qcio',
        data: {
          action: 'harvestCrop',
          plotIndex: plotIndex
        }
      });

      wx.hideLoading();

      if (res.result.success) {
        const { cropName, sellPrice, expGain } = res.result.data;

        wx.showModal({
          title: '收获成功！',
          content: `${cropName}\n获得 ${sellPrice} 金币\n获得 ${expGain} 经验`,
          showCancel: false,
          confirmText: '知道了'
        });

        // 刷新数据
        await this.refreshData();

        this.setData({ selectedPlotIndex: -1 });
      } else {
        wx.showToast({
          title: res.result.message || '收获失败',
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
   * 打开商店
   */
  openShop() {
    this.setData({
      showShopModal: true,
      shopActiveTab: 'seeds'
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
   * 购买装饰
   */
  async buyDecoration(e) {
    const { id } = e.currentTarget.dataset;

    wx.showLoading({ title: '购买中...' });

    try {
      const res = await wx.cloud.callFunction({
        name: 'qcio',
        data: {
          action: 'buyDecoration',
          decorationId: id
        }
      });

      wx.hideLoading();

      if (res.result.success) {
        wx.showToast({
          title: '购买成功',
          icon: 'success'
        });

        // 刷新钱包
        await this.loadWallet();
      } else {
        wx.showToast({
          title: res.result.message || '购买失败',
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
   * 返回QCIO空间
   */
  goBack() {
    wx.navigateBack();
  }
});
