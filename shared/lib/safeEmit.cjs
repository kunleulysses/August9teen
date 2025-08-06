const CircuitBreaker = require('opossum');

const circuitBreakerOptions = {
    timeout: 3000, // If async task takes longer than 3 seconds, trigger a failure
    errorThresholdPercentage: 50, // When 50% of requests fail, open the circuit
    resetTimeout: 30000 // After 30 seconds, try again.
};

const createSafeEmitter = (emitter, metrics) => {
    const breakers = new Map();

    const getBreaker = (eventName) => {
        if (!breakers.has(eventName)) {
            const breaker = new CircuitBreaker(async (payload) => {
                return new Promise((resolve, reject) => {
                    try {
                        emitter.emit(eventName, payload, (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    } catch (err) {
                        reject(err);
                    }
                });
            }, circuitBreakerOptions);

            breaker.on('open', () => {
                console.error(`Circuit breaker for ${eventName} is now open.`);
                if (metrics && metrics.circuitBreakerOpenTotal) {
                    metrics.circuitBreakerOpenTotal.inc({ event: eventName });
                }
                if (metrics && metrics.breakerState) {
                    metrics.breakerState.set({ event: eventName }, 1);
                }
            });

            breaker.on('close', () => {
                console.log(`Circuit breaker for ${eventName} is now closed.`);
                if (metrics && metrics.breakerState) {
                    metrics.breakerState.set({ event: eventName }, 0);
                }
            });
            
            breaker.on('fallback', (result) => {
                emitter.emit('metacog.analysis_failed', {
                    event: eventName,
                    error: 'Circuit breaker open',
                    fallbackData: result
                });
            });

            breakers.set(eventName, breaker);
        }
        return breakers.get(eventName);
    };

    return (eventName, payload) => {
        const breaker = getBreaker(eventName);
        return breaker.fire(payload);
    };
};

module.exports = { createSafeEmitter };