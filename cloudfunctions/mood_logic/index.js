// cloudfunctions/mood_logic/index.js
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

// 配置：心情种子类型
const MOOD_TYPES = {
  sadness: { name: '忧伤.exe', time: 60, reward: 10 }, // 测试用：60秒成熟
  lonely: { name: '寂寞.bat', time: 1800, reward: 50 }, // 30分钟
  love: { name: '初恋.dll', time: 3600, reward: 100 }   // 60分钟
};

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { action, moodType, targetId } = event;

  // 1. 获取我的状态
  if (action === 'getMyStatus') {
    const res = await db.collection('mood_garden').where({ _openid: openid }).get();
    return { code: 200, data: res.data[0] || null };
  }

  // 2. 开始编译 (种菜)
  if (action === 'startCompile') {
    if (!MOOD_TYPES[moodType]) return { code: 400, msg: '错误的心情代码' };
    
    const startTime = Date.now();
    const endTime = startTime + (MOOD_TYPES[moodType].time * 1000);
    
    // 更新或创建记录
    // 注意：这里简化逻辑，假设每人只有一块地
    const check = await db.collection('mood_garden').where({ _openid: openid }).get();
    
    const data = {
      _openid: openid,
      nickName: event.nickName || '匿名黑客', // 前端传来的昵称
      avatarUrl: event.avatarUrl || '',       // 前端传来的头像
      currentMood: moodType,
      moodName: MOOD_TYPES[moodType].name,
      startTime,
      endTime,
      status: 'compiling', // compiling, finished
      stealedBy: []        // 被谁偷过
    };

    if (check.data.length > 0) {
      await db.collection('mood_garden').where({ _openid: openid }).update({ data });
    } else {
      await db.collection('mood_garden').add({ data });
    }
    return { code: 200, msg: '开始编译...' };
  }

  // 3. 收取数据 (收菜)
  if (action === 'collect') {
    const record = await db.collection('mood_garden').where({ _openid: openid }).get();
    if (!record.data[0]) return { code: 400, msg: '没有数据' };
    
    const item = record.data[0];
    if (Date.now() < item.endTime) return { code: 400, msg: '编译尚未完成' };

    // 重置状态
    await db.collection('mood_garden').where({ _openid: openid }).update({
      data: { status: 'idle', currentMood: null }
    });
    
    // TODO: 这里可以给用户加积分/碎片
    return { code: 200, msg: '数据回收成功！内存已释放。' };
  }

  // 4. 扫描网络邻居 (随机获取一个可偷的目标)
  if (action === 'scanNetwork') {
    // 逻辑：随机找一个 endTime < now 的记录，且不是自己
    const now = Date.now();
    
    // 使用聚合查询随机抽样
    const res = await db.collection('mood_garden').aggregate()
      .match({
        _openid: _.neq(openid), // 不是自己
        endTime: _.lt(now),     // 已经成熟
        status: 'compiling'     // 还没被主人收走
      })
      .sample({ size: 1 })      // 随机取1个
      .end();

    if (res.list.length === 0) {
      return { code: 404, msg: '当前网络寂静无声...' };
    }
    return { code: 200, data: res.list[0] };
  }

  // 5. 复制数据 (偷菜)
  if (action === 'copyData') {
    if (!targetId) return { code: 400, msg: '目标丢失' };
    
    const target = await db.collection('mood_garden').doc(targetId).get();
    if (!target.data) return { code: 404, msg: '目标不存在' };
    
    // 检查是否偷过
    if (target.data.stealedBy && target.data.stealedBy.includes(openid)) {
      return { code: 403, msg: '你已经访问过该端口了' };
    }

    // 记录偷取
    await db.collection('mood_garden').doc(targetId).update({
      data: {
        stealedBy: _.push(openid)
      }
    });

    return { code: 200, msg: `成功复制了 [${target.data.moodName}] 的碎片` };
  }

  return { code: 400, msg: '未知指令' };
};