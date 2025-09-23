import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useGame } from '../context/GameContext';

export default function EventsScreen() {
  const { state } = useGame();
  const events = state.world.activeEvents || [];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Events</Text>
      {events.length === 0 && <Text style={styles.empty}>No events yet. Explore the world!</Text>}
      {events.map((e, idx) => (
        <View key={idx} style={[styles.card, e?.fx && { borderColor: '#9B59B6' }]}>
          <Text style={styles.name}>{e?.name || e?.type || (e?.fx ? 'Resonant Effect' : 'Event')}</Text>
          {e?.description && <Text style={styles.desc}>{e.description}</Text>}
          {e?.dialogue && <Text style={styles.desc}>{e.dialogue}</Text>}
          {e?.fx && (
            <Text style={styles.desc}>A resonant wave ripples through the area.</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginBottom: 12, paddingHorizontal: 16 },
  empty: { color: '#7F8C8D', paddingHorizontal: 16 },
  card: { backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 10, borderRadius: 12, padding: 12, borderColor: '#ECF0F1', borderWidth: 1 },
  name: { fontWeight: '700', color: '#34495E', marginBottom: 6 },
  desc: { color: '#2C3E50', fontSize: 12 },
});
