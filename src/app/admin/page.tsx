'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building, 
  Calendar as CalendarIcon, 
  Users, 
  Plus, 
  Check, 
  Search, 
  Edit3, 
  Trash2, 
  Clock, 
  Sparkles, 
  X, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  UserCheck, 
  Zap, 
  ArrowLeft 
} from 'lucide-react';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { useApp } from '@/context/AppContext';
import { Property, OperationType, PropertyType } from '@/types';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  propTitle: string;
  dates: string;
  status: 'new' | 'in_progress' | 'confirmed';
  amount: string;
  notes?: string;
}

export default function AdminDashboard() {
  const { lang, formatPrice, activeSeason, setActiveSeason, seasonMultiplier } = useApp();
  const isRu = lang === 'ru';

  const [activeTab, setActiveTab] = useState<'properties' | 'bookings' | 'leads' | 'pricing'>('properties');
  const [propertiesList, setPropertiesList] = useState<Property[]>(MOCK_PROPERTIES);
  const [searchTerm, setSearchTerm] = useState('');

  // Корректный путь к логотипу для GitHub Pages и локальной разработки
  const basePath = process.env.NODE_ENV === 'production' ? '/sharmino_real_estate' : '';
  const logoSrc = `${basePath}/logo.png`;

  // 1. Ручная шахматка дат (11 дней)
  const [gridData, setGridData] = useState<Record<string, ('free' | 'booked' | 'blocked')[]>>({
    'prop-1': ['free', 'free', 'booked', 'booked', 'booked', 'free', 'free', 'free', 'free', 'free', 'free'],
    'prop-2': ['free', 'free', 'free', 'booked', 'booked', 'booked', 'free', 'free', 'free', 'free', 'free'],
    'prop-3': ['free', 'free', 'free', 'free', 'blocked', 'blocked', 'free', 'free', 'free', 'free', 'free'],
    'prop-4': ['free', 'free', 'free', 'free', 'free', 'free', 'booked', 'booked', 'booked', 'free', 'free'],
  });

  const toggleGridCell = (propId: string, dayIdx: number) => {
    setGridData(prev => {
      const current = [...(prev[propId] || Array(11).fill('free'))];
      const nextState = current[dayIdx] === 'free' ? 'booked' : current[dayIdx] === 'booked' ? 'blocked' : 'free';
      current[dayIdx] = nextState;
      return { ...prev, [propId]: current };
    });
  };

  // 2. Модалки объектов
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Partial<Property> | null>(null);

  // 3. Лиды
  const [leads, setLeads] = useState<Lead[]>([
    { id: '#REQ-2026-01', name: 'Александр Воронов', phone: '+7 (911) 123-45-67', email: 'alex@example.com', propTitle: isRu ? 'Премиум-вилла в Сахль Хашиш' : 'Luxury Villa in Sahl Hasheesh', dates: isRu ? '10 Ноя - 20 Ноя' : '10 Nov - 20 Nov', status: 'new', amount: '$3,600', notes: 'Запросил ранний заезд' },
    { id: '#REQ-2026-02', name: 'Елена Михайлова', phone: '+20 101 234 5678', email: 'elena@example.com', propTitle: isRu ? 'Студия в Хадаба посуточно' : 'Hadaba Studio Short-term', dates: isRu ? '01 Дек - 15 Дек' : '01 Dec - 15 Dec', status: 'in_progress', amount: '$1,350', notes: 'Уточняет детскую кроватку' },
    { id: '#REQ-2026-03', name: 'Michael Brown', phone: '+44 7700 900077', email: 'mbrown@uk.co', propTitle: isRu ? 'Пентхаус Шаркс Бей' : 'Penthouse Sharks Bay', dates: isRu ? 'Долгосрок (1 год)' : 'Long-term (1 Year)', status: 'confirmed', amount: '$18,000', notes: 'Депозит получен' },
  ]);

  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedVoucherLead, setSelectedVoucherLead] = useState<Lead | null>(null);

  const filteredProps = propertiesList.filter(p => 
    (p.title[lang] || p.title.ru).toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingProperty({
      id: `prop-${Date.now()}`,
      title: { ru: '', en: '' },
      description: { ru: '', en: '' },
      type: 'apartment',
      operations: ['daily'],
      operation: 'daily',
      district: 'sahl_hasheesh',
      address: '',
      price: { baseEgp: 5000 },
      details: {
        bedrooms: 2,
        bathrooms: 1,
        areaSqM: 80,
        seaView: true,
        pool: true,
        furnished: true,
        distanceToBeachMeters: 200
      },
      location: { lat: 27.049, lng: 33.888 },
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'],
      panoramaUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2500&q=80',
      isVip: false,
      availableFromDate: ''
    });
    setIsModalOpen(true);
  };

  const handleSaveProperty = () => {
    if (!editingProperty?.title?.ru) return;
    const exists = propertiesList.some(p => p.id === editingProperty.id);
    if (exists) {
      setPropertiesList(prev => prev.map(p => p.id === editingProperty.id ? (editingProperty as Property) : p));
    } else {
      setPropertiesList(prev => [editingProperty as Property, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteProperty = (id: string) => {
    if (confirm(isRu ? 'Удалить объект из системы?' : 'Delete property from system?')) {
      setPropertiesList(prev => prev.filter(p => p.id !== id));
      setIsModalOpen(false);
    }
  };

  const handleOpenAddLead = () => {
    setEditingLead({
      id: `#REQ-2026-0${leads.length + 1}`,
      name: '',
      phone: '',
      email: '',
      propTitle: propertiesList[0]?.title[lang] || propertiesList[0]?.title.ru || 'New Property',
      dates: isRu ? '01 Ноя - 07 Ноя' : '01 Nov - 07 Nov',
      status: 'new',
      amount: '$1,000',
      notes: ''
    });
    setIsLeadModalOpen(true);
  };

  const handleSaveLead = () => {
    if (!editingLead?.name) return;
    const exists = leads.some(l => l.id === editingLead.id);
    if (exists) {
      setLeads(prev => prev.map(l => l.id === editingLead.id ? editingLead : l));
    } else {
      setLeads(prev => [editingLead, ...prev]);
    }
    setIsLeadModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row w-full animate-in fade-in duration-500">
      
      {/* 1. Верхний бар для мобилок */}
      <div className="lg:hidden sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={logoSrc} 
            alt="SHARMINO Logo" 
            className="h-8 w-auto object-contain" 
          />
          <div>
            <div className="text-sm font-black text-white leading-none">
              SHARMINO<span className="text-amber-400">.</span>
            </div>
            <div className="text-[9px] text-teal-400 font-bold uppercase tracking-wider">
              {isRu ? 'Панель управления' : 'Control Panel'}
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center space-x-1.5 bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
          <span>{isRu ? 'На сайт' : 'To Website'}</span>
        </Link>
      </div>

      {/* 2. Мобильная панель табов */}
      <div className="lg:hidden bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 py-2 overflow-x-auto flex space-x-2 sticky top-[57px] z-30 scrollbar-none">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'properties' ? 'bg-teal-600 text-white' : 'bg-slate-950 text-slate-400'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>{isRu ? 'Объекты' : 'Properties'} ({propertiesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'bookings' ? 'bg-teal-600 text-white' : 'bg-slate-950 text-slate-400'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>{isRu ? 'Шахматка' : 'Occupancy'}</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'leads' ? 'bg-teal-600 text-white' : 'bg-slate-950 text-slate-400'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>CRM ({leads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'pricing' ? 'bg-teal-600 text-white' : 'bg-slate-950 text-slate-400'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{isRu ? 'Сезоны' : 'Seasons'}</span>
        </button>
      </div>

      {/* 3. Десктопный сайдбар */}
      <aside className="hidden lg:flex w-72 bg-slate-900 border-r border-slate-800/80 p-6 flex-col justify-between flex-shrink-0 min-h-screen">
        <div className="space-y-8">
          <div className="flex items-center space-x-3.5">
            <img 
              src={logoSrc} 
              alt="SHARMINO Logo" 
              className="h-9 w-auto object-contain flex-shrink-0" 
            />
            <div className="min-w-0">
              <span className="text-[9px] text-amber-400 font-bold uppercase tracking-widest block leading-tight">
                {isRu ? 'Панель управления' : 'Control Panel'}
              </span>
              <h2 className="text-xl font-black text-white tracking-wider leading-tight truncate">
                SHARMINO<span className="text-teal-400">.CRM</span>
              </h2>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('properties')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'properties' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Building className="w-4 h-4 flex-shrink-0" />
              <span>{isRu ? `База объектов (${propertiesList.length})` : `Property Database (${propertiesList.length})`}</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'bookings' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <CalendarIcon className="w-4 h-4 flex-shrink-0" />
              <span>{isRu ? 'Шахматка / Календарь' : 'Calendar & Occupancy'}</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'leads' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>{isRu ? `CRM Канбан (${leads.length})` : `CRM Kanban (${leads.length})`}</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'pricing' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4 flex-shrink-0" />
              <span>
                {isRu ? 'Сезоны & Цены' : 'Seasons & Pricing'}{' '}
                {seasonMultiplier > 1 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-amber-400 text-slate-950 font-black rounded text-[9px]">
                    +{Math.round((seasonMultiplier - 1) * 100)}%
                  </span>
                )}
              </span>
            </button>
          </nav>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border border-slate-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
            <span>{isRu ? 'Вернуться на сайт' : 'Back to Website'}</span>
          </Link>
          <div className="text-[10px] text-slate-500 font-mono text-center">
            SHARMINO v4.5 Pro CRM
          </div>
        </div>
      </aside>

      {/* 4. Основной рабочий блок */}
      <main className="flex-1 min-w-0 p-5 sm:p-7 lg:p-9 overflow-y-auto space-y-6">
        
        {/* ВКЛАДКА 1: ОБЪЕКТЫ */}
        {activeTab === 'properties' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-slate-800/80">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {isRu ? 'База недвижимости' : 'Property Database'}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  {isRu ? 'Управление объектами, ценами и статусами' : 'Manage properties, pricing and availability statuses'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder={isRu ? 'Поиск объекта...' : 'Search property...'}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 pl-9 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  onClick={handleOpenAddModal}
                  className="cursor-pointer flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isRu ? 'Добавить объект' : 'Add Property'}</span>
                </button>
              </div>
            </div>

            {/* Мобильный вид карточками */}
            <div className="grid grid-cols-1 gap-4 sm:hidden">
              {filteredProps.map((prop) => (
                <div key={prop.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-md">
                  <div className="flex items-center space-x-3">
                    <img src={prop.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover border border-slate-800" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{prop.title[lang] || prop.title.ru}</div>
                      <div className="text-[11px] text-slate-400">{prop.district.replace('_', ' ')}</div>
                      <div className="text-sm font-black text-amber-400 font-mono mt-0.5">{formatPrice(prop.price.baseEgp)}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    {prop.availableFromDate ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {isRu ? `Занято до ${prop.availableFromDate}` : `Occupied until ${prop.availableFromDate}`}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {isRu ? 'Свободен' : 'Available'}
                      </span>
                    )}

                    <button
                      onClick={() => { setEditingProperty(prop); setIsModalOpen(true); }}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-teal-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isRu ? 'Редактировать' : 'Edit'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Десктопная таблица */}
            <div className="hidden sm:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">{isRu ? 'Объект' : 'Property'}</th>
                    <th className="p-4">{isRu ? 'Район' : 'District'}</th>
                    <th className="p-4">{isRu ? '3D-Тур' : '3D Tour'}</th>
                    <th className="p-4">{isRu ? 'Цена' : 'Price'}</th>
                    <th className="p-4">{isRu ? 'Статус' : 'Status'}</th>
                    <th className="p-4 text-center">{isRu ? 'Действия' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProps.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-bold text-white flex items-center space-x-3">
                        <img src={prop.images[0]} alt="" className="w-11 h-11 rounded-xl object-cover border border-slate-800" />
                        <div>
                          <div className="text-sm">{prop.title[lang] || prop.title.ru}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{prop.address}</div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-400">{prop.district.replace('_', ' ')}</td>
                      <td className="p-4">
                        {prop.panoramaUrl ? (
                          <span className="text-emerald-400 font-bold flex items-center space-x-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>{isRu ? 'Есть 360°' : '360° Tour'}</span>
                          </span>
                        ) : (
                          <span className="text-slate-600">{isRu ? 'Нет' : 'None'}</span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-amber-400 font-bold text-sm">{formatPrice(prop.price.baseEgp)}</td>
                      <td className="p-4">
                        {prop.availableFromDate ? (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {isRu ? `Занято до ${prop.availableFromDate}` : `Occupied until ${prop.availableFromDate}`}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {isRu ? 'Свободен' : 'Available'}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => { setEditingProperty(prop); setIsModalOpen(true); }}
                          className="px-4 py-2 bg-slate-800 hover:bg-teal-600 text-slate-200 hover:text-white rounded-xl transition cursor-pointer font-bold inline-flex items-center space-x-1.5 shadow-md"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isRu ? 'Редактировать' : 'Edit'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ВКЛАДКА 2: ШАХМАТКА */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {isRu ? 'Шахматка Бронирований' : 'Booking Calendar & Occupancy'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {isRu ? 'Кликайте по ячейкам для смены статуса (Свободно / Занято / Блок)' : 'Click cells to toggle reservation status (Free / Booked / Blocked)'}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-x-auto shadow-xl">
              <div className="min-w-[850px]">
                <div className="grid grid-cols-12 gap-2 text-center font-bold text-xs text-slate-400 pb-3 border-b border-slate-800">
                  <div className="text-left pl-2 text-white">{isRu ? 'Объект' : 'Property'}</div>
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div key={i} className="bg-slate-950 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                      {i + 1} {isRu ? 'Ноя' : 'Nov'}
                    </div>
                  ))}
                </div>

                {propertiesList.map((p) => {
                  const pGrid = gridData[p.id] || Array(11).fill('free');
                  return (
                    <div key={p.id} className="grid grid-cols-12 gap-2 items-center py-3 border-b border-slate-800/50 text-xs">
                      <div className="font-bold text-white truncate pr-2" title={p.title[lang] || p.title.ru}>
                        {p.title[lang] || p.title.ru}
                      </div>
                      <div className="col-span-11 grid grid-cols-11 gap-2">
                        {pGrid.map((status, dayIdx) => (
                          <button
                            key={dayIdx}
                            onClick={() => toggleGridCell(p.id, dayIdx)}
                            className={`h-10 rounded-xl font-bold text-[10px] transition-all duration-200 cursor-pointer flex items-center justify-center border shadow-sm active:scale-95 ${
                              status === 'free'
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                : status === 'booked'
                                ? 'bg-rose-500/25 border-rose-500/50 text-rose-300'
                                : 'bg-amber-500/25 border-amber-500/50 text-amber-300'
                            }`}
                          >
                            {status === 'free' && (isRu ? 'Свободно' : 'Free')}
                            {status === 'booked' && (isRu ? 'Занято' : 'Booked')}
                            {status === 'blocked' && (isRu ? 'Блок' : 'Block')}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ВКЛАДКА 3: CRM КАНБАН */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {isRu ? 'CRM Заявки & Клиенты' : 'CRM Leads & Clients'}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRu ? 'Лиды и ваучеры бронирования' : 'Lead pipeline and booking voucher generation'}
                </p>
              </div>

              <button
                onClick={handleOpenAddLead}
                className="w-full sm:w-auto cursor-pointer flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition"
              >
                <Plus className="w-4 h-4" />
                <span>{isRu ? '+ Новая заявка' : '+ New Lead'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Новые */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase text-amber-400 tracking-wider pb-2 border-b border-slate-800">
                  <span>{isRu ? 'Новые Заявки' : 'New Leads'}</span>
                  <span className="px-2 py-0.5 bg-amber-500/20 rounded-md">{leads.filter(l => l.status === 'new').length}</span>
                </div>
                {leads.filter(l => l.status === 'new').map(lead => (
                  <div key={lead.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold rounded">{lead.id}</span>
                      <button onClick={() => { setEditingLead(lead); setIsLeadModalOpen(true); }} className="text-slate-400 hover:text-white p-1 rounded cursor-pointer">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{lead.name}</div>
                      <div className="text-xs text-slate-400">{lead.phone}</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl text-xs space-y-1">
                      <div className="text-teal-400 font-bold truncate">{lead.propTitle}</div>
                      <div className="text-[11px] text-slate-400">{lead.dates} • <span className="text-amber-400 font-bold">{lead.amount}</span></div>
                    </div>
                    <div className="flex space-x-2 pt-1">
                      <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-[11px] font-bold text-center flex items-center justify-center space-x-1 cursor-pointer">
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                      <button onClick={() => setSelectedVoucherLead(lead)} className="py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-[11px] font-bold cursor-pointer transition">
                        {isRu ? 'Ваучер' : 'Voucher'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* В работе */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase text-sky-400 tracking-wider pb-2 border-b border-slate-800">
                  <span>{isRu ? 'В работе' : 'In Progress'}</span>
                  <span className="px-2 py-0.5 bg-sky-500/20 rounded-md">{leads.filter(l => l.status === 'in_progress').length}</span>
                </div>
                {leads.filter(l => l.status === 'in_progress').map(lead => (
                  <div key={lead.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 text-[10px] font-mono font-bold rounded">{lead.id}</span>
                      <button onClick={() => { setEditingLead(lead); setIsLeadModalOpen(true); }} className="text-slate-400 hover:text-white p-1 rounded cursor-pointer">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{lead.name}</div>
                      <div className="text-xs text-slate-400">{lead.phone}</div>
                    </div>
                    <button onClick={() => setSelectedVoucherLead(lead)} className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isRu ? 'Сформировать Ваучер' : 'Generate Voucher'}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Оплачено */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase text-emerald-400 tracking-wider pb-2 border-b border-slate-800">
                  <span>{isRu ? 'Оплачено' : 'Confirmed / Paid'}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 rounded-md">{leads.filter(l => l.status === 'confirmed').length}</span>
                </div>
                {leads.filter(l => l.status === 'confirmed').map(lead => (
                  <div key={lead.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold rounded">{lead.id}</span>
                      <button onClick={() => { setEditingLead(lead); setIsLeadModalOpen(true); }} className="text-slate-400 hover:text-white p-1 rounded cursor-pointer">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div>
                      <div className="font-black text-white text-sm">{lead.name}</div>
                      <div className="text-xs text-slate-400">{lead.phone}</div>
                    </div>
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-[10px] font-bold text-center flex items-center justify-center space-x-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{isRu ? '✓ Заезд подтвержден' : '✓ Check-in Confirmed'}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ВКЛАДКА 4: СЕЗОНЫ */}
        {activeTab === 'pricing' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {isRu ? 'Контроллер сезонов' : 'Seasonal Pricing Controller'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {isRu ? 'Цены на всем сайте пересчитываются мгновенно в реальном времени' : 'All property rates recalculate instantly across the platform in real time'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div 
                onClick={() => setActiveSeason('offseason')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                  activeSeason === 'offseason'
                    ? 'bg-slate-900 border-teal-500 shadow-xl'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                <div className="text-sm font-black text-white">{isRu ? 'Межсезонье (1.0x)' : 'Off-Season (1.0x)'}</div>
                <p className="text-xs text-slate-400">{isRu ? 'Базовая стоимость без наценок' : 'Standard base rate without surcharges'}</p>
                <button className={`w-full py-2.5 rounded-xl font-bold text-xs ${
                  activeSeason === 'offseason' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {activeSeason === 'offseason' ? (isRu ? 'Активен сейчас' : 'Active Now') : (isRu ? 'Включить' : 'Activate')}
                </button>
              </div>

              <div 
                onClick={() => setActiveSeason('winter')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                  activeSeason === 'winter'
                    ? 'bg-slate-900 border-amber-500 shadow-xl'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                <div className="text-sm font-black text-white">{isRu ? 'Зимний сезон (+25%)' : 'Winter High Season (+25%)'}</div>
                <p className="text-xs text-slate-400">{isRu ? 'Повышенный спрос (Нов - Апр)' : 'Peak travel period (Nov - Apr)'}</p>
                <button className={`w-full py-2.5 rounded-xl font-bold text-xs ${
                  activeSeason === 'winter' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                }`}>
                  {activeSeason === 'winter' ? (isRu ? 'Активен сейчас' : 'Active Now') : (isRu ? 'Включить (+25%)' : 'Activate (+25%)')}
                </button>
              </div>

              <div 
                onClick={() => setActiveSeason('newyear')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                  activeSeason === 'newyear'
                    ? 'bg-slate-900 border-rose-500 shadow-xl'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                <div className="text-sm font-black text-white">{isRu ? 'Новогодний Пик (+50%)' : 'New Year Peak (+50%)'}</div>
                <p className="text-xs text-slate-400">{isRu ? 'Максимальные цены на праздники' : 'Maximum peak holiday rates'}</p>
                <button className={`w-full py-2.5 rounded-xl font-bold text-xs ${
                  activeSeason === 'newyear' ? 'bg-rose-600 text-white font-black' : 'bg-slate-800 text-slate-400'
                }`}>
                  {activeSeason === 'newyear' ? (isRu ? 'Активен сейчас' : 'Active Now') : (isRu ? 'Включить (+50%)' : 'Activate (+50%)')}
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* 5. МОДАЛКА ОБЪЕКТА */}
      {isModalOpen && editingProperty && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[92vh]">
            
            <div className="px-5 py-4 bg-slate-950 text-white flex justify-between items-center border-b border-slate-800">
              <h3 className="font-bold text-sm sm:text-base">
                {editingProperty.id 
                  ? (isRu ? 'Редактировать объект' : 'Edit Property') 
                  : (isRu ? 'Добавить объект' : 'Add Property')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">{isRu ? 'Название (RU)' : 'Title (RU)'}</label>
                  <input type="text" value={editingProperty.title?.ru || ''} onChange={e => setEditingProperty({ ...editingProperty, title: { ...editingProperty.title!, ru: e.target.value } })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-teal-500" />
                </div>
                <div>
                  <label className="font-bold block mb-1">{isRu ? 'Название (EN)' : 'Title (EN)'}</label>
                  <input type="text" value={editingProperty.title?.en || ''} onChange={e => setEditingProperty({ ...editingProperty, title: { ...editingProperty.title!, en: e.target.value } })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-teal-500" />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">{isRu ? 'Описание (RU)' : 'Description (RU)'}</label>
                <textarea rows={2} value={editingProperty.description?.ru || ''} onChange={e => setEditingProperty({ ...editingProperty, description: { ...editingProperty.description!, ru: e.target.value } })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-teal-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold block mb-1">{isRu ? 'Тип' : 'Type'}</label>
                  <select value={editingProperty.type} onChange={e => setEditingProperty({ ...editingProperty, type: e.target.value as PropertyType })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none">
                    <option value="apartment">{isRu ? 'Апартаменты' : 'Apartment'}</option>
                    <option value="villa">{isRu ? 'Вилла' : 'Villa'}</option>
                    <option value="penthouse">{isRu ? 'Пентхаус' : 'Penthouse'}</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">{isRu ? 'Статус' : 'Deal'}</label>
                  <select value={editingProperty.operation} onChange={e => setEditingProperty({ ...editingProperty, operation: e.target.value as OperationType })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none">
                    <option value="daily">{isRu ? 'Посуточно' : 'Short-term'}</option>
                    <option value="sale">{isRu ? 'Продажа' : 'For Sale'}</option>
                    <option value="long_term">{isRu ? 'Долгосрок' : 'Long-term'}</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">{isRu ? 'Район' : 'District'}</label>
                  <select value={editingProperty.district} onChange={e => setEditingProperty({ ...editingProperty, district: e.target.value as any })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none">
                    <option value="sahl_hasheesh">{isRu ? 'Сахль Хашиш' : 'Sahl Hasheesh'}</option>
                    <option value="naama_bay">{isRu ? 'Наама Бей' : 'Naama Bay'}</option>
                    <option value="sharks_bay">{isRu ? 'Шаркс Бей' : 'Sharks Bay'}</option>
                    <option value="hadaba">{isRu ? 'Хадаба' : 'Hadaba'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">{isRu ? 'Базовая цена (EGP)' : 'Base Price (EGP)'}</label>
                  <input type="number" value={editingProperty.price?.baseEgp || 0} onChange={e => setEditingProperty({ ...editingProperty, price: { baseEgp: Number(e.target.value) } })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none font-mono focus:border-teal-500" />
                </div>
                <div>
                  <label className="font-bold block mb-1">{isRu ? 'Освобождается с даты' : 'Available From Date'}</label>
                  <input type="date" value={editingProperty.availableFromDate || ''} onChange={e => setEditingProperty({ ...editingProperty, availableFromDate: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-teal-500" />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">{isRu ? '3D VR-Панорама URL' : '3D VR Panorama URL'}</label>
                <input type="text" value={editingProperty.panoramaUrl || ''} onChange={e => setEditingProperty({ ...editingProperty, panoramaUrl: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-teal-400 font-mono outline-none focus:border-teal-500" />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <button type="button" onClick={() => handleDeleteProperty(editingProperty.id!)} className="px-4 py-3 border border-rose-800/60 text-rose-400 hover:bg-rose-950/40 rounded-xl font-bold text-xs cursor-pointer transition">
                  {isRu ? 'Удалить' : 'Delete'}
                </button>
                <button type="button" onClick={handleSaveProperty} className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer transition">
                  {isRu ? 'Сохранить' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. МОДАЛКА ЛИДА */}
      {isLeadModalOpen && editingLead && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-5 space-y-4 shadow-2xl border border-slate-800 text-xs text-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm">{isRu ? 'Данные заявки' : 'Lead Information'}</h3>
                <span className="text-teal-400 font-mono text-[10px]">{editingLead.id}</span>
              </div>
              <button onClick={() => setIsLeadModalOpen(false)} className="p-1.5 hover:bg-slate-800 rounded-full transition cursor-pointer">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-400 block mb-1">{isRu ? 'ФИО Клиента' : 'Client Full Name'}</label>
                <input type="text" value={editingLead.name} onChange={e => setEditingLead({ ...editingLead, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white outline-none focus:border-teal-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">{isRu ? 'Телефон' : 'Phone Number'}</label>
                  <input type="text" value={editingLead.phone} onChange={e => setEditingLead({ ...editingLead, phone: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white outline-none focus:border-teal-500" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">{isRu ? 'Сумма' : 'Amount'}</label>
                  <input type="text" value={editingLead.amount} onChange={e => setEditingLead({ ...editingLead, amount: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white outline-none font-bold text-amber-400 focus:border-teal-500" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-400 block mb-1">{isRu ? 'Статус' : 'Pipeline Status'}</label>
                <select value={editingLead.status} onChange={e => setEditingLead({ ...editingLead, status: e.target.value as any })} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white outline-none">
                  <option value="new">{isRu ? 'Новая заявка' : 'New Lead'}</option>
                  <option value="in_progress">{isRu ? 'В работе' : 'In Progress'}</option>
                  <option value="confirmed">{isRu ? 'Подтверждено' : 'Confirmed'}</option>
                </select>
              </div>
            </div>

            <button onClick={handleSaveLead} className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg cursor-pointer transition">
              {isRu ? 'Сохранить' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* 7. МОДАЛКА ВАУЧЕРА */}
      {selectedVoucherLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button onClick={() => setSelectedVoucherLead(null)} className="absolute top-5 right-5 p-2 hover:bg-slate-100 rounded-full transition cursor-pointer">
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div className="text-center space-y-1 border-b border-slate-100 pb-3">
              <div className="text-xl font-black text-slate-900">SHARMINO ESTATE</div>
              <div className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                {isRu ? `Ваучер Бронирования ${selectedVoucherLead.id}` : `Booking Voucher ${selectedVoucherLead.id}`}
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">{isRu ? 'Гость:' : 'Guest:'}</span>
                <span className="font-bold">{selectedVoucherLead.name} ({selectedVoucherLead.phone})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">{isRu ? 'Объект:' : 'Property:'}</span>
                <span className="font-bold text-right max-w-[200px]">{selectedVoucherLead.propTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">{isRu ? 'Даты:' : 'Dates:'}</span>
                <span className="font-bold text-amber-600">{selectedVoucherLead.dates}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">{isRu ? 'Сумма к оплате:' : 'Total Amount:'}</span>
                <span className="font-black text-base text-slate-900">{selectedVoucherLead.amount}</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert(isRu ? `Ваучер ${selectedVoucherLead.id} скопирован!` : `Voucher ${selectedVoucherLead.id} copied!`);
                setSelectedVoucherLead(null);
              }}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs cursor-pointer transition"
            >
              {isRu ? 'Скопировать ваучер для отправки' : 'Copy Voucher to Clipboard'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}