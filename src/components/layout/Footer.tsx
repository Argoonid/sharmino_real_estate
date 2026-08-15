'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // <-- Добавили хук
import { MapPin, Phone, Mail, Lock } from 'lucide-react';

export const Footer = () => {
  const pathname = usePathname();

  // Скрываем футер в админке
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-3 inline-block cursor-pointer">
            <img src="/logo.png" alt="SHARMINO" className="h-9 w-auto object-contain" />
            <span className="text-xl font-black tracking-widest text-white">
              SHARMINO<span className="text-amber-400">.</span>
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-slate-500">
            Платформа элитной курортной недвижимости SHARMINO. Продажа вилл, долгосрочная и посуточная аренда в Египте.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Разделы</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/catalog" className="hover:text-teal-400 transition cursor-pointer">Каталог объектов</Link></li>
            <li><Link href="/catalog?operation=daily" className="hover:text-teal-400 transition cursor-pointer">Посуточная аренда</Link></li>
            <li><Link href="/catalog?operation=sale" className="hover:text-teal-400 transition cursor-pointer">Продажа недвижимости</Link></li>
            <li><Link href="/about" className="hover:text-teal-400 transition cursor-pointer">О компании</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Локации</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center space-x-2"><MapPin className="w-3.5 h-3.5 text-teal-500" /><span>Сахль Хашиш</span></li>
            <li className="flex items-center space-x-2"><MapPin className="w-3.5 h-3.5 text-teal-500" /><span>Наама Бей</span></li>
            <li className="flex items-center space-x-2"><MapPin className="w-3.5 h-3.5 text-teal-500" /><span>Шаркс Бей</span></li>
            <li className="flex items-center space-x-2"><MapPin className="w-3.5 h-3.5 text-teal-500" /><span>Хадаба & Старый Город</span></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Контакты</h4>
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
              <span>Панель управления (CRM)</span>
            </Link>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-900 text-center text-[11px] text-slate-600">
        © 2026 SHARMINO. Все права защищены.
      </div>
    </footer>
  );
};