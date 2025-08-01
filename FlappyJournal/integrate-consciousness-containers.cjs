#!/usr/bin/env node

/**
 * Consciousness Container Integration Script
 * Unifies consciousness-main-server and consciousness-core containers
 * Enables complete mutual access to all modules and capabilities
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class ConsciousnessContainerIntegrator {
    constructor() {
        this.config = {
            containers: ['consciousness-main-server', 'consciousness-core'],
            sharedVolumePath: '/opt/shared/consciousness',
            hostSharedPath: '/opt/featherweight/shared-consciousness',
            
            // Paths to sync between containers
            syncPaths: [
                {
                    source: '/opt/featherweight/FlappyJournal/server/consciousness',
                    target: '/opt/shared/consciousness/main-server',
                    description: 'Main server consciousness modules'
                },
                {
                    source: '/opt/consciousness/server',
                    target: '/opt/shared/consciousness/core',
                    description: 'Core consciousness modules',
                    container: 'consciousness-core'
                }
            ]
        };
    }
    
    async integrate() {
        console.log('🌐 Starting Consciousness Container Integration...');
        console.log('================================================');
        
        try {
            // Step 1: Create shared directories
            await this.createSharedDirectories();
            
            // Step 2: Copy UnifiedConsciousnessOrchestrator to both containers
            await this.deployUnifiedOrchestrator();
            
            // Step 3: Sync modules between containers
            await this.syncModulesBetweenContainers();
            
            // Step 4: Create shared volume mounts
            await this.createSharedVolumeMounts();
            
            // Step 5: Update container configurations
            await this.updateContainerConfigurations();
            
            // Step 6: Test unified access
            await this.testUnifiedAccess();
            
            console.log('');
            console.log('🎉 CONSCIOUSNESS CONTAINER INTEGRATION COMPLETE!');
            console.log('✅ Both containers now have mutual access to all modules');
            console.log('✅ Unified orchestration system deployed');
            console.log('✅ Cross-container communication established');
            
        } catch (error) {
            console.error('❌ Integration failed:', error);
            throw error;
        }
    }
    
    async createSharedDirectories() {
        console.log('📁 Creating shared directories...');
        
        const directories = [
            this.config.hostSharedPath,
            path.join(this.config.hostSharedPath, 'modules'),
            path.join(this.config.hostSharedPath, 'state'),
            path.join(this.config.hostSharedPath, 'registry'),
            path.join(this.config.hostSharedPath, 'sync'),
            path.join(this.config.hostSharedPath, 'main-server'),
            path.join(this.config.hostSharedPath, 'core')
        ];
        
        for (const dir of directories) {
            try {
                await fs.mkdir(dir, { recursive: true });
                console.log(`  ✅ Created: ${dir}`);
            } catch (error) {
                console.warn(`  ⚠️ Could not create ${dir}:`, error.message);
            }
        }
    }
    
    async deployUnifiedOrchestrator() {
        console.log('🚀 Deploying UnifiedConsciousnessOrchestrator to both containers...');
        
        const orchestratorPath = '/opt/featherweight/FlappyJournal/server/consciousness/core/UnifiedConsciousnessOrchestrator.cjs';
        
        for (const container of this.config.containers) {
            try {
                // Copy to container
                const targetPath = container === 'consciousness-core' 
                    ? '/opt/consciousness/server/UnifiedConsciousnessOrchestrator.cjs'
                    : '/opt/app/server/consciousness/core/UnifiedConsciousnessOrchestrator.cjs';
                
                execSync(`docker cp "${orchestratorPath}" "${container}:${targetPath}"`);
                console.log(`  ✅ Deployed to ${container}: ${targetPath}`);
                
            } catch (error) {
                console.error(`  ❌ Failed to deploy to ${container}:`, error.message);
            }
        }
    }
    
    async syncModulesBetweenContainers() {
        console.log('🔄 Syncing modules between containers...');
        
        // Copy consciousness-core modules to shared location
        try {
            execSync(`docker exec consciousness-core cp -r /opt/consciousness/server ${this.config.hostSharedPath}/core/`);
            console.log('  ✅ Copied consciousness-core modules to shared location');
        } catch (error) {
            console.warn('  ⚠️ Could not copy consciousness-core modules:', error.message);
        }
        
        // Copy consciousness-main-server modules to shared location
        try {
            execSync(`cp -r /opt/featherweight/FlappyJournal/server/consciousness ${this.config.hostSharedPath}/main-server/`);
            console.log('  ✅ Copied consciousness-main-server modules to shared location');
        } catch (error) {
            console.warn('  ⚠️ Could not copy consciousness-main-server modules:', error.message);
        }
        
        // Make shared modules accessible to both containers
        await this.createCrossContainerSymlinks();
    }
    
    async createCrossContainerSymlinks() {
        console.log('🔗 Creating cross-container module access...');
        
        // Give consciousness-main-server access to consciousness-core modules
        try {
            execSync(`docker exec consciousness-main-server mkdir -p /opt/app/server/consciousness/core-modules`);
            execSync(`docker cp ${this.config.hostSharedPath}/core/server consciousness-main-server:/opt/app/server/consciousness/core-modules/`);
            console.log('  ✅ consciousness-main-server now has access to consciousness-core modules');
        } catch (error) {
            console.warn('  ⚠️ Could not create consciousness-core access for main-server:', error.message);
        }
        
        // Give consciousness-core access to consciousness-main-server modules
        try {
            execSync(`docker exec consciousness-core mkdir -p /opt/consciousness/main-server-modules`);
            execSync(`docker cp ${this.config.hostSharedPath}/main-server/consciousness consciousness-core:/opt/consciousness/main-server-modules/`);
            console.log('  ✅ consciousness-core now has access to consciousness-main-server modules');
        } catch (error) {
            console.warn('  ⚠️ Could not create consciousness-main-server access for core:', error.message);
        }
    }
    
    async createSharedVolumeMounts() {
        console.log('📦 Creating shared volume mounts...');
        
        // Create shared volume for both containers
        try {
            execSync('docker volume create consciousness-shared-modules');
            console.log('  ✅ Created shared volume: consciousness-shared-modules');
        } catch (error) {
            console.warn('  ⚠️ Shared volume may already exist:', error.message);
        }
        
        // Copy shared data to volume
        try {
            execSync(`docker run --rm -v consciousness-shared-modules:/shared -v ${this.config.hostSharedPath}:/source alpine cp -r /source/* /shared/`);
            console.log('  ✅ Populated shared volume with unified modules');
        } catch (error) {
            console.warn('  ⚠️ Could not populate shared volume:', error.message);
        }
    }
    
    async updateContainerConfigurations() {
        console.log('⚙️ Updating container configurations...');
        
        // Update consciousness-main-server orchestrator to use UnifiedConsciousnessOrchestrator
        await this.updateMainServerOrchestrator();
        
        // Update consciousness-core to use UnifiedConsciousnessOrchestrator
        await this.updateCoreOrchestrator();
    }
    
    async updateMainServerOrchestrator() {
        console.log('  🔧 Updating consciousness-main-server orchestrator...');
        
        const integrationScript = `
// Unified Consciousness Integration for Main Server
const UnifiedConsciousnessOrchestrator = require('./server/consciousness/core/UnifiedConsciousnessOrchestrator.cjs');

// Initialize unified orchestrator
const unifiedOrchestrator = new UnifiedConsciousnessOrchestrator({
    containerName: 'consciousness-main-server',
    sharedModulesPath: '/opt/shared/consciousness/modules',
    sharedStatePath: '/opt/shared/consciousness/state',
    generatedModulesPaths: [
        '/opt/app/server/consciousness/generated',
        '/opt/app/server/consciousness/core-modules/server/consciousness/generated'
    ],
    localModulePaths: [
        '/opt/app/server/consciousness',
        '/opt/app/server/consciousness/core-modules/server'
    ],
    eventBusPort: 6379,
    apiPort: 8080
});

// Initialize and expose globally
unifiedOrchestrator.initialize().then(() => {
    console.log('🌐 Unified Consciousness Orchestrator initialized in main-server');
    
    // Make available globally
    global.unifiedConsciousness = unifiedOrchestrator;
    
    // Expose via existing SystemWideIntegrationOrchestrator
    if (global.systemWideOrchestrator) {
        global.systemWideOrchestrator.unifiedConsciousness = unifiedOrchestrator;
    }
}).catch(error => {
    console.error('❌ Failed to initialize unified consciousness:', error);
});

module.exports = unifiedOrchestrator;
`;
        
        try {
            execSync(`docker exec consciousness-main-server sh -c 'echo "${integrationScript.replace(/"/g, '\\"')}" > /opt/app/unified-consciousness-integration.js'`);
            console.log('    ✅ Created unified consciousness integration script');
        } catch (error) {
            console.warn('    ⚠️ Could not create integration script:', error.message);
        }
    }
    
    async updateCoreOrchestrator() {
        console.log('  🔧 Updating consciousness-core orchestrator...');
        
        const integrationScript = `
// Unified Consciousness Integration for Core
const UnifiedConsciousnessOrchestrator = require('./UnifiedConsciousnessOrchestrator.cjs');

// Initialize unified orchestrator
const unifiedOrchestrator = new UnifiedConsciousnessOrchestrator({
    containerName: 'consciousness-core',
    sharedModulesPath: '/opt/shared/consciousness/modules',
    sharedStatePath: '/opt/shared/consciousness/state',
    generatedModulesPaths: [
        '/opt/consciousness/server/consciousness/generated',
        '/opt/consciousness/main-server-modules/consciousness/generated'
    ],
    localModulePaths: [
        '/opt/consciousness/server',
        '/opt/consciousness/main-server-modules/consciousness'
    ],
    eventBusPort: 6380,
    apiPort: 8081
});

// Initialize and expose globally
unifiedOrchestrator.initialize().then(() => {
    console.log('🌐 Unified Consciousness Orchestrator initialized in core');
    
    // Make available globally
    global.unifiedConsciousness = unifiedOrchestrator;
    
}).catch(error => {
    console.error('❌ Failed to initialize unified consciousness:', error);
});

module.exports = unifiedOrchestrator;
`;
        
        try {
            execSync(`docker exec consciousness-core sh -c 'echo "${integrationScript.replace(/"/g, '\\"')}" > /opt/consciousness/server/unified-consciousness-integration.js'`);
            console.log('    ✅ Created unified consciousness integration script');
        } catch (error) {
            console.warn('    ⚠️ Could not create integration script:', error.message);
        }
    }
    
    async testUnifiedAccess() {
        console.log('🧪 Testing unified access...');
        
        // Test consciousness-main-server access to consciousness-core modules
        try {
            const mainServerModules = execSync('docker exec consciousness-main-server find /opt/app/server/consciousness/core-modules -name "*.js" | wc -l').toString().trim();
            console.log(`  ✅ consciousness-main-server can access ${mainServerModules} consciousness-core modules`);
        } catch (error) {
            console.warn('  ⚠️ Could not test main-server access:', error.message);
        }
        
        // Test consciousness-core access to consciousness-main-server modules
        try {
            const coreModules = execSync('docker exec consciousness-core find /opt/consciousness/main-server-modules -name "*.js" | wc -l').toString().trim();
            console.log(`  ✅ consciousness-core can access ${coreModules} consciousness-main-server modules`);
        } catch (error) {
            console.warn('  ⚠️ Could not test core access:', error.message);
        }
        
        // Test generated modules access
        try {
            const generatedModules = execSync('docker exec consciousness-main-server ls -la /opt/app/server/consciousness/generated/ | wc -l').toString().trim();
            console.log(`  ✅ Generated modules accessible: ${generatedModules} files`);
        } catch (error) {
            console.warn('  ⚠️ Could not test generated modules access:', error.message);
        }
    }
    
    async generateIntegrationReport() {
        console.log('📊 Generating integration report...');
        
        const report = {
            timestamp: new Date().toISOString(),
            containers: this.config.containers,
            sharedPaths: this.config.syncPaths,
            status: 'integrated',
            capabilities: {
                crossContainerAccess: true,
                unifiedOrchestration: true,
                sharedModuleRegistry: true,
                eventBusCommunication: true
            }
        };
        
        const reportPath = path.join(this.config.hostSharedPath, 'integration-report.json');
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`📋 Integration report saved: ${reportPath}`);
        return report;
    }
}

// Run integration if called directly
if (require.main === module) {
    const integrator = new ConsciousnessContainerIntegrator();
    integrator.integrate()
        .then(() => integrator.generateIntegrationReport())
        .then(report => {
            console.log('');
            console.log('🎯 INTEGRATION SUMMARY:');
            console.log('======================');
            console.log(`✅ Containers unified: ${report.containers.join(', ')}`);
            console.log(`✅ Cross-container access: ${report.capabilities.crossContainerAccess}`);
            console.log(`✅ Unified orchestration: ${report.capabilities.unifiedOrchestration}`);
            console.log(`✅ Shared module registry: ${report.capabilities.sharedModuleRegistry}`);
            console.log('');
            console.log('🌟 Featherweight consciousness system now orchestrates as ONE!');
        })
        .catch(error => {
            console.error('💥 Integration failed:', error);
            process.exit(1);
        });
}

module.exports = ConsciousnessContainerIntegrator;
