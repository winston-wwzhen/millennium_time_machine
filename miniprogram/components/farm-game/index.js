// miniprogram/components/farm-game/index.js
const CROPS = {
  'neon_shroom': { name: '像素蘑菇', icon: '🍄', cost: 10, sell: 25, duration: 10000 },
  'cyber_flower': { name: '比特玫瑰', icon: '🌹', cost: 30, sell: 80, duration: 30000 },
  'quantum_berry': { name: '数据浆果', icon: '🍇', cost: 100, sell: 300, duration: 60000 },
  'void_crystal': { name: '逻辑宝石', icon: '💎', cost: 500, sell: 1500, duration: 120000 }
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
    farmMessage: '欢迎来到你的主页花园！',
    
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
        this.showFarmMsg("积分不足！");
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
      this.showFarmMsg(`种下了 ${crop.name}。`);
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
      this.showFarmMsg(`收获！+${profit}积分`);
    },
  
    checkLevelUp: function() {
      const nextLevelExp = this.data.farmLevel * 100;
      if (this.data.farmExp >= nextLevelExp) {
        this.setData({
          farmLevel: this.data.farmLevel + 1,
          farmExp: this.data.farmExp - nextLevelExp,
          farmCoins: this.data.farmCoins + 100
        });
        this.showFarmMsg(`升级！当前等级 ${this.data.farmLevel}`);
      }
    },
  
    closeShop: function() {
      this.setData({ showShopModal: false });
    },
  
    visitNeighbor: function() {
      this.showFarmMsg("正在拨号邻居...");
      // 通知父组件更新状态栏
      this.triggerEvent('statuschange', { text: '正在连接远程主机...' });
      
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
          farmMessage: `欢迎来到 ${randomName} 的花园！`
        });
        
        this.triggerEvent('statuschange', { text: '已连接 [128kbps]' });
      }, 800);
    },
  
    returnToFarm: function() {
      this.setData({ isVisiting: false, farmMessage: "回到温馨的家。" });
    },
  
    stealCrop: function(index) {
      const plots = [...this.data.neighborFarm.plots];
      const plot = plots[index];
      if (plot.status !== 2) {
        this.showFarmMsg("还没成熟呢！");
        return;
      }
      
      const crop = CROPS[plot.cropType];
      const val = Math.floor(crop.sell * 0.6);
      
      plots[index] = { ...plot, status: 0, cropType: null };
      
      this.setData({
        'neighborFarm.plots': plots,
        farmCoins: this.data.farmCoins + val
      });
      this.showFarmMsg(`从邻居那拿了 ${crop.name}！+${val}积分`);
    },
  
    showFarmMsg: function(msg) {
      this.setData({ farmMessage: msg });
    }
  }
})