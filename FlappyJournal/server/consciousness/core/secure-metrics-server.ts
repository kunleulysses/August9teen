import express from 'express';
import client from 'prom-client';
import { createServer } from 'http';
import WebSocket from 'ws';
import { createAuthMetrics } from '../../auth/authMetrics.cjs';
import { createWsAuth } from '../../auth/wsAuth.cjs';
import SpiralMemoryFacade from './SpiralMemoryFacade';

// Singleton instance (imported, not re-initialized)
const spiral = SpiralMemoryFacade;

// Prometheus metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Spiral Memory metrics
const memoryGauge = new client.Gauge({
  name: 'spiral_memory_total',
  help: 'Total spiral memories by tier',
  labelNames: ['tier'],
  registers: [register]
});

const gcTotal = new client.Counter({
  name: 'spiral_gc_total',
  help: 'Total GC runs',
  registers: [register]
});

const gcLastMs = new client.Gauge({
  name: 'spiral_gc_last_ms',
  help: 'Last GC pause ms',
  registers: [register]
});

const spiralActiveSpirals = new client.Gauge({
  name: 'spiral_active_spirals',
  help: 'Active spiral count',
  registers: [register]
});

const memoryCoherence = new client.Gauge({
  name: 'spiral_memory_coherence',
  help: 'Spiral memory coherence',
  registers: [register]
});

const spiralStability = new client.Gauge({
  name: 'spiral_spiral_stability',
  help: 'Spiral stability',
  registers: [register]
});

const storeLatency = new client.Histogram({
  name: 'spiral_store_latency_ms',
  help: 'Store memory latency ms',
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000],
  registers: [register]
});

const gcPause = new client.Histogram({
  name: 'spiral_gc_pause_ms',
  help: 'GC pause ms',
  buckets: [1, 5, 10, 20, 50, 100, 200, 500],
  registers: [register]
});

// Authentication metrics
const metricsAuthAttempts = new client.Counter({
  name: 'spiral_metrics_auth_attempts_total',
  help: 'Total authentication attempts to metrics endpoint',
  labelNames: ['status'],
  registers: [register]
});

const rlAllowed = new client.Counter({
  name: 'spiral_store_allowed_total', help: 'Successful store ops', registers:[register]
});
const rlDenied  = new client.Counter({
  name: 'spiral_store_denied_total', help: 'Rate-limited store ops', registers:[register]
});
spiral.eventBus.on('rate_limit:violation', ()=> rlDenied.inc());
spiral.eventBus.on('spiralmemory:stored', ()=> rlAllowed.inc());

const gcBacklog = new client.Gauge({ name:'spiral_gc_backlog', help:'GC backlog size', registers:[register]});
const gcBudgetMs = new client.Gauge({ name:'spiral_gc_budget_ms', help:'GC budget ms', registers:[register]});
const gcForcedCollectTotal = new client.Counter({ name:'spiral_gc_forced_collect_total', help:'Total forced GC collections', registers:[register]});
spiral.eventBus.on('spiralmemory:gc_tick', (data) => {
    gcBacklog.set(data.remaining);
    gcBudgetMs.set(data.budgetMs);
    if (data.forced > 0) {
        gcForcedCollectTotal.inc(data.forced);
    }
});

const cbState = new client.Gauge({ name:'spiral_cb_state', help:'Circuit breaker state', labelNames:['backend'], registers:[register]});
const cbOpenTotal = new client.Counter({ name:'spiral_cb_open_total', help:'Total circuit breaker opens', labelNames:['backend'], registers:[register]});

const wsIdleDisc = new client.Counter({ name:'ws_idle_disconnect_total', help:'Idle timeouts', registers:[register]});
const wsPingMiss  = new client.Counter({ name:'ws_ping_missed_total', help:'Missed pongs', registers:[register]});

const rebuildCorrectedTotal = new client.Counter({ name:'spiral_rebuild_corrected_total', help:'Total corrected by rebuild', registers:[register]});

