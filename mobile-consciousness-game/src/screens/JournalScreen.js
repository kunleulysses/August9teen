import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useGame } from '../context/GameContext';

export default function JournalScreen() {
  const { state, actions } = useGame();
  const { journal, consciousness } = state;

  useEffect(() => {
    if (consciousness.isConnected && (!journal.memories || journal.memories.length === 0)) {
      actions.requestMemories();
    }
  }, [consciousness.isConnected]);

  const items = journal.memories || [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Journal</Text>
      {items.length === 0 && (
        <Text style={styles.empty}>No memories yet. Interact with your companion!</Text>
      )}
      {items.map((m, idx) => (
        <View key={m?.id || idx} style={styles.card}>
          <Text style={styles.type}>{m?.type || 'event'}</Text>
          <Text style={styles.payload}>
            {short(JSON.stringify(m?.payload || {}, null, 0), 240)}
          </Text>
          <Text style={styles.time}>{new Date(m?.timestamp || Date.now()).toLocaleString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function short(s, max) { return s && s.length > max ? s.slice(0, max - 1) + '…' : s; }

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginBottom: 12, paddingHorizontal: 16 },
  empty: { color: '#7F8C8D', paddingHorizontal: 16 },
  card: { backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 10, borderRadius: 12, padding: 12, borderColor: '#ECF0F1', borderWidth: 1 },
  type: { fontWeight: '700', color: '#34495E', marginBottom: 6, textTransform: 'capitalize' },
  payload: { color: '#2C3E50', fontSize: 12 },
  time: { color: '#7F8C8D', fontSize: 10, marginTop: 6, textAlign: 'right' },
});

