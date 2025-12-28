/**
 * API 客户端 - 统一云函数调用封装
 * 减少重复代码，统一错误处理，简化云函数调用
 * 支持自动缓存，提升性能
 */

const { isNetworkError } = require('./network');
const { CacheKeys, withCache, getCache, setCache } = require('./cache-manager');

/**
 * 云函数调用封装
 * @param {string} name - 云函数名称
 * @param {object} data - 传递的数据
 * @param {object} options - 配置选项
 * @returns {Promise<any>} - 返回结果
 */
async function callCloudFunction(name, data = {}, options = {}) {
  const {
    showLoading = false,
    loadingText = '加载中...',
    showError = true,
    throwOnError = false
  } = options;

  if (showLoading) {
    wx.showLoading({ title: loadingText, mask: true });
  }

  try {
    const res = await wx.cloud.callFunction({
      name,
      data
    });

    const result = res.result;

    // 检查业务逻辑是否成功
    if (result && result.success === false) {
      const errorMsg = result.message || result.errMsg || '操作失败';
      if (showError) {
        wx.showToast({ title: errorMsg, icon: 'none' });
      }
      if (throwOnError) {
        throw new Error(errorMsg);
      }
      return result;
    }

    return result;
  } catch (err) {
    console.error(`[API] ${name} 调用失败:`, err);

    // 网络错误特殊处理
    if (isNetworkError(err)) {
      if (showError) {
        wx.showToast({ title: '网络连接中断', icon: 'none' });
      }
      if (throwOnError) {
        throw err;
      }
      return { success: false, networkError: true };
    }

    // 其他错误
    if (showError) {
      wx.showToast({ title: '操作失败，请重试', icon: 'none' });
    }

    if (throwOnError) {
      throw err;
    }

    return { success: false, error: err };
  } finally {
    if (showLoading) {
      wx.hideLoading();
    }
  }
}

/**
 * 用户相关 API
 */
const userApi = {
  /**
   * 用户登录
   */
  login() {
    return callCloudFunction('user', { type: 'login' });
  },

  /**
   * 获取用户余额（带缓存）
   */
  getBalance() {
    return withCache(
      CacheKeys.USER_BALANCE,
      () => callCloudFunction('user', { type: 'getBalance' })
    );
  },

  /**
   * 兑换网费（清除余额缓存）
   * @param {number} amount - 兑换金额（分钟）
   */
  exchangeNetFee(amount) {
    return callCloudFunction('user', {
      type: 'exchangeNetFee',
      amount
    }).then(result => {
      // 兑换成功后清除余额缓存
      if (result && result.success) {
        const { removeCache } = require('./cache-manager');
        removeCache(CacheKeys.USER_BALANCE);
      }
      return result;
    });
  },

  /**
   * 扣除网费（清除余额缓存）
   * @param {number} amount - 扣除金额（分钟）
   */
  deductNetFee(amount) {
    return callCloudFunction('user', {
      action: 'deductNetFee',
      amount
    }).then(result => {
      // 扣除成功后清除余额缓存
      if (result && result.success) {
        const { removeCache } = require('./cache-manager');
        removeCache(CacheKeys.USER_BALANCE);
      }
      return result;
    });
  },

  /**
   * 发现彩蛋（清除余额缓存）
   * @param {string} eggId - 彩蛋ID
   */
  discoverEgg(eggId) {
    return callCloudFunction('user', {
      type: 'discoverEgg',
      eggId
    }).then(result => {
      // 发现彩蛋获得奖励后清除余额缓存
      if (result && result.success) {
        const { removeCache } = require('./cache-manager');
        removeCache(CacheKeys.USER_BALANCE);
      }
      return result;
    });
  },

  /**
   * 更新用户资料
   * @param {object} data - 更新的数据
   */
  updateProfile(data) {
    return callCloudFunction('user', {
      type: 'updateProfile',
      data
    });
  },

  /**
   * 检查 QCIO 空间访问彩蛋
   */
  checkQcioEgg() {
    return callCloudFunction('user', { type: 'checkQcioEgg' });
  },

  /**
   * 获取交易记录
   * @param {number} limit - 记录数量
   */
  getTransactionHistory(limit = 50) {
    return callCloudFunction('user', {
      type: 'getTransactionHistory',
      limit
    });
  },

  /**
   * 检查聊天彩蛋（聊天狂魔）
   */
  checkChatEgg() {
    return callCloudFunction('user', { type: 'checkChatEgg' });
  },

  /**
   * 检查群聊狂欢彩蛋
   */
  checkGroupChatEgg() {
    return callCloudFunction('user', { type: 'checkGroupChatEgg' });
  },

  /**
   * 检查火星文大师彩蛋
   */
  checkMarsTranslatorEgg() {
    return callCloudFunction('user', { type: 'checkMarsTranslatorEgg' });
  },

  /**
   * 检查回收站清理者彩蛋
   */
  checkRecycleBinEgg() {
    return callCloudFunction('user', { type: 'checkRecycleBinEgg' });
  },

  /**
   * 获取如果当时用户偏好
   */
  getIfthenPreferences() {
    return callCloudFunction('user', { type: 'getIfthenPreferences' });
  },

  /**
   * 设置如果当时用户偏好
   * @param {number} birthYear - 出生年份
   * @param {string} gender - 性别
   */
  setIfthenPreferences(birthYear, gender) {
    return callCloudFunction('user', {
      type: 'setIfthenPreferences',
      birthYear,
      gender
    });
  },

  /**
   * 保存照片记录
   * @param {string} cloudPath - 云存储路径
   * @param {string} fileID - 文件ID
   */
  savePhoto(cloudPath, fileID) {
    return callCloudFunction('user-photos', {
      type: 'savePhoto',
      photoData: { cloudPath, fileID }
    });
  },

  /**
   * 获取照片列表
   * @param {number} limit - 数量限制
   */
  getPhotos(limit = 100) {
    return callCloudFunction('user-photos', {
      type: 'getPhotos',
      limit
    });
  },

  /**
   * 获取用户活动日志
   * @param {number} limit - 数量限制
   */
  getLogs(limit = 100) {
    return callCloudFunction('user', {
      type: 'getLogs',
      limit
    });
  },

  /**
   * 记录分享并奖励
   * @param {string} shareType - 分享类型
   * @param {string} itemId - 项目ID（可选）
   * @param {string} currency - 币种（可选）
   */
  recordShare(shareType, itemId = '', currency = '') {
    return callCloudFunction('user', {
      type: 'recordShare',
      shareType,
      itemId,
      currency
    });
  }
};

