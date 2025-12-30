// 十分动听 - 2005年风格音乐播放器组件
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    // 播放状态
    playing: false,
    isLoading: false, // loading状态
    loadingClickCount: 0, // loading时点击次数
    currentTime: 0,
    duration: 234,
    progress: 0,
    volume: 75,
    mode: "loop",

    // Win98风格提示弹窗
    showWin98Dialog: false,
    win98DialogTitle: '',
    win98DialogMessage: '',

    // 可视化波纹数据
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

    // 播放列表
    playlist: [
      { id: 1, title: "童话", artist: "光良", album: "童话", duration: "3:54" },
      {
        id: 2,
        title: "第一次爱的人",
        artist: "王心凌",
        album: "Cyndi With U",
        duration: "4:12",
      },
      {
        id: 3,
        title: "孤单北半球",
        artist: "欧得洋",
        album: "孤单北半球",
        duration: "4:23",
      },
      {
        id: 4,
        title: "江南",
        artist: "林俊杰",
        album: "第二天堂",
        duration: "4:28",
      },
      {
        id: 5,
        title: "七里香",
        artist: "周杰伦",
        album: "七里香",
        duration: "5:05",
      },
      {
        id: 6,
        title: "波斯猫",
        artist: "S.H.E",
        album: "奇幻旅程",
        duration: "3:45",
      },
      {
        id: 7,
        title: "倔强",
        artist: "五月天",
        album: "时光机",
        duration: "4:21",
      },
      {
        id: 8,
        title: "我们的爱",
        artist: "F.I.R",
        album: "飞儿乐团",
        duration: "4:38",
      },
      {
        id: 9,
        title: "Take Me To Your Heart",
        artist: "Michael Learns To Rock",
        album: "Take Me To Your Heart",
        duration: "3:56",
      },
      {
        id: 10,
        title: "老鼠爱大米",
        artist: "王启文",
        album: "老鼠爱大米",
        duration: "4:18",
      },
      {
        id: 11,
        title: "丁香花",
        artist: "唐磊",
        album: "丁香花",
        duration: "4:33",
      },
      {
        id: 12,
        title: "十年",
        artist: "陈奕迅",
        album: "黑·白·灰",
        duration: "3:52",
      },
    ],

    // 状态文本
    statusText: "就绪 - 点击播放开始欣赏音乐",

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
      if (this.loadingTimer) {
        clearTimeout(this.loadingTimer);
      }
    },
  },

  methods: {
    // 播放/暂停
    onPlayPause: function () {
      // 如果正在loading，增加点击计数
      if (this.data.isLoading) {
        this.setData({
          loadingClickCount: this.data.loadingClickCount + 1
        });

        // 超过3次点击，显示温馨提示
        if (this.data.loadingClickCount >= 3) {
          this.showWin98Dialog(
            '温馨提示',
            '音乐正在努力加载中...\n\n（其实真正播放功能还在开发中）\n\n那个笨蛋程序员正在拼命加班写代码呢~\n\n请再耐心等待一下下吧！'
          );
          // 重置计数
          this.setData({ loadingClickCount: 0 });
        }
        return;
      }

      const playing = !this.data.playing;

      if (playing) {
        // 清除之前的loading计时器（如果有）
        if (this.loadingTimer) {
          clearTimeout(this.loadingTimer);
          this.loadingTimer = null;
        }

        // 显示loading状态
        this.setData({
          isLoading: true,
          loadingClickCount: 0,
          statusText: "正在加载音乐...",
        });

        // 模拟加载延迟（1.5秒后开始播放）
        this.loadingTimer = setTimeout(() => {
          // 确保回调执行时组件仍然处于loading状态（防止组件被销毁等边缘情况）
          if (this.data && this.data.isLoading) {
            this.setData({
              isLoading: false,
              playing: true,
              statusText: `正在播放: ${this.data.currentTrack.title} - ${this.data.currentTrack.artist}`,
            });
            this.startProgress();
          }
          this.loadingTimer = null;
        }, 1500);
      } else {
        // 暂停不需要loading，同时清除loading计时器
        if (this.loadingTimer) {
          clearTimeout(this.loadingTimer);
          this.loadingTimer = null;
        }

        this.setData({
          playing: false,
          isLoading: false,
          statusText: "已暂停 - 点击继续播放",
        });
        if (this.playTimer) {
          clearInterval(this.playTimer);
        }
      }
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
        playing: true,
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

        const waveBars = this.data.waveBars.map(() => {
          return Math.floor(Math.random() * 54) + 35;
        });

        if (currentTime >= this.data.duration) {
          this.onTrackEnd();
        } else {
          this.setData({
            currentTime: currentTime,
            progress: progress,
            waveBars: waveBars,
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
