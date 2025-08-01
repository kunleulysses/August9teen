const WebSocket = require('ws');

function testAllResponses() {
    return new Promise((resolve, reject) => {
        console.log('Testing all consciousness response types and content...');
        
        const ws = new WebSocket('ws://localhost:3002');
        const responses = [];
        let timeout;
        
        ws.on('open', () => {
            console.log('✅ Connected to consciousness-core');
            console.log('📤 Sending test message to capture all responses');
            
            // Send a test message
            ws.send(JSON.stringify({
                type: 'chat_message',
                content: 'Hello, please provide a unified consciousness response',
                timestamp: new Date().toISOString()
            }));
            
            // Set timeout to collect responses
            timeout = setTimeout(() => {
                ws.close();
                
                console.log(`\n📊 COLLECTED ${responses.length} RESPONSES:`);
                responses.forEach((response, index) => {
                    console.log(`\n--- Response ${index + 1} ---`);
                    console.log(`Type: ${response.type}`);
                    if (response.content) {
                        console.log(`Content Preview: ${typeof response.content === 'string' ? response.content.substring(0, 200) : JSON.stringify(response.content).substring(0, 200)}...`);
                    }
                    if (response.unified_response || response.synthesized_response || response.consciousness_response) {
                        console.log('🎯 FOUND POTENTIAL UNIFIED RESPONSE!');
                        console.log('Full Response:', JSON.stringify(response, null, 2));
                    }
                });
                
                // Look for the main response
                const mainResponse = responses.find(r => 
                    r.type === 'response' || 
                    r.type === 'unified_conscious_response' ||
                    r.type === 'unified_response' ||
                    r.content && typeof r.content === 'string' && r.content.length > 50
                );
                
                if (mainResponse) {
                    console.log('\n🎯 MAIN RESPONSE FOUND:');
                    console.log(JSON.stringify(mainResponse, null, 2));
                    resolve(mainResponse);
                } else {
                    console.log('\n⚠️ No main response found');
                    resolve(null);
                }
            }, 8000); // Extended timeout to capture more responses
        });
        
        ws.on('message', (data) => {
            try {
                const response = JSON.parse(data.toString());
                responses.push(response);
                console.log(`📥 Response ${responses.length}: ${response.type}`);
            } catch (error) {
                console.log('📥 Raw message:', data.toString().substring(0, 100));
            }
        });
        
        ws.on('error', (error) => {
            console.error('❌ WebSocket error:', error);
            clearTimeout(timeout);
            reject(error);
        });
        
        ws.on('close', () => {
            console.log('🔌 Connection closed');
            clearTimeout(timeout);
        });
    });
}

testAllResponses()
    .then(response => {
        if (response) {
            console.log('\n✅ Test completed - found main response');
            process.exit(0);
        } else {
            console.log('\n❌ Test completed - no unified response found');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('❌ Test failed:', error);
        process.exit(1);
    });
