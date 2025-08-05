const WebSocket = require('ws');

async function run() {
  const ws = new WebSocket('ws://localhost:3001');
  let bytes = 0;

  ws.on('open', () => {
    for (let i = 0; i < 1000; i++) {
      const message = `test message ${i}`;
      ws.send(message);
      bytes += message.length;
    }
  });

  ws.on('close', () => {
    console.log(`Total bytes sent: ${bytes}`);
  });
}

run();