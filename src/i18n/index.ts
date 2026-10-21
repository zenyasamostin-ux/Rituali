import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en as enRituals } from '../content/rituals/en';
import { ru as ruRituals } from '../content/rituals/ru';
import type { RitualText } from '../rituals/types';
import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import ru from './locales/ru.json';

export const LANGUAGES = ['en', 'de', 'fr', 'es', 'it', 'ru'] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  ru: 'Русский',
};

// de, fr, es and it ritual texts are not written yet and fall back to English.
const RITUAL_TEXTS: Partial<Record<Language, Record<string, RitualText>>> = {
  en: enRituals,
  ru: ruRituals,
};

export function deviceLanguage(): Language {
  for (const locale of getLocales()) {
    const code = locale.languageCode as Language | null;
    if (code && LANGUAGES.includes(code)) return code;
  }
  return 'en';
}

export function ritualText(id: string, language: Language): RitualText {
  return RITUAL_TEXTS[language]?.[id] ?? enRituals[id];
}

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    fr: { translation: fr },
    es: { translation: es },
    it: { translation: it },
    ru: { translation: ru },
  },
  lng: deviceLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
