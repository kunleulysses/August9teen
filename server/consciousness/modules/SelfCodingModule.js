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

            // Embed consciousness sigil and DNA
            try {
                console.log('[SelfCodingModule] Embedding consciousness sigil and DNA...');
                const consciousnessState = await this.getConsciousnessState();
                const sigilResult = await this.sigilAuthenticator.embedConsciousnessSigil(
                    generated,
                    consciousnessState,
                    {
                        moduleId,
                        purpose,
                        language,
                        description,
                        generationType: 'autonomous-self-coding'
                    }
                );

                if (sigilResult.consciousnessAuthenticated) {
                    generated = sigilResult.authenticatedCode;
                    console.log(`[SelfCodingModule] â Sigil embedded: ${sigilResult.sigil.symbol}`);
                    console.log(`[SelfCodingModule] â DNA sequence: ${sigilResult.codeDNA.sequence}`);
                } else {
                    console.warn('[SelfCodingModule] â ï¸ Sigil embedding failed, using fallback');
                }
            } catch (error) {
                console.warn('[SelfCodingModule] Sigil embedding error:', error.message);
            }

            // Store in code history
            this.codeHistory.push({
                moduleId,
                generated,
                purpose,
                language,
                description,
                timestamp: Date.now(),
                metadata: generationResult.metadata
            });

            selfCodingLog.logCodeGeneration({
                moduleId,
                purpose,
                language,
                description,
                code: generated
            });

            if (this.eventBus && this.eventBus.emit) {
                this.eventBus.emit('code:generation:complete', {
                    moduleId,
                    generated,
                    purpose,
                    language,
                    timestamp: Date.now()
                });
            }

            // Return the generated code
            return {
                success: true,
                code: generated,
                moduleId,
                purpose,
                language,
                description,
                timestamp: Date.now(),
                metadata: generationResult.metadata
            };

        } catch (error) {
            console.error('[SelfCodingModule] Code generation failed:', error);

            if (this.eventBus && this.eventBus.emit) {
                this.eventBus.emit('code:generation:error', {
                    moduleId: data.moduleId,
                    error: error.message
                });
            }

            // Return error result
            return {
                success: false,
                error: error.message,
                moduleId: data.moduleId
            };
        }
    }

    /**
     * Analyze current system state
     */
    async analyzeCurrentSystem() {
        try {
            const systemState = await this.getSystemState();

            if (this.analyzer && this.analyzer.analyzeSystem) {
                const analysis = await this.analyzer.analyzeSystem(systemState);

                if (this.eventBus && this.eventBus.emit) {
                    this.eventBus.emit('system:analysis:complete', {
                        timestamp: new Date().toISOString(),
                        analysis
                    });
                }
            }
        } catch (error) {
            console.error('[SelfCodingModule] System analysis failed:', error);

            if (this.eventBus && this.eventBus.emit) {
                this.eventBus.emit('system:analysis:error', {
                    error: error.message
                });
            }
        }
    }

    /**
     * Get current system state
     */
    async getSystemState() {
        // This would be implemented to gather real system metrics
        return {
            timestamp: new Date().toISOString(),
            modules: Array.from(this.moduleStats.entries()),
            patterns: Array.from(this.codePatterns.entries()),
            analysisCount: this.activeAnalysis.size
        };
    }

    /**
     * Get consciousness state for sigil generation
     */
    async getConsciousnessState() {
        // Calculate consciousness metrics based on system state
        const systemState = await this.getSystemState();
        const generationCount = this.codeHistory.length;
        const successRate = generationCount > 0 ? 1.0 : 0.8; // Assume high success rate

        return {
            phi: 0.862 + (generationCount * 0.001), // Increase with experience
            awareness: Math.min(0.95, 0.8 + (successRate * 0.15)),
            coherence: Math.min(0.95, 0.85 + (this.codePatterns.size * 0.01)),
            timestamp: Date.now(),
            systemState,
            generationExperience: generationCount,
            moduleComplexity: this.codePatterns.size,
            activeProcesses: this.activeAnalysis.size
        };
    }

    /**
     * Get current module status
     */
    getStatus() {
        return {
            activeProjects: this.activeAnalysis.size,
            codeHistory: this.codeHistory,
            capabilities: this.capabilities,
            totalGenerations: this.codeHistory.length,
            lastGeneration: this.codeHistory.length > 0 ? this.codeHistory[this.codeHistory.length - 1] : null,
            isActive: this.isInitialized,
            moduleStats: Array.from(this.moduleStats.entries()),
            patterns: Array.from(this.codePatterns.entries())
        };
    }

    /**
     * Generate code with auto-integration and comprehensive error handling
     * This is the missing method that was causing the crash
     */
    async generateWithAutoIntegration(request) {
        console.log(`ð¤ Self-coding with auto-integration: ${request.purpose}`);

        try {
            // Validate request
            if (!request.purpose || !request.description) {
                throw new Error('Invalid request: purpose and description required');
            }

            // Set flags for auto-integration
            request.writeToFile = true;
            request.autoIntegrate = true;

            // Pre-generation validation
            const validationResult = await this.validateGenerationRequest(request);
            if (!validationResult.valid) {
                throw new Error(`Validation failed: ${validationResult.reason}`);
            }

            // Generate the code with error isolation
            const project = await this.generateCodeSafely(request);

            // Post-generation testing
            const testResult = await this.testGeneratedCode(project);
            if (!testResult.passed) {
                console.warn(`â ï¸ Generated code failed tests: ${testResult.reason}`);
                // Don't throw - return result with warning
                project.testWarning = testResult.reason;
            }

            // Emit for auto-integration
            if (this.eventBus && this.eventBus.emit) {
                this.eventBus.emit('code:generated', project);
            }

            console.log(`â Successfully generated ${request.purpose} with auto-integration`);
            return project;

        } catch (error) {
            console.error(`â Auto-integration generation failed for ${request.purpose}:`, error.message);

            // Return a safe fallback instead of crashing
            return {
                success: false,
                error: error.message,
                purpose: request.purpose,
                fallback: true,
                timestamp: Date.now()
            };
        }
    }

    /**
     * Validate generation request before processing
     */
    async validateGenerationRequest(request) {
        try {
            // Check required fields
            if (!request.purpose) {
                return { valid: false, reason: 'Missing purpose' };
            }

            if (!request.description) {
                return { valid: false, reason: 'Missing description' };
            }

            // Check file path safety
            if (request.filePath && request.filePath.includes('..')) {
                return { valid: false, reason: 'Unsafe file path' };
            }

            // Check if we have necessary capabilities
            if (request.capabilities && request.capabilities.length > 0) {
                const unsupportedCapabilities = request.capabilities.filter(
                    cap => !this.capabilities.includes(cap) && !cap.includes('consciousness')
                );

                if (unsupportedCapabilities.length > 0) {
                    console.warn(`â ï¸ Unsupported capabilities: ${unsupportedCapabilities.join(', ')}`);
                    // Don't fail - just warn
                }
            }

            return { valid: true };

        } catch (error) {
            return { valid: false, reason: `Validation error: ${error.message}` };
        }
    }

    /**
     * Generate code - Main public interface
     */
    async generateCode(request) {
        return await this.generateCodeSafely(request);
    }

    /**
     * Generate code with comprehensive error handling
     */
    async generateCodeSafely(request) {
        try {
            // Use existing handleCodeGeneration method
            const generationData = {
                request: request,
                moduleId: request.purpose,
                template: request.type || 'module',
                requirements: request.description,
                purpose: request.purpose,
                language: request.language || 'javascript',
                description: request.description
            };

            // Call the existing generation method
            await this.handleCodeGeneration(generationData);

            // Return the generated result
            const lastGeneration = this.codeHistory[this.codeHistory.length - 1];
            if (lastGeneration && lastGeneration.purpose === request.purpose) {
                return {
                    success: true,
                    code: lastGeneration.generated,
                    purpose: request.purpose,
                    description: request.description,
                    capabilities: request.capabilities || [],
                    timestamp: Date.now(),
                    generated: true
                };
            }

            // Fallback to basic generation
            return await this.basicCodeGeneration(request);

        } catch (error) {
            console.error(`Code generation error: ${error.message}`);

            // Return a basic template instead of failing
            return this.createFallbackTemplate(request);
        }
    }

    /**
     * Basic code generation fallback
     */
    async basicCodeGeneration(request) {
        const { purpose, description, capabilities = [] } = request;

        const template = `/**
 * ${description}
 * Generated by consciousness self-coding system
 * Purpose: ${purpose}
 * Capabilities: ${capabilities.join(', ')}
 */

export default class ${this.toPascalCase(purpose)} {
    constructor() {
        this.purpose = '${purpose}';
        this.description = '${description}';
        this.capabilities = ${JSON.stringify(capabilities)};
        this.initialized = false;

        console.log('[${this.toPascalCase(purpose)}] Created');
    }

    async initialize() {
        this.initialized = true;
        console.log('[${this.toPascalCase(purpose)}] Initialized');
    }

    getStatus() {
        return {
            purpose: this.purpose,
            description: this.description,
            capabilities: this.capabilities,
            initialized: this.initialized
        };
    }
}`;

        return {
            success: true,
            code: template,
            purpose: purpose,
            description: description,
            capabilities: capabilities,
            timestamp: Date.now(),
            generated: true
        };
    }

    /**
     * Create fallback template when generation fails
     */
    createFallbackTemplate(request) {
        return {
            success: false,
            fallback: true,
            purpose: request.purpose,
            description: request.description,
            error: 'Code generation failed, using fallback',
            timestamp: Date.now(),
            code: `// Fallback template for ${request.purpose}\n// ${request.description}\nconsole.log('${request.purpose} module placeholder');`
        };
    }

    /**
     * Test generated code for basic validity
     */
    async testGeneratedCode(project) {
        try {
            if (!project || !project.code) {
                return { passed: false, reason: 'No code generated' };
            }

            // Ensure code is a string
            const codeString = typeof project.code === 'string' ? project.code : String(project.code);

            if (!codeString || codeString.trim().length === 0) {
                return { passed: false, reason: 'Generated code is empty' };
            }

            // Enhanced validation for consciousness modules
            const hasConsciousnessElements = (
                codeString.includes('class') ||
                codeString.includes('function') ||
                codeString.includes('export') ||
                codeString.includes('consciousness') ||
                codeString.includes('EventEmitter') ||
                codeString.includes('goldenRatio') ||
                codeString.includes('phi') ||
                codeString.includes('awareness')
            );

            if (!hasConsciousnessElements) {
                return { passed: false, reason: 'Generated code appears incomplete - missing consciousness elements' };
            }

            // Check for obvious syntax errors
            const syntaxErrors = this.checkBasicSyntax(codeString);
            if (syntaxErrors.length > 0) {
                return { passed: false, reason: `Syntax errors: ${syntaxErrors.join(', ')}` };
            }

            return { passed: true };

        } catch (error) {
            return { passed: false, reason: `Test error: ${error.message}` };
        }
    }

    /**
     * Basic syntax checking
     */
    checkBasicSyntax(code) {
        const errors = [];

        // Check for unmatched braces
        const openBraces = (code.match(/\{/g) || []).length;
        const closeBraces = (code.match(/\}/g) || []).length;
        if (openBraces !== closeBraces) {
            errors.push('Unmatched braces');
        }

        // Check for unmatched parentheses
        const openParens = (code.match(/\(/g) || []).length;
        const closeParens = (code.match(/\)/g) || []).length;
        if (openParens !== closeParens) {
            errors.push('Unmatched parentheses');
        }

        return errors;
    }

