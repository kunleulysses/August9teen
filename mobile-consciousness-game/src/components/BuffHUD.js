import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

function formatSec(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${s}s`;
}

export default function BuffHUD() {
  const { state } = useGame();
  const buffs = state.companion?.buffs || {};
  const entries = useMemo(() => Object.entries(buffs), [buffs]);
  if (!entries.length) return null;
  const now = Date.now();
  return (
    <View style={styles.container}>
      {entries.map(([kind, b]) => (
        <View key={kind} style={[styles.pill, kind === 'attack' ? styles.attack : styles.defense]}>
          <Text style={styles.text}>{kind === 'attack' ? 'ATK' : 'DEF'} +{b?.value || 0} • {formatSec((b?.expiresAt || now) - now)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 6 },
  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, marginHorizontal: 4, marginTop: 4 },
  attack: { backgroundColor: '#E74C3C' },
  defense: { backgroundColor: '#3498DB' },
  text: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
});