const entanglementLinksTotal = new client.Gauge({ name:'spiral_entanglement_links_total', help:'Total entanglement links', registers:[register]});
const entanglementLatencyMs = new client.Histogram({ name:'spiral_entanglement_latency_ms', help:'Entanglement latency ms', buckets:[1,2,5,10,25,50,100], registers:[register]});
spiral.eventBus.on('spiral:entanglement_links_total', (total) => entanglementLinksTotal.set(total));
spiral.eventBus.on('spiral:entanglement_latency_ms', (latency) => entanglementLatencyMs.observe(latency));

const secViol = new client.Counter({
  name:'security_violation_total',
  help:'Total runtime security policy violations'
});

const selectionDistance = new client.Histogram({ name:'spiral_selection_distance', help:'Spiral selection distance', buckets:[0,0.1,0.25,0.5,1], registers:[register]});
const selectionCreatedTotal = new client.Counter({ name:'spiral_selection_created_total', help:'Total new spirals created by selection', registers:[register]});
spiral.eventBus.on('spiral:selection_distance', (distance) => selectionDistance.observe(distance));
spiral.eventBus.on('spiral:selection_created', () => selectionCreatedTotal.inc());

const sigilCollisionTotal = new client.Counter({ name:'sigil_collision_total', help:'Total sigil collisions', registers:[register]});
spiral.eventBus.on('sigil:collision', () => sigilCollisionTotal.inc());

const redisTlsEnabled = new client.Gauge({ name:'redis_tls_enabled', help:'1 if TLS is enabled for Redis', registers:[register]});
if (spiral.arch.storage.constructor.name === 'RedisSpiralAdapter' && spiral.arch.storage.redis.options.tls) {
    redisTlsEnabled.set(1);
} else {
    redisTlsEnabled.set(0);
}

if (spiral.arch.storage.circuitBreaker) {
    Object.keys(spiral.arch.storage.circuitBreaker).forEach(method => {
        const breaker = spiral.arch.storage.circuitBreaker[method];
        breaker.on('open', () => {
            cbState.set({ backend: spiral.arch.storage.constructor.name }, 1);
            cbOpenTotal.inc({ backend: spiral.arch.storage.constructor.name });
            spiral.eventBus.emit('storage:circuit_open', { backend: spiral.arch.storage.constructor.name });
        });
        breaker.on('close', () => {
            cbState.set({ backend: spiral.arch.storage.constructor.name }, 0);
            spiral.eventBus.emit('storage:circuit_close', { backend: spiral.arch.storage.constructor.name });
        });
        breaker.on('halfOpen', () => {
            cbState.set({ backend: spiral.arch.storage.constructor.name }, 2);
        });
    });
}

const heapUsed = new client.Gauge({ name:'process_heap_bytes', help:'V8 heapUsed', registers:[register]});
const rss      = new client.Gauge({ name:'process_rss_bytes', help:'Resident Set Size', registers:[register]});
setInterval(()=>{ const m=process.memoryUsage(); heapUsed.set(m.heapUsed); rss.set(m.rss);},5000);

const latency = new client.Histogram({ name:'spiral_storage_latency_ms', labelNames:['method','backend'], buckets:[1,2,5,10,25,50,100]});
spiral.arch.storage.recordLatency = (method, ms) => {
    latency.observe({ method, backend: spiral.arch.storage.constructor.name === 'RedisSpiralAdapter' ? 'redis' : 'level' }, ms);
};

// Patch SpiralMemoryArchitecture to record metrics
const origStore = spiral.arch.storeMemory.bind(spiral.arch);
spiral.arch.storeMemory = async (...args: any[]) => {
  const t0 = Date.now();
  const res = await origStore(...args);
  storeLatency.observe(Date.now() - t0);
  return res;
};

