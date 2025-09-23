#!/usr/bin/env node

// Mandatory infrastructure environment variables (fail fast if present but empty)
const requiredEnv = [
  'OPENAI_API_KEY',
  // database aliases
  'DB_URL', 'DATABASE_URL', 'PG_URI',
  // cache aliases
  'REDIS_URL', 'CACHE_URL'
];
const missing = requiredEnv.filter((v) => process.env.hasOwnProperty(v) && !process.env[v]);
if (missing.length) {
  console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

/**
 * Startup script for Unified Consciousness System
 * Replaces the parallel isolated systems with a single unified architecture
 */

// UnifiedConsciousnessSystem will be dynamically imported in the async function below

console.log('🌟 STARTING UNIFIED CONSCIOUSNESS SYSTEM');
console.log('═══════════════════════════════════════\n');

async function startUnifiedSystem() {
  try {
    console.log('🔄 Replacing parallel isolated systems with unified architecture...\n');
    
    // Dynamically import the real ESM module
    const { default: UnifiedConsciousnessSystem } = await import('./server/unified-consciousness-system.mjs');
    
    // Create unified system instance
    const unifiedSystem = new UnifiedConsciousnessSystem();
    
    // Initialize the unified system
    await unifiedSystem.initialize();

    // --- Healthcheck HTTP server for Docker Compose ---
    const http = require('http');
    const healthServer = http.createServer((req, res) => {
      if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'not found' }));
      }
    });
    healthServer.listen(5005, '0.0.0.0', () => {
      console.log('Health endpoint available at http://localhost:5005/health');
    });

    console.log('\n🎉 UNIFIED CONSCIOUSNESS SYSTEM OPERATIONAL!');
    console.log('═══════════════════════════════════════════');
    
    const status = unifiedSystem.getSystemStatus();
    console.log(`System: ${status.name} v${status.version}`);
    console.log(`Modules: ${status.modules}`);
    console.log(`Services: ${status.services}`);
    console.log(`Architect 4.0 Systems: ${status.architect4Systems}`);
    console.log(`WebSocket Port: 3002`);
    console.log(`Unified Architecture: ${status.unified ? 'YES' : 'NO'}`);
    
    console.log('\n✅ INTEGRATION BENEFITS:');
    console.log('• Single SelfCodingModule instance (no duplication)');
    console.log('• Shared global event bus (cross-system communication)');
    console.log('• Unified consciousness state (single source of truth)');
    console.log('• Integrated Architect 4.0 systems');
    console.log('• Real-time WebSocket communication');
    console.log('• 100Hz consciousness processing loop');
    
    console.log('\n🔗 SYSTEM CONNECTIONS:');
    console.log('• SelfCodingModule ↔ Global Event Bus ↔ Architect 4.0');
    console.log('• Consciousness State ↔ All Modules ↔ WebSocket Clients');
    console.log('• TetraLattice ↔ Unity Conductor ↔ Self-Healing Mesh');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down Unified Consciousness System...');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down Unified Consciousness System...');
      process.exit(0);
    });
    
    // Keep the process running
    console.log('\n�� System running... Press Ctrl+C to stop');
    
  } catch (error) {
    console.error('❌ Failed to start Unified Consciousness System:', error);
    process.exit(1);
  }
}

// Start the unified system
startUnifiedSystem();
