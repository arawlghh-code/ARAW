import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';

export default function VisualNotes() {
  const { t } = useLanguage();
  const { visualNotes, loading } = usePortfolio();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-xs uppercase tracking-widest">Loading...</div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 px-6 container mx-auto">
      <header className="mb-24">
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter uppercase mb-12">
          {t('Visual Notes', '비주얼 노트')}
        </h1>
        <p className="max-w-2xl text-xl md:text-2xl font-light leading-relaxed opacity-70">
          {t(
            'A collection of visual studies, experiments, and references that inspire my creative process.',
            '창의적인 과정에 영감을 주는 시각적 연구, 실험 및 레퍼런스 모음입니다.'
          )}
        </p>
      </header>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {visualNotes.map((note, index) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="break-inside-avoid"
          >
            <div className="group relative overflow-hidden bg-gray-100">
              <img 
                src={note.image || 'https://picsum.photos/seed/note/800/1000'} 
                alt={note.title_en}
                className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="text-white text-sm font-bold uppercase tracking-widest">
                  {t(note.title_en, note.title_kr)}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
