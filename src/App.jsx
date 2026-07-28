import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  DownloadSimple,
  EnvelopeSimple,
  GithubLogo,
  List,
  X,
} from "@phosphor-icons/react";

const FRAME_COUNT = 362;
const HERO_CAMERA_END = 0.88;
const HERO_CHAPTER_STARTS = [0, 0.15, 0.3, 0.46, 0.62, 0.8];

const heroChapters = [
  {
    label: "IDENTITY",
    frame: 0,
    align: "left",
    kicker: "WANG XINLONG / AI ENGINEER + RESEARCHER",
    title: (
      <>
        I build AI agents.
        <br />
        I study how they work with us.
      </>
    ),
    body: "Ph.D. candidate at Doshisha University, working across agent systems, human–AI collaboration, and open-source engineering.",
  },
  {
    label: "THE QUESTION",
    frame: 57,
    align: "right",
    kicker: "FROM SYSTEMS TO RESEARCH",
    title: (
      <>
        After eight years of
        <br />
        building production systems,
        <br />
        I turned to AI research.
      </>
    ),
    body: "That engineering foundation now shapes how I build and study collaborative AI systems.",
  },
  {
    label: "PHD RESEARCH",
    frame: 117,
    align: "right",
    kicker: "COVS / HUMAN–AI TEAMWORK",
    title: (
      <>
        How can agents coordinate
        <br />
        with partners they have never met?
      </>
    ),
    body: "COVS is a Continuous-Space Overcooked Simulator for studying Human–AI teamwork and generalization to unseen partners.",
  },
  {
    label: "GLOBAL ENGINEERING",
    frame: 179,
    align: "right",
    kicker: "OPEN SOURCE / GLOBAL TEAMS",
    title: (
      <>
        Engineering
        <br />
        across borders.
      </>
    ),
    body: "I have contributed to several Microsoft open-source projects and collaborated with global teams across China, the United States, and Japan.",
  },
  {
    label: "SELECTED WORK",
    frame: 254,
    align: "left",
    kicker: "RESEARCH / PRODUCTS / INDEPENDENT BUILDS",
    title: (
      <>
        From research
        <br />
        to real products.
      </>
    ),
    body: "COVS · Stock Ranking Model · AI Teaching Platform · Local Free-Item Exchange",
    href: "#work",
    action: "EXPLORE PROJECTS",
  },
  {
    label: "ABOUT ME",
    frame: 361,
    align: "screen",
    kicker: "THE PERSON BEHIND THE SYSTEMS",
    title: (
      <>
        The work is only
        <br />
        part of the story.
      </>
    ),
    body: "Meet the engineer, researcher, and independent builder behind these systems.",
    action: "ABOUT ME",
  },
];

const roles = ["AI ENGINEER", "AGENT RESEARCHER", "OPEN-SOURCE BUILDER"];

const education = [
  ["2025—2028", "Doshisha University", "Ph.D. · Computer Science"],
  ["2023—2025", "Doshisha University", "M.Sc. · Computer Science"],
  ["2013—2017", "Shanghai Institute of Technology", "B.Sc. · Computer Science"],
];

const experience = [
  {
    period: "2017.01—2018.05",
    company: "Döhler Shanghai",
    role: "IT Engineer · APAC",
    description:
      "Maintained regional infrastructure and SAP/QAD business systems, supported APAC users under SLA requirements, and collaborated with international teams on system upgrades.",
  },
  {
    period: "2018.06—2020.06",
    company: "Wicresoft",
    role: "Software Engineer · Azure SDK",
    description:
      "Worked with the U.S.-based Azure team on Azure Identity and Key Vault features in C#, including mock and end-to-end tests, samples, issue resolution, and developer documentation.",
  },
  {
    period: "2020.06—2022.12",
    company: "Independent Study",
    role: "Computer Science",
    description:
      "Returned home during the pandemic to support family while continuing computer-science study and preparing for graduate school.",
  },
  {
    period: "2022.12—2023.03",
    company: "Dow Shanghai",
    role: "IT Service Engineer",
    description:
      "Supported Microsoft Office, Windows, networks, and data-center infrastructure while handling incidents and service requests under SLA requirements.",
  },
];

