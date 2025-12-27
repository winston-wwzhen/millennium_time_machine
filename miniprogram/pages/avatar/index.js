Page({
  data: {
    // 图片相关
    tempImagePath: '',
    selectedBorderId: 0,
    currentBorder: '',
    currentFilter: '',

    // 菜单状态
    openMenu: null,

    // 弹窗状态
    showDialog: null,

    // 贴纸拖拽状态
    draggingStickerIndex: -1,

    // 文字拖拽状态
    draggingTextIndex: -1,

    // 闪字拖拽状态
    draggingGlitter: false,

    // 照片拖拽状态
    photoOffsetX: 0,
    photoOffsetY: 0,
    photoScale: 1,
    draggingPhoto: false,
    photoStartX: 0,
    photoStartY: 0,
    photoOriginalOffsetX: 0,
    photoOriginalOffsetY: 0,
    // 照片实际渲染尺寸（用于保存时精确匹配）
    photoDisplayWidth: 0,
    photoDisplayHeight: 0,

    // 边框列表
    borderList: [
      { id: 0, name: '原图', src: '', color: '#dddddd' },
      { id: 1, name: '千禧甜心', src: '/images/borders/border_y2k.png', color: '#ff69b4' },
      { id: 2, name: '暗黑赛博', src: '/images/borders/border_cyber.png', color: '#00ff00' },
      { id: 3, name: 'Win98', src: '/images/borders/border_win98.png', color: '#000080' },
      { id: 4, name: '电子包浆', src: '/images/borders/border_noise.png', color: '#808080' }
    ],

    // 贴纸数据
    heartStickers: ['❤️', '💕', '💖', '💗', '💘', '💝', '💞', '💓'],
    starStickers: ['⭐', '🌟', '✨', '💫', '⚡', '🔥', '💎', '🌈'],
    crownStickers: ['👑', '🤴', '👸', '🎀', '🌸', '🦋', '🍀', '🌺'],
    ribbonStickers: ['🎀', '🎗️', '🎁', '🌟', '⭐', '💫', '✨', '🌸'],
    stickers: [],

    // 文字叠加数据
    textInput: '',
    textColor: '#ff0000',
    textSize: 24,
    textRotation: 0,
    textFont: 'SimSun',
    textOverlays: [],

    // 闪字数据
    glitterText: {
      text: '',
      x: 50,
      y: 50,
      size: 36,
      color: '#ff69b4'
    },

    // 日期水印数据
    showDateStamp: false,
    dateStampText: '2005/12/25',
    dateFormat: 'YYYY/MM/DD',
    dateStampColor: '#ff0000',
    dateStampPosition: 'top-right'
  },

  onLoad() {
    this.updateDateStampText();
  },

  // ==================== 菜单操作 ====================
  toggleMenu(e) {
    const menu = e.currentTarget.dataset.menu;
    const currentMenu = this.data.openMenu;

    if (currentMenu === menu) {
      this.setData({ openMenu: null });
    } else {
      this.setData({ openMenu: menu });
    }
  },

  // ==================== 弹窗管理 ====================
  openDialog(e) {
    const dialog = e.currentTarget.dataset.dialog;
    this.setData({ showDialog: dialog });
  },

  closeDialog() {
    this.setData({ showDialog: null });
  },

  stopPropagation() {
    // 阻止事件冒泡
  },

  preventTouchMove() {
    // 阻止照片拖拽时的页面滚动
    return false;
  },

  // ==================== 图片操作 ====================
  onChooseImage() {
    this.setData({ openMenu: null });
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'front',
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        // 重置照片位置
        this.setData({
          tempImagePath: tempFilePath,
          photoOffsetX: 0,
          photoOffsetY: 0,
          photoScale: 1
        }, () => {
          // 图片加载完成后，测量实际渲染尺寸
          setTimeout(() => {
            const query = wx.createSelectorQuery();
            query.select('.user-photo').boundingClientRect();
            query.exec((res) => {
              if (res && res[0]) {
                this.setData({
                  photoDisplayWidth: res[0].width,
                  photoDisplayHeight: res[0].height
                });
              }
            });
          }, 100);
        });
      }
    });
  },

  // 照片拖拽开始
  onPhotoTouchStart(e) {
    if (!this.data.tempImagePath) return;
    const touch = e.touches[0];
    this.setData({
      draggingPhoto: true,
      photoStartX: touch.clientX,
      photoStartY: touch.clientY,
      photoOriginalOffsetX: this.data.photoOffsetX,
      photoOriginalOffsetY: this.data.photoOffsetY
    });
  },

  // 照片拖拽移动
  onPhotoTouchMove(e) {
    if (!this.data.draggingPhoto) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.data.photoStartX;
    const deltaY = touch.clientY - this.data.photoStartY;
    this.setData({
      photoOffsetX: this.data.photoOriginalOffsetX + deltaX,
      photoOffsetY: this.data.photoOriginalOffsetY + deltaY
    });
  },

  // 照片拖拽结束
  onPhotoTouchEnd(e) {
    this.setData({
      draggingPhoto: false
    });
  },

  // ==================== 边框和滤镜 ====================
  onSelectBorder(e) {
    const { id, src } = e.currentTarget.dataset;
    this.setData({
      selectedBorderId: id,
      currentBorder: src
    });
  },

  setFilter(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      currentFilter: type
    });
  },

  // ==================== 贴纸操作 ====================
  addSticker(e) {
    const emoji = e.currentTarget.dataset.emoji;
    const stickers = this.data.stickers;

    // 随机位置和旋转
    const newSticker = {
      id: Date.now(),
      emoji: emoji,
      x: Math.random() * 60 + 20, // 20% - 80%
      y: Math.random() * 60 + 20,
      scale: 1,
      rotation: Math.random() * 30 - 15 // -15deg to 15deg
    };

    stickers.push(newSticker);
    this.setData({ stickers });
  },

  // 添加贴纸并关闭弹窗
  addStickerAndClose(e) {
    this.addSticker(e);
    this.setData({ showDialog: null });
  },

  // 贴纸拖拽开始
  onStickerTouchStart(e) {
    const index = e.currentTarget.dataset.index;
    const touch = e.touches[0];

    this.setData({
      draggingStickerIndex: index,
      stickerStartX: touch.clientX,
      stickerStartY: touch.clientY,
      stickerOriginalX: this.data.stickers[index].x,
      stickerOriginalY: this.data.stickers[index].y
    });
  },

  // 贴纸拖拽移动
  onStickerTouchMove(e) {
    if (this.data.draggingStickerIndex === -1) return;

    const touch = e.touches[0];
    const index = this.data.draggingStickerIndex;
    const stickers = this.data.stickers;

    // 获取预览区域的尺寸
    const query = wx.createSelectorQuery();
    query.select('.preview-area').boundingClientRect();
    query.exec((res) => {
      if (res && res[0]) {
        const previewRect = res[0];
        const deltaX = touch.clientX - this.data.stickerStartX;
        const deltaY = touch.clientY - this.data.stickerStartY;

        // 转换为百分比
        const deltaXPercent = (deltaX / previewRect.width) * 100;
        const deltaYPercent = (deltaY / previewRect.height) * 100;

        let newX = this.data.stickerOriginalX + deltaXPercent;
        let newY = this.data.stickerOriginalY + deltaYPercent;

        // 限制在预览区域内 (0% - 100%)
        newX = Math.max(0, Math.min(100, newX));
        newY = Math.max(0, Math.min(100, newY));

        stickers[index].x = newX;
        stickers[index].y = newY;

        this.setData({ stickers });
      }
    });
  },

  // 贴纸拖拽结束
  onStickerTouchEnd(e) {
    this.setData({
      draggingStickerIndex: -1
    });
  },

  removeSticker(e) {
    const index = e.currentTarget.dataset.index;
    const stickers = this.data.stickers;
    stickers.splice(index, 1);
    this.setData({ stickers });
  },

  // ==================== 文字叠加操作 ====================
  onTextInput(e) {
    this.setData({
      textInput: e.detail.value
    });
  },

  setTextColor(e) {
    this.setData({
      textColor: e.currentTarget.dataset.color
    });
  },

  onTextSizeChange(e) {
    this.setData({
      textSize: e.detail.value
    });
  },

  onTextRotationChange(e) {
    this.setData({
      textRotation: e.detail.value
    });
  },

  setTextFont(e) {
    this.setData({
      textFont: e.currentTarget.dataset.font
    });
  },

  addTextOverlay() {
    if (!this.data.textInput.trim()) {
      wx.showToast({
        title: '请输入文字',
        icon: 'none'
      });
      return;
    }

    const textOverlays = this.data.textOverlays;
    const newText = {
      id: Date.now(),
      text: this.data.textInput,
      x: Math.random() * 40 + 30,
      y: Math.random() * 40 + 30,
      color: this.data.textColor,
      size: this.data.textSize,
      rotation: this.data.textRotation,
      font: this.data.textFont
    };

    textOverlays.push(newText);
    this.setData({
      textOverlays,
      textInput: ''
    });

    wx.showToast({
      title: '文字已添加',
      icon: 'success'
    });
  },

  // 添加文字并关闭弹窗
  addTextOverlayAndClose() {
    if (!this.data.textInput.trim()) {
      wx.showToast({
        title: '请输入文字',
        icon: 'none'
      });
      return;
    }
    this.addTextOverlay();
    this.setData({ showDialog: null });
  },

  // 文字拖拽开始
  onTextTouchStart(e) {
    const index = e.currentTarget.dataset.index;
    const touch = e.touches[0];

    this.setData({
      draggingTextIndex: index,
      textStartX: touch.clientX,
      textStartY: touch.clientY,
      textOriginalX: this.data.textOverlays[index].x,
      textOriginalY: this.data.textOverlays[index].y
    });
  },

  // 文字拖拽移动
  onTextTouchMove(e) {
    if (this.data.draggingTextIndex === -1) return;

    const touch = e.touches[0];
    const index = this.data.draggingTextIndex;
    const textOverlays = this.data.textOverlays;

    const query = wx.createSelectorQuery();
    query.select('.preview-area').boundingClientRect();
    query.exec((res) => {
      if (res && res[0]) {
        const previewRect = res[0];
        const deltaX = touch.clientX - this.data.textStartX;
        const deltaY = touch.clientY - this.data.textStartY;

        const deltaXPercent = (deltaX / previewRect.width) * 100;
        const deltaYPercent = (deltaY / previewRect.height) * 100;

        let newX = this.data.textOriginalX + deltaXPercent;
        let newY = this.data.textOriginalY + deltaYPercent;

        newX = Math.max(0, Math.min(100, newX));
        newY = Math.max(0, Math.min(100, newY));

        textOverlays[index].x = newX;
        textOverlays[index].y = newY;

        this.setData({ textOverlays });
      }
    });
  },

  // 文字拖拽结束
  onTextTouchEnd(e) {
    this.setData({
      draggingTextIndex: -1
    });
  },

  removeTextOverlay(e) {
    const index = e.currentTarget.dataset.index;
    const textOverlays = this.data.textOverlays;
    textOverlays.splice(index, 1);
    this.setData({ textOverlays });
  },

  // ==================== 闪字操作 ====================
  onGlitterTextInput(e) {
    this.setData({
      'glitterText.text': e.detail.value
    });
  },

  setGlitterColor(e) {
    this.setData({
      'glitterText.color': e.currentTarget.dataset.color
    });
  },

  onGlitterSizeChange(e) {
    this.setData({
      'glitterText.size': e.detail.value
    });
  },

  applyGlitterText() {
    if (!this.data.glitterText.text) {
      wx.showToast({
        title: '请输入闪字内容',
        icon: 'none'
      });
      return;
    }

    // 随机位置
    this.setData({
      'glitterText.x': Math.random() * 40 + 30,
      'glitterText.y': Math.random() * 40 + 30
    });

    wx.showToast({
      title: '闪字已应用',
      icon: 'success'
    });
  },

  // 应用闪字并关闭弹窗
  applyGlitterTextAndClose() {
    if (!this.data.glitterText.text) {
      wx.showToast({
        title: '请输入闪字内容',
        icon: 'none'
      });
      return;
    }
    this.applyGlitterText();
    this.setData({ showDialog: null });
  },

  // 闪字拖拽开始
  onGlitterTouchStart(e) {
    const touch = e.touches[0];

    this.setData({
      draggingGlitter: true,
      glitterStartX: touch.clientX,
      glitterStartY: touch.clientY,
      glitterOriginalX: this.data.glitterText.x,
      glitterOriginalY: this.data.glitterText.y
    });
  },

  // 闪字拖拽移动
  onGlitterTouchMove(e) {
    if (!this.data.draggingGlitter) return;

    const touch = e.touches[0];

    const query = wx.createSelectorQuery();
    query.select('.preview-area').boundingClientRect();
    query.exec((res) => {
      if (res && res[0]) {
        const previewRect = res[0];
        const deltaX = touch.clientX - this.data.glitterStartX;
        const deltaY = touch.clientY - this.data.glitterStartY;

        const deltaXPercent = (deltaX / previewRect.width) * 100;
        const deltaYPercent = (deltaY / previewRect.height) * 100;

        let newX = this.data.glitterOriginalX + deltaXPercent;
        let newY = this.data.glitterOriginalY + deltaYPercent;

        newX = Math.max(0, Math.min(100, newX));
        newY = Math.max(0, Math.min(100, newY));

        this.setData({
          'glitterText.x': newX,
          'glitterText.y': newY
        });
      }
    });
  },

  // 闪字拖拽结束
  onGlitterTouchEnd(e) {
    this.setData({
      draggingGlitter: false
    });
  },

  // ==================== 日期水印操作 ====================
  updateDateStampText() {
    const now = new Date();
    let format = this.data.dateFormat;

    // 固定为2005年，符合千禧时光机主题
    let year = 2005;
    let month = String(now.getMonth() + 1).padStart(2, '0');
    let day = String(now.getDate()).padStart(2, '0');

    let dateStr = format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);

    this.setData({
      dateStampText: dateStr
    });
  },

  setDateFormat(e) {
    const format = e.currentTarget.dataset.format;
    this.setData({ dateFormat: format }, () => {
      this.updateDateStampText();
    });
  },

  setDateStampColor(e) {
    this.setData({
      dateStampColor: e.currentTarget.dataset.color
    });
  },

  setDateStampPosition(e) {
    this.setData({
      dateStampPosition: e.currentTarget.dataset.position
    });
  },

  toggleDateStamp() {
    this.setData({
      showDateStamp: !this.data.showDateStamp
    });
  },

  // ==================== 清除效果 ====================
  clearAllEffects() {
    this.setData({
      selectedBorderId: 0,
      currentBorder: '',
      currentFilter: '',
      stickers: [],
      textOverlays: [],
      glitterText: {
        text: '',
        x: 50,
        y: 50,
        size: 36,
        color: '#ff69b4'
      },
      showDateStamp: false
    });

    wx.showToast({
      title: '已清除所有效果',
      icon: 'success'
    });
  },

  // ==================== 分享图片 ====================
  onShareImage() {
    this.setData({ openMenu: null });
    wx.showToast({
      title: '分享功能开发中...',
      icon: 'none'
    });
  },

  // ==================== 保存图片 ====================
  onSaveImage() {
    this.setData({ openMenu: null });

    if (!this.data.tempImagePath) {
      wx.showToast({
        title: '先选张照片呀!',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '正在冲印...' });

    // 先获取预览区域实际尺寸
    const previewQuery = wx.createSelectorQuery();
    previewQuery.select('.preview-area').boundingClientRect();
    previewQuery.exec(async (previewRes) => {
      if (!previewRes || !previewRes[0]) {
        wx.hideLoading();
        wx.showToast({ title: '获取预览区域失败', icon: 'none' });
        return;
      }

      const previewRect = previewRes[0];
      // 使用包含 border 的完整尺寸作为计算基准
      // CSS 百分比定位和拖拽都是基于这个尺寸
      const dpr = wx.getSystemInfoSync().pixelRatio;
      const exportWidth = previewRect.width;
      const exportHeight = previewRect.height;

      const canvasQuery = wx.createSelectorQuery();
      canvasQuery.select('#photoCanvas')
        .fields({ node: true, size: true })
        .exec(async (res) => {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');

          // Canvas 包含 border，与 CSS 渲染区域保持一致
          canvas.width = exportWidth;
          canvas.height = exportHeight;

          // A. 绘制黑底（预览区域背景）
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, exportWidth, exportHeight);

          // B. 绘制用户照片（应用偏移量）
          // 使用实际测量尺寸，确保与显示完全一致
          const img = canvas.createImage();
          img.src = this.data.tempImagePath;
          await new Promise((resolve) => { img.onload = resolve; });

          // 使用实际测量的渲染尺寸（如果有的话），否则回退到计算值
          let drawWidth, drawHeight;
          if (this.data.photoDisplayWidth > 0 && this.data.photoDisplayHeight > 0) {
            // 使用实际测量尺寸
            drawWidth = this.data.photoDisplayWidth;
            drawHeight = this.data.photoDisplayHeight;
          } else {
            // 回退：计算照片绘制参数
            const imgRatio = img.width / img.height;
            drawWidth = exportWidth;
            drawHeight = drawWidth / imgRatio;
          }

          // widthFix模式是顶部对齐（左上角），不需要额外偏移
          const baseX = 0;
          const baseY = 0;

          // Canvas使用完整previewRect尺寸（包含border），与CSS百分比定位基准一致
          // 因此所有元素不需要额外的border偏移量
          const offsetX = 0;
          const offsetY = 0;

          // 应用用户拖拽偏移
          const finalX = baseX + this.data.photoOffsetX;
          const finalY = baseY + this.data.photoOffsetY;

          // 绘制照片 - 超出canvas的部分会自动被裁剪
          ctx.drawImage(img, finalX, finalY, drawWidth, drawHeight);

          // C. 应用滤镜效果
          if (this.data.currentFilter === 'old-noise' || this.data.currentFilter === 'matrix-green') {
            this.addNoiseFilter(ctx, exportWidth, exportHeight, this.data.currentFilter === 'matrix-green' ? 20 : 60);
          }

          if (this.data.currentFilter === 'sepia') {
            this.applySepiaFilter(ctx, exportWidth, exportHeight);
          } else if (this.data.currentFilter === 'matrix-green') {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.15)';
            ctx.fillRect(0, 0, exportWidth, exportHeight);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            for (let i = 0; i < exportHeight; i += 4) {
              ctx.fillRect(0, i, exportWidth, 2);
            }
          } else if (this.data.currentFilter === 'over-exposure') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.fillRect(0, 0, exportWidth, exportHeight);
          } else if (this.data.currentFilter === 'cold') {
            ctx.fillStyle = 'rgba(0, 100, 255, 0.15)';
            ctx.fillRect(0, 0, exportWidth, exportHeight);
            ctx.shadowColor = 'rgba(0, 100, 255, 0.3)';
            ctx.shadowBlur = 25;
            ctx.shadowInset = true;
            ctx.fillRect(0, 0, exportWidth, exportHeight);
            ctx.shadowInset = false;
          } else if (this.data.currentFilter === 'warm') {
            ctx.fillStyle = 'rgba(255, 100, 0, 0.15)';
            ctx.fillRect(0, 0, exportWidth, exportHeight);
            ctx.shadowColor = 'rgba(255, 100, 0, 0.3)';
            ctx.shadowBlur = 25;
            ctx.shadowInset = true;
            ctx.fillRect(0, 0, exportWidth, exportHeight);
            ctx.shadowInset = false;
          } else if (this.data.currentFilter === 'blur') {
            ctx.filter = 'blur(2px)';
            ctx.drawImage(canvas, 0, 0, exportWidth, exportHeight, 0, 0, exportWidth, exportHeight);
            ctx.filter = 'none';
          }

          // D. 绘制边框
          if (this.data.currentBorder) {
            const borderImg = canvas.createImage();
            borderImg.src = this.data.currentBorder;
            await new Promise((resolve) => {
              borderImg.onload = resolve;
              borderImg.onerror = resolve;
            });
            // 边框从内容区域开始绘制
            ctx.drawImage(borderImg, offsetX, offsetY, exportWidth, exportHeight);
          }

          // E. 绘制贴纸
          for (const sticker of this.data.stickers) {
            ctx.save();
            // 使用 Math.round 消除浮点数误差，加上 border 偏移
            const x = Math.round((sticker.x / 100) * exportWidth) + offsetX;
            const y = Math.round((sticker.y / 100) * exportHeight) + offsetY;
            ctx.translate(x, y);
            ctx.rotate((sticker.rotation * Math.PI) / 180);
            ctx.scale(sticker.scale, sticker.scale);
            ctx.font = '32px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillText(sticker.emoji, 0, 0);
            ctx.restore();
          }

          // F. 绘制文字叠加
          for (const text of this.data.textOverlays) {
            ctx.save();
            const x = Math.round((text.x / 100) * exportWidth) + offsetX;
            const y = Math.round((text.y / 100) * exportHeight) + offsetY;
            ctx.translate(x, y);
            ctx.rotate((text.rotation * Math.PI) / 180);
            ctx.font = `bold ${text.size}px ${text.font}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = text.color;
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillText(text.text, 0, 0);
            ctx.restore();
          }

          // G. 绘制闪字
          if (this.data.glitterText.text) {
            ctx.save();
            const x = Math.round((this.data.glitterText.x / 100) * exportWidth) + offsetX;
            const y = Math.round((this.data.glitterText.y / 100) * exportHeight) + offsetY;
            ctx.translate(x, y);
            ctx.font = `bold ${this.data.glitterText.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // 闪字效果 - 多层阴影
            ctx.fillStyle = this.data.glitterText.color;
            ctx.shadowColor = this.data.glitterText.color;
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillText(this.data.glitterText.text, 0, 0);

            ctx.shadowBlur = 10;
            ctx.fillText(this.data.glitterText.text, 0, 0);

            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 5;
            ctx.fillText(this.data.glitterText.text, 0, 0);

            ctx.restore();
          }

          // H. 绘制日期水印
          if (this.data.showDateStamp) {
            ctx.save();
            ctx.font = 'bold 14px "Courier New", monospace';
            ctx.fillStyle = this.data.dateStampColor;
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;

            let x, y;
            const padding = 10;
            if (this.data.dateStampPosition === 'top-right') {
              x = exportWidth - padding;
              y = padding;
              ctx.textAlign = 'right';
              ctx.textBaseline = 'top';
            } else if (this.data.dateStampPosition === 'bottom-right') {
              x = exportWidth - padding;
              y = exportHeight - padding;
              ctx.textAlign = 'right';
              ctx.textBaseline = 'bottom';
            } else {
              x = padding;
              y = exportHeight - padding;
              ctx.textAlign = 'left';
              ctx.textBaseline = 'bottom';
            }

            ctx.fillText(this.data.dateStampText, x, y);
            ctx.restore();
          }

          // I. 导出并保存
          wx.canvasToTempFilePath({
            canvas,
            destWidth: exportWidth,
            destHeight: exportHeight,
            fileType: 'jpg',
            quality: 0.92,
            success: async (res) => {
              // 先保存到相册
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: async () => {
                  // 同时上传到云存储
                  try {
                    const cloudPath = `user-photos/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
                    const uploadRes = await wx.cloud.uploadFile({
                      cloudPath: cloudPath,
                      filePath: res.tempFilePath
                    });

                    const fileID = uploadRes.fileID;

                    // 保存照片记录到数据库
                    await wx.cloud.callFunction({
                      name: 'user-photos',
                      data: {
                        type: 'savePhoto',
                        photoData: {
                          cloudPath: cloudPath,
                          fileID: fileID
                        }
                      }
                    });

                    wx.hideLoading();
                    wx.showToast({
                      title: '已保存到相册和云盘!',
                      icon: 'success'
                    });
                  } catch (err) {
                    console.error('上传云存储失败:', err);
                    // 云存储失败不影响相册保存
                    wx.hideLoading();
                    wx.showToast({
                      title: '已保存到相册!',
                      icon: 'success'
                    });
                  }
                },
                fail: () => {
                  wx.hideLoading();
                  wx.showToast({
                    title: '保存失败或取消',
                    icon: 'none'
                  });
                }
              });
            },
            fail: (err) => {
              wx.hideLoading();
              wx.showToast({
                title: '生成图片失败',
                icon: 'none'
              });
              console.error('Canvas export failed:', err);
            }
          });
        });
    });
  },

  // 噪点滤镜
  addNoiseFilter(ctx, width, height, intensity = 40) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * intensity;
      data[i] = this.clamp(data[i] + noise);
      data[i + 1] = this.clamp(data[i + 1] + noise);
      data[i + 2] = this.clamp(data[i + 2] + noise);
    }

    ctx.putImageData(imageData, 0, 0);
  },

  // 怀旧滤镜
  applySepiaFilter(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
      data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
      data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    }

    ctx.putImageData(imageData, 0, 0);
  },

  clamp(value) {
    return Math.max(0, Math.min(255, value));
  },

  // 返回
  goBack() {
    wx.navigateBack();
  }
});
