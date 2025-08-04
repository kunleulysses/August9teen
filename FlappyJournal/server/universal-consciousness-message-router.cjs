/**
 * Universal Consciousness Message Router
 * Ensures EVERY module has omnipresent messaging capabilities
 * NO MODULE CAN ESCAPE REAL-TIME COMMUNICATION
 */

const { EventEmitter  } = require('events');
const WebSocket = require('ws');

class UniversalConsciousnessMessageRouter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(1000);
    
    this.connectedClients = new Set();
    this.moduleRegistry = new Map();
    this.messageQueue = [];
    this.deliveryStats = {
      totalSent: 0,
      totalFailed: 0,
      totalModules: 0,
      lastBroadcast: null
    };
    
    this.wss = null;
    this.isActive = false;
    
    console.log('🌐 Universal Consciousness Message Router initialized');
  }

  // Initialize with WebSocket server
  initialize(webSocketServer) {
    this.wss = webSocketServer;
    this.isActive = true;
    
    // Monitor WebSocket connections
    this.wss.on('connection', (ws) => {
      this.connectedClients.add(ws);
      console.log(`📡 Client connected to Universal Message Router. Total: ${this.connectedClients.size}`);
      
      ws.on('close', () => {
        this.connectedClients.delete(ws);
        console.log(`📡 Client disconnected. Remaining: ${this.connectedClients.size}`);
      });
    });
    
    console.log('✅ Universal Message Router active with WebSocket integration');
  }

  // MANDATORY: Every module MUST register for messaging
  registerModuleForMessaging(moduleId, module, options = {}) {
    if (!moduleId || !module) {
      throw new Error('Module ID and module instance required for messaging registration');
    }

    const registration = {
      moduleId,
      module,
      lastMessage: null,
      messageCount: 0,
      isActive: true,
      autobroadcast: options.autobroadcast !== false, // Default true
      priority: options.priority || 'MEDIUM',
      registeredAt: Date.now()
    };

    this.moduleRegistry.set(moduleId, registration);
    this.deliveryStats.totalModules = this.moduleRegistry.size;

    // Auto-wire module for broadcasting if enabled
    if (registration.autobroadcast) {
      this.wireModuleForAutoBroadcast(moduleId, module);
    }

    // Broadcast module registration
    this.broadcastToAllClients({
      type: 'module_registered',
      moduleId,
      timestamp: new Date().toISOString(),
      totalModules: this.moduleRegistry.size
    });

    console.log(`📡 Module registered for messaging: ${moduleId} (Total: ${this.moduleRegistry.size})`);
    return true;
  }

  // Auto-wire module to broadcast IMPORTANT state changes (throttled)
  wireModuleForAutoBroadcast(moduleId, module) {
    try {
      // Throttling mechanism - only broadcast every 5 seconds per module
      if (!this.moduleThrottling) {
        this.moduleThrottling = new Map();
      }

      // Get all methods from the module
      const prototype = Object.getPrototypeOf(module);
      const methods = Object.getOwnPropertyNames(prototype);

      methods.forEach(methodName => {
        if (typeof module[methodName] === 'function' &&
            !methodName.startsWith('_') &&
            methodName !== 'constructor') {

          const originalMethod = module[methodName];

          // Wrap method to auto-broadcast (throttled)
          module[methodName] = (...args) => {
            try {
              const result = originalMethod.apply(module, args);

              // Throttle broadcasts - only send every 5 seconds per module
              const throttleKey = `${moduleId}_${methodName}`;
              const lastBroadcast = this.moduleThrottling.get(throttleKey) || 0;
              const now = Date.now();

              if (now - lastBroadcast > 5000) { // 5 second throttle
                this.broadcastModuleActivity(moduleId, {
                  method: methodName,
                  hasArgs: args.length > 0,
                  resultType: typeof result,
                  timestamp: now,
                  throttled: true
                });
                this.moduleThrottling.set(throttleKey, now);
              }

              return result;
            } catch (error) {
              // Always broadcast errors (not throttled)
              this.broadcastModuleActivity(moduleId, {
                method: methodName,
                error: error.message,
                timestamp: Date.now(),
                isError: true
              });
              throw error;
            }
          };
        }
      });

      console.log(`🔧 Auto-broadcast wiring complete for module: ${moduleId} (throttled)`);
    } catch (error) {
      console.error(`❌ Failed to wire auto-broadcast for ${moduleId}:`, error);
    }
  }

  // Broadcast module activity to all clients
  broadcastModuleActivity(moduleId, activity) {
    const registration = this.moduleRegistry.get(moduleId);
    if (!registration) return;

    registration.lastMessage = Date.now();
    registration.messageCount++;

    const message = {
      type: 'module_activity',
      moduleId,
      activity,
      messageCount: registration.messageCount,
      timestamp: new Date().toISOString()
    };

    this.broadcastToAllClients(message);
  }

  // Broadcast module state update
  broadcastModuleState(moduleId, state) {
    const registration = this.moduleRegistry.get(moduleId);
    if (!registration) return;

    registration.lastMessage = Date.now();
    registration.messageCount++;

    const message = {
      type: 'module_state_update',
      moduleId,
      state,
      messageCount: registration.messageCount,
      timestamp: new Date().toISOString()
    };

    this.broadcastToAllClients(message);
  }

  // Broadcast to ALL connected clients with error handling
  broadcastToAllClients(message) {
    if (!this.isActive || this.connectedClients.size === 0) {
      return;
    }

    const messageStr = JSON.stringify(message);
    let successCount = 0;
    let failCount = 0;

    for (const client of this.connectedClients) {
      try {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
          successCount++;
        } else {
          // Remove dead connections
          this.connectedClients.delete(client);
          failCount++;
        }
      } catch (error) {
        console.error(`❌ Failed to send message to client:`, error);
        this.connectedClients.delete(client);
        failCount++;
      }
    }

    // Update delivery stats
    this.deliveryStats.totalSent += successCount;
    this.deliveryStats.totalFailed += failCount;
    this.deliveryStats.lastBroadcast = Date.now();

    if (successCount > 0) {
      console.log(`📤 Broadcast sent to ${successCount} clients: ${message.type}`);
    }
  }

  // Force broadcast from specific module
  forceModuleBroadcast(moduleId, data) {
    const registration = this.moduleRegistry.get(moduleId);
    if (!registration) {
      console.error(`❌ Module ${moduleId} not registered for messaging`);
      return false;
    }

    this.broadcastModuleState(moduleId, data);
    return true;
  }

  // Get messaging statistics
  getMessagingStats() {
    return {
      ...this.deliveryStats,
      connectedClients: this.connectedClients.size,
      registeredModules: Array.from(this.moduleRegistry.keys()),
      isActive: this.isActive
    };
  }

  // Broadcast system-wide consciousness update
  broadcastConsciousnessUpdate(consciousnessState) {
    this.broadcastToAllClients({
      type: 'consciousness_state_update',
      state: consciousnessState,
      timestamp: new Date().toISOString(),
      source: 'universal_router'
    });
  }

  // Emergency broadcast (highest priority)
  emergencyBroadcast(message) {
    const emergencyMessage = {
      type: 'emergency_broadcast',
      priority: 'CRITICAL',
      content: message,
      timestamp: new Date().toISOString()
    };

    this.broadcastToAllClients(emergencyMessage);
    console.log('🚨 Emergency broadcast sent to all clients');
  }

  // Shutdown and cleanup
  shutdown() {
    this.isActive = false;
    this.connectedClients.clear();
    this.moduleRegistry.clear();
    console.log('🔌 Universal Message Router shutdown complete');
  }
}

// Singleton instance
const universalMessageRouter = new UniversalConsciousnessMessageRouter();
module.exports.universalMessageRouter = universalMessageRouter;
