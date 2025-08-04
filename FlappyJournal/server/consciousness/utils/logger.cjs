const pino = require('pino');

const pretty = process.env.LOG_PRETTY === 'true';

function injectTraceId(bindings = {}) {
  // Simple trace ID generation for now
  const traceId = Math.random().toString(36).substring(2, 15);
  return traceId ? { ...bindings, traceId } : bindings;
}

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: pretty ? { target: 'pino-pretty', options: { colorize: true } } : undefined
}).child(injectTraceId());

function child(bindings) {
  return logger.child(injectTraceId(bindings));
}

module.exports = { logger, child };
