/**
 * 微信小程序胶囊按钮适配工具
 * 用于动态计算避开右上角胶囊按钮所需的间距
 */

/**
 * 计算避开胶囊按钮所需的padding-top值
 * @returns {number} 需要的padding-top值（px）
 */
function calculateCapsulePadding() {
  try {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight || 0;

    // 获取胶囊按钮位置信息
    const menuButton = wx.getMenuButtonBoundingClientRect();

    // 计算需要的间距：胶囊按钮底部 + 额外间距
    const capsuleBottom = menuButton.top + menuButton.height;
    const padding = capsuleBottom + 8; // 加8px额外间距

    console.log('[CapsuleUtils] 计算间距:', padding, '状态栏:', statusBarHeight, '胶囊:', menuButton);
    return padding;
  } catch (e) {
    console.error('[CapsuleUtils] 获取胶囊信息失败:', e);
    // 如果获取失败，返回安全默认值
    return 50;
  }
}

/**
 * 设置页面胶囊适配（用于Page的onLoad）
 * @param {Object} pageInstance - 页面实例（通常传this）
 * @param {string} dataKey - data中存储间距值的key，默认为'capsulePadding'
 */
function setupCapsulePadding(pageInstance, dataKey = 'capsulePadding') {
  if (!pageInstance || !pageInstance.setData) {
    console.error('[CapsuleUtils] 无效的页面实例');
    return;
  }

  const padding = calculateCapsulePadding();
  pageInstance.setData({
    [dataKey]: padding
  });
}

module.exports = {
  calculateCapsulePadding,
  setupCapsulePadding
};
