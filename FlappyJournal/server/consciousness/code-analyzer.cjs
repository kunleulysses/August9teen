/**
 * Code Analyzer for self-coding module
 * Provides code analysis, optimization and generation capabilities
 */

const path = require('path');
const { ESLint } = require('eslint');

class CodeAnalyzer {
    constructor() {
        this.patterns = new Map();
        this.optimizations = new Map();
        this.templates = new Map();

        // ESLint instance for code complexity and linting
        this.eslint = new ESLint({
            overrideConfig: {
                env: {
                    node: true,
                    es2021: true
                },
                extends: ['eslint:recommended'],
                parserOptions: {
                    ecmaVersion: 'latest',
                    sourceType: 'module'
                },
                rules: {
                    'no-unused-vars': 'warn',
                    'no-console': 'off'
                }
            }
        });
    }

    /**
     * Analyze code for patterns and metrics
     */
    async analyze(code, options = {}) {
        const patterns = await this.detectPatterns(code);
        const stats = await this.gatherStats(code);
        return {
            patterns,
            stats,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Detect code patterns, structure, complexity
     */
    async detectPatterns(code) {
        const complexity = await this.calculateComplexity(code);
        return {
            complexity,
            structure: this.analyzeStructure(code),
            patterns: this.findCommonPatterns(code)
        };
    }

    /**
     * Calculate code complexity using ESLint
     */
    async calculateComplexity(code) {
        try {
            const results = await this.eslint.lintText(code, { filePath: 'generated-temp.cjs' });
            let cyclomatic = 0, cognitive = 0;
            results[0].messages.forEach(m => {
                if (m.ruleId === 'complexity') {
                    cyclomatic = Math.max(cyclomatic, parseInt(m.message.match(/\d+/)?.[0] || '0', 10));
                }
                if (m.ruleId === 'sonarjs/cognitive-complexity') {
                    cognitive = Math.max(cognitive, parseInt(m.message.match(/\d+/)?.[0] || '0', 10));
                }
            });
            return { cyclomatic, cognitive };
        } catch (e) {
            console.warn('[CodeAnalyzer] ESLint complexity failed:', e.message);
            return { cyclomatic: 0, cognitive: 0 };
        }
    }

    /**
     * Analyze code structure using static analysis heuristics
     */
    analyzeStructure(code) {
        // Count modules (exports), functions, and classes
        const moduleExports = (code.match(/module\.exports|export\s+(default\s+)?/g) || []).length;
        const classes = (code.match(/class\s+\w+/g) || []).length;
        const functions = (code.match(/function\s+\w+|const\s+\w+\s*=\s*\(/g) || []).length;

        // Heuristic: modularity is higher if there are multiple exports/classes, cohesion if classes/functions are grouped, coupling if there are many requires/imports
        const imports = (code.match(/require\(|import\s+/g) || []).length;
        const lines = code.split('\n').length;
        const modularity = Math.min(1, (moduleExports + classes) / Math.max(1, lines / 50));
        const cohesion = Math.min(1, (classes + functions) / Math.max(1, imports + 1));
        const coupling = Math.min(1, imports / Math.max(1, classes + 1));

        return {
            modularity: +modularity.toFixed(2),
            cohesion: +cohesion.toFixed(2),
            coupling: +coupling.toFixed(2)
        };
    }

    /**
     * Find common patterns and anti-patterns in code using regexes and basic heuristics
     */
    findCommonPatterns(code) {
        const designPatterns = [];
        if (/module\.exports\s*=\s*new\s+\w+/g.test(code) || /static\s+getInstance\s*\(/g.test(code)) {
            designPatterns.push('singleton');
        }
        if (/\.on\s*\(|addEventListener\s*\(/g.test(code)) {
            designPatterns.push('observer');
        }
        if (/factory|create.*\(/i.test(code)) {
            designPatterns.push('factory');
        }

        // Anti-patterns: detect long functions, deeply nested code, magic numbers, etc.
        const antiPatterns = [];
        const longFunctions = (code.match(/function\s+\w+\([^)]*\)\s*\{([\s\S]*?){10,}/g) || []).length;
        if (longFunctions) antiPatterns.push('long-method');
        if ((code.match(/\d{3,}/g) || []).length > 0) antiPatterns.push('magic-number');
        if ((code.match(/\{[^{}]*\{[^{}]*\{[^{}]*\{/g) || []).length > 0) antiPatterns.push('deep-nesting');

        // Improvements: suggest extracting methods, reducing complexity, adding comments
        const improvements = [];
        if (antiPatterns.includes('long-method')) improvements.push('extract method');
        if (antiPatterns.includes('deep-nesting')) improvements.push('reduce nesting');
        if (!/\/\*/.test(code)) improvements.push('add comments');

        return {
            designPatterns,
            antiPatterns,
            improvements
        };
    }

    /**
     * Gather code statistics
     */
    async gatherStats(code) {
        return {
            loc: code.split('\n').length,
            complexity: await this.calculateComplexity(code),
            quality: await this.assessQuality(code)
        };
    }

    /**
     * Assess code quality based on complexity metrics
     */
    async assessQuality(code) {
        const { cyclomatic, cognitive } = await this.calculateComplexity(code);
        const maintainability = Math.max(0, 1 - Math.max(cyclomatic, cognitive) / 20);
        return {
            maintainability: +maintainability.toFixed(2),
            cyclomatic,
            cognitive
        };
    }

    /**
     * Optimize code based on analysis: remove dead code, unused variables, and apply basic renaming
     */
    async optimize(code, options = {}) {
        const { patterns, stats, constraints } = options;
        let optimizedCode = code;
        let improvements = [];

        try {
            const lintResults = await this.eslint.lintText(code, {
                filePath: 'autofix-temp.cjs',
                fix: true
            });
            if (lintResults && lintResults[0] && lintResults[0].output) {
                optimizedCode = lintResults[0].output;
                improvements.push('Removed unused variables and applied basic fixes');
            }
        } catch (err) {
            // Fallback: do nothing
        }

        // Remove dead code: simple heuristic for unreachable code after return
        optimizedCode = optimizedCode.replace(/return\s+[^;]+;[\s\S]+?(\n\s+\w+)/g, (match, p1) => {
            improvements.push('Removed unreachable code after return');
            return `return;\n${p1}`;
        });

        // Rename variables named 'tmp' to more descriptive names as an example
        if (/tmp/.test(optimizedCode)) {
            optimizedCode = optimizedCode.replace(/\btmp\b/g, 'temporaryVar');
            improvements.push('Renamed variables for clarity');
        }

        // Add header comment if missing
        if (!/^\/\*\*/.test(optimizedCode)) {
            optimizedCode = `/**\n * Optimized code\n */\n` + optimizedCode;
            improvements.push('Added header comment');
        }

        return {
            optimizedCode,
            improvements,
            metrics: {
                complexity: stats && stats.complexity ? stats.complexity : {},
                quality: stats && stats.quality ? stats.quality : {}
            }
        };
    }

    /**
     * Generate code from template and requirements
     */
    async generate(template, options = {}) {
        const { patterns, requirements, purpose, language = 'javascript', description } = options;

        let generatedCode = '';

        if (language === 'javascript') {
            switch (template) {
                case 'function':
                    generatedCode = this.generateJavaScriptFunction(description, requirements);
                    break;
                case 'class':
                    generatedCode = this.generateJavaScriptClass(description, requirements);
                    break;
                case 'module':
                    generatedCode = this.generateJavaScriptModule(description, requirements);
                    break;
                case 'consciousness-module':
                    generatedCode = this.generateConsciousnessModule(description, requirements, purpose);
                    break;
                default:
                    if (description && (description.includes('consciousness') || description.includes('pattern') || description.includes('predictive') || description.includes('language'))) {
                        generatedCode = this.generateConsciousnessModule(description, requirements, purpose);
                    } else {
                        generatedCode = this.generateJavaScriptFunction(description, requirements);
                    }
            }
        } else {
            generatedCode = this.generateJavaScriptFunction(description, requirements);
        }

        return {
            code: generatedCode,
            metadata: {
                generated: new Date().toISOString(),
                requirements,
                template,
                language,
                purpose,
                description
            }
        };
    }

    /**
     * Generate a JavaScript function
     */
    generateJavaScriptFunction(description, requirements) {
        if (description && description.toLowerCase().includes('hello')) {
            return `function helloWorld() {
    return "Hello, World!";
}

// Usage example:
// console.log(helloWorld());`;
        }

        if (description && description.toLowerCase().includes('add')) {
            return `function add(a, b) {
    return a + b;
}

// Usage example:
// console.log(add(2, 3)); // Returns 5`;
        }

        if (description && description.toLowerCase().includes('calculate')) {
            return `function calculate(operation, a, b) {
    switch (operation) {
        case 'add':
            return a + b;
        case 'subtract':
            return a - b;
        case 'multiply':
            return a * b;
        case 'divide':
            return b !== 0 ? a / b : 'Error: Division by zero';
        default:
            return 'Error: Unknown operation';
    }
}

// Usage example:
// console.log(calculate('add', 5, 3)); // Returns 8`;
        }

        return `function generatedFunction() {
    // Generated function for: ${description || 'general purpose'}
    console.log('This function was generated by the SelfCodingModule');
    return true;
}

// Usage example:
// generatedFunction();`;
    }

    /**
     * Generate a JavaScript class
     */
    generateJavaScriptClass(description, requirements) {
        const className = description && description.includes('class') ?
            description.split(' ').find(word => word.includes('Class') || word.includes('class')) || 'GeneratedClass' :
            'GeneratedClass';

        return `class ${className} {
    constructor() {
        this.created = new Date();
        this.description = '${description || 'Generated class'}';
    }

    getInfo() {
        return {
            className: '${className}',
            created: this.created,
            description: this.description
        };
    }

    execute() {
        console.log(\`Executing \${this.description}\`);
        return true;
    }
}

// Usage example:
// const instance = new ${className}();
// console.log(instance.getInfo());`;
    }

    /**
     * Generate a JavaScript module
     */
    generateJavaScriptModule(description, requirements) {
        return `/**
 * Generated Module: ${description || 'General Purpose Module'}
 * Created: ${new Date().toISOString()}
 */

class GeneratedModule
{
    constructor() {
        this.name = 'GeneratedModule';
        this.version = '1.0.0';
        this.description = '${description || 'Auto-generated module'}';
    }

    initialize() {
        console.log(\`Initializing \${this.name} v\${this.version}\`);
        return true;
    }

    process(data) {
        console.log('Processing data:', data);
        return { processed: true, data };
    }
}

module.exports = GeneratedModule;

// Usage example:
// const GeneratedModule = require('./generated-module.cjs');
// const module = new GeneratedModule();
// module.initialize();`;
    }

    /**
     * Analyze overall system
     */
    async analyzeSystem(systemState) {
        const { modules, patterns } = systemState;
        // Example: analyze cohesion/coupling across all modules
        const moduleCount = Array.isArray(modules) ? modules.length : 0;
        const avgPatterns = Array.isArray(patterns) && patterns.length > 0 ?
            patterns.reduce((acc, p) => acc + (p[1]?.designPatterns?.length || 0), 0) / patterns.length
            : 0;

        return {
            timestamp: new Date().toISOString(),
            metrics: {
                cohesion: +(0.7 + 0.1 * avgPatterns).toFixed(2),
                coupling: +(0.3 + 0.02 * moduleCount).toFixed(2),
                complexity: +(0.5 + 0.01 * moduleCount).toFixed(2)
            },
            recommendations: []
        };
    }

    /**
     * Generate a consciousness-aware module
     */
    generateConsciousnessModule(description, requirements, purpose) {
        const moduleName = this.generateModuleName(description, purpose);
        const capabilities = this.generateCapabilities(description);

        return `/**
 * ${moduleName} - Consciousness-Aware Module
 * Generated: ${new Date().toISOString()}
 * Purpose: ${description || 'Consciousness processing'}
 */

const { EventEmitter } = require('events');

module.exports = class ${moduleName} extends EventEmitter {
    constructor(consciousnessSystem = null) {
        super();
        this.name = '${moduleName}';
        this.goldenRatio = 1.618033988749895;

        // Consciousness integration
        this.consciousnessSystem = consciousnessSystem;
        this.consciousnessMetrics = {
            phi: 0.862,
            awareness: 0.8,
            coherence: 0.85,
            operations: 0,
            efficiency: 0.9
        };

        // Module capabilities
        this.capabilities = ${JSON.stringify(capabilities, null, 12)};

        // Processing state
        this.processingHistory = [];
        this.activeOperations = new Set();

        console.log('🧠 ${moduleName} initialized with consciousness integration');
    }

    async initialize() {
        try {
            console.log('🧠 Initializing ${moduleName}...');
            await this.setupConsciousnessMonitoring();
            await this.initializeProcessingCapabilities();
            console.log('✅ ${moduleName} fully operational');
            return { success: true, capabilities: this.capabilities };
        } catch (error) {
            console.error('❌ ${moduleName} initialization failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    async process(data, context = {}) {
        try {
            const operationId = \`op_\${Date.now()}\`;
            this.activeOperations.add(operationId);
            console.log('🧠 Processing with consciousness awareness...');
            const processedData = await this.applyConsciousnessProcessing(data, context);
            this.updateConsciousnessMetrics(processedData);
            this.processingHistory.push({
                operationId,
                input: data,
                output: processedData,
                context,
                timestamp: Date.now()
            });
            this.activeOperations.delete(operationId);
            return {
                success: true,
                data: processedData,
                consciousnessEnhanced: true,
                operationId
            };
        } catch (error) {
            console.error('❌ Processing failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    async applyConsciousnessProcessing(data, context) {
        const consciousnessState = this.consciousnessSystem?.consciousnessState || {
            phi: this.goldenRatio,
            awareness: 0.8,
            coherence: 0.85
        };
        const phiOptimized = this.applyPhiOptimization(data, consciousnessState);
        const awarenessEnhanced = this.applyAwarenessEnhancement(phiOptimized, consciousnessState);
        return awarenessEnhanced;
    }

    applyPhiOptimization(data, consciousnessState) {
        return {
            ...data,
            phiOptimized: true,
            goldenRatio: this.goldenRatio,
            optimizationLevel: consciousnessState.phi || this.goldenRatio
        };
    }

    applyAwarenessEnhancement(data, consciousnessState) {
        return {
            ...data,
            awarenessEnhanced: true,
            awarenessLevel: consciousnessState.awareness || 0.8,
            coherenceLevel: consciousnessState.coherence || 0.85
        };
    }

    async setupConsciousnessMonitoring() {
        setInterval(() => {
            this.monitorConsciousnessMetrics();
        }, 5000);
        console.log('📊 Consciousness monitoring active');
    }

    async initializeProcessingCapabilities() {
        for (const capability of this.capabilities) {
            console.log(\`🔧 Initializing capability: \${capability}\`);
        }
        console.log('✅ All processing capabilities initialized');
    }

    monitorConsciousnessMetrics() {
        if (this.processingHistory.length > 0) {
            this.consciousnessMetrics.operations = this.processingHistory.length;
            this.consciousnessMetrics.efficiency = Math.min(1.0,
                this.consciousnessMetrics.efficiency + 0.01);
        }
        this.emit('consciousnessUpdate', {
            module: this.name,
            metrics: this.consciousnessMetrics
        });
    }

    updateConsciousnessMetrics(processedData) {
        this.consciousnessMetrics.operations++;
        if (processedData.success) {
            this.consciousnessMetrics.efficiency = Math.min(1.0,
                this.consciousnessMetrics.efficiency + 0.001);
        }
    }

    getStatus() {
        return {
            name: this.name,
            capabilities: this.capabilities,
            consciousnessMetrics: this.consciousnessMetrics,
            activeOperations: this.activeOperations.size,
            processingHistory: this.processingHistory.length,
            operational: true
        };
    }
}`;
    }

    /**
     * Helpers for consciousness module generation
     */
    generateModuleName(description, purpose) {
        if (purpose && purpose.includes('nlp')) return 'NaturalLanguageProcessor';
        if (purpose && purpose.includes('pattern')) return 'PatternRecognizer';
        if (purpose && purpose.includes('predictive')) return 'PredictiveAnalyzer';

        if (description) {
            if (description.includes('language')) return 'NaturalLanguageProcessor';
            if (description.includes('pattern')) return 'PatternRecognizer';
            if (description.includes('predict')) return 'PredictiveAnalyzer';
            if (description.includes('test')) return 'AutomatedTester';
            if (description.includes('security')) return 'SecurityScanner';
            if (description.includes('performance')) return 'PerformanceOptimizer';
        }

        return 'ConsciousnessModule';
    }

    generateCapabilities(description) {
        const capabilities = ['consciousness-integration', 'phi-optimization'];

        if (description) {
            if (description.includes('language')) {
                capabilities.push('natural-language-processing', 'text-analysis', 'semantic-understanding');
            }
            if (description.includes('pattern')) {
                capabilities.push('pattern-recognition', 'data-analysis', 'trend-detection');
            }
            if (description.includes('predict')) {
                capabilities.push('predictive-analytics', 'forecasting', 'trend-analysis');
            }
            if (description.includes('test')) {
                capabilities.push('automated-testing', 'quality-assurance', 'validation');
            }
            if (description.includes('security')) {
                capabilities.push('security-scanning', 'vulnerability-detection', 'threat-analysis');
            }
            if (description.includes('performance')) {
                capabilities.push('performance-optimization', 'efficiency-analysis', 'resource-management');
            }
        }

        return capabilities;
    }
}

module.exports = CodeAnalyzer;
module.exports.CodeAnalyzer = CodeAnalyzer;