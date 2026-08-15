'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency, Language } from '@/types';

export type Season = 'offseason' | 'winter' | 'newyear';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  activeSeason: Season;
  setActiveSeason: (season: Season) => void;
  seasonMultiplier: number;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  comparisonList: string[];
  toggleComparison: (id: string) => void;
  formatPrice: (priceInEgp: number) => string;
}

const EXCHANGE_RATES: Record<Currency, number> = {
  EGP: 1,
  USD: 0.020,
  EUR: 0.018,
};

const SEASON_MULTIPLIERS: Record<Season, number> = {
  offseason: 1.0,  // Межсезонье (0%)
  winter: 1.25,     // Зимний сезон (+25%)
  newyear: 1.50,    // Новый Год (+50%)
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ru');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [activeSeason, setActiveSeason] = useState<Season>('offseason');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparisonList, setComparisonList] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sharm_favs');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('sharm_favs', JSON.stringify(updated));
  };

  const toggleComparison = (id: string) => {
    setComparisonList((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Динамический пересчет стоимости с учетом АКТИВНОГО СЕЗОНА и ВАЛЮТЫ
  const formatPrice = (priceInEgp: number): string => {
    const priceWithSeason = priceInEgp * SEASON_MULTIPLIERS[activeSeason];
    const converted = priceWithSeason * EXCHANGE_RATES[currency];

    return new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : 'en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        currency,
        setCurrency,
        activeSeason,
        setActiveSeason,
        seasonMultiplier: SEASON_MULTIPLIERS[activeSeason],
        favorites,
        toggleFavorite,
        comparisonList,
        toggleComparison,
        formatPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};