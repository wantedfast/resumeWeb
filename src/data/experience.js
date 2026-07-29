const experiences = [
  {
    slug: "dohler-shanghai",
    period: "2017.01–2018.05",
    company: "Döhler Shanghai",
    role: "IT Engineer · APAC",
    location: "Shanghai · APAC",
    description:
      "Maintained regional infrastructure and SAP/QAD business systems, supported APAC users under SLA requirements, and collaborated with international teams on system upgrades.",
    assistantIntro:
      "At Döhler, Xinlong supported APAC users and the infrastructure behind everyday business operations, including SAP and QAD workflows.",
    context:
      "Döhler’s Shanghai office operated within a regional IT environment serving teams across APAC. The role connected local user support with the infrastructure and business systems required for day-to-day operations.",
    responsibilities: [
      "Maintain workplace infrastructure and support SAP and QAD business-system workflows.",
      "Handle incidents and service requests within established service-level requirements.",
      "Coordinate operational changes and system upgrades with regional teams and external specialists.",
      "Document recurring issues, guide users, and escalate cross-system problems to the appropriate owners.",
    ],
    contributions: [
      "Supported reliable day-to-day operation of workplace and business-critical systems.",
      "Connected local user needs with regional system owners and international technical teams.",
      "Contributed to maintenance and upgrade work while limiting disruption to business users.",
    ],
    stack: ["SAP", "QAD", "Windows", "Networking", "IT Service Operations"],
  },
  {
    slug: "wicresoft-azure-sdk",
    period: "2018.06–2020.06",
    company: "Wicresoft",
    role: "Software Engineer · Azure SDK",
    location: "Shanghai · United States",
    description:
      "Worked with the U.S.-based Azure team on Azure Identity and Key Vault features in C#, including mock and end-to-end tests, samples, issue resolution, and developer documentation.",
    assistantIntro:
      "At Wicresoft, Xinlong worked on Azure Identity and Key Vault in C#, spanning implementation, testing, samples, issue resolution, and documentation.",
    context:
      "The work contributed to open-source Azure SDK for .NET libraries in collaboration with the Azure engineering team in the United States. It combined production library development with testing, samples, documentation, and issue resolution.",
    responsibilities: [
      "Develop and maintain C# functionality for Azure Identity and Key Vault client libraries.",
      "Create mock and end-to-end tests for authentication and service-integration scenarios.",
      "Reproduce reported issues, investigate behavior, and prepare fixes aligned with repository conventions.",
      "Write and refine samples and developer documentation for public SDK users.",
    ],
    contributions: [
      "Implemented and tested SDK functionality across identity and security-related components.",
      "Improved the path from API implementation to usable samples and supporting documentation.",
      "Collaborated through code review and issue tracking across locations and time zones.",
    ],
    stack: ["C#", ".NET", "Azure SDK", "Azure Identity", "Key Vault", "GitHub"],
  },
  {
    slug: "independent-study",
    period: "2020.06–2022.12",
    company: "Independent Study",
    role: "Computer Science",
    location: "China",
    description:
      "Returned home during the pandemic to support family while continuing computer-science study and preparing for graduate school.",
    assistantIntro:
      "This was a deliberate transition period: Xinlong supported his family, continued structured computer-science study, and prepared to move into graduate research.",
    context:
      "This was a transition period rather than a conventional employment role. Alongside family responsibilities during the pandemic, I continued structured computer-science study and prepared to move from production engineering into graduate research.",
    responsibilities: [
      "Maintain a structured program of independent study in computer science and software engineering.",
      "Prepare for graduate admissions and the transition into research-led work.",
      "Continue hands-on technical practice through independent learning and project work.",
    ],
    contributions: [
      "Built the academic foundation required for subsequent master’s and doctoral study.",
      "Connected prior engineering experience with emerging research questions in intelligent systems.",
      "Clarified a longer-term direction spanning AI research and practical system building.",
    ],
    stack: ["Computer Science", "Python", "Algorithms", "Systems", "Research Preparation"],
  },
  {
    slug: "dow-shanghai",
    period: "2022.12–2023.03",
    company: "Dow Shanghai",
    role: "IT Service Engineer",
    location: "Shanghai",
    description:
      "Supported Microsoft Office, Windows, networks, and data-center infrastructure while handling incidents and service requests under SLA requirements.",
    assistantIntro:
      "At Dow, Xinlong handled enterprise IT incidents across workplace software, Windows, networks, and data-center infrastructure.",
    context:
      "The role supported users and infrastructure within an enterprise IT service environment, combining endpoint troubleshooting with network, access, and data-center coordination.",
    responsibilities: [
      "Support Microsoft Office, Windows endpoints, network connectivity, and related workplace systems.",
      "Diagnose incidents and complete service requests within established service-level requirements.",
      "Coordinate escalation and handoff when issues crossed infrastructure or ownership boundaries.",
      "Communicate status clearly so users and technical teams could act on the same information.",
    ],
    contributions: [
      "Helped restore user productivity across common workplace and access scenarios.",
      "Supported reliable office and infrastructure operations through disciplined incident handling.",
      "Maintained clear technical communication across users, service teams, and infrastructure owners.",
    ],
    stack: ["Windows", "Microsoft Office", "Networking", "Data Center", "ITSM"],
  },
];

const experiencesBySlug = Object.fromEntries(
  experiences.map((experience) => [experience.slug, experience]),
);

export { experiences, experiencesBySlug };
