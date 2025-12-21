Page({
  data: {
    tempImagePath: '', // 用户选的图片路径
    selectedBorderId: null,
    currentBorder: '', // 当前边框图片的URL
    currentFilter: '', // 当前滤镜类名
    
    borderList: [
      { 
        id: 0, 
        name: '原图', 
        src: '', 
        color: '#dddddd' // 缩略图边框颜色
      },
      { 
        id: 1, 
        name: '千禧甜心', 
        src: '/images/borders/border_y2k.png', 
        color: '#ff69b4' // 亮粉色
      },
      { 
        id: 2, 
        name: '暗黑赛博', 
        src: '/images/borders/border_cyber.png', 
        color: '#00ff00' // 荧光绿
      },
      { 
        id: 3, 
        name: 'Win98', 
        src: '/images/borders/border_win98.png', 
        color: '#000080' // 深蓝色
      },
      { 
        id: 4, 
        name: '电子包浆', 
        src: '/images/borders/border_noise.png', 
        color: '#808080' // 灰色
      }
    ]
  },

  onLoad() {
    // 可以在这里预加载素材
  },

  // 1. 选择/拍摄照片
  onChooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'front', // 默认前置，更有内味
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({
          tempImagePath: tempFilePath
        });
      }
    });
  },

  // 2. 切换边框
  onSelectBorder(e) {
    const { id, src } = e.currentTarget.dataset;
    this.setData({
      selectedBorderId: id,
      currentBorder: src
    });
  },

  // 3. 切换滤镜
  setFilter(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      currentFilter: type
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 4. 核心：合成并保存图片
  onSaveImage() {
    if (!this.data.tempImagePath) {
      wx.showToast({ title: '先选张照片呀!', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '正在冲印...' });

    const query = wx.createSelectorQuery();
    query.select('#photoCanvas')
      .fields({ node: true, size: true })
      .exec(async (res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');

        // 获取设备像素比
        const dpr = wx.getSystemInfoSync().pixelRatio;
        // 设定导出尺寸 (宽600足够复古，太高清反而没内味)
        const exportWidth = 600;
        const exportHeight = 800;
        
        canvas.width = exportWidth * dpr;
        canvas.height = exportHeight * dpr;
        ctx.scale(dpr, dpr);

        // A. 绘制白底
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, exportWidth, exportHeight);

        // B. 绘制用户照片 (模拟 aspectFill 裁剪模式)
        const img = canvas.createImage();
        img.src = this.data.tempImagePath;
        await new Promise((resolve) => { img.onload = resolve; });

        let sWidth = img.width;
        let sHeight = img.height;
        let sx = 0; let sy = 0;
        const ratio = exportWidth / exportHeight;
        
        // 计算裁剪参数
        if (sWidth / sHeight > ratio) {
          const newWidth = sHeight * ratio;
          sx = (sWidth - newWidth) / 2;
          sWidth = newWidth;
        } else {
          const newHeight = sWidth / ratio;
          sy = (sHeight - newHeight) / 2;
          sHeight = newHeight;
        }
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, exportWidth, exportHeight);

        // C. 核心升级：应用滤镜
        // 1. 电子包浆 (像素噪点)
        if (this.data.currentFilter === 'old-noise' || this.data.currentFilter === 'matrix-green') {
           // 如果是黑客风，也可以加一点点噪点增加质感
           this.addNoiseFilter(ctx, exportWidth, exportHeight, this.data.currentFilter === 'matrix-green' ? 20 : 60); 
        } 
        
        // 2. 颜色遮罩补充
        if (this.data.currentFilter === 'matrix-green') {
           ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
           ctx.fillRect(0, 0, exportWidth, exportHeight);
           // 画扫描线
           for(let i=0; i<exportHeight; i+=4) {
             ctx.fillStyle = 'rgba(0, 50, 0, 0.1)';
             ctx.fillRect(0, i, exportWidth, 2);
           }
        } else if (this.data.currentFilter === 'over-exposure') {
           ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
           ctx.fillRect(0, 0, exportWidth, exportHeight);
        }

        // D. 绘制边框 (使用你上传的 PNG 素材)
        if (this.data.currentBorder) {
             const borderImg = canvas.createImage();
             borderImg.src = this.data.currentBorder;
             await new Promise((resolve) => { 
               borderImg.onload = resolve; 
               borderImg.onerror = resolve; // 容错：加载失败也继续
             });
             ctx.drawImage(borderImg, 0, 0, exportWidth, exportHeight);
        }

        // E. 绘制水印 (防盗图必备)
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.shadowColor = 'rgba(0,0,0,0.8)'; 
        ctx.shadowBlur = 2;
        ctx.font = 'bold 18px "宋体"';
        ctx.fillText('© 2005 千禧时光机', exportWidth - 210, exportHeight - 20);
        ctx.shadowColor = 'transparent'; // 重置阴影

        // F. 导出并保存
        wx.canvasToTempFilePath({
          canvas,
          destWidth: exportWidth,
          destHeight: exportHeight,
          fileType: 'jpg',
          quality: 0.8, // 压缩一点质量，更有年代感
          success: (res) => {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                wx.hideLoading();
                wx.showToast({ title: '已保存到相册!', icon: 'success' });
              },
              fail: () => {
                wx.hideLoading();
                wx.showToast({ title: '保存失败或取消', icon: 'none' });
              }
            });
          }
        });
      });
  },

  // 新增：噪点生成算法 (强度可调)
  addNoiseFilter(ctx, width, height, intensity = 40) {
    // 获取画布像素数据
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // 遍历每个像素点
    for (let i = 0; i < data.length; i += 4) {
      // 生成随机灰度偏移值
      const noise = (Math.random() - 0.5) * intensity; 
      
      // 将噪点叠加到 RGB 通道
      data[i] = this.clamp(data[i] + noise);     // R
      data[i+1] = this.clamp(data[i+1] + noise); // G
      data[i+2] = this.clamp(data[i+2] + noise); // B
      // Alpha 通道保持不变
    }
    
    // 将处理后的数据放回画布
    ctx.putImageData(imageData, 0, 0);
  },

  // 辅助：限制颜色值在 0-255 之间
  clamp(value) {
    return Math.max(0, Math.min(255, value));
  },
});