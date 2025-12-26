/**
 * QCIO 2005 完整业务逻辑
 * 状态持久化：通过云端数据库 isOnline 字段驱动登录态，实现多端同步
 */
const { preventDuplicateBehavior } = require('../../utils/prevent-duplicate');
const { isNetworkError, setNetworkDisconnected, showDisconnectDialog } = require('../../utils/network');

Page({
  behaviors: [preventDuplicateBehavior],
  data: {
    isLoggedIn: false,    // 是否已登录显示主面板
    isRegistering: false, // 是否正在注册
    isLoggingIn: false,   // 是否正在显示登录进度条
    isLoadingAccount: true, // 是否正在从云端拉取数据
    loginProgress: 0,     // 进度条百分比 (0-100)
    needsRegister: false, // 是否需要注册
    returnToVisit: '',    // 登录后返回的踩一踩页面 owner_qcio_id

    // 注册表单数据
    registerForm: {
      qcio_id: '',        // 自动生成的 QCIO 号
      nickname: '',
      avatar: '👤'
    },

    // 头像选择列表
    avatarList: ['👤', '😊', '🤖', '👻'],

    // 用户个人资料模型
    userProfile: {
      qcio_id: '',
      nickname: '载入中...',
      signature: '',
      avatar: '👤',
      level: 1
    },
    levelIcons: [], // 等级图标数组
    levelTitle: '', // 等级称号
    levelInfo: null, // 完整等级信息（从云函数获取）

    // 用户钱包数据
    wallet: {
      coins: 0,
      qpoints: 0,
      isVip: false
    },

    // 升级弹窗控制
    showLevelUpDialog: false,
    levelUpData: null,

    activeTab: 'contacts', // 当前选中的 Tab：contacts, chats, zone
    zoneSubTab: 'home', // 空间Tab内的子Tab：home, log, msg

    // 自定义 Win98 弹窗控制
    showDialog: false,
    dialogType: '', // 'nickname' 或 'signature'
    dialogTitle: '',
    dialogValue: '',

    // 钱包信息弹窗
    showWalletInfo: false,

    // 注销确认弹窗
    showLogoutDialog: false,

    // 好友列表数据（从云端获取）
    contactGroups: []
  },

  /**
   * 生命周期：加载页面时从云端同步状态
   */
  onLoad: function(options) {
    this.initAccountFromCloud();
    this.loadAIContacts();

    // 保存返回目标（用于登录/注册成功后跳转）
    if (options && options.visit) {
      this.setData({ returnToVisit: options.visit });
      // 移除自动踩一脚，让用户手动参与
    }
  },

  /**
   * 从云端加载 AI 好友列表
   */
  loadAIContacts: function() {
    wx.cloud.callFunction({
      name: 'qcio',
      data: { action: 'getAIContacts' }
    }).then(res => {
      if (res.result && res.result.success) {
        this.setData({
          contactGroups: res.result.data
        });
      }
    }).catch(err => {
      console.error('Load AI Contacts Error:', err);
      // 如果云端加载失败，使用默认数据
      this.setData({
        contactGroups: [
          {
            name: '葬爱家族',
            expanded: true,
            onlineCount: 2,
            contacts: [
              { id: 1, name: '忧郁王子', avatar: '🤵', online: true, status: '莪，呮想靜靜。' },
              { id: 2, name: '轻舞飞扬', avatar: '💃', online: true, status: '網絡湜虛幻、但情湜真。' },
              { id: 3, name: '往事随风', avatar: '🚬', online: false, status: '儭，記得回踩哦！' }
            ]
          },
          {
            name: '陌生人',
            expanded: false,
            onlineCount: 1,
            contacts: [
              { id: 6, name: '水晶之恋', avatar: '💎', online: true, status: '遇見伱，湜莪這輩孒最渼、' }
            ]
          }
        ]
      });
    });
  },

  /**
   * 处理通过分享链接访问（踩一踩）
   */
  handleVisitFromShare: function(ownerQcioId) {
    wx.cloud.callFunction({
      name: 'qcio',
      data: {
        action: 'init'
      }
    }).then(res => {
      if (res.result && res.result.success) {
        const myProfile = res.result.data;

        // 如果访问的是自己的空间，不需要记录
        if (myProfile.qcio_id !== ownerQcioId) {
          // 记录访问
          wx.cloud.callFunction({
            name: 'qcio',
            data: {
              action: 'recordVisit',
              visitorId: myProfile.qcio_id,
              visitorName: myProfile.nickname,
              ownerQcioId: ownerQcioId
            }
          }).then(() => {
              wx.showToast({ title: '踩了一脚！', icon: 'success' });
            }).catch(err => {
              console.error('Record visit error:', err);
            });
        }
      }
    });
  },

  /**
   * 从云端初始化账号并判断登录态
   */
  initAccountFromCloud: function() {
    wx.showLoading({ title: '搜索基站信号...', mask: true });

    wx.cloud.callFunction({
      name: 'qcio',
      data: { action: 'init' }
    }).then(res => {
      const result = res.result;
      if (result && result.success) {
        const profile = result.data;

        // 判断是否需要注册（没有 qcio_id）
        if (!profile.qcio_id || profile.qcio_id === '') {
          // 生成新的 QCIO 号并显示注册界面
          const newQcioId = this.generateQcioId();
          const randomNickname = this.getRandomNickname();
          const randomAvatar = this.data.avatarList[Math.floor(Math.random() * this.data.avatarList.length)];

          this.setData({
            needsRegister: true,
            isLoadingAccount: false,
            registerForm: {
              qcio_id: newQcioId,
              nickname: randomNickname,
              avatar: randomAvatar
            }
          });
        } else {
          // 已注册，判断登录状态
          this.setData({
            userProfile: profile,
            isLoggedIn: !!profile.isOnline,
            isLoadingAccount: false
          });
          this.calculateLevelIcons(profile.level || 1);
          // 加载钱包数据
          this.loadWalletData();
          // 加载等级信息
          this.loadLevelInfo();
        }
      } else {
        throw new Error(result ? result.message : '初始化失败');
      }
    }).catch(err => {
      console.error('QCIO Init Cloud Error:', err);
      wx.showToast({ title: '由于网络故障拨号失败', icon: 'none' });
    }).finally(() => {
      wx.hideLoading();
    });
  },

  /**
   * 生成 5 位随机 QCIO 号
   */
  generateQcioId: function() {
    return Math.floor(10000 + Math.random() * 90000).toString();
  },

  /**
   * 获取随机昵称
   */
  getRandomNickname: function() {
    const nicknames = [
      '寂寞在唱歌', '轻舞飞扬', '往事随风', '水晶之恋',
      '忧郁王子', '葬爱族人', '非主流', '火星文',
      '网络游侠', '90后', '千禧宝宝', 'Y2K一代'
    ];
    return nicknames[Math.floor(Math.random() * nicknames.length)];
  },

  /**
   * 选择头像
   */
  selectAvatar: function(e) {
    const avatar = e.currentTarget.dataset.avatar;
    this.setData({
      'registerForm.avatar': avatar
    });
  },

  /**
   * 提交注册
   */
  submitRegister: function() {
    this._runWithLock('submitRegister', () => {
      const { qcio_id, nickname, avatar } = this.data.registerForm;

      this.setData({ isRegistering: true });
      wx.showLoading({ title: '正在注册...', mask: true });

      return wx.cloud.callFunction({
        name: 'qcio',
        data: {
          action: 'register',
          qcio_id: qcio_id,
          nickname: nickname.trim(),
          avatar: avatar
        }
      }).then(res => {
        if (res.result && res.result.success) {
          // 注册成功，设置默认签名
          const defaultSignature = '承諾、絠什嚒用？還bùsんì洅見。';

          // 先设置签名，然后跳转到登录界面
          return wx.cloud.callFunction({
            name: 'qcio',
            data: {
              action: 'updateProfile',
              data: { signature: defaultSignature }
            }
          }).then(() => {
            // 清除注册状态，显示登录界面
            this.setData({
              needsRegister: false,
              userProfile: res.result.data
            });
            // 加载钱包数据
            this.loadWalletData();
            wx.showToast({ title: '注册成功！请登录', icon: 'success' });
          });
        } else {
          throw new Error(res.result ? res.result.message : '注册失败');
        }
      }).catch(err => {
        console.error('Register Error:', err);
        wx.showToast({ title: err.message || '注册失败', icon: 'none' });
      }).finally(() => {
        this.setData({ isRegistering: false });
        wx.hideLoading();
      });
    }, 3000); // 3秒防重复点击（注册涉及数据库操作）
  },

  /**
   * 计算QQ风格等级图标
   * 1-4级: 星星 (★)
   * 5-8级: 月亮 (☾)
   * 9-12级: 太阳 (☼)
   * 13-16级: 皇冠 (♔)
   * 17+级: 皇冠+钻石 (♔♢)
   */
  calculateLevelIcons: function(level) {
    if (!level || level < 1) level = 1;

    let icon = '';
    let title = '';

    if (level <= 4) {
      icon = `${level}★`;
      title = '初入江湖';
    } else if (level <= 8) {
      icon = `${level - 4}☾`;
      title = '渐入佳境';
    } else if (level <= 12) {
      icon = `${level - 8}☼`;
      title = '声名鹊起';
    } else if (level <= 16) {
      icon = `${level - 12}♔`;
      title = '风云人物';
    } else {
      const crowns = Math.floor((level - 13) / 4) + 1;
      const diamonds = (level - 13) % 4;
      icon = diamonds > 0 ? `${crowns}♔${diamonds}♢` : `${crowns}♔`;

      if (level <= 20) title = '一代宗师';
      else if (level <= 30) title = '登峰造极';
      else if (level <= 50) title = '传说级别';
      else title = '殿堂神话';
    }

    this.setData({
      levelIcons: [icon],
      levelTitle: title
    });
  },

  /**
   * 从云函数加载完整等级信息
   */
  loadLevelInfo: function() {
    if (!this.data.userProfile.qcio_id) return;

    wx.cloud.callFunction({
      name: 'level',
      data: {
        action: 'getLevelInfo',
        qcio_id: this.data.userProfile.qcio_id
      }
    }).then(res => {
      if (res.result && res.result.level) {
        this.setData({
          levelInfo: res.result
        });
      }
    }).catch(err => {
      console.error('Load Level Info Error:', err);
    });
  },

  /**
   * 模拟经典的拨号登录流程
   */
  doLogin: function() {
    this._runWithLock('doLogin', () => {
      if (this.data.isLoadingAccount || this.data.isLoggingIn) return;

      this.setData({ isLoggingIn: true, loginProgress: 0 });

      const timer = setInterval(() => {
        let progress = this.data.loginProgress + Math.floor(Math.random() * 20) + 5;

        if (progress >= 100) {
          progress = 100;
          clearInterval(timer);

          wx.showLoading({ title: '正在获取好友列表...', mask: true });

          return wx.cloud.callFunction({
            name: 'qcio',
            data: { action: 'login' }
          }).then(res => {
            if (res.result && res.result.success) {
              wx.vibrateShort();
              this.setData({
                isLoggedIn: true,
                isLoggingIn: false,
                'userProfile.isOnline': true
              });
              // 登录成功后获取钱包数据
              this.loadWalletData();
              // 加载等级信息
              this.loadLevelInfo();

              // 检查是否需要返回踩一踩页面
              if (this.data.returnToVisit) {
                wx.redirectTo({
                  url: `/pages/qcio/visit?owner=${this.data.returnToVisit}`
                });
              }
            } else {
              throw new Error('云端同步失败');
            }
          }).catch(err => {
            console.error('Login Sync Error:', err);
            wx.showToast({ title: '登录同步失败', icon: 'none' });
            this.setData({ isLoggingIn: false });
          }).finally(() => {
            wx.hideLoading();
          });
        }

        this.setData({ loginProgress: progress });
      }, 150);
    }, 5000); // 5秒防重复点击（登录涉及进度条动画）
  },

  /**
   * 注销账号：同步云端状态为"离线"
   */
  doLogout: function() {
    // 显示自定义 Win98 风格确认弹窗
    this.setData({ showLogoutDialog: true });
  },

  /**
   * 确认注销
   */
  confirmLogout: function() {
    this.setData({ showLogoutDialog: false });
    wx.showLoading({ title: '正在断开连接...', mask: true });

    wx.cloud.callFunction({
      name: 'qcio',
      data: { action: 'logout' }
    }).then(res => {
      if (res.result && res.result.success) {
        this.setData({
          isLoggedIn: false,
          loginProgress: 0,
          'userProfile.isOnline': false,
          activeTab: 'contacts'
        });
        wx.showToast({ title: '已安全下线', icon: 'success' });
      }
    }).catch(err => {
      console.error('Logout Sync Error:', err);
      wx.showToast({ title: '操作超时', icon: 'none' });
    }).finally(() => {
      wx.hideLoading();
    });
  },

  /**
   * 取消注销
   */
  cancelLogout: function() {
    this.setData({ showLogoutDialog: false });
  },

  /**
   * 开启自定义修改对话框
   */
  openEditDialog: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      showDialog: true,
      dialogType: type,
      dialogTitle: type === 'nickname' ? '修改昵称 - User Name' : '编辑签名 - Signature',
      dialogValue: type === 'nickname' ? this.data.userProfile.nickname : ''
    });
  },

  onDialogInput: function(e) {
    this.setData({ dialogValue: e.detail.value });
  },

  closeDialog: function() {
    this.setData({ showDialog: false, dialogValue: '' });
  },

  confirmDialog: function() {
    const { dialogType, dialogValue } = this.data;
    if (!dialogValue.trim()) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }

    this.closeDialog();

    if (dialogType === 'nickname') {
      this.saveProfileChanges({ nickname: dialogValue });
    } else {
      this.translateAndSave(dialogValue);
    }
  },

  translateAndSave: function(content) {
    this._runWithLock('translateAndSave', () => {
      wx.showLoading({ title: '正在通过时空网关...', mask: true });

      return wx.cloud.callFunction({
        name: 'chat',
        data: { mode: 'mars', content: content }
      }).then(res => {
        const marsText = res.result && res.result.content ? res.result.content : content;
        return this.saveProfileChanges({ signature: marsText });
      }).catch(err => {
        // 检查是否是网络错误（429、超时等）
        if (isNetworkError(err)) {
          const reason = err?.message || '网络连接中断';
          setNetworkDisconnected(reason);

          wx.hideLoading();
          wx.showToast({ title: '网络连接中断', icon: 'none', duration: 1500 });

          // 延迟显示断网对话框
          setTimeout(() => {
            showDisconnectDialog(reason);
          }, 500);
        } else {
          throw err;
        }
      }).finally(() => wx.hideLoading());
    }, 3000); // 3秒防重复点击（涉及AI翻译）
  },

  saveProfileChanges: function(data) {
    this._runWithLock('saveProfileChanges', () => {
      wx.showLoading({ title: '数据同步中...', mask: true });

      return wx.cloud.callFunction({
        name: 'qcio',
        data: {
          action: 'updateProfile',
          data: data
        }
      }).then(res => {
        if (res.result && res.result.success) {
          this.setData({
            userProfile: res.result.data
          });
          this.calculateLevelIcons(res.result.data.level);
          wx.showToast({ title: '同步成功', icon: 'success' });
        } else {
          wx.showToast({ title: '保存失败', icon: 'none' });
        }
      }).catch(err => {
        console.error('Update Profile Error:', err);
        wx.showToast({ title: '服务器未响应', icon: 'none' });
      }).finally(() => {
        wx.hideLoading();
      });
    }, 2000); // 2秒防重复点击（数据同步操作）
  },

  switchTab: function(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  // 切换空间内部的子Tab
  switchZoneSubTab: function(e) {
    this.setData({ zoneSubTab: e.currentTarget.dataset.subtab });
  },

  toggleGroup: function(e) {
    const index = e.currentTarget.dataset.index;
    const key = `contactGroups[${index}].expanded`;
    this.setData({ [key]: !this.data.contactGroups[index].expanded });
  },

  openChat: function(e) {
    const contact = e.currentTarget.dataset.contact;
    // 跳转到 AI 聊天助手页面，传递联系人信息和用户头像
    const params = {
      name: contact.name,
      avatar: contact.avatar,
      mode: contact.chatMode || this.getChatMode(contact.name),
      myAvatar: this.data.userProfile.avatar || '👤'
    };
    if (contact.welcomeMessage) {
      params.welcomeMessage = contact.welcomeMessage;
    }

    // 手动构建 URL 参数
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');

    wx.navigateTo({
      url: `/pages/chat/index?${queryString}`,
    });
  },

  // 根据联系人名字获取聊天模式
  getChatMode: function(name) {
    const modeMap = {
      '轻舞飞扬': 'qingwu',
      '龙傲天': 'longaotian',
      '网管小哥': 'netadmin',
      '忧郁王子': 'qingwu',
      '往事随风': 'qingwu',
      '水晶之恋': 'chat'
    };
    return modeMap[name] || 'chat';
  },

  // 空间分享（踩一踩）
  onShareFromZone: function() {
    // 触发小程序分享
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 小程序分享配置
  onShareAppMessage: function() {
    return {
      title: `${this.data.userProfile.nickname} 邀请你踩空间`,
      path: `/pages/qcio/visit?owner=${this.data.userProfile.qcio_id}`,
      imageUrl: ''
    };
  },

  // 朋友圈分享
  onShareTimeline: function() {
    return {
      title: `${this.data.userProfile.nickname} 的 QCIO 空间`,
      query: `owner=${this.data.userProfile.qcio_id}`,
      imageUrl: ''
    };
  },

  goBack: function() {
    // 获取当前页面栈
    const pages = getCurrentPages();
    if (pages.length > 1) {
      // 有上一页，正常返回
      wx.navigateBack();
    } else {
      // 没有上一页，返回首页
      wx.reLaunch({
        url: '/pages/index/index'
      });
    }
  },

  /**
   * 从云端加载钱包数据
   */
  loadWalletData: function() {
    wx.cloud.callFunction({
      name: 'qcio',
      data: { action: 'getWallet' }
    }).then(res => {
      if (res.result && res.result.success) {
        this.setData({
          wallet: res.result.data || { coins: 0, qpoints: 0, isVip: false }
        });
      }
    }).catch(err => {
      console.error('Load Wallet Error:', err);
      // 保持默认钱包数据
    });
  },

  /**
   * 显示钱包信息弹窗
   */
  showWalletInfo: function() {
    this.setData({ showWalletInfo: true });
  },

  /**
   * 关闭钱包信息弹窗
   */
  closeWalletInfo: function() {
    this.setData({ showWalletInfo: false });
  },

  /**
   * 签到成功后刷新钱包
   */
  onCheckInSuccess: function(e) {
    const { reward, newCoinsBalance, newQpointsBalance } = e.detail;
    // 优先使用返回的新余额直接更新
    if (newCoinsBalance !== null && newCoinsBalance !== undefined) {
      this.setData({
        'wallet.coins': newCoinsBalance
      });
    }
    if (newQpointsBalance !== null && newQpointsBalance !== undefined) {
      this.setData({
        'wallet.qpoints': newQpointsBalance
      });
    }
    // 如果没有新余额，则重新加载
    if (newCoinsBalance === null && newQpointsBalance === null) {
      this.loadWalletData();
    }
  },

  /**
   * 日志发布成功后刷新钱包
   */
  onLogPublished: function(e) {
    const { reward, newBalance } = e.detail;
    // 如果有新余额，直接更新；否则重新加载
    if (newBalance !== null && newBalance !== undefined) {
      this.setData({
        'wallet.coins': newBalance
      });
    } else {
      this.loadWalletData();
    }
  }
});