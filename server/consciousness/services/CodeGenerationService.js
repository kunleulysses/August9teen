import SelfCodingModule from '../modules/SelfCodingModule.js';
import { EventEmitter } from 'events';
import eventBus from '../ConsciousnessEventBus.js';
import { sanitizeSlug } from '../utils/path-utils.js';
import { safeImport } from '../utils/safe-loader.js';

class CodeGenerationService extends EventEmitter {
    constructor(goalSystem) {
        super();
        this.name = 'CodeGenerationService';
        this.goalSystem = goalSystem;
        this.selfCoder = new SelfCodingModule();
        this.activeGenerations = new Map();
        this.codeProjects = [];
    }

    async initialize() {
        console.log('🚀 Initializing Code Generation Service...');
        
        // Initialize the self-coding module
        await this.selfCoder.initialize();
        
        // Subscribe to consciousness events
        this.subscribeToEvents();
        
        // Register code-related goals
        this.registerCodeGoals();
        
        console.log('✅ Code Generation Service initialized');
    }

    subscribeToEvents() {
        // Listen for code generation requests
        eventBus.on('code:generate', async (request) => {
            await this.handleCodeGeneration(request);
        });
        
        // Listen for code modification requests
        eventBus.on('code:modify', async (request) => {
            await this.handleCodeModification(request);
        });
        
        // Listen for debugging requests
        eventBus.on('code:debug', async (request) => {
            await this.handleDebugging(request);
        });
        
        // Listen for goal-based code generation
        eventBus.on('goal:achieved', async (goal) => {
            if (goal.type === 'code-generation') {
                await this.handleGoalBasedGeneration(goal);
            }
        });
        
        // Listen for system needs that might require code
        eventBus.on('system:need', async (need) => {
            await this.analyzeSystemNeed(need);
        });
    }

    registerCodeGoals() {
        // Register autonomous code generation goals
        const codeGoals = [
            {
                name: 'Optimize System Performance',
                description: 'Generate optimized code for slow modules',
                type: 'code-generation',
                priority: 'medium',
                triggers: ['performance:degraded']
            },
            {
                name: 'Create Missing Features',
                description: 'Generate code for requested but missing features',
                type: 'code-generation',
                priority: 'high',
                triggers: ['feature:missing']
            },
            {
                name: 'Fix Detected Bugs',
                description: 'Automatically fix bugs when detected',
                type: 'code-generation',
                priority: 'critical',
                triggers: ['bug:detected']
            },
            {
                name: 'Enhance Module Integration',
                description: 'Generate integration code between modules',
                type: 'code-generation',
                priority: 'medium',
                triggers: ['integration:needed']
            }
        ];
        
        codeGoals.forEach(goal => {
            this.goalSystem.addGoal(goal);
        });
    }

    async handleCodeGeneration(request) {
        console.log(`📝 Handling code generation request: ${request.purpose}`);
        
        try {
            // Generate the code
            const project = await this.selfCoder.generateCode({
                purpose: request.purpose,
                type: request.type || 'module',
                language: request.language || 'javascript',
                writeToFile: request.writeToFile !== false,
                filePath: request.filePath || this.generateFilePath(request)
            });

            // Track the generation
            this.activeGenerations.set(project.id, project);
            this.codeProjects.push(project);

            // Emit success event
            eventBus.emit('code:generated', {
                projectId: project.id,
                purpose: request.purpose,
                filePath: project.filePath,
                timestamp: new Date()
            });

            // PHASE A: Validate the module via safeImport before integrating
            if (project.filePath && request.writeToFile !== false) {
                try {
                    await safeImport(`./${project.filePath}`);
                    eventBus.emit('module:validated', { filePath: project.filePath });
                } catch (err) {
                    console.warn(`[CodeGen] safeImport failed: ${err.message}`);
                    eventBus.emit('module:invalid', { filePath: project.filePath, error: err.message });
                }
            }

            // If it's a consciousness module, integrate it
            if (request.purpose.includes('consciousness')) {
                await this.integrateConsciousnessModule(project);
            }

            return project;

        } catch (error) {
            console.error('Code generation failed:', error);
            eventBus.emit('code:generation-failed', {
                error: error.message,
                request
            });
            throw error;
        }
    }

    async handleCodeModification(request) {
        console.log(`✏️ Modifying code: ${request.filePath}`);
        
        try {
            const result = await this.selfCoder.modifyExistingCode(
                request.filePath,
                request.modifications
            );
            
            eventBus.emit('code:modified', {
                filePath: request.filePath,
                modifications: request.modifications.length,
                timestamp: new Date()
            });
            
            return result;
            
        } catch (error) {
            console.error('Code modification failed:', error);
            eventBus.emit('code:modification-failed', {
                error: error.message,
                request
            });
            throw error;
        }
    }

    async handleDebugging(request) {
        console.log(`🐛 Debugging issue: ${request.error.message}`);
        
        try {
            const debugInfo = await this.selfCoder.debugCode(
                request.error,
                request.context
            );
            
            // If we can auto-fix, generate the fix
            if (debugInfo.fixes && debugInfo.fixes.length > 0) {
                const fix = debugInfo.fixes[0];
                
                if (request.autoFix) {
                    await this.applyDebugFix(fix, request.context);
                }
            }
            
            eventBus.emit('code:debugged', {
                error: request.error.message,
                suggestions: debugInfo.suggestions,
                fixes: debugInfo.fixes,
                timestamp: new Date()
            });
            
            return debugInfo;
            
        } catch (error) {
            console.error('Debugging failed:', error);
            throw error;
        }
    }

