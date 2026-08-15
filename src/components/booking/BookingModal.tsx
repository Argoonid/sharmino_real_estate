'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Property } from '@/types';
import { useApp } from '@/context/AppContext';
import { calculateDailyRentalPrice } from '@/lib/calculator';
import { sendTelegramNotification } from '@/lib/telegram';

interface BookingModalProps {
  property: Property | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ property, onClose }) => {
  const { formatPrice } = useApp();
  const [step, setStep] = useState<'dates' | 'details' | 'payment' | 'success'>('dates');

  const [checkIn, setCheckIn] = useState('2026-11-01');
  const [checkOut, setCheckOut] = useState('2026-11-07');
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!property) return null;

  const calc = calculateDailyRentalPrice(
    new Date(checkIn),
    new Date(checkOut),
    property.price.baseEgp,
    property.cleaningFeeEgp || 1500,
    property.depositEgp || 5000
  );

  const handleBooking = async () => {
    setIsProcessing(true);
    const msg = `
<b>🏨 Новое бронирование!</b>
<b>Объект:</b> ${property.title.ru}
<b>Даты:</b> ${checkIn} — ${checkOut} (${calc.nights} ночевок)
<b>Гостей:</b> ${guests}
<b>Имя:</b> ${guestName}
<b>Телефон:</b> ${guestPhone}
<b>Итого к оплате:</b> ${formatPrice(calc.grandTotal)}
    `;
    await sendTelegramNotification(msg);
    setIsProcessing(false);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <h3 className="font-bold text-base">Онлайн-бронирование</h3>
            <p className="text-teal-400 text-xs">{property.title.ru}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {step === 'dates' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Заезд</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Выезд</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>{formatPrice(property.price.baseEgp)} × {calc.nights} ночей</span>
                  <span className="font-bold">{formatPrice(calc.baseTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Уборка</span>
                  <span>{formatPrice(calc.cleaningFee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold text-sm text-slate-900">
                  <span>Итого:</span>
                  <span className="text-teal-600">{formatPrice(calc.grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => setStep('details')}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm"
              >
                Далее
              </button>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ФИО Гостя</label>
                <input
                  type="text"
                  placeholder="Георгий Рыжов"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Телефон / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="+7 (999) 000-00-00"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <button
                onClick={handleBooking}
                disabled={!guestName || !guestPhone || isProcessing}
                className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl text-sm shadow-lg"
              >
                {isProcessing ? 'Отправка...' : `Подтвердить и Оплатить ${formatPrice(calc.grandTotal)}`}
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-bold">Заявка принято!</h3>
              <p className="text-xs text-slate-500">
                Детали отправлены менеджеру. Мы свяжемся с вами в WhatsApp.
              </p>
              <button onClick={onClose} className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs">
                Закрыть
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};