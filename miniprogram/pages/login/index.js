// miniprogram/pages/login/index.js
const app = getApp();

Page({
  data: {
    username: 'Admin', // 默认显示的用户名
    isLoading: false
  },

  onLoad() {
    // 【可选】自动登录检查
    // 如果本地已经有用户信息，说明之前登录过，可以直接跳转到桌面
    // 为了保留“开机仪式感”，这里暂时注释掉。如果你想要自动登录，取消注释即可。
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      wx.reLaunch({ url: '/pages/index/index' });
    }
  },

  // 监听输入框：支持用户手动修改用户名
  onInputName(e) {
    this.setData({ username: e.detail.value });
  },

  // 🖱️ 点击 "OK" 按钮 (直接使用当前输入框的名字登录)
  onLogin() {
    this.handleLoginProcess(this.data.username);
  },

  // 💬 点击 "Log on with WeChat" (获取微信昵称并登录)
  async onWechatLogin() {
    if (this.data.isLoading) return;
    
    // 物理反馈：震动一下
    wx.vibrateShort();

    try {
      // 1. 弹出微信授权框获取用户信息
      // 注：在较新的微信基础库中，getUserProfile 可能返回“微信用户”和灰色头像
      // 但对于减少输入步骤来说，这依然是必要的交互
      const userProfile = await wx.getUserProfile({
        desc: '用于创建您的 Windows 用户档案'
      });
      
      const wechatNickName = userProfile.userInfo.nickName;
      
      // 2. 视觉反馈：将获取到的微信昵称自动填入输入框
      this.setData({ username: wechatNickName });

      // 3. 发起登录流程
      await this.handleLoginProcess(wechatNickName);

    } catch (err) {
      console.log('用户取消或拒绝授权:', err);
      // 用户取消授权，不做处理，停留在登录页即可
    }
  },

  // ⚙️ 核心登录逻辑封装 (复用)
  async handleLoginProcess(nickName) {
    // 简单校验
    if (!nickName) {
      wx.showToast({ title: 'User name required', icon: 'none' });
      return;
    }

    if (this.data.isLoading) return;
    this.setData({ isLoading: true });

    // 模拟系统读取硬盘的声音/震动
    wx.vibrateShort();

    try {
      // 调用我们写好的 'user' 云函数
      const res = await wx.cloud.callFunction({
        name: 'user',
        data: {
          type: 'login',
          userData: {
            username: nickName // 把昵称传给后端保存
          }
        }
      });

      if (res.result && res.result.success) {
        // --- 登录成功 ---
        
        // 1. 保存用户信息到本地缓存 (Storage)
        const userInfo = {
          openid: res.result.openid,
          username: nickName,
          loginTime: new Date().getTime()
        };
        wx.setStorageSync('userInfo', userInfo);

        // 2. 提示成功 (使用英文提示更符合 Win98 英文版风格)
        wx.showToast({ title: 'Access Granted', icon: 'none', duration: 1500 });
        
        // 3. 延迟 1.2秒 跳转，模拟进入桌面的加载过程
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/index/index', // 跳转到桌面
          });
        }, 1200);

      } else {
        // --- 业务失败 ---
        wx.showToast({ title: 'Login Error', icon: 'none' });
      }

    } catch (err) {
      // --- 网络或系统错误 ---
      console.error('云函数调用失败:', err);
      wx.showToast({ title: 'Network Error', icon: 'none' });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // 🖱️ 点击 "Cancel" (恶搞逻辑)
  onCancel() {
    wx.showToast({
      title: 'Logon failure: User not allowed to log on to this computer.',
      icon: 'none',
      duration: 3000
    });
  }
});