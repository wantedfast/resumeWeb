import portfolioZh from "./data/portfolio-zh.json";

const heroByLocale = {
  en: [
    {
      label: "IDENTITY",
      kicker: "WANG XINLONG / AI ENGINEER + RESEARCHER",
      titleLines: [
        "I build AI agents",
        "I study how they collaborate with humans",
      ],
      body: "Ph.D. candidate at Doshisha University researching AI agent systems, Human–AI collaboration, and open-source engineering.",
    },
    {
      label: "THE QUESTION",
      kicker: "FROM SYSTEMS TO RESEARCH",
      titleLines: [
        "After eight years of",
        "building production systems,",
        "I turned to AI research",
      ],
      body: "That engineering foundation now shapes how I build and study collaborative AI systems.",
    },
    {
      label: "PH.D. RESEARCH",
      kicker: "COVS / HUMAN–AI TEAMWORK",
      titleLines: [
        "How can agents coordinate",
        "with partners they have never met?",
      ],
      body: "COVS is a continuous-space Overcooked simulator for studying Human–AI teamwork and generalization to unseen partners.",
    },
    {
      label: "GLOBAL ENGINEERING",
      kicker: "OPEN SOURCE / GLOBAL TEAMS",
      titleLines: [
        "Building Azure SDKs",
        "with teams in China",
        "and the United States",
      ],
      body: "I contributed to Microsoft open-source projects, including Azure Identity and Key Vault.",
    },
    {
      label: "SELECTED WORK",
      kicker: "RESEARCH / PRODUCTS / INDEPENDENT BUILDS",
      titleLines: ["From research", "to real products"],
      body: "COVS · Job Application Agent · Azure Identity",
      action: "EXPLORE PROJECTS",
    },
    {
      label: "ABOUT ME",
      kicker: "THE PERSON BEHIND THE SYSTEMS",
      titleLines: ["The work is only", "part of the story"],
      body: "Meet the engineer, researcher, and independent builder behind these systems.",
      action: "ABOUT ME",
    },
  ],
  zh: [
    {
      label: "个人定位",
      kicker: "王欣隆 / AI 工程师 + 研究者",
      titleLines: ["我构建 AI 智能体，", "也研究它们如何与人协作"],
      body: "同志社大学计算机科学博士生，研究 AI 智能体系统、人机协作与开源工程。",
    },
    {
      label: "研究问题",
      kicker: "从工程系统走向研究",
      titleLines: ["在八年生产系统经验之后，", "我转向了 AI 研究"],
      body: "工程实践形成的系统思维，持续影响着我构建和研究协作型 AI 的方式。",
    },
    {
      label: "博士研究",
      kicker: "COVS / 人机协作",
      titleLines: ["智能体如何与", "从未见过的伙伴完成协作？"],
      body: "COVS 是一个连续空间 Overcooked 模拟器，用于研究人机协作以及对未知伙伴的泛化。",
    },
    {
      label: "全球工程",
      kicker: "开源 / 跨国团队",
      titleLines: ["与中国和美国团队一起", "构建 Azure SDK"],
      body: "我曾参与 Microsoft 开源项目，包括 Azure Identity 和 Key Vault。",
    },
    {
      label: "代表项目",
      kicker: "研究 / 产品 / 独立开发",
      titleLines: ["从研究成果", "走向真实产品"],
      body: "COVS · 自动找工作智能体 · Azure Identity",
      action: "查看项目",
    },
    {
      label: "关于我",
      kicker: "系统背后的人",
      titleLines: ["工作只是故事的", "一部分"],
      body: "认识这些系统背后的工程师、研究者与独立开发者。",
      action: "关于我",
    },
  ],
};

const educationByLocale = {
  en: [
    ["2025–2028", "Doshisha University", "Ph.D. · Computer Science"],
    ["2023–2025", "Doshisha University", "M.Sc. · Computer Science"],
    [
      "2013–2017",
      "Shanghai Institute of Technology",
      "B.Sc. · Computer Science",
    ],
  ],
  zh: [
    ["2025–2028", "同志社大学", "博士 · 计算机科学"],
    ["2023–2025", "同志社大学", "硕士 · 计算机科学"],
    ["2013–2017", "上海应用技术大学", "学士 · 计算机科学"],
  ],
};

const awardsByLocale = {
  en: [
    "JASSO Scholarship",
    "Doshisha University Scholarship · S Level",
    "Outstanding Leader of Co-Learning Program",
    "Outstanding Undergraduate Paper",
  ],
  zh: [
    "JASSO 奖学金",
    "同志社大学 S 级奖学金",
    "协同学习项目优秀负责人",
    "优秀本科毕业论文",
  ],
};

