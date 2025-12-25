/**
 * 网络状态管理工具
 * 统一管理网络连接状态，用于包装AI调用错误为"断网"体验
 */

const STORAGE_KEY = 'network_status';

/**
 * 检查是否是网络相关错误（429、超时等）
 * @param {Error|string} err - 错误对象或错误信息
 * @returns {boolean} - 是否是网络错误
 */
function isNetworkError(err) {
  const errMsg = err?.message || err?.errMsg || err || '';

  // 检查是否是429错误（频率限制）
  if (errMsg.includes('429') || errMsg.includes('rate limit') || errMsg.includes('too many requests')) {
    return true;
  }

  // 检查是否是超时错误
  if (errMsg.includes('timeout') || errMsg.includes('超时') || errMsg.includes('Request timeout')) {
    return true;
  }

  // 检查是否是连接错误
  if (errMsg.includes('network') || errMsg.includes('网络') || errMsg.includes('断网') ||
      errMsg.includes('fetch failed') || errMsg.includes('ERR_NETWORK')) {
    return true;
  }

  // 检查是否是服务不可用（5xx错误）
  if (errMsg.includes('502') || errMsg.includes('503') || errMsg.includes('504') ||
      errMsg.includes('Service Unavailable') || errMsg.includes('Bad Gateway')) {
    return true;
  }

  return false;
}

/**
 * 设置网络为断开状态
 * @param {string} reason - 断开原因
 */
function setNetworkDisconnected(reason = '网络连接中断') {
  try {
    wx.setStorageSync(STORAGE_KEY, {
      connected: false,
      status: 'offline',
      reason: reason,
      timestamp: Date.now()
    });

    // 触发事件通知其他页面
    const app = getApp();
    if (app && app.globalData) {
      app.globalData.networkDisconnected = true;
      app.globalData.networkDisconnectReason = reason;
    }
  } catch (err) {
    console.error('Set network disconnected error:', err);
  }
}

/**
 * 设置网络为连接状态
 */
function setNetworkConnected() {
  try {
    wx.setStorageSync(STORAGE_KEY, {
      connected: true,
      status: 'online',
      networkName: '千禧拨号网络',
      timestamp: Date.now()
    });

    // 清除全局断网标记
    const app = getApp();
    if (app && app.globalData) {
      app.globalData.networkDisconnected = false;
      app.globalData.networkDisconnectReason = null;
    }
  } catch (err) {
    console.error('Set network connected error:', err);
  }
}

/**
 * 获取当前网络状态
 * @returns {object} - 网络状态对象
 */
function getNetworkStatus() {
  try {
    const status = wx.getStorageSync(STORAGE_KEY);
    return status || {
      connected: true,
      status: 'online'
    };
  } catch (err) {
    console.error('Get network status error:', err);
    return { connected: true, status: 'online' };
  }
}

/**
 * 检查网络是否已连接
 * @returns {boolean} - 是否已连接
 */
function isNetworkConnected() {
  const status = getNetworkStatus();
  return status.connected !== false;
}

/**
 * 显示断网提示对话框
 * @param {string} reason - 断开原因
 * @returns {Promise<boolean>} - 是否跳转到联网页面
 */
function showDisconnectDialog(reason = '网络连接中断') {
  return new Promise((resolve) => {
    wx.showModal({
      title: '网络断开',
      content: `${reason}\n\n请通过"网上邻居"重新连接网络后继续使用聊天功能。`,
      confirmText: '去连接',
      cancelText: '稍后再说',
      confirmColor: '#000080',
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          // 跳转到网上邻居页面
          wx.navigateTo({
            url: '/pages/network-neighborhood/index',
            success: () => resolve(true),
            fail: () => resolve(false)
          });
        } else {
          resolve(false);
        }
      }
    });
  });
}

/**
 * 包装云函数调用，自动处理网络错误
 * @param {Function} callFunction - 云函数调用函数
 * @param {object} options - 配置选项
 * @returns {Promise} - 返回Promise
 */
function wrapCloudCall(callFunction, options = {}) {
  const { showErrorDialog = true, customErrorMessage = null } = options;

  return callFunction().catch(err => {
    console.error('Cloud function error:', err);

    // 检查是否是网络错误
    if (isNetworkError(err)) {
      // 设置网络为断开状态
      const reason = customErrorMessage || getErrorMessageFromCode(err);
      setNetworkDisconnected(reason);

      // 显示断网对话框
      if (showErrorDialog) {
        return showDisconnectDialog(reason).then(() => {
          // 返回一个特殊错误标记
          return {
            result: {
              success: false,
              networkError: true,
              message: '网络已断开，请重新连接'
            }
          };
        });
      }

      return Promise.resolve({
        result: {
          success: false,
          networkError: true,
          message: '网络已断开'
        }
      });
    }

    // 不是网络错误，继续抛出
    throw err;
  });
}

/**
 * 从错误信息中提取友好的错误提示
 * @param {Error|string} err - 错误对象
 * @returns {string} - 友好的错误提示
 */
function getErrorMessageFromCode(err) {
  const errMsg = err?.message || err?.errMsg || err || '';

  if (errMsg.includes('429')) {
    return '服务器繁忙，请稍后再试';
  }
  if (errMsg.includes('timeout') || errMsg.includes('超时')) {
    return '网络连接超时';
  }
  if (errMsg.includes('502') || errMsg.includes('503') || errMsg.includes('504')) {
    return '服务器暂时不可用';
  }

  return '网络连接中断';
}

/**
 * 页面 onLoad 时检查网络状态
 * 如果网络断开，提示用户
 * @param {Page} pageContext - 页面上下文
 */
function checkNetworkOnLoad(pageContext) {
  if (!isNetworkConnected()) {
    const status = getNetworkStatus();
    const reason = status.reason || '网络未连接';

    // 延迟显示，避免和页面加载冲突
    setTimeout(() => {
      wx.showToast({
        title: '网络未连接',
        icon: 'none',
        duration: 2000
      });
    }, 500);
  }
}

module.exports = {
  isNetworkError,
  setNetworkDisconnected,
  setNetworkConnected,
  getNetworkStatus,
  isNetworkConnected,
  showDisconnectDialog,
  wrapCloudCall,
  checkNetworkOnLoad,
  getErrorMessageFromCode
};
