// 十分动听 - 2005年风格音乐播放器
Page({
  data: {
    // 播放状态
    playing: false,
    isLoading: false, // loading状态
    loadingClickCount: 0, // loading时点击次数
    currentTime: 0,
    duration: 234, // 默认3:54
    progress: 0,
    volume: 75,
    mode: 'loop', // loop, random, single

    // Win98风格提示弹窗
    showWin98Dialog: false,
    win98DialogTitle: '',
    win98DialogMessage: '',

    // 可视化波纹数据
    waveBars: [30, 50, 70, 90, 70, 50, 40, 60, 80, 100, 80, 60, 45, 65, 85, 95, 75, 55, 35, 50],

    // 当前曲目
    currentTrack: {
      id: 1,
      title: '童话',
      artist: '光良',
      album: '童话'
    },
    currentTrackIndex: 0,

    // 播放列表 - 来自D:\Music的珍藏歌单（24首）
    playlist: [
      // 2006金曲
      { id: 1, title: '童话', artist: '光良', album: '童话', duration: '3:54' },
      { id: 2, title: '七里香', artist: '周杰伦', album: '七里香', duration: '5:05' },
      { id: 3, title: '江南', artist: '林俊杰', album: '第二天堂', duration: '4:28' },
      { id: 4, title: '十年', artist: '陈奕迅', album: '黑·白·灰', duration: '3:52' },
      { id: 5, title: '隐形的翅膀', artist: '张韶涵', album: '潘朵拉', duration: '3:58' },
      { id: 6, title: '不想长大', artist: 'S.H.E', album: '不想长大', duration: '4:15' },
      // 非主流必听
      { id: 7, title: '嘻唰唰', artist: '花儿乐队', album: '花龄盛会', duration: '3:32' },
      { id: 8, title: '睫毛弯弯', artist: '王心凌', album: 'Cyndi With U', duration: '3:58' },
      { id: 9, title: '反转地球', artist: '潘玮柏', album: '反转地球', duration: '4:02' },
      { id: 10, title: '我们的爱', artist: 'F.I.R', album: '飞儿乐团', duration: '4:38' },
      // 2006爆款
      { id: 11, title: '老鼠爱大米', artist: '杨臣刚', album: '老鼠爱大米', duration: '4:45' },
      { id: 12, title: '两只蝴蝶', artist: '庞龙', album: '两只蝴蝶', duration: '4:22' },
      { id: 13, title: '猪之歌', artist: '香香', album: '猪之歌', duration: '3:48' },
      { id: 14, title: '别说我的眼泪你无所谓', artist: '东来东往', album: '回到我身边', duration: '4:33' },
      { id: 15, title: '秋天不回来', artist: '王强', album: '秋天不回来', duration: '4:08' },
      { id: 16, title: '香水有毒', artist: '胡杨林', album: '香水有毒', duration: '3:52' },
      { id: 17, title: '求佛', artist: '誓言', album: '求佛', duration: '4:25' },
      { id: 18, title: '一万个理由', artist: '郑源', album: '一万个理由', duration: '4:38' },
      { id: 19, title: '你到底爱谁', artist: '刘嘉亮', album: '你到底爱谁', duration: '4:18' },
      { id: 20, title: '丁香花', artist: '唐磊', album: '丁香花', duration: '4:33' },
      { id: 21, title: '狼爱上羊', artist: '汤潮', album: '狼爱上羊', duration: '4:12' },
      { id: 22, title: '不想让你哭', artist: '王强', album: '不想让你哭', duration: '4:05' },
      { id: 23, title: '你是我的玫瑰花', artist: '庞龙', album: '你是我的玫瑰花', duration: '4:28' },
      { id: 24, title: '笔记', artist: '周笔畅', album: '谁动了我的琴弦', duration: '4:08' },
    ],

    // 状态文本
    statusText: '就绪 - 点击播放开始欣赏音乐',

    // EQ相关
    showEQ: false,
    eqPreset: 'default',
    eqBands: [
      { name: '60Hz', value: 0 },
      { name: '170Hz', value: 0 },
      { name: '310Hz', value: 0 },
      { name: '600Hz', value: 0 },
      { name: '1kHz', value: 0 },
      { name: '3kHz', value: 0 },
      { name: '6kHz', value: 0 },
      { name: '12kHz', value: 0 },
      { name: '14kHz', value: 0 },
      { name: '16kHz', value: 0 },
    ]
  },

  onLoad: function () {
    // 模拟加载
    this.setData({ statusText: '正在加载播放列表...' });

    setTimeout(() => {
      this.setData({ statusText: '就绪 - 点击播放开始欣赏音乐' });
    }, 1000);
  },

  onUnload: function () {
    // 清理定时器
    if (this.playTimer) {
      clearInterval(this.playTimer);
    }
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
    }
  },

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
        statusText: '正在加载音乐...'
      });

      // 模拟加载延迟（3秒后弹出煽情对话框）
      this.loadingTimer = setTimeout(() => {
        // 确保回调执行时页面仍然处于loading状态
        if (this.data && this.data.isLoading) {
          // 取消loading状态
          this.setData({
            isLoading: false,
            playing: false,
            statusText: '就绪 - 点击播放开始欣赏音乐'
          });

          // 弹出煽情对话框
          this.showWin98Dialog(
            '致那些年的旋律',
            `那些年，我们用千千静听听歌，
每一首歌都精心收藏，
每一个播放列表都用心编排。

时光荏苒，岁月如梭，
那些旋律依然在记忆深处回响。

虽然这里无法播放真正的音乐，
但那份关于青春的回忆，
永远都在。

—— 千禧时光机 敬上`
          );
        }
        this.loadingTimer = null;
      }, 3000);
    } else {
      // 暂停不需要loading，同时清除loading计时器
      if (this.loadingTimer) {
        clearTimeout(this.loadingTimer);
        this.loadingTimer = null;
      }

      this.setData({
        playing: false,
        isLoading: false,
        statusText: '已暂停 - 点击继续播放'
      });

      // 停止进度更新
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
      statusText: `正在播放: ${track.title} - ${track.artist}`
    });

    // 重置进度更新
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

      // 更新可视化波纹（随机变化）
      const waveBars = this.data.waveBars.map(bar => {
        return Math.floor(Math.random() * 100) + 30;
      });

      if (currentTime >= this.data.duration) {
        // 播放结束
        this.onTrackEnd();
      } else {
        this.setData({
          currentTime: currentTime,
          progress: progress,
          waveBars: waveBars
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

    if (mode === 'single') {
      // 单曲循环
      this.setData({
        currentTime: 0,
        progress: 0
      });
      this.startProgress();
    } else if (mode === 'random') {
      // 随机播放
      const randomIndex = Math.floor(Math.random() * this.data.playlist.length);
      this.playTrack(randomIndex);
    } else {
      // 列表循环
      this.onNext();
    }
  },

  // 进度条拖动
  onSeek: function (e) {
    const query = wx.createSelectorQuery();
    query.select('.progress-bar').boundingClientRect();
    query.exec((res) => {
      if (res[0]) {
        const x = e.detail.x - res[0].left;
        const percent = Math.max(0, Math.min(1, x / res[0].width));
        const currentTime = Math.floor(percent * this.data.duration);

        this.setData({
          currentTime: currentTime,
          progress: percent * 100
        });
      }
    });
  },

  // 音量调节
  onVolumeChange: function (e) {
    this.setData({
      volume: e.detail.value,
      statusText: `音量: ${e.detail.value}%`
    });
  },

  // 播放模式切换
  onModeChange: function (e) {
    const mode = e.currentTarget.dataset.mode;
    const modeNames = {
      'loop': '列表循环',
      'random': '随机播放',
      'single': '单曲循环'
    };

    this.setData({
      mode: mode,
      statusText: `播放模式: ${modeNames[mode]}`
    });
  },

  // 清空播放列表
  onClearList: function () {
    wx.showModal({
      title: '确认',
      content: '确定要清空播放列表吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            playlist: [],
            playing: false,
            statusText: '播放列表已清空'
          });

          if (this.playTimer) {
            clearInterval(this.playTimer);
          }
        }
      }
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

    // 根据预设调整EQ
    const presets = {
      'default': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      'pop': [-3, -1, 2, 4, 4, 2, 0, -1, -2, -3],
      'rock': [5, 4, 2, 0, -1, 1, 3, 4, 5, 5],
      'classical': [4, 3, 2, 1, 0, 0, 0, 1, 2, 3],
      'jazz': [2, 1, 0, 1, 1, 0, 0, 1, 2, 3]
    };

    const bands = this.data.eqBands.map((band, index) => ({
      ...band,
      value: presets[preset][index]
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
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  // 最小化
  onMinimize: function () {
    wx.navigateBack();
  },

  // 关闭
  onClose: function () {
    wx.navigateBack();
  }
});
