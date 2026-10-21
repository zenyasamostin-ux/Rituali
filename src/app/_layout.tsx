import '../i18n';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ReminderSync } from '../notifications/ReminderSync';
import { AppStateProvider } from '../state/AppState';
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <AppStateProvider>
      <ReminderSync />
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.ink,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </AppStateProvider>
  );
}
