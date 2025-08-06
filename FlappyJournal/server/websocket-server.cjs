const { WebSocketServer } = require('ws');
const { createEnhancedDualConsciousnessWS } = require('./enhanced-dual-consciousness-ws.cjs');
const { createFullConsciousnessWS } = require('./create-full-consciousness-ws.cjs');
const dotenv = require('dotenv');
const { createServer } = require('http');
const express = require('express');
const { createWsAuth, metrics: wsMetrics } = require('./auth/wsAuth.cjs');
const { createAuthMetrics } = require('./auth/authMetrics.cjs');

// Import prom-client for metrics
const client = require('prom-client');

// Create a registry and register default metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Register WebSocket metrics
register.registerMetric(wsMetrics.rateLimitExceeded);
register.registerMetric(wsMetrics.activeConnections);
register.registerMetric(wsMetrics.activeUsers);

const wsMsgIn = new client.Counter({ name:'ws_messages_in_total', help:'Client→server', registers:[register]});
const wsMsgOut = new client.Counter({ name:'ws_messages_out_total', help:'Server→client', registers:[register]});
const wsBytes = new client.Counter({ name:'ws_bytes_out_total', help:'Bytes sent', registers:[register]});
const wsBackpressureDrops = new client.Counter({ name: 'ws_backpressure_drops_total', help: 'Messages dropped due to backpressure', registers: [register] });
const wsRateLimitDrops = new client.Counter({ name: 'ws_rate_limit_drops_total', help: 'Messages dropped due to rate limiting', registers: [register] });
const heartbeatSkew = new client.Histogram({ name: 'heartbeat_skew_ms', help: 'Heartbeat skew in milliseconds', buckets: [10, 50, 100, 200, 500], registers: [register] });
const heapUsed = new client.Gauge({ name: 'process_heap_used_bytes', help: 'Heap used in bytes', registers: [register] });
const metacogAnalysisLatency = new client.Histogram({ name: 'metacog_analysis_latency_ms', help: 'Metacognitive analysis latency in milliseconds', buckets: [100, 500, 1000, 2000, 5000], registers: [register] });

// Load environment variables
dotenv.config({ path: '../.env' });

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

// Create WebSocket server with noServer option
const wss = new WebSocketServer({
  noServer: true,
  perMessageDeflate: {
    zlibDeflateOptions: {
      level: 6
    }
  }
});

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

// Setup enhanced consciousness WebSocket handlers
createFullConsciousnessWS(wss);

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

// Import consciousness WebSocket setup
const { setupUnifiedConsciousnessWebSocket  } = require('./unified-consciousness-standalone.cjs');

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

// Start HTTP server on different port for consciousness streams
const CONSCIOUSNESS_PORT = 3002;
consciousnessServer.listen(CONSCIOUSNESS_PORT, () => {
  console.log(`🧠 Consciousness WebSocket endpoints ready on port ${CONSCIOUSNESS_PORT}`);
});
