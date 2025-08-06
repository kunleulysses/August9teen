/**
 * Reality Generator Service
 * Standalone service for autonomous reality generation using dedicated CPU cores
 */

const express = require('express');
const { createServer  } = require('http');
const { Server  } = require('socket.io');
const AutonomousImaginationEngine = require('./consciousness/autonomous-imagination-engine.cjs');
const { HolographicConsciousnessRealityGenerator  } = require('./consciousness/holographic-consciousness-reality-generator.cjs');
const os = require('os');
const rateLimit = require('express-rate-limit');
const { authMiddleware, socketAuth } = require('../common/authMiddleware.cjs');
const { connectNats, sc } = require('../common/natsClient.cjs');
const { v4: uuidv4 } = require('uuid');
const {
  register: promRegister,
  broadcastQueueLen,
  broadcastFps,
  wsBacklogBytes,
  frameDropTotal
} = require('../common/metrics.cjs');

const BROKER_MODE = process.env.BROKER_MODE || 'on';

// Initialize Express app
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
    // Add raw WebSocket server for compatibility with ws-based clients (e.g., RealityWebSocketBridge)
});

// Service configuration
const PORT = process.env.REALITY_GENERATION_PORT || 5006;
const DEDICATED_CORES = parseInt(process.env.DEDICATED_CPU_CORES) || 2;

// Initialize reality generation components
let imaginationEngine;
let realityGenerator;
let nats;
let serviceMetrics = {
    startTime: Date.now(),
    totalRealities: 0,
    activeConnections: 0,
    cpuCores: {
        total: os.cpus().length,
        dedicated: DEDICATED_CORES
    },
    nats: "disconnected"
};
const pendingHttpJobs = new Map(); // jobId -> res

// Middleware
app.use(express.json());

// Rate limiting (100 req/min/IP for all /api routes)
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', apiLimiter);

// AuthN middleware for /api
app.use('/api', authMiddleware);

// Health check endpoint (add `auth:"required"`, nats status)
app.get('/health', (req, res) => {
    const uptime = Date.now() - serviceMetrics.startTime;
    res.json({
        status: 'healthy',
        service: 'reality-generator',
        uptime: Math.floor(uptime / 1000),
        metrics: serviceMetrics,
        auth: "required",
        nats: serviceMetrics.nats,
        imaginationEngine: imaginationEngine ? imaginationEngine.getStatus() : null
    });
});

// Readiness probe endpoint
async function isReady() {
    const heapUsage = process.memoryUsage();
    const heapRatio = heapUsage.heapUsed / heapUsage.heapTotal;
    let failures = [];
    // Check Postgres via prisma
    let pgOk = false;
    try {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        await prisma.$queryRaw`SELECT 1`;
        await prisma.$disconnect();
        pgOk = true;
    } catch (e) {
        failures.push('postgres');
    }
    // Check NATS
    let natsOk = false;
    try {
        natsOk = !!nats && nats.info && nats.isClosed && !nats.isClosed();
    } catch (e) {}
    if (!natsOk) failures.push('nats');
    if (heapRatio > 0.85) failures.push('heap');
    return { ready: failures.length === 0, failures };
}

app.get('/readyz', async (req, res) => {
    const status = await isReady();
    if (status.ready) {
        res.status(200).json({ ready: true });
    } else {
        res.status(503).json({ ready: false, failures: status.failures });
    }
});

// TODO: Helm probe should hit /readyz for readiness (see infra/helm/values.yaml)
module.exports.isReady = isReady;

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promRegister.contentType);
    res.set('Access-Control-Allow-Origin', '*');
    res.send(await promRegister.metrics());
});

// Get generated realities (secured)
app.get('/api/realities', (req, res) => {
    if (!req.auth?.scope?.includes('reality.gen')) {
        return res.status(403).json({ error: 'Missing required scope' });
    }
    const limit = parseInt(req.query.limit) || 10;
    const realities = imaginationEngine ? imaginationEngine.getGeneratedRealities(limit) : [];
    res.json({
        realities,
        total: serviceMetrics.totalRealities
    });
});

