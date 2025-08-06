const pino = require('pino');
const { getTraceId } = require('./trace.cjs');

const pretty = process.env.LOG_PRETTY === 'true';

function injectCorrelationId(bindings = {}) {
  const correlationId = getTraceId();
  return correlationId ? { ...bindings, correlationId } : bindings;
}

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: pretty ? { target: 'pino-pretty', options: { colorize: true } } : undefined
}).child(injectCorrelationId());

function child(bindings) {
  return logger.child(injectCorrelationId(bindings));
}

module.exports = {
    logger,
    child
};