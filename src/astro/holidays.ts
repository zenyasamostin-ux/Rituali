import type { LocalDate } from '../schedule/localDate';

// The lunisolar rule has exceptions, so a table is safer than computing it.
const CHINESE_NEW_YEAR: Record<number, [number, number]> = {
  2026: [2, 17],
  2027: [2, 6],
  2028: [1, 26],
  2029: [2, 13],
  2030: [2, 3],
  2031: [1, 23],
  2032: [2, 11],
  2033: [1, 31],
  2034: [2, 19],
  2035: [2, 8],
};

export function chineseNewYear(year: number): LocalDate | undefined {
  const entry = CHINESE_NEW_YEAR[year];
  return entry && { year, month: entry[0], day: entry[1] };
}
