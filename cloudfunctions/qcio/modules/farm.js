/**
 * QCIO 农场模块
 * 深度集成QCIO生态系统
 * 双轨并行：传统种植作物 + 心情作物
 */

// ==================== 配置常量 ====================

/**
 * 传统作物配置
 */
const TRADITIONAL_CROPS = {
  wheat: { name: '小麦', icon: '🌾', cost: 10, sell: 25, duration: 30000, exp: 5 },
  corn: { name: '玉米', icon: '🌽', cost: 20, sell: 55, duration: 60000, exp: 8 },
  tomato: { name: '番茄', icon: '🍅', cost: 50, sell: 150, duration: 120000, exp: 12 },
  pumpkin: { name: '南瓜', icon: '🎃', cost: 100, sell: 350, duration: 300000, exp: 20 },
  strawberry: { name: '草莓', icon: '🍓', cost: 200, sell: 700, duration: 600000, exp: 35 }
};

/**
 * 心情作物配置
 */
const MOOD_CROPS = {
  sadness: { name: '忧伤.exe', icon: '😢', cost: 5, sell: 15, duration: 60000, exp: 3, mood_output: 10 },
  lonely: { name: '寂寞.bat', icon: '😔', cost: 10, sell: 35, duration: 1800000, exp: 8, mood_output: 20 },
  love: { name: '初恋.dll', icon: '💕', cost: 20, sell: 80, duration: 3600000, exp: 15, mood_output: 50 }
};

/**
 * 装饰配置
 */
const DECORATIONS = {
  fence_wood: { name: '木栅栏', icon: '🚧', cost: 100, type: 'border', effect: 'none' },
  fence_gold: { name: '金栅栏', icon: '✨', cost: 500, type: 'border', effect: 'yield_10' },
  scarecrow: { name: '稻草人', icon: '🎭', cost: 200, type: 'prop', effect: 'steal_reduce_20' },
  sprinkler: { name: '喷灌系统', icon: '⛲', cost: 1000, type: 'tool', effect: 'speed_15' }
};

/**
 * 土地解锁配置
 */
const PLOT_UNLOCK = {
  6: { cost: 0, level_req: 1 },
  9: { cost: 500, level_req: 3 },
  12: { cost: 2000, level_req: 5 },
  15: { cost: 5000, level_req: 10 },
  18: { cost: 10000, level_req: 15 },
  21: { cost: 20000, level_req: 20 },
  24: { cost: 50000, level_req: 30 }
};

/**
 * 农场等级配置
 */
const FARM_LEVELS = {
  1: { exp: 0, plots: 6 },
  2: { exp: 100, plots: 6 },
  3: { exp: 300, plots: 9 },
  5: { exp: 800, plots: 12 },
  10: { exp: 3000, plots: 15 },
  15: { exp: 8000, plots: 18 },
  20: { exp: 15000, plots: 21 },
  30: { exp: 50000, plots: 24 }
};

// ==================== 辅助函数 ====================

/**
 * 根据等级获取土地数量
 */
function getPlotsByLevel(level) {
  // 找到不超过当前等级的最大配置
  let plots = 6;
  for (const [lvl, config] of Object.entries(FARM_LEVELS).sort((a, b) => b[0] - a[0])) {
    if (level >= parseInt(lvl)) {
      plots = config.plots;
      break;
    }
  }
  return plots;
}

/**
 * 根据经验获取等级
 */
function getLevelByExp(exp) {
  let level = 1;
  for (const [lvl, config] of Object.entries(FARM_LEVELS).sort((a, b) => a[0] - b[0])) {
    if (exp >= config.exp) {
      level = parseInt(lvl);
    }
  }
  return level;
}

/**
 * 获取下一个等级所需经验
 */
function getNextLevelExp(currentLevel) {
  // 找到下一个等级
  const levels = Object.keys(FARM_LEVELS).map(Number).sort((a, b) => a - b);
  for (const lvl of levels) {
    if (lvl > currentLevel) {
      return FARM_LEVELS[lvl].exp;
    }
  }
  return null; // 已满级
}

