import { motion } from 'motion/react';
import { ChevronDown, Heart } from 'lucide-react';
import { playClickSound } from '../lib/sounds';
import { useSiteData } from './SiteDataProvider';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const } 
  }
};

export function Hero() {
  const { data } = useSiteData();
  const { hero } = data;

  const scrollToGallery = () => {
    playClickSound();
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="absolute top-6 left-6 z-50">
        <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md shadow-sm border border-stone-200/50 flex items-center justify-center text-rose-500">
          <Heart size={24} fill="currentColor" />
        </div>
      </div>

      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <img
          src={hero.bgImage}
          alt="Romantic Background"
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbf7]/60 via-[#fdfbf7]/80 to-[#fdfbf7]"></div>
      </motion.div>

      <div className="relative z-10 text-center max-w-3xl mx-auto mt-12 flex flex-col items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2, delayChildren: 0.4 }
            }
          }}
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeUpVariant} className="mb-8">
            <motion.button
              onClick={() => window.dispatchEvent(new CustomEvent('open-settings'))}
              className="text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.4)] cursor-pointer hover:text-rose-600 transition-colors bg-transparent border-none outline-none"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              aria-label="Secret Settings Button"
            >
              <Heart size={48} fill="currentColor" strokeWidth={1.5} />
            </motion.button>
          </motion.div>

          <motion.p variants={fadeUpVariant} className="text-xs md:text-sm tracking-[0.4em] uppercase text-rose-500/80 font-medium mb-6">
            {hero.subtitle}
          </motion.p>

          <motion.h1 variants={fadeUpVariant} className="font-serif text-6xl md:text-8xl lg:text-9xl text-[#2d2824] leading-[0.9] mb-8 tracking-tight">
            {hero.title1} <br className="hidden md:block" />
            <span className="italic text-rose-500 pr-4">{hero.title2}</span>
          </motion.h1>

          <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-stone-500 font-light max-w-xl mx-auto leading-relaxed mb-12">
            {hero.description}
          </motion.p>

          <motion.button
            variants={fadeUpVariant}
            onClick={scrollToGallery}
            whileHover={{ scale: 1.02, backgroundColor: "#e11d48" }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 bg-rose-500 text-white px-10 py-4 rounded-full font-medium text-sm tracking-wide uppercase shadow-[0_10px_40px_-10px_rgba(244,63,94,0.6)] transition-colors cursor-pointer"
          >
            {hero.buttonText}
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2, ease: "easeOut" }}
      >
        <motion.a
          href="#gallery"
          className="flex flex-col items-center gap-3 text-stone-400 hover:text-rose-500 transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase font-medium">Scroll</span>
          <ChevronDown size={18} strokeWidth={1.5} />
        </motion.a>
      </motion.div>
    </section>
  );
}
