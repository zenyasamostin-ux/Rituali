// Moon phases and eclipses after Jean Meeus, "Astronomical Algorithms", ch. 49 and 54.
// The small planetary terms are omitted: the error stays within a couple of minutes,
// which is plenty for picking the day of a ritual.
import { cosDeg, jdToDate, sinDeg } from './julian';

export type MoonPhase = 'new' | 'firstQuarter' | 'full' | 'lastQuarter';

export interface MoonEvent {
  phase: MoonPhase;
  date: Date;
}

export type EclipseKind = 'solar' | 'lunar';

export interface Eclipse {
  kind: EclipseKind;
  date: Date;
}

const PHASE_OFFSET: Record<MoonPhase, number> = {
  new: 0,
  firstQuarter: 0.25,
  full: 0.5,
  lastQuarter: 0.75,
};

interface Args {
  T: number;
  E: number;
  M: number;
  Mp: number;
  F: number;
  omega: number;
}

function args(k: number): Args {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;
  return {
    T,
    E: 1 - 0.002516 * T - 0.0000074 * T2,
    M: 2.5534 + 29.1053567 * k - 0.0000014 * T2 - 0.00000011 * T3,
    Mp: 201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4,
    F: 160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4,
    omega: 124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3,
  };
}

function meanPhaseJde(k: number, T: number): number {
  const T2 = T * T;
  return (
    2451550.09766 +
    29.530588861 * k +
    0.00015437 * T2 -
    0.00000015 * T2 * T +
    0.00000000073 * T2 * T2
  );
}

function phaseJde(k: number, phase: MoonPhase): number {
  const { T, E, M, Mp, F, omega } = args(k);
  let jde = meanPhaseJde(k, T);

  if (phase === 'new' || phase === 'full') {
    const isNew = phase === 'new';
    jde +=
      (isNew ? -0.4072 : -0.40614) * sinDeg(Mp) +
      (isNew ? 0.17241 : 0.17302) * E * sinDeg(M) +
      (isNew ? 0.01608 : 0.01614) * sinDeg(2 * Mp) +
      (isNew ? 0.01039 : 0.01043) * sinDeg(2 * F) +
      (isNew ? 0.00739 : 0.00734) * E * sinDeg(Mp - M) -
      (isNew ? 0.00514 : 0.00515) * E * sinDeg(Mp + M) +
      (isNew ? 0.00208 : 0.00209) * E * E * sinDeg(2 * M) -
      0.00111 * sinDeg(Mp - 2 * F) -
      0.00057 * sinDeg(Mp + 2 * F) +
      0.00056 * E * sinDeg(2 * Mp + M) -
      0.00042 * sinDeg(3 * Mp) +
      0.00042 * E * sinDeg(M + 2 * F) +
      0.00038 * E * sinDeg(M - 2 * F) -
      0.00024 * E * sinDeg(2 * Mp - M) -
      0.00017 * sinDeg(omega);
  } else {
    jde +=
      -0.62801 * sinDeg(Mp) +
      0.17172 * E * sinDeg(M) -
      0.01183 * E * sinDeg(Mp + M) +
      0.00862 * sinDeg(2 * Mp) +
      0.00804 * sinDeg(2 * F) +
      0.00454 * E * sinDeg(Mp - M) +
      0.00204 * E * E * sinDeg(2 * M) -
      0.0018 * sinDeg(Mp - 2 * F) -
      0.0007 * sinDeg(Mp + 2 * F) -
      0.0004 * sinDeg(3 * Mp) -
      0.00034 * E * sinDeg(2 * Mp - M) +
      0.00032 * E * sinDeg(M + 2 * F) +
      0.00032 * E * sinDeg(M - 2 * F) -
      0.00028 * E * E * sinDeg(Mp + 2 * M) +
      0.00027 * E * sinDeg(2 * Mp + M) -
      0.00017 * sinDeg(omega);
    const W =
      0.00306 -
      0.00038 * E * cosDeg(M) +
      0.00026 * cosDeg(Mp) -
      0.00002 * cosDeg(Mp - M) +
      0.00002 * cosDeg(Mp + M) +
      0.00002 * cosDeg(2 * F);
    jde += phase === 'firstQuarter' ? W : -W;
  }
  return jde;
}

/** Lunation number k of the new moon at or just before `date`. */
function lunationAt(date: Date): number {
  const years = date.getUTCFullYear() + date.getUTCMonth() / 12 - 2000;
  return Math.floor(years * 12.3685);
}

interface PhaseWithK extends MoonEvent {
  k: number;
}

function phasesBetween(from: Date, to: Date): PhaseWithK[] {
  const events: PhaseWithK[] = [];
  const phases = Object.keys(PHASE_OFFSET) as MoonPhase[];
  for (let n = lunationAt(from) - 1; ; n++) {
    let past = false;
    for (const phase of phases) {
      const k = n + PHASE_OFFSET[phase];
      const date = jdToDate(phaseJde(k, phase));
      if (date >= to) past = true;
      else if (date >= from) events.push({ phase, date, k });
    }
    if (past) break;
  }
  return events;
}

/** All main moon phases whose instant falls in [from, to). */
export function moonPhasesBetween(from: Date, to: Date): MoonEvent[] {
  return phasesBetween(from, to).map(({ phase, date }) => ({ phase, date }));
}

/**
 * Solar eclipses of any type and umbral lunar eclipses (partial or total).
 * Penumbral lunar eclipses are skipped: they are barely visible.
 */
export function eclipsesBetween(from: Date, to: Date): Eclipse[] {
  const result: Eclipse[] = [];
  for (const event of phasesBetween(from, to)) {
    if (event.phase !== 'new' && event.phase !== 'full') continue;
    const { E, M, Mp, F, omega } = args(event.k);
    // Too far from a lunar node: no eclipse possible.
    if (Math.abs(sinDeg(F)) > 0.36) continue;

    const F1 = F - 0.02665 * sinDeg(omega);
    const P =
      0.207 * E * sinDeg(M) +
      0.0024 * E * sinDeg(2 * M) -
      0.0392 * sinDeg(Mp) +
      0.0116 * sinDeg(2 * Mp) -
      0.0073 * E * sinDeg(Mp + M) +
      0.0067 * E * sinDeg(Mp - M) +
      0.0118 * sinDeg(2 * F1);
    const Q =
      5.2207 -
      0.0048 * E * cosDeg(M) +
      0.002 * E * cosDeg(2 * M) -
      0.3299 * cosDeg(Mp) -
      0.006 * E * cosDeg(Mp + M) +
      0.0041 * E * cosDeg(Mp - M);
    const W = Math.abs(cosDeg(F1));
    const gamma = Math.abs((P * cosDeg(F1) + Q * sinDeg(F1)) * (1 - 0.0048 * W));
    const u =
      0.0059 +
      0.0046 * E * cosDeg(M) -
      0.0182 * cosDeg(Mp) +
      0.0004 * cosDeg(2 * Mp) -
      0.0005 * cosDeg(M + Mp);

    if (event.phase === 'new' && gamma < 1.5433 + u) {
      result.push({ kind: 'solar', date: event.date });
    }
    if (event.phase === 'full' && (1.0128 - u - gamma) / 0.545 > 0) {
      result.push({ kind: 'lunar', date: event.date });
    }
  }
  return result;
}
