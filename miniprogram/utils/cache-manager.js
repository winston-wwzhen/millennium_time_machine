/**
 * 缓存管理器 - 统一数据缓存管理
 * 减少云函数调用，提升应用性能
 */

/**
 * 缓存键枚举
 */
const CacheKeys = {
  USER_INFO: 'cache_user_info',
  USER_BALANCE: 'cache_user_balance',
  QCIO_CONTACTS: 'cache_qcio_contacts',
  QCIO_PROFILE: 'cache_qcio_profile',
  QCIO_WALLET: 'cache_qcio_wallet',
  QCIO_LEVEL_INFO: 'cache_qcio_level_info',
  AI_CONTACTS: 'cache_ai_contacts',
  SYSTEM_CONFIG: 'cache_system_config'
};

/**
 * 默认缓存时间（毫秒）
 */
const CacheDuration = {
  SHORT: 5 * 60 * 1000,      // 5分钟
  MEDIUM: 15 * 60 * 1000,    // 15分钟
  LONG: 60 * 60 * 1000,      // 1小时
  VERY_LONG: 24 * 60 * 60 * 1000  // 24小时
};

/**
 * 缓存数据
 * @param {string} key - 缓存键
 * @param {any} data - 要缓存的数据
 * @param {number} duration - 缓存时长（毫秒）
 */
function setCache(key, data, duration = CacheDuration.MEDIUM) {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
      expire: Date.now() + duration
    };
    wx.setStorageSync(key, cacheData);
    return true;
  } catch (err) {
    console.error('[Cache] Set cache failed:', key, err);
    return false;
  }
}

/**
 * 获取缓存数据
 * @param {string} key - 缓存键
 * @returns {any|null} - 缓存的数据，如果不存在或已过期返回null
 */
function getCache(key) {
  try {
    const cached = wx.getStorageSync(key);

    if (!cached) {
      return null;
    }

    // 检查是否过期
    if (Date.now() > cached.expire) {
      removeCache(key);
      return null;
    }

    return cached.data;
  } catch (err) {
    console.error('[Cache] Get cache failed:', key, err);
    return null;
  }
}

/**
 * 移除缓存
 * @param {string} key - 缓存键
 */
function removeCache(key) {
  try {
    wx.removeStorageSync(key);
    return true;
  } catch (err) {
    console.error('[Cache] Remove cache failed:', key, err);
    return false;
  }
}

/**
 * 清空所有缓存
 */
function clearAllCache() {
  try {
    Object.values(CacheKeys).forEach(key => {
      wx.removeStorageSync(key);
    });
    return true;
  } catch (err) {
    console.error('[Cache] Clear all cache failed:', err);
    return false;
  }
}

/**
 * 检查缓存是否存在且有效
 * @param {string} key - 缓存键
 * @returns {boolean} - 缓存是否有效
 */
function isCacheValid(key) {
  return getCache(key) !== null;
}

/**
 * 带缓存的异步函数执行
 * 如果缓存有效则返回缓存数据，否则执行函数并缓存结果
 * @param {string} key - 缓存键
 * @param {Function} fn - 异步函数
 * @param {number} duration - 缓存时长
 * @returns {Promise<any>} - 函数执行结果或缓存数据
 */
async function withCache(key, fn, duration = CacheDuration.MEDIUM) {
  // 尝试从缓存获取
  const cached = getCache(key);
  if (cached !== null) {
    console.log('[Cache] Hit:', key);
    return cached;
  }

  // 缓存未命中，执行函数
  console.log('[Cache] Miss:', key);
  try {
    const result = await fn();
    if (result && result.success !== false) {
      setCache(key, result, duration);
    }
    return result;
  } catch (err) {
    console.error('[Cache] Function execution failed:', key, err);
    throw err;
  }
}

/**
 * 用户信息缓存
 */
const userInfoCache = {
  /**
   * 获取用户信息缓存
   */
  get() {
    return getCache(CacheKeys.USER_INFO);
  },

  /**
   * 设置用户信息缓存
   * @param {object} userInfo - 用户信息
   */
  set(userInfo) {
    return setCache(CacheKeys.USER_INFO, userInfo, CacheDuration.LONG);
  },

  /**
   * 清除用户信息缓存
   */
  clear() {
    return removeCache(CacheKeys.USER_INFO);
  }
};

/**
 * 用户余额缓存
 */
const userBalanceCache = {
  /**
   * 获取用户余额缓存
   */
  get() {
    return getCache(CacheKeys.USER_BALANCE);
  },

  /**
   * 设置用户余额缓存
   * @param {object} balance - 余额信息
   */
  set(balance) {
    return setCache(CacheKeys.USER_BALANCE, balance, CacheDuration.SHORT);
  },

  /**
   * 清除用户余额缓存
   */
  clear() {
    return removeCache(CacheKeys.USER_BALANCE);
  }
};

/**
 * QCIO 联系人缓存
 */
const qcioContactsCache = {
  /**
   * 获取联系人缓存
   */
  get() {
    return getCache(CacheKeys.QCIO_CONTACTS);
  },

  /**
   * 设置联系人缓存
   * @param {Array} contacts - 联系人列表
   */
  set(contacts) {
    return setCache(CacheKeys.QCIO_CONTACTS, contacts, CacheDuration.MEDIUM);
  },

  /**
   * 清除联系人缓存
   */
  clear() {
    return removeCache(CacheKeys.QCIO_CONTACTS);
  }
};

/**
 * QCIO 资料缓存
 */
const qcioProfileCache = {
  /**
   * 获取 QCIO 资料缓存
   */
  get() {
    return getCache(CacheKeys.QCIO_PROFILE);
  },

  /**
   * 设置 QCIO 资料缓存
   * @param {object} profile - 资料信息
   */
  set(profile) {
    return setCache(CacheKeys.QCIO_PROFILE, profile, CacheDuration.MEDIUM);
  },

  /**
   * 清除 QCIO 资料缓存
   */
  clear() {
    return removeCache(CacheKeys.QCIO_PROFILE);
  }
};

/**
 * 批量预加载常用数据
 * 在应用启动时预加载，提升首屏速度
 * 注意：不再设置缓存，各组件直接从API获取实时数据
 * @returns {Promise<object>} - 预加载结果
 */
async function preloadCommonData() {
  console.log('[Cache] Preloading common data...');
  const results = {
    userInfo: null,
    balance: null
  };

  try {
    // 可以并行加载多个数据
    const { userApi } = require('./api-client');

    // 并行获取用户信息和余额（用于预热，不设置缓存）
    const [userInfo, balance] = await Promise.allSettled([
      userApi.login().catch(() => null),
      userApi.getBalance().catch(() => null)
    ]);

    if (userInfo?.value?.success) {
      results.userInfo = true;
    }

    if (balance?.value?.success) {
      results.balance = true;
    }

    console.log('[Cache] Preload complete:', results);
    return results;
  } catch (err) {
    console.error('[Cache] Preload failed:', err);
    return results;
  }
}

/**
 * 清除所有用户相关缓存（用户登出时调用）
 */
function clearUserCache() {
  userInfoCache.clear();
  userBalanceCache.clear();
  qcioContactsCache.clear();
  qcioProfileCache.clear();
}

module.exports = {
  CacheKeys,
  CacheDuration,
  setCache,
  getCache,
  removeCache,
  clearAllCache,
  isCacheValid,
  withCache,
  userInfoCache,
  userBalanceCache,
  qcioContactsCache,
  qcioProfileCache,
  preloadCommonData,
  clearUserCache
};
