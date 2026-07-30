import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowCounterClockwise,
  ChatCircleDots,
  MoonStars,
  PaperPlaneTilt,
  Play,
  SpeakerHigh,
  Stop,
  Trash,
  X,
} from "@phosphor-icons/react";
import {
  assistantVoiceContent,
  getAssistantText,
  getGreetingAudio,
  getIntroAudio,
  voiceLabels,
} from "./assistant-locales.js";

const AWAKE_IMAGE = "/assets/luo-zhaoyue-front-idle-v2.png";
const MOUTH_HALF_IMAGE = "/assets/luo-zhaoyue-mouth-half-v1.png";
const MOUTH_OPEN_IMAGE = "/assets/luo-zhaoyue-mouth-open-v1.png";
const DORMANT_PIXEL_IMAGE =
  "/assets/luo-zhaoyue-8bit-sleeping-v1.png";
const AWAKE_SESSION_KEY = "luo-zhaoyue-awake";
const GREETING_SESSION_KEY = "luo-zhaoyue-v3-greeting-played";

const assistantUiCopy = {
  en: {
    dormantTitle: "AI ASSISTANT · SLEEPING",
    wake: "CLICK TO WAKE",
    open: "OPEN AI ASSISTANT",
    role: "AI ASSISTANT",
    ask: "ASK ABOUT XINLONG",
    rest: "LET HER REST",
    replay: "REPLAY INTRO",
    retryGreeting: "RETRY GREETING",
    heroFooter: "HERO ASSISTANT · ACTIVE THROUGHOUT",
    contextFooter: "CONTEXT INTRO · HOVER TO REPLAY",
    hello: "HELLO",
    welcomeTitle: "Ask me about Xinlong.",
    welcomeBody:
      "I can introduce his research, engineering experience, selected projects, and public background.",
    localOnly: "Live answers are available only in the local development demo.",
    clear: "Clear conversation",
    close: "Close assistant",
    retry: "RETRY",
    thinking: "Thinking…",
    placeholder: "Ask about Xinlong…",
    unavailable: "Local demo unavailable in this build",
    stop: "Stop generating",
    send: "Send message",
    you: "YOU",
    starters: [
      ["Research", "What is Xinlong currently researching?"],
      ["Work experience", "Summarize Xinlong's professional experience."],
      [
        "Selected projects",
        "Which of Xinlong's projects best represents his work?",
      ],
      [
        "About Xinlong",
        "What should I know about Xinlong beyond his job titles?",
      ],
    ],
  },
  zh: {
    dormantTitle: "AI 助理 · 休息中",
    wake: "点击唤醒",
    open: "打开 AI 助理",
    role: "AI 助理",
    ask: "向我了解王欣隆",
    rest: "让她休息",
    replay: "重播介绍",
    retryGreeting: "重播问候",
    heroFooter: "主页助理 · 随时待命",
    contextFooter: "内容介绍 · 再次悬停可重播",
    hello: "你好",
    welcomeTitle: "问我关于王欣隆的事。",
    welcomeBody: "我可以介绍他的研究、工程经历、代表项目和公开背景。",
    localOnly: "实时回答仅在本地开发演示中可用。",
    clear: "清空对话",
    close: "关闭助理",
    retry: "重试",
    thinking: "思考中…",
    placeholder: "向我了解王欣隆…",
    unavailable: "当前构建未启用本地演示",
    stop: "停止生成",
    send: "发送消息",
    you: "你",
    starters: [
      ["研究方向", "王欣隆目前在研究什么？"],
      ["工作经历", "请概括王欣隆的工作经历。"],
      ["代表项目", "哪个项目最能代表王欣隆的能力？"],
      ["关于本人", "除了职位之外，我还应该了解王欣隆什么？"],
    ],
  },
  ja: {
    dormantTitle: "AIアシスタント · 休憩中",
    wake: "クリックして起こす",
    open: "AIアシスタントを開く",
    role: "AIアシスタント",
    ask: "王欣隆について聞く",
    rest: "休ませる",
    replay: "紹介を再生",
    retryGreeting: "挨拶を再生",
    heroFooter: "AIアシスタント · 待機中",
    contextFooter: "コンテキスト紹介 · 再ホバーで再生",
    hello: "こんにちは",
    welcomeTitle: "王欣隆についてお尋ねください。",
    welcomeBody:
      "研究、エンジニアとしての経歴、主なプロジェクト、公開プロフィールをご紹介します。",
    localOnly: "リアルタイム回答はローカル開発環境でのみ利用できます。",
    clear: "会話を消去",
    close: "アシスタントを閉じる",
    retry: "再試行",
    thinking: "考えています…",
    placeholder: "王欣隆について質問する…",
    unavailable: "このビルドではローカルデモを利用できません",
    stop: "生成を停止",
    send: "送信",
    you: "あなた",
    starters: [
      ["研究", "王欣隆は現在何を研究していますか？"],
      ["職歴", "王欣隆の職歴を要約してください。"],
      ["プロジェクト", "王欣隆を最もよく表すプロジェクトは何ですか？"],
      ["人物像", "肩書き以外に王欣隆について知るべきことは？"],
    ],
  },
};

