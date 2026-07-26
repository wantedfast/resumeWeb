"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { PROFILE, type Locale } from "./profile";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const copy = {
  zh: {
    nav: ["对话", "项目", "经历", "关于"],
    eyebrow: "个人简历智能体 · 公开预览",
    titleA: "别只读我的简历，",
    titleB: "直接问我。",
    intro: "这是一个由我的真实经历驱动的 AI 分身。你可以询问我的能力、项目方法、协作方式，或判断我是否适合你的团队。",
    status: "AI PROFILE · ONLINE",
    placeholder: "问一个关于我的问题…",
    send: "发送",
    prompts: ["介绍一下你自己", "你最擅长解决什么问题？", "带我看看你的项目"],
    scroll: "向下探索项目",
    selected: "SELECTED WORK · 精选项目",
    workTitle: "把想法变成可验证的作品。",
    workIntro: "以下内容是展示结构示例。替换为你的真实项目资料后，智能体会同步引用这些案例。",
    details: "查看案例",
    close: "收起案例",
    journey: "JOURNEY · 经历",
    journeyTitle: "一条围绕创造与交付的路径。",
    skills: "CAPABILITIES · 能力",
    about: "ABOUT · 关于",
    aboutTitle: "认真做事，也认真解释为什么。",
    aboutBody: "我喜欢把复杂问题拆成清晰路径，在业务目标、用户体验与可实现性之间找到平衡。这里的文字将在接入你的正式简历后替换。",
    contact: "开始一段对话",
    contactBody: "如果你正在寻找一个能从问题定义走到真实交付的人，欢迎联系我。",
    email: "发送邮件",
    resume: "简历待接入",
    footer: "Designed for thoughtful conversations.",
    setup: "DeepSeek Key 尚未配置。当前是界面预览；配置后我会基于你的正式简历回答。",
    error: "暂时无法连接智能体，请稍后再试。",
  },
  en: {
    nav: ["Ask", "Work", "Journey", "About"],
    eyebrow: "AI RESUME AGENT · PUBLIC PREVIEW",
    titleA: "Don’t just read my résumé.",
    titleB: "Ask me.",
    intro: "A conversational version of my verified experience. Ask about my strengths, project approach, collaboration style, or fit for your team.",
    status: "AI PROFILE · ONLINE",
    placeholder: "Ask something about me…",
    send: "Send",
    prompts: ["Tell me about yourself", "What problems do you solve best?", "Show me your work"],
    scroll: "Scroll to explore",
    selected: "SELECTED WORK",
    workTitle: "Ideas, shaped into evidence.",
    workIntro: "These are structural examples. Once your verified project material is added, the agent will reference the same case studies.",
    details: "View case",
    close: "Close case",
    journey: "JOURNEY",
    journeyTitle: "A path built around making and shipping.",
    skills: "CAPABILITIES",
    about: "ABOUT",
    aboutTitle: "Make it clear. Make it useful.",
    aboutBody: "I turn complex problems into clear paths, balancing business outcomes, user experience, and what can actually ship. This copy will be replaced with your verified résumé.",
    contact: "Let’s start a conversation",
    contactBody: "If you need someone who can move from problem definition to real delivery, I’d love to hear from you.",
    email: "Email me",
    resume: "Résumé coming soon",
    footer: "Designed for thoughtful conversations.",
    setup: "The DeepSeek key is not configured yet. This is the interface preview; once connected, I’ll answer from your verified résumé.",
    error: "The agent is unavailable right now. Please try again shortly.",
  },
} as const;

