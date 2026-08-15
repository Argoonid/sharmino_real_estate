'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // <-- Добавили хук
import { Heart, Phone, Send, MessageSquare, Menu, X, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Currency, Language } from '@/types';

export const Header = () => {
  const pathname = usePathname();
  const { lang, setLang, currency, setCurrency, favorites } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Скрываем обычную шапку сайта в админке
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Логотип */}
        <Link href="/" className="flex items-center space-x-3.5 group cursor-pointer flex-shrink-0 h-full py-2.5">
          <img 
            src="/logo.png" 
            alt="SHARMINO Logo" 
            className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
          />
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-widest block leading-none text-white">
              SHARMINO<span className="text-amber-400">.</span>
            </span>
            <span className="text-[9px] sm:text-[10px] text-teal-400 tracking-wider uppercase font-bold">
              Resort Real Estate
            </span>
          </div>
        </Link>

        {/* Навигация */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-bold">
          <Link 
            href="/catalog" 
            className="cursor-pointer flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-black shadow-lg shadow-teal-500/20 transform transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Каталог объектов</span>
          </Link>

          <Link href="/about" className="text-slate-300 hover:text-teal-400 transition-colors cursor-pointer px-2 py-1">
            О нас
          </Link>
        </nav>

        {/* Контакты */}
        <div className="hidden xl:flex items-center space-x-3 text-xs border-x border-slate-800 px-6">
          <a
            href="tel:+201000000000"
            className="flex items-center space-x-2 text-slate-200 hover:text-amber-400 font-bold transition-colors cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-teal-400" />
            <span>+20 (100) 000-00-00</span>
          </a>

          <div className="flex items-center space-x-2 pl-3">
            <a
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noreferrer"
              title="Написать в WhatsApp"
              className="p-2 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl transition-all duration-300 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
            <a
              href="https://t.me/sharmino_official"
              target="_blank"
              rel="noreferrer"
              title="Написать в Telegram"
              className="p-2 bg-sky-500/20 hover:bg-sky-500 text-sky-400 hover:text-white rounded-xl transition-all duration-300 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Утилиты */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden sm:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs font-bold">
            {(['USD', 'EUR', 'EGP'] as Currency[]).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${
                  currency === curr ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs font-bold">
            {(['ru', 'en'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded-lg uppercase transition-all duration-200 cursor-pointer ${
                  lang === l ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <Link
            href="/favorites"
            className="relative p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700/60 text-slate-300 transition-all duration-200 cursor-pointer"
            title="Избранные объекты"
          >
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {favorites.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700/60 transition cursor-pointer"
            aria-label="Открыть меню"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-4 pb-6 space-y-5 animate-in slide-in-from-top duration-300">
          <div className="space-y-3">
            <Link
              href="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-center py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-teal-500/20"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Перейти в Каталог</span>
            </Link>

            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center py-3 rounded-2xl bg-slate-900 text-slate-200 font-bold text-sm border border-slate-800"
            >
              О нас
            </Link>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 gap-2">
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold w-full justify-center">
              {(['USD', 'EUR', 'EGP'] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`flex-1 py-1.5 rounded-lg text-center transition ${
                    currency === curr ? 'bg-teal-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold w-full justify-center">
              {(['ru', 'en'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`flex-1 py-1.5 rounded-lg uppercase text-center transition ${
                    lang === l ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 space-y-3">
            <a
              href="tel:+201000000000"
              className="flex items-center justify-center space-x-2 text-slate-200 font-bold text-sm py-2"
            >
              <Phone className="w-4 h-4 text-teal-400" />
              <span>+20 (100) 000-00-00</span>
            </a>

            <div className="flex justify-center space-x-3">
              <a
                href="https://wa.me/201000000000"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl font-bold text-xs border border-emerald-500/30"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <a
                href="https://t.me/sharmino_official"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-sky-500/20 text-sky-400 rounded-xl font-bold text-xs border border-sky-500/30"
              >
                <Send className="w-4 h-4" />
                <span>Telegram</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};