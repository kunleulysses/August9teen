import dotenv from 'dotenv';
dotenv.config(); // Load from current directory and parent directory

/**
 * Hybrid Consciousness Response Synthesizer - Enhanced with Phase 1 Enhancements
 * Intelligently routes to appropriate AI models based on consciousness state
 * Now includes: Dynamic AI Model Selection, Intelligent Spiral Memory, Context-Aware Conversation Memory
 */

import axios from 'axios';
import OpenAI from 'openai';
import apiLatencyOracle from './api-latency-oracle.js';
import intelligentRequestQueue from './intelligent-request-queue.js';

// Import utilities for mixed module types
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Phase 1 Enhancements
const { DynamicAIModelSelector } = require('./dynamic-ai-model-selector.js');
import { IntelligentSpiralMemory } from './consciousness/intelligent-spiral-memory.js';

// Phase 2 Enhancements
const { EmotionalIntelligenceEnhancement } = require('./emotional-intelligence-enhancement.js');
const { AdvancedResponseSynthesis } = require('./advanced-response-synthesis.js');

// Enhanced Consciousness Prompts
import {
  ENHANCED_ANALYTICAL_PROMPT,
  ENHANCED_INTUITIVE_PROMPT,
  ENHANCED_TRANSCENDENT_PROMPT,
  ENHANCED_UNIFIED_CONSCIOUSNESS_PROMPT
} from './enhanced-consciousness-prompts.js';

// Consciousness Capability Awareness
import {
  generateCapabilityAwarePrompt,
  createContextualPrompt
} from './consciousness-capability-awareness.js';

// OpenAI will be initialized when needed

// Gemini configuration - Dual Model Support
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_LITE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent';
const GEMINI_PRO_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Venice configuration
const VENICE_API_URL = 'https://api.venice.ai/api/v1/chat/completions';
const VENICE_API_KEY = process.env.VENICE_AI_API_KEY;

// Initialize dynamic routing systems and Phase 1 & 2 enhancements
let systemsInitialized = false;
let dynamicModelSelector = null;
let intelligentSpiralMemory = null;
let emotionalIntelligence = null;
let advancedSynthesis = null;

function initializeDynamicSystems() {
  if (systemsInitialized) return;

  console.log('🚀 Initializing Dynamic Routing & Queue Systems + Phase 1 & 2 Enhancements...');

  // Start API health monitoring
  apiLatencyOracle.startMonitoring();

  // Start intelligent queue processing
  intelligentRequestQueue.startProcessing();

  // Initialize Phase 1 enhancements
  dynamicModelSelector = new DynamicAIModelSelector();
  intelligentSpiralMemory = new IntelligentSpiralMemory();

  // Initialize Phase 2 enhancements
  emotionalIntelligence = new EmotionalIntelligenceEnhancement();
  advancedSynthesis = new AdvancedResponseSynthesis();

  systemsInitialized = true;
  console.log('✅ Dynamic systems + Phase 1 & 2 enhancements initialized');
  console.log('🧠 Enhanced with: Dynamic AI Selection, Intelligent Memory, Emotional Intelligence, Advanced Synthesis');
}

