// cloudfunctions/qcio/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

/**
 * QCIQ (QCIO) 核心业务云函数
 * 处理账号初始化、登录状态同步、个人资料修改
 */
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();

  switch (event.action) {
    case 'init':
      // 初始化或获取账号信息（包含在线状态）
      return await initAccount(OPENID);
    
    case 'login':
      // 设置云端状态为“在线”
      return await setOnlineStatus(OPENID, true);
      
    case 'logout':
      // 设置云端状态为“离线”
      return await setOnlineStatus(OPENID, false);

    case 'updateProfile':
      // 更新个人资料（昵称、签名）
      return await updateProfile(OPENID, event.data);
      
    default:
      return { success: false, message: '未知的操作类型' };
  }
};

/**
 * 获取或创建 QCIO 账号
 */
async function initAccount(openid) {
  try {
    const qcioCollection = db.collection('qcio_users');
    
    // 1. 检查数据库记录
    const userRes = await qcioCollection.where({
      _openid: openid
    }).limit(1).get();

    if (userRes.data.length > 0) {
      return {
        success: true,
        data: userRes.data[0],
        message: '获取账号成功'
      };
    }

    // 2. 首次进入，生成唯一的 5 位账号 (10000-99999)
    let qcio_id = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 15) {
      qcio_id = (Math.floor(Math.random() * 90000) + 10000).toString();
      const checkRes = await qcioCollection.where({ qcio_id }).count();
      if (checkRes.total === 0) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) throw new Error('ID 生成失败');

    // 3. 构建新用户数据
    const newUser = {
      _openid: openid,
      qcio_id: qcio_id,
      password: '123456',
      nickname: '千禧网友',
      signature: '承諾、絠什嚒用？還bùsんì洅見。',
      avatar: '👤',
      level: 1,
      isOnline: false, // 初始默认不在线
      createTime: db.serverDate(),
      lastLoginTime: db.serverDate()
    };

    await qcioCollection.add({ data: newUser });

    return {
      success: true,
      data: newUser,
      message: '账号初始化成功'
    };

  } catch (err) {
    console.error('initAccount Error:', err);
    return { success: false, error: err, message: '系统初始化失败' };
  }
}

/**
 * 同步云端的在线/离线状态
 */
async function setOnlineStatus(openid, status) {
  try {
    await db.collection('qcio_users').where({
      _openid: openid
    }).update({
      data: {
        isOnline: status,
        lastLoginTime: db.serverDate()
      }
    });
    return { success: true, isOnline: status };
  } catch (err) {
    console.error('setOnlineStatus Error:', err);
    return { success: false, error: err };
  }
}

/**
 * 更新用户资料并返回更新后的对象
 */
async function updateProfile(openid, data) {
  try {
    const updateFields = {};
    if (data.nickname) updateFields.nickname = data.nickname;
    if (data.signature) updateFields.signature = data.signature;
    
    await db.collection('qcio_users').where({ _openid: openid }).update({
      data: {
        ...updateFields,
        updateTime: db.serverDate()
      }
    });

    const updatedUser = await db.collection('qcio_users').where({ _openid: openid }).get();

    return { 
      success: true, 
      data: updatedUser.data[0] 
    };
  } catch (err) {
    console.error('updateProfile Error:', err);
    return { success: false, error: err };
  }
}