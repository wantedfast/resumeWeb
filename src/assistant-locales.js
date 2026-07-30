import { withBasePath } from "./base-path.js";

const assistantVoiceContent = {
  en: {
    greeting:
      "Welcome. I'm Luo Zhaoyue, Wang Xinlong's AI assistant. I can introduce his research, work, and projects.",
    intros: {
      "experience:dohler-shanghai":
        "At Döhler, Wang Xinlong supported APAC users and the infrastructure behind everyday business operations, including SAP and QAD workflows.",
      "experience:wicresoft-azure-sdk":
        "At Wicresoft, Wang Xinlong worked on Azure Identity and Key Vault in C#, spanning implementation, testing, samples, issue resolution, and documentation.",
      "experience:independent-study":
        "This was a deliberate transition period: Wang Xinlong supported his family, continued structured computer-science study, and prepared to move into graduate research.",
      "experience:dow-shanghai":
        "At Dow, Wang Xinlong handled enterprise IT incidents across workplace software, Windows, networks, and data-center infrastructure.",
      "project:covs":
        "COVS is Wang Xinlong's published multi-agent research platform. It tests whether agents can coordinate with partners whose behavior they have never seen before.",
      "project:ai-trading-helper":
        "AI Trading Helper turns scattered trading records into a disciplined review workflow without making predictions or investment recommendations.",
      "project:gangke-zhihui":
        "Gangke Zhihui is a local vocational-education workflow for assignments, AI-assisted scoring, teacher review, and skills dashboards.",
      "project:ai-kanojo":
        "AI-KANAJO is a Windows AI companion that connects voice and text requests to Codex with streaming progress, approvals, and task control.",
      "project:goods-change":
        "Goods Change is a campus community app for giving useful items away, requesting them, chatting privately, and arranging an in-person handoff.",
      "project:job-application-agent":
        "The Job Application Agent is a multi-agent workflow for resume analysis, recruiter questions, and evidence-grounded job applications.",
      "project:azure-identity":
        "Wang Xinlong contributed authentication functionality, tests, samples, and documentation to the Azure SDK for .NET.",
    },
  },
  zh: {
    greeting:
      "你好，我是罗昭玥，王欣隆的 AI 助理。我可以为你介绍他的研究、工作经历和项目。",
    intros: {
      "experience:dohler-shanghai":
        "在 Döhler，王欣隆负责支持亚太区用户，以及 SAP、QAD 等日常业务系统背后的基础设施。",
      "experience:wicresoft-azure-sdk":
        "在 Wicresoft，王欣隆使用 C# 参与 Azure Identity 与 Key Vault 的开发、测试、示例、问题修复和文档工作。",
      "experience:independent-study":
        "这是一段主动选择的过渡期。王欣隆在照顾家人的同时继续系统学习计算机科学，并为研究生阶段做好准备。",
      "experience:dow-shanghai":
        "在陶氏上海，王欣隆处理企业办公软件、Windows、网络和数据中心基础设施相关的 IT 事件。",
      "project:covs":
        "COVS 是王欣隆已发表的多智能体研究平台，用于测试智能体能否与从未见过的伙伴完成协作。",
      "project:ai-trading-helper":
        "AI Trading Helper 将分散的交易记录整理成规范的复盘流程，不提供预测或投资建议。",
      "project:gangke-zhihui":
        "岗课智慧是一套本地职业教育流程，覆盖作业、AI 辅助评分、教师复核和技能看板。",
      "project:ai-kanojo":
        "AI女友是一款 Windows AI 伙伴，通过语音和文字连接 Codex，并展示实时进度、审批和任务控制。",
      "project:goods-change":
        "互换美好是一款校园社区应用，用于赠送和求购物品、私聊沟通并安排线下交接。",
      "project:job-application-agent":
        "自动找工作智能体是一套多智能体求职流程，用于简历分析、招聘问题回答和基于事实的岗位申请。",
      "project:azure-identity":
        "王欣隆为 Azure SDK for .NET 贡献了身份认证功能、测试、示例和开发者文档。",
    },
  },
  ja: {
    greeting:
      "こんにちは。羅昭玥、ルオ・ジャオユエです。王欣隆さんの AI アシスタントとして、研究、経歴、プロジェクトをご紹介します。",
    intros: {
      "experience:dohler-shanghai":
        "Döhler では、王欣隆さんが APAC の利用者と、SAP や QAD を含む日常業務の基盤を支えました。",
      "experience:wicresoft-azure-sdk":
        "Wicresoft では、王欣隆さんが C# を使い、Azure Identity と Key Vault の実装、テスト、サンプル、問題解決、文書作成に携わりました。",
      "experience:independent-study":
        "この期間、王欣隆さんは家族を支えながら計算機科学を体系的に学び、大学院での研究に備えました。",
      "experience:dow-shanghai":
        "Dow 上海では、王欣隆さんが業務ソフトウェア、Windows、ネットワーク、データセンターに関する IT インシデントを担当しました。",
      "project:covs":
        "COVS は王欣隆さんが発表したマルチエージェント研究基盤で、未知の相手とも協調できるかを評価します。",
      "project:ai-trading-helper":
        "AI Trading Helper は、散在する取引記録を整理して振り返りの流れを作るツールで、予測や投資助言は行いません。",
      "project:gangke-zhihui":
        "港科智汇は、課題、AI 支援採点、教師の確認、スキルダッシュボードをまとめた職業教育向けのローカルシステムです。",
      "project:ai-kanojo":
        "AI-KANAJO は、音声とテキストで Codex に接続し、進捗、承認、タスク操作を扱える Windows 向け AI コンパニオンです。",
      "project:goods-change":
        "Goods Change は、学内で品物を譲ったり探したり、個別に連絡して受け渡しを調整できるコミュニティアプリです。",
      "project:job-application-agent":
        "Job Application Agent は、履歴書分析、採用担当者からの質問、根拠に基づく応募を支援するマルチエージェントの流れです。",
      "project:azure-identity":
        "王欣隆さんは Azure SDK for .NET に、認証機能、テスト、サンプル、開発者向け文書を提供しました。",
    },
  },
};

const voiceLabels = {
  en: "EN",
  zh: "中文",
  ja: "日本語",
};

function getGreetingAudio(language) {
  if (language === "zh") {
    return withBasePath("/assets/luo-zhaoyue-greeting-zh-v3.mp3");
  }
  if (language === "ja") {
    return withBasePath("/assets/luo-zhaoyue-greeting-ja-v3.mp3");
  }
  return withBasePath("/assets/luo-zhaoyue-greeting-v3.mp3");
}

function getIntroAudio(language, id) {
  const [kind, slug] = id.split(":");
  const prefix = kind === "experience" ? "experience" : "project";
  const directory = language === "en" ? "" : `${language}/`;
  return withBasePath(
    `/assets/assistant-voice/${directory}${prefix}-${slug}-v3.mp3`,
  );
}

function getAssistantText(language, id) {
  return (
    assistantVoiceContent[language]?.intros[id] ||
    assistantVoiceContent.en.intros[id] ||
    ""
  );
}

export {
  assistantVoiceContent,
  getAssistantText,
  getGreetingAudio,
  getIntroAudio,
  voiceLabels,
};
