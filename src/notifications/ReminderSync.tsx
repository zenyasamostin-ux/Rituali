import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AppState as RNAppState, Platform } from 'react-native';

import { useAppState } from '../state/AppState';
import { planReminders } from './plan';
import { configureForegroundDisplay, ensurePermission, rescheduleReminders } from './reminders';

configureForegroundDisplay();

/** Keeps pending reminders in step with the profile and opens the ritual from a tapped reminder. */
export function ReminderSync() {
  const { ready, profile, language, isSubscribed } = useAppState();
  const [foregrounds, setForegrounds] = useState(0);

  // Re-plan whenever the app comes back, so the 30-day window keeps rolling.
  useEffect(() => {
    const sub = RNAppState.addEventListener('change', (state) => {
      if (state === 'active') setForegrounds((n) => n + 1);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!ready || Platform.OS === 'web') return;
    (async () => {
      if (profile.remindersOn && (await ensurePermission())) {
        await rescheduleReminders(planReminders(profile, language, isSubscribed));
      } else {
        await rescheduleReminders([]);
      }
    })();
  }, [ready, profile, language, isSubscribed, foregrounds]);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const open = (response: Notifications.NotificationResponse | null) => {
      const url = response?.notification.request.content.data?.url;
      if (typeof url === 'string') router.push(url as never);
    };
    // A tap that launched the app, then taps while it runs.
    Notifications.getLastNotificationResponseAsync().then(open);
    const sub = Notifications.addNotificationResponseReceivedListener(open);
    return () => sub.remove();
  }, []);

  return null;
}
