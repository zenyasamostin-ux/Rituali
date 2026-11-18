import { completionKey, streak } from '../streak';

const day = (d: number) => ({ year: 2026, month: 11, day: d });

describe('streak', () => {
  // Mon 16: clean wallet, Tue 17: coin at the door, Wed 18: mint tea and bay leaf.
  it('counts days in a row with at least one ritual done', () => {
    const done = new Set([completionKey('clean-wallet', day(16)), completionKey('doorstep-coin', day(17))]);
    expect(streak(day(18), {}, done)).toBe(2);
  });

  it('does not reset before today’s ritual is done', () => {
    const done = new Set([completionKey('doorstep-coin', day(17))]);
    expect(streak(day(18), {}, done)).toBe(1);
    done.add(completionKey('bay-leaf', day(18)));
    expect(streak(day(18), {}, done)).toBe(2);
  });

  it('breaks on a missed ritual day', () => {
    const done = new Set([completionKey('clean-wallet', day(16)), completionKey('mint-tea', day(18))]);
    expect(streak(day(18), {}, done)).toBe(1);
  });
});
