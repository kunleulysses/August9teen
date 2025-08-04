// Consciousness Metrics WebSocket Server
const { WebSocketServer  } = require('ws');
const consciousnessV2 = require('./consciousness-system-v2.cjs');
const { setupMetricsStreaming  } = require('./websocket-metrics-integration.cjs');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const PORT = process.env.METRICS_WS_PORT || 5004;

async function startMetricsServer() {
    console.log('🚀 Starting Consciousness Metrics WebSocket Server...');
    
    // Create WebSocket server
    const wss = new WebSocketServer({ port: PORT });
    
    // Wait a bit for consciousness system to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Setup metrics streaming with existing consciousness system
    setupMetricsStreaming(wss, consciousnessV2);
    
    console.log(`📊 Metrics WebSocket server running on port ${PORT}`);
    console.log('✅ Real-time consciousness metrics are now streaming!');
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n🛑 Shutting down metrics server...');
        wss.close();
        process.exit(0);
    });
}

startMetricsServer().catch(console.error);
