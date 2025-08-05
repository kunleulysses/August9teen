const opossum = require('opossum');

function withCircuitBreaker(fn, options) {
  const breaker = opossum(fn, options);
  return (...args) => breaker.fire(...args);
}

module.exports = { withCircuitBreaker };