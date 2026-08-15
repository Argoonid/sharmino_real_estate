import { Property } from '@/types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: {
      ru: 'Премиум-вилла с частным бассейном и видом на море',
      en: 'Premium Villa with Private Pool & Sea View'
    },
    description: {
      ru: 'Роскошная вилла в закрытом комплексе Сахль Хашиш. Собственный выход к пляжу, панорамные окна и просторная терраса.',
      en: 'Luxury villa in gated Sahl Hasheesh community. Private beach access, panoramic windows, and terrace.'
    },
    type: 'villa',
    operation: 'daily',
    district: 'sahl_hasheesh',
    address: 'Sahl Hasheesh Bay, Villa 14',
    price: { baseEgp: 18000 },
    details: {
      bedrooms: 4,
      bathrooms: 4,
      areaSqM: 320,
      seaView: true,
      pool: true,
      furnished: true,
      distanceToBeachMeters: 50,
    },
    location: { lat: 27.049, lng: 33.888 },
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    // Уникальная панорама 360 для Виллы
    panoramaUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2500&q=80',
    isVip: true,
    cleaningFeeEgp: 2500,
    depositEgp: 10000,
  },
  {
    id: 'prop-2',
    title: {
      ru: 'Апартаменты с 2 спальнями в Наама Бей',
      en: '2-Bedroom Apartment in Naama Bay'
    },
    description: {
      ru: 'Уютная квартира в центре туристической жизни. В шаговой доступности кафе, променад и песчаный пляж.',
      en: 'Cozy apartment in the heart of tourist area. Walking distance to cafes, promenade, and beach.'
    },
    type: 'apartment',
    operation: 'sale',
    district: 'naama_bay',
    address: 'Naama Bay Resort, Apt 402',
    price: { baseEgp: 4500000 },
    details: {
      bedrooms: 2,
      bathrooms: 1,
      areaSqM: 85,
      floor: 2,
      seaView: false,
      pool: true,
      furnished: true,
      distanceToBeachMeters: 300,
    },
    location: { lat: 27.915, lng: 34.329 },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    // Уникальная панорама 360 для Апартаментов
    panoramaUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2500&q=80',
    isVip: false,
  },
  {
    id: 'prop-3',
    title: {
      ru: 'Пентхаус с панорамным видом на риф Шаркс Бей',
      en: 'Penthouse with Reef Views in Shark\'s Bay'
    },
    description: {
      ru: 'Эксклюзивный пентхаус с огромной террасой на крыше и джакузи. Лучшая локация для любителей сноркелинга.',
      en: 'Exclusive penthouse with massive rooftop terrace and jacuzzi. Prime location for snorkeling.'
    },
    type: 'penthouse',
    operation: 'long_term',
    district: 'sharks_bay',
    address: 'Shark\'s Bay Coast, Block B',
    price: { baseEgp: 75000 },
    details: {
      bedrooms: 3,
      bathrooms: 2,
      areaSqM: 160,
      floor: 4,
      seaView: true,
      pool: true,
      furnished: true,
      distanceToBeachMeters: 100,
    },
    location: { lat: 27.952, lng: 34.394 },
    images: [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80'
    ],
    // Уникальная панорама 360 для Пентхауса
    panoramaUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2500&q=80',
    isVip: true,
  },
  {
    id: 'prop-4',
    title: {
      ru: 'Уютная студия у моря посуточно в районе Хадаба',
      en: 'Cozy Seafront Studio for Daily Rent in Hadaba'
    },
    description: {
      ru: 'Стильная студия с панорамным балконом и видом на коралловый риф. Закрытая территория с бассейнами, высокоскоростной Wi-Fi, тихое и безопасное место.',
      en: 'Stylish studio with panoramic balcony and reef views. Private gated area with swimming pools and high-speed Wi-Fi.'
    },
    type: 'apartment',
    operation: 'daily',
    district: 'hadaba',
    address: 'Hadaba Cliff Resort, Apt 12',
    price: { baseEgp: 4500 }, // ~90 USD / ночь
    details: {
      bedrooms: 1,
      bathrooms: 1,
      areaSqM: 55,
      floor: 2,
      seaView: true,
      pool: true,
      furnished: true,
      distanceToBeachMeters: 150,
    },
    location: { lat: 27.863, lng: 34.312 },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    // Уникальная панорама 360 для Посуточной студии
    panoramaUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2500&q=80',
    isVip: false,
    cleaningFeeEgp: 1000,
    depositEgp: 3000,
  }
];