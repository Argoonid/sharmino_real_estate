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

export const CustomSelect: React.FC<CustomSelectProps> = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Закрытие выпадающего списка при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
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
          isOpen ? 'border-teal-500 ring-2 ring-teal-500/20 bg-white shadow-md' : 'border-slate-200'
        }`}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-teal-600 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Кастомный список вариантов */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
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
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-slate-700 hover:bg-teal-50/50 hover:text-teal-600'
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};