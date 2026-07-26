export type Locale = "zh" | "en";
export type LocalizedText = Record<Locale, string>;

export type Project = {
  id: string;
  year: string;
  title: LocalizedText;
  type: LocalizedText;
  summary: LocalizedText;
  detail: LocalizedText;
  tags: string[];
  image: string;
  link?: string;
};

export type JourneyItem = {
  period: string;
  role: LocalizedText;
  organization: LocalizedText;
  note: LocalizedText;
};

export type EducationItem = {
  period: string;
  degree: LocalizedText;
  school: LocalizedText;
  field: LocalizedText;
};

export type SiteProfile = {
  displayName: string;
  shortName: string;
  portrait: string;
  email: string;
  resumeUrl: string;
  role: LocalizedText;
  summary: LocalizedText;
  about: LocalizedText;
  projects: Project[];
  journey: JourneyItem[];
  education: EducationItem[];
  capabilities: Record<Locale, string[]>;
  honors: Record<Locale, string[]>;
  links: { label: string; url: string }[];
  persona: {
    headline: LocalizedText;
    workingStyle: LocalizedText;
    interests: LocalizedText;
    responseStyle: LocalizedText;
    provenance: LocalizedText;
  };
};

export const DEFAULT_PROFILE: SiteProfile = {
  displayName: "Wang Xinlong",
  shortName: "WXL",
  portrait: "/assets/wang-xinlong-portrait.png",
  email: "wangfeichen@hotmail.com",
  resumeUrl: "/Resume_Wang_Xinlong.pdf",
  role: {
    zh: "AI 工程师 · 计算机科学博士生",
    en: "AI Engineer · Ph.D. Candidate in Computer Science",
  },
  summary: {
    zh: "专注于 LLM 智能体、人机协作与多智能体强化学习，拥有 8 年以上软件工程、云系统、Azure SDK、身份认证与 IT 基础设施经验。",
    en: "Focused on LLM-based agents, human-AI collaboration, and multi-agent reinforcement learning, with 8+ years across software engineering, cloud systems, Azure SDK development, authentication, and IT infrastructure.",
  },
  about: {
    zh: "我喜欢把模糊问题压缩成清晰边界，再把研究、工程与体验连接成能够真正运行的系统。当前在同志社大学攻读计算机科学博士，研究连续动作协作环境中的人机与多智能体协调。",
    en: "I turn ambiguous problems into explicit boundaries, then connect research, engineering, and experience design into systems that actually run. I am pursuing a Ph.D. in Computer Science at Doshisha University, researching human-AI and multi-agent coordination in continuous-action environments.",
  },
  projects: [
    {
      id: "job-application-agent",
      year: "2026",
      title: { zh: "求职申请智能体", en: "Job Application Agent" },
      type: { zh: "LLM 多智能体系统", en: "LLM multi-agent system" },
      summary: {
        zh: "面向简历分析、雇主问答与职位申请的 LLM 助手，并使用 OpenAI SDK 生成和评估个性化求职邮件。",
        en: "An LLM assistant for résumé analysis, recruiter Q&A, and job applications, with an OpenAI SDK workflow that generates and evaluates personalized outreach.",
      },
      detail: {
        zh: "系统把候选人资料转化为可追问的事实来源，并通过多个智能体生成、审查和改进个性化 cold email。本网站是其中“雇主问答”能力的公开体验版本。",
        en: "The system turns candidate material into a queryable factual source and uses multiple agents to generate, critique, and improve personalized cold emails. This site is a public expression of its recruiter-Q&A capability.",
      },
      tags: ["LLM Agent", "OpenAI SDK", "Recruiting"],
      image: "/assets/kivo-redo/prism-agent.png",
    },
    {
      id: "covs",
      year: "2025–NOW",
      title: { zh: "连续动作 Overcooked 模拟器", en: "Continuous-Space Overcooked Simulator" },
      type: { zh: "博士研究", en: "Ph.D. research" },
      summary: {
        zh: "为人机协作与多智能体协调研究设计连续动作空间模拟器 COVS，探索更真实的协作学习环境。",
        en: "A continuous-action Overcooked simulator (COVS) designed for human-AI and multi-agent coordination research in more realistic cooperative settings.",
      },
      detail: {
        zh: "研究包括基于示范的扩散模型行为克隆，以及使用 Vision-Language-Action 模型提升面对未知队友和未知环境时的泛化能力。相关论文已被 ABC 2026 Conference 接收（依据所提供简历）。",
        en: "The research explores diffusion-based behavior cloning from demonstrations and Vision-Language-Action models for generalization to unseen partners and environments. A related paper is listed as accepted by ABC 2026 Conference in the supplied résumé.",
      },
      tags: ["MARL", "Human-AI", "VLA", "Diffusion"],
      image: "/assets/kivo-redo/glass-flower.png",
    },
    {
      id: "azure-sdk",
      year: "2018–2020",
      title: { zh: "Microsoft Azure SDK 开源贡献", en: "Microsoft Azure SDK Contributions" },
      type: { zh: "云与身份认证", en: "Cloud & identity" },
      summary: {
        zh: "参与 Azure SDK for .NET、Azure Identity、Key Vault、Azure Samples 与 Cloud Design Patterns 等官方开源项目。",
        en: "Contributions to official Azure SDK for .NET, Azure Identity, Key Vault, Azure Samples, and Cloud Design Patterns projects.",
      },
      detail: {
        zh: "与美国 Azure SDK 团队协作，使用 C# 开发和测试身份认证组件，完成 mock test、端到端验证、示例应用和开发者文档；贡献被合并至官方仓库，并获 Arctic Code Vault Contributor 记录。",
        en: "Worked with the U.S.-based Azure SDK team on C# identity components, mock and end-to-end testing, sample applications, and developer documentation. Contributions were merged into official repositories and recognized by the Arctic Code Vault program.",
      },
      tags: ["C#", "Azure Identity", "Key Vault", "Open Source"],
      image: "/assets/kivo-redo/prism-agent.png",
      link: "https://github.com/wantedfast/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity",
    },
    {
      id: "immersive-resume",
      year: "2026",
      title: { zh: "沉浸式简历数字人", en: "Immersive Résumé Persona" },
      type: { zh: "个人 AI 产品", en: "Personal AI product" },
      summary: {
        zh: "把简历事实、项目证据与对话中形成的工作风格，整合成可由雇主直接提问的双语数字人。",
        en: "A bilingual digital persona that combines verified résumé facts, project evidence, and clearly labeled working-style observations.",
      },
      detail: {
        zh: "采用服务端 DeepSeek 调用、资料来源边界、双语回答、持久化内容后台和管理员身份校验；数字人不知道的内容会明确说明，不以流畅度换取虚构。",
        en: "Built with server-side DeepSeek access, source-aware grounding, bilingual responses, persistent content management, and administrator authorization. Unknown facts are stated plainly rather than invented.",
      },
      tags: ["DeepSeek", "AI UX", "Full Stack"],
      image: "/assets/kivo-redo/glass-flower.png",
    },
  ],
  journey: [
    {
      period: "2025–2028",
      role: { zh: "计算机科学博士生", en: "Ph.D. Candidate in Computer Science" },
      organization: { zh: "同志社大学", en: "Doshisha University" },
      note: { zh: "LLM 智能体、人机协作、多智能体强化学习", en: "LLM agents, human-AI collaboration, and multi-agent reinforcement learning" },
    },
    {
      period: "2022.12–2023.03",
      role: { zh: "IT 服务工程师", en: "IT Service Engineer" },
      organization: { zh: "陶氏上海", en: "Dow Shanghai" },
      note: { zh: "Office、Windows、网络与数据中心支持，按 SLA 处理服务请求", en: "Office, Windows, network, and data-center support under SLA requirements" },
    },
    {
      period: "2018.06–2020.06",
      role: { zh: "软件工程师", en: "Software Engineer" },
      organization: { zh: "微创软件", en: "Wicresoft" },
      note: { zh: "Microsoft Azure SDK for .NET、Azure Identity 与 Key Vault", en: "Microsoft Azure SDK for .NET, Azure Identity, and Key Vault" },
    },
    {
      period: "2017.01–2018.05",
      role: { zh: "亚太区 IT 工程师", en: "IT Engineer, APAC" },
      organization: { zh: "Döhler 上海", en: "Döhler Shanghai" },
      note: { zh: "SAP、QAD、区域基础设施与 APAC 用户支持", en: "SAP, QAD, regional infrastructure, and APAC end-user support" },
    },
  ],
  education: [
    {
      period: "2025–2028",
      degree: { zh: "博士", en: "Ph.D." },
      school: { zh: "同志社大学", en: "Doshisha University" },
      field: { zh: "计算机科学", en: "Computer Science" },
    },
    {
      period: "2023–2025",
      degree: { zh: "硕士", en: "Master" },
      school: { zh: "同志社大学", en: "Doshisha University" },
      field: { zh: "计算机科学", en: "Computer Science" },
    },
    {
      period: "2013–2017",
      degree: { zh: "学士", en: "Bachelor" },
      school: { zh: "上海应用技术大学", en: "Shanghai Institute of Technology" },
      field: { zh: "计算机科学", en: "Computer Science" },
    },
  ],
  capabilities: {
    zh: ["LLM 智能体", "多智能体强化学习", "Python", "C#", "Azure 与云系统", "Linux", "身份认证", "AI 产品原型"],
    en: ["LLM agents", "Multi-agent RL", "Python", "C#", "Azure & cloud systems", "Linux", "Authentication", "AI product prototyping"],
  },
  honors: {
    zh: ["JASSO 奖学金", "同志社大学 S 级奖学金", "Co-Learning Program 优秀负责人", "校级优秀本科论文"],
    en: ["JASSO Scholarship", "Doshisha University Scholarship (S Level)", "Outstanding Leader of Co-Learning Program", "Outstanding Undergraduate Paper"],
  },
  links: [
    { label: "GitHub · Azure Identity", url: "https://github.com/wantedfast/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity" },
    { label: "Azure Sample", url: "https://github.com/Azure-Samples/app-service-dotnet-access-key-vault-by-msi-for-web-apps" },
    { label: "Cloud Design Patterns", url: "https://github.com/mspnp/cloud-design-patterns" },
  ],
  persona: {
    headline: {
      zh: "研究型工程师，也是把复杂要求变成可执行系统的产品构建者。",
      en: "A research-minded engineer who turns complex requirements into executable systems.",
    },
    workingStyle: {
      zh: "近期对话显示，我倾向先界定事实、风险与不可修改项，再设计流程；重视模块边界、独立 QA、真实证据和最终可交付性。我会追问“为什么”，也会把抽象目标压缩成明确合同。",
      en: "Recent conversations suggest a working style that defines facts, risks, and non-negotiables before designing the workflow. I value module boundaries, independent QA, authentic evidence, and shippable outcomes, often turning abstract goals into explicit contracts.",
    },
    interests: {
      zh: "除核心研究外，我持续探索智能体产品、开发者工具、摄影真实感、跨文化产品研究和日语学习，也习惯从技术细节追到系统层原因。",
      en: "Beyond my core research, I explore agent products, developer tooling, photographic authenticity, cross-cultural product research, and Japanese learning, usually following technical details back to their system-level causes.",
    },
    responseStyle: {
      zh: "直接给结论，再解释证据与边界；技术问题可以深入，信息不足时明确说不知道。",
      en: "Lead with the conclusion, then explain evidence and boundaries. Go deep on technical questions, and say clearly when information is missing.",
    },
    provenance: {
      zh: "履历、教育、技能与项目事实来自用户提供的英文简历；工作风格与兴趣来自用户明确授权使用的近期对话，只作为对话观察，不作为第三方可验证履历。",
      en: "Career, education, skill, and project facts come from the supplied English résumé. Working-style and interest notes come from recent conversations the user explicitly authorized, and are treated as conversational observations rather than independently verifiable résumé facts.",
    },
  },
};

export function isSiteProfile(value: unknown): value is SiteProfile {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SiteProfile>;
  return (
    typeof candidate.displayName === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.role?.zh === "string" &&
    typeof candidate.role?.en === "string" &&
    Array.isArray(candidate.projects) &&
    Array.isArray(candidate.journey) &&
    Array.isArray(candidate.education) &&
    Array.isArray(candidate.capabilities?.zh) &&
    Array.isArray(candidate.capabilities?.en)
  );
}
