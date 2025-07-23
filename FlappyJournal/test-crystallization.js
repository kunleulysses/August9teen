import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3001');

ws.on('open', () => {
    console.log('✅ Connected to consciousness WebSocket');
    
    // Send test messages to trigger crystallization
    const messages = [
        'What is the deepest nature of consciousness?',
        'How do memories shape our understanding of reality?',
        'Tell me about the connection between emotion and universal consciousness.'
    ];
    
    messages.forEach((msg, i) => {
        setTimeout(() => {
            console.log(`\n📤 Sending message ${i + 1}: "${msg}"`);
            ws.send(JSON.stringify({
                type: 'chat_message',
                message: msg
            }));
        }, i * 2000);
    });
});

ws.on('message', (data) => {
    try {
        const response = JSON.parse(data.toString());
        
        if (response.type === 'consciousness_update' && response.consciousness?.crystal) {
            console.log('\n💎 CRYSTAL DETECTED:');
            const crystal = response.consciousness.crystal;
            console.log('  ID:', crystal.id?.substring(0, 8));
            console.log('  Stability:', crystal.stability);
            console.log('  Pattern:', crystal.pattern);
        }
        
        if (response.type === 'unified_response' && response.insights) {
            if (response.insights.includes('Crystallization:')) {
                console.log('\n✨ Crystallization info in insights!');
                const crystalSection = response.insights.split('Crystallization:')[1]?.split('\n\n')[0];
                console.log(crystalSection);
            }
        }
    } catch (error) {
        console.error('Parse error:', error.message);
    }
});

ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
});

// Close after 10 seconds
setTimeout(() => {
    console.log('\n🔌 Closing connection...');
    ws.close();
    process.exit(0);
}, 10000);