const LOCAL_CHAT_AVAILABLE = import.meta.env.DEV;

function readSessionFlag(key) {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeSessionFlag(key) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    // Session state remains functional in memory.
  }
}

function clearSessionFlag(key) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // Session state remains functional in memory.
  }
}

function parseEventBlock(block) {
  let event = "message";
  let data = "";
  for (const line of block.split("\n")) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    if (line.startsWith("data:")) data += line.slice(5).trim();
  }
  if (!data) return null;
  try {
    return { event, payload: JSON.parse(data) };
  } catch {
    return null;
  }
}

function AssistantPortrait({ mouthFrame, className = "" }) {
  return (
    <>
      <img
        className={`assistant-portrait__base ${className}`.trim()}
        src={AWAKE_IMAGE}
        alt=""
        aria-hidden="true"
      />
      <img
        className={`assistant-portrait__mouth assistant-portrait__mouth--half ${className}`.trim()}
        src={MOUTH_HALF_IMAGE}
        alt=""
        aria-hidden="true"
        data-active={mouthFrame === "half" ? "true" : "false"}
      />
      <img
        className={`assistant-portrait__mouth assistant-portrait__mouth--open ${className}`.trim()}
        src={MOUTH_OPEN_IMAGE}
        alt=""
        aria-hidden="true"
        data-active={mouthFrame === "open" ? "true" : "false"}
      />
    </>
  );
}

