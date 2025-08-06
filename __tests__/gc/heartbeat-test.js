const { HeartbeatEngine } = require('../../server/ws/heartbeat.cjs');

// This script is designed to be run as a forked process with --expose-gc
// to allow for manual garbage collection.

const TEST_DURATION = 15 * 60 * 1000; // 15 minutes
const HEARTBEAT_INTERVAL = 100; // 10Hz
const GC_INTERVAL = 30 * 1000; // 30 seconds

const engine = new HeartbeatEngine({
    heartbeatInterval: HEARTBEAT_INTERVAL,
    idleTimeout: 60000,
    onPulse: () => {
        // Simulate some work
        const arr = new Array(1000).fill(0).map((_, i) => i);
    }
});

engine.start();

const gcInterval = setInterval(() => {
    if (global.gc) {
        global.gc();
    }
    const heapUsed = process.memoryUsage().heapUsed;
    process.send({ type: 'heap', value: heapUsed });
}, GC_INTERVAL);

setTimeout(() => {
    engine.stop();
    clearInterval(gcInterval);
    process.exit(0);
}, TEST_DURATION);