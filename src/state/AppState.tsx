import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import i18n, { deviceLanguage, type Language } from '../i18n';
import type { ScheduleProfile } from '../schedule/engine';
import { fromDate, key } from '../schedule/localDate';

export interface Profile extends ScheduleProfile {
  language: Language | 'auto';
  remindersOn: boolean;
}

interface AppState {
  ready: boolean;
  profile: Profile;
  language: Language;
  updateProfile: (patch: Partial<Profile>) => void;
  done: ReadonlySet<string>;
  toggleDone: (completionKey: string) => void;
  /** Placeholder until RevenueCat is connected. */
  isSubscribed: boolean;
}

const PROFILE_KEY = 'profile:v1';
const DONE_KEY = 'done:v1';

function defaultProfile(): Profile {
  return {
    language: 'auto',
    remindersOn: true,
    rhythm: 'daily',
    cycleStart: key(fromDate(new Date())),
  };
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [done, setDone] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    (async () => {
      const [storedProfile, storedDone] = await Promise.all([
        AsyncStorage.getItem(PROFILE_KEY),
        AsyncStorage.getItem(DONE_KEY),
      ]);
      if (storedProfile) setProfile({ ...defaultProfile(), ...JSON.parse(storedProfile) });
      else AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(defaultProfile()));
      if (storedDone) setDone(new Set(JSON.parse(storedDone)));
      setReady(true);
    })();
  }, []);

  const language = profile.language === 'auto' ? deviceLanguage() : profile.language;
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((current) => {
      const next = { ...current, ...patch };
      AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleDone = useCallback((completionKey: string) => {
    setDone((current) => {
      const next = new Set(current);
      if (next.has(completionKey)) next.delete(completionKey);
      else next.add(completionKey);
      AsyncStorage.setItem(DONE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ ready, profile, language, updateProfile, done, toggleDone, isSubscribed: false }),
    [ready, profile, language, updateProfile, done, toggleDone],
  );
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const state = useContext(AppStateContext);
  if (!state) throw new Error('useAppState must be used inside AppStateProvider');
  return state;
}