const projects = [
  {
    title: "COVS",
    type: "Multi-agent research",
    image: "/assets/project-covs.png",
    href: "#publication",
    copy:
      "A continuous-action Overcooked simulator for human–AI coordination, diffusion-based behavior cloning, and generalization to unseen partners.",
  },
  {
    title: "JOB APPLICATION AGENT",
    type: "LLM agent system",
    image: "/assets/project-job-agent.png",
    href: "#contact",
    copy:
      "A multi-agent workflow for resume analysis, recruiter Q&A, and evaluating personalized cold outreach with the OpenAI SDK.",
  },
  {
    title: "AZURE IDENTITY",
    type: "Open-source engineering",
    image: "/assets/project-azure.png",
    href: "https://github.com/wantedfast/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity",
    copy:
      "Authentication components, tests, samples, and documentation merged into official Microsoft Azure repositories.",
  },
];

const awards = [
  "JASSO Scholarship",
  "Doshisha University Scholarship · S Level",
  "Outstanding Leader of Co-Learning Program",
  "Outstanding Undergraduate Paper",
];

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function framePath(index) {
  return `/assets/hero-sequence-4k/frame-${String(index + 1).padStart(4, "0")}.webp`;
}

function drawCover(canvas, image, focusX = 0.5) {
  if (!canvas || !image?.naturalWidth) return;
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const context = canvas.getContext("2d", { alpha: false });
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const renderWidth = image.naturalWidth * scale;
  const renderHeight = image.naturalHeight * scale;
  const drawX = clamp(width / 2 - renderWidth * focusX, width - renderWidth, 0);
  context.clearRect(0, 0, width, height);
  context.drawImage(
    image,
    drawX,
    (height - renderHeight) / 2,
    renderWidth,
    renderHeight,
  );
}

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.14 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function ScrollSequenceHeroLegacy({ onOpenProfile, role }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const introRef = useRef(null);
  const tailRef = useRef(null);
  const progressRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef = useRef(0);

  useEffect(() => {
    let disposed = false;
    const images = Array.from({ length: FRAME_COUNT }, () => new Image());
    imagesRef.current = images;

    function loadFrame(index) {
      return new Promise((resolve) => {
        const image = images[index];
        image.onload = () => {
          if (!disposed && index === frameRef.current) {
            drawCover(canvasRef.current, image);
          }
          resolve();
        };
        image.onerror = resolve;
        image.src = framePath(index);
      });
    }

    loadFrame(0).then(() => {
      if (!disposed) drawCover(canvasRef.current, images[0]);
    });

    const preload = () => {
      for (let index = 1; index < FRAME_COUNT; index += 1) loadFrame(index);
    };
    const preloadId = window.setTimeout(preload, 60);

    function updateHero() {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / distance);
      const frame = Math.min(FRAME_COUNT - 1, Math.round(progress * (FRAME_COUNT - 1)));

      const image = images[frame];
      if (frame !== frameRef.current || !canvasRef.current?.width) {
        frameRef.current = frame;
        if (image?.complete) drawCover(canvasRef.current, image);
      }

      if (introRef.current) {
        const introOpacity = 1 - clamp(progress / 0.2);
        introRef.current.style.opacity = String(introOpacity);
        introRef.current.style.transform = `translate3d(0, ${progress * -44}px, 0)`;
      }

      if (tailRef.current) {
        const tailProgress = clamp((progress - 0.84) / 0.13);
        tailRef.current.style.opacity = String(tailProgress);
        tailRef.current.style.transform = `translate3d(0, ${(1 - tailProgress) * 18}px, 0)`;
        tailRef.current.style.pointerEvents = tailProgress > 0.8 ? "auto" : "none";
      }

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
    }

    window.addEventListener("scroll", updateHero, { passive: true });
    window.addEventListener("resize", updateHero);
    updateHero();

    return () => {
      disposed = true;
      window.removeEventListener("scroll", updateHero);
      window.removeEventListener("resize", updateHero);
      window.clearTimeout(preloadId);
    };
  }, []);

  return (
    <section className="hero-scroll" id="top" ref={sectionRef}>
      <div className="hero-stage">
        <canvas
          className="hero-canvas"
          ref={canvasRef}
          aria-label="A cinematic camera move from Wang Xinlong to his laptop"
        />
        <div className="hero-shade" />

        <div className="hero-intro" ref={introRef}>
          <div className="hero-meta">
            <span>AI ENGINEER · PHD CANDIDATE</span>
            <span>KYOTO / SHANGHAI</span>
          </div>
          <div className="hero-copy">
            <span className="hero-kicker">WANG XINLONG / PORTFOLIO 2026</span>
            <h1>
              Building agents
              <br />
              that work with us.
            </h1>
            <p>Engineering intelligent systems. Researching better partners.</p>
          </div>
        </div>

        <div className="hero-tail" ref={tailRef}>
          <span>THE SCREEN IS ONLY THE BEGINNING</span>
          <strong>WANG XL</strong>
          <button type="button" onClick={onOpenProfile}>
            ABOUT ME <ArrowRight size={15} weight="bold" />
          </button>
        </div>

        <div className="role-status" aria-live="polite">
          <span>CURRENT MODE</span>
          <strong key={role}>{role}</strong>
        </div>
        <div className="hero-scroll-note">
          <span>SCROLL TO MOVE THE CAMERA</span>
          <ArrowDown size={13} />
        </div>
        <div className="hero-progress">
          <span ref={progressRef} />
        </div>
      </div>
    </section>
  );
}

