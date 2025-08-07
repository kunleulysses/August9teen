const CircuitBreaker = require('opossum');
const promClient = require('prom-client');

const cache = new Map();

// Prometheus metrics
const breakerState = new promClient.Gauge({
  name: 'dnastore_circuit_state',
  help: '0=closed,1=open,2=half-open'
});
const breakerTrips = new promClient.Counter({
  name: 'dnastore_circuit_trips_total',
  help: 'Number of times DNAStore circuit breaker tripped'
});

function createBreaker(fetchFn, opts) {
  const breaker = new CircuitBreaker(fetchFn, {
    timeout: parseInt(process.env.DNASTORE_TIMEOUT_MS, 10) || opts.timeout || 3000,
    errorThresholdPercentage: parseInt(process.env.DNASTORE_CIRCUIT_ERROR_THRESHOLD, 10) || opts.errorThreshold || 50,
    resetTimeout: parseInt(process.env.DNASTORE_CIRCUIT_RESET_TIMEOUT, 10) || opts.resetTimeout || 10000,
    rollingCountTimeout: parseInt(process.env.DNASTORE_CIRCUIT_ROLLING_TIMEOUT, 10) || opts.rollingTimeout || 10000,
    rollingCountBuckets: parseInt(process.env.DNASTORE_CIRCUIT_ROLLING_BUCKETS, 10) || opts.rollingBuckets || 10,
  });
  breaker.fallback(() => {
    const fallbackData = cache.get('lkg');
    return { fallback: true, data: fallbackData, error: 'DNAStore unavailable' };
  });
  breaker.on('success', (result) => {
    cache.set('lkg', result);
  });
  breaker.on('open', () => {
    console.warn('DNAStore circuit breaker OPEN');
    breakerTrips.inc();
    breakerState.set(1);
  });
  breaker.on('halfOpen', () => {
    console.warn('DNAStore circuit breaker HALF-OPEN');
    breakerState.set(2);
  });
  breaker.on('close', () => {
    console.info('DNAStore circuit breaker CLOSED');
    breakerState.set(0);
  });
  return breaker;
}
function withCircuitBreaker(operation, options = {}) {
  const breaker = createBreaker(operation, options);
  return () => breaker.fire();
}

module.exports = { createBreaker, withCircuitBreaker };
