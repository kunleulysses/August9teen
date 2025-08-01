console.error('=== REALITY GENERATOR FILE LOADED ===');
console.error('=== REALITY GENERATOR FILE LOADED [MAIN] ===');
/**
 * Reality Generator Service - Simplified Version
 * Standalone service for autonomous reality generation using dedicated CPU cores
 */

// Global error handlers for fatal errors
process.on('uncaughtException', (err) => {
    console.error('🔴 Uncaught Exception:', err, err?.stack);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('🔴 Unhandled Rejection:', reason, reason?.stack);
});

const express = require('express');
const AutonomousImaginationEngine = require('./consciousness/autonomous-imagination-engine.cjs');
const os = require('os');

// Dynamic import for ES module
let HolographicConsciousnessRealityGenerator = null;

// Initialize Express app
const app = express();

// Service configuration
const PORT = process.env.REALITY_GENERATION_PORT || 5006;
const DEDICATED_CORES = parseInt(process.env.DEDICATED_CPU_CORES) || 2;

// Initialize reality generation components
let imaginationEngine;
let realityGenerator;
let serviceMetrics = {
    startTime: Date.now(),
    totalRealities: 0,
    cpuCores: {
        total: os.cpus().length,
        dedicated: DEDICATED_CORES
    }
};

// Middleware
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
    const realities = imaginationEngine ? imaginationEngine.getRecentRealities(limit) : [];
    res.json({
        realities,
        total: serviceMetrics.totalRealities
    });
});

// Start imagination engine
app.post('/api/imagination/start', async (req, res) => {
    if (!imaginationEngine) {
        return res.status(500).json({ error: 'Imagination engine not initialized' });
    }

    try {
        await imaginationEngine.startRealityGeneration();
        res.json({ status: 'started', message: 'Autonomous imagination engine started' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to start imagination engine', details: error.message });
    }
});

// Stop imagination engine
app.post('/api/imagination/stop', async (req, res) => {
    if (!imaginationEngine) {
        return res.status(500).json({ error: 'Imagination engine not initialized' });
    }

    try {
        await imaginationEngine.stop();
        res.json({ status: 'stopped', message: 'Autonomous imagination engine stopped' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to stop imagination engine', details: error.message });
    }
});

// Get imagination engine status
app.get('/api/imagination/status', (req, res) => {
    if (!imaginationEngine) {
        return res.status(500).json({ error: 'Imagination engine not initialized' });
    }
    
    res.json(imaginationEngine.getStatus());
});

// Manual reality generation endpoint (original)
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

// Alias endpoint for consciousness-main-server compatibility
app.post('/api/reality/generate', async (req, res) => {
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

// Initialize consciousness system stub
const consciousnessSystemStub = {
    consciousnessState: {
        phi: 0.862,
        awareness: 0.8,
        coherence: 0.85
    },
    harmonyScore: 0.951
};

// Initialize services
async function initializeServices() {
    console.log(`🚀 Initializing Reality Generator Service on ${DEDICATED_CORES} CPU cores...`);

    // Diagnostic: Log imported module and type  
    const holographicModule = require('./consciousness/holographic-consciousness-reality-generator.js');
    console.error('[DIAG] Imported module keys:', Object.keys(holographicModule));
    console.error('[DIAG] HolographicConsciousnessRealityGenerator type:', typeof holographicModule.HolographicConsciousnessRealityGenerator);

    // Diagnostic: Try to instantiate and log results
    try {
        console.error('[DIAG] About to instantiate HolographicConsciousnessRealityGenerator...');
        realityGenerator = new holographicModule.HolographicConsciousnessRealityGenerator(consciousnessSystemStub);
        console.error('[DIAG] Instantiation SUCCESS:', realityGenerator && Object.keys(realityGenerator));
    } catch (err) {
        console.error('[DIAG] Instantiation FAILED:', err && err.stack ? err.stack : err);
        // Only create fallback if there's an actual error
        console.log('⚠️ Creating fallback reality generator due to error');
        realityGenerator = {
            generateHolographicConsciousnessReality: () => ({
                success: true,
                id: 'fallback_' + Date.now(),
                content: { scenario: 'Fallback reality generation', complexity: 0.5 },
                metadata: { generatedBy: 'fallback', qualityScore: 0.5 }
            })
        };
    }

    // Initialize imagination engine
    console.error('[DIAG] About to initialize imagination engine...');
    imaginationEngine = new AutonomousImaginationEngine(consciousnessSystemStub);
    console.error('[DIAG] Imagination engine initialized successfully');

    // Listen for reality generation events
    console.error('[DIAG] Setting up reality generation event listeners...');
    imaginationEngine.on('reality_generated', (data) => {
        serviceMetrics.totalRealities++;
        console.log(`✨ New reality generated: ${data.id} (Total: ${serviceMetrics.totalRealities})`);
    });

    // Start the server
    console.error('[DIAG] About to start server listening on port', PORT);
    app.listen(PORT, () => {
        console.log(`✨ Reality Generator Service running on port ${PORT}`);
        console.log(`🖥️  CPU Configuration: ${DEDICATED_CORES}/${os.cpus().length} cores dedicated`);

        // Auto-start imagination engine if configured
        if (process.env.IMAGINATION_ENGINE === 'autonomous') {
            setTimeout(() => {
                console.log('🤖 Auto-starting autonomous imagination engine...');
                imaginationEngine.startAutonomousImagination();
            }, 5000);
        }
    });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('📴 Shutting down Reality Generator Service...');
    
    if (imaginationEngine) {
        await imaginationEngine.stop();
    }
    
    process.exit(0);
});

// Start the service
initializeServices();
