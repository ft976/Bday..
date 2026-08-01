import { motion } from 'motion/react';
import { Heart, Star, Sparkles, Coffee } from 'lucide-react';
import { useSiteData } from './SiteDataProvider';

const icons = [
  <Heart key="heart" className="w-6 h-6 text-rose-500" />,
  <Sparkles key="sparkles" className="w-6 h-6 text-amber-500" />,
  <Coffee key="coffee" className="w-6 h-6 text-stone-600" />,
  <Star key="star" className="w-6 h-6 text-indigo-500" />
];

export function Reasons() {
  const { data } = useSiteData();
  const { reasons } = data;

  return (
    <section className="py-24 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.h2 
              className="font-serif text-4xl md:text-5xl mb-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {reasons.title} <span className="italic text-rose-500">{reasons.titleHighlight}</span>
            </motion.h2>
            <motion.p 
              className="text-gray-600 text-lg leading-relaxed mb-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {reasons.description}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {reasons.items.map((reason: any, index: number) => (
              <motion.div
                key={index}
                className="bg-[#fdfbf7] p-8 rounded-3xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                  {icons[index % icons.length]}
                </div>
                <h3 className="font-serif text-xl font-medium mb-3">{reason.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
