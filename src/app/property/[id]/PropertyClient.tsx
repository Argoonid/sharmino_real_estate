'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { useApp } from '@/context/AppContext';
import { PanoramaViewer } from '@/components/3d/PanoramaViewer';
import { BookingModal } from '@/components/booking/BookingModal';
import { MapPin, Sparkles, ArrowLeft } from 'lucide-react';
import { Property } from '@/types';

interface PropertyClientProps {
  property: Property;
}

export function PropertyClient({ property }: PropertyClientProps) {
  const { lang, formatPrice } = useApp();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Кнопка возврата в каталог */}
      <div>
        <Link
          href="/catalog"
          className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm hover:shadow transition-all duration-200 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-teal-600" />
          <span>Назад в каталог</span>
        </Link>
      </div>

      {/* 2. Заголовок и Блок цены */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase mb-3 bg-teal-50 inline-flex px-3 py-1.5 rounded-lg">
            <MapPin className="w-4 h-4" />
            <span>{property.district.replace('_', ' ')} • {property.address}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {property.title[lang]}
          </h1>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between md:justify-end sm:space-x-8 gap-4">
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-1">Стоимость</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {formatPrice(property.price.baseEgp)}
              {property.operation === 'daily' && <span className="text-sm font-medium text-slate-500"> / ночь</span>}
            </div>
          </div>

          {property.operation === 'daily' ? (
            <button
              onClick={() => setIsBookingOpen(true)}
              className="cursor-pointer py-3.5 px-8 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-black text-sm shadow-xl shadow-teal-500/30 transform transition-all duration-300 hover:scale-105 active:scale-95 text-center"
            >
              Забронировать
            </button>
          ) : (
            <button className="cursor-pointer py-3.5 px-8 rounded-2xl bg-slate-900 text-white font-black text-sm shadow-xl shadow-slate-900/20 transform transition-all duration-300 hover:scale-105 hover:bg-teal-600 active:scale-95 text-center">
              Запросить просмотр
            </button>
          )}
        </div>
      </div>

      {/* 3. Галерея и 3D-тур */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          <div className="rounded-3xl overflow-hidden h-[280px] sm:h-[420px] shadow-lg group cursor-pointer">
            <img 
              src={property.images[0]} 
              alt="Property" 
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" 
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Виртуальный 3D-тур</span>
            </h2>
            <PanoramaViewer panoramaUrl={property.panoramaUrl} />
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900">Описание объекта</h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-medium">
              {property.description[lang]}
            </p>
          </div>
        </div>

        {/* 4. Сайдбар со свойствами */}
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5 sticky top-28">
            <h3 className="text-lg sm:text-xl font-black text-slate-900">Характеристики</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">Спальни</span>
                <span className="font-black text-base text-slate-900">{property.details.bedrooms}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">Ванные</span>
                <span className="font-black text-base text-slate-900">{property.details.bathrooms}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">Площадь</span>
                <span className="font-black text-base text-slate-900">{property.details.areaSqM} м²</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">До пляжа</span>
                <span className="font-black text-base text-slate-900">{property.details.distanceToBeachMeters} м</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isBookingOpen && (
        <BookingModal property={property} onClose={() => setIsBookingOpen(false)} />
      )}
    </div>
  );
}