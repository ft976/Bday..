import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playClickSound } from '../lib/sounds';

export function IntroScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleTap = () => {
    playClickSound();
    window.dispatchEvent(new CustomEvent('play-music'));
    setIsVisible(false);
    document.body.style.overflow = 'auto';
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)',
          }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden cursor-pointer selection:bg-rose-500 selection:text-white"
          onClick={handleTap}
        >
          <motion.div 
            className="absolute inset-0 opacity-30"
            animate={{ 
              background: [
                'radial-gradient(circle at 50% 50%, rgba(244,63,94,0.1) 0%, rgba(0,0,0,0) 50%)',
                'radial-gradient(circle at 50% 50%, rgba(244,63,94,0.15) 0%, rgba(0,0,0,0) 60%)',
                'radial-gradient(circle at 50% 50%, rgba(244,63,94,0.1) 0%, rgba(0,0,0,0) 50%)',
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl text-stone-100 mb-8 tracking-tight font-light flex items-center justify-center gap-4">
                <span className="font-serif">Love</span> 
                <span className="font-dancing text-rose-400 text-6xl md:text-8xl lowercase">awaits</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <motion.p 
                className="text-stone-400/60 tracking-[0.5em] text-[10px] md:text-xs uppercase font-medium"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                Tap to begin
              </motion.p>
            </motion.div>
          </div>
          
          <motion.div 
            className="absolute bottom-12 w-[1px] h-16 bg-gradient-to-b from-rose-500/50 to-transparent"
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
