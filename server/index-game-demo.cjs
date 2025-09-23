// Minimal CommonJS game demo server to avoid ESM/ts-node loader issues
const express = require('express');
const path = require('path');
const { createServer } = require('http');
const { initGameWS, getGameMetrics } = require('./consciousness/game/EnhancedGameWebSocket.cjs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static assets from /public (game-demo.html, game-demo.js)
app.use(express.static(path.resolve(process.cwd(), 'public')));

// Friendly route for the demo UI
app.get('/gamedemo', (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'public', 'game-demo.html'));
});

// Friendly alias: /game serves the generative web client
app.get('/game', (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'public', 'game', 'index.html'));
});

// Metrics for HUD
app.get('/api/game/metrics', (_req, res) => {
  try {
    res.json({ ok: true, metrics: getGameMetrics() });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || 'failed' });
  }
});

const server = createServer(app);
initGameWS(server);

// Demo bridges: hook reality generator + template companion AI for chat
try {
  const startReality = require('./consciousness/reality/RealityGeneratorBridge.cjs');
  startReality();
} catch {}
try {
  // Lightweight companion chat bridge for demo
  const eventBus = require('./consciousness/core/ConsciousnessEventBus.cjs');
  eventBus.on('companion:generate_response', (data) => {
    const msg = (data && data.context && data.context.details && data.context.details.message) ? String(data.context.details.message) : '';
    const echo = msg ? `I hear you: ${msg}` : 'Hello there! I am listening.';
    try {
      if (data && data.ws) {
        data.ws.send(JSON.stringify({ type: 'companion:ai_message', companionId: data?.companion?.id, message: echo, mood: 'friendly', timestamp: Date.now() }));
      }
    } catch {}
  });
} catch {}

const port = Number(process.env.PORT || 5000);
server.listen({ port, host: '0.0.0.0' }, () => {
  console.log(`[game-demo] serving on port ${port}`);
});
