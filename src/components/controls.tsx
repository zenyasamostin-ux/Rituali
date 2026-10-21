import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme';

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function Stepper({
  value,
  min,
  max,
  format = String,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  format?: (n: number) => string;
  onChange: (n: number) => void;
}) {
  return (
    <View style={styles.stepper}>
      <Chip label="−" selected={false} onPress={() => onChange(value <= min ? max : value - 1)} />
      <Text style={styles.stepperValue}>{format(value)}</Text>
      <Chip label="+" selected={false} onPress={() => onChange(value >= max ? min : value + 1)} />
    </View>
  );
}

export const controlStyles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});

const styles = StyleSheet.create({
  section: { gap: spacing.sm },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: colors.muted, textTransform: 'uppercase' },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipSelected: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { fontSize: 15, color: colors.ink },
  chipTextSelected: { color: '#FFFFFF', fontWeight: '600' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepperValue: { minWidth: 96, textAlign: 'center', fontSize: 16, color: colors.ink },
});
