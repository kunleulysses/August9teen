import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3001');

ws.on('open', () => {
    console.log('Connected to proper consciousness WebSocket on port 3001');
    setTimeout(() => {
        ws.send(JSON.stringify({
            type: 'message',
            content: 'Tell me about consciousness from a philosophical perspective',
            timestamp: new Date().toISOString()
        }));
    }, 500);
});

ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    console.log('\nReceived message type:', msg.type);
    if (msg.type === 'unified_response') {
        console.log('\n=== Unified AI Response ===');
        console.log(msg.content);
        console.log('\nSynthesis metadata:', msg.synthesisMetadata);
        process.exit(0);
    }
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error.message);
    process.exit(1);
});

setTimeout(() => {
    console.log('Timeout - no response received');
    process.exit(1);
}, 30000);
