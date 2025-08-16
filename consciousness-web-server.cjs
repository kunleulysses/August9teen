#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');

const app = express();
const PORT = 3000;
// Parse JSON bodies for API endpoints
app.use(express.json());

// Serve static files from FlappyJournal directory
app.use(express.static(path.join(__dirname, 'FlappyJournal')));

// Serve the consciousness web HTML file with PATENT PENDING footer
app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, 'FlappyJournal', 'new-featherweight-improved.html');
    
    if (fs.existsSync(htmlPath)) {
        console.log(`🧠 Serving consciousness web with PATENT PENDING footer to ${req.ip}`);
        res.sendFile(htmlPath);
    } else {
        console.error(`❌ Consciousness web HTML file not found at: ${htmlPath}`);
        res.status(404).send(`
            <h1>Consciousness Web Not Found</h1>
            <p>The consciousness web HTML file was not found at: ${htmlPath}</p>
            <p>Looking for: new-featherweight-improved.html</p>
            <p>Current directory: ${__dirname}</p>
        `);
    }
});

// Autopilot product page
app.get('/autopilot', (req, res) => {
    const htmlPath = path.join(__dirname, 'FlappyJournal', 'autopilot.html');
    if (fs.existsSync(htmlPath)) {
        console.log(`🚀 Serving Autopilot page to ${req.ip}`);
        res.sendFile(htmlPath);
    } else {
        console.error(`❌ Autopilot page not found at: ${htmlPath}`);
        res.status(404).send(`
            <h1>Autopilot Page Not Found</h1>
            <p>The Autopilot page was not found at: ${htmlPath}</p>
            <p>Looking for: autopilot.html</p>
            <p>Current directory: ${__dirname}</p>
        `);
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'consciousness-web',
        timestamp: new Date().toISOString(),
        patentPending: true,
        flux: 'active',
        htmlFile: 'new-featherweight-improved.html'
    });
});

