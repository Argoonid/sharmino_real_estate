'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Send,
  TrendingUp,
  Key,
  Compass
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Hero баннер */}
      <section className="relative h-[480px] flex items-center justify-center bg-slate-950 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-slate-950/60 to-slate-950/80" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-teal-500/20 border border-teal-400/30 backdrop-blur-md text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Ваш надежный партнер в Египте</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            О агентстве <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-amber-300 to-teal-400">SHARMINO</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Мы открываем доступ к эксклюзивной недвижимости Шарм-эль-Шейха и Сахль Хашиш. Продажа вилл, управление доходными апартаментами и посуточная аренда премиум-класса.
          </p>
        </div>
      </section>

      {/* 2. Статистика и цифры */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
          
          <div className="text-center space-y-1 p-2">
            <div className="text-3xl sm:text-4xl font-black text-teal-600">8+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Лет на рынке</div>
          </div>

          <div className="text-center space-y-1 p-2 border-l border-slate-100">
            <div className="text-3xl sm:text-4xl font-black text-slate-900">500+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Успешных сделок</div>
          </div>

          <div className="text-center space-y-1 p-2 border-l border-slate-100">
            <div className="text-3xl sm:text-4xl font-black text-amber-500">100%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Юридическая чистота</div>
          </div>

          <div className="text-center space-y-1 p-2 border-l border-slate-100">
            <div className="text-3xl sm:text-4xl font-black text-teal-600">12%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Средняя доходность</div>
          </div>

        </div>
      </section>

      {/* 3. Миссия и Описание */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-3 py-1.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Премиальный сервис</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Безопасные инвестиции и идеальный отдых на Красном море
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              Команда **SHARMINO** объединяет экспертов по курортной недвижимости, юристов и управляющих объектами. Мы берем на себя весь цикл работы: от подбора объекта под ваши задачи и проверки истории владения до управления арендой и получения пассивного дохода.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Полная юридическая экспертиза документов (Green Contract, Таукиль)',
                'Организация просмотров на авто представительского класса',
                'Собственная служба клининга и технического обслуживания вилл',
                'Мультивалютные взаиморасчеты и дистанционное оформление сделок'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Визуальная карточка */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 h-[420px] group">
            <img 
              src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80" 
              alt="SHARMINO Luxury Villa" 
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
              <div className="text-xs font-bold text-teal-300 uppercase tracking-wider">Сахль Хашиш</div>
              <div className="text-xl font-black">Эксклюзивные виллы первой линии</div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Направление услуг */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black">Чем мы можем помочь</h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Комплексные решения для покупателей, инвесторов и арендаторов
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 space-y-4 hover:border-teal-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Покупка & Продажа</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Подбор первичной и вторичной недвижимости. Сопровождение переговоров, фиксирование лучшей цены и проверка прав собственности.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 space-y-4 hover:border-amber-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Управление арендой</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Превращаем вашу квартиру или виллу в доходный актив. Маркетинг, заселение гостей, клининг и финансовая отчетность для собственника.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 space-y-4 hover:border-sky-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Юридический консалтинг</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Консультации по египетскому законодательству, регистрация договора в суде (Сихха ва Таукиль), помощь в открытии банковских счетов.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Блок прямого контакта / CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-800 rounded-3xl p-8 sm:p-12 text-white text-center space-y-8 shadow-2xl">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Остались вопросы или нужна персональная подборка?
            </h2>
            <p className="text-teal-100 text-xs sm:text-sm font-medium">
              Напишите нашему ведущему брокеру в мессенджер — подготовим подборку объектов за 15 минут.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Написать в WhatsApp</span>
            </a>

            <a
              href="https://t.me/sharmino_official"
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-950 text-white font-bold text-sm rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5 text-sky-400" />
              <span>Написать в Telegram</span>
            </a>
          </div>

        </div>
      </section>

    </div>
  );
}