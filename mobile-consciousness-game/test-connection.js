/**
 * Test Connection Script - Verify mobile app can connect to consciousness system
 * Run this to test the WebSocket connection before running the mobile app
 */

const WebSocket = require('ws');

const SERVER_URL = process.env.WS_URL || 'ws://localhost:5000/ws/game';

console.log('🧪 Testing connection to consciousness system...');
console.log(`📡 Connecting to: ${SERVER_URL}`);

const ws = new WebSocket(SERVER_URL);

ws.on('open', () => {
    console.log('✅ Connected to consciousness system!');
    
    // Send mobile client handshake
    const handshake = {
        type: 'game:connect',
        payload: {
            clientType: 'mobile_companion',
            version: '1.0.0',
            userAgent: 'react-native test client'
        }
    };
    
    console.log('📤 Sending handshake...');
    ws.send(JSON.stringify(handshake));
    
    // Test companion feeding
    setTimeout(() => {
        console.log('📤 Testing companion feeding...');
        ws.send(JSON.stringify({
            type: 'companion:feed',
            payload: {
                foodType: 'apple'
            }
        }));
    }, 2000);
    
    // Test world exploration
    setTimeout(() => {
        console.log('📤 Testing world exploration...');
        ws.send(JSON.stringify({
            type: 'world:explore',
            payload: {
                area: 'forest'
            }
        }));
    }, 4000);
    
    // Close connection after tests
    setTimeout(() => {
        console.log('🔌 Closing test connection...');
        ws.close();
    }, 6000);
});

ws.on('message', (data) => {
    try {
        const message = JSON.parse(data);
        console.log(`📥 Received: ${message.type}`);
        
        if (message.payload) {
            console.log(`   Data:`, JSON.stringify(message.payload, null, 2));
        }
        
        // Special handling for key events
        switch (message.type) {
            case 'game:initial_state':
                console.log('🎮 Game initialized successfully!');
                console.log(`   Player: ${message.payload.player?.username}`);
                console.log(`   Companion: ${message.payload.companion?.name}`);
                break;
                
            case 'companion:mood_change':
                console.log('😊 Companion mood changed!');
                console.log(`   Mood: ${message.payload.mood}`);
                console.log(`   Message: ${message.payload.message}`);
                break;
                
            case 'world:event':
                console.log('🌍 World event generated!');
                console.log(`   Area: ${message.payload.area}`);
                console.log(`   Encounter: ${message.payload.encounter?.name}`);
                break;
                
            case 'consciousness:heartbeat':
                console.log('💓 Consciousness system heartbeat received');
                break;
        }
        
    } catch (error) {
        console.error('❌ Error parsing message:', error);
        console.log('Raw message:', data.toString());
    }
});

ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
        console.log('💡 Make sure your consciousness system is running on port 3015');
        console.log('   Try: npm start (in the main project directory)');
    }
});

ws.on('close', (code, reason) => {
    console.log(`🔌 Connection closed: ${code} ${reason}`);
    
    if (code === 1000) {
        console.log('✅ Test completed successfully!');
        console.log('🚀 Your mobile app should now be able to connect');
    } else {
        console.log('⚠️  Connection closed unexpectedly');
    }
    
    process.exit(0);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Test interrupted');
    ws.close();
    process.exit(0);
});
