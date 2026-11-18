import type { MoonPhase } from '../astro/moon';
import type { SeasonEvent } from '../astro/seasons';

export type Tier = 'free' | 'premium';

export type Category = 'weekly' | 'monthly' | 'lunar' | 'seasonal' | 'holiday' | 'simoron';

/** When a ritual happens. Times live on the ritual, rules only pick the day. */
export type Rule =
  /** Every week on this ISO weekday (1 = Monday). */
  | { kind: 'weekly'; weekday: number }
  | { kind: 'monthDay'; day: number }
  | { kind: 'moon'; phase: MoonPhase }
  | { kind: 'season'; event: SeasonEvent }
  | { kind: 'fixedDate'; month: number; day: number }
  | { kind: 'movable'; event: 'chineseNewYear' };

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
  /** What the ritual means and where it comes from. */
  about: string;
  needs: string;
  action: string;
  /** Words to say; some rituals have none. */
  incantation?: string;
}