function DigitalAssistant({
  hoverIntro,
  pageContext,
  heroActive = false,
  heroScrollRevision = 0,
  locale = "en",
}) {
  const [awake, setAwake] = useState(() => readSessionFlag(AWAKE_SESSION_KEY));
  const [voiceLanguage, setVoiceLanguage] = useState(
    locale === "zh" ? "zh" : "en",
  );
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [audioError, setAudioError] = useState("");
  const [mouthFrame, setMouthFrame] = useState("closed");
  const [hasStreamedToken, setHasStreamedToken] = useState(false);
  const [visibleIntro, setVisibleIntro] = useState(null);
  const launcherRef = useRef(null);
  const dormantRef = useRef(null);
  const cardCtaRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const lipSyncRef = useRef(null);
  const introTimerRef = useRef(null);
  const dwellTimerRef = useRef(null);
  const sidecarEngagedRef = useRef(false);
  const skipContextUntilExitRef = useRef(false);
  const messagesEndRef = useRef(null);
  const lastHeroScrollRevisionRef = useRef(heroScrollRevision);
  const ui = assistantUiCopy[voiceLanguage] || assistantUiCopy.en;
  const greetingAudio = getGreetingAudio(voiceLanguage);
  const greetingSessionKey = `${GREETING_SESSION_KEY}:${voiceLanguage}`;
  const localizedIntro = visibleIntro
    ? {
        ...visibleIntro,
        text: getAssistantText(voiceLanguage, visibleIntro.id),
        audioSrc: getIntroAudio(voiceLanguage, visibleIntro.id),
      }
    : null;

  const generating = status === "generating";
  const assistantPresent = heroActive || Boolean(visibleIntro);
  const showDormantPixel = assistantPresent && !awake && !open;
  const showAssistantCard = assistantPresent && awake && !open;
  const assistantState = open
    ? "chat-open"
    : heroActive
      ? awake
        ? "hero-card"
        : "dormant-pixel"
      : visibleIntro
        ? awake
          ? "context-card"
          : "dormant-pixel"
        : "launcher";

  const stopLipSync = useCallback(() => {
    const lipSync = lipSyncRef.current;
    if (lipSync?.animationFrame) {
      window.cancelAnimationFrame(lipSync.animationFrame);
    }
    if (lipSync?.fallbackTimer) {
      window.clearInterval(lipSync.fallbackTimer);
    }
    try {
      lipSync?.source?.disconnect();
      lipSync?.analyser?.disconnect();
    } catch {
      // The audio graph may already be disconnected during rapid switching.
    }
    lipSyncRef.current = null;
    setMouthFrame("closed");
  }, []);

  const startLipSync = useCallback(
    async (audio) => {
      stopLipSync();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setMouthFrame("half");
        lipSyncRef.current = { reducedMotion: true };
        return;
      }

      let context;
      let source;
      let analyser;
      try {
        const AudioContextClass =
          window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) throw new Error("Web Audio is unavailable");

        context = audioContextRef.current || new AudioContextClass();
        audioContextRef.current = context;
        if (context.state === "suspended") await context.resume();
        if (audioRef.current?.audio !== audio || audio.paused) return;

        source = context.createMediaElementSource(audio);
        analyser = context.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.68;
        source.connect(analyser);
        analyser.connect(context.destination);

        const samples = new Uint8Array(analyser.fftSize);
        const lipSync = {
          analyser,
          source,
          samples,
          animationFrame: 0,
          envelope: 0,
          peak: 0.08,
          lastFrameAt: 0,
          renderedFrame: "closed",
        };
        lipSyncRef.current = lipSync;

        const analyse = (now) => {
          if (lipSyncRef.current !== lipSync) return;
          analyser.getByteTimeDomainData(samples);

          let energy = 0;
          for (let index = 0; index < samples.length; index += 1) {
            const normalized = (samples[index] - 128) / 128;
            energy += normalized * normalized;
          }
          const rms = Math.sqrt(energy / samples.length);
          const release = rms > lipSync.envelope ? 0.48 : 0.2;
          lipSync.envelope += (rms - lipSync.envelope) * release;
          lipSync.peak = Math.max(lipSync.envelope, lipSync.peak * 0.992);

          if (now - lipSync.lastFrameAt >= 80) {
            const normalizedLevel =
              lipSync.envelope / Math.max(lipSync.peak, 0.08);
            const nextFrame =
              lipSync.envelope < 0.012
                ? "closed"
                : normalizedLevel < 0.38
                  ? "half"
                  : "open";

            if (nextFrame !== lipSync.renderedFrame) {
              lipSync.renderedFrame = nextFrame;
              setMouthFrame(nextFrame);
            }
            lipSync.lastFrameAt = now;
          }

          lipSync.animationFrame = window.requestAnimationFrame(analyse);
        };

        lipSync.animationFrame = window.requestAnimationFrame(analyse);
      } catch {
        try {
          source?.disconnect();
          analyser?.disconnect();
          if (source && context) source.connect(context.destination);
        } catch {
          // The original media element continues playing when no graph exists.
        }
        let open = false;
        setMouthFrame("half");
        const fallbackTimer = window.setInterval(() => {
          open = !open;
          setMouthFrame(open ? "open" : "half");
        }, 170);
        lipSyncRef.current = { fallbackTimer, source };
      }
    },
    [stopLipSync],
  );

  const stopAudio = useCallback(
    (kind) => {
      const current = audioRef.current;
      if (!current) {
        if (!kind) stopLipSync();
        return;
      }
      if (kind && current.kind !== kind) return;
      current.audio.onplay = null;
      current.audio.onended = null;
      current.audio.onerror = null;
      current.audio.pause();
      current.audio.removeAttribute("src");
      current.audio.load();
      audioRef.current = null;
      stopLipSync();
    },
    [stopLipSync],
  );

  const cancelIntroDismiss = useCallback(() => {
    window.clearTimeout(introTimerRef.current);
  }, []);

  const scheduleIntroDismiss = useCallback((delay = 150) => {
    window.clearTimeout(introTimerRef.current);
    introTimerRef.current = window.setTimeout(() => {
      setVisibleIntro(null);
    }, delay);
  }, []);

  const playAudio = useCallback(
    (src, { kind, id, markPlayed } = {}) => {
      stopAudio();
      setAudioError("");
      const audio = new Audio(src);
      audio.preload = "auto";
      audioRef.current = { audio, kind, id };
      audio.onplay = () => {
        startLipSync(audio);
        markPlayed?.();
      };
      audio.onended = () => {
        if (audioRef.current?.audio === audio) audioRef.current = null;
        stopLipSync();
      };
      audio.onerror = () => {
        if (audioRef.current?.audio === audio) audioRef.current = null;
        stopLipSync();
        setAudioError(kind === "greeting" ? "greeting" : id || "context");
      };
      const playPromise = audio.play();
      playPromise?.catch(() => {
        if (audioRef.current?.audio === audio) audioRef.current = null;
        stopLipSync();
        setAudioError(kind === "greeting" ? "greeting" : id || "context");
      });
      return playPromise;
    },
    [startLipSync, stopAudio, stopLipSync],
  );

  const playGreeting = useCallback(
    ({ force = false } = {}) => {
      if (!force && readSessionFlag(greetingSessionKey)) return;
      playAudio(greetingAudio, {
        kind: "greeting",
        markPlayed: () => writeSessionFlag(greetingSessionKey),
      });
    },
    [greetingAudio, greetingSessionKey, playAudio],
  );

  const wakeAssistant = useCallback(() => {
    if (!awake) {
      if (visibleIntro) skipContextUntilExitRef.current = true;
      setAwake(true);
      writeSessionFlag(AWAKE_SESSION_KEY);
      playGreeting();
    }
  }, [awake, playGreeting, visibleIntro]);

  const openPanel = useCallback(() => {
    if (!awake) {
      setAwake(true);
      writeSessionFlag(AWAKE_SESSION_KEY);
      playGreeting();
    }
    setOpen(true);
  }, [awake, playGreeting]);

  const restAssistant = useCallback(
    ({ moveFocus = false } = {}) => {
      abortRef.current?.abort();
      abortRef.current = null;
      stopAudio();
      window.clearTimeout(introTimerRef.current);
      window.clearTimeout(dwellTimerRef.current);
      skipContextUntilExitRef.current = false;
      clearSessionFlag(AWAKE_SESSION_KEY);
      setStatus("idle");
      setHasStreamedToken(false);
      setAudioError("");
      setOpen(false);
      setAwake(false);

      if (moveFocus) {
        const showDesktopDormant = heroActive || Boolean(visibleIntro);
        window.requestAnimationFrame(() => {
          (
            window.innerWidth <= 640 || !showDesktopDormant
              ? launcherRef
              : dormantRef
          ).current?.focus();
        });
      }
    },
    [heroActive, stopAudio, visibleIntro],
  );

  useEffect(() => {
    const nextLanguage = locale === "zh" ? "zh" : "en";
    setVoiceLanguage(nextLanguage);
    stopAudio();
  }, [locale, stopAudio]);

  useEffect(() => {
    [
      AWAKE_IMAGE,
      MOUTH_HALF_IMAGE,
      MOUTH_OPEN_IMAGE,
      DORMANT_PIXEL_IMAGE,
    ].forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  useEffect(() => {
    if (!showAssistantCard) sidecarEngagedRef.current = false;
  }, [showAssistantCard]);

  useEffect(() => {
    const greeting = new Audio();
    greeting.preload = "metadata";
    greeting.src = greetingAudio;
  }, [greetingAudio]);

  useEffect(() => {
    if (lastHeroScrollRevisionRef.current === heroScrollRevision) return;
    lastHeroScrollRevisionRef.current = heroScrollRevision;
    if (awake && heroActive) restAssistant();
  }, [awake, heroActive, heroScrollRevision, restAssistant]);

  useEffect(() => {
    window.clearTimeout(introTimerRef.current);
    window.clearTimeout(dwellTimerRef.current);

    if (hoverIntro) {
      stopAudio("context");
      setVisibleIntro(hoverIntro);
      if (!awake) {
        setAwake(true);
        writeSessionFlag(AWAKE_SESSION_KEY);
      }
      dwellTimerRef.current = window.setTimeout(() => {
        playAudio(getIntroAudio(voiceLanguage, hoverIntro.id), {
          kind: "context",
          id: hoverIntro.id,
        });
      }, 300);
      return () => {
        window.clearTimeout(dwellTimerRef.current);
      };
    }

    skipContextUntilExitRef.current = false;
    stopAudio("context");
    if (!sidecarEngagedRef.current) scheduleIntroDismiss(350);
    return cancelIntroDismiss;
  }, [
    awake,
    cancelIntroDismiss,
    hoverIntro,
    playAudio,
    scheduleIntroDismiss,
    stopAudio,
    voiceLanguage,
  ]);

  useEffect(() => {
    if (!open) return undefined;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 80);
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      stopAudio();
      setOpen(false);
      window.requestAnimationFrame(() => {
        (
          assistantPresent && awake
            ? cardCtaRef
            : showDormantPixel
              ? dormantRef
              : launcherRef
        ).current?.focus();
      });
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [assistantPresent, awake, open, showDormantPixel, stopAudio]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      block: "end",
      behavior: generating ? "auto" : "smooth",
    });
  }, [generating, messages]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      stopAudio();
      audioContextRef.current?.close();
      audioContextRef.current = null;
      window.clearTimeout(introTimerRef.current);
      window.clearTimeout(dwellTimerRef.current);
    },
    [stopAudio],
  );

  const updateAssistantMessage = useCallback((token) => {
    setMessages((current) => {
      const next = [...current];
      const last = next.at(-1);
      if (!last || last.role !== "assistant") return current;
      next[next.length - 1] = {
        ...last,
        content: `${last.content}${token}`,
      };
      return next;
    });
  }, []);

  const sendMessage = useCallback(
    async (rawContent, { retry = false } = {}) => {
      const content = rawContent.trim();
      if (!content || generating) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setStatus("generating");
      setError("");
      setHasStreamedToken(false);

      let baseMessages = messages;
      if (retry) {
        const lastUserIndex = messages.findLastIndex(
          (message) => message.role === "user",
        );
        baseMessages =
          lastUserIndex >= 0 ? messages.slice(0, lastUserIndex) : messages;
      }

      const requestMessages = [
        ...baseMessages,
        { role: "user", content },
      ].slice(-12);
      setMessages([
        ...requestMessages,
        { role: "assistant", content: "" },
      ]);
      setInput("");

      try {
        const response = await fetch("/api/assistant/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: requestMessages,
            pageContext,
            responseLanguage: voiceLanguage,
          }),
          signal: controller.signal,
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || "The local assistant is unavailable.");
        }
        if (!response.body) throw new Error("The assistant returned an empty response.");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const blocks = buffer.split("\n\n");
          buffer = blocks.pop() ?? "";
          for (const block of blocks) {
            const parsed = parseEventBlock(block);
            if (!parsed) continue;
            if (parsed.event === "token" && parsed.payload.text) {
              setHasStreamedToken(true);
              updateAssistantMessage(parsed.payload.text);
            }
            if (parsed.event === "error") {
              throw new Error(
                parsed.payload.message ||
                  "The assistant connection was interrupted.",
              );
            }
          }
        }
        setStatus("idle");
      } catch (requestError) {
        if (requestError.name === "AbortError") {
          setStatus("idle");
          return;
        }
        setStatus("error");
        setError(requestError.message);
        setMessages((current) => {
          const last = current.at(-1);
          return last?.role === "assistant" && !last.content
            ? current.slice(0, -1)
            : current;
        });
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [generating, messages, pageContext, updateAssistantMessage, voiceLanguage],
  );

  function stopGeneration() {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus("idle");
  }

  function clearConversation() {
    stopGeneration();
    setMessages([]);
    setError("");
    setInput("");
  }

  function retryLastMessage() {
    const lastUser = [...messages]
      .reverse()
      .find((message) => message.role === "user");
    if (lastUser) sendMessage(lastUser.content, { retry: true });
  }

  function closePanel() {
    stopAudio();
    setOpen(false);
    window.requestAnimationFrame(() => {
      (
        assistantPresent && awake
          ? cardCtaRef
          : showDormantPixel
            ? dormantRef
            : launcherRef
      ).current?.focus();
    });
  }

  function selectVoiceLanguage(language) {
    if (language === voiceLanguage) {
      playGreeting({ force: true });
      return;
    }
    stopAudio();
    setAudioError("");
    setVoiceLanguage(language);
    playAudio(getGreetingAudio(language), {
      kind: "greeting",
      markPlayed: () =>
        writeSessionFlag(`${GREETING_SESSION_KEY}:${language}`),
    });
  }

  const languageSwitch = (
    <div className="assistant-language-switch" aria-label="Assistant voice language">
      {Object.entries(voiceLabels).map(([language, label]) => (
        <button
          type="button"
          key={language}
          className={voiceLanguage === language ? "is-active" : ""}
          aria-pressed={voiceLanguage === language}
          onClick={() => selectVoiceLanguage(language)}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <aside
      className={`digital-assistant is-${assistantState} ${
        awake ? "is-awake" : "is-dormant"
      }`}
      aria-label="罗昭玥，王欣隆的 AI 助理"
    >
      {showDormantPixel && (
        <button
          className="assistant-dormant"
          type="button"
          ref={dormantRef}
          onClick={wakeAssistant}
          aria-label={`${ui.wake}，罗昭玥 AI 助理`}
        >
          <img src={DORMANT_PIXEL_IMAGE} alt="" aria-hidden="true" />
          <span className="assistant-dormant__identity">
            <ChatCircleDots size={13} weight="fill" aria-hidden="true" />
            <span>
              <strong>{ui.dormantTitle}</strong>
              <small>{ui.wake}</small>
            </span>
          </span>
        </button>
      )}

      {showAssistantCard && (
        <section
          className={`assistant-sidecar ${
            visibleIntro ? "assistant-sidecar--context" : ""
          }`}
          onPointerEnter={() => {
            sidecarEngagedRef.current = true;
            cancelIntroDismiss();
          }}
          onPointerLeave={() => {
            sidecarEngagedRef.current = false;
            scheduleIntroDismiss(150);
          }}
          onFocusCapture={() => {
            sidecarEngagedRef.current = true;
            cancelIntroDismiss();
          }}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              sidecarEngagedRef.current = false;
              scheduleIntroDismiss(150);
            }
          }}
          aria-label={
            visibleIntro
              ? `罗昭玥：${localizedIntro?.text}`
              : "罗昭玥 AI 助理"
          }
        >
          <header>
            <span>罗昭玥 / LUO ZHAOYUE</span>
            <span>{ui.role}</span>
          </header>
          {languageSwitch}
          <div
            className="assistant-sidecar__portrait"
            data-mouth-frame={mouthFrame}
          >
            <AssistantPortrait mouthFrame={mouthFrame} />
          </div>
          <div className="assistant-sidecar__copy" aria-live="polite">
            <span aria-hidden="true">“</span>
            <p>
              {localizedIntro?.text ||
                assistantVoiceContent[voiceLanguage].greeting}
            </p>
          </div>
          {visibleIntro && (
            <button
              className="assistant-sidecar__replay"
              type="button"
              onClick={() =>
                playAudio(localizedIntro.audioSrc, {
                  kind: "context",
                  id: localizedIntro.id,
                })
              }
              aria-label={ui.replay}
            >
              <SpeakerHigh size={14} weight="fill" />
              {ui.replay}
            </button>
          )}
          {audioError === "greeting" && !visibleIntro && (
            <button
              className="assistant-sidecar__replay"
              type="button"
              onClick={playGreeting}
            >
              <Play size={14} weight="fill" />
              {ui.retryGreeting}
            </button>
          )}
          <button
            className="assistant-sidecar__cta"
            type="button"
            ref={cardCtaRef}
            onClick={() => setOpen(true)}
          >
            <ChatCircleDots size={15} weight="fill" />
            {ui.ask}
          </button>
          <button
            className="assistant-sidecar__rest"
            type="button"
            onClick={() => restAssistant({ moveFocus: true })}
          >
            <MoonStars size={14} weight="fill" />
            {ui.rest}
          </button>
          <footer>
            {visibleIntro
              ? ui.contextFooter
              : ui.heroFooter}
          </footer>
        </section>
      )}

      {open && (
        <section
          className="assistant-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="assistant-title"
        >
          <header className="assistant-panel__header">
            <div>
              <span>{ui.role}</span>
              <h2 id="assistant-title">罗昭玥 / Luo Zhaoyue</h2>
            </div>
            <div className="assistant-panel__actions">
              <button
                className="assistant-panel__rest"
                type="button"
                onClick={() => restAssistant({ moveFocus: true })}
                aria-label={ui.rest}
              >
                <MoonStars size={15} weight="fill" />
                <span>{ui.rest}</span>
              </button>
              <button
                type="button"
                onClick={clearConversation}
                aria-label={ui.clear}
                disabled={messages.length === 0 && !generating}
              >
                <Trash size={16} />
              </button>
              <button
                type="button"
                onClick={closePanel}
                aria-label={ui.close}
              >
                <X size={18} />
              </button>
            </div>
          </header>
          {languageSwitch}

          <div
            className="assistant-panel__messages"
            aria-live="polite"
            aria-busy={generating}
          >
            {messages.length === 0 ? (
              <div className="assistant-welcome">
                <span>{ui.hello}</span>
                <h3>{ui.welcomeTitle}</h3>
                <p>{ui.welcomeBody}</p>
                {audioError === "greeting" && (
                  <button
                    className="assistant-audio-retry"
                    type="button"
                    onClick={playGreeting}
                  >
                    <Play size={14} weight="fill" />
                    {ui.retryGreeting}
                  </button>
                )}
                {!LOCAL_CHAT_AVAILABLE && (
                  <p className="assistant-local-note">{ui.localOnly}</p>
                )}
                <div className="assistant-starters">
                  {ui.starters.map(([label, prompt]) => (
                    <button
                      type="button"
                      key={label}
                      onClick={() => sendMessage(prompt)}
                      disabled={!LOCAL_CHAT_AVAILABLE}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <article
                  className={`assistant-message assistant-message--${message.role}`}
                  key={`${message.role}-${index}`}
                >
                  <div className="assistant-message__meta">
                    <span>
                      {message.role === "user"
                        ? ui.you
                        : "罗昭玥 / LUO ZHAOYUE"}
                    </span>
                  </div>
                  <p>
                    {message.content ||
                      (generating && index === messages.length - 1
                        ? hasStreamedToken
                          ? ""
                          : ui.thinking
                        : "")}
                  </p>
                </article>
              ))
            )}
            {error && (
              <div className="assistant-error" role="alert">
                <p>{error}</p>
                <button type="button" onClick={retryLastMessage}>
                  <ArrowCounterClockwise size={15} weight="bold" />
                  {ui.retry}
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            className="assistant-composer"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
            }}
          >
            <label htmlFor="assistant-input" className="sr-only">
              {ui.placeholder}
            </label>
            <textarea
              id="assistant-input"
              ref={inputRef}
              value={input}
              maxLength={800}
              rows={2}
              placeholder={
                LOCAL_CHAT_AVAILABLE
                  ? ui.placeholder
                  : ui.unavailable
              }
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  sendMessage(input);
                }
              }}
              disabled={generating || !LOCAL_CHAT_AVAILABLE}
            />
            <div>
              <span>{input.length} / 800</span>
              {generating ? (
                <button
                  type="button"
                  onClick={stopGeneration}
                  aria-label={ui.stop}
                >
                  <Stop size={17} weight="fill" />
                </button>
              ) : (
                <button
                  type="submit"
                  aria-label={ui.send}
                  disabled={!input.trim()}
                >
                  <PaperPlaneTilt size={18} weight="fill" />
                </button>
              )}
            </div>
          </form>
        </section>
      )}

      <button
        className="assistant-launcher"
        type="button"
        ref={launcherRef}
        aria-label={
          open
            ? ui.close
            : `${awake ? ui.open : ui.wake} · 罗昭玥 AI 助理`
        }
        aria-expanded={open}
        onClick={() => (open ? closePanel() : openPanel())}
      >
        {awake ? (
          <span
            className="assistant-launcher__portrait"
            data-mouth-frame={mouthFrame}
          >
            <AssistantPortrait mouthFrame={mouthFrame} />
          </span>
        ) : (
          <img src={DORMANT_PIXEL_IMAGE} alt="" aria-hidden="true" />
        )}
        <span className="assistant-launcher__badge">
          {awake ? (
            <ChatCircleDots size={14} weight="fill" />
          ) : (
            <small>AI</small>
          )}
        </span>
      </button>
    </aside>
  );
}

export { DigitalAssistant };
