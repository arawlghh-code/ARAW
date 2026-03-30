import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';

export default function Contact() {
  const { t } = useLanguage();
  const { settings } = usePortfolio();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    email: '',
    phone: '',
    projectType: '',
    projectDetails: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      navigate('/thank-you');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="pt-40 pb-32 px-6 container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter uppercase mb-12 leading-none">
            {t('Free Consultation', '무료문의하기')}
          </h1>
          <div className="space-y-12">
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-4">{t('Email', '이메일')}</h3>
              <a href={`mailto:${settings?.general?.email || 'jina@example.com'}`} className="text-2xl font-bold tracking-tighter hover:text-purple-point transition-colors">
                {settings?.general?.email || 'jina@example.com'}
              </a>
            </div>
            {settings?.general?.phone && (
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-4">{t('Phone', '전화번호')}</h3>
                <p className="text-2xl font-bold tracking-tighter">{settings.general.phone}</p>
              </div>
            )}
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-4">{t('Social', '소셜')}</h3>
              <div className="flex flex-col space-y-2">
                {settings?.general?.behance && <a href={settings.general.behance} target="_blank" className="text-xl font-bold tracking-tighter hover:text-purple-point transition-colors">BEHANCE</a>}
                {settings?.general?.instagram && <a href={settings.general.instagram} target="_blank" className="text-xl font-bold tracking-tighter hover:text-purple-point transition-colors">INSTAGRAM</a>}
                {settings?.general?.vimeo && <a href={settings.general.vimeo} target="_blank" className="text-xl font-bold tracking-tighter hover:text-purple-point transition-colors">VIMEO</a>}
                {settings?.general?.linkedin && <a href={settings.general.linkedin} target="_blank" className="text-xl font-bold tracking-tighter hover:text-purple-point transition-colors">LINKEDIN</a>}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-12 md:p-20">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40">{t('Name', '이름')}</label>
                <input 
                  name="name"
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-black/10 py-4 focus:border-purple-point outline-none transition-colors text-xl font-light"
                  placeholder={t('Your Name', '이름')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40">{t('Brand', '브랜드')}</label>
                <input 
                  name="brand"
                  type="text" 
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-black/10 py-4 focus:border-purple-point outline-none transition-colors text-xl font-light"
                  placeholder={t('Brand Name', '브랜드명')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40">{t('Email', '이메일')}</label>
                <input 
                  name="email"
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-black/10 py-4 focus:border-purple-point outline-none transition-colors text-xl font-light"
                  placeholder={t('Your Email', '이메일')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40">{t('Phone', '전화번호')}</label>
                <input 
                  name="phone"
                  type="tel" 
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-black/10 py-4 focus:border-purple-point outline-none transition-colors text-xl font-light"
                  placeholder={t('Phone Number', '전화번호')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest opacity-40">{t('Project Type', '프로젝트 타입')}</label>
              <select 
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-black/10 py-4 focus:border-purple-point outline-none transition-colors text-xl font-light appearance-none"
              >
                <option value="">{t('Select Type', '타입 선택')}</option>
                <option value="Branding">{t('Branding', '브랜딩')}</option>
                <option value="Web Design">{t('Web Design', '웹 디자인')}</option>
                <option value="Motion Graphics">{t('Motion Graphics', '모션 그래픽')}</option>
                <option value="Other">{t('Other', '기타')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest opacity-40">{t('Project Details', '프로젝트 디테일')}</label>
              <textarea 
                name="projectDetails"
                required 
                rows={4}
                value={formData.projectDetails}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-black/10 py-4 focus:border-purple-point outline-none transition-colors text-xl font-light resize-none"
                placeholder={t('Tell me about your project', '프로젝트에 대해 자세히 알려주세요')}
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-black text-white py-6 uppercase tracking-[0.3em] text-xs font-bold hover:bg-purple-point transition-colors disabled:opacity-50"
            >
              {isSubmitting ? t('Sending...', '전송 중...') : t('Send Inquiry', '문의하기')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

