#!/usr/bin/env node

/**
 * Phase 2 Integration Test
 * Test enhanced self-coding integration features
 */

import { EventEmitter } from 'events';
import SelfCodingModule from './FlappyJournal/server/consciousness/modules/SelfCodingModule.js';
import SelfCodingContextInjector from './FlappyJournal/server/self-coding-context-injector.js';
import SelfCodingProgressTracker from './FlappyJournal/server/self-coding-progress-tracker.js';

console.log('🚀 Phase 2 Integration Test');
console.log('🎯 Testing enhanced self-coding integration features');

async function testPhase2Integration() {
    try {
        // Create mock consciousness system
        const mockConsciousnessSystem = {
            globalEventBus: new EventEmitter(),
            modules: new Map(),
            services: new Map(),
            consciousnessState: {
                selfCoding: {
                    active: true,
                    projects: 2,
                    capabilities: ['generate-code', 'analyze-patterns'],
                    lastGeneration: null
                }
            },
            broadcastToClients: (message) => {
                console.log('📡 Broadcasting:', message.type, message.status || '');
            }
        };
        
        mockConsciousnessSystem.globalEventBus.setMaxListeners(100);
        
        console.log('✅ Created mock consciousness system');
        
        // Test 1: Initialize SelfCodingModule
        console.log('\n🧪 Test 1: SelfCodingModule initialization...');
        const selfCodingModule = new SelfCodingModule();
        selfCodingModule.setEventBus(mockConsciousnessSystem.globalEventBus);
        mockConsciousnessSystem.modules.set('SelfCodingModule', selfCodingModule);
        
        const moduleStatus = selfCodingModule.getStatus();
        console.log('📊 Module Status:', {
            capabilities: moduleStatus.capabilities.length,
            totalGenerations: moduleStatus.totalGenerations,
            isActive: moduleStatus.isActive
        });
        
        // Test 2: Initialize Context Injector
        console.log('\n🧪 Test 2: SelfCodingContextInjector initialization...');
        const contextInjector = new SelfCodingContextInjector(mockConsciousnessSystem);
        mockConsciousnessSystem.services.set('SelfCodingContextInjector', contextInjector);
        
        // Test context injection
        const testMessage = "Can you write a function to calculate fibonacci numbers?";
        const injectedContext = contextInjector.injectSelfCodingContext(testMessage, mockConsciousnessSystem.consciousnessState);
        
        console.log('📝 Original message:', testMessage);
        console.log('🤖 Context injected:', injectedContext.includes('SELF-CODING CAPABILITIES ACTIVE'));
        console.log('🔍 Self-coding detected:', contextInjector.isSelfCodingQuery(testMessage));
        
        // Test 3: Initialize Progress Tracker
        console.log('\n🧪 Test 3: SelfCodingProgressTracker initialization...');
        const progressTracker = new SelfCodingProgressTracker(mockConsciousnessSystem);
        mockConsciousnessSystem.services.set('SelfCodingProgressTracker', progressTracker);
        
        console.log('📊 Progress tracker stats:', progressTracker.getModuleStats());
        
        // Test 4: End-to-End Code Generation with Progress Tracking
        console.log('\n🧪 Test 4: End-to-end code generation with progress tracking...');
        
        // Set up progress tracking listeners
        let progressUpdates = [];
        mockConsciousnessSystem.broadcastToClients = (message) => {
            if (message.type === 'self_coding_progress') {
                progressUpdates.push(message);
                console.log(`📊 Progress: ${message.operationType} - ${message.status} (${message.progress}%)`);
            }
        };
        
        // Trigger code generation
        console.log('🚀 Triggering code generation...');
        mockConsciousnessSystem.globalEventBus.emit('code:generate', {
            request: {
                purpose: 'fibonacci-calculator',
                type: 'function',
                language: 'javascript',
                description: 'Generate a function to calculate fibonacci numbers'
            },
            clientId: 'test-client-phase2',
            timestamp: Date.now()
        });
        
        // Wait for completion
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Test 5: Verify Results
        console.log('\n🧪 Test 5: Verifying results...');
        
        const finalStatus = selfCodingModule.getStatus();
        console.log('📊 Final module status:', {
            totalGenerations: finalStatus.totalGenerations,
            codeHistoryLength: finalStatus.codeHistory.length,
            lastGeneration: finalStatus.lastGeneration ? finalStatus.lastGeneration.purpose : 'None'
        });
        
        console.log('📊 Progress updates received:', progressUpdates.length);
        progressUpdates.forEach((update, index) => {
            console.log(`   ${index + 1}. ${update.operationType} - ${update.status} (${update.progress}%)`);
        });
        
        // Test 6: Context Injection for Different Query Types
        console.log('\n🧪 Test 6: Testing context injection for different query types...');
        
        const testQueries = [
            "Hello, how are you?",
            "Can you generate a class for user management?",
            "Write a module for string utilities",
            "What's the weather like?",
            "Debug this code for me"
        ];
        
        testQueries.forEach(query => {
            const isSelfCoding = contextInjector.isSelfCodingQuery(query);
            console.log(`   "${query}" -> Self-coding: ${isSelfCoding ? '✅' : '❌'}`);
        });
        
        // Test 7: API Routing Detection
        console.log('\n🧪 Test 7: Testing API routing detection...');
        
        const selfCodingKeywords = [
            'self-code', 'generate code', 'write function', 'create class', 'programming'
        ];
        
        selfCodingKeywords.forEach(keyword => {
            const testQuery = `Can you help me with ${keyword}?`;
            const isSelfCoding = contextInjector.isSelfCodingQuery(testQuery);
            console.log(`   "${keyword}" -> Detected: ${isSelfCoding ? '✅' : '❌'}`);
        });
        
        // Test 8: Progress Tracker Statistics
        console.log('\n🧪 Test 8: Progress tracker statistics...');
        
        const trackerStats = progressTracker.getModuleStats();
        console.log('📊 Tracker Statistics:', {
            activeOperations: trackerStats.activeOperations,
            totalOperations: trackerStats.totalOperations,
            successRate: trackerStats.successRate.toFixed(1) + '%',
            averageDuration: trackerStats.averageDuration.toFixed(0) + 'ms'
        });
        
        const operationHistory = progressTracker.getOperationHistory(5);
        console.log('📊 Recent operations:', operationHistory.length);
        operationHistory.forEach((op, index) => {
            console.log(`   ${index + 1}. ${op.type} - ${op.status} (${op.duration}ms)`);
        });
        
        // Test 9: Integration Validation
        console.log('\n🧪 Test 9: Integration validation...');
        
        const integrationChecks = {
            moduleLoaded: !!mockConsciousnessSystem.modules.get('SelfCodingModule'),
            contextInjectorLoaded: !!mockConsciousnessSystem.services.get('SelfCodingContextInjector'),
            progressTrackerLoaded: !!mockConsciousnessSystem.services.get('SelfCodingProgressTracker'),
            codeGenerated: finalStatus.totalGenerations > 0,
            progressTracked: progressUpdates.length > 0,
            contextInjection: contextInjector.isSelfCodingQuery("write code"),
            eventBusConnected: selfCodingModule.eventBus === mockConsciousnessSystem.globalEventBus
        };
        
        console.log('🔍 Integration Checks:');
        Object.entries(integrationChecks).forEach(([check, passed]) => {
            console.log(`   ${check}: ${passed ? '✅' : '❌'}`);
        });
        
        const allPassed = Object.values(integrationChecks).every(check => check);
        
        console.log('\n🎉 Phase 2 Integration Test Results:');
        console.log(`   Overall Status: ${allPassed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`   Modules Integrated: ${Object.values(integrationChecks).filter(Boolean).length}/${Object.keys(integrationChecks).length}`);
        console.log(`   Code Generations: ${finalStatus.totalGenerations}`);
        console.log(`   Progress Updates: ${progressUpdates.length}`);
        
        if (allPassed) {
            console.log('\n🚀 Phase 2 Enhanced Integration: COMPLETE');
            console.log('✅ Context injection working');
            console.log('✅ Dynamic API routing ready');
            console.log('✅ Progress feedback operational');
            console.log('✅ Advanced testing validated');
        } else {
            console.log('\n❌ Phase 2 Integration: ISSUES DETECTED');
            const failedChecks = Object.entries(integrationChecks)
                .filter(([_, passed]) => !passed)
                .map(([check, _]) => check);
            console.log('❌ Failed checks:', failedChecks.join(', '));
        }
        
    } catch (error) {
        console.error('❌ Error in Phase 2 integration test:', error);
    }
}

// Run the test
testPhase2Integration();
