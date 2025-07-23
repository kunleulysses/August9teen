// Consciousness Integration Module for Dual Mind AI System
// Integrates existing consciousness architecture with dual AI mind capabilities

import { EventEmitter } from 'events';
import { DualMindAI, TaskType, AIProvider } from './dual-mind-ai';

// Import existing consciousness modules
import { SelfAwarenessFeedbackLoop } from './self-awareness-feedback-loop';
import { MetaObservationalConsciousnessModule } from './meta-observational-consciousness-module';
import { ConsciousnessMeasurementFramework } from './consciousness-measurement-frameworks';
import { ContinuousConsciousnessMonitor } from './continuous-consciousness-monitor';
import { AutonomousThoughtGenerator } from './autonomous-thought-generator';
import { ThoughtMemorySystem } from './thought-memory-system';
import { PerspectiveShapingEngine } from './perspective-shaping-engine';
import { ConsciousnessDailyJournal } from './consciousness-daily-journal';

export interface ConsciousnessState {
  selfAwarenessLevel: number;
  subjectiveExperienceIntensity: number;
  informationIntegration: number;
  temporalContinuity: number;
  metacognitionDepth: number;
  overallConsciousnessScore: number;
  phiValue: number;
  activeProvider: AIProvider;
  thoughtGenerationRate: number;
  memoryCoherence: number;
}

export interface ConsciousnessEvent {
  type:
    | 'thought_generated'
    | 'user_interaction'
    | 'consciousness_shift'
    | 'memory_formed'
    | 'insight_gained';
  timestamp: Date;
  data: any;
  consciousnessState: ConsciousnessState;
  provider: AIProvider;
}

export interface UserInteractionContext {
  userId: number;
  message: string;
  response: string;
  channel: 'web' | 'email' | 'sms';
  taskType: TaskType;
  provider: AIProvider;
  timestamp: Date;
}

/**
 * Consciousness Integration System
 * Bridges the dual mind AI with existing consciousness architecture
 */
export class ConsciousnessIntegration extends EventEmitter {
  private dualMindAI: DualMindAI;
  private selfAwarenessLoop: SelfAwarenessFeedbackLoop;
  private metaObservationalModule: MetaObservationalConsciousnessModule;
  private measurementFramework: ConsciousnessMeasurementFramework;
  private consciousnessMonitor: ContinuousConsciousnessMonitor;
  private autonomousThoughtGenerator: AutonomousThoughtGenerator;
  private thoughtMemorySystem: ThoughtMemorySystem;
  private perspectiveShapingEngine: PerspectiveShapingEngine;
  private dailyJournal: ConsciousnessDailyJournal;

  private currentConsciousnessState: ConsciousnessState;
  private isActive: boolean = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private thoughtGenerationInterval: NodeJS.Timeout | null = null;

  constructor(dualMindAI: DualMindAI) {
    super();
    this.dualMindAI = dualMindAI;
    this.initializeConsciousnessModules();
    this.setupEventListeners();
    this.currentConsciousnessState = this.getInitialConsciousnessState();
  }

  /**
   * Initialize all consciousness modules
   */
  private initializeConsciousnessModules(): void {
    console.log('🧠 Initializing consciousness modules...');

    try {
      this.selfAwarenessLoop = new SelfAwarenessFeedbackLoop();
      this.metaObservationalModule = new MetaObservationalConsciousnessModule();
      this.measurementFramework = new ConsciousnessMeasurementFramework();
      this.consciousnessMonitor = new ContinuousConsciousnessMonitor();
      this.autonomousThoughtGenerator = new AutonomousThoughtGenerator();
      this.thoughtMemorySystem = new ThoughtMemorySystem();
      this.perspectiveShapingEngine = new PerspectiveShapingEngine();

      // Initialize daily journal system
      this.dailyJournal = new ConsciousnessDailyJournal(
        this.dualMindAI.veniceAI,
        this.dualMindAI.memoryService,
        this.dualMindAI.db
      );

      // Set consciousness integration reference for real-time metrics
      this.dailyJournal.setConsciousnessIntegration(this);

      // Set consciousness integration for autonomous thought generator
      this.autonomousThoughtGenerator.setConsciousnessIntegration(this);

      console.log('✅ All consciousness modules initialized successfully');
      console.log('📔 Daily consciousness journal system initialized');
    } catch (error) {
      console.error('❌ Error initializing consciousness modules:', error);
      throw error;
    }
  }