/**
 * QCIO 相关 API
 */
const qcioApi = {
  /**
   * 初始化 QCIO
   */
  init() {
    return callCloudFunction('qcio', { action: 'init' });
  },

  /**
   * QCIO 登录
   */
  login() {
    return callCloudFunction('qcio', { action: 'login' });
  },

  /**
   * 获取钱包信息
   */
  getWallet() {
    return callCloudFunction('qcio', { action: 'getWallet' });
  },

  /**
   * 领取每日奖励（清除钱包缓存）
   */
  claimDailyReward() {
    return callCloudFunction('qcio', { action: 'claimDailyReward' }).then(result => {
      // 领取成功后清除钱包缓存
      if (result && result.success) {
        const { removeCache } = require('./cache-manager');
        removeCache(CacheKeys.QCIO_WALLET);
        removeCache(CacheKeys.QCIO_LEVEL_INFO);
      }
      return result;
    });
  },

  /**
   * 添加经验值（清除等级缓存）
   * @param {string} source - 经验来源
   * @param {number} amount - 经验数量
   */
  addExperience(source, amount) {
    return callCloudFunction('qcio', {
      action: 'addExperience',
      source,
      amount
    }).then(result => {
      // 添加经验成功后清除等级缓存
      if (result && result.success) {
        const { removeCache } = require('./cache-manager');
        removeCache(CacheKeys.QCIO_LEVEL_INFO);
      }
      return result;
    });
  },

  /**
   * 注册 QCIO 账号
   * @param {string} qcio_id - QCIO 号码
   * @param {string} nickname - 昵称
   * @param {string} avatar - 头像
   */
  register(qcio_id, nickname, avatar) {
    return callCloudFunction('qcio', {
      action: 'register',
      qcio_id,
      nickname,
      avatar
    });
  },

  /**
   * 获取等级信息（带缓存）
   */
  getLevelInfo() {
    return withCache(
      CacheKeys.QCIO_LEVEL_INFO,
      () => callCloudFunction('qcio', { action: 'getLevelInfo' })
    );
  },

  /**
   * 更新用户资料（清除缓存）
   * @param {object} data - 更新的数据
   */
  updateProfile(data) {
    return callCloudFunction('qcio', {
      action: 'updateProfile',
      data
    }).then(result => {
      // 更新成功后清除相关缓存
      if (result && result.success) {
        const { removeCache } = require('./cache-manager');
        removeCache(CacheKeys.QCIO_PROFILE);
        removeCache(CacheKeys.QCIO_LEVEL_INFO);
      }
      return result;
    });
  },

  /**
   * 获取心情日志状态
   */
  getMoodLogStatus() {
    return callCloudFunction('qcio', { action: 'getMoodLogStatus' });
  },

  /**
   * 获取心情日志列表
   */
  getMoodLogs() {
    return callCloudFunction('qcio', { action: 'getMoodLogs' });
  },

  /**
   * 保存心情日志
   * @param {object} data - 日志数据
   */
  saveMoodLog(data) {
    return callCloudFunction('qcio', {
      action: 'saveMoodLog',
      data
    });
  },

  /**
   * 删除心情日志
   * @param {string} logId - 日志ID
   */
  deleteMoodLog(logId) {
    return callCloudFunction('qcio', {
      action: 'deleteMoodLog',
      logId
    });
  },

  /**
   * 签到
   */
  checkIn() {
    return callCloudFunction('qcio', { action: 'checkIn' });
  },

  /**
   * 注销登录
   */
  logout() {
    return callCloudFunction('qcio', { action: 'logout' });
  },

  /**
   * 获取钱包信息（带缓存）
   */
  getWalletInfo() {
    return withCache(
      CacheKeys.QCIO_WALLET,
      () => callCloudFunction('qcio', { action: 'getWalletInfo' })
    );
  },

  /**
   * 获取交易记录
   * @param {number} limit - 记录数量
   */
  getTransactionHistory(limit = 50) {
    return callCloudFunction('qcio', {
      action: 'getTransactionHistory',
      limit
    });
  },

  /**
   * 获取 AI 联系人列表（带缓存）
   */
  getAIContacts() {
    return withCache(
      CacheKeys.AI_CONTACTS,
      () => callCloudFunction('qcio', { action: 'getAIContacts' })
    );
  },

  /**
   * 记录访问（踩一踩）
   * @param {string} visitorId - 访问者ID
   * @param {string} visitorName - 访问者昵称
   * @param {string} ownerQcioId - 被访问空间ID
   */
  recordVisit(visitorId, visitorName, ownerQcioId) {
    return callCloudFunction('qcio', {
      action: 'recordVisit',
      visitorId,
      visitorName,
      ownerQcioId
    });
  },

  /**
   * 获取聊天历史
   * @param {string} contactName - 联系人名称
   */
  getChatHistory(contactName) {
    return callCloudFunction('qcio', {
      action: 'getChatHistory',
      contactName
    });
  },

  /**
   * 保存聊天历史
   * @param {string} contactName - 联系人名称
   * @param {Array} messages - 消息列表
   */
  saveChatHistory(contactName, messages) {
    return callCloudFunction('qcio', {
      action: 'saveChatHistory',
      data: { contactName, messages }
    });
  },

  /**
   * 获取群聊历史
   * @param {string} groupName - 群名称
   */
  getGroupChatHistory(groupName) {
    return callCloudFunction('qcio', {
      action: 'getGroupChatHistory',
      groupName
    });
  },

  /**
   * 保存群聊历史
   * @param {string} groupName - 群名称
   * @param {Array} messages - 消息列表
   */
  saveGroupChatHistory(groupName, messages) {
    return callCloudFunction('qcio', {
      action: 'saveGroupChatHistory',
      data: { groupName, messages }
    });
  },

  /**
   * 根据 qcio_id 获取用户信息
   * @param {string} qcioId - QCIO 号码
   */
  getUserByQcioId(qcioId) {
    return callCloudFunction('qcio', {
      action: 'getUserByQcioId',
      qcioId
    });
  },

  /**
   * 根据 qcio_id 获取访问统计
   * @param {string} qcioId - QCIO 号码
   */
  getVisitStatsByQcioId(qcioId) {
    return callCloudFunction('qcio', {
      action: 'getVisitStatsByQcioId',
      qcioId
    });
  },

  /**
   * 根据 qcio_id 获取留言板
   * @param {string} qcioId - QCIO 号码
   */
  getGuestbookByQcioId(qcioId) {
    return callCloudFunction('qcio', {
      action: 'getGuestbookByQcioId',
      qcioId
    });
  },

  /**
   * 根据 qcio_id 获取最近访客
   * @param {string} qcioId - QCIO 号码
   */
  getRecentVisitorsByQcioId(qcioId) {
    return callCloudFunction('qcio', {
      action: 'getRecentVisitorsByQcioId',
      qcioId
    });
  },

  /**
   * 检查今天是否踩过
   * @param {string} ownerQcioId - 被访问空间ID
   */
  checkIfSteppedToday(ownerQcioId) {
    return callCloudFunction('qcio', {
      action: 'checkIfSteppedToday',
      ownerQcioId
    });
  },

  /**
   * 记录访问（踩一踩）
   * @param {string} visitorId - 访问者ID
   * @param {string} visitorName - 访问者昵称
   * @param {string} visitorAvatar - 访问者头像
   * @param {string} ownerQcioId - 被访问空间ID
   */
  recordVisit(visitorId, visitorName, visitorAvatar, ownerQcioId) {
    return callCloudFunction('qcio', {
      action: 'recordVisit',
      visitorId,
      visitorName,
      visitorAvatar,
      ownerQcioId
    });
  },

  // ==================== 农场相关 API ====================

  /**
   * 获取农场资料
   */
  getFarmProfile() {
    return callCloudFunction('qcio', { action: 'getFarmProfile' });
  },

  /**
   * 初始化农场
   * @param {string} qcioId - QCIO 号码
   */
  initFarm(qcioId) {
    return callCloudFunction('qcio', {
      action: 'initFarm',
      qcioId
    });
  },

  /**
   * 获取农场土地数据
   */
  getFarmPlots() {
    return callCloudFunction('qcio', { action: 'getFarmPlots' });
  },

  /**
   * 种植作物
   * @param {number} plotIndex - 土地索引
   * @param {string} cropType - 作物类型
   * @param {string} cropId - 作物ID
   */
  plantCrop(plotIndex, cropType, cropId) {
    return callCloudFunction('qcio', {
      action: 'plantCrop',
      plotIndex,
      cropType,
      cropId
    });
  },

  /**
   * 购买种子
   * @param {string} cropType - 作物类型
   * @param {string} cropId - 作物ID
   * @param {number} quantity - 数量
   */
  buySeed(cropType, cropId, quantity = 1) {
    return callCloudFunction('qcio', {
      action: 'buySeed',
      cropType,
      cropId,
      quantity
    });
  },

  /**
   * 收获作物
   * @param {number} plotIndex - 土地索引
   */
  harvestCrop(plotIndex) {
    return callCloudFunction('qcio', {
      action: 'harvestCrop',
      plotIndex
    });
  },

  /**
   * 购买装饰
   * @param {string} decorationId - 装饰ID
   */
  buyDecoration(decorationId) {
    return callCloudFunction('qcio', {
      action: 'buyDecoration',
      decorationId
    });
  },

  /**
   * 获取农场日志
   */
  getFarmLogs() {
    return callCloudFunction('qcio', { action: 'getFarmLogs' });
  },

  /**
   * 添加农场日志
   * @param {object} logData - 日志数据
   */
  addFarmLog(logData) {
    return callCloudFunction('qcio', {
      action: 'addFarmLog',
      logData
    });
  },

  /**
   * 获取群聊列表
   */
  getGroupList() {
    return callCloudFunction('qcio', { action: 'getGroupList' });
  },

  /**
   * 获取每日任务状态
   */
  getDailyTasks() {
    return callCloudFunction('qcio', { action: 'getDailyTasks' });
  },

  /**
   * 每日签到（清除钱包缓存）
   */
  dailyCheckin() {
    return callCloudFunction('qcio', { action: 'dailyCheckin' }).then(result => {
      // 签到成功后清除钱包缓存
      if (result && result.success) {
        const { removeCache } = require('./cache-manager');
        removeCache(CacheKeys.QCIO_WALLET);
      }
      return result;
    });
  },

  /**
   * 获取访问统计（当前用户）
   */
  getVisitStats() {
    return callCloudFunction('qcio', { action: 'getVisitStats' });
  },

  /**
   * 获取留言板
   */
  getGuestbook() {
    return callCloudFunction('qcio', { action: 'getGuestbook' });
  },

  /**
   * 删除留言
   * @param {string} messageId - 留言ID
   */
  deleteGuestbookMessage(messageId) {
    return callCloudFunction('qcio', {
      action: 'deleteGuestbookMessage',
      messageId
    });
  }
};

