import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';

export default function Works() {
  const { t } = useLanguage();
  const { works, loading } = usePortfolio();
  const [filter, setFilter] = useState('all');

  const categories = ['all', ...new Set(works.map(w => w.category_en.toLowerCase()))];

  const filteredWorks = filter === 'all' 
    ? works 
    : works.filter(w => w.category_en.toLowerCase() === filter);

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
          {t('Works', '작업물')}
        </h1>
        
        <div className="flex flex-wrap gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-[10px] uppercase tracking-[0.2em] px-6 py-2 rounded-full border transition-all ${
                filter === cat 
                  ? 'bg-black text-white border-black' 
                  : 'bg-transparent text-black border-black/10 hover:border-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8">
        {filteredWorks.map((work, index) => {
          // Create a dynamic gallery feel with different column spans
          const isLarge = index % 5 === 0;
          const isMedium = index % 5 === 2 || index % 5 === 4;
          
          const colSpan = isLarge ? 'lg:col-span-8' : isMedium ? 'lg:col-span-6' : 'lg:col-span-4';
          const aspectRatio = isLarge ? 'aspect-[16/9]' : 'aspect-square';

          return (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              className={`${colSpan} group`}
            >
              <Link to={`/works/${work.slug}`} className="block h-full">
                <div className={`relative ${aspectRatio} overflow-hidden bg-zinc-100 mb-6`}>
                  <img 
                    src={work.thumbnail || 'https://picsum.photos/seed/work/800/800'} 
                    alt={work.title_en}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Overlay Info */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 md:p-12">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-white/60 text-[10px] uppercase tracking-[0.4em] mb-2">
                        {t(work.category_en, work.category_kr)}
                      </p>
                      <h3 className="text-white text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none mb-4">
                        {t(work.title_en, work.title_kr)}
                      </h3>
                      <div className="w-12 h-px bg-white/30" />
                    </div>
                  </div>
                </div>
                
                {/* Mobile/Static Info */}
                <div className="md:hidden mt-4">
                  <h3 className="text-xl font-bold tracking-tighter uppercase">
                    {t(work.title_en, work.title_kr)}
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-40">
                    {t(work.category_en, work.category_kr)}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
