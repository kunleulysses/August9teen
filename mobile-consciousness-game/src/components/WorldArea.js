import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useGame } from '../context/GameContext';

export default function WorldArea() {
  const { state, actions } = useGame();
  const { world, companion } = state;
  const [availableAreas, setAvailableAreas] = useState([
    { id: 'town', name: 'Peaceful Town', emoji: '🏘️', description: 'A quiet town where your companion feels safe' },
    { id: 'forest', name: 'Mystic Forest', emoji: '🌲', description: 'Ancient trees whisper secrets' },
    { id: 'beach', name: 'Crystal Beach', emoji: '🏖️', description: 'Waves carry memories from distant lands' },
    { id: 'mountains', name: 'Sky Mountains', emoji: '⛰️', description: 'Peaks that touch the consciousness realm' },
  ]);

  const [encounters, setEncounters] = useState([]);

  useEffect(() => {
    // Generate random encounters based on current area
    generateEncounters();
  }, [world.currentArea]);

  const generateEncounters = () => {
    const areaEncounters = {
      town: [
        { type: 'npc', name: 'Wise Elder', emoji: '👴', dialogue: 'Your companion grows stronger with each kind act.' },
        { type: 'item', name: 'Fresh Apple', emoji: '🍎', description: 'A crisp apple from the town market' },
      ],
      forest: [
        { type: 'creature', name: 'Forest Sprite', emoji: '🧚', dialogue: 'The trees remember your companion\'s laughter.' },
        { type: 'item', name: 'Magic Acorn', emoji: '🌰', description: 'Glows with ancient forest energy' },
      ],
      beach: [
        { type: 'creature', name: 'Sea Guardian', emoji: '🐚', dialogue: 'The ocean\'s wisdom flows through your bond.' },
        { type: 'item', name: 'Pearl of Memory', emoji: '🦪', description: 'Contains echoes of past adventures' },
      ],
      mountains: [
        { type: 'creature', name: 'Sky Dragon', emoji: '🐉', dialogue: 'Your companion\'s spirit soars like the wind.' },
        { type: 'item', name: 'Star Crystal', emoji: '💎', description: 'Crystallized starlight from the peaks' },
      ],
    };

    setEncounters(areaEncounters[world.currentArea] || []);
  };

  const handleAreaChange = (area) => {
    actions.exploreArea(area.id);
    actions.showNotification(`Exploring ${area.name}... ${area.emoji}`);
    
    // Small energy cost for exploration
    actions.updateCompanion({
      energy: Math.max(0, companion.energy - 5)
    });
  };

  const handleEncounter = (encounter) => {
    if (encounter.type === 'item') {
      // Add item to inventory (simplified)
      actions.showNotification(`Found ${encounter.name}! ${encounter.emoji}`);
      
      // Give companion happiness for discoveries
      actions.updateCompanion({
        happiness: Math.min(100, companion.happiness + 10),
        experience: companion.experience + 10
      });
    } else {
      // NPC or creature interaction
      actions.showNotification(encounter.dialogue);
      
      // Boost companion's mood from social interaction
      actions.updateCompanion({
        happiness: Math.min(100, companion.happiness + 5),
        mood: 'happy'
      });
    }
  };

  const assets = state.assets?.manifest || {};
  const getAreaIcon = (areaId) => assets.areas?.[areaId]?.icon || null;
  const getCurrentAreaInfo = () => availableAreas.find(area => area.id === world.currentArea) || availableAreas[0];

  const currentArea = getCurrentAreaInfo();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Current Area Display */}
      <View style={styles.currentAreaContainer}>
        {getAreaIcon(currentArea.id) ? (
          <Image source={{ uri: getAreaIcon(currentArea.id) }} style={{ width: 64, height: 64 }} resizeMode="contain" />
        ) : (
          <Text style={styles.currentAreaEmoji}>{currentArea.emoji}</Text>
        )}
        <Text style={styles.currentAreaName}>{currentArea.name}</Text>
        <Text style={styles.currentAreaDescription}>{currentArea.description}</Text>
      </View>

      {/* Weather and Time Display */}
      <View style={styles.environmentContainer}>
        <View style={styles.environmentItem}>
          <Text style={styles.environmentEmoji}>
            {world.weather === 'sunny' ? '☀️' : world.weather === 'rainy' ? '🌧️' : '☁️'}
          </Text>
          <Text style={styles.environmentText}>{world.weather}</Text>
        </View>
        <View style={styles.environmentItem}>
          <Text style={styles.environmentEmoji}>
            {world.timeOfDay === 'day' ? '🌅' : world.timeOfDay === 'night' ? '🌙' : '🌆'}
          </Text>
          <Text style={styles.environmentText}>{world.timeOfDay}</Text>
        </View>
      </View>

      {/* Encounters in Current Area */}
      <View style={styles.encountersContainer}>
        <Text style={styles.sectionTitle}>Discoveries</Text>
        {encounters.map((encounter, index) => (
          <TouchableOpacity
            key={index}
            style={styles.encounterCard}
            onPress={() => handleEncounter(encounter)}
            activeOpacity={0.7}
          >
            <Text style={styles.encounterEmoji}>{encounter.emoji}</Text>
            <View style={styles.encounterInfo}>
              <Text style={styles.encounterName}>{encounter.name}</Text>
              <Text style={styles.encounterDescription}>
                {encounter.description || encounter.dialogue}
              </Text>
            </View>
            <Text style={styles.encounterArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Available Areas to Explore */}
      <View style={styles.areasContainer}>
        <Text style={styles.sectionTitle}>Explore New Areas</Text>
        {availableAreas
          .filter(area => area.id !== world.currentArea)
          .map((area) => (
            <TouchableOpacity
              key={area.id}
              style={[
                styles.areaCard,
                world.discoveredAreas.includes(area.id) && styles.discoveredArea
              ]}
              onPress={() => handleAreaChange(area)}
              activeOpacity={0.7}
            >
              {getAreaIcon(area.id) ? (
                <Image source={{ uri: getAreaIcon(area.id) }} style={{ width: 40, height: 40 }} resizeMode="contain" />
              ) : (
                <Text style={styles.areaEmoji}>{area.emoji}</Text>
              )}
              <View style={styles.areaInfo}>
                <Text style={styles.areaName}>{area.name}</Text>
                <Text style={styles.areaDescription}>{area.description}</Text>
                {world.discoveredAreas.includes(area.id) && (
                  <Text style={styles.discoveredText}>✓ Discovered</Text>
                )}
              </View>
              <Text style={styles.areaArrow}>→</Text>
            </TouchableOpacity>
          ))}
      </View>

      {/* Companion Energy Warning */}
      {companion.energy < 20 && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            ⚠️ {companion.name} is getting tired from exploring. Consider resting!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  currentAreaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  currentAreaEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  currentAreaName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  currentAreaDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  environmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  environmentItem: {
    alignItems: 'center',
  },
  environmentEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  environmentText: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  encountersContainer: {
    marginBottom: 25,
  },
  encounterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F6F3',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  encounterEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  encounterInfo: {
    flex: 1,
  },
  encounterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  encounterDescription: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  encounterArrow: {
    fontSize: 18,
    color: '#27AE60',
  },
  areasContainer: {
    marginBottom: 20,
  },
  areaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  discoveredArea: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#27AE60',
  },
  areaEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  areaInfo: {
    flex: 1,
  },
  areaName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  areaDescription: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  discoveredText: {
    fontSize: 10,
    color: '#27AE60',
    fontWeight: '600',
    marginTop: 2,
  },
  areaArrow: {
    fontSize: 18,
    color: '#3498DB',
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
  },
});
