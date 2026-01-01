// 慢播 - 2005年风格视频播放器组件（致敬快播）
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    zIndex: {
      type: Number,
      value: 2000,
    },
  },

  data: {
    showWarning: false,
    showNostalgia: false,
    isLoading: false,
    overlayStyle: "",
    // 窗口位置
    windowX: 0,
    windowY: 0,
    // 视频列表
    videoList: [],
    selectedVideoIndex: -1,
    // 当前播放的视频
    currentVideoImage: "",
    isVideoPlaying: false,
    currentVideoName: "",
    // 怀旧文案
    nostalgiaText: "",
  },

  observers: {
    zIndex: function (newVal) {
      this.setData({
        overlayStyle: `z-index: ${newVal};`
      });
    },
  },

  lifetimes: {
    attached() {
      // 计算初始窗口位置（居中）
      const systemInfo = wx.getSystemInfoSync();
      const windowWidth = systemInfo.windowWidth;
      const windowHeight = systemInfo.windowHeight;

      // 700rpx = 350px, 800rpx = 400px
      const winWidth = 350;
      const winHeight = 400;

      this.setData({
        windowX: (windowWidth - winWidth) / 2,
        windowY: (windowHeight - winHeight) / 2 - 50,
      });

      // 初始化视频列表
      this.initVideoList();
    },
  },

  methods: {
    // 关闭
    onClose: function () {
      this.triggerEvent("close");
    },

    // 隐藏警告
    onHideWarning: function () {
      this.setData({ showWarning: false });
    },

    // 隐藏怀念弹窗
    onHideNostalgia: function () {
      this.setData({ showNostalgia: false });
    },

    // 点击播放按钮
    onPlayClick: function () {
      // 防止重复点击
      if (this.data.isLoading) {
        return;
      }

      // 先显示loading状态
      this.setData({
        isLoading: true,
      });

      // 模拟加载延迟后显示怀旧弹窗
      setTimeout(() => {
        // 随机选择一段怀旧文案
        const nostalgiaTexts = [
          `那时候，看视频要用慢播。

rmvb格式，350MB就能看一部电影，画质虽然模糊，但那份期待是真的。

下载要等一整晚，上课时还在惦记着下载进度，回家第一件事就是打开电脑。

有时候下载到99%突然断了，那种心情，现在的年轻人不会懂。

那些年，我们一边吐槽慢播的弹窗广告，一边还是每天打开它，因为只有它，能播放我们想看的视频。

现在视频网站无处不在，4K高清随点随看，但再也没有那种等待的期待感了。

致我们终将逝去的青春`,

          `那些年，追剧是一件大事。

每周更新一集，在贴吧讨论剧情，猜测下一集会发生什么。

火影忍者追了十几年，死神、海贼王永远在更新，仙剑奇侠传的配乐现在还能哼出来。

武林外传的同福客栈，佟湘玉的白口、白展堂的葵花点穴手、吕秀才的"子曾经曰过"...那些台词，我们倒背如流。

现在会员可以一口气看完全集，但再也没有那种追更新的感觉了。

回不去的追剧时光`,

          `周星驰的《功夫》，"一支穿云箭，千军万马来相见"那句话成了当年最流行的梗。

陈凯歌的《无极》，被胡戈恶搞成"一个馒头引发的血案"，那些年，我们一边吐槽电影，一边看着恶搞视频笑到肚子痛。

张艺谋的《夜宴》、《满城尽带黄金甲》，章子怡的古装造型惊艳了多少人。

宁浩的《疯狂的石头》，小成本黑色幽默，成了当年的黑马。"道哥，你这是要让我当市长啊！"

那时候看电影，要么去电影院，要么在电脑上看盗版，虽然现在看来画质很差，但那份期待和兴奋，永远不会忘。

那些年的电影回忆`,

          `那时候，每个网吧的电脑里，都装着慢播。

那些年，我们用它看过：《火影忍者》、《死神》、《海贼王》、《武林外传》、《仙剑奇侠传》、《恶作剧之吻》、《功夫》、《无极》、《疯狂的石头》...

虽然画质模糊，虽然弹窗烦人，但那是我们青春的一部分。

现在慢播已经不在了，那些视频网站也换了一波又一波。

但每当我们看到rmvb这个格式，就会想起那个等待下载的年代。

那些年，慢播陪伴的日子`,
        ];

        const randomText = nostalgiaTexts[Math.floor(Math.random() * nostalgiaTexts.length)];
        this.setData({
          isLoading: false,
          nostalgiaText: randomText,
          showNostalgia: true,
        });
      }, 2000);
    },


    // 最小化
    onMinimize: function () {
      this.triggerEvent("close");
    },

    // 阻止事件冒泡
    stopPropagation: function () {},

    // 窗口拖动
    onDragStart: function (e) {
      this.dragStartX = e.touches[0].clientX;
      this.dragStartY = e.touches[0].clientY;
      this.startWindowX = this.data.windowX;
      this.startWindowY = this.data.windowY;
    },

    onDragMove: function (e) {
      const deltaX = e.touches[0].clientX - this.dragStartX;
      const deltaY = e.touches[0].clientY - this.dragStartY;

      this.setData({
        windowX: this.startWindowX + deltaX,
        windowY: this.startWindowY + deltaY,
      });
    },

    onDragEnd: function () {
      // 拖动结束
    },

    // 初始化视频列表
    initVideoList: function () {
      const baseUrl = "cloud://cloud1-4gvtpokae6f7dbab.636c-cloud1-4gvtpokae6f7dbab-1392774085/videos_image/";

      const videos = [
        // 动漫
        {
          name: "火影忍者_EP001.rmvb",
          category: "动漫",
          year: "2002",
          icon: "🎬",
          image: baseUrl + "火影忍者.jpg"
        },
        {
          name: "死神_EP001.rmvb",
          category: "动漫",
          year: "2004",
          icon: "🎬",
          image: baseUrl + "死神.jpg"
        },
        {
          name: "海贼王_EP001.rmvb",
          category: "动漫",
          year: "1999",
          icon: "🎬",
          image: baseUrl + "海贼王.jpg"
        },
        {
          name: "犬夜叉_EP001.avi",
          category: "动漫",
          year: "2000",
          icon: "🎬",
          image: baseUrl + "犬夜叉.jpg"
        },
        {
          name: "数码宝贝_EP001.rmvb",
          category: "动漫",
          year: "1999",
          icon: "🎬",
          image: baseUrl + "数码宝贝.jpg"
        },
        // 电视剧
        {
          name: "武林外传_EP01.rmvb",
          category: "电视剧",
          year: "2006",
          icon: "📺",
          image: baseUrl + "武林外传.jpg"
        },
        {
          name: "仙剑奇侠传_EP01.rmvb",
          category: "电视剧",
          year: "2005",
          icon: "📺",
          image: baseUrl + "仙剑奇侠传.jpg"
        },
        {
          name: "恶作剧之吻_EP01.rmvb",
          category: "电视剧",
          year: "2005",
          icon: "📺",
          image: baseUrl + "恶作剧之吻.jpg"
        },
        {
          name: "王子变青蛙_EP01.rmvb",
          category: "电视剧",
          year: "2005",
          icon: "📺",
          image: baseUrl + "王子变青蛙.jpg"
        },
        // 电影
        {
          name: "功夫.rmvb",
          category: "电影",
          year: "2004",
          icon: "🎥",
          image: baseUrl + "功夫.jpg"
        },
        {
          name: "无极.rmvb",
          category: "电影",
          year: "2005",
          icon: "🎥",
          image: baseUrl + "无极.jpg"
        },
        {
          name: "夜宴.rmvb",
          category: "电影",
          year: "2006",
          icon: "🎥",
          image: baseUrl + "夜宴.jpg"
        },
        {
          name: "满城尽带黄金甲.rmvb",
          category: "电影",
          year: "2006",
          icon: "🎥",
          image: baseUrl + "满城尽带黄金甲.jpg"
        },
        {
          name: "疯狂的石头.avi",
          category: "电影",
          year: "2006",
          icon: "🎥",
          image: baseUrl + "疯狂的石头.jpg"
        },
        // 学习资料
        {
          name: "日语入门_第1课.mp4",
          category: "学习资料",
          year: "2006",
          icon: "📚",
          image: baseUrl + "日语学习.jpg"
        },
        {
          name: "英语口语_第1课.mp4",
          category: "学习资料",
          year: "2006",
          icon: "📚",
          image: baseUrl + "英语学习.jpg"
        },
      ];

      this.setData({
        videoList: videos,
      });
    },

    // 点击视频卡片
    onVideoClick: function (e) {
      const index = e.currentTarget.dataset.index;
      const video = this.data.videoList[index];

      this.setData({
        selectedVideoIndex: index,
        currentVideoImage: video.image,
        isVideoPlaying: true,
        currentVideoName: video.name,
      });
    },

    // 停止播放
    onStopClick: function () {
      this.setData({
        isVideoPlaying: false,
        currentVideoImage: "",
        currentVideoName: "",
        selectedVideoIndex: -1,
      });
    },
  },
});
