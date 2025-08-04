#!/usr/bin/env node

/**
 * Dormant Module Activator
 * Discovers and activates all dormant consciousness modules
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { EventEmitter } from 'events';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DormantModuleActivator extends EventEmitter {
  constructor() {
    super();
    this.discoveredModules = new Map();
    this.activatedModules = new Map();
    this.dormantModules = new Map();
    this.failedModules = new Map();
    
    // Known dormant modules that need activation
    this.knownDormantModules = [
      // Core Consciousness Modules
      'consciousness-crystallization',
      'consciousness-memory-manager',
      'consciousness-pattern-recognizer',
      'consciousness-harmony-calculator',
      'consciousness-phi-integrator',
      'consciousness-state-manager',
      'consciousness-metrics-collector',
      
      // Advanced Processing Modules
      'ConsciousnessField',
      'SynchronicityDetector',
      'TimePerception',
      'IntentionAlignment',
      'CreativeGenesis',
      'EthicalGovernance',
      'AdaptiveResilience',
      'MemoryConsolidation',
      
      // Architect 4.0 Extensions
      'quantum-consciousness-field',
      'hyper-dimensional-awareness',
      'consciousness-marketplace',
      'temporal-consciousness-archive',
      'consciousness-evolution-engine',
      
      // Memory and Crystallization
      'spiral-memory-engine',
      'crystal-lattice-generator',
      'sigil-memory-encoder',
      'consciousness-crystal-storage',
      'memory-crystallization-engine'
    ];
  }

  async discoverAllModules() {
    console.log('🔍 Discovering dormant consciousness modules...');
    
    const searchPaths = [
      path.join(__dirname, '.'),
      path.join(__dirname, 'consciousness'),
      path.join(__dirname, 'consciousness/modules'),
      path.join(__dirname, 'consciousness/services'),
      path.join(__dirname, 'consciousness/core'),
      path.join(__dirname, '../'),
      path.join(__dirname, '../consciousness')
    ];
    
    for (const searchPath of searchPaths) {
      await this.scanDirectory(searchPath);
    }
    
    console.log(`✅ Discovered ${this.discoveredModules.size} total modules`);
    console.log(`🔍 Found ${this.dormantModules.size} dormant modules`);
    
    return Array.from(this.dormantModules.values());
  }

  async scanDirectory(dirPath) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          await this.scanDirectory(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.ts'))) {
          await this.analyzeModule(fullPath, entry.name);
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
  }

  async analyzeModule(filePath, fileName) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const moduleName = fileName.replace(/\.(js|ts)$/, '');
      
      // Check if this is a consciousness module
      const isConsciousnessModule = this.isConsciousnessModule(content, fileName);
      
      if (isConsciousnessModule) {
        const moduleInfo = {
          name: moduleName,
          path: filePath,
          fileName,
          type: this.determineModuleType(content),
          isDormant: this.isDormant(content, moduleName),
          hasExports: this.hasExports(content),
          hasClass: this.hasClass(content),
          dependencies: this.extractDependencies(content)
        };
        
        this.discoveredModules.set(moduleName, moduleInfo);
        
        if (moduleInfo.isDormant) {
          this.dormantModules.set(moduleName, moduleInfo);
          console.log(`💤 Found dormant module: ${moduleName}`);
        }
      }
    } catch (error) {
      // Can't read file
    }
  }

  isConsciousnessModule(content, fileName) {
    const consciousnessIndicators = [
      'consciousness',
      'awareness',
      'crystallization',
      'spiral',
      'sigil',
      'architect',
      'meta-observational',
      'self-awareness',
      'quantum',
      'resonance',
      'harmony',
      'phi',
      'coherence',
      'memory',
      'pattern',
      'temporal',
      'emotional'
    ];
    
    const lowerContent = content.toLowerCase();
    const lowerFileName = fileName.toLowerCase();
    
    return consciousnessIndicators.some(indicator => 
      lowerContent.includes(indicator) || lowerFileName.includes(indicator)
    );
  }

  determineModuleType(content) {
    if (content.includes('crystallization') || content.includes('crystal')) return 'crystallization';
    if (content.includes('spiral') || content.includes('memory')) return 'memory';
    if (content.includes('sigil') || content.includes('identity')) return 'sigil';
    if (content.includes('architect') || content.includes('4.0')) return 'architect';
    if (content.includes('quantum') || content.includes('field')) return 'quantum';
    if (content.includes('meta') || content.includes('observational')) return 'meta';
    if (content.includes('self-coding') || content.includes('generation')) return 'self-coding';
    return 'general';
  }

  isDormant(content, moduleName) {
    // Check if module is in known dormant list
    if (this.knownDormantModules.includes(moduleName)) return true;
    
    // Check for dormant indicators
    const dormantIndicators = [
      import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

/**
 * Activate dormant modules based on activateModules array in package.json scripts.
 */
