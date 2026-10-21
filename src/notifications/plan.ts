import i18n, { type Language, ritualText } from '../i18n';
import { occurrences, type ScheduleProfile } from '../schedule/engine';
import { addDays, fromDate, key, toDate } from '../schedule/localDate';

// iOS keeps at most 64 pending local notifications per app.
const MAX_PENDING = 60;
const DAYS_AHEAD = 30;
const TEASER_TIME = '19:00';

export interface ReminderPlan {
  at: Date;
  title: string;
  body: string;
  /** Route to open when the notification is tapped. */
  url: string;
}

/**
 * Reminders for the next days. A premium ritual without a subscription gets
 * a teaser the evening before instead of the ritual itself.
 */
export function planReminders(
  profile: ScheduleProfile,
  language: Language,
  isSubscribed: boolean,
  now = new Date(),
): ReminderPlan[] {
  const t = i18n.getFixedT(language);
  const plans: ReminderPlan[] = [];
  for (const o of occurrences(fromDate(now), DAYS_AHEAD, profile)) {
    const text = ritualText(o.ritual.id, language);
    const url = `/ritual/${o.ritual.id}?date=${key(o.date)}`;
    if (o.ritual.tier === 'premium' && !isSubscribed) {
      plans.push({
        at: toDate(addDays(o.date, -1), TEASER_TIME),
        title: t('notification.teaserTitle'),
        body: t('notification.teaserBody', { title: text.title }),
        url,
      });
    } else {
      plans.push({
        at: o.at,
        title: text.title,
        body: t('notification.body', { emoji: o.ritual.emoji, title: text.title }),
        url,
      });
    }
  }
  return plans
    .filter((p) => p.at > now)
    .sort((a, b) => a.at.getTime() - b.at.getTime())
    .slice(0, MAX_PENDING);
}
