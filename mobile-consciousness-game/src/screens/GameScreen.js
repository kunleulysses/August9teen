import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useGame } from '../context/GameContext';
import CompanionArea from '../components/CompanionArea';
import ActionBar from '../components/ActionBar';
import StatusBar from '../components/StatusBar';
import NavigationTabs from '../components/NavigationTabs';
import NotificationOverlay from '../components/NotificationOverlay';
import WorldArea from '../components/WorldArea';
import InventoryScreen from '../components/InventoryScreen';
import JournalScreen from './JournalScreen';
import ResonanceScreen from './ResonanceScreen';
import EventsScreen from './EventsScreen';
import LabsScreen from './LabsScreen';
import SanctuaryScreen from './SanctuaryScreen';
import BattleArenaScreen from './BattleArenaScreen';
import LegendaryBar from '../components/LegendaryBar';
import FxOverlay from '../components/FxOverlay';
import BuffHUD from '../components/BuffHUD';
import ParallaxBackground from '../components/ParallaxBackground';

export default function GameScreen({ isConnected }) {
  const { state } = useGame();
  const { currentScreen } = state.ui;

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'world':
        return <WorldArea />;
      case 'inventory':
        return <InventoryScreen />;
      case 'journal':
        return <JournalScreen />;
      case 'resonance':
        return <ResonanceScreen />;
      case 'events':
        return <EventsScreen />;
      case 'labs':
        return <LabsScreen />;
      case 'sanctuary':
        return <SanctuaryScreen />;
      case 'arena':
        return <BattleArenaScreen />;
      case 'home':
      default:
        return (
          <>
            <CompanionArea />
            <ActionBar />
            <LegendaryBar />
            <BuffHUD />
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar isConnected={isConnected} />
      
      <View style={styles.gameArea}>
        <ParallaxBackground />
        {renderCurrentScreen()}
        <FxOverlay />
      </View>
      
      <NavigationTabs />
      <NotificationOverlay />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  gameArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
