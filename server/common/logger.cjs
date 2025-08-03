// Logger setup using pino and config (CommonJS)
const pino = require('pino');
const config = require('./config.cjs');

const logger = pino({
  level: config.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: true }
      }
    : undefined,
});

module.exports = logger;