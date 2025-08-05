const opossum = require('opossum');

function withCircuitBreaker(fn, options) {
  const breaker = new opossum(fn, options);
  return (...args) => breaker.fire(...args);
}

module.exports = { withCircuitBreaker };