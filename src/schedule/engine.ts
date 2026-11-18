import { chineseNewYear, maslenitsaStart } from '../astro/holidays';
import { moonPhasesBetween, type MoonPhase } from '../astro/moon';
import { seasonEventDate, type SeasonEvent } from '../astro/seasons';
import { CATALOG } from '../rituals/catalog';
import type { Ritual, Rule } from '../rituals/types';
import { addDays, fromDate, key, type LocalDate, toDate, weekday } from './localDate';

export interface ScheduleProfile {
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
  season: Record<SeasonEvent, Set<string>>;
  chineseNewYear: Set<string>;
  maslenitsa: Set<string>;
}

function collectEventDays(start: LocalDate, end: LocalDate): EventDays {
  const from = toDate(addDays(start, -1));
  const to = toDate(addDays(end, 2));
  const moon: EventDays['moon'] = { new: new Set(), firstQuarter: new Set(), full: new Set(), lastQuarter: new Set() };
  for (const e of moonPhasesBetween(from, to)) moon[e.phase].add(key(fromDate(e.date)));

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
  return { moon, season, chineseNewYear: chinese, maslenitsa };
}

function matches(rule: Rule, day: LocalDate, events: EventDays): boolean {
  const k = key(day);
  switch (rule.kind) {
    case 'weekly':
      return weekday(day) === rule.weekday;
    case 'monthDay':
      return day.day === rule.day;
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
  }
}

/** All ritual occurrences on `days` consecutive days starting at `start`, sorted by time. */
export function occurrences(
  start: LocalDate,
  days: number,
  profile: ScheduleProfile,
  catalog: Ritual[] = CATALOG,
): Occurrence[] {
  if (days <= 0) return [];
  const events = collectEventDays(start, addDays(start, days - 1));
  const result: Occurrence[] = [];
  for (let i = 0; i < days; i++) {
    const day = addDays(start, i);
    for (const ritual of catalog) {
      if (!matches(ritual.rule, day, events)) continue;
      const time = profile.timeOverrides?.[ritual.id] ?? ritual.time;
      result.push({ ritual, date: day, at: toDate(day, time) });
    }
  }
  return result.sort((a, b) => a.at.getTime() - b.at.getTime());
}
