import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { playChimeSound, playClickSound } from '../lib/sounds';
import { useSiteData } from './SiteDataProvider';

export function Gallery() {
  const { data } = useSiteData();
  const { gallery } = data;
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handleNext = () => {
    playClickSound();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % gallery.photos.length);
    }
  };

  const handlePrev = () => {
    playClickSound();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + gallery.photos.length) % gallery.photos.length);
    }
  };

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
            onClick={() => {
              playClickSound();
              setSelectedPhotoIndex(index);
            }}
            className={`relative w-full overflow-hidden rounded-2xl break-inside-avoid shadow-sm group cursor-pointer ${photo.aspect || 'aspect-[3/4]'}`}
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
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg scale-90 group-hover:scale-100">
                <Maximize2 size={20} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
              <p className="text-white font-medium text-sm flex items-center gap-2">
                <Heart size={14} className="text-rose-400 fill-current" />
                <span>{photo.alt}</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
              aria-label="Previous Photo"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
              aria-label="Next Photo"
            >
              <ChevronRight size={28} />
            </button>

            <motion.div
              key={selectedPhotoIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="max-w-4xl max-h-[85vh] relative flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={gallery.photos[selectedPhotoIndex]?.src}
                alt={gallery.photos[selectedPhotoIndex]?.alt || 'Memory'}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
                referrerPolicy="no-referrer"
              />
              <p className="mt-4 text-white text-base font-serif italic text-center px-4">
                "{gallery.photos[selectedPhotoIndex]?.alt}"
              </p>
              <p className="text-stone-400 text-xs mt-1">
                {selectedPhotoIndex + 1} of {gallery.photos.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

