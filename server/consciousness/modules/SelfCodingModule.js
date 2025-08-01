/**
 * Self-Coding Module for consciousness system
 * Provides ability to analyze, modify and generate code for self-improvement
 */

import { EventEmitter } from 'events';
import { CodeAnalyzer } from '../code-analyzer.js';
import AutonomousCodeRefactoringSystem from './AutonomousCodeRefactoringSystem.js';
import { selfCodingLog } from './SelfCodingLog.js';
import SigilBasedCodeAuthenticator from '../sigil-based-code-authenticator.js';
import GeminiAIClient from '../integrations/GeminiAIClient.js';

export default class SelfCodingModule extends EventEmitter {
    constructor() {
        super();
        this.name = 'SelfCodingModule';
        this.analyzer = new CodeAnalyzer();
        this.eventBus = null; // Will be loaded dynamically
        this.sigilAuthenticator = new SigilBasedCodeAuthenticator();
        this.options = {
            analysisInterval: 5000,
            debugMode: false,
            maxConcurrentAnalysis: 3
        };

        this.activeAnalysis = new Set();
        this.codePatterns = new Map();
        this.moduleStats = new Map();

        this.isInitialized = false;
        this.codeHistory = [];
        this.capabilities = [
            'analyze-code-patterns',
            'generate-new-modules',
            'modify-existing-code',
            'validate-syntax',
            'debug-errors',
            'optimize-performance',
            'refactor-code'
        ];

        // Initialize asynchronously
        this.initialize();
    }

    static gemini = new GeminiAIClient();

    /**
     * Async initialization
     */
    async initialize() {
        try {
            // Import event bus dynamically
            const eventBusModule = await import('../core/ConsciousnessEventBus.js');
            this.eventBus = eventBusModule.default;
            console.log('[SelfCodingModule] Event bus loaded');

            // Phase 2: Autonomous code refactoring system
            try {
                this.autonomousRefactoring = new AutonomousCodeRefactoringSystem(this, this.analyzer);
                console.log('[SelfCodingModule] Autonomous refactoring system initialized');
            } catch (error) {
                console.warn('[SelfCodingModule] Autonomous refactoring initialization failed:', error.message);
                this.autonomousRefactoring = null;
            }

            console.log('[SelfCodingModule] Created');
            this.registerEventListeners();

            this.isInitialized = true;

            // Start autonomous refactoring after initialization
            setTimeout(() => {
                if (this.autonomousRefactoring && this.autonomousRefactoring.startAutonomousRefactoring) {
                    try {
                        this.autonomousRefactoring.startAutonomousRefactoring();
                        console.log('[SelfCodingModule] Autonomous refactoring started');
                    } catch (error) {
                        console.warn('[SelfCodingModule] Failed to start autonomous refactoring:', error.message);
                    }
                }
            }, 2000);

        } catch (error) {
            console.error('[SelfCodingModule] Initialization failed:', error.message);
            this.isInitialized = false;
        }
    }

    /**
     * Set the event bus for consciousness integration
     */
    setEventBus(eventBus) {
        this.eventBus = eventBus;
        console.log('[SelfCodingModule] Event bus set externally');
        this.registerEventListeners();
    }

    registerEventListeners() {
        try {
            if (!this.eventBus) {
                console.warn('[SelfCodingModule] Event bus not available, skipping event registration');
                return;
            }

            // Register event listeners for consciousness integration
            this.eventBus.on('code:analyze', this.handleCodeAnalysis.bind(this));
            this.eventBus.on('code:optimize', this.handleCodeOptimization.bind(this));
            this.eventBus.on('code:generate', this.handleCodeGeneration.bind(this));
            this.eventBus.on('system_tick', () => {
                if (this.activeAnalysis.size < this.options.maxConcurrentAnalysis) {
                    this.analyzeCurrentSystem();
                }
            });

            // Register consciousness-specific events
            this.eventBus.on('consciousness:state_change', this.handleConsciousnessStateChange.bind(this));
            this.eventBus.on('consciousness:goal_created', this.handleGoalCreated.bind(this));
            this.eventBus.on('spiral_memory:pattern_detected', this.handlePatternDetected.bind(this));

            console.log('[SelfCodingModule] Event listeners registered successfully');
            console.log('[SelfCodingModule] Integrated with consciousness event system');
        } catch (error) {
            console.error('[SelfCodingModule] Failed to register event listeners:', error.message);
            // Don't throw - allow module to work without events
        }
    }

