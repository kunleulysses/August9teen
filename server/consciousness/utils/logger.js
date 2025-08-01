import pino from 'pino';
const pretty = process.env.LOG_PRETTY === 'true';
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: pretty ? { target: 'pino-pretty', options: { colorize: true } } : undefined
});
export function child(bindings) {
  return logger.child(bindings);
}