import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export default function ThankYou() {
  const { t } = useLanguage();

  return (
    <div className="h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase mb-8 leading-none">
          {t('Thank You.', '감사합니다.')}
        </h1>
        <p className="text-xl font-light opacity-60 mb-12">
          {t('Your message has been sent successfully. I will get back to you soon.', '메시지가 성공적으로 전송되었습니다. 곧 연락드리겠습니다.')}
        </p>
        <Link to="/" className="inline-block text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:opacity-50 transition-opacity">
          {t('Back to Home', '홈으로 돌아가기')}
        </Link>
      </motion.div>
    </div>
  );
}
