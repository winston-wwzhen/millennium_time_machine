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

/**
 * 生成唯一分享ID
 * 格式：8位随机字符串（大写字母+数字）
 */
function generateShareId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去除易混淆字符 0OI1
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
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

        const userRes = await db.collection('users').add({
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

        // 记录新用户初始赠送网费交易
        await db.collection('user_transactions').add({
          data: {
            _openid: openid,
            type: 'exchange',
            description: '新用户赠送30天网费',
            amount: 43200,
            balanceAfter: 43200,
            createTime: db.serverDate()
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
      const currentNetFee = res.data[0].netFee || 0;

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

      // 记录网费增加交易
      await db.collection('user_transactions').add({
        data: {
          _openid: openid,
          type: 'exchange',
          currency: 'netfee',
          description: `时光币兑换网费 ${Math.ceil(amount / 1440)}天`,
          amount: netFeeToAdd,
          coinsUsed: coinsNeeded,
          balanceAfter: currentNetFee + netFeeToAdd,
          createTime: db.serverDate()
        }
      });

      // 记录时光币消耗交易
      await db.collection('user_transactions').add({
        data: {
          _openid: openid,
          type: 'exchange',
          currency: 'coins',
          description: `兑换网费消耗时光币`,
          coinsUsed: coinsNeeded,
          balanceAfter: currentCoins - coinsNeeded,
          createTime: db.serverDate()
        }
      });

      return {
        success: true,
        exchanged: amount,
        coinsDeducted: coinsNeeded,
        remainingCoins: currentCoins - coinsNeeded,
        newNetFee: currentNetFee + netFeeToAdd
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
      }).field({ badges: true, coins: true }).get();

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
      const currentCoins = userRes.data[0].coins || 0;

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

      // 添加时光币交易记录
      if (coinsReward > 0) {
        await db.collection('user_transactions').add({
          data: {
            _openid: openid,
            type: 'egg_reward',
            description: `发现彩蛋：${badgeName || eggId}`,
            coinsEarned: coinsReward,
            balanceAfter: currentCoins + coinsReward,
            metadata: {
              eggId: eggId,
              badgeName: badgeName
            },
            createTime: db.serverDate()
          }
        });
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

  // 🎁 记录分享并奖励
  if (type === 'recordShare') {
    try {
      const { shareType, itemId, currency } = event;

      // 检查用户是否已经分享过此内容
      const existingShare = await db.collection('user_shares')
        .where({
          _openid: openid,
          shareType: shareType,
          itemId: itemId
        })
        .get();

      const firstTimeShare = existingShare.data.length === 0;
      let shareId = '';

      // 定义奖励规则
      const REWARD_RULES = {
        timecoin: 500,   // 如果当时等应用分享奖励500时光币
        gold: 100        // QCIO分享奖励100金币
      };

      const reward = REWARD_RULES[currency] || REWARD_RULES.timecoin;

      if (firstTimeShare) {
        // 生成唯一分享ID（用于回流追踪）
        shareId = this.generateShareId();

        // 记录分享
        const addRes = await db.collection('user_shares').add({
          data: {
            _openid: openid,
            shareId: shareId,
            shareType: shareType,   // ending, qcio_space 等
            itemId: itemId,         // 结局ID、QCIO账号等
            currency: currency,     // timecoin 或 gold
            reward: reward,
            referralCount: 0,      // 回流计数
            createTime: db.serverDate()
          }
        });

        // 从返回结果中获取记录ID（如果生成失败则用记录ID作为shareId）
        if (!shareId || shareId === '') {
          shareId = addRes._id;
        }
      } else {
        // 已分享过，使用现有的shareId
        shareId = existingShare.data[0].shareId || existingShare.data[0]._id;
      }

      // 如果是首次分享，发放奖励
      if (firstTimeShare) {
        if (currency === 'timecoin') {
          // 奖励时光币
          await db.collection('users').where({
            _openid: openid
          }).update({
            data: {
              coins: _.inc(reward),
              lastUpdateTime: db.serverDate()
            }
          });
        } else if (currency === 'gold') {
          // 奖励金币 - 调用qcio云函数
          try {
            await cloud.callFunction({
              name: 'qcio',
              data: {
                action: 'addGold',
                amount: reward
              }
            });
          } catch (qcioErr) {
            console.error('奖励金币失败:', qcioErr);
          }
        }

        // 记录交易
        await db.collection('user_transactions').add({
          data: {
            _openid: openid,
            type: 'share_reward',
            description: `首次分享${shareType === 'ending' ? '结局' : '空间'}奖励`,
            amount: reward,
            currency: currency,
            balanceAfter: null, // 由前端刷新获取
            createTime: db.serverDate()
          }
        });

        return {
          success: true,
          reward: reward,
          currency: currency,
          firstTimeShare: true,
          shareId: shareId
        };
      }

      return {
        success: true,
        reward: 0,
        currency: currency,
        firstTimeShare: false,
        shareId: shareId
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 🔗 记录分享回流访问
  if (type === 'recordShareVisit') {
    try {
      const { shareId } = event;

      if (!shareId) {
        return { success: false, errMsg: '缺少分享ID' };
      }

      // 查找分享记录
      const shareRes = await db.collection('user_shares')
        .where({ shareId: shareId })
        .get();

      if (shareRes.data.length === 0) {
        return { success: false, errMsg: '分享记录不存在' };
      }

      const shareRecord = shareRes.data[0];

      // 防止同一用户重复计数（24小时内）
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const recentVisit = await db.collection('user_share_visits')
        .where({
          shareId: shareId,
          visitorOpenid: openid,
          visitTime: _.gte(today)
        })
        .get();

      const isDuplicateVisit = recentVisit.data.length > 0;

      // 记录访问
      await db.collection('user_share_visits').add({
        data: {
          shareId: shareId,
          sharerOpenid: shareRecord._openid,
          visitorOpenid: openid,
          shareType: shareRecord.shareType,
          isNewUser: !isDuplicateVisit,
          visitTime: db.serverDate()
        }
      });

      // 如果是新访问（非重复），更新分享者的回流计数
      let referralReward = 0;
      if (!isDuplicateVisit) {
        await db.collection('user_shares').doc(shareRecord._id).update({
          data: {
            referralCount: _.inc(1)
          }
        });

        // 每获得一个新访问，分享者获得额外奖励
        const REFERRAL_REWARDS = {
          timecoin: 100,  // 每个新访问奖励100时光币
          gold: 20        // 每个新访问奖励20金币
        };

        referralReward = REFERRAL_REWARDS[shareRecord.currency] || REFERRAL_REWARDS.timecoin;

        if (shareRecord.currency === 'timecoin') {
          await db.collection('users').where({
            _openid: shareRecord._openid
          }).update({
            data: {
              coins: _.inc(referralReward)
            }
          });
        } else if (shareRecord.currency === 'gold') {
          try {
            await cloud.callFunction({
              name: 'qcio',
              data: {
                action: 'addGold',
                amount: referralReward
              }
            });
          } catch (qcioErr) {
            console.error('奖励金币失败:', qcioErr);
          }
        }

        // 记录交易
        await db.collection('user_transactions').add({
          data: {
            _openid: shareRecord._openid,
            type: 'referral_reward',
            description: '分享回流奖励',
            amount: referralReward,
            currency: shareRecord.currency,
            shareId: shareId,
            createTime: db.serverDate()
          }
        });
      }

      return {
        success: true,
        isNewVisit: !isDuplicateVisit,
        referralReward: isDuplicateVisit ? 0 : referralReward,
        shareType: shareRecord.shareType
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 📖 获取如果当时偏好设置
  if (type === 'getIfthenPreferences') {
    try {
      const res = await db.collection('users').where({
        _openid: openid
      }).field({
        ifthenPreferences: true
      }).get();

      if (res.data.length === 0) {
        return { success: true, preferences: null };
      }

      return {
        success: true,
        preferences: res.data[0].ifthenPreferences || null
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 💾 保存如果当时偏好设置
  if (type === 'setIfthenPreferences') {
    try {
      const { birthYear, gender } = event;

      await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          'ifthenPreferences.birthYear': birthYear,
          'ifthenPreferences.gender': gender,
          lastUpdateTime: db.serverDate()
        }
      });

      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 💿 磁盘清理 - 每次清理都减少磁盘容量，但只有每天第一次获得时光币
  if (type === 'diskCleanup') {
    try {
      const userRes = await db.collection('users').where({
        _openid: openid
      }).field({
        coins: true,
        lastDiskCleanupDate: true,
        diskUsagePercent: true
      }).get();

      if (userRes.data.length === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      const user = userRes.data[0];
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const lastCleanupDate = user.lastDiskCleanupDate || '';

      // 检查今天是否已经清理过（用于奖励判断）
      const alreadyCleanedToday = lastCleanupDate === todayStr;

      // 计算新的磁盘容量：每次清理减少20-30%，但不低于60%
      const currentDiskUsage = user.diskUsagePercent || 99;
      const cleanupReduction = Math.floor(Math.random() * 11) + 20; // 20-30
      const newDiskUsage = Math.max(60, currentDiskUsage - cleanupReduction);

      // 检查是否需要减少磁盘容量
      const needsDiskReduction = newDiskUsage < currentDiskUsage;

      // 准备返回数据
      const result = {
        success: true,
        hasReward: false,
        diskUsage: {
          before: currentDiskUsage,
          after: newDiskUsage
        }
      };

      // 如果今天还没清理过，给予奖励
      if (!alreadyCleanedToday) {
        // 计算奖励：45-80随机时光币
        const tempFileReward = Math.floor(Math.random() * 21) + 30; // 30-50
        const cacheFileReward = Math.floor(Math.random() * 11) + 10; // 10-20
        const oldLogReward = Math.floor(Math.random() * 6) + 5; // 5-10
        const totalReward = tempFileReward + cacheFileReward + oldLogReward;

        // 更新用户数据（奖励 + 磁盘容量 + 日期）
        await db.collection('users').where({
          _openid: openid
        }).update({
          data: {
            coins: _.inc(totalReward),
            lastDiskCleanupDate: todayStr,
            diskUsagePercent: newDiskUsage,
            'eggStats.totalEarned': _.inc(totalReward),
            lastUpdateTime: db.serverDate()
          }
        });

        // 记录交易
        await db.collection('user_transactions').add({
          data: {
            _openid: openid,
            type: 'egg_reward',
            description: '磁盘清理奖励',
            coinsEarned: totalReward,
            balanceAfter: (user.coins || 0) + totalReward,
            metadata: {
              tempFiles: tempFileReward,
              cacheFiles: cacheFileReward,
              oldLogs: oldLogReward,
              diskUsageBefore: currentDiskUsage,
              diskUsageAfter: newDiskUsage
            },
            createTime: db.serverDate()
          }
        });

        result.hasReward = true;
        result.reward = totalReward;
        result.details = {
          tempFiles: tempFileReward,
          cacheFiles: cacheFileReward,
          oldLogs: oldLogReward
        };
      } else {
        // 今天已经清理过，只减少磁盘容量，不给奖励
        if (needsDiskReduction) {
          await db.collection('users').where({
            _openid: openid
          }).update({
            data: {
              diskUsagePercent: newDiskUsage,
              lastUpdateTime: db.serverDate()
            }
          });
        } else {
          // 磁盘容量已经是60%，无需减少
          result.diskUsage.after = currentDiskUsage;
          result.message = '磁盘容量已达到最低值(60%)，无法继续清理';
        }
      }

      return result;
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  // 📊 获取系统信息（用于系统属性弹窗）
  if (type === 'getSystemInfo') {
    try {
      const userRes = await db.collection('users').where({
        _openid: openid
      }).field({
        avatarName: true,
        avatar: true,
        coins: true,
        netFee: true,
        badges: true,
        eggStats: true,
        diskUsagePercent: true,
        lastDiskUpdateDate: true
      }).get();

      if (userRes.data.length === 0) {
        return { success: false, errMsg: '用户不存在' };
      }

      const user = userRes.data[0];

      // 处理动态磁盘容量：每天增加10%
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const lastUpdateDate = user.lastDiskUpdateDate || '';
      let diskUsagePercent = user.diskUsagePercent !== undefined ? user.diskUsagePercent : 99;
      let diskNeedsUpdate = false;

      // 如果是第一次或日期不同，增加10%
      if (lastUpdateDate !== todayStr) {
        diskUsagePercent = Math.min(99, diskUsagePercent + 10);
        diskNeedsUpdate = true;

        // 更新数据库中的磁盘容量和日期
        await db.collection('users').where({
          _openid: openid
        }).update({
          data: {
            diskUsagePercent: diskUsagePercent,
            lastDiskUpdateDate: todayStr
          }
        });
      }

      // 获取QCIO账户信息
      let qcioAccount = null;
      let qcioLevel = 0;
      let qcioGold = 0;

      try {
        const qcioRes = await db.collection('qcio_users').where({
          _openid: openid
        }).field({
          qcio_id: true,
          level: true,
          gold: true
        }).get();

        if (qcioRes.data.length > 0) {
          qcioAccount = qcioRes.data[0].qcio_id || null;
          qcioLevel = qcioRes.data[0].level || 0;
          qcioGold = qcioRes.data[0].gold || 0;
        }
      } catch (qcioErr) {
        console.error('获取QCIO信息失败:', qcioErr);
      }

      // 计算网费天数
      const netFeeMinutes = user.netFee || 0;
      const netFeeDays = Math.floor(netFeeMinutes / 1440);

      // 彩蛋进度
      const totalDiscovered = user.eggStats?.totalDiscovered || 0;
      const totalEggs = 32; // 总彩蛋数

      // 计算星星显示
      const starCount = Math.floor(qcioLevel / 5);
      const starsDisplay = '⭐'.repeat(starCount);

      return {
        success: true,
        systemInfo: {
          // 系统硬件信息（固定）
          cpu: 'Intel Pentium III 800MHz',
          memory: '128MB PC100 SDRAM',
          hardDrive: '20GB (C: 8GB / D: 12GB)',
          graphics: 'NVIDIA Riva TNT2 32MB',
          monitor: 'Philips 107S 17" CRT',
          cdrom: 'CD-ROM 48X',
          sound: 'Creative Sound Blaster Live',
          network: 'Realtek RTL8029 10M',
          floppy: '3.5英寸 1.44MB'
        },
        userInfo: {
          avatarName: user.avatarName || '千禧网友',
          qcioAccount: qcioAccount,
          level: qcioLevel,
          starsDisplay: starsDisplay,
          qpoints: qcioGold,
          netFeeDays: netFeeDays,
          coins: user.coins || 0,
          badges: user.badges || [],
          eggProgress: `${totalDiscovered}/${totalEggs}`
        },
        diskUsage: diskUsagePercent
      };
    } catch (e) {
      console.error(e);
      return { success: false, errMsg: e.message };
    }
  }

  return { success: false, errMsg: 'Unknown type' };
};
