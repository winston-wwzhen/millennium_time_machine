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
  }
];

module.exports = endingsData;
