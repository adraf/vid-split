# VID // SPLIT

> Slice your video clips into chunks — entirely in your browser.

Built with Vue 3 + Vite + PrimeVue 4 + FFmpeg WebAssembly.

---

## What it does

VID // SPLIT lets you upload a video and split it into chunks based on platform time limits. Choose from presets for iMessage, Instagram Reels, TikTok, YouTube Shorts, WhatsApp, Snapchat, Facebook, and X — or set a custom chunk length. Output clips can be downloaded individually or all at once.

All processing happens locally in your browser. Your video never leaves your device.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API) |
| Build tool | Vite 5 |
| UI library | PrimeVue 4 with custom dark theme |
| Video processing | FFmpeg WebAssembly (ffmpeg.wasm 0.12) |
| Font | Press Start 2P (Google Fonts) |
| Icons | Icons8 |
| Hosting | Vercel |

---

## Project Structure

```
vid-split/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json                      # COOP/COEP headers + SPA routing
└── src/
    ├── main.js
    ├── App.vue                      # Root orchestrator
    ├── theme/
    │   └── index.js                 # PrimeVue custom preset
    ├── styles/
    │   └── global.css               # CSS vars, CRT scanlines, PrimeVue overrides
    ├── utils/
    │   └── format.js                # formatTime, formatBytes, calcChunks
    ├── composables/
    │   └── useVideoSplitter.js      # FFmpeg logic + reactive state
    └── components/
        ├── AppHeader.vue
        ├── AppFooter.vue
        ├── UploadZone.vue           # Drag & drop / tap to select
        ├── VideoInfo.vue            # File details + chunk preview
        ├── ChunkSelector.vue        # Platform preset dropdown + custom time picker
        ├── SplitButton.vue
        ├── ProgressBar.vue          # Animated progress + VHS loader
        ├── VhsLoader.vue            # Animated VHS cassette split animation
        ├── ErrorBox.vue
        ├── OutputSection.vue        # Results grid + action buttons
        └── SegmentCard.vue          # Individual clip card
```

---

## Local Development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build
npm run preview   # preview production build
```

The dev server automatically applies the `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` headers required for FFmpeg WebAssembly via `vite.config.js`.

```bash
# Via CLI
npm i -g vercel
vercel --prod

# Or connect the GitHub repo at vercel.com — auto-deploys on every push
```

`vercel.json` handles all required headers and SPA routing automatically.

---

## Splitting Logic

```
Duration      Output
─────────────────────────────────────
< chunk size  1 × original length
9 min @ 4min  2 × 4:00  +  1 × 1:00
13 min @ 4min 3 × 4:00  +  1 × 1:00
```

Segments are cut using `-c copy` (stream copy — no re-encoding). Splits are fast and lossless, preserving the original video quality.

---

## Platform Chunk Presets

| Platform | Max length |
|---|---|
| iMessage (default) | 4:00 |
| Instagram Reels | 3:00 |
| YouTube Shorts | 3:00 |
| Facebook Reels | 3:00 |
| X / Twitter | 2:20 |
| TikTok | 1:00 |
| Instagram Stories | 1:00 |
| WhatsApp Status | 1:00 |
| Snapchat | 1:00 |
| Facebook Stories | 0:15 |
| Custom | Your choice |

---

## Desktop vs Mobile

### Desktop
Works perfectly. Drag and drop or select a video, choose your chunk size, split, and download. FFmpeg runs entirely in the browser via WebAssembly with no memory issues on desktop hardware.

### Mobile (iPhone / Safari)

The app works on iPhone but has two known limitations that are fundamental to how iOS handles video in web browsers — not bugs that can be fixed with better code:

**1. Slow video loading from Photos**
When you select a video from your Photos library, iOS has to decode the HEVC video format before handing it to Safari. This can take a significant amount of time for large 4K videos and happens entirely on Apple's side before the app even sees the file. There is no way for a web app to bypass this step.

**2. Memory crashes on large videos**
FFmpeg WebAssembly has to load the entire video file into browser memory before processing. iOS Safari enforces strict memory limits on web apps. Large videos (typically over 500MB) can cause Safari to kill the tab before processing completes. This is a hard ceiling imposed by Apple on all web apps — not something that can be engineered around in the browser.

**Workaround for iPhone users**
- The app works well for shorter clips (under 3-4 minutes at 1080p)
- For larger videos, use the desktop version
- Saving individual clips via the Share button will bring up the native iOS share sheet, allowing you to save directly to your Camera Roll / Photos

---

## Future Plans — Native iOS App

To fully solve the mobile limitations, a native iOS app is planned using **Capacitor** — a framework that wraps the existing Vue web app in a native iOS shell.

A native app would provide:
- **Instant video access** — direct Photos library access via AVFoundation, bypassing the HEVC decode wait entirely
- **No memory limits** — FFmpeg runs natively on the device at full speed with no browser memory restrictions
- **Direct Camera Roll saving** — output clips save straight to Photos without the share sheet workaround
- **Full offline support** — no network required at all

**Distribution plan**
The native app would be distributed via **TestFlight**, Apple's official beta testing platform, which allows sharing with up to 10,000 users via a simple link — no App Store listing required. This requires an Apple Developer account (£99/year).

---

## Privacy

All video processing runs in your browser via WebAssembly. Your video files are never uploaded to any server. Temporary object URLs are revoked and memory is freed after each session.

---

## Credits

- Icons by [Icons8](https://icons8.com/icons)
- Built by [Adam Rafferty Web Design](https://www.adamraffertywebdesign.com/)

---

## License

MIT