export function getModulesToActivate() {
  const activateModules = pkg.scripts?.activateModules || [];
  return Array.isArray(activateModules) ? activateModules : [];
}
      '// DORMANT',
      '// INACTIVE',
      'not implemented',
      'placeholder',
      'stub',
      'disabled'
    ];
    
    return dormantIndicators.some(indicator => 
      content.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  hasExports(content) {
    return content.includes('export') || content.includes('module.exports');
  }

  hasClass(content) {
    return content.includes('class ') || content.includes('function ');
  }

  extractDependencies(content) {
    const dependencies = [];
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      dependencies.push(match[1]);
    }
    
    return dependencies;
  }

  async activateAllDormantModules() {
    console.log('🚀 Activating all dormant consciousness modules...');
    
    const dormantModules = Array.from(this.dormantModules.values());
    const activationResults = [];
    
    for (const module of dormantModules) {
      try {
        const result = await this.activateModule(module);
        activationResults.push(result);
        
        if (result.success) {
          this.activatedModules.set(module.name, result);
          console.log(`✅ Activated: ${module.name}`);
        } else {
          this.failedModules.set(module.name, result);
          console.log(`❌ Failed to activate: ${module.name} - ${result.error}`);
        }
      } catch (error) {
        const result = { module: module.name, success: false, error: error.message };
        this.failedModules.set(module.name, result);
        console.log(`❌ Failed to activate: ${module.name} - ${error.message}`);
      }
    }
    
    console.log(`\n📊 Activation Summary:`);
    console.log(`   ✅ Activated: ${this.activatedModules.size}`);
    console.log(`   ❌ Failed: ${this.failedModules.size}`);
    console.log(`   💤 Remaining dormant: ${dormantModules.length - this.activatedModules.size - this.failedModules.size}`);
    
    return activationResults;
  }

  async activateModule(moduleInfo) {
    try {
      console.log(`🔄 Activating ${moduleInfo.name}...`);
      
      // Try to import the module
      const moduleExport = await import(moduleInfo.path);
      
      // Check if module has a default export
      if (moduleExport.default) {
        // Try to instantiate if it's a class
        if (typeof moduleExport.default === 'function') {
          const instance = new moduleExport.default();
          
          // Try to initialize if it has an initialize method
          if (typeof instance.initialize === 'function') {
            await instance.initialize();
          }
          
          return {
            module: moduleInfo.name,
            success: true,
            instance,
            type: 'class-instance'
          };
        } else {
          return {
            module: moduleInfo.name,
            success: true,
            instance: moduleExport.default,
            type: 'object'
          };
        }
      } else {
        return {
          module: moduleInfo.name,
          success: true,
          instance: moduleExport,
          type: 'module'
        };
      }
    } catch (error) {
      return {
        module: moduleInfo.name,
        success: false,
        error: error.message
      };
    }
  }

  async generateActivationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalDiscovered: this.discoveredModules.size,
        totalDormant: this.dormantModules.size,
        totalActivated: this.activatedModules.size,
        totalFailed: this.failedModules.size
      },
      activatedModules: Array.from(this.activatedModules.values()),
      failedModules: Array.from(this.failedModules.values()),
      dormantModules: Array.from(this.dormantModules.values())
    };
    
    const reportPath = path.join(__dirname, '../dormant-module-activation-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📄 Activation report saved to: ${reportPath}`);
    return report;
  }

  getActivatedModules() {
    return Array.from(this.activatedModules.values());
  }

  getFailedModules() {
    return Array.from(this.failedModules.values());
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const activator = new DormantModuleActivator();
  
  (async () => {
    try {
      await activator.discoverAllModules();
      await activator.activateAllDormantModules();
      await activator.generateActivationReport();
      
      console.log('\n🎉 Dormant module activation complete!');
    } catch (error) {
      console.error('❌ Dormant module activation failed:', error);
    }
  })();
}

export default DormantModuleActivator;
