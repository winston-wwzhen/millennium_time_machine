/**
 * QCIO 钱包交易模块
 * 处理金币、Q点的获取和消费
 */

/**
 * 获取用户钱包数据
 * 如果钱包不存在则自动创建
 */
async function getWallet(openid, db) {
  try {
    const walletCollection = db.collection('qcio_wallet');

    // 查询用户钱包
    const res = await walletCollection.where({ _openid: openid }).limit(1).get();

    if (res.data.length > 0) {
      // 钱包存在，返回数据
      const wallet = res.data[0];

      // 检查VIP是否过期
      let isVip = wallet.isVip || false;
      if (isVip && wallet.vipExpireTime) {
        const expireTime = new Date(wallet.vipExpireTime);
        if (expireTime < new Date()) {
          // VIP已过期，更新状态
          isVip = false;
          await walletCollection.doc(wallet._id).update({
            data: { isVip: false, vipExpireTime: null }
          });
        }
      }

      return {
        success: true,
        data: {
          coins: wallet.coins || 0,
          qpoints: wallet.qpoints || 0,
          isVip: isVip
        }
      };
    } else {
      // 钱包不存在，创建新钱包
      const newWallet = {
        _openid: openid,
        coins: 0,
        qpoints: 0,
        totalCoinsEarned: 0,
        totalQpointsEarned: 0,
        isVip: false,
        vipExpireTime: null,
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      };

      await walletCollection.add({ data: newWallet });

      return {
        success: true,
        data: {
          coins: 0,
          qpoints: 0,
          isVip: false
        }
      };
    }
  } catch (err) {
    console.error('getWallet Error:', err);
    return { success: false, error: err, message: '获取钱包数据失败' };
  }
}

/**
 * 添加交易记录并更新钱包
 * @param {String} openid - 用户openid
 * @param {Object} data - 交易数据
 * @param {String} data.type - 交易类型 (earn/spend)
 * @param {String} data.currency - 货币类型 (coins/qpoints)
 * @param {Number} data.amount - 金额（正数）
 * @param {String} data.source - 来源/用途
 * @param {String} data.description - 描述
 */
async function addTransaction(openid, data, db, _) {
  try {
    const { type, currency, amount, source, description } = data;

    if (!type || !currency || !amount || amount <= 0) {
      return { success: false, message: '交易参数无效' };
    }

    const walletCollection = db.collection('qcio_wallet');
    const transactionsCollection = db.collection('qcio_transactions');

    // 获取当前钱包
    const walletRes = await walletCollection.where({ _openid: openid }).limit(1).get();

    // 如果钱包不存在，自动创建
    if (walletRes.data.length === 0) {
      const newWallet = {
        _openid: openid,
        coins: 0,
        qpoints: 0,
        totalCoinsEarned: 0,
        totalQpointsEarned: 0,
        isVip: false,
        vipExpireTime: null,
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      };

      const createRes = await walletCollection.add({ data: newWallet });
      const walletId = createRes._id;

      const newBalance = type === 'earn' ? amount : 0;

      // 直接更新新创建的钱包
      await walletCollection.doc(walletId).update({
        data: {
          [currency]: newBalance,
          totalCoinsEarned: type === 'earn' && currency === 'coins' ? amount : 0,
          totalQpointsEarned: type === 'earn' && currency === 'qpoints' ? amount : 0,
          updateTime: db.serverDate()
        }
      });

      // 添加交易记录
      const transactionId = `${openid}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      await transactionsCollection.add({
        data: {
          _id: transactionId,
          _openid: openid,
          type: type,
          currency: currency,
          amount: amount,
          source: source,
          description: description,
          balanceAfter: newBalance,
          createTime: db.serverDate()
        }
      });

      return {
        success: true,
        data: {
          newBalance: newBalance,
          transactionId: transactionId
        }
      };
    }

    const wallet = walletRes.data[0];
    const currentBalance = wallet[currency] || 0;

    // 检查余额是否足够（消费时）
    if (type === 'spend' && currentBalance < amount) {
      return { success: false, message: '余额不足' };
    }

    // 计算新余额
    const newBalance = type === 'earn' ? currentBalance + amount : currentBalance - amount;

    // 更新钱包
    const updateData = {
      [currency]: newBalance,
      updateTime: db.serverDate()
    };

    // 更新累计获得量
    if (type === 'earn') {
      if (currency === 'coins') {
        updateData.totalCoinsEarned = _.inc(amount);
      } else {
        updateData.totalQpointsEarned = _.inc(amount);
      }
    }

    await walletCollection.doc(wallet._id).update({ data: updateData });

    // 添加交易记录
    const transactionId = `${openid}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    await transactionsCollection.add({
      data: {
        _id: transactionId,
        _openid: openid,
        type: type,
        currency: currency,
        amount: amount,
        source: source,
        description: description,
        balanceAfter: newBalance,
        createTime: db.serverDate()
      }
    });

    return {
      success: true,
      data: {
        newBalance: newBalance,
        transactionId: transactionId
      }
    };
  } catch (err) {
    console.error('addTransaction Error:', err);
    return { success: false, error: err, message: '交易失败' };
  }
}

module.exports = {
  getWallet,
  addTransaction
};
