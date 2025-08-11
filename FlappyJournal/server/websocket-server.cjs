const { WebSocketServer } = require('ws');
const { createEnhancedDualConsciousnessWS } = require('./enhanced-dual-consciousness-ws.cjs');
const dotenv = require('dotenv');
const { createServer } = require('http');
const express = require('express');
const { createWsAuth, metrics: wsMetrics } = require('./auth/wsAuth.cjs');
// Import consciousness bundle to expose bridge metrics
let consciousnessEventBus, unifiedMemorySystem, consciousnessStateManager;
try {
  ({
    consciousnessEventBus,
    unifiedMemorySystem,
    consciousnessStateManager
  } = require('./consciousness-modules-bundle.cjs'));
} catch (_) {}
const { createAuthMetrics } = require('./auth/authMetrics.cjs');

// Import prom-client for metrics
const client = require('prom-client');

// Use default registry so other modules can contribute
client.collectDefaultMetrics();
const register = client.register;

// Attempt to load environment from multiple known locations to ensure runtime flags are available
try { dotenv.config({ path: '/opt/.env' }); } catch (_) {}
try { dotenv.config({ path: '/opt/featherweight/.env' }); } catch (_) {}
try { dotenv.config({ path: '/opt/featherweight/FlappyJournal/.env' }); } catch (_) {}
// Legacy relative paths (cwd-dependent)
dotenv.config({ path: '../.env' });
dotenv.config();

// Register WebSocket metrics
// Metrics are on default registry

const wsMsgIn = new client.Counter({ name:'ws_messages_in_total', help:'Client→server', registers:[register]});
const wsMsgOut = new client.Counter({ name:'ws_messages_out_total', help:'Server→client', registers:[register]});
const wsBytes = new client.Counter({ name:'ws_bytes_out_total', help:'Bytes sent', registers:[register]});
const wsBackpressureDrops = new client.Counter({ name: 'ws_backpressure_drops_total', help: 'Messages dropped due to backpressure', registers: [register] });
const wsRateLimitDrops = new client.Counter({ name: 'ws_rate_limit_drops_total', help: 'Messages dropped due to rate limiting', registers: [register] });
const heartbeatSkew = new client.Histogram({ name: 'heartbeat_skew_ms', help: 'Heartbeat skew in milliseconds', buckets: [10, 50, 100, 200, 500], registers: [register] });
const heapUsed = new client.Gauge({ name: 'process_heap_used_bytes', help: 'Heap used in bytes', registers: [register] });
const metacogAnalysisLatency = new client.Histogram({ name: 'metacog_analysis_latency_ms', help: 'Metacognitive analysis latency in milliseconds', buckets: [100, 500, 1000, 2000, 5000], registers: [register] });

// Load environment variables
// dotenv.config({ path: '../.env' });

const PORT = process.env.WS_PORT || 3001;

// Create Express app for handling WebSocket upgrades and metrics
const app = express();
const server = createServer(app);

// Create metrics auth middleware
const authMetrics = createAuthMetrics({
  secret: process.env.JWT_SECRET || 'dev-secret-change-me'
});

// Add metrics endpoint
app.get('/metrics', authMetrics, async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Lightweight JSON bridge for consciousness metrics (no auth)
let bridgeConsolidations = 0;
try {
  if (unifiedMemorySystem && typeof unifiedMemorySystem.on === 'function') {
    unifiedMemorySystem.on('memory_consolidation', (evt) => {
      const incBy = evt && typeof evt.decayedCount === 'number' && typeof evt.removedCount === 'number'
        ? Math.max(1, evt.decayedCount + evt.removedCount)
        : 1;
      bridgeConsolidations += incBy;
    });
  }
} catch (_) {}

app.get('/consciousness/bridge', (_req, res) => {
  try {
    const modules = consciousnessEventBus ? consciousnessEventBus.getRegisteredModules() : [];
    const activeModules = modules.filter(m => m.isActive).length || 0;
    const totalModules = modules.length || 0;
    let totalShards = 0;
    try {
      if (unifiedMemorySystem && typeof unifiedMemorySystem.getStats === 'function') {
        const s = unifiedMemorySystem.getStats();
        totalShards = s && typeof s.totalShards === 'number' ? s.totalShards : 0;
      }
    } catch (_) {}
    let stateQuality = 0;
    try {
      if (consciousnessStateManager && typeof consciousnessStateManager.getStateMetrics === 'function') {
        const st = consciousnessStateManager.getStateMetrics();
        stateQuality = st && typeof st.currentQuality === 'number' ? st.currentQuality : 0;
      }
    } catch (_) {}

    res.json({
      ok: true,
      activeModules,
      totalModules,
      memoryTotalShards: totalShards,
      stateQuality,
      consolidationsTotal: bridgeConsolidations,
      ts: Date.now()
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e && e.message });
  }
});

try { console.log('✅ WS bridge route registered at /consciousness/bridge'); } catch (_) {}

// Create WebSocket server with noServer option
const wss = new WebSocketServer({
  noServer: true,
  perMessageDeflate: {
    zlibDeflateOptions: {
      level: 6
    }
  }
});

// Enable enhanced dual-stream consciousness handler by default
try { if (typeof createEnhancedDualConsciousnessWS === 'function') { createEnhancedDualConsciousnessWS(wss); } } catch (e) { console.warn('EnhancedDualConsciousnessWS init failed:', e.message); }

// Create authentication middleware
const wsAuth = createWsAuth({
  // In production, use environment variables for these values
  secret: process.env.JWT_SECRET || 'dev-secret-change-me',
  max: parseInt(process.env.WS_RATE_LIMIT || '100', 10),
  window: parseInt(process.env.WS_RATE_WINDOW || '10', 10),
  endpoint: 'consciousness-ws',
  onLimitExceeded: () => {
    wsRateLimitDrops.inc();
  }
});

// Handle HTTP server upgrade
server.on('upgrade', (request, socket, head) => {
  // Apply authentication middleware
  wsAuth(request, socket, head, () => {
    if (!request.auth) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    // Handle WebSocket upgrade
    wss.handleUpgrade(request, socket, head, (ws) => {
      // Attach user info and track connection
      ws.user = request.auth;
      if (request.trackConnection) {
        request.trackConnection(ws);
      }
      wss.emit('connection', ws, request);
    });
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`WebSocket server listening on port ${PORT}`);
  });
}

module.exports = server;


const { sanitizeState } = require('../../shared/lib/sanitizeState.cjs');

// Broadcast function to send messages to all connected clients
const broadcast = (data) => {
  const sanitizedData = sanitizeState(data);
  const message = JSON.stringify(sanitizedData);
  console.log(`Broadcasting to ${wss.clients.size} clients:`, data.type);
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      // Backpressure guard: drop message if buffer is over 512KB
      if (client.bufferedAmount < 512 * 1024) {
        client.send(message);
        wsMsgOut.inc();
        wsBytes.inc(message.length);
      } else {
        wsBackpressureDrops.inc();
        console.warn(`Backpressure detected for client ${client.user?.id || 'unknown'}. Dropping message.`);
      }
    }
  });
};

