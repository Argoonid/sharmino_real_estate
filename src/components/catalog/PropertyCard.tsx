'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Bed, Bath, Maximize, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Property } from '@/types';
import { useApp } from '@/context/AppContext';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { lang, favorites, toggleFavorite, comparisonList, toggleComparison, formatPrice } = useApp();
  const isFav = favorites.includes(property.id);
  const isCompared = comparisonList.includes(property.id);

  const districtNames: Record<string, string> = {
    naama_bay: 'Наама Бей',
    old_town: 'Старый Город',
    hadaba: 'Хадаба',
    sharks_bay: 'Шаркс Бей',
    sahl_hasheesh: 'Сахль Хашиш',
    nabq: 'Набк',
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const handleComparisonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleComparison(property.id);
  };

  return (
    <Link
      href={`/property/${property.id}`}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1 block"
    >
      <div>
        {/* Превью и бэйджи */}
        <div className="relative h-64 w-full overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title[lang]}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md shadow-md ${
              property.operation === 'daily' 
                ? 'bg-teal-600/90' 
                : property.operation === 'sale' 
                ? 'bg-amber-600/90' 
                : 'bg-sky-600/90'
            }`}>
              {property.operation === 'daily' ? 'Посуточно' : property.operation === 'sale' ? 'Продажа' : 'Аренда'}
            </span>
            {property.isVip && (
              <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-md">
                <Sparkles className="w-3 h-3" />
                <span>VIP</span>
              </span>
            )}
          </div>

          {/* Иконка "Избранное" без перехода по ссылке */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition cursor-pointer z-10 ${
              isFav ? 'bg-rose-500 text-white' : 'bg-slate-900/40 text-white hover:bg-rose-500'
            }`}
            title="Добавить в избранное"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>

          <div className="absolute bottom-4 left-4 flex items-center space-x-1 text-white/90 text-xs font-medium bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>{districtNames[property.district] || property.district}</span>
          </div>
        </div>

        {/* Информационный блок */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition line-clamp-1 mb-2">
            {property.title[lang]}
          </h3>

          <p className="text-slate-500 text-sm mb-4 line-clamp-2">
            {property.description[lang]}
          </p>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-slate-600 text-xs font-semibold mb-4">
            <div className="flex items-center space-x-1.5">
              <Bed className="w-4 h-4 text-teal-600" />
              <span>{property.details.bedrooms} спальни</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Bath className="w-4 h-4 text-teal-600" />
              <span>{property.details.bathrooms} ванные</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Maximize className="w-4 h-4 text-teal-600" />
              <span>{property.details.areaSqM} м²</span>
            </div>
          </div>
        </div>
      </div>

      {/* Стоимость и кнопка перехода */}
      <div className="px-6 pb-6 pt-0">
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Стоимость</span>
            <div className="text-2xl font-black text-slate-900">
              {formatPrice(property.price.baseEgp)}
              {property.operation === 'daily' && <span className="text-xs font-medium text-slate-500"> /ночь</span>}
            </div>
          </div>
          
          {/* Сравнение без перехода по ссылке */}
          <button
            onClick={handleComparisonClick}
            className={`text-xs underline transition cursor-pointer z-10 ${isCompared ? 'text-teal-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {isCompared ? 'В сравнении' : '+ Сравнить'}
          </button>
        </div>

        {/* Главная кнопка-указатель */}
        <div
          className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-center transition-all duration-300 flex items-center justify-center space-x-2 ${
            property.operation === 'daily'
              ? 'bg-gradient-to-r from-teal-500 to-teal-700 group-hover:from-teal-600 group-hover:to-teal-800 text-white shadow-lg shadow-teal-500/20'
              : 'bg-slate-900 group-hover:bg-teal-600 text-white'
          }`}
        >
          <span>{property.operation === 'daily' ? 'Забронировать' : 'Запросить детали'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};