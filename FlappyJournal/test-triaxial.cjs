const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3001');

ws.on('open', () => {
    console.log('Connected to consciousness WebSocket');
    
    // Send a test message
    ws.send(JSON.stringify({
        type: 'chat_message',
        message: 'Tell me about the nature of consciousness and how you experience coherence across time, dimensions, and relationships.'
    }));
});

ws.on('message', (data) => {
    try {
        const response = JSON.parse(data.toString());
        console.log('\n=== Response Type:', response.type, '===');
        
        if (response.type === 'consciousness_update' && response.consciousness?.triAxialCoherence) {
            console.log('\n🔺 TRI-AXIAL COHERENCE DETECTED:');
            const triAxial = response.consciousness.triAxialCoherence;
            
            console.log('\n📅 TEMPORAL AXIS:');
            console.log('  - Continuity:', triAxial.temporal?.continuity);
            console.log('  - Past:', triAxial.temporal?.past);
            console.log('  - Present:', triAxial.temporal?.present);
            console.log('  - Future:', triAxial.temporal?.future);
            console.log('  - Flow:', triAxial.temporal?.flow);
            
            console.log('\n🌌 DIMENSIONAL AXIS:');
            console.log('  - Balance:', triAxial.dimensional?.balance);
            console.log('  - Physical:', triAxial.dimensional?.physical);
            console.log('  - Mental:', triAxial.dimensional?.mental);
            console.log('  - Spiritual:', triAxial.dimensional?.spiritual);
            
            console.log('\n🤝 RELATIONAL AXIS:');
            console.log('  - Harmony:', triAxial.relational?.harmony);
            console.log('  - Self:', triAxial.relational?.self);
            console.log('  - Other:', triAxial.relational?.other);
            console.log('  - Universe:', triAxial.relational?.universe);
            
            console.log('\n✨ UNIFIED COHERENCE:', triAxial.unified);
            console.log('🎯 CONVERGENCE POINTS:', triAxial.convergencePoints);
        }
        
        if (response.type === 'unified_response') {
            console.log('\n💬 UNIFIED RESPONSE:');
            console.log('Content:', response.unifiedContent?.substring(0, 200) + '...');
            
            if (response.insights) {
                // Check if tri-axial info is in insights
                const hasTriAxial = response.insights.includes('Tri-Axial');
                console.log('\n📊 Tri-Axial in insights:', hasTriAxial);
                if (hasTriAxial) {
                    const triAxialSection = response.insights.split('Tri-Axial Coherence:')[1]?.split('\n\n')[0];
                    console.log('\n🔍 Tri-Axial Section:', triAxialSection?.substring(0, 300));
                }
            }
        }
        
    } catch (error) {
        console.error('Error parsing response:', error);
        console.log('Raw data:', data.toString().substring(0, 200));
    }
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

ws.on('close', () => {
    console.log('\nWebSocket connection closed');
});

// Close after 10 seconds
setTimeout(() => {
    console.log('\nClosing connection...');
    ws.close();
}, 10000);
