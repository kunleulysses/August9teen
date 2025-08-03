import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:5004');

ws.on('open', () => {
    console.log('✅ Connected to metrics WebSocket');
    ws.send(JSON.stringify({ type: 'subscribe', channel: 'metrics' }));
});

ws.on('message', (data) => {
    const message = JSON.parse(data);
    console.log('\n📊 Received metrics update:');
    console.log(`Type: ${message.type}`);
    console.log(`Timestamp: ${message.timestamp}`);
    if (message.metrics && message.metrics.length > 0) {
        console.log(`Modules reporting: ${message.metrics.length}`);
        message.metrics.slice(0, 3).forEach(metric => {
            console.log(`  - ${metric.name}: ${metric.value} (${metric.status})`);
        });
    }
});

ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
});

ws.on('close', () => {
    console.log('🔌 Disconnected from metrics WebSocket');
});

// Close after 5 seconds
setTimeout(() => {
    ws.close();
    process.exit(0);
}, 5000);
