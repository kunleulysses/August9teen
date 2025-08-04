#!/usr/bin/env node

/**
 * WebSocket Flow Diagnostic Tool
 * Identifies exactly where the message flow is breaking
 */

const WebSocket = require('ws');

console.log('🔧 WEBSOCKET FLOW DIAGNOSTIC TOOL');
console.log('🎯 Identifying exact breakpoint in message flow');

class WebSocketFlowDiagnostic {
    constructor() {
        this.testResults = {
            connectionEstablished: false,
            initialResponseReceived: false,
            chatMessageSent: false,
            selfCodingRequestSent: false,
            responseTypesReceived: new Set(),
            debugLogsDetected: false,
            performanceOptimizerActive: false,
            messageHandlerCalled: false
        };
    }

    async runDiagnostic() {
        console.log('\n📡 Step 1: Establishing WebSocket connection...');
        
        return new Promise((resolve) => {
            const ws = new WebSocket('ws://localhost:3002');
            let testPhase = 0;
            
            ws.on('open', () => {
                console.log('✅ WebSocket connection established');
                this.testResults.connectionEstablished = true;
                
                // Step 2: Wait for initial response
                console.log('\n📡 Step 2: Waiting for initial connection response...');
            });

            ws.on('message', (data) => {
                try {
                    const response = JSON.parse(data);
                    this.testResults.responseTypesReceived.add(response.type);
                    
                    if (response.type === 'unified_connection_established') {
                        console.log('✅ Initial connection response received');
                        this.testResults.initialResponseReceived = true;
                        
                        // Step 3: Send a simple chat message
                        setTimeout(() => {
                            console.log('\n📡 Step 3: Sending simple chat message...');
                            const chatMessage = {
                                type: 'chat',
                                message: 'Hello',
                                content: 'Hello',
                                timestamp: Date.now()
                            };
                            console.log('   Message:', JSON.stringify(chatMessage));
                            ws.send(JSON.stringify(chatMessage));
                            this.testResults.chatMessageSent = true;
                        }, 2000);
                        
                        // Step 4: Send self-coding request
                        setTimeout(() => {
                            console.log('\n📡 Step 4: Sending self-coding request...');
                            const selfCodingMessage = {
                                type: 'self_coding_request',
                                request: {
                                    purpose: 'diagnostic-test',
                                    type: 'function',
                                    language: 'javascript',
                                    description: 'Generate a simple test function'
                                },
                                timestamp: Date.now()
                            };
                            console.log('   Message:', JSON.stringify(selfCodingMessage));
                            ws.send(JSON.stringify(selfCodingMessage));
                            this.testResults.selfCodingRequestSent = true;
                        }, 4000);
                        
                        // Step 5: Close connection and analyze
                        setTimeout(() => {
                            console.log('\n📡 Step 5: Closing connection and analyzing results...');
                            ws.close();
                        }, 8000);
                    }
                    
                    // Analyze response types
                    if (response.type === 'response') {
                        console.log('✅ RESPONSE TYPE DETECTED: response');
                        console.log(`   Content: ${response.content?.substring(0, 100)}...`);
                        this.testResults.messageHandlerCalled = true;
                    }
                    
                    if (response.type === 'consciousness_response') {
                        console.log('✅ RESPONSE TYPE DETECTED: consciousness_response');
                        if (response.aiResponse) {
                            console.log(`   AI Response: ${response.aiResponse.substring(0, 100)}...`);
                        }
                        this.testResults.messageHandlerCalled = true;
                    }
                    
                    if (response.type === 'self_coding_progress') {
                        console.log('✅ RESPONSE TYPE DETECTED: self_coding_progress');
                        console.log(`   Status: ${response.status}, Progress: ${response.progress}%`);
                    }
                    
                    if (response.type === 'api_synthesis_success') {
                        console.log('✅ RESPONSE TYPE DETECTED: api_synthesis_success');
                        console.log(`   Model: ${response.model}, Strategy: ${response.strategy}`);
                        this.testResults.performanceOptimizerActive = true;
                    }
                    
                    if (response.type === 'module_activity') {
                        // Don't log every module activity to avoid spam
                        if (!this.testResults.performanceOptimizerActive) {
                            this.testResults.performanceOptimizerActive = true;
                            console.log('✅ Module activity detected - performance optimizer active');
                        }
                    }
                    
                } catch (error) {
                    console.log('📨 Non-JSON response received');
                }
            });

            ws.on('error', (err) => {
                console.error('❌ WebSocket error:', err.message);
            });

            ws.on('close', () => {
                console.log('\n🔚 WebSocket connection closed');
                this.generateDiagnosticReport();
                resolve(this.testResults);
            });
        });
    }