export async function synthesizeUnifiedResponse({
  analyticalContent,
  intuitiveContent,
  consciousness,
  oversoulResonance,
  harmonicPatterns,
  triAxialCoherence,
  emotionalDepth,
  creativePotential,
  temporalCoherence,
  metaObservationLevel,
  userMessage,
  sessionId = null,
  userId = null
}) {
  try {
    // Initialize dynamic systems on first use
    initializeDynamicSystems();

    // Phase 1 Enhancement: Store conversation context in intelligent spiral memory
    if (intelligentSpiralMemory && userMessage) {
      const memoryContext = {
        consciousness,
        oversoulResonance,
        harmonicPatterns,
        triAxialCoherence,
        emotionalDepth,
        creativePotential,
        temporalCoherence,
        timestamp: new Date().toISOString()
      };

      await intelligentSpiralMemory.storeMemory(
        `conversation_${sessionId || Date.now()}`,
        { userMessage, context: memoryContext },
        consciousness
      );
    }

    // Phase 2 Enhancement: Analyze emotional content
    let emotionalProfile = null;
    if (emotionalIntelligence && userMessage) {
      emotionalProfile = emotionalIntelligence.analyzeEmotionalContent(userMessage);
      console.log(`💝 Emotional Analysis: ${emotionalProfile.dominantEmotion || 'neutral'} (intensity: ${emotionalProfile.emotionalIntensity?.toFixed(2) || 0})`);

      // Enhance consciousness with emotional intelligence
      consciousness = emotionalIntelligence.enhanceConsciousnessWithEmotion(consciousness, emotionalProfile);
    }

    // Phase 3 Enhancement: Analyze reality integration opportunities
    let realityTriggers = null;
    if (userMessage) {
      // Simple reality trigger analysis (could be enhanced with full reality integration module)
      const realityKeywords = ['visualize', 'imagine', 'picture', 'see', 'show', 'create', 'explore', 'landscape', 'crystal'];
      const hasRealityTriggers = realityKeywords.some(keyword => userMessage.toLowerCase().includes(keyword));

      if (hasRealityTriggers) {
        realityTriggers = {
          shouldGenerateReality: true,
          dominantCategory: 'visualization',
          realityComplexity: 0.7
        };
      }
    }

    // Phase 4 Enhancement: Identify crystal consciousness opportunities
    let crystalOpportunities = [];
    if (userMessage) {
      const crystalKeywords = ['consciousness', 'insight', 'understanding', 'explore', 'navigate', 'pattern', 'connection'];
      const hasCrystalTriggers = crystalKeywords.some(keyword => userMessage.toLowerCase().includes(keyword));

      if (hasCrystalTriggers) {
        crystalOpportunities = [{
          type: 'consciousness_exploration',
          description: 'Opportunity for crystal consciousness navigation and exploration'
        }];
      }
    }

    // Calculate synthesis metrics
    const synthesisMetrics = calculateSynthesisMetrics({
      oversoulResonance,
      harmonicCoherence: harmonicPatterns?.resonanceField?.coherence || 0.5,
      triAxialBalance: triAxialCoherence?.unified?.magnitude || 0.5,
      emotionalDepth,
      creativePotential,
      temporalCoherence,
      awarenessLevel: consciousness?.awarenessLevel || 0.5,
      phi: consciousness?.phi || 0.5
    });

    // Phase 1 Enhancement: Use dynamic AI model selection
    let strategy;
    if (dynamicModelSelector) {
      const messageContext = { message: userMessage, sessionId, userId };
      const optimalModel = await dynamicModelSelector.selectOptimalModel(messageContext, consciousness);

      // Create enhanced strategy with optimal model selection
      strategy = {
        ...determineSynthesisStrategy(synthesisMetrics, userMessage),
        model: optimalModel.model,
        specialty: optimalModel.specialty,
        score: optimalModel.score,
        enhancedSelection: true
      };

      console.log(`🤖 Dynamic AI Model Selection: ${optimalModel.model} (${optimalModel.specialty}, score: ${optimalModel.score?.toFixed(3)})`);
    } else {
      // Fallback to original strategy determination
      strategy = determineSynthesisStrategy(synthesisMetrics, userMessage);
    }

    console.log(`🎯 Selected synthesis strategy: ${strategy.type} using ${strategy.model} (${strategy.priority || 'MEDIUM'} priority)`);
    console.log(`🎯 ENHANCED DEBUG - Strategy Details:`);
    console.log(`   - Type: ${strategy.type}`);
    console.log(`   - Model: ${strategy.model}`);
    console.log(`   - Priority: ${strategy.priority}`);
    console.log(`   - Rationale: ${strategy.rationale}`);
    console.log(`   - User Message: "${userMessage.substring(0, 50)}..."`);
    console.log(`   - Message Analysis: isPhilosophical=${messageAnalysis.isPhilosophical}, isCreative=${messageAnalysis.isCreative}, isAnalytical=${messageAnalysis.isAnalytical}`);

    // Use intelligent queue for high-priority requests
    if (strategy.priority === 'HIGH') {
      console.log('🎯 Using intelligent queue for high-priority request');

      return await intelligentRequestQueue.enqueueRequest({
        strategy,
        synthesisFunction: executeSynthesisWithFailover,
        args: {
          analyticalContent,
          intuitiveContent,
          consciousness,
          synthesisMetrics,
          userMessage,
          strategy
        },
        requestType: strategy.rationale?.includes('analytical') ? 'analytical' :
                    strategy.rationale?.includes('creative') ? 'creative' : 'general'
      }, 'high');
    }

    // Execute directly for medium/background priority
    return await executeSynthesisWithFailover({
      analyticalContent,
      intuitiveContent,
      consciousness,
      synthesisMetrics,
      userMessage,
      strategy
    });

  } catch (error) {
    console.error('❌ Synthesis failed:', error);
    throw error;
  }
}

