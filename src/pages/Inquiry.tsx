import React, { useState } from 'react';
import { motion } from 'motion/react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Inquiry() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      brand: formData.get('brand'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      projectType: formData.get('projectType'),
      projectDetails: formData.get('projectDetails'),
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'leads'), data);
      setIsSuccess(true);
      setTimeout(() => navigate('/thank-you'), 2000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-40 pb-32 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
            {t('FREE', '무료')} <br />
            <span className="text-gold-point">{t('INQUIRY', '문의하기')}</span>
          </h1>
          <p className="text-xl md:text-2xl font-light opacity-60 max-w-2xl leading-relaxed">
            {t(
              'Tell us about your project. We will get back to you within 24 hours to discuss how we can help your brand grow.',
              '프로젝트에 대해 알려주세요. 24시간 이내에 연락드려 브랜드 성장을 위한 최적의 방안을 제안해 드립니다.'
            )}
          </p>
        </motion.div>

        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-ivory p-12 text-center flex flex-col items-center justify-center space-y-6"
          >
            <CheckCircle2 size={64} className="text-gold-point" />
            <h2 className="text-3xl font-bold tracking-tighter uppercase">
              {t('THANK YOU!', '감사합니다!')}
            </h2>
            <p className="opacity-60">
              {t('Your inquiry has been submitted successfully.', '문의가 성공적으로 접수되었습니다.')}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black opacity-40">
                  {t('NAME', '이름')} *
                </label>
                <input 
                  required 
                  name="name"
                  type="text" 
                  placeholder={t('Your Name', '성함을 입력해주세요')}
                  className="w-full bg-transparent border-b border-black/10 py-4 outline-none focus:border-gold-point transition-colors text-xl font-light"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black opacity-40">
                  {t('BRAND', '브랜드')}
                </label>
                <input 
                  name="brand"
                  type="text" 
                  placeholder={t('Company / Brand Name', '회사 또는 브랜드명')}
                  className="w-full bg-transparent border-b border-black/10 py-4 outline-none focus:border-gold-point transition-colors text-xl font-light"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black opacity-40">
                  {t('EMAIL', '이메일')} *
                </label>
                <input 
                  required 
                  name="email"
                  type="email" 
                  placeholder="example@email.com"
                  className="w-full bg-transparent border-b border-black/10 py-4 outline-none focus:border-gold-point transition-colors text-xl font-light"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black opacity-40">
                  {t('PHONE', '전화번호')} *
                </label>
                <input 
                  required 
                  name="phone"
                  type="tel" 
                  placeholder="010-0000-0000"
                  className="w-full bg-transparent border-b border-black/10 py-4 outline-none focus:border-gold-point transition-colors text-xl font-light"
                />
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black opacity-40">
                {t('PROJECT TYPE', '프로젝트 타입')}
              </label>
              <div className="flex flex-wrap gap-4">
                {['Branding', 'Package Design', 'Web Design', 'Content Creation', 'Consulting', 'Other'].map((type) => (
                  <label key={type} className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="projectType" 
                      value={type} 
                      className="peer sr-only" 
                    />
                    <div className="px-6 py-3 border border-black/10 text-[10px] uppercase tracking-widest font-bold peer-checked:bg-black peer-checked:text-white peer-checked:border-black transition-all group-hover:border-black">
                      {type}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black opacity-40">
                {t('PROJECT DETAILS', '프로젝트 디테일')} *
              </label>
              <textarea 
                required 
                name="projectDetails"
                rows={5}
                placeholder={t('Tell us more about your project goals, timeline, and budget...', '프로젝트의 목표, 일정, 예산 등 상세 내용을 적어주세요.')}
                className="w-full bg-transparent border-b border-black/10 py-4 outline-none focus:border-gold-point transition-colors text-xl font-light resize-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="group flex items-center space-x-6 bg-black text-white px-12 py-6 uppercase tracking-[0.3em] text-xs font-black hover:bg-gold-point transition-all disabled:opacity-50"
            >
              <span>{isSubmitting ? t('SUBMITTING...', '전송 중...') : t('SEND INQUIRY', '문의하기')}</span>
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
