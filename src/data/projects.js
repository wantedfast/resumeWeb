const projects = [
  {
    slug: "covs",
    title: "COVS",
    type: "Multi-agent research",
    image: "/assets/project-covs.png",
    imageAlt: "Two robots coordinating around a cooking station",
    summary:
      "A continuous-space Overcooked benchmark for studying coordination, behavior cloning, and generalization to unseen partners.",
    assistantIntro:
      "COVS is Xinlong’s published multi-agent research platform. It tests whether agents can coordinate with partners whose behavior they have never seen before.",
    status: "Published research / IJABC / 2026",
    context:
      "Cooperative-agent research often evaluates policies with a fixed set of training partners. That makes it difficult to tell whether an agent has learned coordination or merely adapted to familiar behavior.",
    problem:
      "COVS asks how an agent can coordinate in a continuous environment with partners whose behavior was not present during training. The project turns the familiar cooperative structure of Overcooked into a research setting suited to continuous control and partner-generalization experiments.",
    workflow: [
      {
        title: "Define the cooperative task",
        body: "Cooking tasks are expressed through continuous movement, object interaction, shared goals, and timing-sensitive coordination.",
      },
      {
        title: "Train partner policies",
        body: "Multiple partner behaviors create a training distribution instead of relying on one fixed teammate.",
      },
      {
        title: "Train the focal agent",
        body: "Reinforcement-learning and behavior-cloning approaches learn from the environment and the available partner data.",
      },
      {
        title: "Evaluate unseen partnerships",
        body: "The trained agent is paired with held-out partners to measure whether coordination transfers beyond familiar behavior.",
      },
    ],
    features: [
      "Continuous-space cooperative cooking tasks",
      "Configurable multi-agent experiments",
      "Held-out partner evaluation",
      "Diffusion-based behavior-cloning baselines",
      "Reproducible simulator and experiment workflow",
    ],
    technicalDecisions: [
      {
        title: "Continuous control",
        body: "Movement and coordination are not reduced to a small grid, making timing and spatial behavior part of the research problem.",
      },
      {
        title: "Partner-based splits",
        body: "Training and evaluation partners are separated so the benchmark can test generalization rather than memorization.",
      },
      {
        title: "Research-first reproducibility",
        body: "Environment configuration, baselines, and evaluation are organized as a repeatable experimental pipeline.",
      },
    ],
    contribution: [
      "Designed and implemented the continuous-space simulator.",
      "Built the training, evaluation, and experiment workflow.",
      "Developed the partner-generalization setup and baseline implementations.",
      "Prepared the research publication with academic collaborators.",
    ],
    limitations: [
      "The simulator is a controlled research environment, not a model of every constraint present in human teamwork.",
      "Results depend on the partner distributions, tasks, observations, and policies selected for an experiment.",
    ],
    stack: ["Python", "Multi-Agent RL", "Behavior Cloning", "Simulation"],
    links: [
      {
        label: "View paper",
        href: "https://www.jstage.jst.go.jp/article/ijabc/2026/1/2026_144/_pdf/-char/ja",
      },
      {
        label: "GitHub",
        href: "https://github.com/wantedfast/Continuous-Action-OVercooked-Simulator",
      },
    ],
  },
  {
    slug: "ai-trading-helper",
    title: "AI Trading Helper",
    type: "Decision-review tool",
    image: "/assets/project-ai-trading.webp",
    imageAlt: "A dark analyst desk with a trade journal and scanning device",
    summary:
      "A local-first workflow that turns trading screenshots and files into structured facts, review notes, watch plans, and reminders.",
    assistantIntro:
      "This tool turns scattered trading records into a disciplined review workflow. It organizes evidence and reflection without making predictions or investment recommendations.",
    status: "Working prototype / Active development",
    context:
      "Trading records are frequently fragmented across screenshots, exports, handwritten observations, and memory. That makes consistent post-trade review difficult.",
    problem:
      "AI Trading Helper organizes those inputs into a repeatable reflection workflow. It extracts observable facts, separates them from interpretation, and prepares material for later review without presenting predictions or investment advice.",
    workflow: [
      {
        title: "Import evidence",
        body: "The user provides a trading screenshot or supported file instead of manually retyping every field.",
      },
      {
        title: "Structure the facts",
        body: "Parsing and OCR convert visible information into a consistent record that can be reviewed and corrected.",
      },
      {
        title: "Generate a review",
        body: "An AI-assisted report organizes the facts, the user's notes, and questions worth revisiting.",
      },
      {
        title: "Create a watch plan",
        body: "Follow-up observations and reminders are recorded for disciplined review rather than automatic execution.",
      },
    ],
    features: [
      "Screenshot and file ingestion",
      "Structured trade-fact extraction",
      "Editable AI-assisted review reports",
      "Watch plans and reminders",
      "Local-first review workflow",
    ],
    technicalDecisions: [
      {
        title: "Facts before interpretation",
        body: "Extracted data is kept separate from generated commentary so users can verify the record before relying on a review.",
      },
      {
        title: "Human confirmation",
        body: "The workflow is designed around reviewing and correcting parsed information instead of treating model output as authoritative.",
      },
      {
        title: "No execution layer",
        body: "The tool does not place trades, promise returns, or replace professional financial advice.",
      },
    ],
    contribution: [
      "Defined the end-to-end review workflow.",
      "Built the screenshot and file ingestion path.",
      "Implemented fact structuring, report generation, and reminders.",
      "Established product language that avoids prediction and investment-advice claims.",
    ],
    limitations: [
      "OCR and parsing quality depends on the source image or file format and requires user verification.",
      "Generated reviews are reflective aids, not financial advice, return forecasts, or trading signals.",
    ],
    stack: ["Python", "TypeScript", "OCR", "LLM Workflows"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/wantedfast/AITradingHelper",
      },
    ],
  },
  {
    slug: "gangke-zhihui",
    title: "Gangke Zhihui",
    type: "Vocational education MVP",
    image: "/assets/project-gangke.webp",
    imageAlt: "A vocational training workbench with rubrics and skill charts",
    summary:
      "A local teaching loop for practical assignments, rubrics, student submissions, AI scoring, teacher review, and skills dashboards.",
    assistantIntro:
      "Gangke Zhihui connects vocational assignments, rubrics, AI-assisted assessment, and teacher review. The teacher always keeps final authority.",
    status: "MVP / Local data loop",
    context:
      "Practical vocational assignments need clearer rubrics and faster feedback, while teachers still need authority over final assessment.",
    problem:
      "Gangke Zhihui connects task design, student work, AI-assisted scoring, teacher review, and competency summaries in one local MVP. The system supports the teaching loop without presenting AI scoring as a final grade.",
    workflow: [
      {
        title: "Create a training task",
        body: "A teacher defines the practical assignment, expected deliverables, and evaluation rubric.",
      },
      {
        title: "Submit student work",
        body: "Students provide text, code, or task evidence against the published requirements.",
      },
      {
        title: "Prepare an AI assessment",
        body: "The system maps the submission to rubric criteria and generates an initial score with feedback.",
      },
      {
        title: "Complete teacher review",
        body: "The teacher checks, edits, and confirms the assessment before it contributes to class-level summaries.",
      },
    ],
    features: [
      "Training-task and rubric authoring",
      "Student text and code submissions",
      "AI-assisted scoring with teacher review",
      "Feedback history and review states",
      "Class competency and progress summaries",
    ],
    technicalDecisions: [
      {
        title: "Teacher-in-the-loop",
        body: "AI produces a reviewable draft; the teacher remains responsible for the confirmed assessment.",
      },
      {
        title: "Rubric-grounded output",
        body: "Feedback is organized around explicit criteria rather than a free-form model judgment.",
      },
      {
        title: "Local MVP boundary",
        body: "The current implementation validates the workflow with local data before introducing accounts, a remote database, or institutional integrations.",
      },
    ],
    contribution: [
      "Designed the teacher and student workflow.",
      "Implemented task, rubric, submission, and review states.",
      "Built the AI-assessment presentation and teacher confirmation path.",
      "Created the class competency and progress views.",
    ],
    limitations: [
      "The MVP uses a local data loop and is not a production learning-management system.",
      "Institutional authentication, remote persistence, and administrative integrations are outside the current scope.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "LocalStorage"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/wantedfast/gangke-zhihui",
      },
    ],
  },
  {
    slug: "ai-kanojo",
    title: "AI-KANOJO",
    type: "Local AI companion",
    image: "/assets/project-ai-kanojo.webp",
    imageAlt: "A sculptural local AI companion connected to a task console",
    summary:
      "A Windows AI companion that bridges voice and text requests to Codex App Server with streaming progress, approvals, and task control.",
    assistantIntro:
      "AI-KANOJO explores a more visible and controllable agent interface. It shows progress, questions, approvals, and cancellation instead of hiding long-running work.",
    status: "Windows MVP / v0.1.2",
    context:
      "Agent systems can perform long-running work, but conventional chat interfaces often hide progress, approvals, and the boundaries of user control.",
    problem:
      "AI-KANOJO explores a local desktop companion that makes agent work visible and interruptible. Voice and text requests are bridged to Codex App Server while the interface surfaces progress, questions, approvals, and task controls.",
    workflow: [
      {
        title: "Receive a request",
        body: "The user starts a task through Chinese voice input or typed text on Windows.",
      },
      {
        title: "Bridge to the agent",
        body: "The local application translates the request into a Codex App Server task and maintains the connection.",
      },
      {
        title: "Stream progress",
        body: "Task events are presented as they arrive instead of being hidden behind a single loading state.",
      },
      {
        title: "Return control",
        body: "Approvals, questions, steering, and cancellation keep consequential actions under user control.",
      },
    ],
    features: [
      "Chinese voice and text task input",
      "Codex App Server bridge",
      "Streaming progress and task state",
      "Approval and question handling",
      "Steering, cancellation, transcription, and TTS flows",
    ],
    technicalDecisions: [
      {
        title: "Local authorization boundary",
        body: "The companion keeps task control and authorization visible instead of silently accepting every agent action.",
      },
      {
        title: "Event-driven interface",
        body: "Streaming events are modeled as user-facing progress and control states rather than flattened into a final response.",
      },
      {
        title: "Windows-first MVP",
        body: "The initial product narrows platform scope so desktop integration and task control can be tested coherently.",
      },
    ],
    contribution: [
      "Designed the companion interaction model.",
      "Built the Windows MVP and Codex App Server bridge.",
      "Implemented streamed task state, approvals, questions, and controls.",
      "Integrated voice transcription and text-to-speech flows.",
    ],
    limitations: [
      "The current release is a Windows-focused MVP rather than a cross-platform assistant.",
      "The companion depends on the capabilities and authorization model exposed by the connected agent server.",
    ],
    stack: ["Node.js", "Codex App Server", "Windows", "Speech"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/wantedfast/AI-KANOJO",
      },
    ],
  },
  {
    slug: "goods-change",
    title: "Goods Change",
    type: "Community app",
    image: "/assets/project-goods-change.webp",
    imageAlt: "A box of useful items ready for a community handoff",
    summary:
      "A campus community app for giving useful items away, requesting them, chatting privately, and arranging an in-person handoff.",
    assistantIntro:
      "Goods Change is a closed-test campus app for giving useful items away. It focuses on nearby discovery, requests, conversation, and safe in-person handoff.",
    status: "Closed-test build",
    context:
      "Useful items are often discarded because finding a nearby recipient and arranging a handoff takes more effort than the item appears to justify.",
    problem:
      "Goods Change creates a small, trust-oriented campus workflow for free item exchange. The scope concentrates on discovery, requests, conversation, and handoff without adding commerce or logistics.",
    workflow: [
      {
        title: "List a free item",
        body: "A member publishes an item with the information another person needs to decide whether it is useful.",
      },
      {
        title: "Request the item",
        body: "Interested members submit a claim request rather than treating the listing as a purchase.",
      },
      {
        title: "Arrange the handoff",
        body: "Private chat supports the practical details of an in-person campus exchange.",
      },
      {
        title: "Complete the exchange",
        body: "The item status changes after handoff so the community can distinguish available and completed listings.",
      },
    ],
    features: [
      "Free-item browsing and listing",
      "Claim requests",
      "Private handoff chat",
      "Exchange status workflow",
      "Community posts, comments, likes, and saves",
    ],
    technicalDecisions: [
      {
        title: "No payment model",
        body: "The product is designed around free giving and does not introduce checkout, fees, or price negotiation.",
      },
      {
        title: "Small-community scope",
        body: "The interaction model prioritizes nearby campus exchanges over a broad public marketplace.",
      },
      {
        title: "Deliberate feature limits",
        body: "Delivery, payment, and map services are excluded from the closed-test build.",
      },
    ],
    contribution: [
      "Defined the closed-test product scope.",
      "Designed the listing, request, conversation, and handoff flow.",
      "Implemented the core exchange and community interactions.",
      "Kept commerce and logistics features outside the MVP boundary.",
    ],
    limitations: [
      "The current build is intended for a closed test, not an unrestricted public marketplace.",
      "Payments, delivery, and map-based discovery are not included.",
    ],
    stack: ["Expo", "React Native", "TypeScript", "Mobile UI"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/wantedfast/goods-change",
      },
    ],
  },
  {
    slug: "job-application-agent",
    title: "Job Application Agent",
    type: "LLM agent system",
    image: "/assets/project-job-agent.png",
    imageAlt: "A resume and coordinated agent interfaces on a dark desk",
    summary:
      "A multi-agent workflow for resume analysis, recruiter Q&A, and evaluating personalized outreach.",
    assistantIntro:
      "This prototype coordinates separate agents for analysis, drafting, and review. Its goal is more specific applications without inventing claims.",
    status: "Working prototype",
    context:
      "Job-search material must remain accurate to a candidate while being adapted to the language and priorities of a specific role.",
    problem:
      "Job Application Agent coordinates specialized analysis, preparation, writing, and review steps. Its purpose is to improve specificity and consistency while preserving a human decision before anything is sent.",
    workflow: [
      {
        title: "Ground the application",
        body: "The workflow reads the candidate's resume and the target role as separate sources of truth.",
      },
      {
        title: "Analyze the match",
        body: "An analysis step identifies relevant experience, missing evidence, and claims that should not be made.",
      },
      {
        title: "Prepare communication",
        body: "Specialized steps prepare recruiter answers and role-specific outreach grounded in available experience.",
      },
      {
        title: "Evaluate the output",
        body: "A review step checks specificity, unsupported language, repetition, and usefulness before human approval.",
      },
    ],
    features: [
      "Resume-to-role analysis",
      "Recruiter question preparation",
      "Personalized outreach drafting",
      "Cross-agent output checks",
      "Human review before use",
    ],
    technicalDecisions: [
      {
        title: "Role separation",
        body: "Analysis, drafting, and evaluation are separate responsibilities so one generated answer is not accepted without review.",
      },
      {
        title: "Evidence-grounded writing",
        body: "Output is constrained by resume evidence and the supplied job description.",
      },
      {
        title: "Evaluation as a workflow step",
        body: "Specificity and unsupported claims are checked before the material reaches the user.",
      },
    ],
    contribution: [
      "Designed the agent roles and coordination flow.",
      "Defined grounding rules for resume and job-description evidence.",
      "Built response checks and evaluation criteria.",
      "Developed the prototype interaction around human review.",
    ],
    limitations: [
      "The system assists preparation; it does not submit applications or contact recruiters autonomously.",
      "Output quality depends on the completeness and accuracy of the source material.",
    ],
    stack: ["OpenAI SDK", "Agent Workflows", "Prompt Evaluation", "Python"],
    links: [],
  },
  {
    slug: "azure-identity",
    title: "Azure Identity",
    type: "Open-source engineering",
    image: "/assets/project-azure.png",
    imageAlt: "A secure identity vault with a key on a dark engineering desk",
    summary:
      "Authentication features, tests, samples, and developer documentation contributed to the Azure SDK for .NET.",
    assistantIntro:
      "Xinlong contributed authentication functionality, tests, samples, and documentation to the Azure SDK for .NET while collaborating across China and the United States.",
    status: "Production open source",
    context:
      "Authentication libraries sit on a critical path for applications using cloud services. Their APIs need predictable behavior, strong test coverage, and documentation developers can follow.",
    problem:
      "The Azure Identity work combined SDK feature development with mock and end-to-end testing, samples, issue resolution, and documentation in collaboration with the U.S.-based Azure SDK team.",
    workflow: [
      {
        title: "Define SDK behavior",
        body: "Authentication requirements are translated into public credential behavior that fits established Azure SDK conventions.",
      },
      {
        title: "Implement and test",
        body: "Functionality is developed with mock tests and end-to-end coverage for relevant service behavior.",
      },
      {
        title: "Document the path",
        body: "Samples and developer documentation explain how applications configure and use the authentication flow.",
      },
      {
        title: "Resolve integration issues",
        body: "Issues are investigated with maintainers and service teams across repositories and time zones.",
      },
    ],
    features: [
      "Azure authentication functionality",
      "Mock and end-to-end test coverage",
      "Developer samples",
      "SDK documentation",
      "Cross-team issue investigation",
    ],
    technicalDecisions: [
      {
        title: "SDK consistency",
        body: "Changes follow the conventions and compatibility expectations of the wider Azure SDK for .NET.",
      },
      {
        title: "Layered verification",
        body: "Mock coverage supports controlled behavior checks while end-to-end tests verify real integration paths.",
      },
      {
        title: "Documentation as part of delivery",
        body: "Samples and usage guidance are treated as part of the feature rather than an afterthought.",
      },
    ],
    contribution: [
      "Implemented Azure Identity and related SDK functionality in C#.",
      "Added and maintained mock and end-to-end tests.",
      "Created samples, fixes, and developer documentation.",
      "Collaborated with the U.S.-based Azure SDK team on issues and reviews.",
    ],
    limitations: [
      "The portfolio describes the areas of contribution without claiming ownership of the complete Azure Identity library.",
      "Specific contribution history remains governed by the public repository record.",
    ],
    stack: ["C#", ".NET", "Azure SDK", "Identity"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/wantedfast/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity",
      },
    ],
  },
];

const projectsBySlug = Object.fromEntries(
  projects.map((project) => [project.slug, project]),
);

export { projects, projectsBySlug };
