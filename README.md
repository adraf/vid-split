# VID///SPLIT

> Slice your video clips into 4-minute chunks — entirely in your browser.

**No uploads. No servers. No data leaves your device.**

Built with Vue 3 + Vite + PrimeVue 4 + FFmpeg WebAssembly.

---

## Features

- 🎬 Upload MP4, MOV, HEVC, M4V and other video formats
- ✂️ Auto-splits into 4-minute segments (e.g. 9 min → 4 min + 4 min + 1 min)
- 💾 Download individual clips or all at once
- 📱 Works on desktop and mobile (Safari on iPhone, Chrome on Android)
- 🔒 100% local processing — FFmpeg runs via WebAssembly in the browser
- 🎨 PrimeVue 4 component library with a custom dark theme preset

---

## Tech Stack

| Layer             | Technology                              |
|-------------------|-----------------------------------------|
| Framework         | Vue 3 (Composition API)                 |
| Build tool        | Vite 5                                  |
| UI component lib  | PrimeVue 4 + custom `VidSplitPreset`    |
| Icons             | PrimeIcons 7                            |
| Video processing  | @ffmpeg/ffmpeg 0.12 (WebAssembly)       |
| Font              | Press Start 2P (Google Fonts)           |
| Hosting           | Vercel                                  |

---

## Project Structure

```
vid-split/
├── index.html                      # .vs-dark class enables PrimeVue dark mode
├── package.json
├── vite.config.js                  # COOP/COEP headers for dev + ffmpeg exclusion
├── vercel.json                     # COOP/COEP headers for prod + SPA routing
└── src/
    ├── main.js                     # PrimeVue + VidSplitPreset registration
    ├── App.vue                     # Root orchestrator + Toast
    ├── theme/
    │   └── index.js                # definePreset() — full brand token overrides
    ├── styles/
    │   └── global.css              # CSS vars, CRT scanlines, PrimeVue overrides
    ├── utils/
    │   └── format.js               # formatTime, formatBytes, calcChunks
    ├── composables/
    │   └── useVideoSplitter.js     # FFmpeg logic + reactive state singleton
    └── components/
        ├── AppHeader.vue           # Animated logo + tagline
        ├── AppFooter.vue           # PrimeVue Divider + privacy notice
        ├── UploadZone.vue          # Drag & drop / tap to select
        ├── VideoInfo.vue           # File details + PrimeVue Tag chunk badges
        ├── SplitButton.vue         # PrimeVue Button (primary)
        ├── ProgressBar.vue         # PrimeVue ProgressBar + animated label
        ├── ErrorBox.vue            # PrimeVue Message (error severity)
        ├── OutputSection.vue       # Results list + PrimeVue Divider + Save All
        └── SegmentCard.vue         # PrimeVue Card + outlined Button per clip
```

---

## PrimeVue Theme

The app uses a custom preset (`src/theme/index.js`) built with `definePreset(Aura, {...})`.

Key design decisions:
- **Dark mode always on** — tied to the `.vs-dark` class on `<html>`, set at build time
- **Primary colour** — `#CFFFE2` mint mapped across all 50–950 shade slots
- **Zero border-radius** — all components use `borderRadius: '0px'` for the pixel aesthetic
- **Pixel shadow** — buttons get `box-shadow: 4px 4px 0 #A2D5C6` via global CSS overrides
- **Press Start 2P font** — forced onto all PrimeVue internals via `font-family: var(--vs-font) !important`

---

## Local Development

```bash
npm install
npm run dev       # http://localhost:5173 — headers applied automatically
npm run build     # production build → dist/
npm run preview   # preview the dist/ build locally
```

> The dev server applies `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy`
> headers automatically via `vite.config.js`. These are required for `SharedArrayBuffer`
> (used by FFmpeg WebAssembly). Without them the splitter will silently fail.

---

## Deploying to Vercel

### Option A — CLI

```bash
npm i -g vercel
vercel --prod
```

### Option B — GitHub (recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your repository — Vite is auto-detected, no settings needed
4. Click **Deploy**

`vercel.json` handles everything:
- ✅ `Cross-Origin-Opener-Policy: same-origin`
- ✅ `Cross-Origin-Embedder-Policy: require-corp`
- ✅ SPA rewrite (`/* → /index.html`)

---

## Splitting Logic

```
Duration   →  Output
──────────────────────────────────────
< 4 min    →  1 × original length
4 – 8 min  →  2 × up to 4 min
9 min      →  2 × 4 min  +  1 × 1 min
13 min     →  3 × 4 min  +  1 × 1 min
```

Segments are cut with `-c copy` (stream copy, no re-encoding) so splits are fast and lossless.

---

## Mobile (iPhone / Safari)

1. Open the Vercel URL in **Safari**
2. Tap the upload zone and select a video from Files or Photos
3. After splitting tap **⬇ SAVE** on each clip — files land in **Downloads**

> Keep the tab open and screen awake during processing. Large files (1 GB+) may take a few minutes on mobile.

---

## Privacy

All processing runs in your browser via WebAssembly.
Your video is **never uploaded** to any server.
Object URLs are revoked and memory freed after each session.

---

## License

MIT
