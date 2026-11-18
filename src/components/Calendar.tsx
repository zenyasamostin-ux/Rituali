import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { formatDay } from '../format';
import { isReminderOn } from '../notifications/plan';
import { occurrences, type Occurrence } from '../schedule/engine';
import { daysInMonth, fromDate, key, type LocalDate, parseKey, toDate, weekday } from '../schedule/localDate';
import { completionKey } from '../schedule/streak';
import { useAppState } from '../state/AppState';
import { colors, spacing } from '../theme';
import { RitualCard } from './RitualCard';

const MONTHS_AHEAD = 12;
const MAX_EMOJI = 2;

/** Month grid of rituals. Tapping a day lists its rituals with a reminder switch for each. */
export function Calendar() {
  const { t } = useTranslation();
  const { profile, updateProfile, language } = useAppState();
  const today = fromDate(new Date());
  const todayKey = key(today);
  const [month, setMonth] = useState({ year: today.year, month: today.month });
  const [selected, setSelected] = useState(todayKey);

  const byDay = useMemo(() => {
    const first = { ...month, day: 1 };
    const map = new Map<string, Occurrence[]>();
    for (const o of occurrences(first, daysInMonth(month.year, month.month), profile)) {
      const k = key(o.date);
      map.set(k, [...(map.get(k) ?? []), o]);
    }
    return map;
  }, [month, profile]);

  const monthIndex = month.year * 12 + month.month - 1;
  const todayIndex = today.year * 12 + today.month - 1;
  const shift = (delta: number) => {
    const index = monthIndex + delta;
    const next = { year: Math.floor(index / 12), month: (index % 12) + 1 };
    setMonth(next);
    setSelected(index === todayIndex ? todayKey : key({ ...next, day: 1 }));
  };

  const offset = weekday({ ...month, day: 1 }) - 1;
  const cells: (LocalDate | null)[] = [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: daysInMonth(month.year, month.month) }, (_, i) => ({ ...month, day: i + 1 })),
  ];
  const weekdayNames = Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, 1 + i).toLocaleDateString(language, { weekday: 'short' }),
  );
  const title = toDate({ ...month, day: 1 }).toLocaleDateString(language, { month: 'long', year: 'numeric' });

  const selectedList = byDay.get(selected) ?? [];

  const toggleOccurrence = (o: Occurrence) => {
    const k = completionKey(o.ritual.id, o.date);
    const muted = profile.mutedOccurrences ?? [];
    updateProfile({ mutedOccurrences: muted.includes(k) ? muted.filter((m) => m !== k) : [...muted, k] });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Arrow label="‹" disabled={monthIndex <= todayIndex} onPress={() => shift(-1)} />
        <Text style={styles.title}>{title.charAt(0).toLocaleUpperCase(language) + title.slice(1)}</Text>
        <Arrow label="›" disabled={monthIndex >= todayIndex + MONTHS_AHEAD} onPress={() => shift(1)} />
      </View>

      <View style={styles.grid}>
        {weekdayNames.map((name) => (
          <Text key={name} style={styles.weekday}>
            {name}
          </Text>
        ))}
        {cells.map((d, i) => {
          if (!d) return <View key={`blank-${i}`} style={styles.cell} />;
          const k = key(d);
          const list = byDay.get(k) ?? [];
          const premium = list.some((o) => o.ritual.tier === 'premium');
          return (
            <Pressable
              key={k}
              onPress={() => setSelected(k)}
              style={[
                styles.cell,
                premium && styles.premiumCell,
                k === todayKey && styles.todayCell,
                k === selected && styles.selectedCell,
              ]}
            >
              <Text style={[styles.dayNumber, k < todayKey && styles.past, k === selected && styles.selectedText]}>
                {d.day}
              </Text>
              <Text style={styles.emoji} numberOfLines={1}>
                {list
                  .slice(0, MAX_EMOJI)
                  .map((o) => o.ritual.emoji)
                  .join('')}
                {list.length > MAX_EMOJI ? '+' : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.dayTitle}>{formatDay(toDate(parseKey(selected)), language)}</Text>
      {selectedList.length === 0 ? (
        <Text style={styles.muted}>{t('home.noRituals')}</Text>
      ) : (
        selectedList.map((o) => {
          const mutedRitual = profile.mutedRituals?.includes(o.ritual.id) ?? false;
          const upcoming = o.at > new Date();
          return (
            <View key={o.ritual.id} style={styles.item}>
              <RitualCard
                occurrence={o}
                accessory={
                  upcoming && (
                    <Switch
                      accessibilityLabel={t('home.notify')}
                      value={profile.remindersOn && isReminderOn(profile, o.ritual.id, o.date)}
                      disabled={!profile.remindersOn || mutedRitual}
                      onValueChange={() => toggleOccurrence(o)}
                      trackColor={{ true: colors.gold }}
                      thumbColor={colors.card}
                    />
                  )
                }
              />
              {upcoming && mutedRitual && <Text style={styles.hint}>{t('home.mutedRitual')}</Text>}
            </View>
          );
        })
      )}
    </View>
  );
}

function Arrow({ label, disabled, onPress }: { label: string; disabled: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} hitSlop={12} style={styles.arrow}>
      <Text style={[styles.arrowText, disabled && styles.past]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 17, fontWeight: '600', color: colors.ink },
  arrow: { paddingHorizontal: spacing.md },
  arrowText: { fontSize: 26, color: colors.gold },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  weekday: { width: `${100 / 7}%`, textAlign: 'center', fontSize: 12, color: colors.muted, paddingBottom: spacing.xs },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  premiumCell: { backgroundColor: colors.goldSoft },
  todayCell: { borderColor: colors.border },
  selectedCell: { borderColor: colors.gold },
  dayNumber: { fontSize: 15, color: colors.ink },
  selectedText: { fontWeight: '700' },
  past: { color: colors.border },
  emoji: { fontSize: 10, height: 14 },
  dayTitle: { fontSize: 15, fontWeight: '600', color: colors.ink, marginTop: spacing.sm },
  muted: { fontSize: 15, color: colors.muted },
  item: { gap: spacing.xs },
  hint: { fontSize: 12, color: colors.muted, paddingHorizontal: spacing.sm },
});
