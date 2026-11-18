import { Link, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Calendar } from '../components/Calendar';
import { Chip, controlStyles } from '../components/controls';
import { History } from '../components/History';
import { RitualCard } from '../components/RitualCard';
import { formatDay } from '../format';
import { occurrences } from '../schedule/engine';
import { fromDate, key, parseKey } from '../schedule/localDate';
import { streak } from '../schedule/streak';
import { useAppState } from '../state/AppState';
import { colors, spacing } from '../theme';

type Tab = 'calendar' | 'history';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { ready, profile, language, done } = useAppState();
  const [tab, setTab] = useState<Tab>('calendar');
  const todayKey = key(fromDate(new Date()));

  const todays = useMemo(() => occurrences(parseKey(todayKey), 1, profile), [todayKey, profile]);
  const days = useMemo(() => streak(parseKey(todayKey), profile, done), [todayKey, profile, done]);

  if (!ready) return null;

  return (
    <>
      <Stack.Screen
        options={{
          title: t('home.title'),
          headerRight: () => (
            <Link href="/settings" accessibilityLabel={t('settings.title')} style={styles.settingsLink}>
              ⚙️
            </Link>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>{t('home.today')}</Text>
        <Text style={styles.date}>{formatDay(new Date(), language)}</Text>
        {days > 0 && <Text style={styles.streak}>🔥 {t('home.streak', { count: days })}</Text>}

        <View style={styles.list}>
          {todays.length === 0 ? (
            <Text style={styles.empty}>{t('home.empty')}</Text>
          ) : (
            todays.map((o) => <RitualCard key={o.ritual.id} occurrence={o} />)
          )}
        </View>

        <View style={[controlStyles.row, styles.tabs]}>
          <Chip label={t('home.calendar')} selected={tab === 'calendar'} onPress={() => setTab('calendar')} />
          <Chip label={t('home.history')} selected={tab === 'history'} onPress={() => setTab('history')} />
        </View>

        {tab === 'calendar' ? <Calendar /> : <History />}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl },
  heading: { fontSize: 22, fontWeight: '700', color: colors.ink },
  date: { fontSize: 15, color: colors.muted, marginTop: -spacing.sm },
  streak: { fontSize: 15, color: colors.gold, fontWeight: '600' },
  list: { gap: spacing.sm },
  empty: { fontSize: 16, color: colors.muted, paddingVertical: spacing.md },
  tabs: { marginTop: spacing.md },
  settingsLink: { fontSize: 22, paddingHorizontal: spacing.sm },
});
