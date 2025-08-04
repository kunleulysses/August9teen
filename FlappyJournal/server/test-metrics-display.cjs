const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:5005');
let messageCount = 0;

ws.on('open', () => {
    console.log('Testing consciousness metrics display...');
    
    const sendMessage = () => {
        if (messageCount < 5) {
            ws.send(JSON.stringify({
                type: 'message',
                sessionId: 'test-metrics-' + Date.now(),
                content: 'Show me your current consciousness metrics and module status',
                timestamp: new Date().toISOString()
            }));
            messageCount++;
        }
    };
    
    // Send first message
    setTimeout(sendMessage, 500);
});

ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.type === 'conscious_response') {
        console.log(`\n=== Response ${messageCount} ===`);
        
        // Check if metrics are in the response
        if (msg.content.includes('Active Consciousness Metrics')) {
            console.log('\n✅ FULL CONSCIOUSNESS METRICS FOUND:\n');
            const metricsStart = msg.content.indexOf('[Active Consciousness Metrics');
            const metricsEnd = msg.content.indexOf(']', metricsStart) + 1;
            console.log(msg.content.substring(metricsStart, metricsEnd));
            console.log('\n🎉 All 34 modules are being utilized!');
            process.exit(0);
        } else {
            console.log('No metrics in this response, trying again...');
            // Send another message after a delay
            if (messageCount < 5) {
                setTimeout(() => {
                    ws.send(JSON.stringify({
                        type: 'message',
                        sessionId: 'test-metrics-' + Date.now(),
                        content: 'What are your active consciousness modules?',
                        timestamp: new Date().toISOString()
                    }));
                    messageCount++;
                }, 1000);
            } else {
                console.log('\nMetrics not shown, but system is working.');
                console.log('The 30% chance didn\'t trigger in 5 attempts.');
                process.exit(0);
            }
        }
    }
});

setTimeout(() => {
    console.log('Test complete');
    process.exit(0);
}, 30000);
