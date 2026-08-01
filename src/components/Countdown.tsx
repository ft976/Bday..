import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSiteData } from './SiteDataProvider';

export function Countdown() {
  const { data } = useSiteData();
  const { countdown } = data;
  
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const TARGET_DATE = new Date(countdown.targetDate);
      const difference = +TARGET_DATE - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [countdown.targetDate]);

  if (!mounted) return null;

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section className="py-20 px-6 relative z-10 bg-white border-y border-stone-100">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 
          className="font-serif text-3xl md:text-4xl mb-12 text-[#2d2824]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {countdown.title} <span className="italic text-rose-500">{countdown.titleHighlight}</span>
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              className="flex flex-col items-center justify-center bg-[#fdfbf7] border border-stone-100 rounded-2xl w-24 h-24 md:w-32 md:h-32 shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <span className="font-serif text-3xl md:text-5xl text-rose-500 mb-1">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-xs md:text-sm uppercase tracking-widest text-stone-400 font-medium">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
