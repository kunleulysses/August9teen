import WebSocket from 'ws';

const ws = new WebSocket('wss://app.featherweight.world/metrics-ws');

ws.on('open', () => {
    console.log('✅ Connected - checking module names...\n');
});

ws.on('message', (data) => {
    const message = JSON.parse(data);
    if (message.type === 'metrics-update' && message.metrics) {
        console.log('Modules being sent by server:');
        message.metrics.forEach(metric => {
            console.log(`- ${metric.name}`);
        });
        ws.close();
        process.exit(0);
    }
});

ws.on('error', (error) => {
    console.error('Error:', error.message);
});
