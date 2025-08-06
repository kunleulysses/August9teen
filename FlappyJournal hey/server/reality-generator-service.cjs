/**
 * Reality Generator Service
 * Standalone service for autonomous reality generation using dedicated CPU cores
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import AutonomousImaginationEngine from './consciousness/autonomous-imagination-engine.cjs';
import { HolographicConsciousnessRealityGenerator } from './consciousness/holographic-consciousness-reality-generator.cjs';
import rateLimit from 'express-rate-limit';
import os from 'os';

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

// Rate limiting - 100 requests per minute per IP
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100
});

// Service configuration
const PORT = process.env.REALITY_GENERATION_PORT || 5020;
const DEDICATED_CORES = parseInt(process.env.DEDICATED_CPU_CORES) || 2;
const REALITY_FPS = parseInt(process.env.REALITY_FPS) || 10;

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

let currentFps = REALITY_FPS;
let lastBroadcastTime = 0;

// Middleware
app.use(limiter);
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    const uptime = Date.now() - serviceMetrics.startTime;
    res.json({
        status: 'healthy',
        service: 'reality-generator',
        uptime: Math.floor(uptime / 1000),
        metrics: serviceMetrics,
        imaginationEngine: imaginationEngine ? imaginationEngine.getStatus() : null
    });
});

// Get generated realities
app.get('/api/realities', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const realities = imaginationEngine ? imaginationEngine.getGeneratedRealities(limit) : [];
    res.json({
        realities,
        total: serviceMetrics.totalRealities
    });
});

// Start/stop imagination engine
app.post('/api/imagination/start', (req, res) => {
    if (!imaginationEngine) {
        return res.status(500).json({ error: 'Imagination engine not initialized' });
    }
    
    imaginationEngine.startAutonomousImagination();
    res.json({ status: 'started', message: 'Autonomous imagination engine started' });
});

app.post('/api/imagination/stop', (req, res) => {
    if (!imaginationEngine) {
        return res.status(500).json({ error: 'Imagination engine not initialized' });
    }
    
    imaginationEngine.stopAutonomousImagination();
    res.json({ status: 'stopped', message: 'Autonomous imagination engine stopped' });
});

// Get imagination engine status
app.get('/api/imagination/status', (req, res) => {
    if (!imaginationEngine) {
        return res.status(500).json({ error: 'Imagination engine not initialized' });
    }
    
    res.json(imaginationEngine.getStatus());
});

// Manual reality generation endpoint
app.post('/api/generate-reality', async (req, res) => {
    try {
        const { request, consciousnessState } = req.body;
        
        if (!realityGenerator) {
            return res.status(500).json({ error: 'Reality generator not initialized' });
        }
        
        const result = await realityGenerator.generateHolographicConsciousnessReality(
            request || { type: 'manual', content: 'Generate a consciousness-expanding reality' },
            consciousnessState || { phi: 0.862, awareness: 0.8, coherence: 0.85 }
        );
        
        if (result.success) {
            serviceMetrics.totalRealities++;
        }
        
        res.json(result);
    } catch (error) {
        console.error('Reality generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// WebSocket connection for real-time updates
io.on('connection', (socket) => {
    console.log('🔌 Client connected to reality generator');
    serviceMetrics.activeConnections++;
    
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
    });
    
    // Handle reality generation requests via WebSocket
    socket.on('generate-reality', async (data) => {
        try {
            const result = await realityGenerator.generateHolographicConsciousnessReality(
                data.request,
                data.consciousnessState
            );
            
            socket.emit('reality-generated', result);
        } catch (error) {
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
export { app, imaginationEngine, realityGenerator };
