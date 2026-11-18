import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { formatDay } from '../format';
import { history, type HistoryEntry } from '../schedule/history';
import { fromDate, key, parseKey, toDate } from '../schedule/localDate';
import { useAppState } from '../state/AppState';
import { colors, spacing } from '../theme';
import { RitualCard } from './RitualCard';

/** Past rituals of the last 30 days, done and missed. A missed one can still be opened and marked. */
export function History() {
  const { t } = useTranslation();
  const { profile, done, language } = useAppState();
  const todayKey = key(fromDate(new Date()));

  const entries = useMemo(
    () => history(parseKey(todayKey), parseKey(profile.startDate), profile, done),
    [todayKey, profile, done],
  );

  if (entries.length === 0) return <Text style={styles.muted}>{t('history.empty')}</Text>;

  const days = new Map<string, HistoryEntry[]>();
  for (const e of entries) {
    const k = key(e.occurrence.date);
    days.set(k, [...(days.get(k) ?? []), e]);
  }
  const doneCount = entries.filter((e) => e.done).length;

  return (
    <View style={styles.container}>
      <Text style={styles.summary}>
        {t('history.summary', { done: doneCount, missed: entries.length - doneCount })}
      </Text>
      {[...days.entries()].map(([k, list]) => (
        <View key={k} style={styles.day}>
          <Text style={styles.dayLabel}>{formatDay(toDate(parseKey(k)), language)}</Text>
          {list.map((e) => (
            <RitualCard
              key={e.occurrence.ritual.id}
              occurrence={e.occurrence}
              accessory={
                <Text style={[styles.status, e.done ? styles.done : styles.missed]}>
                  {e.done ? `✓ ${t('history.done')}` : t('history.missed')}
                </Text>
              }
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  summary: { fontSize: 15, color: colors.ink, fontWeight: '600' },
  day: { gap: spacing.sm },
  dayLabel: { fontSize: 14, color: colors.muted },
  muted: { fontSize: 15, color: colors.muted },
  status: { fontSize: 13, fontWeight: '600' },
  done: { color: colors.gold },
  missed: { color: colors.muted },
});
