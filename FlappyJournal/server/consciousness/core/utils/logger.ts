import pino from 'pino';
const logger = pino({
  name: 'spiral-memory',
  level: process.env.LOG_LEVEL || 'info',
  redact: ['password', 'secret']
});
export default logger;