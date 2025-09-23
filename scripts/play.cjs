#!/usr/bin/env node
// Send a turn action to the WS server and print the result
const WebSocket = require('ws');

function arg(k, def) {
  const idx = process.argv.indexOf(k);
  if (idx >= 0 && process.argv[idx+1]) return process.argv[idx+1];
  return def;
}

const url = process.env.WS_URL || arg('--url', 'ws://localhost:3015/ws/unified-chat');
const token = process.env.TOKEN || arg('--token', '');
const action = process.env.ACTION || arg('--action', 'look around');

const ws = new WebSocket(url, token ? token : undefined);
ws.on('open', () => {
  console.log('Connected →', url);
  ws.send(JSON.stringify({ type: 'act', action }));
});
ws.on('message', (data) => {
  try {
    const msg = JSON.parse(String(data));
    if (msg.type === 'turn') {
      console.log('\nTURN:', msg.turnId || '');
      console.log(msg.narrative || '');
      if (Array.isArray(msg.choices) && msg.choices.length) {
        console.log('\nChoices:');
        msg.choices.forEach((c, i) => console.log(`  ${i+1}. ${c}`));
      }
      process.exit(0);
    } else if (msg.type === 'error') {
      console.error('Error:', msg.message);
    } else if (msg.type === 'chunk') {
      process.stdout.write(String(msg.content || ''));
    }
  } catch (_) {
    console.log(String(data));
  }
});
ws.on('error', (e) => console.error('WS error:', e && e.message));

