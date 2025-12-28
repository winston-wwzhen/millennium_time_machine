const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

/**
 * 生成随机用户名
 * 格式：形容词 + 名词 + 数字（如：快乐熊猫234、神秘星空789）
 */
function generateRandomUsername() {
  const adjectives = ['快乐', '忧伤', '神秘', '勇敢', '温柔', '热血', '安静', '活泼', '聪明', '呆萌',
    '飘逸', '霸气', '可爱', '酷炫', '浪漫', '淳朴', '机智', '憨厚', '灵动', '沉稳'];
  const nouns = ['熊猫', '星空', '飞鸟', '海豚', '狮子', '蝴蝶', '蜻蜓', '猫咪', '兔子', '松鼠',
    '云朵', '月光', '樱花', '落叶', '流星', '彩虹', '微风', '晨露', '雪花', '烟火'];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 900) + 100; // 100-999随机数字

  return `${adj}${noun}${num}`;
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID; // 用户的唯一标识
  const { type, userData, amount, eggId, eggData } = event;

  // 🚪 登录/注册逻辑
  if (type === 'login') {
    try {
      const res = await db.collection('users').where({
        _openid: openid
      }).get();

      if (res.data.length > 0) {
        const user = res.data[0];
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
        const lastDailyDate = user.eggStats?.lastDailyDate;

        // 检查是否需要每日扣除网费
        let dailyDeducted = false;
        let newDaysUsed = user.eggStats?.daysUsed || 0;

        if (lastDailyDate !== todayStr) {
          // 新的一天，扣除1天网费（1440分钟）
          dailyDeducted = true;
          newDaysUsed++;

          await db.collection('users').doc(user._id).update({
            data: {
              lastLoginTime: db.serverDate(),
              netFee: _.inc(-1440),  // 每日扣除1天网费（1440分钟）
              'eggStats.daysUsed': _.inc(1),
              'eggStats.lastDailyDate': todayStr
            }
          });

          // 记录每日扣费交易
          await db.collection('user_transactions').add({
            data: {
              _openid: openid,
              type: 'daily_deduct',
              description: '每日登录扣费',
              amount: -1440,
              balanceAfter: (user.netFee || 0) - 1440,
              createTime: db.serverDate()
            }
          });
        } else {
          // 同一天，只更新登录时间
          await db.collection('users').doc(user._id).update({
            data: {
              lastLoginTime: db.serverDate()
            }
          });
        }

        return {
          success: true,
          isNew: false,
          avatarName: user.avatarName,
          openid,
          dailyDeducted,
          daysUsed: newDaysUsed,
          netFee: user.netFee || 0,
          coins: user.coins || 0
        };
      } else {
        // 新用户：创建记录，赠送初始网费
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

        // 生成随机用户名
        const randomUsername = generateRandomUsername();

        await db.collection('users').add({
          data: {
            _openid: openid,
            avatarName: randomUsername,
            avatar: '👤',          // 默认头像
            createTime: db.serverDate(),
            lastLoginTime: db.serverDate(),
            settings: { theme: 'win98' },
            // 双代币系统
            coins: 0,             // 时光币（通过彩蛋获得）
            netFee: 43200,         // 网费：初始30天（30 * 1440 = 43200分钟）
            badges: [],            // 彩蛋徽章收集
            eggStats: {
              totalDiscovered: 0,
              totalEarned: 0,      // 累计获得时光币
              daysUsed: 1,         // 第一天也算使用
              lastDailyDate: todayStr
            }
          }
        });
        return {
          success: true,
          isNew: true,
          openid,
          avatarName: randomUsername,
          coins: 0,
          netFee: 43200,
          daysUsed: 1,
          dailyDeducted: true
        };
      }
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 💰 获取用户余额（时光币 + 网费）
  if (type === 'getBalance') {
    try {
      const res = await db.collection('users').where({
        _openid: openid
      }).field({
        avatarName: true,
        avatar: true,
        coins: true,
        netFee: true,
        badges: true,
        eggStats: true
      }).get();

      if (res.data.length === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      return {
        success: true,
        avatarName: res.data[0].avatarName || 'Admin',
        avatar: res.data[0].avatar || '👤',
        coins: res.data[0].coins || 0,
        netFee: res.data[0].netFee || 0,
        badges: res.data[0].badges || [],
        eggStats: res.data[0].eggStats || { totalDiscovered: 0, totalEarned: 0, daysUsed: 0 }
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 💰 增加时光币（彩蛋奖励）
  if (type === 'addCoins') {
    try {
      const updateRes = await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          coins: _.inc(amount),
          'eggStats.totalEarned': _.inc(amount),
          lastUpdateTime: db.serverDate()
        }
      });

      if (updateRes.stats.updated === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      return { success: true, coins: amount };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🌐 兑换网费（时光币 → 网费）
  if (type === 'exchangeNetFee') {
    try {
      // 查询当前余额
      const res = await db.collection('users').where({
        _openid: openid
      }).field({ coins: true, netFee: true }).get();

      if (res.data.length === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      const currentCoins = res.data[0].coins || 0;

      // 兑换比例：1000 时光币 = 1 天网费（1440分钟）
      // 即 1 时光币 = 1.44 分钟网费
      // amount 是要兑换的分钟数
      const coinsNeeded = Math.ceil(amount * 1000 / 1440);
      const netFeeToAdd = amount;

      // 检查时光币是否足够
      if (currentCoins < coinsNeeded) {
        return {
          success: false,
          errMsg: '时光币不足',
          insufficient: true,
          currentCoins,
          required: coinsNeeded
        };
      }

      await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          coins: _.inc(-coinsNeeded),
          netFee: _.inc(netFeeToAdd),
          lastUpdateTime: db.serverDate()
        }
      });

      // 记录兑换交易
      await db.collection('user_transactions').add({
        data: {
          _openid: openid,
          type: 'exchange',
          description: `时光币兑换网费 ${Math.ceil(amount / 1440)}天`,
          amount: netFeeToAdd,
          coinsUsed: coinsNeeded,
          balanceAfter: (res.data[0].netFee || 0) + netFeeToAdd,
          createTime: db.serverDate()
        }
      });

      return {
        success: true,
        exchanged: amount,
        coinsDeducted: coinsNeeded,
        remainingCoins: currentCoins - coinsNeeded,
        newNetFee: (res.data[0].netFee || 0) + netFeeToAdd
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🌐 扣除网费（AI功能使用）
  if (type === 'deductNetFee') {
    try {
      const res = await db.collection('users').where({
        _openid: openid
      }).field({ netFee: true }).get();

      if (res.data.length === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      const currentNetFee = res.data[0].netFee || 0;

      if (currentNetFee < amount) {
        return {
          success: false,
          errMsg: '网费不足，请通过网管系统兑换',
          insufficient: true,
          currentNetFee
        };
      }

      const updateRes = await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          netFee: _.inc(-amount),
          lastUpdateTime: db.serverDate()
        }
      });

      if (updateRes.stats.updated === 0) {
        return { success: false, errMsg: '扣除失败' };
      }

      // 记录使用扣费交易
      await db.collection('user_transactions').add({
        data: {
          _openid: openid,
          type: 'usage',
          description: 'AI功能使用扣费',
          amount: -amount,
          balanceAfter: currentNetFee - amount,
          createTime: db.serverDate()
        }
      });

      return {
        success: true,
        deducted: amount,
        remainingNetFee: currentNetFee - amount
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🥚 获取用户彩蛋数据
  if (type === 'getEggs') {
    try {
      const res = await db.collection('users').where({
        _openid: openid
      }).field({
        badges: true,
        eggStats: true
      }).get();

      if (res.data.length === 0) {
        return {
          success: true,
          data: {
            badges: [],
            stats: { totalDiscovered: 0, totalEarned: 0, daysUsed: 0 }
          }
        };
      }

      return {
        success: true,
        data: {
          badges: res.data[0].badges || [],
          stats: res.data[0].eggStats || { totalDiscovered: 0, totalEarned: 0, daysUsed: 0 }
        }
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🥚 检查聊天彩蛋（累计发送消息计数）
  if (type === 'checkChatEgg') {
    try {
      const userRes = await db.collection('users').where({
        _openid: openid
      }).field({
        badges: true,
        'eggStats.chatMessageCount': true
      }).get();

      if (userRes.data.length === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      const badges = userRes.data[0].badges || [];
      const currentCount = userRes.data[0].eggStats?.chatMessageCount || 0;

      // 检查是否已经达成过聊天狂魔彩蛋
      const hasChatLover = badges.some(b => b.eggId === 'chat_lover');
      if (hasChatLover) {
        return { success: true, shouldTrigger: false, alreadyAchieved: true, count: currentCount };
      }

      // 增加计数
      const newCount = currentCount + 1;

      // 更新计数
      await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          'eggStats.chatMessageCount': newCount
        }
      });

      // 检查是否达到阈值（100条）
      const shouldTrigger = newCount >= 100;

      return {
        success: true,
        shouldTrigger: shouldTrigger,
        count: newCount,
        alreadyAchieved: false
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🥚 检查QCIO空间访问彩蛋（累计访问计数）
  if (type === 'checkQcioEgg') {
    try {
      const userRes = await db.collection('users').where({
        _openid: openid
      }).field({
        badges: true,
        'eggStats.qcioSpaceVisitCount': true
      }).get();

      if (userRes.data.length === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      const badges = userRes.data[0].badges || [];
      const currentCount = userRes.data[0].eggStats?.qcioSpaceVisitCount || 0;

      // 检查是否已经达成过空间常客彩蛋
      const hasQcioVisitor = badges.some(b => b.eggId === 'qcio_space_visitor');
      if (hasQcioVisitor) {
        return { success: true, shouldTrigger: false, alreadyAchieved: true, count: currentCount };
      }

      // 增加计数
      const newCount = currentCount + 1;

      // 更新计数
      await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          'eggStats.qcioSpaceVisitCount': newCount
        }
      });

      // 检查是否达到阈值（10次）
      const shouldTrigger = newCount >= 10;

      return {
        success: true,
        shouldTrigger: shouldTrigger,
        count: newCount,
        alreadyAchieved: false
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🥚 检查回收站清空彩蛋（累计清空计数）
  if (type === 'checkRecycleBinEgg') {
    try {
      const userRes = await db.collection('users').where({
        _openid: openid
      }).field({
        badges: true,
        'eggStats.recycleBinEmptyCount': true
      }).get();

      if (userRes.data.length === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      const badges = userRes.data[0].badges || [];
      const currentCount = userRes.data[0].eggStats?.recycleBinEmptyCount || 0;

      // 检查是否已经达成过回收站清理者彩蛋
      const hasRecycleBinEmptyer = badges.some(b => b.eggId === 'recycle_bin_emptyer');
      if (hasRecycleBinEmptyer) {
        return { success: true, shouldTrigger: false, alreadyAchieved: true, count: currentCount };
      }

      // 增加计数
      const newCount = currentCount + 1;

      // 更新计数
      await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          'eggStats.recycleBinEmptyCount': newCount
        }
      });

      // 检查是否达到阈值（5次）
      const shouldTrigger = newCount >= 5;

      return {
        success: true,
        shouldTrigger: shouldTrigger,
        count: newCount,
        alreadyAchieved: false
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🥚 检查群聊彩蛋（累计发送群聊消息计数）
  if (type === 'checkGroupChatEgg') {
    try {
      const userRes = await db.collection('users').where({
        _openid: openid
      }).field({
        badges: true,
        'eggStats.groupChatMessageCount': true
      }).get();

      if (userRes.data.length === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      const badges = userRes.data[0].badges || [];
      const currentCount = userRes.data[0].eggStats?.groupChatMessageCount || 0;

      // 检查是否已经达成过群聊狂欢彩蛋
      const hasGroupChatParty = badges.some(b => b.eggId === 'group_chat_party');
      if (hasGroupChatParty) {
        return { success: true, shouldTrigger: false, alreadyAchieved: true, count: currentCount };
      }

      // 增加计数
      const newCount = currentCount + 1;

      // 更新计数
      await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          'eggStats.groupChatMessageCount': newCount
        }
      });

      // 检查是否达到阈值（50条）
      const shouldTrigger = newCount >= 50;

      return {
        success: true,
        shouldTrigger: shouldTrigger,
        count: newCount,
        alreadyAchieved: false
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🥚 检查火星翻译彩蛋（累计使用翻译计数）
  if (type === 'checkMarsTranslatorEgg') {
    try {
      const userRes = await db.collection('users').where({
        _openid: openid
      }).field({
        badges: true,
        'eggStats.marsTranslatorCount': true
      }).get();

      if (userRes.data.length === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      const badges = userRes.data[0].badges || [];
      const currentCount = userRes.data[0].eggStats?.marsTranslatorCount || 0;

      // 检查是否已经达成过火星文大师彩蛋
      const hasMarsTranslator = badges.some(b => b.eggId === 'mars_translator');
      if (hasMarsTranslator) {
        return { success: true, shouldTrigger: false, alreadyAchieved: true, count: currentCount };
      }

      // 增加计数
      const newCount = currentCount + 1;

      // 更新计数
      await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          'eggStats.marsTranslatorCount': newCount
        }
      });

      // 检查是否达到阈值（10次）
      const shouldTrigger = newCount >= 10;

      return {
        success: true,
        shouldTrigger: shouldTrigger,
        count: newCount,
        alreadyAchieved: false
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🥚 发现新彩蛋
  if (type === 'discoverEgg') {
    try {
      // 检查是否已经发现过（通过badge字段）
      const userRes = await db.collection('users').where({
        _openid: openid
      }).field({ badges: true }).get();

      if (userRes.data.length === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      const badges = userRes.data[0].badges || [];
      const reward = eggData?.reward || {};
      const badgeName = reward.badge || '';

      // 检查徽章是否已存在
      if (badgeName && badges.some(b => b.name === badgeName)) {
        return { success: true, isNew: false };
      }

      // 获取时光币奖励
      const coinsReward = reward.coins || 0;

      // 原子操作：添加徽章 + 增加时光币 + 更新统计
      const updateData = {
        'eggStats.totalDiscovered': _.inc(1),
        'eggStats.totalEarned': _.inc(coinsReward)
      };

      if (coinsReward > 0) {
        updateData.coins = _.inc(coinsReward);
      }

      if (badgeName) {
        updateData.badges = _.push({
          name: badgeName,
          eggId: eggId,
          discoveredAt: db.serverDate()
        });
      }

      const updateRes = await db.collection('users').where({
        _openid: openid
      }).update({
        data: updateData
      });

      if (updateRes.stats.updated === 0) {
        return { success: false, errMsg: '更新失败' };
      }

      return { success: true, isNew: true, reward: reward };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 👤 更新用户资料（昵称、头像）
  if (type === 'updateProfile') {
    try {
      const { nickname, avatar } = event.data || {};

      // 构建更新数据（只更新提供的字段）
      const updateData = {};
      if (nickname !== undefined && nickname !== null) {
        updateData.avatarName = nickname;
      }
      if (avatar !== undefined && avatar !== null) {
        updateData.avatar = avatar;
      }

      // 如果没有任何更新
      if (Object.keys(updateData).length === 0) {
        return { success: false, errMsg: '没有需要更新的数据' };
      }

      const updateRes = await db.collection('users').where({
        _openid: openid
      }).update({
        data: updateData
      });

      if (updateRes.stats.updated === 0) {
        return { success: false, errMsg: '用户不存在或更新失败' };
      }

      // 获取更新后的完整用户数据
      const userRes = await db.collection('users').where({
        _openid: openid
      }).field({
        avatarName: true,
        avatar: true,
        coins: true,
        netFee: true
      }).get();

      return {
        success: true,
        avatarName: userRes.data[0]?.avatarName || '用户',
        avatar: userRes.data[0]?.avatar || '👤'
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 📜 获取交易记录（扣费记录）
  if (type === 'getTransactionHistory') {
    try {
      const { limit = 20 } = event;

      const res = await db.collection('user_transactions')
        .where({
          _openid: openid
        })
        .orderBy('createTime', 'desc')
        .limit(limit)
        .get();

      return {
        success: true,
        records: res.data || []
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 📝 添加操作日志
  if (type === 'addLog') {
    try {
      const { action, target, details } = event;

      await db.collection('user_activity_logs').add({
        data: {
          _openid: openid,
          action: action,        // 操作类型：open, close, click等
          target: target,        // 操作对象：我的电脑、我的文档等
          details: details || '', // 操作详情
          createTime: db.serverDate()
        }
      });

      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 📖 获取操作日志
  if (type === 'getLogs') {
    try {
      const { limit = 100 } = event;

      const res = await db.collection('user_activity_logs')
        .where({
          _openid: openid
        })
        .orderBy('createTime', 'desc')
        .limit(limit)
        .get();

      return {
        success: true,
        logs: res.data || []
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  return { success: false, errMsg: 'Unknown type' };
};
