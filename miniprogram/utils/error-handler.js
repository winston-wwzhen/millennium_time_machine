/**
 * 错误处理工具 - 统一错误处理逻辑
 * 提供网络错误识别、错误提示、错误日志等功能
 */

const { isNetworkError } = require('./network');

/**
 * 错误类型枚举
 */
const ErrorTypes = {
  NETWORK: 'network',           // 网络错误
  PERMISSION: 'permission',     // 权限错误
  VALIDATION: 'validation',     // 校验错误
  BUSINESS: 'business',         // 业务错误
  UNKNOWN: 'unknown'            // 未知错误
};

/**
 * 从错误对象中提取错误信息
 * @param {Error|object|string} err - 错误对象
 * @returns {string} - 错误信息
 */
function getErrorMessage(err) {
  if (!err) return '未知错误';

  if (typeof err === 'string') return err;

  if (err.message) return err.message;
  if (err.errMsg) return err.errMsg;
  if (err.errMsg) return err.errMsg;

  return '操作失败';
}

/**
 * 判断错误类型
 * @param {Error|object} err - 错误对象
 * @returns {string} - 错误类型
 */
function getErrorType(err) {
  const errMsg = err?.message || err?.errMsg || err || '';

  // 网络错误
  if (isNetworkError(err)) {
    return ErrorTypes.NETWORK;
  }

  // 权限错误
  if (errMsg.includes('permission') || errMsg.includes('权限')) {
    return ErrorTypes.PERMISSION;
  }

  // 校验错误
  if (errMsg.includes('validation') || errMsg.includes('校验')) {
    return ErrorTypes.VALIDATION;
  }

  return ErrorTypes.UNKNOWN;
}

/**
 * 根据错误类型显示用户友好的提示
 * @param {Error|object} err - 错误对象
 * @param {object} options - 配置选项
 */
function showErrorToast(err, options = {}) {
  const { customMessage = null, duration = 2000 } = options;
  const errorType = getErrorType(err);
  const defaultMessages = {
    [ErrorTypes.NETWORK]: '网络连接中断',
    [ErrorTypes.PERMISSION]: '权限不足',
    [ErrorTypes.VALIDATION]: '参数错误',
    [ErrorTypes.UNKNOWN]: '操作失败，请重试'
  };

  const message = customMessage || defaultMessages[errorType] || defaultMessages[ErrorTypes.UNKNOWN];

  wx.showToast({
    title: message,
    icon: 'none',
    duration
  });
}

/**
 * 显示网络错误对话框并引导用户
 * @param {Error|object} err - 错误对象
 * @param {object} options - 配置选项
 * @returns {Promise<boolean>} - 用户是否确认跳转
 */
function showNetworkErrorDialog(err, options = {}) {
  const { customMessage = null } = options;
  const reason = customMessage || getErrorMessage(err) || '网络连接中断';

  return new Promise((resolve) => {
    wx.showModal({
      title: '网络断开',
      content: `${reason}\n\n请通过桌面"网管系统"重新连接网络后继续使用。`,
      confirmText: '回桌面',
      cancelText: '稍后再说',
      confirmColor: '#000080',
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/index/index',
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
 * 记录错误日志
 * @param {string} context - 错误上下文（如函数名、操作名）
 * @param {Error|object} err - 错误对象
 * @param {object} extra - 额外信息
 */
function logError(context, err, extra = {}) {
  const errorInfo = {
    context,
    message: getErrorMessage(err),
    type: getErrorType(err),
    timestamp: new Date().toISOString(),
    ...extra
  };

  console.error(`[Error] ${context}:`, errorInfo);

  // 可以在这里添加错误上报逻辑
  // 例如上报到监控平台
}

/**
 * 包装异步函数，自动处理错误
 * @param {Function} fn - 异步函数
 * @param {object} options - 配置选项
 * @returns {Function} - 包装后的函数
 */
function withErrorHandling(fn, options = {}) {
  const {
    context = 'Operation',
    showError = true,
    customMessage = null,
    throwOnError = false
  } = options;

  return async function(...args) {
    try {
      return await fn.apply(this, args);
    } catch (err) {
      logError(context, err, { args });

      if (showError) {
        if (isNetworkError(err)) {
          await showNetworkErrorDialog(err, { customMessage });
        } else {
          showErrorToast(err, { customMessage });
        }
      }

      if (throwOnError) {
        throw err;
      }

      return null;
    }
  };
}

/**
 * 页面级错误处理混入
 * 为页面提供统一的错误处理方法
 */
const pageErrorHandler = {
  /**
   * 处理加载错误
   * @param {Error|object} err - 错误对象
   * @param {string} context - 上下文
   */
  handleLoadError(err, context) {
    logError(context || '数据加载', err);
    this.setData({ loading: false, error: true });

    if (isNetworkError(err)) {
      wx.showToast({ title: '网络连接中断', icon: 'none' });
    } else {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  /**
   * 处理操作错误
   * @param {Error|object} err - 错误对象
   * @param {string} operation - 操作名称
   */
  handleOperationError(err, operation) {
    logError(operation, err);

    if (isNetworkError(err)) {
      wx.showToast({ title: '网络连接中断', icon: 'none' });
    } else {
      wx.showToast({ title: `${operation}失败`, icon: 'none' });
    }
  }
};

/**
 * 云函数调用错误处理
 * @param {Error|object} err - 错误对象
 * @param {string} functionName - 云函数名称
 * @returns {object} - 标准化的错误响应
 */
function handleCloudFunctionError(err, functionName) {
  logError(`CloudFunction:${functionName}`, err);

  if (isNetworkError(err)) {
    return {
      success: false,
      networkError: true,
      message: '网络连接中断'
    };
  }

  return {
    success: false,
    error: err,
    message: getErrorMessage(err)
  };
}

module.exports = {
  ErrorTypes,
  getErrorMessage,
  getErrorType,
  showErrorToast,
  showNetworkErrorDialog,
  logError,
  withErrorHandling,
  pageErrorHandler,
  handleCloudFunctionError
};