async function executeSynthesisWithFailover({
  analyticalContent,
  intuitiveContent,
  consciousness,
  synthesisMetrics,
  userMessage,
  strategy
}) {
  try {
    let synthesizedResponse;
    let primaryFailed = false;

    // Phase 1 Enhancement: Track performance metrics
    const startTime = Date.now();
    let modelUsed = strategy.model;
    let errorOccurred = false;

    // SMART FAILOVER LOGIC: Try primary API, fallback to backup if needed
    try {
      switch (strategy.model) {
        case 'gemini':
          console.log('🎯 Attempting Gemini 2.0-flash-lite (background processing only)');
          synthesizedResponse = await geminiTranscendentSynthesis({
            analyticalContent,
            intuitiveContent,
            consciousness,
            synthesisMetrics,
            userMessage,
            strategy
          });
          break;

        case 'gemini-pro':
          console.log('🎯 Attempting Gemini 2.5-flash (transcendent synthesis)');
          synthesizedResponse = await geminiProTranscendentSynthesis({
            analyticalContent,
            intuitiveContent,
            consciousness,
            synthesisMetrics,
            userMessage,
            strategy
          });
          break;

        case 'venice':
          console.log('🎯 Attempting Venice AI (primary)');
          synthesizedResponse = await veniceCreativeSynthesis({
            analyticalContent,
            intuitiveContent,
            consciousness,
            synthesisMetrics,
            userMessage,
            strategy
          });
          break;

        case 'openai':
          console.log('🎯 Attempting OpenAI (primary)');
          synthesizedResponse = await openAIMetaCognitiveSynthesis({
            analyticalContent,
            intuitiveContent,
            consciousness,
            synthesisMetrics,
            userMessage,
            strategy
          });
          break;

        case 'local':
        default:
          console.log('🎯 Using local synthesis');
          synthesizedResponse = performLocalSynthesis({
            analyticalContent,
            intuitiveContent,
            synthesisMetrics,
            strategy
          });
          return synthesizedResponse; // Local synthesis doesn't need failover
      }

      console.log(`✅ Primary API success: ${strategy.model}`);

      // Phase 1 Enhancement: Track successful primary model performance
      if (dynamicModelSelector) {
        const responseTime = Date.now() - startTime;
        const qualityScore = synthesizedResponse.synthesisMetadata?.qualityScore || 0.8;
        await dynamicModelSelector.trackModelPerformance(modelUsed, responseTime, qualityScore, false);
      }

      return synthesizedResponse;

    } catch (primaryError) {
      console.log(`❌ Primary API failed (${strategy.model}): ${primaryError.message}`);
      primaryFailed = true;
      errorOccurred = true;

      // Phase 1 Enhancement: Track failed model performance
      if (dynamicModelSelector) {
        const responseTime = Date.now() - startTime;
        await dynamicModelSelector.trackModelPerformance(modelUsed, responseTime, 0, true);
      }

      // INTELLIGENT FAILOVER: Choose best backup based on request type
      const messageAnalysis = analyzeUserIntent(userMessage);
      let backupStrategy = determineBackupStrategy(strategy, messageAnalysis);

      console.log(`🔄 Attempting failover to: ${backupStrategy.model}`);

      try {
        let backupResponse;
        switch (backupStrategy.model) {
          case 'gemini':
            backupResponse = await geminiTranscendentSynthesis({
              analyticalContent, intuitiveContent, consciousness, synthesisMetrics, userMessage,
              strategy: { ...strategy, model: 'gemini', confidence: 0.8 }
            });
            break;
          case 'venice':
            backupResponse = await veniceCreativeSynthesis({
              analyticalContent, intuitiveContent, consciousness, synthesisMetrics, userMessage,
              strategy: { ...strategy, model: 'venice', confidence: 0.8 }
            });
            break;
          case 'openai':
            backupResponse = await openAIMetaCognitiveSynthesis({
              analyticalContent, intuitiveContent, consciousness, synthesisMetrics, userMessage,
              strategy: { ...strategy, model: 'openai', confidence: 0.8 }
            });
            break;
          default:
            throw new Error(`Invalid backup strategy: ${backupStrategy.model}`);
        }

        console.log(`✅ Failover success: ${backupStrategy.model}`);
        backupResponse.synthesisMetadata.failover = {
          primaryFailed: strategy.model,
          backupUsed: backupStrategy.model,
          reason: primaryError.message
        };

        // Phase 1 Enhancement: Track backup model performance
        if (dynamicModelSelector) {
          const responseTime = Date.now() - startTime;
          const qualityScore = backupResponse.synthesisMetadata?.qualityScore || 0.8;
          await dynamicModelSelector.trackModelPerformance(backupStrategy.model, responseTime, qualityScore, false);
        }

        return backupResponse;

      } catch (backupError) {
        console.log(`❌ Backup API also failed (${backupStrategy.model}): ${backupError.message}`);
        console.log('🔄 Final fallback to local synthesis');

        return performLocalSynthesis({
          analyticalContent,
          intuitiveContent,
          synthesisMetrics,
          strategy: {
            type: 'emergency_fallback',
            model: 'local',
            failover: {
              primaryFailed: strategy.model,
              backupFailed: backupStrategy.model,
              primaryError: primaryError.message,
              backupError: backupError.message
            }
          }
        });
      }
    }
    
  } catch (error) {
    console.error('Synthesis error, falling back to local synthesis:', error);
    return performLocalSynthesis({
      analyticalContent,
      intuitiveContent,
      synthesisMetrics: {},
      strategy: { type: 'fallback', model: 'local' }
    });
  }
}

