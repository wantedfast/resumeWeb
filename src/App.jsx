import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  ArrowRight,
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  DownloadSimple,
  EnvelopeSimple,
  GithubLogo,
  List,
  X,
} from "@phosphor-icons/react";
import { projects as projectCatalog, projectsBySlug } from "./data/projects.js";
import {
  experiences as experienceCatalog,
  experiencesBySlug,
} from "./data/experience.js";
import { DigitalAssistant } from "./DigitalAssistant.jsx";

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
        I study how they collaborate with humans.
      </>
    ),
    body: "Ph.D. candidate at Doshisha University researching AI agent systems, Human–AI collaboration, and open-source engineering.",
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
    label: "PH.D. RESEARCH",
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
    body: "COVS is a continuous-space Overcooked simulator for studying Human–AI teamwork and generalization to unseen partners.",
  },
  {
    label: "GLOBAL ENGINEERING",
    frame: 179,
    align: "right",
    kicker: "OPEN SOURCE / GLOBAL TEAMS",
    title: (
      <>
        Building Azure SDKs
        <br />
        with teams in China
        <br />
        and the United States.
      </>
    ),
    body: "I contributed to Microsoft open-source projects, including Azure Identity and Key Vault.",
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
    body: "COVS · Job Application Agent · Azure Identity",
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

const education = [
  ["2025—2028", "Doshisha University", "Ph.D. · Computer Science"],
  ["2023—2025", "Doshisha University", "M.Sc. · Computer Science"],
  ["2013—2017", "Shanghai Institute of Technology", "B.Sc. · Computer Science"],
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

function ScrollSequenceHero({ onOpenProfile }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const chapterRefs = useRef([]);
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

      </div>
    </section>
  );
}

function createHorizontalLoop(elements, options = {}) {
  const items = gsap.utils.toArray(elements);
  const times = [];
  const widths = [];
  const xPercents = [];
  const startX = items[0]?.offsetLeft ?? 0;
  const pixelsPerSecond = (options.speed ?? 0.36) * 100;
  const snap = gsap.utils.snap(options.snap ?? 1);
  let currentIndex = 0;

  const timeline = gsap.timeline({
    repeat: options.repeat ?? -1,
    paused: options.paused ?? false,
    defaults: { ease: "none" },
    onReverseComplete() {
      timeline.totalTime(timeline.rawTime() + timeline.duration() * 100);
    },
  });

  items.forEach((item, index) => {
    widths[index] = Number.parseFloat(gsap.getProperty(item, "width", "px"));
    xPercents[index] = snap(
      (Number.parseFloat(gsap.getProperty(item, "x", "px")) / widths[index]) *
        100 +
        Number.parseFloat(gsap.getProperty(item, "xPercent")),
    );
  });

  gsap.set(items, { xPercent: (index) => xPercents[index], x: 0 });

  const lastItem = items.at(-1);
  const totalWidth = lastItem
    ? lastItem.offsetLeft +
      (xPercents.at(-1) / 100) * widths.at(-1) -
      startX +
      lastItem.offsetWidth *
        Number.parseFloat(gsap.getProperty(lastItem, "scaleX")) +
      (options.paddingRight ?? 0)
    : 0;

  items.forEach((item, index) => {
    const currentX = (xPercents[index] / 100) * widths[index];
    const distanceToStart = item.offsetLeft + currentX - startX;
    const distanceToLoop =
      distanceToStart +
      widths[index] * Number.parseFloat(gsap.getProperty(item, "scaleX"));

    timeline
      .to(
        item,
        {
          xPercent: snap(
            ((currentX - distanceToLoop) / widths[index]) * 100,
          ),
          duration: distanceToLoop / pixelsPerSecond,
        },
        0,
      )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((currentX - distanceToLoop + totalWidth) / widths[index]) * 100,
          ),
        },
        {
          xPercent: xPercents[index],
          duration:
            (currentX - distanceToLoop + totalWidth - currentX) /
            pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond,
      )
      .add(`project-${index}`, distanceToStart / pixelsPerSecond);

    times[index] = distanceToStart / pixelsPerSecond;
  });

  function toIndex(index, vars = {}) {
    const targetIndex = gsap.utils.wrap(0, items.length, index);
    let targetTime = times[targetIndex];
    if (
      (targetTime > timeline.time()) !== (targetIndex > currentIndex) &&
      Math.abs(targetIndex - currentIndex) > items.length / 2
    ) {
      targetTime +=
        timeline.duration() * (targetIndex > currentIndex ? 1 : -1);
    }
    currentIndex = targetIndex;
    const tweenVars = { overwrite: true, ...vars };
    if (targetTime < 0 || targetTime > timeline.duration()) {
      tweenVars.modifiers = {
        time: gsap.utils.wrap(0, timeline.duration()),
      };
    }
    return timeline.tweenTo(targetTime, tweenVars);
  }

  timeline.times = times;
  timeline.toIndex = toIndex;
  timeline.next = (vars) => toIndex(currentIndex + 1, vars);
  timeline.previous = (vars) => toIndex(currentIndex - 1, vars);
  timeline.current = () => currentIndex;
  timeline.setCurrent = (index) => {
    currentIndex = gsap.utils.wrap(0, items.length, index);
  };
  timeline.progress(1, true).progress(0, true);
  return timeline;
}

