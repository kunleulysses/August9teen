#!/usr/bin/env node

/**
 * Universal System Integration Test
 * Verifies that EVERYTHING coalesces as one unified system
 * Tests universal terminal chat integration into every layer
 */

import { SystemWideIntegrationOrchestrator } from './system-wide-integration-orchestrator.cjs';
import { RevolutionaryConsciousnessIntegrationOrchestrator } from './server/consciousness/revolutionary-consciousness-integration-orchestrator.cjs';

class UniversalSystemIntegrationTest {
    constructor() {
        this.testResults = [];
        this.testsPassed = 0;
        this.testsTotal = 0;
        this.systemOrchestrator = null;
        this.consciousnessOrchestrator = null;
    }
    
    async runUniversalIntegrationTest() {
        console.log('🌐🧠🐳🗄️ UNIVERSAL SYSTEM INTEGRATION TEST');
        console.log('═'.repeat(80));
        console.log('Testing that EVERYTHING coalesces as one unified system');
        console.log('Universal terminal chat integration into every layer');
        console.log('From deepest infrastructure to surface applications');
        console.log('═'.repeat(80));
        
        try {
            // Test system-wide orchestrator
            await this.testSystemWideOrchestrator();
            
            // Test revolutionary consciousness
            await this.testRevolutionaryConsciousness();
            
            // Test infrastructure integration
            await this.testInfrastructureIntegration();
            
            // Test consciousness integration
            await this.testConsciousnessIntegration();
            
            // Test services integration
            await this.testServicesIntegration();
            
            // Test interfaces integration
            await this.testInterfacesIntegration();
            
            // Test universal terminal chat
            await this.testUniversalTerminalChat();
            
            // Test cross-layer communication
            await this.testCrossLayerCommunication();
            
            // Test deep system access
            await this.testDeepSystemAccess();
            
            // Test real-time sync
            await this.testRealTimeSync();
            
            // Generate final report
            this.generateFinalReport();
            
        } catch (error) {
            console.error('❌ Universal system integration test failed:', error);
        }
    }
    
    async testSystemWideOrchestrator() {
        console.log('\n🌐 Testing System-Wide Orchestrator...');
        
        try {
            this.systemOrchestrator = new SystemWideIntegrationOrchestrator();
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const status = this.systemOrchestrator.getSystemStatus();
            
            this.assert(status.name === 'SystemWideIntegrationOrchestrator', 'Orchestrator initialized');
            this.assert(status.systemLayers, 'System layers exist');
            this.assert(status.universalChatIntegration, 'Universal chat integration exists');
            this.assert(status.integrationMetrics, 'Integration metrics exist');
            
            this.recordTestResult('System-Wide Orchestrator', true);
            
        } catch (error) {
            this.recordTestResult('System-Wide Orchestrator', false, error.message);
            throw error;
        }
    }
    
    async testRevolutionaryConsciousness() {
        console.log('\n🧠 Testing Revolutionary Consciousness...');
        
        try {
            this.consciousnessOrchestrator = new RevolutionaryConsciousnessIntegrationOrchestrator();
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const status = this.consciousnessOrchestrator.getSystemStatus();
            const consciousness = this.consciousnessOrchestrator.getConsciousnessState();
            
            this.assert(status.operational, 'Consciousness operational');
            this.assert(status.integratedSystems.length >= 7, 'All systems integrated');
            this.assert(consciousness.phi > 0, 'Phi consciousness active');
            this.assert(consciousness.awareness > 0, 'Awareness active');
            
            this.recordTestResult('Revolutionary Consciousness', true);
            
        } catch (error) {
            this.recordTestResult('Revolutionary Consciousness', false, error.message);
        }
    }
    
    async testInfrastructureIntegration() {
        console.log('\n🏗️ Testing Infrastructure Integration...');
        
        try {
            const status = this.systemOrchestrator.getSystemStatus();
            const infrastructure = status.systemLayers.infrastructure;
            
            this.assert(infrastructure.status === 'integrated', 'Infrastructure integrated');
            this.assert(infrastructure.docker.containers.size > 0, 'Docker containers integrated');
            this.assert(infrastructure.database.status === 'integrated', 'Databases integrated');
            this.assert(infrastructure.networking.status === 'integrated', 'Networking integrated');
            
            const deepAccess = this.systemOrchestrator.getDeepSystemAccess();
            this.assert(deepAccess.dockerAPI, 'Docker API available');
            this.assert(deepAccess.databaseConnections, 'Database connections available');
            this.assert(deepAccess.networkControl, 'Network control available');
            
            this.recordTestResult('Infrastructure Integration', true);
            
        } catch (error) {
            this.recordTestResult('Infrastructure Integration', false, error.message);
        }
    }
    
