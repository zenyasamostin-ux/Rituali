import { occurrences, type ScheduleProfile } from './engine';
import { addDays, key, type LocalDate } from './localDate';

export function completionKey(ritualId: string, date: LocalDate): string {
  return `${ritualId}@${key(date)}`;
}

/**
 * Consecutive ritual days with at least one ritual done, counting back from today.
 * Days without a ritual do not break the streak; today counts only once something is done.
 */
export function streak(today: LocalDate, profile: ScheduleProfile, done: ReadonlySet<string>, maxDays = 366): number {
  const start = addDays(today, -(maxDays - 1));
  const byDay = new Map<string, string[]>();
  for (const o of occurrences(start, maxDays, profile)) {
    const list = byDay.get(key(o.date)) ?? [];
    list.push(completionKey(o.ritual.id, o.date));
    byDay.set(key(o.date), list);
  }

  let count = 0;
  for (let i = 0; i < maxDays; i++) {
    const day = addDays(today, -i);
    const scheduled = byDay.get(key(day));
    if (!scheduled) continue;
    if (scheduled.some((k) => done.has(k))) count++;
    else if (i > 0) break;
  }
  return count;
}
