// Equinoxes and solstices after Meeus, "Astronomical Algorithms", ch. 27 (valid 2000–3000).
import { cosDeg, jdToDate } from './julian';

export type SeasonEvent = 'marchEquinox' | 'juneSolstice' | 'septemberEquinox' | 'decemberSolstice';

const MEAN: Record<SeasonEvent, [number, number, number, number, number]> = {
  marchEquinox: [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057],
  juneSolstice: [2451716.56767, 365241.62603, 0.00325, 0.00888, -0.0003],
  septemberEquinox: [2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078],
  decemberSolstice: [2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032],
};

// [A, B, C] of the periodic terms, table 27.C.
const TERMS: [number, number, number][] = [
  [485, 324.96, 1934.136],
  [203, 337.23, 32964.467],
  [199, 342.08, 20.186],
  [182, 27.85, 445267.112],
  [156, 73.14, 45036.886],
  [136, 171.52, 22518.443],
  [77, 222.54, 65928.934],
  [74, 296.72, 3034.906],
  [70, 243.58, 9037.513],
  [58, 119.81, 33718.147],
  [52, 297.17, 150.678],
  [50, 21.02, 2281.226],
  [45, 247.54, 29929.562],
  [44, 325.15, 31555.956],
  [29, 60.93, 4443.417],
  [18, 155.12, 67555.328],
  [17, 288.79, 4562.452],
  [16, 198.04, 62894.029],
  [14, 199.76, 31436.921],
  [12, 95.39, 14577.848],
  [12, 287.11, 31931.756],
  [12, 320.81, 34777.259],
  [9, 227.73, 1222.114],
  [8, 15.45, 16859.074],
];

export function seasonEventDate(event: SeasonEvent, year: number): Date {
  const Y = (year - 2000) / 1000;
  const [a, b, c, d, e] = MEAN[event];
  const jde0 = a + b * Y + c * Y ** 2 + d * Y ** 3 + e * Y ** 4;
  const T = (jde0 - 2451545) / 36525;
  const W = 35999.373 * T - 2.47;
  const dLambda = 1 + 0.0334 * cosDeg(W) + 0.0007 * cosDeg(2 * W);
  const S = TERMS.reduce((sum, [A, B, C]) => sum + A * cosDeg(B + C * T), 0);
  return jdToDate(jde0 + (0.00001 * S) / dLambda);
}
