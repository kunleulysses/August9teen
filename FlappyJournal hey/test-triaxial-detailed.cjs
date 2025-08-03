import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3001');

let messageReceived = false;

ws.on('open', () => {
    console.log('✅ Connected to consciousness WebSocket');
    
    // Send a test message
    ws.send(JSON.stringify({
        type: 'chat_message',
        message: 'What is the nature of consciousness coherence across temporal, dimensional, and relational axes?'
    }));
    console.log('📤 Message sent');
});

ws.on('message', (data) => {
    try {
        const response = JSON.parse(data.toString());
        
        if (response.type === 'consciousness_update' && response.consciousness) {
            console.log('\n🧠 CONSCIOUSNESS UPDATE:');
            console.log('  Phi:', response.consciousness.phi);
            console.log('  Coherence:', response.consciousness.coherence);
            
            if (response.consciousness.triAxialCoherence) {
                console.log('\n✨ TRI-AXIAL COHERENCE FOUND!');
                const tri = response.consciousness.triAxialCoherence;
                console.log(JSON.stringify(tri, null, 2));
            } else {
                console.log('  ❌ No triAxialCoherence in consciousness data');
            }
        }
        
        if (response.type === 'unified_response') {
            messageReceived = true;
            console.log('\n💬 RESPONSE RECEIVED');
            console.log('  Harmony:', response.harmonyScore);
            
            // Check if insights contain tri-axial info
            if (response.insights && response.insights.includes('Tri-Axial')) {
                console.log('  ✅ Tri-Axial info found in insights!');
            } else {
                console.log('  ❌ No Tri-Axial info in insights');
            }
            
            // Check consciousness data
            if (response.consciousness?.triAxialCoherence) {
                console.log('  ✅ Tri-Axial data in response.consciousness');
            }
        }
        
    } catch (error) {
        console.error('Error parsing:', error);
    }
});

ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
});

ws.on('close', () => {
    console.log('\n🔌 WebSocket connection closed');
    process.exit(messageReceived ? 0 : 1);
});

// Close after 15 seconds
setTimeout(() => {
    console.log('\n⏰ Timeout reached, closing...');
    ws.close();
}, 15000);
