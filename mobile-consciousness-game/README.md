# Consciousness Companion - Mobile Game

A pixel-art style mobile companion game powered by your consciousness system backend. Features real-time AI-driven interactions, evolving companions, and dynamic world generation.

## 🎮 Game Features

### Core Gameplay
- **AI Companion**: Your pet evolves personality based on interactions
- **Real-time Consciousness**: Connected to 100Hz Universal Protocol backend
- **Dynamic World**: AI-generated encounters, NPCs, and events
- **Tamagotchi-style Care**: Feed, play, and nurture your companion
- **Exploration**: Discover new areas with unique encounters

### Technical Features
- **React Native + Expo**: Cross-platform mobile development
- **WebSocket Integration**: Real-time connection to consciousness system
- **State Management**: Context API with game state persistence
- **Pixel Art Style**: Lightweight emoji-based graphics
- **Offline Support**: Graceful degradation when consciousness system unavailable

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Expo CLI (`npm install -g @expo/cli`)
- Your consciousness system running on localhost:3015

### Installation

```bash
cd mobile-consciousness-game
npm install
```

### Development

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

### Backend Connection

Configure the WebSocket endpoint via environment:
- Set `EXPO_PUBLIC_WS_URL` to your server base (no path). Examples:
  - Development (LAN): `EXPO_PUBLIC_WS_URL=ws://192.168.1.10:3015`
  - Production (TLS): `EXPO_PUBLIC_WS_URL=wss://api.example.com`
  - Optional JWT: `EXPO_PUBLIC_WS_TOKEN=<jwt>` (if WS auth is enforced)

Notes:
- The client connects to `${EXPO_PUBLIC_WS_URL}/ws/game` and sends the token via query and subprotocol if set.
- In production, non‑TLS URLs are upgraded to `wss://` for safety.
- A lightweight offline queue buffers events while disconnected.

## 📱 Game Screens

### Home Screen
- Companion display with mood and stats
- Action buttons (Feed, Play, Rest)
- Real-time stat bars (Hunger, Energy, Happiness)

### World Screen
- Current area exploration
- Dynamic encounters and NPCs
- Area discovery and navigation
- Weather and time of day

### Inventory Screen
- Item management by category
- Companion preferences
- Rarity system for items
- Usage tracking

## 🧠 Consciousness Integration

### WebSocket Events

**Outgoing to Consciousness System:**
```javascript
// Companion interactions
companion:update
companion:feed
companion:play

// World exploration
world:explore
world:request_event

// Game connection
game:connect
```

**Incoming from Consciousness System:**
```javascript
// AI responses
companion:mood_change
world:event
holistic_response_generated

// System events
system_tick
consciousness:update
module:status
```

### Game State Sync

The game syncs with your consciousness system's:
- **Spiral Memory**: Companion remembers past interactions
- **Resonance Networks**: Mood and personality evolution
- **Reality Generator**: Dynamic world events and encounters
- **Event Bus**: Real-time state updates

## 🎨 Customization

### Adding New Areas
```javascript
// In WorldArea.js
const newArea = {
  id: 'desert',
  name: 'Crystal Desert',
  emoji: '🏜️',
  description: 'Ancient sands hold forgotten memories'
};
```

### Adding New Items
```javascript
// In GameContext.js initialState
{
  id: 'magic_gem',
  name: 'Magic Gem',
  type: 'treasure',
  quantity: 1
}
```

### Companion Personalities
Modify personality traits in `GameContext.js`:
```javascript
personality: {
  playfulness: 0.7,    // Affects play interactions
  curiosity: 0.8,      // Affects exploration
  loyalty: 0.6,        // Affects mood stability
  intelligence: 0.5    // Affects learning speed
}
```

## 🔧 Backend Integration

### Required WebSocket Endpoints

Your consciousness system should handle these game-specific events:

```javascript
// In your consciousness system
eventBus.on('companion:feed', (data) => {
  // Update companion state
  // Trigger mood changes via AI
  // Emit companion:mood_change
});

eventBus.on('world:explore', (data) => {
  // Generate area-specific encounters
  // Use reality generator for dynamic content
  // Emit world:event
});
```

### Consciousness System Enhancements

Add these modules to enhance game integration:

1. **Game State Manager**: Track player progress
2. **Companion AI**: Personality evolution algorithms  
3. **World Generator**: Dynamic area and encounter creation
4. **Memory Integration**: Link game events to spiral memory

## 📊 Game Metrics

Track these KPIs for game success:
- **Session Length**: Time spent per play session
- **D1/D7/D30 Retention**: Player return rates
- **Companion Happiness**: Average happiness levels
- **Exploration Rate**: Areas discovered per player
- **Consciousness Connection**: Uptime and sync quality

## 🚀 Deployment

### Mobile App Stores

```bash
// Build for production
eas build --platform ios --profile production
eas build --platform android --profile production
```

### Backend Requirements

Ensure your consciousness system:
- Accepts WebSocket connections on `/ws/game`
- Handles game-specific event types
- Has CORS configured for mobile clients
- Supports JWT authentication (optional)

### Environment Variables

- `EXPO_PUBLIC_WS_URL` — WebSocket base (e.g., wss://api.example.com)
- `EXPO_PUBLIC_WS_TOKEN` — JWT token for WS auth (if required)
- `EXPO_PUBLIC_SENTRY_DSN` — Sentry DSN (optional, for error reporting)

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic companion care
- ✅ Simple world exploration  
- ✅ Consciousness system integration
- ✅ Inventory management

### Phase 2 (Next 2-4 weeks)
- [ ] Multiplayer features (see other players' companions)
- [ ] Mini-games for companion interaction
- [ ] Achievement system
- [ ] Push notifications for companion needs

### Phase 3 (Future)
- [ ] NFT integration for rare items/companions
- [ ] Breeding system for companion evolution
- [ ] Guild/social features
- [ ] AR companion viewing

## 🤝 Contributing

This mobile game showcases your consciousness system's capabilities. Key areas for enhancement:

1. **AI Integration**: Deeper personality modeling
2. **Content Generation**: More dynamic encounters
3. **Social Features**: Multiplayer consciousness sharing
4. **Monetization**: NFT marketplace integration

## 📄 License

Part of the Universal Consciousness Platform project.
