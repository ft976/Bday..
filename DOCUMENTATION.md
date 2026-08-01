# 🎂 Master Architecture, Component Specification & Instrumentation Manual

This document serves as the exhaustive reference manual for the **Birthday Surprise Application**. It provides a granular explanation of every component, state hook, utility, Web Audio synth engine, Express backend API route, database/file persistence layer, customizer modal, and cloud deployment architecture (Render & Cloud Run).

---

## 📑 Table of Contents
1. [Executive Summary & Purpose](#1-executive-summary--purpose)
2. [Full-Stack Architecture & System Data Flow](#2-full-stack-architecture--system-data-flow)
3. [Comprehensive Component Blueprint (Top Banner to Footer)](#3-comprehensive-component-blueprint-top-banner-to-footer)
   - [3.1 App.tsx — Layout Root & Sticky Footer](#31-apptsx--layout-root--sticky-footer)
   - [3.2 SiteDataProvider.tsx — Global Context & Persistence Engine](#32-sitedataprovider-tsx--global-context--persistence-engine)
   - [3.3 IntroScreen.tsx — Curtain Reveal & Audio Permission Gate](#33-introscreen-tsx--curtain-reveal--audio-permission-gate)
   - [3.4 Hero.tsx — Main Birthday Headline & Avatar Halo](#34-herotsx--main-birthday-headline--avatar-halo)
   - [3.5 Countdown.tsx — Live Milestone Timer](#35-countdowntsx--live-milestone-timer)
   - [3.6 FloatingHearts.tsx — Canvas Particle System](#36-floatingheartstsx--canvas-particle-system)
   - [3.7 Reasons.tsx — Bento Grid Memory Cards](#37-reasonstsx--bento-grid-memory-cards)
   - [3.8 Gallery.tsx — Interactive Photo Album & Lightbox](#38-gallerytsx--interactive-photo-album--lightbox)
   - [3.9 Letter.tsx — Typewriter Letter & AI Gemini Integration](#39-lettertsx--typewriter-letter--ai-gemini-integration)
   - [3.10 MusicPlayer.tsx — Ambient Soundscape Controller](#310-musicplayertsx--ambient-soundscape-controller)
   - [3.11 SettingsModal.tsx — Live Editor & Share Tool](#311-settingsmodaltsx--live-editor--share-tool)
4. [Web Audio API Procedural Synthesizer (`src/lib/sounds.ts`)](#4-web-audio-api-procedural-synthesizer-srclibsoundsts)
5. [Express Backend Server (`server.ts`) & File System Store](#5-express-backend-server-serverts--file-system-store)
6. [Build Pipeline & Bundle Compilation (Vite + Esbuild)](#6-build-pipeline--bundle-compilation-vite--esbuild)
7. [Render Cloud Deployment Guide & Issue Fixes](#7-render-cloud-deployment-guide--issue-fixes)
8. [Developer Customization & Extension Manual](#8-developer-customization--extension-manual)

---

## 1. Executive Summary & Purpose

The **Birthday Surprise Application** is a personalized, interactive, full-stack web application designed to deliver an unforgettable digital birthday celebration experience. 

### Key Capabilities & Architectural Highlights:
- **Zero External Media Dependency Audio**: Features a built-in procedural Web Audio API synthesizer that plays the complete "Happy Birthday" song and interactive sound effects using synthesized oscillators without requiring heavy external MP3 files.
- **Universal Multi-Tenant Customization**: Includes a real-time drawer editor (`SettingsModal`) allowing users to customize recipient names, dates, avatar photos, memory cards, photo galleries, background music, and letters.
- **Persistent Global State**: Customizations are persisted both locally (browser `localStorage`) and globally (Express server `/api/settings` backed by atomic JSON storage).
- **Interactive Visual Polish**: Employs an HTML5 Canvas particle engine for floating heart physics, Framer Motion transitions, Polaroid lightbox photo expanders, and typewriter letter animations.
- **Production Container Ready**: Fully optimized for one-click deployment on **Render**, **Google Cloud Run**, **Railway**, or **Heroku** with flexible `PORT` resolution and bundled CommonJS server builds.

---

## 2. Full-Stack Architecture & System Data Flow

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                    CLIENT BROWSER                                      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  [React 19 SPA Engine]                                                                 │
│         │                                                                              │
│         ├──► SiteDataProvider (Context Store) ◄──► LocalStorage Cache                  │
│         │         │                                                                    │
│         │         ├──► IntroScreen (Web Audio unlock & curtain reveal)                 │
│         │         ├──► Hero Banner (Glow halo photo, confetti & balloon particles)      │
│         │         ├──► Countdown (Live milestone timer: days/hrs/mins/secs)           │
│         │         ├──► Gallery (Polaroid grid & full-screen lightbox modal)            │
│         │         ├──► Reasons (3-column flippable bento memory cards)                 │
│         │         ├──► Letter (Typewriter animation & AI Gemini generator)             │
│         │         ├──► MusicPlayer (Floating audio control & Web Audio synth)          │
│         │         └──► SettingsModal (Live editor & share drawer)                      │
│         │                                                                              │
│         └──► FloatingHearts (2D Canvas Particle Engine: requestAnimationFrame loop)    │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ HTTP REST Requests (/api/*)
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                                   EXPRESS NODE BACKEND                                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  • Port Resolver: process.env.PORT || 3000 (0.0.0.0 binding)                          │
│  • Endpoint: GET  /api/settings ──► Reads ./data/settings.json                         │
│  • Endpoint: POST /api/settings ──► Writes ./data/settings.json (Atomic update)       │
│  • Static File Server: Serves ./dist SPA bundle in production mode                     │
│  • Development Middleware: Integrates Vite HMR middleware in dev mode                  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Comprehensive Component Blueprint (Top Banner to Footer)

### 3.1 `App.tsx` — Layout Root & Sticky Footer
- **File Location**: `/src/App.tsx`
- **Role**: Entry layout component that wraps the page with `SiteDataProvider` and arranges all visual sections in strict logical hierarchy.
- **Key State & Logic**:
  - `copied` (boolean state): Tracks clipboard state when the user clicks the sticky share button.
  - `handleShare()`: Copies `window.location.href` to clipboard and triggers a 2.5-second feedback toast.
- **Visual Sections**:
  1. `<IntroScreen />`
  2. `<FloatingHearts />`
  3. `<MusicPlayer />`
  4. `<Hero />`
  5. `<Countdown />`
  6. `<Gallery />`
  7. `<Reasons />`
  8. `<Letter />`
  9. `<SettingsModal />`
  10. Sticky `<footer />`: Contains credit text and copyable share link button with animated `Share2` and `Check` Lucide icons.

---

### 3.2 `SiteDataProvider.tsx` — Global Context & Persistence Engine
- **File Location**: `/src/components/SiteDataProvider.tsx`
- **Role**: Centralized state management provider for the entire site.
- **State Hooks**:
  - `data` (object): Stores the active configuration (name, hero titles, photo gallery, reasons, letter text, music settings). Initialized with `defaultSiteData`.
  - `isLoaded` (boolean): Prevents flash of unstyled content until local/remote storage is hydrated.
- **Synchronization Logic**:
  1. Reads `localStorage.getItem('siteData')` immediately on mount.
  2. Polls `/api/settings` every 5000ms (`setInterval`) to ensure live multi-device updates.
  3. `updateData(newData)`: Updates local state, syncs to `localStorage`, and issues a `POST /api/settings` request to persist changes globally on the server.

---

### 3.3 `IntroScreen.tsx` — Curtain Reveal & Audio Permission Gate
- **File Location**: `/src/components/IntroScreen.tsx`
- **Role**: Entrance screen covering the viewport to create anticipation and resolve browser audio autoplay restrictions.
- **Key Interactions**:
  - Clicking "Open Surprise 🎁" plays a chime sound (`playChimeSound()`), starts background music, and triggers a Framer Motion scale-and-fade animation (`AnimatePresence`) that slides away the curtain overlay.

---

### 3.4 `Hero.tsx` — Main Birthday Headline & Avatar Halo
- **File Location**: `/src/components/Hero.tsx`
- **Role**: The prominent top visual banner celebrating the recipient.
- **Visual Design**:
  - **Avatar Frame**: Circular image container surrounded by an animated dual-ring glowing halo (CSS pulse animation).
  - **Typography**: Scaled high-contrast title displaying recipient name (e.g., "Happy Birthday, Sarah! 🎉").
  - **Ambient Particles**: Floating confetti pieces and balloon icons drifting across the header canvas.
- **Data Hook**: Reads `data.hero` (recipient name, hero title, hero subtitle, avatar photo URL) from `useSiteData()`.

---

### 3.5 `Countdown.tsx` — Live Milestone Timer
- **File Location**: `/src/components/Countdown.tsx`
- **Role**: Displays an interactive milestone countdown to the recipient's exact birth date/time.
- **Key Functions**:
  - `calculateTimeLeft()`: Computes difference between current time (`Date.now()`) and `data.targetDate`.
  - Generates four glassmorphic card widgets: **Days**, **Hours**, **Minutes**, **Seconds**.
  - Displays a special celebration banner with glowing text when the timer reaches zero.

---

### 3.6 `FloatingHearts.tsx` — Canvas Particle System
- **File Location**: `/src/components/FloatingHearts.tsx`
- **Role**: Full-screen fixed background canvas providing organic, animated floating heart and sparkle particles.
- **Technical Implementation**:
  - HTML5 2D Canvas context rendering loop using `requestAnimationFrame`.
  - Responsive canvas resizing bound to window `ResizeObserver`.
  - **Physics Engine**: Each particle maintains properties for position `(x, y)`, size, speed, opacity, float angle, and sway frequency.
  - **Mouse Interaction**: Tracks pointer position `(mouseX, mouseY)` to create gentle repelling forces when the user moves their cursor over particles.

---

### 3.7 `Reasons.tsx` — Bento Grid Memory Cards
- **File Location**: `/src/components/Reasons.tsx`
- **Role**: Displays a 3-column bento grid of flippable memory cards highlighting why the recipient is special.
- **Key Features**:
  - **Dynamic Icon Resolver**: Maps string identifiers (`"heart"`, `"sparkles"`, `"smile"`, `"star"`, `"sun"`, `"music"`) to Lucide React icons.
  - **Card Flip Mechanism**: Hover/click triggers 3D CSS rotate transform revealing deeper descriptions and personal memories.

---

### 3.8 `Gallery.tsx` — Interactive Photo Album & Lightbox
- **File Location**: `/src/components/Gallery.tsx`
- **Role**: Showcase of memorable photos with captions and dates.
- **Interactive Lightbox**:
  - Clicking any Polaroid photo card opens a full-screen Modal with image backdrop blur, high-resolution zoom view, caption text, and navigation controls.
  - Includes media file dropzone and URL entry for instant photo additions.

---

### 3.9 `Letter.tsx` — Typewriter Letter & AI Gemini Integration
- **File Location**: `/src/components/Letter.tsx`
- **Role**: Heartfelt personal letter container with realistic typewriter reveal animation.
- **AI Generator**:
  - Users can select or enter a prompt tone (e.g., "warm & nostalgic", "funny & playful", "deep & emotional").
  - Sends a request to `/api/generate-letter` (or client AI fallback) powered by **Google Gemini 2.5 Flash** to draft a bespoke birthday letter in seconds.
  - Features play/pause controls for the typewriter animation.

---

### 3.10 `MusicPlayer.tsx` — Ambient Soundscape Controller
- **File Location**: `/src/components/MusicPlayer.tsx`
- **Role**: Fixed bottom-right widget managing background celebration music.
- **Audio Modes**:
  1. **Custom Track URL**: Plays user-provided audio streams.
  2. **Procedural Synthesizer (`sounds.ts`)**: Triggers synthesized Happy Birthday melody loops using Web Audio API oscillators when no MP3 URL is specified.
- **Visualizer**: Animated frequency spectrum bars indicating audio playback state.

---

### 3.11 `SettingsModal.tsx` — Live Editor & Share Tool
- **File Location**: `/src/components/SettingsModal.tsx`
- **Role**: Comprehensive administration drawer accessible via floating bottom-left gear icon.
- **Editable Fields**:
  - Recipient Name & Birthday Date
  - Hero Title, Subtitle, and Avatar Image URL / Upload
  - Memory Card Reasons (Add / Edit / Remove)
  - Photo Gallery Images & Captions
  - Letter Text & AI Generator Prompt
  - Background Music Track URL
- **Sharing & Persistence**:
  - Includes "Copy Page Link" button and "Reset to Defaults" option.

---

## 4. Web Audio API Procedural Synthesizer (`src/lib/sounds.ts`)

To ensure zero dependencies on external media files, the app includes a procedural Web Audio API sound synthesizer engine in `src/lib/sounds.ts`.

### Sound Routines:
1. **`getAudioContext()`**: Instantiates or un-suspends the browser `AudioContext`.
2. **`playClickSound()`**: Synthesizes a subtle 600Hz -> 100Hz frequency click with exponential decay (0.05s).
3. **`playChimeSound()`**: Synthesizes a high 1200Hz bell chime with linear attack and 0.6s exponential decay.
4. **`playHappyBirthdaySynth(onComplete)`**: Plays a 25-note musical sequence array representing the complete "Happy Birthday" melody:

```typescript
// Sample note definition array in sounds.ts
const HAPPY_BIRTHDAY_NOTES = [
  { note: 261.63, duration: 0.35 }, // C4
  { note: 261.63, duration: 0.15 }, // C4
  { note: 293.66, duration: 0.5 },  // D4
  { note: 261.63, duration: 0.5 },  // C4
  { note: 349.23, duration: 0.5 },  // F4
  { note: 329.63, duration: 0.9 },  // E4
  // ... (Full melody sequence through C5 and Bb4)
];
```

Uses `triangle` wave oscillators with envelope gain nodes for a sweet, music-box timbre.

---

## 5. Express Backend Server (`server.ts`) & File System Store

The Express backend (`server.ts`) handles both API services and static file delivery:

### Port Resolution:
```typescript
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
```

### Persistence Logic (`/api/settings`):
- Checks for `/data` directory at runtime (creates recursively if missing).
- `GET /api/settings`: Reads `./data/settings.json` and returns stored site data.
- `POST /api/settings`: Accepts JSON payload and writes to `./data/settings.json` atomically.

### Production Static Serving:
- In production (`process.env.NODE_ENV === "production"`), serves built frontend static files from `./dist` via `express.static`.
- Implements wildcard fallback (`app.get("*")`) returning `dist/index.html` for single-page routing support.

---

## 6. Build Pipeline & Bundle Compilation (Vite + Esbuild)

The build configuration ensures fast development iteration and a single, self-contained server bundle for production deployment:

### Package Scripts (`package.json`):
```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "lint": "tsc --noEmit"
  }
}
```

### Why Esbuild Bundles `server.ts`:
- Compiles TypeScript `server.ts` into a CommonJS bundle (`dist/server.cjs`).
- Bypasses Node ESM relative path lookup errors in container runtimes.
- Bundles internal imports while keeping external NPM modules external (`--packages=external`).

---

## 7. Render Cloud Deployment Guide & Issue Fixes

### Issues Resolved for Render Deployment:
1. **Moved Runtime Types to `dependencies`**: Dependencies such as `@types/express`, `@types/node`, `esbuild`, `typescript`, `vite`, and `tsx` were configured so production builds succeed seamlessly on Render during `npm install && npm run build`.
2. **Fixed Hardcoded Port Issues**: Updated `server.ts` to dynamically inspect `process.env.PORT` (Render dynamically assigns ports like `10000`).
3. **Declared Node Version**: Added `.node-version` file specifying `20.18.0` and declared `"engines": { "node": ">=18.0.0" }` in `package.json`.
4. **Configured `render.yaml` Blueprint**:

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

---

## 8. Developer Customization & Extension Manual

### Customizing Default Content (`src/lib/defaultData.ts`):
Edit `defaultSiteData` to change fallback recipient names, dates, quotes, and memories.

### Adding New Reasons or Bento Cards:
Modify the `reasons` array inside `defaultData.ts` or add new entries directly through the UI via `SettingsModal`.

### Testing Build Locally:
```bash
# 1. Install dependencies
npm install

# 2. Test production build
npm run build

# 3. Start production server locally
npm start
```