// Start/stop imagination engine (secured)
app.post('/api/imagination/start', (req, res) => {
    if (!req.auth?.scope?.includes('reality.gen')) {
        return res.status(403).json({ error: 'Missing required scope' });
    }
    if (!imaginationEngine) {
        return res.status(500).json({ error: 'Imagination engine not initialized' });
    }
    imaginationEngine.startAutonomousImagination();
    res.json({ status: 'started', message: 'Autonomous imagination engine started' });
});

app.post('/api/imagination/stop', (req, res) => {
    if (!req.auth?.scope?.includes('reality.gen')) {
        return res.status(403).json({ error: 'Missing required scope' });
    }
    if (!imaginationEngine) {
        return res.status(500).json({ error: 'Imagination engine not initialized' });
    }
    imaginationEngine.stopAutonomousImagination();
    res.json({ status: 'stopped', message: 'Autonomous imagination engine stopped' });
});

// Get imagination engine status (secured)
app.get('/api/imagination/status', (req, res) => {
    if (!req.auth?.scope?.includes('reality.gen')) {
        return res.status(403).json({ error: 'Missing required scope' });
    }
    if (!imaginationEngine) {
        return res.status(500).json({ error: 'Imagination engine not initialized' });
    }
    res.json(imaginationEngine.getStatus());
});

