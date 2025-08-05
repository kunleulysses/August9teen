module.exports = {
  MAX_QUANTUM_FIELDS: parseInt(process.env.MAX_QUANTUM_FIELDS || '1000', 10),
  HEALTH_CHECK_INTERVAL_MS: parseInt(process.env.HEALTH_CHECK_INTERVAL_MS || '1000', 10),
  FIELD_TTL_MS: parseInt(process.env.FIELD_TTL_MS || '600000', 10) // default 10 min
};