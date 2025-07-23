/**
 * INTELLIGENT REQUEST QUEUE SYSTEM
 * Smart queuing with retry logic and race conditions for API requests
 * Ensures maximum reliability and minimum latency
 */

import apiLatencyOracle from './api-latency-oracle.js';

class IntelligentRequestQueue {
  constructor() {
    this.queues = {
      high: [],      // High priority requests (user-facing)
      medium: [],    // Medium priority requests
      background: [] // Background requests (async processing)
    };
    
    this.processing = new Map(); // Track processing requests
    this.retryAttempts = new Map(); // Track retry attempts
    this.maxRetries = 2;
    this.raceTimeouts = new Map(); // Track race condition timeouts
    
    this.isProcessing = false;
    this.processingInterval = 100; // Process queue every 100ms
    
    console.log('🎯 Intelligent Request Queue initialized');
  }
  
  startProcessing() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    console.log('🎯 Starting intelligent queue processing...');
    
    this.processingTimer = setInterval(() => {
      this.processQueues();
    }, this.processingInterval);
  }
  
  stopProcessing() {
    if (this.processingTimer) {
      clearInterval(this.processingTimer);
      this.isProcessing = false;
      console.log('🎯 Queue processing stopped');
    }
  }
  
  async enqueueRequest(request, priority = 'medium') {
    const requestId = this.generateRequestId();
    const queuedRequest = {
      id: requestId,
      ...request,
      priority,
      queuedAt: Date.now(),
      attempts: 0
    };
    
    this.queues[priority].push(queuedRequest);
    console.log(`🎯 Request queued: ${requestId} (${priority} priority)`);
    
    // Return a promise that resolves when the request is processed
    return new Promise((resolve, reject) => {
      queuedRequest.resolve = resolve;
      queuedRequest.reject = reject;
    });
  }
  
  async processQueues() {
    // Process high priority first, then medium, then background
    const priorities = ['high', 'medium', 'background'];
    
    for (const priority of priorities) {
      if (this.queues[priority].length > 0) {
        const request = this.queues[priority].shift();
        this.processRequest(request);
        break; // Process one request at a time
      }
    }
  }
  
  async processRequest(request) {
    const { id, strategy, synthesisFunction, args } = request;
    
    console.log(`🎯 Processing request: ${id}`);
    this.processing.set(id, request);
    
    try {
      // Get best API based on current health
      const bestAPI = apiLatencyOracle.getBestAPI(request.requestType);
      
      if (!bestAPI) {
        console.log(`🎯 No healthy APIs available for ${id}, using local fallback`);
        const result = await this.executeLocalFallback(request);
        this.completeRequest(id, result);
        return;
      }
      
      // Check if we should use race condition (multiple APIs)
      const shouldRace = this.shouldUseRaceCondition(request);
      
      if (shouldRace) {
        await this.executeRaceCondition(request);
      } else {
        await this.executeSingleAPI(request, bestAPI);
      }
      
    } catch (error) {
      console.log(`🎯 Request ${id} failed: ${error.message}`);
      await this.handleRequestFailure(request, error);
    }
  }
  
  shouldUseRaceCondition(request) {
    // Use race condition for high priority requests when multiple APIs are healthy
    if (request.priority !== 'high') return false;
    
    const healthyAPIs = Object.entries(apiLatencyOracle.getAllAPIHealth())
      .filter(([api, health]) => health.status === 'healthy' && health.successRate >= 80);
    
    return healthyAPIs.length >= 2;
  }
  
  async executeRaceCondition(request) {
    const { id } = request;
    console.log(`🎯 Executing race condition for ${id}`);
    
    // Get top 2 healthy APIs
    const healthyAPIs = Object.entries(apiLatencyOracle.getAllAPIHealth())
      .filter(([api, health]) => health.status === 'healthy' && health.successRate >= 80)
      .sort((a, b) => apiLatencyOracle.getHealthScore(b[0]) - apiLatencyOracle.getHealthScore(a[0]))
      .slice(0, 2);
    
    const racePromises = healthyAPIs.map(([apiName]) => 
      this.executeAPICall(request, apiName)
    );
    
    try {
      // Race the API calls - first one to complete wins
      const result = await Promise.race(racePromises);
      console.log(`🎯 Race condition won by: ${result.synthesisMetadata?.model || 'unknown'}`);
      this.completeRequest(id, result);
      
    } catch (error) {
      console.log(`🎯 All race condition APIs failed for ${id}`);
      await this.handleRequestFailure(request, error);
    }
  }
  
  async executeSingleAPI(request, apiName) {
    const { id } = request;
    console.log(`🎯 Executing single API call: ${apiName} for ${id}`);
    
    try {
      const result = await this.executeAPICall(request, apiName);
      this.completeRequest(id, result);
      
    } catch (error) {
      console.log(`🎯 Single API call failed: ${apiName} for ${id}`);
      await this.handleRequestFailure(request, error);
    }
  }
  
  async executeAPICall(request, apiName) {
    const { synthesisFunction, args } = request;
    
    // Update strategy to use the specified API
    const modifiedArgs = {
      ...args,
      strategy: { ...args.strategy, model: this.mapAPINameToModel(apiName) }
    };
    
    return await synthesisFunction(modifiedArgs);
  }
  
  mapAPINameToModel(apiName) {
    const mapping = {
      'openai': 'openai',
      'venice': 'venice', 
      'gemini': 'gemini'
    };
    return mapping[apiName] || 'local';
  }
  
  async handleRequestFailure(request, error) {
    const { id } = request;
    const attempts = this.retryAttempts.get(id) || 0;
    
    if (attempts < this.maxRetries) {
      console.log(`🎯 Retrying request ${id} (attempt ${attempts + 1}/${this.maxRetries})`);
      this.retryAttempts.set(id, attempts + 1);
      
      // Add back to queue with slight delay
      setTimeout(() => {
        this.queues[request.priority].unshift(request);
      }, 1000 * (attempts + 1)); // Exponential backoff
      
    } else {
      console.log(`🎯 Request ${id} exhausted retries, using local fallback`);
      try {
        const result = await this.executeLocalFallback(request);
        this.completeRequest(id, result);
      } catch (fallbackError) {
        this.failRequest(id, fallbackError);
      }
    }
  }
  
  async executeLocalFallback(request) {
    const { synthesisFunction, args } = request;
    
    // Force local synthesis
    const localArgs = {
      ...args,
      strategy: { ...args.strategy, model: 'local' }
    };
    
    return await synthesisFunction(localArgs);
  }
  
  completeRequest(id, result) {
    const request = this.processing.get(id);
    if (request && request.resolve) {
      request.resolve(result);
    }
    
    this.processing.delete(id);
    this.retryAttempts.delete(id);
    console.log(`🎯 Request completed: ${id}`);
  }
  
  failRequest(id, error) {
    const request = this.processing.get(id);
    if (request && request.reject) {
      request.reject(error);
    }
    
    this.processing.delete(id);
    this.retryAttempts.delete(id);
    console.log(`🎯 Request failed: ${id}`);
  }
  
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  getQueueStatus() {
    return {
      high: this.queues.high.length,
      medium: this.queues.medium.length,
      background: this.queues.background.length,
      processing: this.processing.size
    };
  }
}

// Singleton instance
const intelligentRequestQueue = new IntelligentRequestQueue();

export default intelligentRequestQueue;
