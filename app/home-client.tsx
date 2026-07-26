"use client";

import {
  ArrowDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Hand,
  Mail,
  Menu,
  Mic2,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { type Locale, type SiteProfile } from "./profile";

type ChatMessage = { role: "user" | "assistant"; content: string };
type HeroMode = "agent" | "gallery";

function chatErrorMessage(locale: Locale, detail: string) {
  if (detail.includes("balance")) {
    return locale === "zh" ? "DeepSeek 账户余额不足，请联系网站管理员充值后再试。" : "The DeepSeek account has insufficient balance.";
  }
  if (detail.includes("key")) {
    return locale === "zh" ? "DeepSeek 密钥无效，请联系网站管理员更新配置。" : "The DeepSeek API key is invalid.";
  }
  if (detail.includes("busy")) {
    return locale === "zh" ? "DeepSeek 当前繁忙，请稍后再试。" : "DeepSeek is busy. Please retry shortly.";
  }
  return locale === "zh" ? "智能体暂时无法连接，请稍后再试。" : "The agent is unavailable right now. Please try again shortly.";
}

const copy = {
  zh: {
    nav: ["对话", "项目", "经历"],
    eyebrow: "沉浸式个人简历智能体",
    title: "不要只读我的简历。",
    titleAccent: "直接问我。",
    intro: "潜在雇主可以从一个问题开始，也可以向下浏览项目与经历。所有回答只引用已核实资料。",
    wake: "点击唤醒。问问我能做什么。",
    browse: "左右浏览我的项目。",
    prompt: "问一个关于我的问题",
    send: "发送",
    suggestions: ["你是谁？", "你最擅长解决什么？", "带我看项目"],
    dockAgent: "你的问题决定入口；我的项目提供证据。",
    dockGallery: "点击任意卡片，进入对应项目。",
    scroll: "继续浏览",
    selected: "SELECTED WORK · 精选项目",
    projectsTitle: "证据，比形容词更有说服力。",
    projectsIntro: "每个项目都连接问题、过程与结果。资料缺失处会明确标记，不用虚构填满页面。",
    viewCase: "展开案例",
    closeCase: "收起案例",
    journey: "JOURNEY · 经历",
    journeyTitle: "从想法到交付的路径。",
    capabilities: "CAPABILITIES · 能力",
    education: "EDUCATION · 教育",
    honors: "HONORS · 荣誉",
    visit: "访问项目链接",
    about: "ABOUT · 关于",
    aboutTitle: "清晰地想，认真地做。",
    aboutBody: "我希望复杂技术最终呈现为简单、有温度、可理解的体验。当前页面已完成视觉与功能框架，正式简历资料接入后，内容与智能体会一起更新。",
    contact: "准备开始一段对话？",
    contactBody: "可以先让智能体回答，也可以补充你的正式联系方式与简历下载。",
    askAi: "询问 AI",
    emailPending: "联系方式待补充",
    resumePending: "简历待接入",
    top: "回到顶部",
    setup: "DeepSeek Key 尚未配置。界面已经可用；接入正式简历与服务端密钥后，我会只依据核实资料回答。",
    error: "智能体暂时无法连接，请稍后再试。",
    menu: "打开导航",
  },
  en: {
    nav: ["Ask", "Work", "Journey"],
    eyebrow: "IMMERSIVE RÉSUMÉ AGENT",
    title: "Don’t just read my résumé.",
    titleAccent: "Ask me.",
    intro: "Employers can begin with a question or scroll through the work. Every answer stays grounded in verified material.",
    wake: "Tap to wake. Ask what I can do.",
    browse: "Browse my work left or right.",
    prompt: "Ask something about me",
    send: "Send",
    suggestions: ["Who are you?", "What do you solve best?", "Show me your work"],
    dockAgent: "Your question sets the direction. My work provides the proof.",
    dockGallery: "Select a card to enter the project.",
    scroll: "Keep exploring",
    selected: "SELECTED WORK",
    projectsTitle: "Evidence speaks louder.",
    projectsIntro: "Each project connects the problem, process, and outcome. Missing facts are marked clearly instead of invented.",
    viewCase: "Open case",
    closeCase: "Close case",
    journey: "JOURNEY",
    journeyTitle: "A path from idea to delivery.",
    capabilities: "CAPABILITIES",
    education: "EDUCATION",
    honors: "HONORS",
    visit: "Visit project link",
    about: "ABOUT",
    aboutTitle: "Think clearly. Make carefully.",
    aboutBody: "I want complex technology to become a simple, warm, understandable experience. The visual and functional system is ready; verified résumé material will update both the page and the agent.",
    contact: "Start a conversation?",
    contactBody: "Ask the agent now, or add your verified contact details and downloadable résumé next.",
    askAi: "Ask the AI",
    emailPending: "Contact details pending",
    resumePending: "Résumé pending",
    top: "Back to top",
    setup: "The DeepSeek key is not configured yet. The interface is ready; after a verified résumé and server-side key are added, I’ll answer only from that source.",
    error: "The agent is unavailable right now. Please try again shortly.",
    menu: "Open navigation",
  },
} as const;

export default function HomeClient({ initialProfile: PROFILE }: { initialProfile: SiteProfile }) {
  const [locale, setLocale] = useState<Locale>("zh");
  const [heroMode, setHeroMode] = useState<HeroMode>("agent");
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    const chatLog = chatEndRef.current?.parentElement;
    if (chatLog) chatLog.scrollTop = chatLog.scrollHeight;
    if (window.scrollY < window.innerHeight) window.scrollTo({ top: 0, behavior: "auto" });
  }, [messages]);

  function moveSlide(direction: number) {
    setActiveSlide((current) => (current + direction + PROFILE.projects.length) % PROFILE.projects.length);
  }

  async function askAgent(question: string) {
    const clean = question.trim().slice(0, 500);
    if (!clean || isLoading) return;
    if (clean === t.suggestions[2]) {
      setHeroMode("gallery");
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, content: clean }];
    setHeroMode("agent");
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-10), locale }),
      });
      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(payload?.error ?? "Chat request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...nextMessages, { role: "assistant", content: answer }]);
      }
      if (!answer.trim()) setMessages([...nextMessages, { role: "assistant", content: t.setup }]);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "";
      setMessages([...nextMessages, { role: "assistant", content: chatErrorMessage(locale, detail) }]);
    } finally {
      setIsLoading(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void askAgent(input);
  }

  function openProject(index: number) {
    setActiveProject(index);
    document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
  }

  const navTargets = ["#ask", "#work", "#journey"];

  return (
    <main>
      <section className="hero" id="ask">
        <div className="hero-shade" aria-hidden="true" />

        <nav className="glass-nav" aria-label="Primary navigation">
          <a className="wordmark" href="#ask" aria-label="Home">{PROFILE.shortName}</a>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            {t.nav.map((item, index) => (
              <a
                key={item}
                href={navTargets[index]}
                className={(index === 0 && heroMode === "agent") || (index === 1 && heroMode === "gallery") ? "active" : ""}
                onClick={(event) => {
                  if (index < 2) {
                    event.preventDefault();
                    setHeroMode(index === 0 ? "agent" : "gallery");
                  }
                  setMenuOpen(false);
                }}
              >
                {item}
              </a>
            ))}
          </div>
          <div className="nav-actions">
            <button className="locale-toggle" type="button" onClick={() => setLocale(locale === "zh" ? "en" : "zh")}>
              {locale === "zh" ? "EN" : "中"}
            </button>
            <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={t.menu}>
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>

        <header className="hero-identity">
          <p>{t.eyebrow}</p>
          <h1>{PROFILE.displayName}</h1>
          <span>{PROFILE.role[locale]}</span>
        </header>

        <div className={`experience-stage mode-${heroMode}`}>
          {heroMode === "agent" ? (
            <div className="agent-view">
              <button
                className={`wake-orb ${isLoading ? "thinking" : ""}`}
                type="button"
                aria-label={t.wake}
                onClick={() => document.querySelector<HTMLInputElement>("#agent-question")?.focus()}
              >
                <span className="orb-shell">
                  <img src={PROFILE.portrait} alt="" />
                  <i><Mic2 strokeWidth={1.5} /></i>
                </span>
                <span className="orb-halo" />
              </button>
              <p className="stage-instruction">{t.wake}</p>
            </div>
          ) : (
            <div className="gallery-view">
              <div className="spatial-carousel" aria-label="Project carousel">
                {PROFILE.projects.map((project, index) => {
                  let offset = index - activeSlide;
                  if (offset > 1) offset -= PROFILE.projects.length;
                  if (offset < -1) offset += PROFILE.projects.length;
                  return (
                    <button
                      className={`spatial-card position-${offset}`}
                      style={{ "--card-offset": offset } as React.CSSProperties}
                      key={project.id}
                      type="button"
                      onClick={() => offset === 0 ? openProject(index) : setActiveSlide(index)}
                      aria-label={project.title[locale]}
                    >
                      <img src={project.image} alt="" />
                      <span>{project.title[locale]}</span>
                    </button>
                  );
                })}
                <button className="carousel-arrow left" type="button" onClick={() => moveSlide(-1)} aria-label="Previous project">
                  <ChevronLeft />
                </button>
                <button className="carousel-arrow right" type="button" onClick={() => moveSlide(1)} aria-label="Next project">
                  <ChevronRight />
                </button>
              </div>
              <p className="stage-instruction"><Hand size={20} />{t.browse}</p>
            </div>
          )}

          {messages.length > 0 && heroMode === "agent" && (
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
        </div>

        <div className="hero-dock">
          <div className="dock-copy">
            <span><Sparkles size={15} />AI PROFILE · ONLINE</span>
            <p>{heroMode === "agent" ? t.dockAgent : t.dockGallery}</p>
          </div>
          {heroMode === "agent" ? (
            <form className="prompt-form" onSubmit={onSubmit}>
              <label className="sr-only" htmlFor="agent-question">{t.prompt}</label>
              <input
                id="agent-question"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={t.prompt}
                maxLength={500}
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !input.trim()} aria-label={t.send}>
                <Send size={17} />
              </button>
            </form>
          ) : (
            <div className="dock-thumbnails">
              {PROFILE.projects.map((project, index) => (
                <button
                  type="button"
                  key={project.id}
                  className={activeSlide === index ? "active" : ""}
                  onClick={() => setActiveSlide(index)}
                  aria-label={project.title[locale]}
                >
                  <img src={project.image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="suggestions">
          {t.suggestions.map((suggestion, index) => (
            <button key={suggestion} type="button" onClick={() => void askAgent(suggestion)} disabled={isLoading}>
              <span>0{index + 1}</span>{suggestion}
            </button>
          ))}
        </div>

        <a className="scroll-cue" href="#work"><span>{t.scroll}</span><ArrowDown /></a>
      </section>

      <section className="work-section" id="work">
        <div className="section-heading">
          <p className="eyebrow">{t.selected}</p>
          <h2>{t.projectsTitle}</h2>
          <p>{t.projectsIntro}</p>
        </div>

        <div className="project-stack">
          {PROFILE.projects.map((project, index) => {
            const isActive = activeProject === index;
            return (
              <article className={`project-card tone-${index + 1}`} key={project.id}>
                <div className="project-visual">
                  <div className="project-number">0{index + 1}</div>
                  <div className="project-image-deck">
                    <span className="image-echo echo-left" />
                    <img src={project.image} alt={project.title[locale]} />
                    <span className="image-echo echo-right" />
                  </div>
                </div>
                <div className="project-copy">
                  <div className="project-meta"><span>{project.year}</span><span>{project.type[locale]}</span></div>
                  <h3>{project.title[locale]}</h3>
                  <p>{project.summary[locale]}</p>
                  <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <button type="button" onClick={() => setActiveProject(isActive ? null : index)} aria-expanded={isActive}>
                    {isActive ? t.closeCase : t.viewCase}
                    {isActive ? <X size={18} /> : <ArrowRight size={18} />}
                  </button>
                  {isActive && (
                    <div className="project-detail">
                      <p>{project.detail[locale]}</p>
                      {project.link && <a href={project.link} target="_blank" rel="noreferrer">{t.visit}<ArrowRight size={15} /></a>}
                    </div>
                  )}
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
          {PROFILE.journey.map((item, index) => (
            <article key={item.period}>
              <span className="timeline-index">0{index + 1}</span>
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
          <p className="eyebrow">{t.capabilities}</p>
          <div>
            {PROFILE.capabilities[locale].map((skill, index) => (
              <span key={skill}><i>0{index + 1}</i>{skill}</span>
            ))}
          </div>
        </div>
        <div className="resume-extras">
          <div>
            <p className="eyebrow">{t.education}</p>
            {PROFILE.education.map((item) => (
              <article key={`${item.school.en}-${item.period}`}>
                <span>{item.period}</span>
                <div><h3>{item.school[locale]}</h3><p>{item.degree[locale]} · {item.field[locale]}</p></div>
              </article>
            ))}
          </div>
          <div>
            <p className="eyebrow">{t.honors}</p>
            {PROFILE.honors[locale].map((honor, index) => <p className="honor-item" key={honor}><i>0{index + 1}</i>{honor}</p>)}
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-orbit" aria-hidden="true"><span>CLARITY</span><span>CRAFT</span><span>CURIOSITY</span></div>
        <div className="about-copy">
          <p className="eyebrow">{t.about}</p>
          <h2>{t.aboutTitle}</h2>
          <p>{PROFILE.about[locale]}</p>
        </div>
        <div className="contact-panel">
          <div>
            <p className="eyebrow">{t.contact}</p>
            <h3>{t.contactBody}</h3>
          </div>
          <div className="contact-actions">
            <a href="#ask"><Sparkles size={18} />{t.askAi}<ArrowRight size={18} /></a>
            <a href={`mailto:${PROFILE.email}`}><Mail size={18} />{PROFILE.email}<ArrowRight size={18} /></a>
            <a href={PROFILE.resumeUrl} download><FileDown size={18} />{locale === "zh" ? "下载英文简历" : "Download résumé"}<ArrowRight size={18} /></a>
          </div>
        </div>
        <footer>
          <span>© 2026 {PROFILE.displayName.toUpperCase()}</span>
          <span>{PROFILE.role[locale]}</span>
          <a href="#ask">{t.top}<ArrowRight size={14} /></a>
        </footer>
      </section>
    </main>
  );
}
