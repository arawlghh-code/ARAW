import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function WorkDetail() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const { works, loading } = usePortfolio();

  const work = works.find(w => w.slug === slug);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-xs uppercase tracking-widest">Loading...</div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold mb-4 tracking-tighter uppercase">Work Not Found</h1>
        <Link to="/works" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1">Back to Works</Link>
      </div>
    );
  }

  const getVimeoId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    return match ? match[1] : url.split('/').pop();
  };

  const vimeoId = work.vimeoUrl ? getVimeoId(work.vimeoUrl) : null;

  return (
    <div className="pt-40 pb-32">
      <div className="container mx-auto px-6">
        <Link to="/works" className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity mb-12">
          <ArrowLeft size={12} />
          <span>{t('Back to Works', '목록으로 돌아가기')}</span>
        </Link>

        <header className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-none">
              {t(work.title_en, work.title_kr)}
            </h1>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.2em] opacity-40 mb-2">{t('Year', '연도')}</p>
              <p className="text-2xl font-bold tracking-tighter">{work.year}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-black/10 pt-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-4">{t('Role', '역할')}</p>
              <p className="text-sm font-medium uppercase tracking-tight">{t(work.role_en, work.role_kr)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-4">{t('Deliverables', '결과물')}</p>
              <p className="text-sm font-medium uppercase tracking-tight">{t(work.deliverables_en, work.deliverables_kr)}</p>
            </div>
            <div className="flex space-x-4">
              {work.behanceUrl && (
                <a href={work.behanceUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <ExternalLink size={16} />
                </a>
              )}
              {work.vimeoUrl && (
                <a href={work.vimeoUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Hero Image/Video */}
        <div className="aspect-video bg-gray-100 mb-32 overflow-hidden shadow-2xl">
          {vimeoId ? (
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&muted=1&background=1`}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <img 
              src={work.thumbnail || 'https://picsum.photos/seed/hero/1920/1080'} 
              alt={work.title_en}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto space-y-32">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] opacity-30 mb-8">{t('Overview', '개요')}</h2>
            <div className="text-2xl md:text-3xl font-light leading-relaxed tracking-tight">
              {t(work.overview_en, work.overview_kr)}
            </div>
          </section>

          {work.visualDirection_en && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] opacity-30 mb-8">{t('Visual Direction', '시각적 방향')}</h2>
              <div className="text-lg md:text-xl font-light leading-relaxed opacity-70">
                {t(work.visualDirection_en, work.visualDirection_kr)}
              </div>
            </section>
          )}

          {/* Gallery */}
          {work.gallery && work.gallery.length > 0 && (
            <div className="grid grid-cols-1 gap-8">
              {work.gallery.map((img: string, i: number) => (
                <motion.img 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  src={img} 
                  alt={`Gallery ${i}`} 
                  className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