// ==================== 核心功能函数 ====================

/**
 * 获取农场数据
 * @param {String} openid - 用户openid
 * @param {Object} db - 数据库实例
 */
async function getFarmProfile(openid, db) {
  try {
    const profileCollection = db.collection('qcio_farm_profiles');

    // 查询农场档案
    const res = await profileCollection.where({ _openid: openid }).limit(1).get();

    if (res.data.length > 0) {
      const profile = res.data[0];
      return {
        success: true,
        data: {
          farmName: profile.farm_name || '我的农场',
          farmLevel: profile.farm_level || 1,
          farmExp: profile.farm_exp || 0,
          unlockedPlots: profile.unlocked_plots || 6,
          decorations: profile.decorations || [],
          activeDecoration: profile.active_decoration || null,
          farmTheme: profile.farm_theme || 'default',
          totalHarvestCount: profile.total_harvest_count || 0,
          totalCoinsEarned: profile.total_coins_earned || 0
        }
      };
    }

    // 农场不存在，需要初始化
    return {
      success: true,
      data: null,
      needsInit: true,
      message: '农场未初始化'
    };

  } catch (err) {
    console.error('getFarmProfile Error:', err);
    return { success: false, error: err, message: '获取农场数据失败' };
  }
}

/**
 * 初始化农场（新用户）
 * @param {String} openid - 用户openid
 * @param {String} qcioId - QCIO账号
 * @param {Object} db - 数据库实例
 */
async function initFarm(openid, qcioId, db) {
  try {
    const profileCollection = db.collection('qcio_farm_profiles');
    const plotsCollection = db.collection('qcio_farm_plots');

    // 创建农场档案
    const profile = {
      _openid: openid,
      qcio_id: qcioId,
      farm_name: '我的农场',
      farm_level: 1,
      farm_exp: 0,
      unlocked_plots: 6,
      decorations: [],
      active_decoration: null,
      farm_theme: 'default',
      total_harvest_count: 0,
      total_coins_earned: 0,
      total_exp_earned: 0,
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    };

    const profileRes = await profileCollection.add({ data: profile });

    // 创建初始土地（6块）
    const plots = [];
    for (let i = 0; i < 6; i++) {
      plots.push({
        _openid: openid,
        plot_index: i,
        plot_type: 'normal',
        crop_id: null,
        crop_type: null,
        plant_time: null,
        maturity_time: null,
        status: 'empty',
        base_yield: 0,
        current_yield: 0,
        quality: 0,
        stolen_by: [],
        steal_count: 0,
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      });
    }

    // 批量创建土地
    for (const plot of plots) {
      await plotsCollection.add({ data: plot });
    }

    return {
      success: true,
      data: {
        farmName: profile.farm_name,
        farmLevel: profile.farm_level,
        farmExp: profile.farm_exp,
        unlockedPlots: profile.unlocked_plots,
        plotCount: 6
      },
      message: '农场初始化成功'
    };

  } catch (err) {
    console.error('initFarm Error:', err);
    return { success: false, error: err, message: '农场初始化失败' };
  }
}

/**
 * 获取土地状态
 * @param {String} openid - 用户openid
 * @param {Object} db - 数据库实例
 */