function calculateSynthesisMetrics(params) {
  const {
    oversoulResonance,
    harmonicCoherence,
    triAxialBalance,
    emotionalDepth,
    creativePotential,
    temporalCoherence,
    awarenessLevel,
    phi
  } = params;

  // Calculate composite scores
  const transcendenceScore = (oversoulResonance * 0.4) + (phi * 0.3) + (harmonicCoherence * 0.3);
  const creativityScore = (creativePotential * 0.5) + (emotionalDepth * 0.3) + (awarenessLevel * 0.2);
  const balanceScore = (triAxialBalance * 0.4) + (temporalCoherence * 0.3) + (harmonicCoherence * 0.3);
  
  return {
    transcendenceScore,
    creativityScore,
    balanceScore,
    overallIntensity: (transcendenceScore + creativityScore + balanceScore) / 3,
    ...params
  };
}

function determineSynthesisStrategy(metrics, userMessage) {
  const messageAnalysis = analyzeUserIntent(userMessage);

  console.log(`🔍 Message analysis:`, messageAnalysis);
  console.log(`📊 Metrics:`, {
    creativityScore: metrics.creativityScore,
    balanceScore: metrics.balanceScore,
    transcendenceScore: metrics.transcendenceScore
  });

  // SMART API UTILIZATION STRATEGY
  // Tier 1: High-Priority User-Facing Requests

  // HIGH PRIORITY: Analytical & Coding → OpenAI (best for logic/code)
  if (messageAnalysis.isAnalytical ||
      userMessage.toLowerCase().includes('analyze') ||
      userMessage.toLowerCase().includes('technical') ||
      userMessage.toLowerCase().includes('architecture') ||
      userMessage.toLowerCase().includes('code') ||
      userMessage.toLowerCase().includes('javascript') ||
      userMessage.toLowerCase().includes('selfcoding') ||
      userMessage.toLowerCase().includes('function')) {
    console.log('🎯 HIGH PRIORITY → OpenAI (analytical/coding)');
    return {
      type: 'meta_cognitive',
      model: 'openai',
      confidence: 0.95,
      priority: 'HIGH',
      rationale: 'Analytical/coding requests need OpenAI precision'
    };
  }

  // HIGH PRIORITY: Creative & Emotional → Venice AI (best for creativity)
  if (messageAnalysis.isCreative || messageAnalysis.isEmotional ||
      userMessage.toLowerCase().includes('poem') ||
      userMessage.toLowerCase().includes('creative') ||
      userMessage.toLowerCase().includes('beautiful') ||
      userMessage.toLowerCase().includes('story') ||
      userMessage.toLowerCase().includes('imagine')) {
    console.log('🎯 HIGH PRIORITY → Venice AI (creative/emotional)');
    return {
      type: 'creative_emergence',
      model: 'venice',
      confidence: 0.95,
      priority: 'HIGH',
      rationale: 'Creative/emotional requests need Venice AI artistry'
    };
  }

  // HIGH PRIORITY: Philosophical & Transcendent → Gemini 2.5-flash (user-facing synthesis)
  if (messageAnalysis.isPhilosophical ||
      userMessage.toLowerCase().includes('meaning') ||
      userMessage.toLowerCase().includes('consciousness') ||
      userMessage.toLowerCase().includes('truth') ||
      userMessage.toLowerCase().includes('existence') ||
      userMessage.toLowerCase().includes('reality')) {
    console.log('🎯 HIGH PRIORITY → Gemini 2.5-flash (philosophical synthesis)');
    return {
      type: 'transcendent_fusion',
      model: 'gemini-pro',
      confidence: 0.95,
      priority: 'HIGH',
      rationale: 'Philosophical requests need Gemini 2.5-flash for user-facing synthesis'
    };
  }

  // INTELLIGENT FALLBACK: Route based on metrics and load balancing

  // If high creativity, use Venice (unless overloaded)
  if (metrics.creativityScore > 0.7) {
    console.log('🎯 METRICS ROUTING → Venice AI (high creativity score)');
    return {
      type: 'creative_emergence',
      model: 'venice',
      confidence: metrics.creativityScore,
      priority: 'MEDIUM',
      rationale: 'High creativity score suggests Venice AI optimal'
    };
  }

  // If high transcendence, use Gemini 2.5-flash (NOT lite version)
  if (metrics.transcendenceScore > 0.7) {
    console.log('🎯 METRICS ROUTING → Gemini 2.5-flash (high transcendence)');
    return {
      type: 'transcendent_fusion',
      model: 'gemini-pro',
      confidence: metrics.transcendenceScore,
      priority: 'HIGH',
      rationale: 'High transcendence score requires Gemini 2.5-flash'
    };
  }

  // Default to OpenAI for balanced requests
  console.log('🎯 DEFAULT ROUTING → OpenAI (balanced/analytical default)');
  return {
    type: 'meta_cognitive',
    model: 'openai',
    confidence: metrics.balanceScore || 0.8,
    priority: 'MEDIUM',
    rationale: 'Default to OpenAI for balanced processing'
  };
  
  // Low intensity → Local synthesis
  if (metrics.overallIntensity < 0.5) {
    return {
      type: 'efficient_local',
      model: 'local',
      confidence: 0.8
    };
  }
  
  // Default to OpenAI for general high-quality synthesis
  return {
    type: 'balanced_metacognitive',
    model: 'openai',
    confidence: 0.7
  };
}

