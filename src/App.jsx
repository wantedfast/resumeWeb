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
  Translate,
  X,
} from "@phosphor-icons/react";
import { projects as projectCatalog, projectsBySlug } from "./data/projects.js";
import {
  experiences as experienceCatalog,
  experiencesBySlug,
} from "./data/experience.js";
import { DigitalAssistant } from "./DigitalAssistant.jsx";
import {
  awardsByLocale,
  educationByLocale,
  getLocalizedCatalog,
  heroByLocale,
  siteCopy,
} from "./site-locales.js";
import { stripBasePath, withBasePath } from "./base-path.js";

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
        I build AI agents
        <br />
        I study how they collaborate with humans
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
        I turned to AI research
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
        and the United States
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
        to real products
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
        part of the story
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
  return withBasePath(
    `/assets/hero-sequence-4k/frame-${String(index + 1).padStart(4, "0")}.webp`,
  );
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

function ScrollSequenceHero({
  onOpenProfile,
  onHeroActiveChange,
  onHeroScrollActivity,
  locale,
  copy,
}) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const chapterRefs = useRef([]);
  const frameRef = useRef(0);
  const focusRef = useRef(0.5);
  const scrollTweenRef = useRef(null);
  const heroActiveRef = useRef(true);

  useEffect(() => {
    let disposed = false;
    let preloadTimer;
    let scrollRaf;
    let scrollIdleTimer;
    let preloadCursor = 0;
    let scrollDistance = 0;
    let scrollActivityLatched = false;
    let lastScrollY = window.scrollY;
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
      const section = sectionRef.current;
      if (section) {
        const rect = section.getBoundingClientRect();
        const heroActive = rect.bottom > 0 && rect.top < window.innerHeight;
        if (heroActive !== heroActiveRef.current) {
          heroActiveRef.current = heroActive;
          onHeroActiveChange?.(heroActive);
        }
      }
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
      const nextScrollY = window.scrollY;
      const delta = Math.abs(nextScrollY - lastScrollY);
      lastScrollY = nextScrollY;
      if (heroActiveRef.current) {
        scrollDistance += delta;
        if (scrollDistance >= 24 && !scrollActivityLatched) {
          scrollActivityLatched = true;
          scrollDistance = 0;
          onHeroScrollActivity?.();
        }
      } else {
        scrollDistance = 0;
      }
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        scrollActivityLatched = false;
      }, 180);
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
      window.clearTimeout(scrollIdleTimer);
    };
  }, [onHeroActiveChange, onHeroScrollActivity]);

  return (
    <section className="hero-scroll hero-scroll--chapters" id="top" ref={sectionRef}>
      <div className="hero-stage">
        <canvas
          className="hero-canvas"
          ref={canvasRef}
          aria-label={copy.hero.aria}
        />
        <div className="hero-shade" />

        <div className="hero-meta">
          <span>{copy.hero.meta}</span>
          <span>{copy.hero.location}</span>
        </div>

        <div className="hero-chapters">
          {heroChapters.map((chapter, index) => {
            const localized = heroByLocale[locale][index];
            return (
            <article
              className={`hero-chapter hero-chapter--${chapter.align}`}
              key={chapter.label}
              ref={(node) => {
                chapterRefs.current[index] = node;
              }}
              aria-hidden={index === 0 ? "false" : "true"}
              style={{ opacity: index === 0 ? 1 : 0 }}
            >
              <span className="hero-kicker">{localized.kicker}</span>
              <h1>
                {localized.titleLines.map((line, lineIndex) => (
                  <span key={line}>
                    {line}
                    {lineIndex < localized.titleLines.length - 1 && <br />}
                  </span>
                ))}
              </h1>
              <p>{localized.body}</p>
              {chapter.action && chapter.href && (
                <a className="hero-chapter__action" href={chapter.href}>
                  {localized.action} <ArrowRight size={15} weight="bold" />
                </a>
              )}
              {chapter.action && !chapter.href && (
                <button className="hero-chapter__action" type="button" onClick={onOpenProfile}>
                  {localized.action} <ArrowRight size={15} weight="bold" />
                </button>
              )}
            </article>
            );
          })}
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
    timeline.navigationTween?.kill();
    const navigationTween = timeline.tweenTo(targetTime, tweenVars);
    timeline.navigationTween = navigationTween;
    return navigationTween;
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

function ProjectCarousel({ items, onAssistantIntro, locale }) {
  const trackRef = useRef(null);
  const loopRef = useRef(null);
  const loopInstancesRef = useRef(new Set());
  const pauseReasonsRef = useRef(new Set());
  const [activeIndex, setActiveIndex] = useState(0);

  const setPaused = useCallback((reason, paused) => {
    if (paused) pauseReasonsRef.current.add(reason);
    else pauseReasonsRef.current.delete(reason);
    const shouldPause = pauseReasonsRef.current.size > 0;
    if (trackRef.current) {
      trackRef.current.dataset.paused = shouldPause ? "true" : "false";
    }
    loopInstancesRef.current.forEach((loop) => {
      if (shouldPause) {
        loop.navigationTween?.pause();
        loop.pause();
      } else {
        loop.navigationTween?.resume();
        loop.play();
      }
    });
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

    function updateCardEdgeStates() {
      const viewportWidth = document.documentElement.clientWidth;
      cards.forEach((card) => {
        const bounds = card.getBoundingClientRect();
        const isClipped = bounds.left < 0 || bounds.right > viewportWidth;
        card.classList.toggle("is-edge-clipped", isClipped);
      });
    }

    function buildLoop() {
      if (disposed || cards.length === 0) return;
      const preservedIndex = loopRef.current?.current() ?? 0;
      loopInstancesRef.current.forEach((loop) => loop.kill());
      loopInstancesRef.current.clear();
      gsap.set(cards, { clearProps: "transform" });
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
      const loop = createHorizontalLoop(cards, {
        speed: 0.36,
        repeat: -1,
        paddingRight: gap,
      });
      loopRef.current = loop;
      loopInstancesRef.current.add(loop);
      loop.setCurrent(preservedIndex);
      loop.time(loop.times[preservedIndex] ?? 0, true);
      loop.paused(pauseReasonsRef.current.size > 0);
      loop.eventCallback("onUpdate", () => {
        updateCardEdgeStates();
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
      loopInstancesRef.current.forEach((loop) => loop.kill());
      loopInstancesRef.current.clear();
      loopRef.current = null;
      cards.forEach((card) => card.classList.remove("is-edge-clipped"));
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
            aria-label={locale === "zh" ? "显示上一个项目" : "Show previous project"}
            onClick={() => moveToProject(-1)}
          >
            <CaretLeft size={19} weight="bold" />
          </button>
          <button
            type="button"
            aria-label={locale === "zh" ? "显示下一个项目" : "Show next project"}
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
        aria-label={locale === "zh" ? "精选项目" : "Selected projects"}
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
              href={withBasePath(`/projects/${project.slug}`)}
              aria-label={
                locale === "zh"
                  ? `查看 ${project.title} 项目`
                  : `View the ${project.title} project`
              }
              onPointerEnter={(event) => {
                event.currentTarget.classList.add("is-previewed");
                onAssistantIntro?.({
                  id: `project:${project.slug}`,
                });
              }}
              onPointerLeave={(event) => {
                event.currentTarget.classList.remove("is-previewed");
                onAssistantIntro?.(null);
              }}
              onFocus={() =>
                onAssistantIntro?.({
                  id: `project:${project.slug}`,
                })
              }
              onBlur={() => onAssistantIntro?.(null)}
            >
              <div className="project-image">
                <img
                  src={withBasePath(project.image)}
                  alt={project.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
                <div className="project-card__glare" aria-hidden="true" />
                <div className="project-card__preview">
                  <span>{project.type}</span>
                  <p>{project.summary}</p>
                  <strong>
                    {locale === "zh" ? "查看项目" : "View project"}{" "}
                    <ArrowUpRight size={15} weight="bold" />
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

function LanyardProfile({ open, onClose, locale, copy }) {
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
      <button className="profile-backdrop" type="button" onClick={onClose} aria-label={copy.profile.dismiss} />
      <button className="profile-close" type="button" onClick={onClose} aria-label={copy.profile.close}>
        <X size={22} />
      </button>
      <p className="profile-hint">{copy.profile.hint}</p>
      <div className="lanyard-cord" ref={cordRef}>
        <span>
          {locale === "zh"
            ? "王欣隆 · 人类 × AI · 王欣隆"
            : "WANG XINLONG · HUMAN × AI · WANG XINLONG"}
        </span>
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
            <h2 id="profile-card-title" className="sr-only">{copy.profile.title}</h2>
            <img
              className="identity-card__exact-front"
              src={withBasePath("/assets/wang-xinlong-card-exact.png")}
              alt={copy.profile.alt}
              draggable="false"
            />
          </section>

          <section className="identity-card__face identity-card__back" aria-hidden={!flipped}>
            <div className="identity-card__slot" />
            <div className="identity-card__header">
              <span>PROFILE</span>
              <span>{locale === "zh" ? "王欣隆" : "WANG XINLONG"}</span>
            </div>
            <dl className="identity-card__details">
              <div>
                <dt>{copy.profile.current}</dt>
                <dd>{copy.profile.currentValue}</dd>
              </div>
              <div>
                <dt>{copy.profile.focus}</dt>
                <dd>{copy.profile.focusValue}</dd>
              </div>
              <div>
                <dt>{copy.profile.experience}</dt>
                <dd>{copy.profile.experienceValue}</dd>
              </div>
              <div>
                <dt>{copy.profile.building}</dt>
                <dd>{copy.profile.buildingValue}</dd>
              </div>
            </dl>
            <button type="button" onClick={visitProfile}>
              {copy.profile.view} <ArrowRight size={14} weight="bold" />
            </button>
            <span className="identity-card__flip-hint">{copy.profile.return}</span>
          </section>
        </div>
      </article>
    </div>
  );
}

function PortfolioHome({
  onAssistantIntro,
  onHeroActiveChange,
  onHeroScrollActivity,
  locale,
  onLocaleToggle,
  copy,
  experiences,
  projects,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const manifestoLead =
    locale === "zh" ? copy.manifesto[0].split(" AI ") : null;
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
          <a href="#about" onClick={openProfile}>{copy.nav.about}</a>
          <a href="#experience" onClick={closeMenu}>{copy.nav.experience}</a>
          <a href="#work" onClick={closeMenu}>{copy.nav.work}</a>
          <a href="#contact" onClick={closeMenu}>{copy.nav.contact}</a>
        </nav>
        <div className="header-actions">
          <button
            className="language-toggle"
            type="button"
            onClick={onLocaleToggle}
            aria-label={
              locale === "zh"
                ? "Switch website to English"
                : "将网站切换为中文"
            }
          >
            <Translate size={15} weight="bold" />
            {copy.nav.switchLanguage}
          </button>
          <a
            className="resume-button"
            href={withBasePath("/Wang-Xinlong-Resume.pdf")}
            download
          >
            <span>{copy.nav.resume}</span>
            <DownloadSimple size={15} weight="bold" />
          </a>
        </div>
        <button
          className="menu-button"
          type="button"
          aria-label={copy.nav.menu}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={21} /> : <List size={21} />}
        </button>
      </header>

      <ScrollSequenceHero
        onOpenProfile={() => setProfileOpen(true)}
        onHeroActiveChange={onHeroActiveChange}
        onHeroScrollActivity={onHeroScrollActivity}
        locale={locale}
        copy={copy}
      />

      <section className="manifesto section-pad">
        <p data-reveal>
          <span>
            {manifestoLead ? (
              <>
                {manifestoLead[0]}
                <br />
                AI {manifestoLead[1]}
              </>
            ) : (
              copy.manifesto[0]
            )}
          </span>
          <em>{copy.manifesto[1]}</em>
        </p>
      </section>

      <section className="about section-pad" id="about">
        <div className="section-label" data-reveal>
          <span>{copy.about.label}</span>
          <span>{copy.about.coordinates}</span>
        </div>
        <div className="about-grid">
          <div className="about-portrait" data-reveal>
            <div className="about-portrait__card-photo">
              <img
                src={withBasePath(
                  "/assets/wang-xinlong-portrait-selected.png",
                )}
                alt={copy.about.portraitAlt}
              />
            </div>
            <div>
              <span>{copy.about.name}</span>
              <span>{copy.about.role}</span>
            </div>
          </div>
          <div className="about-statement" data-reveal>
            <h2>{copy.about.heading}</h2>
            {copy.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="education-list" data-reveal>
          {educationByLocale[locale].map(([period, school, degree]) => (
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
          <span>{copy.experience.label}</span>
          <span>{copy.experience.location}</span>
        </div>
        <div className="experience-heading">
          <h2 data-reveal>{copy.experience.heading}</h2>
        </div>
        <div className="experience-list">
          {experiences.map((item, index) => (
            <a
              className="experience-row"
              href={withBasePath(`/experience/${item.slug}`)}
              key={item.slug}
              data-reveal
              aria-label={
                locale === "zh"
                  ? `查看 ${item.company} 的 ${item.role} 经历`
                  : `View details for ${item.role} at ${item.company}`
              }
              onPointerEnter={() =>
                onAssistantIntro?.({
                  id: `experience:${item.slug}`,
                })
              }
              onPointerLeave={() => onAssistantIntro?.(null)}
              onFocus={() =>
                onAssistantIntro?.({
                  id: `experience:${item.slug}`,
                })
              }
              onBlur={() => onAssistantIntro?.(null)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{item.period}</span>
              <div className="experience-row__role">
                <h3>{item.company}</h3>
                <strong>{item.role}</strong>
                <span className="experience-row__action">
                  {copy.experience.details}{" "}
                  <ArrowUpRight size={14} weight="bold" />
                </span>
              </div>
              <p>{item.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="now section-pad">
        <div className="section-label" data-reveal>
          <span>{copy.now.label}</span>
          <span>{copy.now.period}</span>
        </div>
        <div className="now-grid">
          <div data-reveal>
            <span>{copy.now.type}</span>
            <h2>{copy.now.heading}</h2>
          </div>
          <p data-reveal>{copy.now.body}</p>
        </div>
      </section>

      <section className="work section-pad" id="work">
        <div className="section-label" data-reveal>
          <span>{copy.work.label}</span>
          <span>{copy.work.type}</span>
        </div>
        <div className="work-heading">
          <h2 data-reveal>{copy.work.heading}</h2>
        </div>
        <ProjectCarousel
          items={projects}
          onAssistantIntro={onAssistantIntro}
          locale={locale}
        />
      </section>

      <section className="recognition section-pad" id="publication">
        <div className="section-label" data-reveal>
          <span>{copy.research.label}</span>
          <span>2026</span>
        </div>
        <h2 className="publication-heading" data-reveal>{copy.research.publications}</h2>
        <article className="publication" data-reveal>
          <span className="publication-number">01</span>
          <div className="publication-copy">
            <span>{copy.research.published}</span>
            <h3>{copy.research.paper}</h3>
            <p>{copy.research.authors}</p>
            <p>{copy.research.venue}</p>
          </div>
          <a
            className="publication-link"
            href="https://www.jstage.jst.go.jp/article/ijabc/2026/1/2026_144/_pdf/-char/ja"
            target="_blank"
            rel="noreferrer"
          >
            {copy.research.viewPaper} <ArrowUpRight size={14} weight="bold" />
          </a>
        </article>
        <h2 className="recognition-heading" data-reveal>{copy.research.recognition}</h2>
        <div className="awards">
          {awardsByLocale[locale].map((award, index) => (
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
            <span>{copy.footer.availability}</span>
            <h2>{copy.footer.headingLines[0]}<br />{copy.footer.headingLines[1]}</h2>
          </div>
          <a className="email-button" href="mailto:wangfeichen@hotmail.com">
            <EnvelopeSimple size={17} weight="bold" />
            {copy.footer.email}
            <ArrowRight size={17} weight="bold" />
          </a>
        </div>
        <div className="footer-grid">
          <div className="footer-brand">
            <span>{locale === "zh" ? "王欣隆" : "WANG XL"}</span>
            <small>{copy.about.role}</small>
          </div>
          <div>
            <span className="footer-label">{copy.footer.navigation}</span>
            <button type="button" onClick={() => setProfileOpen(true)}>{copy.footer.about}</button>
            <a href="#experience">{copy.footer.experience}</a>
            <a href="#work">{copy.footer.work}</a>
          </div>
          <div>
            <span className="footer-label">{copy.footer.contact}</span>
            <a href="mailto:wangfeichen@hotmail.com">Email</a>
            <a href="tel:+8619921565068">{copy.footer.chinaPhone}</a>
            <a href="tel:+818038515068">{copy.footer.japanPhone}</a>
            <a href="https://github.com/wantedfast" target="_blank" rel="noreferrer">
              <GithubLogo size={15} /> GitHub
            </a>
            <a href={withBasePath("/Wang-Xinlong-Resume.pdf")} download>
              {copy.nav.resume}
            </a>
          </div>
          <div>
            <span className="footer-label">{copy.footer.skills}</span>
            <span>C# · Python</span>
            <span>LLM Agents</span>
            <span>Azure Identity</span>
            <span>Linux</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} {locale === "zh" ? "王欣隆" : "WANG XINLONG"}</span>
          <span>{copy.footer.designed}</span>
        </div>
      </footer>

      <LanyardProfile
        open={profileOpen}
        onClose={closeProfile}
        locale={locale}
        copy={copy}
      />
    </main>
  );
}

function ExperienceDetailPage({
  experience,
  experiences,
  locale,
  onLocaleToggle,
  copy,
}) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title =
      locale === "zh"
        ? `${experience.company} · ${experience.role} / 王欣隆`
        : `${experience.role} at ${experience.company} / Wang Xinlong`;
    window.scrollTo(0, 0);
    return () => {
      document.title = previousTitle;
    };
  }, [experience, locale]);

  return (
    <main className="project-page experience-page">
      <header className="project-page__header">
        <a className="wordmark" href="/">
          <span>WANG XL</span>
          <small>{copy.detail.experienceIndex}</small>
        </a>
        <div className="project-page__header-actions">
          <button className="language-toggle" type="button" onClick={onLocaleToggle}>
            <Translate size={15} weight="bold" />
            {copy.nav.switchLanguage}
          </button>
          <a className="project-page__back" href="/#experience">
            <CaretLeft size={16} weight="bold" />
            {copy.detail.backExperience}
          </a>
        </div>
      </header>

      <div className="project-page__layout">
        <aside className="project-page__sidebar">
          <div className="project-page__sidebar-intro">
            <span>{copy.detail.workExperience}</span>
            <strong>{experience.period}</strong>
          </div>
          <nav aria-label="Work experience index">
            {experiences.map((item, index) => (
              <a
                className={item.slug === experience.slug ? "is-active" : ""}
                href={withBasePath(`/experience/${item.slug}`)}
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
            <span>{copy.detail.context}</span>
            <p>{experience.context}</p>
          </section>

          <div className="project-page__split">
            <section className="project-page__section">
              <span>{copy.detail.whatIDid}</span>
              <ul className="project-page__list">
                {experience.responsibilities.map((responsibility) => (
                  <li key={responsibility}>{responsibility}</li>
                ))}
              </ul>
            </section>

            <section className="project-page__section">
              <span>{copy.detail.contribution}</span>
              <ul className="project-page__list">
                {experience.contributions.map((contribution) => (
                  <li key={contribution}>{contribution}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="project-page__section">
            <span>{copy.detail.workingEnvironment}</span>
            <div className="project-page__tags">
              {experience.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </section>

          <footer className="project-page__footer">
            <div>
              <span>{copy.detail.role}</span>
              <strong>{experience.role}</strong>
            </div>
            <div className="experience-page__meta">
              <span>{copy.detail.location}</span>
              <strong>{experience.location}</strong>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}

function ProjectDetailPage({
  project,
  projects,
  locale,
  onLocaleToggle,
  copy,
}) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${project.title} / ${locale === "zh" ? "王欣隆" : "Wang Xinlong"}`;
    window.scrollTo(0, 0);
    return () => {
      document.title = previousTitle;
    };
  }, [project, locale]);

  return (
    <main className="project-page">
      <header className="project-page__header">
        <a className="wordmark" href="/">
          <span>WANG XL</span>
          <small>{copy.detail.projectIndex}</small>
        </a>
        <div className="project-page__header-actions">
          <button className="language-toggle" type="button" onClick={onLocaleToggle}>
            <Translate size={15} weight="bold" />
            {copy.nav.switchLanguage}
          </button>
          <a className="project-page__back" href="/#work">
            <CaretLeft size={16} weight="bold" />
            {copy.detail.backProjects}
          </a>
        </div>
      </header>

      <div className="project-page__layout">
        <aside className="project-page__sidebar">
          <div className="project-page__sidebar-intro">
            <span>{copy.detail.selectedWork}</span>
            <strong>{project.status}</strong>
          </div>
          <nav aria-label="Project index">
            {projects.map((item, index) => (
              <a
                className={item.slug === project.slug ? "is-active" : ""}
                href={withBasePath(`/projects/${item.slug}`)}
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
            <span>{copy.detail.context}</span>
            <p>{project.context}</p>
          </section>

          <section className="project-page__section project-page__section--lead">
            <span>{copy.detail.problem}</span>
            <p>{project.problem}</p>
          </section>

          <section className="project-page__section">
            <span>{copy.detail.workflow}</span>
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
              <span>{copy.detail.coreCapabilities}</span>
              <ul className="project-page__list">
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>

            <section className="project-page__section">
              <span>{copy.detail.myContribution}</span>
              <ul className="project-page__list">
                {project.contribution.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="project-page__section">
            <span>{copy.detail.technicalDecisions}</span>
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
              <span>{copy.detail.technology}</span>
              <div className="project-page__tags">
                {project.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </section>

            <section className="project-page__section">
              <span>{copy.detail.currentLimits}</span>
              <ul className="project-page__list">
                {project.limitations.map((limitation) => (
                  <li key={limitation}>{limitation}</li>
                ))}
              </ul>
            </section>
          </div>

          <footer className="project-page__footer">
            <div>
              <span>{copy.detail.projectStatus}</span>
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

function ProjectNotFound({ copy }) {
  return (
    <main className="project-not-found">
      <span>404 / PROJECT NOT FOUND</span>
      <h1>{copy.notFound.project}</h1>
      <a href="/#work">
        <CaretLeft size={16} weight="bold" />
        {copy.notFound.returnProjects}
      </a>
    </main>
  );
}

function ExperienceNotFound({ copy }) {
  return (
    <main className="project-not-found">
      <span>404 / EXPERIENCE NOT FOUND</span>
      <h1>{copy.notFound.experience}</h1>
      <a href="/#experience">
        <CaretLeft size={16} weight="bold" />
        {copy.notFound.returnExperience}
      </a>
    </main>
  );
}

function readInitialLocale() {
  try {
    const saved = localStorage.getItem("wang-portfolio-locale");
    if (saved === "en" || saved === "zh") return saved;
  } catch {
    // Use browser language when persistence is unavailable.
  }
  return navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function App() {
  const [locale, setLocale] = useState(readInitialLocale);
  const [assistantIntro, setAssistantIntro] = useState(null);
  const [heroScrollRevision, setHeroScrollRevision] = useState(0);
  const reportHeroScrollActivity = useCallback(
    () => setHeroScrollRevision((revision) => revision + 1),
    [],
  );
  const [heroActive, setHeroActive] = useState(
    () =>
      window.location.hash === "" ||
      window.location.hash === "#top",
  );
  const copy = siteCopy[locale];
  const localizedCatalog = useMemo(
    () =>
      getLocalizedCatalog(locale, experienceCatalog, projectCatalog),
    [locale],
  );
  const experiences = localizedCatalog.experiences;
  const projects = localizedCatalog.projects;

  const toggleLocale = useCallback(() => {
    setLocale((current) => (current === "zh" ? "en" : "zh"));
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document.title = copy.documentTitle;
    try {
      localStorage.setItem("wang-portfolio-locale", locale);
    } catch {
      // The active view still updates when persistence is unavailable.
    }
  }, [copy.documentTitle, locale]);

  let pageContent;
  let pageContext = { kind: "home", slug: null };

  const applicationPath = stripBasePath(window.location.pathname);

  const projectMatch = applicationPath.match(
    /^\/projects\/([^/]+)\/?$/,
  );
  if (projectMatch) {
    let projectSlug;
    try {
      projectSlug = decodeURIComponent(projectMatch[1]);
    } catch {
      pageContent = <ProjectNotFound copy={copy} />;
    }
    if (!pageContent) {
      const project = projects.find((item) => item.slug === projectSlug);
      pageContext = { kind: "project", slug: projectSlug };
      pageContent = project ? (
        <ProjectDetailPage
          project={project}
          projects={projects}
          locale={locale}
          onLocaleToggle={toggleLocale}
          copy={copy}
        />
      ) : (
        <ProjectNotFound copy={copy} />
      );
    }
  }

  const experienceMatch = applicationPath.match(
    /^\/experience\/([^/]+)\/?$/,
  );
  if (!pageContent && experienceMatch) {
    let experienceSlug;
    try {
      experienceSlug = decodeURIComponent(experienceMatch[1]);
    } catch {
      pageContent = <ExperienceNotFound copy={copy} />;
    }
    if (!pageContent) {
      const experience = experiences.find(
        (item) => item.slug === experienceSlug,
      );
      pageContext = { kind: "experience", slug: experienceSlug };
      pageContent = experience ? (
        <ExperienceDetailPage
          experience={experience}
          experiences={experiences}
          locale={locale}
          onLocaleToggle={toggleLocale}
          copy={copy}
        />
      ) : (
        <ExperienceNotFound copy={copy} />
      );
    }
  }

  if (!pageContent) {
    pageContent = (
      <PortfolioHome
        onAssistantIntro={setAssistantIntro}
        onHeroActiveChange={setHeroActive}
        onHeroScrollActivity={reportHeroScrollActivity}
        locale={locale}
        onLocaleToggle={toggleLocale}
        copy={copy}
        experiences={experiences}
        projects={projects}
      />
    );
  }

  return (
    <>
      {pageContent}
      <DigitalAssistant
        hoverIntro={assistantIntro}
        pageContext={pageContext}
        heroActive={pageContext.kind === "home" && heroActive}
        heroScrollRevision={heroScrollRevision}
        locale={locale}
      />
    </>
  );
}

export { App };
