import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { formatDay } from '../../format';
import { ritualText } from '../../i18n';
import { RITUALS_BY_ID } from '../../rituals/catalog';
import { fromDate, key, parseKey, toDate } from '../../schedule/localDate';
import { completionKey } from '../../schedule/streak';
import { useAppState } from '../../state/AppState';
import { colors, spacing } from '../../theme';

export default function RitualScreen() {
  const { t } = useTranslation();
  const { id, date } = useLocalSearchParams<{ id: string; date?: string }>();
  const { language, done, toggleDone, isSubscribed, profile } = useAppState();
  const [revealed, setRevealed] = useState(false);

  const ritual = RITUALS_BY_ID[id];
  if (!ritual) return <Text style={styles.missing}>{t('ritual.notFound')}</Text>;

  const day = date ? parseKey(date) : fromDate(new Date());
  const text = ritualText(ritual.id, language);
  const locked = ritual.tier === 'premium' && !isSubscribed;
  const doneKey = completionKey(ritual.id, day);
  const isDone = done.has(doneKey);
  const at = toDate(day, profile.timeOverrides?.[ritual.id] ?? ritual.time);
  const when = formatDay(at, language, true);
  const isFuture = key(day) > key(fromDate(new Date()));

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.emoji}>{ritual.emoji}</Text>
        <Text style={styles.category}>{t(`category.${ritual.category}`)}</Text>
        <Text style={styles.title}>{text.title}</Text>
        <Text style={styles.when}>{when}</Text>

        <Block label={t('ritual.needs')} body={text.needs} />

        {locked ? (
          <View style={styles.locked}>
            <Text style={styles.lockedText}>🔒 {t('ritual.locked')}</Text>
            <Text style={styles.lockedHint}>{t('ritual.subscribeSoon')}</Text>
          </View>
        ) : (
          <>
            <Block label={t('ritual.action')} body={text.action} />
            {revealed ? (
              <Block label={t('ritual.incantation')} body={text.incantation} accent />
            ) : (
              <Pressable style={styles.secondary} onPress={() => setRevealed(true)}>
                <Text style={styles.secondaryText}>{t('ritual.reveal')}</Text>
              </Pressable>
            )}
            {!isFuture && (
              <Pressable style={[styles.primary, isDone && styles.primaryDone]} onPress={() => toggleDone(doneKey)}>
                <Text style={styles.primaryText}>{isDone ? t('ritual.done') : t('ritual.markDone')}</Text>
              </Pressable>
            )}
          </>
        )}
      </ScrollView>
    </>
  );
}

function Block({ label, body, accent }: { label: string; body: string; accent?: boolean }) {
  return (
    <View style={[styles.block, accent && styles.blockAccent]}>
      <Text style={styles.blockLabel}>{label}</Text>
      <Text style={[styles.blockBody, accent && styles.incantation]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  missing: { padding: spacing.lg, color: colors.muted },
  emoji: { fontSize: 64, textAlign: 'center' },
  category: { fontSize: 13, color: colors.gold, textAlign: 'center', fontWeight: '600', textTransform: 'uppercase' },
  title: { fontSize: 28, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  when: { fontSize: 15, color: colors.muted, textAlign: 'center' },
  block: { backgroundColor: colors.card, borderRadius: 16, padding: spacing.md, gap: spacing.xs },
  blockAccent: { backgroundColor: colors.goldSoft },
  blockLabel: { fontSize: 13, color: colors.muted, fontWeight: '600' },
  blockBody: { fontSize: 17, color: colors.ink, lineHeight: 24 },
  incantation: { fontStyle: 'italic', fontSize: 19 },
  locked: { backgroundColor: colors.goldSoft, borderRadius: 16, padding: spacing.lg, gap: spacing.sm },
  lockedText: { fontSize: 17, color: colors.ink, fontWeight: '600' },
  lockedHint: { fontSize: 15, color: colors.muted },
  secondary: { borderWidth: 1, borderColor: colors.gold, borderRadius: 999, padding: spacing.md, alignItems: 'center' },
  secondaryText: { color: colors.gold, fontSize: 16, fontWeight: '600' },
  primary: { backgroundColor: colors.gold, borderRadius: 999, padding: spacing.md, alignItems: 'center' },
  primaryDone: { backgroundColor: colors.muted },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