function ProjectCarousel({ items, onAssistantIntro }) {
  const trackRef = useRef(null);
  const loopRef = useRef(null);
  const pauseReasonsRef = useRef(new Set());
  const [activeIndex, setActiveIndex] = useState(0);

  const setPaused = useCallback((reason, paused) => {
    if (paused) pauseReasonsRef.current.add(reason);
    else pauseReasonsRef.current.delete(reason);
    loopRef.current?.paused(pauseReasonsRef.current.size > 0);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      track.classList.add("is-reduced-motion");
      return () => track.classList.remove("is-reduced-motion");
    }

    let rebuildTimer;
    let disposed = false;
    const cards = Array.from(track.querySelectorAll(".project-card"));

    function buildLoop() {
      if (disposed || cards.length === 0) return;
      const preservedIndex = loopRef.current?.current() ?? 0;
      loopRef.current?.kill();
      gsap.set(cards, { clearProps: "transform" });
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
      const loop = createHorizontalLoop(cards, {
        speed: 0.36,
        repeat: -1,
        paddingRight: gap,
      });
      loopRef.current = loop;
      loop.toIndex(preservedIndex, { duration: 0 });
      loop.paused(pauseReasonsRef.current.size > 0);
      loop.eventCallback("onUpdate", () => {
        const duration = loop.duration();
        const time = loop.time();
        let closest = 0;
        let smallestDistance = Number.POSITIVE_INFINITY;
        loop.times.forEach((labelTime, index) => {
          const directDistance = Math.abs(labelTime - time);
          const wrappedDistance = Math.min(
            directDistance,
            Math.abs(duration - directDistance),
          );
          if (wrappedDistance < smallestDistance) {
            smallestDistance = wrappedDistance;
            closest = index;
          }
        });
        loop.setCurrent(closest);
        setActiveIndex((current) => (current === closest ? current : closest));
      });
    }

    buildLoop();
    const resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(rebuildTimer);
      rebuildTimer = window.setTimeout(buildLoop, 140);
    });
    resizeObserver.observe(track);

    function handleVisibilityChange() {
      setPaused("visibility", document.hidden);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      disposed = true;
      window.clearTimeout(rebuildTimer);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      loopRef.current?.kill();
      loopRef.current = null;
      gsap.set(cards, { clearProps: "transform" });
    };
  }, [items.length, setPaused]);

  function moveToProject(direction) {
    const loop = loopRef.current;
    if (!loop) {
      const targetIndex = gsap.utils.wrap(
        0,
        items.length,
        activeIndex + direction,
      );
      trackRef.current?.children[targetIndex]?.scrollIntoView({
        behavior: "auto",
        block: "nearest",
        inline: "start",
      });
      setActiveIndex(targetIndex);
      return;
    }
    loop.pause();
    loop.toIndex(activeIndex + direction, {
      duration: 0.65,
      ease: "power2.inOut",
      onComplete: () => {
        setActiveIndex(loop.current());
        loop.paused(pauseReasonsRef.current.size > 0);
      },
    });
  }

  function handleTrackKeyDown(event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    moveToProject(event.key === "ArrowRight" ? 1 : -1);
  }

  function updateSpotlight(event) {
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <div className="project-carousel">
      <div className="project-carousel__controls" data-reveal>
        <span aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(items.length).padStart(2, "0")}
        </span>
        <div>
          <button
            type="button"
            aria-label="Show previous project"
            onClick={() => moveToProject(-1)}
          >
            <CaretLeft size={19} weight="bold" />
          </button>
          <button
            type="button"
            aria-label="Show next project"
            onClick={() => moveToProject(1)}
          >
            <CaretRight size={19} weight="bold" />
          </button>
        </div>
      </div>
      <div
        className="project-track"
        ref={trackRef}
        role="region"
        aria-label="Selected projects"
        tabIndex={0}
        onKeyDown={handleTrackKeyDown}
        onPointerEnter={() => setPaused("hover", true)}
        onPointerLeave={() => setPaused("hover", false)}
        onFocusCapture={() => setPaused("focus", true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setPaused("focus", false);
          }
        }}
      >
        {items.map((project) => (
          <article className="project-card" key={project.slug}>
            <a
              className="project-card__link"
              href={`/projects/${project.slug}`}
              aria-label={`View the ${project.title} project`}
              onPointerMove={updateSpotlight}
              onPointerEnter={(event) => {
                event.currentTarget.classList.add("is-previewed");
                onAssistantIntro?.(project.assistantIntro);
              }}
              onPointerLeave={(event) => {
                event.currentTarget.classList.remove("is-previewed");
                onAssistantIntro?.("");
              }}
              onFocus={() => onAssistantIntro?.(project.assistantIntro)}
              onBlur={() => onAssistantIntro?.("")}
            >
              <div className="project-image">
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
                <div className="project-card__glare" aria-hidden="true" />
                <div className="project-card__preview">
                  <span>{project.type}</span>
                  <p>{project.summary}</p>
                  <strong>
                    View project <ArrowUpRight size={15} weight="bold" />
                  </strong>
                </div>
              </div>
              <div className="project-meta">
                <span>{project.type}</span>
                <ArrowUpRight size={20} weight="bold" aria-hidden="true" />
              </div>
              <h3>{project.title}</h3>
            </a>
          </article>
        ))}
      </div>
    </div>
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
      <button className="profile-backdrop" type="button" onClick={onClose} aria-label="Dismiss profile card" />
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

