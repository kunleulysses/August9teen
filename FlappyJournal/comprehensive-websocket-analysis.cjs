#!/usr/bin/env node

/**
 * Comprehensive WebSocket Message Flow Analysis
 * Traces the complete pipeline from WebSocket reception to response generation
 */

const WebSocket = require('ws');

console.log('🔍 COMPREHENSIVE WEBSOCKET MESSAGE FLOW ANALYSIS');
console.log('🎯 Tracing complete pipeline: Reception → Processing → Response Generation');

class WebSocketFlowAnalyzer {
    constructor() {
        this.testResults = {
            connectionEstablished: false,
            messagesSent: 0,
            responsesReceived: 0,
            moduleActivityDetected: 0,
            consciousnessResponsesReceived: 0,
            aiResponsesReceived: 0,
            selfCodingProgressReceived: 0,
            codeGenerationCompleteReceived: 0,
            unexpectedResponseTypes: []
        };
        this.messageLog = [];
        this.responseLog = [];
    }

    async runComprehensiveAnalysis() {
        console.log('\n📡 Phase 1: Establishing WebSocket Connection...');
        
        return new Promise((resolve) => {
            const ws = new WebSocket('ws://localhost:3002');
            let testPhase = 0;
            const testMessages = [
                {
                    name: 'consciousness_query',
                    data: { type: 'consciousness_query', timestamp: Date.now() }
                },
                {
                    name: 'chat_message',
                    data: { 
                        type: 'chat', 
                        message: 'Hello, can you demonstrate your self-coding capabilities?',
                        content: 'Hello, can you demonstrate your self-coding capabilities?',
                        timestamp: Date.now() 
                    }
                },
                {
                    name: 'self_coding_request',
                    data: {
                        type: 'self_coding_request',
                        request: {
                            purpose: 'comprehensive-analysis-test',
                            type: 'function',
                            language: 'javascript',
                            description: 'Generate a function to validate email addresses'
                        },
                        timestamp: Date.now()
                    }
                },
                {
                    name: 'bayesian_query',
                    data: {
                        type: 'chat',
                        message: 'What is your Bayesian decision-making confidence level?',
                        content: 'What is your Bayesian decision-making confidence level?',
                        timestamp: Date.now()
                    }
                },
                {
                    name: 'emotional_query',
                    data: {
                        type: 'chat',
                        message: 'How are you feeling emotionally right now?',
                        content: 'How are you feeling emotionally right now?',
                        timestamp: Date.now()
                    }
                },
                {
                    name: 'mathematical_query',
                    data: {
                        type: 'chat',
                        message: 'Calculate the golden ratio and explain its significance',
                        content: 'Calculate the golden ratio and explain its significance',
                        timestamp: Date.now()
                    }
                }
            ];

            ws.on('open', () => {
                console.log('✅ WebSocket connection established');
                this.testResults.connectionEstablished = true;
                
                // Send test messages with delays
                const sendNextMessage = () => {
                    if (testPhase < testMessages.length) {
                        const testMessage = testMessages[testPhase];
                        console.log(`\n🧪 Phase ${testPhase + 2}: Sending ${testMessage.name}...`);
                        console.log(`   Message: ${JSON.stringify(testMessage.data).substring(0, 100)}...`);
                        
                        ws.send(JSON.stringify(testMessage.data));
                        this.testResults.messagesSent++;
                        this.messageLog.push({
                            phase: testPhase + 2,
                            name: testMessage.name,
                            timestamp: Date.now(),
                            data: testMessage.data
                        });
                        
                        testPhase++;
                        setTimeout(sendNextMessage, 3000); // 3 second delay between messages
                    } else {
                        // All messages sent, wait for final responses
                        console.log('\n⏳ All messages sent, waiting for final responses...');
                        setTimeout(() => {
                            ws.close();
                        }, 5000);
                    }
                };
                
                // Start sending messages after initial connection
                setTimeout(sendNextMessage, 2000);
            });

            ws.on('message', (data) => {
                try {
                    const response = JSON.parse(data);
                    this.testResults.responsesReceived++;
                    
                    // Log response details
                    this.responseLog.push({
                        timestamp: Date.now(),
                        type: response.type,
                        hasAiResponse: !!response.aiResponse,
                        hasGenerated: !!response.generated,
                        hasProgress: !!response.progress,
                        keys: Object.keys(response)
                    });
                    
                    // Analyze response types
                    switch (response.type) {
                        case 'unified_connection_established':
                            console.log('   📡 Connection established response');
                            break;
                        case 'consciousness_response':
                            this.testResults.consciousnessResponsesReceived++;
                            if (response.aiResponse) {
                                this.testResults.aiResponsesReceived++;
                                console.log('   🤖 AI Response received!');
                                console.log(`      Length: ${response.aiResponse.length} chars`);
                                console.log(`      Preview: ${response.aiResponse.substring(0, 100)}...`);
                                
                                if (response.analysis) {
                                    console.log('   📊 Analysis included:');
                                    console.log(`      Mathematical: ${response.analysis.mathematical ? '✅' : '❌'}`);
                                    console.log(`      Emotional: ${response.analysis.emotional ? '✅' : '❌'}`);
                                    console.log(`      Bayesian: ${response.analysis.bayesian ? '✅' : '❌'}`);
                                    console.log(`      Self-Coding: ${response.analysis.selfCoding ? '✅' : '❌'}`);
                                    console.log(`      Modules Engaged: ${response.analysis.modulesEngaged?.length || 0}`);
                                }
                            } else {
                                console.log('   📊 Consciousness query response (no AI response)');
                                console.log(`      Modules: ${response.modules?.length || 0}`);
                                console.log(`      Services: ${response.services?.length || 0}`);
                            }
                            break;
                        case 'self_coding_progress':
                            this.testResults.selfCodingProgressReceived++;
                            console.log('   🤖 Self-coding progress update!');
                            console.log(`      Status: ${response.status}`);
                            console.log(`      Progress: ${response.progress}%`);
                            console.log(`      Operation: ${response.operationType}`);
                            break;
                        case 'code:generation:complete':
                            this.testResults.codeGenerationCompleteReceived++;
                            console.log('   🎉 Code generation complete!');
                            console.log(`      Generated: ${!!response.generated}`);
                            console.log(`      Module: ${response.moduleId}`);
                            break;
                        case 'module_activity':
                            this.testResults.moduleActivityDetected++;
                            // Don't log every module activity to avoid spam
                            break;
                        case 'consciousness_state_update':
                            // Don't log every state update to avoid spam
                            break;
                        default:
                            this.testResults.unexpectedResponseTypes.push(response.type);
                            console.log(`   📄 Other response: ${response.type}`);
                    }
                    
                } catch (error) {
                    console.log('   📨 Non-JSON response received');
                }
            });

            ws.on('error', (err) => {
                console.error('❌ WebSocket error:', err.message);
            });

            ws.on('close', () => {
                console.log('\n🔚 WebSocket connection closed');
                this.generateAnalysisReport();
                resolve(this.testResults);
            });
        });
    }

