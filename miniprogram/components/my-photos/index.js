// 我的图片组件
Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  data: {
    photos: [],
    loading: true
  },

  observers: {
    'show': function(newVal) {
      if (newVal) {
        this.loadPhotos();
      }
    }
  },

  methods: {
    onClose: function() {
      this.triggerEvent('close');
    },

    stopPropagation: function() {
      // 阻止事件冒泡
    },

    // 加载照片列表
    loadPhotos: async function() {
      this.setData({ loading: true });

      try {
        const res = await wx.cloud.callFunction({
          name: 'user-photos',
          data: {
            type: 'getPhotos',
            limit: 100
          }
        });

        if (res.result.success) {
          // 格式化日期
          const photos = res.result.photos.map(photo => {
            const date = new Date(photo.createTime);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            return {
              ...photo,
              dateStr: dateStr
            };
          });

          this.setData({
            photos: photos,
            loading: false
          });
        } else {
          this.setData({ loading: false });
        }
      } catch (e) {
        console.error('加载照片失败:', e);
        this.setData({ loading: false });
      }
    }
  }
});
