import { planReminders } from '../plan';

const profile = {};

describe('planReminders', () => {
  const now = new Date(2026, 9, 22, 7, 0); // Thursday 22 October 2026, 07:00

  it('starts with today’s ritual in the chosen language', () => {
    const [first] = planReminders(profile, 'ru', false, now);
    expect(first.title).toBe('Кофе с корицей');
    expect(first.body).toContain('☕');
    expect(first.url).toBe('/ritual/cinnamon-coffee?date=2026-10-22');
  });

  it('sends a teaser the evening before a locked premium ritual', () => {
    const plans = planReminders(profile, 'en', false, now);
    const teaser = plans.find((p) => p.url.startsWith('/ritual/moon-water'))!;
    expect(teaser.title).toBe('A special ritual is coming');
    expect([teaser.at.getDate(), teaser.at.getHours()]).toEqual([25, 19]);
  });

  it('sends the premium ritual itself to subscribers', () => {
    const plans = planReminders(profile, 'en', true, now);
    const ritual = plans.find((p) => p.url.startsWith('/ritual/moon-water'))!;
    expect(ritual.title).toBe('Moon Water');
    expect([ritual.at.getDate(), ritual.at.getHours()]).toEqual([26, 22]);
  });

  it('skips muted rituals and muted days', () => {
    const plans = planReminders(
      { mutedRituals: ['golden-orange'], mutedOccurrences: ['cinnamon-coffee@2026-10-29'] },
      'en',
      true,
      now,
    );
    const urls = plans.map((p) => p.url);
    expect(urls.some((u) => u.startsWith('/ritual/golden-orange'))).toBe(false);
    expect(urls).toContain('/ritual/cinnamon-coffee?date=2026-10-22');
    expect(urls).not.toContain('/ritual/cinnamon-coffee?date=2026-10-29');
  });

  it('stays under the iOS limit of pending notifications', () => {
    expect(planReminders(profile, 'en', true, now).length).toBeLessThanOrEqual(60);
  });
});