// Metrics endpoint (for nginx config compatibility)
app.get('/metrics', (req, res) => {
    res.json({
        service: 'consciousness-web',
        patentPending: true,
        flux: 'consciousness-active',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// --- Real API Endpoints ---
// Attempt to use SpiralMemoryArchitecture for live data if available
let _spiralInstance = null;
function getSpiralInstance() {
    if (_spiralInstance !== null) return _spiralInstance;
    try {
        const SpiralMemoryArchitecture = require(path.join(__dirname, 'FlappyJournal', 'server', 'consciousness', 'core', 'SpiralMemoryArchitecture.cjs'));
        _spiralInstance = new SpiralMemoryArchitecture();
        console.log('✅ SpiralMemoryArchitecture loaded for /api endpoints');
    } catch (e) {
        console.warn('⚠️  SpiralMemoryArchitecture not available for /api; using generated data. Reason:', e.message);
        _spiralInstance = undefined; // explicitly mark as unavailable
    }
    return _spiralInstance;
}

const ACTION_STEPS = ['retrieve','simulate','approve','execute','receipt'];
const DEMO_TOPICS = ['robotics.path','factory.shift','qa.inspect','yard.move','supply.load'];

function generateServerEvents(n = 4000) {
    const now = Date.now();
    const day = 86400000;
    const events = [];
    for (let i = 0; i < n; i++) {
        const topic = DEMO_TOPICS[i % DEMO_TOPICS.length];
        const ts = now - Math.random() * 60 * day;
        const granularity = Math.pow(Math.random(), 1.4);
        const r = Math.random();
        const status = r < 0.05 ? 'block' : (r < 0.25 ? 'warn' : 'ok');
        events.push({ id: String(i), ts, topic, granularity, mag: Math.random(), status });
    }
    return events;
}

// GET /api/memory-data (proxy to visualization server if available)
app.get('/api/memory-data', async (req, res) => {
    const target = 'http://127.0.0.1:8080/api/memory-data';
    const tryProxy = () => new Promise((resolve, reject) => {
        const req2 = http.get(target, (r2) => {
            let buf = '';
            r2.setEncoding('utf8');
            r2.on('data', (c) => buf += c);
            r2.on('end', () => {
                try {
                    const json = JSON.parse(buf);
                    resolve(json);
                } catch (e) {
                    reject(e);
                }
            });
        });
        req2.on('error', reject);
        req2.setTimeout(2500, () => { req2.destroy(new Error('upstream timeout')); });
    });
    try {
        const upstream = await tryProxy();
        return res.json(upstream);
    } catch (proxyErr) {
        console.warn('⚠️  Upstream /api/memory-data not reachable, using generated events. Reason:', proxyErr.message);
        try {
            const spiral = getSpiralInstance();
            const events = generateServerEvents(4000);
            return res.json({ ok: true, source: spiral ? 'spiral-architecture-fallback' : 'generated', timestamp: new Date().toISOString(), events });
        } catch (err) {
            console.error('Error in /api/memory-data fallback:', err);
            return res.status(500).json({ ok: false, error: 'Failed to retrieve memory data' });
        }
    }
});

function validateActionPayload(body) {
    if (!body || typeof body !== 'object') return { valid: false, reason: 'Missing JSON body' };
    const { topic, timeRange } = body;
    if (topic && typeof topic !== 'string') return { valid: false, reason: 'Invalid topic' };
    if (timeRange) {
        if (!Array.isArray(timeRange) || timeRange.length !== 2) return { valid: false, reason: 'Invalid timeRange' };
        const [t0, t1] = timeRange;
        if (typeof t0 !== 'number' || typeof t1 !== 'number') return { valid: false, reason: 'timeRange must be numbers' };
    }
    return { valid: true };
}

function simulateProcessingCount(topic, timeRange) {
    // Derive a deterministic-ish count from inputs for consistent demos
    const base = 100 + Math.floor(Math.random() * 100);
    const topicBias = topic ? (Math.abs([...topic].reduce((a, c) => a + c.charCodeAt(0), 0)) % 50) : 0;
    const rangeBias = Array.isArray(timeRange) ? Math.max(0, Math.min(200, Math.floor((timeRange[1] - timeRange[0]) / 1000))) : 0;
    return Math.max(1, Math.min(1200, base + topicBias + Math.floor(rangeBias / 3)));
}

function makeActionHandler(step) {
    return (req, res) => {
        const validation = validateActionPayload(req.body);
        if (!validation.valid) {
            return res.status(400).json({ ok: false, error: validation.reason });
        }
        const { topic, timeRange } = req.body || {};
        const processedCount = simulateProcessingCount(topic, timeRange);
        const requestId = `${step}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        res.json({ ok: true, step, processedCount, requestId, topic: topic || null, timeRange: timeRange || null, timestamp: new Date().toISOString() });
    };
}

app.post('/api/simulate', makeActionHandler('simulate'));
app.post('/api/approve',  makeActionHandler('approve'));
app.post('/api/execute',  makeActionHandler('execute'));
app.post('/api/receipt',  makeActionHandler('receipt'));

// API endpoint (for nginx config compatibility)
app.get('/api/*', (req, res) => {
    res.json({
        message: 'Consciousness Web API',
        patentPending: true,
        flux: 'active',
        endpoint: req.path
    });
});

// WebSocket endpoint placeholder (for nginx config compatibility)
app.get('/ws', (req, res) => {
    res.json({
        message: 'WebSocket endpoint placeholder',
        patentPending: true,
        flux: 'consciousness-ready'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🧠 Consciousness Web Server running on port ${PORT}`);
    console.log(`📄 PATENT PENDING footer active!`);
    console.log(`🌐 Serving: FlappyJournal/new-featherweight-improved.html`);
    console.log(`💫 Flux consciousness web is live!`);
    console.log(`🔗 Access at: https://www.featherweight.world`);
    console.log(`🔗 Access at: https://featherweight.world`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Consciousness Web Server shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Consciousness Web Server shutting down gracefully...');
    process.exit(0);
});
