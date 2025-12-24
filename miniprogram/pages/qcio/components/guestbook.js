/**
 * QCIO 空间 - 模拟留言板组件
 * 显示预设的"虚假"留言，不支持真实用户留言（规避 UGC 风险）
 */
Component({
  data: {
    // 预设留言数据（模拟数据）
    messages: [
      {
        nickname: '葬爱少主',
        avatar: '🎸',
        content: '路过踩踩，回踩哦~ ┈━═☆',
        time: '2分钟前'
      },
      {
        nickname: '泪之舞',
        avatar: '💃',
        content: '好伤感...o(╥﹏╥)o',
        time: '15分钟前'
      },
      {
        nickname: '孤独患者',
        avatar: '🌧️',
        content: '或许、寂寞就湜莪們菂共哘語... ﹏',
        time: '1小时前'
      },
      {
        nickname: '寂寞哥斯拉',
        avatar: '🦖',
        content: '踩罘踩？卟踩莪叒來ㄋ！哼~',
        time: '3小时前'
      },
      {
        nickname: '水晶之恋',
        avatar: '💎',
        content: '回访~ 空间接得挺好看的呢 o(^▽^)o',
        time: '昨天'
      },
      {
        nickname: '非主流王子',
        avatar: '🤴',
        content: '妳的天空、莪来守护！⭐',
        time: '昨天'
      },
      {
        nickname: '奶茶不加糖',
        avatar: '🧋',
        content: '路过~ 收录为好友',
        time: '2天前'
      },
      {
        nickname: '网络游侠',
        avatar: '🎮',
        content: 'Gank 一波就跑，真刺激',
        time: '3天前'
      }
    ]
  },

  methods: {
    // 刷新留言（随机重新排序，营造变化感）
    refreshMessages() {
      const shuffled = [...this.data.messages].sort(() => Math.random() - 0.5);
      this.setData({ messages: shuffled });
      wx.showToast({ title: '刷新成功', icon: 'success' });
    }
  }
});
