import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useGame } from '../context/GameContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConsciousnessService from '../services/ConsciousnessService';
import { loadAssetManifest } from '../services/AssetService';

export default function LabsScreen() {
  const { state } = useGame();
  const status = state.logs.moduleStatus || [];
  const actions = state.logs.actions || [];
  const ai = state.logs.ai || [];

  // Admin flags UI
  const [apiKey, setApiKey] = useState('');
  const [flags, setFlags] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({});
  const [metrics, setMetrics] = useState({});
  const [abilities, setAbilities] = useState({});
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    (async () => {
      try { const k = await AsyncStorage.getItem('cc_admin_api_key'); if (k) setApiKey(k); } catch {}
    })();
  }, []);

  async function loadFlags() {
    if (!apiKey) { Alert.alert('Missing API key', 'Enter x-api-key to load flags.'); return; }
    setLoading(true);
    try {
      const res = await ConsciousnessService.fetchFlags(apiKey);
      setFlags(res?.flags || {});
      await loadHistory();
      const base = ConsciousnessService.getHttpBase();
      const st = await fetch(`${base}/api/game/flags/status`, { headers: { 'x-api-key': apiKey } });
      if (st.ok) { const data = await st.json(); setStatus(data?.status || {}); }
      const mt = await ConsciousnessService.fetchMetrics(apiKey); setMetrics(mt?.metrics || {});
      const ab = await ConsciousnessService.fetchAbilities(apiKey); setAbilities(ab?.abilities || {});
      const pr = await ConsciousnessService.fetchProposals(apiKey); setProposals(pr?.proposals || []);
    } catch (e) {
      Alert.alert('Error', String(e?.message || e));
    } finally { setLoading(false); }
  }

  // Poll metrics/status/proposals every 15s
  useEffect(() => {
    if (!apiKey) return;
    const t = setInterval(async () => {
      try {
        const mt = await ConsciousnessService.fetchMetrics(apiKey); setMetrics(mt?.metrics || {});
        const base = ConsciousnessService.getHttpBase();
        const st = await fetch(`${base}/api/game/flags/status`, { headers: { 'x-api-key': apiKey } });
        if (st.ok) { const data = await st.json(); setStatus(data?.status || {}); }
        const pr = await ConsciousnessService.fetchProposals(apiKey); setProposals(pr?.proposals || []);
      } catch {}
    }, 15000);
    return () => clearInterval(t);
  }, [apiKey]);

  const [history, setHistory] = useState([]);
  async function loadHistory() {
    try {
      const res = await ConsciousnessService.fetchFlagsHistory(apiKey);
      setHistory(res?.history || []);
    } catch {}
  }
  async function diffAgainstCurrent(entry) {
    try {
      const base = ConsciousnessService.getHttpBase();
      const res = await fetch(`${base}/api/game/flags/diff?id=${entry.id}&against=current`, { headers: { 'x-api-key': apiKey } });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      return data?.diff || { added: [], removed: [], changed: [] };
    } catch (e) {
      Alert.alert('Diff error', String(e?.message || e));
      return { added: [], removed: [], changed: [] };
    }
  }

  async function saveFlags() {
    if (!apiKey) { Alert.alert('Missing API key', 'Enter x-api-key to save flags.'); return; }
    setLoading(true);
    try {
      await AsyncStorage.setItem('cc_admin_api_key', apiKey);
      await ConsciousnessService.updateFlags(apiKey, normalizeFlags(flags));
      Alert.alert('Saved', 'Feature flags updated');
    } catch (e) {
      Alert.alert('Error', String(e?.message || e));
    } finally { setLoading(false); }
  }

  function setFlag(k, v) { setFlags(prev => ({ ...prev, [k]: v })); }
  function normalizeFlags(f) {
    const num = (x) => (x === '' || x === null || x === undefined) ? undefined : Number(x);
    return {
      mobileHeartbeatHz: num(f.mobileHeartbeatHz),
      contentDensity: f.contentDensity,
      eventPacingMs: num(f.eventPacingMs),
      battleXpTransferPct: num(f.battleXpTransferPct),
      battleCooldownMs: num(f.battleCooldownMs),
      sanctuaryBaseThreshold: num(f.sanctuaryBaseThreshold),
      sanctuaryPerLevelIncrement: num(f.sanctuaryPerLevelIncrement),
    };
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Labs</Text>

      <Text style={styles.section}>Admin Flags</Text>
      <View style={styles.card}>
        <Text style={styles.label}>x-api-key</Text>
        <TextInput style={styles.input} placeholder="PROM_API_KEY" value={apiKey} onChangeText={setApiKey} autoCapitalize='none' />
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary, loading && styles.btnDisabled]} onPress={loadFlags} disabled={loading}>
            <Text style={styles.btnText}>{loading ? 'Loading…' : 'Load'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnOutline, loading && styles.btnDisabled]} onPress={saveFlags} disabled={loading}>
            <Text style={styles.btnTextDark}>{loading ? 'Saving…' : 'Save'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 8 }}>
          <Text style={styles.small}>Canary: {(flags.canaryPct ?? status?.canaryPct ?? 0) * 100}%</Text>
          {status?.trialActiveUntil && (
            <Text style={styles.small}>Trial active until: {new Date(status.trialActiveUntil).toLocaleTimeString()}</Text>
          )}
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={async () => {
              try {
                const base = ConsciousnessService.getHttpBase();
                await fetch(`${base}/api/game/flags/trial`, { method: 'PUT', headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'commit' }) });
                await loadFlags();
              } catch {}
            }}>
              <Text style={styles.btnTextDark}>Commit Trial</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={async () => {
              try {
                const base = ConsciousnessService.getHttpBase();
                await fetch(`${base}/api/game/flags/trial`, { method: 'PUT', headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'cancel' }) });
                await loadFlags();
              } catch {}
            }}>
              <Text style={styles.btnTextDark}>Cancel Trial</Text>
            </TouchableOpacity>
          </View>
        </View>

      <View style={styles.grid}>
        <FlagInput label="mobileHeartbeatHz" value={String(flags.mobileHeartbeatHz ?? '')} onChange={(v) => setFlag('mobileHeartbeatHz', v)} />
        <FlagSelect label="contentDensity" value={flags.contentDensity || 'medium'} onChange={(v) => setFlag('contentDensity', v)} options={['low','medium','high']} />
        <FlagInput label="eventPacingMs" value={String(flags.eventPacingMs ?? '')} onChange={(v) => setFlag('eventPacingMs', v)} />
        <FlagInput label="battleXpTransferPct" value={String(flags.battleXpTransferPct ?? '')} onChange={(v) => setFlag('battleXpTransferPct', v)} />
        <FlagInput label="battleCooldownMs" value={String(flags.battleCooldownMs ?? '')} onChange={(v) => setFlag('battleCooldownMs', v)} />
        <FlagInput label="sanctuaryBaseThreshold" value={String(flags.sanctuaryBaseThreshold ?? '')} onChange={(v) => setFlag('sanctuaryBaseThreshold', v)} />
        <FlagInput label="sanctuaryPerLevelIncrement" value={String(flags.sanctuaryPerLevelIncrement ?? '')} onChange={(v) => setFlag('sanctuaryPerLevelIncrement', v)} />
        <FlagInput label="canaryPct" value={String(flags.canaryPct ?? '')} onChange={(v) => setFlag('canaryPct', v)} />
      </View>
      </View>

      <Text style={styles.section}>Assets</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={async () => {
            try {
              const manifest = await loadAssetManifest(ConsciousnessService.baseUrl);
              if (global && typeof global.__setGameAssets === 'function') global.__setGameAssets(manifest);
              Alert.alert('Assets reloaded', 'New asset manifest applied');
            } catch (e) { Alert.alert('Error', String(e?.message || e)); }
          }}>
            <Text style={styles.btnTextDark}>Reload Assets</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.section}>Flags History</Text>
      <View style={styles.card}>
        <ScrollView style={{ maxHeight: 240 }}>
          {(history || []).map((h, i) => (
            <View key={h.id || i} style={{ marginBottom: 12 }}>
              <Text style={styles.small}>{new Date(h.created_at).toLocaleString()} • {h.applied_by || 'n/a'} {h.note ? '• ' + h.note : ''}</Text>
              <Text style={styles.mono}>{short(JSON.stringify(h.flags))}</Text>
              <View style={styles.row}>
                <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => setFlags(h.flags)}>
                  <Text style={styles.btnTextDark}>Load</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={async () => { setFlags(h.flags); await saveFlags(); }}>
                  <Text style={styles.btnText}>Revert</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={async () => {
                  const d = await diffAgainstCurrent(h);
                  Alert.alert('Diff vs current', `Changed: ${d.changed.map(x=>x.key).join(', ') || 'none'}\nAdded: ${d.added.map(x=>x.key).join(', ') || 'none'}\nRemoved: ${d.removed.map(x=>x.key).join(', ') || 'none'}`);
                }}>
                  <Text style={styles.btnTextDark}>Diff</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.section}>Runtime Metrics</Text>
      <View style={styles.card}>
        <Text style={styles.small}>Active Connections: {metrics.activeConnections ?? 0}</Text>
        <Text style={styles.small}>Avg Session Sec: {metrics.avgSessionSec ?? 0}</Text>
        <Text style={styles.small}>Recent Disconnects (5m): {(metrics.recentDisconnects || []).filter(ts => Date.now()-ts <= 5*60*1000).length}</Text>
      </View>

      <Text style={styles.section}>Ability Tuning (PR‑style)</Text>
      <View style={styles.card}>
        {Object.keys(abilities || {}).map((aid) => (
          <View key={aid} style={{ marginBottom: 12 }}>
            <Text style={styles.name}>{aid}</Text>
            <View style={styles.grid}>
              <FlagInput label="cooldownMs" value={String(abilities[aid]?.cooldownMs ?? '')} onChange={(v) => setAbilities((prev) => ({ ...prev, [aid]: { ...prev[aid], cooldownMs: v } }))} />
              <FlagInput label="energyCost" value={String(abilities[aid]?.energyCost ?? '')} onChange={(v) => setAbilities((prev) => ({ ...prev, [aid]: { ...prev[aid], energyCost: v } }))} />
              {abilities[aid]?.buff && (
                <>
                  <FlagInput label="buff.value" value={String(abilities[aid]?.buff?.value ?? '')} onChange={(v) => setAbilities((prev) => ({ ...prev, [aid]: { ...prev[aid], buff: { ...(prev[aid]?.buff||{}), value: v } } }))} />
                  <FlagInput label="buff.durationMs" value={String(abilities[aid]?.buff?.durationMs ?? '')} onChange={(v) => setAbilities((prev) => ({ ...prev, [aid]: { ...prev[aid], buff: { ...(prev[aid]?.buff||{}), durationMs: v } } }))} />
                </>
              )}
              {abilities[aid]?.groupBuff && (
                <>
                  <FlagInput label="groupBuff.value" value={String(abilities[aid]?.groupBuff?.value ?? '')} onChange={(v) => setAbilities((prev) => ({ ...prev, [aid]: { ...prev[aid], groupBuff: { ...(prev[aid]?.groupBuff||{}), value: v } } }))} />
                  <FlagInput label="groupBuff.durationMs" value={String(abilities[aid]?.groupBuff?.durationMs ?? '')} onChange={(v) => setAbilities((prev) => ({ ...prev, [aid]: { ...prev[aid], groupBuff: { ...(prev[aid]?.groupBuff||{}), durationMs: v } } }))} />
                </>
              )}
            </View>
            <View style={styles.row}>
              <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={async () => {
                try {
                  const toyPatch = buildAbilityPatch(abilities[aid]);
                  await ConsciousnessService.updateAbility(apiKey, aid, toyPatch, 'lab-proposal', false);
                  Alert.alert('Proposal created', 'Check proposals list');
                } catch(e) { Alert.alert('Error', String(e?.message||e)); }
              }}>
                <Text style={styles.btnTextDark}>Save Proposal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={async () => {
                try {
                  const toyPatch = buildAbilityPatch(abilities[aid]);
                  await ConsciousnessService.updateAbility(apiKey, aid, toyPatch, 'lab-apply', true);
                  Alert.alert('Applied', 'Ability updated');
                } catch(e) { Alert.alert('Error', String(e?.message||e)); }
              }}>
                <Text style={styles.btnText}>Apply Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.section}>Proposals</Text>
      <View style={styles.card}>
        <ScrollView style={{ maxHeight: 240 }}>
          {(proposals || []).map((p) => (
            <View key={p.id} style={{ marginBottom: 8 }}>
              <Text style={styles.small}>#{p.id} • {p.ability_id} • {p.status} • {new Date(p.created_at).toLocaleString()}</Text>
              <Text style={styles.mono}>after: {short(JSON.stringify(p.after || {}))}</Text>
              {p.status !== 'applied' && (
                <View style={styles.row}>
                  <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={async () => { try { await ConsciousnessService.applyProposal(apiKey, p.id); await loadFlags(); } catch(e){ Alert.alert('Error', String(e?.message||e)); } }}>
                    <Text style={styles.btnText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.section}>Compare History (A ↔ B)</Text>
      <View style={styles.card}>
        <HistoryCompare history={history} apiKey={apiKey} />
      </View>

      <Text style={styles.section}>Module Status</Text>
      {status.length === 0 && <Text style={styles.empty}>No module updates yet.</Text>}
      {status.map((s, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.name}>{s?.module || 'module'}</Text>
          <Text style={styles.desc}>{s?.status || ''}</Text>
          {s?.integrations && <Text style={styles.small}>{Object.keys(s.integrations).join(', ')}</Text>}
        </View>
      ))}

      <Text style={styles.section}>Recent Actions</Text>
      {actions.length === 0 && <Text style={styles.empty}>No actions yet.</Text>}
      {actions.map((a, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.name}>{a.kind}</Text>
          <Text style={styles.small}>{new Date(a.ts).toLocaleTimeString()}</Text>
        </View>
      ))}

      <Text style={styles.section}>AI Responses</Text>
      {ai.length === 0 && <Text style={styles.empty}>No AI responses yet.</Text>}
      {ai.map((r, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.name}>{r.payload?.type || 'ai'}</Text>
          <Text style={styles.desc}>{JSON.stringify(r.payload || {})}</Text>
          <Text style={styles.small}>{new Date(r.ts).toLocaleTimeString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function FlagInput({ label, value, onChange }) {
  return (
    <View style={styles.flagField}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChange} keyboardType='numeric' autoCapitalize='none' />
    </View>
  );
}

function FlagSelect({ label, value, onChange, options }) {
  return (
    <View style={styles.flagField}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.rowWrap}>
        {options.map((opt) => (
          <TouchableOpacity key={opt} style={[styles.pill, value === opt ? styles.pillActive : styles.pillInactive]} onPress={() => onChange(opt)}>
            <Text style={value === opt ? styles.pillTextActive : styles.pillText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function buildAbilityPatch(obj) {
  const num = (v) => (v === '' || v === null || v === undefined) ? undefined : Number(v);
  const patch = {};
  if (obj.cooldownMs !== undefined) patch['cooldownMs'] = num(obj.cooldownMs);
  if (obj.energyCost !== undefined) patch['energyCost'] = num(obj.energyCost);
  if (obj.buff) patch['buff'] = { ...obj.buff, value: num(obj.buff.value), durationMs: num(obj.buff.durationMs) };
  if (obj.groupBuff) patch['groupBuff'] = { ...obj.groupBuff, value: num(obj.groupBuff.value), durationMs: num(obj.groupBuff.durationMs) };
  return patch;
}

function HistoryCompare({ history, apiKey }) {
  const [a, setA] = React.useState(null);
  const [b, setB] = React.useState(null);
  return (
    <View>
      <ScrollView style={{ maxHeight: 200 }}>
        {(history || []).map((h, i) => (
          <View key={h.id || i} style={{ marginBottom: 8 }}>
            <Text style={styles.small}>#{h.id} • {new Date(h.created_at).toLocaleString()}</Text>
            <View style={styles.row}>
              <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => setA(h)}>
                <Text style={styles.btnTextDark}>Set A</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => setB(h)}>
                <Text style={styles.btnTextDark}>Set B</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.row}>
        <Text style={styles.small}>A: {a?.id || '-'}</Text>
        <Text style={styles.small}>B: {b?.id || '-'}</Text>
        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={async () => {
          if (!a || !b) return;
          try {
            const base = ConsciousnessService.getHttpBase();
            const res = await fetch(`${base}/api/game/flags/diff?id=${a.id}&against=${b.id}`, { headers: { 'x-api-key': apiKey } });
            if (!res.ok) throw new Error(String(res.status));
            const data = await res.json();
            Alert.alert('Diff A vs B', `Changed: ${(data.diff.changed||[]).map(x=>x.key).join(', ')||'none'}\nAdded: ${(data.diff.added||[]).map(x=>x.key).join(', ')||'none'}\nRemoved: ${(data.diff.removed||[]).map(x=>x.key).join(', ')||'none'}`);
          } catch (e) { Alert.alert('Diff error', String(e?.message||e)); }
        }}>
          <Text style={styles.btnText}>Compare</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginBottom: 12, paddingHorizontal: 16 },
  section: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginTop: 12, marginBottom: 8, paddingHorizontal: 16 },
  empty: { color: '#7F8C8D', paddingHorizontal: 16 },
  card: { backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 10, borderRadius: 12, padding: 12, borderColor: '#ECF0F1', borderWidth: 1 },
  name: { fontWeight: '700', color: '#34495E', marginBottom: 6 },
  desc: { color: '#2C3E50', fontSize: 12 },
  small: { color: '#7F8C8D', fontSize: 12, marginTop: 6 },
  label: { color: '#34495E', fontWeight: '700', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#BDC3C7', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 8, color: '#2C3E50' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  btn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, minWidth: 110, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#2980B9' },
  btnOutline: { borderWidth: 1, borderColor: '#7F8C8D' },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#FFFFFF', fontWeight: '700' },
  btnTextDark: { color: '#2C3E50', fontWeight: '700' },
  grid: {},
  flagField: { marginBottom: 8 },
  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, marginRight: 6, borderWidth: 1 },
  pillActive: { backgroundColor: '#27AE60', borderColor: '#27AE60' },
  pillInactive: { backgroundColor: '#FFFFFF', borderColor: '#BDC3C7' },
  pillText: { color: '#2C3E50' },
  pillTextActive: { color: '#FFFFFF' },
  mono: { fontFamily: 'System', color: '#2C3E50', fontSize: 12 },
});
