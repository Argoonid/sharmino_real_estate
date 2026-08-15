'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ 
  label, 
  options, 
  value, 
  onChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Закрытие при клике вне компонента (поддержка мыши и мобильного тача)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    // При открытии поднимаем весь контейнер на z-40
    <div className={`space-y-1.5 relative ${isOpen ? 'z-40' : 'z-10'}`} ref={containerRef}>
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          {label}
        </label>
      )}

      {/* Кнопка вызова списка */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3.5 bg-slate-50 hover:bg-slate-100 border rounded-2xl text-xs font-bold text-slate-800 flex items-center justify-between transition-all duration-200 cursor-pointer ${
          isOpen 
            ? 'border-teal-500 ring-2 ring-teal-500/20 bg-white shadow-md' 
            : 'border-slate-200'
        }`}
      >
        <span className="truncate pr-2">{selectedOption?.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-teal-600 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Выпадающий список с гарантированным скроллом и z-50 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-y-auto max-h-60 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200 scrollbar-thin">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-xs font-bold text-left flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50 text-teal-700 font-black'
                    : 'text-slate-700 hover:bg-teal-50/60 hover:text-teal-600'
                }`}
              >
                <span className="truncate pr-2">{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};