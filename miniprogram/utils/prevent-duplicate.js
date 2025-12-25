/**
 * 防重复点击工具
 * 用于防止用户在网络延迟时重复点击按钮
 */

/**
 * 防重复点击装饰器
 * @param {Number} delay - 延迟时间（毫秒），默认1000ms
 * @returns {Function} 装饰后的函数
 */
function preventDuplicateClick(delay = 1000) {
  return function(target, name, descriptor) {
    const originalMethod = descriptor.value;
    let isRunning = false;

    descriptor.value = function(...args) {
      if (isRunning) {
        console.log(`[防重复] ${name} 正在执行中，忽略本次点击`);
        return;
      }

      isRunning = true;
      console.log(`[防重复] ${name} 开始执行`);

      const result = originalMethod.apply(this, args);

      // 如果返回Promise，等待完成后释放
      if (result && typeof result.then === 'function') {
        return result.finally(() => {
          setTimeout(() => {
            isRunning = false;
            console.log(`[防重复] ${name} 执行完成，释放锁`);
          }, delay);
        });
      } else {
        setTimeout(() => {
          isRunning = false;
          console.log(`[防重复] ${name} 执行完成，释放锁`);
        }, delay);
      }

      return result;
    };

    return descriptor;
  };
}

/**
 * 创建一个带防重复点击的函数包装器
 * @param {Function} fn - 原函数
 * @param {Number} delay - 延迟时间（毫秒）
 * @returns {Function} 包装后的函数
 */
function wrapWithPreventDuplicate(fn, delay = 1000) {
  let isRunning = false;

  return function(...args) {
    if (isRunning) {
      wx.showToast({
        title: '请勿重复点击',
        icon: 'none',
        duration: 1000
      });
      return;
    }

    isRunning = true;

    const result = fn.apply(this, args);

    // 如果返回Promise，等待完成后释放
    if (result && typeof result.then === 'function') {
      return result.finally(() => {
        setTimeout(() => {
          isRunning = false;
        }, delay);
      });
    } else {
      setTimeout(() => {
        isRunning = false;
      }, delay);
    }

    return result;
  };
}

/**
 * 页面级防重复点击混入
 * 在页面或组件的 data 中添加 _clickLocks 对象来跟踪每个按钮的锁定状态
 */
const preventDuplicateBehavior = Behavior({
  data: {
    _clickLocks: {}
  },

  methods: {
    /**
     * 执行带防重复点击的方法
     * @param {String} key - 锁的key，通常是方法名
     * @param {Function} fn - 要执行的函数
     * @param {Number} delay - 延迟时间（毫秒）
     */
    _runWithLock(key, fn, delay = 1000) {
      if (this.data._clickLocks[key]) {
        wx.showToast({
          title: '请勿重复点击',
          icon: 'none',
          duration: 500
        });
        return;
      }

      // 设置锁
      this.setData({
        [`_clickLocks.${key}`]: true
      });

      // 执行函数
      const result = fn.call(this);

      // 如果返回Promise，等待完成后释放
      if (result && typeof result.then === 'function') {
        return result.finally(() => {
          setTimeout(() => {
            this.setData({
              [`_clickLocks.${key}`]: false
            });
          }, delay);
        });
      } else {
        setTimeout(() => {
          this.setData({
            [`_clickLocks.${key}`]: false
          });
        }, delay);
      }

      return result;
    },

    /**
     * 检查锁状态
     * @param {String} key - 锁的key
     * @returns {Boolean} 是否被锁定
     */
    _isLocked(key) {
      return !!this.data._clickLocks[key];
    },

    /**
     * 释放锁
     * @param {String} key - 锁的key
     */
    _releaseLock(key) {
      this.setData({
        [`_clickLocks.${key}`]: false
      });
    }
  }
});

module.exports = {
  preventDuplicateClick,
  wrapWithPreventDuplicate,
  preventDuplicateBehavior
};
