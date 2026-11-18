import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Chip, controlStyles, Section } from '../components/controls';
import { LANGUAGE_NAMES, LANGUAGES, ritualText } from '../i18n';
import { CATALOG } from '../rituals/catalog';
import { useAppState } from '../state/AppState';
import { colors, spacing } from '../theme';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { profile, updateProfile, language } = useAppState();
  const muted = profile.mutedRituals ?? [];

  const toggleRitual = (id: string) =>
    updateProfile({ mutedRituals: muted.includes(id) ? muted.filter((m) => m !== id) : [...muted, id] });

  return (
    <>
      <Stack.Screen options={{ title: t('settings.title') }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Section title={t('settings.language')}>
          <View style={controlStyles.row}>
            <Chip
              label={t('settings.languageAuto')}
              selected={profile.language === 'auto'}
              onPress={() => updateProfile({ language: 'auto' })}
            />
            {LANGUAGES.map((code) => (
              <Chip
                key={code}
                label={LANGUAGE_NAMES[code]}
                selected={profile.language === code}
                onPress={() => updateProfile({ language: code })}
              />
            ))}
          </View>
        </Section>

        <ToggleRow
          label={t('settings.testPremium')}
          hint={t('settings.testPremiumHint')}
          value={profile.testPremium}
          onChange={(testPremium) => updateProfile({ testPremium })}
        />

        <ToggleRow
          label={t('settings.reminders')}
          value={profile.remindersOn}
          onChange={(remindersOn) => updateProfile({ remindersOn })}
        />

        <Section title={t('settings.ritualNotifications')}>
          {CATALOG.map((ritual) => (
            <ToggleRow
              key={ritual.id}
              label={`${ritual.emoji}  ${ritualText(ritual.id, language).title}`}
              value={profile.remindersOn && !muted.includes(ritual.id)}
              disabled={!profile.remindersOn}
              onChange={() => toggleRitual(ritual.id)}
            />
          ))}
        </Section>

        <Text style={styles.disclaimer}>{t('settings.disclaimer')}</Text>
      </ScrollView>
    </>
  );
}

function ToggleRow({
  label,
  hint,
  value,
  disabled,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.switchRow}>
      <View style={styles.switchText}>
        <Text style={styles.switchLabel}>{label}</Text>
        {hint && <Text style={styles.hint}>{hint}</Text>}
      </View>
      <Switch
        value={value}
        disabled={disabled}
        onValueChange={onChange}
        trackColor={{ true: colors.gold }}
        thumbColor={colors.card}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xl },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md },
  switchText: { flex: 1, gap: 2 },
  switchLabel: { fontSize: 17, color: colors.ink },
  hint: { fontSize: 13, color: colors.muted },
  disclaimer: { fontSize: 13, color: colors.muted, lineHeight: 18 },
});