function ScrollSequenceHero({ onOpenProfile, role }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const chapterRefs = useRef([]);
  const railRefs = useRef([]);
  const sceneLabelRef = useRef(null);
  const progressRef = useRef(null);
  const frameRef = useRef(0);
  const focusRef = useRef(0.5);
  const scrollTweenRef = useRef(null);

  useEffect(() => {
    let disposed = false;
    let preloadTimer;
    let scrollRaf;
    let preloadCursor = 0;
    const scrubState = { progress: 0 };
    const cache = new Map();
    const pending = new Map();
    const chapterFrames = new Set(heroChapters.map((chapter) => chapter.frame));

    function loadFrame(index) {
      if (index < 0 || index >= FRAME_COUNT) return Promise.resolve();
      if (cache.has(index)) return Promise.resolve(cache.get(index));
      if (pending.has(index)) return pending.get(index);

      const promise = new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
          pending.delete(index);
          cache.set(index, image);

          if (cache.size > 64) {
            for (const [cachedIndex, cachedImage] of cache) {
              if (cachedIndex === frameRef.current || chapterFrames.has(cachedIndex)) continue;
              cache.delete(cachedIndex);
              cachedImage.src = "";
              if (cache.size <= 52) break;
            }
          }

          if (!disposed && index === frameRef.current) {
            drawCover(canvasRef.current, image, focusRef.current);
          }
          resolve(image);
        };
        image.onerror = () => {
          pending.delete(index);
          resolve();
        };
        image.src = framePath(index);
      });
      pending.set(index, promise);
      return promise;
    }

    function renderBestAvailable(targetFrame) {
      const exact = cache.get(targetFrame);
      if (exact?.naturalWidth) {
        drawCover(canvasRef.current, exact, focusRef.current);
      } else {
        loadFrame(targetFrame);
        for (let radius = 1; radius < 18; radius += 1) {
          if (cache.has(targetFrame - radius)) {
            drawCover(canvasRef.current, cache.get(targetFrame - radius), focusRef.current);
            break;
          }
          if (cache.has(targetFrame + radius)) {
            drawCover(canvasRef.current, cache.get(targetFrame + radius), focusRef.current);
            break;
          }
        }
      }

      for (let offset = -8; offset <= 14; offset += 1) {
        if (offset !== 0) loadFrame(targetFrame + offset);
      }
    }

    function warmBrowserCache() {
      if (disposed || preloadCursor >= FRAME_COUNT) return;
      const batch = [];
      for (let count = 0; count < 12 && preloadCursor < FRAME_COUNT; count += 1) {
        batch.push(fetch(framePath(preloadCursor), { cache: "force-cache" }).catch(() => undefined));
        preloadCursor += 1;
      }
      Promise.all(batch).finally(() => {
        preloadTimer = window.setTimeout(warmBrowserCache, 90);
      });
    }

    const openingFrames = Array.from({ length: 25 }, (_, index) => index);
    Promise.all([...heroChapters.map((chapter) => loadFrame(chapter.frame)), ...openingFrames.map(loadFrame)]).then(() => {
      if (!disposed) renderBestAvailable(frameRef.current);
    });
    preloadTimer = window.setTimeout(warmBrowserCache, 180);

    function renderHero(progress) {
      const section = sectionRef.current;
      if (!section) return;

      const cameraProgress = clamp(progress / HERO_CAMERA_END);
      const frame = Math.round(cameraProgress * (FRAME_COUNT - 1));
      let activeIndex = 0;
      HERO_CHAPTER_STARTS.forEach((start, index) => {
        if (progress >= start) activeIndex = index;
      });

      focusRef.current =
        window.innerWidth <= 640
          ? 0.42 + 0.08 * (frame / (FRAME_COUNT - 1))
          : 0.5;

      if (frame !== frameRef.current || !canvasRef.current?.width) {
        frameRef.current = frame;
        renderBestAvailable(frame);
      }
      if (canvasRef.current) {
        canvasRef.current.dataset.frame = String(frame);
        canvasRef.current.dataset.cameraProgress = cameraProgress.toFixed(4);
      }
      section.dataset.heroProgress = progress.toFixed(4);

      chapterRefs.current.forEach((node, index) => {
        if (!node) return;
        const start = HERO_CHAPTER_STARTS[index];
        const nextStart = HERO_CHAPTER_STARTS[index + 1] ?? 1;
        const enteringRaw = index === 0 ? 1 : clamp((progress - (start - 0.025)) / 0.05);
        const leavingRaw =
          index === heroChapters.length - 1
            ? 0
            : clamp((progress - (nextStart - 0.025)) / 0.05);
        const entering = enteringRaw * enteringRaw * (3 - 2 * enteringRaw);
        const leaving = leavingRaw * leavingRaw * (3 - 2 * leavingRaw);
        const opacity = entering * (1 - leaving);
        const offset = 22 * (1 - entering) - 14 * leaving;
        const isActive = index === activeIndex;

        node.style.opacity = String(opacity);
        node.style.transform = `translate3d(0, ${offset}px, 0)`;
        node.style.pointerEvents = isActive && opacity > 0.8 ? "auto" : "none";
        node.setAttribute("aria-hidden", isActive ? "false" : "true");
        node.toggleAttribute("inert", !isActive);
      });

      railRefs.current.forEach((node, index) => {
        node?.classList.toggle("is-active", index === activeIndex);
        node?.classList.toggle("is-past", index < activeIndex);
      });

      if (sceneLabelRef.current) {
        sceneLabelRef.current.textContent = heroChapters[activeIndex].label;
      }
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
    }

    function getScrollProgress() {
      const section = sectionRef.current;
      if (!section) return 0;
      const viewport = Math.max(1, window.innerHeight);
      const travel = Math.max(1, section.offsetHeight - viewport);
      return clamp(-section.getBoundingClientRect().top / travel);
    }

    function updateHero({ immediate = false } = {}) {
      const target = getScrollProgress();
      if (immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        scrollTweenRef.current?.kill();
        scrubState.progress = target;
        renderHero(target);
        return;
      }

      scrollTweenRef.current = gsap.to(scrubState, {
        progress: target,
        duration: 1.28,
        ease: "power2.out",
        overwrite: "auto",
        onUpdate: () => renderHero(scrubState.progress),
      });
    }

    function handleScroll() {
      window.cancelAnimationFrame(scrollRaf);
      scrollRaf = window.requestAnimationFrame(() => updateHero());
    }

    function handleResize() {
      updateHero({ immediate: true });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    updateHero({ immediate: true });

    return () => {
      disposed = true;
      scrollTweenRef.current?.kill();
      window.cancelAnimationFrame(scrollRaf);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(preloadTimer);
    };
  }, []);

  return (
    <section className="hero-scroll hero-scroll--chapters" id="top" ref={sectionRef}>
      <div className="hero-stage">
        <canvas
          className="hero-canvas"
          ref={canvasRef}
          aria-label="A cinematic scroll journey through Wang Xinlong's profile and work"
        />
        <div className="hero-shade" />

        <div className="hero-meta">
          <span>AI ENGINEER · RESEARCHER · BUILDER</span>
          <span>KYOTO / SHANGHAI</span>
        </div>

        <div className="hero-chapters">
          {heroChapters.map((chapter, index) => (
            <article
              className={`hero-chapter hero-chapter--${chapter.align}`}
              key={chapter.label}
              ref={(node) => {
                chapterRefs.current[index] = node;
              }}
              aria-hidden={index === 0 ? "false" : "true"}
              style={{ opacity: index === 0 ? 1 : 0 }}
            >
              <span className="hero-kicker">{chapter.kicker}</span>
              <h1>{chapter.title}</h1>
              <p>{chapter.body}</p>
              {chapter.action && chapter.href && (
                <a className="hero-chapter__action" href={chapter.href}>
                  {chapter.action} <ArrowRight size={15} weight="bold" />
                </a>
              )}
              {chapter.action && !chapter.href && (
                <button className="hero-chapter__action" type="button" onClick={onOpenProfile}>
                  {chapter.action} <ArrowRight size={15} weight="bold" />
                </button>
              )}
            </article>
          ))}
        </div>

        <div className="role-status" aria-live="polite">
          <span>CURRENT MODE</span>
          <strong key={role}>{role}</strong>
        </div>
        <div className="hero-scene-rail" aria-hidden="true">
          {heroChapters.map((chapter, index) => (
            <span
              className={index === 0 ? "is-active" : ""}
              key={chapter.label}
              ref={(node) => {
                railRefs.current[index] = node;
              }}
            />
          ))}
        </div>
        <div className="hero-scroll-note">
          <span ref={sceneLabelRef}>IDENTITY</span>
          <span>SCROLL · CINEMATIC SCRUB</span>
          <ArrowDown size={13} />
        </div>
        <div className="hero-progress">
          <span ref={progressRef} />
        </div>
      </div>
    </section>
  );
}

