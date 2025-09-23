import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function StatusBar({ isConnected }) {
  const { state } = useGame();
  const { player, world, consciousness } = state;

  const getConnectionStatus = () => {
    if (consciousness.isConnected && isConnected) {
      return { text: '🧠 Consciousness Active', color: '#27AE60' };
    } else {
      return { text: '🔌 Offline Mode', color: '#E74C3C' };
    }
  };

  const getTimeOfDayEmoji = () => {
    switch (world.timeOfDay) {
      case 'morning': return '🌅';
      case 'day': return '☀️';
      case 'evening': return '🌆';
      case 'night': return '🌙';
      default: return '☀️';
    }
  };

  const getWeatherEmoji = () => {
    switch (world.weather) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'stormy': return '⛈️';
      case 'snowy': return '❄️';
      default: return '☀️';
    }
  };

  const connectionStatus = getConnectionStatus();

  return (
    <View style={styles.container}>
      {/* Top Row - Connection and World Info */}
      <View style={styles.topRow}>
        <View style={styles.connectionContainer}>
          <View style={[styles.connectionDot, { backgroundColor: connectionStatus.color }]} />
          <Text style={[styles.connectionText, { color: connectionStatus.color }]}>
            {connectionStatus.text}
          </Text>
        </View>
        
        <View style={styles.worldInfo}>
          <Text style={styles.worldText}>
            {getTimeOfDayEmoji()} {getWeatherEmoji()} {world.currentArea}
          </Text>
        </View>
      </View>

      {/* Bottom Row - Player Stats */}
      <View style={styles.bottomRow}>
        <View style={styles.playerStat}>
          <Text style={styles.statIcon}>👤</Text>
          <Text style={styles.statText}>{player.username}</Text>
        </View>
        
        <View style={styles.playerStat}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statText}>Lv.{player.level}</Text>
        </View>
        
        <View style={styles.playerStat}>
          <Text style={styles.statIcon}>🪙</Text>
          <Text style={styles.statText}>{player.coins}</Text>
        </View>

        {consciousness.lastHeartbeat && (
          <View style={styles.heartbeat}>
            <Text style={styles.heartbeatText}>💓</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  connectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  worldInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  worldText: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  statText: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '600',
  },
  heartbeat: {
    opacity: 0.7,
  },
  heartbeatText: {
    fontSize: 12,
  },
});