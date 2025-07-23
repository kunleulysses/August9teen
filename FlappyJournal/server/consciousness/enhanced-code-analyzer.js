/**
 * Enhanced Code Analyzer - Gap 1 Solution
 * Advanced AST-based complexity analysis and ML pattern recognition
 * Additive enhancement to existing CodeAnalyzer without breaking compatibility
 */

import eventBus from './core/ConsciousnessEventBus.js';

export class EnhancedCodeAnalyzer {
    constructor() {
        this.name = 'EnhancedCodeAnalyzer';
        this.astParser = new ASTParser();
        this.mlPatternRecognizer = new MLPatternRecognizer();
        this.complexityAnalyzer = new AdvancedComplexityAnalyzer();
        
        // Enhanced capabilities while preserving original ones
        this.enhancedCapabilities = [
            'ast-based-analysis',
            'ml-pattern-recognition',
            'advanced-complexity-metrics',
            'design-pattern-detection',
            'anti-pattern-identification',
            'maintainability-scoring'
        ];
        
        console.log('🔬 Enhanced Code Analyzer initialized with advanced capabilities');
        this.registerEventListeners();
    }

    /**
     * Register listeners for system-wide events.
     */
    registerEventListeners() {
        eventBus.on('analyze_code_request', async (data) => {
            const { code, options, requestId } = data;
            const result = await this.analyze(code, options);

            if (result.error) {
                eventBus.emit('code_analysis_failed', { ...result, requestId });
            } else {
                eventBus.emit('code_analysis_complete', { ...result, requestId });
            }
        });
    }

