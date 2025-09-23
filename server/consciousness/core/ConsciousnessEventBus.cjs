const path = require('path');

// Use the production event bus implementation from the Universal platform
const universalBus = require(path.join(
  __dirname,
  '..', '..', '..',
  'FlappyJournal',
  'server',
  'consciousness',
  'core',
  'ConsciousnessEventBus.cjs'
));

// Ensure the 100 Hz ticker is running exactly once per process
if (!global.__SYSTEM_TICKER__) {
  const intervalMs = Number(process.env.SYSTEM_TICK_MS || '10');
  global.__SYSTEM_TICKER__ = setInterval(() => {
    try {
      universalBus.emit('system_tick', { ts: Date.now() });
    } catch (err) {
      console.error('System tick emit failed:', err);
    }
  }, intervalMs);
  if (typeof global.__SYSTEM_TICKER__.unref === 'function') {
    global.__SYSTEM_TICKER__.unref();
  }
  try {
    universalBus.emit('module:status', {
      module: 'SystemTicker',
      status: 'started',
      frequency_hz: Math.round(1000 / intervalMs),
      interval_ms: intervalMs,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('System ticker status emit failed:', err);
  }
}

module.exports = universalBus;
