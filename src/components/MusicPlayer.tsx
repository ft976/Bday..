import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Music } from 'lucide-react';
import { playClickSound, playHappyBirthdaySynth, stopHappyBirthdaySynth } from '../lib/sounds';
import { useSiteData } from './SiteDataProvider';

export function MusicPlayer() {
  const { data } = useSiteData();
  const musicConfig = data?.music || {
    youtubeVideoId: "aHe23q7673c",
    songTitle: "Happy Birthday Music 🎂🎵",
    customAudioUrl: "",
    useSynthFallback: true,
  };

  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setMounted(true);

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleToggle = () => setPlaying(p => !p);

    window.addEventListener('play-music', handlePlay);
    window.addEventListener('pause-music', handlePause);
    window.addEventListener('toggle-music', handleToggle);

    return () => {
      window.removeEventListener('play-music', handlePlay);
      window.removeEventListener('pause-music', handlePause);
      window.removeEventListener('toggle-music', handleToggle);
    };
  }, []);

  // Handle Play/Pause effect
  useEffect(() => {
    if (!mounted) return;

    if (playing) {
      // 1. Try YouTube iframe command
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }

      // 2. Try Audio element if URL provided
      if (audioRef.current && musicConfig.customAudioUrl) {
        audioRef.current.play().catch(() => {});
      }

      // 3. Play synth melody box as guaranteed ambient backup
      const startSynthLoop = () => {
        playHappyBirthdaySynth(() => {
          if (playing) startSynthLoop();
        });
      };
      if (musicConfig.useSynthFallback !== false) {
        startSynthLoop();
      }
    } else {
      // Pause YouTube
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
      // Pause Audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // Stop Synth
      stopHappyBirthdaySynth();
    }
  }, [playing, mounted, musicConfig.youtubeVideoId, musicConfig.customAudioUrl]);

  if (!mounted) return null;

  const videoId = musicConfig.youtubeVideoId || "aHe23q7673c";
  const songTitle = musicConfig.songTitle || "Happy Birthday Song 🎂🎶";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg text-xs md:text-sm font-medium text-rose-600 border border-rose-100 flex items-center gap-2"
      >
        <Music size={16} className={playing ? "animate-spin text-rose-500" : "text-rose-400"} />
        <span>{playing ? "Playing: " + songTitle : "Play Birthday Music 🎂"}</span>
      </motion.div>

      <button
        onClick={() => {
          playClickSound();
          setPlaying(!playing);
        }}
        className="w-14 h-14 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all hover:scale-105 active:scale-95 relative cursor-pointer"
        aria-label={playing ? "Pause music" : "Play music"}
      >
        {playing ? (
          <Pause size={24} fill="currentColor" />
        ) : (
          <Play size={24} fill="currentColor" className="ml-1" />
        )}
        
        {playing && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-rose-400"
            animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </button>

      {/* Hidden YouTube Player for Birthday Music */}
      <div className="hidden">
        <iframe
          ref={iframeRef}
          width="0"
          height="0"
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=0&loop=1&playlist=${videoId}`}
          title="Birthday Music Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        {musicConfig.customAudioUrl && (
          <audio ref={audioRef} src={musicConfig.customAudioUrl} loop />
        )}
      </div>
    </div>
  );
}