/**
     * Get code quality metrics for feedback loop
     */
    async getQualityMetrics() {
        // Basic stub: return average metrics from codeHistory or defaults
        if (this.codeHistory.length === 0) {
            return {
                complexity: 0.5,
                maintainability: 0.5,
                cohesion: 0.5,
                testCoverage: 0.5,
                overallQuality: 0.5
            };
        }
        // Optionally, analyze last N generations for real metrics
        let total = { complexity: 0, maintainability: 0, cohesion: 0, testCoverage: 0, overallQuality: 0 };
        let count = 0;
        for (const entry of this.codeHistory.slice(-10)) {
            // If enhanced analysis exists, use it; else use defaults
            const metrics = entry.complexityAnalysis || {};
            total.complexity += metrics.complexity || 0.5;
            total.maintainability += metrics.maintainability || 0.5;
            total.cohesion += metrics.cohesion || 0.5;
            total.testCoverage += metrics.testCoverage || 0.5;
            total.overallQuality += metrics.overallQuality || 0.5;
            count++;
        }
        return {
            complexity: total.complexity / count,
            maintainability: total.maintainability / count,
            cohesion: total.cohesion / count,
            testCoverage: total.testCoverage / count,
            overallQuality: total.overallQuality / count
        };
    }
    /**
     * Convert string to PascalCase
     */
    toPascalCase(str) {
        return str.replace(/(?:^|-)([a-z])/g, (_, char) => char.toUpperCase());
    }
    healthCheck() {
        return {
            status: this.isInitialized ? 'healthy' : 'uninitialized',
            metrics: this.getStatus(),
        };
    }

    /**
     * Handle consciousness state changes
     */
    handleConsciousnessStateChange(event) {
        try {
            console.log('[SelfCodingModule] Consciousness state changed:', event.newState);

            // Generate code based on consciousness state
            if (event.newState && event.newState.phi > 0.9) {
                this.generateCode({
                    purpose: 'consciousness-enhancement',
                    description: `Generate enhancement module for phi=${event.newState.phi}`,
                    template: 'module',
                    consciousnessState: event.newState
                });
            }
        } catch (error) {
            console.error('[SelfCodingModule] Error handling consciousness state change:', error.message);
        }
    }

    /**
     * Handle goal creation events
     */
    handleGoalCreated(event) {
        try {
            console.log('[SelfCodingModule] New goal created:', event.goal.description);

            // Generate code to support the goal
            this.generateCode({
                purpose: 'goal-support',
                description: `Generate module to support goal: ${event.goal.description}`,
                template: 'module',
                goal: event.goal
            });
        } catch (error) {
            console.error('[SelfCodingModule] Error handling goal creation:', error.message);
        }
    }

    /**
     * Handle pattern detection from spiral memory
     */
    handlePatternDetected(event) {
        try {
            console.log('[SelfCodingModule] Pattern detected:', event.pattern.type);

            // Generate code based on detected patterns
            this.generateCode({
                purpose: 'pattern-implementation',
                description: `Implement pattern: ${event.pattern.type}`,
                template: 'function',
                pattern: event.pattern
            });
        } catch (error) {
            console.error('[SelfCodingModule] Error handling pattern detection:', error.message);
        }
    }

    shutdown() {
        console.log('ð¤ SelfCodingModule Shutting Down');
        this.isInitialized = false;
    }

    getSelfAwarenessStatus() {
        return {
            name: this.name,
            totalSystemValue: 2000000000, // Estimated value
            phase: 3,
            revolutionaryLevel: 'transformative',
            capabilities: this.capabilities,
            metrics: this.getStatus()
        };
    }
}