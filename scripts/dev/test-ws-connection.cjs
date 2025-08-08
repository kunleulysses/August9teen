const fs = require('fs');
const WebSocket = require('ws');

const url = process.env.WS_URL || 'ws://127.0.0.1:3005';
const token = process.env.WS_TOKEN || (fs.existsSync('/tmp/jwt_hs256.txt') ? fs.readFileSync('/tmp/jwt_hs256.txt', 'utf8').trim() : '');

if (!token) {
  console.error('Missing WS_TOKEN or /tmp/jwt_hs256.txt');
  process.exit(1);
}

const ws = new WebSocket(url, token);

ws.on('open', () => {
  console.log('WS connected');
});

ws.on('message', (data) => {
  const text = data.toString();
  console.log('MSG:', text.slice(0, 300));
});

ws.on('error', (err) => {
  console.error('WS error:', err.message);
});

setTimeout(() => {
  try { ws.close(); } catch (_) {}
  process.exit(0);
}, 5000);