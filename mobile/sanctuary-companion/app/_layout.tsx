import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { loadAuth } from '../lib/auth';
import { useSettings } from '../lib/settings';

export default function Layout() {
  useEffect(() => {
    Notifications.requestPermissionsAsync().catch(() => {});
    loadAuth().catch(() => {});
    // Load runtime settings overrides
    useSettings.getState().load().catch(() => {});
  }, []);
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Sanctuary' }} />
      <Tabs.Screen name="companion" options={{ title: 'Companion' }} />
      <Tabs.Screen name="journal" options={{ title: 'Journal' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
