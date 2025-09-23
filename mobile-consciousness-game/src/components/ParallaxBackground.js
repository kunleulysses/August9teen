import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '../context/GameContext';

function tintForTimeOfDay(tod) {
  switch (tod) {
    case 'morning': return ['rgba(255,223,186,0.4)', 'rgba(255,223,186,0)'];
    case 'evening': return ['rgba(255,140,0,0.35)', 'rgba(255,140,0,0)'];
    case 'night': return ['rgba(0,0,50,0.45)', 'rgba(0,0,0,0)'];
    default: return ['rgba(255,255,255,0.0)', 'rgba(255,255,255,0.0)'];
  }
}

export default function ParallaxBackground() {
  const { state } = useGame();
  const area = state.world?.currentArea || 'town';
  const tod = state.world?.timeOfDay || 'day';
  const assets = state.assets?.manifest || {};
  const bg = assets.backgrounds?.[area] || {};

  const drift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 8000, useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 8000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const midTranslate = drift.interpolate({ inputRange: [0,1], outputRange: [0, -10] });
  const foreTranslate = drift.interpolate({ inputRange: [0,1], outputRange: [0, -20] });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {bg.sky && <Image source={{ uri: bg.sky }} style={styles.layer} resizeMode="cover" />}
      {bg.mid && (
        <Animated.Image source={{ uri: bg.mid }} style={[styles.layer, { transform: [{ translateX: midTranslate }] }]} resizeMode="cover" />
      )}
      {bg.fore && (
        <Animated.Image source={{ uri: bg.fore }} style={[styles.layer, { transform: [{ translateX: foreTranslate }] }]} resizeMode="cover" />
      )}
      <LinearGradient colors={tintForTimeOfDay(tod)} style={StyleSheet.absoluteFill} />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});