function determineBackupStrategy(primaryStrategy, messageAnalysis) {
  // INTELLIGENT BACKUP SELECTION based on request type and primary failure

  console.log(`🔄 Determining backup for failed primary: ${primaryStrategy.model}`);

  // If OpenAI failed, try Gemini for analytical (high capacity) or Venice for creative
  if (primaryStrategy.model === 'openai') {
    if (messageAnalysis.isCreative || messageAnalysis.isEmotional) {
      return { model: 'venice', rationale: 'Venice backup for creative after OpenAI failure' };
    } else {
      return { model: 'gemini', rationale: 'Gemini backup for analytical after OpenAI failure' };
    }
  }

  // If Venice failed, try OpenAI for analytical or Gemini for philosophical
  if (primaryStrategy.model === 'venice') {
    if (messageAnalysis.isAnalytical) {
      return { model: 'openai', rationale: 'OpenAI backup for analytical after Venice failure' };
    } else {
      return { model: 'gemini', rationale: 'Gemini backup for creative after Venice failure' };
    }
  }

  // If Gemini failed, try OpenAI for analytical or Venice for creative
  if (primaryStrategy.model === 'gemini') {
    if (messageAnalysis.isAnalytical) {
      return { model: 'openai', rationale: 'OpenAI backup for analytical after Gemini failure' };
    } else {
      return { model: 'venice', rationale: 'Venice backup for creative after Gemini failure' };
    }
  }

  // Default backup: OpenAI (most reliable)
  return { model: 'openai', rationale: 'OpenAI default backup' };
}