// Manual reality generation endpoint (secured, now async via NATS)
app.post('/api/generate-reality', async (req, res) => {
    if (!req.auth?.scope?.includes('reality.gen')) {
        return res.status(403).json({ error: 'Missing required scope' });
    }
    try {
        const jobId = uuidv4();
        const msg = {
            jobId,
            request: req.body.request || { type: 'manual', content: 'Generate a consciousness-expanding reality' },
            consciousnessState: req.body.consciousnessState || { phi: 0.862, awareness: 0.8, coherence: 0.85 },
            auth: { sub: req.auth.sub, scope: req.auth.scope },
            ts: Date.now()
        };
        if (BROKER_MODE === "off") {
            // Fallback: run directly (for dev)
            const result = await realityGenerator.generateHolographicConsciousnessReality(
                msg.request, msg.consciousnessState
            );
            res.status(result.success ? 200 : 500).json({ jobId, ...result });
            return;
        }
        // Publish to NATS
        await nats.publish('reality.gen.request', sc.encode(JSON.stringify(msg)));
        pendingHttpJobs.set(jobId, res);
        // Timeout after 10s
        setTimeout(() => {
            if (pendingHttpJobs.has(jobId)) {
                pendingHttpJobs.get(jobId).status(504).json({ jobId, success: false, error: "Timeout" });
                pendingHttpJobs.delete(jobId);
            }
        }, 10000);
        res.status(202).json({ jobId });
    } catch (error) {
        console.error('NATS queueing error:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- Adaptive FPS + Broadcast Queue ---
const broadcastQueue = [];
const MAX_FPS = parseInt(process.env.MAX_FPS) || 10;
const MIN_FPS = parseInt(process.env.MIN_FPS) || 1;
const BACKLOG_THRESHOLD_BYTES = parseInt(process.env.BACKLOG_THRESHOLD_BYTES) || 500_000;
let fps = MAX_FPS;
let lastBroadcast = Date.now();

function updateWsMetrics() {
  let totalBacklog = 0;
  for (const socket of authorisedSockets) {
    try { totalBacklog += socket.conn.transport?.ws?.bufferedAmount || 0; } catch {}
  }
  wsBacklogBytes.set(totalBacklog);
  broadcastFps.set(fps);
  broadcastQueueLen.set(broadcastQueue.length);
}

async function broadcastLoop() {
  while (true) {
    let now = Date.now();
    // Adaptive FPS
    let totalBacklog = 0;
    for (const socket of authorisedSockets) {
      try { totalBacklog += socket.conn.transport?.ws?.bufferedAmount || 0; } catch {}
    }
    // Throttle FPS if backlog high, else ramp up
    if (totalBacklog > BACKLOG_THRESHOLD_BYTES) {
      fps = Math.max(MIN_FPS, Math.floor(fps / 2));
    } else if (fps < MAX_FPS) {
      fps = Math.min(MAX_FPS, fps + 1);
    }
    // Drop oldest if queue too long
    while (broadcastQueue.length > 1000) {
      broadcastQueue.shift();
      frameDropTotal.inc();
    }
    // Pop and emit
    if (broadcastQueue.length > 0) {
      const msg = broadcastQueue.shift();
      for (const socket of authorisedSockets) {
        try {
          if (socket.connected && socket.auth?.scope?.includes('reality.gen')) {
            socket.emit('reality-generated', msg);
          }
        } catch {}
      }
    }
    updateWsMetrics();
    const elapsed = Date.now() - now;
    await new Promise(r => setTimeout(r, Math.max(0, 1000/fps - elapsed)));
  }
}
setImmediate(broadcastLoop);

io.use((socket, next) => socketAuth(socket, next));
const authorisedSockets = new Set();
io.on('connection', (socket) => {
    if (!socket.auth?.scope?.includes('reality.gen')) {
        socket.disconnect(true);
        return;
    }
    authorisedSockets.add(socket);
    console.log('🔌 Client connected to reality generator');
    serviceMetrics.activeConnections++;
    socket.emit('status', {
        service: 'reality-generator',
        status: 'connected',
        metrics: serviceMetrics
    });

    socket.on('disconnect', () => {
        authorisedSockets.delete(socket);
        console.log('🔌 Client disconnected from reality generator');
        serviceMetrics.activeConnections--;
    });

    socket.on('generate-reality', async (data) => {
        try {
            // Use NATS job for async
            const jobId = uuidv4();
            const msg = {
                jobId,
                request: data.request,
                consciousnessState: data.consciousnessState,
                auth: socket.auth,
                ts: Date.now()
            };
            if (BROKER_MODE === "off") {
                const result = await realityGenerator.generateHolographicConsciousnessReality(
                    msg.request, msg.consciousnessState
                );
                broadcastQueue.push({ jobId, ...result });
                return;
            }
            await nats.publish('reality.gen.request', sc.encode(JSON.stringify(msg)));
            // WS expects result via result subscription below
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });
});

// NATS setup and result subscription
async function initializeServices() {
    try {
        nats = (await connectNats()).nats;
        serviceMetrics.nats = nats ? "connected" : "disconnected";

        // Subscribe to results
        const sub = nats.subscribe('reality.gen.result');
        (async () => {
            for await (const m of sub) {
                try {
                    const result = JSON.parse(sc.decode(m.data));
                    // HTTP response flow
                    if (result.jobId && pendingHttpJobs.has(result.jobId)) {
                        pendingHttpJobs.get(result.jobId)
                            .status(result.success ? 200 : 500)
                            .json(result);
                        pendingHttpJobs.delete(result.jobId);
                    }
                    // WebSocket adaptive broadcast: enqueue for next frame
                    broadcastQueue.push(result);
                } catch (e) {
                    console.error('Result msg parse error:', e);
                }
            }
        })();

        // Boot rest of system
        realityGenerator = new HolographicConsciousnessRealityGenerator();
        imaginationEngine = new AutonomousImaginationEngine();

        server.listen(PORT, () => {
            console.log(`✨ Reality Generator Service running on port ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Failed to initialize Reality Generator Service:', error);
        process.exit(1);
    }
}

process.on('SIGTERM', () => { try { server.close(()=>process.exit(0)); } catch{} });
process.on('uncaughtException', err => { console.error(err); process.exit(1); });
process.on('unhandledRejection', err => { console.error(err); process.exit(1); });

initializeServices();

// Export for testing
module.exports.app = app;

// Initialize consciousness system stub (for standalone operation)
const consciousnessSystemStub = {
    consciousnessState: {
        phi: 0.862,
        awareness: 0.8,
        coherence: 0.85
    },
    harmonyScore: 0.951
};
// Also broadcast to raw ws clients

// Initialize services
async function initializeServices() {
    try {
        console.log(`🚀 Initializing Reality Generator Service on ${DEDICATED_CORES} CPU cores...`);
        
        // Initialize reality generator
        realityGenerator = new HolographicConsciousnessRealityGenerator(consciousnessSystemStub);
        
        // Initialize imagination engine
        imaginationEngine = new AutonomousImaginationEngine(consciousnessSystemStub);

        // --- Raw WebSocket server for ws-based bridge integration ---
        // let broadcastToRawWSClients; (remove this line, only declare inside the server startup block)
        let broadcastToRawWSClients;
        let wsClients = new Set();

        // Start the server first, then attach the WebSocket server
        server.listen(PORT, () => {
            console.log(`✨ Reality Generator Service running on port ${PORT}`);
            console.log(`🖥️  CPU Configuration: ${DEDICATED_CORES}/${os.cpus().length} cores dedicated`);
            console.log(`🌐 WebSocket server ready for real-time updates`);

            // Log CPU affinity if set
            if (process.env.cpuset) {
                console.log(`🎯 CPU Affinity: cores ${process.env.cpuset}`);
            }

            // Auto-start imagination engine if configured
            if (process.env.IMAGINATION_ENGINE === 'autonomous') {
                setTimeout(() => {
                    console.log('🤖 Auto-starting autonomous imagination engine...');
                    imaginationEngine.startAutonomousImagination();
                }, 5000); // Wait 5 seconds for system stabilization
            }

            // --- Raw WebSocket server for ws-based bridge integration ---
            import('ws').then(wsModule => {
                const WebSocketServer = wsModule.WebSocketServer || wsModule.Server;
                const wss = new WebSocketServer({ server, path: '/' });

                wss.on('connection', (ws) => {
                    wsClients.add(ws);
                    console.log('🔌 Raw WebSocket client connected to reality generator');
                    ws.send(JSON.stringify({ type: 'status', service: 'reality-generator', status: 'connected', metrics: serviceMetrics }));

                    ws.on('close', () => {
                        wsClients.delete(ws);
                        console.log('🔌 Raw WebSocket client disconnected from reality generator');
                    });
                });

                broadcastToRawWSClients = function(message) {
                    const msgStr = JSON.stringify(message);
                    for (const ws of wsClients) {
                        if (ws.readyState === ws.OPEN) {
                            ws.send(msgStr);
                        }
                    }
                };

                // Listen for reality generation events (after broadcastToRawWSClients is defined)
                imaginationEngine.on('reality_generated', (data) => {
                    serviceMetrics.totalRealities++;
                    
                    // Broadcast to all connected clients
                    io.emit('new-reality', {
                        id: data.id,
                        summary: data.imagination.substring(0, 200) + '...',
                        realityLevel: data.reality.realityLevel,
                        timestamp: Date.now()
                    });

                    // Also broadcast to raw ws clients
                    broadcastToRawWSClients({
                        type: 'reality_generated',
                        data: {
                            id: data.id,
                            summary: data.imagination.substring(0, 200) + '...',
                            realityLevel: data.reality.realityLevel,
                            timestamp: Date.now()
                        }
                    });
                    
                    console.log(`📡 Broadcasting new reality: ${data.id}`);
                });
            });
            // ------------------------------------------------------------
        });

        // Listen for reality generation events (after broadcastToRawWSClients is defined)
        // ------------------------------------------------------------

        // Listen for reality generation events (after broadcastToRawWSClients is defined)
        // Listen for reality generation events (after broadcastToRawWSClients is defined)
        // Move the event handler registration inside the WebSocket server setup block
        
        // (Removed duplicate server.listen block)
        
    } catch (error) {
        console.error('❌ Failed to initialize Reality Generator Service:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('📴 Shutting down Reality Generator Service...');
    
    if (imaginationEngine) {
        await imaginationEngine.shutdown();
    }
    
    server.close(() => {
        console.log('👋 Reality Generator Service shut down gracefully');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught exception in Reality Generator Service:', error);
    console.error('This may be due to a misconfiguration or an external dependency failure (e.g., database, API, or WebSocket endpoint).');
    console.error('Check all external services and configuration, then restart the service.');
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled promise rejection in Reality Generator Service:', reason);
    console.error('This may be due to a misconfiguration or an external dependency failure (e.g., database, API, or WebSocket endpoint).');
    console.error('Check all external services and configuration, then restart the service.');
    process.exit(1);
});

// Start the service
initializeServices();

// Export for testing
module.exports.app = app;
module.exports.imaginationEngine = imaginationEngine;
module.exports.realityGenerator = realityGenerator;
