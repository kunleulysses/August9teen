import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';
import PixelSpriteAnimator from './PixelSpriteAnimator';

export default function PixelCompanion({ size = 120 }) {
  const { state } = useGame();
  const assets = state.assets?.manifest || {};
  const comp = state.companion || {};
  const key = (comp.skinId || 'nyx');
  const rawMood = comp.mood || 'idle';
  const mood = (rawMood === 'walk') ? 'walk' : 'idle';
  // Choose animation by mood (fallback to idle)
  const entry = assets.companions?.[key]?.[mood] || assets.companions?.[key]?.idle;
  if (!entry) return <View style={[styles.placeholder, { width: size, height: size }]} />;
  // If entry is a sheet config
  if (entry && typeof entry === 'object' && entry.sheet && entry.frameWidth && entry.frameHeight) {
    return (
      <PixelSpriteAnimator
        src={entry.sheet}
        frameWidth={entry.frameWidth}
        frameHeight={entry.frameHeight}
        frames={entry.frames || 1}
        columns={entry.columns || entry.frames}
        fps={entry.fps || 6}
        size={size}
      />
    );
  }
  const src = typeof entry === 'string' ? entry : entry?.image || null;
  return (
    <View style={{ width: size, height: size }}>
      <Image source={{ uri: src }} style={{ width: size, height: size }} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: { backgroundColor: '#DDD', borderRadius: 12 }
});
