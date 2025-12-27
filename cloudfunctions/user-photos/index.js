const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

/**
 * 用户相册云函数
 * 功能：保存照片、获取照片列表、删除照片
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { type, photoData, photoId } = event;

  // 保存照片（云存储URL + 数据库记录）
  if (type === 'savePhoto') {
    try {
      const { cloudPath, fileID } = photoData;

      // 保存到数据库
      const res = await db.collection('user_photos').add({
        data: {
          _openid: openid,
          fileID: fileID,          // 云存储文件ID
          cloudPath: cloudPath,    // 云存储路径
          createTime: db.serverDate()
        }
      });

      return {
        success: true,
        _id: res._id
      };
    } catch (e) {
      console.error('保存照片失败:', e);
      return { success: false, errMsg: e.message };
    }
  }

  // 获取用户照片列表
  if (type === 'getPhotos') {
    try {
      const { limit = 50 } = event;

      const res = await db.collection('user_photos')
        .where({ _openid: openid })
        .orderBy('createTime', 'desc')
        .limit(limit)
        .get();

      return {
        success: true,
        photos: res.data || []
      };
    } catch (e) {
      console.error('获取照片列表失败:', e);
      return { success: false, errMsg: e.message };
    }
  }

  // 删除照片
  if (type === 'deletePhoto') {
    try {
      // 先获取照片信息
      const photoRes = await db.collection('user_photos')
        .where({ _openid: openid, _id: photoId })
        .get();

      if (photoRes.data.length === 0) {
        return { success: false, errMsg: '照片不存在' };
      }

      const photo = photoRes.data[0];

      // 从云存储删除文件
      try {
        await cloud.deleteFile({
          fileList: [photo.fileID]
        });
      } catch (e) {
        console.error('删除云存储文件失败:', e);
        // 继续删除数据库记录
      }

      // 从数据库删除记录
      await db.collection('user_photos')
        .doc(photoId)
        .remove();

      return { success: true };
    } catch (e) {
      console.error('删除照片失败:', e);
      return { success: false, errMsg: e.message };
    }
  }

  return { success: false, errMsg: 'Unknown type' };
};
