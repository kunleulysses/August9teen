import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useGame } from '../context/GameContext';

function FxPulse({ fx }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  useEffect(() => {
    const dur = Math.max(300, fx.durationMs || 1500);
    opacity.setValue(Math.max(0.2, Math.min(0.9, fx.amplitude || 0.8)));
    scale.setValue(0.8);
    const toScale = fx.type === 'harmonic_aura' ? 2.0 : 1.6;
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: dur, useNativeDriver: true }),
      Animated.timing(scale, { toValue: toScale, duration: dur, useNativeDriver: true })
    ]).start();
  }, [fx?.id]);

  const color = fx.color || '#9B59B6';
  const multiple = fx.type === 'harmonic_aura';
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[styles.full, { backgroundColor: hexToRgba(color, 0.25), opacity }]} />
      <View style={styles.centerWrap}>
        <Animated.View style={[styles.ring, { borderColor: color, transform: [{ scale }] }]} />
        {multiple && <Animated.View style={[styles.ring, { borderColor: color, opacity: 0.6, transform: [{ scale: Animated.multiply(scale, 0.7) }] }]} />}
      </View>
    </View>
  );
}

export default function FxOverlay() {
  const { state } = useGame();
  const list = state.fx?.active || [];
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {list.map((fx) => (
        <>
          <FxPulse key={`${fx.id}-pulse`} fx={fx} />
          <ParticleBurst key={`${fx.id}-burst`} fx={fx} />
        </>
      ))}
    </View>
  );
}

function hexToRgba(hex, a) {
  const m = String(hex).replace('#', '').match(/.{1,2}/g);
  if (!m) return `rgba(0,0,0,${a})`;
  const [r, g, b] = m.map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${a})`;
}

const styles = StyleSheet.create({
  full: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  centerWrap: { position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 },
  ring: { position: 'absolute', top: -80, left: -80, width: 160, height: 160, borderRadius: 80, borderWidth: 4 },
});

function Particle({ color, duration }) {
  const x = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(0)).current;
  const o = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const dx = (Math.random() - 0.5) * 160;
    const dy = (Math.random() - 0.5) * 160;
    Animated.parallel([
      Animated.timing(x, { toValue: dx, duration, useNativeDriver: true }),
      Animated.timing(y, { toValue: dy, duration, useNativeDriver: true }),
      Animated.timing(o, { toValue: 0, duration, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={{ position: 'absolute', top: '50%', left: '50%', width: 8, height: 8, borderRadius: 4, backgroundColor: color, opacity: o, transform: [{ translateX: x }, { translateY: y }] }} />
  );
}

function ParticleBurst({ fx }) {
  const color = fx.color || '#9B59B6';
  const duration = Math.max(300, (fx.durationMs || 1200) * 0.8);
  const N = fx.type === 'harmonic_aura' ? 12 : 8;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: N }).map((_, i) => (
        <Particle key={i} color={color} duration={duration} />
      ))}
    </View>
  );
}
