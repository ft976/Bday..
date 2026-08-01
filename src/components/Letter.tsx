import { motion } from 'motion/react';
import { Gift } from 'lucide-react';
import { useState } from 'react';
import { playClickSound } from '../lib/sounds';
import { useSiteData } from './SiteDataProvider';

export function Letter() {
  const { data } = useSiteData();
  const { letter } = data;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="letter" className="py-32 px-6 relative z-10 bg-stone-900 text-stone-100 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-900/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {!isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => {
              playClickSound();
              setIsOpen(true);
            }}
          >
            <motion.div 
              className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform duration-300"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Gift size={40} className="text-white" />
            </motion.div>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">I have a message for you</h2>
            <p className="text-stone-400 uppercase tracking-widest text-sm">Tap to open</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="bg-stone-800/50 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-stone-700/50 text-left"
          >
            <h2 className="font-serif text-3xl md:text-4xl mb-8 text-rose-400">{letter.title}</h2>
            
            <div className="space-y-6 text-stone-300 leading-relaxed font-light text-lg">
              {letter.paragraphs.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
              <p className="pt-6 font-serif text-xl text-white">
                {letter.signoff} <br />
                <span className="text-rose-400 italic mt-2 block">{letter.signoffName}</span>
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
