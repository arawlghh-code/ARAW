import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowRight, MessageSquare, Video, Camera, Layout, Smartphone, Share2, Palette, Layers, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Asterisk } from '../components/Asterisk';

export default function Home() {
  const { t, language } = useLanguage();
  const { settings, works, brands, loading } = usePortfolio();
  const [homeContent, setHomeContent] = React.useState<any>({});

  React.useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'home'), (docSnap) => {
      if (docSnap.exists()) {
        setHomeContent(docSnap.data());
      }
    });
    return () => unsub();
  }, []);

  const services = [
    { 
      title: t('High-end Beauty Film', '하이엔드 뷰티 필름'), 
      desc: t('Identity and storytelling through high-end video.', '브랜드 아이덴티티와 스토리텔링을 담은 하이엔드 영상'),
      icon: <Video size={24} />
    },
    { 
      title: t('Brand Key Visual', '브랜드 키비주얼 영상'), 
      desc: t('Key video visuals for marketing campaigns.', '마케팅 캠페인을 위한 핵심 비주얼 영상 제작'),
      icon: <Camera size={24} />
    },
    { 
      title: t('Product Cinematography', '제품 연출 영상'), 
      desc: t('High-end product shots and artistic lighting.', '감각적인 조명과 연출을 통한 고퀄리티 제품 영상'),
      icon: <Palette size={24} />
    },
    { 
      title: t('SNS / Short-form', 'SNS / 숏폼 콘텐츠'), 
      desc: t('Optimized video content for digital platforms.', '디지털 플랫폼에 최적화된 숏폼 및 SNS 콘텐츠'),
      icon: <Smartphone size={24} />
    },
    { 
      title: t('Global Campaign', '글로벌 캠페인 영상'), 
      desc: t('Visual direction for international marketing.', '글로벌 마케팅을 위한 비주얼 디렉팅 및 영상 제작'),
      icon: <Share2 size={24} />
    },
    { 
      title: t('Behind the Scenes', '비하인드 / 스케치 필름'), 
      desc: t('Capturing the artistic process and brand story.', '제작 과정과 브랜드 스토리를 담은 감각적인 스케치 필름'),
      icon: <Layers size={24} />
    },
    { 
      title: t('Tutorial / How-to', '튜토리얼 / 하우투 영상'), 
      desc: t('Clear and aesthetic guide for product usage.', '제품 사용법을 명확하고 아름답게 전달하는 가이드 영상'),
      icon: <Layout size={24} />
    },
    { 
      title: t('Motion Graphics / VFX', '모션 그래픽 / VFX'), 
      desc: t('Dynamic visual elements and high-end effects.', '역동적인 비주얼 요소와 하이엔드 이펙트 기술'),
      icon: <CheckCircle2 size={24} />
    },
  ];

  const process = [
    { step: '01', title: t('Understand', '이해'), desc: t('Analyzing brand core and market context.', '브랜드의 핵심 가치와 시장 맥락 분석') },
    { step: '02', title: t('Structure', '구조화'), desc: t('Defining visual strategy and hierarchy.', '비주얼 전략 및 정보 위계 설정') },
    { step: '03', title: t('Visualize', '시각화'), desc: t('Crafting high-fidelity design results.', '완성도 높은 디자인 결과물 구현') },
    { step: '04', title: t('Expand', '운영/확장'), desc: t('Applying to various touchpoints.', '다양한 접점으로의 일관된 확장 및 운영') },
  ];

  const workScope = []; // Removed redundant array

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-xs uppercase tracking-widest">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Decorative Asterisk */}
        <div className="absolute -right-20 -top-20 opacity-10 pointer-events-none">
          <Asterisk size={600} color="white" speed={30} />
        </div>
        <div className="absolute -left-40 bottom-20 opacity-5 pointer-events-none">
          <Asterisk size={400} color="white" speed={40} />
        </div>
        {/* Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 scale-[1.15]">
            <iframe 
              src="https://player.vimeo.com/video/1178336525?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1" 
              className="w-full h-full pointer-events-none"
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              title="ARAW SHOWREEL 2026"
              style={{
                width: '100vw',
                height: '56.25vw', /* 16:9 aspect ratio */
                minHeight: '100vh',
                minWidth: '177.77vh', /* 16:9 aspect ratio */
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.6
              }}
            />
          </div>
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center pt-24 md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="space-y-8"
          >
            <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter text-white leading-[0.85] uppercase mix-blend-difference">
              ARAW <br />
              <span className="text-purple-point">{t('STUDIO', '스튜디오')}</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/70 font-light tracking-[0.2em] uppercase max-w-3xl mx-auto leading-relaxed">
              {t('PREMIUM BRANDING & CREATIVE DIRECTION', '프리미엄 브랜딩 & 크리에이티브 디렉션')}
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-12">
              <a href="#work" className="group flex items-center space-x-4 bg-white text-black px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-purple-point hover:text-white transition-all">
                <span>{t('VIEW PROJECTS', '프로젝트 보기')}</span>
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </a>
              <Link to="/inquiry" className="group flex items-center space-x-4 border border-white/30 text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:border-white transition-all">
                <span>{t('START A PROJECT', '프로젝트 시작하기')}</span>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 md:space-y-4 z-20"
        >
          <p className="text-[7px] md:text-[8px] uppercase tracking-[0.5em] text-white">SCROLL TO EXPLORE</p>
          <div className="w-[1px] h-8 md:h-12 bg-white/30" />
        </motion.div>
      </section>

      {/* 01. Work Archive Section */}
      <section id="work" className="py-32 px-6 border-b border-black/5">
        <div className="container">
          <p className="text-[10px] uppercase tracking-[0.4em] text-purple-point font-bold mb-12">01 / ARCHIVE</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-20">{t('Work Archive', '작업 아카이브')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
            {works.slice(0, 9).map((work, i) => (
              <motion.div
                key={work.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="group cursor-pointer"
              >
                <Link to={`/works/${work.slug}`}>
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 mb-6">
                    {work.thumbnail ? (
                      <img 
                        src={work.thumbnail} 
                        alt={t(work.title_en, work.title_kr)} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black tracking-[0.4em] opacity-10 uppercase">
                        {t(work.title_en, work.title_kr)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-8 text-center">
                      <h3 className="text-white text-2xl font-black tracking-tighter uppercase mb-2">{t(work.title_en, work.title_kr)}</h3>
                      <p className="text-white/60 text-[10px] uppercase tracking-widest mb-6">{t(work.category_en, work.category_kr)}</p>
                      <p className="text-white text-[10px] font-black leading-relaxed uppercase tracking-[0.3em] border-b border-white/30 pb-1">View Details</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <Link to="/works" className="inline-block border-b-2 border-black pb-2 text-[10px] font-black uppercase tracking-[0.3em] hover:text-purple-point hover:border-purple-point transition-all">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* 02. Specialized Services Section (Combined Expertise & Scope) */}
      <section id="services" className="relative py-32 px-6 bg-black text-white overflow-hidden">
        <div className="absolute right-10 top-20 opacity-10 pointer-events-none">
          <Asterisk size={300} color="white" speed={25} />
        </div>
        <div className="container">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.4em] text-purple-point font-bold mb-4">02 / SERVICES</p>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                {t('Our Specialized', '에이로우의')} <br />
                <span className="text-purple-point">{t('Capabilities', '전문 분야')}</span>
              </h2>
              <p className="text-lg opacity-50 font-light mt-8 max-w-md">
                {t('We provide optimized creative solutions based on deep understanding of the beauty industry.', '뷰티 산업에 대한 깊은 이해를 바탕으로 최적화된 크리에이티브 솔루션을 제공합니다.')}
              </p>
            </div>
            <Link to="/contact" className="group flex items-center space-x-4 bg-white text-black px-10 py-6 rounded-full hover:bg-purple-point hover:text-white transition-all duration-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest">{t('Inquiry Now', '지금 문의하기')}</span>
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {services.map((item, index) => (
              <div key={index} className="bg-black p-10 hover:bg-zinc-900 transition-all group relative overflow-hidden">
                <div className="text-purple-point mb-8 group-hover:scale-110 transition-transform origin-left">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-4 leading-tight">{item.title}</h3>
                <p className="text-sm opacity-50 leading-relaxed font-light group-hover:opacity-80 transition-opacity">{item.desc}</p>
                
                {/* Decorative Number */}
                <span className="absolute bottom-4 right-6 text-4xl font-black opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03. Brand Logos Section */}
      <section id="brands" className="relative py-32 px-6 bg-white overflow-hidden">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <Asterisk size={500} color="black" speed={35} />
        </div>
        <div className="container">
          <div className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-purple-point font-bold mb-4">03 / BRANDS</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8">
              {t('Collaborated Brands', '협업 브랜드')}
            </h2>
            <p className="text-lg opacity-50 font-light max-w-2xl mx-auto">
              {t('Based on LG Household & Health Care in-house experience, we have performed creative work for various beauty brands.', 'LG생활건강 인하우스 경력을 기반으로 다양한 뷰티 브랜드의 크리에이티브 작업을 수행했습니다.')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {brands.map((brand, index) => (
              <div key={index} className="logo-grid-item aspect-[3/2] group relative flex items-center justify-center p-6">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="max-h-12 w-full object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4 leading-tight opacity-30 group-hover:opacity-100 transition-opacity">
                    {brand.name}
                  </span>
                )}
                <div className="absolute inset-0 border border-purple-point/0 group-hover:border-purple-point/20 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04. Working Method Section */}
      <section id="method" className="relative py-32 px-6 bg-[#f8f8f8] overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-[0.05] pointer-events-none">
          <Asterisk size={400} color="black" speed={20} />
        </div>
        <div className="container">
          <div className="mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-bold mb-4">{t('OUR TEAM', '팀 소개')}</p>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
              {t('WORK FLOW', '워크플로우')}
            </h2>
          </div>

          <div className="relative bg-white p-8 md:p-16 shadow-sm border border-black/5 overflow-hidden">
            {/* Background Faint Image/Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
              <img src="https://picsum.photos/seed/workflow/1200/800" className="w-full h-full object-cover grayscale" />
            </div>

            <div className="relative z-10">
              {/* Workflow Diagram - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                
                {/* Pre Production */}
                <div className="flex flex-col space-y-4">
                  <div className="text-[10px] uppercase tracking-widest bg-zinc-100 px-4 py-1.5 rounded-none text-zinc-500 w-fit">{t('Production Team', '촬영팀')}</div>
                  <div className="flex-1 bg-[#111] text-white p-8 md:p-10 shadow-xl flex flex-col justify-between min-h-[200px]">
                    <div>
                      <span className="block text-xs opacity-40 mb-2">STEP 01</span>
                      <h3 className="text-xl font-bold mb-2 tracking-tight">Pre Production</h3>
                    </div>
                    <p className="text-xs opacity-60 leading-relaxed">{t('Planning · Prep', '구성안 작성 · 촬영 준비')}</p>
                  </div>
                </div>

                {/* Production */}
                <div className="flex flex-col space-y-4">
                  <div className="opacity-0 text-[10px] px-4 py-1.5 hidden lg:block">spacer</div>
                  <div className="flex-1 bg-white border border-black/10 p-8 md:p-10 shadow-sm flex flex-col justify-between min-h-[200px]">
                    <div>
                      <span className="block text-xs opacity-40 mb-2">STEP 02</span>
                      <h3 className="text-xl font-bold mb-2 tracking-tight">Production</h3>
                    </div>
                    <p className="text-xs opacity-60 leading-relaxed">{t('Shooting', '촬영')}</p>
                  </div>
                </div>

                {/* Post Production 1 */}
                <div className="flex flex-col space-y-4">
                  <div className="text-[10px] uppercase tracking-widest bg-purple-point/10 px-4 py-1.5 rounded-none text-purple-point w-fit">{t('Edit Team', '편집팀')}</div>
                  <div className="flex-1 bg-purple-point text-white p-8 md:p-10 shadow-xl flex flex-col justify-between min-h-[200px]">
                    <div>
                      <span className="block text-xs opacity-40 mb-2">STEP 03</span>
                      <h3 className="text-xl font-bold mb-2 tracking-tight">{t('1st Edit', '1차 편집')}</h3>
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed">{t('Edit · FX', '편집 · 이펙트')}</p>
                  </div>
                </div>

                {/* Post Production 2 */}
                <div className="flex flex-col space-y-4">
                  <div className="opacity-0 text-[10px] px-4 py-1.5 hidden lg:block">spacer</div>
                  <div className="flex-1 bg-purple-dark text-white p-8 md:p-10 shadow-lg flex flex-col justify-between min-h-[200px]">
                    <div>
                      <span className="block text-xs opacity-40 mb-2">STEP 04</span>
                      <h3 className="text-xl font-bold mb-2 tracking-tight">{t('2nd Edit', '2차 편집')}</h3>
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed">{t('Feedback · Color', '피드백 반영 · 색 작업')}</p>
                  </div>
                </div>

                {/* Final */}
                <div className="flex flex-col space-y-4">
                  <div className="opacity-0 text-[10px] px-4 py-1.5 hidden lg:block">spacer</div>
                  <div className="flex-1 bg-[#222] text-white p-8 md:p-10 shadow-xl flex flex-col justify-between min-h-[200px]">
                    <div>
                      <span className="block text-xs opacity-40 mb-2">STEP 05</span>
                      <h3 className="text-xl font-bold mb-2 tracking-tight">Final</h3>
                    </div>
                    <p className="text-xs opacity-60 leading-relaxed">{t('Completion', '최종완성')}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA Section */}
      <section className="py-32 px-6 bg-ivory">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase mb-12 leading-[0.9]">
              {t('WANT TO MAKE YOUR BRAND', '브랜드의 인상을 결정하는 작업,')} <br />
              <span className="text-purple-point">{t('MORE PRECISE?', '더 정교하게 만들고 싶다면.')}</span>
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link to="/contact" className="bg-black text-white px-12 py-6 uppercase tracking-widest text-xs font-bold hover:bg-purple-point transition-all duration-300 flex items-center space-x-3">
                <MessageSquare size={16} />
                <span>{t('Start a Project', '문의하기')}</span>
              </Link>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Direct Contact</p>
                <p className="text-lg font-bold">{settings?.general?.email || '[이메일]'}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 9. Footer Info (Social/Links) */}
      <section className="py-20 px-6 border-t border-black/5">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-black tracking-tighter uppercase">ARAW</h3>
              <div className="space-y-2 text-sm opacity-50 font-light">
                <p>{homeContent?.owner_name || '[대표 이름]'} / {language === 'en' ? (homeContent?.career_position_en || '[Position]') : (homeContent?.career_position_kr || '[직무명]')}</p>
                <p>{settings?.general?.email || '[이메일]'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-12">
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-30">Social</p>
                <ul className="space-y-2 text-sm uppercase tracking-widest font-bold">
                  {settings?.general?.instagram && (
                    <li><a href={settings.general.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-purple-point transition-colors">Instagram</a></li>
                  )}
                  {settings?.general?.behance && (
                    <li><a href={settings.general.behance} target="_blank" rel="noopener noreferrer" className="hover:text-purple-point transition-colors">Behance</a></li>
                  )}
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-30">Links</p>
                <ul className="space-y-2 text-sm uppercase tracking-widest font-bold">
                  {homeContent?.portfolio_url && (
                    <li><a href={homeContent.portfolio_url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-point transition-colors">Portfolio Link</a></li>
                  )}
                  <li><Link to="/works" className="hover:text-purple-point transition-colors">Works</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
