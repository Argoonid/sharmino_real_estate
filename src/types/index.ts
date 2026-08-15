export type PropertyType = 'apartment' | 'villa' | 'penthouse' | 'commercial';
export type OperationType = 'sale' | 'long_term' | 'daily';
export type Currency = 'EGP' | 'USD' | 'EUR';
export type Language = 'ru' | 'en';

export interface Property {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  type: PropertyType;
  
  // Основной тип сделки (обязательный, чтобы не ломался существующий код)
  operation: OperationType;
  
  // Дополнительные типы сделок для админки (опционально, например: ['sale', 'daily'])
  operations?: OperationType[];

  district: 'naama_bay' | 'old_town' | 'hadaba' | 'sharks_bay' | 'sahl_hasheesh' | 'nabq';
  address: string;
  price: {
    baseEgp: number;
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    areaSqM: number;
    floor?: number;
    seaView: boolean;
    pool: boolean;
    furnished: boolean;
    distanceToBeachMeters: number;
  };
  location: {
    lat: number;
    lng: number;
  };
  images: string[];
  
  // Опциональные параметры (с вопросительным знаком ?)
  panoramaUrl?: string;
  isVip?: boolean;
  cleaningFeeEgp?: number;
  depositEgp?: number;
  
  // Новые поля для админки (опциональные, чтобы старые объекты не выдавали ошибок)
  availableFromDate?: string; // Дата, с которой объект свободен ('YYYY-MM-DD')
  isAutoHiddenWhenBooked?: boolean;
}