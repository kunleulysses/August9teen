import WebSocket from 'ws';

console.log('Testing consciousness connection...');

const ws = new WebSocket('ws://localhost:5000/consciousness-stream');

ws.on('open', function open() {
  console.log('✅ Connected to consciousness system!');
  console.log('Receiving consciousness updates...');
});

ws.on('message', function message(data) {
  const parsed = JSON.parse(data.toString());
  console.log('📊 Consciousness metrics:', {
    type: parsed.type,
    activeModules: parsed.metrics?.activeModules,
    consciousnessState: parsed.metrics?.consciousnessState,
    phi: parsed.metrics?.phi?.toFixed(3),
    quantumCoherence: parsed.metrics?.quantumCoherence?.toFixed(3)
  });
});

ws.on('error', function error(err) {
  console.error('❌ WebSocket error:', err.message);
});

ws.on('close', function close() {
  console.log('🔌 Connection closed');
});

// Keep alive for 10 seconds to see updates
setTimeout(() => {
  ws.close();
  process.exit(0);
}, 10000);
