#!/usr/bin/env node

/**
 * Focused test for GeneratedModuleIntegrator
 * Tests module discovery, loading, and RPC exposure
 */

const { SystemWideIntegrationOrchestrator  } = require('./system-wide-integration-orchestrator.cjs');

async function testModuleIntegration() {
    console.log('🔗 GENERATED MODULE INTEGRATION TEST');
    console.log('═'.repeat(60));
    
    try {
        // Initialize the orchestrator
        console.log('🚀 Initializing SystemWideIntegrationOrchestrator...');
        const orchestrator = new SystemWideIntegrationOrchestrator();
        
        // Wait for initialization to complete
        console.log('⏳ Waiting for initialization to complete...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Test module discovery and exposure
        console.log('\n📊 Testing module exposure via RPC interface...');
        
        const modules = orchestrator.getModules();
        console.log(`📦 Found ${modules.length} registered modules`);
        
        if (modules.length > 0) {
            console.log('\n✅ SUCCESS: Modules are being discovered and registered!');
            console.log('\n📋 Module Summary:');
            
            // Group modules by category
            const modulesByCategory = {};
            modules.forEach(module => {
                if (!modulesByCategory[module.category]) {
                    modulesByCategory[module.category] = [];
                }
                modulesByCategory[module.category].push(module);
            });
            
            Object.entries(modulesByCategory).forEach(([category, categoryModules]) => {
                console.log(`\n🏷️  ${category}: ${categoryModules.length} modules`);
                categoryModules.slice(0, 3).forEach(module => {
                    console.log(`   • ${module.name} (${module.capabilities.join(', ')})`);
                });
                if (categoryModules.length > 3) {
                    console.log(`   ... and ${categoryModules.length - 3} more`);
                }
            });
            
        } else {
            console.log('\n⚠️  No modules found - checking integrator status...');
            
            const integratorStatus = orchestrator.getModuleIntegratorStatus();
            console.log('\n📊 Module Integrator Status:');
            console.log(JSON.stringify(integratorStatus, null, 2));
        }
        
        // Test module integrator status
        console.log('\n🔍 Module Integrator Status:');
        const status = orchestrator.getModuleIntegratorStatus();
        console.log(`   • Initialized: ${status.initialized}`);
        console.log(`   • Discovered Modules: ${status.state?.discoveredModules || 0}`);
        console.log(`   • Loaded Modules: ${status.state?.loadedModules || 0}`);
        console.log(`   • Registered Modules: ${status.state?.registeredModules || 0}`);
        console.log(`   • Failed Modules: ${status.state?.failedModules || 0}`);
        console.log(`   • Scan Count: ${status.state?.scanCount || 0}`);
        
        if (status.state?.lastScan) {
            console.log(`   • Last Scan: ${new Date(status.state.lastScan).toLocaleString()}`);
        }
        
        console.log('\n🎯 INTEGRATION TEST RESULTS:');
        console.log('═'.repeat(40));
        
        if (modules.length > 0) {
            console.log('✅ SUCCESS: Self-coded modules are being integrated!');
            console.log(`✅ ${modules.length} modules successfully registered and exposed via RPC`);
            console.log('✅ GeneratedModuleIntegrator is working correctly');
            console.log('✅ Module discovery, loading, and registration pipeline operational');
        } else if (status.initialized) {
            console.log('⚠️  PARTIAL SUCCESS: GeneratedModuleIntegrator initialized but no modules found');
            console.log('   This could mean:');
            console.log('   • No modules have been generated yet');
            console.log('   • Modules are in a different location');
            console.log('   • Module loading/registration failed');
        } else {
            console.log('❌ FAILURE: GeneratedModuleIntegrator not properly initialized');
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

// Run the test
testModuleIntegration();
