const WebSocket = require('ws');

const ws = new WebSocket('wss://app.featherweight.world/metrics-ws');

ws.on('open', () => {
    console.log('✅ Connected to metrics WebSocket');
    ws.send(JSON.stringify({ type: 'subscribe', channel: 'metrics' }));
});

ws.on('message', (data) => {
    const message = JSON.parse(data);
    if (message.type === 'metrics-update' && message.metrics) {
        console.log('\n📊 Metrics Update:', new Date().toISOString());
        console.log('Total modules reporting:', message.metrics.length);
        message.metrics.forEach(metric => {
            console.log(`- ${metric.name}: ${metric.metric} = ${metric.value}`);
        });
    }
});

ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
});

// Close after 3 seconds
setTimeout(() => {
    ws.close();
    process.exit(0);
}, 3000);
