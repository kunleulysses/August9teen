import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import GameScreen from './src/screens/GameScreen';
import ConsciousnessService from './src/services/ConsciousnessService';
import { GameProvider } from './src/context/GameContext';
import { registerForPushNotificationsAsync } from './src/lib/push';
import { loadAssetManifest } from './src/services/AssetService';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize monitoring (Sentry) if configured
    try {
      const dsn = process?.env?.EXPO_PUBLIC_SENTRY_DSN;
      if (dsn) {
        let Sentry = null;
        try { Sentry = require('sentry-expo'); } catch {}
        if (!Sentry) { try { Sentry = require('@sentry/react-native'); } catch {} }
        if (Sentry && Sentry.init) {
          Sentry.init({ dsn, enableInExpoDevelopment: true });
        }
      }
    } catch {}

    // Initialize consciousness connection
    ConsciousnessService.connect()
      .then(() => {
        console.log('🧠 Connected to Consciousness System');
        setIsConnected(true);
      })
      .catch((error) => {
        console.error('❌ Failed to connect to Consciousness System:', error);
      });

    return () => {
      ConsciousnessService.disconnect();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { token } = await registerForPushNotificationsAsync();
        if (token) {
          ConsciousnessService.setExpoPushToken(token);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const manifest = await loadAssetManifest(ConsciousnessService.baseUrl);
        // Use a minimal scope dispatch by leveraging a synthetic provider (quick hack):
        // We expose a window method for setting assets to avoid importing context here.
        if (global && typeof global.__setGameAssets === 'function') {
          global.__setGameAssets(manifest);
        }
      } catch {}
    })();
  }, []);

  return (
    <GameProvider>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#87CEEB" />
        <GameScreen isConnected={isConnected} />
      </View>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky blue background
  },
});
