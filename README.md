# 🎂 Birthday Surprise Application — Full Architecture & Component Reference

A personalized, interactive, full-stack Birthday Celebration web application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Motion (Framer Motion)**, and an **Express backend** with server-side **Google Gemini AI** integration.

---

## 📐 Application Architecture & Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                   BROWSER CLIENT                                 │
├──────────────────────────────────────────────────────────────────────────────────┤
│  [SiteDataProvider (React Context)] ─── Persistent Storage (LocalStorage)        │
│          │                                                                      │
│          ├──► IntroScreen (Curtain reveal & sound unlock)                       │
│          ├──► Hero Banner (Photo, name, glowing ring, confetti animation)      │
│          ├──► Countdown Timer (Live days/hours/minutes/seconds counter)          │
│          ├──► FloatingHearts (Canvas particle simulation)                        │
│          ├──► Reasons Grid (Interactive flippable memory cards)                  │
│          ├──► Photo Gallery (Lightbox modal, photo carousel)                     │
│          ├──► Heartfelt Letter (Typewriter animation & AI Gemini generator)      │
│          ├──► Music Player (Floating audio controller & Web Audio Synthesizer)   │
│          └──► Settings Modal (Full live configuration & link share workflow)     │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ API Requests (/api/*)
┌────────────────────────────────────────▼─────────────────────────────────────────┐
│                               EXPRESS NODE SERVER                                │
├──────────────────────────────────────────────────────────────────────────────────┤
│  • static file server for compiled assets (dist/)                                 │
│  • /api/generate-letter (Google Gemini 2.5 Flash Integration)                   │
│  • /api/upload (Custom media asset handling)                                     │
│  • Port resolution (process.env.PORT) & fallback handler                         │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📜 Complete Component Blueprint (Top Banner to Page End)

### 1. `IntroScreen.tsx` — Opening Reveal & Curtain Cover
- **Role**: The initial entrance screen designed to create excitement and unlock web audio autoplay permissions.
- **Visual Features**: Soft gradient backdrop, pulsing animated birthday cake / envelope icon, floating sparkling particles.
- **Interactions**:
  - Click "Open Surprise" button triggers ambient background music via Web Audio API context.
  - Smooth scale-up and fade-out transition powered by `motion/react` AnimatePresence revealing the main celebration canvas.

---

### 2. `Hero.tsx` — Main Birthday Hero Banner
- **Role**: The core visual headline banner displaying recipient photo and greeting.
- **Visual Features**:
  - Circular recipient avatar framed with a dual-ring animated glowing halo effect.
  - Large display typography for recipient name (e.g., "Happy Birthday, [Name]! 🎉").
  - Customizable subtitle (e.g., "Wishing you a day filled with joy, laughter, and magical moments").
  - Floating confetti and balloon background particles.
- **State Integration**: Reads `name`, `heroTitle`, `heroSubtitle`, and `heroPhoto` directly from `SiteDataProvider`.

---

### 3. `Countdown.tsx` — Milestone Birthday Countdown
- **Role**: Live time tracking counting down to or celebrating the exact birthday moment.
- **Visual Features**:
  - Four distinct numerical display blocks: **Days**, **Hours**, **Minutes**, **Seconds**.
  - Glassmorphic card styling with border glows and smooth digit transition animations.
  - Milestone celebration banner that activates when the countdown reaches zero.
- **Interactions**: Allows live birthday date configuration in the settings panel.

---

### 4. `FloatingHearts.tsx` — Ambient Particle Canvas
- **Role**: Background visual effect rendering interactive floating hearts, sparkles, and glowing light dots.
- **Technical Implementation**:
  - Dynamic HTML5 Canvas rendering engine loop (`requestAnimationFrame`).
  - Responsive canvas sizing via `ResizeObserver`.
  - Mouse hover interaction: particles gently drift away from cursor movement.

---

### 5. `Reasons.tsx` — "Reasons Why You're Special" Interactive Cards
- **Role**: An interactive card grid celebrating special qualities and memories.
- **Visual Features**:
  - Responsive 3-column bento card grid.
  - Interactive card flip and hover lift animations.
  - Dynamic Lucide icon pairings for each card (e.g., `Heart`, `Sparkles`, `Smile`, `Star`, `Sun`, `Music`).
- **Interactions**: Users can click any card to expand a detailed modal or edit reason titles/descriptions directly in the settings panel.

---

### 6. `Gallery.tsx` — Interactive Memory Photo Gallery
- **Role**: Photo memory showcase highlighting favorite moments together.
- **Visual Features**:
  - Masonry/grid layout with Polaroid-style frames and subtle drop shadows.
  - Fullscreen lightbox modal on card click with smooth zoom transition.
  - Caption and date display overlays for each photo.
- **Interactions**: Add, update, or reorder images via the customization drawer. Supports both image URLs and local file uploads.

---

### 7. `Letter.tsx` — Heartfelt Birthday Letter & AI Generation
- **Role**: Deep emotional birthday message section.
- **Features**:
  - Simulated typewriter text reveal animation with optional pause/play controls.
  - **AI Letter Generator**: Integrates server-side Gemini 2.5 Flash API (`/api/generate-letter`).
  - Users can enter tone prompts (e.g., "warm & sentimental", "funny & playful", "poetic & sweet") to auto-generate custom personalized birthday letters in seconds.
  - In-place rich text editing and full custom saving.

---

### 8. `MusicPlayer.tsx` — Floating Audio Controller & Web Audio Synthesizer
- **Role**: Persistent ambient audio player floating in the bottom-right corner.
- **Features**:
  - Choice between custom audio track URLs or procedural soundscape generation.
  - **Procedural Synthesizer (`sounds.ts`)**: Built-in Web Audio API synth that generates warm, harmonic arpeggios on demand without relying on external MP3 files.
  - Controls: Play/Pause toggle, Mute/Unmute, Track Selector, and Animated Music Frequency Equalizer visualizer.

---

### 9. `SettingsModal.tsx` — Complete Live Customization & Share Drawer
- **Role**: Complete admin customization panel accessible via a floating settings button in the bottom-left corner.
- **Features**:
  - Live preview editing for:
    - Recipient Name & Birthday Date
    - Hero Title, Subtitle, and Avatar Image
    - Memory Cards / Reasons
    - Photo Gallery Images & Captions
    - Letter Content & AI Prompts
    - Music Track URLs
  - **Smart Share Detection**: Automatically detects preview domain (`ais-pre`) to display user mode vs edit mode cleanly.
  - LocalStorage export, reset-to-defaults toggle, and instant link copy.

---

### 10. `SiteDataProvider.tsx` — Global React Context & Persistence
- **Role**: Centralized state management provider wrapping the entire application tree.
- **Features**:
  - Syncs all site configuration variables to `localStorage`.
  - Exports helper functions: `updateData()`, `resetToDefault()`, `generateAILetter()`.
  - Fallback initialization with `defaultData.ts`.

---

## 🔊 Audio & Utilities (`/src/lib`)

1. **`sounds.ts`**: Web Audio API oscillator synth creating ambient background music and sound effects (chimes, clicks, celebratory fanfares) cleanly in pure code.
2. **`defaultData.ts`**: Default birthday configuration template pre-populated with meaningful sample content.
3. **`utils.ts`**: Standard utility for class name merging (`clsx` + `tailwind-merge`).

---

## 🛠️ Server Architecture (`server.ts`) & API Endpoints

- **Framework**: Express.js
- **Port Handling**: Binds dynamically to `process.env.PORT` (defaults to `3000` for container environments like Render and Cloud Run).
- **Static Assets**: Serves bundled static frontend files from `./dist` in production mode.
- **API Routes**:
  - `POST /api/generate-letter`: Proxies request to Google GenAI SDK (`@google/genai`) using `GEMINI_API_KEY`.
  - `POST /api/upload`: Handles uploaded media files and stores them securely.

---

## 🚀 Deployment Guide for Render

### Render Configuration File (`render.yaml`)
```yaml
services:
  - type: web
    name: birthday-surprise-app
    runtime: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: NODE_VERSION
        value: 20.18.0
```

### Key Build & Start Commands in `package.json`
- **Build**: `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`
- **Start**: `node dist/server.cjs`
- **Node Engine**: `>=18.0.0`

### Required Environment Variables on Render:
| Variable Name | Description | Required? |
|---|---|---|
| `PORT` | Set automatically by Render (e.g. 10000) | Auto |
| `NODE_ENV` | Must be `production` | Yes |
| `GEMINI_API_KEY` | Optional API key for Gemini AI Letter Generator | Optional |

---

## 📌 File Directory Quick Map

```
/
├── server.ts                  # Express Backend Server (API & Production Static File Server)
├── render.yaml                # Render Web Service Deployment Configuration
├── package.json               # Dependencies, Scripts, and Node Version Engines
├── vite.config.ts             # Vite + React + Tailwind v4 Configuration
├── src/
│   ├── main.tsx               # Client React Root Entry
│   ├── App.tsx                # Main Layout & Section Sequence Container
│   ├── index.css              # Global Tailwind CSS Styles
│   ├── components/
│   │   ├── IntroScreen.tsx    # Surprise Curtain Entrance Screen
│   │   ├── Hero.tsx           # Primary Birthday Hero Banner
│   │   ├── Countdown.tsx      # Live Age/Birthday Countdown Clock
│   │   ├── FloatingHearts.tsx # Background Particle Animation Canvas
│   │   ├── Reasons.tsx        # Interactive Bento Cards Grid
│   │   ├── Gallery.tsx        # Photo Showcase & Lightbox Modal
│   │   ├── Letter.tsx         # Heartfelt Letter & Gemini AI Generator
│   │   ├── MusicPlayer.tsx    # Ambient Music Controller & Synth
│   │   ├── SettingsModal.tsx  # Customization Drawer & Sharing Tool
│   │   └── SiteDataProvider.tsx # Global State Context & LocalStorage Persistence
│   └── lib/
│       ├── defaultData.ts     # Pre-populated Default Birthday Content
│       ├── sounds.ts          # Web Audio API Synthesizer Engine
│       └── utils.ts           # Class Name Helpers
```
