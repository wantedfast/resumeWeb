# 王欣隆 / Wang Xinlong Portfolio

Personal portfolio website built with React, Vite, and GSAP.

## Development

```bash
npm ci
npm run dev
```

### Local digital assistant

The 罗昭玥 / Luo Zhaoyue chat experience uses a Vite development-server proxy so the
DeepSeek key is never shipped to the browser.

1. Copy `.env.example` to `.env.local`.
2. Set `DEEPSEEK_API_KEY` in `.env.local`.
3. Restart `npm run dev`.

The assistant remains a local demonstration in the static production build.
Its conversation is kept in React memory only and is cleared on refresh.

The Hero starts with an 8BIT sleeping 罗昭玥 in the upper-right corner.
Clicking her wakes the assistant, plays the greeting once per tab, and expands
the dark-red portrait card. A 24px Hero scroll gesture, or either `LET HER
REST` control, stops active audio and returns her to the sleeping state without
clearing chat history. Experience and Project introductions replay after every
300ms hover or keyboard-focus dwell; leaving the item stops the current clip.
The Project carousel pauses while the pointer or keyboard focus is inside the
track, and each project image uses a one-shot diagonal glare sweep. Hovering or
keyboard-focusing a Work/Project item also wakes a sleeping assistant and plays
that item's localized introduction after the 300ms dwell.

### Website and assistant languages

The header language control sits immediately left of Resume. It switches the
entire site between English and Simplified Chinese and persists that choice in
the browser. Public identity is shown as 王欣隆 / Wang Xinlong.

The assistant voice control supports English, 中文, and 日本語:

- The Chinese website selects Chinese assistant voice and chat UI by default.
- The English website selects English by default.
- 日本語 switches the assistant UI, static greeting/context voice, and live
  chat response language to Japanese without changing the website language.

### Eleven v3 character voice

罗昭玥's greeting and Experience/Project introductions are pre-generated
static MP3 files. Page visits never call ElevenLabs, and chat responses remain
text-only.

To regenerate all fixed voice assets:

1. Set `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` in `.env.local`.
2. Run `npm run generate:assistant-voice`.

The script always uses `eleven_v3` with the model defaults. It writes English,
Chinese, and Japanese greetings under `public/assets/` and writes the 11
contextual introductions per language under `public/assets/assistant-voice/`.
Existing files are skipped; pass `-- --force` to regenerate them.

## Production build

```bash
npm run build
```

The production output is written to `dist/`.
