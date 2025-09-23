import { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, RefreshControl, Button, StyleSheet } from 'react-native';
import { useStore } from '../store';
import { connectStream } from '../lib/ws';
import { api } from '../lib/api';
import { startAuth, devLogin } from '../lib/auth';
import { useSettings } from '../lib/settings';

type Moment = { id: string; ts: number; text: string; tags?: string[] };

export default function Sanctuary() {
  const jwt = useStore((s) => s.jwt);
  const addMoment = useStore((s) => s.addMoment);
  const [buffer, setBuffer] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!jwt) return;
    const ws = connectStream(jwt);
    wsRef.current = ws;
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(String(e.data));
        if (msg.type === 'chunk') setBuffer((b) => b + (msg.content || ''));
        if (msg.type === 'end') {
          const m: Moment = { id: String(Date.now()), ts: Date.now(), text: buffer };
          addMoment(m);
          setBuffer('');
        }
      } catch {}
    };
    ws.onerror = () => {};
    ws.onclose = () => {};
    return () => ws.close();
  }, [jwt]);

  const feed = useStore((s) => s.feed);

  const onRefresh = async () => {
    if (!jwt) return;
    setRefreshing(true);
    try {
      const { data } = await api(jwt).get('/api/v1/sanctuary/feed');
      if (Array.isArray(data?.items)) {
        data.items.forEach((it: any) => addMoment({ id: String(it.id), ts: it.ts || Date.now(), text: it.text }));
      }
    } catch {}
    setRefreshing(false);
  };

  const devEnabled = useSettings((s) => s.devLoginEnabled);
  if (!jwt) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Sanctuary Companion</Text>
        <Text style={styles.subtitle}>Sign in to begin</Text>
        <Button title="Sign In" onPress={startAuth} />
        {devEnabled ? (
          <View style={{ marginTop: 12 }}>
            <Button title="Dev Login (no PKCE)" onPress={() => devLogin()} />
            <Text style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>Calls /login on API and stores token</Text>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 8 }}>
      <FlatList
        data={feed}
        keyExtractor={(m) => m.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.momentText}>{item.text}</Text>
            <Button title="Add to Journal" onPress={() => useStore.getState().addJournalFromMoment(item)} />
          </View>
        )}
        ListHeaderComponent={buffer ? <Text style={styles.stream}>…{buffer}</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 8 },
  subtitle: { fontSize: 16, opacity: 0.7, marginBottom: 16 },
  card: { padding: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#ddd' },
  momentText: { fontSize: 16, lineHeight: 22 },
  stream: { padding: 12, fontStyle: 'italic', color: '#555' }
});