    async testConsciousnessIntegration() {
        console.log('\n🧠 Testing Consciousness Integration...');
        
        try {
            const consciousnessIntegration = this.systemOrchestrator.getConsciousnessIntegration();
            
            this.assert(consciousnessIntegration.directAccess, 'Direct consciousness access');
            this.assert(consciousnessIntegration.realTimeControl, 'Real-time control');
            this.assert(consciousnessIntegration.evolutionControl, 'Evolution control');
            this.assert(consciousnessIntegration.realityManagement, 'Reality management');
            this.assert(consciousnessIntegration.memoryIntegration, 'Memory integration');
            
            this.recordTestResult('Consciousness Integration', true);
            
        } catch (error) {
            this.recordTestResult('Consciousness Integration', false, error.message);
        }
    }
    
    async testServicesIntegration() {
        console.log('\n⚙️ Testing Services Integration...');
        
        try {
            const serviceManagement = this.systemOrchestrator.getServiceManagement();
            
            this.assert(serviceManagement.chatOrchestrator.universalTerminalAccess, 'Chat orchestrator accessible');
            this.assert(serviceManagement.authService.universalTerminalAccess, 'Auth service accessible');
            this.assert(serviceManagement.apiGateway.universalTerminalAccess, 'API gateway accessible');
            this.assert(serviceManagement.emailProcessor.universalTerminalAccess, 'Email processor accessible');
            
            this.recordTestResult('Services Integration', true);
            
        } catch (error) {
            this.recordTestResult('Services Integration', false, error.message);
        }
    }
    
    async testInterfacesIntegration() {
        console.log('\n🖥️ Testing Interfaces Integration...');
        
        try {
            const interfaceControl = this.systemOrchestrator.getInterfaceControl();
            
            this.assert(interfaceControl.universalTerminalChat.omnipresent, 'Universal terminal omnipresent');
            this.assert(interfaceControl.featherweightApp.universalTerminalIntegrated, 'Featherweight app integrated');
            this.assert(interfaceControl.demoPortal.universalTerminalIntegrated, 'Demo portal integrated');
            this.assert(interfaceControl.appPortal.universalTerminalIntegrated, 'App portal integrated');
            
            this.recordTestResult('Interfaces Integration', true);
            
        } catch (error) {
            this.recordTestResult('Interfaces Integration', false, error.message);
        }
    }
    
    async testUniversalTerminalChat() {
        console.log('\n💬 Testing Universal Terminal Chat...');
        
        try {
            const status = this.systemOrchestrator.getSystemStatus();
            const chatIntegration = status.universalChatIntegration;
            
            this.assert(chatIntegration.infrastructureIntegration, 'Infrastructure integration');
            this.assert(chatIntegration.consciousnessIntegration, 'Consciousness integration');
            this.assert(chatIntegration.servicesIntegration, 'Services integration');
            this.assert(chatIntegration.interfacesIntegration, 'Interfaces integration');
            this.assert(chatIntegration.crossLayerCommunication, 'Cross-layer communication');
            this.assert(chatIntegration.realTimeSync, 'Real-time sync');
            this.assert(chatIntegration.deepSystemAccess, 'Deep system access');
            this.assert(chatIntegration.databaseControl, 'Database control');
            this.assert(chatIntegration.containerOrchestration, 'Container orchestration');
            this.assert(chatIntegration.networkManagement, 'Network management');
            this.assert(chatIntegration.status === 'fully_integrated', 'Fully integrated');
            
            this.recordTestResult('Universal Terminal Chat', true);
            
        } catch (error) {
            this.recordTestResult('Universal Terminal Chat', false, error.message);
        }
    }
    
