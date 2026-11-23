// Promo week-end : -10 % le samedi et le dimanche, selon l'horloge du navigateur.

export const WEEKEND_DISCOUNT = 0.1;

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function computeTotals(subtotal: number, now: Date = new Date()) {
  const discount = isWeekend(now) ? round2(subtotal * WEEKEND_DISCOUNT) : 0;
  return { subtotal: round2(subtotal), discount, total: round2(subtotal - discount) };
}

const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

export function formatPrice(value: number): string {
  return euro.format(value);
}
