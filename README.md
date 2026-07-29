# Wang Xinlong Portfolio

Personal portfolio website built with React, Vite, and GSAP.

## Development

```bash
npm ci
npm run dev
```

### Local digital assistant

The Luo Zhaoyue chat experience uses a Vite development-server proxy so the
DeepSeek key is never shipped to the browser.

1. Copy `.env.example` to `.env.local`.
2. Set `DEEPSEEK_API_KEY` in `.env.local`.
3. Restart `npm run dev`.

The assistant remains a local demonstration in the static production build.
Its conversation is kept in React memory only and is cleared on refresh.

## Production build

```bash
npm run build
```

The production output is written to `dist/`.