async function getFarmPlots(openid, db) {
  try {
    const res = await db.collection('qcio_farm_plots')
      .where({ _openid: openid })
      .orderBy('plot_index', 'asc')
      .get();

    const plots = res.data.map(plot => {
      // 计算生长进度
      let progress = 0;
      let timeLeft = 0;
      let status = plot.status;

      if (plot.status === 'growing' && plot.plant_time && plot.maturity_time) {
        const now = Date.now();
        const plantTime = new Date(plot.plant_time).getTime();
        const maturityTime = new Date(plot.maturity_time).getTime();
        const totalDuration = maturityTime - plantTime;
        const elapsed = now - plantTime;

        progress = Math.min(100, Math.max(0, Math.floor((elapsed / totalDuration) * 100)));
        timeLeft = Math.max(0, maturityTime - now);

        // 检查是否成熟
        if (now >= maturityTime) {
          status = 'mature';
          // 更新状态
          db.collection('qcio_farm_plots').doc(plot._id).update({
            data: { status: 'mature', updateTime: db.serverDate() }
          });
        }
      }

      return {
        index: plot.plot_index,
        plotType: plot.plot_type || 'normal',
        cropId: plot.crop_id,
        cropType: plot.crop_type,
        plantTime: plot.plant_time,
        maturityTime: plot.maturity_time,
        status: status,
        baseYield: plot.base_yield || 0,
        currentYield: plot.current_yield || 0,
        quality: plot.quality || 0,
        progress: progress,
        timeLeft: timeLeft,
        stealCount: plot.steal_count || 0
      };
    });

    return {
      success: true,
      data: plots
    };

  } catch (err) {
    console.error('getFarmPlots Error:', err);
    return { success: false, error: err, message: '获取土地数据失败' };
  }
}

/**
 * 购买种子
 * @param {String} openid - 用户openid
 * @param {String} cropType - 作物类型 (traditional/mood)
 * @param {String} cropId - 作物ID
 * @param {Number} quantity - 数量
 * @param {Object} db - 数据库实例
 * @param {Object} _ - 数据库命令
 */
async function buySeed(openid, cropType, cropId, quantity, db, _) {
  try {
    // 获取作物配置
    const cropConfig = cropType === 'mood' ? MOOD_CROPS[cropId] : TRADITIONAL_CROPS[cropId];
    if (!cropConfig) {
      return { success: false, message: '作物不存在' };
    }

    const cost = cropConfig.cost * quantity;

    // 导入钱包模块
    const { addTransaction } = require('./wallet');

    // 扣除金币
    const buyResult = await addTransaction(openid, {
      type: 'spend',
      currency: 'coins',
      amount: cost,
      source: 'farm_buy_seed',
      description: `购买${cropConfig.name}种子×${quantity}`
    }, db, _);

    if (!buyResult.success) {
      return buyResult;
    }

    // 添加到仓库
    const inventoryCollection = db.collection('qcio_farm_inventory');

    // 检查是否已有该种子
    const existingRes = await inventoryCollection.where({
      _openid: openid,
      item_type: 'seed',
      item_id: `${cropType}_${cropId}`
    }).get();

    if (existingRes.data.length > 0) {
      // 更新数量
      await inventoryCollection.doc(existingRes.data[0]._id).update({
        data: {
          quantity: _.inc(quantity),
          updateTime: db.serverDate()
        }
      });
    } else {
      // 新增记录
      await inventoryCollection.add({
        data: {
          _openid: openid,
          item_type: 'seed',
          item_id: `${cropType}_${cropId}`,
          item_name: cropConfig.name,
          icon: cropConfig.icon,
          quantity: quantity,
          createTime: db.serverDate()
        }
      });
    }

    return {
      success: true,
      data: {
        cropName: cropConfig.name,
        icon: cropConfig.icon,
        quantity: quantity,
        cost: cost
      },
      message: `购买成功`
    };

  } catch (err) {
    console.error('buySeed Error:', err);
    return { success: false, error: err, message: '购买种子失败' };
  }
}

/**
 * 种植作物
 * @param {String} openid - 用户openid
 * @param {Number} plotIndex - 土地索引
 * @param {String} cropType - 作物类型 (traditional/mood)
 * @param {String} cropId - 作物ID
 * @param {Object} db - 数据库实例
 */
