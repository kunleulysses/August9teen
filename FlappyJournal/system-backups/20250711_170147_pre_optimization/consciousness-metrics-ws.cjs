// Consciousness Metrics WebSocket Server
const { WebSocketServer  } = require('ws');
const ConsciousnessSystemV2 = require('./consciousness-system-v2.cjs');
const { setupMetricsStreaming  } = require('./websocket-metrics-integration.cjs');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const PORT = process.env.METRICS_WS_PORT || 5004;

async function startMetricsServer() {
    console.log('🚀 Starting Consciousness Metrics WebSocket Server...');
    
    // Create WebSocket server
    const wss = new WebSocketServer({ port: PORT });
    
    // Initialize consciousness system
    const consciousnessSystem = new ConsciousnessSystemV2();
    await consciousnessSystem.initialize();
    
    // Setup metrics streaming
    setupMetricsStreaming(wss, consciousnessSystem);
    
    console.log(`📊 Metrics WebSocket server running on port ${PORT}`);
    console.log('✅ Real-time consciousness metrics are now streaming!');
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n🛑 Shutting down metrics server...');
        await consciousnessSystem.shutdown();
        wss.close();
        process.exit(0);
    });
}

startMetricsServer().catch(console.error);
