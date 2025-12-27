/**
 * 经验获取工具函数
 * 统一处理所有场景的经验获取
 */

/**
 * 获取经验
 * @param {string} source - 经验来源类型
 * @param {number} amount - 经验数量
 * @param {object} options - 可选参数
 * @param {function} options.onSuccess - 成功回调
 * @param {function} options.onFail - 失败回调
 * @param {boolean} options.showToast - 是否显示提示（默认false）
 */
function addExperience(source, amount, options = {}) {
  const {
    onSuccess,
    onFail,
    showToast = false
  } = options;

  // 获取当前用户的 QCIO ID
  const qcioId = wx.getStorageSync('current_qcio_id');
  if (!qcioId) {
    console.warn('No QCIO ID found, skip adding experience');
    if (onFail) onFail({ message: '未登录' });
    return;
  }

  wx.cloud.callFunction({
    name: 'level',
    data: {
      action: 'addExperience',
      qcio_id: qcioId,
      data: {
        source: source,
        amount: amount
      }
    }
  }).then(res => {
    if (res.result && res.result.success) {
      const { level_up, new_level, experience } = res.result;

      // 如果升级了，显示提示
      if (level_up) {
        wx.showModal({
          title: '🎉 恭喜升级！',
          content: `你成长到了 Lv${new_level}！`,
          showCancel: false,
          confirmText: '知道了'
        });
        wx.vibrateShort();
      }

      // 显示获得经验提示（如果需要）
      if (showToast && experience > 0) {
        wx.showToast({
          title: `+${experience}经验`,
          icon: 'success',
          duration: 1500
        });
      }

      if (onSuccess) onSuccess(res.result);
    } else {
      // 达到上限或其他原因
      if (res.result && res.result.message) {
        console.log('Add experience result:', res.result.message);
      }
      if (onFail) onFail(res.result);
    }
  }).catch(err => {
    console.error('Add experience error:', err);
    if (showToast) {
      wx.showToast({
        title: '经验获取失败',
        icon: 'none'
      });
    }
    if (onFail) onFail(err);
  });
}

/**
 * 聊天发言获取经验
 */
function addChatExperience() {
  addExperience('chat', 2, { showToast: false });
}

/**
 * 发布心情日志获取经验
 */
function addPostLogExperience() {
  addExperience('post_log', 10, { showToast: true });
}

/**
 * 访问他人空间获取经验
 */
function addVisitSpaceExperience() {
  addExperience('visit_space', 3, { showToast: false });
}

/**
 * 农场收获获取经验
 */
function addFarmHarvestExperience() {
  addExperience('farm_harvest', 5, { showToast: true });
}

/**
 * 每日签到获取经验
 */
function addDailyCheckinExperience() {
  addExperience('daily_checkin', 10, { showToast: true });
}

/**
 * 在线挂机获取经验
 * @param {number} minutes - 在线分钟数
 */
function syncOnlineTime(minutes) {
  const qcioId = wx.getStorageSync('current_qcio_id');
  if (!qcioId) {
    console.warn('No QCIO ID found, skip syncing online time');
    return;
  }

  wx.cloud.callFunction({
    name: 'level',
    data: {
      action: 'syncOnlineTime',
      qcio_id: qcioId,
      data: { minutes }
    }
  }).then(res => {
    if (res.result && res.result.success) {
      // 同步成功，显示获得经验提示
      if (res.result.experience > 0) {
        wx.showToast({
          title: `+${res.result.experience}经验`,
          icon: 'none',
          duration: 1500
        });
      }

      // 检查是否升级
      if (res.result.level_up) {
        wx.showModal({
          title: '🎉 恭喜升级！',
          content: `在线挂机让你成长到了 Lv${res.result.new_level}！`,
          showCancel: false,
          confirmText: '知道了'
        });
        wx.vibrateShort();
      }
    }
  }).catch(err => {
    console.error('Sync online time error:', err);
  });
}

module.exports = {
  addExperience,
  addChatExperience,
  addPostLogExperience,
  addVisitSpaceExperience,
  addFarmHarvestExperience,
  addDailyCheckinExperience,
  syncOnlineTime
};
