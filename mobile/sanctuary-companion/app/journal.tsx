import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useStore } from '../store';

export default function Journal() {
  const journal = useStore((s) => s.journal);
  return (
    <View style={{ flex: 1, padding: 8 }}>
      <FlatList
        data={journal}
        keyExtractor={(e) => String(e.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title || 'Entry'}</Text>
            <Text style={styles.text}>{item.content}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ opacity: 0.7, padding: 12 }}>No entries yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#ddd' },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  text: { fontSize: 15, lineHeight: 21 }
});

