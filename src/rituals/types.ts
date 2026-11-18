import type { MoonPhase } from '../astro/moon';
import type { SeasonEvent } from '../astro/seasons';

export type Tier = 'free' | 'premium';

export type Category = 'weekly' | 'monthly' | 'lunar' | 'seasonal' | 'holiday' | 'personal';

/** When a ritual happens. Times live on the ritual, rules only pick the day. */
export type Rule =
  /** Every week on this ISO weekday (1 = Monday). */
  | { kind: 'weekly'; weekday: number }
  | { kind: 'monthDay'; day: number }
  | { kind: 'moon'; phase: MoonPhase }
  | { kind: 'season'; event: SeasonEvent }
  | { kind: 'fixedDate'; month: number; day: number }
  /** 01.01, 02.02 … 12.12 */
  | { kind: 'mirrorDate' }
  | { kind: 'movable'; event: 'chineseNewYear' | 'maslenitsa' };

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
