// 历史事件数据 - 2005-2025
const eventsData = [
  // ===== 2005年 =====
  {
    id: 'event_2005_qq_show',
    year: 2005,
    trigger: {
      ageRange: [10, 25],
      gender: null
    },
    title: 'QQ秀风靡',
    description: 'QQ秀成为了年轻人展示自我的重要方式。你的同学们都在讨论最新的QQ秀装扮。',
    context: '2005年，腾讯推出QQ秀虚拟形象系统，用户可以购买虚拟服装和道具装扮自己。这个功能迅速成为年轻人社交的必备元素。',
    choices: [
      {
        text: '购买一套QQ秀装扮',
        hint: '花费零花钱，提升社交属性',
        effects: { social: 10, wealth: -5 },
        flags: { has_qq_show: true },
        result: '你花零花钱买了一套炫酷的QQ秀，同学们都夸你很有品味！'
      },
      {
        text: '不买，觉得太幼稚',
        hint: '保持独立，但可能错过社交话题',
        effects: { social: -5, tech_skill: 5 },
        result: '你觉得QQ秀没什么意思，选择了专注于学习和上网。'
      },
      {
        text: '自己尝试制作简单图片',
        hint: '锻炼技术技能',
        effects: { tech_skill: 10, social: 5 },
        flags: { made_custom_avatar: true },
        result: '你开始学习PS，制作自己的QQ头像，这让你对设计产生了兴趣。'
      }
    ]
  },

  {
    id: 'event_2005_super_girl',
    year: 2005,
    trigger: {
      ageRange: [12, 22],
      gender: null
    },
    title: '超级女声热潮',
    description: '超级女声比赛火热进行中，李宇春、周笔畅、张靓颖成为全民偶像。',
    context: '2005年，湖南卫视举办的超级女声创造了选秀奇迹，总决赛收视率超过央视春晚，开启了中国选秀时代。',
    choices: [
      {
        text: '疯狂投票支持喜欢的选手',
        hint: '投入粉丝文化，提升社交和快乐',
        effects: { social: 10, happiness: 10, wealth: -3 },
        flags: { super_fan: true },
        result: '你成了铁杆粉丝，熬夜投票，结识了很多志同道合的朋友！'
      },
      {
        text: '只是旁观，不参与投票',
        hint: '保持理性，不影响正常生活',
        effects: { happiness: 3 },
        result: '你关注比赛，但没有沉迷其中。'
      },
      {
        text: '学习选手，自己也想唱歌',
        hint: '可能开启艺术之路',
        effects: { charm: 10, happiness: 8, social: 5 },
        flags: { interest_singing: true },
        result: '你被选手的表演激励，开始学习唱歌，梦想自己也能站在舞台上。'
      }
    ]
  },

  {
    id: 'event_2005_kaixin',
    year: 2005,
    trigger: {
      ageRange: [15, 30],
      gender: null
    },
    title: '开心网诞生',
    description: '开心网上线，成为了年轻人社交的新平台。',
    context: '2005年，开心网上线，以"朋友买卖""抢车位"等社交游戏风靡一时，成为白领和学生的重要社交平台。',
    choices: [
      {
        text: '注册账号，邀请好友加入',
        hint: '开启社交网络生涯',
        effects: { social: 15, tech_skill: 5 },
        flags: { early_adopter: true, has_kaixin: true },
        result: '你成为了开心网的早期用户，在"抢车位"游戏中玩得不亦乐乎！'
      },
      {
        text: '不感兴趣，继续用QQ',
        hint: '保持传统社交方式',
        effects: { social: 3 },
        result: '你坚持使用QQ聊天，觉得这就足够了。'
      },
      {
        text: '研究平台，尝试创业想法',
        hint: '培养商业头脑',
        effects: { tech_skill: 15, wealth: 5, education: 8 },
        flags: { entrepreneur_mindset: true },
        result: '你对社交网络产生了浓厚兴趣，开始思考互联网创业的可能性。'
      }
    ]
  },

  // ===== 2006年 =====
  {
    id: 'event_2006_hu_ge',
    year: 2006,
    trigger: {
      ageRange: [13, 25],
      gender: null
    },
    title: '胡歌车祸',
    description: '当红小生胡歌发生严重车祸，引发全网关注和祈福。',
    context: '2006年8月，胡歌在拍摄《射雕英雄传》途中遭遇车祸，助理张冕去世，胡歌重伤。这个事件让无数粉丝心碎。',
    choices: [
      {
        text: '在论坛发帖为他祈福',
        hint: '参与网络社群，提升社交',
        effects: { social: 8, happiness: -3 },
        flags: { netizen_active: true },
        result: '你在各大论坛发帖祈福，感受到了网络社群的力量。'
      },
      {
        text: '默默关注，不发表言论',
        hint: '保持冷静',
        effects: { education: 3 },
        result: '你默默关注新闻，思考生命的脆弱。'
      },
      {
        text: '开始关注交通安全',
        hint: '提升责任感',
        effects: { health: 5, education: 5 },
        flags: { safety_conscious: true },
        result: '这件事让你意识到安全的重要性，开始主动学习交通安全知识。'
      }
    ]
  },

  {
    id: 'event_2006_world_cup',
    year: 2006,
    trigger: {
      ageRange: [10, 35],
      gender: null
    },
    title: '德国世界杯',
    description: '第18届世界杯在德国举行，齐达内头顶马特拉齐成为经典画面。',
    context: '2006年德国世界杯，齐达内在决赛中头顶马特拉齐被红牌罚下，意大利最终夺冠。这是很多80后90后的世界杯记忆。',
    choices: [
      {
        text: '熬夜看比赛，支持喜欢的球队',
        hint: '体育激情，影响健康',
        effects: { happiness: 10, social: 8, health: -5 },
        flags: { football_fan: true },
        result: '你熬夜看了很多场比赛，和同学们热烈讨论，虽然累但很充实！'
      },
      {
        text: '只看精彩集锦',
        hint: '保持平衡',
        effects: { happiness: 5, health: -2 },
        result: '你关注比赛但不会熬夜，保持正常作息。'
      },
      {
        text: '不喜欢足球，完全不关注',
        hint: '坚持自我',
        effects: { education: 5 },
        result: '你对足球不感兴趣，专注在自己的事情上。'
      }
    ]
  },

  {
    id: 'event_2006_baidu_tieba',
    year: 2006,
    trigger: {
      ageRange: [12, 28],
      gender: null
    },
    title: '百度贴吧崛起',
    description: '百度贴吧成为各种兴趣社群的聚集地，出现了很多神贴和梗。',
    context: '2006年前后，百度贴吧迅速崛起，"贾君鹏你妈妈喊你回家吃饭"等网络流行语诞生于此。',
    choices: [
      {
        text: '成为某个贴吧的活跃用户',
        hint: '深度参与网络文化',
        effects: { social: 15, tech_skill: 5 },
        flags: { tieba_regular: true },
        result: '你成为了某个贴吧的常客，结识了很多志同道合的网友。'
      },
      {
        text: '偶尔浏览，不发帖',
        hint: '轻度参与',
        effects: { education: 5 },
        result: '你经常看贴吧的帖子，了解各种趣事。'
      },
      {
        text: '自己发帖尝试创作',
        hint: '培养创作能力',
        effects: { charm: 10, tech_skill: 8, social: 10 },
        flags: { content_creator: true },
        result: '你开始写贴创作，获得了一些关注，这让你很有成就感。'
      }
    ]
  },

  // ===== 2007年 =====
  {
    id: 'event_2007_iphone',
    year: 2007,
    trigger: {
      ageRange: [15, 35],
      gender: null
    },
    title: 'iPhone发布',
    description: '苹果发布第一代iPhone，重新定义了智能手机。',
    context: '2007年1月9日，史蒂夫·乔布斯发布第一代iPhone，多点触控屏幕和无物理键盘的设计震惊了整个科技界。',
    choices: [
      {
        text: '密切关注，梦想拥有一台',
        hint: '成为果粉',
        effects: { tech_skill: 10, happiness: 5, wealth: -10 },
        flags: { apple_fan: true },
        result: '你被iPhone深深吸引，开始关注苹果的一切产品。'
      },
      {
        text: '觉得太贵，继续用诺基亚',
        hint: '务实选择',
        effects: { wealth: 5 },
        result: '你觉得iPhone太贵了，诺基亚塞班系统够用了。'
      },
      {
        text: '学习它的创新设计',
        hint: '研究产品设计',
        effects: { tech_skill: 15, education: 10 },
        flags: { design_interest: true },
        result: '你对iPhone的设计理念很感兴趣，开始研究UI/UX设计。'
      }
    ]
  },

  {
    id: 'event_2007_stock_fever',
    year: 2007,
    trigger: {
      ageRange: [18, 40],
      gender: null
    },
    title: '股市疯狂',
    description: 'A股市场疯狂上涨，所有人都在谈论股票，连菜市场的阿姨都在推荐股票。',
    context: '2007年，A股从998点一路涨到6124点，全民炒股成为现象级事件。但这之后开始了漫长的熊市。',
    choices: [
      {
        text: '入场炒股，希望赚快钱',
        hint: '高风险高回报',
        effects: { wealth: -30, happiness: -10, education: 5 },
        flags: { stock_investor: true },
        result: '你开了股票账户，但很快就在高点被套，损失惨重...',
        // 特殊：如果运气高，可能赚钱
        specialEffects: {
          condition: { luck: 70 },
          effects: { wealth: 50, happiness: 20 },
          result: '你运气很好，低买高卖，赚到了人生第一桶金！'
        }
      },
      {
        text: '坚持不碰，专注于工作',
        hint: '避免风险',
        effects: { education: 5, health: 5 },
        flags: { rational_investor: true },
        result: '你觉得这太疯狂了，选择不参与，后来证明这是明智的选择。'
      },
      {
        text: '学习投资知识，理性投资',
        hint: '长期学习价值投资',
        effects: { education: 15, wealth: 10 },
        flags: { value_investor: true },
        result: '你开始学习投资理论，为将来的财富积累打下了基础。'
      }
    ]
  },

  {
    id: 'event_2007_qq_pet',
    year: 2007,
    trigger: {
      ageRange: [10, 20],
      gender: null
    },
    title: 'QQ宠物',
    description: 'QQ宠物成为很多人的"电子伴侣"，需要喂食、打扫、看病。',
    context: '2007年，QQ宠物达到巅峰，很多年轻人沉迷于照顾这只电子企鹅，甚至愿意花钱买各种道具。',
    choices: [
      {
        text: '领养一只，悉心照料',
        hint: '培养责任感',
        effects: { happiness: 10, social: 5, wealth: -5 },
        flags: { has_qq_pet: true },
        result: '你领养了QQ宠物，每天记得喂食，它成为了你的好伙伴。'
      },
      {
        text: '觉得浪费时间，不养',
        hint: '保持理性',
        effects: { education: 5, tech_skill: 3 },
        result: '你觉得QQ宠物很无聊，没有领养。'
      },
      {
        text: '研究背后的商业模式',
        hint: '培养商业思维',
        effects: { tech_skill: 10, wealth: 5, education: 8 },
        flags: { business_mindset: true },
        result: '你对QQ宠物的充值模式很感兴趣，开始思考虚拟产品的商业模式。'
      }
    ]
  },

  // ===== 2008年 =====
  {
    id: 'event_2008_earthquake',
    year: 2008,
    trigger: {
      ageRange: [10, 40],
      gender: null
    },
    title: '汶川地震',
    description: '5月12日14时28分，四川汶川发生8.0级特大地震。',
    context: '2008年5月12日，汶川地震造成近7万人遇难，全国进入哀悼模式，这是80后90后第一次经历如此重大的国难。',
    choices: [
      {
        text: '积极参加捐款和志愿者活动',
        hint: '体现社会责任',
        effects: { social: 15, happiness: -10, charm: 10 },
        flags: { volunteer: true },
        result: '你捐出了零花钱，还参与了社区志愿服务，感受到了团结的力量。'
      },
      {
        text: '默默关注，内心沉重',
        hint: '内化情感',
        effects: { education: 5, happiness: -15 },
        result: '你每天关注新闻，为灾区人民祈祷，内心受到很大震撼。'
      },
      {
        text: '学习防震减灾知识',
        hint: '实用技能',
        effects: { health: 10, education: 10 },
        flags: { disaster_prepared: true },
        result: '你开始学习各种应急知识，希望在未来能帮助自己和他人。'
      }
    ]
  },

  {
    id: 'event_2008_beijing_olympics',
    year: 2008,
    trigger: {
      ageRange: [8, 40],
      gender: null
    },
    title: '北京奥运会',
    description: '8月8日晚8点，北京奥运会开幕式震撼世界！',
    context: '2008年8月8日，北京奥运会开幕式在鸟巢举行，张艺谋导演的表演让全世界惊叹。这是中国人的骄傲时刻。',
    choices: [
      {
        text: '守在电视机前看直播',
        hint: '民族自豪感',
        effects: { happiness: 15, social: 10, health: -3 },
        flags: { olympics_witness: true },
        result: '你全家人一起看开幕式，当李宁点燃火炬时，你热泪盈眶！'
      },
      {
        text: '去北京现场观赛',
        hint: '难得的经历',
        effects: { happiness: 20, social: 15, wealth: -20 },
        flags: { olympics_visitor: true },
        requireFlags: ['wealth_support'],
        result: '你有机会去北京看了比赛，这是一生难忘的经历！'
      },
      {
        text: '对体育不感兴趣',
        hint: '保持自我',
        effects: { education: 3 },
        result: '奥运会很热闹，但你还是更喜欢做自己喜欢的事情。'
      }
    ]
  },

  {
    id: 'event_2008_sanlu',
    year: 2008,
    trigger: {
      ageRange: [5, 35],
      gender: null
    },
    title: '三鹿奶粉事件',
    description: '三鹿集团奶粉被发现含有三聚氰胺，引发全国奶业危机。',
    context: '2008年9月，三鹿奶粉丑闻曝光，导致约30万婴幼儿患病。这个事件彻底改变了中国消费者对国产品牌的信任。',
    choices: [
      {
        text: '家里有小孩，非常担忧',
        hint: '负责任的态度',
        effects: { health: -5, happiness: -10, education: 5 },
        flags: { food_safety_concern: true },
        result: '你仔细检查家里的奶粉，开始关注食品安全问题。'
      },
      {
        text: '自己已经成年，影响不大',
        hint: '理性看待',
        effects: { education: 5 },
        result: '虽然事件很严重，但你觉得自己已经过了喝奶粉的年龄。'
      },
      {
        text: '研究事件背后的监管问题',
        hint: '培养批判性思维',
        effects: { education: 15, tech_skill: 5 },
        flags: { critical_thinker: true },
        result: '你深入了解了事件经过，开始思考企业道德和政府监管的问题。'
      }
    ]
  },

  {
    id: 'event_2008_financial_crisis',
    year: 2008,
    trigger: {
      ageRange: [20, 45],
      gender: null
    },
    title: '全球金融危机',
    description: '雷曼兄弟破产，全球金融海啸来袭，中国经济也受到影响。',
    context: '2008年9月，雷曼兄弟破产引发了全球金融危机，中国出口大幅下滑，大量工厂倒闭。',
    choices: [
      {
        text: '工作受到影响，收入下降',
        hint: '经历经济困难',
        effects: { wealth: -20, happiness: -10 },
        flags: { experienced_crisis: true },
        result: '公司效益不好，你被降薪了，生活压力变大。'
      },
      {
        text: '工作稳定，影响不大',
        hint: '幸运',
        effects: { happiness: 5 },
        flags: { stable_job: true },
        result: '你所在的行业受影响较小，生活正常。'
      },
      {
        text: '趁机学习进修，提升自己',
        hint: '投资自己',
        effects: { education: 15, tech_skill: 10 },
        flags: { self_improver: true },
        result: '你利用空闲时间学习新技能，为未来做准备。'
      }
    ]
  },

  // ===== 2009年 =====
  {
    id: 'event_2009_sina_weibo',
    year: 2009,
    trigger: {
      ageRange: [15, 35],
      gender: null
    },
    title: '新浪微博上线',
    description: '新浪微博内测上线，开启了"微博时代"。',
    context: '2009年8月，新浪微博上线，140字限制的短内容迅速成为主流，改变了人们获取信息和社交的方式。',
    choices: [
      {
        text: '立即注册，成为早期用户',
        hint: '社交媒体达人',
        effects: { social: 15, tech_skill: 8 },
        flags: { weibo_early_user: true },
        result: '你成为了微博早期用户，结识了很多有趣的人。'
      },
      {
        text: '观望一段时间再决定',
        hint: '谨慎态度',
        effects: { education: 3 },
        result: '你先看看别人怎么说，没有急于注册。'
      },
      {
        text: '尝试做自媒体',
        hint: '内容创作者',
        effects: { charm: 12, social: 15, tech_skill: 10 },
        flags: { weibo_influencer: true },
        result: '你开始在微博上创作内容，慢慢积累了一些粉丝。'
      }
    ]
  },

  {
    id: 'event_2009_jay_chou',
    year: 2009,
    trigger: {
      ageRange: [12, 28],
      gender: null
    },
    title: '周杰伦《跨时代》',
    description: '周杰伦发布新专辑，继续统治华语乐坛。',
    context: '2009年，周杰伦发布专辑《跨时代》，包括《稻香》《说好的幸福呢》等经典歌曲，80后90后的青春回忆。',
    choices: [
      {
        text: '买专辑，每天循环播放',
        hint: '音乐爱好者',
        effects: { happiness: 12, social: 8, wealth: -3 },
        flags: { jay_fan: true },
        result: '周杰伦的歌陪伴你度过了很多时光，每首歌都能哼唱。'
      },
      {
        text: '偶尔听听，不是铁粉',
        hint: '普通听众',
        effects: { happiness: 5 },
        result: '你听过几首歌，觉得还不错。'
      },
      {
        text: '开始学习音乐创作',
        hint: '艺术之路',
        effects: { charm: 15, happiness: 10, tech_skill: 5 },
        flags: { music_creator: true },
        result: '你被周杰伦的音乐启发，开始尝试创作自己的歌曲。'
      }
    ]
  },

  // ===== 2010年 =====
  {
    id: 'event_2010_iphone4',
    year: 2010,
    trigger: {
      ageRange: [18, 40],
      gender: null
    },
    title: 'iPhone 4发布',
    description: '史蒂夫·乔布斯发布iPhone 4，"再一次，改变一切"。',
    context: '2010年6月，iPhone 4发布，Retina屏幕、FaceTime视频通话、前置摄像头，成为经典中的经典。',
    choices: [
      {
        text: '排队购买，成为第一批用户',
        hint: '果粉必入',
        effects: { tech_skill: 10, happiness: 15, social: 10, wealth: -30 },
        flags: { iphone4_user: true },
        result: '你花了一个月工资买iPhone 4，但是太值了！'
      },
      {
        text: '等待降价再买',
        hint: '理性消费',
        effects: { wealth: 10, happiness: 5 },
        flags: { rational_consumer: true },
        result: '你决定等价格降下来再说，把钱用在更重要的事情上。'
      },
      {
        text: '继续用安卓，不换iPhone',
        hint: '保持选择',
        effects: { tech_skill: 8 },
        flags: { android_user: true },
        result: '你觉得安卓更自由，坚持不换iPhone。'
      }
    ]
  },

  {
    id: 'event_2010_world_expo',
    year: 2010,
    trigger: {
      ageRange: [10, 40],
      gender: null
    },
    title: '上海世博会',
    description: '上海举办世界博览会，主题"城市，让生活更美好"。',
    context: '2010年上海世博会，246个国家和国际组织参展，参观人数超过7300万，创历史纪录。',
    choices: [
      {
        text: '去上海参观世博会',
        hint: '开阔眼界',
        effects: { happiness: 15, education: 12, social: 8, wealth: -15 },
        flags: { expo_visitor: true },
        result: '你在上海玩了几天，看了各国展馆，增长了见识！'
      },
      {
        text: '通过电视和网络关注',
        hint: '省钱但也能了解',
        effects: { education: 8, happiness: 5 },
        result: '你虽然没去现场，但看了很多报道和直播。'
      },
      {
        text: '做世博会志愿者',
        hint: '服务他人',
        effects: { social: 20, happiness: 15, charm: 10 },
        flags: { expo_volunteer: true },
        result: '你成为了世博会志愿者"小白菜"，帮助了很多游客！'
      }
    ]
  },

  // ===== 2011年 =====
  {
    id: 'event_2011_wechat',
    year: 2011,
    trigger: {
      ageRange: [18, 40],
      gender: null
    },
    title: '微信发布',
    description: '腾讯发布微信1.0版本，移动互联网时代开启。',
    context: '2011年1月，微信发布，初期只有即时通讯功能。后来加入的朋友圈、公众号等功能彻底改变了社交网络格局。',
    choices: [
      {
        text: '立即下载并邀请好友',
        hint: '早期采用者',
        effects: { social: 15, tech_skill: 10 },
        flags: { wechat_early_user: true },
        result: '你成了微信早期用户，见证了它的成长。'
      },
      {
        text: '继续用QQ和短信',
        hint: '保守态度',
        effects: { social: 3 },
        result: '你觉得QQ和短信已经够用，不需要新应用。'
      },
      {
        text: '研究微信的产品设计',
        hint: '产品经理思维',
        effects: { tech_skill: 18, education: 12, wealth: 8 },
        flags: { product_manager_mindset: true },
        result: '你对微信的产品设计很感兴趣，开始研究移动互联网产品。'
      }
    ]
  },

  {
    id: 'event_2011_gao_yuanyuan',
    year: 2011,
    trigger: {
      ageRange: [15, 30],
      gender: 'male'
    },
    title: '女神高圆圆',
    description: '高圆圆因《单身男女》成为全民女神，"娶老婆要娶高圆圆类型"成为流行语。',
    context: '2011年，高圆圆主演电影《单身男女》，清纯甜美的形象让她成为很多男性的梦中情人。',
    choices: [
      {
        text: '成为粉丝，追她的作品',
        hint: '提升审美',
        effects: { happiness: 8, charm: 5 },
        flags: { has_idol: true },
        result: '你看了高圆圆的所有作品，觉得她是完美女神。'
      },
      {
        text: '理性欣赏，不盲目追星',
        hint: '成熟态度',
        effects: { charm: 8, education: 5 },
        result: '你欣赏高圆圆的美，但保持理性。'
      },
      {
        text: '关注她的时尚搭配',
        hint: '学习穿搭',
        effects: { charm: 12, social: 8 },
        flags: { fashion_conscious: true },
        result: '你开始关注时尚，学习穿搭技巧。'
      }
    ]
  },

  // ===== 2012年 =====
  {
    id: 'event_2012_mayan_calendar',
    year: 2012,
    trigger: {
      ageRange: [10, 40],
      gender: null
    },
    title: '玛雅预言',
    description: '关于"2012年世界末日"的玛雅预言引发全球讨论。',
    context: '2012年，根据玛雅历法，12月21日可能是"世界末日"。虽然有科学辟谣，但仍引发了很多讨论和担忧。',
    choices: [
      {
        text: '半信半疑，准备应急物资',
        hint: '未雨绸缪',
        effects: { health: 8, wealth: -5, happiness: -5 },
        flags: { prepper: true },
        result: '你准备了一些应急物资，虽然最后证明是杞人忧天。'
      },
      {
        text: '完全不信，该干嘛干嘛',
        hint: '理性态度',
        effects: { happiness: 5, education: 5 },
        flags: { rational_skeptic: true },
        result: '你觉得这是无稽之谈，照常生活。'
      },
      {
        text: '趁机狂欢，享受每一天',
        hint: '活在当下',
        effects: { happiness: 15, social: 12, health: -5 },
        flags: { carpe_diem: true },
        result: '你和朋友一起狂欢，"反正要末日了，不如开心点"！'
      }
    ]
  },

  {
    id: 'event_2012_gangnam_style',
    year: 2012,
    trigger: {
      ageRange: [10, 35],
      gender: null
    },
    title: '江南Style',
    description: '韩国歌手PSY的《江南Style》爆红全球，骑马舞风靡一时。',
    context: '2012年，《江南Style》成为YouTube史上首个点击量超过10亿的视频，骑马舞成为全球流行文化现象。',
    choices: [
      {
        text: '学习骑马舞，和朋友一起跳',
        hint: '社交互动',
        effects: { happiness: 12, social: 15, health: 3 },
        flags: { dance_enthusiast: true },
        result: '你和同事朋友聚会时跳骑马舞，玩得很开心！'
      },
      {
        text: '觉得太傻，不参与',
        hint: '保持自我',
        effects: { education: 3 },
        result: '你觉得这太幼稚了，没有跟风。'
      },
      {
        text: '研究它为什么这么火',
        hint: '商业思维',
        effects: { tech_skill: 12, education: 10, social: 8 },
        flags: { viral_analyzer: true },
        result: '你分析了这首歌爆红的原因，对病毒式传播有了新认识。'
      }
    ]
  },

  // ===== 2013年 =====
  {
    id: 'event_2013_shejian_shang_de_zhongguo',
    year: 2013,
    trigger: {
      ageRange: [15, 40],
      gender: null
    },
    title: '舌尖上的中国',
    description: '纪录片《舌尖上的中国》热播，引发美食文化热潮。',
    context: '2013年，《舌尖上的中国第二季》播出，以美食为切入点展现中国传统文化和人文情怀。',
    choices: [
      {
        text: '追着看，边看边流口水',
        hint: '美食爱好者',
        effects: { happiness: 12, health: -5, wealth: -5 },
        flags: { foodie: true },
        result: '你看了纪录片，尝试了很多地方美食。'
      },
      {
        text: '对传统文化感兴趣',
        hint: '文化探索',
        effects: { education: 12, charm: 8 },
        flags: { culture_lover: true },
        result: '你被纪录片中的传统文化深深吸引。'
      },
      {
        text: '开始学习做饭',
        hint: '生活技能',
        effects: { health: 10, happiness: 8, charm: 5 },
        flags: { cooking_skill: true },
        result: '你受到启发，开始学习做菜，厨艺大有长进！'
      }
    ]
  },

  {
    id: 'event_2013_xi_bodu',
    year: 2013,
    trigger: {
      ageRange: [10, 35],
      gender: null
    },
    title: '喜大普奔',
    description: '网络流行语爆发，"喜大普奔""人艰不拆"等词成为日常用语。',
    context: '2013年前后，网络缩写词和流行语大量涌现，"喜大普奔"(喜闻乐见、大快人心、普天同庆、奔走相告)成为典型代表。',
    choices: [
      {
        text: '使用这些流行语',
        hint: '融入网络文化',
        effects: { social: 10, charm: 3 },
        flags: { internet_slang_user: true },
        result: '你经常说"喜大普奔""人艰不拆"，觉得很酷。'
      },
      {
        text: '觉得这样说话很奇怪',
        hint: '保持语言规范',
        effects: { education: 8 },
        flags: { language_purist: true },
        result: '你不喜欢这些缩写，坚持正常说话。'
      },
      {
        text: '研究语言演变规律',
        hint: '语言学兴趣',
        effects: { education: 15, charm: 8 },
        flags: { linguistics_interest: true },
        result: '你对网络语言的发展产生了学术兴趣。'
      }
    ]
  },

  // ===== 2014年 =====
  {
    id: 'event_2014_ice_bucket_challenge',
    year: 2014,
    trigger: {
      ageRange: [15, 40],
      gender: null
    },
    title: '冰桶挑战',
    description: '"冰桶挑战"在全球蔓延，旨在关注渐冻症患者。',
    context: '2014年，冰桶挑战风靡全球，包括比尔·盖茨、马克·扎克伯格等名人都参与，为渐冻症研究筹集善款。',
    choices: [
      {
        text: '接受挑战并捐赠',
        hint: '公益参与',
        effects: { social: 15, happiness: 10, charm: 10, wealth: -5 },
        flags: { charity_participant: true },
        result: '你冰水浇头还捐了款，感觉自己做了一件有意义的事！'
      },
      {
        text: '只捐款，不浇冰水',
        hint: '务实公益',
        effects: { charm: 8, happiness: 5, wealth: -5 },
        flags: { charity_donor: true },
        result: '你捐了款，但觉得冰水只是形式，没必要参与。'
      },
      {
        text: '关注渐冻症本身',
        hint: '深入了解',
        effects: { education: 15, charm: 8 },
        flags: { medical_interest: true },
        result: '你借机了解了渐冻症，对罕见病群体有了更多认识。'
      }
    ]
  },

  {
    id: 'event_2014_uber_didi',
    year: 2014,
    trigger: {
      ageRange: [18, 40],
      gender: null
    },
    title: '网约车大战',
    description: 'Uber和滴滴展开补贴大战，打车几乎不要钱。',
    context: '2014年，Uber进入中国，与滴滴展开激烈竞争，双方投入巨额补贴，用户打车只需几毛钱甚至免费。',
    choices: [
      {
        text: '薅羊毛，天天坐专车',
        hint: '精打细算',
        effects: { wealth: 10, happiness: 10, social: 5 },
        flags: { deal_hunter: true },
        result: '你每天上下班都坐专车，省了很多钱！'
      },
      {
        text: '觉得不安全，坚持坐公交',
        hint: '保守态度',
        effects: { health: 5 },
        result: '你对私家车运营持保留态度，坚持坐公共交通。'
      },
      {
        text: '研究共享经济模式',
        hint: '商业洞察',
        effects: { tech_skill: 15, education: 12, wealth: 8 },
        flags: { sharing_economy_analyst: true },
        result: '你对共享经济模式很感兴趣，思考未来的商业机会。'
      }
    ]
  },

  // ===== 2015年 =====
  {
    id: 'event_2015_stock_crash',
    year: 2015,
    trigger: {
      ageRange: [20, 50],
      gender: null
    },
    title: '股灾',
    description: 'A股从5178点暴跌，千股跌停成为常态。',
    context: '2015年6月，A股开始暴跌，多次出现千股跌停的壮观场面，无数散户血本无归。',
    choices: [
      {
        text: '在股市中损失惨重',
        hint: '惨痛教训',
        effects: { wealth: -40, happiness: -20 },
        flags: { stock_crash_victim: true },
        result: '你在高点买入，股灾中损失巨大，很长时间缓不过来...'
      },
      {
        text: '及时清仓，躲过一劫',
        hint: '运气与智慧',
        effects: { wealth: 10, happiness: 10 },
        flags: { market_timer: true },
        result: '你敏锐地察觉到风险，在暴跌前卖出，躲过一劫！'
      },
      {
        text: '坚持不炒股，庆幸',
        hint: '稳健策略',
        effects: { happiness: 5, health: 5 },
        flags: { risk_averse: true },
        result: '你没参与这场疯狂，现在非常庆幸自己的决定。'
      }
    ]
  },

  {
    id: 'event_2015_shanghai_baby',
    year: 2015,
    trigger: {
      ageRange: [18, 35],
      gender: 'female'
    },
    title: '《小时代4》',
    description: '郭敬明的《小时代4》上映，引发关于物质主义的讨论。',
    context: '2015年，《小时代4》上映，这部被批评为"物质主义教科书"的电影在年轻人中仍有巨大影响力。',
    choices: [
      {
        text: '非常喜欢，追求物质生活',
        hint: '物质主义倾向',
        effects: { charm: 8, happiness: 10, wealth: -15 },
        flags: { materialist: true },
        result: '你被电影中的奢华生活吸引，开始追求名牌。'
      },
      {
        text: '批判性观看，思考价值观',
        hint: '独立思考',
        effects: { education: 12, charm: 5 },
        flags: { critical_viewer: true },
        result: '你看了电影，但有自己的思考，不盲目追求物质。'
      },
      {
        text: '完全不感兴趣',
        hint: '保持自我',
        effects: { education: 5 },
        result: '你觉得这种电影不适合自己，没有去看。'
      }
    ]
  },

  {
    id: 'event_2015_beijing_shanghai_crush',
    year: 2015,
    trigger: {
      ageRange: [20, 35],
      gender: null
    },
    title: '逃离北上广',
    description: '"逃离北上广"成为热门话题，年轻人开始思考生活方式的选择。',
    context: '2015年，"逃离北上广"成为流行语，很多在一线城市工作的年轻人开始思考是否应该回到二三线城市。',
    choices: [
      {
        text: '决定回老家发展',
        hint: '生活优先',
        effects: { happiness: 15, health: 10, social: -10, wealth: -5 },
        flags: { left_big_city: true },
        result: '你回到家乡，工作压力小了，生活质量提高了。'
      },
      {
        text: '坚持在一线城市打拼',
        hint: '事业优先',
        effects: { wealth: 15, education: 10, health: -10, happiness: -5 },
        flags: { stay_in_big_city: true },
        result: '你选择继续奋斗，相信大城市有更多机会。'
      },
      {
        text: '去新一线城市试试',
        hint: '折中方案',
        effects: { happiness: 10, wealth: 8, social: 5 },
        flags: { new_city_pioneer: true },
        result: '你去了杭州/成都等城市，找到了平衡点。'
      }
    ]
  },

  // ===== 2016年 =====
  {
    id: 'event_2016_pokemongo',
    year: 2016,
    trigger: {
      ageRange: [15, 35],
      gender: null
    },
    title: 'Pokémon GO',
    description: 'AR游戏Pokémon GO全球爆红，成为现象级产品。',
    context: '2016年7月，任天堂推出AR游戏Pokémon GO，玩家在现实中捕捉精灵，全球为之疯狂。',
    choices: [
      {
        text: '沉迷游戏，到处抓精灵',
        hint: '游戏玩家',
        effects: { happiness: 12, health: 5, social: 10 },
        flags: { pokemon_player: true },
        result: '你每天走路抓精灵，认识了很多同好！'
      },
      {
        text: '不玩，觉得太幼稚',
        hint: '成熟态度',
        effects: { education: 5 },
        result: '你对这种游戏不感兴趣。'
      },
      {
        text: '研究AR技术',
        hint: '技术前瞻',
        effects: { tech_skill: 18, education: 12 },
        flags: { ar_enthusiast: true },
        result: '你对AR技术产生了浓厚兴趣，开始学习相关知识。'
      }
    ]
  },

  {
    id: 'event_2016_wang_baoqiang',
    year: 2016,
    trigger: {
      ageRange: [18, 40],
      gender: null
    },
    title: '王宝强离婚',
    description: '王宝强宣布离婚，引爆全网讨论，创下微博转发纪录。',
    context: '2016年8月，王宝强发表声明宣布离婚，指责妻子马蓉出轨，事件引发全民热议。',
    choices: [
      {
        text: '密切关注，站队王宝强',
        hint: '吃瓜群众',
        effects: { social: 10, happiness: -5 },
        flags: { wang_fan: true },
        result: '你在社交媒体上声援王宝强，吃瓜吃到撑。'
      },
      {
        text: '理性看待，不站队',
        hint: '成熟态度',
        effects: { education: 8 },
        result: '你觉得这是别人的私事，不便评论。'
      },
      {
        text: '思考婚姻和信任问题',
        hint: '深度思考',
        effects: { education: 15, charm: 8 },
        flags: { relationship_thinker: true },
        result: '你借机思考了自己的感情观，对婚姻有了新的认识。'
      }
    ]
  },

  // ===== 2017年 =====
  {
    id: 'event_2017_live_streaming',
    year: 2017,
    trigger: {
      ageRange: [18, 35],
      gender: null
    },
    title: '直播元年',
    description: '直播行业爆发，"网红"成为正式职业。',
    context: '2017年，直播行业迎来爆发式增长，斗鱼、虎牙、花椒等平台竞争激烈，"网红经济"成为新概念。',
    choices: [
      {
        text: '尝试当主播',
        hint: '网红之路',
        effects: { social: 20, charm: 12, wealth: 5 },
        flags: { streamer: true },
        result: '你开始直播，虽然粉丝不多，但很有趣！'
      },
      {
        text: '经常看直播，刷礼物',
        hint: '金主之路',
        effects: { social: 8, happiness: 10, wealth: -10 },
        flags: { stream_viewer: true },
        result: '你经常看直播，和主播互动很有意思。'
      },
      {
        text: '研究直播商业模式',
        hint: '商业思维',
        effects: { tech_skill: 15, education: 12, wealth: 10 },
        flags: { streaming_business_analyst: true },
        result: '你深入研究了直播行业的盈利模式，看到了商机。'
      }
    ]
  },

  {
    id: 'event_2017_wechat_mini_program',
    year: 2017,
    trigger: {
      ageRange: [20, 40],
      gender: null
    },
    title: '小程序上线',
    description: '微信小程序正式上线，"用完即走"的产品理念。',
    context: '2017年1月，微信小程序上线，不需要下载安装即可使用的应用形态，被认为是移动互联网的下半场。',
    choices: [
      {
        text: '学习开发小程序',
        hint: '技术红利',
        effects: { tech_skill: 20, education: 15, wealth: 15 },
        flags: { mini_program_developer: true },
        result: '你抓住机会学习小程序开发，接到了不少项目！'
      },
      {
        text: '普通使用，不深入学习',
        hint: '用户视角',
        effects: { tech_skill: 5 },
        result: '你用跳一跳等小程序娱乐，但没有深入学习。'
      },
      {
        text: '不感兴趣，继续用APP',
        hint: '传统派',
        effects: { education: 3 },
        result: '你觉得小程序功能有限，还是习惯用原生APP。'
      }
    ]
  },

  // ===== 2018年 =====
  {
    id: 'event_2018_didi_ride_hailing',
    year: 2018,
    trigger: {
      ageRange: [18, 40],
      gender: null
    },
    title: '滴滴顺风车事件',
    description: '滴滴顺风车发生两起恶性案件，平台安全问题引发关注。',
    context: '2018年，滴滴顺风车发生两起乘客遇害案件，引发全网对网约车安全问题的讨论，滴滴最终下线顺风车业务。',
    choices: [
      {
        text: '不再使用网约车',
        hint: '安全第一',
        effects: { health: 10, happiness: -5 },
        flags: { safety_first: true },
        result: '你出于安全考虑，改坐出租车和公交。'
      },
      {
        text: '理性看待，继续使用',
        hint: '风险评估',
        effects: { education: 8 },
        result: '你觉得还是概率问题，正常使用网约车。'
                      },
      {
        text: '关注女性安全议题',
        hint: '社会关注',
        effects: { education: 15, charm: 10 },
        flags: { gender_safety_advocate: true },
        result: '你开始关注女性安全话题，参与了相关讨论。'
      }
    ]
  },

  {
    id: 'event_2018_blockchain',
    year: 2018,
    trigger: {
      ageRange: [20, 45],
      gender: null
    },
    title: '区块链热潮',
    description: '区块链成为最火概念，"币圈""链圈"一夜暴富的故事流传。',
    context: '2018年，比特币价格从几美分涨到近2万美元，区块链概念火热，"不懂区块链就是新时代的文盲"成为流行语。',
    choices: [
      {
        text: '投资数字货币',
        hint: '高风险投机',
        effects: { wealth: -30, happiness: -15, education: 5 },
        flags: { crypto_investor: true },
        result: '你在高点买入，遭遇暴跌，损失惨重...',
        // 特殊：如果运气高，可能赚钱
        specialEffects: {
          condition: { luck: 75 },
          effects: { wealth: 50, happiness: 20 },
          result: '你运气超好，低买高卖，赚了一大笔！'
        }
      },
      {
        text: '学习区块链技术',
        hint: '技术投资',
        effects: { tech_skill: 20, education: 15 },
        flags: { blockchain_developer: true },
        result: '你没有炒币，而是学习了区块链技术，这成为你的职业优势。'
      },
      {
        text: '保持观望，不参与',
        hint: '理性旁观',
        effects: { education: 5 },
        flags: { rational_spectator: true },
        result: '你觉得这像当年的郁金香泡沫，选择观望。'
      }
    ]
  },

  // ===== 2019年 =====
  {
    id: 'event_2019_civilized_gaming',
    year: 2019,
    trigger: {
      ageRange: [15, 30],
      gender: null
    },
    title: '文明6爆红',
    description: '《文明6》游戏在玩家群体中爆红，"再来一回合"成梗。',
    context: '2019年，《文明6》在Steam上持续热销，"再来一回合"成为玩家们的共同记忆，很多人一玩就是一整夜。',
    choices: [
      {
        text: '沉迷游戏，经常通宵',
        hint: '游戏成瘾',
        effects: { happiness: 15, education: 10, health: -15 },
        flags: { civ_addict: true },
        result: '你沉迷文明6，经常"再来一回合"到天亮...'
      },
      {
        text: '适度游戏，不影响生活',
        hint: '健康游戏',
        effects: { happiness: 10, education: 8, health: -3 },
        flags: { casual_gamer: true },
        result: '你偶尔玩玩，但不会过度沉迷。'
      },
      {
        text: '对游戏不感兴趣',
        hint: '现实派',
        effects: { education: 5, health: 3 },
        result: '你觉得游戏浪费时间，有更重要的事情要做。'
      }
    ]
  },

  {
    id: 'event_2019_996_icu',
    year: 2019,
    trigger: {
      ageRange: [22, 40],
      gender: null
    },
    title: '996 ICU',
    description: '"996工作制"引发热议，程序员在GitHub发起抗议。',
    context: '2019年3月，"996 ICU"项目在GitHub上线，抗议互联网公司的996工作制（早9点到晚9点，一周6天），引发全社会对加班文化的讨论。',
    choices: [
      {
        text: '支持996，奋斗致富',
        hint: '奋斗观',
        effects: { wealth: 15, education: 5, health: -10, happiness: -10 },
        flags: { workaholic: true },
        result: '你相信"996是福报"，努力工作赚钱。'
      },
      {
        text: '反对996，工作生活平衡',
        hint: '生活质量优先',
        effects: { happiness: 10, health: 10, wealth: -5 },
        flags: { work_life_balance: true },
        result: '你拒绝996，认为健康和生活更重要。'
      },
      {
        text: '换到不996的公司',
        hint: '主动选择',
        effects: { happiness: 8, health: 8 },
        flags: { job_hopper: true },
        result: '你离职去了更人性化的公司。'
      }
    ]
  },

  {
    id: 'event_2019_hong_kong_protests',
    year: 2019,
    trigger: {
      ageRange: [18, 45],
      gender: null
    },
    title: '香港局势',
    description: '香港发生大规模社会运动，引发全国关注。',
    context: '2019年，香港因修例风波爆发持续数月的示威活动，对社会经济造成重大影响。',
    choices: [
      {
        text: '密切关注新闻',
        hint: '关心时事',
        effects: { education: 10, happiness: -10 },
        flags: { current_events_follower: true },
        result: '你每天关注香港新闻，为国家统一担忧。'
      },
      {
        text: '理性分析，避免情绪化',
        hint: '成熟态度',
        effects: { education: 15 },
        flags: { rational_observer: true },
        result: '你理性分析各方观点，有自己的判断。'
      },
      {
        text: '影响到了工作/学习',
        hint: '实际影响',
        effects: { wealth: -10, happiness: -15 },
        flags: { affected_by_events: true },
        result: '你在香港工作或学习，受到很大影响。'
      }
    ]
  },

  // ===== 2020年 =====
  {
    id: 'event_2020_covid',
    year: 2020,
    trigger: {
      ageRange: [10, 50],
      gender: null
    },
    title: '新冠疫情爆发',
    description: '1月，新冠疫情在武汉爆发，随后席卷全球。',
    context: '2020年1月，新冠疫情爆发，武汉封城76天。疫情改变了全球的政治、经济和生活方式，戴口罩、健康码成为日常。',
    choices: [
      {
        text: '严格遵守防疫规定',
        hint: '负责任态度',
        effects: { health: 15, happiness: -10, charm: 10 },
        flags: { covid_compliant: true },
        result: '你积极配合防疫，戴口罩、做核酸，保护自己和他人的安全。'
      },
      {
        text: '在家办公/学习',
        hint: '适应变化',
        effects: { tech_skill: 15, education: 10, happiness: -5 },
        flags: { remote_worker: true },
        result: '你在家办公学习，开始习惯线上协作的方式。'
      },
      {
        text: '疫情期间学习新技能',
        hint: '自我提升',
        effects: { tech_skill: 20, education: 20, wealth: 5 },
        flags: { pandemic_learner: true },
        result: '你利用隔离时间学习新技能，实现了自我提升！'
      }
    ]
  },

  {
    id: 'event_2020_home_quarantine',
    year: 2020,
    trigger: {
      ageRange: [15, 45],
      gender: null
    },
    title: '居家隔离',
    description: '全国居家隔离，外卖、生鲜电商成为刚需。',
    context: '2020年初，全国人民居家隔离，美团、饿了么、叮咚买菜等平台业务暴增，人们的生活方式被迫改变。',
    choices: [
      {
        text: '尝试自己做饭',
        hint: '生活技能',
        effects: { health: 15, happiness: 8, charm: 5 },
        flags: { cooking_master: true },
        result: '你在家学做饭，厨艺大有长进，家人都很爱吃！'
      },
      {
        text: '依赖外卖和生鲜电商',
        hint: '便利生活',
        effects: { wealth: -10, happiness: 5 },
        flags: { delivery_user: true },
        result: '你每天点外卖，快递小哥成了最熟悉的人。'
      },
      {
        text: '研究疫情对经济的影响',
        hint: '商业洞察',
        effects: { education: 18, tech_skill: 12, wealth: 10 },
        flags: { economic_analyst: true },
        result: '你分析疫情对各行业的影响，看到了一些投资机会。'
      }
    ]
  },

  {
    id: 'event_2020_tiktok_douyin',
    year: 2020,
    trigger: {
      ageRange: [15, 35],
      gender: null
    },
    title: '抖音崛起',
    description: '短视频成为主流内容形式，"抖"成为流行动词。',
    context: '2020年，抖音日活用户突破6亿，短视频彻底改变了内容消费习惯，"刷抖音"成为日常娱乐方式。',
    choices: [
      {
        text: '沉迷刷抖音',
        hint: '短视频成瘾',
        effects: { happiness: 10, social: 8, education: -10, health: -5 },
        flags: { tiktok_addict: true },
        result: '你每天刷抖音几个小时，时间不知不觉就过去了...'
      },
      {
        text: '做短视频创作者',
        hint: '创作之路',
        effects: { charm: 15, social: 18, tech_skill: 10, wealth: 10 },
        flags: { tiktok_creator: true },
        result: '你开始做短视频，慢慢积累了一些粉丝，还赚到了钱！'
      },
      {
        text: '理性使用，不沉迷',
        hint: '自我控制',
        effects: { happiness: 5, education: 5 },
        flags: { digital_wellness: true },
        result: '你偶尔刷刷抖音，但不会让它影响正常生活。'
      }
    ]
  },

  // ===== 2021年 =====
  {
    id: 'event_2021_double_reduction',
    year: 2021,
    trigger: {
      ageRange: [18, 45],
      gender: null
    },
    title: '双减政策',
    description: '教育部出台"双减"政策，校外培训机构遭受重创。',
    context: '2021年7月，"双减"政策落地，严禁学科类培训机构资本化运作，新东方、好未来等教育股暴跌。',
    choices: [
      {
        text: '在教培行业工作，失业了',
        hint: '职业危机',
        effects: { wealth: -30, happiness: -20 },
        flags: { edu_crisis: true },
        result: '你在教育培训机构工作，政策出台后失业了，需要重新规划职业...'
      },
      {
        text: '庆幸自己不在教培行业',
        hint: '幸运',
        effects: { happiness: 10 },
        result: '你虽然同情受影响的人，但庆幸自己不在那个行业。'
      },
      {
        text: '研究政策背后的考量',
        hint: '政策研究',
        effects: { education: 18, tech_skill: 8 },
        flags: { policy_analyst: true },
        result: '你深入研究了"双减"政策，理解了国家对教育的长远规划。'
      }
    ]
  },

  {
    id: 'event_2021_metaverse',
    year: 2021,
    trigger: {
      ageRange: [20, 45],
      gender: null
    },
    title: '元宇宙概念',
    description: 'Facebook改名Meta，"元宇宙"成为年度热词。',
    context: '2021年10月，Facebook宣布更名为Meta，All in元宇宙。虚拟土地、NFT等概念火热，被认为将取代移动互联网。',
    choices: [
      {
        text: '购买虚拟土地/NFT',
        hint: '投机心态',
        effects: { wealth: -20, happiness: 5, education: 5 },
        flags: { metaverse_investor: true },
        result: '你花真金白银买虚拟资产，期待升值...'
      },
      {
        text: '学习VR/AR相关技术',
        hint: '技术前瞻',
        effects: { tech_skill: 20, education: 15, wealth: 10 },
        flags: { metaverse_developer: true },
        result: '你相信元宇宙是未来，开始学习相关开发技术。'
      },
      {
        text: '认为这是泡沫，不参与',
        hint: '理性判断',
        effects: { education: 8 },
        flags: { bubble_skeptic: true },
        result: '你觉得这像当年的区块链泡沫，选择观望。'
      }
    ]
  },

  {
    id: 'event_2021_female_refusal',
    year: 2021,
    trigger: {
      ageRange: [20, 35],
      gender: 'female'
    },
    title: '拒绝身材焦虑',
    description: '"身材焦虑"话题引发讨论，"A4腰""直角肩"等审美标准被质疑。',
    context: '2021年，关于"身材焦虑"的讨论增多，越来越多的女性开始拒绝单一审美标准，倡导多元美。',
    choices: [
      {
        text: '接受自己的身体',
        hint: '自信心态',
        effects: { charm: 15, happiness: 15, health: 10 },
        flags: { body_positive: true },
        result: '你不再为不符合标准而焦虑，接受真实的自己！'
      },
      {
        text: '继续努力保持身材',
        hint: '自律',
        effects: { health: 15, charm: 5, happiness: -5 },
        flags: { fitness_enthusiast: true },
        result: '你坚持健身，觉得自律让自己更自信。'
      },
      {
        text: '关注内在美',
        hint: '价值观转变',
        effects: { charm: 18, education: 12 },
        flags: { inner_beauty_advocate: true },
        result: '你意识到内在美更重要，不再过度关注外表。'
      }
    ]
  },

  // ===== 2022年 =====
  {
    id: 'event_2022_dongbei_chaoren',
    year: 2022,
    trigger: {
      ageRange: [15, 40],
      gender: null
    },
    title: '东方甄选爆红',
    description: '新东方老师董宇辉双语直播带货，"知识带货"成为现象。',
    context: '2022年6月，新东方转型直播带货，老师董宇辉以双语教学式直播爆红，"知识就是力量"有了新诠释。',
    choices: [
      {
        text: '被董宇辉的故事感动',
        hint: '情感共鸣',
        effects: { happiness: 12, education: 10 },
        flags: { dong_fan: true },
        result: '你被董宇辉的故事和才华打动，支持东方甄选。'
      },
      {
        text: '学习他的表达方式',
        hint: '技能提升',
        effects: { charm: 15, education: 12, social: 10 },
        flags: { communication_learner: true },
        result: '你学习董宇辉的表达技巧，自己的沟通能力提升。'
      },
      {
                        text: '思考教育行业的转型',
        hint: '行业洞察',
        effects: { education: 18, tech_skill: 10, wealth: 8 },
        flags: { industry_transformer: true },
        result: '你深入思考了教育行业的转型，看到了新的机会。'
      }
    ]
  },

  {
    id: 'event_2022_shenzhen_beijing_lockdown',
    year: 2022,
    trigger: {
      ageRange: [18, 45],
      gender: null
    },
    title: '各地封控',
    description: '上海、北京、深圳等多个大城市实施封控管理。',
    context: '2022年，多座城市因疫情实施封控，物资短缺、就医困难等问题频发，引发社会讨论。',
    choices: [
      {
        text: '积极配合封控',
        hint: '公民责任',
        effects: { health: 10, charm: 10, happiness: -15 },
        flags: { responsible_citizen: true },
        result: '你严格遵守封控规定，虽然很难，但坚持下来了。'
      },
      {
        text: '被封控影响很大',
        hint: '生活困难',
        effects: { wealth: -20, happiness: -20, health: -10 },
        flags: { lockdown_affected: true },
        result: '你被封控了，工作收入受影响，生活很困难...'
      },
      {
        text: '做社区志愿者',
        hint: '帮助他人',
        effects: { social: 20, charm: 15, happiness: 10, health: -5 },
        flags: { community_volunteer: true },
        result: '你成为社区志愿者，帮助邻居解决问题，很有成就感！'
      }
    ]
  },

  // ===== 2023年 =====
  {
    id: 'event_2023_chatgpt',
    year: 2023,
    trigger: {
      ageRange: [18, 50],
      gender: null
    },
    title: 'ChatGPT爆发',
    description: 'OpenAI发布ChatGPT，AI能力震惊世界，"AI会不会取代我"成为职场焦虑。',
    context: '2023年，ChatGPT展现出的强大能力让各行各业震惊，程序员、设计师、作家等职业开始思考被AI取代的可能性。',
    choices: [
      {
        text: '学习使用AI工具',
        hint: '技术红利',
        effects: { tech_skill: 20, education: 15, wealth: 15 },
        flags: { ai_adopter: true },
        result: '你积极学习AI工具，将其作为助手，工作效率大幅提升！'
      },
      {
        text: '担心被AI取代',
        hint: '职业焦虑',
        effects: { happiness: -15, education: 5 },
        flags: { ai_anxiety: true },
        result: '你很焦虑，担心自己的工作会被AI取代。'
      },
      {
        text: '认为AI是工具，不是威胁',
        hint: '理性态度',
        effects: { tech_skill: 12, education: 10 },
        flags: { ai_rationalist: true },
        result: '你认为AI是提高效率的工具，不会取代有创造力的人。'
      }
    ]
  },

  {
    id: 'event_2023_cola_girls',
    year: 2023,
    trigger: {
      ageRange: [15, 35],
      gender: 'female'
    },
    title: '多巴胺穿搭',
    description: '"多巴胺穿搭"成为流行趋势，强调用鲜艳色彩表达情绪。',
    context: '2023年，"多巴胺穿搭"在小红书等平台爆火，强调用高饱和度色彩带来快乐。',
    choices: [
      {
        text: '尝试多巴胺穿搭',
        hint: '时尚尝试',
        effects: { charm: 15, happiness: 15, social: 10 },
        flags: { fashion_trend_follower: true },
        result: '你尝试了多巴胺穿搭，心情真的变好了！'
      },
      {
        text: '保持自己风格',
        hint: '坚持自我',
        effects: { charm: 8, happiness: 5 },
        flags: { personal_style: true },
        result: '你有自己的穿搭风格，不会盲目跟风。'
      },
      {
        text: '研究色彩心理学',
        hint: '学术兴趣',
        effects: { education: 15, charm: 12 },
        flags: { color_psychology_interest: true },
        result: '你对色彩如何影响情绪产生了学术兴趣。'
      }
    ]
  },

  {
    id: 'event_2023_city_walk',
    year: 2023,
    trigger: {
      ageRange: [18, 40],
      gender: null
    },
    title: 'City Walk',
    description: '"City Walk"成为年轻人休闲新方式，用脚步丈量城市。',
    context: '2023年，"City Walk"（城市漫步）成为流行生活方式，年轻人不再打卡网红景点，而是探索城市的小巷角落。',
    choices: [
      {
        text: '沉迷City Walk',
        hint: '城市探索',
        effects: { health: 15, happiness: 12, charm: 8 },
        flags: { city_walker: true },
        result: '你每个周末都去City Walk，发现了城市的另一面！'
      },
      {
                        text: '偶尔参与，不沉迷',
        hint: '适度休闲',
        effects: { health: 8, happiness: 8 },
        result: '你偶尔和朋友一起去散步，但不会特意追求。'
      },
      {
        text: '觉得是营销概念',
        hint: '理性态度',
        effects: { education: 8 },
        flags: { trend_skeptic: true },
        result: '你觉得这就是换个说法的逛街，没什么特别的。'
      }
    ]
  },

  // ===== 2024年 =====
  {
    id: 'event_2024_black_myth_wukong',
    year: 2024,
    trigger: {
      ageRange: [15, 45],
      gender: null
    },
    title: '《黑神话：悟空》',
    description: '国产3A游戏《黑神话：悟空》发布，震撼全球游戏界。',
    context: '2024年8月，游戏科学发布《黑神话：悟空》，被评价为"中国第一款真正的3A游戏"，预售量创纪录。',
    choices: [
      {
        text: '预购并通宵玩游戏',
        hint: '游戏玩家',
        effects: { happiness: 20, social: 12, health: -8 },
        flags: { wukong_player: true },
        result: '你被《黑神话》的震撼画面折服，为国产游戏骄傲！'
      },
      {
        text: '关注游戏行业',
        hint: '行业观察',
        effects: { education: 12, tech_skill: 10 },
        flags: { game_industry_observer: true },
        result: '你分析了中国游戏产业的发展，认为这是里程碑。'
      },
      {
        text: '对游戏不感兴趣',
        hint: '不玩游戏',
        effects: { education: 5 },
        flags: { non_gamer: true },
        result: '你不玩游戏，但感受到了全民热议的氛围。'
      }
    ]
  },

  {
    id: 'event_2024_cruise_travel',
    year: 2024,
    trigger: {
      ageRange: [20, 50],
      gender: null
    },
    title: '邮轮旅游热',
    description: '疫情后邮轮旅游报复性增长，爱达邮轮等国产邮轮崛起。',
    context: '2024年，邮轮旅游迎来爆发式增长，国产邮轮"爱达·魔都号"开启商业首航，被视为中国邮轮产业元年。',
    choices: [
      {
        text: '体验邮轮旅游',
        hint: '享受生活',
        effects: { happiness: 20, health: 10, social: 10, wealth: -15 },
        flags: { cruise_traveler: true },
        result: '你体验了邮轮旅游，在海上享受惬意时光！'
      },
      {
                        text: '觉得太贵，选择其他旅行',
        hint: '理性消费',
        effects: { happiness: 10, health: 8 },
        flags: { budget_traveler: true },
        result: '你选择了其他旅行方式，同样很开心。'
      },
      {
        text: '研究邮轮产业链',
        hint: '商业嗅觉',
        effects: { education: 15, tech_skill: 10, wealth: 12 },
        flags: { cruise_industry_analyst: true },
        result: '你分析了邮轮产业的机会，看到了投资价值。'
      }
    ]
  },

  // ===== 2025年 =====
  {
    id: 'event_2025_reflection',
    year: 2025,
    trigger: {
      ageRange: [10, 50],
      gender: null
    },
    title: '回顾这20年',
    description: '2005-2025，你经历了人生最重要的20年。是时候回顾和总结了。',
    context: '2025年，你站在人生的十字路口。20年前，你还是懵懂少年；20年后，你已经历了太多变迁。',
    choices: [
      {
        text: '这20年我很满意',
        hint: '无悔人生',
        effects: { happiness: 20, charm: 10 },
        flags: { life_satisfied: true },
        result: '你回望这20年，虽然艰难，但你很满意自己的选择。'
      },
      {
        text: '如果可以重来...',
        hint: '遗憾与思考',
        effects: { education: 15, happiness: -10 },
        flags: { life_regret: true },
        result: '你有很多遗憾，但也明白人生没有如果。'
      },
      {
        text: '未来还很长，继续努力',
        hint: '积极向上',
        effects: { happiness: 15, education: 10, wealth: 10 },
        flags: { life_optimist: true },
        result: '你认为过去的20年是积累，未来还有无限可能！'
      }
    ]
  },

  // ===== 通用事件（任何年份都可能触发） =====
  {
    id: 'event_general_fall_in_love',
    year: null, // null表示任何年份
    trigger: {
      ageRange: [18, 35],
      gender: null,
      randomChance: 0.1 // 10%概率每年触发
    },
    title: '邂逅爱情',
    description: '你在某个场合遇到了特别的人，心动的感觉...',
    context: '爱情总是在最意想不到的时候降临。',
    choices: [
      {
        text: '勇敢表白',
        hint: '主动出击',
        effects: { happiness: 20, charm: 10, social: 15 },
        flags: { in_relationship: true },
        result: '你鼓起勇气表白，对方答应了！你开始了甜蜜的恋情。'
      },
      {
        text: '默默关注，慢慢发展',
        hint: '谨慎态度',
        effects: { charm: 8, social: 10 },
        flags: { secret_crush: true },
        result: '你选择慢慢了解对方，让感情自然发展。'
      },
      {
        text: '觉得时机不对，放弃',
        hint: '理性选择',
        effects: { happiness: -5 },
        flags: { missed_love: true },
        result: '你觉得现在不是合适的时候，选择放弃。'
      }
    ]
  },

  {
    id: 'event_general_job_promotion',
    year: null,
    trigger: {
      ageRange: [22, 45],
      gender: null,
      randomChance: 0.08
    },
    title: '升职机会',
    description: '公司有一个升职机会，你有机会竞争。',
    context: '这是职业发展的关键时刻。',
    choices: [
      {
        text: '积极争取，准备充分',
        hint: '职业发展',
        effects: { wealth: 20, education: 10, social: 10, health: -5 },
        flags: { promoted: true },
        result: '你成功升职，薪资提升了！'
      },
      {
        text: '竞争失败，继续努力',
        hint: '挫折成长',
        effects: { education: 15, happiness: -10 },
        flags: { promotion_failed: true },
        result: '你没有得到这个机会，但积累了经验。'
      },
      {
        text: '不感兴趣，保持现状',
        hint: '知足常乐',
        effects: { happiness: 5, health: 5 },
        flags: { content_with_current: true },
        result: '你觉得现在的工作状态就很好，不需要升职。'
      }
    ]
  },

  {
    id: 'event_general_health_check',
    year: null,
    trigger: {
      ageRange: [25, 50],
      gender: null,
      randomChance: 0.1
    },
    title: '体检发现',
    description: '年度体检发现了一些健康问题。',
    context: '随着年龄增长，健康问题开始出现。',
    choices: [
      {
        text: '重视健康，改变生活方式',
        hint: '健康管理',
        effects: { health: 20, happiness: 5 },
        flags: { health_conscious: true },
        result: '你开始锻炼身体，注意饮食，健康状况改善！'
      },
      {
        text: '只是小问题，不在意',
        hint: '忽视健康',
        effects: { health: -10 },
        flags: { health_neglected: true },
        result: '你觉得问题不大，没有放在心上。'
      },
      {
        text: '定期复查，保持关注',
        hint: '谨慎态度',
        effects: { health: 10, education: 5 },
        flags: { health_monitored: true },
        result: '你定期复查，及时了解自己的健康状况。'
      }
    ]
  }
];

module.exports = eventsData;
