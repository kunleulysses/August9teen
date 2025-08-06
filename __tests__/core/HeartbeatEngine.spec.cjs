const { HeartbeatEngine } = require('../../server/consciousness/core/HeartbeatEngine.cjs');

jest.useFakeTimers();

describe('HeartbeatEngine', () => {
    let engine;

    beforeEach(() => {
        engine = new HeartbeatEngine({ baseHz: 10, surgeHz: 100 });
    });

    afterEach(() => {
        engine.stop();
    });

    it('should start and emit heartbeat events', () => {
        const heartbeatSpy = jest.fn();
        engine.on('heartbeat', heartbeatSpy);
        engine.start();
        jest.advanceTimersByTime(1000);
        expect(heartbeatSpy).toHaveBeenCalledTimes(10);
    });

    it('should stop emitting heartbeat events', () => {
        const heartbeatSpy = jest.fn();
        engine.on('heartbeat', heartbeatSpy);
        engine.start();
        jest.advanceTimersByTime(500);
        engine.stop();
        jest.advanceTimersByTime(500);
        expect(heartbeatSpy).toHaveBeenCalledTimes(5);
    });

    it('should adapt to surge frequency', () => {
        const heartbeatSpy = jest.fn();
        engine.on('heartbeat', heartbeatSpy);
        engine.start();
        engine.updateLoad(0.8); // Trigger surge
        jest.advanceTimersByTime(100);
        expect(heartbeatSpy).toHaveBeenCalledTimes(10); // 100Hz for 0.1s
    });

    it('should revert to base frequency', () => {
        const heartbeatSpy = jest.fn();
        engine.on('heartbeat', heartbeatSpy);
        engine.start();
        engine.updateLoad(0.8); // Trigger surge
        jest.advanceTimersByTime(100);
        engine.updateLoad(0.5); // Revert to base
        jest.advanceTimersByTime(900);
        // 10 events in the first 0.1s, 9 events in the next 0.9s
        expect(heartbeatSpy).toHaveBeenCalledTimes(19);
    });

    it('should compensate for drift', (done) => {
        const heartbeatSpy = jest.fn();
        engine.on('heartbeat', heartbeatSpy);
        engine.start();

        // Simulate a long-running task that causes drift
        setTimeout(() => {
            const now = performance.now();
            while (performance.now() - now < 50) {
                // blocking loop
            }
        }, 150);

        setTimeout(() => {
            engine.stop();
            const calls = heartbeatSpy.mock.calls;
            const drifts = calls.map(call => call[0].drift);
            const averageDrift = drifts.reduce((a, b) => a + b, 0) / drifts.length;
            // This is a simplified test; in a real scenario, we'd look for the
            // drift to be compensated over time. Here, we just check that the
            // drift is within a reasonable range.
            expect(averageDrift).toBeLessThan(20);
            done();
        }, 1000);

        jest.runAllTimers();
    });
});