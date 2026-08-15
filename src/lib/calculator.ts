export interface CalculationResult {
  nights: number;
  baseTotal: number;
  seasonalAdjustment: number;
  cleaningFee: number;
  deposit: number;
  discount: number;
  grandTotal: number;
}

export function calculateDailyRentalPrice(
  checkIn: Date,
  checkOut: Date,
  pricePerNightEgp: number,
  cleaningFee = 1500,
  deposit = 5000,
  promoCode?: string
): CalculationResult {
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const baseTotal = nights * pricePerNightEgp;
  let seasonalAdjustment = 0;

  // Сезонный коэффициент: с ноября по апрель (+20%)
  const month = checkIn.getMonth();
  if (month >= 10 || month <= 3) {
    seasonalAdjustment = baseTotal * 0.2;
  }

  let discount = 0;
  if (promoCode?.toUpperCase() === 'SHARM2026') {
    discount = (baseTotal + seasonalAdjustment) * 0.1;
  }

  const grandTotal = baseTotal + seasonalAdjustment + cleaningFee - discount;

  return {
    nights,
    baseTotal,
    seasonalAdjustment,
    cleaningFee,
    deposit,
    discount,
    grandTotal,
  };
}