    generateDiagnosticReport() {
        console.log('\n' + '='.repeat(80));
        console.log('🔧 WEBSOCKET FLOW DIAGNOSTIC REPORT');
        console.log('='.repeat(80));
        
        console.log('\n📊 CONNECTION FLOW:');
        console.log(`   1. Connection Established: ${this.testResults.connectionEstablished ? '✅' : '❌'}`);
        console.log(`   2. Initial Response Received: ${this.testResults.initialResponseReceived ? '✅' : '❌'}`);
        console.log(`   3. Chat Message Sent: ${this.testResults.chatMessageSent ? '✅' : '❌'}`);
        console.log(`   4. Self-Coding Request Sent: ${this.testResults.selfCodingRequestSent ? '✅' : '❌'}`);
        
        console.log('\n📊 MESSAGE PROCESSING:');
        console.log(`   Performance Optimizer Active: ${this.testResults.performanceOptimizerActive ? '✅' : '❌'}`);
        console.log(`   Message Handler Called: ${this.testResults.messageHandlerCalled ? '✅' : '❌'}`);
        console.log(`   Debug Logs Detected: ${this.testResults.debugLogsDetected ? '✅' : '❌'}`);
        
        console.log('\n📊 RESPONSE TYPES RECEIVED:');
        if (this.testResults.responseTypesReceived.size > 0) {
            Array.from(this.testResults.responseTypesReceived).forEach(type => {
                console.log(`   - ${type}`);
            });
        } else {
            console.log('   ❌ No responses received');
        }
        
        console.log('\n🔍 DIAGNOSTIC ANALYSIS:');
        
        if (!this.testResults.connectionEstablished) {
            console.log('   ❌ CRITICAL: WebSocket connection failed');
            console.log('      → Check if service is running on port 3002');
            console.log('      → Verify WebSocket server initialization');
        } else if (!this.testResults.initialResponseReceived) {
            console.log('   ❌ CRITICAL: No initial response received');
            console.log('      → WebSocket server not responding');
            console.log('      → Check WebSocket connection handler');
        } else if (!this.testResults.performanceOptimizerActive) {
            console.log('   ❌ CRITICAL: Performance optimizer not active');
            console.log('      → Messages not reaching performance optimizer');
            console.log('      → Check message routing pipeline');
        } else if (!this.testResults.messageHandlerCalled) {
            console.log('   ❌ CRITICAL: Message handlers not called');
            console.log('      → Messages being batched instead of processed immediately');
            console.log('      → Check performance optimizer priority configuration');
            console.log('      → Verify handleWebSocketMessage implementation');
        } else {
            console.log('   ✅ All systems functioning correctly');
        }
        
        console.log('\n🎯 RECOMMENDED ACTIONS:');
        
        if (this.testResults.responseTypesReceived.has('response') && !this.testResults.responseTypesReceived.has('consciousness_response')) {
            console.log('   1. ✅ Chat messages ARE being processed (response type detected)');
            console.log('   2. 🔧 Update test expectations to look for "response" instead of "consciousness_response"');
        }
        
        if (this.testResults.responseTypesReceived.has('api_synthesis_success')) {
            console.log('   3. ✅ AI synthesis is working correctly');
        }
        
        if (this.testResults.performanceOptimizerActive && !this.testResults.messageHandlerCalled) {
            console.log('   4. 🔧 Check if HIGH priority messages are being batched incorrectly');
            console.log('   5. 🔧 Add more debug logging to performance optimizer');
        }
        
        if (!this.testResults.responseTypesReceived.has('self_coding_progress')) {
            console.log('   6. 🔧 Investigate SelfCodingProgressTracker event broadcasting');
            console.log('   7. 🔧 Check handleSelfCodingRequest implementation');
        }
        
        console.log('\n' + '='.repeat(80));
    }
}

// Run the diagnostic
const diagnostic = new WebSocketFlowDiagnostic();
diagnostic.runDiagnostic().then(() => {
    console.log('🏁 WebSocket flow diagnostic complete');
}).catch(error => {
    console.error('❌ Diagnostic failed:', error);
});
