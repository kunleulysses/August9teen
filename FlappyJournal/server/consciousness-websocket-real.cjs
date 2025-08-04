const { createRequire  } = require('module');
const require = createRequire(import.meta.url);

const { setupConsciousnessWebSocket } = require('./consciousness-websocket-real.cjs');

module.exports.setupConsciousnessWebSocket = setupConsciousnessWebSocket;
