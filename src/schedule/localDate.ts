/** A calendar day in the user's time zone, without time. Month is 1–12. */
export interface LocalDate {
  year: number;
  month: number;
  day: number;
}

export function fromDate(date: Date): LocalDate {
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

export function toDate(d: LocalDate, time = '00:00'): Date {
  const [h, m] = time.split(':').map(Number);
  return new Date(d.year, d.month - 1, d.day, h, m);
}

export function addDays(d: LocalDate, days: number): LocalDate {
  // Noon avoids DST edges.
  return fromDate(new Date(d.year, d.month - 1, d.day + days, 12));
}

export function key(d: LocalDate): string {
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
}

export function parseKey(s: string): LocalDate {
  const [year, month, day] = s.split('-').map(Number);
  return { year, month, day };
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** ISO weekday: 1 = Monday … 7 = Sunday. */
export function weekday(d: LocalDate): number {
  const js = new Date(d.year, d.month - 1, d.day, 12).getDay();
  return js === 0 ? 7 : js;
}

export function daysBetween(a: LocalDate, b: LocalDate): number {
  const utcA = Date.UTC(a.year, a.month - 1, a.day);
  const utcB = Date.UTC(b.year, b.month - 1, b.day);
  return Math.round((utcB - utcA) / 86_400_000);
}
