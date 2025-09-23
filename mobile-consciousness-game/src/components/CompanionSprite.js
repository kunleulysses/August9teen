import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CompanionSprite({ mood, accessories = [], size = 100 }) {
  // Simple pixel-art style companion using text/emojis
  // In a real implementation, you'd use actual sprite images
  
  const getCompanionSprite = (mood) => {
    switch (mood) {
      case 'happy':
        return '🐱';
      case 'sad':
        return '😿';
      case 'excited':
        return '😸';
      case 'sleepy':
        return '😴';
      case 'hungry':
        return '🙀';
      default:
        return '😺';
    }
  };

  const getEyeStyle = (mood) => {
    switch (mood) {
      case 'happy':
        return { color: '#FFD700' };
      case 'sad':
        return { color: '#87CEEB' };
      case 'excited':
        return { color: '#FF69B4' };
      case 'sleepy':
        return { color: '#9370DB', opacity: 0.7 };
      case 'hungry':
        return { color: '#FFA500' };
      default:
        return { color: '#2C3E50' };
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Main companion body */}
      <View style={styles.spriteContainer}>
        <Text style={[styles.sprite, { fontSize: size * 0.8 }]}>
          {getCompanionSprite(mood)}
        </Text>
        
        {/* Accessories overlay */}
        {accessories.map((accessory, index) => (
          <View key={index} style={[styles.accessory, accessory.position]}>
            <Text style={[styles.accessorySprite, { fontSize: size * 0.3 }]}>
              {accessory.sprite}
            </Text>
          </View>
        ))}
      </View>

      {/* Pixel-art style border effect */}
      <View style={[styles.pixelBorder, getEyeStyle(mood)]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  spriteContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sprite: {
    textAlign: 'center',
    // Add pixel-art style shadow
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  accessory: {
    position: 'absolute',
  },
  accessorySprite: {
    textAlign: 'center',
  },
  pixelBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderWidth: 2,
    borderRadius: 8,
    opacity: 0.3,
  },
});