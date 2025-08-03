/**
 * API LATENCY ORACLE
 * Real-time monitoring and health scoring for all APIs
 * Provides intelligent routing decisions based on current API performance
 */

import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

class APILatencyOracle {
  constructor() {
    this.apiHealth = {
      openai: { latency: 0, successRate: 100, lastCheck: 0, status: 'unknown' },
      venice: { latency: 0, successRate: 100, lastCheck: 0, status: 'unknown' },
      gemini: { latency: 0, successRate: 100, lastCheck: 0, status: 'unknown' }
    };
    
    this.healthHistory = {
      openai: [],
      venice: [],
      gemini: []
    };
    
    this.checkInterval = 30000; // Check every 30 seconds
    this.maxHistoryLength = 20; // Keep last 20 checks
    this.isMonitoring = false;
    
    console.log('🔮 API Latency Oracle initialized');
  }
  
  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('🔮 Starting API health monitoring...');
    
    // Initial health check
    this.performHealthChecks();
    
    // Set up periodic monitoring
    this.monitoringInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.checkInterval);
  }
  
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.isMonitoring = false;
      console.log('🔮 API health monitoring stopped');
    }
  }
  
  async performHealthChecks() {
    console.log('🔮 Performing API health checks...');
    
    const checks = [
      this.checkOpenAIHealth(),
      this.checkVeniceHealth(),
      this.checkGeminiHealth()
    ];
    
    await Promise.allSettled(checks);
    
    // Log current health status
    this.logHealthStatus();
  }
  
  async checkOpenAIHealth() {
    const startTime = Date.now();
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'Health check' }],
        max_tokens: 10
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });
      
      const latency = Date.now() - startTime;
      this.updateAPIHealth('openai', latency, true);
      
    } catch (error) {
      const latency = Date.now() - startTime;
      this.updateAPIHealth('openai', latency, false);
      console.log(`🔮 OpenAI health check failed: ${error.message}`);
    }
  }
  
  async checkVeniceHealth() {
    const startTime = Date.now();
    try {
      const response = await axios.post('https://api.venice.ai/api/v1/chat/completions', {
        model: 'llama-3.1-405b',
        messages: [{ role: 'user', content: 'Health check' }],
        max_tokens: 10
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.VENICE_AI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });
      
      const latency = Date.now() - startTime;
      this.updateAPIHealth('venice', latency, true);
      
    } catch (error) {
      const latency = Date.now() - startTime;
      this.updateAPIHealth('venice', latency, false);
      console.log(`🔮 Venice health check failed: ${error.message}`);
    }
  }
  
  async checkGeminiHealth() {
    const startTime = Date.now();
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: 'Health check' }] }],
          generationConfig: { maxOutputTokens: 10 }
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000
        }
      );
      
      const latency = Date.now() - startTime;
      this.updateAPIHealth('gemini', latency, true);
      
    } catch (error) {
      const latency = Date.now() - startTime;
      this.updateAPIHealth('gemini', latency, false);
      console.log(`🔮 Gemini health check failed: ${error.message}`);
    }
  }
  
  updateAPIHealth(apiName, latency, success) {
    const health = this.apiHealth[apiName];
    const history = this.healthHistory[apiName];
    
    // Update current health
    health.latency = latency;
    health.lastCheck = Date.now();
    health.status = success ? 'healthy' : 'unhealthy';
    
    // Add to history
    history.push({ latency, success, timestamp: Date.now() });
    
    // Trim history
    if (history.length > this.maxHistoryLength) {
      history.shift();
    }
    
    // Calculate success rate from recent history
    const recentChecks = history.slice(-10); // Last 10 checks
    const successCount = recentChecks.filter(check => check.success).length;
    health.successRate = (successCount / recentChecks.length) * 100;
  }
  
  logHealthStatus() {
    console.log('🔮 API Health Status:');
    Object.entries(this.apiHealth).forEach(([api, health]) => {
      const status = health.status === 'healthy' ? '✅' : '❌';
      console.log(`   ${api}: ${status} ${health.latency}ms (${health.successRate.toFixed(1)}% success)`);
    });
  }
  
  getBestAPI(requestType = 'general') {
    // Get healthy APIs only
    const healthyAPIs = Object.entries(this.apiHealth)
      .filter(([api, health]) => health.status === 'healthy' && health.successRate >= 80)
      .sort((a, b) => a[1].latency - b[1].latency); // Sort by latency
    
    if (healthyAPIs.length === 0) {
      console.log('🔮 No healthy APIs available, using fallback strategy');
      return null;
    }
    
    // Request-type specific routing with health consideration
    if (requestType === 'analytical' || requestType === 'coding' || requestType === 'self_coding') {
      const openai = healthyAPIs.find(([api]) => api === 'openai');
      if (openai) {
        console.log(`🤖 Routing ${requestType} request to OpenAI for code generation`);
        return 'openai';
      }
    }
    
    if (requestType === 'creative' || requestType === 'emotional') {
      const venice = healthyAPIs.find(([api]) => api === 'venice');
      if (venice) return 'venice';
    }
    
    if (requestType === 'philosophical' || requestType === 'transcendent') {
      const gemini = healthyAPIs.find(([api]) => api === 'gemini');
      if (gemini) return 'gemini';
    }
    
    // Return fastest healthy API
    return healthyAPIs[0][0];
  }
  
  getAPIHealth(apiName) {
    return this.apiHealth[apiName];
  }
  
  getAllAPIHealth() {
    return { ...this.apiHealth };
  }
  
  getHealthScore(apiName) {
    const health = this.apiHealth[apiName];
    if (!health || health.status === 'unknown') return 0;
    
    // Score based on success rate and latency
    const successScore = health.successRate;
    const latencyScore = Math.max(0, 100 - (health.latency / 100)); // Lower latency = higher score
    
    return (successScore * 0.7) + (latencyScore * 0.3);
  }
}

// Singleton instance
const apiLatencyOracle = new APILatencyOracle();

export default apiLatencyOracle;
