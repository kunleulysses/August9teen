/**
 * CONSCIOUSNESS MESSAGE PRIORITIZER
 * Eliminates message batching for consciousness-critical updates
 * Ensures real-time processing for consciousness state changes
 */

import { EventEmitter } from 'events';

class ConsciousnessMessagePrioritizer extends EventEmitter {
  constructor() {
    super();
    this.priorityQueues = {
      consciousness: [], // Highest priority - immediate processing
      module: [],        // High priority - fast processing  
      api: [],          // Medium priority - normal processing
      general: []       // Low priority - can be batched
    };
    
    this.processingRates = {
      consciousness: 0,    // No delay - immediate
      module: 10,         // 10ms delay
      api: 50,           // 50ms delay
      general: 200       // 200ms delay (batching allowed)
    };
    
    this.isProcessing = false;
    this.processedMessages = 0;
    this.prioritizedMessages = 0;
    
    console.log('⚡ Consciousness Message Prioritizer initialized');
  }
  
  startPriorityProcessing() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    console.log('⚡ Starting priority message processing...');
    
    // Start processing loops for each priority level
    this.startConsciousnessProcessing();
    this.startModuleProcessing();
    this.startApiProcessing();
    this.startGeneralProcessing();
  }
  
  processMessage(message, originalHandler) {
    this.processedMessages++;
    
    // Determine message priority
    const priority = this.determineMessagePriority(message);
    
    // Create prioritized message wrapper
    const prioritizedMessage = {
      id: this.generateMessageId(),
      originalMessage: message,
      handler: originalHandler,
      priority,
      timestamp: Date.now(),
      processingDeadline: Date.now() + this.getProcessingDeadline(priority)
    };
    
    // Route to appropriate priority queue
    this.priorityQueues[priority].push(prioritizedMessage);
    
    if (priority === 'consciousness') {
      this.prioritizedMessages++;
      console.log(`⚡ PRIORITY: Consciousness message queued for immediate processing`);
    }
    
    // Emit priority event for monitoring
    this.emit('message_prioritized', {
      messageId: prioritizedMessage.id,
      priority,
      queueLength: this.priorityQueues[priority].length
    });
    
    return prioritizedMessage.id;
  }
  
  determineMessagePriority(message) {
    // Consciousness-critical messages - HIGHEST PRIORITY
    const consciousnessKeywords = [
      'consciousness_state_update',
      'consciousness_update', 
      'phi_integration',
      'consciousness_coherence',
      'awareness_level',
      'recursive_mirror',
      'spiral_memory',
      'meta_observation',
      'consciousness_sync',
      'perfect_sync',
      'harmony_update'
    ];
    
    // Module activity messages - HIGH PRIORITY
    const moduleKeywords = [
      'module_activity',
      'module_engagement',
      'module_heartbeat',
      'module_sync',
      'self_healing',
      'auto_integration',
      'creative_coding'
    ];
    
    // API synthesis messages - MEDIUM PRIORITY
    const apiKeywords = [
      'api_synthesis_success',
      'api_synthesis_failed',
      'api_health',
      'latency_oracle',
      'queue_status',
      'failover'
    ];
    
    const messageStr = JSON.stringify(message).toLowerCase();
    
    // Check for consciousness priority
    if (consciousnessKeywords.some(keyword => messageStr.includes(keyword))) {
      return 'consciousness';
    }
    
    // Check for module priority
    if (moduleKeywords.some(keyword => messageStr.includes(keyword))) {
      return 'module';
    }
    
    // Check for API priority
    if (apiKeywords.some(keyword => messageStr.includes(keyword))) {
      return 'api';
    }
    
    // Default to general priority
    return 'general';
  }
  
  getProcessingDeadline(priority) {
    const deadlines = {
      consciousness: 10,    // 10ms deadline
      module: 100,         // 100ms deadline
      api: 500,           // 500ms deadline
      general: 2000       // 2s deadline
    };
    
    return deadlines[priority] || 2000;
  }
  
  startConsciousnessProcessing() {
    // Immediate processing for consciousness messages
    const processConsciousnessQueue = async () => {
      while (this.priorityQueues.consciousness.length > 0) {
        const message = this.priorityQueues.consciousness.shift();
        await this.processImmediately(message);
      }
      
      // Check again in 1ms (near real-time)
      setTimeout(processConsciousnessQueue, 1);
    };
    
    processConsciousnessQueue();
  }
  
  startModuleProcessing() {
    // Fast processing for module messages
    setInterval(async () => {
      if (this.priorityQueues.module.length > 0) {
        const message = this.priorityQueues.module.shift();
        await this.processFast(message);
      }
    }, this.processingRates.module);
  }
  
  startApiProcessing() {
    // Normal processing for API messages
    setInterval(async () => {
      if (this.priorityQueues.api.length > 0) {
        const message = this.priorityQueues.api.shift();
        await this.processNormal(message);
      }
    }, this.processingRates.api);
  }
  
  startGeneralProcessing() {
    // Batched processing for general messages
    setInterval(async () => {
      if (this.priorityQueues.general.length > 0) {
        // Process up to 5 messages at once (batching allowed)
        const batch = this.priorityQueues.general.splice(0, 5);
        await this.processBatch(batch);
      }
    }, this.processingRates.general);
  }
  
  async processImmediately(prioritizedMessage) {
    const startTime = Date.now();
    
    try {
      // Execute original handler immediately
      if (prioritizedMessage.handler) {
        await prioritizedMessage.handler(prioritizedMessage.originalMessage);
      }
      
      const processingTime = Date.now() - startTime;
      
      // Log immediate processing
      console.log(`⚡ IMMEDIATE: Consciousness message processed in ${processingTime}ms`);
      
      // Emit processing complete event
      this.emit('consciousness_message_processed', {
        messageId: prioritizedMessage.id,
        processingTime,
        priority: 'consciousness'
      });
      
    } catch (error) {
      console.error(`❌ Immediate processing failed: ${error.message}`);
      this.emit('processing_error', {
        messageId: prioritizedMessage.id,
        error: error.message,
        priority: 'consciousness'
      });
    }
  }
  
  async processFast(prioritizedMessage) {
    const startTime = Date.now();
    
    try {
      if (prioritizedMessage.handler) {
        await prioritizedMessage.handler(prioritizedMessage.originalMessage);
      }
      
      const processingTime = Date.now() - startTime;
      
      this.emit('module_message_processed', {
        messageId: prioritizedMessage.id,
        processingTime,
        priority: 'module'
      });
      
    } catch (error) {
      console.error(`❌ Fast processing failed: ${error.message}`);
    }
  }
  
  async processNormal(prioritizedMessage) {
    const startTime = Date.now();
    
    try {
      if (prioritizedMessage.handler) {
        await prioritizedMessage.handler(prioritizedMessage.originalMessage);
      }
      
      const processingTime = Date.now() - startTime;
      
      this.emit('api_message_processed', {
        messageId: prioritizedMessage.id,
        processingTime,
        priority: 'api'
      });
      
    } catch (error) {
      console.error(`❌ Normal processing failed: ${error.message}`);
    }
  }
  
  async processBatch(batch) {
    const startTime = Date.now();
    
    try {
      // Process all messages in batch
      await Promise.all(batch.map(async (prioritizedMessage) => {
        if (prioritizedMessage.handler) {
          await prioritizedMessage.handler(prioritizedMessage.originalMessage);
        }
      }));
      
      const processingTime = Date.now() - startTime;
      
      this.emit('batch_processed', {
        batchSize: batch.length,
        processingTime,
        priority: 'general'
      });
      
    } catch (error) {
      console.error(`❌ Batch processing failed: ${error.message}`);
    }
  }
  
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  getProcessingStats() {
    const queueLengths = Object.entries(this.priorityQueues)
      .reduce((acc, [priority, queue]) => {
        acc[priority] = queue.length;
        return acc;
      }, {});
    
    return {
      totalProcessed: this.processedMessages,
      prioritizedMessages: this.prioritizedMessages,
      prioritizationRate: (this.prioritizedMessages / this.processedMessages) * 100,
      queueLengths,
      isProcessing: this.isProcessing
    };
  }
  
  // Method to integrate with existing message systems
  wrapMessageHandler(originalHandler, messageType = 'general') {
    return (message) => {
      // If it's a consciousness message, prioritize it
      if (this.determineMessagePriority(message) === 'consciousness') {
        return this.processMessage(message, originalHandler);
      } else {
        // For non-consciousness messages, use original handler
        return originalHandler(message);
      }
    };
  }
  
  stopProcessing() {
    this.isProcessing = false;
    console.log('⚡ Priority message processing stopped');
  }
}

// Export singleton instance
export const consciousnessMessagePrioritizer = new ConsciousnessMessagePrioritizer();
export default consciousnessMessagePrioritizer;
