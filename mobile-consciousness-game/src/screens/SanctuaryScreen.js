import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGame } from '../context/GameContext';

function ProgressBar({ value = 0, max = 100 }) {
  const pct = Math.max(0, Math.min(100, Math.floor((value / max) * 100)));
  return (
    <View style={styles.barOuter}>
      <View style={[styles.barInner, { width: `${pct}%` }]} />
    </View>
  );
}

export default function SanctuaryScreen() {
  const { state, actions } = useGame();
  const s = state.sanctuary;
  const c = state.companion;
  const threshold = 100 + (s.level - 1) * 50;
  const canAscend = s.level >= 5 && c.level >= 5 && !s.ascended;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crystal Sanctuary</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Sanctuary Level</Text>
        <Text style={styles.value}>Lv. {s.level}</Text>
        <ProgressBar value={s.xp} max={threshold} />
        <Text style={styles.small}>{s.xp}/{threshold} XP</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Companion</Text>
        <Text style={styles.value}>{c.name} — Lv. {c.level} {c.tier === 'legendary' ? '⭐ Legendary' : ''}</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={actions.getSanctuary}>
          <Text style={styles.btnText}>Refresh</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, canAscend ? styles.btnPrimary : styles.btnDisabled]}
          disabled={!canAscend}
          onPress={actions.ascendSanctuary}
        >
          <Text style={styles.btnText}>{canAscend ? 'Ascend ✨' : 'Ascend Locked'}</Text>
        </TouchableOpacity>
      </View>

      {s.ascended && (
        <View style={styles.card}
        >
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>Sanctuary ascended — Legendary unlocked</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginBottom: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderColor: '#ECF0F1', borderWidth: 1, marginBottom: 12 },
  label: { color: '#34495E', fontWeight: '700', marginBottom: 6 },
  value: { color: '#2C3E50', marginBottom: 4 },
  small: { color: '#7F8C8D', fontSize: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, minWidth: 120, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#8E44AD' },
  btnDisabled: { backgroundColor: '#BDC3C7' },
  btnOutline: { borderWidth: 1, borderColor: '#7F8C8D' },
  btnText: { color: '#FFFFFF', fontWeight: '700' },
  barOuter: { height: 8, backgroundColor: '#ECF0F1', borderRadius: 4, overflow: 'hidden', marginTop: 6 },
  barInner: { height: '100%', backgroundColor: '#9B59B6' },
});