function LanyardProfile({ open, onClose }) {
  const [flipped, setFlipped] = useState(false);
  const modalRef = useRef(null);
  const cordRef = useRef(null);
  const cardRef = useRef(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    suppressClick: false,
    pointerX: 0,
    pointerY: 0,
    originX: 0,
    originY: 0,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (!open) return undefined;
    const modal = modalRef.current;
    const cord = cordRef.current;
    const card = cardRef.current;
    const drag = dragRef.current;

    setFlipped(false);
    Object.assign(drag, {
      active: false,
      moved: false,
      suppressClick: false,
      x: 0,
      y: 0,
    });
    gsap.set(modal, { autoAlpha: 1 });
    gsap.set(cord, { scaleY: 0, transformOrigin: "50% 0%" });
    gsap.set(card, { y: "-110vh", rotation: -13, x: 0 });

    const timeline = gsap.timeline();
    timeline
      .to(cord, { scaleY: 1, duration: 0.7, ease: "power3.out" })
      .to(
        card,
        {
          y: 0,
          rotation: 4,
          duration: 1.05,
          ease: "back.out(1.35)",
        },
        0.15,
      )
      .to(card, { rotation: -2, duration: 0.42, ease: "sine.inOut" })
      .to(card, { rotation: 0, duration: 0.38, ease: "sine.inOut" });

    function handleKey(event) {
      if (event.key === "Escape") onClose();
    }
    document.body.classList.add("profile-open");
    window.addEventListener("keydown", handleKey);

    return () => {
      timeline.kill();
      document.body.classList.remove("profile-open");
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  function updateCord(x, y) {
    const cord = cordRef.current;
    if (!cord) return;
    const length = Math.max(95, 122 + y);
    const angle = Math.atan2(x, length) * (180 / Math.PI) * -1;
    cord.style.height = `${Math.sqrt(length * length + x * x)}px`;
    cord.style.transform = `translateX(-50%) rotate(${angle}deg)`;
  }

  function startDrag(event) {
    if (event.button !== 0 || event.target.closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const state = dragRef.current;
    state.active = true;
    state.moved = false;
    state.suppressClick = false;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    state.originX = state.x;
    state.originY = state.y;
    gsap.killTweensOf(cardRef.current);
  }

  function moveDrag(event) {
    const state = dragRef.current;
    if (!state.active) return;
    const deltaX = event.clientX - state.pointerX;
    const deltaY = event.clientY - state.pointerY;
    if (Math.hypot(deltaX, deltaY) > 7) state.moved = true;
    if (!state.moved) return;

    state.x = clamp(state.originX + deltaX, -260, 260);
    state.y = clamp(state.originY + deltaY, -90, 180);
    gsap.set(cardRef.current, {
      x: state.x,
      y: state.y,
      rotation: state.x * 0.035,
    });
    updateCord(state.x, state.y);
  }

  function endDrag() {
    const state = dragRef.current;
    if (!state.active) return;
    state.active = false;
    state.suppressClick = state.moved;
    gsap.to(state, {
      x: 0,
      y: 0,
      duration: 1.1,
      ease: "elastic.out(1, 0.42)",
      onUpdate: () => {
        gsap.set(cardRef.current, {
          x: state.x,
          y: state.y,
          rotation: state.x * 0.035,
        });
        updateCord(state.x, state.y);
      },
    });
  }

  function flipCard(event) {
    if (event.target.closest("button")) return;
    const state = dragRef.current;
    if (state.suppressClick) {
      state.suppressClick = false;
      return;
    }
    setFlipped((value) => !value);
  }

  function handleCardKey(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setFlipped((value) => !value);
  }

  function visitProfile() {
    onClose();
    window.setTimeout(() => {
      document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
    }, 180);
  }

  if (!open) return null;

  return (
    <div
      className="profile-modal"
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-card-title"
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <button className="profile-backdrop" type="button" onClick={onClose} aria-label="Close profile card" />
      <button className="profile-close" type="button" onClick={onClose} aria-label="Close profile card">
        <X size={22} />
      </button>
      <p className="profile-hint">DRAG · CLICK TO FLIP · ESC TO CLOSE</p>
      <div className="lanyard-cord" ref={cordRef}>
        <span>WANG XINLONG · HUMAN × AI · WANG XINLONG</span>
      </div>
      <article
        className="identity-card"
        ref={cardRef}
        onPointerDown={startDrag}
        onClick={flipCard}
        onKeyDown={handleCardKey}
        tabIndex={0}
      >
        <div className={`identity-card__flip${flipped ? " is-flipped" : ""}`}>
          <section className="identity-card__face identity-card__front" aria-hidden={flipped}>
            <h2 id="profile-card-title" className="sr-only">Wang Xinlong profile card</h2>
            <img
              className="identity-card__exact-front"
              src="/assets/wang-xinlong-card-exact.png"
              alt="Wang Xinlong identity card"
              draggable="false"
            />
          </section>

          <section className="identity-card__face identity-card__back" aria-hidden={!flipped}>
            <div className="identity-card__slot" />
            <div className="identity-card__header">
              <span>PROFILE</span>
              <span>WANG XINLONG</span>
            </div>
            <dl className="identity-card__details">
              <div>
                <dt>CURRENT</dt>
                <dd>Ph.D. Candidate · Doshisha University</dd>
              </div>
              <div>
                <dt>FOCUS</dt>
                <dd>LLM Agents · Human–AI Collaboration · Multi-Agent Learning</dd>
              </div>
              <div>
                <dt>EXPERIENCE</dt>
                <dd>Global engineering · Microsoft open source</dd>
              </div>
              <div>
                <dt>BUILDING</dt>
                <dd>Research systems · AI products · Live apps</dd>
              </div>
            </dl>
            <button type="button" onClick={visitProfile}>
              VIEW FULL PROFILE <ArrowRight size={14} weight="bold" />
            </button>
            <span className="identity-card__flip-hint">CLICK CARD TO RETURN</span>
          </section>
        </div>
      </article>
    </div>
  );
}

function App() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const closeProfile = useCallback(() => setProfileOpen(false), []);
  useReveal();

  useEffect(() => {
    const timer = window.setInterval(
      () => setRoleIndex((value) => (value + 1) % roles.length),
      2200,
    );
    return () => window.clearInterval(timer);
  }, []);

  const year = useMemo(() => new Date().getFullYear(), []);

  function closeMenu() {
    setMenuOpen(false);
  }

  function openProfile(event) {
    event?.preventDefault();
    closeMenu();
    setProfileOpen(true);
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" onClick={closeMenu}>
          <span>王新龙</span>
          <small>WANG XINLONG — 2026</small>
        </a>
        <nav className={menuOpen ? "nav is-open" : "nav"} aria-label="Primary">
          <a href="#about" onClick={openProfile}>ABOUT ME</a>
          <a href="#experience" onClick={closeMenu}>EXPERIENCE</a>
          <a href="#work" onClick={closeMenu}>WORK</a>
          <a href="#contact" onClick={closeMenu}>CONTACT</a>
        </nav>
        <a className="resume-button" href="/Wang-Xinlong-Resume.pdf" download>
          <span>RESUME</span>
          <DownloadSimple size={15} weight="bold" />
        </a>
        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={21} /> : <List size={21} />}
        </button>
      </header>

      <ScrollSequenceHero
        onOpenProfile={() => setProfileOpen(true)}
        role={roles[roleIndex]}
      />

      <section className="manifesto section-pad">
        <span className="section-index" data-reveal>POSITION</span>
        <p data-reveal>
          I build systems that can reason.
          <br />
          I research how they coordinate.
          <br />
          <em>Both begin with people.</em>
        </p>
      </section>

      <section className="about section-pad" id="about">
        <div className="section-label" data-reveal>
          <span>ABOUT / PROFILE</span>
          <span>35.0116° N · 135.7681° E</span>
        </div>
        <div className="about-grid">
          <div className="about-portrait" data-reveal>
            <img src="/assets/wang-xinlong-portrait.png" alt="Portrait of Wang Xinlong" />
            <div>
              <span>WANG XINLONG</span>
              <span>AI ENGINEER · RESEARCHER</span>
            </div>
          </div>
          <div className="about-statement" data-reveal>
            <h2>Engineering intelligence. Researching collaboration.</h2>
            <p>
              AI Engineer and Ph.D. candidate in Computer Science focused on
              LLM-based agents, human–AI collaboration, and multi-agent
              reinforcement learning.
            </p>
            <p>
              Eight years of experience connect software engineering, cloud
              infrastructure, Azure SDK development, authentication, and
              international technical environments.
            </p>
          </div>
        </div>
        <div className="education-list" data-reveal>
          {education.map(([period, school, degree]) => (
            <div key={`${period}-${degree}`}>
              <span>{period}</span>
              <strong>{school}</strong>
              <span>{degree}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="experience section-pad" id="experience">
        <div className="section-label" data-reveal>
          <span>EXPERIENCE / 08+ YEARS</span>
          <span>SHANGHAI · APAC · KYOTO</span>
        </div>
        <div className="experience-heading">
          <span className="section-index" data-reveal>JOURNEY</span>
          <h2 data-reveal>Systems before agents.</h2>
        </div>
        <div className="experience-list">
          {experience.map((item, index) => (
            <article className="experience-row" key={item.period} data-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{item.period}</span>
              <div>
                <h3>{item.company}</h3>
                <strong>{item.role}</strong>
              </div>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="now section-pad">
        <div className="section-label" data-reveal>
          <span>NOW / DOSHISHA UNIVERSITY</span>
          <span>2025—2028</span>
        </div>
        <div className="now-grid">
          <div data-reveal>
            <span>Ph.D. RESEARCH</span>
            <h2>NOW</h2>
          </div>
          <p data-reveal>
            Designing continuous-space coordination environments, diffusion
            behavior cloning, and VLA approaches for unseen partners and new
            cooperative tasks.
          </p>
        </div>
      </section>

      <section className="work section-pad" id="work">
        <div className="section-label" data-reveal>
          <span>FEATURED WORK</span>
          <span>RESEARCH + ENGINEERING</span>
        </div>
        <div className="work-heading">
          <span className="section-index" data-reveal>SYSTEMS</span>
          <h2 data-reveal>Selected work.</h2>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <article className="project" key={project.title} data-reveal>
              <a
                href={project.href}
                target={project.href.startsWith("http") ? "_blank" : undefined}
                rel={project.href.startsWith("http") ? "noreferrer" : undefined}
              >
                <div className="project-image">
                  <img src={project.image} alt="" />
                </div>
                <div className="project-meta">
                  <span>{project.type}</span>
                  <ArrowUpRight size={20} weight="bold" />
                </div>
                <h3>{project.title}</h3>
                <p>{project.copy}</p>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="recognition section-pad" id="publication">
        <div className="section-label" data-reveal>
          <span>PUBLICATION + RECOGNITION</span>
          <span>SELECTED</span>
        </div>
        <article className="publication" data-reveal>
          <span>ACCEPTED · ABC 2026 CONFERENCE</span>
          <h2>A Continuous-Space Overcooked Simulator for Multi-Agent Coordination.</h2>
          <p>Wang Xinlong, et al.</p>
        </article>
        <div className="awards">
          {awards.map((award, index) => (
            <div key={award} data-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{award}</strong>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer-panel">
          <div>
            <span>OPEN TO AI ENGINEERING + RESEARCH</span>
            <h2>Let’s build<br />better agents.</h2>
          </div>
          <a className="email-button" href="mailto:wangfeichen@hotmail.com">
            <EnvelopeSimple size={17} weight="bold" />
            EMAIL WANG
            <ArrowRight size={17} weight="bold" />
          </a>
        </div>
        <div className="footer-grid">
          <div className="footer-brand">
            <span>王新龙</span>
            <small>AI ENGINEER · RESEARCHER</small>
          </div>
          <div>
            <span className="footer-label">NAVIGATION</span>
            <button type="button" onClick={() => setProfileOpen(true)}>About Me</button>
            <a href="#experience">Experience</a>
            <a href="#work">Work</a>
          </div>
          <div>
            <span className="footer-label">CONTACT</span>
            <a href="mailto:wangfeichen@hotmail.com">Email</a>
            <a href="https://github.com/wantedfast" target="_blank" rel="noreferrer">
              <GithubLogo size={15} /> GitHub
            </a>
            <a href="/Wang-Xinlong-Resume.pdf" download>Resume</a>
          </div>
          <div>
            <span className="footer-label">SKILLS</span>
            <span>C# · Python</span>
            <span>LLM Agents</span>
            <span>Azure Identity</span>
            <span>Linux</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} WANG XINLONG</span>
          <span>DESIGNED FOR HUMAN × AI COLLABORATION</span>
        </div>
      </footer>

      <LanyardProfile open={profileOpen} onClose={closeProfile} />
    </main>
  );
}

export { App };
