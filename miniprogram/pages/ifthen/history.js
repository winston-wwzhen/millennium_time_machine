// 导入结局数据
const endingsData = require('../../data/ifthen-endings.js');

Page({
  data: {
    // 统计数据
    stats: {
      totalEndings: 0,
      totalPlays: 0,
      unlockRate: 0,
      typeStats: {
        special: 0,
        good: 0,
        normal: 0,
        bad: 0
      }
    },

    // 历史记录
    historyList: [],
    page: 1,
    limit: 20,
    hasMore: true,
    loading: false,

    // 所有结局列表（用于展示收集进度）
    allEndings: [],
    unlockedEndings: new Set(),

    // 结局详情弹框
    showEndingDetail: false,
    selectedEnding: null,

    // 海报相关
    showPosterPreview: false,
    posterImageUrl: '',
    canvasContext: null
  },

  onLoad: function() {
    // 加载统计数据
    this.loadStats();

    // 加载历史记录
    this.loadHistory();

    // 初始化所有结局列表
    this.setData({
      allEndings: endingsData
    });
  },

  // 加载统计数据
  loadStats: function() {
    wx.cloud.callFunction({
      name: 'ifthen',
      data: {
        action: 'getEndingStats'
      }
    }).then(res => {
      if (res.result.success) {
        this.setData({
          stats: res.result.stats
        });

        // 构建已获得结局集合
        this.loadUnlockedEndings();
      }
    }).catch(err => {
      console.error('加载统计数据失败:', err);
    });
  },

  // 加载已获得的结局列表
  loadUnlockedEndings: function() {
    wx.cloud.callFunction({
      name: 'ifthen',
      data: {
        action: 'getEndingHistory',
        limit: 1000,
        page: 1
      }
    }).then(res => {
      if (res.result.success) {
        const unlockedSet = new Set();
        res.result.list.forEach(record => {
          unlockedSet.add(record.endingId);
        });

        this.setData({
          unlockedEndings: unlockedSet
        });
      }
    }).catch(err => {
      console.error('加载已获得结局失败:', err);
    });
  },

  // 加载历史记录
  loadHistory: function() {
    if (this.data.loading || !this.data.hasMore) {
      return;
    }

    this.setData({
      loading: true
    });

    wx.cloud.callFunction({
      name: 'ifthen',
      data: {
        action: 'getEndingHistory',
        limit: this.data.limit,
        page: this.data.page
      }
    }).then(res => {
      if (res.result.success) {
        const newList = res.result.list.map(record => {
          // 从结局数据中查找详细信息
          const ending = endingsData.find(e => e.id === record.endingId);
          return {
            ...record,
            endingInfo: ending || null
          };
        });

        this.setData({
          historyList: [...this.data.historyList, ...newList],
          page: this.data.page + 1,
          hasMore: newList.length >= this.data.limit,
          loading: false
        });
      }
    }).catch(err => {
      console.error('加载历史记录失败:', err);
      this.setData({
        loading: false
      });
    });
  },

  // 滚动到底部加载更多
  onReachBottom: function() {
    this.loadHistory();
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.setData({
      historyList: [],
      page: 1,
      hasMore: true
    });

    this.loadStats();
    this.loadHistory();

    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  // 查看结局详情
  viewEndingDetail: function(e) {
    const endingId = e.currentTarget.dataset.endingId;
    const ending = endingsData.find(e => e.id === endingId);

    if (ending) {
      this.setData({
        selectedEnding: ending,
        showEndingDetail: true
      });
    }
  },

  // 关闭结局详情弹框
  closeEndingDetail: function() {
    this.setData({
      showEndingDetail: false,
      selectedEnding: null
    });
  },

  // 关闭窗口（返回上一页）
  closeWindow: function() {
    wx.navigateBack({
      fail: () => {
        // 如果无法返回，跳转到开始页面
        wx.redirectTo({
          url: '/pages/ifthen/start'
        });
      }
    });
  },

  // 开始新游戏
  startNewGame: function() {
    wx.redirectTo({
      url: '/pages/ifthen/start'
    });
  },

  // 前往图鉴收集页面
  goToCollection: function() {
    wx.showToast({
      title: '图鉴功能开发中',
      icon: 'none'
    });
    // TODO: 创建图鉴页面
  },

  // 分享结局
  onShareAppMessage: function(e) {
    const { stats } = this.data;

    return {
      title: `我在千禧时光机已解锁${stats.totalEndings}个结局，完成度${stats.unlockRate}%！`,
      path: '/pages/ifthen/start',
      imageUrl: ''
    };
  },

  // ==================== 海报分享功能 ====================

  // 分享结局海报
  shareEndingPoster: function() {
    const { selectedEnding, stats } = this;

    if (!selectedEnding) {
      wx.showToast({
        title: '无法生成海报',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '生成中...',
      mask: true
    });

    this.generateEndingPoster(selectedEnding, stats);
  },

  // 生成结局海报
  generateEndingPoster: function(ending, stats) {
    const query = wx.createSelectorQuery();
    query.select('#posterCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) {
          wx.hideLoading();
          wx.showToast({
            title: '画布初始化失败',
            icon: 'none'
          });
          return;
        }

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');

        // 设置画布实际尺寸（2倍图用于清晰度）
        const dpr = wx.getSystemInfoSync().pixelRatio || 2;
        const canvasWidth = 375 * dpr;
        const canvasHeight = 600 * dpr;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        ctx.scale(dpr, dpr);

        // 绘制海报
        this.drawWin98Poster(ctx, ending, stats, canvas);
      });
  },

  // 绘制Win98风格海报
  drawWin98Poster: function(ctx, ending, stats, canvas) {
    const width = 375;
    const height = 600;

    // 背景 - Win98 灰色
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(0, 0, width, height);

    // 绘制Win98窗口边框效果
    this.drawWin98Border(ctx, 20, 30, 335, 540);

    // 标题栏
    ctx.fillStyle = '#000080';
    ctx.fillRect(20, 30, 335, 35);

    // 标题栏渐变效果
    const gradient = ctx.createLinearGradient(20, 30, 20, 65);
    gradient.addColorStop(0, '#000080');
    gradient.addColorStop(1, '#1084d0');
    ctx.fillStyle = gradient;
    ctx.fillRect(20, 30, 335, 35);

    // 标题文字
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px SimSun, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('如果当时.exe - 结局分享', 35, 53);

    // 关闭按钮
    this.drawWin98Button(ctx, 320, 38, 25, 20, '×', '#c0c0c0', '#000000');

    // 主体内容区域 - 白色背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(30, 75, 315, 480);

    // 结局图标
    ctx.font = '64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ending.icon || '📖', width / 2, 150);

    // 结局标题
    ctx.fillStyle = '#000080';
    ctx.font = 'bold 20px SimSun, sans-serif';
    ctx.fillText(ending.title, width / 2, 200);

    // 结局描述（自动换行）
    ctx.fillStyle = '#333333';
    ctx.font = '14px SimSun, sans-serif';
    this.wrapText(ctx, ending.description, 50, 240, 275, 22);

    // 结局类型标签
    const typeColors = {
      special: { bg: '#fff9c4', border: '#fbc02d', text: '#5c4a00' },
      good: { bg: '#c8e6c9', border: '#66bb6a', text: '#006400' },
      normal: { bg: '#e0e0e0', border: '#9e9e9e', text: '#666' },
      bad: { bg: '#ffcdd2', border: '#ef5350', text: '#8b0000' }
    };
    const typeColor = typeColors[ending.type] || typeColors.normal;

    ctx.fillStyle = typeColor.bg;
    ctx.fillRect(100, 320, 175, 30);
    ctx.strokeStyle = typeColor.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 320, 175, 30);

    ctx.fillStyle = typeColor.text;
    ctx.font = 'bold 14px SimSun, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ending.typeText || '普通结局', width / 2, 341);

    // 分割线
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 375);
    ctx.lineTo(335, 375);
    ctx.stroke();

    // 统计信息
    ctx.fillStyle = '#000080';
    ctx.font = 'bold 14px SimSun, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('📊 我的战绩', 50, 405);

    ctx.fillStyle = '#333333';
    ctx.font = '12px SimSun, sans-serif';
    ctx.fillText(`已解锁结局：${stats.totalEndings} 个`, 50, 430);
    ctx.fillText(`完成度：${stats.unlockRate}%`, 50, 450);
    ctx.fillText(`总游玩次数：${stats.totalPlays} 局`, 50, 470);

    // 底部提示
    ctx.fillStyle = '#666666';
    ctx.font = '11px SimSun, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('长按保存图片，分享你的故事', width / 2, 510);
    ctx.fillText('千禧时光机 - 重温2005年的青葱岁月', width / 2, 530);

    // 水印
    ctx.fillStyle = '#999999';
    ctx.font = '10px SimSun, sans-serif';
    ctx.fillText('© 2025 千禧时光机', width / 2, 555);

    // 导出为图片
    wx.canvasToTempFilePath({
      canvas: canvas,
      success: (res) => {
        wx.hideLoading();
        this.setData({
          posterImageUrl: res.tempFilePath,
          showPosterPreview: true
        });
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('导出图片失败:', err);
        wx.showToast({
          title: '生成失败',
          icon: 'none'
        });
      }
    });
  },

  // 绘制Win98边框效果
  drawWin98Border: function(ctx, x, y, width, height) {
    // 高光边
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, 2); // top
    ctx.fillRect(x, y, 2, height); // left

    // 阴影边
    ctx.fillStyle = '#808080';
    ctx.fillRect(x + width - 2, y, 2, height); // right
    ctx.fillRect(x, y + height - 2, width, 2); // bottom

    // 内阴影
    ctx.fillStyle = '#dfdfdf';
    ctx.fillRect(x + 2, y + 2, 2, 2);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(x + width - 4, y + height - 4, 2, 2);
  },

  // 绘制Win98按钮
  drawWin98Button: function(ctx, x, y, width, height, text, bgColor, textColor) {
    // 按钮边框
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, 1);
    ctx.fillRect(x, y, 1, height);

    ctx.fillStyle = '#808080';
    ctx.fillRect(x + width - 1, y, 1, height);
    ctx.fillRect(x, y + height - 1, width, 1);

    // 按钮背景
    ctx.fillStyle = bgColor;
    ctx.fillRect(x + 1, y + 1, width - 2, height - 2);

    // 按钮文字
    ctx.fillStyle = textColor;
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + width / 2, y + height / 2);
  },

  // 文字自动换行
  wrapText: function(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = text.split('');
    let line = '';
    let currentY = y;

    for (let i = 0; i < chars.length; i++) {
      const testLine = line + chars[i];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        line = chars[i];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  },

  // 关闭海报预览
  closePosterPreview: function() {
    this.setData({
      showPosterPreview: false,
      posterImageUrl: ''
    });
  },

  // 阻止事件冒泡
  stopPropagation: function() {
    // 空函数，仅用于阻止事件冒泡
  },

  // 保存海报到相册
  savePosterToAlbum: function() {
    const { posterImageUrl } = this.data;

    if (!posterImageUrl) {
      wx.showToast({
        title: '海报不存在',
        icon: 'none'
      });
      return;
    }

    // 请求相册权限
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              this.saveImage(posterImageUrl);
            },
            fail: () => {
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册权限',
                showCancel: false
              });
            }
          });
        } else {
          this.saveImage(posterImageUrl);
        }
      }
    });
  },

  // 保存图片逻辑
  saveImage: function(filePath) {
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: () => {
        wx.showToast({
          title: '已保存到相册',
          icon: 'success'
        });

        // 记录分享行为并奖励时光币
        this.recordShareAndReward();
      },
      fail: (err) => {
        console.error('保存失败:', err);
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    });
  },

  // 记录分享并奖励时光币
  recordShareAndReward: function() {
    const { selectedEnding } = this.data;

    wx.cloud.callFunction({
      name: 'user',
      data: {
        type: 'recordShare',
        shareType: 'ending',
        itemId: selectedEnding.id,
        currency: 'timecoin'  // 如果当时分享奖励时光币
      }
    }).then(res => {
      if (res.result.success) {
        const { reward, firstTimeShare, shareId } = res.result;

        if (firstTimeShare) {
          wx.showModal({
            title: '🎉 分享奖励',
            content: `首次分享获得 ${reward} 💎 时光币！\n\n分享链接已生成，好友访问可额外获得奖励！`,
            showCancel: false
          });
        }
      }
    }).catch(err => {
      console.error('记录分享失败:', err);
    });
  }
});
