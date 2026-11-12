// Horario oficial de Rosario, independientemente del huso horario del servidor.
export const NIGHT_DISCOUNT_PERCENT = 15;
export function isBrookiesNight(date: Date = new Date()): boolean {
  const hour = Number(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', hourCycle: 'h23'
  }).format(date));
  return hour >= 21 || hour < 8;
}
export function nightUnitPrice(price: number): number {
  return Math.round(price * (100 - NIGHT_DISCOUNT_PERCENT) / 100);
}
