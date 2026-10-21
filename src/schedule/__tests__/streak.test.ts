import type { ScheduleProfile } from '../engine';
import { completionKey, streak } from '../streak';

const profile: ScheduleProfile = { cycleStart: '2026-10-19', rhythm: 'everyOtherDay' };
const day = (d: number) => ({ year: 2026, month: 10, day: d });

describe('streak', () => {
  it('counts ritual days in a row and ignores days without a ritual', () => {
    // Every other day: rituals on 19, 21, 23 (Mon, Wed, Fri of week A).
    const done = new Set([completionKey('clean-wallet', day(19)), completionKey('mint-tea', day(21))]);
    expect(streak(day(22), profile, done)).toBe(2);
  });

  it('does not reset before today’s ritual is done', () => {
    const done = new Set([completionKey('clean-wallet', day(19)), completionKey('mint-tea', day(21))]);
    expect(streak(day(23), profile, done)).toBe(2);
    done.add(completionKey('money-tree', day(23)));
    expect(streak(day(23), profile, done)).toBe(3);
  });

  it('breaks on a missed ritual day', () => {
    const done = new Set([completionKey('clean-wallet', day(19)), completionKey('money-tree', day(23))]);
    expect(streak(day(23), profile, done)).toBe(1);
  });
});
