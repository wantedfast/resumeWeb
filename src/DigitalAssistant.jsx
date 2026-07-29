import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowCounterClockwise,
  ChatCircleDots,
  Pause,
  PaperPlaneTilt,
  Play,
  SpeakerHigh,
  SpeakerSlash,
  Stop,
  Trash,
  X,
} from "@phosphor-icons/react";
import gsap from "gsap";

const CHARACTER_IMAGES = {
  idle: "/assets/luo-zhaoyue-front-idle.webp",
  desk: "/assets/luo-zhaoyue-desk-work-01.webp",
  entrance: "/assets/luo-zhaoyue-front-wave.webp",
  introducing: "/assets/luo-zhaoyue-front-introducing.webp",
  speaking: "/assets/luo-zhaoyue-front-speaking.webp",
  thinking: "/assets/luo-zhaoyue-front-thinking.webp",
};

const INTRO_COPY =
  "Hi, I’m Luo Zhaoyue — Xinlong’s AI assistant. Ask me about his research, work, or projects.";

const STARTERS = [
  {
    label: "Research",
    prompt: "What is Xinlong currently researching?",
  },
  {
    label: "Work experience",
    prompt: "Summarize Xinlong's professional experience.",
  },
  {
    label: "Selected projects",
    prompt: "Which of Xinlong's projects best represents his work?",
  },
  {
    label: "About Xinlong",
    prompt: "What should I know about Xinlong beyond his job titles?",
  },
];

const LOCAL_CHAT_AVAILABLE = import.meta.env.DEV;

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

