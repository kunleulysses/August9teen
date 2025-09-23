import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function ActionBar() {
  const { state, actions } = useGame();
  const { companion, player } = state;

  const getAppleCount = () => {
    const apple = player.inventory.find(item => item.id === 'apple');
    return apple ? apple.quantity : 0;
  };

  const getBallCount = () => {
    const ball = player.inventory.find(item => item.id === 'ball');
    return ball ? ball.quantity : 0;
  };

  const canFeed = () => getAppleCount() > 0;
  const canPlay = () => companion.energy > 10 && getBallCount() > 0;

  const handleFeed = () => {
    if (canFeed()) {
      actions.feedCompanion('apple');
      actions.showNotification(`${companion.name} enjoyed the apple! 🍎`);
    } else {
      actions.showNotification('No apples left! Visit the shop to get more.');
    }
  };

  const handlePlay = () => {
    if (canPlay()) {
      actions.playWithCompanion('ball');
      actions.showNotification(`${companion.name} had fun playing! 🎾`);
    } else if (companion.energy <= 10) {
      actions.showNotification(`${companion.name} is too tired to play. Let them rest!`);
    } else {
      actions.showNotification('No toys available! Find some in the world.');
    }
  };

  const handleRest = () => {
    if (companion.energy < 100) {
      actions.updateCompanion({
        energy: Math.min(100, companion.energy + 30),
        mood: companion.energy < 30 ? 'sleepy' : companion.mood
      });
      actions.showNotification(`${companion.name} is resting... 💤`);
    } else {
      actions.showNotification(`${companion.name} is already full of energy!`);
    }
  };

  return (
    <View style={styles.container}>
      <ActionButton
        icon="🍎"
        label="Feed"
        count={getAppleCount()}
        onPress={handleFeed}
        disabled={!canFeed()}
        color="#FF6B6B"
      />
      
      <ActionButton
        icon="🎾"
        label="Play"
        count={getBallCount()}
        onPress={handlePlay}
        disabled={!canPlay()}
        color="#4ECDC4"
      />
      
      <ActionButton
        icon="💤"
        label="Rest"
        onPress={handleRest}
        disabled={companion.energy >= 100}
        color="#9B59B6"
      />
    </View>
  );
}

function ActionButton({ icon, label, count, onPress, disabled, color }) {
  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        { backgroundColor: disabled ? '#BDC3C7' : color },
        disabled && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.buttonContent}>
        <Text style={styles.buttonIcon}>{icon}</Text>
        <Text style={[styles.buttonLabel, disabled && styles.disabledText]}>
          {label}
        </Text>
        {count !== undefined && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonContent: {
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  disabledText: {
    color: '#7F8C8D',
  },
  countBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  countText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});