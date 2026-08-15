'use client';

import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Property } from '@/types';
import { useApp } from '@/context/AppContext';
import { calculateDailyRentalPrice } from '@/lib/calculator';
import { sendTelegramNotification } from '@/lib/telegram';

interface BookingModalProps {
  property: Property | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ property, onClose }) => {
  const { formatPrice, lang } = useApp();
  const isRu = lang === 'ru';

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
<b>🏨 New Booking Request!</b>
<b>Property:</b> ${property.title[lang]}
<b>Dates:</b> ${checkIn} — ${checkOut} (${calc.nights} nights)
<b>Guests:</b> ${guests}
<b>Name:</b> ${guestName}
<b>Phone:</b> ${guestPhone}
<b>Total:</b> ${formatPrice(calc.grandTotal)}
    `;
    await sendTelegramNotification(msg);
    setIsProcessing(false);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <h3 className="font-bold text-base">{isRu ? 'Онлайн-бронирование' : 'Instant Booking'}</h3>
            <p className="text-teal-400 text-xs truncate max-w-[280px]">{property.title[lang]}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {step === 'dates' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{isRu ? 'Заезд' : 'Check-in'}</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{isRu ? 'Выезд' : 'Check-out'}</label>
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
                  <span>{formatPrice(property.price.baseEgp)} × {calc.nights} {isRu ? 'ночей' : 'nights'}</span>
                  <span className="font-bold">{formatPrice(calc.baseTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isRu ? 'Уборка' : 'Cleaning Fee'}</span>
                  <span>{formatPrice(calc.cleaningFee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold text-sm text-slate-900">
                  <span>{isRu ? 'Итого:' : 'Total:'}</span>
                  <span className="text-teal-600">{formatPrice(calc.grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => setStep('details')}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition cursor-pointer"
              >
                {isRu ? 'Далее' : 'Continue'}
              </button>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{isRu ? 'ФИО Гостя' : 'Full Name'}</label>
                <input
                  type="text"
                  placeholder={isRu ? 'Георгий Рыжов' : 'Alex Mercer'}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{isRu ? 'Телефон / WhatsApp' : 'Phone / WhatsApp'}</label>
                <input
                  type="tel"
                  placeholder="+20 (100) 000-00-00"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-teal-500"
                />
              </div>

              <button
                onClick={handleBooking}
                disabled={!guestName || !guestPhone || isProcessing}
                className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl text-sm shadow-lg disabled:opacity-50 transition cursor-pointer"
              >
                {isProcessing 
                  ? (isRu ? 'Отправка...' : 'Processing...') 
                  : (isRu ? `Подтвердить и Оплатить ${formatPrice(calc.grandTotal)}` : `Confirm & Pay ${formatPrice(calc.grandTotal)}`)}
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900">{isRu ? 'Заявка принята!' : 'Booking Confirmed!'}</h3>
              <p className="text-xs text-slate-500">
                {isRu 
                  ? 'Детали отправлены менеджеру. Мы свяжемся с вами в WhatsApp.' 
                  : 'Details sent to our manager. We will contact you via WhatsApp shortly.'}
              </p>
              <button onClick={onClose} className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer">
                {isRu ? 'Закрыть' : 'Close'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};