function PortfolioHome({ onAssistantIntro }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const closeProfile = useCallback(() => setProfileOpen(false), []);
  useReveal();

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
          <span>WANG XL</span>
          <small>PORTFOLIO — 2026</small>
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

      <ScrollSequenceHero onOpenProfile={() => setProfileOpen(true)} />

      <section className="manifesto section-pad">
        <p data-reveal>
          I build AI agents that plan, coordinate, and act.
          <br />
          <em>I use AI to help people in their daily lives.</em>
        </p>
      </section>

      <section className="about section-pad" id="about">
        <div className="section-label" data-reveal>
          <span>ABOUT / PROFILE</span>
          <span>35.0116° N · 135.7681° E</span>
        </div>
        <div className="about-grid">
          <div className="about-portrait" data-reveal>
            <div className="about-portrait__card-photo">
              <img
                src="/assets/wang-xinlong-portrait-selected.png"
                alt="Portrait of Wang Xinlong"
              />
            </div>
            <div>
              <span>WANG XINLONG</span>
              <span>AI ENGINEER · RESEARCHER</span>
            </div>
          </div>
          <div className="about-statement" data-reveal>
            <h2>Building intelligent systems. Studying Human–AI collaboration.</h2>
            <p>
              AI engineer and Ph.D. candidate in computer science focused on
              LLM agents, Human–AI collaboration, and multi-agent
              reinforcement learning.
            </p>
            <p>
              Eight years of experience across software engineering, cloud
              infrastructure, Azure SDK development, authentication, and
              international technical teams inform this research.
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
          <span>WORK EXPERIENCE / 08+ YEARS</span>
          <span>SHANGHAI · APAC · KYOTO</span>
        </div>
        <div className="experience-heading">
          <h2 data-reveal>Work experience</h2>
        </div>
        <div className="experience-list">
          {experienceCatalog.map((item, index) => (
            <a
              className="experience-row"
              href={`/experience/${item.slug}`}
              key={item.slug}
              data-reveal
              aria-label={`View details for ${item.role} at ${item.company}`}
              onPointerEnter={() => onAssistantIntro?.(item.assistantIntro)}
              onPointerLeave={() => onAssistantIntro?.("")}
              onFocus={() => onAssistantIntro?.(item.assistantIntro)}
              onBlur={() => onAssistantIntro?.("")}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{item.period}</span>
              <div className="experience-row__role">
                <h3>{item.company}</h3>
                <strong>{item.role}</strong>
                <span className="experience-row__action">
                  VIEW DETAILS <ArrowUpRight size={14} weight="bold" />
                </span>
              </div>
              <p>{item.description}</p>
            </a>
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
            Researching Human–AI collaboration with world models, focusing on
            how AI agents infer human cooperative intent from actions and
            interaction dynamics.
          </p>
        </div>
      </section>

      <section className="work section-pad" id="work">
        <div className="section-label" data-reveal>
          <span>FEATURED WORK</span>
          <span>RESEARCH + ENGINEERING</span>
        </div>
        <div className="work-heading">
          <h2 data-reveal>Selected work</h2>
        </div>
        <ProjectCarousel
          items={projectCatalog}
          onAssistantIntro={onAssistantIntro}
        />
      </section>

      <section className="recognition section-pad" id="publication">
        <div className="section-label" data-reveal>
          <span>RESEARCH OUTPUT</span>
          <span>2026</span>
        </div>
        <h2 className="publication-heading" data-reveal>PUBLICATIONS</h2>
        <article className="publication" data-reveal>
          <span className="publication-number">01</span>
          <div className="publication-copy">
            <span>PUBLISHED · IJABC · 2026</span>
            <h3>A Continuous-Space Overcooked Simulator for Multi-Agent Coordination</h3>
            <p>Xinlong Wang · Kota Toyoda · Miho Ohsaki · Kimiaki Shirahama</p>
            <p>International Journal of Activity and Behavior Computing</p>
          </div>
          <a
            className="publication-link"
            href="https://www.jstage.jst.go.jp/article/ijabc/2026/1/2026_144/_pdf/-char/ja"
            target="_blank"
            rel="noreferrer"
          >
            VIEW PAPER <ArrowUpRight size={14} weight="bold" />
          </a>
        </article>
        <h2 className="recognition-heading" data-reveal>RECOGNITION</h2>
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
            <span>WANG XL</span>
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

function ExperienceDetailPage({ experience }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${experience.role} at ${experience.company} / Wang Xinlong`;
    window.scrollTo(0, 0);
    return () => {
      document.title = previousTitle;
    };
  }, [experience]);

  return (
    <main className="project-page experience-page">
      <header className="project-page__header">
        <a className="wordmark" href="/">
          <span>WANG XL</span>
          <small>EXPERIENCE INDEX</small>
        </a>
        <a className="project-page__back" href="/#experience">
          <CaretLeft size={16} weight="bold" />
          BACK TO WORK EXPERIENCE
        </a>
      </header>

      <div className="project-page__layout">
        <aside className="project-page__sidebar">
          <div className="project-page__sidebar-intro">
            <span>WORK EXPERIENCE</span>
            <strong>{experience.period}</strong>
          </div>
          <nav aria-label="Work experience index">
            {experienceCatalog.map((item, index) => (
              <a
                className={item.slug === experience.slug ? "is-active" : ""}
                href={`/experience/${item.slug}`}
                aria-current={
                  item.slug === experience.slug ? "page" : undefined
                }
                key={item.slug}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.company}</strong>
              </a>
            ))}
          </nav>
        </aside>

        <article className="project-page__content">
          <header className="project-page__intro">
            <div className="project-page__eyebrow">
              <span>{experience.role}</span>
              <span>{experience.period}</span>
            </div>
            <h1>{experience.company}</h1>
            <p>{experience.description}</p>
          </header>

          <section className="project-page__section project-page__section--lead">
            <span>CONTEXT</span>
            <p>{experience.context}</p>
          </section>

          <div className="project-page__split">
            <section className="project-page__section">
              <span>WHAT I DID</span>
              <ul className="project-page__list">
                {experience.responsibilities.map((responsibility) => (
                  <li key={responsibility}>{responsibility}</li>
                ))}
              </ul>
            </section>

            <section className="project-page__section">
              <span>CONTRIBUTION</span>
              <ul className="project-page__list">
                {experience.contributions.map((contribution) => (
                  <li key={contribution}>{contribution}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="project-page__section">
            <span>WORKING ENVIRONMENT</span>
            <div className="project-page__tags">
              {experience.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </section>

          <footer className="project-page__footer">
            <div>
              <span>ROLE</span>
              <strong>{experience.role}</strong>
            </div>
            <div className="experience-page__meta">
              <span>LOCATION</span>
              <strong>{experience.location}</strong>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}

function ProjectDetailPage({ project }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${project.title} / Wang Xinlong`;
    window.scrollTo(0, 0);
    return () => {
      document.title = previousTitle;
    };
  }, [project]);

  return (
    <main className="project-page">
      <header className="project-page__header">
        <a className="wordmark" href="/">
          <span>WANG XL</span>
          <small>PROJECT INDEX</small>
        </a>
        <a className="project-page__back" href="/#work">
          <CaretLeft size={16} weight="bold" />
          BACK TO SELECTED WORK
        </a>
      </header>

      <div className="project-page__layout">
        <aside className="project-page__sidebar">
          <div className="project-page__sidebar-intro">
            <span>SELECTED WORK</span>
            <strong>{project.status}</strong>
          </div>
          <nav aria-label="Project index">
            {projectCatalog.map((item, index) => (
              <a
                className={item.slug === project.slug ? "is-active" : ""}
                href={`/projects/${item.slug}`}
                aria-current={item.slug === project.slug ? "page" : undefined}
                key={item.slug}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}</strong>
              </a>
            ))}
          </nav>
        </aside>

        <article className="project-page__content">
          <header className="project-page__intro">
            <div className="project-page__eyebrow">
              <span>{project.type}</span>
              <span>{project.status}</span>
            </div>
            <h1>{project.title}</h1>
            <p>{project.summary}</p>
          </header>

          <section className="project-page__section project-page__section--lead">
            <span>CONTEXT</span>
            <p>{project.context}</p>
          </section>

          <section className="project-page__section project-page__section--lead">
            <span>THE PROBLEM</span>
            <p>{project.problem}</p>
          </section>

          <section className="project-page__section">
            <span>WORKFLOW</span>
            <ol className="project-page__workflow">
              {project.workflow.map((step, index) => (
                <li key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h2>{step.title}</h2>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="project-page__split">
            <section className="project-page__section">
              <span>CORE CAPABILITIES</span>
              <ul className="project-page__list">
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>

            <section className="project-page__section">
              <span>MY CONTRIBUTION</span>
              <ul className="project-page__list">
                {project.contribution.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="project-page__section">
            <span>TECHNICAL DECISIONS</span>
            <div className="project-page__decisions">
              {project.technicalDecisions.map((decision, index) => (
                <article key={decision.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h2>{decision.title}</h2>
                  <p>{decision.body}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="project-page__split project-page__split--footer">
            <section className="project-page__section">
              <span>TECHNOLOGY</span>
              <div className="project-page__tags">
                {project.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </section>

            <section className="project-page__section">
              <span>CURRENT LIMITS</span>
              <ul className="project-page__list">
                {project.limitations.map((limitation) => (
                  <li key={limitation}>{limitation}</li>
                ))}
              </ul>
            </section>
          </div>

          <footer className="project-page__footer">
            <div>
              <span>PROJECT STATUS</span>
              <strong>{project.status}</strong>
            </div>
            {project.links.length > 0 && (
              <div className="project-page__links">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label} <ArrowUpRight size={16} weight="bold" />
                  </a>
                ))}
              </div>
            )}
          </footer>
        </article>
      </div>
    </main>
  );
}

function ProjectNotFound() {
  return (
    <main className="project-not-found">
      <span>404 / PROJECT NOT FOUND</span>
      <h1>This project is not in the selected work index.</h1>
      <a href="/#work">
        <CaretLeft size={16} weight="bold" />
        RETURN TO SELECTED WORK
      </a>
    </main>
  );
}

function ExperienceNotFound() {
  return (
    <main className="project-not-found">
      <span>404 / EXPERIENCE NOT FOUND</span>
      <h1>This role is not in the work experience index.</h1>
      <a href="/#experience">
        <CaretLeft size={16} weight="bold" />
        RETURN TO WORK EXPERIENCE
      </a>
    </main>
  );
}

function App() {
  const [assistantIntro, setAssistantIntro] = useState("");
  let pageContent;
  let pageContext = { kind: "home", slug: null };

  const projectMatch = window.location.pathname.match(
    /^\/projects\/([^/]+)\/?$/,
  );
  if (projectMatch) {
    let projectSlug;
    try {
      projectSlug = decodeURIComponent(projectMatch[1]);
    } catch {
      pageContent = <ProjectNotFound />;
    }
    if (!pageContent) {
      const project = projectsBySlug[projectSlug];
      pageContext = { kind: "project", slug: projectSlug };
      pageContent = project ? (
        <ProjectDetailPage project={project} />
      ) : (
        <ProjectNotFound />
      );
    }
  }

  const experienceMatch = window.location.pathname.match(
    /^\/experience\/([^/]+)\/?$/,
  );
  if (!pageContent && experienceMatch) {
    let experienceSlug;
    try {
      experienceSlug = decodeURIComponent(experienceMatch[1]);
    } catch {
      pageContent = <ExperienceNotFound />;
    }
    if (!pageContent) {
      const experience = experiencesBySlug[experienceSlug];
      pageContext = { kind: "experience", slug: experienceSlug };
      pageContent = experience ? (
        <ExperienceDetailPage experience={experience} />
      ) : (
        <ExperienceNotFound />
      );
    }
  }

  if (!pageContent) {
    pageContent = <PortfolioHome onAssistantIntro={setAssistantIntro} />;
  }

  return (
    <>
      {pageContent}
      <DigitalAssistant
        hoverIntro={assistantIntro}
        pageContext={pageContext}
      />
    </>
  );
}

export { App };