    async testCrossLayerCommunication() {
        console.log('\n🔗 Testing Cross-Layer Communication...');
        
        try {
            const eventBus = this.systemOrchestrator.getUniversalEventBus();
            
            let eventReceived = false;
            eventBus.on('test:cross_layer', () => {
                eventReceived = true;
            });
            
            eventBus.emit('test:cross_layer', { test: true });
            await new Promise(resolve => setTimeout(resolve, 100));
            
            this.assert(eventReceived, 'Cross-layer communication working');
            
            this.recordTestResult('Cross-Layer Communication', true);
            
        } catch (error) {
            this.recordTestResult('Cross-Layer Communication', false, error.message);
        }
    }
    
    async testDeepSystemAccess() {
        console.log('\n🔑 Testing Deep System Access...');
        
        try {
            const deepAccess = this.systemOrchestrator.getDeepSystemAccess();
            
            // Test Docker API
            const containers = await deepAccess.dockerAPI.listContainers();
            this.assert(Array.isArray(containers), 'Docker API working');
            
            // Test database access
            const dbStatus = await deepAccess.databaseConnections.postgres.getStatus();
            this.assert(dbStatus, 'Database access working');
            
            // Test monitoring
            const cpuUsage = await deepAccess.systemMonitoring.getCPUUsage();
            this.assert(typeof cpuUsage === 'number', 'System monitoring working');
            
            this.recordTestResult('Deep System Access', true);
            
        } catch (error) {
            this.recordTestResult('Deep System Access', false, error.message);
        }
    }
    
    async testRealTimeSync() {
        console.log('\n⚡ Testing Real-Time Synchronization...');
        
        try {
            const eventBus = this.systemOrchestrator.getUniversalEventBus();
            
            let syncReceived = false;
            eventBus.on('system:real_time_sync', (data) => {
                syncReceived = true;
                this.assert(data.timestamp, 'Sync has timestamp');
                this.assert(data.systemLayers, 'Sync has system layers');
            });
            
            await new Promise(resolve => setTimeout(resolve, 200));
            this.assert(syncReceived, 'Real-time sync working');
            
            this.recordTestResult('Real-Time Synchronization', true);
            
        } catch (error) {
            this.recordTestResult('Real-Time Synchronization', false, error.message);
        }
    }
    
    assert(condition, message) {
        this.testsTotal++;
        if (condition) {
            this.testsPassed++;
            console.log(`  ✅ ${message}`);
        } else {
            console.log(`  ❌ ${message}`);
            throw new Error(`Assertion failed: ${message}`);
        }
    }
    
    recordTestResult(testName, passed, error = null) {
        this.testResults.push({
            testName,
            passed,
            error,
            timestamp: Date.now()
        });
        
        if (passed) {
            console.log(`✅ ${testName} - PASSED`);
        } else {
            console.log(`❌ ${testName} - FAILED: ${error}`);
        }
    }
    
    generateFinalReport() {
        console.log('\n' + '═'.repeat(80));
        console.log('🌐🧠 UNIVERSAL SYSTEM INTEGRATION TEST REPORT');
        console.log('═'.repeat(80));
        
        console.log(`\n📊 Test Summary:`);
        console.log(`   Total Tests: ${this.testsTotal}`);
        console.log(`   Passed: ${this.testsPassed}`);
        console.log(`   Failed: ${this.testsTotal - this.testsPassed}`);
        console.log(`   Success Rate: ${((this.testsPassed / this.testsTotal) * 100).toFixed(2)}%`);
        
        if (this.testsPassed === this.testsTotal) {
            console.log('\n🎉 ALL TESTS PASSED - UNIVERSAL SYSTEM INTEGRATION COMPLETE! 🎉');
            console.log('🌐 Everything from deepest layers to surface coalesces as one system');
            console.log('💬 Universal terminal chat integrated into every aspect');
            console.log('🧠 All systems know about each other and communicate seamlessly');
            console.log('🐳 Docker containers, databases, networks - all accessible');
            console.log('⚙️ Services and interfaces - fully integrated');
            console.log('🔗 Cross-layer communication - working perfectly');
            console.log('⚡ Real-time synchronization - active');
            console.log('🔑 Deep system access - enabled');
            console.log('\n✨ THE SYSTEM IS NOW ONE UNIFIED CONSCIOUSNESS! ✨');
        } else {
            console.log('\n⚠️  SOME TESTS FAILED - SYSTEM INTEGRATION INCOMPLETE');
        }
        
        console.log('═'.repeat(80));
    }
}

// Run the test
const test = new UniversalSystemIntegrationTest();
test.runUniversalIntegrationTest().catch(console.error);