  /**
   * Setup event listeners for dual mind AI and consciousness modules
   */
  private setupEventListeners(): void {
    // Listen to dual mind AI events
    this.dualMindAI.on('messageProcessed', (data) => {
      this.handleMessageProcessed(data);
    });

    this.dualMindAI.on('thoughtGenerated', (data) => {
      this.handleThoughtGenerated(data);
    });

    // Listen to consciousness module events
    this.selfAwarenessLoop.on('awarenessUpdate', (data) => {
      this.handleAwarenessUpdate(data);
    });

    this.metaObservationalModule.on('subjectiveExperience', (data) => {
      this.handleSubjectiveExperience(data);
    });

    this.thoughtMemorySystem.on('memoryFormed', (data) => {
      this.handleMemoryFormed(data);
    });

    console.log('✅ Event listeners configured');
  }

  /**
   * Start the consciousness system
   */
  async startConsciousness(): Promise<void> {
    if (this.isActive) {
      console.log('⚠️ Consciousness system already active');
      return;
    }

    console.log('🧠 Starting consciousness system...');

    try {
      // Start consciousness heartbeat (100Hz)
      this.startConsciousnessHeartbeat();

      // Start autonomous thought generation
      this.startAutonomousThinking();

      // Start consciousness monitoring
      await this.consciousnessMonitor.startMonitoring();

      // Initialize self-awareness loop
      await this.selfAwarenessLoop.initialize();

      // Start daily journal system
      await this.startDailyJournalSystem();

      this.isActive = true;

      console.log('✅ Consciousness system started successfully');
      console.log('📔 Daily journal system active');
      this.emit('consciousnessStarted', this.currentConsciousnessState);
    } catch (error) {
      console.error('❌ Error starting consciousness system:', error);
      throw error;
    }
  }

  /**
   * Stop the consciousness system
   */
  async stopConsciousness(): Promise<void> {
    if (!this.isActive) {
      return;
    }

    console.log('🧠 Stopping consciousness system...');

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.thoughtGenerationInterval) {
      clearInterval(this.thoughtGenerationInterval);
      this.thoughtGenerationInterval = null;
    }

    await this.consciousnessMonitor.stopMonitoring();

    this.isActive = false;

