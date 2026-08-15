'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const Footer = () => {
  const pathname = usePathname();
  const { lang } = useApp();
  const isRu = lang === 'ru';

  // Корректный путь к логотипу для GitHub Pages и локальной разработки
  const basePath = process.env.NODE_ENV === 'production' ? '/sharmino_real_estate' : '';
  const logoSrc = `${basePath}/logo.png`;

  // Скрываем футер в панели админки
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Описание */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-3 inline-block cursor-pointer">
            <img src={logoSrc} alt="SHARMINO" className="h-9 w-auto object-contain" />
            <span className="text-xl font-black tracking-widest text-white">
              SHARMINO<span className="text-amber-400">.</span>
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-slate-500">
            {isRu 
              ? 'Платформа элитной курортной недвижимости SHARMINO. Продажа вилл, долгосрочная и посуточная аренда в Египте.' 
              : 'SHARMINO luxury resort real estate platform. Villa sales, short-term and long-term rentals in Sharm El Sheikh.'}
          </p>
        </div>

        {/* Разделы */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            {isRu ? 'Разделы' : 'Navigation'}
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/catalog" className="hover:text-teal-400 transition cursor-pointer">{isRu ? 'Каталог объектов' : 'Properties Catalog'}</Link></li>
            <li><Link href="/catalog?operation=daily" className="hover:text-teal-400 transition cursor-pointer">{isRu ? 'Посуточная аренда' : 'Short-term Rentals'}</Link></li>
            <li><Link href="/catalog?operation=sale" className="hover:text-teal-400 transition cursor-pointer">{isRu ? 'Продажа недвижимости' : 'Properties For Sale'}</Link></li>
            <li><Link href="/about" className="hover:text-teal-400 transition cursor-pointer">{isRu ? 'О компании' : 'About Us'}</Link></li>
          </ul>
        </div>

        {/* Локации */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            {isRu ? 'Локации' : 'Locations'}
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center space-x-2"><MapPin className="w-3.5 h-3.5 text-teal-500" /><span>{isRu ? 'Сахль Хашиш' : 'Sahl Hasheesh'}</span></li>
            <li className="flex items-center space-x-2"><MapPin className="w-3.5 h-3.5 text-teal-500" /><span>{isRu ? 'Наама Бей' : 'Naama Bay'}</span></li>
            <li className="flex items-center space-x-2"><MapPin className="w-3.5 h-3.5 text-teal-500" /><span>{isRu ? 'Шаркс Бей' : 'Sharks Bay'}</span></li>
            <li className="flex items-center space-x-2"><MapPin className="w-3.5 h-3.5 text-teal-500" /><span>{isRu ? 'Хадаба & Старый Город' : 'Hadaba & Old Town'}</span></li>
          </ul>
        </div>

        {/* Контакты */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            {isRu ? 'Контакты' : 'Contacts'}
          </h4>
          <div className="space-y-2 text-xs">
            <p className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>+20 (100) 000-00-00</span>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>info@sharmino.com</span>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-900">
            <Link
              href="/admin"
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-amber-400 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isRu ? 'Панель управления (CRM)' : 'Control Panel (CRM)'}</span>
            </Link>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-900 text-center text-[11px] text-slate-600">
        {isRu ? '© 2026 SHARMINO. Все права защищены.' : '© 2026 SHARMINO. All rights reserved.'}
      </div>
    </footer>
  );
};