async function plantCrop(openid, plotIndex, cropType, cropId, db) {
  try {
    // 获取作物配置
    const cropConfig = cropType === 'mood' ? MOOD_CROPS[cropId] : TRADITIONAL_CROPS[cropId];
    if (!cropConfig) {
      return { success: false, message: '作物不存在' };
    }

    // 检查种子数量
    const inventoryRes = await db.collection('qcio_farm_inventory').where({
      _openid: openid,
      item_type: 'seed',
      item_id: `${cropType}_${cropId}`
    }).get();

    if (inventoryRes.data.length === 0 || inventoryRes.data[0].quantity < 1) {
      return { success: false, message: '种子不足' };
    }

    // 检查土地状态
    const plotRes = await db.collection('qcio_farm_plots').where({
      _openid: openid,
      plot_index: plotIndex
    }).get();

    if (plotRes.data.length === 0) {
      return { success: false, message: '土地不存在' };
    }

    const plot = plotRes.data[0];
    if (plot.status !== 'empty') {
      return { success: false, message: '土地已有作物' };
    }

    // 计算成熟时间
    const now = new Date();
    const maturityTime = new Date(now.getTime() + cropConfig.duration);

    // 更新土地状态
    await db.collection('qcio_farm_plots').doc(plot._id).update({
      data: {
        crop_id: cropId,
        crop_type: cropType,
        plant_time: db.serverDate(),
        maturity_time: db.serverDate({ offset: cropConfig.duration }),
        status: 'growing',
        base_yield: cropConfig.mood_output || 1,
        current_yield: cropConfig.mood_output || 1,
        quality: 1,
        stolen_by: [],
        steal_count: 0,
        updateTime: db.serverDate()
      }
    });

    // 扣除种子
    const inventoryCollection = db.collection('qcio_farm_inventory');
    const newQuantity = inventoryRes.data[0].quantity - 1;
    if (newQuantity > 0) {
      await inventoryCollection.doc(inventoryRes.data[0]._id).update({
        data: { quantity: newQuantity, updateTime: db.serverDate() }
      });
    } else {
      await inventoryCollection.doc(inventoryRes.data[0]._id).remove();
    }

    return {
      success: true,
      data: {
        plotIndex: plotIndex,
        cropName: cropConfig.name,
        icon: cropConfig.icon,
        duration: cropConfig.duration,
        maturityTime: maturityTime.getTime()
      },
      message: '种植成功'
    };

  } catch (err) {
    console.error('plantCrop Error:', err);
    return { success: false, error: err, message: '种植失败' };
  }
}

/**
 * 收获作物
 * @param {String} openid - 用户openid
 * @param {Number} plotIndex - 土地索引
 * @param {Object} db - 数据库实例
 * @param {Object} _ - 数据库命令
 */