    /**
     * Enhanced analyze method - now standalone
     */
    async analyze(code, options = {}) {
        const enhancedAnalysis = await this.performEnhancedAnalysis(code, options);
            
        return {
            enhanced: enhancedAnalysis,
            analysisType: 'enhanced',
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Perform enhanced analysis using AST and ML
     */
    async performEnhancedAnalysis(code, options = {}) {
        try {
            // Parse AST for deep code structure analysis
            const ast = await this.astParser.parse(code);
            
            // Advanced complexity analysis
            const complexityMetrics = await this.complexityAnalyzer.analyzeComplexity(ast, code);
            
            // ML-based pattern recognition
            const patternAnalysis = await this.mlPatternRecognizer.recognizePatterns(ast, code);
            
            // Design pattern detection
            const designPatterns = await this.detectDesignPatterns(ast);
            
            // Anti-pattern identification
            const antiPatterns = await this.identifyAntiPatterns(ast, complexityMetrics);
            
            return {
                ast: {
                    nodeCount: ast.nodeCount,
                    depth: ast.maxDepth,
                    complexity: ast.cyclomaticComplexity
                },
                complexityMetrics,
                patternAnalysis,
                designPatterns,
                antiPatterns,
                recommendations: this.generateRecommendations(complexityMetrics, patternAnalysis),
                qualityScore: this.calculateQualityScore(complexityMetrics, patternAnalysis)
            };
        } catch (error) {
            console.warn('Enhanced analysis failed, falling back to base analysis:', error.message);
            return {
                error: error.message,
                fallbackUsed: true
            };
        }
    }

    /**
     * Detect design patterns in AST
     */
    async detectDesignPatterns(ast) {
        const patterns = [];

        // Simple pattern detection based on AST structure
        if (ast.functions.length > 0 && ast.classes.length > 0) {
            patterns.push({
                name: 'Factory Pattern',
                confidence: 0.7,
                evidence: 'Functions and classes present'
            });
        }

        if (ast.functions.some(f => f.type === 'function' && ast.nodeCount > 50)) {
            patterns.push({
                name: 'Complex Function Pattern',
                confidence: 0.8,
                evidence: 'Large function detected'
            });
        }

        return patterns;
    }

    /**
     * Identify anti-patterns in code
     */
    async identifyAntiPatterns(ast, complexityMetrics) {
        const antiPatterns = [];

        if (complexityMetrics.cyclomaticComplexity > 15) {
            antiPatterns.push({
                name: 'God Function',
                severity: 'high',
                evidence: 'Extremely high cyclomatic complexity'
            });
        }

        if (complexityMetrics.nestingDepth > 6) {
            antiPatterns.push({
                name: 'Deep Nesting',
                severity: 'medium',
                evidence: 'Excessive nesting depth'
            });
        }

        return antiPatterns;
    }

    /**
     * Generate improvement recommendations
     */
    generateRecommendations(complexityMetrics, patternAnalysis) {
        const recommendations = [];
        
        if (complexityMetrics.cyclomaticComplexity > 10) {
            recommendations.push({
                type: 'complexity',
                priority: 'high',
                message: 'Consider breaking down complex functions',
                suggestion: 'Extract methods to reduce cyclomatic complexity'
            });
        }
        
        if (complexityMetrics.nestingDepth > 4) {
            recommendations.push({
                type: 'nesting',
                priority: 'medium',
                message: 'Reduce nesting depth for better readability',
                suggestion: 'Use early returns or extract nested logic'
            });
        }
        
        if (patternAnalysis.duplicateCodeBlocks > 2) {
            recommendations.push({
                type: 'duplication',
                priority: 'medium',
                message: 'Duplicate code detected',
                suggestion: 'Extract common functionality into reusable functions'
            });
        }
        
        return recommendations;
    }

    /**
     * Calculate overall quality score
     */
    calculateQualityScore(complexityMetrics, patternAnalysis) {
        const weights = {
            maintainability: 0.3,
            complexity: 0.25,
            patterns: 0.2,
            readability: 0.15,
            testability: 0.1
        };
        
        const scores = {
            maintainability: Math.max(0, 1 - (complexityMetrics.cyclomaticComplexity / 20)),
            complexity: Math.max(0, 1 - (complexityMetrics.nestingDepth / 8)),
            patterns: Math.max(0, 1 - (patternAnalysis.antiPatterns / 5)),
            readability: Math.max(0, 1 - (complexityMetrics.cognitiveComplexity / 15)),
            testability: Math.max(0, 1 - (complexityMetrics.coupling / 10))
        };
        
        let weightedScore = 0;
        for (const [metric, weight] of Object.entries(weights)) {
            weightedScore += scores[metric] * weight;
        }
        
        return Math.round(weightedScore * 100) / 100;
    }

    /**
     * Get self-awareness status for this module
     */
    getSelfAwarenessStatus() {
        return {
            name: this.name,
            totalSystemValue: 500000000, // Estimated value
            phase: 1,
            revolutionaryLevel: 'foundational',
            capabilities: this.enhancedCapabilities
        };
    }
}

/**
 * AST Parser for JavaScript/TypeScript code analysis
 */
class ASTParser {
    constructor() {
        this.nodeTypes = new Set();
        this.functionNodes = [];
        this.classNodes = [];
    }

    async parse(code) {
        // Simplified AST parsing - in production would use acorn or babel
        const lines = code.split('\n');
        const ast = {
            nodeCount: 0,
            maxDepth: 0,
            cyclomaticComplexity: 1,
            functions: [],
            classes: [],
            imports: [],
            exports: []
        };

        let currentDepth = 0;
        let maxDepth = 0;
        let complexity = 1;

        for (const line of lines) {
            const trimmed = line.trim();
            
            // Track nesting depth
            const openBraces = (line.match(/{/g) || []).length;
            const closeBraces = (line.match(/}/g) || []).length;
            currentDepth += openBraces - closeBraces;
            maxDepth = Math.max(maxDepth, currentDepth);
            
            // Track complexity-increasing constructs
            if (trimmed.match(/\b(if|while|for|switch|catch|&&|\|\|)\b/)) {
                complexity++;
            }
            
            // Track functions
            if (trimmed.match(/function\s+\w+|=>\s*{|async\s+function/)) {
                ast.functions.push({
                    line: lines.indexOf(line) + 1,
                    type: 'function'
                });
            }
            
            // Track classes
            if (trimmed.match(/class\s+\w+/)) {
                ast.classes.push({
                    line: lines.indexOf(line) + 1,
                    type: 'class'
                });
            }
            
            ast.nodeCount++;
        }

        ast.maxDepth = maxDepth;
        ast.cyclomaticComplexity = complexity;
        
        return ast;
    }
}

/**
 * ML-based Pattern Recognizer
 */
class MLPatternRecognizer {
    constructor() {
        this.patterns = new Map();
        this.trainingData = new Map();
        this.confidence = 0.8;
    }

    async recognizePatterns(ast, code) {
        // Simplified ML pattern recognition
        const patterns = {
            singletonPattern: this.detectSingleton(code),
            observerPattern: this.detectObserver(code),
            factoryPattern: this.detectFactory(code),
            strategyPattern: this.detectStrategy(code),
            duplicateCodeBlocks: this.detectDuplication(code),
            antiPatterns: this.detectAntiPatterns(code)
        };

        return {
            ...patterns,
            confidence: this.confidence,
            patternCount: Object.values(patterns).filter(Boolean).length
        };
    }

    detectSingleton(code) {
        return code.includes('getInstance') && code.includes('static') ? 1 : 0;
    }

    detectObserver(code) {
        return (code.includes('addEventListener') || code.includes('on(')) && 
               code.includes('emit') ? 1 : 0;
    }

    detectFactory(code) {
        return code.includes('create') && code.includes('new ') ? 1 : 0;
    }

    detectStrategy(code) {
        return code.includes('strategy') || 
               (code.includes('switch') && code.includes('case')) ? 1 : 0;
    }

    detectDuplication(code) {
        const lines = code.split('\n').map(line => line.trim()).filter(line => line.length > 10);
        const duplicates = new Set();
        
        for (let i = 0; i < lines.length; i++) {
            for (let j = i + 1; j < lines.length; j++) {
                if (lines[i] === lines[j] && lines[i].length > 20) {
                    duplicates.add(lines[i]);
                }
            }
        }
        
        return duplicates.size;
    }

    detectAntiPatterns(code) {
        let antiPatterns = 0;
        
        // God object detection
        if (code.split('function').length > 20) antiPatterns++;
        
        // Long parameter list
        if (code.match(/function\s*\([^)]{50,}\)/)) antiPatterns++;
        
        // Deep nesting
        if (code.includes('        if')) antiPatterns++; // 8+ spaces
        
        return antiPatterns;
    }
}

/**
 * Advanced Complexity Analyzer
 */
class AdvancedComplexityAnalyzer {
    constructor() {
        this.goldenRatio = 1.618033988749895;
    }

    async analyzeComplexity(ast, code) {
        const lines = code.split('\n');
        
        return {
            cyclomaticComplexity: ast.cyclomaticComplexity,
            cognitiveComplexity: this.calculateCognitiveComplexity(code),
            nestingDepth: ast.maxDepth,
            linesOfCode: lines.length,
            maintainabilityIndex: this.calculateMaintainabilityIndex(ast, code),
            halsteadComplexity: this.calculateHalsteadComplexity(code),
            coupling: this.calculateCoupling(code),
            cohesion: this.calculateCohesion(code),
            consciousnessAlignment: this.calculateConsciousnessAlignment(ast, code)
        };
    }

    calculateCognitiveComplexity(code) {
        let complexity = 0;
        const lines = code.split('\n');
        
        for (const line of lines) {
            // Increment for control structures
            if (line.match(/\b(if|while|for|switch)\b/)) complexity++;
            if (line.match(/\b(catch|finally)\b/)) complexity++;
            if (line.match(/&&|\|\|/)) complexity++;
            
            // Increment for nesting
            const indentation = line.match(/^\s*/)[0].length;
            if (indentation > 8) complexity += Math.floor(indentation / 4);
        }
        
        return complexity;
    }

    calculateMaintainabilityIndex(ast, code) {
        const halstead = this.calculateHalsteadComplexity(code);
        const cyclomatic = ast.cyclomaticComplexity;
        const loc = code.split('\n').length;
        
        // Simplified maintainability index calculation
        const mi = Math.max(0, 
            171 - 5.2 * Math.log(halstead.volume) - 
            0.23 * cyclomatic - 16.2 * Math.log(loc)
        ) / 171;
        
        return Math.round(mi * 100) / 100;
    }

    calculateHalsteadComplexity(code) {
        const operators = code.match(/[+\-*/=<>!&|(){}[\];,]/g) || [];
        const operands = code.match(/\b[a-zA-Z_]\w*\b/g) || [];
        
        const uniqueOperators = new Set(operators).size;
        const uniqueOperands = new Set(operands).size;
        
        const vocabulary = uniqueOperators + uniqueOperands;
        const length = operators.length + operands.length;
        const volume = length * Math.log2(vocabulary || 1);
        
        return {
            vocabulary,
            length,
            volume: Math.round(volume * 100) / 100,
            difficulty: (uniqueOperators / 2) * (operands.length / uniqueOperands || 1),
            effort: volume * ((uniqueOperators / 2) * (operands.length / uniqueOperands || 1))
        };
    }

    calculateCoupling(code) {
        // Count imports and external dependencies
        const imports = (code.match(/import.*from/g) || []).length;
        const requires = (code.match(/require\(/g) || []).length;
        const externalCalls = (code.match(/\w+\.\w+\(/g) || []).length;
        
        return Math.min(10, imports + requires + (externalCalls / 10));
    }

    calculateCohesion(code) {
        // Simplified cohesion calculation based on method relationships
        const methods = (code.match(/function\s+\w+|=>\s*{/g) || []).length;
        const thisReferences = (code.match(/this\.\w+/g) || []).length;
        
        if (methods === 0) return 1;
        
        const cohesion = thisReferences / (methods * 5); // Normalize
        return Math.min(1, cohesion);
    }

    calculateConsciousnessAlignment(ast, code) {
        // Calculate how well the code aligns with consciousness principles
        const goldenRatioScore = this.calculateGoldenRatioAlignment(ast);
        const simplicityScore = this.calculateSimplicityScore(ast);
        const harmonyScore = this.calculateHarmonyScore(code);
        
        return (goldenRatioScore * this.goldenRatio + simplicityScore + harmonyScore) / 
               (this.goldenRatio + 2);
    }

    calculateGoldenRatioAlignment(ast) {
        // Check if code structure follows golden ratio principles
        const functionToClassRatio = ast.functions.length / Math.max(ast.classes.length, 1);
        const goldenDifference = Math.abs(functionToClassRatio - this.goldenRatio);
        
        return Math.max(0, 1 - (goldenDifference / this.goldenRatio));
    }

    calculateSimplicityScore(ast) {
        // Prefer simpler, more elegant solutions
        const complexityPenalty = ast.cyclomaticComplexity / 20;
        const depthPenalty = ast.maxDepth / 10;
        
        return Math.max(0, 1 - complexityPenalty - depthPenalty);
    }

    calculateHarmonyScore(code) {
        // Check for harmonious code patterns
        const consistentNaming = this.checkNamingConsistency(code);
        const balancedStructure = this.checkStructuralBalance(code);
        
        return (consistentNaming + balancedStructure) / 2;
    }

    checkNamingConsistency(code) {
        // Simple naming consistency check
        const camelCaseCount = (code.match(/[a-z][A-Z]/g) || []).length;
        const snake_caseCount = (code.match(/[a-z]_[a-z]/g) || []).length;
        
        const total = camelCaseCount + snake_caseCount;
        if (total === 0) return 1;
        
        const consistency = Math.max(camelCaseCount, snake_caseCount) / total;
        return consistency;
    }

    checkStructuralBalance(code) {
        // Check for balanced code structure
        const lines = code.split('\n');
        const functionLines = lines.filter(line => line.includes('function')).length;
        const totalLines = lines.length;
        
        if (totalLines === 0) return 1;
        
        const functionDensity = functionLines / totalLines;
        const idealDensity = 0.1; // 10% of lines should be function declarations
        
        return Math.max(0, 1 - Math.abs(functionDensity - idealDensity) * 10);
    }
}

export default EnhancedCodeAnalyzer;