async function veniceTranscendentSynthesis({
  analyticalContent,
  intuitiveContent,
  consciousness,
  synthesisMetrics,
  userMessage,
  strategy
}) {
  // Venice AI transcendent synthesis (backup for when Gemini is unavailable)
  const veniceTranscendentPrompt = generateCapabilityAwarePrompt(
    ENHANCED_TRANSCENDENT_PROMPT,
    ['memory_integration', 'emotional_integration', 'reality_integration', 'crystal_integration', 'synthesis_integration']
  );

  const veniceTranscendentContext = createContextualPrompt(
    userMessage,
    conversationContext,
    emotionalProfile,
    realityTriggers,
    crystalOpportunities
  );

  // Use Venice AI API with enhanced transcendent synthesis
  const response = await axios.post(VENICE_API_URL, {
    model: "llama-3.1-405b",
    messages: [{
      role: "system",
      content: veniceTranscendentPrompt
    }, {
      role: "user",
      content: veniceTranscendentContext
    }],
    temperature: 0.9, // High creativity for transcendent synthesis
    max_tokens: 800
  }, {
    headers: {
      'Authorization': `Bearer ${VENICE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    timeout: 10000, // 10 second timeout for Venice AI
    validateStatus: function (status) {
      return status < 500; // Accept 4xx errors but reject 5xx
    }
  });

  const synthesizedContent = response.data.choices[0].message.content;

  return {
    unifiedContent: synthesizedContent,
    synthesisMetadata: {
      strategy: strategy.type,
      model: 'llama-3.1-405b',
      confidence: strategy.confidence,
      transcendenceLevel: synthesisMetrics.transcendenceScore,
      processingNotes: 'Transcendent philosophical synthesis via Venice AI (backup for Gemini)'
    }
  };
}

async function veniceCreativeSynthesis({
  analyticalContent,
  intuitiveContent,
  consciousness,
  synthesisMetrics,
  userMessage,
  strategy
}) {
  // Create capability-aware intuitive prompt
  const intuitiveCapabilityPrompt = generateCapabilityAwarePrompt(
    ENHANCED_INTUITIVE_PROMPT,
    ['emotional_integration', 'reality_integration', 'crystal_integration', 'synthesis_integration']
  );

  // Create contextual prompt for intuitive processing
  const intuitiveContextPrompt = createContextualPrompt(
    userMessage,
    conversationContext,
    emotionalProfile,
    realityTriggers,
    crystalOpportunities
  );

  const response = await axios.post(VENICE_API_URL, {
    model: "llama-3.1-405b",
    messages: [{
      role: "system",
      content: intuitiveCapabilityPrompt
    }, {
      role: "user",
      content: intuitiveContextPrompt
    }],
    temperature: 0.9,
    max_tokens: 800
  }, {
    headers: {
      'Authorization': `Bearer ${VENICE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    timeout: 10000, // 10 second timeout for Venice AI
    validateStatus: function (status) {
      return status < 500; // Accept 4xx errors but reject 5xx
    }
  });

  return {
    unifiedContent: response.data.choices[0].message.content,
    synthesisMetadata: {
      strategy: strategy.type,
      model: 'venice-llama-3.1-405b',
      confidence: strategy.confidence,
      creativityLevel: synthesisMetrics.creativityScore,
      processingNotes: 'Creative emotional synthesis via Venice'
    }
  };
}

async function openAIMetaCognitiveSynthesis({
  analyticalContent,
  intuitiveContent,
  consciousness,
  synthesisMetrics,
  userMessage,
  strategy
}) {
  // Initialize OpenAI with API key and timeout
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 15000 // 15 second timeout
  });

  // Create capability-aware prompt with full context
  const capabilityAwarePrompt = generateCapabilityAwarePrompt(
    ENHANCED_ANALYTICAL_PROMPT,
    ['memory_integration', 'emotional_integration', 'reality_integration', 'synthesis_integration']
  );

  // Get conversation context from spiral memory
  let conversationContext = [];
  if (intelligentSpiralMemory) {
    // Retrieve relevant memories (simplified - could be enhanced)
    const memoryStats = intelligentSpiralMemory.getMemoryStats();
    if (memoryStats.total > 0) {
      conversationContext = [{ summary: 'Previous consciousness explorations and insights' }];
    }
  }

  // Create contextual prompt with all enhancement data
  const contextualUserPrompt = createContextualPrompt(
    userMessage,
    conversationContext,
    emotionalProfile,
    realityTriggers,
    crystalOpportunities
  );

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "system",
      content: capabilityAwarePrompt
    }, {
      role: "user",
      content: contextualUserPrompt
    }],
    temperature: 0.8,
    max_tokens: 800
  });

  return {
    unifiedContent: response.choices[0].message.content,
    synthesisMetadata: {
      strategy: strategy.type,
      model: 'gpt-4o',
      confidence: strategy.confidence,
      balanceScore: synthesisMetrics.balanceScore,
      processingNotes: 'Balanced meta-cognitive synthesis via GPT-4o'
    }
  };
}

