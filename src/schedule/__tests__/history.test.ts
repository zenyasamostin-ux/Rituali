import { history } from '../history';
import { completionKey } from '../streak';

const day = (d: number) => ({ year: 2026, month: 11, day: d });

describe('history', () => {
  it('lists past rituals newest first, marking done and missed', () => {
    // Monday 16: clean wallet and rice; Tuesday 17: coin at the door and the first-quarter moon.
    const done = new Set([completionKey('clean-wallet', day(16))]);
    const list = history(day(18), day(16), {}, done);
    expect(list.map((e) => [e.occurrence.ritual.id, e.done])).toEqual([
      ['windowsill-coins', false],
      ['doorstep-coin', false],
      ['abundance-rice', false],
      ['clean-wallet', true],
    ]);
  });

  it('starts at the first day in the app and leaves today out', () => {
    expect(history(day(18), day(18), {}, new Set())).toEqual([]);
  });

  it('looks back at most maxDays days', () => {
    const list = history(day(18), { year: 2026, month: 1, day: 1 }, {}, new Set(), 1);
    expect(list.map((e) => e.occurrence.ritual.id)).toEqual(['windowsill-coins', 'doorstep-coin']);
  });
});