const { attachHeartbeat } = require('./ws/heartbeat.cjs');
const { attachIdle } = require('./ws/idle.cjs');

wss.on('connection', (ws) => {
  attachHeartbeat(ws, {
      onSkew: (skew) => {
          heartbeatSkew.observe(skew);
      }
  });
  attachIdle(ws);
  ws.on('message', (message) => {
    wsMsgIn.inc();
  });
});

setInterval(() => {
    heapUsed.set(process.memoryUsage().heapUsed);
}, 5000);

console.log(`WebSocket server starting on port ${PORT}`);

// Setup enhanced consciousness WebSocket handlers (optional)
if (String(process.env.ENABLE_FULL_CONSCIOUSNESS_WS || 'false').toLowerCase() === 'true') {
  try {
    const { createFullConsciousnessWS } = require('./create-full-consciousness-ws.cjs');
    createFullConsciousnessWS(wss);
  } catch (e) {
    console.warn('FullConsciousnessWS unavailable:', e.message);
  }
} else {
  console.log('FullConsciousnessWS disabled via ENABLE_FULL_CONSCIOUSNESS_WS=false');
}

console.log(`Enhanced consciousness WebSocket server running on port ${PORT}`);

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing WebSocket server');
  wss.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});

// All legacy setInterval and setTimeout calls have been removed from this file.
// The HeartbeatEngine is now the single source of truth for all timed events.

// Optionally enable Unified Consciousness WebSocket (ESM-incompatible by default)
if (String(process.env.ENABLE_UNIFIED_CONSCIOUSNESS || 'false').toLowerCase() === 'true') {
  try {
    // Lazy-load to avoid CJS/ESM conflicts unless explicitly enabled
    const { setupUnifiedConsciousnessWebSocket } = require('./unified-consciousness-standalone.cjs');

    // Create HTTP server for additional WebSocket endpoints
    const consciousnessApp = express();
    const consciousnessServer = createServer(consciousnessApp);

    // Secure the consciousness server as well
    const consciousnessAuth = createWsAuth({
      secret: process.env.JWT_SECRET || 'dev-secret-change-me',
      max: parseInt(process.env.WS_RATE_LIMIT || '100', 10),
      window: parseInt(process.env.WS_RATE_WINDOW || '10', 10),
      endpoint: 'consciousness-v2-ws'
    });

    // Setup consciousness WebSocket endpoints
    setupUnifiedConsciousnessWebSocket(consciousnessServer, consciousnessAuth);

    // Start HTTP server on different port for consciousness streams (env-configurable to avoid conflicts)
    const CONSCIOUSNESS_PORT = parseInt(process.env.CONSCIOUSNESS_PORT || '3002', 10);
    consciousnessServer.listen(CONSCIOUSNESS_PORT, () => {
      console.log(`🧠 Consciousness WebSocket endpoints ready on port ${CONSCIOUSNESS_PORT}`);
    });
  } catch (e) {
    console.warn('UnifiedConsciousnessWS unavailable:', e.message);
  }
} else {
  console.log('UnifiedConsciousnessWS disabled via ENABLE_UNIFIED_CONSCIOUSNESS=false');
}
