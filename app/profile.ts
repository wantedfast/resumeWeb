export type Locale = "zh" | "en";

export const PROFILE = {
  displayName: "YOUR NAME",
  projects: [
    {
      id: "resume-agent",
      year: "2026",
      title: "Resume Intelligence",
      type: { zh: "个人智能体", en: "Personal AI Agent" },
      summary: {
        zh: "把传统简历变成可以追问、理解上下文并引导雇主浏览案例的对话体验。",
        en: "Turning a static résumé into a contextual conversation that guides employers through relevant evidence.",
      },
      detail: {
        zh: "当前网站本身即为首个案例：双语内容、服务端模型调用、基于事实的回答边界，以及从对话跳转到项目证据的体验设计。",
        en: "This website is the first case: bilingual content, server-side model access, fact-grounded response boundaries, and a path from conversation to project evidence.",
      },
      tags: ["AI UX", "DeepSeek", "Web"],
    },
    {
      id: "project-two",
      year: "20XX",
      title: "Your Flagship Project",
      type: { zh: "待替换案例", en: "Content to replace" },
      summary: {
        zh: "此处将展示你最有代表性的真实项目：问题、你的角色、关键决策与最终影响。",
        en: "This space will hold your strongest verified project: the problem, your role, key decisions, and measurable impact.",
      },
      detail: {
        zh: "请提供项目背景、过程图片、成果数据和链接；页面会将这些内容组织成可展开的简洁案例。",
        en: "Provide context, process imagery, outcome metrics, and links; the page will turn them into a concise expandable case study.",
      },
      tags: ["Case Study", "Impact", "Craft"],
    },
    {
      id: "project-three",
      year: "20XX",
      title: "Your Systems Project",
      type: { zh: "待替换案例", en: "Content to replace" },
      summary: {
        zh: "用于体现系统思考、跨团队合作或从零到一交付能力的第二个真实案例。",
        en: "A second verified case showing systems thinking, cross-functional collaboration, or zero-to-one delivery.",
      },
      detail: {
        zh: "建议选择一个能补充首个案例、体现不同能力维度的项目，而不是重复相同类型的成果。",
        en: "Choose a project that complements the flagship case and proves a different dimension of your ability.",
      },
      tags: ["Systems", "Strategy", "Delivery"],
    },
  ],
  journey: [
    {
      period: "NOW",
      role: { zh: "你的当前职位", en: "Your current role" },
      organization: { zh: "公司 / 独立实践", en: "Company / Independent practice" },
      note: { zh: "待接入正式简历后替换", en: "To be replaced with verified résumé data" },
    },
    {
      period: "20XX—20XX",
      role: { zh: "上一段核心经历", en: "Previous core experience" },
      organization: { zh: "组织名称", en: "Organization name" },
      note: { zh: "职责、成果与影响", en: "Responsibilities, outcomes, and impact" },
    },
    {
      period: "EDUCATION",
      role: { zh: "教育经历", en: "Education" },
      organization: { zh: "学校与专业", en: "School and discipline" },
      note: { zh: "学位、时间与相关荣誉", en: "Degree, dates, and relevant distinctions" },
    },
  ],
  capabilities: {
    zh: ["问题定义", "产品策略", "体验设计", "快速原型", "跨团队协作", "AI 工作流"],
    en: ["Problem framing", "Product strategy", "Experience design", "Rapid prototyping", "Collaboration", "AI workflows"],
  },
} as const;
