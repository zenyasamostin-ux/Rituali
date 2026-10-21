import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import type { ReminderPlan } from './plan';

export async function ensurePermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

/** Replaces every pending reminder with a fresh plan. Call on launch and after settings change. */
export async function rescheduleReminders(plans: ReminderPlan[]): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('rituals', {
      name: 'Rituals',
      importance: AndroidImportance.DEFAULT,
    });
  }
  for (const plan of plans) {
    await Notifications.scheduleNotificationAsync({
      content: { title: plan.title, body: plan.body, data: { url: plan.url } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: plan.at, channelId: 'rituals' },
    });
  }
}

export function configureForegroundDisplay(): void {
  if (Platform.OS === 'web') return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}
