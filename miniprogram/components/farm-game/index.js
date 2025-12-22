// miniprogram/components/farm-game/index.js
const CROPS = {
  'neon_shroom': { name: 'Pixel Shroom', icon: '🍄', cost: 10, sell: 25, duration: 10000 },
  'cyber_flower': { name: 'Bit Rose', icon: '🌹', cost: 30, sell: 80, duration: 30000 },
  'quantum_berry': { name: 'Data Berry', icon: '🍇', cost: 100, sell: 300, duration: 60000 },
  'void_crystal': { name: 'Logic Gem', icon: '💎', cost: 500, sell: 1500, duration: 120000 }
};

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    farmCoins: 200,
    farmExp: 0,
    farmLevel: 1,
    farmPlots: [],
    farmMessage: 'Welcome to your Homepage Garden!',
    
    showShopModal: false,
    selectedPlotIndex: -1,
    
    neighborFarm: null,
    isVisiting: false,
    
    // 定时器引用
    farmTimer: null
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      this.initFarm();
      this.startFarmTimer();
    },
    detached() {
      this.stopFarmTimer();
      this.saveFarm();
    }
  },

  pageLifetimes: {
    hide() {
      this.saveFarm();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initFarm: function() {
      const savedData = wx.getStorageSync('galaxy_farm_data');
      if (savedData) {
        this.setData({
          farmCoins: savedData.coins,
          farmExp: savedData.exp,
          farmLevel: savedData.level,
          farmPlots: savedData.plots
        });
      } else {
        const plots = Array(6).fill(0).map((_, i) => ({
          id: i, status: 0, cropType: null, plantTime: 0
        }));
        this.setData({ farmPlots: plots });
      }
    },
  
    saveFarm: function() {
      wx.setStorageSync('galaxy_farm_data', {
        coins: this.data.farmCoins,
        exp: this.data.farmExp,
        level: this.data.farmLevel,
        plots: this.data.farmPlots
      });
    },
  
    startFarmTimer: function() {
      // 避免重复启动
      if (this.data.farmTimer) return;
      
      const timer = setInterval(() => {
        this.updateCrops();
      }, 1000);
      this.setData({ farmTimer: timer });
    },
  
    stopFarmTimer: function() {
      if (this.data.farmTimer) {
        clearInterval(this.data.farmTimer);
        this.setData({ farmTimer: null });
      }
    },
  
    updateCrops: function() {
      const now = Date.now();
      let changed = false;
      const newPlots = this.data.farmPlots.map(p => {
        if (p.status === 1) { // 生长中
          const crop = CROPS[p.cropType];
          if (now - p.plantTime >= crop.duration) {
            p.status = 2; // 成熟
            changed = true;
          }
        }
        return p;
      });
  
      if (changed) {
        this.setData({ farmPlots: newPlots });
      }
    },
  
    onPlotTap: function(e) {
      const index = e.currentTarget.dataset.index;
      
      // 偷菜逻辑
      if (this.data.isVisiting) {
        this.stealCrop(index);
        return;
      }
  
      // 自己家逻辑
      const plot = this.data.farmPlots[index];
      if (plot.status === 0) {
        this.setData({ showShopModal: true, selectedPlotIndex: index });
      } else if (plot.status === 2) {
        this.harvest(index);
      } else if (plot.status === 1) {
        const crop = CROPS[plot.cropType];
        const remaining = Math.ceil((crop.duration - (Date.now() - plot.plantTime)) / 1000);
        this.showFarmMsg(`${crop.name}: ${remaining}s left`);
      }
    },
  
    plantSeed: function(e) {
      const type = e.currentTarget.dataset.type;
      const index = this.data.selectedPlotIndex;
      const crop = CROPS[type];
  
      if (this.data.farmCoins < crop.cost) {
        this.showFarmMsg("Not enough Credits!");
        return;
      }
  
      const newPlots = [...this.data.farmPlots];
      newPlots[index] = {
        id: index, status: 1, cropType: type, plantTime: Date.now()
      };
  
      this.setData({
        farmPlots: newPlots,
        farmCoins: this.data.farmCoins - crop.cost,
        showShopModal: false
      });
      this.showFarmMsg(`Planted ${crop.name}.`);
    },
  
    harvest: function(index) {
      const plot = this.data.farmPlots[index];
      const crop = CROPS[plot.cropType];
      const profit = crop.sell;
      const expGain = Math.floor(crop.cost / 2);
  
      const newPlots = [...this.data.farmPlots];
      newPlots[index] = { id: index, status: 0, cropType: null, plantTime: 0 };
  
      this.setData({
        farmPlots: newPlots,
        farmCoins: this.data.farmCoins + profit,
        farmExp: this.data.farmExp + expGain
      });
      this.checkLevelUp();
      this.showFarmMsg(`Harvested! +${profit}c`);
    },
  
    checkLevelUp: function() {
      const nextLevelExp = this.data.farmLevel * 100;
      if (this.data.farmExp >= nextLevelExp) {
        this.setData({
          farmLevel: this.data.farmLevel + 1,
          farmExp: this.data.farmExp - nextLevelExp,
          farmCoins: this.data.farmCoins + 100
        });
        this.showFarmMsg(`LEVEL UP! Now Level ${this.data.farmLevel}`);
      }
    },
  
    closeShop: function() {
      this.setData({ showShopModal: false });
    },
  
    visitNeighbor: function() {
      this.showFarmMsg("Dialing neighbor...");
      // 通知父组件更新状态栏
      this.triggerEvent('statuschange', { text: 'Connecting to remote host...' });
      
      setTimeout(() => {
        // 生成随机网友名字
        const names = ["Guest", "CoolBoy", "Matrix", "Y2K_Girl", "WebMaster", "Surfer"];
        const randomName = names[Math.floor(Math.random() * names.length)] + "_" + Math.floor(Math.random()*99);
  
        const fakePlots = Array(6).fill(0).map((_, i) => {
          const isRipe = Math.random() > 0.5;
          const types = Object.keys(CROPS);
          const randomType = types[Math.floor(Math.random() * types.length)];
          return {
            id: i,
            status: isRipe ? 2 : (Math.random() > 0.5 ? 1 : 0),
            cropType: randomType,
            plantTime: Date.now()
          };
        });
  
        this.setData({
          isVisiting: true,
          neighborFarm: { name: randomName, plots: fakePlots },
          farmMessage: `Welcome to ${randomName}'s Garden!`
        });
        
        this.triggerEvent('statuschange', { text: 'Connected [128kbps]' });
      }, 800);
    },
  
    returnToFarm: function() {
      this.setData({ isVisiting: false, farmMessage: "Home sweet home." });
    },
  
    stealCrop: function(index) {
      const plots = [...this.data.neighborFarm.plots];
      const plot = plots[index];
      if (plot.status !== 2) {
        this.showFarmMsg("Not ripe yet!");
        return;
      }
      
      const crop = CROPS[plot.cropType];
      const val = Math.floor(crop.sell * 0.6);
      
      plots[index] = { ...plot, status: 0, cropType: null };
      
      this.setData({
        'neighborFarm.plots': plots,
        farmCoins: this.data.farmCoins + val
      });
      this.showFarmMsg(`Took ${crop.name} from neighbor! +${val}c`);
    },
  
    showFarmMsg: function(msg) {
      this.setData({ farmMessage: msg });
    }
  }
})