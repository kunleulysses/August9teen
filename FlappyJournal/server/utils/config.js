module.exports = {
  MAX_QUANTUM_FIELDS: parseInt(process.env.MAX_QUANTUM_FIELDS || '1000', 10),
  HEALTH_CHECK_INTERVAL_MS: parseInt(process.env.HEALTH_CHECK_INTERVAL_MS || '1000', 10)
};