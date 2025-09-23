import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function ResonanceScreen() {
  const { state } = useGame();
  const hb = state.consciousness.lastHeartbeat || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resonance</Text>
      <View style={styles.card}>
        <Stat label="Active" value={String(!!hb.isActive)} />
        <Stat label="Coherence" value={fmt(hb.coherence)} />
        <Stat label="Awareness" value={fmt(hb.awareness)} />
        <Stat label="Integration" value={fmt(hb.integration)} />
        <Text style={styles.modules}>Modules: {(hb.activeModules || []).join(', ') || '—'}</Text>
        <Text style={styles.time}>Updated: {hb.timestamp ? new Date(hb.timestamp).toLocaleTimeString() : '—'}</Text>
      </View>
    </View>
  );
}

function fmt(n) { return typeof n === 'number' ? n.toFixed(3) : '—'; }

function Stat({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginBottom: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderColor: '#ECF0F1', borderWidth: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { color: '#34495E', fontWeight: '600' },
  value: { color: '#2C3E50' },
  modules: { color: '#2C3E50', marginTop: 8 },
  time: { color: '#7F8C8D', fontSize: 12, marginTop: 6 },
});

