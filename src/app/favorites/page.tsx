'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { PropertyCard } from '@/components/catalog/PropertyCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites } = useApp();

  const favProperties = MOCK_PROPERTIES.filter((p) => favorites.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-[70vh]">
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-6">
        <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900">Избранные объекты</h1>
          <p className="text-xs text-slate-500 mt-1">Сохраненные варианты для быстрого доступа</p>
        </div>
      </div>

      {favProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4">
          <p className="text-slate-500 font-bold text-lg">Список избранного пуст</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Нажимайте на сердечко в карточках объектов, чтобы добавлять их в этот список.
          </p>
          <Link
            href="/catalog"
            className="inline-block py-3 px-6 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-teal-700 transition"
          >
            Перейти в каталог
          </Link>
        </div>
      )}
    </div>
  );
}