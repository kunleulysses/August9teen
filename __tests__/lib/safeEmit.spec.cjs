const { EventEmitter } = require('events');
const { createSafeEmitter } = require('../../shared/lib/safeEmit.cjs');

describe('createSafeEmitter', () => {
    let emitter;
    let safeEmitter;
    let metrics;

    beforeEach(() => {
        emitter = new EventEmitter();
        metrics = {
            circuitBreakerOpenTotal: { inc: jest.fn() },
            breakerState: { set: jest.fn() }
        };
        safeEmitter = createSafeEmitter(emitter, metrics);
    });

    it('should emit an event successfully', (done) => {
        emitter.on('success', (payload, callback) => {
            expect(payload).toEqual({ data: 'test' });
            callback();
        });
        safeEmitter('success', { data: 'test' }).then(done);
    });

    it('should open the circuit after multiple failures', async () => {
        let failCount = 0;
        emitter.on('fail', (payload, callback) => {
            failCount++;
            callback(new Error('failure'));
        });

        // Fail 3 times to open the circuit
        for (let i = 0; i < 3; i++) {
            await expect(safeEmitter('fail', {})).rejects.toThrow('failure');
        }

        expect(metrics.circuitBreakerOpenTotal.inc).toHaveBeenCalledWith({ event: 'fail' });
        expect(metrics.breakerState.set).toHaveBeenCalledWith({ event: 'fail' }, 1);
    });

    it('should trigger the fallback when the circuit is open', async () => {
        const fallbackSpy = jest.fn();
        emitter.on('metacog.analysis_failed', fallbackSpy);

        emitter.on('fail', (payload, callback) => {
            callback(new Error('failure'));
        });

        // Fail 3 times to open the circuit
        for (let i = 0; i < 3; i++) {
            await expect(safeEmitter('fail', {})).rejects.toThrow('failure');
        }

        // This call should trigger the fallback
        await safeEmitter('fail', {});
        
        expect(fallbackSpy).toHaveBeenCalledWith({
            event: 'fail',
            error: 'Circuit breaker open',
            fallbackData: undefined
        });
    });

    it('should close the circuit after the reset timeout', async () => {
        jest.useFakeTimers();
        
        emitter.on('fail', (payload, callback) => {
            callback(new Error('failure'));
        });

        // Fail 3 times to open the circuit
        for (let i = 0; i < 3; i++) {
            await expect(safeEmitter('fail', {})).rejects.toThrow('failure');
        }

        // Advance time past the reset timeout
        jest.advanceTimersByTime(30001);

        // This call should succeed
        emitter.removeAllListeners('fail');
        emitter.on('fail', (payload, callback) => {
            callback();
        });
        await safeEmitter('fail', {});

        expect(metrics.breakerState.set).toHaveBeenCalledWith({ event: 'fail' }, 0);

        jest.useRealTimers();
    });
});