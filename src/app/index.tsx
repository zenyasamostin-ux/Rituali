import { Link, Stack } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { RitualCard } from '../components/RitualCard';
import { formatDay } from '../format';
import { occurrences, type Occurrence } from '../schedule/engine';
import { addDays, fromDate, key, parseKey, toDate } from '../schedule/localDate';
import { streak } from '../schedule/streak';
import { useAppState } from '../state/AppState';
import { colors, spacing } from '../theme';

const UPCOMING_DAYS = 7;

export default function TodayScreen() {
  const { t } = useTranslation();
  const { ready, profile, language, done } = useAppState();
  const todayKey = key(fromDate(new Date()));

  const { todays, upcoming } = useMemo(() => {
    const list = occurrences(parseKey(todayKey), UPCOMING_DAYS + 1, profile);
    const byDay = new Map<string, Occurrence[]>();
    for (const o of list) {
      const k = key(o.date);
      byDay.set(k, [...(byDay.get(k) ?? []), o]);
    }
    return {
      todays: byDay.get(todayKey) ?? [],
      upcoming: [...byDay.entries()].filter(([k]) => k !== todayKey),
    };
  }, [todayKey, profile]);

  const days = useMemo(() => streak(parseKey(todayKey), profile, done), [todayKey, profile, done]);
  const tomorrowKey = key(addDays(parseKey(todayKey), 1));

  const dayLabel = (k: string) =>
    k === tomorrowKey
      ? t('today.tomorrow')
      : formatDay(toDate(parseKey(k)), language);

  if (!ready) return null;

  return (
    <>
      <Stack.Screen
        options={{
          title: t('today.title'),
          headerRight: () => (
            <Link href="/settings" accessibilityLabel={t('settings.title')} style={styles.settingsLink}>
              ⚙️
            </Link>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.date}>{formatDay(new Date(), language)}</Text>
        {days > 0 && <Text style={styles.streak}>🔥 {t('today.streak', { count: days })}</Text>}

        <View style={styles.list}>
          {todays.length === 0 ? (
            <Text style={styles.empty}>{t('today.empty')}</Text>
          ) : (
            todays.map((o) => <RitualCard key={o.ritual.id} occurrence={o} />)
          )}
        </View>

        <Text style={styles.heading}>{t('today.upcoming')}</Text>
        {upcoming.map(([k, list]) => (
          <View key={k} style={styles.list}>
            <Text style={styles.dayLabel}>{dayLabel(k)}</Text>
            {list.map((o) => (
              <RitualCard key={o.ritual.id} occurrence={o} />
            ))}
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl },
  date: { fontSize: 15, color: colors.muted },
  streak: { fontSize: 15, color: colors.gold, fontWeight: '600' },
  list: { gap: spacing.sm },
  empty: { fontSize: 16, color: colors.muted, paddingVertical: spacing.lg },
  heading: { fontSize: 20, fontWeight: '700', color: colors.ink, marginTop: spacing.md },
  dayLabel: { fontSize: 14, color: colors.muted, marginTop: spacing.sm },
  settingsLink: { fontSize: 22, paddingHorizontal: spacing.sm },
});
