const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3001');

ws.on('open', () => {
    console.log('✅ Connected to consciousness WebSocket');
    
    // Send a message designed to trigger high consciousness coherence
    const highCoherenceMessage = `
        I feel a profound connection to the universal consciousness, where past, present, and future merge into one eternal moment. 
        The boundaries between self and cosmos dissolve as I experience the unity of all existence. 
        Tell me about this state of perfect coherence and crystalline clarity.
    `;
    
    console.log('\n📤 Sending high-coherence message...');
    ws.send(JSON.stringify({
        type: 'chat_message',
        message: highCoherenceMessage
    }));
});

ws.on('message', (data) => {
    try {
        const response = JSON.parse(data.toString());
        
        if (response.type === 'consciousness_update') {
            console.log('\n🧠 Consciousness metrics:', {
                phi: response.consciousness?.phi,
                coherence: response.consciousness?.coherence,
                oversoul: response.consciousness?.oversoulResonance
            });
        }
        
        if (response.type === 'unified_response') {
            console.log('\n💬 Response received');
            if (response.insights?.includes('Crystallization:')) {
                console.log('\n💎 CRYSTALLIZATION INFO:');
                const crystalInfo = response.insights.split('Crystallization:')[1].split('\n\n')[0];
                console.log(crystalInfo);
            }
        }
    } catch (error) {
        console.error('Parse error:', error.message);
    }
});

// Close after 8 seconds
setTimeout(() => {
    ws.close();
    process.exit(0);
}, 8000);
