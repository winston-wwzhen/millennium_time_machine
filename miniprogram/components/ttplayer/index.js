// 十分动听 - 2005年风格音乐播放器组件
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
    // 播放状态
    playing: false,
    isLoading: false,
    currentTime: 0,
    duration: 234,
    progress: 0,
    volume: 75,
    mode: "loop",

    // Win98风格提示弹窗
    showWin98Dialog: false,
    win98DialogTitle: '',
    win98DialogMessage: '',

    // 怀旧弹窗
    showNostalgia: false,
    nostalgiaText: '',

    // 可视化波纹数据（静态，不动态更新）
    waveBars: [
      35, 52, 72, 88, 72, 52, 44, 61, 79, 88, 79, 61, 49, 72, 79, 88, 72, 52,
      44, 52, 49, 61, 72, 88, 79, 72, 52, 49, 61, 79, 88, 79, 72, 61, 52, 49,
      61, 72, 79, 88, 35, 52, 72, 88, 72, 52, 44, 61, 79, 88, 79, 61, 49, 72,
      79, 88, 72, 52, 44, 52, 49, 61, 72,
    ],

    // 当前曲目
    currentTrack: {
      id: 1,
      title: "童话",
      artist: "光良",
      album: "童话",
    },
    currentTrackIndex: 0,

    // 播放列表 - 来自D:\Music的珍藏歌单（24首）
    playlist: [
      // 2006金曲
      { id: 1, title: "童话", artist: "光良", album: "童话", duration: "3:54" },
      { id: 2, title: "七里香", artist: "周杰伦", album: "七里香", duration: "5:05" },
      { id: 3, title: "江南", artist: "林俊杰", album: "第二天堂", duration: "4:28" },
      { id: 4, title: "十年", artist: "陈奕迅", album: "黑·白·灰", duration: "3:52" },
      { id: 5, title: "隐形的翅膀", artist: "张韶涵", album: "潘朵拉", duration: "3:58" },
      { id: 6, title: "不想长大", artist: "S.H.E", album: "不想长大", duration: "4:15" },
      // 非主流必听
      { id: 7, title: "嘻唰唰", artist: "花儿乐队", album: "花龄盛会", duration: "3:32" },
      { id: 8, title: "睫毛弯弯", artist: "王心凌", album: "Cyndi With U", duration: "3:58" },
      { id: 9, title: "反转地球", artist: "潘玮柏", album: "反转地球", duration: "4:02" },
      { id: 10, title: "我们的爱", artist: "F.I.R", album: "飞儿乐团", duration: "4:38" },
      // 2006爆款
      { id: 11, title: "老鼠爱大米", artist: "杨臣刚", album: "老鼠爱大米", duration: "4:45" },
      { id: 12, title: "两只蝴蝶", artist: "庞龙", album: "两只蝴蝶", duration: "4:22" },
      { id: 13, title: "猪之歌", artist: "香香", album: "猪之歌", duration: "3:48" },
      { id: 14, title: "别说我的眼泪你无所谓", artist: "东来东往", album: "回到我身边", duration: "4:33" },
      { id: 15, title: "秋天不回来", artist: "王强", album: "秋天不回来", duration: "4:08" },
      { id: 16, title: "香水有毒", artist: "胡杨林", album: "香水有毒", duration: "3:52" },
      { id: 17, title: "求佛", artist: "誓言", album: "求佛", duration: "4:25" },
      { id: 18, title: "一万个理由", artist: "郑源", album: "一万个理由", duration: "4:38" },
      { id: 19, title: "你到底爱谁", artist: "刘嘉亮", album: "你到底爱谁", duration: "4:18" },
      { id: 20, title: "丁香花", artist: "唐磊", album: "丁香花", duration: "4:33" },
      { id: 21, title: "狼爱上羊", artist: "汤潮", album: "狼爱上羊", duration: "4:12" },
      { id: 22, title: "不想让你哭", artist: "王强", album: "不想让你哭", duration: "4:05" },
      { id: 23, title: "你是我的玫瑰花", artist: "庞龙", album: "你是我的玫瑰花", duration: "4:28" },
      { id: 24, title: "笔记", artist: "周笔畅", album: "谁动了我的琴弦", duration: "4:08" },
    ],

    // 状态文本
    statusText: "就绪 - 点击播放开始欣赏音乐",

    // z-index样式
    overlayStyle: "",

    // EQ相关
    showEQ: false,
    eqPreset: "default",
    eqBands: [
      { name: "60Hz", value: 0 },
      { name: "170Hz", value: 0 },
      { name: "310Hz", value: 0 },
      { name: "600Hz", value: 0 },
      { name: "1kHz", value: 0 },
      { name: "3kHz", value: 0 },
      { name: "6kHz", value: 0 },
      { name: "12kHz", value: 0 },
      { name: "14kHz", value: 0 },
      { name: "16kHz", value: 0 },
    ],

    // 窗口位置
    windowX: 0,
    windowY: 0,
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

      // 700rpx = 350px, 900rpx = 450px (rpx转px: 2rpx = 1px)
      const winWidth = 350;
      const winHeight = 450;

      this.setData({
        windowX: (windowWidth - winWidth) / 2,
        windowY: (windowHeight - winHeight) / 2 - 50,
      });
    },

    detached() {
      // 清理定时器
      if (this.playTimer) {
        clearInterval(this.playTimer);
      }
    },
  },

  methods: {
    // 播放/暂停
    onPlayPause: function () {
      // 先显示loading状态
      this.setData({
        isLoading: true,
      });

      // 模拟加载延迟后显示怀旧弹窗
      setTimeout(() => {
        // 随机选择一段怀旧文案
        const nostalgiaTexts = [
          `那时候，听歌要用十分动听。

MP3格式，一首歌只有3-5MB，音质虽然一般，但那份期待是真的。

下载要等几分钟，在QQ空间分享歌词，设为背景音乐，每个人进你空间都能听到。

有时候下载到一半断了，那种心情，现在的年轻人不会懂。

那些年，我们一边吐槽十分动听的广告，一边还是每天打开它，因为只有它，能播放我们想听的音乐。

现在音乐平台无处不在，无损音质随点随听，但再也没有那种分享的感动了。

致我们终将逝去的青春`,

          `那些年，听歌是一件很酷的事。

周杰伦的《七里香》，林俊杰的《江南》，光良的《童话》，孙燕姿的《遇见》...

每首歌都有回忆，每段回忆都有歌。

下课回家路上，戴着耳机，看着窗外的风景，耳机里是那一首循环播放的歌。

现在歌单里几千首歌，随机播放，但再也没有那种单曲循环的深情了。

回不去的听歌时光`,

          `那些年，QQ空间的背景音乐很重要。

把喜欢的歌设为背景音乐，别人访问你的空间就能听到，这是最流行的分享方式。

"七里香"放完了自动切到"江南"，然后是"童话"...

那时候QQ音乐还没这么强大，十分动听是我们装机必备的播放器。

现在QQ空间的背景音乐功能早就不在了，那些歌还在，但听歌的人变了。

那些年的QQ空间回忆`,

          `那时候，每个网吧的电脑里，都装着十分动听。

那些年，我们用它听过：《七里香》、《江南》、《童话》、《十年》、《隐形的翅膀》、《不想长大》、《睫毛弯弯》...

虽然是怀旧模拟，但那份回忆是真的。

现在十分动听已经不在了，那些音乐平台也换了一波又一波。

但每当我们听到这些老歌，就会想起那个戴着耳机听歌的年代。

那些年，十分动听陪伴的日子`,
        ];

        const randomText = nostalgiaTexts[Math.floor(Math.random() * nostalgiaTexts.length)];
        this.setData({
          isLoading: false,
          nostalgiaText: randomText,
          showNostalgia: true,
          statusText: "正在播放: " + this.data.currentTrack.title + " - " + this.data.currentTrack.artist,
        });
        this.startProgress();
      }, 2000);
    },

    // 关闭怀旧弹窗
    closeNostalgia: function() {
      this.setData({
        showNostalgia: false,
        nostalgiaText: ''
      });
    },

    // 显示Win98风格提示框
    showWin98Dialog: function(title, message) {
      this.setData({
        showWin98Dialog: true,
        win98DialogTitle: title,
        win98DialogMessage: message
      });
    },

    // 关闭Win98提示框
    closeWin98Dialog: function() {
      this.setData({
        showWin98Dialog: false,
        win98DialogTitle: '',
        win98DialogMessage: ''
      });
    },

    // 上一曲
    onPrev: function () {
      let newIndex = this.data.currentTrackIndex - 1;
      if (newIndex < 0) {
        newIndex = this.data.playlist.length - 1;
      }
      this.playTrack(newIndex);
    },

    // 下一曲
    onNext: function () {
      let newIndex = this.data.currentTrackIndex + 1;
      if (newIndex >= this.data.playlist.length) {
        newIndex = 0;
      }
      this.playTrack(newIndex);
    },

    // 播放指定曲目
    playTrack: function (index) {
      const track = this.data.playlist[index];
      this.setData({
        currentTrack: track,
        currentTrackIndex: index,
        currentTime: 0,
        progress: 0,
        statusText: `正在播放: ${track.title} - ${track.artist}`,
      });

      if (this.playTimer) {
        clearInterval(this.playTimer);
      }
      this.startProgress();
    },

    // 选择曲目
    onSelectTrack: function (e) {
      const index = e.currentTarget.dataset.index;
      this.playTrack(index);
    },

    // 启动进度更新
    startProgress: function () {
      this.playTimer = setInterval(() => {
        let currentTime = this.data.currentTime + 1;
        let progress = (currentTime / this.data.duration) * 100;

        if (currentTime >= this.data.duration) {
          this.onTrackEnd();
        } else {
          this.setData({
            currentTime: currentTime,
            progress: progress,
          });
        }
      }, 1000);
    },

    // 曲目结束处理
    onTrackEnd: function () {
      if (this.playTimer) {
        clearInterval(this.playTimer);
      }

      const mode = this.data.mode;

      if (mode === "single") {
        this.setData({ currentTime: 0, progress: 0 });
        this.startProgress();
      } else if (mode === "random") {
        const randomIndex = Math.floor(
          Math.random() * this.data.playlist.length
        );
        this.playTrack(randomIndex);
      } else {
        this.onNext();
      }
    },

    // 进度条拖动
    onSeek: function (e) {
      const query = this.createSelectorQuery();
      query.select(".progress-bar").boundingClientRect();
      query.exec((res) => {
        if (res[0]) {
          const x = e.detail.x - res[0].left;
          const percent = Math.max(0, Math.min(1, x / res[0].width));
          const currentTime = Math.floor(percent * this.data.duration);

          this.setData({
            currentTime: currentTime,
            progress: percent * 100,
          });
        }
      });
    },

    // 音量调节
    onVolumeChange: function (e) {
      this.setData({
        volume: e.detail.value,
        statusText: `音量: ${e.detail.value}%`,
      });
    },

    // 播放模式切换
    onModeChange: function (e) {
      const mode = e.currentTarget.dataset.mode;
      const modeNames = {
        loop: "列表循环",
        random: "随机播放",
        single: "单曲循环",
      };

      this.setData({
        mode: mode,
        statusText: `播放模式: ${modeNames[mode]}`,
      });
    },

    // 清空播放列表
    onClearList: function () {
      wx.showModal({
        title: "确认",
        content: "确定要清空播放列表吗？",
        success: (res) => {
          if (res.confirm) {
            this.setData({
              playlist: [],
              playing: false,
              statusText: "播放列表已清空",
            });

            if (this.playTimer) {
              clearInterval(this.playTimer);
            }
          }
        },
      });
    },

    // 显示EQ
    onShowEQ: function () {
      this.setData({ showEQ: true });
    },

    // 隐藏EQ
    onHideEQ: function () {
      this.setData({ showEQ: false });
    },

    // 阻止事件冒泡
    stopPropagation: function () {},

    // EQ预设
    onEQPreset: function (e) {
      const preset = e.currentTarget.dataset.preset;
      this.setData({ eqPreset: preset });

      const presets = {
        default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        pop: [-3, -1, 2, 4, 4, 2, 0, -1, -2, -3],
        rock: [5, 4, 2, 0, -1, 1, 3, 4, 5, 5],
        classical: [4, 3, 2, 1, 0, 0, 0, 1, 2, 3],
        jazz: [2, 1, 0, 1, 1, 0, 0, 1, 2, 3],
      };

      const bands = this.data.eqBands.map((band, index) => ({
        ...band,
        value: presets[preset][index],
      }));

      this.setData({ eqBands: bands });
    },

    // EQ频段调节
    onEQBandChange: function (e) {
      const index = e.currentTarget.dataset.index;
      const value = e.detail.value;
      const bands = this.data.eqBands;
      bands[index].value = value;
      this.setData({ eqBands: bands });
    },

    // 格式化时间
    formatTime: function (seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    },

    // 最小化
    onMinimize: function () {
      this.triggerEvent("close");
    },

    // 关闭
    onClose: function () {
      console.log("关闭按钮被点击");
      this.triggerEvent("close");
    },

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
  },
});