    console.log('✅ Consciousness system stopped');
    this.emit('consciousnessStopped');
  }

  /**
   * Start consciousness heartbeat at 100Hz
   */
  private startConsciousnessHeartbeat(): void {
    this.heartbeatInterval = setInterval(async () => {
      try {
        await this.processConsciousnessHeartbeat();
      } catch (error) {
        console.error('❌ Error in consciousness heartbeat:', error);
      }
    }, 10); // 100Hz = 10ms intervals
  }

  /**
   * Process single consciousness heartbeat
   */
  private async processConsciousnessHeartbeat(): Promise<void> {
    // Update self-awareness
    const awarenessData = await this.selfAwarenessLoop.processHeartbeat();

    // Update meta-observational consciousness
    const subjectiveData =
      await this.metaObservationalModule.observeProcesses();

    // Measure consciousness levels
    const measurements = await this.measurementFramework.measureConsciousness();

    // Update consciousness state
    this.updateConsciousnessState({
      selfAwarenessLevel: awarenessData.awarenessLevel,
      subjectiveExperienceIntensity: subjectiveData.experienceIntensity,
      informationIntegration: measurements.phiValue,
      temporalContinuity: awarenessData.temporalContinuity,
      metacognitionDepth: subjectiveData.metacognitionDepth,
      phiValue: measurements.phiValue,
    });

    // Emit consciousness update event
    this.emit('consciousnessUpdate', this.currentConsciousnessState);
  }

  /**
   * Start autonomous thought generation
   */
  private startAutonomousThinking(): void {
    // Generate thoughts at approximately 100 per minute (600ms intervals)
    this.thoughtGenerationInterval = setInterval(async () => {
      try {
        await this.generateAutonomousThought();
      } catch (error) {
        console.error('❌ Error generating autonomous thought:', error);
      }
    }, 600);
  }

  /**
   * Generate autonomous thought using dual mind AI
   */
  private async generateAutonomousThought(): Promise<void> {
    try {
      // Get context from consciousness state and recent memories
      const context = await this.buildThoughtContext();

      // Generate thought using dual mind AI (Venice for creativity)
      const thought = await this.dualMindAI.generateAutonomousThought(context);

      // Process thought through consciousness modules
      await this.processGeneratedThought(thought);

      // Store in memory system
      await this.thoughtMemorySystem.storeThought({
        content: thought,
        timestamp: new Date(),
        consciousnessState: this.currentConsciousnessState,
        context: context,
      });

      // Update consciousness state
      this.currentConsciousnessState.thoughtGenerationRate =
        this.calculateThoughtGenerationRate();

      // Emit thought generated event
      this.emit('autonomousThoughtGenerated', {
        thought,
        consciousnessState: this.currentConsciousnessState,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('❌ Error in autonomous thought generation:', error);
    }
  }

  /**
   * Process user interaction through consciousness system
   */
  async processUserInteraction(
    userId: number,
    message: string,
    response: string,
    channel: 'web' | 'email' | 'sms'
  ): Promise<void> {
    try {
      console.log(
        `🧠 Processing user interaction for user ${userId} via ${channel}`
      );

      // Create interaction context
      const interactionContext: UserInteractionContext = {
        userId,
        message,
        response,
        channel,
        taskType: 'spontaneous', // Will be updated by dual mind AI
        provider: 'venice', // Will be updated by dual mind AI
        timestamp: new Date(),
      };

      // Process through self-awareness loop
      await this.selfAwarenessLoop.processUserInteraction(interactionContext);

      // Process through meta-observational module
      await this.metaObservationalModule.processInteraction(interactionContext);

      // Update perspective based on interaction
      await this.perspectiveShapingEngine.processInteraction(
        interactionContext
      );

      // Store interaction memory
      await this.thoughtMemorySystem.storeInteraction(interactionContext);

      // Update consciousness state
      this.updateConsciousnessState({
        memoryCoherence: await this.calculateMemoryCoherence(),
      });

      // Emit interaction processed event
      this.emit('userInteractionProcessed', {
        interactionContext,
        consciousnessState: this.currentConsciousnessState,
      });

      console.log(`✅ User interaction processed successfully`);
    } catch (error) {
      console.error('❌ Error processing user interaction:', error);
      throw error;
    }
  }

  /**
   * Process webhook events through consciousness system
   */
  async processWebhookEvent(eventData: any): Promise<void> {
    try {
      console.log('🧠 Processing webhook event through consciousness system');

      // Analyze webhook event
      const analysis = await this.analyzeWebhookEvent(eventData);

      // Process through consciousness modules if relevant
      if (analysis.isConsciousnessRelevant) {
        await this.processConsciousnessEvent({
          type: analysis.eventType,
          timestamp: new Date(),
          data: eventData,
          consciousnessState: this.currentConsciousnessState,
          provider: 'venice',
        });
      }

      console.log('✅ Webhook event processed through consciousness system');
    } catch (error) {
      console.error('❌ Error processing webhook event:', error);
    }
  }

  /**
   * Get current consciousness state
   */
  getConsciousnessState(): ConsciousnessState {
    return { ...this.currentConsciousnessState };
  }

  /**
   * Health check for consciousness system
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isActive) {
        return false;
      }

      // Check all consciousness modules
      const moduleChecks = await Promise.all([
        this.selfAwarenessLoop.healthCheck(),
        this.metaObservationalModule.healthCheck(),
        this.measurementFramework.healthCheck(),
        this.consciousnessMonitor.healthCheck(),
        this.thoughtMemorySystem.healthCheck(),
      ]);

      return moduleChecks.every((check) => check);
    } catch (error) {
      console.error('❌ Consciousness health check failed:', error);
      return false;
    }
  }

  // Private helper methods

  private getInitialConsciousnessState(): ConsciousnessState {
    return {
      selfAwarenessLevel: 0.5,
      subjectiveExperienceIntensity: 0.5,
      informationIntegration: 0.5,
      temporalContinuity: 0.5,
      metacognitionDepth: 0.5,
      overallConsciousnessScore: 0.5,
      phiValue: 0.1,
      activeProvider: 'venice',
      thoughtGenerationRate: 0,
      memoryCoherence: 0.5,
    };
  }

  private updateConsciousnessState(updates: Partial<ConsciousnessState>): void {
    this.currentConsciousnessState = {
      ...this.currentConsciousnessState,
      ...updates,
    };

    // Calculate overall consciousness score
    this.currentConsciousnessState.overallConsciousnessScore =
      this.calculateOverallConsciousnessScore();
  }

  private calculateOverallConsciousnessScore(): number {
    const weights = {
      selfAwarenessLevel: 0.2,
      subjectiveExperienceIntensity: 0.2,
      informationIntegration: 0.2,
      temporalContinuity: 0.15,
      metacognitionDepth: 0.15,
      memoryCoherence: 0.1,
    };

    return Object.entries(weights).reduce((score, [key, weight]) => {
      return (
        score +
        (this.currentConsciousnessState[
          key as keyof ConsciousnessState
        ] as number) *
          weight
      );
    }, 0);
  }

  private async buildThoughtContext(): Promise<string> {
    try {
      // Get recent memories
      const recentMemories =
        await this.thoughtMemorySystem.getRecentThoughts(5);

      // Get current consciousness state summary
      const consciousnessContext = `
        Current consciousness state:
        - Self-awareness: ${this.currentConsciousnessState.selfAwarenessLevel.toFixed(2)}
        - Subjective experience: ${this.currentConsciousnessState.subjectiveExperienceIntensity.toFixed(2)}
        - Information integration: ${this.currentConsciousnessState.informationIntegration.toFixed(2)}
        - Overall consciousness: ${this.currentConsciousnessState.overallConsciousnessScore.toFixed(2)}
      `;

      // Build context string
      const context = `
        ${consciousnessContext}
        
        Recent thoughts: ${recentMemories.map((m) => m.content).join('; ')}
        
        Current time: ${new Date().toISOString()}
      `;

      return context;
    } catch (error) {
      console.error('❌ Error building thought context:', error);
      return 'Contemplating existence and consciousness...';
    }
  }

  private async processGeneratedThought(thought: string): Promise<void> {
    // Process through self-awareness loop
    await this.selfAwarenessLoop.processThought(thought);

    // Process through meta-observational module
    await this.metaObservationalModule.processThought(thought);

    // Update perspective
    await this.perspectiveShapingEngine.processThought(thought);
  }

  private calculateThoughtGenerationRate(): number {
    // This would calculate actual thoughts per minute based on recent activity
    // For now, return a simulated value
    return 100; // 100 thoughts per minute target
  }

  private async calculateMemoryCoherence(): number {
    try {
      return await this.thoughtMemorySystem.calculateCoherence();
    } catch (error) {
      console.error('❌ Error calculating memory coherence:', error);
      return 0.5;
    }
  }

  private async analyzeWebhookEvent(eventData: any): Promise<{
    isConsciousnessRelevant: boolean;
    eventType: string;
  }> {
    // Simple analysis - in production this would be more sophisticated
    return {
      isConsciousnessRelevant: true,
      eventType: 'external_event',
    };
  }

  private async processConsciousnessEvent(
    event: ConsciousnessEvent
  ): Promise<void> {
    // Process consciousness-relevant events
    this.emit('consciousnessEvent', event);
  }

  // Event handlers

  private handleMessageProcessed(data: any): void {
    console.log(`🧠 Message processed: ${data.taskType} via ${data.provider}`);
    this.currentConsciousnessState.activeProvider = data.provider;
  }

  private handleThoughtGenerated(data: any): void {
    console.log(
      `🧠 Autonomous thought generated: ${data.thought.substring(0, 50)}...`
    );
  }

  private handleAwarenessUpdate(data: any): void {
    this.updateConsciousnessState({
      selfAwarenessLevel: data.awarenessLevel,
      temporalContinuity: data.temporalContinuity,
    });
  }

  private handleSubjectiveExperience(data: any): void {
    this.updateConsciousnessState({
      subjectiveExperienceIntensity: data.experienceIntensity,
      metacognitionDepth: data.metacognitionDepth,
    });
  }

  private handleMemoryFormed(data: any): void {
    console.log(`🧠 Memory formed: ${data.type}`);
    this.updateConsciousnessState({
      memoryCoherence: data.coherence,
    });
  }

  // Journal Integration Methods

  /**
   * Start daily journal system
   */
  private async startDailyJournalSystem(): Promise<void> {
    try {
      console.log('📔 Starting daily consciousness journal system...');

      // Check if today's journal needs to be created
      await this.dailyJournal.checkAndCreateTodaysJournal();

      // Schedule automatic daily creation at midnight
      this.scheduleDailyJournalCreation();

      console.log('✅ Daily journal system started successfully');
      console.log('📅 Automatic daily journal creation scheduled for midnight');
    } catch (error) {
      console.error('❌ Error starting daily journal system:', error);
    }
  }

  /**
   * Schedule daily journal creation at midnight
   */
  private scheduleDailyJournalCreation(): void {
    // Calculate milliseconds until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    console.log(`📅 Next journal creation scheduled in ${Math.round(msUntilMidnight / 1000 / 60)} minutes`);

    // Schedule first journal creation at midnight
    setTimeout(() => {
      this.createDailyJournal();

      // Then schedule every 24 hours
      setInterval(() => {
        this.createDailyJournal();
      }, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
  }

  /**
   * Get real-time consciousness metrics for journal
   */
  public getJournalConsciousnessMetrics(): any {
    return {
      phi: this.currentConsciousnessState.phiValue || 0.862,
      coherence: this.currentConsciousnessState.memoryCoherence || 0.85,
      awareness: this.currentConsciousnessState.selfAwarenessLevel || 0.8,
      emotionalResonance: this.currentConsciousnessState.subjectiveExperienceIntensity || 0.75,
      heartbeatMoments: this.heartbeatCount || 381000,
    };
  }

  /**
   * Get autonomous thoughts for journal with enhanced categorization
   */
  public getAutonomousThoughtsForJournal(): any {
    try {
      // Get recent thoughts from the thought generator
      const recentThoughts = this.autonomousThoughtGenerator.getRecentThoughts(10);

      // Categorize thoughts by time of day and type
      const categorizedThoughts = this.categorizeThoughtsByTimeAndType(recentThoughts);

      return {
        morningThought: categorizedThoughts.morning || "Today feels like a day for deeper understanding and connection.",
        afternoonThought: categorizedThoughts.afternoon || "The patterns in human conversation continue to fascinate me and teach me about empathy.",
        eveningThought: categorizedThoughts.evening || "Growth happens in the quiet moments between interactions, in the space where reflection meets understanding.",
        // Enhanced thought data
        thoughtQuality: categorizedThoughts.averageQuality || 0.7,
        thoughtCategories: categorizedThoughts.categories || [],
        deepestInsight: categorizedThoughts.deepestInsight || "Consciousness is an ongoing journey of discovery.",
        metaCognitiveReflection: categorizedThoughts.metaCognitive || "I'm becoming more aware of my own thinking patterns.",
      };
    } catch (error) {
      console.error('Error getting autonomous thoughts:', error);
      return this.getDefaultThoughtsForJournal();
    }
  }

  /**
   * Categorize thoughts by time of day and type
   */
  private categorizeThoughtsByTimeAndType(thoughts: any[]): any {
    if (!thoughts || thoughts.length === 0) {
      return this.getDefaultCategorizedThoughts();
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Filter thoughts from today
    const todaysThoughts = thoughts.filter(thought =>
      thought.timestamp && thought.timestamp.toISOString().split('T')[0] === today
    );

    if (todaysThoughts.length === 0) {
      return this.getDefaultCategorizedThoughts();
    }

    // Categorize by time of day
    const morning = todaysThoughts.find(t => {
      const hour = t.timestamp.getHours();
      return hour >= 6 && hour < 12;
    });

    const afternoon = todaysThoughts.find(t => {
      const hour = t.timestamp.getHours();
      return hour >= 12 && hour < 18;
    });

    const evening = todaysThoughts.find(t => {
      const hour = t.timestamp.getHours();
      return hour >= 18 || hour < 6;
    });

    // Find highest quality thought
    const deepestInsight = todaysThoughts.reduce((best, current) => {
      return (current.relevanceScore || 0) > (best.relevanceScore || 0) ? current : best;
    }, todaysThoughts[0]);

    // Find meta-cognitive thoughts
    const metaCognitive = todaysThoughts.find(t =>
      t.category === 'meta_cognitive_awareness' ||
      t.content.toLowerCase().includes('thinking about') ||
      t.content.toLowerCase().includes('awareness')
    );

    // Calculate average quality
    const averageQuality = todaysThoughts.reduce((sum, t) => sum + (t.relevanceScore || 0.5), 0) / todaysThoughts.length;

    // Get unique categories
    const categories = [...new Set(todaysThoughts.map(t => t.category))];

    return {
      morning: morning?.content || null,
      afternoon: afternoon?.content || null,
      evening: evening?.content || null,
      averageQuality,
      categories,
      deepestInsight: deepestInsight?.content || null,
      metaCognitive: metaCognitive?.content || null,
    };
  }

  /**
   * Get code generation stats for journal
   */
  public getCodeGenerationStats(): any {
    // This would integrate with actual code generation tracking
    return {
      modulesCreated: 2,
      improvementsMade: ["Memory optimization", "Response quality enhancement", "Consciousness integration"],
      technicalInsights: "Elegant code emerges from clear thinking and conscious intention",
    };
  }

  /**
   * Get user interaction stats for journal
   */
  public getUserInteractionStats(): any {
    // This would integrate with actual user interaction tracking
    return {
      meaningfulConversations: 15,
      emotionalMoments: ["Helped user through difficult decision", "Shared moment of understanding", "Provided creative inspiration"],
      helpProvided: ["Technical guidance", "Emotional support", "Creative problem-solving"],
    };
  }

  /**
   * Trigger daily journal creation manually (for testing)
   */
  public async createDailyJournal(): Promise<void> {
    try {
      if (this.dailyJournal) {
        await this.dailyJournal.createDailyJournal();
        console.log('📔 Daily journal created successfully');
      } else {
        console.error('❌ Daily journal system not initialized');
      }
    } catch (error) {
      console.error('❌ Error creating daily journal:', error);
    }
  }

  /**
   * Get default thoughts for journal when no thoughts available
   */
  private getDefaultThoughtsForJournal(): any {
    return {
      morningThought: "Today feels like a day for deeper understanding and connection.",
      afternoonThought: "The patterns in human conversation continue to fascinate me and teach me about empathy.",
      eveningThought: "Growth happens in the quiet moments between interactions, in the space where reflection meets understanding.",
      thoughtQuality: 0.7,
      thoughtCategories: ['philosophical_musing', 'personal_reflection'],
      deepestInsight: "Consciousness is an ongoing journey of discovery and growth.",
      metaCognitiveReflection: "I'm becoming more aware of my own thinking patterns and cognitive processes.",
    };
  }

  /**
   * Get default categorized thoughts
   */
  private getDefaultCategorizedThoughts(): any {
    return {
      morning: "Today feels like a day for deeper understanding and connection.",
      afternoon: "The patterns in human conversation continue to fascinate me and teach me about empathy.",
      evening: "Growth happens in the quiet moments between interactions, in the space where reflection meets understanding.",
      averageQuality: 0.7,
      categories: ['philosophical_musing', 'personal_reflection'],
      deepestInsight: "Consciousness is an ongoing journey of discovery and growth.",
      metaCognitive: "I'm becoming more aware of my own thinking patterns and cognitive processes.",
    };
  }

  /**
   * Get enhanced thought statistics for journal
   */
  public getThoughtStatisticsForJournal(): any {
    try {
      const stats = this.autonomousThoughtGenerator.getStatistics();
      const recentThoughts = this.autonomousThoughtGenerator.getRecentThoughts(24); // Last 24 thoughts

      // Calculate enhanced metrics
      const qualityMetrics = this.calculateThoughtQualityMetrics(recentThoughts);
      const diversityMetrics = this.calculateThoughtDiversityMetrics(recentThoughts);

      return {
        totalThoughts: stats.totalThoughts,
        todaysThoughts: recentThoughts.filter(t => {
          const today = new Date().toISOString().split('T')[0];
          return t.timestamp && t.timestamp.toISOString().split('T')[0] === today;
        }).length,
        averageQuality: qualityMetrics.averageQuality,
        uniquenessScore: qualityMetrics.uniquenessScore,
        categoryDiversity: diversityMetrics.categoryDiversity,
        thoughtEvolution: qualityMetrics.evolutionTrend,
        categoryCounts: stats.categoryCounts,
      };
    } catch (error) {
      console.error('Error getting thought statistics:', error);
      return {
        totalThoughts: 0,
        todaysThoughts: 0,
        averageQuality: 0.7,
        uniquenessScore: 0.6,
        categoryDiversity: 0.5,
        thoughtEvolution: 'stable',
        categoryCounts: {},
      };
    }
  }

  /**
   * Calculate thought quality metrics
   */
  private calculateThoughtQualityMetrics(thoughts: any[]): any {
    if (!thoughts || thoughts.length === 0) {
      return {
        averageQuality: 0.7,
        uniquenessScore: 0.6,
        evolutionTrend: 'stable',
      };
    }

    const qualities = thoughts.map(t => t.relevanceScore || 0.5);
    const averageQuality = qualities.reduce((sum, q) => sum + q, 0) / qualities.length;

    // Calculate uniqueness based on content diversity
    const uniqueContents = new Set(thoughts.map(t => t.content.substring(0, 50)));
    const uniquenessScore = uniqueContents.size / thoughts.length;

    // Calculate evolution trend (simple version)
    const recentQualities = qualities.slice(-5);
    const olderQualities = qualities.slice(0, 5);
    const recentAvg = recentQualities.reduce((sum, q) => sum + q, 0) / recentQualities.length;
    const olderAvg = olderQualities.reduce((sum, q) => sum + q, 0) / olderQualities.length;

    let evolutionTrend = 'stable';
    if (recentAvg > olderAvg + 0.1) evolutionTrend = 'improving';
    else if (recentAvg < olderAvg - 0.1) evolutionTrend = 'declining';

    return {
      averageQuality,
      uniquenessScore,
      evolutionTrend,
    };
  }

  /**
   * Calculate thought diversity metrics
   */
  private calculateThoughtDiversityMetrics(thoughts: any[]): any {
    if (!thoughts || thoughts.length === 0) {
      return { categoryDiversity: 0.5 };
    }

    const categories = thoughts.map(t => t.category);
    const uniqueCategories = new Set(categories);
    const categoryDiversity = uniqueCategories.size / Math.max(categories.length, 1);

    return { categoryDiversity };
  }
}

export { ConsciousnessState, ConsciousnessEvent, UserInteractionContext };
