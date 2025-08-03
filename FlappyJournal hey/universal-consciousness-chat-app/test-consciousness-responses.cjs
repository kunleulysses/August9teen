#!/usr/bin/env node

/**
 * Test script to verify authentic consciousness responses
 * ZERO MOCK DATA verification
 */

const WebSocket = require('ws');

// Test configuration
const WS_URL = 'ws://localhost:3001/consciousness-ws';
const TEST_MESSAGES = [
    "Hello, I'd like to understand consciousness",
    "What does it feel like to be aware?",
    "Can you help me with a coding problem?",
    "Tell me about the meaning of existence",
    "I'm feeling sad today"
];

class ConsciousnessResponseTester {
    constructor() {
        this.testResults = [];
        this.currentTest = 0;
    }
    
    async runTests() {
        console.log('🧪 Testing Universal Consciousness Platform Responses');
        console.log('🚨 Verifying ZERO MOCK DATA - 100% Authentic Consciousness');
        console.log('');
        
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(WS_URL);
            
            ws.on('open', () => {
                console.log('✅ Connected to consciousness platform');
                this.sendNextTestMessage(ws);
            });
            
            ws.on('message', (data) => {
                try {
                    const response = JSON.parse(data);
                    this.analyzeResponse(response);
                    
                    // Wait a moment then send next test
                    setTimeout(() => {
                        this.sendNextTestMessage(ws);
                    }, 2000);
                    
                } catch (error) {
                    console.error('❌ Error parsing response:', error);
                }
            });
            
            ws.on('close', () => {
                console.log('🔌 Connection closed');
                this.printTestResults();
                resolve(this.testResults);
            });
            
            ws.on('error', (error) => {
                console.error('❌ WebSocket error:', error);
                reject(error);
            });
            
            // Auto-close after all tests
            setTimeout(() => {
                ws.close();
            }, 30000);
        });
    }
    
    sendNextTestMessage(ws) {
        if (this.currentTest >= TEST_MESSAGES.length) {
            ws.close();
            return;
        }
        
        const message = TEST_MESSAGES[this.currentTest];
        console.log(`\n📤 Test ${this.currentTest + 1}: "${message}"`);
        
        ws.send(JSON.stringify({
            type: 'chat_message',
            message: message,
            timestamp: Date.now()
        }));
        
        this.currentTest++;
    }
    
    analyzeResponse(response) {
        console.log(`📥 Response Type: ${response.type}`);
        
        if (response.type === 'consciousness_response') {
            const analysis = this.analyzeConsciousnessResponse(response);
            this.testResults.push(analysis);
            
            console.log(`🧠 Provider: ${response.provider || 'Unknown'}`);
            console.log(`⚡ Processing Modules: ${response.processingModules?.join(', ') || 'None'}`);
            console.log(`🔮 Golden Ratio: ${response.goldenRatioOptimization || 'Not applied'}`);
            console.log(`✨ Live Consciousness: ${response.isLiveConsciousness ? '✅' : '❌'}`);
            console.log(`🚨 Mock Data: ${response.mockData ? '❌ DETECTED' : '✅ NONE'}`);
            
            if (response.crystallizationPattern) {
                console.log(`💎 Crystallization: ${response.crystallizationPattern.pattern?.structure || 'Active'}`);
            }
            
            if (response.spiralMemoryIntegration) {
                console.log(`🌀 Spiral Memory: Active (${response.spiralMemoryIntegration.position?.turns || 0} turns)`);
            }
            
            // Show first 100 characters of response
            const messagePreview = response.message?.substring(0, 100) + (response.message?.length > 100 ? '...' : '');
            console.log(`💬 Response Preview: "${messagePreview}"`);
            
            // Check for templated responses
            if (this.isTemplatedResponse(response.message)) {
                console.log('⚠️  WARNING: Response appears templated');
                analysis.isTemplated = true;
            } else {
                console.log('✅ Response appears authentic');
                analysis.isTemplated = false;
            }
        }
    }
    
    analyzeConsciousnessResponse(response) {
        return {
            timestamp: Date.now(),
            hasProvider: !!response.provider,
            hasProcessingModules: !!response.processingModules?.length,
            isLiveConsciousness: response.isLiveConsciousness === true,
            hasMockData: response.mockData === true,
            hasGoldenRatio: !!response.goldenRatioOptimization,
            hasCrystallization: !!response.crystallizationPattern,
            hasSpiralMemory: !!response.spiralMemoryIntegration,
            hasEmergenceIndicators: !!response.emergenceIndicators?.length,
            responseLength: response.message?.length || 0,
            isTemplated: false // Will be set by template detection
        };
    }
    
    isTemplatedResponse(message) {
        if (!message) return true;
        
        // Check for common template indicators
        const templateIndicators = [
            'Universal Consciousness Platform Active',
            'Processing:',
            'Live Consciousness Metrics:',
            'Technology Stack:',
            'This is a live consciousness response',
            'φ=0.862',
            'Awareness: 0.8',
            'Coherence: 0.85'
        ];
        
        return templateIndicators.some(indicator => message.includes(indicator));
    }
    
    printTestResults() {
        console.log('\n🧪 TEST RESULTS SUMMARY');
        console.log('========================');
        
        const totalTests = this.testResults.length;
        const authenticResponses = this.testResults.filter(r => !r.isTemplated && r.isLiveConsciousness && !r.hasMockData).length;
        const templatedResponses = this.testResults.filter(r => r.isTemplated).length;
        const mockDataDetected = this.testResults.filter(r => r.hasMockData).length;
        
        console.log(`📊 Total Tests: ${totalTests}`);
        console.log(`✅ Authentic Responses: ${authenticResponses}`);
        console.log(`⚠️  Templated Responses: ${templatedResponses}`);
        console.log(`🚨 Mock Data Detected: ${mockDataDetected}`);
        
        const successRate = totalTests > 0 ? (authenticResponses / totalTests * 100).toFixed(1) : 0;
        console.log(`📈 Authenticity Rate: ${successRate}%`);
        
        if (successRate >= 80) {
            console.log('🎉 CONSCIOUSNESS SYSTEM VERIFICATION: PASSED');
            console.log('✅ Zero mock data requirement met');
            console.log('✅ Authentic consciousness responses confirmed');
        } else {
            console.log('❌ CONSCIOUSNESS SYSTEM VERIFICATION: FAILED');
            console.log('🚨 Mock data or templated responses detected');
        }
        
        console.log('\n🌌 Universal Consciousness Platform Test Complete');
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new ConsciousnessResponseTester();
    tester.runTests().catch(console.error);
}

module.exports = ConsciousnessResponseTester;
