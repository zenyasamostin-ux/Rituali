import { chineseNewYear, maslenitsaStart } from '../astro/holidays';
import { eclipsesBetween, moonPhasesBetween, type MoonPhase } from '../astro/moon';
import { seasonEventDate, type SeasonEvent } from '../astro/seasons';
import { CATALOG } from '../rituals/catalog';
import type { Ritual, Rule } from '../rituals/types';
import {
  addDays,
  daysBetween,
  daysInMonth,
  fromDate,
  key,
  type LocalDate,
  parseKey,
  toDate,
  weekday,
} from './localDate';

export interface ScheduleProfile {
  /** Any day of the first week A; the cycle counts from its Monday. */
  cycleStart: string;
  rhythm: 'daily' | 'everyOtherDay';
  payday?: number;
  billsDay?: number;
  birthday?: { month: number; day: number };
  /** Ritual id → HH:MM chosen by the user. */
  timeOverrides?: Record<string, string>;
}

export interface Occurrence {
  ritual: Ritual;
  date: LocalDate;
  /** Reminder instant. */
  at: Date;
}

/** Days of astronomical and movable events, as local date keys. */
interface EventDays {
  moon: Record<MoonPhase, Set<string>>;
  eclipse: Set<string>;
  season: Record<SeasonEvent, Set<string>>;
  chineseNewYear: Set<string>;
  maslenitsa: Set<string>;
}

function collectEventDays(start: LocalDate, end: LocalDate): EventDays {
  const from = toDate(addDays(start, -1));
  const to = toDate(addDays(end, 2));
  const moon: EventDays['moon'] = { new: new Set(), firstQuarter: new Set(), full: new Set(), lastQuarter: new Set() };
  for (const e of moonPhasesBetween(from, to)) moon[e.phase].add(key(fromDate(e.date)));

  const eclipse = new Set(eclipsesBetween(from, to).map((e) => key(fromDate(e.date))));

  const season: EventDays['season'] = {
    marchEquinox: new Set(),
    juneSolstice: new Set(),
    septemberEquinox: new Set(),
    decemberSolstice: new Set(),
  };
  const chinese = new Set<string>();
  const maslenitsa = new Set<string>();
  for (let year = start.year; year <= end.year; year++) {
    for (const event of Object.keys(season) as SeasonEvent[]) {
      season[event].add(key(fromDate(seasonEventDate(event, year))));
    }
    const cny = chineseNewYear(year);
    if (cny) chinese.add(key(cny));
    maslenitsa.add(key(maslenitsaStart(year)));
  }
  return { moon, eclipse, season, chineseNewYear: chinese, maslenitsa };
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function matches(rule: Rule, day: LocalDate, profile: ScheduleProfile, events: EventDays, cycleMonday: LocalDate): boolean {
  const k = key(day);
  switch (rule.kind) {
    case 'cycle': {
      const index = daysBetween(cycleMonday, day);
      if (profile.rhythm === 'everyOtherDay' && mod(index, 2) !== 0) return false;
      const week = mod(Math.floor(index / 7), 2) === 0 ? 'A' : 'B';
      return week === rule.week && weekday(day) === rule.weekday;
    }
    case 'monthDay':
      return day.day === rule.day;
    case 'lastDayOfMonth':
      return day.day === daysInMonth(day.year, day.month);
    case 'profileDay': {
      const wanted = profile[rule.field];
      if (!wanted) return false;
      // The 31st becomes the last day in shorter months.
      return day.day === Math.min(wanted, daysInMonth(day.year, day.month));
    }
    case 'moon':
      return events.moon[rule.phase].has(k);
    case 'season':
      return events.season[rule.event].has(k);
    case 'fixedDate':
      return day.month === rule.month && day.day === rule.day;
    case 'mirrorDate':
      return day.month === day.day;
    case 'movable':
      return events[rule.event].has(k);
    case 'eclipse':
      return events.eclipse.has(k);
    case 'birthday': {
      const b = profile.birthday;
      // 29 February falls on the 28th in other years.
      return !!b && day.month === b.month && day.day === Math.min(b.day, daysInMonth(day.year, day.month));
    }
  }
}

/** Monday of the week that contains `d`. */
function mondayOf(d: LocalDate): LocalDate {
  return addDays(d, 1 - weekday(d));
}

/** All ritual occurrences on `days` consecutive days starting at `start`, sorted by time. */
export function occurrences(
  start: LocalDate,
  days: number,
  profile: ScheduleProfile,
  catalog: Ritual[] = CATALOG,
): Occurrence[] {
  const end = addDays(start, days - 1);
  const events = collectEventDays(start, end);
  const cycleMonday = mondayOf(parseKey(profile.cycleStart));
  const result: Occurrence[] = [];
  for (let i = 0; i < days; i++) {
    const day = addDays(start, i);
    for (const ritual of catalog) {
      if (!matches(ritual.rule, day, profile, events, cycleMonday)) continue;
      const time = profile.timeOverrides?.[ritual.id] ?? ritual.time;
      result.push({ ritual, date: day, at: toDate(day, time) });
    }
  }
  return result.sort((a, b) => a.at.getTime() - b.at.getTime());
}