export default function Home() {
  const [locale, setLocale] = useState<Locale>("zh");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const t = copy[locale];

  useEffect(() => {
    const savedLocale = sessionStorage.getItem("portfolio-locale") as Locale | null;
    const savedMessages = sessionStorage.getItem("portfolio-chat");
    if (savedLocale === "zh" || savedLocale === "en") setLocale(savedLocale);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch {
        sessionStorage.removeItem("portfolio-chat");
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("portfolio-locale", locale);
  }, [locale]);

  useEffect(() => {
    sessionStorage.setItem("portfolio-chat", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  async function askAgent(question: string) {
    const clean = question.trim().slice(0, 500);
    if (!clean || isLoading) return;
    const nextMessages = [...messages, { role: "user" as const, content: clean }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-10), locale }),
      });
      if (!response.ok || !response.body) throw new Error("Chat request failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...nextMessages, { role: "assistant", content: answer }]);
      }
      if (!answer.trim()) {
        setMessages([...nextMessages, { role: "assistant", content: t.setup }]);
      }
    } catch {
      setMessages([...nextMessages, { role: "assistant", content: t.error }]);
    } finally {
      setIsLoading(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void askAgent(input);
  }

  return (
    <main>
      <section className="hero" id="ask">
        <div className="ambient" aria-hidden="true">
          <span className="orb orb-one" />
          <span className="orb orb-two" />
          <span className="orb orb-three" />
          <span className="grain" />
        </div>

        <nav className="glass-nav" aria-label="Primary navigation">
          <a className="wordmark" href="#ask" aria-label="Home">
            Y/N<span className="wordmark-dot">.</span>
          </a>
          <div className="nav-links">
            {t.nav.map((item, index) => (
              <a key={item} href={["#ask", "#work", "#journey", "#about"][index]}>
                {item}
              </a>
            ))}
          </div>
          <button
            className="locale-toggle"
            type="button"
            onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
            aria-label={locale === "zh" ? "Switch to English" : "切换至中文"}
          >
            {locale === "zh" ? "EN" : "中"}
          </button>
        </nav>

        <div className="hero-copy">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>
            {t.titleA}
            <br />
            <em>{t.titleB}</em>
          </h1>
          <p className="hero-intro">{t.intro}</p>
        </div>

        <div className="agent-stage">
          <div className={`agent-core ${isLoading ? "thinking" : ""}`} aria-hidden="true">
            <div className="core-ring ring-one" />
            <div className="core-ring ring-two" />
            <div className="core-mark">AI</div>
          </div>
          <span className="agent-status">{t.status}</span>

          {messages.length > 0 && (
            <div className="chat-log" aria-live="polite">
              {messages.slice(-4).map((message, index) => (
                <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
                  <span>{message.role === "user" ? "YOU" : "AI"}</span>
                  <p>{message.content || "•••"}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          )}

          <form className="prompt-dock" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="agent-question">
              {t.placeholder}
            </label>
            <input
              id="agent-question"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={500}
              placeholder={t.placeholder}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()} aria-label={t.send}>
              <span>{isLoading ? "···" : "↗"}</span>
            </button>
          </form>
          <div className="suggestions" aria-label="Suggested questions">
            {t.prompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => void askAgent(prompt)} disabled={isLoading}>
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <a className="scroll-cue" href="#work">
          <span>{t.scroll}</span>
          <i aria-hidden="true">↓</i>
        </a>
      </section>

      <section className="work-section" id="work">
        <div className="section-heading">
          <p className="eyebrow dark">{t.selected}</p>
          <h2>{t.workTitle}</h2>
          <p>{t.workIntro}</p>
        </div>

        <div className="project-stack">
          {PROFILE.projects.map((project, index) => {
            const isActive = activeProject === index;
            return (
              <article className={`project-card project-${index + 1} ${isActive ? "active" : ""}`} key={project.id}>
                <div className="project-art" aria-hidden="true">
                  <span className="art-label">0{index + 1}</span>
                  <div className="art-window">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className="project-copy">
                  <div className="project-meta">
                    <span>{project.year}</span>
                    <span>{project.type[locale]}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.summary[locale]}</p>
                  <div className="project-tags">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <button type="button" onClick={() => setActiveProject(isActive ? null : index)} aria-expanded={isActive}>
                    {isActive ? t.close : t.details} <span aria-hidden="true">{isActive ? "−" : "+"}</span>
                  </button>
                  {isActive && <p className="project-detail">{project.detail[locale]}</p>}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="journey-section" id="journey">
        <div className="section-heading compact">
          <p className="eyebrow">{t.journey}</p>
          <h2>{t.journeyTitle}</h2>
        </div>
        <div className="timeline">
          {PROFILE.journey.map((item) => (
            <article key={item.period}>
              <span className="timeline-period">{item.period}</span>
              <div>
                <h3>{item.role[locale]}</h3>
                <p>{item.organization[locale]}</p>
                <small>{item.note[locale]}</small>
              </div>
            </article>
          ))}
        </div>
        <div className="capabilities">
          <p className="eyebrow">{t.skills}</p>
          <div>
            {PROFILE.capabilities[locale].map((skill, index) => (
              <span key={skill}><i>0{index + 1}</i>{skill}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-orbit" aria-hidden="true">
          <span>CURIOUS</span><span>CRAFT</span><span>CLARITY</span>
        </div>
        <div className="about-copy">
          <p className="eyebrow">{t.about}</p>
          <h2>{t.aboutTitle}</h2>
          <p>{t.aboutBody}</p>
        </div>
        <div className="contact-panel" id="contact">
          <div>
            <p className="eyebrow">{t.contact}</p>
            <h3>{t.contactBody}</h3>
          </div>
          <div className="contact-actions">
            <a href="mailto:hello@example.com">{t.email} <span>↗</span></a>
            <button type="button" disabled>{t.resume}</button>
          </div>
        </div>
        <footer>
          <span>© 2026 YOUR NAME</span>
          <span>{t.footer}</span>
          <a href="#ask">BACK TO TOP ↑</a>
        </footer>
      </section>
    </main>
  );
}
