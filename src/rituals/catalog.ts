import type { Ritual } from './types';

// Mirrors the ritual catalog document. Texts live in src/content/rituals/<language>.ts.
export const CATALOG: Ritual[] = [
  // Week A, free
  { id: 'clean-wallet', tier: 'free', category: 'weekly', emoji: '👛', time: '08:00', rule: { kind: 'cycle', week: 'A', weekday: 1 } },
  { id: 'doorstep-coin', tier: 'free', category: 'weekly', emoji: '🪙', time: '09:00', rule: { kind: 'cycle', week: 'A', weekday: 2 } },
  { id: 'mint-tea', tier: 'free', category: 'weekly', emoji: '🍵', time: '10:00', rule: { kind: 'cycle', week: 'A', weekday: 3 } },
  { id: 'cinnamon-coffee', tier: 'free', category: 'weekly', emoji: '☕', time: '08:00', rule: { kind: 'cycle', week: 'A', weekday: 4 } },
  { id: 'money-tree', tier: 'free', category: 'weekly', emoji: '🪴', time: '18:00', rule: { kind: 'cycle', week: 'A', weekday: 5 } },
  { id: 'clean-hallway', tier: 'free', category: 'weekly', emoji: '🧹', time: '11:00', rule: { kind: 'cycle', week: 'A', weekday: 6 } },
  { id: 'gratitude-list', tier: 'free', category: 'weekly', emoji: '📝', time: '20:00', rule: { kind: 'cycle', week: 'A', weekday: 7 } },

  // Week B, free
  { id: 'abundance-rice', tier: 'free', category: 'weekly', emoji: '🍚', time: '08:00', rule: { kind: 'cycle', week: 'B', weekday: 1 } },
  { id: 'honey-spoon', tier: 'free', category: 'weekly', emoji: '🍯', time: '08:30', rule: { kind: 'cycle', week: 'B', weekday: 2 } },
  { id: 'bay-leaf', tier: 'free', category: 'weekly', emoji: '🌿', time: '12:00', rule: { kind: 'cycle', week: 'B', weekday: 3 } },
  { id: 'golden-orange', tier: 'free', category: 'weekly', emoji: '🍊', time: '13:00', rule: { kind: 'cycle', week: 'B', weekday: 4 } },
  { id: 'keeper-bill', tier: 'free', category: 'weekly', emoji: '💵', time: '18:00', rule: { kind: 'cycle', week: 'B', weekday: 5 } },
  { id: 'light-hand', tier: 'free', category: 'weekly', emoji: '🤲', time: '12:00', rule: { kind: 'cycle', week: 'B', weekday: 6 } },
  { id: 'salt-wash', tier: 'free', category: 'weekly', emoji: '🧂', time: '21:00', rule: { kind: 'cycle', week: 'B', weekday: 7 } },

  // Monthly, free
  { id: 'first-coin', tier: 'free', category: 'monthly', emoji: '🐷', time: '09:00', rule: { kind: 'monthDay', day: 1 } },
  { id: 'tenth-part', tier: 'free', category: 'monthly', emoji: '💰', time: '10:00', rule: { kind: 'profileDay', field: 'payday' } },
  { id: 'easy-payment', tier: 'free', category: 'monthly', emoji: '🧾', time: '19:00', rule: { kind: 'profileDay', field: 'billsDay' } },
  { id: 'month-close', tier: 'free', category: 'monthly', emoji: '📒', time: '20:00', rule: { kind: 'lastDayOfMonth' } },

  // Lunar, premium
  { id: 'new-moon-wallet', tier: 'premium', category: 'lunar', emoji: '🌑', time: '20:00', rule: { kind: 'moon', phase: 'new' } },
  { id: 'windowsill-coins', tier: 'premium', category: 'lunar', emoji: '🌓', time: '21:00', rule: { kind: 'moon', phase: 'firstQuarter' } },
  { id: 'moon-water', tier: 'premium', category: 'lunar', emoji: '🌕', time: '22:00', rule: { kind: 'moon', phase: 'full' } },
  { id: 'release-debts', tier: 'premium', category: 'lunar', emoji: '🌗', time: '20:00', rule: { kind: 'moon', phase: 'lastQuarter' } },

  // Seasonal, premium
  { id: 'coin-sowing', tier: 'premium', category: 'seasonal', emoji: '🌱', time: '10:00', rule: { kind: 'season', event: 'marchEquinox' } },
  { id: 'sun-coin', tier: 'premium', category: 'seasonal', emoji: '☀️', time: '11:45', rule: { kind: 'season', event: 'juneSolstice' } },
  { id: 'harvest', tier: 'premium', category: 'seasonal', emoji: '🍎', time: '18:00', rule: { kind: 'season', event: 'septemberEquinox' } },
  { id: 'rebirth-candle', tier: 'premium', category: 'seasonal', emoji: '🕯️', time: '20:00', rule: { kind: 'season', event: 'decemberSolstice' } },

  // Holidays, premium
  { id: 'bill-in-hand', tier: 'premium', category: 'holiday', emoji: '🎆', time: '23:50', rule: { kind: 'fixedDate', month: 12, day: 31 } },
  { id: 'grain-scatter', tier: 'premium', category: 'holiday', emoji: '🌾', time: '19:00', rule: { kind: 'fixedDate', month: 1, day: 13 } },
  { id: 'red-envelope', tier: 'premium', category: 'holiday', emoji: '🧧', time: '10:00', rule: { kind: 'movable', event: 'chineseNewYear' } },
  { id: 'golden-pancake', tier: 'premium', category: 'holiday', emoji: '🥞', time: '10:00', rule: { kind: 'movable', event: 'maslenitsa' } },

  // Personal and special dates, premium
  { id: 'money-year', tier: 'premium', category: 'personal', emoji: '🎂', time: '10:00', rule: { kind: 'birthday' } },
  { id: 'mirror-bill', tier: 'premium', category: 'personal', emoji: '🪞', time: '12:00', rule: { kind: 'mirrorDate' } },
  { id: 'reset', tier: 'premium', category: 'personal', emoji: '🌘', time: '20:00', rule: { kind: 'eclipse' } },
];

export const RITUALS_BY_ID: Record<string, Ritual> = Object.fromEntries(CATALOG.map((r) => [r.id, r]));
