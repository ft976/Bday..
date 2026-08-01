# 🎂 Master Architecture & Component Specification Document

This master documentation file outlines every single component, data layer, state hook, utility function, audio synthesizer, and backend endpoint in the Birthday Surprise web application from the first entrance screen to the final footer and deployment.

---

## 1. Page Flow & Component Sequence

When a visitor lands on the site, the application renders components in the following strict vertical sequence:

1. **`IntroScreen`**: Overlay screen with interactive envelope/curtain reveal button. Initializes audio context.
2. **`Hero`**: Top banner displaying recipient name, main headline, halo photo ring, and ambient confetti particles.
3. **`Countdown`**: Live days/hours/minutes/seconds birthday countdown timer.
4. **`Reasons`**: Bento grid of interactive card cards highlighting special memories and reasons why the recipient is loved.
5. **`Gallery`**: Interactive photo album with lightbox viewing and caption popups.
6. **`Letter`**: Deep heartfelt birthday letter with typewriter animation and AI Gemini letter generator.
7. **`MusicPlayer`**: Floating fixed bottom-right audio control widget with Web Audio API synthesizer fallback.
8. **`SettingsModal`**: Floating fixed bottom-left drawer for full live configuration, media uploads, and link sharing.
9. **`FloatingHearts`**: Fixed full-viewport background canvas rendering animated particle hearts.

---

## 2. Detailed Technical Component Breakdown

### A. `src/components/IntroScreen.tsx`
- **Purpose**: Interactive entrance curtain that prompts user interaction to enable audio autoplay in modern browsers.
- **State**: Tracks `isOpened` (boolean).
- **Audio Hook**: Invokes `soundEngine.playChime()` on click.

### B. `src/components/Hero.tsx`
- **Purpose**: The primary hero section located at the top of the main page.
- **Elements**:
  - Glowing halo avatar ring around recipient photo.
  - Recipient title and personalized greeting.
  - Floating confetti/balloon particles with smooth entrance animations.

### C. `src/components/Countdown.tsx`
- **Purpose**: Calculates remaining time until target birthday or tracks celebration duration.
- **Timer Loop**: Uses `setInterval` every 1000ms calculating difference between `Date.now()` and `targetDate`.

### D. `src/components/Reasons.tsx`
- **Purpose**: Grid of flippable/expandable memory cards.
- **Components**: Dynamic icon renderer mapping icon names to Lucide icons (`Heart`, `Sparkles`, `Smile`, `Star`, `Sun`, `Music`).

### E. `src/components/Gallery.tsx`
- **Purpose**: Photo showcase displaying memories with dates and captions.
- **Modal**: Built-in full-screen modal with image zoom and image upload button.

### F. `src/components/Letter.tsx`
- **Purpose**: Main letter section.
- **AI Integration**: Sends prompt to `/api/generate-letter` which uses `@google/genai` to stream or return custom birthday notes.

### G. `src/components/MusicPlayer.tsx`
- **Purpose**: Controls background music playback.
- **Fallback**: Leverages `sounds.ts` Web Audio API oscillator when no MP3 URL is provided.

### H. `src/components/SettingsModal.tsx`
- **Purpose**: Full editor modal allowing total customization of every text field, photo, date, reason, and letter.
- **URL Context Detection**: Detects shared link domain (`ais-pre`) vs edit mode.

### I. `src/lib/sounds.ts`
- **Purpose**: Pure Web Audio API procedural synthesizer.
- **Chords & Notes**: Generates gentle arpeggiated frequencies (C major 7th / F major 7th chords) with soft gain attack/decay envelopes.

---

## 3. Server & Deployment Specification

- **Server Entry**: `server.ts`
- **Bundle Target**: `dist/server.cjs` (built via `esbuild server.ts --bundle --platform=node --format=cjs --packages=external`)
- **Port Variable**: Reads `process.env.PORT` dynamically to ensure compatibility with Render, Cloud Run, Heroku, and Railway.
- **Render Config**: `render.yaml` with Node 20.18.0 engine declaration.
