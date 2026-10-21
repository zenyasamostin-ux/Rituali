import { occurrences, type ScheduleProfile } from '../engine';

const profile: ScheduleProfile = {
  cycleStart: '2026-10-19', // a Monday, week A
  rhythm: 'daily',
  payday: 31,
  billsDay: 10,
  birthday: { month: 11, day: 3 },
};

function idsOn(date: string, p: ScheduleProfile = profile): string[] {
  const [year, month, day] = date.split('-').map(Number);
  return occurrences({ year, month, day }, 1, p).map((o) => o.ritual.id);
}

describe('weekly cycle', () => {
  it('gives one ritual a day, alternating weeks A and B', () => {
    expect(idsOn('2026-10-22')).toEqual(['cinnamon-coffee']); // Thursday, week A
    expect(idsOn('2026-10-29')).toEqual(['golden-orange']); // Thursday, week B
    expect(idsOn('2026-11-05')).toEqual(['cinnamon-coffee']); // week A again
  });

  it('counts the cycle from the Monday of the start week', () => {
    expect(idsOn('2026-10-22', { ...profile, cycleStart: '2026-10-21' })).toEqual(['cinnamon-coffee']);
  });

  it('works for days before the cycle start', () => {
    expect(idsOn('2026-10-15')).toEqual(['golden-orange']); // the week before is B
  });

  it('skips odd cycle days in the every-other-day rhythm', () => {
    const p: ScheduleProfile = { ...profile, rhythm: 'everyOtherDay' };
    const list = occurrences({ year: 2026, month: 10, day: 19 }, 14, p).filter((o) => o.ritual.category === 'weekly');
    expect(list.map((o) => o.date.day)).toEqual([19, 21, 23, 25, 27, 29, 31]);
  });
});

describe('monthly rituals', () => {
  it('moves the 31st payday to the last day of a short month', () => {
    expect(idsOn('2026-11-30')).toEqual(expect.arrayContaining(['tenth-part', 'month-close']));
  });

  it('shows a monthly ritual next to the weekly one, sorted by time', () => {
    // Sunday of week B: first coin at 09:00, salt wash at 21:00.
    const ids = idsOn('2026-11-01');
    expect(ids.indexOf('first-coin')).toBeLessThan(ids.indexOf('salt-wash'));
  });

  it('skips profile days the user has not set', () => {
    expect(idsOn('2026-11-10', { ...profile, billsDay: undefined })).not.toContain('easy-payment');
    expect(idsOn('2026-11-10')).toContain('easy-payment');
  });
});

describe('premium rituals', () => {
  it('finds the full moon of 26 October 2026', () => {
    expect(idsOn('2026-10-26')).toContain('moon-water');
  });

  it('finds solstices, holidays and personal dates', () => {
    expect(idsOn('2026-12-21')).toContain('rebirth-candle');
    expect(idsOn('2026-12-31')).toContain('bill-in-hand');
    expect(idsOn('2027-02-06')).toContain('red-envelope');
    expect(idsOn('2026-11-03')).toContain('money-year');
    expect(idsOn('2026-11-11')).toContain('mirror-bill');
    expect(idsOn('2026-08-12')).toContain('reset');
  });

  it('moves a 29 February birthday to the 28th in other years', () => {
    expect(idsOn('2027-02-28', { ...profile, birthday: { month: 2, day: 29 } })).toContain('money-year');
  });

  it('applies the user time override', () => {
    const [o] = occurrences({ year: 2026, month: 10, day: 22 }, 1, {
      ...profile,
      timeOverrides: { 'cinnamon-coffee': '07:15' },
    });
    expect([o.at.getHours(), o.at.getMinutes()]).toEqual([7, 15]);
  });
});
