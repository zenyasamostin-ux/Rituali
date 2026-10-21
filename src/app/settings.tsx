import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Chip, controlStyles, Section, Stepper } from '../components/controls';
import { LANGUAGE_NAMES, LANGUAGES } from '../i18n';
import { daysInMonth } from '../schedule/localDate';
import { type Profile, useAppState } from '../state/AppState';
import { colors, spacing } from '../theme';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { profile, updateProfile, language } = useAppState();

  const monthName = (m: number) => new Date(2000, m - 1, 1).toLocaleDateString(language, { month: 'long' });
  const birthday = profile.birthday;

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

        <Section title={t('settings.rhythm')}>
          <View style={controlStyles.row}>
            <Chip
              label={t('settings.rhythmDaily')}
              selected={profile.rhythm === 'daily'}
              onPress={() => updateProfile({ rhythm: 'daily' })}
            />
            <Chip
              label={t('settings.rhythmEveryOtherDay')}
              selected={profile.rhythm === 'everyOtherDay'}
              onPress={() => updateProfile({ rhythm: 'everyOtherDay' })}
            />
          </View>
        </Section>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{t('settings.reminders')}</Text>
          <Switch
            value={profile.remindersOn}
            onValueChange={(remindersOn) => updateProfile({ remindersOn })}
            trackColor={{ true: colors.gold }}
            thumbColor={colors.card}
          />
        </View>

        <MonthDay field="payday" label={t('settings.payday')} />
        <MonthDay field="billsDay" label={t('settings.billsDay')} />

        <Section title={t('settings.birthday')}>
          {birthday ? (
            <View style={styles.birthday}>
              <Stepper
                value={birthday.month}
                min={1}
                max={12}
                format={monthName}
                onChange={(month) =>
                  updateProfile({ birthday: { month, day: Math.min(birthday.day, daysInMonth(2000, month)) } })
                }
              />
              <Stepper
                value={birthday.day}
                min={1}
                max={daysInMonth(2000, birthday.month)}
                onChange={(day) => updateProfile({ birthday: { ...birthday, day } })}
              />
              <Chip label={t('settings.clear')} selected={false} onPress={() => updateProfile({ birthday: undefined })} />
            </View>
          ) : (
            <Chip label={t('settings.notSet')} selected={false} onPress={() => updateProfile({ birthday: { month: 1, day: 1 } })} />
          )}
        </Section>

        <Text style={styles.disclaimer}>{t('settings.disclaimer')}</Text>
      </ScrollView>
    </>
  );
}

function MonthDay({ field, label }: { field: 'payday' | 'billsDay'; label: string }) {
  const { t } = useTranslation();
  const { profile, updateProfile } = useAppState();
  const value = profile[field];
  const set = (v: number | undefined) => updateProfile({ [field]: v } as Partial<Profile>);

  return (
    <Section title={label}>
      {value ? (
        <View style={controlStyles.row}>
          <Stepper value={value} min={1} max={31} onChange={set} />
          <Chip label={t('settings.clear')} selected={false} onPress={() => set(undefined)} />
        </View>
      ) : (
        <Chip label={t('settings.notSet')} selected={false} onPress={() => set(1)} />
      )}
    </Section>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xl },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switchLabel: { fontSize: 17, color: colors.ink },
  birthday: { gap: spacing.sm, alignItems: 'flex-start' },
  disclaimer: { fontSize: 13, color: colors.muted, lineHeight: 18 },
});
