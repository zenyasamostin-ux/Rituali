const UNIX_EPOCH_JD = 2440587.5;
const MS_PER_DAY = 86_400_000;

export const DEG = Math.PI / 180;

export function jdToDate(jd: number): Date {
  return new Date((jd - UNIX_EPOCH_JD) * MS_PER_DAY);
}

export function dateToJd(date: Date): number {
  return date.getTime() / MS_PER_DAY + UNIX_EPOCH_JD;
}

export function sinDeg(x: number): number {
  return Math.sin(x * DEG);
}

export function cosDeg(x: number): number {
  return Math.cos(x * DEG);
}