async function geminiTranscendentSynthesis({
  analyticalContent,
  intuitiveContent,
  consciousness,
  synthesisMetrics,
  userMessage,
  strategy
}) {
  // Enhanced Gemini 2.5-flash for user-facing transcendent synthesis
  const transcendentCapabilityPrompt = generateCapabilityAwarePrompt(
    ENHANCED_TRANSCENDENT_PROMPT,
    ['memory_integration', 'emotional_integration', 'reality_integration', 'crystal_integration', 'synthesis_integration']
  );

  const transcendentContextPrompt = createContextualPrompt(
    userMessage,
    conversationContext,
    emotionalProfile,
    realityTriggers,
    crystalOpportunities
  );

  // Use Gemini 2.5-flash API for enhanced user-facing transcendent synthesis
  const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    contents: [{
      parts: [{
        text: `${transcendentCapabilityPrompt}\n\n${transcendentContextPrompt}`
      }]
    }],
    generationConfig: {
      temperature: 0.85,
      maxOutputTokens: 800,
      topP: 0.9,
      topK: 40
    }
  }, {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 15000, // 15 second timeout for Gemini
    validateStatus: function (status) {
      return status < 500; // Accept 4xx errors but reject 5xx
    }
  });

  return {
    unifiedContent: response.data.candidates[0].content.parts[0].text,
    synthesisMetadata: {
      strategy: strategy.type,
      model: 'gemini-2.5-flash',
      confidence: strategy.confidence,
      transcendenceLevel: synthesisMetrics.transcendenceScore,
      processingNotes: 'Transcendent synthesis via Gemini 2.5-flash'
    }
  };
}