async function harvestCrop(openid, plotIndex, db, _) {
  try {
    // 获取土地状态
    const plotRes = await db.collection('qcio_farm_plots').where({
      _openid: openid,
      plot_index: plotIndex
    }).get();

    if (plotRes.data.length === 0) {
      return { success: false, message: '土地不存在' };
    }

    const plot = plotRes.data[0];

    // 检查状态
    if (plot.status !== 'mature' && plot.status !== 'growing') {
      return { success: false, message: '没有可收获的作物' };
    }

    // 获取作物配置
    const cropConfig = plot.crop_type === 'mood' ? MOOD_CROPS[plot.crop_id] : TRADITIONAL_CROPS[plot.crop_id];
    if (!cropConfig) {
      return { success: false, message: '作物配置不存在' };
    }

    // 计算品质（1-5星）
    const quality = Math.floor(Math.random() * 5) + 1;
    const qualityMultiplier = 1 + (quality - 1) * 0.15;
    const sellPrice = Math.floor(cropConfig.sell * qualityMultiplier);
    const expGain = cropConfig.exp;

    // 导入钱包和等级模块
    const { addTransaction } = require('./wallet');
    const { addExperience } = require('./level');

    // 获得金币
    const coinResult = await addTransaction(openid, {
      type: 'earn',
      currency: 'coins',
      amount: sellPrice,
      source: 'farm_harvest',
      description: `收获${cropConfig.name}`
    }, db, _);

    // 获得经验
    const expResult = await addExperience(openid, 'farm_harvest', expGain, db, _);

    // 更新每日任务计数
    try {
      const now = new Date();
      const today = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

      const dailyTaskRes = await db.collection('qcio_daily_tasks')
        .where({
          _openid: openid,
          date: today
        })
        .get();

      if (dailyTaskRes.data.length > 0) {
        // 更新现有记录
        await db.collection('qcio_daily_tasks')
          .doc(dailyTaskRes.data[0]._id)
          .update({
            data: {
              farmHarvestCount: _.inc(1),
              updateTime: db.serverDate()
            }
          });
      } else {
        // 创建新记录
        await db.collection('qcio_daily_tasks').add({
          data: {
            _openid: openid,
            date: today,
            checkinDone: false,
            checkinStreak: 0,
            moodLogCount: 0,
            chatCount: 0,
            lastChatTime: null,
            farmHarvestCount: 1,
            farmStealCount: 0,
            farmVisitCount: 0,
            createTime: db.serverDate(),
            updateTime: db.serverDate()
          }
        });
      }
    } catch (err) {
      // 更新每日任务失败不影响主流程
      console.error('Update daily task error:', err);
    }

    // 清空土地
    await db.collection('qcio_farm_plots').doc(plot._id).update({
      data: {
        crop_id: null,
        crop_type: null,
        plant_time: null,
        maturity_time: null,
        status: 'empty',
        base_yield: 0,
        current_yield: 0,
        quality: 0,
        stolen_by: [],
        steal_count: 0,
        updateTime: db.serverDate()
      }
    });

    // 更新农场档案
    const profileCollection = db.collection('qcio_farm_profiles');
    const profileRes = await profileCollection.where({ _openid: openid }).get();
    if (profileRes.data.length > 0) {
      const profile = profileRes.data[0];
      const newHarvestCount = (profile.total_harvest_count || 0) + 1;
      const newExp = (profile.farm_exp || 0) + expGain;

      // 计算新等级
      const newLevel = getLevelByExp(newExp);
      const newUnlockedPlots = getPlotsByLevel(newLevel);

      await profileCollection.doc(profile._id).update({
        data: {
          farm_exp: newExp,
          farm_level: newLevel,
          unlocked_plots: newUnlockedPlots,
          total_harvest_count: newHarvestCount,
          total_coins_earned: _.inc(sellPrice),
          total_exp_earned: _.inc(expGain),
          updateTime: db.serverDate()
        }
      });
    }

    return {
      success: true,
      data: {
        cropName: cropConfig.name,
        icon: cropConfig.icon,
        quantity: plot.current_yield || 1,
        quality: quality,
        sellPrice: sellPrice,
        expGain: expResult.data?.experience || expGain
      },
      message: '收获成功'
    };

  } catch (err) {
    console.error('harvestCrop Error:', err);
    return { success: false, error: err, message: '收获失败' };
  }
}

/**
 * 获取仓库
 * @param {String} openid - 用户openid
 * @param {Object} db - 数据库实例
 */
async function getInventory(openid, db) {
  try {
    const res = await db.collection('qcio_farm_inventory')
      .where({ _openid: openid })
      .get();

    const items = res.data.map(item => ({
      itemType: item.item_type,
      itemId: item.item_id,
      itemName: item.item_name,
      icon: item.icon,
      quantity: item.quantity,
      quality: item.quality
    }));

    // 分类整理
    const seeds = items.filter(i => i.itemType === 'seed');
    const crops = items.filter(i => i.itemType === 'crop');
    const decorations = items.filter(i => i.itemType === 'decoration');

    return {
      success: true,
      data: {
        seeds,
        crops,
        decorations,
        all: items
      }
    };

  } catch (err) {
    console.error('getInventory Error:', err);
    return { success: false, error: err, message: '获取仓库失败' };
  }
}

