import { Language } from '@/types';

export const DICTIONARY = {
  ru: {
    // Общие элементы UI
    common: {
      loading: 'Загрузка...',
      back: 'Назад',
      close: 'Закрыть',
      save: 'Сохранить',
      delete: 'Удалить',
      search: 'Поиск...',
      copy: 'Скопировать',
      copied: 'Скопировано!',
      confirm: 'Подтвердить',
      night: 'ночь',
      perNight: ' / ночь',
      sqm: 'м²',
      meters: 'м',
    },

    // Навигация и Хедер
    nav: {
      catalog: 'Каталог объектов',
      about: 'О компании',
      favorites: 'Избранное',
      toSite: 'Вернуться на сайт',
      adminCrm: 'Панель управления (CRM)',
      phone: '+20 (100) 000-00-00',
    },

    // Главная страница (Hero и преимущества)
    home: {
      heroBadge: 'Элитный курортный отдых и инвестиции',
      heroTitleStart: 'Недвижимость в',
      heroTitleAccent: 'Шарм-эль-Шейхе',
      heroDesc: 'Посуточная аренда вилл у моря, покупка апартаментов в закрытых комплексах и оформление сделок «под ключ».',
      showVariants: 'Показать варианты',
      featuredTitle: 'Горячие предложения',
      featuredSubtitle: 'Проверенные объекты с гарантией чистоты сделки',
      viewAllCatalog: 'Смотреть весь каталог →',
      whyTitle: 'Почему выбирают SHARMINO',
      whySubtitle: 'Полный спектр услуг премиального сервиса недвижимости',
      legalTitle: 'Юридическая безопасность',
      legalDesc: 'Полная проверка правоустанавливающих документов (Green Contract, Таукиль) перед оформлением.',
      managementTitle: 'Управление недвижимостью',
      managementDesc: 'Берем на себя сдачу вашей квартиры или виллы в посуточную аренду с гарантированным доходом.',
      turnkeyTitle: 'Сделки «Под ключ»',
      turnkeyDesc: 'Встреча в аэропорту, трансфер, показы объектов на авто представительского класса и переводчики.',
    },

    // Каталог и фильтры
    catalog: {
      title: 'Каталог недвижимости',
      found: 'Найдено вариантов:',
      grid: 'Сеткой',
      map: 'На карте',
      filters: 'Фильтры',
      dealType: 'Сделка',
      propType: 'Тип недвижимости',
      district: 'Район',
      allDeals: 'Все варианты',
      allTypes: 'Все типы',
      allDistricts: 'Все районы',
      resetFilters: 'Сбросить фильтры',
      notFound: 'Объекты не найдены',
    },

    // Карточка объекта
    card: {
      daily: 'Посуточно',
      sale: 'Продажа',
      longTerm: 'Долгосрок',
      vip: 'VIP',
      bedrooms: 'спальни',
      bathrooms: 'ванные',
      price: 'Стоимость',
      book: 'Забронировать',
      requestDetails: 'Запросить детали',
      inCompare: 'В сравнении',
      compare: '+ Сравнить',
    },

    // Детальная страница объекта
    property: {
      backToCatalog: 'Назад в каталог',
      requestViewing: 'Запросить просмотр',
      virtualTour: 'Виртуальный 3D-тур',
      description: 'Описание объекта',
      specs: 'Характеристики',
      bedrooms: 'Спальни',
      bathrooms: 'Ванные',
      area: 'Площадь',
      distanceToBeach: 'До пляжа',
    },

    // Модальное окно бронирования
    booking: {
      modalTitle: 'Онлайн-бронирование',
      checkIn: 'Заезд',
      checkOut: 'Выезд',
      nights: 'ночей',
      cleaningFee: 'Уборка',
      total: 'Итого к оплате',
      next: 'Далее',
      guestName: 'ФИО Гостя',
      guestPhone: 'Телефон / WhatsApp',
      submitting: 'Отправка заявки...',
      confirmAndPay: 'Подтвердить и Оплатить',
      successTitle: 'Заявка принята!',
      successDesc: 'Детали отправлены менеджеру. Мы свяжемся с вами в WhatsApp в ближайшее время.',
    },

    // Районы
    districts: {
      sahl_hasheesh: 'Сахль Хашиш',
      naama_bay: 'Наама Бей',
      sharks_bay: 'Шаркс Бей',
      hadaba: 'Хадаба',
      old_town: 'Старый Город',
      nabq: 'Набк',
    },

    // Типы недвижимости
    propertyTypes: {
      villa: 'Вилла',
      apartment: 'Апартаменты',
      penthouse: 'Пентхаус',
    },

    // Админ-панель / CRM
    admin: {
      panelTitle: 'Панель управления',
      propertiesTab: 'База объектов',
      bookingsTab: 'Шахматка / Календарь',
      leadsTab: 'CRM Канбан',
      pricingTab: 'Сезоны & Цены',
      addProperty: 'Добавить объект',
      editProperty: 'Редактировать объект',
      searchPlaceholder: 'Поиск объекта...',
      occupiedUntil: 'Занято до',
      available: 'Свободен',
      actions: 'Действия',
      edit: 'Редактировать',
      deleteConfirm: 'Удалить объект из системы?',
      seasonsController: 'Контроллер сезонов',
      seasonsDesc: 'Цены на всем сайте пересчитываются мгновенно в реальном времени',
      activeNow: 'Активен сейчас',
      activate: 'Включить',
      offseason: 'Межсезонье (1.0x)',
      offseasonDesc: 'Базовая стоимость без наценок',
      winter: 'Зимний сезон (+25%)',
      winterDesc: 'Повышенный спрос (Нов - Апр)',
      newyear: 'Новогодний Пик (+50%)',
      newyearDesc: 'Максимальные цены на праздники',
      newLeads: 'Новые Заявки',
      inProgressLeads: 'В работе',
      confirmedLeads: 'Оплачено',
      newLeadBtn: '+ Новая заявка',
      generateVoucher: 'Сформировать Ваучер',
      voucherTitle: 'Ваучер Бронирования',
      guest: 'Гость:',
      propertyLabel: 'Объект:',
      dates: 'Даты:',
      amountToPay: 'Сумма к оплате:',
      copyVoucher: 'Скопировать ваучер для отправки',
      voucherCopied: 'Ваучер скопирован!',
      checkinConfirmed: '✓ Заезд подтвержден',
    },

    // Футер
    footer: {
      desc: 'Платформа элитной курортной недвижимости SHARMINO. Продажа вилл, долгосрочная и посуточная аренда в Египте.',
      sections: 'Разделы',
      locations: 'Локации',
      contacts: 'Контакты',
      rights: '© 2026 SHARMINO. Все права защищены.',
    },
  },

  en: {
    // Common UI
    common: {
      loading: 'Loading...',
      back: 'Back',
      close: 'Close',
      save: 'Save Changes',
      delete: 'Delete',
      search: 'Search...',
      copy: 'Copy',
      copied: 'Copied!',
      confirm: 'Confirm',
      night: 'night',
      perNight: ' / night',
      sqm: 'sq.m',
      meters: 'm',
    },

    // Navigation & Header
    nav: {
      catalog: 'Explore Catalog',
      about: 'About Us',
      favorites: 'Favorites',
      toSite: 'Back to Website',
      adminCrm: 'Control Panel (CRM)',
      phone: '+20 (100) 000-00-00',
    },

    // Home Page
    home: {
      heroBadge: 'Luxury Resort Living & Investments',
      heroTitleStart: 'Luxury Real Estate in',
      heroTitleAccent: 'Sharm El Sheikh',
      heroDesc: 'Short-term luxury villa rentals, private resort apartments for sale, and turnkey investment deals.',
      showVariants: 'Explore Properties',
      featuredTitle: 'Featured Properties',
      featuredSubtitle: 'Verified exclusive properties with full legal protection',
      viewAllCatalog: 'View full catalog →',
      whyTitle: 'Why Choose SHARMINO',
      whySubtitle: 'Full range of premium real estate & concierge services',
      legalTitle: 'Legal Due Diligence',
      legalDesc: 'Thorough title and registry checks (Green Contract, Tawkeel) prior to closing.',
      managementTitle: 'Property Management',
      managementDesc: 'Full-cycle short-term rental management for your apartment or villa with guaranteed yield.',
      turnkeyTitle: 'Turnkey VIP Service',
      turnkeyDesc: 'Airport reception, VIP transfers, luxury car showings, and certified translation support.',
    },

    // Catalog & Filters
    catalog: {
      title: 'Property Catalog',
      found: 'Properties found:',
      grid: 'Grid view',
      map: 'Map view',
      filters: 'Filters',
      dealType: 'Deal Type',
      propType: 'Property Type',
      district: 'District',
      allDeals: 'All Deals',
      allTypes: 'All Types',
      allDistricts: 'All Districts',
      resetFilters: 'Reset Filters',
      notFound: 'No properties found',
    },

    // Property Card
    card: {
      daily: 'Short-term',
      sale: 'For Sale',
      longTerm: 'Long-term',
      vip: 'VIP',
      bedrooms: 'beds',
      bathrooms: 'baths',
      price: 'Price',
      book: 'Book Now',
      requestDetails: 'Request Details',
      inCompare: 'In comparison',
      compare: '+ Compare',
    },

    // Property Detail Page
    property: {
      backToCatalog: 'Back to Catalog',
      requestViewing: 'Request Viewing',
      virtualTour: 'Virtual 3D Tour',
      description: 'Property Description',
      specs: 'Key Specifications',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      area: 'Living Area',
      distanceToBeach: 'Distance to Beach',
    },

    // Booking Modal
    booking: {
      modalTitle: 'Instant Booking',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      nights: 'nights',
      cleaningFee: 'Cleaning Fee',
      total: 'Total Amount',
      next: 'Continue',
      guestName: 'Full Name',
      guestPhone: 'Phone / WhatsApp',
      submitting: 'Processing...',
      confirmAndPay: 'Confirm & Pay',
      successTitle: 'Booking Confirmed!',
      successDesc: 'Details sent to our manager. We will contact you via WhatsApp shortly.',
    },

    // Districts
    districts: {
      sahl_hasheesh: 'Sahl Hasheesh',
      naama_bay: 'Naama Bay',
      sharks_bay: 'Sharks Bay',
      hadaba: 'Hadaba',
      old_town: 'Old Town',
      nabq: 'Nabq',
    },

    // Property Types
    propertyTypes: {
      villa: 'Villa',
      apartment: 'Apartment',
      penthouse: 'Penthouse',
    },

    // Admin / CRM
    admin: {
      panelTitle: 'Control Panel',
      propertiesTab: 'Properties',
      bookingsTab: 'Calendar & Occupancy',
      leadsTab: 'CRM Kanban',
      pricingTab: 'Seasons & Pricing',
      addProperty: 'Add Property',
      editProperty: 'Edit Property',
      searchPlaceholder: 'Search property...',
      occupiedUntil: 'Occupied until',
      available: 'Available',
      actions: 'Actions',
      edit: 'Edit',
      deleteConfirm: 'Delete property from system?',
      seasonsController: 'Seasonal Pricing Controller',
      seasonsDesc: 'All property rates recalculate instantly across the platform in real time',
      activeNow: 'Active Now',
      activate: 'Activate',
      offseason: 'Off-Season (1.0x)',
      offseasonDesc: 'Standard base rate without surcharges',
      winter: 'Winter High Season (+25%)',
      winterDesc: 'Peak travel period (Nov - Apr)',
      newyear: 'New Year Peak (+50%)',
      newyearDesc: 'Maximum peak holiday rates',
      newLeads: 'New Leads',
      inProgressLeads: 'In Progress',
      confirmedLeads: 'Confirmed / Paid',
      newLeadBtn: '+ New Lead',
      generateVoucher: 'Generate Voucher',
      voucherTitle: 'Booking Voucher',
      guest: 'Guest:',
      propertyLabel: 'Property:',
      dates: 'Dates:',
      amountToPay: 'Total Amount:',
      copyVoucher: 'Copy Voucher to Clipboard',
      voucherCopied: 'Voucher copied to clipboard!',
      checkinConfirmed: '✓ Check-in Confirmed',
    },

    // Footer
    footer: {
      desc: 'SHARMINO luxury resort real estate platform. Villa sales, short-term and long-term rentals in Sharm El Sheikh.',
      sections: 'Navigation',
      locations: 'Locations',
      contacts: 'Contacts',
      rights: '© 2026 SHARMINO. All rights reserved.',
    },
  },
} as const;

export const useTranslation = (lang: Language) => {
  return DICTIONARY[lang] || DICTIONARY.ru;
};