import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

function CooldownText({ nextReadyAt }) {
  if (!nextReadyAt) return null;
  const left = Math.max(0, nextReadyAt - Date.now());
  const sec = Math.ceil(left / 1000);
  if (sec <= 0) return null;
  return <Text style={styles.cdText}>{sec}s</Text>;
}

export default function LegendaryBar() {
  const { state, actions } = useGame();
  const c = state.companion || {};
  const isLegendary = c.tier === 'legendary';
  const cds = c.cooldowns || {};
  const canAegis = !cds.crystal_aegis || cds.crystal_aegis <= Date.now();
  const canStrike = !cds.resonant_strike || cds.resonant_strike <= Date.now();
  const canAura = !cds.harmonic_aura || cds.harmonic_aura <= Date.now();

  const disabledReason = useMemo(() => {
    if (!isLegendary) return 'Ascend to unlock abilities';
    if ((c.energy || 0) < 10) return 'Not enough energy';
    return null;
  }, [isLegendary, c.energy]);

  if (!isLegendary) return null;

  return (
    <View style={styles.container}>
      <AbilityButton
        icon="🛡️"
        label="Crystal Aegis"
        onPress={() => actions.useAbility('crystal_aegis')}
        disabled={!canAegis || !!disabledReason}
        nextReadyAt={cds.crystal_aegis}
        color="#2ECC71"
      />
      <AbilityButton
        icon="⚡"
        label="Resonant Strike"
        onPress={() => actions.useAbility('resonant_strike')}
        disabled={!canStrike || (c.energy || 0) < 15}
        nextReadyAt={cds.resonant_strike}
        color="#9B59B6"
      />
      <AbilityButton
        icon="🌀"
        label="Harmonic Aura"
        onPress={() => actions.useAbility('harmonic_aura')}
        disabled={!canAura || (c.energy || 0) < 12}
        nextReadyAt={cds.harmonic_aura}
        color="#27AE60"
      />
    </View>
  );
}

function AbilityButton({ icon, label, onPress, disabled, nextReadyAt, color }) {
  return (
    <TouchableOpacity style={[styles.btn, { backgroundColor: disabled ? '#BDC3C7' : color }]} disabled={disabled} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <CooldownText nextReadyAt={nextReadyAt} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  btn: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon: { fontSize: 18, color: '#FFFFFF' },
  label: { fontSize: 12, color: '#FFFFFF', fontWeight: '700', marginTop: 4 },
  cdText: { fontSize: 10, color: '#FFFFFF', marginTop: 2 },
});
