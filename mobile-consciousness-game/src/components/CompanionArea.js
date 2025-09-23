import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useGame } from '../context/GameContext';
import PixelCompanion from './PixelCompanion';

export default function CompanionArea() {
  const { state, actions } = useGame();
  const { companion } = state;
  const [bounceAnim] = useState(new Animated.Value(0));
  const [glowAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate companion based on mood
    if (companion.mood === 'happy') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // Glow effect for special states
    if (companion.happiness > 90) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [companion.mood, companion.happiness]);

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'excited': return '🤩';
      case 'sleepy': return '😴';
      case 'hungry': return '🤤';
      default: return '😐';
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'happy': return '#FFD700';
      case 'sad': return '#87CEEB';
      case 'excited': return '#FF69B4';
      case 'sleepy': return '#9370DB';
      case 'hungry': return '#FFA500';
      default: return '#C0C0C0';
    }
  };

  const handleCompanionTap = () => {
    actions.showNotification(`${companion.name} says hello! ${getMoodEmoji(companion.mood)}`);
    
    // Small happiness boost for interaction
    actions.updateCompanion({
      happiness: Math.min(100, companion.happiness + 2)
    });
  };

  return (
    <View style={styles.container}>
      {/* Companion Name and Level */}
      <View style={styles.header}>
        <Text style={styles.companionName}>{companion.name}</Text>
        <Text style={styles.level}>Lv. {companion.level}</Text>
      </View>

      {/* Main Companion Area */}
      <View style={[styles.companionContainer, { backgroundColor: getMoodColor(companion.mood) + '20' }]}>
        <TouchableOpacity onPress={handleCompanionTap} activeOpacity={0.8}>
          <Animated.View
            style={[
              styles.companionWrapper,
              {
                transform: [{ translateY: bounceAnim }],
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.7],
                }),
              },
            ]}
          >
            <PixelCompanion size={120} />
          </Animated.View>
        </TouchableOpacity>

        {/* Mood Indicator */}
        <View style={styles.moodContainer}>
          <Text style={styles.moodEmoji}>{getMoodEmoji(companion.mood)}</Text>
          <Text style={styles.moodText}>{companion.mood}</Text>
        </View>
      </View>

      {/* Stats Bars */}
      <View style={styles.statsContainer}>
        <StatBar label="Hunger" value={companion.hunger} color="#FF6B6B" icon="🍎" />
        <StatBar label="Energy" value={companion.energy} color="#4ECDC4" icon="⚡" />
        <StatBar label="Happiness" value={companion.happiness} color="#FFE66D" icon="💖" />
      </View>

      {/* Experience Bar */}
      <View style={styles.expContainer}>
        <Text style={styles.expLabel}>Experience</Text>
        <View style={styles.expBar}>
          <View 
            style={[
              styles.expFill, 
              { width: `${(companion.experience % 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.expText}>{companion.experience}/100</Text>
      </View>
    </View>
  );
}

function StatBar({ label, value, color, icon }) {
  return (
    <View style={styles.statBar}>
      <View style={styles.statHeader}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}/100</Text>
      </View>
      <View style={styles.statBarContainer}>
        <View 
          style={[
            styles.statBarFill, 
            { 
              width: `${value}%`, 
              backgroundColor: color,
              opacity: value < 30 ? 0.5 : 1 // Dim when low
            }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  companionName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  level: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7F8C8D',
    backgroundColor: '#ECF0F1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  companionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  companionWrapper: {
    alignItems: 'center',
  },
  moodContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    textTransform: 'capitalize',
    marginTop: 5,
  },
  statsContainer: {
    marginBottom: 15,
  },
  statBar: {
    marginBottom: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  statIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  statValue: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  statBarContainer: {
    height: 8,
    backgroundColor: '#ECF0F1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  expContainer: {
    alignItems: 'center',
  },
  expLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  expBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#ECF0F1',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  expFill: {
    height: '100%',
    backgroundColor: '#9B59B6',
    borderRadius: 3,
  },
  expText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});
