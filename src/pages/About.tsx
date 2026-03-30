import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';
import { Star } from 'lucide-react';
import { Asterisk } from '../components/Asterisk';

export default function About() {
  const { t } = useLanguage();
  const { settings, loading } = usePortfolio();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse text-xs uppercase tracking-widest text-white">Loading...</div>
      </div>
    );
  }

  const features = [
    {
      icon: <Star className="text-yellow-400 fill-yellow-400" size={32} />,
      title: t('Wide Spectrum', '넓은 스펙트럼'),
      desc: t('Beauty videos, sizzle, motion graphics, 3D, live commerce, interviews, drama, and latest AI video production.', '뷰티 영상, 시즐, 모션그래픽, 3D, 라이브 커머스, 인터뷰, 드라마, 최신 AI 영상 제작까지 가능한 넓은 스펙트럼')
    },
    {
      icon: <Star className="text-blue-400 fill-blue-400" size={32} />,
      title: t('10 Years of Expertise', '10년의 노하우'),
      desc: t('10 years of specialized expertise in the beauty industry.', '뷰티 전문 10년의 노하우')
    },
    {
      icon: <Star className="text-purple-point fill-purple-point" size={32} />,
      title: t('Thousands of Productions', '수천 편의 제작 경력'),
      desc: t('Experience in producing thousands of videos across various genres.', '수천 편의 영상 제작 경력')
    }
  ];

  const galleryImages = settings?.about?.images || [
    'https://picsum.photos/seed/beauty1/600/800',
    'https://picsum.photos/seed/beauty2/600/800',
    'https://picsum.photos/seed/beauty3/600/800',
    'https://picsum.photos/seed/beauty4/600/800',
    'https://picsum.photos/seed/beauty5/600/800',
  ];

  return (
    <div className="bg-black text-white min-h-screen pt-32 md:pt-48 pb-32 overflow-hidden relative">
      {/* Hero Video Background */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        {settings?.about?.heroVideoUrl ? (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src={settings.about.heroVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
      </div>

      {/* Decorative Asterisks */}
      <div className="absolute -right-40 top-20 opacity-10 pointer-events-none">
        <Asterisk size={800} color="white" speed={35} />
      </div>
      <div className="absolute -left-20 top-[40%] opacity-5 pointer-events-none">
        <Asterisk size={400} color="white" speed={25} />
      </div>
      <div className="absolute right-20 bottom-40 opacity-10 pointer-events-none">
        <Asterisk size={300} color="white" speed={45} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* 1. Hero Header */}
        <header className="mb-24 md:mb-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] uppercase tracking-[0.5em] text-purple-point font-bold mb-8">
              01 / PHILOSOPHY
            </p>
            <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] uppercase mb-12">
              ARAW <br />
              <span className="text-purple-point">STUDIO</span>
            </h1>
            <div className="w-24 h-px bg-white/20 mb-12" />
            <p className="text-xl md:text-3xl font-light leading-tight max-w-3xl opacity-80">
              {t(
                'ARAW STUDIO is a high-end creative production specializing in beauty and visual storytelling.',
                '에이로우 스튜디오는 뷰티와 비주얼 스토리텔링에 특화된 하이엔드 크리에이티브 프로덕션입니다.'
              )}
            </p>
          </motion.div>
        </header>

        {/* 2. Sophisticated Gallery - Responsive Grid */}
        <section className="mb-40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {galleryImages.slice(0, 4).map((img: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 1.05 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 1.2, ease: "circOut" }}
                className={`relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 ${
                  i === 0 ? 'aspect-[3/4] md:col-span-2 md:row-span-2' : 'aspect-square'
                }`}
              >
                <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. Why ARAW - Editorial Layout */}
        <section className="mb-40 border-t border-white/10 pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-24">
            <div className="lg:col-span-5">
              <p className="text-[10px] uppercase tracking-[0.5em] text-purple-point font-bold mb-8">
                02 / WHY US
              </p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-12">
                {t('BEYOND THE', '평범함을 넘어선')} <br />
                <span className="text-purple-point">{t('ORDINARY', '특별한 경험')}</span>
              </h2>
              <p className="text-lg md:text-xl font-light leading-relaxed opacity-60 mb-12">
                {t(
                  'Based on specialized beauty experience, we provide the best experience tailored to beauty brands. We understand the subtle nuances that make a brand truly premium.',
                  '뷰티 전문 경험을 기반으로 뷰티 브랜드에 맞는 최고의 경험을 선사합니다. 우리는 브랜드를 진정으로 프리미엄하게 만드는 미묘한 뉘앙스를 이해합니다.'
                )}
              </p>
            </div>
            
            <div className="lg:col-span-7 space-y-12 md:space-y-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="text-4xl font-black text-purple-point/20">01</div>
                  <h3 className="text-xl font-bold uppercase tracking-tight">{t('Deep Understanding', '깊은 이해도')}</h3>
                  <p className="text-sm opacity-50 leading-relaxed font-light">
                    {t(
                      'Deep understanding of beauty industry trends and visual language derived from years of in-house experience.',
                      '수년간의 인하우스 경력에서 비롯된 뷰티 산업 트렌드와 시각적 언어에 대한 깊은 이해를 보유하고 있습니다.'
                    )}
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="text-4xl font-black text-purple-point/20">02</div>
                  <h3 className="text-xl font-bold uppercase tracking-tight">{t('High-end Quality', '하이엔드 퀄리티')}</h3>
                  <p className="text-sm opacity-50 leading-relaxed font-light">
                    {t(
                      'High-end production quality that elevates brand value through meticulous attention to detail and artistic direction.',
                      '세밀한 디테일과 예술적 디렉팅을 통해 브랜드 가치를 높이는 하이엔드 프로덕션 퀄리티를 지향합니다.'
                    )}
                  </p>
                </div>
              </div>
              
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={settings?.about?.whyArawImage || "https://picsum.photos/seed/about-beauty/1200/800"} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  alt="Beauty Production"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. Features - Minimal Grid */}
        <section className="mb-40 border-t border-white/10 pt-24">
          <p className="text-[10px] uppercase tracking-[0.5em] text-purple-point font-bold mb-12">
            03 / CAPABILITIES
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-8"
              >
                <div className="opacity-40">{f.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight uppercase mb-4">{f.title}</h3>
                  <p className="text-sm opacity-50 leading-relaxed font-light">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. CTA - Immersive */}
        <section className="py-40 border-t border-white/10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-16 leading-none">
              {t('LET\'S CREATE', '함께 새로운')} <br />
              <span className="text-purple-point">{t('SOMETHING NEW', '가치를 만듭니다')}</span>
            </h2>
            <Link 
              to="/inquiry" 
              className="inline-block bg-white text-black px-16 py-6 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-purple-point hover:text-white transition-all duration-500"
            >
              {t('Start a Project', '프로젝트 시작하기')}
            </Link>
          </motion.div>
        </section>
      </div>
      
      {/* Decorative Elements */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 rotate-90 origin-left pointer-events-none hidden lg:block">
        <p className="text-[8px] uppercase tracking-[0.8em] opacity-10">ARAW STUDIO — CREATIVE PRODUCTION</p>
      </div>
    </div>
  );
}
