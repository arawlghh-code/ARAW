import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';

export default function Footer() {
  const { t } = useLanguage();
  const { settings } = usePortfolio();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-32 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-12 leading-[0.9] uppercase">
              {t("LET'S CREATE", '함께')} <br />
              <span className="text-purple-point">{t("EXTRAORDINARY", '특별한 것')}</span> <br />
              {t("TOGETHER.", '만들어봐요.')}
            </h2>
            <div className="space-y-4">
              <a 
                href={`mailto:${settings?.general?.email || 'arow@example.com'}`}
                className="block text-xl md:text-2xl font-light hover:text-purple-point transition-colors"
              >
                {settings?.general?.email || 'arow@example.com'}
              </a>
              <p className="text-xl md:text-2xl font-light opacity-60">
                {settings?.general?.phone || '+82 10 0000 0000'}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:items-end justify-end space-y-8">
            <div className="flex flex-wrap gap-6 md:justify-end">
              {settings?.general?.vimeo && (
                <a href={settings.general.vimeo} target="_blank" rel="noopener noreferrer" className="uppercase tracking-[0.2em] text-[10px] font-bold hover:text-purple-point transition-colors">Vimeo</a>
              )}
              {settings?.general?.instagram && (
                <a href={settings.general.instagram} target="_blank" rel="noopener noreferrer" className="uppercase tracking-[0.2em] text-[10px] font-bold hover:text-purple-point transition-colors">Instagram</a>
              )}
              {settings?.general?.behance && (
                <a href={settings.general.behance} target="_blank" rel="noopener noreferrer" className="uppercase tracking-[0.2em] text-[10px] font-bold hover:text-purple-point transition-colors">Behance</a>
              )}
              {settings?.general?.linkedin && (
                <a href={settings.general.linkedin} target="_blank" rel="noopener noreferrer" className="uppercase tracking-[0.2em] text-[10px] font-bold hover:text-purple-point transition-colors">LinkedIn</a>
              )}
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.3em] text-purple-point font-black mb-2">✦ SEOUL BASED</p>
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-30">AVAILABLE FOR GLOBAL PROJECTS</p>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-4">
            <span className="text-purple-point">✦</span>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-30">
              © {currentYear} ARAW. ALL RIGHTS RESERVED.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-30">
              CRAFTED WITH PASSION BY ARAW
            </p>
            <Link to="/admin" className="mt-4 px-6 py-2 border border-white/20 text-[10px] uppercase tracking-[0.3em] opacity-50 hover:opacity-100 hover:border-white transition-all">
              ADMIN ACCESS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
