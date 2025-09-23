import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

type Settings = {
  apiUrl: string;
  wssUrl: string;
  devLoginEnabled: boolean;
  auth: {
    issuer: string;
    clientId: string;
    scopes: string[];
    redirectScheme: string;
  };
};

type SettingsStore = Settings & {
  set: (patch: Partial<Settings>) => Promise<void>;
  load: () => Promise<void>;
};

const extra: any = (Constants as any).expoConfig?.extra || {};
const defaultSettings: Settings = {
  apiUrl: extra.apiUrl || 'http://localhost:3000',
  wssUrl: extra.wssUrl || 'ws://localhost:3015/ws/unified-chat',
  devLoginEnabled: !!extra.devLoginEnabled,
  auth: {
    issuer: extra.auth?.issuer || '',
    clientId: extra.auth?.clientId || '',
    scopes: extra.auth?.scopes || ['openid', 'profile', 'email'],
    redirectScheme: extra.auth?.redirectScheme || 'sanctuary'
  }
};

const KEY = 'sanctuary_settings_v1';

export const useSettings = create<SettingsStore>((set, get) => ({
  ...defaultSettings,
  set: async (patch) => {
    const next = { ...get(), ...patch, auth: { ...get().auth, ...(patch as any).auth } } as Settings;
    set(next);
    try { await AsyncStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  },
  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        set({ ...get(), ...parsed, auth: { ...get().auth, ...(parsed.auth || {}) } });
      }
    } catch {}
  }
}));

export function getSettings(): Settings {
  return useSettings.getState();
}

