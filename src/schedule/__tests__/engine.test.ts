import { occurrences } from '../engine';

function idsOn(date: string): string[] {
  const [year, month, day] = date.split('-').map(Number);
  return occurrences({ year, month, day }, 1, {}).map((o) => o.ritual.id);
}

describe('weekly rituals', () => {
  it('repeats every week on the same day', () => {
    for (const thursday of ['2026-11-19', '2026-11-26', '2026-12-03']) {
      expect(idsOn(thursday)).toEqual(['cinnamon-coffee', 'golden-orange']);
    }
  });

  it('gives every day of the week at least one ritual', () => {
    const list = occurrences({ year: 2026, month: 11, day: 16 }, 7, {});
    expect(new Set(list.map((o) => o.date.day))).toEqual(new Set([16, 17, 18, 19, 20, 21, 22]));
  });
});

describe('dated rituals', () => {
  it('puts the first coin on the 1st, sorted by time with the weekly ones', () => {
    // Tuesday 1 December: first coin and the doorstep coin, both at 09:00.
    expect(idsOn('2026-12-01')).toEqual(expect.arrayContaining(['first-coin', 'doorstep-coin']));
  });

  it('finds the full moon of 26 October 2026', () => {
    expect(idsOn('2026-10-26')).toContain('moon-water');
  });

  it('finds solstices, holidays and mirror dates', () => {
    expect(idsOn('2026-12-21')).toContain('rebirth-candle');
    expect(idsOn('2026-12-31')).toContain('bill-in-hand');
    expect(idsOn('2027-02-06')).toContain('red-envelope');
    expect(idsOn('2027-03-08')).toContain('golden-pancake');
    expect(idsOn('2026-11-11')).toContain('mirror-bill');
  });

  it('applies the user time override', () => {
    const [o] = occurrences({ year: 2026, month: 11, day: 19 }, 1, { timeOverrides: { 'cinnamon-coffee': '07:15' } });
    expect([o.ritual.id, o.at.getHours(), o.at.getMinutes()]).toEqual(['cinnamon-coffee', 7, 15]);
  });
});
