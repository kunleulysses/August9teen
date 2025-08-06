import pino from 'pino';
import { getTraceId } from './trace.cjs';

const pretty = process.env.LOG_PRETTY === 'true';

function injectCorrelationId(bindings = {}) {
  const correlationId = getTraceId();
  return correlationId ? { ...bindings, correlationId } : bindings;
}

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: pretty ? { target: 'pino-pretty', options: { colorize: true } } : undefined
}).child(injectCorrelationId());

export function child(bindings) {
  return logger.child(injectCorrelationId(bindings));
}