import { chineseNewYear, maslenitsaStart, orthodoxEaster } from '../holidays';
import { eclipsesBetween, moonPhasesBetween } from '../moon';
import { seasonEventDate } from '../seasons';

const MINUTE = 60_000;

function expectNear(actual: Date, isoUtc: string, toleranceMinutes = 5) {
  const diff = Math.abs(actual.getTime() - new Date(isoUtc).getTime());
  expect(diff / MINUTE).toBeLessThan(toleranceMinutes);
}

describe('moon phases', () => {
  const april2024 = moonPhasesBetween(new Date('2024-04-01T00:00Z'), new Date('2024-05-01T00:00Z'));

  it('finds the new moon of the 8 April 2024 eclipse', () => {
    const newMoon = april2024.find((e) => e.phase === 'new')!;
    expectNear(newMoon.date, '2024-04-08T18:21Z');
  });

  it('finds the full moon of 23 April 2024', () => {
    const full = april2024.find((e) => e.phase === 'full')!;
    expectNear(full.date, '2024-04-23T23:49Z');
  });

  it('returns phases in a month in chronological order', () => {
    const times = april2024.map((e) => e.date.getTime());
    expect([...times].sort((a, b) => a - b)).toEqual(times);
    expect(april2024.map((e) => e.phase)).toEqual(['lastQuarter', 'new', 'firstQuarter', 'full']);
  });

  it('finds the first quarter of 15 April 2024', () => {
    const q = april2024.find((e) => e.phase === 'firstQuarter')!;
    expectNear(q.date, '2024-04-15T19:13Z');
  });
});

describe('eclipses', () => {
  it('finds the 2024 and 2026 eclipses but skips penumbral ones', () => {
    const list = eclipsesBetween(new Date('2024-01-01T00:00Z'), new Date('2027-01-01T00:00Z'));
    const days = list.map((e) => `${e.kind} ${e.date.toISOString().slice(0, 10)}`);
    expect(days).toEqual([
      // 2024-03-25 penumbral lunar: skipped
      'solar 2024-04-08',
      'lunar 2024-09-18',
      'solar 2024-10-02',
      'lunar 2025-03-14',
      'solar 2025-03-29',
      'lunar 2025-09-07',
      'solar 2025-09-21',
      'solar 2026-02-17',
      'lunar 2026-03-03',
      'solar 2026-08-12',
      'lunar 2026-08-28',
    ]);
  });
});

describe('seasons', () => {
  it('matches the 2024 equinoxes and solstices', () => {
    expectNear(seasonEventDate('marchEquinox', 2024), '2024-03-20T03:06Z', 10);
    expectNear(seasonEventDate('juneSolstice', 2024), '2024-06-20T20:51Z', 10);
    expectNear(seasonEventDate('septemberEquinox', 2024), '2024-09-22T12:44Z', 10);
    expectNear(seasonEventDate('decemberSolstice', 2024), '2024-12-21T09:20Z', 10);
  });
});

describe('holidays', () => {
  it('computes Orthodox Easter', () => {
    expect(orthodoxEaster(2024)).toEqual({ year: 2024, month: 5, day: 5 });
    expect(orthodoxEaster(2025)).toEqual({ year: 2025, month: 4, day: 20 });
    expect(orthodoxEaster(2026)).toEqual({ year: 2026, month: 4, day: 12 });
  });

  it('starts Maslenitsa on Monday 16 February 2026', () => {
    expect(maslenitsaStart(2026)).toEqual({ year: 2026, month: 2, day: 16 });
  });

  it('knows Chinese New Year 2027', () => {
    expect(chineseNewYear(2027)).toEqual({ year: 2027, month: 2, day: 6 });
    expect(chineseNewYear(2099)).toBeUndefined();
  });
});
