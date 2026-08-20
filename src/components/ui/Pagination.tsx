'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // Генерация диапазона номеров страниц (с многоточиями)
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

  const handlePageClick = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="flex items-center justify-center space-x-2 my-12" aria-label="Пагинация">
      {/* Кнопка «Назад» */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:border-teal-600 hover:text-teal-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-700 transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Номера страниц */}
      <div className="flex items-center space-x-1.5">
        {getPageNumbers().map((item, index) => {
          if (item === '...') {
            return (
              <span key={`dots-${index}`} className="w-9 text-center text-slate-400 font-semibold select-none">
                ...
              </span>
            );
          }

          const pageNumber = item as number;
          const isActive = currentPage === pageNumber;

          return (
            <button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              className={`w-11 h-11 rounded-2xl text-sm font-bold transition shadow-sm cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-teal-600/30'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-teal-600 hover:text-teal-600'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Кнопка «Вперед» */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:border-teal-600 hover:text-teal-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-700 transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
};