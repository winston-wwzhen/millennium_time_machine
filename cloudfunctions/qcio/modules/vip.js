/**
 * QCIO VIP兑换模块
 * 处理VIP兑换码、会员开通
 */

const { addTransaction } = require('./wallet');

/**
 * 兑换VIP码
 */
async function redeemVipCode(openid, code, db, _) {
  try {
    if (!code || code.trim() === '') {
      return { success: false, message: '请输入兑换码' };
    }

    const vipCodesCollection = db.collection('qcio_vip_codes');

    // 查询兑换码
    const codeRes = await vipCodesCollection.where({
      code: code.trim().toUpperCase()
    }).limit(1).get();

    if (codeRes.data.length === 0) {
      return { success: false, message: '兑换码不存在' };
    }

    const vipCode = codeRes.data[0];

    // 检查兑换码是否激活
    if (!vipCode.isActive) {
      return { success: false, message: '兑换码已失效' };
    }

    // 检查兑换码是否过期
    if (vipCode.expireTime) {
      const expireTime = new Date(vipCode.expireTime);
      if (expireTime < new Date()) {
        return { success: false, message: '兑换码已过期' };
      }
    }

    // 检查使用次数
    if (vipCode.usedCount >= vipCode.maxUses) {
      return { success: false, message: '兑换码已被使用完' };
    }

    // 根据类型发放奖励
    const rewardResult = await processVipReward(openid, vipCode, db, _);

    if (!rewardResult.success) {
      return rewardResult;
    }

    // 更新兑换码使用次数
    await vipCodesCollection.doc(vipCode._id).update({
      data: {
        usedCount: _.inc(1)
      }
    });

    return {
      success: true,
      data: rewardResult.data
    };
  } catch (err) {
    console.error('redeemVipCode Error:', err);
    return { success: false, error: err, message: '兑换失败' };
  }
}

/**
 * 处理VIP奖励
 */
async function processVipReward(openid, vipCode, db, _) {
  try {
    const { type, value } = vipCode;

    if (type === 'qpoints') {
      // Q点奖励
      await addTransaction(openid, {
        type: 'earn',
        currency: 'qpoints',
        amount: value,
        source: 'vip_code',
        description: 'VIP兑换码奖励'
      }, db, _);

      return {
        success: true,
        data: {
          type: 'qpoints',
          amount: value,
          message: `成功兑换${value}Q点`
        }
      };
    } else if (type === 'month_vip' || type === 'year_vip') {
      // VIP会员
      const months = type === 'year_vip' ? 12 : 1;
      const vipRecordsCollection = db.collection('qcio_vip_records');
      const walletCollection = db.collection('qcio_wallet');

      // 获取当前钱包
      const walletRes = await walletCollection.where({ _openid: openid }).limit(1).get();
      const wallet = walletRes.data[0] || {};

      // 计算VIP过期时间
      let startTime = new Date();
      let endTime;

      if (wallet.isVip && wallet.vipExpireTime) {
        // 已是VIP，在现有时间上增加
        const currentExpire = new Date(wallet.vipExpireTime);
        if (currentExpire > new Date()) {
          startTime = currentExpire;
        }
      }

      endTime = new Date(startTime);
      endTime.setMonth(endTime.getMonth() + months);

      // 更新钱包VIP状态
      if (walletRes.data.length > 0) {
        await walletCollection.doc(wallet._id).update({
          data: {
            isVip: true,
            vipExpireTime: endTime
          }
        });
      } else {
        await walletCollection.add({
          data: {
            _openid: openid,
            coins: 0,
            qpoints: 0,
            totalCoinsEarned: 0,
            totalQpointsEarned: 0,
            isVip: true,
            vipExpireTime: endTime,
            createTime: db.serverDate(),
            updateTime: db.serverDate()
          }
        });
      }

      // 记录VIP开通记录
      await vipRecordsCollection.add({
        data: {
          _openid: openid,
          type: type === 'year_vip' ? 'year' : 'month',
          duration: months,
          source: 'code',
          startTime: startTime,
          endTime: endTime,
          createTime: db.serverDate()
        }
      });

      return {
        success: true,
        data: {
          type: 'vip',
          vipType: type,
          months: months,
          endTime: endTime,
          message: `成功兑换VIP${months}个月`
        }
      };
    }

    return { success: false, message: '未知的兑换码类型' };
  } catch (err) {
    console.error('processVipReward Error:', err);
    return { success: false, error: err, message: '处理奖励失败' };
  }
}

module.exports = {
  redeemVipCode
};
