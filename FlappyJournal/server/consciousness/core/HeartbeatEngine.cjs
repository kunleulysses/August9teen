const { EventEmitter } = require('events');
const { performance } = require('perf_hooks');

class HeartbeatEngine extends EventEmitter {
    constructor(options = {}) {
        super();
        this.baseHz = options.baseHz || parseInt(process.env.HEARTBEAT_BASE_HZ, 10) || 10;
        this.surgeHz = options.surgeHz || parseInt(process.env.HEARTBEAT_SURGE_HZ, 10) || 100;
        this.processingLoad = 0;
        this.isRunning = false;
        this.timer = null;
        this.expected = null;
        this.currentHz = this.baseHz;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.expected = performance.now() + 1000 / this.currentHz;
        this.timer = setTimeout(this.tick.bind(this), 1000 / this.currentHz);
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        clearTimeout(this.timer);
    }

    setSurge(isSurging) {
        const newHz = isSurging ? this.surgeHz : this.baseHz;
        if (newHz !== this.currentHz) {
            this.currentHz = newHz;
            // No need to restart the timer, the drift compensation will handle it
        }
    }

    tick() {
        const now = performance.now();
        const drift = now - this.expected;
        
        this.emit('heartbeat', { drift });

        // Drift compensation
        this.expected += 1000 / this.currentHz;
        const nextTimeout = Math.max(0, 1000 / this.currentHz - drift);
        
        if (this.isRunning) {
            this.timer = setTimeout(this.tick.bind(this), nextTimeout);
        }
    }

    updateLoad(load) {
        this.processingLoad = load;
        this.setSurge(this.processingLoad > 0.7);
    }
}

module.exports = { HeartbeatEngine };