/**
 * QCIO 2006 完整业务逻辑
 * 状态持久化：通过云端数据库 isOnline 字段驱动登录态，实现多端同步
 */
const { preventDuplicateBehavior } = require('../../utils/prevent-duplicate');
const { isNetworkError, setNetworkDisconnected, showDisconnectDialog } = require('../../utils/network');
const { eggSystem, EGG_IDS } = require('../../utils/egg-system');
const { userApi, qcioApi, chatApi } = require('../../utils/api-client');
const { qcioContactsCache, qcioProfileCache } = require('../../utils/cache-manager');

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
    // 彩蛋达成状态
    qcioVisitorEggAchieved: false,

    // 注册表单数据
    registerForm: {
      qcio_id: '',        // 自动生成的 QCIO 号
      nickname: '',
      avatar: '👤'
    },

    // 头像选择列表
    avatarList: ['👤', '😊', '🤖', '👻', '🎭', '🦊', '🐱', '🐶', '🐼', '🐨', '🐯', '🦁', '🐸', '🐵', '🦄', '🐲'],

    // 用户个人资料模型
    userProfile: {
      qcio_id: '',
      nickname: '载入中...',
      signature: '',
      avatar: '👤',
      level: 1
    },
    growthIcons: [], // 成长值图标数组
    growthTitle: '', // 成长值称号
    growthInfo: null, // 完整成长值信息（从云函数获取）

    // 用户钱包数据
    wallet: {
      coins: 0,
      qpoints: 0,
      isVip: false
    },

    // 成长弹窗控制
    showGrowthUpDialog: false,
    growthUpData: null,

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

    // 等级详情弹窗
    showLevelInfo: false,

    // 头像选择弹窗
    showAvatarDialog: false,
    selectedAvatar: '',

    // 好友列表数据（从云端获取）
    contactGroups: [],

    // 彩蛋发现弹窗
    showEggDiscoveryDialog: false,
    eggDiscoveryData: {
      name: '',
      description: '',
      rarity: '',
      rarityName: '',
      rewardText: ''
    }
  },

  /**
   * 生命周期：加载页面时从云端同步状态
   */
  onLoad: function(options) {
    this.initAccountFromCloud();
    this.loadAIContacts();

    // 注册彩蛋发现回调
    this.eggCallbackKey = eggSystem.setEggDiscoveryCallback((config) => {
      const rarityNames = {
        common: '普通',
        rare: '稀有',
        epic: '史诗',
        legendary: '传说'
      };
      const reward = config.reward;
      const rewardText = reward.coins ? `+${reward.coins}时光币` : '';
      this.setData({
        showEggDiscoveryDialog: true,
        eggDiscoveryData: {
          name: config.name,
          description: config.description,
          rarity: config.rarity,
          rarityName: rarityNames[config.rarity],
          rewardText: rewardText
        }
      });
    });

    // 检查QCIO空间常客彩蛋
    this.checkQcioEgg();

    // 保存返回目标（用于登录/注册成功后跳转）
    if (options && options.visit) {
      this.setData({ returnToVisit: options.visit });
      // 移除自动踩一脚，让用户手动参与
    }
  },

  /**
   * 检查QCIO空间访问彩蛋（累计访问计数）- 使用 API 客户端
   */
  checkQcioEgg: async function() {
    // 先加载彩蛋系统数据
    await eggSystem.load();

    // 检查是否已经达成过
    if (eggSystem.isDiscovered(EGG_IDS.QCIO_SPACE_VISITOR)) {
      this.setData({ qcioVisitorEggAchieved: true });
      return;
    }

    // 调用云函数检查/更新计数
    try {
      const result = await userApi.checkQcioEgg();

      if (result && result.success) {
        const { shouldTrigger, alreadyAchieved } = result;

        if (alreadyAchieved) {
          this.setData({ qcioVisitorEggAchieved: true });
        } else if (shouldTrigger) {
          // 触发彩蛋
          await eggSystem.discover(EGG_IDS.QCIO_SPACE_VISITOR);
          this.setData({ qcioVisitorEggAchieved: true });
        }
      }
    } catch (e) {
      console.error('Check QCIO egg error:', e);
    }
  },

  /**
   * 从云端加载 AI 好友列表（使用 API 客户端和缓存）
   */
  loadAIContacts: async function() {
    // 尝试从缓存获取
    const cachedContacts = qcioContactsCache.get();
    if (cachedContacts) {
      this.setData({ contactGroups: cachedContacts });
      return;
    }

    // 缓存未命中，调用API
    try {
      const result = await qcioApi.getAIContacts();
      if (result && result.success) {
        const contactGroups = result.data;
        // 缓存联系人列表
        qcioContactsCache.set(contactGroups);
        this.setData({ contactGroups });
      }
    } catch (err) {
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
    }
  },

  /**
   * 处理通过分享链接访问（踩一踩）- 使用 API 客户端
   */
  handleVisitFromShare: async function(ownerQcioId) {
    try {
      const initResult = await qcioApi.init();
      if (initResult && initResult.success) {
        const myProfile = initResult.data;

        // 如果访问的是自己的空间，不需要记录
        if (myProfile.qcio_id !== ownerQcioId) {
          // 记录访问
          const recordResult = await qcioApi.recordVisit(
            myProfile.qcio_id,
            myProfile.nickname,
            ownerQcioId
          );
          if (recordResult && recordResult.success) {
            wx.showToast({ title: '踩了一脚！', icon: 'success' });
          }
        }
      }
    } catch (err) {
      console.error('Handle visit from share error:', err);
    }
  },

  /**
   * 从云端初始化账号并判断登录态（使用 API 客户端）
   */
  initAccountFromCloud: async function() {
    wx.showLoading({ title: '搜索基站信号...', mask: true });

    try {
      const result = await qcioApi.init();
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
          // 缓存用户资料
          qcioProfileCache.set(profile);

          this.setData({
            userProfile: profile,
            isLoggedIn: !!profile.isOnline,
            isLoadingAccount: false
          });
          this.calculateGrowthIcons(profile.level || 1);
          // 加载钱包数据
          this.loadWalletData();
          // 加载成长值信息
          this.loadGrowthInfo();
        }
      }
    } catch (err) {
      console.error('QCIO Init Cloud Error:', err);
      wx.showToast({ title: '由于网络故障拨号失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 生成 5 位随机 QCIO 号
   */
  generateQcioId: function() {
    return Math.floor(10000 + Math.random() * 90000).toString();
  },

  /**
   * 获取随机昵称
   * 2006年左右流行的网名风格
   */
  getRandomNickname: function() {
    const nicknames = [
      // ========== 情感思念类（最常见的类型）==========
      '寂寞在唱歌', '寂寞沙洲冷', '寂寞地铁', '寂寞如雪',
      '思念是一种病', '思念的滋味', '思念成海', '思念你的笑',
      '往事随风', '往事如烟', '往事只能回味', '往事清零',
      '回忆里的那个人', '回忆太痛', '回忆录', '回忆逝去的青春',
      '等待一场花开', '等待你的爱', '等待是一种痛', '等待幸福',
      '想你的夜', '想念你的365天', '想念是会呼吸的痛', '想念天堂',
      '错过', '错过的幸福', '错过的爱情', '错过的季节',
      '放手', '放手的勇气', '放手也是一种爱', '放手让你飞',
      '一个人的天荒地老', '一个人的冬天', '一个人的精彩', '一个人的浪漫',
      '眼泪知道', '眼泪成诗', '眼泪笑了', '眼泪为你流',
      '心如止水', '心碎的声音', '心痛的感觉', '心动的信号',

      // ========== 文艺诗意类 ==========
      '轻舞飞扬', '漫步云端', '云淡风轻', '云淡风清',
      '诗意人生', '诗意栖居', '诗和远方', '诗人与诗',
      '指尖流年', '指间沙', '指尖的幸福', '指尖温柔',
      '岁月静好', '岁月神偷', '岁月如歌', '岁月无情',
      '时光荏苒', '时光倒流', '时光不老', '时光隧道',
      '梦里花落', '梦里水乡', '梦里不知身是客', '梦醒时分',
      '清风徐来', '清风明月', '清风雅韵', '清风拂面',
      '烟花易冷', '烟花三月', '烟花散落', '烟花的季节',
      '半夏', '半生缘', '半糖主义', '半亩花田',

      // ========== 可爱甜美类 ==========
      '水晶之恋', '水晶鞋', '水晶天使', '水晶泡泡',
      '糖果屋', '糖果女孩', '糖果味的夏天', '糖果雨',
      '甜甜圈', '甜甜的微笑', '甜甜的你', '甜甜圈女孩',
      '小可爱', '小仙女', '小确幸', '小太阳',
      '萌萌哒', '萌萌小猫', '萌妹子', '萌宠时代',
      '粉色回忆', '粉色天空', '粉色心情', '粉色系',
      '棉花糖', '棉花糖女孩', '棉花糖云朵', '棉花糖味道',
      '柠檬草', '柠檬草的味道', '柠檬树', '柠檬黄',
      '彩虹糖', '彩虹妹妹', '彩虹桥', '彩虹之约',

      // ========== 励志向上类 ==========
      '阳光男孩', '阳光女孩', '阳光总在风雨后', '阳光灿烂',
      '追梦人', '追梦赤子心', '追梦的路上', '梦想起航',
      '永不言弃', '永不低头', '永不服输', '永远年轻',
      '相信自己', '相信未来', '相信爱情', '奇迹再现',
      '勇往直前', '勇敢的心', '勇敢做自己', '无畏前行',
      '奋斗不止', '奋斗青春', '奋斗的青春最美丽', '在路上',
      '执着', '执着的梦想', '执着的爱', '执迷不悟',

      // ========== 幽默谐趣类 ==========
      '快乐王子', '快乐每一天', '快乐小猪', '快乐老家',
      '笑看风云', '笑对人生', '笑脸迎人', '笑傲江湖',
      '逍遥派', '逍遥散人', '逍遥游', '逍遥自在',
      '简单爱', '简单生活', '简单幸福', '简单就好',
      '平凡之路', '平凡的幸福', '平凡的世界', '平凡的伟大',
      '懒洋洋', '懒猫', '懒猪猪', '懒洋洋的阳光',
      '吃货小分队', '吃货的人生', '吃货联盟', '快乐吃货',

      // ========== 数字英文类（当年很流行）==========
      '5201314', '520', '1314', '886',
      'KISS', 'LOVE', 'SMILE', 'DREAM',
      'Baby', 'Angel', 'Princess', 'Queen',
      'Boy', 'Girl', 'Hero', 'Star',

      // ========== 自然风景类 ==========
      '蓝色天空', '蓝色忧郁', '蓝色妖姬', '蓝色生死恋',
      '绿色心情', '绿光森林', '绿茶表', '绿野仙踪',
      '白色恋人', '白色圣诞节', '白色风车', '白开水',
      '黑色幽默', '黑猫警长', '黑夜给了我黑色眼睛', '黑玫瑰',
      '金色的梦', '金色年华', '金枝玉叶', '金色的麦浪',

      // ========== 少量非主流/葬爱风格（占比约10%）==========
      '葬爱族人', '葬爱少爺', '葬ぁ王者', '憂傷菂王子',
      '輕舞飛颺', '殤城蕥孓', '泪の天使', '暗夜幽灵',
      '残缺de美', '非主流', '火星文', '葬爱家族',

      // ========== 网络时代标签 ==========
      '90后', '千禧宝宝', 'Y2K一代', '网络游侠',
      '网恋', '网虫', '网页设计师', '网络安全员',
      '键盘手', '鼠标手', '屏幕守护者', '聊天狂人',

      // ========== 简短昵称（2-3字）==========
      '初心', '归零', '未央', '浅唱',
      '微凉', '微醺', '听风', '听雨',
      '念旧', '念你', '守望', '守候',
      '晨曦', '晨光', '暮色', '暮雪',

      // ========== 特殊风格 ==========
      '匿名用户', '路人甲', '过客', '访客',
      '未命名', '无名氏', '陌生人', '某某某',
      '我的地盘', '我的世界', '我做主', '我的天'
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
   * 提交注册（使用 API 客户端）
   */
  submitRegister: async function() {
    this._runWithLock('submitRegister', async () => {
      const { qcio_id, nickname, avatar } = this.data.registerForm;

      this.setData({ isRegistering: true });
      wx.showLoading({ title: '正在注册...', mask: true });

      try {
        const registerResult = await qcioApi.register(
          qcio_id,
          nickname.trim(),
          avatar
        );

        if (registerResult && registerResult.success) {
          // 注册成功，设置默认签名
          const defaultSignature = '承諾、絠什嚒用？還bùsんì洅見。';

          // 先设置签名，然后跳转到登录界面
          await qcioApi.updateProfile({ signature: defaultSignature });

          // 清除注册状态，显示登录界面
          this.setData({
            needsRegister: false,
            userProfile: registerResult.data
          });
          // 加载钱包数据
          this.loadWalletData();
          wx.showToast({ title: '注册成功！请登录', icon: 'success' });
        }
      } catch (err) {
        console.error('Register Error:', err);
        wx.showToast({ title: err.message || '注册失败', icon: 'none' });
      } finally {
        this.setData({ isRegistering: false });
        wx.hideLoading();
      }
    }, 3000); // 3秒防重复点击（注册涉及数据库操作）
  },

  /**
   * 计算QCIO风格成长值图标
   * 经典QCIO等级: 4星星=1月亮, 4月亮=1太阳
   */
  calculateGrowthIcons: function(level) {
    if (!level || level < 1) level = 1;

    // 计算太阳、月亮、星星数量
    const suns = Math.floor(level / 16);
    const moons = Math.floor((level % 16) / 4);
    const stars = level % 4;

    let icon = '';
    if (suns > 0) icon += '☼'.repeat(suns);
    if (moons > 0) icon += '☾'.repeat(moons);
    if (stars > 0) icon += '★'.repeat(stars);

    // 获取等级称号
    let title = '';
    if (level <= 4) title = '初入江湖';
    else if (level <= 8) title = '渐入佳境';
    else if (level <= 12) title = '声名鹊起';
    else if (level <= 16) title = '风云人物';
    else if (level <= 32) title = '一代宗师';
    else if (level <= 48) title = '登峰造极';
    else if (level <= 64) title = '传说级别';
    else title = '殿堂神话';

    this.setData({
      growthIcons: [icon],
      growthTitle: title
    });
  },

  /**
   * 从云函数加载完整成长值信息（使用 API 客户端）
   */
  loadGrowthInfo: async function() {
    try {
      const result = await qcioApi.getLevelInfo();
      if (result && result.success) {
        this.setData({ growthInfo: result.data });
      }
    } catch (err) {
      console.error('Load Growth Info Error:', err);
    }
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

          return qcioApi.login().then(result => {
            if (result && result.success) {
              wx.vibrateShort();
              this.setData({
                isLoggedIn: true,
                isLoggingIn: false,
                'userProfile.isOnline': true
              });
              // 登录成功后获取钱包数据
              this.loadWalletData();
              // 加载成长值信息
              this.loadGrowthInfo();

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
   * 确认注销（使用 API 客户端）
   */
  confirmLogout: async function() {
    this.setData({ showLogoutDialog: false });
    wx.showLoading({ title: '正在断开连接...', mask: true });

    try {
      const result = await qcioApi.logout();
      if (result && result.success) {
        this.setData({
          isLoggedIn: false,
          loginProgress: 0,
          'userProfile.isOnline': false,
          activeTab: 'contacts'
        });
        wx.showToast({ title: '已安全下线', icon: 'success' });
      }
    } catch (err) {
      console.error('Logout Sync Error:', err);
      wx.showToast({ title: '操作超时', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
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

      return chatApi.marsTranslate(content).then(result => {
        const marsText = result && result.content ? result.content : content;
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

      return qcioApi.updateProfile(data).then(result => {
        if (result && result.success) {
          this.setData({
            userProfile: result.data
          });
          this.calculateGrowthIcons(result.data.level);
          wx.showToast({ title: '同步成功', icon: 'success' });
        } else {
          // 检查是否是内容安全检测失败
          if (result && result.error === 'CONTENT_UNSAFE') {
            wx.showToast({ title: result.message || '内容违规，请修改', icon: 'none', duration: 2000 });
          } else {
            wx.showToast({ title: '保存失败', icon: 'none' });
          }
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

  // 跳转到农场
  goToFarm: function() {
    wx.navigateTo({
      url: '/pages/qcio/farm/index'
    });
  },

  /**
   * 从云端加载钱包数据
   */
  loadWalletData: function() {
    qcioApi.getWallet().then(result => {
      if (result && result.success) {
        this.setData({
          wallet: result.data || { coins: 0, qpoints: 0, isVip: false }
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
  },

  /**
   * 领取每日等级奖励
   */
  onClaimDailyReward: function() {
    this._runWithLock('onClaimDailyReward', () => {
      wx.showLoading({ title: '领取中...', mask: true });

      return qcioApi.claimDailyReward().then(result => {
        if (result && result.success) {
          const { coins, qpoints } = result;

          // 显示奖励领取成功提示
          let rewardMsg = '领取成功！';
          if (coins > 0) rewardMsg += ` 💰+${coins}`;
          if (qpoints > 0) rewardMsg += ` 💎+${qpoints}`;
          wx.showToast({ title: rewardMsg, icon: 'success' });

          // 更新钱包余额
          this.loadWalletData();

          // 更新等级信息（标记已领取）
          this.loadGrowthInfo();
        } else {
          throw new Error(result ? result.message : '领取失败');
        }
      }).catch(err => {
        console.error('Claim Daily Reward Error:', err);
        wx.showToast({ title: err.message || '领取失败', icon: 'none' });
      }).finally(() => {
        wx.hideLoading();
      });
    }, 2000);
  },

  /**
   * 获取经验（内部方法，供各功能调用）
   */
  addExperience: function(source, amount) {
    qcioApi.addExperience(source, amount).then(result => {
      if (result && result.success) {
        const { level_up, new_level, experience } = result;

        // 如果升级了，显示升级特效
        if (level_up) {
          this.showLevelUpEffect(new_level);
        }

        // 更新等级信息
        this.loadGrowthInfo();
      }
    }).catch(err => {
      console.error('Add Experience Error:', err);
    });
  },

  /**
   * 显示升级特效
   */
  showLevelUpEffect: function(newLevel) {
    // 判断升级类型
    let type = 'normal';
    if ([20, 30, 50].includes(newLevel)) {
      type = 'milestone';
    } else if (newLevel >= 13) {
      type = 'major';
    }

    // 使用震动反馈
    wx.vibrateShort();

    // 显示升级弹窗（如果有 growth-up-dialog 组件）
    this.setData({
      showGrowthUpDialog: true,
      growthUpData: {
        level: newLevel,
        type: type
      }
    });
  },

  /**
   * 关闭升级弹窗
   */
  closeGrowthUpDialog: function() {
    this.setData({
      showGrowthUpDialog: false,
      growthUpData: null
    });
  },

  /**
   * 显示等级详情
   */
  showLevelInfo: function() {
    // 确保有等级数据
    if (!this.data.growthInfo) {
      this.loadGrowthInfo();
    }
    this.setData({ showLevelInfo: true });
  },

  /**
   * 关闭等级详情
   */
  closeLevelInfo: function() {
    this.setData({ showLevelInfo: false });
  },

  /**
   * 关闭彩蛋发现弹窗
   */
  hideEggDiscoveryDialog: function() {
    this.setData({ showEggDiscoveryDialog: false });
  },

  /**
   * 打开头像选择弹窗
   */
  openAvatarDialog: function() {
    this.setData({
      showAvatarDialog: true,
      selectedAvatar: this.data.userProfile.avatar || '👤'
    });
  },

  /**
   * 关闭头像选择弹窗
   */
  closeAvatarDialog: function() {
    this.setData({
      showAvatarDialog: false,
      selectedAvatar: ''
    });
  },

  /**
   * 选择新头像
   */
  selectNewAvatar: function(e) {
    const avatar = e.currentTarget.dataset.avatar;
    this.setData({ selectedAvatar: avatar });
  },

  /**
   * 确认修改头像
   */
  confirmAvatarChange: function() {
    const newAvatar = this.data.selectedAvatar;

    if (!newAvatar) {
      wx.showToast({ title: '请选择头像', icon: 'none' });
      return;
    }

    this.closeAvatarDialog();

    // 调用云函数更新头像
    wx.showLoading({ title: '更新中...', mask: true });

    qcioApi.updateProfile({ avatar: newAvatar }).then(result => {
      if (result && result.success) {
        this.setData({
          userProfile: result.data
        });
        wx.showToast({ title: '头像已更新', icon: 'success' });
      } else {
        wx.showToast({ title: '更新失败', icon: 'none' });
      }
    }).catch(err => {
      console.error('Update Avatar Error:', err);
      wx.showToast({ title: '服务器未响应', icon: 'none' });
    }).finally(() => {
      wx.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (this.eggCallbackKey) {
      eggSystem.unregisterEggDiscoveryCallback(this.eggCallbackKey);
    }
  }
});