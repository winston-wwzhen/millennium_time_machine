const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID; // 用户的唯一标识
  const { type, userData } = event;

  // 🚪 登录/注册逻辑
  if (type === 'login') {
    try {
      // 1. 先查查这个用户存在不
      const res = await db.collection('users').where({
        _openid: openid
      }).get();

      if (res.data.length > 0) {
        // A. 老用户：更新最后登录时间
        await db.collection('users').doc(res.data[0]._id).update({
          data: {
            lastLoginTime: db.serverDate(),
            avatarName: userData.username // 更新用户设置的昵称
          }
        });
        return { success: true, isNew: false, openid };
      } else {
        // B. 新用户：创建记录
        await db.collection('users').add({
          data: {
            _openid: openid,
            avatarName: userData.username || 'Admin', // 默认叫 Admin
            createTime: db.serverDate(),
            lastLoginTime: db.serverDate(),
            settings: { theme: 'win98' } // 预留配置项
          }
        });
        return { success: true, isNew: true, openid };
      }
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  return { success: false, errMsg: 'Unknown type' };
};