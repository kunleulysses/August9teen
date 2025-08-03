import pino from 'pino';
import { getTraceId } from './trace.cjs';
const pretty = process.env.LOG_PRETTY === 'true';

function injectTraceId(bindings = {}) {
  const traceId = getTraceId();
  return traceId ? { ...bindings, traceId } : bindings;
}

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: pretty ? { target: 'pino-pretty', options: { colorize: true } } : undefined
}).child(injectTraceId());

export function child(bindings) {
  return logger.child(injectTraceId(bindings));
}