const siteCopy = {
  en: {
    documentTitle: "Wang Xinlong · AI Engineer and Researcher",
    nav: {
      about: "ABOUT ME",
      experience: "EXPERIENCE",
      work: "WORK",
      contact: "CONTACT",
      resume: "RESUME",
      switchLanguage: "中文",
      menu: "Toggle navigation",
    },
    hero: {
      aria: "A cinematic scroll journey through Wang Xinlong's profile and work",
      meta: "AI ENGINEER · RESEARCHER · BUILDER",
      location: "KYOTO / SHANGHAI",
    },
    manifesto: [
      "I build AI agents that plan, coordinate, and act.",
      "I use AI to help people in their daily lives.",
    ],
    about: {
      label: "ABOUT / PROFILE",
      coordinates: "35.0116° N · 135.7681° E",
      name: "WANG XINLONG",
      role: "AI ENGINEER · RESEARCHER",
      portraitAlt: "Portrait of Wang Xinlong",
      heading: "Building intelligent systems and studying Human–AI collaboration",
      paragraphs: [
        "AI engineer and Ph.D. candidate in computer science focused on LLM agents, Human–AI collaboration, and multi-agent reinforcement learning.",
        "Eight years of experience across software engineering, cloud infrastructure, Azure SDK development, authentication, and international technical teams inform this research.",
      ],
    },
    experience: {
      label: "WORK EXPERIENCE / 08+ YEARS",
      location: "SHANGHAI · APAC · KYOTO",
      heading: "Work experience",
      details: "VIEW DETAILS",
    },
    now: {
      label: "NOW / DOSHISHA UNIVERSITY",
      period: "2025–2028",
      type: "Ph.D. RESEARCH",
      heading: "NOW",
      body: "Researching Human–AI collaboration with world models, focusing on how AI agents infer human cooperative intent from actions and interaction dynamics.",
    },
    work: {
      label: "FEATURED WORK",
      type: "RESEARCH + ENGINEERING",
      heading: "Selected work",
    },
    research: {
      label: "RESEARCH OUTPUT",
      publications: "PUBLICATIONS",
      published: "PUBLISHED · IJABC · 2026",
      paper:
        "A Continuous-Space Overcooked Simulator for Multi-Agent Coordination",
      authors:
        "Xinlong Wang · Kota Toyoda · Miho Ohsaki · Kimiaki Shirahama",
      venue: "International Journal of Activity and Behavior Computing",
      viewPaper: "VIEW PAPER",
      recognition: "RECOGNITION",
    },
    footer: {
      availability: "OPEN TO AI ENGINEERING + RESEARCH",
      headingLines: ["Let’s build", "better agents"],
      email: "EMAIL WANG",
      navigation: "NAVIGATION",
      contact: "CONTACT",
      chinaPhone: "CHINA · +86 199 2156 5068",
      japanPhone: "JAPAN · 080 3851 5068",
      skills: "SKILLS",
      about: "About Me",
      experience: "Experience",
      work: "Work",
      designed: "DESIGNED FOR HUMAN × AI COLLABORATION",
    },
    profile: {
      dismiss: "Dismiss profile card",
      close: "Close profile card",
      hint: "DRAG · CLICK TO FLIP · ESC TO CLOSE",
      title: "Wang Xinlong profile card",
      alt: "Wang Xinlong identity card",
      current: "CURRENT",
      currentValue: "Ph.D. Candidate · Doshisha University",
      focus: "FOCUS",
      focusValue: "LLM Agents · Human–AI Collaboration · Multi-Agent Learning",
      experience: "EXPERIENCE",
      experienceValue: "Global engineering · Microsoft open source",
      building: "BUILDING",
      buildingValue: "Research systems · AI products · Live apps",
      view: "VIEW FULL PROFILE",
      return: "CLICK CARD TO RETURN",
    },
    detail: {
      experienceIndex: "EXPERIENCE INDEX",
      projectIndex: "PROJECT INDEX",
      backExperience: "BACK TO WORK EXPERIENCE",
      backProjects: "BACK TO SELECTED WORK",
      workExperience: "WORK EXPERIENCE",
      selectedWork: "SELECTED WORK",
      context: "CONTEXT",
      problem: "THE PROBLEM",
      workflow: "WORKFLOW",
      whatIDid: "WHAT I DID",
      contribution: "CONTRIBUTION",
      coreCapabilities: "CORE CAPABILITIES",
      myContribution: "MY CONTRIBUTION",
      technicalDecisions: "TECHNICAL DECISIONS",
      technology: "TECHNOLOGY",
      currentLimits: "CURRENT LIMITS",
      workingEnvironment: "WORKING ENVIRONMENT",
      role: "ROLE",
      location: "LOCATION",
      projectStatus: "PROJECT STATUS",
    },
    notFound: {
      project: "This project is not in the selected work index",
      experience: "This role is not in the work experience index",
      returnProjects: "RETURN TO SELECTED WORK",
      returnExperience: "RETURN TO WORK EXPERIENCE",
    },
  },
  zh: {
    documentTitle: "王欣隆 · AI 工程师与研究者",
    nav: {
      about: "关于我",
      experience: "工作经历",
      work: "项目",
      contact: "联系",
      resume: "简历",
      switchLanguage: "EN",
      menu: "切换导航菜单",
    },
    hero: {
      aria: "王欣隆个人经历与项目的电影式滚动展示",
      meta: "AI 工程师 · 研究者 · 开发者",
      location: "京都 / 上海",
    },
    manifesto: [
      "我构建能够规划、协调和行动的 AI 智能体",
      "我希望用 AI 帮助人们解决日常问题",
    ],
    about: {
      label: "关于 / 个人档案",
      coordinates: "35.0116° N · 135.7681° E",
      name: "王欣隆",
      role: "AI 工程师 · 研究者",
      portraitAlt: "王欣隆肖像",
      heading: "构建智能系统，研究人机协作",
      paragraphs: [
        "计算机科学博士生与 AI 工程师，研究方向包括大语言模型智能体、人机协作和多智能体强化学习。",
        "八年的软件工程、云基础设施、Azure SDK、身份认证和跨国团队经验，为我的研究提供了扎实的工程基础。",
      ],
    },
    experience: {
      label: "工作经历 / 08+ 年",
      location: "上海 · 亚太区 · 京都",
      heading: "工作经历",
      details: "查看详情",
    },
    now: {
      label: "目前 / 同志社大学",
      period: "2025–2028",
      type: "博士研究",
      heading: "现在",
      body: "使用世界模型研究人机协作，重点关注 AI 智能体如何从行为与互动动态中推断人的合作意图",
    },
    work: {
      label: "代表项目",
      type: "研究 + 工程",
      heading: "精选项目",
    },
    research: {
      label: "研究成果",
      publications: "论文发表",
      published: "已发表 · IJABC · 2026",
      paper:
        "A Continuous-Space Overcooked Simulator for Multi-Agent Coordination",
      authors: "王欣隆 · Kota Toyoda · Miho Ohsaki · Kimiaki Shirahama",
      venue: "International Journal of Activity and Behavior Computing",
      viewPaper: "查看论文",
      recognition: "荣誉",
    },
    footer: {
      availability: "开放 AI 工程与研究合作",
      headingLines: ["一起构建", "更好的智能体"],
      email: "发送邮件",
      navigation: "导航",
      contact: "联系",
      chinaPhone: "中国：86 19921565068",
      japanPhone: "日本：08038515068",
      skills: "技能",
      about: "关于我",
      experience: "工作经历",
      work: "项目",
      designed: "为人类 × AI 协作而设计",
    },
    profile: {
      dismiss: "关闭个人档案",
      close: "关闭个人档案",
      hint: "拖动 · 点击翻转 · ESC 关闭",
      title: "王欣隆个人档案卡",
      alt: "王欣隆身份卡",
      current: "目前",
      currentValue: "同志社大学 · 博士生",
      focus: "研究方向",
      focusValue: "LLM 智能体 · 人机协作 · 多智能体学习",
      experience: "经历",
      experienceValue: "全球工程协作 · Microsoft 开源项目",
      building: "正在构建",
      buildingValue: "研究系统 · AI 产品 · 可用应用",
      view: "查看完整档案",
      return: "点击卡片返回",
    },
    detail: {
      experienceIndex: "工作经历索引",
      projectIndex: "项目索引",
      backExperience: "返回工作经历",
      backProjects: "返回精选项目",
      workExperience: "工作经历",
      selectedWork: "精选项目",
      context: "背景",
      problem: "问题",
      workflow: "工作流程",
      whatIDid: "主要工作",
      contribution: "贡献",
      coreCapabilities: "核心能力",
      myContribution: "我的贡献",
      technicalDecisions: "技术决策",
      technology: "技术栈",
      currentLimits: "当前限制",
      workingEnvironment: "工作环境",
      role: "职位",
      location: "地点",
      projectStatus: "项目状态",
    },
    notFound: {
      project: "该项目不在精选项目索引中",
      experience: "该经历不在工作经历索引中",
      returnProjects: "返回精选项目",
      returnExperience: "返回工作经历",
    },
  },
};

function getLocalizedCatalog(locale, englishExperiences, englishProjects) {
  if (locale !== "zh") {
    return {
      experiences: englishExperiences,
      projects: englishProjects,
    };
  }
  return {
    experiences: portfolioZh.experiences,
    projects: portfolioZh.projects,
  };
}

export {
  awardsByLocale,
  educationByLocale,
  getLocalizedCatalog,
  heroByLocale,
  siteCopy,
};
