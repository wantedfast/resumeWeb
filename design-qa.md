# Design QA — multilingual portfolio and 罗昭玥 assistant

Date: 2026-07-29
Preview: `http://127.0.0.1:4173/`

## Evidence

- Source visual truth:
  `C:/Users/wangf/AppData/Local/Temp/codex-clipboard-9cf25814-be80-4de4-9519-a6d027435dbf.png`
- English desktop implementation:
  `C:/Users/wangf/Documents/王欣隆简历/audit/qa-home-en.png`
- Chinese desktop implementation:
  `C:/Users/wangf/Documents/王欣隆简历/audit/qa-home-zh.png`
- Chinese Experience auto-wake state:
  `C:/Users/wangf/Documents/王欣隆简历/audit/qa-experience-hover-zh.png`
- 320px mobile implementation:
  `C:/Users/wangf/Documents/王欣隆简历/audit/qa-mobile-320-zh.png`
- Normalized full-view comparison:
  `C:/Users/wangf/Documents/王欣隆简历/audit/qa-reference-vs-implementation-normalized.png`
- Source pixels: 1672 × 941. Desktop capture: 1695 × 964 at a requested
  1728 × 972 browser viewport. The desktop implementation was normalized to
  1672 × 941 for the 3344 × 985 side-by-side comparison. Device scale was 1.
- Mobile capture: 305 × 763 content pixels at a requested 320 × 800 viewport;
  `body.scrollWidth === body.clientWidth === innerWidth === 320`.

## State and comparison scope

- The source shows the approved awake portrait card.
- The latest product requirement intentionally changes initial state to the
  8BIT sleeping assistant. The approved portrait card remains the comparison
  target for the auto-wake/context state captured in
  `qa-experience-hover-zh.png`.
- Focused evidence is necessary because the language switch, translated
  context copy, voice controls, and rest action are too small to judge from the
  full Hero comparison alone.

## Findings

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: English retains the Archivo/IBM Plex Mono hierarchy.
  Chinese now uses Noto Sans SC at 300/400/500/600, followed by Source Han Sans
  SC, Microsoft YaHei UI, and PingFang SC fallbacks. The Chinese Hero computes
  to weight 300, line-height 1.04, and letter-spacing -0.02em; its long copy
  wraps within the original left-side measure without inheriting the English
  -0.06em tracking.
- Spacing and layout rhythm: the website language switch sits immediately left
  of Resume, with matching height and restrained border treatment. The sleeping
  assistant remains in the established upper-right rail and the awake context
  card stays aligned to the same edge.
- Colors and tokens: all new controls reuse the black, warm-paper, and dark-red
  palette. Active assistant-language buttons use the existing burgundy state,
  not a new visual system.
- Image quality and asset fidelity: the portrait, Hero photography, project
  imagery, and transparent 8BIT sleeping asset remain unchanged and sharp.
  No placeholder, CSS-drawn character, or substitute icon was introduced.
- Copy and content: public identity is consistently 王欣隆 / Wang Xinlong.
  The assistant is consistently 罗昭玥 / Luo Zhaoyue. Chinese navigation,
  sections, detail content, footer, and assistant copy are complete; Japanese
  is intentionally scoped to the assistant voice and chat UI.
- Icons and controls: Translate, audio replay, chat, rest, send, clear, and
  close controls use the existing Phosphor icon family and retain visible focus
  states.

## Interaction and responsive verification

- Website toggle changes the document language to `zh-CN`, replaces all major
  home/detail copy, and returns to English from the same header position.
- Sleeping-state keyboard focus on a Work item wakes 罗昭玥 automatically,
  shows the correct localized context, and schedules the static v3 clip after
  300ms. The same behavior passed for Project/COVS.
- Work/Project source leave stops the current context audio immediately but
  keeps the sidecar available for a 350ms handoff. Moving keyboard focus into
  the replay control and waiting 520ms kept the sidecar mounted; leaving the
  sidecar then collapsed it after 150ms to the awake portrait launcher.
- Non-Hero scrolling preserved the awake launcher. In the Hero, the awake card
  remained visible after 12px of real scrolling and changed to the sleeping
  state only when cumulative real scrolling reached 24px.
- All six localized Hero headings, About, Footer, and Not Found headings were
  checked in the rendered DOM and no sentence-ending `.` or `。` remained.
  The Hero research question retained its question mark and body copy retained
  normal punctuation.
- Assistant voice controls expose EN, 中文, and 日本語. Japanese selection
  changes the assistant UI and static voice source; a live chat test returned
  a natural Japanese answer while the Chinese website remained active.
- Chinese is selected automatically when the Chinese website is active.
  Returning the website to English restores English as the assistant default.
- `LET HER REST` / `让她休息` / `休ませる` remains available in the portrait
  card and chat header; rest preserves messages but closes the active state.
- All 33 contextual MP3 files and 3 greeting MP3 files exist and exceed 1KB.
  Runtime voice uses static assets; chat answers remain text-only.
- At 320px there is no horizontal overflow, the language toggle and menu remain
  reachable, and the assistant collapses to its mobile launcher.
- Browser console inspection returned no application errors.

## Comparison history

- Pass 1 compared the approved Hero against the rendered English Hero. The
  dormant-vs-awake difference is required by the latest behavior spec; the
  underlying composition, crop, typography, palette, and assistant anchor
  remain faithful.
- Focused follow-up inspected the Chinese auto-wake portrait state. No
  P0/P1/P2 typography, spacing, color, image, content, or control mismatch was
  found, so no post-comparison visual correction was required.

## Build and document checks

- Chinese layout correction, 2026-07-30:
  - Manifesto source/final comparison:
    `audit/qa-manifesto-reference-vs-final.jpg`.
  - Now source/final comparison:
    `audit/qa-now-reference-vs-final.jpg`.
  - Project carousel source/final comparison:
    `audit/qa-projects-reference-vs-final.jpg`.
  - The Manifesto and Now display copy no longer ends with Chinese full stops.
    The Manifesto uses an intentional break before `AI 智能体` and a separate
    second statement instead of browser-dependent CJK wrapping.
  - The Now section gives the Chinese body column more width, uses a 1.25 line
    height, and keeps the heading/body vertically centered.
  - Looping project cards may remain partially visible as cinematic edge
    context, but their metadata and titles stay hidden until the whole card
    enters the viewport; no partial Chinese glyph is covered by the track edge.
  - Desktop and 320px captures were inspected, and browser logs contained no
    application errors.
- `npm run build` passed with Vite 6.4.3 (4,580 modules transformed).
- `git diff --check` reported no whitespace errors.
- Desktop and 320px browser passes confirmed the new Noto Sans SC hierarchy,
  the sidecar handoff, awake-launcher collapse, and Hero-only rest boundary.
- The updated three-page resume renders successfully and displays
  `王欣隆 | Wang Xinlong` in the original first-page layout.

final result: passed