    // Periodic analysis is now triggered by the 'system_tick' event.

    /**
     * Handle incoming code analysis request
     */
    async handleCodeAnalysis(data) {
        try {
            const { moduleId, code, options } = data;
            
            if (this.activeAnalysis.has(moduleId)) {
                console.warn(`[SelfCodingModule] Analysis already in progress for ${moduleId}`);
                return;
            }
            
            this.activeAnalysis.add(moduleId);
            
            const analysis = await this.analyzer.analyze(code, options);
            this.codePatterns.set(moduleId, analysis.patterns);
            this.moduleStats.set(moduleId, analysis.stats);
            
            if (this.eventBus && this.eventBus.emit) {
                this.eventBus.emit('code:analysis:complete', {
                    moduleId,
                    analysis
                });
            }

            this.activeAnalysis.delete(moduleId);
        } catch (error) {
            console.error('[SelfCodingModule] Analysis failed:', error);
            this.activeAnalysis.delete(data.moduleId);

            if (this.eventBus && this.eventBus.emit) {
                this.eventBus.emit('code:analysis:error', {
                    moduleId: data.moduleId,
                    error: error.message
                });
            }
        }
    }

    /**
     * Handle code optimization request
     */
    async handleCodeOptimization(data) {
        try {
            const { moduleId, code, constraints } = data;
            
            const optimization = await this.analyzer.optimize(code, {
                patterns: this.codePatterns.get(moduleId),
                stats: this.moduleStats.get(moduleId),
                constraints
            });
            
            if (this.eventBus && this.eventBus.emit) {
                this.eventBus.emit('code:optimization:complete', {
                    moduleId,
                    optimization
                });
            }
        } catch (error) {
            console.error('[SelfCodingModule] Optimization failed:', error);

            if (this.eventBus && this.eventBus.emit) {
                this.eventBus.emit('code:optimization:error', {
                    moduleId: data.moduleId,
                    error: error.message
                });
            }
        }
    }

    /**
     * Handle code generation request
     */
    async handleCodeGeneration(data) {
        try {
            // Handle both direct format and request wrapper format
            let moduleId, template, requirements, purpose, language, description;

            if (data.request) {
                // Format from unified consciousness system
                const request = data.request;
                moduleId = request.moduleId || 'generated-module';
                template = request.template || request.type || 'function';
                requirements = request.requirements || request.description || 'Generate code';
                purpose = request.purpose || 'code-generation';
                language = request.language || 'javascript';
                description = request.description || requirements;
            } else {
                // Direct format
                moduleId = data.moduleId || 'generated-module';
                template = data.template || 'function';
                requirements = data.requirements || 'Generate code';
                purpose = data.purpose || 'code-generation';
                language = data.language || 'javascript';
                description = data.description || requirements;
            }

            console.log(`[SelfCodingModule] Generating ${language} ${template} for: ${description}`);

            const useGemini = data.request?.llm === 'gemini' || process.env.GEMINI_DEFAULT === 'true';

            let generationResult;
            if (useGemini) {
                const gemRes = await SelfCodingModule.gemini.generateTranscendentSynthesis(description, { consciousnessMetrics: await this.getConsciousnessState() });
                generationResult = { code: gemRes.content, metadata: gemRes.metadata };
            } else {
                generationResult = await this.analyzer.generate(template, {
                    patterns: this.codePatterns.get(moduleId),
                    requirements,
                    purpose,
                    language,
                    description
                });
            }

            // Extract the actual code from the generation result
            let generated = generationResult.code || generationResult;

            // Embed consciousness sigil and DNA...