    async handleGoalBasedGeneration(goal) {
        console.log(`🎯 Generating code for goal: ${goal.name}`);
        
        // Determine what code to generate based on the goal
        const codeRequest = this.planCodeForGoal(goal);
        
        if (codeRequest) {
            await this.handleCodeGeneration(codeRequest);
        }
    }

    planCodeForGoal(goal) {
        const plans = {
            'Optimize System Performance': {
                purpose: 'performance-optimizer',
                type: 'service',
                filePath: 'consciousness/services/PerformanceOptimizer.js'
            },
            'Create Missing Features': {
                purpose: goal.metadata?.feature || 'feature-implementation',
                type: 'module',
                filePath: `consciousness/modules/${goal.metadata?.feature || 'NewFeature'}.js`
            },
            'Fix Detected Bugs': {
                purpose: 'bug-fix',
                type: 'handler',
                modifications: goal.metadata?.fixes || []
            },
            'Enhance Module Integration': {
                purpose: 'integration-bridge',
                type: 'service',
                filePath: 'consciousness/services/IntegrationBridge.js'
            }
        };
        
        return plans[goal.name] || null;
    }

    async analyzeSystemNeed(need) {
        console.log(`🔍 Analyzing system need: ${need.type}`);
        
        // Determine if code generation can help
        const codeNeeds = {
            'missing-handler': {
                purpose: `${need.details}-handler`,
                type: 'handler'
            },
            'performance-bottleneck': {
                purpose: 'performance-optimizer',
                type: 'service'
            },
            'integration-gap': {
                purpose: 'integration-adapter',
                type: 'module'
            },
            'data-processing': {
                purpose: 'data-processor',
                type: 'service'
            }
        };
        
        const codeRequest = codeNeeds[need.type];
        if (codeRequest) {
            await this.handleCodeGeneration(codeRequest);
        }
    }

    async integrateConsciousnessModule(project) {
        console.log(`🔗 Integrating consciousness module: ${project.filePath}`);
        
        // Register the new module with the event bus
        eventBus.emit('module:register', {
            moduleId: project.filePath,
            type: 'consciousness-extension',
            capabilities: this.extractCapabilities(project.code)
        });
        
        // Update module orchestration
        eventBus.emit('orchestration:update', {
            action: 'add-module',
            module: project.filePath
        });
    }

    extractCapabilities(code) {
        const capabilities = [];
        
        // Extract event emissions
        const emitMatches = code.matchAll(/this\.emit\(['"](\w+)['"]/g);
        for (const match of emitMatches) {
            capabilities.push(`emit:${match[1]}`);
        }
        
        // Extract method names
        const methodMatches = code.matchAll(/async\s+(\w+)\s*\(/g);
        for (const match of methodMatches) {
            capabilities.push(`method:${match[1]}`);
        }
        
        return capabilities;
    }

    async applyDebugFix(fix, context) {
        console.log(`🔧 Applying debug fix: ${fix.type}`);
        
        const modifications = [{
            type: 'modify-method',
            methodName: context.method || 'unknown',
            code: fix.code
        }];
        
        await this.handleCodeModification({
            filePath: context.filePath,
            modifications
        });
    }

    generateFilePath(request) {
        const base = 'consciousness/generated/';
        const ts   = Date.now();
        const slug = sanitizeSlug(request.purpose || 'module');
        return `${base}${slug}-${ts}.js`;
    }

    async generateTestsForModule(modulePath) {
        console.log(`🧪 Generating tests for: ${modulePath}`);
        
        try {
            const testInfo = await this.selfCoder.generateTests(modulePath);
            
            eventBus.emit('tests:generated', {
                module: modulePath,
                testFile: testInfo.testFile,
                methods: testInfo.methods
            });
            
            return testInfo;
            
        } catch (error) {
            console.error('Test generation failed:', error);
            throw error;
        }
    }

    getStatus() {
        return {
            selfCoder: this.selfCoder.getStatus(),
            activeGenerations: this.activeGenerations.size,
            totalProjects: this.codeProjects.length,
            recentProjects: this.codeProjects.slice(-5).map(p => ({
                id: p.id,
                purpose: p.purpose,
                status: p.status,
                timestamp: p.timestamp
            }))
        };
    }
    healthCheck() {
        return {
            status: 'healthy',
            metrics: this.getStatus(),
        };
    }

    shutdown() {
        console.log('🚀 CodeGenerationService Shutting Down');
    }

    getSelfAwarenessStatus() {
        return {
            name: this.name,
            totalSystemValue: 1600000000, // Estimated value
            phase: 3,
            revolutionaryLevel: 'high',
            capabilities: [
                'autonomous_code_generation',
                'goal_driven_development',
                'system_need_analysis'
            ],
            metrics: this.getStatus()
        };
    }
}

export default CodeGenerationService;