'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { PropertyCard } from '@/components/catalog/PropertyCard';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Filter, Map as MapIcon, Grid, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { OperationType, PropertyType } from '@/types';
import { useApp } from '@/context/AppContext';

const ITEMS_PER_PAGE = 12;

const PropertyMap = dynamic(() => import('@/components/map/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] flex items-center justify-center bg-slate-50 rounded-3xl border border-slate-200">
      <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
    </div>
  ),
});

function CatalogContent() {
  const { lang } = useApp();
  const isRu = lang === 'ru';

  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const [operation, setOperation] = useState<OperationType | 'all'>('all');
  const [type, setType] = useState<PropertyType | 'all'>('all');
  const [district, setDistrict] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Синхронизация фильтров из URL параметров
  useEffect(() => {
    const opParam = searchParams.get('operation');
    const distParam = searchParams.get('district');

    if (opParam) setOperation(opParam as any);
    if (distParam) setDistrict(distParam);
  }, [searchParams]);

  // Фильтрация объектов
  const filteredProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter((p) => {
      if (operation !== 'all' && p.operation !== operation) return false;
      if (type !== 'all' && p.type !== type) return false;
      if (district !== 'all' && p.district !== district) return false;
      return true;
    });
  }, [operation, type, district]);

  // Сброс на 1 страницу при изменении любого фильтра
  useEffect(() => {
    setCurrentPage(1);
  }, [operation, type, district]);

  // Расчет пагинации для сетки карточек
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Генерация диапазона страниц с многоточиями
  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    return range;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Шапка каталога и переключатель вида */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            {isRu ? 'Каталог недвижимости' : 'Property Catalog'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isRu ? 'Найдено вариантов: ' : 'Properties found: '}
            <span className="font-bold text-teal-600">{filteredProperties.length}</span>
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>{isRu ? 'Сеткой' : 'Grid'}</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              viewMode === 'map'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>{isRu ? 'На карте' : 'Map'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Панель фильтров */}
        <aside className="lg:col-span-1 space-y-6 relative z-30">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 sticky top-24 lg:top-28 z-30">
            <div className="flex items-center space-x-2 text-slate-900 font-bold mb-2">
              <Filter className="w-5 h-5 text-teal-500" />
              <h2>{isRu ? 'Фильтры' : 'Filters'}</h2>
            </div>

            {/* Тип сделки */}
            <CustomSelect
              label={isRu ? 'Сделка' : 'Deal Type'}
              value={operation}
              onChange={(val) => setOperation(val as any)}
              options={[
                { value: 'all', label: isRu ? 'Все варианты' : 'All Deals' },
                { value: 'daily', label: isRu ? 'Посуточно' : 'Short-term' },
                { value: 'long_term', label: isRu ? 'Долгосрок' : 'Long-term' },
                { value: 'sale', label: isRu ? 'Продажа' : 'For Sale' },
              ]}
            />

            {/* Тип недвижимости */}
            <CustomSelect
              label={isRu ? 'Тип' : 'Property Type'}
              value={type}
              onChange={(val) => setType(val as any)}
              options={[
                { value: 'all', label: isRu ? 'Все типы' : 'All Types' },
                { value: 'villa', label: isRu ? 'Вилла' : 'Villa' },
                { value: 'apartment', label: isRu ? 'Апартаменты' : 'Apartment' },
                { value: 'penthouse', label: isRu ? 'Пентхаус' : 'Penthouse' },
                { value: 'commercial', label: isRu ? 'Коммерческая' : 'Commercial' },
              ]}
            />

            {/* Район */}
            <CustomSelect
              label={isRu ? 'Район' : 'District'}
              value={district}
              onChange={(val) => setDistrict(val)}
              options={[
                { value: 'all', label: isRu ? 'Все районы' : 'All Districts' },
                { value: 'nabq', label: isRu ? 'Набк' : 'Nabq' },
                { value: 'sharks_bay', label: isRu ? 'Шаркс Бей' : 'Sharks Bay' },
                { value: 'hadaba', label: isRu ? 'Хадаба' : 'Hadaba' },
                { value: 'naama_bay', label: isRu ? 'Наама Бей' : 'Naama Bay' },
                { value: 'old_town', label: isRu ? 'Старый Город' : 'Old Town' },
                { value: 'sahl_hasheesh', label: isRu ? 'Сахль Хашиш' : 'Sahl Hasheesh' },
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
              {isRu ? 'Сбросить фильтры' : 'Reset Filters'}
            </button>
          </div>
        </aside>

        {/* Вывод карточек или карты */}
        <div className="lg:col-span-3 relative z-10 flex flex-col justify-between">
          {viewMode === 'grid' ? (
            <>
              {paginatedProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="col-span-full py-20 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
                  <p className="text-lg font-bold">
                    {isRu ? 'Объекты не найдены' : 'No properties found'}
                  </p>
                </div>
              )}

              {/* Пагинация */}
              {totalPages > 1 && (
                <nav className="flex items-center justify-center space-x-2 pt-10" aria-label="Пагинация">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-teal-600 hover:text-teal-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-700 transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center space-x-1">
                    {getPageNumbers().map((item, index) => {
                      if (item === '...') {
                        return (
                          <span
                            key={`dots-${index}`}
                            className="w-8 text-center text-slate-400 font-semibold select-none"
                          >
                            ...
                          </span>
                        );
                      }

                      const pageNum = item as number;
                      const isActive = currentPage === pageNum;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                            isActive
                              ? 'bg-teal-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:border-teal-600 hover:text-teal-600'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-teal-600 hover:text-teal-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-700 transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              )}
            </>
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
    <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}