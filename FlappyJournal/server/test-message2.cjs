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
    console.log('\nReceived type:', msg.type);
    if (msg.type === 'conscious_response') {
        console.log('Content:', msg.content);
        console.log('Metrics:', JSON.stringify(msg.metrics, null, 2));
        process.exit(0);
    }
});

setTimeout(() => {
    console.log('Timeout');
    process.exit(1);
}, 10000);
