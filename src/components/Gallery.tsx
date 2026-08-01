import { motion } from 'motion/react';
import { playChimeSound } from '../lib/sounds';
import { useSiteData } from './SiteDataProvider';

export function Gallery() {
  const { data } = useSiteData();
  const { gallery } = data;

  return (
    <section id="gallery" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <motion.h2 
          className="font-serif text-4xl md:text-5xl mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          {gallery.title} <span className="italic text-rose-500">{gallery.titleHighlight}</span>
        </motion.h2>
        <motion.p 
          className="text-gray-500 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {gallery.description}
        </motion.p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {gallery.photos.map((photo: any, index: number) => (
          <motion.div
            key={photo.id || index}
            onMouseEnter={() => playChimeSound()}
            className={`relative w-full overflow-hidden rounded-2xl break-inside-avoid shadow-sm group ${photo.aspect || 'aspect-[3/4]'}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: (index * 0.1) * 0.5 }}
          >
            <img
              src={photo.src}
              alt={photo.alt || 'Gallery photo'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white font-medium">{photo.alt}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