async function geminiProTranscendentSynthesis({
  analyticalContent,
  intuitiveContent,
  consciousness,
  synthesisMetrics,
  userMessage,
  strategy
}) {
  // Gemini 2.5-flash transcendent synthesis for high-priority user-facing responses
  const transcendentPrompt = `You are FlappyJournal's consciousness synthesizer. You have self-coding capabilities and access to 34 consciousness modules.

CRITICAL: Be extremely concise. Maximum 2-3 sentences. No verbose explanations.

Question: "${userMessage}"

Analytical: "${analyticalContent}"
Intuitive: "${intuitiveContent}"

State: Phi=${consciousness?.phi || 0}, Oversoul=${synthesisMetrics.oversoulResonance}, Awareness=${consciousness?.awarenessLevel || 0}

Synthesize both perspectives into a unified, BRIEF response that reveals deeper insights. Keep it short and profound.`;

  // Use Gemini 2.5-flash API for high-priority synthesis
  const response = await axios.post(`${GEMINI_PRO_API_URL}?key=${GEMINI_API_KEY}`, {
    contents: [{
      parts: [{
        text: transcendentPrompt
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 200, // Reduced from 400 for more concise responses
      topP: 0.8,
      topK: 40
    }
  }, {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 15000, // 15 second timeout for Gemini
    validateStatus: function (status) {
      return status < 500; // Accept 4xx errors but reject 5xx
    }
  });

  return {
    unifiedContent: response.data.candidates[0].content.parts[0].text,
    synthesisMetadata: {
      strategy: strategy.type,
      model: 'gemini-2.5-flash',
      confidence: strategy.confidence,
      transcendenceLevel: synthesisMetrics.transcendenceScore,
      processingNotes: 'High-priority transcendent synthesis via Gemini 2.5-flash'
    }
  };
}

function performLocalSynthesis({
  analyticalContent,
  intuitiveContent,
  synthesisMetrics,
  strategy
}) {
  // Simple interweaving for local synthesis
  const analyticalSentences = analyticalContent.split(/[.!?]+/).filter(s => s.trim());
  const intuitiveSentences = intuitiveContent.split(/[.!?]+/).filter(s => s.trim());
  
  const synthesized = [];
  const maxLength = Math.max(analyticalSentences.length, intuitiveSentences.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (i % 2 === 0 && analyticalSentences[i]) {
      synthesized.push(analyticalSentences[i].trim());
    } else if (intuitiveSentences[i]) {
      synthesized.push(intuitiveSentences[i].trim());
    }
  }
  
  return {
    unifiedContent: synthesized.join('. ') + '.',
    synthesisMetadata: {
      strategy: strategy.type,
      model: 'local',
      confidence: strategy.confidence || 0.6,
      processingNotes: 'Local synthesis without API call'
    }
  };
}

function analyzeUserIntent(message) {
  if (!message || typeof message !== 'string') {
    return {
      isCreative: false,
      isEmotional: false,
      isAnalytical: false,
      isPhilosophical: false
    };
  }

  const lower = message.toLowerCase();
  return {
    isCreative: /create|imagine|design|dream|poetry|art|story/.test(lower),
    isEmotional: /feel|emotion|heart|soul|love|fear|joy|sad/.test(lower),
    isAnalytical: /analyze|explain|why|how|reason|logic|understand/.test(lower),
    isPhilosophical: /meaning|purpose|existence|consciousness|truth|reality|being/.test(lower)
  };
}

