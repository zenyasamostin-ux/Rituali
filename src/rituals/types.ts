import type { MoonPhase } from '../astro/moon';
import type { SeasonEvent } from '../astro/seasons';

export type Tier = 'free' | 'premium';

export type Category = 'weekly' | 'monthly' | 'lunar' | 'seasonal' | 'holiday' | 'personal';

/** When a ritual happens. Times live on the ritual, rules only pick the day. */
export type Rule =
  /** Two alternating weeks A and B; weekday is ISO (1 = Monday). */
  | { kind: 'cycle'; week: 'A' | 'B'; weekday: number }
  | { kind: 'monthDay'; day: number }
  | { kind: 'lastDayOfMonth' }
  /** A day of the month the user sets in their profile. */
  | { kind: 'profileDay'; field: 'payday' | 'billsDay' }
  | { kind: 'moon'; phase: MoonPhase }
  | { kind: 'season'; event: SeasonEvent }
  | { kind: 'fixedDate'; month: number; day: number }
  /** 01.01, 02.02 … 12.12 */
  | { kind: 'mirrorDate' }
  | { kind: 'movable'; event: 'chineseNewYear' | 'maslenitsa' }
  | { kind: 'eclipse' }
  | { kind: 'birthday' };

export interface Ritual {
  id: string;
  tier: Tier;
  category: Category;
  emoji: string;
  rule: Rule;
  /** Default reminder time, HH:MM in the user's time zone. */
  time: string;
}

/** The words of a ritual in one language. */
export interface RitualText {
  title: string;
  needs: string;
  action: string;
  incantation: string;
}
