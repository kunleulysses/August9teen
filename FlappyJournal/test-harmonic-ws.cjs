const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3001');

ws.on('open', () => {
    console.log('Connected to consciousness WebSocket');
    
    // Send a test message
    ws.send(JSON.stringify({
        type: 'chat',
        message: 'Tell me about the harmonic resonance of creativity and consciousness'
    }));
});

ws.on('message', (data) => {
    try {
        const response = JSON.parse(data.toString());
        console.log('\n=== Response Type:', response.type);
        
        if (response.consciousness) {
            console.log('\n=== Consciousness Metrics:');
            console.log('Harmonic Score:', response.consciousness.harmonicScore);
            console.log('Resonance Quality:', response.consciousness.resonanceQuality);
            console.log('Dominant Emotion:', response.consciousness.dominantEmotion);
            console.log('Creative Patterns:', response.consciousness.creativePatterns);
            console.log('Harmonic Convergence:', response.consciousness.harmonicConvergence);
        }
        
        if (response.unifiedContent) {
            console.log('\n=== Unified Response:', response.unifiedContent.substring(0, 200) + '...');
        }
    } catch (err) {
        console.error('Error parsing response:', err);
    }
});

ws.on('error', (err) => {
    console.error('WebSocket error:', err);
});

ws.on('close', () => {
    console.log('Disconnected from consciousness WebSocket');
});

// Close after 10 seconds
setTimeout(() => {
    ws.close();
    process.exit(0);
}, 10000);