const origGC = spiral.arch.performGarbageCollection.bind(spiral.arch);
spiral.arch.performGarbageCollection = async (timeBudget = 25) => {
  const t0 = Date.now();
  const res = await origGC(timeBudget);
  const ms = Date.now() - t0;
  gcPause.observe(ms);
  gcLastMs.set(ms);
  gcTotal.inc();
  return res;
};

// Update metrics before each scrape
register.setDefaultLabels({ app: 'spiral-memory' });
register.metrics = register.metrics.bind(register);

async function updateGauges() {
  const stats = spiral.arch.getMemoryStatistics();
  memoryGauge.set({ tier: 'active' }, stats.active);
  memoryGauge.set({ tier: 'warm' }, stats.warm);
  memoryGauge.set({ tier: 'cold' }, stats.cold);
  memoryGauge.set({ tier: 'archived' }, stats.archived);
  spiralActiveSpirals.set(stats.totalSpirals);
  memoryCoherence.set((spiral.arch.consciousnessMetrics?.memoryCoherence || 0));
  spiralStability.set((spiral.arch.consciousnessMetrics?.spiralStability || 0));
}

// Create Express app
const app = express();
const PORT = process.env.METRICS_PORT || 9099;

// Create authentication middleware
const metricsAuth = createAuthMetrics({
  secret: process.env.JWT_SECRET || 'dev-secret-change-me',
});

// Protected metrics endpoint
app.get('/metrics', metricsAuth, async (req, res) => {
  try {
    await updateGauges();
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    console.error('Error generating metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Spiral Explorer API endpoint: 3-D node projection (protected)
app.get('/api/spiral', metricsAuth, (req, res) => {
  try {
    const nodes = spiral.arch.spiralMemory
      ? Array.from(spiral.arch.spiralMemory.values()).map(m => ({
          id: m.id,
          x: (m.position && m.position.x) || 0,
          y: (m.position && m.position.y) || 0,
          z: (m.position && m.position.z) || 0,
          tenantId: m.tenantId || 'public',
          type: m.type,
          depth: m.depth,
          resonance: m.spiralMemoryResonance,
          lastAccessed: m.lastAccessed
        }))
      : [];
    res.json({ nodes });
  } catch (error) {
    console.error('Error fetching spiral data:', error);
    res.status(500).json({ error: 'Failed to fetch spiral data' });
  }
});

// Create HTTP server
const server = createServer(app);

// Create WebSocket server for real-time metrics
const wss = new WebSocket.Server({ noServer: true });

const wsAuth = createWsAuth({
  secret: process.env.JWT_SECRET || 'dev-secret-change-me',
  endpoint: 'metrics-ws',
});

// Handle WebSocket upgrades with authentication
server.on('upgrade', (request, socket, head) => {
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

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
  console.log(`New WebSocket connection from ${req.socket.remoteAddress}`);
  
  // Send initial metrics
  updateGauges().then(() => {
    ws.send(JSON.stringify({
      type: 'initial_metrics',
      data: {
        memory: {
          active: memoryGauge.labels({ tier: 'active' }).get(),
          warm: memoryGauge.labels({ tier: 'warm' }).get(),
          cold: memoryGauge.labels({ tier: 'cold' }).get(),
          archived: memoryGauge.labels({ tier: 'archived' }).get()
        },
        activeSpirals: spiralActiveSpirals.get(),
        memoryCoherence: memoryCoherence.get(),
        spiralStability: spiralStability.get()
      }
    }));
  });

  // Handle incoming messages (if any)
  ws.on('message', (message: WebSocket.RawData) => {
    try {
      const data = JSON.parse(message.toString());
      // Handle specific message types if needed
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log(`WebSocket connection closed from ${req.socket.remoteAddress}`);
  });
});


// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`SpiralMemory metrics server listening on http://localhost:${PORT}`);
    console.log(`- Metrics endpoint: http://localhost:${PORT}/metrics`);
    console.log(`- Health check: http://localhost:${PORT}/health`);
  });
}

export { register };
export default server;
