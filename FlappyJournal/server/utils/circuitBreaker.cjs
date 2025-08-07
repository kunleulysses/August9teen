const opossum = require('opossum');

function createBreaker(asyncFunction, options = {}) {
  const defaultOptions = {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
    rollingCountTimeout: 10000,
    rollingCountBuckets: 10,
    name: 'circuit-breaker',
    ...options
  };

  const breaker = new opossum(asyncFunction, defaultOptions);
  
  breaker.on('open', () => console.log(`Circuit breaker ${defaultOptions.name} opened`));
  breaker.on('halfOpen', () => console.log(`Circuit breaker ${defaultOptions.name} half-open`));
  breaker.on('close', () => console.log(`Circuit breaker ${defaultOptions.name} closed`));
  
  return breaker;
}

function withCircuitBreaker(asyncFunction, options = {}) {
  const breaker = createBreaker(asyncFunction, options);
  return async (...args) => {
    try {
      return await breaker.fire(...args);
    } catch (error) {
      if (error.message.includes('CircuitBreaker')) {
        throw new Error('Breaker is open');
      }
      throw error;
    }
  };
}

module.exports = { createBreaker, withCircuitBreaker };