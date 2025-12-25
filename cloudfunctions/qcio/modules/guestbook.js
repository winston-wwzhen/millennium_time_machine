/**
 * QCIO 留言板模块
 * 处理空间留言的查询和删除
 */

const { formatRelativeTime } = require('./utils');

/**
 * 获取留言列表
 */
async function getGuestbook(openid, db) {
  try {
    // 先获取当前用户的 qcio_id
    const userRes = await db.collection('qcio_users').where({ _openid: openid }).get();
    if (userRes.data.length === 0) {
      return { success: true, data: [] };
    }

    const userQcioId = userRes.data[0].qcio_id;

    // 通过 ownerQcioId 查询留言
    const res = await db.collection('qcio_guestbook')
      .where({ ownerQcioId: userQcioId })
      .orderBy('createTime', 'desc')
      .limit(50)
      .get();

    // 格式化时间
    const messages = res.data.map(msg => ({
      id: msg._id,
      visitorId: msg.visitorId,
      nickname: msg.visitorName,
      avatar: msg.avatar,
      content: msg.content,
      time: formatRelativeTime(msg.createTime),
      createTime: msg.createTime
    }));

    return {
      success: true,
      data: messages
    };
  } catch (err) {
    console.error('getGuestbook Error:', err);
    return { success: false, error: err, message: '获取留言失败' };
  }
}

/**
 * 删除留言
 */
async function deleteGuestbookMessage(openid, messageId, db) {
  try {
    // 先获取当前用户的 qcio_id
    const userRes = await db.collection('qcio_users').where({ _openid: openid }).get();
    if (userRes.data.length === 0) {
      return { success: false, message: '用户不存在' };
    }

    const userQcioId = userRes.data[0].qcio_id;

    // 验证留言是否属于该用户的留言板
    const res = await db.collection('qcio_guestbook')
      .where({
        ownerQcioId: userQcioId,
        _id: messageId
      })
      .get();

    if (res.data.length === 0) {
      return { success: false, message: '留言不存在或无权删除' };
    }

    // 删除留言
    await db.collection('qcio_guestbook')
      .doc(messageId)
      .remove();

    return {
      success: true,
      message: '删除成功'
    };
  } catch (err) {
    console.error('deleteGuestbookMessage Error:', err);
    return { success: false, error: err, message: '删除留言失败' };
  }
}

module.exports = {
  getGuestbook,
  deleteGuestbookMessage
};
