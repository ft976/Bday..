'use client';

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

export function playChimeSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, ctx.currentTime);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.6);
}

// Synthesized Happy Birthday tune notes (note frequency in Hz, duration in sec)
const HAPPY_BIRTHDAY_NOTES = [
  { note: 261.63, duration: 0.35 }, // C4
  { note: 261.63, duration: 0.15 }, // C4
  { note: 293.66, duration: 0.5 },  // D4
  { note: 261.63, duration: 0.5 },  // C4
  { note: 349.23, duration: 0.5 },  // F4
  { note: 329.63, duration: 0.9 },  // E4

  { note: 261.63, duration: 0.35 }, // C4
  { note: 261.63, duration: 0.15 }, // C4
  { note: 293.66, duration: 0.5 },  // D4
  { note: 261.63, duration: 0.5 },  // C4
  { note: 392.00, duration: 0.5 },  // G4
  { note: 349.23, duration: 0.9 },  // F4

  { note: 261.63, duration: 0.35 }, // C4
  { note: 261.63, duration: 0.15 }, // C4
  { note: 523.25, duration: 0.5 },  // C5
  { note: 440.00, duration: 0.5 },  // A4
  { note: 349.23, duration: 0.5 },  // F4
  { note: 329.63, duration: 0.5 },  // E4
  { note: 293.66, duration: 0.9 },  // D4

  { note: 466.16, duration: 0.35 }, // Bb4
  { note: 466.16, duration: 0.15 }, // Bb4
  { note: 440.00, duration: 0.5 },  // A4
  { note: 349.23, duration: 0.5 },  // F4
  { note: 392.00, duration: 0.5 },  // G4
  { note: 349.23, duration: 1.2 },  // F4
];

let synthLoopTimeout: any = null;
let masterSynthGain: GainNode | null = null;
let activeOscillators: OscillatorNode[] = [];

export function stopHappyBirthdaySynth() {
  if (synthLoopTimeout) {
    clearTimeout(synthLoopTimeout);
    synthLoopTimeout = null;
  }

  const ctx = getAudioContext();
  if (ctx && masterSynthGain) {
    try {
      masterSynthGain.gain.cancelScheduledValues(ctx.currentTime);
      masterSynthGain.gain.setValueAtTime(0, ctx.currentTime);
    } catch (e) {}
  }

  activeOscillators.forEach(osc => {
    try {
      osc.stop();
      osc.disconnect();
    } catch (e) {}
  });
  activeOscillators = [];
}

export function playHappyBirthdaySynth(onComplete?: () => void) {
  stopHappyBirthdaySynth();
  const ctx = getAudioContext();
  if (!ctx) return;

  // Setup or reset master synth gain
  if (!masterSynthGain) {
    masterSynthGain = ctx.createGain();
    masterSynthGain.connect(ctx.destination);
  }
  masterSynthGain.gain.cancelScheduledValues(ctx.currentTime);
  masterSynthGain.gain.setValueAtTime(1, ctx.currentTime);

  let now = ctx.currentTime + 0.05;
  activeOscillators = [];

  HAPPY_BIRTHDAY_NOTES.forEach(({ note, duration }) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle'; // Sweet music box / bell tone
    osc.frequency.setValueAtTime(note, now);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.1);

    osc.connect(gainNode);
    gainNode.connect(masterSynthGain!);

    osc.start(now);
    osc.stop(now + duration + 0.12);

    activeOscillators.push(osc);

    now += duration + 0.05;
  });

  const totalTimeMs = (now - ctx.currentTime) * 1000;
  synthLoopTimeout = setTimeout(() => {
    if (onComplete) onComplete();
  }, totalTimeMs);
}
