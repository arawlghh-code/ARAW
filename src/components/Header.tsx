import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { settings } = usePortfolio();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: t('Works', '작업'), path: '/works' },
    { name: t('About', '소개'), path: '/about' },
    { name: t('Free Inquiry', '무료문의하기'), path: '/inquiry' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled || isOpen ? 'bg-white py-4 shadow-sm' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tighter hover:text-purple-point transition-colors">
          {settings?.general?.logoUrl ? (
            <img src={settings.general.logoUrl} alt="Logo" className="h-8 md:h-10 object-contain" />
          ) : (
            <span className="flex items-center uppercase">
              ARAW <span className="ml-2 text-xs font-normal opacity-50">STUDIO</span>
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`text-[10px] font-bold uppercase tracking-[0.2em] hover:text-purple-point transition-colors ${
                location.pathname === link.path ? 'text-purple-point' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
          <button 
            onClick={() => setLanguage(language === 'en' ? 'kr' : 'en')}
            className="flex items-center space-x-1 text-[10px] font-black uppercase tracking-tighter hover:text-purple-point transition-colors"
          >
            <Globe size={12} className="text-purple-point" />
            <span>{language === 'en' ? 'KR' : 'EN'}</span>
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden relative z-[60] p-2" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="text-black" size={24} />
          ) : (
            <Menu className="text-black" size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center space-y-8 md:hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className="text-4xl font-black uppercase tracking-tighter hover:text-purple-point transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <button 
              onClick={() => {
                setLanguage(language === 'en' ? 'kr' : 'en');
                setIsOpen(false);
              }}
              className="flex items-center space-x-2 text-xl font-black uppercase tracking-tighter text-purple-point"
            >
              <Globe size={20} />
              <span>{language === 'en' ? 'KOREAN' : 'ENGLISH'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
