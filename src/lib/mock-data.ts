import { Property, OperationType } from '@/types';
import rawData from './scraped_properties.json';

// Авто-калибровка валют и типов сделок
function processProperty(prop: any): Property {
  let baseEgp = prop.price?.baseEgp || 0;

  // Если в спарсенном объекте сохранилась исходная валюта
  if (prop.rawPriceText) {
    const text = prop.rawPriceText;
    const num = parseInt(text.replace(/[^\d]/g, ''), 10) || 0;

    if (text.includes('€') || text.includes('EUR')) {
      baseEgp = Math.round(num * 58.4);
    } else if (text.includes('$') || text.includes('USD')) {
      baseEgp = Math.round(num * 50.5);
    } else if (text.includes('£') || text.includes('GBP')) {
      baseEgp = Math.round(num * 66.0);
    } else {
      baseEgp = num; // EGP / LE
    }
  }

  // Распределение сделок: от $500 (25 000 EGP)
  let operation: OperationType = prop.operation;
  if (baseEgp < 25_000) {
    operation = 'daily';
  } else if (baseEgp >= 25_000 && baseEgp < 600_000) {
    operation = 'long_term';
  } else {
    operation = 'sale';
  }

  return {
    ...prop,
    operation,
    operations: [operation],
    price: {
      baseEgp,
    },
    // Авто-расчет депозитов
    ...(operation === 'daily' && {
      cleaningFeeEgp: prop.cleaningFeeEgp || Math.max(800, Math.round(baseEgp * 0.25)),
      depositEgp: prop.depositEgp || Math.max(2000, Math.round(baseEgp * 1.5)),
    }),
    ...(operation === 'long_term' && {
      depositEgp: prop.depositEgp || baseEgp,
    }),
  };
}

export const MOCK_PROPERTIES: Property[] = (rawData as Property[])
  .filter((p) => p.price && p.price.baseEgp > 0 && Array.isArray(p.images) && p.images.length > 0)
  .map(processProperty);

export function getPropertyById(id: string): Property | undefined {
  return MOCK_PROPERTIES.find((p) => p.id.toLowerCase() === id.toLowerCase());
}

export function getFeaturedProperties(): Property[] {
  return MOCK_PROPERTIES.filter((p) => p.isVip);
}