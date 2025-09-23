import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet, Alert } from 'react-native';
import { useSettings, getSettings } from '../lib/settings';
import { useStore } from '../store';

export default function SettingsScreen() {
  const settings = useSettings();
  const [apiUrl, setApiUrl] = useState(settings.apiUrl);
  const [wssUrl, setWssUrl] = useState(settings.wssUrl);
  const [devLoginEnabled, setDevLoginEnabled] = useState(settings.devLoginEnabled);

  useEffect(() => {
    setApiUrl(settings.apiUrl);
    setWssUrl(settings.wssUrl);
    setDevLoginEnabled(settings.devLoginEnabled);
  }, [settings.apiUrl, settings.wssUrl, settings.devLoginEnabled]);

  const save = async () => {
    await settings.set({ apiUrl, wssUrl, devLoginEnabled });
    Alert.alert('Saved', 'Settings updated');
  };

  const testWs = async () => {
    try {
      const token = useStore.getState().jwt || undefined;
      const ws = new WebSocket(wssUrl, token);
      ws.onopen = () => { Alert.alert('WS OK', 'Connected'); ws.close(); };
      ws.onerror = () => { Alert.alert('WS Error', 'Failed to connect'); };
    } catch {
      Alert.alert('WS Error', 'Failed to connect');
    }
  };

  const testApi = async () => {
    try {
      const r = await fetch(`${apiUrl}/health`);
      if (r.ok) Alert.alert('API OK', 'Health endpoint responded'); else Alert.alert('API Error', String(r.status));
    } catch {
      Alert.alert('API Error', 'Request failed');
    }
  };

  const testTurn = async () => {
    try {
      const token = useStore.getState().jwt || undefined;
      const ws = new WebSocket(wssUrl, token);
      let done = false;
      ws.onopen = () => {
        try { ws.send(JSON.stringify({ type: 'act', action: 'test turn' })); } catch {}
      };
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(String(e.data));
          if (msg.type === 'turn') {
            if (!done) {
              done = true;
              Alert.alert('Turn Received', (msg.narrative || '').slice(0, 400));
              ws.close();
            }
          }
        } catch {}
      };
      setTimeout(() => { if (!done) { try { ws.close(); } catch {} Alert.alert('Timeout', 'No turn received'); } }, 4000);
    } catch {
      Alert.alert('Error', 'Failed to send test turn');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>API URL</Text>
      <TextInput style={styles.input} value={apiUrl} onChangeText={setApiUrl} autoCapitalize='none' />
      <Text style={styles.label}>WS URL</Text>
      <TextInput style={styles.input} value={wssUrl} onChangeText={setWssUrl} autoCapitalize='none' />
      <View style={styles.row}>
        <Text style={styles.label}>Dev Login Enabled</Text>
        <Switch value={devLoginEnabled} onValueChange={setDevLoginEnabled} />
      </View>
      <View style={styles.row}>
        <Button title='Save' onPress={save} />
        <View style={{ width: 12 }} />
        <Button title='Test API' onPress={testApi} />
        <View style={{ width: 12 }} />
        <Button title='Test WS' onPress={testWs} />
      </View>
      <View style={[styles.row, { marginTop: 8 }]}>
        <Button title='Test Turn' onPress={testTurn} />
      </View>
      <Text style={styles.note}>Current: {JSON.stringify(getSettings())}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  label: { fontSize: 14, fontWeight: '600' },
  input: { borderWidth: StyleSheet.hairlineWidth, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  note: { fontSize: 12, marginTop: 16, color: '#666' }
});
