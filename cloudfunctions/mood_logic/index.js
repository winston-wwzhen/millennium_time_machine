// cloudfunctions/mood_logic/index.js
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

// 💾 配置表：情绪种子 (增加了产量和单价)
const MOOD_TYPES = {
  sadness: { name: '忧伤.exe', time: 60, baseOutput: 10, price: 5 },   // 1分钟，产10个，单价5
  lonely:  { name: '寂寞.bat', time: 1800, baseOutput: 20, price: 10 }, // 30分钟
  love:    { name: '初恋.dll', time: 3600, baseOutput: 50, price: 20 }  // 60分钟
};

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { action, moodType, targetId } = event;

  // 1. 获取我的状态 (保持不变，但前端会拿到更多字段)
  if (action === 'getMyStatus') {
    const res = await db.collection('mood_garden').where({ _openid: openid }).get();
    return { code: 200, data: res.data[0] || null };
  }

  // 2. 🌱 开始编译 (种菜) - 改造：初始化产量
  if (action === 'startCompile') {
    if (!MOOD_TYPES[moodType]) return { code: 400, msg: '错误的代码类型' };
    
    const config = MOOD_TYPES[moodType];
    const startTime = Date.now();
    const endTime = startTime + (config.time * 1000);
    
    const gardenData = {
      _openid: openid,
      nickName: event.nickName || '匿名黑客',
      avatarUrl: event.avatarUrl || '',
      currentMood: moodType,
      moodName: config.name,
      startTime,
      endTime,
      status: 'compiling',
      
      // ✨ 新增经济字段
      totalOutput: config.baseOutput, // 总产量
      remainingOutput: config.baseOutput, // 剩余产量 (被偷会减少)
      stealedBy: [], // 记录谁来过 [ {openid, amount} ]
      lastModified: Date.now()
    };

    // 更新或创建 (upsert)
    const check = await db.collection('mood_garden').where({ _openid: openid }).get();
    if (check.data.length > 0) {
      await db.collection('mood_garden').where({ _openid: openid }).update({ data: gardenData });
    } else {
      await db.collection('mood_garden').add({ data: gardenData });
    }
    return { code: 200, msg: '进程启动，编译中...' };
  }

  // 3. 🖐️ 复制数据 (偷菜) - 改造：真实扣除产量
  if (action === 'copyData') {
    if (!targetId) return { code: 400, msg: '目标丢失' };
    
    // 事务处理建议：虽然这里没用 transaction，但并发量不大先这样写
    const target = await db.collection('mood_garden').doc(targetId).get();
    if (!target.data) return { code: 404, msg: '目标已下线' };
    
    // 检查是否已经偷过
    const hasStealed = (target.data.stealedBy || []).some(record => record.openid === openid);
    if (hasStealed) {
      return { code: 403, msg: '防火墙警告：同一IP无法重复访问' };
    }

    // 检查是否有剩余
    if (target.data.remainingOutput <= 0) {
      return { code: 400, msg: '数据已被清空，无法复制' };
    }

    // 🎲 随机偷取量 (1 到 2 个单位，或者总量的 10%)
    const stealAmount = Math.max(1, Math.floor(target.data.totalOutput * 0.1));
    // 确保不偷成负数
    const actualSteal = Math.min(stealAmount, target.data.remainingOutput);

    // 更新受害者数据 (减少剩余产量，记录小偷)
    await db.collection('mood_garden').doc(targetId).update({
      data: {
        remainingOutput: _.inc(-actualSteal),
        stealedBy: _.push({ openid: openid, amount: actualSteal, time: Date.now() })
      }
    });

    // ✨ TODO: 应该在这里把 actualSteal 加到【我的背包】里
    // 暂时先返回给前端显示爽一下
    return { 
      code: 200, 
      msg: `入侵成功！复制了 ${actualSteal} 个数据碎片`, 
      data: { stolenAmount: actualSteal } 
    };
  }

  // 4. 💰 收取数据 (收菜) - 改造：结算入库
  if (action === 'collect') {
    const record = await db.collection('mood_garden').where({ _openid: openid }).get();
    if (!record.data[0]) return { code: 400, msg: '没有运行的进程' };
    
    const item = record.data[0];
    if (Date.now() < item.endTime) return { code: 400, msg: '编译尚未完成' };

    const gain = item.remainingOutput; // 最终收获量

    // 重置花园状态
    await db.collection('mood_garden').where({ _openid: openid }).update({
      data: { status: 'idle', currentMood: null, remainingOutput: 0 }
    });
    
    // ✨ TODO: 将 gain * price 转换为金币，或直接存入 inventory 集合
    // await db.collection('user_assets')....
    
    let msg = `回收成功！获得 ${gain} 个碎片。`;
    if (gain < item.totalOutput) {
      msg += ` (部分数据在网络传输中丢失/被盗)`;
    }

    return { code: 200, msg: msg, gain: gain };
  }

  // 5. 扫描 (逻辑基本不变，可以增加只扫能偷的人)
  if (action === 'scanNetwork') {
    const now = Date.now();
    const res = await db.collection('mood_garden').aggregate()
      .match({
        _openid: _.neq(openid), 
        endTime: _.lt(now),     // 已成熟
        status: 'compiling',
        remainingOutput: _.gt(0) // 还有得偷
      })
      .sample({ size: 1 })
      .end();

    if (res.list.length === 0) {
      return { code: 404, msg: '局域网扫描完毕，未发现可入侵端口。' };
    }
    return { code: 200, data: res.list[0] };
  }

  return { code: 400, msg: '未知指令' };
};