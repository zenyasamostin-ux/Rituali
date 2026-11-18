import { occurrences, type Occurrence, type ScheduleProfile } from './engine';
import { addDays, daysBetween, type LocalDate } from './localDate';
import { completionKey } from './streak';

export interface HistoryEntry {
  occurrence: Occurrence;
  done: boolean;
}

/**
 * Rituals of the past days, newest first: from yesterday back to the start day
 * or `maxDays` days, whichever is closer. Today belongs to the today block.
 */
export function history(
  today: LocalDate,
  startDate: LocalDate,
  profile: ScheduleProfile,
  done: ReadonlySet<string>,
  maxDays = 30,
): HistoryEntry[] {
  const days = Math.min(maxDays, daysBetween(startDate, today));
  return occurrences(addDays(today, -days), days, profile)
    .map((occurrence) => ({
      occurrence,
      done: done.has(completionKey(occurrence.ritual.id, occurrence.date)),
    }))
    .reverse();
}
