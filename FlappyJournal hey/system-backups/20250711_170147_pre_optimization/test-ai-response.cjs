import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:5005');

ws.on('open', () => {
    console.log('Connected, sending test message...');
    setTimeout(() => {
        ws.send(JSON.stringify({
            type: 'message',
            sessionId: 'test-ai-' + Date.now(),
            content: 'What is consciousness from your perspective?',
            timestamp: new Date().toISOString()
        }));
    }, 1000);
});

ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.type === 'conscious_response') {
        console.log('\n=== AI Response ===');
        console.log(msg.content);
        console.log('\nProcessing time:', msg.processingTime, 'ms');
        console.log('Modules active:', msg.modulesActive);
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
}, 20000);