/**
 * 聊天相关 API
 */
const chatApi = {
  /**
   * 发送聊天消息
   * @param {string} userMessage - 用户消息
   * @param {Array} history - 聊天历史
   * @param {string} mode - 聊天模式
   * @param {string} contactName - 联系人名称（可选）
   */
  sendMessage(userMessage, history = [], mode = 'chat', contactName) {
    const data = {
      userMessage,
      history,
      mode
    };
    if (contactName) {
      data.contactName = contactName;
    }
    return callCloudFunction('chat', data);
  },

  /**
   * 火星文翻译
   * @param {string} content - 要翻译的内容
   */
  marsTranslate(content) {
    return callCloudFunction('chat', {
      mode: 'mars',
      content
    });
  },

  /**
   * 群聊消息
   * @param {string} userMessage - 用户消息
   * @param {Array} history - 聊天历史
   * @param {string} mode - 聊天模式
   * @param {object} groupChat - 群聊配置
   */
  sendGroupMessage(userMessage, history = [], mode = 'chat', groupChat = {}) {
    return callCloudFunction('chat', {
      userMessage,
      history,
      mode,
      groupChat
    });
  }
};

/**
 * 游戏相关 API
 */
const gameApi = {
  /**
   * IFTHEN 游戏操作
   * @param {string} action - 操作类型
   * @param {object} data - 游戏数据
   */
  ifthen(action, data = {}) {
    return callCloudFunction('ifthen', { action, ...data });
  }
};

module.exports = {
  callCloudFunction,
  userApi,
  qcioApi,
  chatApi,
  gameApi
};
