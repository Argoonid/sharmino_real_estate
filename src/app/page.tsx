'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Building, ShieldCheck, Award, Key, Compass } from 'lucide-react';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { PropertyCard } from '@/components/catalog/PropertyCard';
import { Property } from '@/types';

export default function HomePage() {
  const [selectedOperation, setSelectedOperation] = useState<'all' | 'sale' | 'daily' | 'long_term'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  const filteredProperties = MOCK_PROPERTIES.filter((prop) => {
    if (selectedOperation !== 'all' && prop.operation !== selectedOperation) return false;
    if (selectedDistrict !== 'all' && prop.district !== selectedDistrict) return false;
    return true;
  });

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center bg-slate-950 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-teal-500/20 border border-teal-400/30 backdrop-blur-md text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Элитный курортный отдых и инвестиции</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Недвижимость в <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-amber-300 to-teal-400">Шарм-эль-Шейхе</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Посуточная аренда вилл у моря, покупка апартаментов в закрытых комплексах и оформление сделок «под ключ».
          </p>

          {/* Quick Filter Bar */}
          <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/20 text-slate-900 max-w-4xl mx-auto text-left">
            <div className="flex space-x-2 mb-4 border-b border-slate-100 pb-3">
              {[
                { id: 'all', label: 'Все объекты' },
                { id: 'daily', label: 'Посуточно' },
                { id: 'sale', label: 'Продажа' },
                { id: 'long_term', label: 'Долгосрок' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedOperation(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    selectedOperation === tab.id
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Район
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">Все районы</option>
                  <option value="sahl_hasheesh">Сахль Хашиш</option>
                  <option value="naama_bay">Наама Бей</option>
                  <option value="sharks_bay">Шаркс Бей</option>
                  <option value="hadaba">Хадаба</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Тип недвижимости
                </label>
                <select className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="all">Любой тип</option>
                  <option value="villa">Виллы</option>
                  <option value="apartment">Апартаменты</option>
                  <option value="penthouse">Пентхаусы</option>
                </select>
              </div>

              <div className="sm:self-end">
                <Link
                  href={`/catalog?operation=${selectedOperation}&district=${selectedDistrict}`}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition"
                >
                  <Search className="w-4 h-4" />
                  <span>Показать варианты</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Горячие предложения</h2>
            <p className="text-slate-500 text-sm mt-1">Проверенные объекты с гарантией чистоты сделки</p>
          </div>
          <Link href="/catalog" className="text-sm font-bold text-teal-600 hover:text-teal-700 underline">
            Смотреть весь каталог →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* Agency Advantages Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black">Почему выбирают SHARM ESTATE</h2>
            <p className="text-slate-400 text-sm">Полный спектр услуг премиального сервиса недвижимости</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700/50 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Юридическая безопасность</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Полная проверка правоустанавливающих документов (Green Contract, Таукиль) перед оформлением.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700/50 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Управление недвижимостью</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Берем на себя сдачу вашей квартиры или виллы в посуточную аренду с гарантированным доходом.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700/50 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Сделки «Под ключ»</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Встреча в аэропорту, трансфер, показы объектов на авто представительского класса и переводчики.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}