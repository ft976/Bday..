# 🎂 Birthday Surprise Web Application

An interactive, full-stack Birthday Celebration web application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Motion**, and an **Express Node.js** backend. Features a procedural Web Audio API synthesizer, customizable memory cards, photo gallery lightbox, AI letter generator powered by **Google Gemini**, and zero-config deployment setup for **Render** and **Google Cloud Run**.

---

## ✨ Features & Highlights

- 🎁 **Interactive Intro Curtain**: Reveal entrance animation that unlocks browser audio permissions.
- 👑 **Hero Banner**: High-impact avatar framed with an animated glowing dual-ring halo.
- ⏱️ **Live Milestone Countdown**: Days, hours, minutes, and seconds clock leading up to the birthday date.
- 🎈 **Particle Canvas Engine**: HTML5 2D Canvas rendering floating hearts, sparkles, and interactive repelling physics.
- 💌 **Typewriter Letter & AI Gemini Generator**: Personalized birthday message with optional AI drafting powered by Gemini 2.5 Flash.
- 🖼️ **Polaroid Gallery & Lightbox**: Interactive photo album with full-screen zoom and caption popups.
- 💖 **Interactive Reasons Grid**: Flippable bento memory cards celebrating special moments.
- 🎵 **Procedural Sound Engine**: Pure Web Audio API synthesizer playing the Happy Birthday melody in pure code without external MP3 dependencies.
- ⚙️ **Full Customizer & Live Editor Drawer**: Live editing for all recipient details, photos, memory cards, and background audio.
- 🚀 **Render & Cloud Run Ready**: Self-contained `dist/server.cjs` bundle with dynamic `PORT` binding and `render.yaml` configuration.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion (`motion/react`)
- **Backend**: Node.js, Express.js
- **Bundler**: Vite (Client) + Esbuild (Server CommonJS Bundle)
- **State & Storage**: React Context + LocalStorage + Express File System Persistence (`/data/settings.json`)
- **Audio**: Web Audio API (Synthesizer Oscillators & Gain Envelopes)
- **Deployment**: Render (`render.yaml`), Docker/Cloud Run compatible

---

## 🚀 Quick Start & Local Setup

### 1. Installation
```bash
npm install
```

### 2. Development Mode
Runs Vite HMR dev server integrated with Express backend on `http://localhost:3000`:
```bash
npm run dev
```

### 3. Production Build & Execution
```bash
# Build static assets & bundle server.ts -> dist/server.cjs
npm run build

# Start production server
npm start
```

---

## 🌐 Deploying to Render

This project is pre-configured for seamless deployment on **Render**:

1. Push your repository to GitHub.
2. In Render Dashboard, click **New +** -> **Blueprint**.
3. Connect your repository — Render will automatically detect `render.yaml`.
4. Click **Apply**. Render will run:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

---

## 📂 Project Structure

```
├── server.ts                  # Express Backend Server (API & Production Static File Server)
├── render.yaml                # Render Web Service Blueprint Config
├── package.json               # Dependencies, Scripts, Node Engine Specs
├── vite.config.ts             # Vite + React + Tailwind Configuration
├── DOCUMENTATION.md           # Master Architecture & Technical Manual
├── src/
│   ├── main.tsx               # Client Entry Point
│   ├── App.tsx                # Layout Container & Sticky Footer
│   ├── index.css              # Global Tailwind Styles
│   ├── components/
│   │   ├── IntroScreen.tsx    # Surprise Curtain Entrance Screen
│   │   ├── Hero.tsx           # Primary Birthday Hero Banner
│   │   ├── Countdown.tsx      # Live Birthday Countdown Timer
│   │   ├── FloatingHearts.tsx # HTML5 Canvas Particle Engine
│   │   ├── Reasons.tsx        # Interactive Memory Cards Grid
│   │   ├── Gallery.tsx        # Photo Showcase & Lightbox Modal
│   │   ├── Letter.tsx         # Heartfelt Letter & Gemini AI Integration
│   │   ├── MusicPlayer.tsx    # Ambient Music Controller & Web Audio Synth
│   │   ├── SettingsModal.tsx  # Live Customization Drawer & Link Sharer
│   │   └── SiteDataProvider.tsx # Global Context Provider & Storage Sync
│   └── lib/
│       ├── defaultData.ts     # Pre-populated Default Birthday Content
│       ├── sounds.ts          # Web Audio API Procedural Synthesizer
│       └── utils.ts           # Class Name Utilities
```

---

## 📄 Documentation

For deep technical specifications, component data contracts, synthesizer frequency tables, and instrumentation details, please see **[DOCUMENTATION.md](./DOCUMENTATION.md)**.
