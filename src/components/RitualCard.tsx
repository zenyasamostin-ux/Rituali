import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ritualText } from '../i18n';
import type { Occurrence } from '../schedule/engine';
import { key } from '../schedule/localDate';
import { completionKey } from '../schedule/streak';
import { useAppState } from '../state/AppState';
import { colors, spacing } from '../theme';

export function RitualCard({ occurrence }: { occurrence: Occurrence }) {
  const { t } = useTranslation();
  const { language, done, isSubscribed } = useAppState();
  const { ritual, date, at } = occurrence;
  const text = ritualText(ritual.id, language);
  const locked = ritual.tier === 'premium' && !isSubscribed;
  const isDone = done.has(completionKey(ritual.id, date));
  const time = at.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' });

  return (
    <Pressable
      accessibilityRole="link"
      onPress={() => router.push({ pathname: '/ritual/[id]', params: { id: ritual.id, date: key(date) } })}
      style={[styles.card, ritual.tier === 'premium' && styles.premium]}
    >
      <Text style={styles.emoji}>{ritual.emoji}</Text>
      <View style={styles.body}>
        <Text style={styles.title}>{text.title}</Text>
        <Text style={styles.meta}>
          {t(`category.${ritual.category}`)} · {time}
        </Text>
      </View>
      {locked && <Text style={styles.badge}>🔒</Text>}
      {isDone && <Text style={styles.badge}>✓</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  premium: { backgroundColor: colors.goldSoft, borderColor: colors.gold },
  emoji: { fontSize: 32 },
  body: { flex: 1, gap: 2 },
  title: { fontSize: 17, fontWeight: '600', color: colors.ink },
  meta: { fontSize: 13, color: colors.muted },
  badge: { fontSize: 18, color: colors.gold },
});
