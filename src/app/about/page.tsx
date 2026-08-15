'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  Users, 
  PhoneCall, 
  Sparkles, 
  CheckCircle2, 
  Globe2, 
  Key, 
  TrendingUp 
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AboutPage() {
  const { lang } = useApp();
  const isRu = lang === 'ru';

  const stats = [
    { value: '8+', label: isRu ? 'Лет на рынке Египта' : 'Years in Egypt market' },
    { value: '250+', label: isRu ? 'Объектов в портфолио' : 'Exclusive properties' },
    { value: '$45M+', label: isRu ? 'Объем закрытых сделок' : 'Closed deal volume' },
    { value: '100%', label: isRu ? 'Юридическая чистота' : 'Legal security guarantee' },
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: isRu ? 'Юридическая экспертиза' : 'Legal Due Diligence',
      desc: isRu 
        ? 'Полная проверка Green Contract, регистрация таукиля и защита прав иностранных инвесторов.' 
        : 'Comprehensive Green Contract verification, Tawkeel registration, and full legal support for foreign buyers.',
    },
    {
      icon: TrendingUp,
      title: isRu ? 'Доходная аренда (Yield Management)' : 'High-Yield Asset Management',
      desc: isRu 
        ? 'Управление посуточной арендой премиум-вилл и апартаментов с прозрачной окупаемостью до 12-16% годовых.' 
        : 'Full-cycle short-term rental management generating 12-16% annual ROI with complete financial transparency.',
    },
    {
      icon: Globe2,
      title: isRu ? 'Мультиязычная команда' : 'Multilingual Concierge',
      desc: isRu 
        ? 'Консультации и ведение сделок на русском, английском и арабском языках на всех этапах.' 
        : 'Dedicated personal advisors fluent in English, Russian, and Arabic guiding you through every step.',
    },
    {
      icon: Key,
      title: isRu ? 'Сервис «Под ключ»' : 'Turnkey VIP Service',
      desc: isRu 
        ? 'Встреча в аэропорту Шарм-эль-Шейха, трансферы на авто представительского класса и организация 3D-туров.' 
        : 'Airport reception, VIP private transfers, custom viewing itineraries, and interactive 3D virtual tours.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 animate-in fade-in duration-500">
      
      {/* Hero Banner */}
      <section className="relative bg-slate-950 text-white py-20 sm:py-28 overflow-hidden border-b border-slate-800">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isRu ? 'Премиальное агентство недвижимости' : 'Premier Luxury Real Estate Agency'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            {isRu ? (
              <>О компании <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-amber-300 to-teal-400">SHARMINO</span></>
            ) : (
              <>About <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-amber-300 to-teal-400">SHARMINO</span> Real Estate</>
            )}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
            {isRu 
              ? 'Мы объединяем международные стандарты безопасности с лучшей коллекцией курортной недвижимости в Шарм-эль-Шейхе и Сахль Хашиш.' 
              : 'Combining international quality standards with the finest collection of luxury resort properties across Sharm El Sheikh and Sahl Hasheesh.'}
          </p>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, index) => (
            <div 
              key={index}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-2 transform hover:-translate-y-1 transition duration-300"
            >
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Agency Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase bg-teal-50 px-3 py-1.5 rounded-lg">
              <Building2 className="w-4 h-4" />
              <span>{isRu ? 'Наша миссия' : 'Our Mission'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {isRu 
                ? 'Делаем покупку и аренду в Египте прозрачной и комфортной' 
                : 'Making Egypt Property Ownership Transparent, Secure & Rewarding'}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isRu 
                ? 'SHARMINO создана как бутиковое агентство, ориентированное на клиентов, ценящих безупречный сервис, конфиденциальность и юридическую точность. Мы лично инспектируем каждый объект перед добавлением в каталог, создаем детальные 3D-туры и проверяем права собственности в государственных реестрах.' 
                : 'SHARMINO was founded as a bespoke agency for discerning clients who demand unmatched service, strict privacy, and rigorous legal security. We personally inspect every listing, construct interactive 3D virtual tours, and verify titles across government land registries.'}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-slate-700 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>{isRu ? 'Прямые контракты с проверенными застройщиками и собственниками' : 'Direct contracts with verified developers and property owners'}</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>{isRu ? 'Полное юридическое сопровождение сделок иностранными гражданами' : 'Comprehensive legal representation for international buyers'}</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>{isRu ? 'Собственная служба управления арендой и клинингом' : 'In-house short-term rental management and hospitality team'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative group">
            <img 
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80" 
              alt="Sharmino Luxury Real Estate" 
              className="w-full h-[400px] sm:h-[500px] object-cover group-hover:scale-105 transition duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-8">
              <div className="text-white space-y-1">
                <div className="text-lg font-black tracking-wide">SHARMINO Luxury Resort Portfolio</div>
                <div className="text-xs text-teal-300 font-bold uppercase tracking-wider">Sharm El Sheikh • Sahl Hasheesh</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black">
              {isRu ? 'Преимущества работы с нами' : 'Why Work With Us'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              {isRu ? 'Индивидуальный подход к каждому покупателю и арендатору' : 'Personalized concierge service tailored to each investor and traveler'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="bg-slate-800/60 p-6 rounded-3xl border border-slate-700/60 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">{pillar.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA / Contact Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-700 rounded-3xl p-8 sm:p-14 text-white space-y-6 shadow-2xl shadow-teal-600/20">
          <h2 className="text-2xl sm:text-4xl font-black">
            {isRu ? 'Готовы подобрать идеальный объект?' : 'Ready to Find Your Dream Property?'}
          </h2>
          <p className="text-teal-100 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
            {isRu 
              ? 'Свяжитесь с нами в WhatsApp или перейдите в каталог для выбора вилл и апартаментов.' 
              : 'Contact us directly on WhatsApp or browse our curated catalog of villas and apartments.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <Link
              href="/catalog"
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm shadow-xl transition cursor-pointer"
            >
              {isRu ? 'Открыть каталог' : 'View Catalog'}
            </Link>
            <a
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-xl transition cursor-pointer"
            >
              {isRu ? 'Написать в WhatsApp' : 'Chat on WhatsApp'}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}