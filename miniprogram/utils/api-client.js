/**
 * API 客户端 - 统一云函数调用封装
 * 减少重复代码，统一错误处理，简化云函数调用
 */

const { isNetworkError } = require('./network');

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
   * 获取用户余额
   */
  getBalance() {
    return callCloudFunction('user', { type: 'getBalance' });
  },

  /**
   * 兑换网费
   * @param {number} amount - 兑换金额（分钟）
   */
  exchangeNetFee(amount) {
    return callCloudFunction('user', {
      type: 'exchangeNetFee',
      amount
    });
  },

  /**
   * 扣除网费
   * @param {number} amount - 扣除金额（分钟）
   */
  deductNetFee(amount) {
    return callCloudFunction('user', {
      action: 'deductNetFee',
      amount
    });
  },

  /**
   * 发现彩蛋
   * @param {string} eggId - 彩蛋ID
   */
  discoverEgg(eggId) {
    return callCloudFunction('user', {
      type: 'discoverEgg',
      eggId
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
   * 获取等级信息
   */
  getLevelInfo() {
    return callCloudFunction('qcio', { action: 'getLevelInfo' });
  },

  /**
   * 更新用户资料
   * @param {object} data - 更新的数据
   */
  updateProfile(data) {
    return callCloudFunction('qcio', {
      action: 'updateProfile',
      data
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
   * 获取钱包信息
   */
  getWalletInfo() {
    return callCloudFunction('qcio', { action: 'getWalletInfo' });
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
   * 获取 AI 联系人列表
   */
  getAIContacts() {
    return callCloudFunction('qcio', { action: 'getAIContacts' });
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
   */
  sendMessage(userMessage, history = [], mode = 'chat') {
    return callCloudFunction('chat', {
      userMessage,
      history,
      mode
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
