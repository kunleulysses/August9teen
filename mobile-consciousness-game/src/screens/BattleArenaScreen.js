import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useGame } from '../context/GameContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrendSparkline from '../components/TrendSparkline';

export default function BattleArenaScreen() {
  const { state, actions } = useGame();
  const [opponent, setOpponent] = useState('');
  const nearby = state.presence?.nearby || [];
  const ladder = state.ladder?.list || [];
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    (async () => {
      try { const raw = await AsyncStorage.getItem('cc_ladder_trends'); if (raw) setTrend(JSON.parse(raw)); } catch {}
    })();
  }, [state.ladder?.list]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Battle Arena</Text>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={actions.joinBattleQueue}>
          <Text style={styles.btnText}>Join Matchmaking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={actions.leaveBattleQueue}>
          <Text style={styles.btnTextDark}>Leave</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Challenge by Session ID</Text>
        <TextInput style={styles.input} placeholder="opponent session id" value={opponent} onChangeText={setOpponent} />
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => actions.challengeOpponent(opponent)}>
            <Text style={styles.btnText}>Challenge</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={actions.acceptBattle}>
            <Text style={styles.btnTextDark}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={actions.declineBattle}>
            <Text style={styles.btnTextDark}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={actions.listNearbyPlayers}>
        <Text style={styles.btnTextDark}>List Nearby Players</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Nearby Players</Text>
      <ScrollView style={{ maxHeight: 200 }}>
        {nearby.length === 0 && <Text style={styles.empty}>No players nearby.</Text>}
        {nearby.map((p, i) => (
          <View key={i} style={styles.nearRow}>
            <Text style={styles.nearText}>{p.sessionId || p}</Text>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary]}
              onPress={() => confirmChallenge(p.sessionId || p, actions)}
            >
              <Text style={styles.btnText}>Challenge</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.rowBetween}>
        <Text style={styles.subtitle}>Leaderboard</Text>
        <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => actions.requestLadder()}>
          <Text style={styles.btnTextDark}>Refresh</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ maxHeight: 240 }}>
        {ladder.length === 0 && <Text style={styles.empty}>No leaderboard yet.</Text>}
        {ladder.map((e, idx) => (
          <View key={idx} style={styles.ladderRow}>
            <Text style={styles.ladderRank}>#{idx + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.ladderName}>{e.username || e.playerId}</Text>
              <Text style={styles.ladderSub}>Sanctuary Lv.{e.sanctuaryLevel} • Companion Lv.{e.companionLevel} {e.legendary ? '• ⭐' : ''}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.subtitle}>Your Trend (Sanctuary Level)</Text>
      <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, borderColor: '#ECF0F1', borderWidth: 1 }}>
        <TrendSparkline data={trend.map(p => ({ x: p.ts, y: p.sanctuaryLevel }))} />
      </View>
    </View>
  );
}

function confirmChallenge(sessionId, actions) {
  if (!sessionId) return;
  Alert.alert('Challenge Player', `Send challenge to ${sessionId}?`, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Challenge', style: 'default', onPress: () => actions.challengeOpponent(sessionId) }
  ]);
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginBottom: 12 },
  subtitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginTop: 12, marginBottom: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderColor: '#ECF0F1', borderWidth: 1, marginBottom: 12 },
  label: { color: '#34495E', fontWeight: '700', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#BDC3C7', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 8 },
  btn: { paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8, minWidth: 110, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#27AE60' },
  btnOutline: { borderWidth: 1, borderColor: '#7F8C8D' },
  btnText: { color: '#FFFFFF', fontWeight: '700' },
  btnTextDark: { color: '#2C3E50', fontWeight: '700' },
  nearRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  nearText: { color: '#2C3E50' },
  empty: { color: '#7F8C8D' },
  ladderRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#ECF0F1' },
  ladderRank: { width: 30, textAlign: 'center', color: '#7F8C8D' },
  ladderName: { color: '#2C3E50', fontWeight: '700' },
  ladderSub: { color: '#7F8C8D', fontSize: 12 },
});
