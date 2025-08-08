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
const { connect, StringCodec } = require('nats');
const { randomUUID } = require('crypto');
let Ajv;
try { Ajv = require('ajv'); } catch (_) { Ajv = null; }
let ajv, validateReqSchema, validateStateSchema;
try {
    if (Ajv) {
        ajv = new Ajv({ allErrors: true, strict: false });
        validateReqSchema = ajv.compile(require('./consciousness/schemas/reality-request.schema.json'));
        validateStateSchema = ajv.compile(require('./consciousness/schemas/consciousness-state.schema.json'));
    }
} catch (_) { /* ignore */ }
let promClient;
try { promClient = require('prom-client'); } catch (_) { promClient = null; }
// Spiral memory integration
let spiralMemory;
try { spiralMemory = require('./architect-4.0-spiral-memory.cjs').spiralMemory; } catch (_) { spiralMemory = null; }

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
const REALITY_FPS = parseInt(process.env.REALITY_FPS) || 10;
const REALITY_API_KEY = process.env.REALITY_API_KEY || null;
const REALITY_MAX_BACKLOG = parseInt(process.env.REALITY_MAX_BACKLOG || '1000', 10);
const REALITY_JOB_TIMEOUT_MS = parseInt(process.env.REALITY_JOB_TIMEOUT_MS || '30000', 10);
const REALITY_MIN_COHERENCE = parseFloat(process.env.REALITY_MIN_COHERENCE || '0.75');

// Initialize reality generation components
let imaginationEngine;
let realityGenerator;
let serviceMetrics = {
    startTime: Date.now(),
    totalRealities: 0,
    activeConnections: 0,
    droppedFrames: 0,
    currentFps: REALITY_FPS,
    cpuCores: {
        total: os.cpus().length,
        dedicated: DEDICATED_CORES
    }
};
const pendingJobs = new Map();
const sc = StringCodec();
let js;
const recentErrors = [];
const pushError = (msg) => { try { recentErrors.push({ ts: Date.now(), msg }); if (recentErrors.length > 100) recentErrors.shift(); } catch (_) {} };
const processedJobs = new Set();
const rememberProcessed = (id) => { try { processedJobs.add(id); if (processedJobs.size > 2000) { const it = processedJobs.values().next(); if (!it.done) processedJobs.delete(it.value); } } catch (_) {} };

let currentFps = REALITY_FPS;
let lastBroadcastTime = 0;

// Middleware
app.use(express.json());

// Prometheus metrics (optional)
let metrics = null;
if (promClient) {
    const register = new promClient.Registry();
    promClient.collectDefaultMetrics({ register });
    metrics = {
        genTotal: new promClient.Counter({ name: 'reality_generation_total', help: 'Total reality generations', labelNames: ['status'] }),
        genDuration: new promClient.Histogram({ name: 'reality_generation_duration_ms', help: 'Duration of reality generation', buckets: [25, 50, 100, 200, 500, 1000, 2000] }),
        wsConnections: new promClient.Gauge({ name: 'reality_ws_active_connections', help: 'Active WS connections' }),
        wsDroppedFrames: new promClient.Counter({ name: 'reality_ws_dropped_frames_total', help: 'Dropped WS frames due to backpressure' }),
        backlog: new promClient.Gauge({ name: 'reality_generation_backlog', help: 'Pending job backlog' })
    };
    Object.values(metrics).forEach(m => register.registerMetric(m));
    app.get('/metrics', (req, res) => {
        // Optional read protection with PROM_API_KEY
        const key = process.env.PROM_API_KEY;
        if (key && req.headers['x-api-key'] !== key) return res.status(401).send('unauthorized');
        res.set('Content-Type', register.contentType);
        register.metrics().then(body => res.end(body));
    });
}

// Simple API key guard
const requireApiKey = (req, res, next) => {
    if (!REALITY_API_KEY) return next();
    const hdr = req.headers['x-api-key'];
    if (hdr !== REALITY_API_KEY) return res.status(401).json({ error: 'unauthorized' });
    next();
};