function DigitalAssistant({ hoverIntro, pageContext }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [hasStreamedToken, setHasStreamedToken] = useState(false);
  const [visibleIntro, setVisibleIntro] = useState("");
  const [introActive, setIntroActive] = useState(false);
  const [entranceFrame, setEntranceFrame] = useState("idle");
  const [speakingFrame, setSpeakingFrame] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceStatus, setVoiceStatus] = useState("idle");
  const [voiceError, setVoiceError] = useState("");
  const [activeSpeechIndex, setActiveSpeechIndex] = useState(null);
  const launcherRef = useRef(null);
  const characterImageRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const speechAbortRef = useRef(null);
  const audioRef = useRef(null);
  const audioUrlRef = useRef("");
  const introTimerRef = useRef(null);
  const openRef = useRef(false);
  const entranceTimersRef = useRef([]);
  const messagesEndRef = useRef(null);

  const generating = status === "generating";
  const speakingActive =
    (generating && hasStreamedToken) || voiceStatus === "playing";

  const characterState = useMemo(() => {
    if (voiceStatus === "loading") return "thinking";
    if (voiceStatus === "playing") {
      return speakingFrame ? "speaking" : "idle";
    }
    if (generating) {
      if (!hasStreamedToken) return "thinking";
      return speakingFrame ? "speaking" : "idle";
    }
    if (introActive && !open) return entranceFrame;
    if (visibleIntro && !open) return "introducing";
    return "desk";
  }, [
    entranceFrame,
    generating,
    hasStreamedToken,
    introActive,
    open,
    speakingFrame,
    visibleIntro,
    voiceStatus,
  ]);

  const bubbleContent = !open
    ? introActive
      ? { kind: "intro", text: INTRO_COPY }
      : visibleIntro
        ? { kind: "hover", text: visibleIntro }
        : null
    : null;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(media.matches);
    syncPreference();
    media.addEventListener?.("change", syncPreference);
    return () => media.removeEventListener?.("change", syncPreference);
  }, []);

  useEffect(() => {
    Object.values(CHARACTER_IMAGES).forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    if (pageContext?.kind !== "home") return undefined;
    const showTimer = window.setTimeout(() => {
      if (openRef.current) return;
      setIntroActive(true);
      setEntranceFrame(prefersReducedMotion ? "idle" : "entrance");
    }, 800);
    const hideTimer = window.setTimeout(() => {
      setIntroActive(false);
      setEntranceFrame("idle");
    }, 6800);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [pageContext?.kind, prefersReducedMotion]);

  useEffect(() => {
    entranceTimersRef.current.forEach(window.clearTimeout);
    entranceTimersRef.current = [];
    if (!introActive || open || prefersReducedMotion) return undefined;

    const frames = [
      ["entrance", 0],
      ["idle", 420],
      ["entrance", 760],
      ["idle", 1180],
    ];
    entranceTimersRef.current = frames.map(([frame, delay]) =>
      window.setTimeout(() => setEntranceFrame(frame), delay),
    );
    return () => {
      entranceTimersRef.current.forEach(window.clearTimeout);
      entranceTimersRef.current = [];
    };
  }, [introActive, open, prefersReducedMotion]);

  useEffect(() => {
    if (!speakingActive || prefersReducedMotion) {
      setSpeakingFrame(Boolean(speakingActive));
      return undefined;
    }
    setSpeakingFrame(true);
    const interval = window.setInterval(
      () => setSpeakingFrame((current) => !current),
      430,
    );
    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, speakingActive]);

  useEffect(() => {
    const character = characterImageRef.current;
    if (!character || prefersReducedMotion) return undefined;
    gsap.killTweensOf(character);
    gsap.fromTo(
      character,
      { autoAlpha: 0.64, y: 5 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.22,
        ease: "power2.out",
      },
    );
    return () => gsap.killTweensOf(character);
  }, [characterState, prefersReducedMotion]);

  useEffect(() => {
    window.clearTimeout(introTimerRef.current);
    if (hoverIntro) {
      setVisibleIntro(hoverIntro);
      return undefined;
    }
    introTimerRef.current = window.setTimeout(() => setVisibleIntro(""), 150);
    return () => window.clearTimeout(introTimerRef.current);
  }, [hoverIntro]);

  useEffect(() => {
    if (!open) return undefined;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 80);

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      block: "end",
      behavior: generating ? "auto" : "smooth",
    });
  }, [generating, messages]);

  const releaseAudio = useCallback(() => {
    speechAbortRef.current?.abort();
    speechAbortRef.current = null;
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.onpause = null;
      audioRef.current.onplay = null;
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = "";
    }
  }, []);

  const stopSpeech = useCallback(() => {
    releaseAudio();
    setVoiceStatus("idle");
    setActiveSpeechIndex(null);
  }, [releaseAudio]);

  const speakText = useCallback(
    async (rawText, messageIndex) => {
      const text = rawText.trim();
      if (!voiceEnabled || !text) return;

      releaseAudio();
      const controller = new AbortController();
      speechAbortRef.current = controller;
      setVoiceStatus("loading");
      setVoiceError("");
      setActiveSpeechIndex(messageIndex);

      try {
        const response = await fetch("/api/assistant/speech", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || "Voice playback is unavailable.");
        }

        const audioBlob = await response.blob();
        if (controller.signal.aborted) return;
        speechAbortRef.current = null;
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.preload = "auto";
        audioUrlRef.current = audioUrl;
        audioRef.current = audio;

        audio.onplay = () => {
          if (audioRef.current === audio) setVoiceStatus("playing");
        };
        audio.onpause = () => {
          if (audioRef.current === audio && !audio.ended) {
            setVoiceStatus("paused");
          }
        };
        audio.onended = () => {
          if (audioRef.current !== audio) return;
          releaseAudio();
          setVoiceStatus("idle");
          setActiveSpeechIndex(null);
        };
        audio.onerror = () => {
          if (audioRef.current !== audio) return;
          releaseAudio();
          setVoiceStatus("error");
          setVoiceError("The generated voice response could not be played.");
        };

        try {
          await audio.play();
        } catch (playbackError) {
          if (playbackError.name === "NotAllowedError") {
            setVoiceStatus("paused");
            setVoiceError("Press play to hear Luo Zhaoyue's response.");
            return;
          }
          throw playbackError;
        }
      } catch (speechError) {
        if (speechError.name === "AbortError") return;
        releaseAudio();
        setVoiceStatus("error");
        setVoiceError(speechError.message);
      }
    },
    [releaseAudio, voiceEnabled],
  );

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setVoiceError("");
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
    } catch {
      setVoiceStatus("error");
      setVoiceError("Your browser prevented audio playback.");
    }
  }, []);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      releaseAudio();
      window.clearTimeout(introTimerRef.current);
      entranceTimersRef.current.forEach(window.clearTimeout);
    },
    [releaseAudio],
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

      stopSpeech();
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
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(
            payload.error || "The local assistant is unavailable.",
          );
        }
        if (!response.body) {
          throw new Error("The assistant returned an empty response.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let assistantText = "";

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
              assistantText += parsed.payload.text;
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
        if (assistantText.trim()) {
          void speakText(assistantText, requestMessages.length);
        }
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
    [
      generating,
      messages,
      pageContext,
      speakText,
      stopSpeech,
      updateAssistantMessage,
    ],
  );

  function stopGeneration() {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus("idle");
  }

  function clearConversation() {
    stopGeneration();
    stopSpeech();
    setMessages([]);
    setError("");
    setVoiceError("");
    setInput("");
  }

  function retryLastMessage() {
    const lastUser = [...messages]
      .reverse()
      .find((message) => message.role === "user");
    if (lastUser) sendMessage(lastUser.content, { retry: true });
  }

  function closePanel() {
    stopSpeech();
    setOpen(false);
    launcherRef.current?.focus();
  }

  function toggleVoice() {
    if (voiceEnabled) stopSpeech();
    setVoiceEnabled((current) => !current);
    setVoiceError("");
  }

  function openPanel() {
    setIntroActive(false);
    setEntranceFrame("idle");
    setOpen(true);
  }

  return (
    <aside
      className={`digital-assistant${open ? " is-open" : ""} is-${characterState}`}
      aria-label="Luo Zhaoyue, Wang Xinlong's personal assistant"
    >
      {bubbleContent && (
        <button
          className={`assistant-speech-bubble assistant-speech-bubble--${bubbleContent.kind}`}
          type="button"
          onClick={openPanel}
          aria-label={`${bubbleContent.text} Open Luo Zhaoyue assistant`}
        >
          <span>
            LUO ZHAOYUE /{" "}
            {bubbleContent.kind === "intro" ? "AI ASSISTANT" : "QUICK NOTE"}
          </span>
          <p>{bubbleContent.text}</p>
        </button>
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
              <span>PERSONAL ASSISTANT</span>
              <h2 id="assistant-title">Luo Zhaoyue</h2>
            </div>
            <div className="assistant-panel__actions">
              <button
                type="button"
                className={voiceEnabled ? "is-active" : ""}
                onClick={toggleVoice}
                aria-label={
                  voiceEnabled
                    ? "Turn Luo Zhaoyue's voice off"
                    : "Turn Luo Zhaoyue's voice on"
                }
                aria-pressed={voiceEnabled}
              >
                {voiceEnabled ? (
                  <SpeakerHigh size={17} weight="fill" />
                ) : (
                  <SpeakerSlash size={17} />
                )}
              </button>
              <button
                type="button"
                onClick={clearConversation}
                aria-label="Clear conversation"
                disabled={messages.length === 0 && !generating}
              >
                <Trash size={16} />
              </button>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Close assistant"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          <div
            className="assistant-panel__messages"
            aria-live="polite"
            aria-busy={generating}
          >
            {messages.length === 0 ? (
              <div className="assistant-welcome">
                <span>HELLO / 你好</span>
                <h3>Ask me about Xinlong.</h3>
                <p>
                  I can introduce his research, engineering experience,
                  selected projects, and public background.
                </p>
                {!LOCAL_CHAT_AVAILABLE && (
                  <p className="assistant-local-note">
                    Live answers are available only in the local development
                    demo.
                  </p>
                )}
                <div className="assistant-starters">
                  {STARTERS.map((starter) => (
                    <button
                      type="button"
                      key={starter.label}
                      onClick={() => sendMessage(starter.prompt)}
                      disabled={!LOCAL_CHAT_AVAILABLE}
                    >
                      {starter.label}
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
                      {message.role === "user" ? "YOU" : "LUO ZHAOYUE"}
                    </span>
                    {message.role === "assistant" && message.content && (
                      <button
                        type="button"
                        className={
                          activeSpeechIndex === index ? "is-active" : ""
                        }
                        onClick={() => {
                          if (
                            activeSpeechIndex === index &&
                            (voiceStatus === "playing" ||
                              voiceStatus === "paused")
                          ) {
                            void togglePlayback();
                          } else {
                            void speakText(message.content, index);
                          }
                        }}
                        aria-label={
                          activeSpeechIndex === index &&
                          voiceStatus === "playing"
                            ? "Pause voice response"
                            : activeSpeechIndex === index &&
                                voiceStatus === "paused"
                              ? "Resume voice response"
                              : "Play voice response"
                        }
                        disabled={!voiceEnabled || voiceStatus === "loading"}
                      >
                        {activeSpeechIndex === index &&
                        voiceStatus === "playing" ? (
                          <Pause size={13} weight="fill" />
                        ) : activeSpeechIndex === index &&
                          voiceStatus === "paused" ? (
                          <Play size={13} weight="fill" />
                        ) : (
                          <SpeakerHigh size={13} weight="fill" />
                        )}
                      </button>
                    )}
                  </div>
                  <p>
                    {message.content ||
                      (generating && index === messages.length - 1
                        ? "Thinking…"
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
                  RETRY
                </button>
              </div>
            )}
            {voiceError && (
              <div className="assistant-voice-error" role="status">
                <SpeakerSlash size={14} />
                <span>{voiceError}</span>
              </div>
            )}
            {voiceStatus === "loading" && (
              <div className="assistant-voice-status" role="status">
                Preparing Luo Zhaoyue's voice…
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
              Ask Luo Zhaoyue about Wang Xinlong
            </label>
            <textarea
              id="assistant-input"
              ref={inputRef}
              value={input}
              maxLength={800}
              rows={2}
              placeholder={
                LOCAL_CHAT_AVAILABLE
                  ? "Ask about Xinlong…"
                  : "Local demo unavailable in this build"
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
                  aria-label="Stop generating"
                >
                  <Stop size={17} weight="fill" />
                </button>
              ) : (
                <button
                  type="submit"
                  aria-label="Send message"
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
        aria-label={open ? "Close Luo Zhaoyue" : "Chat with Luo Zhaoyue"}
        aria-expanded={open}
        onClick={() => (open ? closePanel() : openPanel())}
      >
        <img
          src={CHARACTER_IMAGES[characterState]}
          ref={characterImageRef}
          alt=""
          aria-hidden="true"
        />
        <span className="assistant-launcher__label">
          <ChatCircleDots size={15} weight="fill" />
          {open ? "CLOSE CHAT" : "ASK LUO ZHAOYUE"}
        </span>
      </button>
    </aside>
  );
}

export { DigitalAssistant };
