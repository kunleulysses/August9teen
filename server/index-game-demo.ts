import express from 'express';
import path from 'path';
import { createServer } from 'http';
// Import CJS module via default export in ESM context
import gameWS from './game-ws.cjs';
const { initGameWS, getGameMetrics } = gameWS as { initGameWS: (s: any) => any; getGameMetrics: () => any };

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static assets from /public (game-demo.html, game-demo.js)
app.use(express.static(path.resolve(process.cwd(), 'public')));

// Friendly route for the demo UI
app.get('/gamedemo', (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'public', 'game-demo.html'));
});

// Metrics for HUD
app.get('/api/game/metrics', (_req, res) => {
  try {
    res.json({ ok: true, metrics: getGameMetrics() });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'failed' });
  }
});

const server = createServer(app);
initGameWS(server);

const port = 5000;
server.listen({ port, host: '0.0.0.0' }, () => {
  console.log(`[game-demo] serving on port ${port}`);
});