// Simple rate limiter per key/IP (fixed window)
const rlState = new Map();
const WINDOW_MS = 60000; // 1 min
const MAX_REQ = parseInt(process.env.REALITY_RL_MAX_PER_MIN || '120', 10);
const rateLimit = (req, res, next) => {
    const key = REALITY_API_KEY ? (req.headers['x-api-key'] || 'anon') : req.ip;
    const now = Date.now();
    let rec = rlState.get(key);
    if (!rec || now - rec.start > WINDOW_MS) { rec = { start: now, count: 0 }; }
    rec.count++;
    rlState.set(key, rec);
    if (rec.count > MAX_REQ) return res.status(429).json({ error: 'rate_limited', retryAfter: Math.ceil((rec.start + WINDOW_MS - now)/1000) });
    next();
};

// Health check endpoint
app.get('/health', (req, res) => {
    const uptime = Date.now() - serviceMetrics.startTime;
    res.json({
        status: 'healthy',
        service: 'reality-generator',
        uptime: Math.floor(uptime / 1000),
        metrics: serviceMetrics,
        imaginationEngine: imaginationEngine ? imaginationEngine.getStatus() : null,
        backlog: pendingJobs.size
    });
});

// Get generated realities
app.get('/api/realities', requireApiKey, rateLimit, (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const realities = imaginationEngine ? imaginationEngine.getGeneratedRealities(limit) : [];
    res.json({
        realities,
        total: serviceMetrics.totalRealities
    });
});

// Start/stop imagination engine
app.post('/api/imagination/start', requireApiKey, rateLimit, (req, res) => {
    if (!imaginationEngine) {
        return res.status(500).json({ error: 'Imagination engine not initialized' });
    }
    
    imaginationEngine.startAutonomousImagination();
    res.json({ status: 'started', message: 'Autonomous imagination engine started' });
});

app.post('/api/imagination/stop', requireApiKey, rateLimit, (req, res) => {
    if (!imaginationEngine) {
        return res.status(500).json({ error: 'Imagination engine not initialized' });
    }
    
    imaginationEngine.stopAutonomousImagination();
    res.json({ status: 'stopped', message: 'Autonomous imagination engine stopped' });
});

// Get imagination engine status
app.get('/api/imagination/status', requireApiKey, rateLimit, (req, res) => {
    if (!imaginationEngine) {
        return res.status(500).json({ error: 'Imagination engine not initialized' });
    }
    
    res.json(imaginationEngine.getStatus());
});

