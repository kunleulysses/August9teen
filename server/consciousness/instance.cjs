import { HolographicConsciousnessRealityGenerator } from './holographic-consciousness-reality-generator.cjs';
import './eventHandlers/realityQueueProducer.cjs';
import './metricsServer.cjs';
import './core/SystemTicker.cjs';

const generator = new HolographicConsciousnessRealityGenerator();

// Graceful shutdown for SystemTicker
let tickerShutdown;
try {
    tickerShutdown = require('./core/SystemTicker.cjs').shutdown;
} catch (e) {
    tickerShutdown = null;
}
if (typeof process !== "undefined" && process && process.on && tickerShutdown) {
    process.on('SIGTERM', () => {
        tickerShutdown();
    });
}

export default generator;