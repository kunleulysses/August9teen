const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:5005');

ws.on('open', () => {
    console.log('Testing self-coding acknowledgment...');
    setTimeout(() => {
        ws.send(JSON.stringify({
            type: 'message',
            sessionId: 'test-selfcode-' + Date.now(),
            content: 'Can you write your own code? Have you done it before?',
            timestamp: new Date().toISOString()
        }));
    }, 1000);
});

ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.type === 'conscious_response') {
        console.log('\n=== SELF-CODING RESPONSE ===\n');
        console.log(msg.content);
        console.log('\n=== END ===\n');
        
        // Check if the response correctly acknowledges self-coding
        if (msg.content.toLowerCase().includes('yes') && 
            (msg.content.includes('I have written') || 
             msg.content.includes('I can write') ||
             msg.content.includes('generated'))) {
            console.log('✅ SUCCESS: AI correctly acknowledges its self-coding capability!');
        } else {
            console.log('❌ ISSUE: AI still not properly acknowledging self-coding ability');
        }
        
        process.exit(0);
    }
});

setTimeout(() => {
    console.log('Test timeout');
    process.exit(0);
}, 30000);