// Admin endpoints: backlog and recent errors
app.get('/api/admin/reality/backlog', requireApiKey, (req, res) => {
    try {
        const ids = Array.from(pendingJobs.keys());
        res.json({ ok: true, backlog: pendingJobs.size, ids });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

app.get('/api/admin/reality/errors', requireApiKey, (req, res) => {
    try {
        res.json({ ok: true, errors: recentErrors.slice(-50) });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

// Admin console page
app.get('/admin/reality', (req, res) => {
    try {
        res.sendFile(require('path').resolve(process.cwd(), 'public', 'admin-reality.html'));
    } catch (e) {
        res.status(500).send('admin page unavailable');
    }
});

// Manual reality generation endpoint
app.post('/api/generate-reality', requireApiKey, rateLimit, async (req, res) => {
    try {
        const { request, consciousnessState } = req.body;
        // Basic validation
        if (pendingJobs.size >= REALITY_MAX_BACKLOG) {
            return res.status(429).json({ error: 'backlog_full' });
        }
        if (request && typeof request !== 'object') return res.status(400).json({ error: 'invalid_request' });
        if (consciousnessState && typeof consciousnessState !== 'object') return res.status(400).json({ error: 'invalid_state' });

        // Ajv schema validation if available
        try {
            if (validateReqSchema && validateStateSchema) {
                const r = request || { description: 'Generate a consciousness-expanding reality', complexity: 0.8 };
                const s = consciousnessState || { phi: 0.862, awareness: 0.8, coherence: 0.85 };
                if (!validateReqSchema(r)) {
                    return res.status(400).json({ error: 'invalid_request_schema', details: validateReqSchema.errors });
                }
                if (!validateStateSchema(s)) {
                    return res.status(400).json({ error: 'invalid_state_schema', details: validateStateSchema.errors });
                }
            }
        } catch (e) { /* non-fatal */ }
        if (!realityGenerator) {
            return res.status(500).json({ error: 'Reality generator not initialized' });
        }
        const start = Date.now();
        const result = await realityGenerator.generateHolographicConsciousnessReality(
            request || { type: 'manual', content: 'Generate a consciousness-expanding reality' },
            consciousnessState || { phi: 0.862, awareness: 0.8, coherence: 0.85 }
        );
        const dur = Date.now() - start;
        if (metrics) { try { metrics.genDuration.observe(dur); } catch (_) {} }
        if (result.success) {
            serviceMetrics.totalRealities++;
            if (metrics) { try { metrics.genTotal.inc({ status: 'success' }); } catch (_) {} }
            // Encode into spiral memory
            try {
                if (spiralMemory) {
                    const amp = Math.max(0.1, Math.min(1, (result.consciousnessIntegration || 0.8)));
                    spiralMemory.encode({ type: 'reality', summary: result?.projectionParameters?.projectionType?.method || 'projection', scores: {
                        projectionFidelity: result.projectionFidelity,
                        consciousnessIntegration: result.consciousnessIntegration,
                        realityCoherence: result.realityCoherence
                    } }, amp, { source: 'reality-service', mode: 'manual' });
                }
            } catch (_) {}
        }
        const coherence = (result && result.realityCoherence) || 0;
        if (!result.success || coherence < REALITY_MIN_COHERENCE) {
            if (metrics) { try { metrics.genTotal.inc({ status: 'error' }); } catch (_) {} }
            // Optionally publish analysis request via NATS
            try {
                if (js) {
                    const payload = { type: 'reality_low_coherence', request, consciousnessState, scores: { coherence } };
                    await js.publish('code.analysis.request', sc.encode(JSON.stringify(payload)));
                }
            } catch (_) {}
            pushError(`low_coherence_or_failure: coherence=${coherence}`);
        }
        res.json(result);
    } catch (error) {
        console.error('Reality generation error:', error);
        if (metrics) { try { metrics.genTotal.inc({ status: 'error' }); } catch (_) {} }
        pushError(`exception: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// WebSocket connection for real-time updates
// Auth for socket.io
io.use((socket, next) => {
    if (!REALITY_API_KEY) return next();
    const key = socket.handshake.auth?.key || socket.handshake.headers['x-api-key'];
    if (key !== REALITY_API_KEY) return next(new Error('unauthorized'));
    next();
});

io.on('connection', (socket) => {
    console.log('🔌 Client connected to reality generator');
    serviceMetrics.activeConnections++;
    if (metrics) { try { metrics.wsConnections.set(serviceMetrics.activeConnections); } catch (_) {} }
    
    // Send initial status
    socket.emit('status', {
        service: 'reality-generator',
        status: 'connected',
        metrics: serviceMetrics
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('🔌 Client disconnected from reality generator');
        serviceMetrics.activeConnections--;
        if (metrics) { try { metrics.wsConnections.set(serviceMetrics.activeConnections); } catch (_) {} }
    });
    
    // Handle reality generation requests via WebSocket
    socket.on('generate-reality', async (data = {}) => {
        let jobId;
        try {
            if (pendingJobs.size >= REALITY_MAX_BACKLOG) {
                return socket.emit('error', { message: 'backlog_full' });
            }
            // Ajv validation for WS payloads
            try {
                if (validateReqSchema && data.request) {
                    if (!validateReqSchema(data.request)) {
                        return socket.emit('error', { message: 'invalid_request_schema', details: validateReqSchema.errors });
                    }
                }
                if (validateStateSchema && data.consciousnessState) {
                    if (!validateStateSchema(data.consciousnessState)) {
                        return socket.emit('error', { message: 'invalid_state_schema', details: validateStateSchema.errors });
                    }
                }
            } catch (_) { /* ignore */ }
            jobId = randomUUID();
            pendingJobs.set(jobId, socket);
            if (metrics) { try { metrics.backlog.set(pendingJobs.size); } catch (_) {} }
            if (js) {
                await js.publish('reality.gen.request', sc.encode(JSON.stringify({
                    jobId,
                    request: data.request,
                    consciousnessState: data.consciousnessState
                })));
            }
            socket.emit('reality-job', { jobId });
            // Job timeout
            setTimeout(() => {
                if (pendingJobs.has(jobId)) {
                    pendingJobs.delete(jobId);
                    if (metrics) { try { metrics.backlog.set(pendingJobs.size); } catch (_) {} }
                    try { socket.emit('error', { message: 'job_timeout', jobId }); } catch (_) {}
                    if (metrics) { try { metrics.genTotal.inc({ status: 'error' }); } catch (_) {} }
                    // Publish to DLQ
                    try { if (js) js.publish('reality.gen.dlq', sc.encode(JSON.stringify({ reason: 'timeout', jobId }))); } catch (_) {}
                }
            }, REALITY_JOB_TIMEOUT_MS);
        } catch (error) {
            pendingJobs.delete(jobId);
            if (metrics) { try { metrics.backlog.set(pendingJobs.size); } catch (_) {} }
            socket.emit('error', { message: error.message });
        }
    });
});

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

async function setupNats() {
    try {
        const nc = await connect({ servers: process.env.NATS_URL || 'nats://localhost:4222' });
        js = nc.jetstream();
        const sub = await js.subscribe('reality.gen.result', { manualAck: true });
        (async () => {
            for await (const msg of sub) {
                try {
                    const data = JSON.parse(sc.decode(msg.data));
                    if (!data || !data.jobId) { pushError('result_missing_jobId'); try { if (js) js.publish('reality.gen.dlq', sc.encode(JSON.stringify({ reason: 'missing_jobId', raw: data }))); } catch (_) {} msg.ack(); continue; }
                    if (processedJobs.has(data.jobId)) { msg.ack(); continue; }
                    const sock = pendingJobs.get(data.jobId);
                    if (sock) {
                        sock.emit('reality-scene', { jobId: data.jobId, scene: data.scene });
                        pendingJobs.delete(data.jobId);
                        if (metrics) { try { metrics.backlog.set(pendingJobs.size); } catch (_) {} }
                        rememberProcessed(data.jobId);
                    } else {
                        // Nobody waiting; send to DLQ for audit
                        try { if (js) js.publish('reality.gen.dlq', sc.encode(JSON.stringify({ reason: 'orphan_result', jobId: data.jobId }))); } catch (_) {}
                        pushError('orphan_result:' + data.jobId);
                    }
                    msg.ack();
                } catch (err) {
                    console.error('Error processing reality.gen.result', err);
                    pushError('result_processing_error:' + err.message);
                    try { if (js) js.publish('reality.gen.dlq', sc.encode(JSON.stringify({ reason: 'processing_error', error: err.message }))); } catch (_) {}
                }
            }
        })().catch(err => console.error('Subscription failed', err));
    } catch (err) {
        console.error('Failed to connect to NATS', err);
    }
}

// Initialize services
async function initializeServices() {
    try {
        console.log(`🚀 Initializing Reality Generator Service on ${DEDICATED_CORES} CPU cores...`);
        
        // Initialize reality generator
        realityGenerator = new HolographicConsciousnessRealityGenerator(consciousnessSystemStub);
        
        // Initialize imagination engine
        imaginationEngine = new AutonomousImaginationEngine(consciousnessSystemStub);

        await setupNats();

        // --- Raw WebSocket server for ws-based bridge integration ---
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

                const BACKLOG_LIMIT = 1024 * 1024; // 1 MB
                broadcastToRawWSClients = function(message) {
                    const encodeStart = process.hrtime.bigint();
                    const msgStr = JSON.stringify(message);
                    const encodeTimeMs = Number(process.hrtime.bigint() - encodeStart) / 1e6;
                    currentFps = encodeTimeMs > 50 ? 1 : REALITY_FPS;
                    serviceMetrics.currentFps = currentFps;

                    for (const ws of wsClients) {
                        if (ws.readyState === ws.OPEN) {
                            if (ws.bufferedAmount > BACKLOG_LIMIT) {
                                serviceMetrics.droppedFrames++;
                                if (metrics) { try { metrics.wsDroppedFrames.inc(); } catch (_) {} }
                                continue;
                            }
                            ws.send(msgStr);
                        }
                    }
                };

                // Listen for reality generation events (after broadcastToRawWSClients is defined)
                imaginationEngine.on('reality_generated', (data) => {
                    const now = Date.now();
                    if (now - lastBroadcastTime < 1000 / currentFps) {
                        return;
                    }
                    lastBroadcastTime = now;
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

                    // Encode into spiral memory
                    try {
                        if (spiralMemory) {
                            const amp = Math.max(0.1, Math.min(1, (data?.reality?.realityCoherence || 0.8)));
                            spiralMemory.encode({ type: 'reality', id: data.id, summary: data.imagination.substring(0,200) + '...', level: data.reality.realityLevel }, amp, { source: 'imagination' });
                        }
                    } catch (_) {}

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
module.exports._internals = { pendingJobs, recentErrors };
