import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useStore } from '../store';
import { connectStream, sendAct } from '../lib/ws';
import { useSettings } from '../lib/settings';
import { startAuth, devLogin } from '../lib/auth';

export default function Companion() {
  const jwt = useStore((s) => s.jwt);
  const devEnabled = useSettings((s) => s.devLoginEnabled);
  const [input, setInput] = useState('');
  const [thread, setThread] = useState<{ role: 'user' | 'companion'; text: string; id: string }[]>([]);
  const bufferRef = useRef('');
  const [choices, setChoices] = useState<string[]>([]);

  useEffect(() => {
    if (!jwt) return;
    const ws = connectStream(jwt);
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(String(e.data));
        if (msg.type === 'turn') {
          const text = String(msg.narrative || '');
          setThread((t) => [...t, { id: String(msg.turnId || Date.now()), role: 'companion', text }]);
          if (Array.isArray(msg.choices)) setChoices(msg.choices);
        } else if (msg.type === 'chunk') {
          bufferRef.current += (msg.content || '');
        } else if (msg.type === 'end') {
          setThread((t) => [...t, { id: String(Date.now()), role: 'companion', text: bufferRef.current }]);
          bufferRef.current = '';
        }
      } catch {}
    };
    return () => ws.close();
  }, [jwt]);

  const onSend = () => {
    if (!jwt || !input.trim()) return;
    setThread((t) => [...t, { id: String(Date.now()), role: 'user', text: input }]);
    sendAct(jwt, input);
    setInput('');
  };

  if (!jwt) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Companion</Text>
        <Text style={{ opacity: 0.7, marginBottom: 12 }}>Sign in to chat with your companion</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button title="Sign In" onPress={startAuth} />
          {devEnabled ? <Button title="Dev Login" onPress={() => devLogin()} /> : null}
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 8 }}>
      <FlatList
        data={thread}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <View style={[styles.msg, item.role === 'user' ? styles.user : styles.companion]}>
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        )}
      />
      {choices.length > 0 && (
        <View style={styles.choices}>
          {choices.map((c) => (
            <View key={c} style={styles.choiceWrap}>
              <Button title={c} onPress={() => { setThread((t) => [...t, { id: String(Date.now()), role: 'user', text: c }]); setChoices([]); sendAct(jwt!, c); }} />
            </View>
          ))}
        </View>
      )}
      <View style={styles.inputRow}>
        <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Say something…" />
        <Button title="Send" onPress={onSend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  msg: { marginVertical: 6, padding: 10, borderRadius: 10, maxWidth: '90%' },
  user: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' },
  companion: { alignSelf: 'flex-start', backgroundColor: '#EEE' },
  msgText: { fontSize: 15 },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingVertical: 6 },
  input: { flex: 1, borderWidth: StyleSheet.hairlineWidth, borderColor: '#ccc', padding: 10, borderRadius: 8 }
  ,choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 }
  ,choiceWrap: { marginRight: 8, marginBottom: 6 }
});
