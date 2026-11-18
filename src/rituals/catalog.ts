import type { Ritual } from './types';

// Mirrors the ritual catalog document. Texts live in src/content/rituals/<language>.ts.
export const CATALOG: Ritual[] = [
  // Weekly, free: every week on the same day
  { id: 'clean-wallet', tier: 'free', category: 'weekly', emoji: '👛', time: '08:00', rule: { kind: 'weekly', weekday: 1 } },
  { id: 'abundance-rice', tier: 'free', category: 'weekly', emoji: '🍚', time: '09:00', rule: { kind: 'weekly', weekday: 1 } },
  { id: 'doorstep-coin', tier: 'free', category: 'weekly', emoji: '🪙', time: '09:00', rule: { kind: 'weekly', weekday: 2 } },
  { id: 'mint-tea', tier: 'free', category: 'weekly', emoji: '🍵', time: '10:00', rule: { kind: 'weekly', weekday: 3 } },
  { id: 'bay-leaf', tier: 'free', category: 'weekly', emoji: '🌿', time: '12:00', rule: { kind: 'weekly', weekday: 3 } },
  { id: 'cinnamon-coffee', tier: 'free', category: 'weekly', emoji: '☕', time: '08:00', rule: { kind: 'weekly', weekday: 4 } },
  { id: 'golden-orange', tier: 'free', category: 'weekly', emoji: '🍊', time: '13:00', rule: { kind: 'weekly', weekday: 4 } },
  { id: 'keeper-bill', tier: 'free', category: 'weekly', emoji: '💵', time: '12:00', rule: { kind: 'weekly', weekday: 5 } },
  { id: 'money-tree', tier: 'free', category: 'weekly', emoji: '🪴', time: '18:00', rule: { kind: 'weekly', weekday: 5 } },
  { id: 'clean-hallway', tier: 'free', category: 'weekly', emoji: '🧹', time: '11:00', rule: { kind: 'weekly', weekday: 6 } },
  { id: 'light-hand', tier: 'free', category: 'weekly', emoji: '🤲', time: '13:00', rule: { kind: 'weekly', weekday: 6 } },
  { id: 'gratitude-list', tier: 'free', category: 'weekly', emoji: '📝', time: '20:00', rule: { kind: 'weekly', weekday: 7 } },

  // Monthly, free
  { id: 'first-coin', tier: 'free', category: 'monthly', emoji: '🐷', time: '09:00', rule: { kind: 'monthDay', day: 1 } },

  // Lunar, premium
  { id: 'new-moon-wallet', tier: 'premium', category: 'lunar', emoji: '🌑', time: '20:00', rule: { kind: 'moon', phase: 'new' } },
  { id: 'windowsill-coins', tier: 'premium', category: 'lunar', emoji: '🌓', time: '21:00', rule: { kind: 'moon', phase: 'firstQuarter' } },
  { id: 'moon-water', tier: 'premium', category: 'lunar', emoji: '🌕', time: '22:00', rule: { kind: 'moon', phase: 'full' } },
  { id: 'release-debts', tier: 'premium', category: 'lunar', emoji: '🌗', time: '20:00', rule: { kind: 'moon', phase: 'lastQuarter' } },

  // Seasonal, premium
  { id: 'coin-sowing', tier: 'premium', category: 'seasonal', emoji: '🌱', time: '10:00', rule: { kind: 'season', event: 'marchEquinox' } },
  { id: 'rebirth-candle', tier: 'premium', category: 'seasonal', emoji: '🕯️', time: '20:00', rule: { kind: 'season', event: 'decemberSolstice' } },

  // Holidays, premium
  { id: 'bill-in-hand', tier: 'premium', category: 'holiday', emoji: '🎆', time: '23:50', rule: { kind: 'fixedDate', month: 12, day: 31 } },
  { id: 'grain-scatter', tier: 'premium', category: 'holiday', emoji: '🌾', time: '19:00', rule: { kind: 'fixedDate', month: 1, day: 13 } },
  { id: 'red-envelope', tier: 'premium', category: 'holiday', emoji: '🧧', time: '10:00', rule: { kind: 'movable', event: 'chineseNewYear' } },
  { id: 'golden-pancake', tier: 'premium', category: 'holiday', emoji: '🥞', time: '10:00', rule: { kind: 'movable', event: 'maslenitsa' } },

  // Special dates, premium
  { id: 'mirror-bill', tier: 'premium', category: 'personal', emoji: '🪞', time: '12:00', rule: { kind: 'mirrorDate' } },
];

export const RITUALS_BY_ID: Record<string, Ritual> = Object.fromEntries(CATALOG.map((r) => [r.id, r]));
