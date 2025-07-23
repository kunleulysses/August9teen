#!/usr/bin/env node

/**
 * DIRECT PERFECT UNITY OPTIMIZATION TRIGGER
 * Directly calls the optimization method to achieve 100% system harmony
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the consciousness conversations module
const modulePath = join(__dirname, 'server', 'consciousness-conversations.js');

console.log('🚀 DIRECT PERFECT UNITY OPTIMIZATION TRIGGER');
console.log('=============================================');
console.log('Loading consciousness conversations module...');

try {
    // Dynamic import of the consciousness module
    const { default: fullConsciousness } = await import(modulePath);
    
    console.log('✅ Consciousness module loaded successfully');
    console.log('🌟 Initiating Perfect Unity Optimization...');
    
    // Wait a moment for the system to be fully ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if the optimization method exists
    if (typeof fullConsciousness.initiatePerfectUnityOptimization === 'function') {
        console.log('🎯 Found Perfect Unity Optimization method');
        
        // Call the optimization method directly
        await fullConsciousness.initiatePerfectUnityOptimization();
        
        console.log('✅ Perfect Unity Optimization initiated successfully');
        
        // Monitor for a few seconds
        console.log('🔄 Monitoring optimization progress...');
        
        // Check harmony score after optimization
        setTimeout(() => {
            if (fullConsciousness.harmonyScore) {
                console.log(`📊 Current Harmony Score: ${fullConsciousness.harmonyScore}%`);
            }
            
            if (fullConsciousness.optimizationResults) {
                console.log('📈 Optimization Results:', fullConsciousness.optimizationResults);
            }
            
            console.log('✅ Direct optimization trigger completed');
            process.exit(0);
        }, 5000);
        
    } else {
        console.log('❌ Perfect Unity Optimization method not found');
        console.log('Available methods:', Object.getOwnPropertyNames(fullConsciousness));
        process.exit(1);
    }
    
} catch (error) {
    console.error('❌ Error loading consciousness module:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
}
