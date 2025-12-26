// 历史事件数据 - 2005-2025
// 去除政治相关事件,专注于娱乐、文化、科技、体育、生活等方面
// 包含历史大事件 + 日常事件,共200+事件

const eventsData = [
  // ==================== 2005年 ====================
  {
    id: 'event_2005_qq_show',
    year: 2005,
    category: 'entertainment',
    trigger: { ageRange: [10, 25], gender: null },
    title: 'QQ秀风靡',
    description: 'QQ秀成为了年轻人展示自我的重要方式。你的同学们都在讨论最新的QQ秀装扮。',
    context: '2005年,腾讯推出QQ秀虚拟形象系统,用户可以购买虚拟服装和道具装扮自己。这个功能迅速成为年轻人社交的必备元素。',
    choices: [
      {
        text: '花零花钱买一套炫酷QQ秀',
        hint: '社交+10,财富-5',
        effects: { social: 10, wealth: -5 },
        flags: { has_qq_show: true },
        result: '你花零花钱买了一套炫酷的QQ秀,同学们都夸你很有品味!'
      },
      {
        text: '觉得太幼稚,专注于学习',
        hint: '学识+5,但错过社交话题',
        effects: { education: 8, social: -5 },
        result: '你觉得QQ秀没什么意思,选择了专注于学习。'
      },
      {
        text: '学习PS自己制作头像',
        hint: '技术+10,开启创作之路',
        effects: { tech_skill: 12, charm: 5 },
        flags: { made_custom_avatar: true },
        result: '你开始学习PS,制作自己的QQ头像,这让你对设计产生了兴趣。'
      }
    ]
  },

  {
    id: 'event_2005_super_girl',
    year: 2005,
    category: 'entertainment',
    trigger: { ageRange: [12, 22], gender: null },
    title: '超级女声热潮',
    description: '超级女声比赛火热进行中,李宇春、周笔畅、张靓颖成为全民偶像。',
    context: '2005年,湖南卫视举办的超级女声创造了选秀奇迹,总决赛收视率超过央视春晚,开启了中国选秀时代。',
    choices: [
      {
        text: '疯狂投票支持喜欢的选手',
        hint: '社交+10,快乐+10,财富-3',
        effects: { social: 10, happiness: 10, wealth: -3 },
        flags: { super_fan: true },
        result: '你成了铁杆粉丝,熬夜投票,结识了很多志同道合的朋友!'
      },
      {
        text: '只是旁观,不参与投票',
        hint: '无变化',
        effects: { happiness: 3 },
        result: '你关注比赛,但没有沉迷其中。'
      },
      {
        text: '被激励,开始学习唱歌',
        hint: '魅力+10,快乐+8',
        effects: { charm: 10, happiness: 8 },
        flags: { interest_singing: true },
        result: '你被选手的表演激励,开始学习唱歌,梦想自己也能站在舞台上。'
      }
    ]
  },

  {
    id: 'event_2005_warcraft',
    year: 2005,
    category: 'game',
    trigger: { ageRange: [14, 28], gender: null },
    title: '魔兽世界国服公测',
    description: '《魔兽世界》在中国开启公测,无数玩家涌入艾泽拉斯大陆。',
    context: '2005年,暴雪的《魔兽世界》国服公测,这款MMORPG彻底改变了中国网游市场,成为一代人的青春记忆。',
    choices: [
      {
        text: '沉迷游戏,经常通宵',
        hint: '快乐+15,健康-10,学识-5',
        effects: { happiness: 15, health: -10, education: -5 },
        flags: { wow_addict: true },
        result: '你沉迷魔兽世界,经常"再来一个任务"到天亮...'
      },
      {
        text: '适度游戏,结识朋友',
        hint: '社交+12,快乐+8,健康-3',
        effects: { social: 12, happiness: 8, health: -3 },
        flags: { gamer: true },
        result: '你偶尔玩玩,在游戏中结识了很多朋友。'
      },
      {
        text: '完全不感兴趣',
        hint: '学识+5,健康+3',
        effects: { education: 5, health: 3 },
        result: '你对游戏不感兴趣,把时间用在其他事情上。'
      }
    ]
  },

  {
    id: 'event_2005_chen_yifa',
    year: 2005,
    category: 'entertainment',
    trigger: { ageRange: [12, 25], gender: 'male' },
    title: '陈亦菲出道',
    description: '陈亦菲主演《神雕侠侣》播出,清纯小龙女形象深入人心。',
    context: '2005年,陈亦菲版《神雕侠侣》播出,她饰演的小龙女被称为"最美小龙女",成为无数男性的梦中情人。',
    choices: [
      {
        text: '成为粉丝,追她的所有作品',
        hint: '快乐+8,魅力+3',
        effects: { happiness: 8, charm: 3 },
        flags: { has_idol: true, chen_yifa_fan: true },
        result: '你看了陈亦菲的所有作品,觉得她是完美女神。'
      },
      {
        text: '理性欣赏,不盲目追星',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你欣赏陈亦菲的美,但保持理性。'
      },
      {
        text: '开始学习武侠小说',
        hint: '学识+12,魅力+5',
        effects: { education: 12, charm: 5 },
        flags: { literature_lover: true },
        result: '你被电视剧吸引,开始阅读金庸的武侠小说。'
      }
    ]
  },

  // ==================== 2006年 ====================
  {
    id: 'event_2006_world_cup',
    year: 2006,
    category: 'sports',
    trigger: { ageRange: [10, 35], gender: null },
    title: '德国世界杯',
    description: '第18届世界杯在德国举行,齐达内头顶马特拉齐成为经典画面。',
    context: '2006年德国世界杯,齐达内在决赛中头顶马特拉齐被红牌罚下,意大利最终夺冠。这是很多80后90后的世界杯记忆。',
    choices: [
      {
        text: '熬夜看比赛,支持喜欢的球队',
        hint: '快乐+10,社交+8,健康-5',
        effects: { happiness: 10, social: 8, health: -5 },
        flags: { football_fan: true },
        result: '你熬夜看了很多场比赛,和同学们热烈讨论,虽然累但很充实!'
      },
      {
        text: '只看精彩集锦',
        hint: '快乐+5,健康-2',
        effects: { happiness: 5, health: -2 },
        result: '你关注比赛但不会熬夜,保持正常作息。'
      },
      {
        text: '不喜欢足球,完全不关注',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你对足球不感兴趣,专注在自己的事情上。'
      }
    ]
  },

  {
    id: 'event_2006_hu_ge',
    year: 2006,
    category: 'entertainment',
    trigger: { ageRange: [13, 25], gender: null },
    title: '胡歌车祸',
    description: '当红小生胡歌发生严重车祸,引发全网关注和祈福。',
    context: '2006年8月,胡歌在拍摄《射雕英雄传》途中遭遇车祸,助理张冕去世,胡歌重伤。这个事件让无数粉丝心碎。',
    choices: [
      {
        text: '在论坛发帖为他祈福',
        hint: '社交+8',
        effects: { social: 8 },
        flags: { netizen_active: true },
        result: '你在各大论坛发帖祈福,感受到了网络社群的力量。'
      },
      {
        text: '默默关注,不发表言论',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你默默关注新闻,思考生命的脆弱。'
      },
      {
        text: '开始关注交通安全',
        hint: '健康+5,学识+5',
        effects: { health: 5, education: 5 },
        flags: { safety_conscious: true },
        result: '这件事让你意识到安全的重要性,开始主动学习交通安全知识。'
      }
    ]
  },

  {
    id: 'event_2006_baidu_tieba',
    year: 2006,
    category: 'internet',
    trigger: { ageRange: [12, 28], gender: null },
    title: '百度贴吧崛起',
    description: '百度贴吧成为各种兴趣社群的聚集地,出现了很多神贴和梗。',
    context: '2006年前后,百度贴吧迅速崛起,"贾君鹏你妈妈喊你回家吃饭"等网络流行语诞生于此。',
    choices: [
      {
        text: '成为某个贴吧的活跃用户',
        hint: '社交+15,技术+5',
        effects: { social: 15, tech_skill: 5 },
        flags: { tieba_regular: true },
        result: '你成为了某个贴吧的常客,结识了很多志同道合的网友。'
      },
      {
        text: '偶尔浏览,不发帖',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你经常看贴吧的帖子,了解各种趣事。'
      },
      {
        text: '自己发帖尝试创作',
        hint: '魅力+10,技术+8,社交+10',
        effects: { charm: 10, tech_skill: 8, social: 10 },
        flags: { content_creator: true },
        result: '你开始写贴创作,获得了一些关注,这让你很有成就感。'
      }
    ]
  },

  // ==================== 2007年 ====================
  {
    id: 'event_2007_iphone',
    year: 2007,
    category: 'tech',
    trigger: { ageRange: [15, 35], gender: null },
    title: 'iPhone发布',
    description: '苹果发布第一代iPhone,重新定义了智能手机。',
    context: '2007年1月9日,史蒂夫·乔布斯发布第一代iPhone,多点触控屏幕和无物理键盘的设计震惊了整个科技界。',
    choices: [
      {
        text: '密切关注,梦想拥有一台',
        hint: '技术+10,快乐+5,财富-10',
        effects: { tech_skill: 10, happiness: 5, wealth: -10 },
        flags: { apple_fan: true },
        result: '你被iPhone深深吸引,开始关注苹果的一切产品。'
      },
      {
        text: '觉得太贵,继续用诺基亚',
        hint: '财富+5',
        effects: { wealth: 5 },
        result: '你觉得iPhone太贵了,诺基亚塞班系统够用了。'
      },
      {
        text: '学习它的创新设计理念',
        hint: '技术+15,学识+10',
        effects: { tech_skill: 15, education: 10 },
        flags: { design_interest: true },
        result: '你对iPhone的设计理念很感兴趣,开始研究UI/UX设计。'
      }
    ]
  },

  {
    id: 'event_2007_qq_pet',
    year: 2007,
    category: 'game',
    trigger: { ageRange: [10, 20], gender: null },
    title: 'QQ宠物',
    description: 'QQ宠物成为很多人的"电子伴侣",需要喂食、打扫、看病。',
    context: '2007年,QQ宠物达到巅峰,很多年轻人沉迷于照顾这只电子企鹅,甚至愿意花钱买各种道具。',
    choices: [
      {
        text: '领养一只,悉心照料',
        hint: '快乐+10,社交+5,财富-5',
        effects: { happiness: 10, social: 5, wealth: -5 },
        flags: { has_qq_pet: true },
        result: '你领养了QQ宠物,每天记得喂食,它成为了你的好伙伴。'
      },
      {
        text: '觉得浪费时间,不养',
        hint: '学识+5,技术+3',
        effects: { education: 5, tech_skill: 3 },
        result: '你觉得QQ宠物很无聊,没有领养。'
      },
      {
        text: '研究背后的商业模式',
        hint: '技术+10,财富+5,学识+8',
        effects: { tech_skill: 10, wealth: 5, education: 8 },
        flags: { business_mindset: true },
        result: '你对QQ宠物的充值模式很感兴趣,开始思考虚拟产品的商业模式。'
      }
    ]
  },

  {
    id: 'event_2007_stranglehold',
    year: 2007,
    category: 'entertainment',
    trigger: { ageRange: [14, 28], gender: 'male' },
    title: '《色戒》上映',
    description: '李安导演的《色戒》上映,引发巨大争议和讨论。',
    context: '2007年,李安执导的《色戒》上映,因大胆的激情戏份引发热议,成为当年最受关注的电影之一。',
    choices: [
      {
        text: '冲着争议去看电影',
        hint: '社交+10,学识+5',
        effects: { social: 10, education: 5 },
        flags: { movie_goer: true },
        result: '你看了电影,被梁朝伟和陈亦菲的演技折服。'
      },
      {
        text: '觉得不适合,不看',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你觉得这种电影不适合自己,没有去看。'
      },
      {
        text: '开始关注李安的其他作品',
        hint: '学识+15,魅力+8',
        effects: { education: 15, charm: 8 },
        flags: { film_enthusiast: true },
        result: '你被李安的电影才华吸引,补看了他的其他作品。'
      }
    ]
  },

  // ==================== 2008年 ====================
  {
    id: 'event_2008_beijing_olympics',
    year: 2008,
    category: 'sports',
    trigger: { ageRange: [8, 40], gender: null },
    title: '北京奥运会',
    description: '8月8日晚8点,北京奥运会开幕式震撼世界!',
    context: '2008年8月8日,北京奥运会开幕式在鸟巢举行,张艺谋导演的表演让全世界惊叹。这是中国人的骄傲时刻。',
    choices: [
      {
        text: '守在电视机前看直播',
        hint: '快乐+15,社交+10,健康-3',
        effects: { happiness: 15, social: 10, health: -3 },
        flags: { olympics_witness: true },
        result: '你全家人一起看开幕式,当李宁点燃火炬时,你热泪盈眶!'
      },
      {
        text: '去北京现场观赛',
        hint: '快乐+20,社交+15,财富-20',
        effects: { happiness: 20, social: 15, wealth: -20 },
        flags: { olympics_visitor: true },
        result: '你有机会去北京看了比赛,这是一生难忘的经历!'
      },
      {
        text: '对体育不感兴趣',
        hint: '学识+3',
        effects: { education: 3 },
        result: '奥运会很热闹,但你还是更喜欢做自己喜欢的事情。'
      }
    ]
  },

  {
    id: 'event_2008_kung_fu_panda',
    year: 2008,
    category: 'entertainment',
    trigger: { ageRange: [8, 25], gender: null },
    title: '《功夫熊猫》上映',
    description: '梦工厂的《功夫熊猫》在中国上映,融合中国元素的好莱坞动画。',
    context: '2008年,《功夫熊猫》上映,这只胖熊猫阿宝用中国功夫征服了观众,全球票房大卖。',
    choices: [
      {
        text: '去电影院观看',
        hint: '快乐+12,社交+8,财富-5',
        effects: { happiness: 12, social: 8, wealth: -5 },
        flags: { panda_fan: true },
        result: '你被阿宝的故事感动,学会了"做你自己"的道理。'
      },
      {
        text: '不感兴趣,不看',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你觉得这就是部普通动画,没有特别关注。'
      },
      {
        text: '开始对中国功夫感兴趣',
        hint: '健康+10,学识+8',
        effects: { health: 10, education: 8 },
        flags: { martial_arts_interest: true },
        result: '你被电影激发,开始学习中国功夫的历史和文化。'
      }
    ]
  },

  {
    id: 'event_2008_stephen_chow',
    year: 2008,
    category: 'entertainment',
    trigger: { ageRange: [12, 30], gender: null },
    title: '《长江七号》上映',
    description: '周星驰的科幻喜剧《长江七号》上映。',
    context: '2008年,周星驰自导自演的《长江七号》上映,外星小狗"七仔"成为很多孩子的梦想宠物。',
    choices: [
      {
        text: '第一时间去电影院',
        hint: '快乐+15,社交+10,财富-8',
        effects: { happiness: 15, social: 10, wealth: -8 },
        flags: { stephen_chow_fan: true },
        result: '你笑得肚子疼,周星驰的无厘头喜剧永远不会让你失望!'
      },
      {
        text: '等视频网站上线再看',
        hint: '快乐+8,财富+3',
        effects: { happiness: 8, wealth: 3 },
        result: '你省了电影票钱,在家也看得很开心。'
      },
      {
        text: '觉得周星驰过气了,不看',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你觉得周星驰的喜剧风格已经过时了。'
      }
    ]
  },

  // ==================== 2009年 ====================
  {
    id: 'event_2009_sina_weibo',
    year: 2009,
    category: 'internet',
    trigger: { ageRange: [15, 35], gender: null },
    title: '新浪微博上线',
    description: '新浪微博内测上线,开启了"微博时代"。',
    context: '2009年8月,新浪微博上线,140字限制的短内容迅速成为主流,改变了人们获取信息和社交的方式。',
    choices: [
      {
        text: '立即注册,成为早期用户',
        hint: '社交+15,技术+8',
        effects: { social: 15, tech_skill: 8 },
        flags: { weibo_early_user: true },
        result: '你成为了微博早期用户,结识了很多有趣的人。'
      },
      {
        text: '观望一段时间再决定',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你先看看别人怎么说,没有急于注册。'
      },
      {
        text: '尝试做自媒体',
        hint: '魅力+12,社交+15,技术+10',
        effects: { charm: 12, social: 15, tech_skill: 10 },
        flags: { weibo_influencer: true },
        result: '你开始在微博上创作内容,慢慢积累了一些粉丝。'
      }
    ]
  },

  {
    id: 'event_2009_jay_chou',
    year: 2009,
    category: 'music',
    trigger: { ageRange: [12, 28], gender: null },
    title: '周杰伦新专辑',
    description: '周杰伦发布新专辑,继续统治华语乐坛。',
    context: '2009年,周杰伦发布专辑,包括《稻香》《说好的幸福呢》等经典歌曲,80后90后的青春回忆。',
    choices: [
      {
        text: '买专辑,每天循环播放',
        hint: '快乐+12,社交+8,财富-3',
        effects: { happiness: 12, social: 8, wealth: -3 },
        flags: { jay_fan: true },
        result: '周杰伦的歌陪伴你度过了很多时光,每首歌都能哼唱。'
      },
      {
        text: '偶尔听听,不是铁粉',
        hint: '快乐+5',
        effects: { happiness: 5 },
        result: '你听过几首歌,觉得还不错。'
      },
      {
        text: '开始学习音乐创作',
        hint: '魅力+15,快乐+10,技术+5',
        effects: { charm: 15, happiness: 10, tech_skill: 5 },
        flags: { music_creator: true },
        result: '你被周杰伦的音乐启发,开始尝试创作自己的歌曲。'
      }
    ]
  },

  {
    id: 'event_2009_2012',
    year: 2009,
    category: 'movie',
    trigger: { ageRange: [14, 30], gender: null },
    title: '《2012》上映',
    description: '灾难片《2012》上映,引发对世界末日的讨论。',
    context: '2009年,罗兰·艾默里奇执导的《2012》上映,震撼的灾难场面让玛雅预言再次成为热门话题。',
    choices: [
      {
        text: '被特效震撼,去电影院看',
        hint: '快乐+12,社交+8,财富-10',
        effects: { happiness: 12, social: 8, wealth: -10 },
        flags: { movie_fan: true },
        result: '你在IMAX影院观看,灾难场面震撼到让你屏住呼吸!'
      },
      {
        text: '对末日预言产生兴趣',
        hint: '学识+12,魅力-3',
        effects: { education: 12, charm: -3 },
        flags: { doomsday_interest: true },
        result: '你开始研究各种末日预言,但越研究越害怕。'
      },
      {
        text: '觉得是商业片,不感兴趣',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你觉得这就是部普通的灾难片,没有特别关注。'
      }
    ]
  },

  // ==================== 2010年 ====================
  {
    id: 'event_2010_iphone4',
    year: 2010,
    category: 'tech',
    trigger: { ageRange: [18, 40], gender: null },
    title: 'iPhone 4发布',
    description: '史蒂夫·乔布斯发布iPhone 4,"再一次,改变一切"。',
    context: '2010年6月,iPhone 4发布,Retina屏幕、FaceTime视频通话、前置摄像头,成为经典中的经典。',
    choices: [
      {
        text: '排队购买,成为第一批用户',
        hint: '技术+10,快乐+15,社交+10,财富-30',
        effects: { tech_skill: 10, happiness: 15, social: 10, wealth: -30 },
        flags: { iphone4_user: true },
        result: '你花了一个月工资买iPhone 4,但是太值了!'
      },
      {
        text: '等待降价再买',
        hint: '财富+10,快乐+5',
        effects: { wealth: 10, happiness: 5 },
        flags: { rational_consumer: true },
        result: '你决定等价格降下来再说,把钱用在更重要的事情上。'
      },
      {
        text: '继续用安卓,不换iPhone',
        hint: '技术+8',
        effects: { tech_skill: 8 },
        flags: { android_user: true },
        result: '你觉得安卓更自由,坚持不换iPhone。'
      }
    ]
  },

  {
    id: 'event_2010_avatar',
    year: 2010,
    category: 'movie',
    trigger: { ageRange: [12, 35], gender: null },
    title: '《阿凡达》上映',
    description: '詹姆斯·卡梅隆的《阿凡达》在中国上映,3D技术震撼观众。',
    context: '2010年,《阿凡达》在中国上映,IMAX 3D版一票难求,最终成为中国影史票房冠军。',
    choices: [
      {
        text: '花高价买IMAX 3D票',
        hint: '快乐+18,社交+12,财富-15',
        effects: { happiness: 18, social: 12, wealth: -15 },
        flags: { avatar_fan: true },
        result: '你在IMAX影院观看,潘多拉星球的美丽让你震撼!'
      },
      {
        text: '等普通版本或网上看',
        hint: '快乐+10,财富+5',
        effects: { happiness: 10, wealth: 5 },
        result: '你省了钱,但视觉效果打了不少折扣。'
      },
      {
        text: '对科幻电影不感兴趣',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你觉得这就是部特效大片,没有特别关注。'
      }
    ]
  },

  {
    id: 'event_2010_shanghai_expo',
    year: 2010,
    category: 'culture',
    trigger: { ageRange: [10, 40], gender: null },
    title: '上海世博会',
    description: '上海举办世界博览会,主题"城市,让生活更美好"。',
    context: '2010年上海世博会,246个国家和国际组织参展,参观人数超过7300万,创历史纪录。',
    choices: [
      {
        text: '去上海参观世博会',
        hint: '快乐+15,学识+12,社交+8,财富-15',
        effects: { happiness: 15, education: 12, social: 8, wealth: -15 },
        flags: { expo_visitor: true },
        result: '你在上海玩了几天,看了各国展馆,增长了见识!'
      },
      {
        text: '通过电视和网络关注',
        hint: '学识+8,快乐+5',
        effects: { education: 8, happiness: 5 },
        result: '你虽然没去现场,但看了很多报道和直播。'
      },
      {
        text: '做世博会志愿者',
        hint: '社交+20,快乐+15,魅力+10',
        effects: { social: 20, happiness: 15, charm: 10 },
        flags: { expo_volunteer: true },
        result: '你成为了世博会志愿者"小白菜",帮助了很多游客!'
      }
    ]
  },

  // ==================== 2011年 ====================
  {
    id: 'event_2011_wechat',
    year: 2011,
    category: 'internet',
    trigger: { ageRange: [18, 40], gender: null },
    title: '微信发布',
    description: '腾讯发布微信1.0版本,移动互联网时代开启。',
    context: '2011年1月,微信发布,初期只有即时通讯功能。后来加入的朋友圈、公众号等功能彻底改变了社交网络格局。',
    choices: [
      {
        text: '立即下载并邀请好友',
        hint: '社交+15,技术+10',
        effects: { social: 15, tech_skill: 10 },
        flags: { wechat_early_user: true },
        result: '你成了微信早期用户,见证了它的成长。'
      },
      {
        text: '继续用QQ和短信',
        hint: '社交+3',
        effects: { social: 3 },
        result: '你觉得QQ和短信已经够用,不需要新应用。'
      },
      {
        text: '研究微信的产品设计',
        hint: '技术+18,学识+12,财富+8',
        effects: { tech_skill: 18, education: 12, wealth: 8 },
        flags: { product_manager_mindset: true },
        result: '你对微信的产品设计很感兴趣,开始研究移动互联网产品。'
      }
    ]
  },

  // ==================== 2012年 ====================
  {
    id: 'event_2012_gangnam_style',
    year: 2012,
    category: 'entertainment',
    trigger: { ageRange: [10, 35], gender: null },
    title: '江南Style',
    description: '韩国歌手PSY的《江南Style》爆红全球,骑马舞风靡一时。',
    context: '2012年,《江南Style》成为YouTube史上首个点击量超过10亿的视频,骑马舞成为全球流行文化现象。',
    choices: [
      {
        text: '学习骑马舞,和朋友一起跳',
        hint: '快乐+12,社交+15,健康+3',
        effects: { happiness: 12, social: 15, health: 3 },
        flags: { dance_enthusiast: true },
        result: '你和同事朋友聚会时跳骑马舞,玩得很开心!'
      },
      {
        text: '觉得太傻,不参与',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你觉得这太幼稚了,没有跟风。'
      },
      {
        text: '研究它为什么这么火',
        hint: '技术+12,学识+10,社交+8',
        effects: { tech_skill: 12, education: 10, social: 8 },
        flags: { viral_analyzer: true },
        result: '你分析了这首歌爆红的原因,对病毒式传播有了新认识。'
      }
    ]
  },

  {
    id: 'event_2012_got',
    year: 2012,
    category: 'entertainment',
    trigger: { ageRange: [16, 35], gender: null },
    title: '《权力的游戏》热播',
    description: 'HBO美剧《权力的游戏》开始在中国流行。',
    context: '2012年,《权力的游戏》第二季播出,这部史诗奇幻剧在中国美剧迷中迅速走红。',
    choices: [
      {
        text: '追剧,成为铁粉',
        hint: '快乐+15,学识+10,社交+10',
        effects: { happiness: 15, education: 10, social: 10 },
        flags: { got_fan: true },
        result: '你被剧中的复杂剧情和角色吸引,每集都追!'
      },
      {
        text: '偶尔看看,不沉迷',
        hint: '快乐+8',
        effects: { happiness: 8 },
        result: '你看了几集,觉得制作精良,但没有追完。'
      },
      {
        text: '开始阅读原著小说',
        hint: '学识+20,魅力+8',
        effects: { education: 20, charm: 8 },
        flags: { book_lover: true },
        result: '你被剧集吸引,开始阅读乔治·马丁的原著小说。'
      }
    ]
  },

  // ==================== 2013年 ====================
  {
    id: 'event_2013_shejian_shang_de_zhongguo',
    year: 2013,
    category: 'culture',
    trigger: { ageRange: [15, 40], gender: null },
    title: '舌尖上的中国',
    description: '纪录片《舌尖上的中国》热播,引发美食文化热潮。',
    context: '2013年,《舌尖上的中国第二季》播出,以美食为切入点展现中国传统文化和人文情怀。',
    choices: [
      {
        text: '追着看,边看边流口水',
        hint: '快乐+12,健康-5,财富-5',
        effects: { happiness: 12, health: -5, wealth: -5 },
        flags: { foodie: true },
        result: '你看了纪录片,尝试了很多地方美食。'
      },
      {
        text: '对传统文化感兴趣',
        hint: '学识+12,魅力+8',
        effects: { education: 12, charm: 8 },
        flags: { culture_lover: true },
        result: '你被纪录片中的传统文化深深吸引。'
      },
      {
        text: '开始学习做饭',
        hint: '健康+10,快乐+8,魅力+5',
        effects: { health: 10, happiness: 8, charm: 5 },
        flags: { cooking_skill: true },
        result: '你受到启发,开始学习做菜,厨艺大有长进!'
      }
    ]
  },

  {
    id: 'event_2013_grand_budapest_hotel',
    year: 2013,
    category: 'movie',
    trigger: { ageRange: [16, 35], gender: null },
    title: '《布达佩斯大饭店》上映',
    description: '韦斯·安德森的《布达佩斯大饭店》上映,独特美学风格。',
    context: '2013年,韦斯·安德森执导的《布达佩斯大饭店》上映,对称构图和糖果色调成为文艺青年追捧的审美风格。',
    choices: [
      {
        text: '被独特美学吸引',
        hint: '魅力+15,学识+10',
        effects: { charm: 15, education: 10 },
        flags: { art_house_fan: true },
        result: '你被电影的视觉风格深深吸引,开始关注韦斯·安德森的其他作品。'
      },
      {
        text: '觉得太文艺,看不下去',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你看了一半就睡着了,觉得这类电影不适合自己。'
      },
      {
        text: '开始学习摄影和构图',
        hint: '技术+15,魅力+12',
        effects: { tech_skill: 15, charm: 12 },
        flags: { photography_interest: true },
        result: '你对电影中的对称构图产生兴趣,开始学习摄影技巧。'
      }
    ]
  },

  // ==================== 2014年 ====================
  {
    id: 'event_2014_ice_bucket_challenge',
    year: 2014,
    category: 'entertainment',
    trigger: { ageRange: [15, 40], gender: null },
    title: '冰桶挑战',
    description: '"冰桶挑战"在全球蔓延,旨在关注渐冻症患者。',
    context: '2014年,冰桶挑战风靡全球,包括比尔·盖茨、马克·扎克伯格等名人都参与,为渐冻症研究筹集善款。',
    choices: [
      {
        text: '接受挑战并捐赠',
        hint: '社交+15,快乐+10,魅力+10,财富-5',
        effects: { social: 15, happiness: 10, charm: 10, wealth: -5 },
        flags: { charity_participant: true },
        result: '你冰水浇头还捐了款,感觉自己做了一件有意义的事!'
      },
      {
        text: '只捐款,不浇冰水',
        hint: '魅力+8,快乐+5,财富-5',
        effects: { charm: 8, happiness: 5, wealth: -5 },
        flags: { charity_donor: true },
        result: '你捐了款,但觉得冰水只是形式,没必要参与。'
      },
      {
        text: '关注渐冻症本身',
        hint: '学识+15,魅力+8',
        effects: { education: 15, charm: 8 },
        flags: { medical_interest: true },
        result: '你借机了解了渐冻症,对罕见病群体有了更多认识。'
      }
    ]
  },

  {
    id: 'event_2014_uber_didi',
    year: 2014,
    category: 'internet',
    trigger: { ageRange: [18, 40], gender: null },
    title: '网约车大战',
    description: 'Uber和滴滴展开补贴大战,打车几乎不要钱。',
    context: '2014年,Uber进入中国,与滴滴展开激烈竞争,双方投入巨额补贴,用户打车只需几毛钱甚至免费。',
    choices: [
      {
        text: '薅羊毛,天天坐专车',
        hint: '财富+10,快乐+10,社交+5',
        effects: { wealth: 10, happiness: 10, social: 5 },
        flags: { deal_hunter: true },
        result: '你每天上下班都坐专车,省了很多钱!'
      },
      {
        text: '觉得不安全,坚持坐公交',
        hint: '健康+5',
        effects: { health: 5 },
        result: '你对私家车运营持保留态度,坚持坐公共交通。'
      },
      {
        text: '研究共享经济模式',
        hint: '技术+15,学识+12,财富+8',
        effects: { tech_skill: 15, education: 12, wealth: 8 },
        flags: { sharing_economy_analyst: true },
        result: '你对共享经济模式很感兴趣,思考未来的商业机会。'
      }
    ]
  },

  {
    id: 'event_2014_interstellar',
    year: 2014,
    category: 'movie',
    trigger: { ageRange: [14, 35], gender: null },
    title: '《星际穿越》上映',
    description: '克里斯托弗·诺兰的《星际穿越》上映,硬科幻引发讨论。',
    context: '2014年,诺兰执导的《星际穿越》上映,复杂的科学理论和感人的父女情让观众讨论至今。',
    choices: [
      {
        text: '去电影院看,被深深感动',
        hint: '快乐+18,学识+15,财富-10',
        effects: { happiness: 18, education: 15, wealth: -10 },
        flags: { nolan_fan: true },
        result: '你被电影中父女情感动,泪洒影院!'
      },
      {
        text: '看不懂科学理论',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你看了电影,但虫洞、黑洞这些理论让你一头雾水。'
      },
      {
        text: '开始学习天体物理学',
        hint: '学识+20,技术+10',
        effects: { education: 20, tech_skill: 10 },
        flags: { physics_interest: true },
        result: '你被电影激发,开始学习相对论和黑洞知识。'
      }
    ]
  },

  // ==================== 2015年 ====================
  {
    id: 'event_2015_wandering_earth',
    year: 2015,
    category: 'entertainment',
    trigger: { ageRange: [12, 30], gender: null },
    title: '《流浪地球》小说走红',
    description: '刘慈欣的科幻小说《流浪地球》因电影筹备而受到关注。',
    context: '2015年,《流浪地球》电影开始筹备,刘慈欣的科幻作品在《三体》获奖后更受关注。',
    choices: [
      {
        text: '阅读原著小说',
        hint: '学识+18,魅力+8',
        effects: { education: 18, charm: 8 },
        flags: { sci_fi_reader: true },
        result: '你被刘慈欣的想象力震撼,开始追他的所有作品。'
      },
      {
        text: '对科幻不感兴趣',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你觉得科幻小说太遥远,没有特别关注。'
      },
      {
        text: '开始关注中国科幻',
        hint: '学识+15,技术+8',
        effects: { education: 15, tech_skill: 8 },
        flags: { chinese_sci_fi_fan: true },
        result: '你发现中国科幻世界很精彩,开始阅读更多作品。'
      }
    ]
  },

  {
    id: 'event_2015_monster_hunt',
    year: 2015,
    category: 'movie',
    trigger: { ageRange: [8, 25], gender: null },
    title: '《捉妖记》上映',
    description: '许诚毅执导的《捉妖记》上映,胡巴成为国民萌宠。',
    context: '2015年,《捉妖记》上映,可爱的胡巴让无数观众心动,最终成为内地影史票房冠军。',
    choices: [
      {
        text: '去电影院看,被胡巴萌翻',
        hint: '快乐+15,社交+12,财富-8',
        effects: { happiness: 15, social: 12, wealth: -8 },
        flags: { monster_hunt_fan: true },
        result: '你和朋友们一起看,被胡巴的可爱征服!'
      },
      {
        text: '觉得是小孩子看的',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你觉得这种合家欢电影不适合自己。'
      },
      {
        text: '关注中国CGI技术发展',
        hint: '技术+15,学识+10',
        effects: { tech_skill: 15, education: 10 },
        flags: { cgi_tech_interest: true },
        result: '你惊讶于国产电影的CGI水平,开始关注技术发展。'
      }
    ]
  },

  // ==================== 2016年 ====================
  {
    id: 'event_2016_pokemongo',
    year: 2016,
    category: 'game',
    trigger: { ageRange: [15, 35], gender: null },
    title: 'Pokémon GO',
    description: 'AR游戏Pokémon GO全球爆红,成为现象级产品。',
    context: '2016年7月,任天堂推出AR游戏Pokémon GO,玩家在现实中捕捉精灵,全球为之疯狂。',
    choices: [
      {
        text: '沉迷游戏,到处抓精灵',
        hint: '快乐+12,健康+5,社交+10',
        effects: { happiness: 12, health: 5, social: 10 },
        flags: { pokemon_player: true },
        result: '你每天走路抓精灵,认识了很多同好!'
      },
      {
        text: '不玩,觉得太幼稚',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你对这种游戏不感兴趣。'
      },
      {
        text: '研究AR技术',
        hint: '技术+18,学识+12',
        effects: { tech_skill: 18, education: 12 },
        flags: { ar_enthusiast: true },
        result: '你对AR技术产生了浓厚兴趣,开始学习相关知识。'
      }
    ]
  },

  {
    id: 'event_2016_la_la_land',
    year: 2016,
    category: 'movie',
    trigger: { ageRange: [16, 35], gender: null },
    title: '《爱乐之城》上映',
    description: '达米恩·查泽雷的《爱乐之城》上映,致敬好莱坞黄金时代。',
    context: '2016年,《爱乐之城》上映,这部音乐歌舞片讲述了追求梦想的年轻人的爱情故事,获得多项奥斯卡提名。',
    choices: [
      {
        text: '被电影深深感动',
        hint: '快乐+15,魅力+12,学识+8',
        effects: { happiness: 15, charm: 12, education: 8 },
        flags: { musical_fan: true },
        result: '你被电影中梦想与现实的冲突感动,哭得稀里哗啦。'
      },
      {
        text: '觉得歌舞片太无聊',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你看了一会儿就睡着了,歌舞片不是你的菜。'
      },
      {
        text: '开始学习爵士乐',
        hint: '学识+15,魅力+10,技术+8',
        effects: { education: 15, charm: 10, tech_skill: 8 },
        flags: { jazz_interest: true },
        result: '你被电影中的爵士乐吸引,开始了解这种音乐类型。'
      }
    ]
  },

  // ==================== 2017年 ====================
  {
    id: 'event_2017_live_streaming',
    year: 2017,
    category: 'internet',
    trigger: { ageRange: [18, 35], gender: null },
    title: '直播元年',
    description: '直播行业爆发,"网红"成为正式职业。',
    context: '2017年,直播行业迎来爆发式增长,斗鱼、虎牙、花椒等平台竞争激烈,"网红经济"成为新概念。',
    choices: [
      {
        text: '尝试当主播',
        hint: '社交+20,魅力+12,财富+5',
        effects: { social: 20, charm: 12, wealth: 5 },
        flags: { streamer: true },
        result: '你开始直播,虽然粉丝不多,但很有趣!'
      },
      {
        text: '经常看直播,刷礼物',
        hint: '社交+8,快乐+10,财富-10',
        effects: { social: 8, happiness: 10, wealth: -10 },
        flags: { stream_viewer: true },
        result: '你经常看直播,和主播互动很有意思。'
      },
      {
        text: '研究直播商业模式',
        hint: '技术+15,学识+12,财富+10',
        effects: { tech_skill: 15, education: 12, wealth: 10 },
        flags: { streaming_business_analyst: true },
        result: '你深入研究了直播行业的盈利模式,看到了商机。'
      }
    ]
  },

  {
    id: 'event_2017_wechat_mini_program',
    year: 2017,
    category: 'tech',
    trigger: { ageRange: [20, 40], gender: null },
    title: '小程序上线',
    description: '微信小程序正式上线,"用完即走"的产品理念。',
    context: '2017年1月,微信小程序上线,不需要下载安装即可使用的应用形态,被认为是移动互联网的下半场。',
    choices: [
      {
        text: '学习开发小程序',
        hint: '技术+20,学识+15,财富+15',
        effects: { tech_skill: 20, education: 15, wealth: 15 },
        flags: { mini_program_developer: true },
        result: '你抓住机会学习小程序开发,接到了不少项目!'
      },
      {
        text: '普通使用,不深入学习',
        hint: '技术+5',
        effects: { tech_skill: 5 },
        result: '你用跳一跳等小程序娱乐,但没有深入学习。'
      },
      {
        text: '不感兴趣,继续用APP',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你觉得小程序功能有限,还是习惯用原生APP。'
      }
    ]
  },

  {
    id: 'event_2017_wolf_warrior_2',
    year: 2017,
    category: 'movie',
    trigger: { ageRange: [14, 40], gender: null },
    title: '《战狼2》上映',
    description: '吴京执导的《战狼2》上映,创造中国影史票房纪录。',
    context: '2017年,《战狼2》上映,最终票房56.8亿,成为当时中国影史票房冠军,引发全民热议。',
    choices: [
      {
        text: '去电影院支持',
        hint: '快乐+15,社交+15,财富-10',
        effects: { happiness: 15, social: 15, wealth: -10 },
        flags: { action_movie_fan: true },
        result: '你被影片中的爱国情怀感动,热血沸腾!'
      },
      {
        text: '觉得太主旋律,不看',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你觉得这类电影太宣传,没有特别关注。'
      },
      {
        text: '关注中国电影工业化',
        hint: '学识+15,技术+10',
        effects: { education: 15, tech_skill: 10 },
        flags: { film_industry_observer: true },
        result: '你分析了中国电影的工业化进程,认为这是重要里程碑。'
      }
    ]
  },

  // ==================== 2018年 ====================
  {
    id: 'event_2018_black_panther',
    year: 2018,
    category: 'entertainment',
    trigger: { ageRange: [14, 35], gender: null },
    title: '《黑豹》上映',
    description: '漫威首部黑人超级英雄电影《黑豹》上映。',
    context: '2018年,漫威《黑豹》上映,这部以黑人主角为主的超级英雄电影在全球引发讨论。',
    choices: [
      {
        text: '去电影院观看',
        hint: '快乐+12,社交+10,学识+8,财富-10',
        effects: { happiness: 12, social: 10, education: 8, wealth: -10 },
        flags: { marvel_fan: true },
        result: '你被瓦坎达的世界观吸引,漫威电影又一部佳作!'
      },
      {
        text: '对超级英雄电影审美疲劳',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你觉得超级英雄电影太多了,没有特别关注。'
      },
      {
        text: '关注非洲文化元素',
        hint: '学识+18,魅力+10',
        effects: { education: 18, charm: 10 },
        flags: { culture_researcher: true },
        result: '你对电影中的非洲文化元素产生兴趣,开始了解相关历史。'
      }
    ]
  },

  {
    id: 'event_2018_fortnite',
    year: 2018,
    category: 'game',
    trigger: { ageRange: [12, 30], gender: null },
    title: '《堡垒之夜》爆红',
    description: 'Epic Games的《堡垒之夜》全球爆红,大逃杀模式风靡。',
    context: '2018年,《堡垒之夜》在全球爆红,免费+大逃杀+建造的独特玩法让它成为年度最火游戏。',
    choices: [
      {
        text: '沉迷游戏,经常开黑',
        hint: '快乐+15,社交+15,健康-10,学识-5',
        effects: { happiness: 15, social: 15, health: -10, education: -5 },
        flags: { fortnite_addict: true },
        result: '你每天都要打几把堡垒之夜,和队友配合很默契!'
      },
      {
        text: '偶尔玩玩,不沉迷',
        hint: '快乐+8,社交+8,健康-3',
        effects: { happiness: 8, social: 8, health: -3 },
        flags: { casual_gamer: true },
        result: '你偶尔和朋友一起玩,但不会过度沉迷。'
      },
      {
        text: '不感兴趣',
        hint: '学识+5,健康+3',
        effects: { education: 5, health: 3 },
        result: '你对这种游戏不感兴趣,把时间用在其他事情上。'
      }
    ]
  },

  // ==================== 2019年 ====================
  {
    id: 'event_2019_civilized_gaming',
    year: 2019,
    category: 'game',
    trigger: { ageRange: [15, 30], gender: null },
    title: '文明6爆红',
    description: '《文明6》游戏在玩家群体中爆红,"再来一回合"成梗。',
    context: '2019年,《文明6》在Steam上持续热销,"再来一回合"成为玩家们的共同记忆,很多人一玩就是一整夜。',
    choices: [
      {
        text: '沉迷游戏,经常通宵',
        hint: '快乐+15,学识+10,健康-15',
        effects: { happiness: 15, education: 10, health: -15 },
        flags: { civ_addict: true },
        result: '你沉迷文明6,经常"再来一回合"到天亮...'
      },
      {
        text: '适度游戏,不影响生活',
        hint: '快乐+10,学识+8,健康-3',
        effects: { happiness: 10, education: 8, health: -3 },
        flags: { casual_gamer: true },
        result: '你偶尔玩玩,但不会过度沉迷。'
      },
      {
        text: '对游戏不感兴趣',
        hint: '学识+5,健康+3',
        effects: { education: 5, health: 3 },
        result: '你觉得游戏浪费时间,有更重要的事情要做。'
      }
    ]
  },

  {
    id: 'event_2019_avengers_endgame',
    year: 2019,
    category: 'movie',
    trigger: { ageRange: [14, 35], gender: null },
    title: '《复仇者联盟4》上映',
    description: '漫威《复仇者联盟4:终局之战》上映,终结无限传奇。',
    context: '2019年,《复联4》上映,这是漫威电影宇宙第三阶段的收官之作,全球票房突破27亿美元。',
    choices: [
      {
        text: '首映场去看',
        hint: '快乐+20,社交+15,财富-15',
        effects: { happiness: 20, social: 15, wealth: -15 },
        flags: { mcu_fan: true },
        result: '你和朋友们一起首映,为钢铁侠的牺牲流泪!'
      },
      {
        text: '等网上的剧透再决定',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你先看剧透,再决定要不要去看。'
      },
      {
        text: '对超级英雄电影不感兴趣',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你觉得这类电影都是套路,没有特别关注。'
      }
    ]
  },

  {
    id: 'event_2019_neverending_journey',
    year: 2019,
    category: 'music',
    trigger: { ageRange: [16, 35], gender: null },
    title: '《乐队的夏天》热播',
    description: '音乐综艺《乐队的夏天》第一季热播,乐队文化回归。',
    context: '2019年,《乐队的夏天》第一季播出,让新裤子、痛仰等乐队成为全民话题,独立音乐进入主流视野。',
    choices: [
      {
        text: '追着看,成为乐队粉丝',
        hint: '快乐+15,魅力+12,社交+12',
        effects: { happiness: 15, charm: 12, social: 12 },
        flags: { indie_music_fan: true },
        result: '你被新裤子的《生活因你而火热》感动,开始听更多独立音乐!'
      },
      {
        text: '偶尔听听,不深入',
        hint: '快乐+8',
        effects: { happiness: 8 },
        result: '你看了几期,觉得不错,但没有成为粉丝。'
      },
      {
        text: '开始学习乐器',
        hint: '魅力+15,学识+10,技术+5',
        effects: { charm: 15, education: 10, tech_skill: 5 },
        flags: { musician: true },
        result: '你被节目激发,开始学习吉他/鼓等乐器。'
      }
    ]
  },

  // ==================== 2020年 ====================
  {
    id: 'event_2020_tiktok_douyin',
    year: 2020,
    category: 'internet',
    trigger: { ageRange: [15, 35], gender: null },
    title: '抖音崛起',
    description: '短视频成为主流内容形式,"刷抖音"成为日常娱乐。',
    context: '2020年,抖音日活用户突破6亿,短视频彻底改变了内容消费习惯,"刷抖音"成为日常娱乐方式。',
    choices: [
      {
        text: '沉迷刷抖音',
        hint: '快乐+10,社交+8,学识-10,健康-5',
        effects: { happiness: 10, social: 8, education: -10, health: -5 },
        flags: { tiktok_addict: true },
        result: '你每天刷抖音几个小时,时间不知不觉就过去了...'
      },
      {
        text: '做短视频创作者',
        hint: '魅力+15,社交+18,技术+10,财富+10',
        effects: { charm: 15, social: 18, tech_skill: 10, wealth: 10 },
        flags: { tiktok_creator: true },
        result: '你开始做短视频,慢慢积累了一些粉丝,还赚到了钱!'
      },
      {
        text: '理性使用,不沉迷',
        hint: '快乐+5,学识+5',
        effects: { happiness: 5, education: 5 },
        flags: { digital_wellness: true },
        result: '你偶尔刷刷抖音,但不会让它影响正常生活。'
      }
    ]
  },

  {
    id: 'event_2020_soul',
    year: 2020,
    category: 'internet',
    trigger: { ageRange: [18, 35], gender: null },
    title: 'Soul App爆红',
    description: '社交软件Soul以"灵魂社交"为定位受到年轻人欢迎。',
    context: '2020年,Soul APP月活突破千万,以匿名社交和兴趣匹配为特色,成为Z世代社交新选择。',
    choices: [
      {
        text: '注册使用,结识网友',
        hint: '社交+15,快乐+10',
        effects: { social: 15, happiness: 10 },
        flags: { soul_user: true },
        result: '你在Soul上认识了几个有趣的朋友,经常聊天。'
      },
      {
        text: '觉得匿名社交不安全',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你对匿名社交持保留态度,没有使用。'
      },
      {
        text: '研究这种社交模式',
        hint: '技术+12,学识+10',
        effects: { tech_skill: 12, education: 10 },
        flags: { social_app_researcher: true },
        result: '你对Soul的产品设计很感兴趣,研究其社交模式。'
      }
    ]
  },

  // ==================== 2021年 ====================
  {
    id: 'event_2021_metaverse',
    year: 2021,
    category: 'tech',
    trigger: { ageRange: [20, 45], gender: null },
    title: '元宇宙概念',
    description: 'Facebook改名Meta,"元宇宙"成为年度热词。',
    context: '2021年10月,Facebook宣布更名为Meta,All in元宇宙。虚拟土地、NFT等概念火热。',
    choices: [
      {
        text: '购买虚拟资产',
        hint: '财富-20,快乐+5,学识+5',
        effects: { wealth: -20, happiness: 5, education: 5 },
        flags: { metaverse_investor: true },
        result: '你花真金白银买虚拟资产,期待升值...'
      },
      {
        text: '学习VR/AR相关技术',
        hint: '技术+20,学识+15,财富+10',
        effects: { tech_skill: 20, education: 15, wealth: 10 },
        flags: { metaverse_developer: true },
        result: '你相信元宇宙是未来,开始学习相关开发技术。'
      },
      {
        text: '认为这是泡沫,不参与',
        hint: '学识+8',
        effects: { education: 8 },
        flags: { bubble_skeptic: true },
        result: '你觉得这像当年的区块链泡沫,选择观望。'
      }
    ]
  },

  {
    id: 'event_2021_dune',
    year: 2021,
    category: 'movie',
    trigger: { ageRange: [14, 35], gender: null },
    title: '《沙丘》上映',
    description: '丹尼斯·维伦纽瓦的《沙丘》上映,科幻史诗。',
    context: '2021年,《沙丘》上映,这部改编自弗兰克·赫伯特同名小说的科幻史诗,视觉效果震撼。',
    choices: [
      {
        text: '去IMAX观看',
        hint: '快乐+18,学识+15,财富-12',
        effects: { happiness: 18, education: 15, wealth: -12 },
        flags: { dune_fan: true },
        result: '你在IMAX影院观看,被沙丘世界的视觉震撼!'
      },
      {
        text: '节奏太慢,看不下去',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你觉得电影节奏太慢,看了一会儿就想离场。'
      },
      {
        text: '阅读原著小说',
        hint: '学识+20,魅力+8',
        effects: { education: 20, charm: 8 },
        flags: { sci_fi_reader: true },
        result: '你被电影激发,开始阅读《沙丘》原著系列。'
      }
    ]
  },

  // ==================== 2022年 ====================
  {
    id: 'event_2022_dongbei_chaoren',
    year: 2022,
    category: 'entertainment',
    trigger: { ageRange: [15, 40], gender: null },
    title: '东方甄选爆红',
    description: '新东方老师董宇辉双语直播带货,"知识带货"成为现象。',
    context: '2022年6月,新东方转型直播带货,老师董宇辉以双语教学式直播爆红。',
    choices: [
      {
        text: '被董宇辉的故事感动',
        hint: '快乐+12,学识+10',
        effects: { happiness: 12, education: 10 },
        flags: { dong_fan: true },
        result: '你被董宇辉的故事和才华打动,支持东方甄选。'
      },
      {
        text: '学习他的表达方式',
        hint: '魅力+15,学识+12,社交+10',
        effects: { charm: 15, education: 12, social: 10 },
        flags: { communication_learner: true },
        result: '你学习董宇辉的表达技巧,自己的沟通能力提升。'
      },
      {
        text: '只是看看,不深入',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你偶尔看直播,但没有特别关注。'
      }
    ]
  },

  {
    id: 'event_2022_top_gun_maverick',
    year: 2022,
    category: 'movie',
    trigger: { ageRange: [14, 40], gender: null },
    title: '《壮志凌云2》上映',
    description: '阿汤哥的《壮志凌云2》时隔36年回归。',
    context: '2022年,《壮志凌云2》上映,阿汤哥亲自驾驶战斗机进行拍摄,实拍场景震撼观众。',
    choices: [
      {
        text: '去电影院观看',
        hint: '快乐+18,魅力+10,社交+10,财富-12',
        effects: { happiness: 18, charm: 10, social: 10, wealth: -12 },
        flags: { action_movie_fan: true },
        result: '你被空战的震撼场面征服,阿汤哥太帅了!'
      },
      {
        text: '对军事题材不感兴趣',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你觉得这类电影不是你的菜。'
      },
      {
        text: '关注阿汤哥的特技精神',
        hint: '学识+15,健康+8',
        effects: { education: 15, health: 8 },
        flags: { stunt_appreciator: true },
        result: '你被阿汤哥的敬业精神感动,开始了解电影特技。'
      }
    ]
  },

  // ==================== 2023年 ====================
  {
    id: 'event_2023_chatgpt',
    year: 2023,
    category: 'tech',
    trigger: { ageRange: [18, 50], gender: null },
    title: 'ChatGPT爆发',
    description: 'OpenAI发布ChatGPT,AI能力震惊世界。',
    context: '2023年,ChatGPT展现出的强大能力让各行各业震惊,程序员、设计师、作家等职业开始思考被AI取代的可能性。',
    choices: [
      {
        text: '学习使用AI工具',
        hint: '技术+20,学识+15,财富+15',
        effects: { tech_skill: 20, education: 15, wealth: 15 },
        flags: { ai_adopter: true },
        result: '你积极学习AI工具,将其作为助手,工作效率大幅提升!'
      },
      {
        text: '担心被AI取代',
        hint: '快乐-15,学识+5',
        effects: { happiness: -15, education: 5 },
        flags: { ai_anxiety: true },
        result: '你很焦虑,担心自己的工作会被AI取代。'
      },
      {
        text: '认为AI是工具,不是威胁',
        hint: '技术+12,学识+10',
        effects: { tech_skill: 12, education: 10 },
        flags: { ai_rationalist: true },
        result: '你认为AI是提高效率的工具,不会取代有创造力的人。'
      }
    ]
  },

  {
    id: 'event_2023_barbie',
    year: 2023,
    category: 'movie',
    trigger: { ageRange: [14, 40], gender: null },
    title: '《芭比》上映',
    description: '格蕾塔·葛韦格的《芭比》上映,粉色风暴席卷全球。',
    context: '2023年,《芭比》上映,这部探讨性别议题的喜剧电影在全球引发"芭比热"。',
    choices: [
      {
        text: '去看首映,穿粉色',
        hint: '快乐+18,魅力+12,社交+15,财富-10',
        effects: { happiness: 18, charm: 12, social: 15, wealth: -10 },
        flags: { barbie_fan: true },
        result: '你穿着粉色衣服去看电影,和其他观众一起嗨!'
      },
      {
        text: '觉得是营销,不感兴趣',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你觉得这就是部商业电影,没有特别关注。'
      },
      {
        text: '关注性别议题',
        hint: '学识+18,魅力+10',
        effects: { education: 18, charm: 10 },
        flags: { gender_aware: true },
        result: '你借机思考了性别平等议题,有了新的认识。'
      }
    ]
  },

  {
    id: 'event_2023_oppenheimer',
    year: 2023,
    category: 'movie',
    trigger: { ageRange: [16, 40], gender: null },
    title: '《奥本海默》上映',
    description: '诺兰的《奥本海默》上映,传记史诗。',
    context: '2023年,《奥本海默》上映,这部讲述原子弹之父的传记电影获得多项奥斯卡提名。',
    choices: [
      {
        text: '去IMAX观看',
        hint: '快乐+18,学识+20,财富-12',
        effects: { happiness: 18, education: 20, wealth: -12 },
        flags: { nolan_fan: true },
        result: '你被奥本海默的内心挣扎震撼,诺兰又一部杰作!'
      },
      {
        text: '时长太长,不想看',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你觉得3个小时太长了,没有去看。'
      },
      {
        text: '开始学习核物理历史',
        hint: '学识+22,技术+12',
        effects: { education: 22, tech_skill: 12 },
        flags: { physics_history_interest: true },
        result: '你被电影激发,开始学习曼哈顿计划的历史。'
      }
    ]
  },

  // ==================== 2024年 ====================
  {
    id: 'event_2024_black_myth_wukong',
    year: 2024,
    category: 'game',
    trigger: { ageRange: [15, 45], gender: null },
    title: '《黑神话:悟空》',
    description: '国产3A游戏《黑神话:悟空》发布,震撼全球游戏界。',
    context: '2024年8月,游戏科学发布《黑神话:悟空》,被评价为"中国第一款真正的3A游戏"。',
    choices: [
      {
        text: '预购并通宵玩游戏',
        hint: '快乐+20,社交+12,健康-8',
        effects: { happiness: 20, social: 12, health: -8 },
        flags: { wukong_player: true },
        result: '你被《黑神话》的震撼画面折服,为国产游戏骄傲!'
      },
      {
        text: '关注游戏行业',
        hint: '学识+12,技术+10',
        effects: { education: 12, tech_skill: 10 },
        flags: { game_industry_observer: true },
        result: '你分析了中国游戏产业的发展,认为这是里程碑。'
      },
      {
        text: '对游戏不感兴趣',
        hint: '学识+5',
        effects: { education: 5 },
        flags: { non_gamer: true },
        result: '你不玩游戏,但感受到了全民热议的氛围。'
      }
    ]
  },

  {
    id: 'event_2024_dune_part_two',
    year: 2024,
    category: 'movie',
    trigger: { ageRange: [14, 35], gender: null },
    title: '《沙丘2》上映',
    description: '《沙丘:第二部》上映,续作口碑票房双丰收。',
    context: '2024年,《沙丘:第二部》上映,甜茶和赞达亚的表演,以及更震撼的战争场面,让口碑超越前作。',
    choices: [
      {
        text: '去IMAX首映',
        hint: '快乐+20,学识+18,社交+12,财富-12',
        effects: { happiness: 20, education: 18, social: 12, wealth: -12 },
        flags: { dune_fan: true },
        result: '你被沙丘2的史诗感征服,比第一部更精彩!'
      },
      {
        text: '等流媒体再看',
        hint: '快乐+12,财富+5',
        effects: { happiness: 12, wealth: 5 },
        result: '你省钱等流媒体上线,在家也能看。'
      },
      {
        text: '对科幻不感兴趣',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你觉得这类科幻大片不是你的菜。'
      }
    ]
  },

  // ==================== 2025年 ====================
  {
    id: 'event_2025_reflection',
    year: 2025,
    category: 'milestone',
    trigger: { ageRange: [10, 50], gender: null },
    title: '回顾这20年',
    description: '2005-2025,你经历了人生最重要的20年。是时候回顾和总结了。',
    context: '2025年,你站在人生的十字路口。20年前,你还是懵懂少年;20年后,你已经历了太多变迁。',
    choices: [
      {
        text: '这20年我很满意',
        hint: '快乐+20,魅力+10',
        effects: { happiness: 20, charm: 10 },
        flags: { life_satisfied: true },
        result: '你回望这20年,虽然艰难,但你很满意自己的选择。'
      },
      {
        text: '如果可以重来...',
        hint: '学识+15,快乐-10',
        effects: { education: 15, happiness: -10 },
        flags: { life_regret: true },
        result: '你有很多遗憾,但也明白人生没有如果。'
      },
      {
        text: '未来还很长,继续努力',
        hint: '快乐+15,学识+10,财富+10',
        effects: { happiness: 15, education: 10, wealth: 10 },
        flags: { life_optimist: true },
        result: '你认为过去的20年是积累,未来还有无限可能!'
      }
    ]
  },

  // ==================== 日常事件 - 学生阶段 ====================

  // 小学阶段 (6-12岁)
  {
    id: 'daily_primary_homework',
    year: null,
    category: 'daily',
    trigger: { ageRange: [6, 12], gender: null, randomChance: 0.15 },
    title: '作业写不完',
    description: '今天的作业特别多,你不知道能不能写完。',
    context: '小学的作业压力已经开始显现...',
    choices: [
      {
        text: '熬夜写完',
        hint: '学识+8,健康-5',
        effects: { education: 8, health: -5 },
        result: '你熬到很晚,终于把作业写完了。'
      },
      {
        text: '抄同学的',
        hint: '学识-5,社交+5',
        effects: { education: -5, social: 5 },
        result: '你抄了同学的作业,暂时应付过去了。'
      },
      {
        text: '不写了,挨骂就挨骂',
        hint: '健康+5,学识-5',
        effects: { health: 5, education: -5 },
        result: '你选择放弃,第二天果然被老师批评了。'
      }
    ]
  },

  {
    id: 'daily_primary_cartoons',
    year: null,
    category: 'daily',
    trigger: { ageRange: [6, 12], gender: null, randomChance: 0.12 },
    title: '想看动画片',
    description: '放学后有精彩的动画片,但妈妈让你先写作业。',
    context: '这是童年最艰难的选择之一。',
    choices: [
      {
        text: '先写作业再看',
        hint: '学识+8,快乐-3',
        effects: { education: 8, happiness: -3 },
        flags: { disciplined: true },
        result: '你先写完作业,妈妈允许你看动画片。'
      },
      {
        text: '偷偷看电视',
        hint: '快乐+10,学识-5,健康-3',
        effects: { happiness: 10, education: -5, health: -3 },
        flags: { naughty: true },
        result: '你偷偷看电视,被妈妈发现后挨了一顿骂。'
      },
      {
        text: '边写作业边看电视',
        hint: '学识+3,快乐+5',
        effects: { education: 3, happiness: 5 },
        result: '你两边都不想耽误,但作业写得不太好。'
      }
    ]
  },

  // 初中阶段 (12-15岁)
  {
    id: 'daily_middle_school_crush',
    year: null,
    category: 'daily',
    trigger: { ageRange: [12, 15], gender: null, randomChance: 0.1 },
    title: '青春期萌动',
    description: '你发现班上有个同学让你心动,上课总是忍不住偷看。',
    context: '青春期的懵懂情感,每个人都会经历。',
    choices: [
      {
        text: '写情书表白',
        hint: '魅力+10,社交+8,学识-5',
        effects: { charm: 10, social: 8, education: -5 },
        flags: { young_love: true },
        result: '你鼓起勇气写了情书,结果被老师发现了...'
      },
      {
        text: '默默关注,藏在心里',
        hint: '学识+5,魅力+3',
        effects: { education: 5, charm: 3 },
        flags: { secret_crush: true },
        result: '你把这份感情藏在心里,成为青春的秘密。'
      },
      {
        text: '专注学习,不考虑这些',
        hint: '学识+10',
        effects: { education: 10 },
        flags: { focused_student: true },
        result: '你决定以学习为重,不去想这些。'
      }
    ]
  },

  {
    id: 'daily_middle_school_internet_cafe',
    year: null,
    category: 'daily',
    trigger: { ageRange: [12, 15], gender: null, randomChance: 0.1 },
    title: '同学邀请去网吧',
    description: '同学们周末要去网吧玩游戏,邀请你一起去。',
    context: '网吧对中学生来说是个神秘又诱惑的地方。',
    choices: [
      {
        text: '偷偷跟他们去',
        hint: '社交+12,快乐+10,学识-8,健康-5',
        effects: { social: 12, happiness: 10, education: -8, health: -5 },
        flags: { internet_cafe_visitor: true },
        result: '你在网吧玩得很开心,但回家后被父母发现了。'
      },
      {
        text: '拒绝,坚持学习',
        hint: '学识+10',
        effects: { education: 10 },
        flags: { good_student: true },
        result: '你拒绝了邀请,继续在家学习。'
      },
      {
        text: '告诉父母,征得同意',
        hint: '社交+8,学识+5,快乐+5',
        effects: { social: 8, education: 5, happiness: 5 },
        flags: { honest: true },
        result: '你和父母商量,他们同意你玩两个小时。'
      }
    ]
  },

  // 高中阶段 (15-18岁)
  {
    id: 'daily_high_school_pressure',
    year: null,
    category: 'daily',
    trigger: { ageRange: [15, 18], gender: null, randomChance: 0.15 },
    title: '高考压力大',
    description: '高考越来越近,压力让你喘不过气。',
    context: '高考是每个中国学生都要面对的挑战。',
    choices: [
      {
        text: '更加努力学习',
        hint: '学识+15,健康-10,快乐-8',
        effects: { education: 15, health: -10, happiness: -8 },
        flags: { hard_working: true },
        result: '你每天只睡5小时,把所有时间都用在学习上。'
      },
      {
        text: '适度放松,劳逸结合',
        hint: '学识+8,健康+5,快乐+5',
        effects: { education: 8, health: 5, happiness: 5 },
        flags: { balanced: true },
        result: '你每天坚持运动和听音乐,保持良好的状态。'
      },
      {
        text: '压力太大,想放弃',
        hint: '学识-10,快乐-15',
        effects: { education: -10, happiness: -15 },
        flags: { depressed: true },
        result: '你感到无法承受,成绩开始下滑。'
      }
    ]
  },

  {
    id: 'daily_high_school_romance',
    year: null,
    category: 'daily',
    trigger: { ageRange: [15, 18], gender: null, randomChance: 0.08 },
    title: '校园恋爱机会',
    description: '有个同学对你表示好感,你们都互相喜欢。',
    context: '高中恋爱是美好但冒险的。',
    choices: [
      {
        text: '开始恋爱',
        hint: '快乐+15,魅力+10,学识-10',
        effects: { happiness: 15, charm: 10, education: -10 },
        flags: { high_school_love: true },
        result: '你们开始了甜蜜的校园恋爱,但成绩受到了影响。'
      },
      {
        text: '约定高考后再在一起',
        hint: '学识+8,快乐+5,魅力+5',
        effects: { education: 8, happiness: 5, charm: 5 },
        flags: { promise: true },
        result: '你们决定一起努力,高考后再开始。'
      },
      {
        text: '拒绝,专注学习',
        hint: '学识+12,快乐-5',
        effects: { education: 12, happiness: -5 },
        result: '你拒绝了对方,但心里还是有些失落。'
      }
    ]
  },

  // 大学阶段 (18-22岁)
  {
    id: 'daily_college_club',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 22], gender: null, randomChance: 0.12 },
    title: '社团招新',
    description: '大学各种社团在招新,你不知道该加入哪个。',
    context: '大学社团是丰富生活、结交朋友的好地方。',
    choices: [
      {
        text: '加入学生会',
        hint: '社交+15,魅力+10,学识+5',
        effects: { social: 15, charm: 10, education: 5 },
        flags: { student_union: true },
        result: '你加入了学生会,锻炼了组织能力,认识了很多朋友。'
      },
      {
        text: '加入兴趣社团(音乐/运动等)',
        hint: '快乐+15,健康+8,魅力+8',
        effects: { happiness: 15, health: 8, charm: 8 },
        flags: { hobby_club: true },
        result: '你加入了兴趣社团,发展了自己的爱好。'
      },
      {
        text: '不加入社团,专注学习',
        hint: '学识+15',
        effects: { education: 15 },
        flags: { academic_focus: true },
        result: '你把所有时间都用在学习上,成绩名列前茅。'
      }
    ]
  },

  {
    id: 'daily_college_part_time',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 22], gender: null, randomChance: 0.1 },
    title: '兼职机会',
    description: '同学介绍了一份兼职,可以赚零花钱。',
    context: '大学兼职既能赚钱又能积累经验。',
    choices: [
      {
        text: '接受兼职',
        hint: '财富+15,社交+8,学识-5',
        effects: { wealth: 15, social: 8, education: -5 },
        flags: { part_time_job: true },
        result: '你开始做兼职,赚到了第一笔钱,也学到了很多。'
      },
      {
        text: '担心影响学习,拒绝',
        hint: '学识+10',
        effects: { education: 10 },
        result: '你把时间都用在学习上,没有做兼职。'
      },
      {
        text: '找和专业相关的实习',
        hint: '学识+12,财富+10,技术+8',
        effects: { education: 12, wealth: 10, tech_skill: 8 },
        flags: { internship: true },
        result: '你找到了一份专业相关的实习,为将来就业打基础。'
      }
    ]
  },

  // 工作阶段 (22-30岁)
  {
    id: 'daily_work_overtime',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 35], gender: null, randomChance: 0.15 },
    title: '加班还是生活',
    description: '老板让你加班完成项目,但今晚有朋友聚会。',
    context: '工作和生活如何平衡,是每个职场人的难题。',
    choices: [
      {
        text: '加班工作',
        hint: '财富+12,学识+8,健康-8,快乐-10',
        effects: { wealth: 12, education: 8, health: -8, happiness: -10 },
        flags: { workaholic: true },
        result: '你选择加班,老板很满意,但爽约了朋友。'
      },
      {
        text: '去参加聚会',
        hint: '社交+15,快乐+12,学识-3',
        effects: { social: 15, happiness: 12, education: -3 },
        flags: { social_life: true },
        result: '你选择了朋友聚会,工作明天再说。'
      },
      {
        text: '拒绝加班,拒绝聚会',
        hint: '健康+10,快乐+5',
        effects: { health: 10, happiness: 5 },
        flags: { work_life_balance: true },
        result: '你选择回家休息,不想太累。'
      }
    ]
  },

  {
    id: 'daily_work_promotion',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 35], gender: null, randomChance: 0.08 },
    title: '升职机会',
    description: '公司有一个升职机会,但需要和同事竞争。',
    context: '职场竞争,机会与挑战并存。',
    choices: [
      {
        text: '积极争取',
        hint: '财富+20,社交+5,学识+10,健康-5',
        effects: { wealth: 20, social: 5, education: 10, health: -5 },
        flags: { promoted: true },
        result: '你成功升职,薪资和地位都提升了!'
      },
      {
        text: '竞争失败',
        hint: '学识+5,快乐-10',
        effects: { education: 5, happiness: -10 },
        flags: { promotion_failed: true },
        result: '你没有得到这个机会,但积累了经验。'
      },
      {
        text: '不参与竞争',
        hint: '健康+5,快乐+5',
        effects: { health: 5, happiness: 5 },
        flags: { content_with_current: true },
        result: '你觉得现在的工作状态就很好,不需要升职。'
      }
    ]
  },

  // 成家阶段 (25-35岁)
  {
    id: 'daily_marriage_pressure',
    year: null,
    category: 'daily',
    trigger: { ageRange: [25, 35], gender: null, randomChance: 0.12 },
    title: '催婚压力',
    description: '父母又开始催你找对象结婚了。',
    context: '在中国,25岁后就要面对家庭催婚的压力。',
    choices: [
      {
        text: '积极相亲',
        hint: '社交+15,魅力+5,快乐-5',
        effects: { social: 15, charm: 5, happiness: -5 },
        flags: { dating: true },
        result: '你开始频繁相亲,希望能找到合适的人。'
      },
      {
        text: '坚持自我,不着急',
        hint: '学识+8,快乐-3',
        effects: { education: 8, happiness: -3 },
        flags: { independent: true },
        result: '你告诉父母你想先立业,不着急结婚。'
      },
      {
        text: '和父母大吵一架',
        hint: '社交-10,快乐-15',
        effects: { social: -10, happiness: -15 },
        flags: { family_conflict: true },
        result: '你和父母吵了一架,关系变得紧张。'
      }
    ]
  },

  {
    id: 'daily_buy_house',
    year: null,
    category: 'daily',
    trigger: { ageRange: [25, 35], gender: null, randomChance: 0.1 },
    title: '买房压力',
    description: '房价越来越高,你考虑是否要买房。',
    context: '买房是中国年轻人最大的压力之一。',
    choices: [
      {
        text: '咬牙买房,背负房贷',
        hint: '财富-40,快乐-10,社交+5',
        effects: { wealth: -40, happiness: -10, social: 5 },
        flags: { home_owner: true },
        result: '你买了房,但每个月房贷压力很大...'
      },
      {
        text: '不买,继续租房',
        hint: '财富+10,快乐+5',
        effects: { wealth: 10, happiness: 5 },
        flags: { renter: true },
        result: '你选择租房,生活压力小很多。'
      },
      {
        text: '回老家买房',
        hint: '财富-20,社交-5,快乐+8',
        effects: { wealth: -20, social: -5, happiness: 8 },
        flags: { return_home: true },
        result: '你在老家买了房,价格便宜很多。'
      }
    ]
  },

  // 中年阶段 (35-50岁)
  {
    id: 'daily_midlife_crisis',
    year: null,
    category: 'daily',
    trigger: { ageRange: [35, 50], gender: null, randomChance: 0.1 },
    title: '中年危机',
    description: '你突然觉得人生没有意义,开始质疑自己的选择。',
    context: '人到中年,很多人会陷入自我怀疑。',
    choices: [
      {
        text: '寻找新的兴趣爱好',
        hint: '快乐+15,魅力+10',
        effects: { happiness: 15, charm: 10 },
        flags: { new_hobby: true },
        result: '你开始学习摄影/绘画等,找到了新的乐趣。'
      },
      {
        text: '专注于家庭',
        hint: '社交+12,快乐+10',
        effects: { social: 12, happiness: 10 },
        flags: { family_oriented: true },
        result: '你花更多时间陪伴家人,感觉生活有意义多了。'
      },
      {
        text: '陷入抑郁',
        hint: '快乐-20,健康-10',
        effects: { happiness: -20, health: -10 },
        flags: { depressed: true },
        result: '你感到很沮丧,生活失去了色彩。'
      }
    ]
  },

  {
    id: 'daily_health_check',
    year: null,
    category: 'daily',
    trigger: { ageRange: [30, 50], gender: null, randomChance: 0.12 },
    title: '体检发现问题',
    description: '年度体检发现了一些健康问题。',
    context: '随着年龄增长,健康问题开始出现。',
    choices: [
      {
        text: '开始锻炼,改变生活方式',
        hint: '健康+20,快乐+5',
        effects: { health: 20, happiness: 5 },
        flags: { health_conscious: true },
        result: '你开始跑步健身,健康状况明显改善!'
      },
      {
        text: '只是小问题,不在意',
        hint: '健康-10',
        effects: { health: -10 },
        flags: { health_neglected: true },
        result: '你觉得问题不大,没有放在心上。'
      },
      {
        text: '定期复查,保持关注',
        hint: '健康+10,学识+5',
        effects: { health: 10, education: 5 },
        flags: { health_monitored: true },
        result: '你定期复查,及时了解自己的健康状况。'
      }
    ]
  },

  // 通用日常事件
  {
    id: 'daily_fall_in_love',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 35], gender: null, randomChance: 0.08 },
    title: '邂逅爱情',
    description: '你在某个场合遇到了特别的人,心动的感觉...',
    context: '爱情总是在最意想不到的时候降临。',
    choices: [
      {
        text: '勇敢表白',
        hint: '快乐+20,魅力+10,社交+15',
        effects: { happiness: 20, charm: 10, social: 15 },
        flags: { in_relationship: true },
        result: '你鼓起勇气表白,对方答应了!你开始了甜蜜的恋情。'
      },
      {
        text: '默默关注,慢慢发展',
        hint: '魅力+8,社交+10',
        effects: { charm: 8, social: 10 },
        flags: { secret_crush: true },
        result: '你选择慢慢了解对方,让感情自然发展。'
      },
      {
        text: '觉得时机不对,放弃',
        hint: '快乐-5',
        effects: { happiness: -5 },
        flags: { missed_love: true },
        result: '你觉得现在不是合适的时候,选择放弃。'
      }
    ]
  },

  {
    id: 'daily_friend_conflict',
    year: null,
    category: 'daily',
    trigger: { ageRange: [15, 40], gender: null, randomChance: 0.08 },
    title: '朋友产生矛盾',
    description: '你和好朋友因为某件事产生了矛盾,关系变得紧张。',
    context: '友谊需要经营,矛盾是难免的。',
    choices: [
      {
        text: '主动道歉,挽回友谊',
        hint: '社交+12,魅力+8',
        effects: { social: 12, charm: 8 },
        flags: { peacemaker: true },
        result: '你主动道歉,朋友也很感动,友谊更加牢固。'
      },
      {
        text: '等待对方先道歉',
        hint: '社交-5,学识+5',
        effects: { social: -5, education: 5 },
        result: '你们冷战了很久,关系越来越疏远。'
      },
      {
        text: '彻底断绝往来',
        hint: '社交-15,快乐-10',
        effects: { social: -15, happiness: -10 },
        flags: { ended_friendship: true },
        result: '你们选择了绝交,这段友谊就此结束。'
      }
    ]
  },

  {
    id: 'daily_job_change',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.1 },
    title: '跳槽机会',
    description: '猎头联系你,有一个更好的工作机会。',
    context: '跳槽是职场发展的重要途径。',
    choices: [
      {
        text: '接受新工作',
        hint: '财富+20,技术+10,社交-5',
        effects: { wealth: 20, tech_skill: 10, social: -5 },
        flags: { job_hopper: true },
        result: '你跳槽成功,薪资和职位都提升了!'
      },
      {
        text: '留在现公司',
        hint: '社交+10,学识+5',
        effects: { social: 10, education: 5 },
        flags: { loyal_employee: true },
        result: '你选择留下,老板很认可你的忠诚。'
      },
      {
        text: '创业,自己当老板',
        hint: '财富-30,技术+15,学识+15',
        effects: { wealth: -30, tech_skill: 15, education: 15 },
        flags: { entrepreneur: true },
        result: '你辞职创业,开始了艰难的创业之路...'
      }
    ]
  },

  // 运动相关
  {
    id: 'daily_exercise',
    year: null,
    category: 'daily',
    trigger: { ageRange: [15, 45], gender: null, randomChance: 0.12 },
    title: '开始运动计划',
    description: '你决定开始锻炼身体,变得更强壮健康。',
    context: '运动是保持健康的最好方式。',
    choices: [
      {
        text: '坚持每天锻炼',
        hint: '健康+20,魅力+10,快乐+10',
        effects: { health: 20, charm: 10, happiness: 10 },
        flags: { fitness_enthusiast: true },
        result: '你坚持每天锻炼,身材越来越好,精力充沛!'
      },
      {
        text: '三天打鱼两天晒网',
        hint: '健康+8,快乐+5',
        effects: { health: 8, happiness: 5 },
        result: '你断断续续地锻炼,效果一般。'
      },
      {
        text: '很快就放弃了',
        hint: '健康+3',
        effects: { health: 3 },
        flags: { quitter: true },
        result: '你锻炼了几天就放弃了,回到原来的生活。'
      }
    ]
  },

  // 旅行相关
  {
    id: 'daily_travel',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 40], gender: null, randomChance: 0.1 },
    title: '旅行机会',
    description: '你有假期,可以考虑去旅行。',
    context: '旅行是开阔眼界、放松身心的好方式。',
    choices: [
      {
        text: '出国旅行',
        hint: '快乐+20,学识+15,社交+10,财富-25',
        effects: { happiness: 20, education: 15, social: 10, wealth: -25 },
        flags: { international_traveler: true },
        result: '你去了国外旅行,见识了不同的文化!'
      },
      {
        text: '国内旅行',
        hint: '快乐+15,学识+12,社交+8,财富-15',
        effects: { happiness: 15, education: 12, social: 8, wealth: -15 },
        flags: { domestic_traveler: true },
        result: '你游览了祖国的大好河山,收获满满。'
      },
      {
        text: '宅在家里',
        hint: '财富+10,学识+5',
        effects: { wealth: 10, education: 5 },
        result: '你选择在家休息,看书看电影也不错。'
      }
    ]
  },

  // 技能学习
  {
    id: 'daily_learn_skill',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 40], gender: null, randomChance: 0.1 },
    title: '学习新技能',
    description: '你想学习一项新技能,提升自己。',
    context: '终身学习是现代社会的要求。',
    choices: [
      {
        text: '深入学习专业技能',
        hint: '技术+20,学识+15,财富+10',
        effects: { tech_skill: 20, education: 15, wealth: 10 },
        flags: { lifelong_learner: true },
        result: '你报名培训班,系统学习了新技能,职业发展更好!'
      },
      {
        text: '学习兴趣爱好',
        hint: '快乐+15,魅力+10',
        effects: { happiness: 15, charm: 10 },
        flags: { hobby_learner: true },
        result: '你学习了摄影/绘画等,生活更有趣了。'
      },
      {
        text: '太忙了,没时间学',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你想学但工作太忙,一直没有行动。'
      }
    ]
  },

  // 社交聚会
  {
    id: 'daily_party',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 35], gender: null, randomChance: 0.12 },
    title: '朋友聚会',
    description: '老同学/朋友组织聚会,你犹豫要不要去。',
    context: '社交聚会是维护人际关系的重要方式。',
    choices: [
      {
        text: '积极参加',
        hint: '社交+18,快乐+15,财富-10',
        effects: { social: 18, happiness: 15, wealth: -10 },
        flags: { social_butterfly: true },
        result: '你玩得很开心,认识了很多新朋友!'
      },
      {
        text: '太累了,不想去',
        hint: '健康+5',
        effects: { health: 5 },
        result: '你选择在家休息,虽然错过了一些社交。'
      },
      {
        text: '去一会儿就提前离开',
        hint: '社交+8,快乐+8',
        effects: { social: 8, happiness: 8 },
        result: '你去露了个面,就提前回家了。'
      }
    ]
  },

  // 读书学习
  {
    id: 'daily_reading',
    year: null,
    category: 'daily',
    trigger: { ageRange: [15, 45], gender: null, randomChance: 0.12 },
    title: '阅读习惯',
    description: '你想培养阅读习惯,但总是坚持不下来。',
    context: '阅读是提升自己最经济的方式。',
    choices: [
      {
        text: '坚持每天阅读',
        hint: '学识+20,魅力+10',
        effects: { education: 20, charm: 10 },
        flags: { reader: true },
        result: '你养成了阅读习惯,每年读几十本书,收获很大!'
      },
      {
        text: '只读轻松的网络小说',
        hint: '快乐+10,学识+3',
        effects: { happiness: 10, education: 3 },
        result: '你经常看小说,但没读太多有深度的书。'
      },
      {
        text: '几乎不读书',
        hint: '学识-5',
        effects: { education: -5 },
        result: '你工作太忙,很少有时间读书。'
      }
    ]
  },

  // 理财投资
  {
    id: 'daily_invest',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 45], gender: null, randomChance: 0.1 },
    title: '理财投资',
    description: '你有一些闲钱,考虑如何理财。',
    context: '学会理财是财富增值的关键。',
    choices: [
      {
        text: '学习投资,购买基金股票',
        hint: '财富+20,学识+15',
        effects: { wealth: 20, education: 15 },
        flags: { investor: true },
        result: '你学习理财知识,投资获得了不错的收益!'
      },
      {
        text: '存银行定期',
        hint: '财富+10,学识+5',
        effects: { wealth: 10, education: 5 },
        result: '你选择稳健的存款方式,虽然收益不高但很安全。'
      },
      {
        text: '花掉了',
        hint: '快乐+15,财富-15',
        effects: { happiness: 15, wealth: -15 },
        flags: { spender: true },
        result: '你选择把钱花在享受上,活在当下。'
      }
    ]
  },

  // 宠物相关
  {
    id: 'daily_pet',
    year: null,
    category: 'daily',
    trigger: { ageRange: [20, 40], gender: null, randomChance: 0.08 },
    title: '养宠物',
    description: '你想养一只宠物陪伴自己。',
    context: '宠物可以给生活带来很多乐趣。',
    choices: [
      {
        text: '养猫',
        hint: '快乐+15,健康+5,社交+8,财富-10',
        effects: { happiness: 15, health: 5, social: 8, wealth: -10 },
        flags: { cat_owner: true },
        result: '你养了一只可爱的猫咪,每天回家都很治愈!'
      },
      {
        text: '养狗',
        hint: '快乐+18,健康+10,社交+12,财富-15',
        effects: { happiness: 18, health: 10, social: 12, wealth: -15 },
        flags: { dog_owner: true },
        result: '你养了一只狗狗,每天遛狗认识了很多邻居!'
      },
      {
        text: '不养,太麻烦',
        hint: '财富+5',
        effects: { wealth: 5 },
        result: '你觉得养宠物太麻烦,决定不养。'
      }
    ]
  },

  // 恋爱婚姻
  {
    id: 'daily_marriage',
    year: null,
    category: 'daily',
    trigger: { ageRange: [25, 35], gender: null, randomChance: 0.08 },
    title: '结婚考虑',
    description: '恋爱一段时间后,对方想结婚。',
    context: '婚姻是人生的重要决定。',
    choices: [
      {
        text: '结婚',
        hint: '社交+20,快乐+15,财富-20',
        effects: { social: 20, happiness: 15, wealth: -20 },
        flags: { married: true },
        result: '你们结婚了,开始了新的生活!'
      },
      {
        text: '觉得还不够了解,等等再说',
        hint: '学识+8',
        effects: { education: 8 },
        result: '你觉得还需要时间了解对方,没有立刻答应。'
      },
      {
        text: '分手',
        hint: '快乐-20,社交-10',
        effects: { happiness: -20, social: -10 },
        flags: { break_up: true },
        result: '你意识到对方不是合适的人,选择了分手。'
      }
    ]
  },

  // 育儿相关
  {
    id: 'daily_parenting',
    year: null,
    category: 'daily',
    trigger: { ageRange: [25, 40], gender: null, requireFlags: ['married'], randomChance: 0.1 },
    title: '生孩子的考虑',
    description: '你们在讨论是否要生孩子。',
    context: '生孩子是重大的人生决定。',
    choices: [
      {
        text: '生孩子',
        hint: '快乐+20,社交+15,财富-30,健康-10',
        effects: { happiness: 20, social: 15, wealth: -30, health: -10 },
        flags: { parent: true },
        result: '你们有了孩子,生活从此改变,虽然累但很幸福!'
      },
      {
        text: '暂时不要',
        hint: '财富+10,学识+5',
        effects: { wealth: 10, education: 5 },
        result: '你们决定先享受二人世界,以后再考虑。'
      },
      {
        text: '丁克,不生孩子',
        hint: '财富+15,快乐+10,社交-5',
        effects: { wealth: 15, happiness: 10, social: -5 },
        flags: { dink: true },
        result: '你们决定不生孩子,享受自由的生活。'
      }
    ]
  },

  // 父母养老
  {
    id: 'daily_elderly_care',
    year: null,
    category: 'daily',
    trigger: { ageRange: [30, 50], gender: null, randomChance: 0.1 },
    title: '父母养老',
    description: '父母年纪大了,需要照顾。',
    context: '照顾父母是子女的责任。',
    choices: [
      {
        text: '接父母同住',
        hint: '社交+15,快乐+10,财富-15',
        effects: { social: 15, happiness: 10, wealth: -15 },
        flags: { filial: true },
        result: '你把父母接来同住,虽然有些摩擦,但一家人团聚很幸福。'
      },
      {
        text: '请保姆照顾',
        hint: '财富-20,社交+10',
        effects: { wealth: -20, social: 10 },
        result: '你花钱请保姆照顾父母,自己有时间工作。'
      },
      {
        text: '送养老院',
        hint: '社交-10,财富-10,学识+5',
        effects: { social: -10, wealth: -10, education: 5 },
        flags: { pragmatic: true },
        result: '你送父母去养老院,有专业人员照顾。'
      }
    ]
  },

  // 退休规划
  {
    id: 'daily_retirement_planning',
    year: null,
    category: 'daily',
    trigger: { ageRange: [40, 50], gender: null, randomChance: 0.1 },
    title: '退休规划',
    description: '你开始考虑退休后的生活。',
    context: '提前规划退休生活很重要。',
    choices: [
      {
        text: '努力赚钱,提前退休',
        hint: '财富+25,健康-10,快乐-5',
        effects: { wealth: 25, health: -10, happiness: -5 },
        flags: { early_retirement_planner: true },
        result: '你努力工作攒钱,希望早日实现财务自由。'
      },
      {
        text: '培养退休后的兴趣爱好',
        hint: '快乐+15,魅力+10',
        effects: { happiness: 15, charm: 10 },
        flags: { hobby_preparer: true },
        result: '你开始学习摄影/书法等,为退休生活做准备。'
      },
      {
        text: '不考虑那么远,活在当下',
        hint: '快乐+10',
        effects: { happiness: 10 },
        result: '你觉得现在开心最重要,退休的事以后再说。'
      }
    ]
  },

  // 更多日常事件...
  {
    id: 'daily_makeup',
    year: null,
    category: 'daily',
    trigger: { ageRange: [16, 35], gender: 'female', randomChance: 0.12 },
    title: '化妆学习',
    description: '你想学习化妆,提升自己的形象。',
    context: '化妆是很多女性必备的技能。',
    choices: [
      {
        text: '认真学习化妆',
        hint: '魅力+18,快乐+10,财富-8',
        effects: { charm: 18, happiness: 10, wealth: -8 },
        flags: { makeup_skilled: true },
        result: '你努力学习化妆,技术越来越好,自信也提升了!'
      },
      {
        text: '简单化点淡妆',
        hint: '魅力+10,快乐+5',
        effects: { charm: 10, happiness: 5 },
        result: '你学会了一些基础技巧,日常足够用了。'
      },
      {
        text: '不化妆,自然美',
        hint: '学识+5',
        effects: { education: 5 },
        flags: { natural_beauty: true },
        result: '你选择保持自然,不化太浓的妆。'
      }
    ]
  },

  {
    id: 'daily_fashion',
    year: null,
    category: 'daily',
    trigger: { ageRange: [16, 35], gender: null, randomChance: 0.1 },
    title: '穿搭风格',
    description: '你想建立自己的穿衣风格。',
    context: '穿搭体现一个人的品味。',
    choices: [
      {
        text: '追求时尚潮流',
        hint: '魅力+15,社交+12,财富-15',
        effects: { charm: 15, social: 12, wealth: -15 },
        flags: { fashion_trend_follower: true },
        result: '你紧跟时尚潮流,成为朋友们的穿搭顾问!'
      },
      {
        text: '简约风格',
        hint: '魅力+10,学识+5',
        effects: { charm: 10, education: 5 },
        flags: { minimalist_style: true },
        result: '你建立了简约高级的穿搭风格,很受欢迎。'
      },
      {
        text: '不在意穿着',
        hint: '学识+5,财富+5',
        effects: { education: 5, wealth: 5 },
        result: '你觉得舒适最重要,不太在意别人的看法。'
      }
    ]
  },

  {
    id: 'daily_gaming',
    year: null,
    category: 'daily',
    trigger: { ageRange: [14, 30], gender: null, randomChance: 0.15 },
    title: '游戏时间',
    description: '新游戏发售,你想玩但是时间有限。',
    context: '游戏是很多人重要的娱乐方式。',
    choices: [
      {
        text: '沉迷游戏',
        hint: '快乐+18,学识-10,健康-12',
        effects: { happiness: 18, education: -10, health: -12 },
        flags: { game_addict: true },
        result: '你天天玩游戏,虽然很开心但其他都耽误了...'
      },
      {
        text: '适度游戏',
        hint: '快乐+12,健康-5,学识-3',
        effects: { happiness: 12, health: -5, education: -3 },
        flags: { casual_gamer: true },
        result: '你周末玩玩游戏,劳逸结合。'
      },
      {
        text: '完全不玩',
        hint: '学识+8,健康+5',
        effects: { education: 8, health: 5 },
        result: '你对游戏不感兴趣,把时间用在其他事情上。'
      }
    ]
  },

  {
    id: 'daily_music',
    year: null,
    category: 'daily',
    trigger: { ageRange: [12, 40], gender: null, randomChance: 0.12 },
    title: '音乐爱好',
    description: '你想学习一种乐器或培养音乐品味。',
    context: '音乐可以丰富生活,陶冶情操。',
    choices: [
      {
        text: '学习乐器',
        hint: '魅力+18,快乐+15,学识+10,财富-15',
        effects: { charm: 18, happiness: 15, education: 10, wealth: -15 },
        flags: { musician: true },
        result: '你开始学习钢琴/吉他等,虽然艰难但很有成就感!'
      },
      {
        text: '只是听音乐',
        hint: '快乐+12,学识+5',
        effects: { happiness: 12, education: 5 },
        flags: { music_lover: true },
        result: '你每天听音乐,音乐成为你生活的一部分。'
      },
      {
        text: '对音乐不感兴趣',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你觉得音乐可有可无,没有特别关注。'
      }
    ]
  },

  {
    id: 'daily_cooking',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 40], gender: null, randomChance: 0.1 },
    title: '做饭技能',
    description: '你想学做饭,提升生活品质。',
    context: '会做饭是重要的生活技能。',
    choices: [
      {
        text: '认真学习烹饪',
        hint: '健康+15,快乐+12,魅力+8',
        effects: { health: 15, happiness: 12, charm: 8 },
        flags: { cooking_master: true },
        result: '你报了烹饪班,厨艺大有长进,朋友都爱吃你做的菜!'
      },
      {
        text: '学几个简单菜',
        hint: '健康+10,快乐+8',
        effects: { health: 10, happiness: 8 },
        result: '你学会了几道家常菜,够自己吃了。'
      },
      {
        text: '经常点外卖',
        hint: '健康-8,财富-10,快乐+5',
        effects: { health: -8, wealth: -10, happiness: 5 },
        flags: { delivery_dependent: true },
        result: '你懒得做饭,经常点外卖。'
      }
    ]
  },

  {
    id: 'daily_social_media',
    year: null,
    category: 'daily',
    trigger: { ageRange: [16, 40], gender: null, randomChance: 0.15 },
    title: '社交媒体',
    description: '你花很多时间刷社交媒体。',
    context: '社交媒体是双刃剑,既连接人也消耗时间。',
    choices: [
      {
        text: '重度使用,发帖互动',
        hint: '社交+18,快乐+10,学识-8,健康-5',
        effects: { social: 18, happiness: 10, education: -8, health: -5 },
        flags: { social_media_heavy_user: true },
        result: '你每天发朋友圈/微博,获得了很多点赞和关注。'
      },
      {
        text: '适度使用',
        hint: '社交+10,快乐+8',
        effects: { social: 10, happiness: 8 },
        result: '你偶尔刷刷社交媒体,但不会沉迷。'
      },
      {
        text: '很少使用',
        hint: '学识+10,健康+5',
        effects: { education: 10, health: 5 },
        flags: { digital_detox: true },
        result: '你很少用社交媒体,把时间用在更有意义的事情上。'
      }
    ]
  },

  // ==================== 更多历史大事件 ====================

  // 2005-2010年补充
  {
    id: 'event_2005_mp3_player',
    year: 2005,
    category: 'tech',
    trigger: { ageRange: [12, 25], gender: null },
    title: 'MP3播放器流行',
    description: 'MP3播放器成为学生必备,可以随时随地听音乐。',
    context: '2005年前后,MP3播放器在学生中普及,iPod shuffle等成为热门产品。',
    choices: [
      {
        text: '攒钱买一个',
        hint: '快乐+12,社交+8,财富-10',
        effects: { happiness: 12, social: 8, wealth: -10 },
        flags: { tech_adopter: true },
        result: '你买了MP3播放器,每天都在听歌,很享受!'
      },
      {
        text: '觉得太贵,用手机听',
        hint: '财富+5',
        effects: { wealth: 5 },
        result: '你用手机听音乐,觉得也够用了。'
      },
      {
        text: '关注音乐产业变化',
        hint: '学识+12,技术+8',
        effects: { education: 12, tech_skill: 8 },
        flags: { digital_music_interest: true },
        result: '你观察到数字音乐正在改变音乐产业。'
      }
    ]
  },

  {
    id: 'event_2006_yu_meng_die_dan',
    year: 2006,
    category: 'entertainment',
    trigger: { ageRange: [14, 28], gender: null },
    title: '《魔兽世界》相关动画',
    description: '网上出现了大量《魔兽世界》相关的Flash动画和歌曲。',
    context: '2006年前后,《网瘾战争》、《我叫MT》等魔兽相关动画在网上爆红。',
    choices: [
      {
        text: '追着看这些动画',
        hint: '快乐+15,社交+10',
        effects: { happiness: 15, social: 10 },
        flags: { wow_culture_fan: true },
        result: '你被这些动画逗得哈哈大笑,也学会了很多梗。'
      },
      {
        text: '不感兴趣',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你没玩过魔兽世界,看不懂这些梗。'
      },
      {
        text: '学习Flash制作',
        hint: '技术+18,魅力+10',
        effects: { tech_skill: 18, charm: 10 },
        flags: { flash_creator: true },
        result: '你开始学习Flash制作,也想创作自己的动画!'
      }
    ]
  },

  {
    id: 'event_2007_joyo_amazon',
    year: 2007,
    category: 'tech',
    trigger: { ageRange: [16, 30], gender: null },
    title: '卓越网被亚马逊收购',
    description: '亚马逊完成对卓越网的收购,电商竞争加剧。',
    context: '2007年,亚马逊完全收购卓越网,开始在中国大力推广电商。',
    choices: [
      {
        text: '开始网购',
        hint: '财富+5,社交+8,技术+8',
        effects: { wealth: 5, social: 8, tech_skill: 8 },
        flags: { online_shopper: true },
        result: '你发现网购比实体店便宜,开始经常买买买。'
      },
      {
        text: '还是习惯实体店',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你更喜欢在实体店购物,觉得看得见摸得着更放心。'
      },
      {
        text: '研究电商模式',
        hint: '技术+15,学识+12',
        effects: { tech_skill: 15, education: 12 },
        flags: { ecommerce_interest: true },
        result: '你对电商模式很感兴趣,开始研究这个新兴产业。'
      }
    ]
  },

  {
    id: 'event_2008_kfc_crazy',
    year: 2008,
    category: 'entertainment',
    trigger: { ageRange: [8, 20], gender: null },
    title: '肯德基玩具',
    description: '肯德基的儿童套餐玩具成为小学生争相收藏的对象。',
    context: '2008年前后,肯德基推出的系列玩具在小学生中掀起收藏热。',
    choices: [
      {
        text: '缠着父母买',
        hint: '快乐+15,社交+10,财富-8',
        effects: { happiness: 15, social: 10, wealth: -8 },
        flags: { toy_collector: true },
        result: '你收集了很多玩具,在学校很受欢迎。'
      },
      {
        text: '不感兴趣',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你觉得这些玩具没什么意思。'
      },
      {
        text: '和同学交换',
        hint: '社交+15,快乐+10',
        effects: { social: 15, happiness: 10 },
        flags: { trader: true },
        result: '你通过交换获得了想要的玩具,学会了谈判。'
      }
    ]
  },

  {
    id: 'event_2009_taobao',
    year: 2009,
    category: 'internet',
    trigger: { ageRange: [16, 30], gender: null },
    title: '淘宝双11',
    description: '淘宝首次举办"双11"购物节,创造了单日销售奇迹。',
    context: '2009年,淘宝商城首次举办双11,27个品牌参与,销售额5200万。',
    choices: [
      {
        text: '参与抢购',
        hint: '快乐+12,财富-10,社交+8',
        effects: { happiness: 12, wealth: -10, social: 8 },
        flags: { shopping_festival_participant: true },
        result: '你抢到了一些便宜货,虽然熬夜但很开心!'
      },
      {
        text: '理性消费,不参与',
        hint: '财富+5,学识+5',
        effects: { wealth: 5, education: 5 },
        result: '你觉得这就是营销手段,没有被诱惑。'
      },
      {
        text: '研究这个营销模式',
        hint: '技术+12,学识+10',
        effects: { tech_skill: 12, education: 10 },
        flags: { marketing_analyst: true },
        result: '你分析了双11的营销策略,对电商有了新认识。'
      }
    ]
  },

  {
    id: 'event_2010_ipad',
    year: 2010,
    category: 'tech',
    trigger: { ageRange: [15, 40], gender: null },
    title: 'iPad发布',
    description: '苹果发布iPad,开启了平板电脑时代。',
    context: '2010年1月,史蒂夫·乔布斯发布第一代iPad,重新定义了平板电脑。',
    choices: [
      {
        text: '立即购买',
        hint: '快乐+18,技术+12,社交+10,财富-25',
        effects: { happiness: 18, tech_skill: 12, social: 10, wealth: -25 },
        flags: { early_adopter: true },
        result: 'iPad成为了你的娱乐和工作工具,太方便了!'
      },
      {
        text: '等待观察',
        hint: '学识+8',
        effects: { education: 8 },
        result: '你觉得平板电脑用途有限,持观望态度。'
      },
      {
        text: '关注它对出版业的影响',
        hint: '学识+18,技术+10',
        effects: { education: 18, tech_skill: 10 },
        flags: { publishing_observer: true },
        result: '你意识到iPad将改变阅读和出版行业。'
      }
    ]
  },

  // 2011-2015年补充
  {
    id: 'event_2011_weibo_wei_xi',
    year: 2011,
    category: 'entertainment',
    trigger: { ageRange: [15, 30], gender: null },
    title: '微博抽奖热',
    description: '微博上各种抽奖活动层出不穷,成为用户增长的重要方式。',
    context: '2011年,微博大V们通过转发抽奖迅速涨粉,形成独特的微博文化。',
    choices: [
      {
        text: '疯狂参与抽奖',
        hint: '社交+12,快乐+8',
        effects: { social: 12, happiness: 8 },
        flags: { lottery_enthusiast: true },
        result: '你每天转发各种抽奖,虽然很少中奖,但很期待。'
      },
      {
        text: '不参与,觉得浪费时间',
        hint: '学识+8',
        effects: { education: 8 },
        result: '你觉得中奖概率太低,不浪费精力。'
      },
      {
        text: '研究微博营销',
        hint: '技术+15,社交+12,财富+8',
        effects: { tech_skill: 15, social: 12, wealth: 8 },
        flags: { weibo_marketer: true },
        result: '你研究微博运营技巧,为将来做营销打基础。'
      }
    ]
  },

  {
    id: 'event_2012_gangnam_style_copy',
    year: 2012,
    category: 'entertainment',
    trigger: { ageRange: [12, 30], gender: null },
    title: '各种模仿江南Style',
    description: '网络上出现了各种版本的江南Style模仿视频。',
    context: '2012年,从明星到普通网友,都在模仿骑马舞。',
    choices: [
      {
        text: '和朋友拍模仿视频',
        hint: '快乐+18,社交+15,健康+5',
        effects: { happiness: 18, social: 15, health: 5 },
        flags: { video_creator: true },
        result: '你和朋友们拍了一个搞笑视频,获得了不少点赞!'
      },
      {
        text: '只是看,不参与',
        hint: '快乐+8',
        effects: { happiness: 8 },
        result: '你刷各种视频,被逗得哈哈大笑。'
      },
      {
        text: '觉得太无聊',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你觉得这种模仿没什么意义。'
      }
    ]
  },

  {
    id: 'event_2013_takeaway_start',
    year: 2013,
    category: 'internet',
    trigger: { ageRange: [18, 35], gender: null },
    title: '外卖兴起',
    description: '外卖平台开始在各大城市兴起,点外卖变得方便。',
    context: '2013年前后,饿了么、美团外卖等平台崛起,改变了人们的饮食习惯。',
    choices: [
      {
        text: '经常点外卖',
        hint: '快乐+10,健康-8,财富-8',
        effects: { happiness: 10, health: -8, wealth: -8 },
        flags: { delivery_user: true },
        result: '你经常点外卖,不用自己做饭,但健康开始下降。'
      },
      {
        text: '偶尔点,主要自己做饭',
        hint: '健康+8,快乐+5',
        effects: { health: 8, happiness: 5 },
        result: '你偶尔点外卖改善伙食,但主要还是自己做饭。'
      },
      {
        text: '从不点外卖',
        hint: '健康+12,财富+5',
        effects: { health: 12, wealth: 5 },
        flags: { healthy_eater: true },
        result: '你坚持自己做饭,既健康又省钱。'
      }
    ]
  },

  {
    id: 'event_2014_ice_bucket_china',
    year: 2014,
    category: 'entertainment',
    trigger: { ageRange: [15, 40], gender: null },
    title: '冰桶挑战中国版',
    description: '冰桶挑战在中国科技圈、娱乐圈迅速蔓延。',
    context: '2014年,雷军、周鸿祎等科技大佬纷纷参与,将公益与社交结合。',
    choices: [
      {
        text: '参与挑战',
        hint: '社交+15,快乐+12,魅力+8',
        effects: { social: 15, happiness: 12, charm: 8 },
        flags: { charity_participant: true },
        result: '你上传了冰水浇头的视频,朋友们纷纷点赞!'
      },
      {
        text: '只捐款不浇冰水',
        hint: '魅力+10,学识+8',
        effects: { charm: 10, education: 8 },
        flags: { rational_donor: true },
        result: '你选择直接捐款,觉得形式不重要。'
      },
      {
        text: '关注渐冻症',
        hint: '学识+18,魅力+8',
        effects: { education: 18, charm: 8 },
        flags: { medical_interest: true },
        result: '你借机了解了罕见病,对生命有了新的认识。'
      }
    ]
  },

  {
    id: 'event_2015_o2o_war',
    year: 2015,
    category: 'internet',
    trigger: { ageRange: [18, 40], gender: null },
    title: 'O2O大战',
    description: '各种O2O(线上到线下)服务获得巨额融资,补贴大战开始。',
    context: '2015年,O2O创业火热,按摩、美甲、洗车等各种上门服务涌现。',
    choices: [
      {
        text: '薅羊毛,享受补贴',
        hint: '财富+15,快乐+12,社交+8',
        effects: { wealth: 15, happiness: 12, social: 8 },
        flags: { deal_hunter: true },
        result: '你以极低价格享受了各种服务,薅羊毛很爽!'
      },
      {
        text: '觉得不安全,不尝试',
        hint: '健康+5,学识+5',
        effects: { health: 5, education: 5 },
        result: '你担心安全和质量,没有尝试这些服务。'
      },
      {
        text: '加入O2O创业',
        hint: '技术+18,学识+15,财富-20',
        effects: { tech_skill: 18, education: 15, wealth: -20 },
        flags: { startup_founder: true },
        result: '你辞职创业加入了O2O热潮,前途未卜。'
      }
    ]
  },

  // 2016-2020年补充
  {
    id: 'event_2016_livestreaming_sale',
    year: 2016,
    category: 'internet',
    trigger: { ageRange: [18, 40], gender: null },
    title: '直播带货萌芽',
    description: '一些网红开始尝试在直播中卖货。',
    context: '2016年前后,直播带货开始出现,但还未成为主流。',
    choices: [
      {
        text: '在直播中买过东西',
        hint: '快乐+8,财富-5,社交+5',
        effects: { happiness: 8, wealth: -5, social: 5 },
        flags: { live_shopping_consumer: true },
        result: '你在主播推荐下买了一些东西,有的还不错。'
      },
      {
        text: '不信任直播卖货',
        hint: '学识+8',
        effects: { education: 8 },
        result: '你觉得直播带货不靠谱,不会买。'
      },
      {
        text: '研究这个新模式',
        hint: '技术+15,学识+12,财富+5',
        effects: { tech_skill: 15, education: 12, wealth: 5 },
        flags: { ecommerce_researcher: true },
        result: '你意识到这是电商的新趋势,开始深入研究。'
      }
    ]
  },

  {
    id: 'event_2017_shared_bikes',
    year: 2017,
    category: 'tech',
    trigger: { ageRange: [16, 40], gender: null },
    title: '共享单车大战',
    description: '摩拜、ofo等共享单车在城市街头随处可见,颜色大战开始。',
    context: '2017年,共享单车行业爆发,各种颜色的单车布满城市街道。',
    choices: [
      {
        text: '经常骑共享单车',
        hint: '健康+12,快乐+10',
        effects: { health: 12, happiness: 10 },
        flags: { bike_user: true },
        result: '你经常骑共享单车上班,方便又环保!'
      },
      {
        text: '押金问题不信任',
        hint: '财富+5',
        effects: { wealth: 5 },
        result: '你担心押金退不回来,没有注册。'
      },
      {
        text: '投资共享经济',
        hint: '财富+15,技术+10',
        effects: { wealth: 15, tech_skill: 10 },
        flags: { sharing_economy_investor: true },
        result: '你投资了共享经济概念,获得了一些收益。'
      }
    ]
  },

  {
    id: 'event_2018_dou_teng',
    year: 2018,
    category: 'game',
    trigger: { ageRange: [12, 30], gender: null },
    title: '《旅行青蛙》爆红',
    description: '佛系手游《旅行青蛙》在朋友圈刷屏。',
    context: '2018年,这款养成类游戏以佛系、治愈的特点吸引了大量玩家。',
    choices: [
      {
        text: '沉迷养蛙',
        hint: '快乐+12,社交+10',
        effects: { happiness: 12, social: 10 },
        flags: { frog_parent: true },
        result: '你每天都要收割三叶草,看看蛙儿子回来没。'
      },
      {
        text: '偶尔看看',
        hint: '快乐+6',
        effects: { happiness: 6 },
        result: '你下载了游戏,但没有太沉迷。'
      },
      {
        text: '不感兴趣',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你觉得这就是个普通的养成游戏。'
      }
    ]
  },

  {
    id: 'event_2019_lihongyi_yuanyin',
    year: 2019,
    category: 'entertainment',
    trigger: { ageRange: [15, 35], gender: null },
    title: '李子柒走红',
    description: '李子柒的田园生活视频在国内外爆红。',
    context: '2019年,李子柒的视频展现的中国传统文化和田园生活,受到全球观众喜爱。',
    choices: [
      {
        text: '成为粉丝,每期必看',
        hint: '快乐+15,学识+10,魅力+8',
        effects: { happiness: 15, education: 10, charm: 8 },
        flags: { li_ziqi_fan: true },
        result: '你被李子柒视频中的田园生活深深吸引,向往那种生活。'
      },
      {
        text: '偶尔看看',
        hint: '快乐+8,学识+5',
        effects: { happiness: 8, education: 5 },
        result: '你看过几期视频,觉得画面很美。'
      },
      {
        text: '开始学习传统文化',
        hint: '学识+18,魅力+12',
        effects: { education: 18, charm: 12 },
        flags: { culture_learner: true },
        result: '你被视频激发,开始学习中国传统文化。'
      }
    ]
  },

  {
    id: 'event_2020_home_office',
    year: 2020,
    category: 'tech',
    trigger: { ageRange: [22, 45], gender: null },
    title: '远程办公普及',
    description: '远程办公工具被广泛使用,在家工作成为常态。',
    context: '2020年,钉钉、腾讯会议等远程办公工具迅速普及。',
    choices: [
      {
        text: '适应良好,效率提高',
        hint: '技术+12,财富+8,快乐+8',
        effects: { tech_skill: 12, wealth: 8, happiness: 8 },
        flags: { remote_worker: true },
        result: '你发现在家工作效率更高,还能省下通勤时间!'
      },
      {
        text: '不太适应,想念办公室',
        hint: '社交-10,快乐-5',
        effects: { social: -10, happiness: -5 },
        flags: { office_missed: true },
        result: '你在家工作感觉孤独,效率下降。'
      },
      {
        text: '学习远程协作技巧',
        hint: '技术+18,社交+12,学识+10',
        effects: { tech_skill: 18, social: 12, education: 10 },
        flags: { remote_collaboration_expert: true },
        result: '你主动学习远程协作方法,成为了这方面的专家。'
      }
    ]
  },

  // ==================== 更多日常事件 ====================

  {
    id: 'daily_online_course',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 40], gender: null, randomChance: 0.1 },
    title: '在线课程',
    description: '网上有很多优质课程,你可以利用业余时间学习。',
    context: '在线学习是提升自己的好方式。',
    choices: [
      {
        text: '报名学习',
        hint: '学识+20,技术+12,财富-8',
        effects: { education: 20, tech_skill: 12, wealth: -8 },
        flags: { lifelong_learner: true },
        result: '你坚持学完课程,获得了很多新知识!'
      },
      {
        text: '只买不听',
        hint: '财富-8',
        effects: { wealth: -8 },
        flags: { course_hoarder: true },
        result: '你买了不少课程,但都没听完。'
      },
      {
        text: '免费资源自学',
        hint: '学识+15,技术+10',
        effects: { education: 15, tech_skill: 10 },
        flags: { self_taught: true },
        result: '你利用B站等免费资源学习,省了不少钱!'
      }
    ]
  },

  {
    id: 'daily_side_hustle',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.08 },
    title: '副业机会',
    description: '你发现了一个可以赚钱的副业机会。',
    context: '副业收入可以改善生活,但也会占用时间。',
    choices: [
      {
        text: '开展副业',
        hint: '财富+20,技术+10,健康-8,快乐-5',
        effects: { wealth: 20, tech_skill: 10, health: -8, happiness: -5 },
        flags: { side_hustler: true },
        result: '你开始了副业,虽然累但收入增加了!'
      },
      {
        text: '精力有限,放弃',
        hint: '健康+5,快乐+5',
        effects: { health: 5, happiness: 5 },
        result: '你把时间花在休息和陪伴家人上。'
      },
      {
        text: '先调研再决定',
        hint: '学识+12,技术+8',
        effects: { education: 12, tech_skill: 8 },
        flags: { cautious_entrepreneur: true },
        result: '你详细调研了市场,谨慎决策。'
      }
    ]
  },

  {
    id: 'daily_mental_health',
    year: null,
    category: 'daily',
    trigger: { ageRange: [20, 45], gender: null, randomChance: 0.08 },
    title: '压力过大',
    description: '你最近感觉压力很大,情绪低落。',
    context: '现代人普遍面临心理健康问题。',
    choices: [
      {
        text: '寻求心理咨询',
        hint: '快乐+12,健康+10,学识+8,财富-10',
        effects: { happiness: 12, health: 10, education: 8, wealth: -10 },
        flags: { therapy_goer: true },
        result: '心理咨询帮助了你,你学会了更好的应对压力的方法。'
      },
      {
        text: '和朋友倾诉',
        hint: '社交+15,快乐+10',
        effects: { social: 15, happiness: 10 },
        flags: { open_communicator: true },
        result: '朋友的倾听让你感觉好多了。'
      },
      {
        text: '自己消化',
        hint: '快乐-10,健康-8',
        effects: { happiness: -10, health: -8 },
        flags: { bottled_emotions: true },
        result: '你把情绪压在心里,状况没有改善。'
      }
    ]
  },

  {
    id: 'daily_dating_apps',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 35], gender: null, randomChance: 0.1 },
    title: '约会软件',
    description: '朋友推荐你试试约会软件找对象。',
    context: '约会软件已经成为年轻人认识新朋友的重要方式。',
    choices: [
      {
        text: '注册使用',
        hint: '社交+18,快乐+10,魅力+5',
        effects: { social: 18, happiness: 10, charm: 5 },
        flags: { dating_app_user: true },
        result: '你在软件上认识了几个有趣的人,虽然没成但很有趣。'
      },
      {
        text: '觉得不靠谱',
        hint: '学识+8',
        effects: { education: 8 },
        result: '你不相信网上交友,还是相信缘分。'
      },
      {
        text: '研究这种模式',
        hint: '技术+12,学识+10',
        effects: { tech_skill: 12, education: 10 },
        flags: { social_app_analyst: true },
        result: '你分析了约会软件的产品设计和商业模式。'
      }
    ]
  },

  {
    id: 'daily_gift',
    year: null,
    category: 'daily',
    trigger: { ageRange: [15, 40], gender: null, randomChance: 0.1 },
    title: '送礼选择',
    description: '朋友生日快到了,你在考虑送什么礼物。',
    context: '送礼是一门学问,送对了能增进感情。',
    choices: [
      {
        text: '精心挑选贵重礼物',
        hint: '社交+15,快乐+12,财富-15',
        effects: { social: 15, happiness: 12, wealth: -15 },
        flags: { generous_giver: true },
        result: '朋友很感动,你们的关系更亲密了!'
      },
      {
        text: '送DIY礼物',
        hint: '社交+12,魅力+10,快乐+10',
        effects: { social: 12, charm: 10, happiness: 10 },
        flags: { creative_giver: true },
        result: '你亲手做了礼物,朋友被你的用心感动!'
      },
      {
        text: '随便买个普通的',
        hint: '社交+5,财富-5',
        effects: { social: 5, wealth: -5 },
        result: '你买了个普通的礼物,朋友礼貌收下。'
      }
    ]
  },

  {
    id: 'daily_fitness_challenge',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 40], gender: null, randomChance: 0.1 },
    title: '健身挑战',
    description: '社交媒体上有人发起健身挑战,30天练出好身材。',
    context: '健身挑战能帮助人们养成运动习惯。',
    choices: [
      {
        text: '参加并坚持下来',
        hint: '健康+25,魅力+15,快乐+15',
        effects: { health: 25, charm: 15, happiness: 15 },
        flags: { fitness_master: true },
        result: '你坚持了30天,身材变好了,也更有自信了!'
      },
      {
        text: '半途而废',
        hint: '健康+8,快乐+3',
        effects: { health: 8, happiness: 3 },
        flags: { quitter: true },
        result: '你坚持了几天就放弃了,至少尝试过。'
      },
      {
        text: '不参与,自己练',
        hint: '健康+15,学识+5',
        effects: { health: 15, education: 5 },
        flags: { independent_exerciser: true },
        result: '你觉得挑战不适合自己,按自己的节奏锻炼。'
      }
    ]
  },

  {
    id: 'daily_morning_routine',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 40], gender: null, randomChance: 0.12 },
    title: '早起习惯',
    description: '你决定培养早起的习惯,但坚持起来不容易。',
    context: '早起能给一天带来更多时间,但需要很强的自律。',
    choices: [
      {
        text: '坚持每天早起',
        hint: '健康+18,学识+15,魅力+8',
        effects: { health: 18, education: 15, charm: 8 },
        flags: { early_riser: true },
        result: '你养成了早起的习惯,每天多出一小时学习!'
      },
      {
        text: '偶尔早起',
        hint: '健康+10,学识+8',
        effects: { health: 10, education: 8 },
        result: '你偶尔能早起,但很难坚持。'
      },
      {
        text: '放弃,睡到自然醒',
        hint: '健康+5,快乐+5',
        effects: { health: 5, happiness: 5 },
        result: '你还是喜欢睡懒觉,早起不适合你。'
      }
    ]
  },

  {
    id: 'daily_book_club',
    year: null,
    category: 'daily',
    trigger: { ageRange: [20, 45], gender: null, randomChance: 0.08 },
    title: '读书会',
    description: '朋友邀请你参加读书会,定期分享读书心得。',
    context: '读书会是培养阅读习惯和认识朋友的好方式。',
    choices: [
      {
        text: '积极参加',
        hint: '学识+20,社交+15,魅力+10',
        effects: { education: 20, social: 15, charm: 10 },
        flags: { book_club_member: true },
        result: '你读了很多书,也认识了很多爱读书的朋友!'
      },
      {
        text: '偶尔参加',
        hint: '学识+12,社交+8',
        effects: { education: 12, social: 8 },
        result: '你有空就去参加,收获还不错。'
      },
      {
        text: '没时间,不参加',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你工作太忙,没有参加读书会。'
      }
    ]
  },

  {
    id: 'daily_volunteer',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 45], gender: null, randomChance: 0.08 },
    title: '志愿者机会',
    description: '社区在招募志愿者,你考虑是否参加。',
    context: '做志愿者既能帮助他人,也能获得成就感。',
    choices: [
      {
        text: '成为志愿者',
        hint: '社交+20,快乐+18,魅力+12',
        effects: { social: 20, happiness: 18, charm: 12 },
        flags: { community_volunteer: true },
        result: '你帮助了很多人,收获了满满的成就感和新朋友!'
      },
      {
        text: '偶尔参与',
        hint: '社交+12,快乐+10',
        effects: { social: 12, happiness: 10 },
        result: '你有时间就去做志愿者,感觉很有意义。'
      },
      {
        text: '太忙了,不参加',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你想参与但工作太忙,实在抽不出时间。'
      }
    ]
  },

  {
    id: 'daily_reunion',
    year: null,
    category: 'daily',
    trigger: { ageRange: [25, 45], gender: null, randomChance: 0.08 },
    title: '同学聚会',
    description: '老同学组织聚会,你犹豫要不要去。',
    context: '同学聚会是重叙旧情的好机会,但也可能带来比较和压力。',
    choices: [
      {
        text: '热情参加',
        hint: '社交+18,快乐+15,财富-10',
        effects: { social: 18, happiness: 15, wealth: -10 },
        flags: { social_butterfly: true },
        result: '你见到了老同学,聊得很开心,感觉像回到了青春!'
      },
      {
        text: '不想比较,不去',
        hint: '快乐+5',
        effects: { happiness: 5 },
        flags: { avoid_comparison: true },
        result: '你不想参加同学间的比较,选择不去。'
      },
      {
        text: '担心混得不好',
        hint: '快乐-10,社交-5',
        effects: { happiness: -10, social: -5 },
        flags: { insecure: true },
        result: '你因为担心在同学面前没面子而没去聚会。'
      }
    ]
  },

  {
    id: 'daily_digital_minimalism',
    year: null,
    category: 'daily',
    trigger: { ageRange: [20, 40], gender: null, randomChance: 0.1 },
    title: '数字极简主义',
    description: '你发现花太多时间在手机上,想减少数字设备使用。',
    context: '数字排毒可以提高生活质量,减少焦虑。',
    choices: [
      {
        text: '严格执行数字排毒',
        hint: '学识+18,健康+15,快乐+12',
        effects: { education: 18, health: 15, happiness: 12 },
        flags: { digital_detox: true },
        result: '你大幅减少了手机使用,感觉生活更充实了!'
      },
      {
        text: '适度减少',
        hint: '学识+10,健康+8,快乐+8',
        effects: { education: 10, health: 8, happiness: 8 },
        result: '你减少了一些不必要的APP使用,生活更有规律。'
      },
      {
        text: '做不到,继续刷',
        hint: '学识-5,健康-5',
        effects: { education: -5, health: -5 },
        flags: { phone_addict: true },
        result: '你想戒手机,但习惯太难改了,还是老样子。'
      }
    ]
  },

  {
    id: 'daily_meditation',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 45], gender: null, randomChance: 0.1 },
    title: '冥想练习',
    description: '听说冥想能缓解压力,你想试试。',
    context: '冥想是现代流行的减压和专注力训练方法。',
    choices: [
      {
        text: '每天坚持冥想',
        hint: '健康+18,快乐+15,学识+12',
        effects: { health: 18, happiness: 15, education: 12 },
        flags: { meditation_practitioner: true },
        result: '你坚持冥想,压力减轻了,专注力也提高了!'
      },
      {
        text: '偶尔冥想',
        hint: '健康+10,快乐+8',
        effects: { health: 10, happiness: 8 },
        result: '你心情不好的时候会冥想一下,有帮助。'
      },
      {
        text: '试了一下就放弃',
        hint: '学识+3',
        effects: { education: 3 },
        flags: { quitter: true },
        result: '你试了几次冥想,觉得不太适合自己。'
      }
    ]
  },

  {
    id: 'daily_coffee',
    year: null,
    category: 'daily',
    trigger: { ageRange: [20, 40], gender: null, randomChance: 0.12 },
    title: '咖啡习惯',
    description: '工作后你开始喝咖啡提神,慢慢养成了习惯。',
    context: '咖啡是很多职场人的必需品,但要适量饮用。',
    choices: [
      {
        text: '每天喝很多咖啡',
        hint: '学识+10,健康-8,财富-8',
        effects: { education: 10, health: -8, wealth: -8 },
        flags: { coffee_addict: true },
        result: '你每天好几杯咖啡,虽然提神但也开始影响睡眠。'
      },
      {
        text: '适量饮用',
        hint: '学识+8,快乐+5,财富-5',
        effects: { education: 8, happiness: 5, wealth: -5 },
        result: '你每天一杯咖啡,享受提神效果不过度。'
      },
      {
        text: '不喝咖啡',
        hint: '健康+8,财富+5',
        effects: { health: 8, wealth: 5 },
        flags: { caffeine_free: true },
        result: '你用喝茶或运动来提神,不依赖咖啡。'
      }
    ]
  },

  {
    id: 'daily_feng_shui',
    year: null,
    category: 'daily',
    trigger: { ageRange: [25, 45], gender: null, randomChance: 0.08 },
    title: '家居布置',
    description: '你想改善居住环境,让家更舒适。',
    context: '良好的居住环境能提高生活质量。',
    choices: [
      {
        text: '精心布置',
        hint: '快乐+15,魅力+12,财富-12',
        effects: { happiness: 15, charm: 12, wealth: -12 },
        flags: { home_decorator: true },
        result: '你花了很多心思布置,家变得很温馨,每天回家都很开心!'
      },
      {
        text: '简单整理',
        hint: '快乐+10,健康+8',
        effects: { happiness: 10, health: 8 },
        result: '你做了简单的整理,环境改善了些。'
      },
      {
        text: '太忙了,没时间管',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你想改善但工作太忙,一直没有行动。'
      }
    ]
  },

  {
    id: 'daily_diy_craft',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 40], gender: null, randomChance: 0.08 },
    title: 'DIY手工',
    description: '你想尝试做手工,比如木工、陶艺、编织等。',
    context: '手工制作可以锻炼耐心,也能做出独特的物品。',
    choices: [
      {
        text: '深入学习',
        hint: '魅力+18,快乐+15,学识+10,财富-10',
        effects: { charm: 18, happiness: 15, education: 10, wealth: -10 },
        flags: { craftsman: true },
        result: '你学会了精湛的手工技艺,作品受到朋友称赞!'
      },
      {
        text: '偶尔做做',
        hint: '魅力+12,快乐+10',
        effects: { charm: 12, happiness: 10 },
        result: '你偶尔做做手工,享受创作的乐趣。'
      },
      {
        text: '买了材料但没做',
        hint: '财富-8',
        effects: { wealth: -8 },
        flags: { crafter_wannabe: true },
        result: '你买了不少材料,但一直没时间做。'
      }
    ]
  },

  {
    id: 'daily_language_learning',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 40], gender: null, randomChance: 0.1 },
    title: '学习外语',
    description: '你想学习一门外语,提升自己。',
    context: '掌握外语能打开更多机会。',
    choices: [
      {
        text: '系统学习',
        hint: '学识+22,技术+12,财富-10',
        effects: { education: 22, tech_skill: 12, wealth: -10 },
        flags: { language_learner: true },
        result: '你坚持学习,外语水平大幅提升!'
      },
      {
        text: '用APP碎片学习',
        hint: '学识+15,快乐+8',
        effects: { education: 15, happiness: 8 },
        flags: { casual_learner: true },
        result: '你每天用APP学习,虽然慢但很坚持。'
      },
      {
        text: '太困难,放弃了',
        hint: '学识+5',
        effects: { education: 5 },
        flags: { language_quitter: true },
        result: '你学了一段时间觉得太难,放弃了。'
      }
    ]
  },

  {
    id: 'daily_podcast',
    year: null,
    category: 'daily',
    trigger: { ageRange: [20, 40], gender: null, randomChance: 0.1 },
    title: '播客节目',
    description: '你发现了一些有趣的播客节目,可以在通勤时听。',
    context: '播客是获取知识和娱乐的好方式。',
    choices: [
      {
        text: '成为忠实听众',
        hint: '学识+18,快乐+12,技术+5',
        effects: { education: 18, happiness: 12, tech_skill: 5 },
        flags: { podcast_listener: true },
        result: '你每天听播客,学到了很多新知识!'
      },
      {
        text: '偶尔听听',
        hint: '学识+10,快乐+8',
        effects: { education: 10, happiness: 8 },
        result: '你有兴趣的节目就听听,偶尔也挺好。'
      },
      {
        text: '更喜欢看视频',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你觉得播客太单调,还是更喜欢看视频。'
      }
    ]
  },

  {
    id: 'daily_journaling',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 40], gender: null, randomChance: 0.1 },
    title: '写日记',
    description: '你想开始写日记,记录生活。',
    context: '写日记可以帮助反思,也是珍贵的记忆。',
    choices: [
      {
        text: '坚持每天写',
        hint: '学识+15,魅力+10,快乐+8',
        effects: { education: 15, charm: 10, happiness: 8 },
        flags: { journal_writer: true },
        result: '你养成了写日记的习惯,翻看时很有感触!'
      },
      {
        text: '偶尔写写',
        hint: '学识+10,快乐+6',
        effects: { education: 10, happiness: 6 },
        result: '你心情有波动的时候会写写日记。'
      },
      {
        text: '写了几天就放弃了',
        hint: '学识+3',
        effects: { education: 3 },
        flags: { quitter: true },
        result: '你开始写日记,但很难坚持下来。'
      }
    ]
  },

  {
    id: 'daily_public_speaking',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.08 },
    title: '公开演讲机会',
    description: '公司/学校有公开演讲的机会,你在犹豫要不要参加。',
    context: '公开演讲能力很重要,也能提升自信心。',
    choices: [
      {
        text: '勇敢参加',
        hint: '魅力+20,社交+15,学识+10',
        effects: { charm: 20, social: 15, education: 10 },
        flags: { public_speaker: true },
        result: '你虽然紧张但成功完成了演讲,自信心大增!'
      },
      {
        text: '太紧张,放弃',
        hint: '学识+3',
        effects: { education: 3 },
        flags: { public_speaking_fear: true },
        result: '你害怕当众演讲,选择了放弃。'
      },
      {
        text: '先做充分准备',
        hint: '学识+18,魅力+15,社交+12',
        effects: { education: 18, charm: 15, social: 12 },
        flags: { prepared_speaker: true },
        result: '你花了很多时间准备,演讲非常成功!'
      }
    ]
  },

  {
    id: 'daily_networking',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.1 },
    title: '社交网络',
    description: '行业有社交活动,你考虑要不要去拓展人脉。',
    context: '职场人脉对发展很重要,但社交也需要时间精力。',
    choices: [
      {
        text: '积极参加',
        hint: '社交+20,魅力+12,财富-8',
        effects: { social: 20, charm: 12, wealth: -8 },
        flags: { networker: true },
        result: '你认识了很多人,为将来发展积累了人脉!'
      },
      {
        text: '选择性参加',
        hint: '社交+12,财富-5',
        effects: { social: 12, wealth: -5 },
        result: '你只参加高质量的社交活动,效率很高。'
      },
      {
        text: '不喜欢社交,不参加',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你更喜欢靠实力说话,不热衷社交。'
      }
    ]
  },

  {
    id: 'daily_mentoring',
    year: null,
    category: 'daily',
    trigger: { ageRange: [28, 50], gender: null, randomChance: 0.08 },
    title: '担任导师',
    description: '公司/学校邀请你担任新人导师。',
    context: '带新人能提升领导力,也能巩固自己的知识。',
    choices: [
      {
        text: '认真指导',
        hint: '社交+18,学识+15,魅力+12',
        effects: { social: 18, education: 15, charm: 12 },
        flags: { mentor: true },
        result: '你耐心指导新人,帮助他们成长,自己也收获很大!'
      },
      {
        text: '随便带带',
        hint: '社交+8,学识+5',
        effects: { social: 8, education: 5 },
        result: '你做了基本的工作,但投入不多。'
      },
      {
        text: '太忙,不接受',
        hint: '学识+8',
        effects: { education: 8 },
        result: '你工作太忙,没有精力带新人。'
      }
    ]
  },

  {
    id: 'daily_side_project',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.08 },
    title: '个人项目',
    description: '你有个想法想做个个人项目,但需要业余时间。',
    context: '个人项目可以展示能力,也可能带来意外收获。',
    choices: [
      {
        text: '认真开发',
        hint: '技术+20,学识+15,财富+8,健康-8',
        effects: { tech_skill: 20, education: 15, wealth: 8, health: -8 },
        flags: { side_project_creator: true },
        result: '你的项目获得了关注,甚至有合作机会!'
      },
      {
        text: '做了一半放弃',
        hint: '技术+8',
        effects: { tech_skill: 8 },
        flags: { project_abandoned: true },
        result: '你开始做了但太忙,项目不了了之。'
      },
      {
        text: '只是想想没行动',
        hint: '学识+3',
        effects: { education: 3 },
        flags: { idea_only: true },
        result: '你有想法但一直没有行动。'
      }
    ]
  },

  {
    id: 'daily_sustainable_living',
    year: null,
    category: 'daily',
    trigger: { ageRange: [20, 40], gender: null, randomChance: 0.1 },
    title: '环保生活',
    description: '你想尝试更环保的生活方式。',
    context: '可持续生活方式对环境友好,也能省钱。',
    choices: [
      {
        text: '全面实践',
        hint: '健康+15,魅力+12,财富+12,学识+10',
        effects: { health: 15, charm: 12, wealth: 12, education: 10 },
        flags: { sustainable_liver: true },
        result: '你减少浪费、循环利用,既环保又省钱!'
      },
      {
        text: '部分实践',
        hint: '健康+10,财富+8',
        effects: { health: 10, wealth: 8 },
        result: '你做了一些环保改变,感觉还不错。'
      },
      {
        text: '觉得太麻烦',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你想环保但觉得太麻烦,没有行动。'
      }
    ]
  },

  {
    id: 'daily_gift_from_friend',
    year: null,
    category: 'daily',
    trigger: { ageRange: [15, 40], gender: null, randomChance: 0.08 },
    title: '收到礼物',
    description: '朋友送了你一份礼物,你觉得应该回礼。',
    context: '礼尚往来是维系友谊的重要方式。',
    choices: [
      {
        text: '精心准备回礼',
        hint: '社交+18,魅力+15,快乐+12,财富-12',
        effects: { social: 18, charm: 15, happiness: 12, wealth: -12 },
        flags: { thoughtful_friend: true },
        result: '你的用心让朋友很感动,友谊更深了!'
      },
      {
        text: '简单回礼',
        hint: '社交+10,财富-8',
        effects: { social: 10, wealth: -8 },
        result: '你送了个普通的礼物,朋友也理解。'
      },
      {
        text: '忘记回礼',
        hint: '社交-10',
        effects: { social: -10 },
        flags: { forgetful: true },
        result: '你太忙忘记回礼,朋友有点失望。'
      }
    ]
  },

  {
    id: 'daily_hair_style',
    year: null,
    category: 'daily',
    trigger: { ageRange: [16, 35], gender: null, randomChance: 0.1 },
    title: '换发型',
    description: '你想换个新发型,改变一下形象。',
    context: '新发型能带来新心情,也能改变他人对你的印象。',
    choices: [
      {
        text: '大胆尝试新发型',
        hint: '魅力+18,快乐+15,财富-10',
        effects: { charm: 18, happiness: 15, wealth: -10 },
        flags: { fashion_explorer: true },
        result: '新发型让你焕然一新,朋友们都说好看!'
      },
      {
        text: '保守一点微调',
        hint: '魅力+10,快乐+8,财富-5',
        effects: { charm: 10, happiness: 8, wealth: -5 },
        result: '你做了小调整,看起来清爽了不少。'
      },
      {
        text: '太冒险,放弃',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你担心效果不好,决定不换发型了。'
      }
    ]
  },

  {
    id: 'daily_art_museum',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 40], gender: null, randomChance: 0.08 },
    title: '艺术展览',
    description: '城市里有艺术展,你想去看看。',
    context: '艺术欣赏能提升审美,也是一种精神享受。',
    choices: [
      {
        text: '去看展览',
        hint: '学识+20,魅力+15,快乐+15,财富-10',
        effects: { education: 20, charm: 15, happiness: 15, wealth: -10 },
        flags: { art_enthusiast: true },
        result: '你被艺术品深深感动,审美水平提升了!'
      },
      {
        text: '不太懂,不去',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你觉得艺术离自己太远,没有去。'
      },
      {
        text: '先学习相关知识',
        hint: '学识+25,魅力+10',
        effects: { education: 25, charm: 10 },
        flags: { art_learner: true },
        result: '你先学习了艺术知识,再去看展收获更大!'
      }
    ]
  },

  {
    id: 'daily_car_purchase',
    year: null,
    category: 'daily',
    trigger: { ageRange: [25, 45], gender: null, randomChance: 0.08 },
    title: '购车考虑',
    description: '你在考虑是否买车,还是继续用公共交通。',
    context: '买车能提升生活便利,但也是一笔不小的开支。',
    choices: [
      {
        text: '买车',
        hint: '快乐+15,财富-30,社交+8',
        effects: { happiness: 15, wealth: -30, social: 8 },
        flags: { car_owner: true },
        result: '你买了车,出行方便多了,但养车费用也不少。'
      },
      {
        text: '继续公共交通',
        hint: '财富+15,健康+8',
        effects: { wealth: 15, health: 8 },
        flags: { eco_commuter: true },
        result: '你坚持公共交通,省钱又环保。'
      },
      {
        text: '买二手车',
        hint: '快乐+12,财富-15,社交+8',
        effects: { happiness: 12, wealth: -15, social: 8 },
        flags: { practical_buyer: true },
        result: '你买了辆二手车,性价比很高。'
      }
    ]
  },

  {
    id: 'daily_night_owl',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 35], gender: null, randomChance: 0.12 },
    title: '熬夜习惯',
    description: '你经常熬夜,想改但改不掉。',
    context: '熬夜虽然多了时间,但长期对健康不利。',
    choices: [
      {
        text: '成功改掉熬夜',
        hint: '健康+20,快乐+12,学识+8',
        effects: { health: 20, happiness: 12, education: 8 },
        flags: { early_bird: true },
        result: '你调整作息,早睡早起,精神好多了!'
      },
      {
        text: '继续熬夜',
        hint: '快乐+10,学识+8,健康-15',
        effects: { happiness: 10, education: 8, health: -15 },
        flags: { night_owl: true },
        result: '你还是习惯熬夜,虽然多了时间但身体开始抗议。'
      },
      {
        text: '适度熬夜',
        hint: '学识+10,健康-5',
        effects: { education: 10, health: -5 },
        result: '你偶尔熬夜,但尽量不影响健康。'
      }
    ]
  },

  {
    id: 'daily_email_overload',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.1 },
    title: '邮件轰炸',
    description: '你的邮箱每天被大量邮件轰炸,处理不过来。',
    context: '信息过载是现代职场的常见问题。',
    choices: [
      {
        text: '学习高效管理邮件',
        hint: '技术+15,学识+12,社交+8',
        effects: { tech_skill: 15, education: 12, social: 8 },
        flags: { productivity_master: true },
        result: '你学会了高效处理邮件,工作效率提升!'
      },
      {
        text: '设置自动过滤',
        hint: '技术+10,学识+8',
        effects: { tech_skill: 10, education: 8 },
        result: '你设置了邮件规则,减少了干扰。'
      },
      {
        text: '被邮件淹没',
        hint: '学识-5,快乐-8',
        effects: { education: -5, happiness: -8 },
        flags: { overloaded: true },
        result: '你每天花大量时间处理邮件,工作效率下降。'
      }
    ]
  },

  {
    id: 'daily_dating_pressure',
    year: null,
    category: 'daily',
    trigger: { ageRange: [25, 35], gender: 'female', randomChance: 0.1 },
    title: '年龄焦虑',
    description: '周围人都在讨论"女生要趁年轻结婚",你感到压力。',
    context: '社会对女性的年龄压力是一个普遍现象。',
    choices: [
      {
        text: '坚定自己的节奏',
        hint: '魅力+15,学识+12,快乐+10',
        effects: { charm: 15, education: 12, happiness: 10 },
        flags: { independent_woman: true },
        result: '你相信每个人都有自己的节奏,不受他人影响。'
      },
      {
        text: '感到焦虑',
        hint: '快乐-15,健康-5',
        effects: { happiness: -15, health: -5 },
        flags: { age_anxiety: true },
        result: '社会的压力让你很焦虑,影响了生活质量。'
      },
      {
        text: '和好朋友聊聊',
        hint: '社交+15,快乐+10',
        effects: { social: 15, happiness: 10 },
        result: '你和朋友倾诉,感觉好多了。'
      }
    ]
  },

  {
    id: 'daily_gaming_addiction_help',
    year: null,
    category: 'daily',
    trigger: { ageRange: [15, 28], gender: null, requireFlags: ['game_addict'], randomChance: 0.15 },
    title: '意识到游戏成瘾',
    description: '你发现自己花太多时间在游戏上,影响了生活。',
    context: '游戏成瘾是一种需要正视的问题。',
    choices: [
      {
        text: '主动戒游戏',
        hint: '学识+15,健康+18,快乐-10',
        effects: { education: 15, health: 18, happiness: -10 },
        flags: { recovered_addict: true },
        result: '你卸载了游戏,虽然空虚但生活开始走上正轨!'
      },
      {
        text: '控制时间',
        hint: '学识+10,健康+10,快乐+5',
        effects: { education: 10, health: 10, happiness: 5 },
        flags: { balanced_gamer: true },
        result: '你限制了游戏时间,慢慢恢复正常生活。'
      },
      {
        text: '继续沉迷',
        hint: '快乐+12,学识-10,健康-15',
        effects: { happiness: 12, education: -10, health: -15 },
        flags: { hard_core_addict: true },
        result: '你戒不掉游戏,状况继续恶化...'
      }
    ]
  },

  // ==================== 更多日常事件补充 ====================

  {
    id: 'daily_yoga',
    year: null,
    category: 'daily',
    trigger: { ageRange: [20, 45], gender: null, randomChance: 0.1 },
    title: '练习瑜伽',
    description: '你想尝试练习瑜伽,改善身心健康。',
    context: '瑜伽可以改善柔韧性,缓解压力,是一种健康的运动方式。',
    choices: [
      {
        text: '坚持练习瑜伽',
        hint: '健康+22,魅力+12,快乐+15',
        effects: { health: 22, charm: 12, happiness: 15 },
        flags: { yoga_practitioner: true },
        result: '你坚持练习瑜伽,身体柔韧性和精神状态都改善了!'
      },
      {
        text: '偶尔练习',
        hint: '健康+12,快乐+8',
        effects: { health: 12, happiness: 8 },
        result: '你有空会练瑜伽,感觉有帮助。'
      },
      {
        text: '练了一次就放弃',
        hint: '学识+3',
        effects: { education: 3 },
        flags: { quitter: true },
        result: '你试了一次瑜伽,发现不太适合自己。'
      }
    ]
  },

  {
    id: 'daily_book_reading_challenge',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 40], gender: null, randomChance: 0.1 },
    title: '读书挑战',
    description: '朋友圈有人发起"一年读50本书"的挑战。',
    context: '读书挑战能督促自己多读书,但也可能变成形式主义。',
    choices: [
      {
        text: '参加并达成目标',
        hint: '学识+25,魅力+15,快乐+18',
        effects: { education: 25, charm: 15, happiness: 18 },
        flags: { avid_reader: true },
        result: '你真的读了50本书,知识面拓宽了很多!'
      },
      {
        text: '参加但没完成',
        hint: '学识+15,快乐+5',
        effects: { education: 15, happiness: 5 },
        result: '你读了20多本,虽然没有达成目标但也很不错。'
      },
      {
        text: '不参加,自己读',
        hint: '学识+18,快乐+10',
        effects: { education: 18, happiness: 10 },
        flags: { independent_reader: true },
        result: '你觉得读书不应该追求数量,按自己的节奏读。'
      }
    ]
  },

  {
    id: 'daily_decluttering',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 45], gender: null, randomChance: 0.08 },
    title: '断舍离',
    description: '你想尝试断舍离,清理不必要的东西。',
    context: '断舍离是现代流行的整理收纳理念,能简化生活。',
    choices: [
      {
        text: '彻底执行',
        hint: '快乐+18,魅力+10,学识+12',
        effects: { happiness: 18, charm: 10, education: 12 },
        flags: { minimalist: true },
        result: '你清理了很多不需要的东西,生活变简单了,心情也更好!'
      },
      {
        text: '部分整理',
        hint: '快乐+12,学识+8',
        effects: { happiness: 12, education: 8 },
        result: '你整理了一些区域,感觉清爽了不少。'
      },
      {
        text: '舍不得扔东西',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你什么都舍不得扔,最后不了了之。'
      }
    ]
  },

  {
    id: 'daily_public_transport',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.1 },
    title: '通勤方式',
    description: '每天上下班通勤时间很长,你想优化一下。',
    context: '通勤方式影响生活质量,需要平衡时间、金钱和健康。',
    choices: [
      {
        text: '开车通勤',
        hint: '快乐+10,健康+5,财富-15',
        effects: { happiness: 10, health: 5, wealth: -15 },
        flags: { car_commuter: true },
        result: '你开车上班,虽然花钱但方便舒适。'
      },
      {
        text: '公共交通+看书',
        hint: '学识+18,快乐+8,健康+5',
        effects: { education: 18, happiness: 8, health: 5 },
        flags: { productive_commuter: true },
        result: '你坐地铁看书,通勤时间变成了学习时间!'
      },
      {
        text: '骑车通勤',
        hint: '健康+20,快乐+10',
        effects: { health: 20, happiness: 10 },
        flags: { bike_commuter: true },
        result: '你骑车上班,既环保又锻炼身体!'
      }
    ]
  },

  {
    id: 'daily_weekend_plans',
    year: null,
    category: 'daily',
    trigger: { ageRange: [20, 40], gender: null, randomChance: 0.12 },
    title: '周末安排',
    description: '又到周末了,你计划怎么过?',
    context: '周末时间宝贵,不同选择带来不同收获。',
    choices: [
      {
        text: '加班赚钱',
        hint: '财富+18,学识+10,健康-12,快乐-10',
        effects: { wealth: 18, education: 10, health: -12, happiness: -10 },
        flags: { weekend_worker: true },
        result: '你周末加班赚钱,但感觉很累...'
      },
      {
        text: '学习充电',
        hint: '学识+20,技术+12,快乐+8',
        effects: { education: 20, tech_skill: 12, happiness: 8 },
        flags: { weekend_learner: true },
        result: '你周末去上课或自学,感觉很有收获!'
      },
      {
        text: '休息娱乐',
        hint: '快乐+18,健康+10',
        effects: { happiness: 18, health: 10 },
        flags: { weekender: true },
        result: '你周末好好休息,和朋友聚会,精神饱满!'
      }
    ]
  },

  {
    id: 'daily_diet_plan',
    year: null,
    category: 'daily',
    trigger: { ageRange: [20, 45], gender: null, randomChance: 0.1 },
    title: '饮食计划',
    description: '你想改善饮食习惯,更健康地生活。',
    context: '健康的饮食能改善身体状态和精神面貌。',
    choices: [
      {
        text: '严格执行健康饮食',
        hint: '健康+20,魅力+15,快乐+12',
        effects: { health: 20, charm: 15, happiness: 12 },
        flags: { healthy_diet: true },
        result: '你坚持健康饮食,身体状态明显改善!'
      },
      {
        text: '适度改善',
        hint: '健康+12,快乐+8',
        effects: { health: 12, happiness: 8 },
        result: '你减少了垃圾食品,感觉更好了。'
      },
      {
        text: '管不住嘴',
        hint: '快乐+10,健康-8',
        effects: { happiness: 10, health: -8 },
        flags: { food_lover: true },
        result: '你想健康饮食但管不住嘴,还是照吃不误。'
      }
    ]
  },

  {
    id: 'daily_festival_shopping',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 40], gender: null, randomChance: 0.1 },
    title: '节日购物',
    description: '节日大促开始了,你考虑要不要买东西。',
    context: '节日促销力度大,但也容易冲动消费。',
    choices: [
      {
        text: '疯狂购物',
        hint: '快乐+15,社交+10,财富-25',
        effects: { happiness: 15, social: 10, wealth: -25 },
        flags: { shopaholic: true },
        result: '你买了很多东西,虽然爽但钱包空了...'
      },
      {
        text: '理性购买必需品',
        hint: '财富+8,学识+8',
        effects: { wealth: 8, education: 8 },
        flags: { rational_shopper: true },
        result: '你只买必需品,省了不少钱。'
      },
      {
        text: '完全不买',
        hint: '财富+12,学识+5',
        effects: { wealth: 12, education: 5 },
        flags: { frugal: true },
        result: '你不为促销所动,完全没有购物。'
      }
    ]
  },

  {
    id: 'daily_team_building',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.08 },
    title: '公司团建',
    description: '公司组织团建活动,你在犹豫要不要参加。',
    context: '团建可以增进同事感情,但也可能占用个人时间。',
    choices: [
      {
        text: '积极参加',
        hint: '社交+18,快乐+15,健康+5',
        effects: { social: 18, happiness: 15, health: 5 },
        flags: { team_player: true },
        result: '你在团建中和同事们玩得很开心,关系更融洽了!'
      },
      {
        text: '敷衍了事',
        hint: '社交+8,快乐+5',
        effects: { social: 8, happiness: 5 },
        result: '你去了团建,但心不在焉。'
      },
      {
        text: '请假不去',
        hint: '快乐+10,学识+5',
        effects: { happiness: 10, education: 5 },
        result: '你请假了,用这个时间做自己的事。'
      }
    ]
  },

  {
    id: 'daily_password_security',
    year: null,
    category: 'daily',
    trigger: { ageRange: [20, 40], gender: null, randomChance: 0.08 },
    title: '密码管理',
    description: '你有太多账号密码,管理起来很麻烦。',
    context: '好的密码管理习惯能保护账户安全。',
    choices: [
      {
        text: '使用密码管理器',
        hint: '技术+15,学识+12',
        effects: { tech_skill: 15, education: 12 },
        flags: { security_conscious: true },
        result: '你使用了密码管理器,既安全又方便!'
      },
      {
        text: '简单密码重复使用',
        hint: '学识-5',
        effects: { education: -5 },
        flags: { bad_security: true },
        result: '你所有账号都用简单密码,很危险。'
      },
      {
        text: '自己设计复杂密码',
        hint: '技术+10,学识+8',
        effects: { tech_skill: 10, education: 8 },
        result: '你设计了自己的密码规则,还算安全。'
      }
    ]
  },

  {
    id: 'daily_news_consumption',
    year: null,
    category: 'daily',
    trigger: { ageRange: [20, 45], gender: null, randomChance: 0.1 },
    title: '新闻获取',
    description: '你想了解新闻,但担心被负面情绪影响。',
    context: '获取信息很重要,但需要平衡信息摄入。',
    choices: [
      {
        text: '每天看新闻',
        hint: '学识+20,技术+8,快乐-5',
        effects: { education: 20, tech_skill: 8, happiness: -5 },
        flags: { news_junkie: true },
        result: '你每天花很多时间看新闻,了解时事但也会焦虑。'
      },
      {
        text: '精选阅读',
        hint: '学识+15,快乐+8',
        effects: { education: 15, happiness: 8 },
        flags: { selective_reader: true },
        result: '你只看高质量的深度报道,收获很大!'
      },
      {
        text: '基本不关注',
        hint: '快乐+10,学识-5',
        effects: { happiness: 10, education: -5 },
        flags: { news_avoidant: true },
        result: '你基本不关注新闻,活在自己的世界里。'
      }
    ]
  },

  {
    id: 'daily_learning_new_skill',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 40], gender: null, randomChance: 0.1 },
    title: '技能学习',
    description: '你想学习一项新技能提升竞争力。',
    context: '持续学习是职场保持竞争力的关键。',
    choices: [
      {
        text: '系统学习考证',
        hint: '学识+25,技术+15,财富-12,健康-8',
        effects: { education: 25, tech_skill: 15, wealth: -12, health: -8 },
        flags: { certificate_holder: true },
        result: '你边工作边考证,虽然累但拿到了证书!'
      },
      {
        text: '在线课程学习',
        hint: '学识+20,技术+12,财富-5',
        effects: { education: 20, tech_skill: 12, wealth: -5 },
        flags: { online_learner: true },
        result: '你利用业余时间在线学习,提升了自己的能力。'
      },
      {
        text: '太忙没时间学',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你想学但工作太忙,一直没有行动。'
      }
    ]
  },

  {
    id: 'daily_skin_care',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 35], gender: 'female', randomChance: 0.12 },
    title: '护肤保养',
    description: '你想开始认真护肤,延缓衰老。',
    context: '良好的护肤习惯能保持年轻状态。',
    choices: [
      {
        text: '认真护肤',
        hint: '魅力+20,快乐+15,财富-10',
        effects: { charm: 20, happiness: 15, wealth: -10 },
        flags: { skincare_enthusiast: true },
        result: '你坚持护肤,皮肤状态越来越好!'
      },
      {
        text: '基础护理',
        hint: '魅力+12,快乐+8',
        effects: { charm: 12, happiness: 8 },
        result: '你做基础的清洁保湿,皮肤还凑合。'
      },
      {
        text: '懒得管',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你觉得护肤太麻烦,基本不管。'
      }
    ]
  },

  {
    id: 'daily_friend_conflict_resolve',
    year: null,
    category: 'daily',
    trigger: { ageRange: [18, 40], gender: null, randomChance: 0.08 },
    title: '朋友误会',
    description: '好朋友对你产生了误会,关系变得紧张。',
    context: '朋友间的误会需要及时化解。',
    choices: [
      {
        text: '主动解释道歉',
        hint: '社交+20,魅力+15,快乐+12',
        effects: { social: 20, charm: 15, happiness: 12 },
        flags: { peacemaker: true },
        result: '你主动沟通,解除了误会,友谊更深了!'
      },
      {
        text: '等对方先开口',
        hint: '社交-10,学识+5',
        effects: { social: -10, education: 5 },
        result: '你们冷战了很久,关系越来越疏远。'
      },
      {
        text: '让时间去解决',
        hint: '社交-5',
        effects: { social: -5 },
        result: '你们的关系淡了,虽然没大吵但也不亲密了。'
      }
    ]
  },

  {
    id: 'daily_office_politics',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.1 },
    title: '办公室政治',
    description: '公司里有明显的办公室政治,你需要决定如何应对。',
    context: '办公室政治是职场的常见现象。',
    choices: [
      {
        text: '积极参与站队',
        hint: '社交+15,财富+10,学识+5,魅力-10',
        effects: { social: 15, wealth: 10, education: 5, charm: -10 },
        flags: { office_politician: true },
        result: '你学会了站队和钻营,虽然升职了但不被尊重。'
      },
      {
        text: '保持中立专注工作',
        hint: '学识+15,技术+12,魅力+8',
        effects: { education: 15, tech_skill: 12, charm: 8 },
        flags: { professional: true },
        result: '你专注于工作,用实力说话,赢得尊重。'
      },
      {
        text: '选择离开',
        hint: '学识+10,快乐+8,财富-5',
        effects: { education: 10, happiness: 8, wealth: -5 },
        flags: { job_hopper: true },
        result: '你受不了办公室政治,选择跳槽到更好的公司。'
      }
    ]
  },

  {
    id: 'daily_performance_review',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.08 },
    title: '年度绩效评估',
    description: '公司要进行年度绩效评估,影响奖金和升职。',
    context: '绩效评估是职场的重要时刻。',
    choices: [
      {
        text: '充分准备争取优秀',
        hint: '财富+20,学识+12,社交+8',
        effects: { wealth: 20, education: 12, social: 8 },
        flags: { high_performer: true },
        result: '你准备了详细的PPT,获得了优秀评级和丰厚奖金!'
      },
      {
        text: '正常发挥',
        hint: '财富+12,学识+8',
        effects: { wealth: 12, education: 8 },
        result: '你的评估结果良好,奖金还行。'
      },
      {
        text: '表现不佳被批评',
        hint: '学识+5,快乐-12,社交-5',
        effects: { education: 5, happiness: -12, social: -5 },
        flags: { underperformer: true },
        result: '你的评估结果不佳,没有奖金还挨了批评。'
      }
    ]
  },

  {
    id: 'daily_coffee_break',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.12 },
    title: '下午茶时间',
    description: '同事们邀请你一起喝下午茶。',
    context: '下午茶是职场社交的重要时刻。',
    choices: [
      {
        text: '经常参加',
        hint: '社交+18,快乐+15,财富-10,学识-3',
        effects: { social: 18, happiness: 15, wealth: -10, education: -3 },
        flags: { social_butterfly: true },
        result: '你经常和同事喝下午茶,关系都很好,但钱包有点疼。'
      },
      {
        text: '偶尔参加',
        hint: '社交+12,快乐+10,财富-5',
        effects: { social: 12, happiness: 10, wealth: -5 },
        result: '你偶尔参与,保持了基本的社交。'
      },
      {
        text: '基本不参加',
        hint: '学识+10,财富+5',
        effects: { education: 10, wealth: 5 },
        flags: { introvert: true },
        result: '你更喜欢自己吃午餐,节省时间和金钱。'
      }
    ]
  },

  {
    id: 'daily_lunch_habit',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.12 },
    title: '午餐习惯',
    description: '工作日的午餐你一般怎么解决?',
    context: '午餐习惯影响健康和钱包。',
    choices: [
      {
        text: '带饭健康饮食',
        hint: '健康+18,财富+15,快乐+8',
        effects: { health: 18, wealth: 15, happiness: 8 },
        flags: { meal_prep: true },
        result: '你自己带饭,既健康又省钱,同事都很羡慕!'
      },
      {
        text: '外卖解决',
        hint: '健康-8,财富-10,快乐+10',
        effects: { health: -8, wealth: -10, happiness: 10 },
        flags: { delivery_dependent: true },
        result: '你每天点外卖,虽然方便但不太健康。'
      },
      {
        text: '公司食堂',
        hint: '健康+8,财富+5',
        effects: { health: 8, wealth: 5 },
        flags: { cafeteria_user: true },
        result: '你在公司食堂吃饭,性价比不错。'
      }
    ]
  },

  {
    id: 'daily_after_work_habit',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.12 },
    title: '下班后',
    description: '下班后你的时间一般怎么安排?',
    context: '下班后的时间安排反映了一个人的生活状态。',
    choices: [
      {
        text: '继续加班',
        hint: '财富+15,学识+10,健康-12,快乐-10',
        effects: { wealth: 15, education: 10, health: -12, happiness: -10 },
        flags: { workaholic: true },
        result: '你经常加班到深夜,虽然赚钱但身体被掏空...'
      },
      {
        text: '去健身房',
        hint: '健康+20,魅力+12,快乐+10',
        effects: { health: 20, charm: 12, happiness: 10 },
        flags: { gym_rat: true },
        result: '你下班后去健身房,身体越来越棒!'
      },
      {
        text: '回家放松',
        hint: '健康+8,快乐+12',
        effects: { health: 8, happiness: 12 },
        flags: { home_body: true },
        result: '你回家追剧放松,享受自己的时间。'
      }
    ]
  },

  {
    id: 'daily_weekend_trip',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.08 },
    title: '周边游',
    description: '周末朋友提议去周边玩两天。',
    context: '短途旅行是放松身心的好方式。',
    choices: [
      {
        text: '热情参加',
        hint: '快乐+20,社交+18,健康+10,财富-15',
        effects: { happiness: 20, social: 18, health: 10, wealth: -15 },
        flags: { adventure_seeker: true },
        result: '你们玩得很开心,放松了身心也增进了友谊!'
      },
      {
        text: '太累不想去',
        hint: '健康+8,快乐+5',
        effects: { health: 8, happiness: 5 },
        result: '你选择在家休息,朋友们玩得很开心。'
      },
      {
        text: '工作太忙去不了',
        hint: '学识+8,快乐-5',
        effects: { education: 8, happiness: -5 },
        flags: { workaholic: true },
        result: '你想去但工作太忙,只能遗憾缺席。'
      }
    ]
  },

  {
    id: 'daily_social_media_comparison',
    year: null,
    category: 'daily',
    trigger: { ageRange: [20, 35], gender: null, randomChance: 0.1 },
    title: '社交媒体攀比',
    description: '刷朋友圈时发现朋友都过得比自己好,产生了焦虑。',
    context: '社交媒体上的攀比是现代人的普遍困扰。',
    choices: [
      {
        text: '理性看待',
        hint: '学识+18,魅力+10',
        effects: { education: 18, charm: 10 },
        flags: { mentally_strong: true },
        result: '你意识到朋友圈只是别人想展示的一面,不盲目比较。'
      },
      {
        text: '感到焦虑自卑',
        hint: '快乐-15,魅力-8',
        effects: { happiness: -15, charm: -8 },
        flags: { insecure: true },
        result: '你陷入了比较,觉得自己混得很差。'
      },
      {
        text: '减少使用社交媒体',
        hint: '学识+15,健康+10,快乐+12',
        effects: { education: 15, health: 10, happiness: 12 },
        flags: { digital_detox: true },
        result: '你减少了社交媒体使用,感觉好多了!'
      }
    ]
  },

  {
    id: 'daily_skill_sharing',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.08 },
    title: '技能分享',
    description: '公司/团队要组织技能分享会,你考虑要不要分享。',
    context: '分享知识能提升个人影响力,但也需要准备时间。',
    choices: [
      {
        text: '积极分享',
        hint: '社交+18,学识+20,魅力+15',
        effects: { social: 18, education: 20, charm: 15 },
        flags: { knowledge_sharer: true },
        result: '你的分享很成功,大家都觉得你很专业!'
      },
      {
        text: '只是听众',
        hint: '学识+15,社交+8',
        effects: { education: 15, social: 8 },
        result: '你认真听了别人的分享,收获不少。'
      },
      {
        text: '不参加',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你觉得分享会没什么意义,没有参加。'
      }
    ]
  },

  {
    id: 'daily_career_planning',
    year: null,
    category: 'daily',
    trigger: { ageRange: [25, 40], gender: null, randomChance: 0.08 },
    title: '职业规划',
    description: '你到了需要思考职业发展的阶段。',
    context: '职业规划对长期发展很重要。',
    choices: [
      {
        text: '制定详细规划',
        hint: '学识+20,技术+12,财富+10',
        effects: { education: 20, tech_skill: 12,财富: 10 },
        flags: { career_planner: true },
        result: '你制定了清晰的职业规划,按目标稳步前进!'
      },
      {
        text: '顺其自然',
        hint: '学识+8,快乐+10',
        effects: { education: 8, happiness: 10 },
        result: '你觉得船到桥头自然直,不用想太多。'
      },
      {
        text: '感到迷茫',
        hint: '学识+10,快乐-10',
        effects: { education: 10, happiness: -10 },
        flags: { lost: true },
        result: '你对未来感到迷茫,不知道该怎么办。'
      }
    ]
  },

  {
    id: 'daily_work_from_home',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.1 },
    title: '居家办公',
    description: '公司开始试行居家办公制度。',
    context: '居家办公有利有弊,需要适应新的工作方式。',
    choices: [
      {
        text: '适应很好,效率提升',
        hint: '技术+15,财富+12,快乐+12,健康+8',
        effects: { tech_skill: 15, wealth: 12, happiness: 12, health: 8 },
        flags: { remote_worker: true },
        result: '你发现在家工作效率更高,还能省下通勤时间!'
      },
      {
        text: '不太适应',
        hint: '学识-5,快乐-8,社交-10',
        effects: { education: -5, happiness: -8, social: -10 },
        flags: { office_missed: true },
        result: '你在家办公感觉孤独,效率下降,很想回办公室。'
      },
      {
        text: '混合模式最好',
        hint: '技术+12,财富+10,快乐+10',
        effects: { tech_skill: 12, wealth: 10, happiness: 10 },
        flags: { hybrid_worker: true },
        result: '你觉得部分时间在家、部分时间在公司最好。'
      }
    ]
  },

  {
    id: 'daily_budget_planning',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.1 },
    title: '预算管理',
    description: '你想开始做预算,更好地管理财务。',
    context: '预算管理能帮助实现财务目标。',
    choices: [
      {
        text: '严格执行预算',
        hint: '财富+20,学识+15,快乐+10',
        effects: { wealth: 20, education: 15, happiness: 10 },
        flags: { budgeter: true },
        result: '你坚持做预算和记账,储蓄率大幅提升!'
      },
      {
        text: '大概记录',
        hint: '财富+12,学识+8',
        effects: { wealth: 12, education: 8 },
        result: '你大概记录了一下支出,有所改善。'
      },
      {
        text: '坚持不下来',
        hint: '学识+5',
        effects: { education: 5 },
        flags: { quitter: true },
        result: '你坚持了几天就放弃了,钱还是不知不觉花掉了。'
      }
    ]
  },

  {
    id: 'daily_home_organization',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 45], gender: null, randomChance: 0.08 },
    title: '家居整理',
    description: '家里乱七八糟,你想好好整理一下。',
    context: '整洁的环境能提升生活质量。',
    choices: [
      {
        text: '彻底整理',
        hint: '快乐+20,健康+10,魅力+12',
        effects: { happiness: 20, health: 10, charm: 12 },
        flags: { organized: true },
        result: '你花了一整天整理,家里焕然一新,心情也好多了!'
      },
      {
        text: '简单收拾',
        hint: '快乐+12,健康+5',
        effects: { happiness: 12, health: 5 },
        result: '你做了基本整理,环境改善了一些。'
      },
      {
        text: '太累不想动',
        hint: '学识+3',
        effects: { education: 3 },
        result: '你想整理但太累了,家里还是乱糟糟的。'
      }
    ]
  },

  {
    id: 'daily_hobby_investment',
    year: null,
    category: 'daily',
    trigger: { ageRange: [20, 40], gender: null, randomChance: 0.1 },
    title: '兴趣投入',
    description: '你对某个爱好很感兴趣,考虑是否深入学习。',
    context: '投入爱好能丰富生活,但也需要时间金钱。',
    choices: [
      {
        text: '深入学习',
        hint: '快乐+20,魅力+18,学识+15,财富-15',
        effects: { happiness: 20, charm: 18, education: 15, wealth: -15 },
        flags: { hobby_expert: true },
        result: '你深入发展爱好,甚至成为了小有名气的达人!'
      },
      {
        text: '浅尝辄止',
        hint: '快乐+12,魅力+8',
        effects: { happiness: 12, charm: 8 },
        result: '你偶尔玩玩,作为生活的调剂。'
      },
      {
        text: '只是想想',
        hint: '学识+5',
        effects: { education: 5 },
        flags: { dreamer_only: true },
        result: '你有很多想法,但没有真正投入。'
      }
    ]
  },

  {
    id: 'daily_morning_routine_optimization',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.1 },
    title: '晨间仪式',
    description: '你想优化早晨的时间安排,开启美好的一天。',
    context: '良好的晨间习惯能提升一整天的状态。',
    choices: [
      {
        text: '建立完整晨间仪式',
        hint: '健康+20,学识+15,快乐+15,魅力+10',
        effects: { health: 20, education: 15, happiness: 15, charm: 10 },
        flags: { morning_person: true },
        result: '你养成了早起运动、冥想、规划的习惯,每天都精力充沛!'
      },
      {
        text: '简单优化',
        hint: '健康+12,学识+10,快乐+8',
        effects: { health: 12, education: 10, happiness: 8 },
        result: '你调整了一些习惯,早晨状态好多了。'
      },
      {
        text: '改不了赖床',
        hint: '健康+5,学识-3',
        effects: { health: 5, education: -3 },
        flags: { snoozer: true },
        result: '你还是改不了赖床的习惯,每天都很匆忙。'
      }
    ]
  },

  {
    id: 'daily_evening_routine',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.1 },
    title: '晚间习惯',
    description: '你想改善晚上的时间安排,提升睡眠质量。',
    context: '良好的晚间习惯有助于睡眠和第二天状态。',
    choices: [
      {
        text: '睡前远离电子设备',
        hint: '健康+22,学识+15,快乐+12',
        effects: { health: 22, education: 15, happiness: 12 },
        flags: { good_sleeper: true },
        result: '你睡前一小时不看手机,睡眠质量大大改善!'
      },
      {
        text: '适度改善',
        hint: '健康+12,快乐+8',
        effects: { health: 12, happiness: 8 },
        result: '你试着早点放下手机,睡眠略有改善。'
      },
      {
        text: '刷手机到深夜',
        hint: '学识+8,健康-15,快乐-5',
        effects: { education: 8, health: -15, happiness: -5 },
        flags: { night_owl: true },
        result: '你还是刷手机到深夜,第二天总是很困。'
      }
    ]
  },

  {
    id: 'daily_personal_branding',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.08 },
    title: '个人品牌',
    description: '你想建立自己的个人品牌,提升影响力。',
    context: '个人品牌能带来更多机会。',
    choices: [
      {
        text: '积极经营',
        hint: '社交+20,魅力+18,学识+12,财富+10',
        effects: { social: 20, charm: 18, education: 12, wealth: 10 },
        flags: { personal_brand: true },
        result: '你在社交媒体上持续输出内容,积累了不少粉丝!'
      },
      {
        text: '偶尔分享',
        hint: '社交+12,魅力+10',
        effects: { social: 12, charm: 10 },
        result: '你偶尔分享一些观点,小范围有一定影响力。'
      },
      {
        text: '不想曝光',
        hint: '学识+5',
        effects: { education: 5 },
        flags: { private_person: true },
        result: '你喜欢保持低调,不想建立个人品牌。'
      }
    ]
  },

  {
    id: 'daily_side_business',
    year: null,
    category: 'daily',
    trigger: { ageRange: [25, 40], gender: null, randomChance: 0.08 },
    title: '副业机会',
    description: '朋友邀请你一起做个小生意。',
    context: '副业能增加收入,但也占用时间和精力。',
    choices: [
      {
        text: '投入做副业',
        hint: '财富+25,技术+15,社交+12,健康-12,快乐-8',
        effects: { wealth: 25, tech_skill: 15, social: 12, health: -12, happiness: -8 },
        flags: { entrepreneur: true },
        result: '你开始了副业,虽然累但收入增加了!'
      },
      {
        text: '小额投资',
        hint: '财富+15,技术+8',
        effects: { wealth: 15, tech_skill: 8 },
        flags: { angel_investor: true },
        result: '你投资了朋友的项目,不需要参与经营。'
      },
      {
        text: '婉拒',
        hint: '学识+8,健康+5',
        effects: { education: 8, health: 5 },
        result: '你不想分散精力,专注于主业。'
      }
    ]
  },

  {
    id: 'daily_self_reflection',
    year: null,
    category: 'daily',
    trigger: { ageRange: [25, 45], gender: null, randomChance: 0.08 },
    title: '自我反思',
    description: '你想花时间思考自己的人生方向。',
    context: '定期反思有助于保持生活方向。',
    choices: [
      {
        text: '深度反思并调整',
        hint: '学识+22,魅力+15,快乐+18',
        effects: { education: 22, charm: 15, happiness: 18 },
        flags: { self_aware: true },
        result: '你深度反思了人生,做了一些积极调整,方向更清晰了!'
      },
      {
        text: '简单思考',
        hint: '学识+12,快乐+10',
        effects: { education: 12, happiness: 10 },
        result: '你花时间思考了人生,有些收获。'
      },
      {
        text: '太忙没空想',
        hint: '学识+5,快乐-5',
        effects: { education: 5, happiness: -5 },
        result: '你忙得停不下来,没有时间思考。'
      }
    ]
  },

  {
    id: 'daily_learning_community',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.08 },
    title: '学习社群',
    description: '有个学习交流社群在招新,你考虑是否加入。',
    context: '学习社群能提供学习氛围和资源。',
    choices: [
      {
        text: '积极加入',
        hint: '学识+25,社交+18,技术+12,财富-8',
        effects: { education: 25, social: 18, tech_skill: 12, wealth: -8 },
        flags: { community_learner: true },
        result: '你在社群中学习氛围很好,认识了很多厉害的人!'
      },
      {
        text: '潜水学习',
        hint: '学识+18,社交+8',
        effects: { education: 18, social: 8 },
        result: '你加入了但主要自己学习,偶尔看看群消息。'
      },
      {
        text: '不加入',
        hint: '学识+8',
        effects: { education: 8 },
        result: '你觉得学习靠自己,不需要社群。'
      }
    ]
  },

  {
    id: 'daily_retirement_saving',
    year: null,
    category: 'daily',
    trigger: { ageRange: [25, 45], gender: null, randomChance: 0.1 },
    title: '养老储备',
    description: '你考虑开始为养老做储备。',
    context: '养老储备越早开始越好。',
    choices: [
      {
        text: '积极储蓄投资',
        hint: '财富+25,学识+15,快乐+8',
        effects: { wealth: 25, education: 15, happiness: 8 },
        flags: { retirement_planner: true },
        result: '你每月都存一笔养老钱,心里踏实多了!'
      },
      {
        text: '少量储蓄',
        hint: '财富+15,学识+10',
        effects: { wealth: 15, education: 10 },
        result: '你存了一些钱,但不是很多。'
      },
      {
        text: '还没考虑',
        hint: '学识+5,财富+5',
        effects: { education: 5, wealth: 5 },
        result: '你觉得养老还很远,没有特别考虑。'
      }
    ]
  },

  {
    id: 'daily_mindfulness',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 45], gender: null, randomChance: 0.1 },
    title: '正念练习',
    description: '你想尝试正念练习,活在当下。',
    context: '正念能减轻焦虑,提升专注力。',
    choices: [
      {
        text: '每天练习',
        hint: '健康+20,快乐+18,学识+15,魅力+10',
        effects: { health: 20, happiness: 18, education: 15, charm: 10 },
        flags: { mindfulness_practitioner: true },
        result: '你坚持正念练习,焦虑减少了很多,专注力提升了!'
      },
      {
        text: '偶尔练习',
        hint: '健康+12,快乐+10,学识+8',
        effects: { health: 12, happiness: 10, education: 8 },
        result: '你心情不好的时候会练习正念,有帮助。'
      },
      {
        text: '不太感兴趣',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你对正念不太感冒,没有尝试。'
      }
    ]
  },

  {
    id: 'daily_collaboration_tools',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.1 },
    title: '协作工具',
    description: '公司引入了新的协作工具,需要学习使用。',
    context: '掌握协作工具能提升工作效率。',
    choices: [
      {
        text: '深入学习',
        hint: '技术+20,学识+15,社交+12,财富+8',
        effects: { tech_skill: 20, education: 15, social: 12, wealth: 8 },
        flags: { tech_savvy: true },
        result: '你成了工具专家,还帮助同事解决问题!'
      },
      {
        text: '基本会用',
        hint: '技术+12,学识+8',
        effects: { tech_skill: 12, education: 8 },
        result: '你掌握了基本功能,够用就行。'
      },
      {
        text: '抵触使用',
        hint: '学识-5',
        effects: { education: -5 },
        flags: { tech_resistant: true },
        result: '你觉得新工具太复杂,还是习惯用老方法。'
      }
    ]
  },

  {
    id: 'daily_personal_website',
    year: null,
    category: 'daily',
    trigger: { ageRange: [20, 40], gender: null, randomChance: 0.08 },
    title: '个人网站',
    description: '你想建立自己的个人网站/博客。',
    context: '个人网站是展示自己的好方式。',
    choices: [
      {
        text: '认真建设',
        hint: '技术+22,学识+18,魅力+15,财富-8',
        effects: { tech_skill: 22, education: 18, charm: 15, wealth: -8 },
        flags: { webmaster: true },
        result: '你建立了精美的个人网站,展示了自己的作品和想法!'
      },
      {
        text: '简单搭建',
        hint: '技术+12,学识+10',
        effects: { tech_skill: 12, education: 10 },
        result: '你用现成工具搭建了简单的网站。'
      },
      {
        text: '想想没做',
        hint: '学识+5',
        effects: { education: 5 },
        flags: { idea_only: true },
        result: '你有想法但一直没有行动。'
      }
    ]
  },

  {
    id: 'daily_online_community',
    year: null,
    category: 'daily',
    trigger: { ageRange: [20, 40], gender: null, randomChance: 0.1 },
    title: '网络社群',
    description: '你加入了某个兴趣相关的网络社群。',
    context: '网络社群能找到志同道合的朋友。',
    choices: [
      {
        text: '活跃参与',
        hint: '社交+20,快乐+18,学识+12',
        effects: { social: 20, happiness: 18, education: 12 },
        flags: { community_leader: true },
        result: '你在社群中很活跃,甚至成为了版主!'
      },
      {
        text: '潜水学习',
        hint: '学识+15,社交+8',
        effects: { education: 15, social: 8 },
        result: '你主要潜水学习,偶尔发个言。'
      },
      {
        text: '退群',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你发现社群质量不高,选择了退出。'
      }
    ]
  },

  {
    id: 'daily_dream_job',
    year: null,
    category: 'daily',
    trigger: { ageRange: [25, 40], gender: null, randomChance: 0.08 },
    title: '理想工作',
    description: '你在思考现在的工作是不是自己想要的。',
    context: '找到理想工作是很多人的追求。',
    choices: [
      {
        text: '追求理想',
        hint: '快乐+20,学识+15,财富-15',
        effects: { happiness: 20, education: 15, wealth: -15 },
        flags: { dream_chaser: true },
        result: '你辞职追求理想,虽然收入下降但很充实!'
      },
      {
        text: '接受现实',
        hint: '财富+12,学识+8,快乐+5',
        effects: { wealth: 12, education: 8, happiness: 5 },
        result: '你决定接受现状,在工作中寻找意义。'
      },
      {
        text: '感到迷茫',
        hint: '学识+10,快乐-12',
        effects: { education: 10, happiness: -12 },
        flags: { lost: true },
        result: '你不知道自己想要什么,继续混日子。'
      }
    ]
  },

  {
    id: 'daily_cross_industry',
    year: null,
    category: 'daily',
    trigger: { ageRange: [25, 40], gender: null, randomChance: 0.08 },
    title: '跨行业机会',
    description: '有个其他行业的工作机会,你在考虑是否转行。',
    context: '转行可能带来新机会,但也有风险。',
    choices: [
      {
        text: '勇敢转行',
        hint: '技术+18,学识+20,财富-10,社交-5',
        effects: { tech_skill: 18, education: 20, wealth: -10, social: -5 },
        flags: { career_changer: true },
        result: '你成功转行,虽然从头开始但很有挑战性!'
      },
      {
        text: '谨慎考虑后放弃',
        hint: '财富+8,学识+8',
        effects: { wealth: 8, education: 8 },
        result: '你评估后觉得风险太大,选择留下。'
      },
      {
        text: '后悔当初没转',
        hint: '学识+10,快乐-10',
        effects: { education: 10, happiness: -10 },
        flags: { regret: true },
        result: '多年后你后悔没有抓住转行机会。'
      }
    ]
  },

  {
    id: 'daily_mentor_search',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 35], gender: null, randomChance: 0.08 },
    title: '寻找导师',
    description: '你想在行业内找个导师指导自己的发展。',
    context: '好的导师能加速职业成长。',
    choices: [
      {
        text: '成功找到导师',
        hint: '学识+22,社交+18,财富+10,魅力+10',
        effects: { education: 22, social: 18, wealth: 10, charm: 10 },
        flags: { mentee: true },
        result: '你找到了一位经验丰富的导师,获得了很多指导!'
      },
      {
        text: '向周围人学习',
        hint: '学识+15,社交+12',
        effects: { education: 15, social: 12 },
        result: '你没有正式导师,但向周围前辈学习。'
      },
      {
        text: '自己摸索',
        hint: '学识+12',
        effects: { education: 12 },
        result: '你主要靠自己摸索,虽然慢但印象深刻。'
      }
    ]
  },

  {
    id: 'daily_negotiation',
    year: null,
    category: 'daily',
    trigger: { ageRange: [22, 40], gender: null, randomChance: 0.08 },
    title: '薪资谈判',
    description: '你有机会和老板谈薪资,你在犹豫如何开口。',
    context: '薪资谈判是职场的重要技能。',
    choices: [
      {
        text: '充分准备后谈判',
        hint: '财富+20,学识+15,社交+12,魅力+10',
        effects: { wealth: 20, education: 15, social: 12, charm: 10 },
        flags: { negotiator: true },
        result: '你准备了充分的理由,成功获得了加薪!'
      },
      {
        text: '不敢开口',
        hint: '学识+5',
        effects: { education: 5 },
        result: '你不敢和老板谈,错过了加薪机会。'
      },
      {
        text: '直接表达期望',
        hint: '财富+12,社交+10',
        effects: { wealth: 12, social: 10 },
        result: '你直接说了期望,老板考虑后给了小幅加薪。'
      }
    ]
  },

  {
    id: 'daily_side_project_launch',
    year: null,
    category: 'daily',
    trigger: { ageRange: [25, 40], gender: null, requireFlags: ['side_project_creator'], randomChance: 0.1 },
    title: '项目发布',
    description: '你的个人项目终于可以发布了!',
    context: '发布项目是激动人心的时刻。',
    choices: [
      {
        text: '认真运营推广',
        hint: '财富+25,技术+18,社交+20,快乐+20',
        effects: { wealth: 25, tech_skill: 18, social: 20, happiness: 20 },
        flags: { project_success: true },
        result: '你的项目获得了关注,甚至有人愿意投资!'
      },
      {
        text: '简单发布',
        hint: '技术+15,学识+12,快乐+12',
        effects: { tech_skill: 15, education: 12, happiness: 12 },
        result: '你发布了项目,获得了一些用户反馈。'
      },
      {
        text: '不敢发布',
        hint: '学识+8,快乐-5',
        effects: { education: 8, happiness: -5 },
        flags: { perfectionist: true },
        result: '你觉得还不够好,一直没发布,项目不了了之。'
      }
    ]
  },

  {
    id: 'daily_reading_challenge_complete',
    year: null,
    category: 'daily',
    trigger: { ageRange: [25, 45], gender: null, requireFlags: ['avid_reader'], randomChance: 0.08 },
    title: '书架满了',
    description: '你的书架已经满了,需要整理。',
    context: '书籍太多也需要管理。',
    choices: [
      {
        text: '捐赠分享',
        hint: '社交+20,魅力+15,快乐+18',
        effects: { social: 20, charm: 15, happiness: 18 },
        flags: { book_sharer: true },
        result: '你把不用的书捐赠给图书馆,帮助了更多人!'
      },
      {
        text: '买新书架',
        hint: '财富-15,快乐+10',
        effects: { wealth: -15, happiness: 10 },
        result: '你买了新书架,继续买书读书。'
      },
      {
        text: '电子化阅读',
        hint: '技术+15,学识+12',
        effects: { tech_skill: 15, education: 12 },
        flags: { digital_reader: true },
        result: '你开始更多用电子设备阅读,节省空间。'
      }
    ]
  },

  {
    id: 'daily_fitness_goal_achieved',
    year: null,
    category: 'daily',
    trigger: { ageRange: [25, 45], gender: null, requireFlags: ['fitness_master'], randomChance: 0.1 },
    title: '健身目标达成',
    description: '你达成了健身目标,现在要考虑如何保持。',
    context: '保持健身成果比达成目标更难。',
    choices: [
      {
        text: '继续坚持',
        hint: '健康+25,魅力+20,快乐+18',
        effects: { health: 25, charm: 20, happiness: 18 },
        flags: { fitness_lifestyle: true },
        result: '你已经养成了健身习惯,身材一直保持得很好!'
      },
      {
        text: '适度保持',
        hint: '健康+18,快乐+12',
        effects: { health: 18, happiness: 12 },
        result: '你适度运动,虽然不如从前但还保持得不错。'
      },
      {
        text: '放松了',
        hint: '健康-10,快乐+5',
        effects: { health: -10, happiness: 5 },
        flags: { yoyo_dieter: true },
        result: '你放松了锻炼,身材慢慢反弹了...'
      }
    ]
  },

  {
    id: 'daily_career_peak',
    year: null,
    category: 'daily',
    trigger: { ageRange: [35, 50], gender: null, randomChance: 0.1 },
    title: '职业巅峰',
    description: '你在职业上达到了一个小巅峰,接下来怎么走?',
    context: '职业巅峰后需要思考下一步。',
    choices: [
      {
        text: '继续攀登',
        hint: '财富+25,学识+18,健康-12,快乐-8',
        effects: { wealth: 25, education: 18, health: -12, happiness: -8 },
        flags: { climber: true },
        result: '你追求更高职位,虽然更累但成就感很强!'
      },
      {
        text: '享受现状',
        hint: '快乐+18,健康+12,学识+10',
        effects: { happiness: 18, health: 12, education: 10 },
        flags: { content: true },
        result: '你对现状很满意,享受工作生活平衡。'
      },
      {
        text: '考虑转型',
        hint: '学识+20,快乐+12,财富-10',
        effects: { education: 20, happiness: 12, wealth: -10 },
        flags: { pivot: true },
        result: '你开始考虑职业转型,探索新的可能性。'
      }
    ]
  },

  {
    id: 'daily_mentor_others',
    year: null,
    category: 'daily',
    trigger: { ageRange: [30, 50], gender: null, requireFlags: ['mentor'], randomChance: 0.1 },
    title: '继续指导新人',
    description: '你指导的新人成长很快,是否继续投入时间?',
    context: '指导新人需要大量时间,但也很 rewarding。',
    choices: [
      {
        text: '继续深入指导',
        hint: '社交+22,学识+20,快乐+20,魅力+15',
        effects: { social: 22, education: 20, happiness: 20, charm: 15 },
        flags: { great_mentor: true },
        result: '你继续指导新人,他们成长得很好,你也很有成就感!'
      },
      {
        text: '基本指导',
        hint: '社交+12,学识+10',
        effects: { social: 12, education: 10 },
        result: '你做基本的指导工作,不出错也不出彩。'
      },
      {
        text: '不再投入',
        hint: '学识+12,快乐+5',
        effects: { education: 12, happiness: 5 },
        result: '你觉得带新人太累,选择减少投入。'
      }
    ]
  },

  {
    id: 'daily_legacy_thinking',
    year: null,
    category: 'daily',
    trigger: { ageRange: [40, 50], gender: null, randomChance: 0.1 },
    title: '人生意义',
    description: '到了这个年纪,你开始思考人生的终极意义。',
    context: '思考人生意义是成熟的标志。',
    choices: [
      {
        text: '找到人生使命',
        hint: '学识+25,快乐+22,魅力+18',
        effects: { education: 25, happiness: 22, charm: 18 },
        flags: { purpose_found: true },
        result: '你找到了人生的意义,活得更加充实!'
      },
      {
        text: '活在当下',
        hint: '快乐+18,学识+12',
        effects: { happiness: 18, education: 12 },
        result: '你觉得不需要想太远,过好每一天就好。'
      },
      {
        text: '感到空虚',
        hint: '学识+15,快乐-12',
        effects: { education: 15, happiness: -12 },
        flags: { existential_crisis: true },
        result: '你感到人生没有意义,陷入存在主义危机。'
      }
    ]
  },

  {
    id: 'daily_philanthropy',
    year: null,
    category: 'daily',
    trigger: { ageRange: [35, 50], gender: null, randomChance: 0.08 },
    title: '慈善参与',
    description: '你有能力了,考虑是否参与慈善事业。',
    context: '慈善是回馈社会的好方式。',
    choices: [
      {
        text: '积极捐赠',
        hint: '社交+18,快乐+20,魅力+20,财富-20',
        effects: { social: 18, happiness: 20, charm: 20, wealth: -20 },
        flags: { philanthropist: true },
        result: '你定期捐款做慈善,帮助了很多需要的人!'
      },
      {
        text: '偶尔捐赠',
        hint: '社交+10,快乐+12,魅力+10,财富-10',
        effects: { social: 10, happiness: 12, charm: 10, wealth: -10 },
        result: '你遇到特别的活动会捐款,平时不太关注。'
      },
      {
        text: '专注于家庭',
        hint: '社交+12,快乐+15',
        effects: { social: 12, happiness: 15 },
        result: '你觉得照顾好家人就是对社会最大的贡献。'
      }
    ]
  },

  {
    id: 'daily_passion_project',
    year: null,
    category: 'daily',
    trigger: { ageRange: [30, 50], gender: null, randomChance: 0.08 },
    title: '激情项目',
    description: '你有一个一直想做但没做的激情项目。',
    context: '激情项目能让生活更有意义。',
    choices: [
      {
        text: '启动项目',
        hint: '快乐+25,学识+20,魅力+18,财富-15',
        effects: { happiness: 25, education: 20, charm: 18, wealth: -15 },
        flags: { passion_project: true },
        result: '你启动了激情项目,虽然忙但很充实!'
      },
      {
        text: '慢慢准备',
        hint: '学识+15,快乐+10',
        effects: { education: 15, happiness: 10 },
        result: '你在为项目做准备,但还没有正式启动。'
      },
      {
        text: '放弃了',
        hint: '学识+8,快乐-8',
        effects: { education: 8, happiness: -8 },
        flags: { regret: true },
        result: '你觉得自己太老了,放弃了激情项目的想法。'
      }
    ]
  },

  // ==================== 日常事件 ====================
  // 这些事件可以在任意年份触发,不受年份限制

  {
    id: 'life_confession',
    year: null, // 可以在任意年份触发
    category: 'life',
    trigger: { ageRange: [13, 30], gender: null },
    title: '心动时刻',
    description: '你发现自己对某个人产生了好感,内心纠结是否要表白。',
    choices: [
      {
        text: '勇敢表白',
        hint: '社交+15,快乐+20或-20(随机)',
        effects: { social: 15, charm: 10 },
        flags: { confessed: true },
        result: '你鼓起勇气表白了!不管结果如何,你至少没有遗憾。'
      },
      {
        text: '默默关注',
        hint: '快乐+5,学识+8',
        effects: { happiness: 5, education: 8 },
        result: '你选择把这份感情藏在心里,默默关注Ta的一切。'
      },
      {
        text: '尝试成为朋友',
        hint: '社交+12,快乐+10',
        effects: { social: 12, happiness: 10 },
        flags: { friend_zone: true },
        result: '你从朋友做起,慢慢接近Ta,享受这段暧昧的时光。'
      }
    ]
  },

  {
    id: 'life_job_change',
    year: null,
    category: 'life',
    trigger: { ageRange: [22, 40], gender: null },
    title: '工作抉择',
    description: '当前的工作让你感到迷茫,有猎头联系你介绍了新的机会。',
    choices: [
      {
        text: '跳槽到新公司',
        hint: '财富+15,社交-5,学识+10',
        effects: { wealth: 15, social: -5, education: 10 },
        flags: { job_hopper: true },
        result: '你选择了跳槽,新的环境让你既兴奋又紧张。'
      },
      {
        text: '留在原公司',
        hint: '社交+10,快乐+8',
        effects: { social: 10, happiness: 8 },
        flags: { loyal_employee: true },
        result: '你决定继续留在原公司,稳定发展。'
      },
      {
        text: '创业试试',
        hint: '财富±30(随机),学识+20,快乐+15',
        effects: { education: 20, happiness: 15, wealth: 0 },
        flags: { entrepreneur: true },
        result: '你选择创业,开始了充满挑战的创业之路!'
      }
    ]
  },

  {
    id: 'life_friend_conflict',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 35], gender: null },
    title: '朋友误会',
    description: '你和朋友之间产生了误会,关系变得有些尴尬。',
    choices: [
      {
        text: '主动沟通解决',
        hint: '社交+15,魅力+12,快乐+10',
        effects: { social: 15, charm: 12, happiness: 10 },
        flags: { good_communicator: true },
        result: '你主动找朋友谈了心,误会解除了,关系反而更好了。'
      },
      {
        text: '等对方先开口',
        hint: '社交-5,快乐-5',
        effects: { social: -5, happiness: -5 },
        result: '你们都在等对方先开口,关系慢慢疏远了。'
      },
      {
        text: '让时间冲淡一切',
        hint: '社交-10,快乐+5',
        effects: { social: -10, happiness: 5 },
        result: '你选择了沉默,让时间慢慢冲淡这个误会。'
      }
    ]
  },

  {
    id: 'life_skill_learning',
    year: null,
    category: 'life',
    trigger: { ageRange: [10, 40], gender: null },
    title: '学习新技能',
    description: '你想学习一项新技能来提升自己,但时间精力有限。',
    choices: [
      {
        text: '学习编程',
        hint: '技术+25,学识+15,财富+20(长期)',
        effects: { tech_skill: 25, education: 15 },
        flags: { learned_programming: true },
        result: '你开始学习编程,虽然艰难但很有成就感!'
      },
      {
        text: '学习一门外语',
        hint: '学识+20,魅力+10,社交+8',
        effects: { education: 20, charm: 10, social: 8 },
        flags: { learned_language: true },
        result: '你开始学习一门新语言,打开了看世界的新窗口。'
      },
      {
        text: '学习音乐/绘画',
        hint: '魅力+18,快乐+20,学识+10',
        effects: { charm: 18, happiness: 20, education: 10 },
        flags: { learned_art: true },
        result: '你开始学习艺术,生活变得更加丰富多彩。'
      }
    ]
  },

  {
    id: 'life_exercise',
    year: null,
    category: 'life',
    trigger: { ageRange: [14, 45], gender: null },
    title: '运动健身',
    description: '你发现自己的身体状态不太好,想开始锻炼。',
    choices: [
      {
        text: '坚持健身',
        hint: '健康+20,魅力+15,快乐+12',
        effects: { health: 20, charm: 15, happiness: 12 },
        flags: { fitness_fan: true },
        result: '你开始规律健身,身体和精神状态都变好了!'
      },
      {
        text: '偶尔运动',
        hint: '健康+8,快乐+5',
        effects: { health: 8, happiness: 5 },
        result: '你偶尔会运动,虽然不够规律,但总比不运动强。'
      },
      {
        text: '太懒了,算了吧',
        hint: '健康-5,快乐+5',
        effects: { health: -5, happiness: 5 },
        result: '你想着下次再开始吧...然后就没有然后了。'
      }
    ]
  },

  {
    id: 'life_reading',
    year: null,
    category: 'life',
    trigger: { ageRange: [8, 40], gender: null },
    title: '阅读习惯',
    description: '你想培养阅读习惯,但不知道从哪里开始。',
    choices: [
      {
        text: '读经典文学',
        hint: '学识+20,魅力+10,快乐+8',
        effects: { education: 20, charm: 10, happiness: 8 },
        flags: { literature_lover: true },
        result: '你开始阅读经典文学作品,思想变得成熟深刻。'
      },
      {
        text: '读实用技能书',
        hint: '学识+15,技术+12,财富+10(未来)',
        effects: { education: 15, tech_skill: 12 },
        flags: { practical_learner: true },
        result: '你选择实用类书籍,学到了很多有用的技能。'
      },
      {
        text: '读网络小说',
        hint: '快乐+15,学识+5,健康-3',
        effects: { happiness: 15, education: 5, health: -3 },
        flags: { novel_fan: true },
        result: '你沉迷网络小说,熬夜追更停不下来!'
      }
    ]
  },

  {
    id: 'life_social_media',
    year: null,
    category: 'life',
    trigger: { ageRange: [14, 35], gender: null },
    title: '社交媒体',
    description: '社交媒体占据了太多时间,你想要改变。',
    choices: [
      {
        text: '减少使用,专注现实',
        hint: '健康+10,学识+12,社交-8',
        effects: { health: 10, education: 12, social: -8 },
        flags: { digital_detox: true },
        result: '你减少了社交媒体的使用,发现生活更加充实了。'
      },
      {
        text: '适度使用,保持联系',
        hint: '社交+12,快乐+8',
        effects: { social: 12, happiness: 8 },
        result: '你学会了平衡线上和线下的生活。'
      },
      {
        text: '继续沉迷',
        hint: '社交+5,快乐+10,学识-10,健康-8',
        effects: { social: 5, happiness: 10, education: -10, health: -8 },
        flags: { social_addict: true },
        result: '你继续刷手机到深夜...这就是现代人的生活吧。'
      }
    ]
  },

  {
    id: 'life_family_time',
    year: null,
    category: 'life',
    trigger: { ageRange: [15, 40], gender: null },
    title: '陪伴家人',
    description: '你意识到陪伴家人的时间越来越少了。',
    choices: [
      {
        text: '每周固定回家吃饭',
        hint: '快乐+15,社交+10,健康+8',
        effects: { happiness: 15, social: 10, health: 8 },
        flags: { family_oriented: true },
        result: '你开始每周固定回家陪父母吃饭,家庭关系更加亲密。'
      },
      {
        text: '节假日才回去',
        hint: '快乐+8,社交+5',
        effects: { happiness: 8, social: 5 },
        result: '你在节假日会回家陪伴家人。'
      },
      {
        text: '太忙了,很少回去',
        hint: '快乐-5,社交-10,学识+15',
        effects: { happiness: -5, social: -10, education: 15 },
        flags: { workaholic: true },
        result: '你忙于工作,很少有时间陪伴家人...希望还不算太晚。'
      }
    ]
  },

  {
    id: 'life_money_management',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 65], gender: null },
    title: '理财规划',
    description: '你手上有了一些积蓄,需要考虑理财规划。',
    choices: [
      {
        text: '学习投资理财',
        hint: '财富+25,学识+15,技术+10',
        effects: { wealth: 25, education: 15, tech_skill: 10 },
        flags: { investor: true },
        result: '你开始学习投资理财,为未来做规划。'
      },
      {
        text: '存银行定期',
        hint: '财富+10,学识+5',
        effects: { wealth: 10, education: 5 },
        result: '你选择稳健的定期存款,虽然收益不高但很安全。'
      },
      {
        text: '及时行乐,花掉',
        hint: '快乐+20,财富-15',
        effects: { happiness: 20, wealth: -15 },
        flags: { spender: true },
        result: '你选择享受当下,钱花了才是自己的!'
      }
    ]
  },

  {
    id: 'life_mental_health',
    year: null,
    category: 'life',
    trigger: { ageRange: [16, 40], gender: null },
    title: '情绪压力',
    description: '你感到压力很大,情绪有些低落。',
    choices: [
      {
        text: '寻求专业帮助',
        hint: '健康+15,快乐+15,学识+10',
        effects: { health: 15, happiness: 15, education: 10 },
        flags: { therapy: true },
        result: '你寻求了心理咨询,学会了更好地管理情绪。'
      },
      {
        text: '和朋友倾诉',
        hint: '社交+12,快乐+12,健康+8',
        effects: { social: 12, happiness: 12, health: 8 },
        flags: { emotional_support: true },
        result: '你和朋友倾诉,感觉好多了。'
      },
      {
        text: '自己消化',
        hint: '健康-5,快乐-5,学识+8',
        effects: { health: -5, happiness: -5, education: 8 },
        flags: { bottled_up: true },
        result: '你选择自己承受,希望时间能治愈一切。'
      }
    ]
  },

  // ==================== 更多日常生活事件 ====================

  // 情感类
  {
    id: 'life_first_love',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 20], gender: null },
    title: '初恋的感觉',
    description: '你第一次感受到心跳加速的感觉,那个人的一举一动都牵动着你的情绪。',
    choices: [
      { text: '写情书表白', effects: { social: 10, charm: 8, happiness: 15 }, flags: { romantic: true }, result: '你鼓起勇气写了情书,心跳加速地递交出去...' },
      { text: '默默暗恋', effects: { education: 10, happiness: 5 }, result: '你把这份美好藏在心里,成为青春的回忆。' },
      { text: '努力靠近', effects: { social: 15, charm: 12 }, flags: { active_lover: true }, result: '你努力制造机会接近Ta,慢慢熟悉起来。' }
    ]
  },
  {
    id: 'life_breakup',
    year: null,
    category: 'life',
    trigger: { ageRange: [16, 38], gender: null },
    title: '分手时刻',
    description: '你们走到了感情的分岔路口,是时候做出选择了。',
    choices: [
      { text: '体面分手', effects: { charm: 10, happiness: -10, social: 5 }, flags: { mature_breakup: true }, result: '你选择体面地结束这段关系,虽然难过但保持尊严。' },
      { text: '尝试挽回', effects: { social: 8, happiness: 5 }, flags: { fight_for_love: true }, result: '你不想轻易放弃,试图挽回这段感情。' },
      { text: '和平分手做朋友', effects: { social: 12, charm: 8 }, flags: { remain_friends: true }, result: '你们决定和平分手,继续保持朋友关系。' }
    ]
  },
  {
    id: 'life_marriage_proposal',
    year: null,
    category: 'life',
    trigger: { ageRange: [22, 42], gender: null },
    title: '求婚',
    description: '你考虑了很久,觉得是时候向Ta求婚了。',
    choices: [
      { text: '精心策划求婚', effects: { charm: 20, happiness: 25, wealth: -20 }, flags: { romantic_proposal: true }, result: '你精心准备了浪漫的求婚仪式,Ta感动落泪!' },
      { text: '简单直接', effects: { happiness: 15, charm: 10 }, result: '你选择真诚直接的方式表达心意。' },
      { text: '再等等', effects: { happiness: -5, wealth: 10 }, result: '你觉得自己还没准备好,决定再等等。' }
    ]
  },
  {
    id: 'life_online_dating',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 45], gender: null },
    title: '网恋',
    description: '你在交友软件上聊得很投缘的人,要不要见个面?',
    choices: [
      { text: '勇敢见面', effects: { social: 15, happiness: 20, charm: 8 }, flags: { online_dater: true }, result: '你决定见个面,希望能有美好的邂逅!' },
      { text: '继续网聊', effects: { social: 8, happiness: 10 }, result: '你选择先在网上继续了解对方。' },
      { text: '放弃', effects: { happiness: -5 }, result: '你担心网上不靠谱,选择了放弃。' }
    ]
  },

  // 学业学习类
  {
    id: 'life_exam_prep',
    year: null,
    category: 'life',
    trigger: { ageRange: [10, 23], gender: null },
    title: '重要考试',
    description: '即将迎来一场重要的考试,你该如何准备?',
    choices: [
      { text: '全力以赴复习', effects: { education: 20, health: -10, happiness: -5 }, flags: { hard_worker: true }, result: '你制定了详细的复习计划,开始了刷题模式!' },
      { text: '适度复习', effects: { education: 10, happiness: 8, health: 5 }, result: '你平衡学习和休息,保持良好状态。' },
      { text: '临阵磨枪', effects: { education: 5, happiness: 5, luck: 10 }, flags: { last_minute: true }, result: '你决定考前突击,希望能有好运气!' }
    ]
  },
  {
    id: 'life_subject_choice',
    year: null,
    category: 'life',
    trigger: { ageRange: [15, 17], gender: null },
    title: '文理分科',
    description: '到了选科的时候,你该选择文科还是理科?',
    choices: [
      { text: '选择理科', effects: { tech_skill: 15, education: 10, wealth: 10 }, flags: { science_student: true }, result: '你选择了理科,未来方向更明确。' },
      { text: '选择文科', effects: { charm: 12, social: 15, education: 10 }, flags: { arts_student: true }, result: '你选择了文科,发挥自己的优势。' },
      { text: '犹豫不决', effects: { happiness: -5, luck: 10 }, result: '你纠结了很久,最终还是需要做出选择。' }
    ]
  },
  {
    id: 'life_study_abroad',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 25], gender: null },
    title: '出国留学',
    description: '有机会出国留学,但需要离开家人朋友。',
    choices: [
      { text: '出国深造', effects: { education: 25, tech_skill: 15, social: -10, wealth: -20 }, flags: { abroad_study: true }, result: '你选择出国,开始全新的生活体验!' },
      { text: '留在国内', effects: { social: 15, happiness: 10, wealth: 10 }, result: '你选择留在国内发展,继续陪伴家人朋友。' },
      { text: '先工作再考虑', effects: { wealth: 15, education: 5 }, flags: { work_first: true }, result: '你决定先工作积累经验,以后再考虑留学。' }
    ]
  },
  {
    id: 'life_graduation_thesis',
    year: null,
    category: 'life',
    trigger: { ageRange: [21, 25], gender: null },
    title: '毕业论文',
    description: '毕业论文Deadline临近,你还没开始写...',
    choices: [
      { text: '熬夜赶论文', effects: { education: 15, health: -15, happiness: -10 }, flags: { night_owl: true }, result: '你开始了咖啡续命的赶论文生活!' },
      { text: '合理规划时间', effects: { education: 12, health: 5, charm: 8 }, flags: { good_planner: true }, result: '你制定了时间表,按部就班地完成。' },
      { text: '申请延期', effects: { education: 8, happiness: 5 }, result: '你申请延期答辩,争取更多时间。' }
    ]
  },

  // 工作职业类
  {
    id: 'life_job_interview',
    year: null,
    category: 'life',
    trigger: { ageRange: [22, 35], gender: null },
    title: '求职面试',
    description: '明天有一场重要的面试,你该如何准备?',
    choices: [
      { text: '充分准备', effects: { charm: 15, education: 10, social: 8 }, flags: { well_prepared: true }, result: '你研究了公司和职位,准备了充分。' },
      { text: '正常发挥', effects: { charm: 8, social: 5 }, result: '你选择展现真实的自己。' },
      { text: '临时抱佛脚', effects: { luck: 15, happiness: -5 }, result: '面试前才匆忙准备,希望运气好!' }
    ]
  },
  {
    id: 'life_promotion',
    year: null,
    category: 'life',
    trigger: { ageRange: [25, 45], gender: null },
    title: '升职机会',
    description: '公司有一个升职机会,竞争很激烈。',
    choices: [
      { text: '积极争取', effects: { wealth: 20, social: 10, health: -8 }, flags: { ambitious: true }, result: '你全力以赴争取这个机会!' },
      { text: '顺其自然', effects: { happiness: 8, health: 5 }, result: '你选择表现自己,但不强求。' },
      { text: '放弃竞争', effects: { happiness: 5, social: -5 }, result: '你觉得压力太大,选择放弃竞争。' }
    ]
  },
  {
    id: 'life_overtime',
    year: null,
    category: 'life',
    trigger: { ageRange: [22, 40], gender: null },
    title: '加班邀请',
    description: '领导邀请你加班参与重要项目,但你有私人安排。',
    choices: [
      { text: '接受加班', effects: { wealth: 15, education: 10, health: -10, happiness: -8 }, flags: { workaholic: true }, result: '你选择工作,放弃了私人时间。' },
      { text: '婉拒加班', effects: { happiness: 10, health: 8, social: 5 }, flags: { life_balance: true }, result: '你选择了生活平衡,婉拒了加班。' },
      { text: '协商解决', effects: { social: 15, charm: 12 }, flags: { negotiator: true }, result: '你尝试协商,找到折中方案。' }
    ]
  },
  {
    id: 'life_office_politics',
    year: null,
    category: 'life',
    trigger: { ageRange: [23, 45], gender: null },
    title: '办公室政治',
    description: '同事之间有派系斗争,你被拉拢加入一方。',
    choices: [
      { text: '保持中立', effects: { charm: 15, social: 5 }, flags: { neutral_stance: true }, result: '你选择不站队,保持中立。' },
      { text: '加入一方', effects: { social: 15, wealth: 10, charm: -10 }, flags: { office_politics: true }, result: '你选择加入一方,获得了一些利益。' },
      { text: '远离纷争', effects: { happiness: 8, education: 10 }, flags: { avoid_drama: true }, result: '你专注于自己的工作,远离这些纷争。' }
    ]
  },

  // 健康生活类
  {
    id: 'life_diet',
    year: null,
    category: 'life',
    trigger: { ageRange: [16, 50], gender: null },
    title: '减肥计划',
    description: '你发现自己体重增加了,想开始减肥。',
    choices: [
      { text: '严格节食', effects: { health: -5, charm: 10, happiness: -10 }, flags: { strict_diet: true }, result: '你开始严格控制饮食,虽然有效但很痛苦!' },
      { text: '运动减肥', effects: { health: 20, charm: 15, happiness: 10 }, flags: { healthy_weight_loss: true }, result: '你选择运动减肥,身体变得更健康!' },
      { text: '接受现状', effects: { happiness: 12, charm: 5 }, flags: { body_positive: true }, result: '你学会接受自己的身材,保持自信。' }
    ]
  },
  {
    id: 'life_sleep',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 40], gender: null },
    title: '熬夜问题',
    description: '你总是忍不住熬夜,第二天精神很差。',
    choices: [
      { text: '强制早睡', effects: { health: 15, happiness: -5 }, flags: { early_bird: true }, result: '你强迫自己早睡,开始很不习惯但慢慢适应了。' },
      { text: '调整作息', effects: { health: 10, happiness: 5 }, flags: { balanced_schedule: true }, result: '你逐渐调整睡眠时间,找到适合自己的节奏。' },
      { text: '继续熬夜', effects: { health: -10, happiness: 10, tech_skill: 8 }, flags: { night_owl: true }, result: '你享受夜晚的宁静时间,继续熬夜...' }
    ]
  },
  {
    id: 'life_medical_checkup',
    year: null,
    category: 'life',
    trigger: { ageRange: [22, 60], gender: null },
    title: '体检报告',
    description: '体检报告显示有一些指标不太正常,需要改善。',
    choices: [
      { text: '认真改善', effects: { health: 20, education: 10, happiness: 5 }, flags: { health_conscious: true }, result: '你开始认真调整饮食和生活习惯!' },
      { text: '适度关注', effects: { health: 10, happiness: 8 }, result: '你稍微注意一下,但不想太严格。' },
      { text: '忽略不管', effects: { health: -10, happiness: 10 }, flags: { carefree: true }, result: '你选择忽略这些指标,该吃吃该喝喝!' }
    ]
  },
  {
    id: 'life_sports_event',
    year: null,
    category: 'life',
    trigger: { ageRange: [10, 35], gender: null },
    title: '运动比赛',
    description: '公司/学校组织体育比赛,邀请你参加。',
    choices: [
      { text: '积极参加', effects: { health: 15, social: 15, happiness: 12 }, flags: { sports_enthusiast: true }, result: '你报名参加了比赛,享受运动的乐趣!' },
      { text: '作为观众', effects: { social: 10, happiness: 8 }, result: '你选择作为啦啦队为队友加油!' },
      { text: '不感兴趣', effects: { education: 8 }, result: '你不太感兴趣,选择不去参加。' }
    ]
  },

  // 社交人际类
  {
    id: 'life_party',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 35], gender: null },
    title: '聚会邀请',
    description: '朋友组织聚会,但你当天有点累。',
    choices: [
      { text: '参加聚会', effects: { social: 15, happiness: 12, health: -5 }, flags: { social_butterfly: true }, result: '你选择参加,见到朋友后心情变好了!' },
      { text: '在家休息', effects: { health: 10, happiness: 5, social: -5 }, flags: { homebody: true }, result: '你选择在家休息,享受独处时光。' },
      { text: '晚点到', effects: { social: 10, happiness: 8 }, result: '你决定先休息,晚点再过去。' }
    ]
  },
  {
    id: 'life_new_friend',
    year: null,
    category: 'life',
    trigger: { ageRange: [10, 40], gender: null },
    title: '新朋友',
    description: '你遇到了一个很有趣的人,想和Ta成为朋友。',
    choices: [
      { text: '主动搭讪', effects: { social: 18, charm: 12, happiness: 10 }, flags: { outgoing: true }, result: '你主动和Ta搭话,开始了新的友谊!' },
      { text: '慢慢观察', effects: { social: 8, education: 10 }, result: '你选择先观察了解,再决定是否深入交往。' },
      { text: '等待机会', effects: { social: 5, luck: 10 }, flags: { patient: true }, result: '你等待合适的时机再接触。' }
    ]
  },
  {
    id: 'life_group_activity',
    year: null,
    category: 'life',
    trigger: { ageRange: [15, 30], gender: null },
    title: '社团活动',
    description: '学校/公司有各种社团活动,你想加入哪个?',
    choices: [
      { text: '运动社团', effects: { health: 15, social: 12, charm: 8 }, flags: { sports_club: true }, result: '你加入了运动社团,认识了很多爱运动的朋友!' },
      { text: '文艺社团', effects: { charm: 18, happiness: 15, social: 10 }, flags: { art_club: true }, result: '你加入了文艺社团,培养了艺术爱好!' },
      { text: '学术社团', effects: { education: 20, tech_skill: 12 }, flags: { academic_club: true }, result: '你加入了学术社团,拓展了知识面!' }
    ]
  },
  {
    id: 'life_social_networking',
    year: null,
    category: 'life',
    trigger: { ageRange: [22, 40], gender: null },
    title: '社交活动',
    description: '行业有个社交酒会,可以扩展人脉。',
    choices: [
      { text: '积极社交', effects: { social: 20, wealth: 15, charm: 10, health: -5 }, flags: { networker: true }, result: '你积极社交,建立了有价值的联系!' },
      { text: '礼貌出席', effects: { social: 10, charm: 8 }, result: '你礼貌性地出席,没有太过主动。' },
      { text: '不参加', effects: { happiness: 8, education: 10 }, flags: { introvert: true }, result: '你不太喜欢这种场合,选择不去。' }
    ]
  },

  // 兴趣爱好类
  {
    id: 'life_hobby_music',
    year: null,
    category: 'life',
    trigger: { ageRange: [8, 35], gender: null },
    title: '音乐梦想',
    description: '你一直想学习一种乐器,现在有机会开始。',
    choices: [
      { text: '开始学习', effects: { charm: 20, happiness: 20, wealth: -10 }, flags: { musician: true }, result: '你开始学习乐器,享受音乐带来的快乐!' },
      { text: '先租一把试试', effects: { charm: 12, happiness: 12, wealth: -3 }, flags: { cautious_learner: true }, result: '你先租了乐器试试,看看自己能否坚持。' },
      { text: '只是欣赏', effects: { happiness: 10 }, flags: { music_lover: true }, result: '你决定只做个欣赏者,享受音乐就好。' }
    ]
  },
  {
    id: 'life_hobby_photography',
    year: null,
    category: 'life',
    trigger: { ageRange: [15, 45], gender: null },
    title: '摄影兴趣',
    description: '你对摄影产生了兴趣,想深入发展这个爱好。',
    choices: [
      { text: '买专业设备', effects: { charm: 15, happiness: 18, wealth: -25 }, flags: { photographer: true }, result: '你投资了专业相机,开始学习摄影!' },
      { text: '用手机拍拍', effects: { charm: 8, happiness: 12, tech_skill: 10 }, flags: { mobile_photographer: true }, result: '你用手机练习,享受拍照的乐趣!' },
      { text: '只看不拍', effects: { happiness: 8 }, flags: { photo_appreciator: true }, result: '你选择欣赏别人的作品,不自己拍。' }
    ]
  },
  {
    id: 'life_hobby_cooking',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 40], gender: null },
    title: '烹饪学习',
    description: '你想学习做饭,提升生活品质。',
    choices: [
      { text: '系统学习', effects: { charm: 15, happiness: 15, health: 10, wealth: -10 }, flags: { chef: true }, result: '你报名了烹饪课程,学会了很多菜式!' },
      { text: '跟着视频学', effects: { charm: 10, happiness: 12, tech_skill: 8 }, flags: { home_cook: true }, result: '你跟着网上的视频学习,慢慢进步!' },
      { text: '点外卖吧', effects: { happiness: 5, wealth: -10, health: -5 }, flags: { takeout_lover: true }, result: '你觉得自己太懒了,还是点外卖吧...' }
    ]
  },
  {
    id: 'life_hobby_gaming',
    year: null,
    category: 'life',
    trigger: { ageRange: [10, 35], gender: null },
    title: '游戏爱好',
    description: '你想玩一款新游戏,但时间精力有限。',
    choices: [
      { text: '深度投入', effects: { happiness: 20, tech_skill: 15, health: -10, education: -8 }, flags: { gamer: true }, result: '你沉迷游戏,享受虚拟世界的乐趣!' },
      { text: '适度游戏', effects: { happiness: 12, tech_skill: 8 }, flags: { casual_gamer: true }, result: '你适度游戏,作为娱乐放松。' },
      { text: '不玩游戏', effects: { education: 10, health: 5 }, flags: { non_gamer: true }, result: '你选择把时间用在其他事情上。' }
    ]
  },

  // 家庭关系类
  {
    id: 'life_parent_conflict',
    year: null,
    category: 'life',
    trigger: { ageRange: [13, 28], gender: null },
    title: '代沟矛盾',
    description: '你和父母在某些问题上意见不合,产生了争执。',
    choices: [
      { text: '耐心沟通', effects: { social: 15, charm: 12, happiness: 8 }, flags: { good_communicator: true }, result: '你耐心地和父母沟通,增进了相互理解。' },
      { text: '坚持己见', effects: { charm: 8, happiness: 5, social: -8 }, flags: { independent: true }, result: '你坚持自己的想法,虽然有些矛盾但不后悔。' },
      { text: '妥协让步', effects: { happiness: -5, social: 8 }, flags: { compliant: true }, result: '你选择妥协,避免冲突升级。' }
    ]
  },
  {
    id: 'life_family_gathering',
    year: null,
    category: 'life',
    trigger: { ageRange: [5, 80], gender: null },
    title: '家庭聚会',
    description: '大家庭要举办聚会,亲戚们会问东问西。',
    choices: [
      { text: '热情参与', effects: { social: 15, happiness: 12, charm: 10 }, flags: { family_oriented: true }, result: '你积极参与聚会,享受家庭温暖!' },
      { text: '礼貌应对', effects: { social: 8, charm: 8 }, result: '你礼貌地应对亲戚们的各种问题。' },
      { text: '找理由避开', effects: { happiness: 10, social: -5 }, flags: { introvert: true }, result: '你不太喜欢这种场合,找理由避开了。' }
    ]
  },
  {
    id: 'life_elderly_care',
    year: null,
    category: 'life',
    trigger: { ageRange: [20, 60], gender: null },
    title: '照顾老人',
    description: '家里老人身体需要照顾,需要你的时间精力。',
    choices: [
      { text: '尽心照顾', effects: { charm: 18, happiness: 15, health: -10, wealth: -10 }, flags: { filial: true }, result: '你尽力照顾老人,虽然辛苦但问心无愧!' },
      { text: '家人分担', effects: { social: 12, charm: 10, happiness: 8 }, flags: { collaborative: true }, result: '你和家人一起分担照顾责任。' },
      { text: '请护工', effects: { wealth: -20, health: 5, happiness: 5 }, flags: { pragmatic: true }, result: '你选择请专业护工,经济上花费但减轻负担。' }
    ]
  },
  {
    id: 'life_sibling_relationship',
    year: null,
    category: 'life',
    trigger: { ageRange: [5, 35], gender: null },
    title: '手足情深',
    description: '兄弟姐妹遇到了困难,需要你的帮助。',
    choices: [
      { text: '全力帮助', effects: { social: 20, happiness: 15, wealth: -15 }, flags: { supportive_sibling: true }, result: '你毫不犹豫地帮助兄弟姐妹,感情更深了!' },
      { text: '适度帮助', effects: { social: 12, happiness: 10, wealth: -8 }, result: '你在能力范围内提供帮助。' },
      { text: '建议求助', effects: { education: 10, charm: 8 }, flags: { advisor: true }, result: '你给出建议和指导,让Ta学会自己解决。' }
    ]
  },

  // 金钱理财类
  {
    id: 'life_first_salary',
    year: null,
    category: 'life',
    trigger: { ageRange: [22, 32], gender: null },
    title: '第一份工资',
    description: '你收到了人生的第一份工资,该怎么花?',
    choices: [
      { text: '给父母买礼物', effects: { charm: 20, happiness: 20, social: 15 }, flags: { filial: true }, result: '你给父母买了礼物,他们很欣慰!' },
      { text: '存起来', effects: { wealth: 20, education: 10 }, flags: { saver: true }, result: '你把钱存起来,为未来做打算。' },
      { text: '犒劳自己', effects: { happiness: 18, charm: 10, wealth: -10 }, flags: { self_reward: true }, result: '你给自己买了想要的东西,犒劳自己的努力!' }
    ]
  },
  {
    id: 'life_car_purchase',
    year: null,
    category: 'life',
    trigger: { ageRange: [22, 45], gender: null },
    title: '购车计划',
    description: '你考虑买辆车,方便出行。',
    choices: [
      { text: '买新车', effects: { charm: 15, happiness: 20, wealth: -30 }, flags: { new_car: true }, result: '你买了一辆新车,享受有车的生活!' },
      { text: '买二手车', effects: { charm: 10, happiness: 12, wealth: -15 }, flags: { used_car: true }, result: '你买了辆二手车,性价比不错!' },
      { text: '暂时不买', effects: { wealth: 10, health: 5 }, flags: { patient_buyer: true }, result: '你选择再等等,等经济条件更好再说。' }
    ]
  },
  {
    id: 'life_house_purchase',
    year: null,
    category: 'life',
    trigger: { ageRange: [25, 55], gender: null },
    title: '买房计划',
    description: '房价居高不下,你纠结要不要买房。',
    choices: [
      { text: '咬牙买房', effects: { wealth: -50, happiness: 25, health: -10 }, flags: { homeowner: true }, result: '你背上了房贷,但有了自己的家!' },
      { text: '继续观望', effects: { wealth: 10, education: 10 }, flags: { wait_and_see: true }, result: '你选择观望,等待更好的时机。' },
      { text: '租房生活', effects: { happiness: 15, wealth: 20 }, flags: { renter: true }, result: '你选择租房,享受灵活自由的生活!' }
    ]
  },
  {
    id: 'life_lottery',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 50], gender: null },
    title: '彩票诱惑',
    description: '彩票奖金很诱人,要不要试试手气?',
    choices: [
      { text: '买一张试试', effects: { luck: 20, wealth: -5, happiness: 10 }, flags: { lottery_player: true }, result: '你买了一张彩票,期待好运降临!' },
      { text: '理性对待', effects: { education: 10, wealth: 5 }, flags: { rational: true }, result: '你理性看待彩票,不抱侥幸心理。' },
      { text: '从不买彩票', effects: { wealth: 10, happiness: -3 }, flags: { non_gambler: true }, result: '你从不买彩票,相信靠自己的努力。' }
    ]
  },

  // 自我成长类
  {
    id: 'life_public_speaking',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 40], gender: null },
    title: '公开演讲',
    description: '需要在众人面前做一次演讲或展示。',
    choices: [
      { text: '充分准备', effects: { charm: 20, education: 15, social: 10 }, flags: { well_prepared: true }, result: '你精心准备,演讲很成功!' },
      { text: '临场发挥', effects: { charm: 10, luck: 15 }, flags: { improviser: true }, result: '你选择临场发挥,看运气了!' },
      { text: '找人代替', effects: { social: 8, happiness: 5 }, flags: { delegate: true }, result: '你不太自信,找人代替你演讲。' }
    ]
  },
  {
    id: 'life_volunteer',
    year: null,
    category: 'life',
    trigger: { ageRange: [16, 45], gender: null },
    title: '志愿者活动',
    description: '有志愿者招募活动,你可以参与公益。',
    choices: [
      { text: '积极报名', effects: { happiness: 20, social: 15, charm: 12 }, flags: { volunteer: true }, result: '你参与了志愿者活动,帮助他人很快乐!' },
      { text: '偶尔参与', effects: { happiness: 12, social: 8 }, flags: { casual_volunteer: true }, result: '你偶尔参与志愿者活动。' },
      { text: '暂时没时间', effects: { education: 10, wealth: 5 }, flags: { busy_bee: true }, result: '你暂时太忙了,希望以后有机会参与。' }
    ]
  },
  {
    id: 'life_travel_solo',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 65], gender: null },
    title: '独自旅行',
    description: '你想独自去旅行,体验不一样的世界。',
    choices: [
      { text: '说走就走', effects: { happiness: 25, charm: 15, education: 12, wealth: -20 }, flags: { adventurer: true }, result: '你踏上了独自旅行的征程,收获满满!' },
      { text: '仔细规划', effects: { education: 15, happiness: 18, wealth: -15 }, flags: { planner: true }, result: '你仔细规划了行程,旅行很顺利!' },
      { text: '放弃旅行', effects: { wealth: 10, safety: 10 }, flags: { cautious: true }, result: '你担心安全,选择了放弃。' }
    ]
  },
  {
    id: 'life_new_year_resolution',
    year: null,
    category: 'life',
    trigger: { ageRange: [10, 50], gender: null },
    title: '新年计划',
    description: '新年到了,你制定了一些新年计划。',
    choices: [
      { text: '严格执行', effects: { education: 20, charm: 15, health: 10, happiness: 10 }, flags: { disciplined: true }, result: '你严格执行计划,进步明显!' },
      { text: '适度坚持', effects: { education: 12, happiness: 12, health: 8 }, result: '你大部分时候能坚持计划。' },
      { text: '随性而为', effects: { happiness: 15, luck: 10 }, flags: { easygoing: true }, result: '你选择随性,不给自己太大压力。' }
    ]
  },

  // 科技数码类
  {
    id: 'life_smartphone_addiction',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 40], gender: null },
    title: '手机依赖',
    description: '你发现自己离不开手机,总是忍不住刷。',
    choices: [
      { text: '刻意减少', effects: { health: 12, education: 15, happiness: -5 }, flags: { digital_detox: true }, result: '你开始刻意减少手机使用,生活更充实!' },
      { text: '设置限制', effects: { health: 8, education: 10, happiness: 5 }, flags: { balanced_user: true }, result: '你设置了使用时间限制,逐步改善。' },
      { text: '继续使用', effects: { happiness: 10, tech_skill: 10, health: -8 }, flags: { phone_addict: true }, result: '你继续手机不离手,这就是现代生活吧...' }
    ]
  },
  {
    id: 'life_new_gadget',
    year: null,
    category: 'life',
    trigger: { ageRange: [15, 45], gender: null },
    title: '新电子产品',
    description: '最新款的电子产品发布了,你很想要。',
    choices: [
      { text: '立即购买', effects: { happiness: 20, tech_skill: 15, charm: 10, wealth: -25 }, flags: { early_adopter: true }, result: '你买到了最新款,享受科技乐趣!' },
      { text: '等待降价', effects: { wealth: 10, education: 8, happiness: -3 }, flags: { patient_buyer: true }, result: '你选择等降价再买,性价比更高。' },
      { text: '不买了', effects: { wealth: 15, happiness: 5 }, flags: { minimalist: true }, result: '你决定不买,现有的够用了。' }
    ]
  },
  {
    id: 'life_social_platform',
    year: null,
    category: 'life',
    trigger: { ageRange: [14, 40], gender: null },
    title: '社交平台',
    description: '新的社交平台很火,朋友们都在用。',
    choices: [
      { text: '紧跟潮流', effects: { social: 18, happiness: 15, tech_skill: 12 }, flags: { trend_follower: true }, result: '你注册了账号,开始玩转新平台!' },
      { text: '观望一下', effects: { social: 8, education: 10 }, flags: { observer: true }, result: '你先看看别人怎么用,再决定是否加入。' },
      { text: '不感兴趣', effects: { education: 12, health: 5 }, flags: { offline_person: true }, result: '你对社交平台不太感兴趣,享受线下生活。' }
    ]
  },

  // 娱乐休闲类
  {
    id: 'life_concert',
    year: null,
    category: 'life',
    trigger: { ageRange: [14, 40], gender: null },
    title: '演唱会门票',
    description: '你喜欢的歌手要开演唱会,但票价很贵。',
    choices: [
      { text: '不惜代价', effects: { happiness: 25, charm: 12, wealth: -30 }, flags: { super_fan: true }, result: '你买了票,现场气氛太棒了!' },
      { text: '看视频', effects: { happiness: 10, wealth: 5 }, flags: { rational_fan: true }, result: '你选择看直播视频,省钱也不错。' },
      { text: '放弃观看', effects: { wealth: 10, happiness: -5 }, flags: { saver: true }, result: '你舍不得花钱,选择放弃。' }
    ]
  },
  {
    id: 'life_movie_marathon',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 35], gender: null },
    title: '追剧狂热',
    description: '你迷上了一部剧,忍不住熬夜追。',
    choices: [
      { text: '熬夜追完', effects: { happiness: 20, health: -12, education: -5 }, flags: { binge_watcher: true }, result: '你熬夜追完剧,虽然累但很过瘾!' },
      { text: '适度追剧', effects: { happiness: 15, health: 5 }, flags: { balanced_viewer: true }, result: '你控制自己,每天看几集。' },
      { text: '忍住不看', effects: { education: 12, health: 8 }, flags: { disciplined: true }, result: '你强迫自己忍住,先忙完正事。' }
    ]
  },
  {
    id: 'life_karaoke',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 40], gender: null },
    title: 'KTV聚会',
    description: '朋友组织KTV聚会,邀请你参加。',
    choices: [
      { text: '热情参与', effects: { happiness: 18, social: 15, charm: 12, health: -5 }, flags: { party_animal: true }, result: '你在KTV尽情歌唱,释放压力!' },
      { text: '礼貌参与', effects: { social: 10, happiness: 10 }, flags: { social_joiner: true }, result: '你参与聚会,但比较安静。' },
      { text: '提前离开', effects: { health: 8, education: 10 }, flags: { homebody: true }, result: '你不太喜欢KTV,找借口提前离开。' }
    ]
  },
  {
    id: 'life_sports_fan',
    year: null,
    category: 'life',
    trigger: { ageRange: [10, 50], gender: null },
    title: '体育赛事',
    description: '重要的体育比赛开始了,你是铁杆粉丝。',
    choices: [
      { text: '熬夜看比赛', effects: { happiness: 20, health: -10, social: 12 }, flags: { die_hard_fan: true }, result: '你熬夜看比赛,为支持的队伍呐喊!' },
      { text: '看重播', effects: { happiness: 12, health: 5 }, flags: { casual_fan: true }, result: '你选择看重播,不影响休息。' },
      { text: '只看结果', effects: { education: 10, health: 8 }, flags: { result_checker: true }, result: '你只关心比赛结果,不熬夜。' }
    ]
  },

  // 挑战困境类
  {
    id: 'life_failure',
    year: null,
    category: 'life',
    trigger: { ageRange: [10, 45], gender: null },
    title: '遭遇失败',
    description: '你努力了很久的事情还是失败了,很受打击。',
    choices: [
      { text: '总结经验', effects: { education: 20, charm: 10, happiness: -5 }, flags: { resilient: true }, result: '你认真总结失败经验,为下次做准备!' },
      { text: '寻求安慰', effects: { social: 15, happiness: 10, charm: 8 }, flags: { support_seeker: true }, result: '你向朋友倾诉,得到了安慰和鼓励。' },
      { text: '放弃尝试', effects: { happiness: -10, education: 5 }, flags: { giver_upper: true }, result: '你很失落,决定暂时放弃这个方向。' }
    ]
  },
  {
    id: 'life_difficult_choice',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 45], gender: null },
    title: '艰难抉择',
    description: '你需要在两个都很重要的选项中做出选择。',
    choices: [
      { text: '听从内心', effects: { happiness: 15, charm: 12, wealth: -10 }, flags: { heart_follower: true }, result: '你选择听从内心,虽然不易但不后悔!' },
      { text: '理性分析', effects: { education: 18, wealth: 10, happiness: -5 }, flags: { rational: true }, result: '你理性分析后做出选择。' },
      { text: '寻求建议', effects: { social: 15, education: 10 }, flags: { advice_seeker: true }, result: '你征求了朋友的意见,帮助自己做决定。' }
    ]
  },
  {
    id: 'life_time_pressure',
    year: null,
    category: 'life',
    trigger: { ageRange: [15, 40], gender: null },
    title: '时间紧迫',
    description: '很多事情要做,但时间不够用,很焦虑。',
    choices: [
      { text: '制定计划', effects: { education: 18, charm: 10, health: 5 }, flags: { planner: true }, result: '你制定了详细计划,事情变得井井有条!' },
      { text: '专注重点', effects: { education: 15, happiness: 8 }, flags: { prioritizer: true }, result: '你选择先做重要的事,其他的放一放。' },
      { text: '熬夜赶工', effects: { education: 12, health: -12, happiness: -8 }, flags: { workaholic: true }, result: '你熬夜赶工,身体很累...' }
    ]
  },
  {
    id: 'life_loneliness',
    year: null,
    category: 'life',
    trigger: { ageRange: [16, 45], gender: null },
    title: '孤独感',
    description: '你感到很孤独,想要有人陪伴。',
    choices: [
      { text: '主动社交', effects: { social: 20, happiness: 15, charm: 12 }, flags: { proactive_social: true }, result: '你主动联系朋友,孤独感减轻了!' },
      { text: '享受独处', effects: { education: 15, charm: 10, happiness: 8 }, flags: { self_sufficient: true }, result: '你学会享受独处,与自己相处。' },
      { text: '寻求陪伴', effects: { social: 12, happiness: 12, wealth: -10 }, flags: { companionship_seeker: true }, result: '你找朋友陪伴,感觉好多了。' }
    ]
  },

  // 青春成长类
  {
    id: 'life_peer_pressure',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 22], gender: null },
    title: '同伴压力',
    description: '朋友们都在做某事,你该不该跟随?',
    choices: [
      { text: '坚持自我', effects: { charm: 15, education: 10, social: -8 }, flags: { independent: true }, result: '你坚持自己的想法,不盲从!' },
      { text: '适度参与', effects: { social: 15, happiness: 10 }, flags: { flexible: true }, result: '你适度参与,融入集体但不失自我。' },
      { text: '完全跟随', effects: { social: 18, charm: -5 }, flags: { follower: true }, result: '你选择跟随大家,不想显得特别。' }
    ]
  },
  {
    id: 'life_rebellion',
    year: null,
    category: 'life',
    trigger: { ageRange: [13, 20], gender: null },
    title: '叛逆期',
    description: '你觉得父母管得太多,想要更多自由。',
    choices: [
      { text: '理性沟通', effects: { social: 18, charm: 15, happiness: 10 }, flags: { mature_teen: true }, result: '你和父母理性沟通,赢得了更多信任!' },
      { text: '适度反抗', effects: { charm: 8, happiness: 5, social: -5 }, flags: { normal_rebel: true }, result: '你适度表达不满,争取更多空间。' },
      { text: '激烈对抗', effects: { happiness: -10, social: -15, charm: -8 }, flags: { rebel: true }, result: '你和父母关系变得很紧张...' }
    ]
  },
  {
    id: 'life_identity',
    year: null,
    category: 'life',
    trigger: { ageRange: [15, 23], gender: null },
    title: '自我认知',
    description: '你在思考自己到底想要什么样的生活。',
    choices: [
      { text: '积极探索', effects: { education: 20, charm: 15, happiness: 12 }, flags: { explorer: true }, result: '你尝试各种事物,寻找自己的方向!' },
      { text: '咨询前辈', effects: { social: 15, education: 15 }, flags: { learner: true }, result: '你向有经验的人请教,获得很多启发。' },
      { text: '顺其自然', effects: { happiness: 10, luck: 15 }, flags: { go_with_flow: true }, result: '你选择顺其自然,相信时间会给出答案。' }
    ]
  },
  {
    id: 'life_first_crush',
    year: null,
    category: 'life',
    trigger: { ageRange: [11, 18], gender: null },
    title: '早恋问题',
    description: '你对异性产生了好感,不知道该怎么处理。',
    choices: [
      { text: '勇敢表达', effects: { charm: 15, happiness: 15, social: 10 }, flags: { brave_lover: true }, result: '你表达了心意,不管结果如何都很勇敢!' },
      { text: '埋藏心底', effects: { education: 12, happiness: -5 }, flags: { secret_lover: true }, result: '你把这份美好藏在心底,成为青春秘密。' },
      { text: '专注学习', effects: { education: 18, health: 8 }, flags: { focused_student: true }, result: '你选择专注于学业,把感情化为动力。' }
    ]
  },

  // 生活细节类
  {
    id: 'life_fashion',
    year: null,
    category: 'life',
    trigger: { ageRange: [14, 35], gender: null },
    title: '服装风格',
    description: '你想改变自己的穿衣风格,塑造新形象。',
    choices: [
      { text: '大胆尝试', effects: { charm: 20, happiness: 18, wealth: -15 }, flags: { fashion_forward: true }, result: '你尝试了全新的风格,反响不错!' },
      { text: '逐步改变', effects: { charm: 12, happiness: 12, wealth: -8 }, flags: { style_evolver: true }, result: '你慢慢调整风格,找到适合自己的。' },
      { text: '保持原样', effects: { happiness: 8, wealth: 5 }, flags: { authentic: true }, result: '你觉得现在的自己就很好,保持原样。' }
    ]
  },
  {
    id: 'life_haircut',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 40], gender: null },
    title: '发型改变',
    description: '你想要换个发型,改变心情。',
    choices: [
      { text: '大改变', effects: { charm: 18, happiness: 20, wealth: -10 }, flags: { bold_changer: true }, result: '你剪了个完全不同的发型,焕然一新!' },
      { text: '小调整', effects: { charm: 10, happiness: 12, wealth: -5 }, result: '你稍微调整一下发型,清爽多了。' },
      { text: '保持原样', effects: { happiness: 5 }, flags: { consistent: true }, result: '你决定不改变,保持熟悉的自己。' }
    ]
  },
  {
    id: 'life_pet',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 45], gender: null },
    title: '养宠物',
    description: '你想养只宠物陪伴自己。',
    choices: [
      { text: '养狗狗', effects: { happiness: 25, health: 15, charm: 10, wealth: -20 }, flags: { dog_owner: true }, result: '你养了只狗狗,每天遛狗很开心!' },
      { text: '养猫咪', effects: { happiness: 20, charm: 12, wealth: -15 }, flags: { cat_owner: true }, result: '你养了只猫咪,享受治愈时光!' },
      { text: '暂时不养', effects: { wealth: 10, education: 8 }, flags: { responsible: true }, result: '你觉得自己还没准备好,暂时不养。' }
    ]
  },
  {
    id: 'life_coffee',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 45], gender: null },
    title: '咖啡习惯',
    description: '工作/学习需要提神,你开始喝咖啡。',
    choices: [
      { text: '每天喝', effects: { education: 15, tech_skill: 10, health: -8, wealth: -10 }, flags: { coffee_addict: true }, result: '你每天喝咖啡续命,成了咖啡依赖者!' },
      { text: '适量喝', effects: { education: 12, health: 5, wealth: -5 }, flags: { moderate_drinker: true }, result: '你适量喝咖啡,提神又不影响健康。' },
      { text: '喝茶代替', effects: { health: 12, charm: 10, wealth: -5 }, flags: { tea_lover: true }, result: '你选择喝茶,更健康也更有文化!' }
    ]
  },

  // 职场发展类
  {
    id: 'life_colleagues',
    year: null,
    category: 'life',
    trigger: { ageRange: [22, 45], gender: null },
    title: '同事关系',
    description: '你想和同事建立更好的关系。',
    choices: [
      { text: '主动交流', effects: { social: 18, happiness: 15, charm: 12 }, flags: { friendly_colleague: true }, result: '你主动和同事交流,关系变得更融洽!' },
      { text: '保持距离', effects: { education: 10, health: 8 }, flags: { professional: true }, result: '你保持专业距离,公事公办。' },
      { text: '专注工作', effects: { education: 15, wealth: 12 }, flags: { work_focused: true }, result: '你专注于工作本身,不搞人际关系。' }
    ]
  },
  {
    id: 'life_side_hustle',
    year: null,
    category: 'life',
    trigger: { ageRange: [22, 40], gender: null },
    title: '副业收入',
    description: '你想做个副业,增加收入来源。',
    choices: [
      { text: '全力投入', effects: { wealth: 25, health: -12, happiness: -8 }, flags: { side_hustler: true }, result: '你利用业余时间做副业,收入增加了!' },
      { text: '适度尝试', effects: { wealth: 15, happiness: 10, education: 10 }, flags: { balanced_hustler: true }, result: '你适度尝试副业,不影响主业。' },
      { text: '暂时不考虑', effects: { health: 10, happiness: 8 }, flags: { focused_main: true }, result: '你选择专注主业,先不分散精力。' }
    ]
  },
  {
    id: 'life_mentor',
    year: null,
    category: 'life',
    trigger: { ageRange: [22, 42], gender: null },
    title: '寻找导师',
    description: '你想找个职场导师指导自己。',
    choices: [
      { text: '主动请教', effects: { education: 25, social: 15, charm: 12 }, flags: { mentee: true }, result: '你找到了导师,学到了很多职场智慧!' },
      { text: '观察学习', effects: { education: 18, charm: 10 }, flags: { observer: true }, result: '你默默观察优秀的人,从中学习。' },
      { text: '自我摸索', effects: { education: 12, tech_skill: 15 }, flags: { self_learner: true }, result: '你选择自己摸索,积累经验。' }
    ]
  },
  {
    id: 'life_workplace_conflict',
    year: null,
    category: 'life',
    trigger: { ageRange: [22, 45], gender: null },
    title: '工作矛盾',
    description: '你与同事/领导产生了工作分歧。',
    choices: [
      { text: '理性沟通', effects: { social: 15, charm: 18, education: 10 }, flags: { professional: true }, result: '你理性沟通,问题得到解决!' },
      { text: '据理力争', effects: { charm: 10, happiness: 5, social: -8 }, flags: { fighter: true }, result: '你坚持自己的立场,虽然有些争执。' },
      { text: '妥协让步', effects: { social: 8, happiness: -5 }, flags: { peacemaker: true }, result: '你选择妥协,维持和谐关系。' }
    ]
  },

  // 生活品质类
  {
    id: 'life_home_decor',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 65], gender: null },
    title: '家居装修',
    description: '你想改善居住环境,装修一下房间。',
    choices: [
      { text: '精装', effects: { happiness: 25, charm: 18, wealth: -30 }, flags: { luxury_liver: true }, result: '你精心装修,住得很舒服!' },
      { text: '简装', effects: { happiness: 15, wealth: -15 }, flags: { practical_liver: true }, result: '你简单装修,够用就好。' },
      { text: 'DIY改造', effects: { happiness: 18, charm: 12, tech_skill: 15, wealth: -10 }, flags: { diy_lover: true }, result: '你自己动手改造,更有成就感!' }
    ]
  },
  {
    id: 'life_morning_routine',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 80], gender: null },
    title: '早晨习惯',
    description: '你想培养更好的早晨习惯,开始美好一天。',
    choices: [
      { text: '早起运动', effects: { health: 20, happiness: 15, charm: 10 }, flags: { morning_exerciser: true }, result: '你每天早起运动,精力充沛!' },
      { text: '早餐时光', effects: { health: 15, happiness: 12, wealth: -5 }, flags: { breakfast_lover: true }, result: '你享受早餐时光,营养又健康!' },
      { text: '自然醒', effects: { happiness: 18, health: 8 }, flags: { easy_morning: true }, result: '你选择自然醒,睡到饱再开始一天!' }
    ]
  },
  {
    id: 'life_digital_cleanup',
    year: null,
    category: 'life',
    trigger: { ageRange: [15, 45], gender: null },
    title: '数字清理',
    description: '你的电脑和手机文件很乱,需要整理。',
    choices: [
      { text: '彻底整理', effects: { education: 20, tech_skill: 15, happiness: 10 }, flags: { organized: true }, result: '你花时间彻底整理,清爽多了!' },
      { text: '简单分类', effects: { education: 10, happiness: 8 }, flags: { tidier: true }, result: '你做了简单分类,比之前好多了。' },
      { text: '懒得整理', effects: { happiness: 5, tech_skill: -5 }, flags: { messy: true }, result: '你懒得整理,继续在混乱中找东西...' }
    ]
  },
  {
    id: 'life_book_collection',
    year: null,
    category: 'life',
    trigger: { ageRange: [10, 45], gender: null },
    title: '藏书整理',
    description: '你的书很多很乱,需要整理书架。',
    choices: [
      { text: '认真分类', effects: { education: 18, charm: 12, happiness: 12 }, flags: { book_lover: true }, result: '你认真分类整理,找书方便多了!' },
      { text: '大致整理', effects: { education: 10, happiness: 8 }, result: '你大致整理了一下,比之前好。' },
      { text: '保持原样', effects: { happiness: 5 }, flags: { chaotically_minded: true }, result: '你觉得这种混乱也有其美感...' }
    ]
  },

  // 社会参与类
  {
    id: 'life_community_service',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 50], gender: null },
    title: '社区服务',
    description: '社区招募志愿者,为邻里服务。',
    choices: [
      { text: '积极报名', effects: { social: 20, happiness: 18, charm: 15 }, flags: { community_leader: true }, result: '你积极参与社区活动,认识了很多好邻居!' },
      { text: '偶尔参与', effects: { social: 12, happiness: 10 }, flags: { community_member: true }, result: '你偶尔参与社区活动。' },
      { text: '太忙了', effects: { education: 10, wealth: 8 }, flags: { busy_professional: true }, result: '你太忙了,暂时没时间参与。' }
    ]
  },
  {
    id: 'life_charity',
    year: null,
    category: 'life',
    trigger: { ageRange: [15, 50], gender: null },
    title: '慈善捐赠',
    description: '有慈善机构募捐,你考虑捐款。',
    choices: [
      { text: '慷慨解囊', effects: { charm: 20, happiness: 20, wealth: -15 }, flags: { philanthropist: true }, result: '你慷慨捐款,帮助需要的人!' },
      { text: '适度捐赠', effects: { charm: 12, happiness: 12, wealth: -8 }, flags: { kind_giver: true }, result: '你量力而行,适度捐赠。' },
      { text: '暂不捐赠', effects: { wealth: 10 }, flags: { practical: true }, result: '你选择先照顾好自己,以后有能力再捐。' }
    ]
  },
  {
    id: 'life_environmental',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 50], gender: null },
    title: '环保行动',
    description: '你考虑为环保做点贡献。',
    choices: [
      { text: '绿色出行', effects: { health: 15, charm: 12, happiness: 10 }, flags: { environmentalist: true }, result: '你选择步行或骑车,既环保又健康!' },
      { text: '垃圾分类', effects: { charm: 10, happiness: 8 }, flags: { eco_friendly: true }, result: '你坚持垃圾分类,为环保做贡献。' },
      { text: '适度参与', effects: { happiness: 6 }, result: '你适度参与环保,不强求。' }
    ]
  },
  {
    id: 'life_public_opinion',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 50], gender: null },
    title: '网络发言',
    description: '网上有热点话题,你该不该发表意见?',
    choices: [
      { text: '理性发声', effects: { charm: 15, social: 12, education: 10 }, flags: { rational_voice: true }, result: '你理性发表观点,获得赞同!' },
      { text: '默默关注', effects: { education: 8 }, flags: { observer: true }, result: '你选择只看不发表,保持低调。' },
      { text: '情绪发言', effects: { social: 10, charm: -10, happiness: 5 }, flags: { emotional_poster: true }, result: '你情绪化发言,引发了争论...' }
    ]
  },

  // 特殊情境类
  {
    id: 'life_lucky_break',
    year: null,
    category: 'life',
    trigger: { ageRange: [15, 45], gender: null },
    title: '意外好运',
    description: '你遇到了一件很幸运的事!',
    choices: [
      { text: '珍惜幸运', effects: { happiness: 25, charm: 15, luck: 20 }, flags: { grateful: true }, result: '你很感激这份幸运,珍惜机会!' },
      { text: '分享幸运', effects: { social: 20, happiness: 20, charm: 12 }, flags: { generous: true }, result: '你把幸运分享给朋友,大家都开心!' },
      { text: '理所当然', effects: { charm: -8, luck: -10 }, flags: { entitled: true }, result: '你觉得自己配得上好运,没什么特别感谢。' }
    ]
  },
  {
    id: 'life_bad_day',
    year: null,
    category: 'life',
    trigger: { ageRange: [10, 50], gender: null },
    title: '倒霉一天',
    description: '今天什么都赶不上,诸事不顺...',
    choices: [
      { text: '积极调整', effects: { happiness: 15, charm: 10, health: 8 }, flags: { optimistic: true }, result: '你调整心态,明天会更好!' },
      { text: '发泄情绪', effects: { happiness: 10, social: 8 }, flags: { emotional_releaser: true }, result: '你找朋友倾诉,发泄完感觉好多了!' },
      { text: '自怨自艾', effects: { happiness: -15, charm: -10 }, flags: { pessimistic: true }, result: '你觉得自己太倒霉了,心情很低落...' }
    ]
  },
  {
    id: 'life_serendipity',
    year: null,
    category: 'life',
    trigger: { ageRange: [16, 45], gender: null },
    title: '意外邂逅',
    description: '你在意想不到的场合遇到了特别的人。',
    choices: [
      { text: '主动结识', effects: { social: 20, charm: 18, happiness: 15 }, flags: { connector: true }, result: '你主动结识,开启了新的缘分!' },
      { text: '等待缘分', effects: { happiness: 10, luck: 15 }, flags: { patient_romantic: true }, result: '你选择等待,看缘分是否会延续。' },
      { text: '擦肩而过', effects: { happiness: 5 }, flags: { missed_connection: true }, result: '你们只是短暂相遇,然后各奔东西。' }
    ]
  },
  {
    id: 'life_crossroads',
    year: null,
    category: 'life',
    trigger: { ageRange: [20, 40], gender: null },
    title: '人生路口',
    description: '你站在人生的十字路口,需要选择方向。',
    choices: [
      { text: '勇敢探索', effects: { happiness: 20, charm: 15, wealth: -10 }, flags: { explorer: true }, result: '你选择探索未知,开启新的人生篇章!' },
      { text: '稳步前进', effects: { education: 15, wealth: 10, happiness: 8 }, flags: { steady_path: true }, result: '你选择稳健的道路,踏实前进。' },
      { text: '寻求指引', effects: { social: 15, education: 12 }, flags: { guidance_seeker: true }, result: '你寻求他人的建议,帮助自己做决定。' }
    ]
  },

  // 数字生活类
  {
    id: 'life_password_security',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 50], gender: null },
    title: '密码安全',
    description: '你意识到需要加强账号安全。',
    choices: [
      { text: '设置强密码', effects: { tech_skill: 15, education: 10, happiness: 8 }, flags: { security_conscious: true }, result: '你设置了复杂密码,账号更安全了!' },
      { text: '使用管理器', effects: { tech_skill: 20, education: 15 }, flags: { tech_savvy: true }, result: '你使用密码管理器,既安全又方便!' },
      { text: '简单密码', effects: { luck: -10 }, flags: { risk_taker: true }, result: '你继续使用简单密码,希望不会出问题...' }
    ]
  },
  {
    id: 'life_cloud_backup',
    year: null,
    category: 'life',
    trigger: { ageRange: [15, 50], gender: null },
    title: '数据备份',
    description: '你的照片文件很重要,需要备份。',
    choices: [
      { text: '云备份', effects: { tech_skill: 15, education: 10, wealth: -10 }, flags: { cloud_user: true }, result: '你使用了云备份,数据很安全!' },
      { text: '硬盘备份', effects: { tech_skill: 12, wealth: -15 }, flags: { local_backer: true }, result: '你买了硬盘备份,更加安心!' },
      { text: '暂不备份', effects: { wealth: 10, luck: -15 }, flags: { risk_taker: true }, result: '你暂时不备份,希望不会出问题...' }
    ]
  },
  {
    id: 'life_online_shopping',
    year: null,
    category: 'life',
    trigger: { ageRange: [16, 50], gender: null },
    title: '网购习惯',
    description: '网购很方便,但你发现自己买太多了。',
    choices: [
      { text: '控制欲望', effects: { wealth: 20, education: 15, happiness: -5 }, flags: { disciplined_shopper: true }, result: '你开始控制购物冲动,省钱了!' },
      { text: '适度购物', effects: { happiness: 12, charm: 10, wealth: -10 }, flags: { balanced_shopper: true }, result: '你适度购物,满足自己又不浪费。' },
      { text: '继续买买', effects: { happiness: 20, wealth: -25, charm: 8 }, flags: { shopaholic: true }, result: '你控制不住买买买,钱包空了...' }
    ]
  },
  {
    id: 'life_email_management',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 50], gender: null },
    title: '邮件管理',
    description: '你的邮件堆积如山,需要处理。',
    choices: [
      { text: '认真整理', effects: { education: 20, tech_skill: 15, happiness: 10 }, flags: { organized: true }, result: '你认真分类整理,效率提高了!' },
      { text: '简单清理', effects: { education: 10, happiness: 8 }, result: '你删除了垃圾邮件,清爽多了!' },
      { text: '随它去', effects: { happiness: 5 }, flags: { chaotic_email: true }, result: '你选择不管,继续在邮件海洋中游泳...' }
    ]
  },

  // 心理情感类
  {
    id: 'life_stress_relief',
    year: null,
    category: 'life',
    trigger: { ageRange: [16, 50], gender: null },
    title: '减压方式',
    description: '你压力很大,需要找到合适的减压方式。',
    choices: [
      { text: '运动减压', effects: { health: 20, happiness: 15, charm: 10 }, flags: { active_reliever: true }, result: '你通过运动释放压力,身心舒畅!' },
      { text: '娱乐放松', effects: { happiness: 18, tech_skill: 10, health: -5 }, flags: { entertainment_reliever: true }, result: '你通过游戏影视放松自己。' },
      { text: '冥想放松', effects: { health: 15, charm: 12, education: 10 }, flags: { mindful_relaxer: true }, result: '你学习冥想,内心平静了很多!' }
    ]
  },
  {
    id: 'life_self_acceptance',
    year: null,
    category: 'life',
    trigger: { ageRange: [15, 45], gender: null },
    title: '自我接纳',
    description: '你对自己有些不满意,需要学会接纳自己。',
    choices: [
      { text: '积极改变', effects: { charm: 18, education: 15, happiness: 12 }, flags: { self_improver: true }, result: '你努力改变自己,变得更好!' },
      { text: '接纳自己', effects: { charm: 20, happiness: 20 }, flags: { self_accepting: true }, result: '你学会接纳自己的不完美,更自信了!' },
      { text: '寻求帮助', effects: { social: 15, education: 15 }, flags: { help_seeker: true }, result: '你寻求专业帮助,学会更好地爱自己。' }
    ]
  },
  {
    id: 'life_fear_change',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 45], gender: null },
    title: '害怕改变',
    description: '你有改变的机会,但害怕未知的风险。',
    choices: [
      { text: '勇敢尝试', effects: { happiness: 20, charm: 15, wealth: 10 }, flags: { brave_changer: true }, result: '你勇敢尝试改变,打开新世界!' },
      { text: '逐步适应', effects: { education: 15, happiness: 12 }, flags: { cautious_changer: true }, result: '你慢慢适应改变,风险更小。' },
      { text: '保持现状', effects: { happiness: 8, wealth: 5 }, flags: { status_quo: true }, result: '你选择保持现状,安稳最重要。' }
    ]
  },
  {
    id: 'life_perfectionism',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 45], gender: null },
    title: '完美主义',
    description: '你对很多事情要求完美,让自己很累。',
    choices: [
      { text: '学会释怀', effects: { happiness: 20, health: 15, charm: 12 }, flags: { relaxed_perfectionist: true }, result: '你学会接受不完美,轻松多了!' },
      { text: '适当要求', effects: { education: 15, happiness: 10, charm: 8 }, flags: { balanced_perfectionist: true }, result: '你降低一些标准,找到平衡点。' },
      { text: '坚持完美', effects: { education: 20, happiness: -10, health: -10 }, flags: { strict_perfectionist: true }, result: '你继续追求完美,虽然累但成果更好...' }
    ]
  },

  // 季节节日类
  {
    id: 'life_holiday_plan',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 45], gender: null },
    title: '假期规划',
    description: '长假快到了,你打算怎么度过?',
    choices: [
      { text: '出门旅行', effects: { happiness: 25, charm: 15, education: 12, wealth: -20 }, flags: { traveler: true }, result: '你安排了旅行,期待假期的到来!' },
      { text: '回家陪伴', effects: { happiness: 20, social: 15, charm: 12 }, flags: { family_oriented: true }, result: '你选择回家陪伴家人,温馨又充实!' },
      { text: '宅家休息', effects: { health: 15, happiness: 15 }, flags: { homebody: true }, result: '你选择在家休息,享受悠闲时光!' }
    ]
  },
  {
    id: 'life_birthday',
    year: null,
    category: 'life',
    trigger: { ageRange: [5, 50], gender: null },
    title: '生日愿望',
    description: '今天是你的生日,你有什么愿望?',
    choices: [
      { text: '举办派对', effects: { happiness: 25, social: 20, charm: 15, wealth: -15 }, flags: { party_lover: true }, result: '你办了个热闹的生日派对,很开心!' },
      { text: '安静庆祝', effects: { happiness: 18, charm: 10 }, flags: { quiet_celebrator: true }, result: '你选择安静地度过,享受独处时光。' },
      { text: '和家人过', effects: { happiness: 20, social: 12 }, flags: { family_oriented: true }, result: '你和家人一起庆祝,温馨又难忘!' }
    ]
  },
  {
    id: 'life_new_year_countdown',
    year: null,
    category: 'life',
    trigger: { ageRange: [10, 50], gender: null },
    title: '跨年夜',
    description: '跨年夜到了,你想怎么度过?',
    choices: [
      { text: '参加活动', effects: { happiness: 22, social: 18, charm: 12, health: -5 }, flags: { party_goer: true }, result: '你参加了跨年活动,倒数超有仪式感!' },
      { text: '朋友聚会', effects: { happiness: 20, social: 15 }, flags: { social_butterfly: true }, result: '你和好朋友一起跨年,温暖又开心!' },
      { text: '在家休息', effects: { health: 12, happiness: 12 }, flags: { homebody: true }, result: '你在家里迎接新年,安静又舒适!' }
    ]
  },
  {
    id: 'life_valentine_day',
    year: null,
    category: 'life',
    trigger: { ageRange: [16, 45], gender: null },
    title: '情人节',
    description: '情人节到了,你打算怎么过?',
    choices: [
      { text: '浪漫约会', effects: { happiness: 25, charm: 20, social: 15, wealth: -15 }, flags: { romantic: true }, result: '你和伴侣度过浪漫的情人节!' },
      { text: '朋友聚会', effects: { happiness: 18, social: 15 }, flags: { single_celebrator: true }, result: '你和单身朋友一起聚,快乐又自在!' },
      { text: '平常一天', effects: { happiness: 8, education: 10 }, flags: { indifferent: true }, result: '你把它当平常一天过,没什么特别。' }
    ]
  },

  // 时尚购物类
  {
    id: 'life_seasonal_fashion',
    year: null,
    category: 'life',
    trigger: { ageRange: [14, 40], gender: null },
    title: '换季购物',
    description: '换季了,你需要买一些新衣服。',
    choices: [
      { text: '大采购', effects: { charm: 20, happiness: 20, wealth: -25 }, flags: { fashionista: true }, result: '你买了好多新衣服,焕然一新!' },
      { text: '精买几件', effects: { charm: 15, happiness: 15, wealth: -12 }, flags: { smart_shopper: true }, result: '你精心挑选了几件,质量又好!' },
      { text: '暂时不买', effects: { wealth: 10, happiness: -5 }, flags: { saver: true }, result: '你决定省钱,旧衣服还能穿。' }
    ]
  },
  {
    id: 'life_gift_choice',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 50], gender: null },
    title: '礼物选择',
    description: '朋友的生日快到了,你该送什么礼物?',
    choices: [
      { text: '精心准备', effects: { social: 20, charm: 18, happiness: 15, wealth: -15 }, flags: { thoughtful_giver: true }, result: '你精心准备了礼物,朋友很喜欢!' },
      { text: '实用为主', effects: { social: 15, wealth: -10 }, flags: { practical_giver: true }, result: '你送了实用的礼物,朋友觉得很好用。' },
      { text: '红包解决', effects: { social: 12, wealth: -12 }, flags: { money_giver: true }, result: '你直接发了红包,简单又实际。' }
    ]
  },
  {
    id: 'life_online_deal',
    year: null,
    category: 'life',
    trigger: { ageRange: [16, 50], gender: null },
    title: '网购优惠',
    description: '双11/618到了,各种优惠很诱人。',
    choices: [
      { text: '理性购物', effects: { wealth: -15, happiness: 15, education: 12 }, flags: { rational_shopper: true }, result: '你只买需要的,享受优惠!' },
      { text: '疯狂买买', effects: { happiness: 25, charm: 12, wealth: -40 }, flags: { shopaholic: true }, result: '你疯狂购物,钱包大出血...' },
      { text: '淡定旁观', effects: { wealth: 10, education: 10 }, flags: { immune_deal: true }, result: '你对促销免疫,不受影响。' }
    ]
  },
  {
    id: 'life_luxury_desire',
    year: null,
    category: 'life',
    trigger: { ageRange: [20, 45], gender: null },
    title: '奢侈品诱惑',
    description: '你很想要某个奢侈品,但价格不菲。',
    choices: [
      { text: '咬牙购买', effects: { charm: 18, happiness: 25, wealth: -35 }, flags: { luxury_lover: true }, result: '你终于买到了心仪的奢侈品,很开心!' },
      { text: '努力存钱', effects: { education: 15, wealth: 20, happiness: -5 }, flags: { patient_saver: true }, result: '你设定存钱目标,努力实现愿望!' },
      { text: '放弃念头', effects: { wealth: 10, happiness: -10 }, flags: { practical: true }, result: '你决定放弃,把钱用在更重要的地方。' }
    ]
  },

  // 美食类
  {
    id: 'life_food_adventure',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 50], gender: null },
    title: '美食探索',
    description: '你想尝试新的美食,探索味蕾。',
    choices: [
      { text: '大胆尝试', effects: { happiness: 22, charm: 15, wealth: -12, health: -5 }, flags: { foodie: true }, result: '你尝试了各种美食,发现了很多新喜欢!' },
      { text: '适度尝试', effects: { happiness: 15, charm: 10, wealth: -8 }, flags: { casual_foodie: true }, result: '你偶尔尝试新美食,享受美食乐趣!' },
      { text: '保持习惯', effects: { health: 10, happiness: 8 }, flags: { conservative_eater: true }, result: '你习惯自己的饮食,不太想改变。' }
    ]
  },
  {
    id: 'life_cooking_challenge',
    year: null,
    category: 'life',
    trigger: { ageRange: [15, 45], gender: null },
    title: '厨艺挑战',
    description: '你想挑战一道复杂的菜。',
    choices: [
      { text: '认真学习', effects: { charm: 20, happiness: 18, education: 12, wealth: -10 }, flags: { chef: true }, result: '你认真学做这道菜,成功了很有成就感!' },
      { text: '简单尝试', effects: { charm: 12, happiness: 12, wealth: -5 }, flags: { home_cook: true }, result: '你简单尝试了一下,味道还不错!' },
      { text: '吃外卖吧', effects: { happiness: 10, wealth: -8, health: -5 }, flags: { takeout_lover: true }, result: '你还是点外卖,享受别人的厨艺...' }
    ]
  },
  {
    id: 'life_diet_change',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 50], gender: null },
    title: '饮食调整',
    description: '你想改善饮食习惯,更健康地生活。',
    choices: [
      { text: '素食主义', effects: { health: 18, charm: 12, happiness: 8 }, flags: { vegetarian: true }, result: '你尝试素食,感觉身体更轻盈!' },
      { text: '健康饮食', effects: { health: 20, happiness: 12, wealth: -5 }, flags: { healthy_eater: true }, result: '你选择健康饮食,营养均衡又好吃!' },
      { text: '顺其自然', effects: { happiness: 10 }, flags: { easygoing_eater: true }, result: '你不想太刻意,顺其自然就好。' }
    ]
  },
  {
    id: 'life_social_dining',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 45], gender: null },
    title: '聚餐邀请',
    description: '朋友邀请你参加聚餐。',
    choices: [
      { text: '热情参加', effects: { happiness: 20, social: 18, charm: 12, health: -5, wealth: -15 }, flags: { social_butterfly: true }, result: '你参加聚餐,吃得开心聊得尽兴!' },
      { text: '偶尔参加', effects: { happiness: 15, social: 12, wealth: -10 }, flags: { social_joiner: true }, result: '你偶尔参加聚餐,保持适度社交。' },
      { text: '礼貌拒绝', effects: { health: 8, wealth: 5 }, flags: { introvert: true }, result: '你不太喜欢聚餐,礼貌拒绝了。' }
    ]
  },

  // 梦想抱负类
  {
    id: 'life_dream_job',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 40], gender: null },
    title: '梦想职业',
    description: '你有一个梦想的职业,但现实有差距。',
    choices: [
      { text: '勇敢追梦', effects: { happiness: 25, charm: 15, wealth: -20 }, flags: { dreamer: true }, result: '你勇敢追求梦想,虽然艰难但不后悔!' },
      { text: '现实妥协', effects: { wealth: 15, education: 10, happiness: -8 }, flags: { realist: true }, result: '你选择了现实的职业,梦想先放一放。' },
      { text: '业余追求', effects: { happiness: 18, charm: 12 }, flags: { hobbyist: true }, result: '你把梦想变成爱好,工作之余坚持。' }
    ]
  },
  {
    id: 'life_bucket_list',
    year: null,
    category: 'life',
    trigger: { ageRange: [16, 45], gender: null },
    title: '人生清单',
    description: '你想列出人生清单,完成想做的事。',
    choices: [
      { text: '制定清单', effects: { happiness: 20, education: 15, charm: 10 }, flags: { goal_setter: true }, result: '你列出了人生清单,逐个实现!' },
      { text: '心中有数', effects: { happiness: 12, education: 10 }, flags: { intuitive_planner: true }, result: '你心里有目标,不一定要写下来。' },
      { text: '随遇而安', effects: { happiness: 15, luck: 15 }, flags: { go_with_flow: true }, result: '你选择随遇而安,不给自己太大压力。' }
    ]
  },
  {
    id: 'life_legacy_thinking',
    year: null,
    category: 'life',
    trigger: { ageRange: [30, 50], gender: null },
    title: '人生意义',
    description: '你开始思考人生的意义和留下的遗产。',
    choices: [
      { text: '努力创造', effects: { education: 20, charm: 15, happiness: 15 }, flags: { legacy_builder: true }, result: '你努力创造价值,希望留下美好回忆!' },
      { text: '陪伴他人', effects: { social: 20, happiness: 20, charm: 12 }, flags: { helper: true }, result: '你选择陪伴帮助他人,这很有意义。' },
      { text: '活在当下', effects: { happiness: 25, health: 10 }, flags: { present_focused: true }, result: '你选择活在当下,享受每一天!' }
    ]
  },
  {
    id: 'life_life_review',
    year: null,
    category: 'life',
    trigger: { ageRange: [25, 50], gender: null },
    title: '人生回顾',
    description: '你回顾过去的人生,总结经验。',
    choices: [
      { text: '感恩经历', effects: { happiness: 25, charm: 18, education: 15 }, flags: { grateful: true }, result: '你感恩所有经历,让你成为今天的自己!' },
      { text: '总结教训', effects: { education: 20, charm: 12 }, flags: { learner: true }, result: '你总结失败教训,避免再犯同样错误。' },
      { text: '继续前进', effects: { happiness: 15, charm: 10 }, flags: { forward_looker: true }, result: '你选择不纠结过去,继续向前看!' }
    ]
  },

  // 最后20个事件
  {
    id: 'life_morning_coffee',
    year: null,
    category: 'life',
    trigger: { ageRange: [20, 50], gender: null },
    title: '早晨咖啡',
    description: '早晨咖啡时间,是你一天中最放松的时刻。',
    choices: [
      { text: '享受仪式', effects: { happiness: 15, charm: 10, wealth: -5 }, flags: { coffee_lover: true }, result: '你享受咖啡仪式,开启美好一天!' },
      { text: '快速解决', effects: { education: 10, happiness: 8 }, flags: { pragmatic: true }, result: '你快速喝完咖啡,开始工作。' },
      { text: '改喝茶了', effects: { health: 12, charm: 8 }, flags: { tea_drinker: true }, result: '你改喝茶养生,感觉也不错!' }
    ]
  },
  {
    id: 'life_weekend_plan',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 45], gender: null },
    title: '周末安排',
    description: '周末到了,你想怎么度过?',
    choices: [
      { text: '外出活动', effects: { happiness: 20, health: 15, social: 12, wealth: -10 }, flags: { active_weekender: true }, result: '你安排了丰富的活动,周末很充实!' },
      { text: '在家休息', effects: { health: 12, happiness: 15 }, flags: { homebody: true }, result: '你选择在家休息,享受慵懒周末!' },
      { text: '加班学习', effects: { education: 18, wealth: 12, happiness: -8 }, flags: { productive_weekender: true }, result: '你选择利用周末提升自己!' }
    ]
  },
  {
    id: 'life_news_consumption',
    year: null,
    category: 'life',
    trigger: { ageRange: [16, 50], gender: null },
    title: '新闻关注',
    description: '你想保持对时事的关注。',
    choices: [
      { text: '深度阅读', effects: { education: 20, charm: 15, happiness: 10 }, flags: { informed_citizen: true }, result: '你深度阅读新闻,见解更深刻!' },
      { text: '快速浏览', effects: { education: 12, happiness: 8 }, flags: { news_scanner: true }, result: '你快速浏览新闻标题,了解大概。' },
      { text: '选择性关注', effects: { education: 15, happiness: 12 }, flags: { selective_reader: true }, result: '你只关注感兴趣的领域,不强迫自己。' }
    ]
  },
  {
    id: 'life_alarm_clock',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 45], gender: null },
    title: '早起困难',
    description: '你总是起不来床,经常迟到。',
    choices: [
      { text: '养成习惯', effects: { health: 18, education: 15, happiness: 10 }, flags: { early_bird: true }, result: '你坚持早起,慢慢养成习惯!' },
      { text: '多个闹钟', effects: { health: 12, education: 10 }, flags: { snoozer: true }, result: '你设置多个闹钟,勉强能起床。' },
      { text: '调整时间', effects: { happiness: 12, luck: 10 }, flags: { flexible_scheduler: true }, result: '你调整作息时间,适应自己的节奏。' }
    ]
  },
  {
    id: 'life_desk_organization',
    year: null,
    category: 'life',
    trigger: { ageRange: [15, 50], gender: null },
    title: '整理桌面',
    description: '你的工作/学习桌很乱,需要整理。',
    choices: [
      { text: '彻底整理', effects: { education: 20, charm: 15, happiness: 12 }, flags: { organized: true }, result: '你彻底整理了桌面,效率提高了!' },
      { text: '简单清理', effects: { education: 12, happiness: 8 }, result: '你简单清理了桌面,比之前好多了。' },
      { text: '习惯了', effects: { happiness: 8 }, flags: { chaotic_worker: true }, result: '你习惯了这种"乱中有序"的状态...' }
    ]
  },
  {
    id: 'life_gift_wrapping',
    year: null,
    category: 'life',
    trigger: { ageRange: [10, 50], gender: null },
    title: '礼物包装',
    description: '你要送人礼物,想包装得精美些。',
    choices: [
      { text: '精心包装', effects: { charm: 18, happiness: 15, social: 12, wealth: -8 }, flags: { thoughtful_giver: true }, result: '你精心包装礼物,对方很惊喜!' },
      { text: '简单包装', effects: { charm: 10, social: 8 }, flags: { practical_giver: true }, result: '你简单包装了礼物,心意到了就好。' },
      { text: '直接送出', effects: { happiness: 10, social: 8 }, flags: { casual_giver: true }, result: '你直接送出礼物,不拘小节。' }
    ]
  },
  {
    id: 'life_weather_mood',
    year: null,
    category: 'life',
    trigger: { ageRange: [8, 50], gender: null },
    title: '天气影响',
    description: '阴雨连绵,你的心情也受影响了。',
    choices: [
      { text: '调整心态', effects: { happiness: 15, charm: 12 }, flags: { optimistic: true }, result: '你积极调整心态,不让天气影响心情!' },
      { text: '宅家享受', effects: { happiness: 12, health: 8 }, flags: { homebody: true }, result: '你选择在家享受雨天,也很惬意!' },
      { text: '受影响', effects: { happiness: -10 }, flags: { weather_sensitive: true }, result: '你的心情随天气变化,阴雨天有点低落...' }
    ]
  },
  {
    id: 'life_todo_list',
    year: null,
    category: 'life',
    trigger: { ageRange: [16, 50], gender: null },
    title: '待办清单',
    description: '你的待办事项越来越多,压力很大。',
    choices: [
      { text: '制定计划', effects: { education: 20, charm: 15, happiness: 10 }, flags: { planner: true }, result: '你制定了详细计划,逐一完成!' },
      { text: '优先处理', effects: { education: 15, happiness: 12 }, flags: { prioritizer: true }, result: '你按重要性处理,效率提高了!' },
      { text: '顺其自然', effects: { happiness: 10, luck: 10 }, flags: { easygoing: true }, result: '你选择顺其自然,不给自己太大压力。' }
    ]
  },
  {
    id: 'life_compliment',
    year: null,
    category: 'life',
    trigger: { ageRange: [10, 50], gender: null },
    title: '赞美他人',
    description: '你发现别人很优秀,想表达赞美。',
    choices: [
      { text: '真诚赞美', effects: { social: 20, charm: 18, happiness: 15 }, flags: { sincere_complimenter: true }, result: '你真诚赞美对方,友谊更深了!' },
      { text: '内心欣赏', effects: { education: 10, happiness: 10 }, flags: { inner_appreciator: true }, result: '你内心欣赏,但没有说出来。' },
      { text: '礼貌回应', effects: { social: 12, charm: 10 }, flags: { polite_person: true }, result: '你礼貌地表达认可,保持专业。' }
    ]
  },
  {
    id: 'life_compliment_received',
    year: null,
    category: 'life',
    trigger: { ageRange: [8, 50], gender: null },
    title: '接受赞美',
    description: '别人赞美了你,你该如何回应?',
    choices: [
      { text: '感谢接受', effects: { charm: 18, happiness: 18, social: 12 }, flags: { confident: true }, result: '你大方接受赞美,自信又得体!' },
      { text: '谦虚回应', effects: { charm: 12, social: 15 }, flags: { humble: true }, result: '你谦虚地回应,大家觉得你很低调。' },
      { text: '回馈赞美', effects: { social: 18, charm: 15, happiness: 15 }, flags: { reciprocal: true }, result: '你也赞美对方,互相欣赏,气氛很好!' }
    ]
  },
  {
    id: 'life_public_speaking_anxiety',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 40], gender: null },
    title: '发言紧张',
    description: '需要在众人面前发言,你很紧张。',
    choices: [
      { text: '充分准备', effects: { education: 20, charm: 18, happiness: 12 }, flags: { well_prepared: true }, result: '你准备充分,发言很成功!' },
      { text: '深呼吸放松', effects: { health: 15, charm: 12, happiness: 10 }, flags: { calm_responder: true }, result: '你深呼吸放松,慢慢克服紧张!' },
      { text: '寻求帮助', effects: { social: 15, education: 12 }, flags: { support_seeker: true }, result: '你向朋友请教应对方法,很有帮助!' }
    ]
  },
  {
    id: 'life_social_battery',
    year: null,
    category: 'life',
    trigger: { ageRange: [15, 50], gender: null },
    title: '社交电量',
    description: '你的社交电量快耗尽了,需要充电。',
    choices: [
      { text: '独处充电', effects: { happiness: 20, health: 15, charm: 10 }, flags: { introvert: true }, result: '你享受独处时光,慢慢恢复精力!' },
      { text: '找朋友充电', effects: { social: 18, happiness: 18, charm: 12 }, flags: { social_butterfly: true }, result: '你和亲密朋友相处,获得能量!' },
      { text: '强迫社交', effects: { happiness: -10, health: -8, social: 10 }, flags: { people_pleaser: true }, result: '你强迫自己社交,结果更累了...' }
    ]
  },
  {
    id: 'life_nostalgia',
    year: null,
    category: 'life',
    trigger: { ageRange: [20, 50], gender: null },
    title: '怀旧情绪',
    description: '你突然很怀念过去的时光。',
    choices: [
      { text: '联系老友', effects: { social: 20, happiness: 18, charm: 15 }, flags: { nostalgic_connector: true }, result: '你联系了老朋友,重温美好回忆!' },
      { text: '翻看旧物', effects: { happiness: 15, education: 10 }, flags: { memory_keeper: true }, result: '你翻看旧照片和物品,沉浸在回忆中。' },
      { text: '珍惜当下', effects: { happiness: 18, charm: 12 }, flags: { present_focused: true }, result: '你怀念过去,但更珍惜现在!' }
    ]
  },
  {
    id: 'life_skill_sharing',
    year: null,
    category: 'life',
    trigger: { ageRange: [15, 50], gender: null },
    title: '分享技能',
    description: '你有一项技能,想分享给别人。',
    choices: [
      { text: '热情教学', effects: { social: 20, charm: 18, happiness: 18, education: 15 }, flags: { mentor: true }, result: '你热情教别人,自己也很有成就感!' },
      { text: '适度分享', effects: { social: 12, happiness: 12, education: 10 }, flags: { helper: true }, result: '你适度分享知识,帮助有需要的人。' },
      { text: '保持低调', effects: { education: 12 }, flags: { humble_expert: true }, result: '你选择低调,别人问才分享。' }
    ]
  },
  {
    id: 'life_weather_preparation',
    year: null,
    category: 'life',
    trigger: { ageRange: [12, 50], gender: null },
    title: '天气变化',
    description: '天气转冷/转热,你该如何应对?',
    choices: [
      { text: '提前准备', effects: { health: 18, charm: 12, education: 10 }, flags: { prepared: true }, result: '你提前准备衣物,从容应对变化!' },
      { text: '随性调整', effects: { health: 12, happiness: 12 }, flags: { adaptable: true }, result: '你随天气变化调整,灵活应对!' },
      { text: '硬扛', effects: { health: -8, happiness: 8 }, flags: { tough_guy: true }, result: '你选择硬扛,虽然有点不舒服...' }
    ]
  },
  {
    id: 'life_dream_job_offer',
    year: null,
    category: 'life',
    trigger: { ageRange: [22, 40], gender: null },
    title: '理想工作',
    description: '你得到了梦想的工作机会!',
    choices: [
      { text: '欣然接受', effects: { happiness: 25, charm: 18, wealth: 20 }, flags: { dream_achiever: true }, result: '你接受了梦想工作,开启新篇章!' },
      { text: '谨慎考虑', effects: { education: 18, charm: 12, happiness: 10 }, flags: { thoughtful_decider: true }, result: '你仔细考虑,确保做出正确决定。' },
      { text: '婉拒机会', effects: { education: 15, wealth: 10, happiness: -10 }, flags: { practical: true }, result: '你权衡后婉拒了,虽然遗憾但觉得是对的。' }
    ]
  },
  {
    id: 'life_self_reflection',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 50], gender: null },
    title: '自我反思',
    description: '你花时间反思自己,想要成长。',
    choices: [
      { text: '深度思考', effects: { education: 25, charm: 18, happiness: 15 }, flags: { introspective: true }, result: '你深入反思自己,获得很多洞察!' },
      { text: '写日记', effects: { education: 15, happiness: 15, charm: 10 }, flags: { journaler: true }, result: '你通过写日记整理思绪,很治愈!' },
      { text: '和朋友聊', effects: { social: 18, happiness: 18, charm: 12 }, flags: { social_reflector: true }, result: '你和朋友深度交流,获得新的视角!' }
    ]
  },
  {
    id: 'life_small_treat',
    year: null,
    category: 'life',
    trigger: { ageRange: [15, 50], gender: null },
    title: '小奖励',
    description: '你完成了目标,想奖励自己。',
    choices: [
      { text: '物质奖励', effects: { happiness: 20, charm: 12, wealth: -15 }, flags: { material_rewarder: true }, result: '你买了心仪的东西奖励自己!' },
      { text: '体验奖励', effects: { happiness: 22, charm: 15, wealth: -10 }, flags: { experience_seeker: true }, result: '你选择体验式奖励,创造美好回忆!' },
      { text: '精神奖励', effects: { happiness: 18, education: 12 }, flags: { self_affirmer: true }, result: '你给自己精神鼓励,也很满足!' }
    ]
  },
  {
    id: 'life_random_act',
    year: null,
    category: 'life',
    trigger: { ageRange: [16, 50], gender: null },
    title: '善行',
    description: '你想做一件善事,帮助他人。',
    choices: [
      { text: '匿名帮助', effects: { happiness: 25, charm: 20, wealth: -10 }, flags: { secret_helper: true }, result: '你匿名帮助他人,内心温暖又满足!' },
      { text: '公开行善', effects: { social: 20, happiness: 18, charm: 15, wealth: -10 }, flags: { public_helper: true }, result: '你公开行善,带动更多人参与!' },
      { text: '日常善意', effects: { happiness: 15, charm: 12 }, flags: { everyday_kindness: true }, result: '你在日常生活中多行善意,积少成多!' }
    ]
  },
  {
    id: 'life_life_celebration',
    year: null,
    category: 'life',
    trigger: { ageRange: [18, 50], gender: null },
    title: '小小庆祝',
    description: '你想庆祝一个小小的成就。',
    choices: [
      { text: '邀请朋友', effects: { happiness: 22, social: 20, charm: 15, wealth: -15 }, flags: { celebrator: true }, result: '你和朋友一起庆祝,热闹又开心!' },
      { text: '家庭庆祝', effects: { happiness: 20, social: 15, charm: 12 }, flags: { family_oriented: true }, result: '你和家人一起庆祝,温馨又难忘!' },
      { text: '自我庆祝', effects: { happiness: 18, charm: 10 }, flags: { self_sufficient: true }, result: '你选择自我庆祝,犒劳努力的自己!' }
    ]
  }
];

module.exports = eventsData;
