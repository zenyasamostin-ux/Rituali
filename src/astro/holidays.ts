import { addDays, LocalDate } from '../schedule/localDate';

/** Orthodox Easter (Gregorian calendar), Meeus' Julian algorithm. Valid 1900–2099. */
export function orthodoxEaster(year: number): LocalDate {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;
  // Julian to Gregorian: +13 days in the 20th and 21st centuries.
  return addDays({ year, month, day }, 13);
}

/** First day (Monday) of Maslenitsa week: 55 days before Orthodox Easter. */
export function maslenitsaStart(year: number): LocalDate {
  return addDays(orthodoxEaster(year), -55);
}

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
