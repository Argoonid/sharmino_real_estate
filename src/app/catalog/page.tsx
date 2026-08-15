'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { PropertyCard } from '@/components/catalog/PropertyCard';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Filter, Map as MapIcon, Grid, Loader2 } from 'lucide-react';
import { OperationType, PropertyType } from '@/types';

const PropertyMap = dynamic(() => import('@/components/map/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] flex items-center justify-center bg-slate-50 rounded-3xl border border-slate-200">
      <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
    </div>
  ),
});

function CatalogContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const [operation, setOperation] = useState<OperationType | 'all'>('all');
  const [type, setType] = useState<PropertyType | 'all'>('all');
  const [district, setDistrict] = useState<string>('all');

  useEffect(() => {
    const opParam = searchParams.get('operation');
    const distParam = searchParams.get('district');

    if (opParam) setOperation(opParam as any);
    if (distParam) setDistrict(distParam);
  }, [searchParams]);

  const filteredProperties = MOCK_PROPERTIES.filter((p) => {
    if (operation !== 'all' && p.operation !== operation) return false;
    if (type !== 'all' && p.type !== type) return false;
    if (district !== 'all' && p.district !== district) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Каталог недвижимости</h1>
          <p className="text-sm text-slate-500 mt-1">
            Найдено вариантов: <span className="font-bold text-teal-600">{filteredProperties.length}</span>
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Сеткой</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>На карте</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 sticky top-28">
            <div className="flex items-center space-x-2 text-slate-900 font-bold mb-2">
              <Filter className="w-5 h-5 text-teal-500" />
              <h2>Фильтры</h2>
            </div>

            {/* Стильные кастомные дропдауны */}
            <CustomSelect
              label="Сделка"
              value={operation}
              onChange={(val) => setOperation(val as any)}
              options={[
                { value: 'all', label: 'Все варианты' },
                { value: 'daily', label: 'Посуточно' },
                { value: 'long_term', label: 'Долгосрок' },
                { value: 'sale', label: 'Продажа' },
              ]}
            />

            <CustomSelect
              label="Тип"
              value={type}
              onChange={(val) => setType(val as any)}
              options={[
                { value: 'all', label: 'Все типы' },
                { value: 'villa', label: 'Вилла' },
                { value: 'apartment', label: 'Апартаменты' },
                { value: 'penthouse', label: 'Пентхаус' },
              ]}
            />

            <CustomSelect
              label="Район"
              value={district}
              onChange={(val) => setDistrict(val)}
              options={[
                { value: 'all', label: 'Все районы' },
                { value: 'sahl_hasheesh', label: 'Сахль Хашиш' },
                { value: 'naama_bay', label: 'Наама Бей' },
                { value: 'sharks_bay', label: 'Шаркс Бей' },
                { value: 'hadaba', label: 'Хадаба' },
              ]}
            />

            <button
              onClick={() => {
                setOperation('all');
                setType('all');
                setDistrict('all');
              }}
              className="cursor-pointer w-full py-3 text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition mt-2"
            >
              Сбросить фильтры
            </button>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-slate-500">
                  <p className="text-lg font-bold">Объекты не найдены</p>
                </div>
              )}
            </div>
          ) : (
            <PropertyMap properties={filteredProperties} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Загрузка каталога...</div>}>
      <CatalogContent />
    </Suspense>
  );
}