/**
 * 购买装饰
 * @param {String} openid - 用户openid
 * @param {String} decorationId - 装饰ID
 * @param {Object} db - 数据库实例
 * @param {Object} _ - 数据库命令
 */
async function buyDecoration(openid, decorationId, db, _) {
  try {
    const decoConfig = DECORATIONS[decorationId];
    if (!decoConfig) {
      return { success: false, message: '装饰不存在' };
    }

    // 导入钱包模块
    const { addTransaction } = require('./wallet');

    // 扣除金币
    const buyResult = await addTransaction(openid, {
      type: 'spend',
      currency: 'coins',
      amount: decoConfig.cost,
      source: 'farm_buy_decoration',
      description: `购买${decoConfig.name}`
    }, db, _);

    if (!buyResult.success) {
      return buyResult;
    }

    // 添加到仓库
    const inventoryCollection = db.collection('qcio_farm_inventory');

    // 检查是否已拥有
    const existingRes = await inventoryCollection.where({
      _openid: openid,
      item_type: 'decoration',
      item_id: decorationId
    }).get();

    if (existingRes.data.length > 0) {
      return { success: false, message: '已拥有该装饰' };
    }

    // 新增记录
    await inventoryCollection.add({
      data: {
        _openid: openid,
        item_type: 'decoration',
        item_id: decorationId,
        item_name: decoConfig.name,
        icon: decoConfig.icon,
        quantity: 1,
        createTime: db.serverDate()
      }
    });

    // 添加到农场档案的装饰列表
    const profileRes = await db.collection('qcio_farm_profiles').where({ _openid: openid }).get();
    if (profileRes.data.length > 0) {
      const profile = profileRes.data[0];
      const decorations = profile.decorations || [];
      decorations.push(decorationId);

      await db.collection('qcio_farm_profiles').doc(profile._id).update({
        data: {
          decorations: decorations,
          updateTime: db.serverDate()
        }
      });
    }

    return {
      success: true,
      data: {
        decorationName: decoConfig.name,
        icon: decoConfig.icon,
        effect: decoConfig.effect
      },
      message: '购买成功'
    };

  } catch (err) {
    console.error('buyDecoration Error:', err);
    return { success: false, error: err, message: '购买装饰失败' };
  }
}

/**
 * 激活装饰
 * @param {String} openid - 用户openid
 * @param {String} decorationId - 装饰ID
 * @param {Object} db - 数据库实例
 */
async function activateDecoration(openid, decorationId, db) {
  try {
    const profileRes = await db.collection('qcio_farm_profiles').where({ _openid: openid }).get();

    if (profileRes.data.length === 0) {
      return { success: false, message: '农场不存在' };
    }

    const profile = profileRes.data[0];
    const decorations = profile.decorations || [];

    // 检查是否拥有该装饰
    if (!decorations.includes(decorationId)) {
      return { success: false, message: '未拥有该装饰' };
    }

    // 激活装饰
    await db.collection('qcio_farm_profiles').doc(profile._id).update({
      data: {
        active_decoration: decorationId,
        updateTime: db.serverDate()
      }
    });

    const decoConfig = DECORATIONS[decorationId];

    return {
      success: true,
      data: {
        decorationName: decoConfig.name,
        effect: decoConfig.effect
      },
      message: '装饰已激活'
    };

  } catch (err) {
    console.error('activateDecoration Error:', err);
    return { success: false, error: err, message: '激活装饰失败' };
  }
}

// ==================== 导出 ====================
module.exports = {
  // 配置
  TRADITIONAL_CROPS,
  MOOD_CROPS,
  DECORATIONS,
  PLOT_UNLOCK,
  FARM_LEVELS,

  // 核心功能
  getFarmProfile,
  initFarm,
  getFarmPlots,
  buySeed,
  plantCrop,
  harvestCrop,
  getInventory,
  buyDecoration,
  activateDecoration
};
