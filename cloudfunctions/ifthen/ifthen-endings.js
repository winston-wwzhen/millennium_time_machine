// 结局数据 - 根据玩家最终属性和选择判定
const endingsData = [
  // ===== 特殊结局 =====
  {
    id: 'ending_tech_billionaire',
    title: '互联网大亨',
    description: '你抓住移动互联网的黄金十年，从微信小程序到AI，每次技术浪潮你都站在了风口。2025年，你的公司估值百亿，你成为了新时代的科技领袖。那些年熬夜写代码、学习新技术的日日夜夜，终于有了回报。',
    icon: '💻',
    type: 'special',
    typeText: '传奇结局',
    weight: 10,
    conditions: {
      ageRange: [30, 50],
      minAttributes: {
        tech_skill: 85,
        wealth: 80,
        education: 70
      },
      requireFlags: ['mini_program_developer', 'ai_adopter'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_influencer_celebrity',
    title: '顶级网红',
    description: '你从微博时代就开始做自媒体，抖音爆红后粉丝破千万。你不再只是网红，而是真正的明星。广告代言、综艺邀约不断，年收入破千万。你证明了内容创作者也可以有光明的未来。',
    icon: '⭐',
    type: 'special',
    typeText: '传奇结局',
    weight: 10,
    conditions: {
      ageRange: [25, 45],
      minAttributes: {
        social: 85,
        charm: 80,
        wealth: 70
      },
      requireFlags: ['weibo_influencer', 'tiktok_creator'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_qcio_founder',
    title: 'QCIO创始人',
    description: '你见证了QQ、微信、抖音的兴起，最终决定打造自己的产品。你创造的QCIO社交平台成为了Z世代的最爱，用户数超越微信。你成为了中国互联网的新传奇，人们说你是"小马哥"的接班人。',
    icon: '👑',
    type: 'special',
    typeText: '传奇结局',
    weight: 8,
    conditions: {
      ageRange: [28, 50],
      minAttributes: {
        tech_skill: 90,
        wealth: 85,
        social: 75,
        education: 80
      },
      requireFlags: ['wechat_early_user', 'product_manager_mindset'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_ai_pioneer',
    title: 'AI先驱',
    description: '当ChatGPT震惊世界时，你已经深耕AI领域多年。你的公司开发的AI应用改变了千万人的工作方式，你被誉为"中国AI第一人"。2030年，你的AI系统获得了图灵奖...',
    icon: '🤖',
    type: 'special',
    typeText: '传奇结局',
    weight: 8,
    conditions: {
      ageRange: [25, 45],
      minAttributes: {
        tech_skill: 95,
        education: 85,
        wealth: 75
      },
      requireFlags: ['ai_adopter'],
      excludeFlags: ['ai_anxiety']
    }
  },

  {
    id: 'ending_happy_family',
    title: '幸福家庭',
    description: '你拥有令人羡慕的家庭。配偶体贴，孩子优秀，父母健康。你明白，真正的成功不是赚多少钱，而是有温暖的家。每次回家看到家人的笑容，你都觉得这是最大的幸福。',
    icon: '🏠',
    type: 'special',
    typeText: '幸福结局',
    weight: 15,
    conditions: {
      ageRange: [28, 50],
      minAttributes: {
        happiness: 85,
        charm: 70,
        health: 70
      },
      requireFlags: ['in_relationship'],
      excludeFlags: ['workaholic', 'stock_crash_victim']
    }
  },

  // ===== 好结局 =====
  {
    id: 'ending_tech_expert',
    title: '技术专家',
    description: '你成为了某个技术领域的专家，年薪百万。同事们都称你为"大神"，你带的团队开发的产品改变了很多人的生活。虽然没有创业，但你对自己的职业很满意。',
    icon: '👨‍💻',
    type: 'good',
    typeText: '好结局',
    weight: 20,
    conditions: {
      ageRange: [25, 50],
      minAttributes: {
        tech_skill: 80,
        wealth: 70,
        education: 65
      },
      requireFlags: [],
      excludeFlags: []
    }
  },

  {
    id: 'ending_successful_manager',
    title: '成功高管',
    description: '你在职场上步步高升，最终成为一家大公司的高管。你管理着上百人的团队，年薪加上期权，早已实现财富自由。虽然经常加班，但你觉得一切都值得。',
    icon: '💼',
    type: 'good',
    typeText: '好结局',
    weight: 18,
    conditions: {
      ageRange: [28, 50],
      minAttributes: {
        wealth: 75,
        social: 70,
        education: 70
      },
      requireFlags: ['promoted'],
      excludeFlags: ['work_life_balance']
    }
  },

  {
    id: 'ending_freelancer',
    title: '自由职业者',
    description: '你厌倦了朝九晚五的生活，成为了自由职业者。设计师、程序员、咨询师...你用自己的技能赚钱，时间自由。虽然收入不稳定，但很享受这种生活方式。',
    icon: '🎨',
    type: 'good',
    typeText: '好结局',
    weight: 15,
    conditions: {
      ageRange: [25, 45],
      minAttributes: {
        happiness: 75,
        charm: 65,
        tech_skill: 60
      },
      requireFlags: ['job_hopper'],
      excludeFlags: ['workaholic']
    }
  },

  {
    id: 'ending_small_business_owner',
    title: '小店老板',
    description: '你开了一家小店，咖啡店、书店、服装店...生意不是特别火爆，但足够生活。你喜欢和客人聊天，喜欢这种慢节奏的生活。虽然不是大富大贵，但很满足。',
    icon: '🏪',
    type: 'good',
    typeText: '好结局',
    weight: 15,
    conditions: {
      ageRange: [25, 50],
      minAttributes: {
        happiness: 70,
        social: 65,
        wealth: 50
      },
      requireFlags: ['left_big_city'],
      excludeFlags: ['workaholic']
    }
  },

  {
    id: 'ending_content_creator',
    title: '内容创作者',
    description: '你成为了一名优秀的内容创作者。文字、视频、播客...你的作品影响了很多人。虽然收入不算顶尖，但能够靠创作养活自己，这已经是一种成功。',
    icon: '✍️',
    type: 'good',
    typeText: '好结局',
    weight: 15,
    conditions: {
      ageRange: [22, 45],
      minAttributes: {
        charm: 75,
        social: 70,
        happiness: 70
      },
      requireFlags: ['content_creator', 'tiktok_creator'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_educator',
    title: '教育工作者',
    description: '双减政策后，你转型成为了一名教育工作者。虽然收入不如以前，但能够教书育人，你感到很有意义。你的学生都很喜欢你，这让你觉得非常满足。',
    icon: '📚',
    type: 'good',
    typeText: '好结局',
    weight: 12,
    conditions: {
      ageRange: [25, 50],
      minAttributes: {
        charm: 70,
        education: 75,
        happiness: 70
      },
      requireFlags: ['edu_crisis'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_happy_retiree',
    title: '提前退休',
    description: '你很早就实现了财富自由，选择提前退休。每天睡到自然醒，种花养草，周游世界。朋友们都说你是人生赢家，你也确实觉得生活很美好。',
    icon: '🌴',
    type: 'good',
    typeText: '好结局',
    weight: 10,
    conditions: {
      ageRange: [35, 50],
      minAttributes: {
        wealth: 85,
        happiness: 80,
        health: 70
      },
      requireFlags: ['value_investor', 'market_timer'],
      excludeFlags: ['workaholic']
    }
  },

  {
    id: 'ending_community_leader',
    title: '社区领袖',
    description: '你在社区中很有影响力，经常组织各种活动。疫情期间你做志愿者，帮助了很多人。大家都认识你、尊重你。你不需要大富大贵，这种被需要的感觉就足够了。',
    icon: '🤝',
    type: 'good',
    typeText: '好结局',
    weight: 12,
    conditions: {
      ageRange: [28, 50],
      minAttributes: {
        social: 85,
        charm: 75,
        happiness: 75
      },
      requireFlags: ['community_volunteer'],
      excludeFlags: []
    }
  },

  // ===== 普通结局 =====
  {
    id: 'ending_ordinary_life',
    title: '平凡人生',
    description: '你的生活没有什么波澜壮阔，也没有什么特别的成就。上班下班，结婚生子，平平淡淡。但仔细想想，大多数人都是这样的，平凡也是一种幸福。',
    icon: '😊',
    type: 'normal',
    typeText: '普通结局',
    weight: 30,
    conditions: {
      ageRange: [25, 50],
      minAttributes: {
        happiness: 50
      },
      requireFlags: [],
      excludeFlags: []
    }
  },

  {
    id: 'ending_normal_worker',
    title: '普通打工人',
    description: '你每天都在上班下班，为生活奔波。工资不高，房贷车贷压力不小。但你没有放弃，相信努力就会有回报。也许有一天，你也能实现自己的梦想。',
    icon: '💪',
    type: 'normal',
    typeText: '普通结局',
    weight: 25,
    conditions: {
      ageRange: [25, 50],
      minAttributes: {
        wealth: 40,
        health: 50
      },
      requireFlags: [],
      excludeFlags: ['promoted', 'stay_in_big_city']
    }
  },

  {
    id: 'ending_return_home',
    title: '返乡青年',
    description: '在大城市打拼多年后，你选择回到家乡。虽然收入不如以前，但生活压力小了很多，有更多时间陪伴家人。你开始适应这种慢节奏的生活。',
    icon: '🏠',
    type: 'normal',
    typeText: '普通结局',
    weight: 20,
    conditions: {
      ageRange: [25, 50],
      minAttributes: {
        happiness: 55
      },
      requireFlags: ['left_big_city'],
      excludeFlags: ['stay_in_big_city']
    }
  },

  {
    id: 'ending_single_but_happy',
    title: '快乐的单身者',
    description: '你已经单身很多年了，但并不觉得遗憾。你有自己的兴趣爱好，有自己的事业，有好友相伴。结婚不是必须的，快乐才是最重要的。',
    icon: '🎉',
    type: 'normal',
    typeText: '普通结局',
    weight: 15,
    conditions: {
      ageRange: [28, 50],
      minAttributes: {
        happiness: 65,
        charm: 60
      },
      requireFlags: [],
      excludeFlags: ['in_relationship']
    }
  },

  {
    id: 'ending_second_life',
    title: '中年转行',
    description: '人到中年，你发现自己不喜欢现在的工作，于是选择了转行。虽然收入暂时下降，但你很开心能够追求自己的兴趣。人生没有太晚的开始。',
    icon: '🔄',
    type: 'normal',
    typeText: '普通结局',
    weight: 12,
    conditions: {
      ageRange: [35, 50],
      minAttributes: {
        happiness: 60,
        education: 55
      },
      requireFlags: ['job_hopper'],
      excludeFlags: []
    }
  },

  // ===== 差结局 =====
  {
    id: 'ending_workaholic_regret',
    title: '过劳',
    description: '你为了事业拼命工作，996成了家常便饭。最终，你的身体垮了，躺在病床上你才开始反思：健康和家人的陪伴，才是最重要的。可惜，你已经失去了很多。',
    icon: '🏥',
    type: 'bad',
    typeText: '坏结局',
    weight: 20,
    conditions: {
      ageRange: [28, 50],
      minAttributes: {
        wealth: 60
      },
      maxAttributes: {
        health: 40,
        happiness: 40
      },
      requireFlags: ['workaholic'],
      excludeFlags: ['health_conscious']
    }
  },

  {
    id: 'ending_stock_loss',
    title: '股灾受害者',
    description: '你在股市中损失惨重，不仅赔光了积蓄，还背上了债务。这些年你一直在努力还债，生活质量大幅下降。你终于明白，投资有风险，入市需谨慎。',
    icon: '📉',
    type: 'bad',
    typeText: '坏结局',
    weight: 18,
    conditions: {
      ageRange: [25, 50],
      maxAttributes: {
        wealth: 30,
        happiness: 35
      },
      requireFlags: ['stock_crash_victim', 'stock_investor'],
      excludeFlags: ['value_investor', 'rational_investor']
    }
  },

  {
    id: 'ending_lonely',
    title: '孤独终老',
    description: '你一直没有找到合适的伴侣，父母也相继离世。朋友们都忙于自己的家庭，你常常感到孤独。你开始后悔，当年是不是应该更主动一些...',
    icon: '😢',
    type: 'bad',
    typeText: '坏结局',
    weight: 15,
    conditions: {
      ageRange: [35, 50],
      maxAttributes: {
        happiness: 30,
        social: 40
      },
      requireFlags: ['missed_love'],
      excludeFlags: ['in_relationship', 'has_idol']
    }
  },

  {
    id: 'ending_health_crisis',
    title: '健康危机',
    description: '你年轻时忽视了健康，熬夜、不运动、饮食不规律。人到中年，各种疾病找上门来。你躺在病床上，才明白健康才是最大的财富。',
    icon: '⚠️',
    type: 'bad',
    typeText: '坏结局',
    weight: 20,
    conditions: {
      ageRange: [30, 50],
      maxAttributes: {
        health: 35,
        happiness: 40
      },
      requireFlags: ['health_neglected'],
      excludeFlags: ['health_conscious', 'safety_first']
    }
  },

  {
    id: 'ending_career_failure',
    title: '事业低谷',
    description: '你的事业一直不顺，多次失业、创业失败。现在的你做着一份不喜欢的工作，收入微薄。你开始怀疑自己，是不是真的不适合在这个社会生存。',
    icon: '💔',
    type: 'bad',
    typeText: '坏结局',
    weight: 15,
    conditions: {
      ageRange: [28, 50],
      maxAttributes: {
        wealth: 35,
        happiness: 35,
        social: 40
      },
      requireFlags: ['promotion_failed', 'edu_crisis'],
      excludeFlags: ['promoted', 'freelancer']
    }
  },

  {
    id: 'ending_addiction',
    title: '网瘾成疾',
    description: '你沉迷于网络游戏和短视频，虚拟世界成为了你的全部。现实中，你疏远了家人朋友，工作也丢了。你知道这样不对，但就是无法自拔。',
    icon: '🎮',
    type: 'bad',
    typeText: '坏结局',
    weight: 12,
    conditions: {
      ageRange: [20, 45],
      maxAttributes: {
        happiness: 30,
        health: 45,
        social: 35
      },
      requireFlags: ['tiktok_addict', 'civ_addict'],
      excludeFlags: ['digital_wellness']
    }
  },

  {
    id: 'ending_depression',
    title: '抑郁',
    description: '生活的压力、工作的不顺、感情的挫折...所有的负面情绪积累在一起，你患上了抑郁症。每天都在和内心的黑暗作斗争，希望有一天能够重见阳光。',
    icon: '🌑',
    type: 'bad',
    typeText: '坏结局',
    weight: 10,
    conditions: {
      ageRange: [25, 50],
      maxAttributes: {
        happiness: 25
      },
      requireFlags: ['life_regret', 'stock_crash_victim'],
      excludeFlags: ['life_satisfied', 'community_volunteer']
    }
  },

  // ===== 隐藏结局 =====
  {
    id: 'ending_time_traveler',
    title: '时间旅行者',
    description: '你以为自己在过2005-2025年的生活，但这其实是2025年的AI模拟。当你意识到这一点时，模拟结束了。你摘下VR头盔，回到了真正的2025年。这20年的"经历"，只是为了训练AI而创造的数据。',
    icon: '⏰',
    type: 'special',
    typeText: '隐藏结局',
    weight: 3,
    conditions: {
      ageRange: [15, 50],
      minAttributes: {
        tech_skill: 95,
        education: 90
      },
      requireFlags: ['ai_adopter', 'blockchain_developer', 'metaverse_developer'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_reborn',
    title: '重生者',
    description: '你突然惊醒，发现自己回到了2005年！原来这20年只是一场梦。但现在你拥有了未来的记忆——股市涨跌、房价走势、创业机会...这一世，你一定能改变命运！',
    icon: '🔄',
    type: 'special',
    typeText: '隐藏结局',
    weight: 3,
    conditions: {
      ageRange: [15, 50],
      minAttributes: {
        luck: 85
      },
      requireFlags: ['market_timer', 'life_optimist'],
      excludeFlags: ['stock_crash_victim']
    }
  },

  {
    id: 'ending_nft_billionaire',
    title: 'NFT暴发户',
    description: '你当年投资的那些"无用"NFT，在2030年突然暴涨百倍！你一夜之间成为了亿万富翁。虽然你自己都说不清这些虚拟图片到底有什么价值，但钱是真的。',
    icon: '🖼️',
    type: 'special',
    typeText: '隐藏结局',
    weight: 4,
    conditions: {
      ageRange: [25, 50],
      minAttributes: {
        luck: 90,
        wealth: 50
      },
      requireFlags: ['metaverse_investor'],
      excludeFlags: ['rational_spectator']
    }
  },

  {
    id: 'ending_aliens',
    title: '第三类接触',
    description: '2025年的一天，你被外星人选中了。他们告诉你，地球其实是一个实验场，而你是最优秀的实验样本。你被邀请前往外星文明，开始一段全新的旅程。再见，地球！',
    icon: '👽',
    type: 'special',
    typeText: '隐藏结局',
    weight: 2,
    conditions: {
      ageRange: [18, 50],
      minAttributes: {
        tech_skill: 80,
        education: 80,
        luck: 95
      },
      requireFlags: ['ar_enthusiast', 'ai_adopter'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_normal',
    title: '普通结局',
    description: '你的这20年平平淡淡，没有什么特别的成就，也没有什么大的遗憾。你就像大多数人一样，在时代的洪流中随波逐流，努力地活着。这也许就是人生的真相。',
    icon: '😌',
    type: 'normal',
    typeText: '默认结局',
    weight: 50,
    conditions: {
      ageRange: [20, 50],
      requireFlags: [],
      excludeFlags: []
    }
  },

  // ===== 更多好结局 =====
  {
    id: 'ending_famous_blogger',
    title: '知名博主',
    description: '你的博客/公众号拥有百万粉丝，每篇文章都有十万+阅读。你通过写作影响了很多人，也获得了不菲的广告收入。文字的力量，你深有体会。',
    icon: '📝',
    type: 'good',
    typeText: '好结局',
    weight: 18,
    conditions: {
      ageRange: [22, 45],
      minAttributes: {
        charm: 75,
        social: 75,
        happiness: 70
      },
      requireFlags: ['weibo_influencer'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_startup_success',
    title: '创业成功',
    description: '你的创业公司终于走上了正轨，B轮融资成功，估值过亿。虽然过程艰辛,差点熬不下去,但最终你坚持了下来。你的故事激励了很多创业者。',
    icon: '🚀',
    type: 'good',
    typeText: '好结局',
    weight: 16,
    conditions: {
      ageRange: [28, 50],
      minAttributes: {
        tech_skill: 80,
        wealth: 75,
        education: 70
      },
      requireFlags: ['startup_founder', 'side_hustler'],
      excludeFlags: ['project_abandoned']
    }
  },

  {
    id: 'ending_investor',
    title: '天使投资人',
    description: '你早年投资的朋友的公司成功上市,你获得了百倍回报。从此你转型做天使投资人,支持更多创业者的梦想。你的眼光很毒,投中了好几个独角兽。',
    icon: '💰',
    type: 'good',
    typeText: '好结局',
    weight: 15,
    conditions: {
      ageRange: [30, 50],
      minAttributes: {
        wealth: 85,
        education: 75
      },
      requireFlags: ['angel_investor', 'value_investor'],
      excludeFlags: ['stock_crash_victim']
    }
  },

  {
    id: 'ending_digital_nomad',
    title: '数字游民',
    description: '你成为一名数字游民,一边环游世界一边远程工作。这一年你在巴厘岛,下一年可能在欧洲。自由自在的生活,让你感到无比充实。',
    icon: '🌍',
    type: 'good',
    typeText: '好结局',
    weight: 14,
    conditions: {
      ageRange: [22, 40],
      minAttributes: {
        happiness: 80,
        tech_skill: 70,
        wealth: 60
      },
      requireFlags: ['remote_worker', 'adventure_seeker'],
      excludeFlags: ['workaholic']
    }
  },

  {
    id: 'ending_best_selling_author',
    title: '畅销书作家',
    description: '你写的书登上了畅销榜,销量破百万册。你的故事感动了无数读者,出版社为你举办了全国巡回签售。写作的梦想,你终于实现了。',
    icon: '📚',
    type: 'good',
    typeText: '好结局',
    weight: 14,
    conditions: {
      ageRange: [25, 50],
      minAttributes: {
        charm: 80,
        education: 80,
        happiness: 75
      },
      requireFlags: ['avid_reader', 'content_creator'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_yoga_master',
    title: '瑜伽大师',
    description: '你成为了知名的瑜伽教练,开班授课,学生遍布各地。你的身体状态比20岁时还好,内心的平静让你散发出特别的魅力。',
    icon: '🧘',
    type: 'good',
    typeText: '好结局',
    weight: 12,
    conditions: {
      ageRange: [25, 50],
      minAttributes: {
        health: 85,
        charm: 75,
        happiness: 80
      },
      requireFlags: ['yoga_practitioner', 'fitness_lifestyle'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_fitness_influencer',
    title: '健身达人',
    description: '你是健身圈的网红,拥有百万粉丝。你发布的健身视频帮助无数人改变了身材和生活方式。你的身材是你的招牌,自律是你的信仰。',
    icon: '💪',
    type: 'good',
    typeText: '好结局',
    weight: 13,
    conditions: {
      ageRange: [22, 40],
      minAttributes: {
        health: 90,
        charm: 80,
        social: 70
      },
      requireFlags: ['fitness_master', 'fitness_lifestyle', 'tiktok_creator'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_esports_champion',
    title: '电竞冠军',
    description: '你从游戏玩家成长为职业选手,最终在世界赛中夺冠。国旗升起的那一刻,你的泪水夺眶而出。所有的日夜训练,都值了。',
    icon: '🏆',
    type: 'good',
    typeText: '好结局',
    weight: 10,
    conditions: {
      ageRange: [18, 30],
      minAttributes: {
        tech_skill: 85,
        social: 70,
        happiness: 80
      },
      requireFlags: ['gamer', 'balanced_gamer'],
      excludeFlags: ['game_addict', 'hard_core_addict']
    }
  },

  {
    id: 'ending_professional_gamer',
    title: '职业选手',
    description: '你成为了一名电竞职业选手,虽然没能夺冠,但也是顶级联赛的主力选手。退役后转型做游戏主播,收入比职业时还高。',
    icon: '🎮',
    type: 'good',
    typeText: '好结局',
    weight: 12,
    conditions: {
      ageRange: [18, 30],
      minAttributes: {
        tech_skill: 75,
        social: 65,
        happiness: 70
      },
      requireFlags: ['gamer', 'streamer'],
      excludeFlags: ['game_addict']
    }
  },

  {
    id: 'ending_art_photographer',
    title: '艺术摄影师',
    description: '你的摄影作品在艺术圈小有名气,办过好几次个人展览。你用镜头记录世界的美好,每一张照片背后都有动人的故事。',
    icon: '📷',
    type: 'good',
    typeText: '好结局',
    weight: 12,
    conditions: {
      ageRange: [22, 45],
      minAttributes: {
        charm: 80,
        education: 70,
        happiness: 75
      },
      requireFlags: ['photography_interest', 'art_enthusiast'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_indie_developer',
    title: '独立开发者',
    description: '你开发的独立游戏/APP获得了意外成功,下载量破千万。你不用朝九晚五,靠着自己的作品就能养活自己,这是最自由的生活。',
    icon: '👨‍💻',
    type: 'good',
    typeText: '好结局',
    weight: 14,
    conditions: {
      ageRange: [22, 45],
      minAttributes: {
        tech_skill: 85,
        wealth: 65,
        happiness: 75
      },
      requireFlags: ['side_project_creator', 'project_success'],
      excludeFlags: ['project_abandoned']
    }
  },

  {
    id: 'ending_tech_leader',
    title: '技术领袖',
    description: '你在某个技术领域成为领军人物,发表的论文被引用数千次。各大会议都邀请你做主题演讲,你的观点影响着整个行业的发展方向。',
    icon: '🎓',
    type: 'good',
    typeText: '好结局',
    weight: 12,
    conditions: {
      ageRange: [28, 50],
      minAttributes: {
        tech_skill: 90,
        education: 90,
        social: 70
      },
      requireFlags: ['lifelong_learner', 'tech_savvy'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_online_teacher',
    title: '网课名师',
    description: '你在在线教育平台授课,累计学员超过十万。你的课程评分很高,学员们的感谢让你觉得这份工作特别有意义。',
    icon: '👨‍🏫',
    type: 'good',
    typeText: '好结局',
    weight: 14,
    conditions: {
      ageRange: [22, 45],
      minAttributes: {
        charm: 75,
        social: 70,
        happiness: 70
      },
      requireFlags: ['mentor', 'online_learner'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_craftsman',
    title: '手工艺大师',
    description: '你掌握了精湛的手工艺,木工、陶艺、编织...你的作品在市集上很受欢迎,甚至有人专门定制。你享受创作的过程,作品就是你的骄傲。',
    icon: '🎨',
    type: 'good',
    typeText: '好结局',
    weight: 12,
    conditions: {
      ageRange: [25, 50],
      minAttributes: {
        charm: 70,
        happiness: 75,
        health: 65
      },
      requireFlags: ['craftsman', 'hobby_expert'],
      excludeFlags: ['crafter_wannabe']
    }
  },

  {
    id: 'ending_musician',
    title: '独立音乐人',
    description: '你发行了自己的原创专辑,虽然不算大红,但也在小圈子内有了一定名气。能在舞台上唱自己的歌,这已经实现了你的梦想。',
    icon: '🎵',
    type: 'good',
    typeText: '好结局',
    weight: 12,
    conditions: {
      ageRange: [20, 40],
      minAttributes: {
        charm: 75,
        happiness: 75,
        social: 65
      },
      requireFlags: ['musician', 'music_lover'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_podcast_host',
    title: '播客主持人',
    description: '你主持的播客节目在细分领域颇有影响力,每期都有稳定的听众。你采访过行业大佬,也分享过自己的人生感悟。麦克风前,你找到了自己的舞台。',
    icon: '🎙️',
    type: 'good',
    typeText: '好结局',
    weight: 12,
    conditions: {
      ageRange: [22, 45],
      minAttributes: {
        charm: 75,
        social: 75,
        education: 70
      },
      requireFlags: ['podcast_listener', 'content_creator'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_book_club_founder',
    title: '读书会创始人',
    description: '你创办的读书会拥有数千会员,每月都有线下活动。你把阅读的快乐分享给更多人,也结识了很多志同道合的朋友。',
    icon: '📖',
    type: 'good',
    typeText: '好结局',
    weight: 10,
    conditions: {
      ageRange: [25, 50],
      minAttributes: {
        education: 80,
        social: 75,
        happiness: 70
      },
      requireFlags: ['book_club_member', 'avid_reader'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_minimalist',
    title: '极简主义者',
    description: '你践行极简主义生活,物质需求降到最低,内心却无比充实。你不需要太多东西就能过得很快乐,这种生活状态让很多人羡慕。',
    icon: '✨',
    type: 'good',
    typeText: '好结局',
    weight: 10,
    conditions: {
      ageRange: [25, 50],
      minAttributes: {
        happiness: 80,
        education: 65,
        wealth: 60
      },
      requireFlags: ['minimalist', 'decluttering'],
      excludeFlags: ['shopaholic']
    }
  },

  {
    id: 'ending_sustainable_life',
    title: '环保达人',
    description: '你过着零垃圾的生活方式,环保理念影响了身边很多人。你相信小小的改变汇聚起来就能改变世界,你的行动证明了这一点。',
    icon: '🌱',
    type: 'good',
    typeText: '好结局',
    weight: 10,
    conditions: {
      ageRange: [22, 45],
      minAttributes: {
        charm: 70,
        happiness: 75,
        health: 70
      },
      requireFlags: ['sustainable_liver'],
      excludeFlags: []
    }
  },

  // ===== 更多普通结局 =====
  {
    id: 'ending_senior_engineer',
    title: '资深工程师',
    description: '你在大厂做到了P8/P9级别,薪资丰厚,技术过硬。虽然没有创业,但在这个岗位上你受到了尊重,生活稳定富足。',
    icon: '👨‍💻',
    type: 'normal',
    typeText: '普通结局',
    weight: 22,
    conditions: {
      ageRange: [28, 50],
      minAttributes: {
        tech_skill: 75,
        wealth: 65,
        education: 65
      },
      requireFlags: ['tech_savvy'],
      excludeFlags: ['startup_founder']
    }
  },

  {
    id: 'ending_middle_manager',
    title: '中层管理',
    description: '你是公司的中层管理者,管着十几人的团队。工资还不错,但压力也不小。上有老板压着,下有员工管着,你夹在中间,这就是职场中层最真实的写照。',
    icon: '👔',
    type: 'normal',
    typeText: '普通结局',
    weight: 20,
    conditions: {
      ageRange: [28, 50],
      minAttributes: {
        social: 60,
        wealth: 55
      },
      requireFlags: ['promoted'],
      excludeFlags: ['high_performer']
    }
  },

  {
    id: 'ending_freelance_designer',
    title: '自由设计师',
    description: '你是一名自由设计师,接各种项目。收入不稳定,有时候忙得要死,有时候又闲得发慌。但自由就是最宝贵的,你不愿意被束缚。',
    icon: '🎨',
    type: 'normal',
    typeText: '普通结局',
    weight: 16,
    conditions: {
      ageRange: [22, 45],
      minAttributes: {
        charm: 65,
        happiness: 60
      },
      requireFlags: ['job_hopper', 'side_hustler'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_gig_worker',
    title: '零工经济',
    description: '你没有固定工作,做各种兼职赚钱。外卖、网约车、代驾...辛苦但不稳定。你总在想,要不要找份稳定的工作,但一直没有行动。',
    icon: '📦',
    type: 'normal',
    typeText: '普通结局',
    weight: 14,
    conditions: {
      ageRange: [22, 45],
      minAttributes: {
        health: 50,
        wealth: 40
      },
      requireFlags: ['side_hustler'],
      excludeFlags: ['promoted']
    }
  },

  {
    id: 'ending_civil_servant',
    title: '体制内',
    description: '你考公务员上岸了,工作稳定,福利好。虽然工资不算高,但胜在安稳。父母很满意,你也觉得这样的生活挺好。',
    icon: '🏛️',
    type: 'normal',
    typeText: '普通结局',
    weight: 16,
    conditions: {
      ageRange: [22, 45],
      minAttributes: {
        happiness: 60,
        education: 60
      },
      requireFlags: [],
      excludeFlags: ['entrepreneur', 'startup_founder']
    }
  },

  {
    id: 'ending_teaching',
    title: '教师',
    description: '你成为了一名人民教师,每天和学生们打交道。虽然工作累、工资不高,但桃李满天下,你感到很有成就感。',
    icon: '👨‍🏫',
    type: 'normal',
    typeText: '普通结局',
    weight: 14,
    conditions: {
      ageRange: [22, 50],
      minAttributes: {
        charm: 60,
        happiness: 60
      },
      requireFlags: [],
      excludeFlags: []
    }
  },

  {
    id: 'ending_medical_doctor',
    title: '医生',
    description: '你成为了一名医生,在公立医院工作。工作强度很大,经常值夜班,但救死扶伤让你觉得这份工作很有意义。',
    icon: '⚕️',
    type: 'normal',
    typeText: '普通结局',
    weight: 12,
    conditions: {
      ageRange: [25, 50],
      minAttributes: {
        education: 75,
        health: 55,
        happiness: 55
      },
      requireFlags: [],
      excludeFlags: []
    }
  },

  {
    id: 'ending_nurse',
    title: '护士',
    description: '你是一名护士,每天照顾病人。工作辛苦,经常要倒班,但看到病人康复出院,你还是很开心的。',
    icon: '🏥',
    type: 'normal',
    typeText: '普通结局',
    weight: 12,
    conditions: {
      ageRange: [22, 45],
      minAttributes: {
        charm: 65,
        health: 55,
        happiness: 55
      },
      requireFlags: [],
      excludeFlags: []
    }
  },

  {
    id: 'ending_accountant',
    title: '会计',
    description: '你在一家公司做会计,工作稳定,压力适中。每天和数字打交道,生活规律单调。你没什么特别的理想,就这样过着普通人的生活。',
    icon: '🧮',
    type: 'normal',
    typeText: '普通结局',
    weight: 14,
    conditions: {
      ageRange: [22, 50],
      minAttributes: {
        education: 60,
        wealth: 50
      },
      requireFlags: [],
      excludeFlags: ['workaholic']
    }
  },

  {
    id: 'ending_sales',
    title: '销售',
    description: '你是一名销售,业绩好的时候收入可观,业绩差的时候只能拿底薪。你每天都在为了业绩奔波,压力很大,但你已经习惯了。',
    icon: '📊',
    type: 'normal',
    typeText: '普通结局',
    weight: 14,
    conditions: {
      ageRange: [22, 45],
      minAttributes: {
        social: 65,
        wealth: 45
      },
      requireFlags: [],
      excludeFlags: []
    }
  },

  {
    id: 'ending_restaurant_owner',
    title: '餐饮老板',
    description: '你开了一家小餐厅,生意时好时坏。旺季忙得要命,淡季门可罗雀。你一直在坚持,希望有一天能做大做强。',
    icon: '🍜',
    type: 'normal',
    typeText: '普通结局',
    weight: 14,
    conditions: {
      ageRange: [25, 50],
      minAttributes: {
        health: 55,
        wealth: 45
      },
      requireFlags: ['left_big_city'],
      excludeFlags: ['business_owner']
    }
  },

  {
    id: 'ending_online_seller',
    title: '电商卖家',
    description: '你在淘宝/拼多多开店卖货,生意还过得去。每天要处理订单、客服、售后,忙得不可开交。收入不稳定,但至少是自己的小生意。',
    icon: '📦',
    type: 'normal',
    typeText: '普通结局',
    weight: 14,
    conditions: {
      ageRange: [22, 45],
      minAttributes: {
        tech_skill: 55,
        wealth: 45
      },
      requireFlags: [],
      excludeFlags: []
    }
  },

  {
    id: 'ending_delivery_rider',
    title: '外卖骑手',
    description: '你是一名外卖骑手,风雨无阻地送餐。辛苦但不稳定,还要面对差评和投诉。你总想换个工作,但一直没有更好的机会。',
    icon: '🛵',
    type: 'normal',
    typeText: '普通结局',
    weight: 12,
    conditions: {
      ageRange: [20, 40],
      minAttributes: {
        health: 55,
        wealth: 35
      },
      requireFlags: [],
      excludeFlags: ['promoted']
    }
  },

  {
    id: 'ending_factory_worker',
    title: '工人',
    description: '你在工厂上班,每天重复着机械的工作。工资不高,但好歹稳定。你没有什么特别的追求,就这样过着平凡的日子。',
    icon: '🏭️',
    type: 'normal',
    typeText: '普通结局',
    weight: 12,
    conditions: {
      ageRange: [22, 50],
      minAttributes: {
        health: 50,
        wealth: 40
      },
      requireFlags: [],
      excludeFlags: ['education > 70']
    }
  },

  {
    id: 'ending_fortune_teller',
    title: '算命先生',
    description: '你靠算命为生,在街边摆个小摊。生意时好时坏,偶尔有人来找你看八字、算塔罗。你其实不太信这些,但生活所迫,就当是心理安慰吧。',
    icon: '🔮',
    type: 'normal',
    typeText: '普通结局',
    weight: 10,
    conditions: {
      ageRange: [25, 50],
      minAttributes: {
        social: 55,
        wealth: 35
      },
      requireFlags: [],
      excludeFlags: ['education > 70']
    }
  },

  {
    id: 'ending_farm_owner',
    title: '新农人',
    description: '你回老家承包了土地,搞起了现代农业。虽然没有在城市赚得多,但空气好、生活节奏慢,你觉得这样也挺好。',
    icon: '🌾',
    type: 'normal',
    typeText: '普通结局',
    weight: 12,
    conditions: {
      ageRange: [25, 50],
      minAttributes: {
        health: 65,
        happiness: 60
      },
      requireFlags: ['left_big_city', 'return_home'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_homemaker',
    title: '家庭主妇/夫',
    description: '你选择回归家庭,全职照顾孩子和老人。虽然没有工作,但家里的事也很多。你把家庭打理得井井有条,家人都很感激你。',
    icon: '🏡',
    type: 'normal',
    typeText: '普通结局',
    weight: 12,
    conditions: {
      ageRange: [25, 45],
      minAttributes: {
        happiness: 60,
        social: 50
      },
      requireFlags: ['married', 'parent'],
      excludeFlags: ['workaholic', 'career_changer']
    }
  },

  {
    id: 'ending_divorced',
    title: '离婚',
    description: '你们的婚姻最终还是走到了尽头。虽然很痛苦,但你选择放手,重新开始。孩子抚养权的争夺让你筋疲力尽,但你相信未来会更好。',
    icon: '💔',
    type: 'normal',
    typeText: '普通结局',
    weight: 10,
    conditions: {
      ageRange: [28, 50],
      minAttributes: {
        happiness: 40
      },
      requireFlags: ['married', 'break_up'],
      excludeFlags: ['in_relationship']
    }
  },

  {
    id: 'ending_laid_off',
    title: '被裁员',
    description: '公司经营不善,你被裁员了。35岁重新找工作很难,你只能降薪入职。这次打击让你意识到,要提升自己的抗风险能力。',
    icon: '📉',
    type: 'normal',
    typeText: '普通结局',
    weight: 12,
    conditions: {
      ageRange: [30, 50],
      minAttributes: {
        wealth: 40
      },
      requireFlags: [],
      excludeFlags: ['promoted']
    }
  },

  {
    id: 'ending_neet',
    title: '啃老',
    description: '你一直没找到合适的工作,只能在家里靠父母养活。你也想独立,但每次尝试都以失败告终。你感到很无力,不知道未来在哪里。',
    icon: '😔',
    type: 'normal',
    typeText: '普通结局',
    weight: 10,
    conditions: {
      ageRange: [22, 35],
      maxAttributes: {
        wealth: 30,
        happiness: 40
      },
      requireFlags: [],
      excludeFlags: ['promoted', 'job_hopper']
    }
  },

  // ===== 更多坏结局 =====
  {
    id: 'ending_gambling_addiction',
    title: '赌博成瘾',
    description: '你沉迷赌博,输光了积蓄,还欠下高利贷。家人朋友都和你断绝了关系,你只能东躲西藏。你知道自己错了,但已经无法回头。',
    icon: '🎰',
    type: 'bad',
    typeText: '坏结局',
    weight: 12,
    conditions: {
      ageRange: [22, 50],
      maxAttributes: {
        wealth: 20,
        happiness: 25,
        social: 30
      },
      requireFlags: ['stock_investor'],
      excludeFlags: ['rational_spectator']
    }
  },

  {
    id: 'ending_permanent_single',
    title: '孤独一生',
    description: '你一直没有结婚,父母离世后,你彻底孤独了。朋友们都有自己的家庭,很少联系。你常常一个人发呆,不知道活着还有什么意义。',
    icon: '💔',
    type: 'bad',
    typeText: '坏结局',
    weight: 14,
    conditions: {
      ageRange: [40, 50],
      maxAttributes: {
        happiness: 25,
        social: 25
      },
      requireFlags: [],
      excludeFlags: ['in_relationship', 'married']
    }
  },

  {
    id: 'ending_midlife_crisis',
    title: '中年危机',
    description: '人到中年,你突然发现一事无成。事业不顺,家庭不睦,身体也开始出问题。你陷入深深的焦虑,不知道接下来的人生该怎么走。',
    icon: '😰',
    type: 'bad',
    typeText: '坏结局',
    weight: 15,
    conditions: {
      ageRange: [35, 50],
      maxAttributes: {
        happiness: 30,
        wealth: 40,
        social: 35
      },
      requireFlags: ['lost', 'regret'],
      excludeFlags: ['life_satisfied']
    }
  },

  {
    id: 'ending_bankruptcy',
    title: '破产',
    description: '你的创业失败了,不仅赔光了所有积蓄,还背上了巨额债务。你不得不卖房卖车,生活质量一落千丈。创业有风险,这句话你深有体会。',
    icon: '📉',
    type: 'bad',
    typeText: '坏结局',
    weight: 12,
    conditions: {
      ageRange: [25, 50],
      maxAttributes: {
        wealth: 25,
        happiness: 30
      },
      requireFlags: ['startup_founder', 'entrepreneur'],
      excludeFlags: ['business_owner']
    }
  },

  {
    id: 'ending_social_anxiety',
    title: '社交恐惧',
    description: '你的社交恐惧症越来越严重,最后几乎不出门。工作中也避免和同事交流,升职加薪都和你无缘。你很孤独,但不知道该怎么改变。',
    icon: '😷',
    type: 'bad',
    typeText: '坏结局',
    weight: 10,
    conditions: {
      ageRange: [20, 45],
      maxAttributes: {
        social: 30,
        happiness: 35
      },
      requireFlags: [],
      excludeFlags: ['social_butterfly', 'networker']
    }
  },

  {
    id: 'ending_obesity',
    title: '肥胖',
    description: '你不注意饮食,又不运动,体重一路飙升。各种疾病找上门,生活质量大幅下降。你意识到该减肥了,但已经很难减下去了。',
    icon: '🍔',
    type: 'bad',
    typeText: '坏结局',
    weight: 12,
    conditions: {
      ageRange: [25, 50],
      maxAttributes: {
        health: 35,
        happiness: 35,
        charm: 40
      },
      requireFlags: ['food_lover'],
      excludeFlags: ['fitness_master', 'gym_rat', 'health_conscious']
    }
  },

  {
    id: 'ending_scammed',
    title: '被骗',
    description: '你被电信诈骗骗光了积蓄。骗子的话术让你深信不疑,等反应过来时已经晚了。你很自责,但钱已经追不回来了。',
    icon: '😭',
    type: 'bad',
    typeText: '坏结局',
    weight: 10,
    conditions: {
      ageRange: [22, 50],
      maxAttributes: {
        wealth: 30,
        happiness: 35
      },
      requireFlags: [],
      excludeFlags: ['education > 70']
    }
  },

  {
    id: 'ending_job_hopping_too_much',
    title: '频繁跳槽',
    description: '你频繁跳槽,每份工作都不超过半年。HR看到你的简历都摇头,你越来越难找到工作。你意识到这样下去不行,但已经很难改变了。',
    icon: '🔄',
    type: 'bad',
    typeText: '坏结局',
    weight: 12,
    conditions: {
      ageRange: [25, 45],
      maxAttributes: {
        wealth: 35,
        social: 35
      },
      requireFlags: ['job_hopper'],
      excludeFlags: ['promoted']
    }
  },

  {
    id: 'ending_no_purpose',
    title: '虚度光阴',
    description: '你每天都刷短视频、玩游戏,时间不知不觉就过去了。你感觉自己一事无成,但又提不起劲改变。就这样混一天算一天,生命在虚度。',
    icon: '📱',
    type: 'bad',
    typeText: '坏结局',
    weight: 14,
    conditions: {
      ageRange: [22, 45],
      maxAttributes: {
        happiness: 35,
        education: 40,
        health: 40
      },
      requireFlags: ['tiktok_addict', 'civ_addict'],
      excludeFlags: ['digital_detox']
    }
  },

  {
    id: 'ending_family_conflict',
    title: '家庭矛盾',
    description: '你和家人的关系很糟糕,经常争吵。父母不理解你,你也不理解他们。虽然住在同一个屋檐下,但你们之间的距离很远。',
    icon: '💢',
    type: 'bad',
    typeText: '坏结局',
    weight: 10,
    conditions: {
      ageRange: [22, 50],
      maxAttributes: {
        happiness: 30,
        social: 35
      },
      requireFlags: ['family_conflict'],
      excludeFlags: ['filial', 'in_relationship']
    }
  },

  // ===== 更多隐藏结局 =====
  {
    id: 'ending_metaverse_ruler',
    title: '元宇宙领主',
    description: '你在元宇宙中建立了自己的王国,拥有数百万虚拟土地。当现实世界崩坏时,你的元宇宙成为了人类的避难所。你是新的上帝,统治着这个虚拟世界。',
    icon: '👑',
    type: 'special',
    typeText: '隐藏结局',
    weight: 3,
    conditions: {
      ageRange: [25, 50],
      minAttributes: {
        tech_skill: 95,
        luck: 90
      },
      requireFlags: ['metaverse_investor', 'metaverse_developer'],
      excludeFlags: ['bubble_skeptic']
    }
  },

  {
    id: 'ending_immortal',
    title: '长生者',
    description: '你参与了绝密的生命延续实验,意外获得了永生。你看着身边的人一个个老去、离世,自己却永远年轻。这是恩赐还是诅咒?你也不知道。',
    icon: '♾️',
    type: 'special',
    typeText: '隐藏结局',
    weight: 2,
    conditions: {
      ageRange: [40, 50],
      minAttributes: {
        health: 95,
        tech_skill: 90
      },
      requireFlags: ['ai_adopter'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_matrix',
    title: '矩阵觉醒',
    description: '你偶然发现了世界的真相:我们生活在虚拟矩阵中。你选择了红色药丸,看到了真实世界。现在你加入了反抗军,为人类的自由而战。',
    icon: '🕶️',
    type: 'special',
    typeText: '隐藏结局',
    weight: 2,
    conditions: {
      ageRange: [18, 50],
      minAttributes: {
        tech_skill: 95,
        education: 95
      },
      requireFlags: ['ai_adopter'],
      excludeFlags: []
    }
  },

  {
    id: 'ending_parallel_world',
    title: '平行世界',
    description: '你发现了一个平行世界的入口,那里有另一个你,过着完全不同的生活。你可以选择留在那边,开始一段新的人生。',
    icon: '🌀',
    type: 'special',
    typeText: '隐藏结局',
    weight: 2,
    conditions: {
      ageRange: [20, 50],
      minAttributes: {
        tech_skill: 85,
        luck: 90
      },
      requireFlags: [],
      excludeFlags: []
    }
  },

  {
    id: 'ending_ai_replacement',
    title: '被AI取代',
    description: '2030年,AI彻底取代了你的工作。你失去了收入来源,生活陷入困境。你曾经嘲笑那些担心AI的人,现在你成了他们中的一员。这是时代的悲哀。',
    icon: '🤖',
    type: 'special',
    typeText: '特殊结局',
    weight: 8,
    conditions: {
      ageRange: [25, 50],
      maxAttributes: {
        tech_skill: 50
      },
      requireFlags: ['ai_anxiety'],
      excludeFlags: ['ai_adopter']
    }
  },

  {
    id: 'ending_climate_refugee',
    title: '气候难民',
    description: '气候危机在2030年全面爆发,海平面上升,极端天气频发。你不得不离开家乡,成为气候难民。在难民营里,你后悔当年没有更重视环保。',
    icon: '🌊',
    type: 'special',
    typeText: '特殊结局',
    weight: 5,
    conditions: {
      ageRange: [25, 50],
      maxAttributes: {
        wealth: 40
      },
      requireFlags: [],
      excludeFlags: ['sustainable_liver', 'philanthropist']
    }
  },

  {
    id: 'ending_lottery_winner',
    title: '彩票中奖',
    description: '你中了5亿彩票大奖!一夜之间实现了财富自由。你辞掉了工作,买了豪宅豪车。但钱真的能带来快乐吗?你开始思考这个问题。',
    icon: '🎫',
    type: 'special',
    typeText: '特殊结局',
    weight: 3,
    conditions: {
      ageRange: [20, 50],
      minAttributes: {
        luck: 95
      },
      requireFlags: [],
      excludeFlags: []
    }
  },

  {
    id: 'ending_viral_star',
    title: '网红一夜',
    description: '你偶然拍的一条视频突然爆火,一夜之间粉丝千万。你成为了网红,广告代言接到手软。但你心里清楚,这种热度很难持续。',
    icon: '🌟',
    type: 'special',
    typeText: '特殊结局',
    weight: 5,
    conditions: {
      ageRange: [18, 40],
      minAttributes: {
        charm: 80,
        luck: 85
      },
      requireFlags: ['tiktok_creator'],
      excludeFlags: ['weibo_influencer']
    }
  },

  {
    id: 'ending_mars_colonist',
    title: '火星殖民',
    description: '2040年,人类在火星建立了第一个永久殖民地。你是第一批殖民者之一,在红色星球上开启了新的人生。地球已经是遥远的记忆。',
    icon: '🚀',
    type: 'special',
    typeText: '隐藏结局',
    weight: 2,
    conditions: {
      ageRange: [20, 40],
      minAttributes: {
        tech_skill: 95,
        health: 85,
        luck: 90
      },
      requireFlags: ['ai_adopter', 'ar_enthusiast'],
      excludeFlags: []
    }
  }
];

module.exports = endingsData;
