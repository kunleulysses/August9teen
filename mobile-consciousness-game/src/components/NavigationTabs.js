import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function NavigationTabs() {
  const { state, actions } = useGame();
  const { currentScreen } = state.ui;

  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'world', label: 'Explore', icon: '🌍' },
    { id: 'inventory', label: 'Items', icon: '🎒' },
    { id: 'journal', label: 'Journal', icon: '📓' },
    { id: 'resonance', label: 'Resonance', icon: '🌀' },
    { id: 'events', label: 'Events', icon: '🎭' },
    { id: 'labs', label: 'Labs', icon: '🔬' },
    { id: 'sanctuary', label: 'Sanctuary', icon: '💠' },
    { id: 'arena', label: 'Arena', icon: '⚔️' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            currentScreen === tab.id && styles.activeTab
          ]}
          onPress={() => actions.setScreen(tab.id)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabIcon,
            currentScreen === tab.id && styles.activeTabIcon
          ]}>
            {tab.icon}
          </Text>
          <Text style={[
            styles.tabLabel,
            currentScreen === tab.id && styles.activeTabLabel
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tab: {
    flexBasis: '25%',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  activeTab: {
    backgroundColor: '#3498DB',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  activeTabIcon: {
    // Icons stay the same color
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
});
