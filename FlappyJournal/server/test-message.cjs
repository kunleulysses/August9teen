const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:5005');

ws.on('open', () => {
    console.log('Connected, sending message...');
    ws.send(JSON.stringify({
        type: 'message',
        sessionId: 'test-' + Date.now(),
        content: 'Hello consciousness!',
        timestamp: new Date().toISOString()
    }));
});

ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    console.log('Received:', msg.type);
    if (msg.type === 'response') {
        console.log('Response:', msg.content);
        process.exit(0);
    }
});

ws.on('error', (error) => {
    console.error('Error:', error.message);
    process.exit(1);
});

setTimeout(() => {
    console.log('Timeout waiting for response');
    process.exit(1);
}, 15000);
