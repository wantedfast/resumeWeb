export type Locale = "zh" | "en";

export const PROFILE = {
  displayName: "Wang Xinlong",
  shortName: "WXL",
  role: {
    zh: "产品、体验与 AI 的跨界实践者",
    en: "Product, experience & AI builder",
  },
  projects: [
    {
      id: "resume-agent",
      year: "2026",
      title: { zh: "简历智能体", en: "Résumé Intelligence" },
      type: { zh: "个人 AI 产品", en: "Personal AI product" },
      summary: {
        zh: "把静态简历变成一段可追问、可验证、能引导雇主发现相关证据的对话体验。",
        en: "A static résumé turned into a grounded conversation that guides employers toward relevant evidence.",
      },
      detail: {
        zh: "本网站即是案例本身：双语界面、服务端模型调用、事实边界，以及从对话到项目证据的完整路径。",
        en: "This site is the case itself: a bilingual interface, server-side model access, factual boundaries, and a path from questions to proof.",
      },
      tags: ["AI UX", "DeepSeek", "Web"],
      image: "/assets/kivo-redo/prism-agent.png",
    },
    {
      id: "immersive-interface",
      year: "2026",
      title: { zh: "沉浸式界面实验", en: "Immersive Interface" },
      type: { zh: "交互与视觉原型", en: "Interaction prototype" },
      summary: {
        zh: "探索玻璃材质、空间卡片与轻量动效如何服务内容发现，而不只是成为装饰。",
        en: "Exploring how glass, spatial cards, and restrained motion can improve discovery instead of becoming decoration.",
      },
      detail: {
        zh: "以真实浏览、键盘操作、减少动画偏好和移动端阅读为约束，完成从视觉参考到可运行产品的转换。",
        en: "A visual reference translated into a working product with real browsing, keyboard access, reduced motion, and mobile reading.",
      },
      tags: ["UI Craft", "Prototype", "Motion"],
      image: "/assets/kivo-redo/glass-flower.png",
    },
    {
      id: "next-case",
      year: "NEXT",
      title: { zh: "下一项真实案例", en: "Your Next Case Study" },
      type: { zh: "资料待接入", en: "Verified content pending" },
      summary: {
        zh: "这里将接入你的真实项目背景、角色、关键决策、过程图片和可衡量结果。",
        en: "This space is ready for verified context, your role, key decisions, process imagery, and measurable outcomes.",
      },
      detail: {
        zh: "当前没有足够资料，因此不编造项目。补充材料后，网页和智能体会引用同一份事实来源。",
        en: "There is not enough source material yet, so nothing is invented. Once supplied, the site and agent will share one factual source.",
      },
      tags: ["Case Study", "Evidence", "Impact"],
      image: "/assets/kivo-redo/glass-flower.png",
    },
  ],
  journey: [
    {
      period: "NOW",
      role: { zh: "个人 AI 产品实践", en: "Independent AI product practice" },
      organization: { zh: "简历智能体网站", en: "Conversational résumé website" },
      note: { zh: "从概念、交互到上线交付", en: "From concept and interaction to a shipped experience" },
    },
    {
      period: "PAST",
      role: { zh: "工作经历待接入", en: "Work history to be added" },
      organization: { zh: "需要正式简历资料", en: "Verified résumé source required" },
      note: { zh: "网站不会替你虚构公司、职位或成果", en: "The site will not invent employers, roles, or outcomes" },
    },
    {
      period: "EDU",
      role: { zh: "教育经历待接入", en: "Education to be added" },
      organization: { zh: "需要学校、专业与时间", en: "School, discipline, and dates required" },
      note: { zh: "补充后将同步进入智能体知识库", en: "Once supplied, it will also ground the agent" },
    },
  ],
  capabilities: {
    zh: ["问题定义", "产品策略", "体验设计", "快速原型", "前端实现", "AI 工作流"],
    en: ["Problem framing", "Product strategy", "Experience design", "Rapid prototyping", "Frontend delivery", "AI workflows"],
  },
} as const;