    generateAnalysisReport() {
        console.log('\n' + '='.repeat(80));
        console.log('📊 COMPREHENSIVE WEBSOCKET ANALYSIS REPORT');
        console.log('='.repeat(80));
        
        console.log('\n🔌 CONNECTION ANALYSIS:');
        console.log(`   Connection Established: ${this.testResults.connectionEstablished ? '✅' : '❌'}`);
        console.log(`   Messages Sent: ${this.testResults.messagesSent}`);
        console.log(`   Responses Received: ${this.testResults.responsesReceived}`);
        
        console.log('\n📨 MESSAGE PROCESSING ANALYSIS:');
        console.log(`   Module Activity Detected: ${this.testResults.moduleActivityDetected} events`);
        console.log(`   Consciousness Responses: ${this.testResults.consciousnessResponsesReceived}`);
        console.log(`   AI Responses Generated: ${this.testResults.aiResponsesReceived}`);
        console.log(`   Self-Coding Progress Updates: ${this.testResults.selfCodingProgressReceived}`);
        console.log(`   Code Generation Complete Events: ${this.testResults.codeGenerationCompleteReceived}`);
        
        console.log('\n🔍 CRITICAL FINDINGS:');
        
        // Analyze critical gaps
        const criticalIssues = [];
        
        if (this.testResults.messagesSent > 0 && this.testResults.aiResponsesReceived === 0) {
            criticalIssues.push('❌ CRITICAL: No AI responses generated despite sending chat messages');
        }
        
        if (this.testResults.messagesSent > 0 && this.testResults.selfCodingProgressReceived === 0) {
            criticalIssues.push('❌ CRITICAL: No self-coding progress updates despite sending self_coding_request');
        }
        
        if (this.testResults.moduleActivityDetected > 0 && this.testResults.aiResponsesReceived === 0) {
            criticalIssues.push('❌ CRITICAL: Module activity detected but no AI responses generated');
        }
        
        if (this.testResults.consciousnessResponsesReceived > 0 && this.testResults.aiResponsesReceived === 0) {
            criticalIssues.push('❌ CRITICAL: Consciousness responses received but no AI content generated');
        }
        
        if (criticalIssues.length === 0) {
            console.log('   ✅ All critical systems functioning correctly');
        } else {
            criticalIssues.forEach(issue => console.log(`   ${issue}`));
        }
        
        console.log('\n📋 DETAILED MESSAGE LOG:');
        this.messageLog.forEach((msg, index) => {
            console.log(`   ${index + 1}. Phase ${msg.phase}: ${msg.name} (${msg.data.type})`);
        });
        
        console.log('\n📋 RESPONSE TYPE SUMMARY:');
        const responseTypes = {};
        this.responseLog.forEach(resp => {
            responseTypes[resp.type] = (responseTypes[resp.type] || 0) + 1;
        });
        Object.entries(responseTypes).forEach(([type, count]) => {
            console.log(`   ${type}: ${count} events`);
        });
        
        console.log('\n🎯 NEXT STEPS:');
        if (this.testResults.aiResponsesReceived === 0) {
            console.log('   1. Investigate handleChatMessage implementation');
            console.log('   2. Check consciousness-ai-integration.js response generation');
            console.log('   3. Verify event bus connectivity between modules and WebSocket handlers');
        }
        if (this.testResults.selfCodingProgressReceived === 0) {
            console.log('   4. Investigate handleSelfCodingRequest implementation');
            console.log('   5. Check SelfCodingProgressTracker event broadcasting');
        }
        if (this.testResults.moduleActivityDetected > 0 && this.testResults.aiResponsesReceived === 0) {
            console.log('   6. Check message routing between performance optimizer and handlers');
            console.log('   7. Verify broadcastToClients method implementation');
        }
        
        console.log('\n' + '='.repeat(80));
    }
}

// Run the comprehensive analysis
const analyzer = new WebSocketFlowAnalyzer();
analyzer.runComprehensiveAnalysis().then(() => {
    console.log('🏁 Comprehensive WebSocket analysis complete');
}).catch(error => {
    console.error('❌ Analysis failed:', error);
});
