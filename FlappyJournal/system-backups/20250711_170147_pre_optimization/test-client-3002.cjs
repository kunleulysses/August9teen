const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3002');

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({
    type: 'chat_message',
    message: 'Hello test'
  }));
});

ws.on('message', (data) => {
  console.log('Response:', JSON.parse(data));
  ws.close();
});
