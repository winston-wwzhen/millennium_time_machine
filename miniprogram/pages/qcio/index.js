/**
 * QCIQ 2005 完整业务逻辑
 * 状态持久化：通过云端数据库 isOnline 字段驱动登录态，实现多端同步
 */
Page({
  data: {
    isLoggedIn: false,    // 是否已登录显示主面板
    isLoggingIn: false,   // 是否正在显示登录进度条
    isLoadingAccount: true, // 是否正在从云端拉取数据
    loginProgress: 0,     // 进度条百分比 (0-100)
    
    // 用户个人资料模型
    userProfile: {
      qcio_id: '',
      nickname: '载入中...',
      signature: '',
      avatar: '👤',
      level: 1
    },
    levelIcons: [], // 等级图标数组

    activeTab: 'contacts', // 当前选中的 Tab：contacts, chats, zone
    
    // 自定义 Win98 弹窗控制
    showDialog: false,
    dialogType: '', // 'nickname' 或 'signature'
    dialogTitle: '',
    dialogValue: '',

    // 预设的好友列表数据
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
  },

  /**
   * 生命周期：加载页面时从云端同步状态
   */
  onLoad: function() {
    this.initAccountFromCloud();
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
        
        // 核心持久化逻辑：如果云端 isOnline 为 true，则直接进入主面板
        this.setData({
          userProfile: profile,
          isLoggedIn: !!profile.isOnline, 
          isLoadingAccount: false
        });
        
        this.calculateLevelIcons(profile.level || 1);
      } else {
        throw new Error(result ? result.message : '初始化失败');
      }
    }).catch(err => {
      console.error('QCIQ Init Cloud Error:', err);
      wx.showToast({ title: '由于网络故障拨号失败', icon: 'none' });
    }).finally(() => {
      wx.hideLoading();
    });
  },

  /**
   * 计算星星月亮太阳图标：16级太阳，4级月亮，1级星星
   */
  calculateLevelIcons: function(level) {
    let icons = [];
    let lvl = level || 1;
    
    const suns = Math.floor(lvl / 16);
    lvl %= 16;
    const moons = Math.floor(lvl / 4);
    lvl %= 4;
    const stars = lvl;

    for (let i = 0; i < suns; i++) icons.push('☀️');
    for (let i = 0; i < moons; i++) icons.push('🌙');
    for (let i = 0; i < stars; i++) icons.push('⭐');

    this.setData({ levelIcons: icons });
  },

  /**
   * 模拟经典的拨号登录流程
   */
  doLogin: function() {
    if (this.data.isLoadingAccount || this.data.isLoggingIn) return;

    this.setData({ isLoggingIn: true, loginProgress: 0 });

    const timer = setInterval(() => {
      let progress = this.data.loginProgress + Math.floor(Math.random() * 20) + 5;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        
        wx.showLoading({ title: '正在获取好友列表...', mask: true });
        
        wx.cloud.callFunction({
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
  },

  /**
   * 注销账号：同步云端状态为“离线”
   */
  doLogout: function() {
    wx.showActionSheet({
      itemList: ['安全退出 QCIQ (断开连接)', '取消'],
      itemColor: '#FF0000',
      success: (res) => {
        if (res.tapIndex === 0) {
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
        }
      }
    });
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
    wx.showLoading({ title: '正在通过时空网关...', mask: true });
    
    wx.cloud.callFunction({
      name: 'chat',
      data: { mode: 'mars', content: content }
    }).then(res => {
      const marsText = res.result && res.result.content ? res.result.content : content;
      return this.saveProfileChanges({ signature: marsText });
    }).finally(() => wx.hideLoading());
  },

  saveProfileChanges: function(data) {
    wx.showLoading({ title: '数据同步中...', mask: true });
    
    wx.cloud.callFunction({
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
  },

  switchTab: function(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  toggleGroup: function(e) {
    const index = e.currentTarget.dataset.index;
    const key = `contactGroups[${index}].expanded`;
    this.setData({ [key]: !this.data.contactGroups[index].expanded });
  },

  openChat: function(e) {
    const contact = e.currentTarget.dataset.contact;
    wx.navigateTo({
      url: `/pages/chat/index?role=${contact.name}&id=${contact.id}`,
    });
  },

  goBack: function() {
    wx.navigateBack();
  }
});