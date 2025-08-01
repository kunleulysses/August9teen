/**
 * Self-Healing Code Generation with Gemini AI
 * Advanced system that uses Gemini AI to analyze code vulnerabilities
 * and generate self-healing wrapper code with healing patterns
 */

import { EventEmitter } from 'events';
import { GoogleGenerativeAI } from '@google/generative-ai';

class CodeAnalyzer extends EventEmitter {
    constructor() {
        super();
        this.analysisHistory = [];
        this.vulnerabilityPatterns = new Map();
        this.initializeVulnerabilityPatterns();
    }

    initializeVulnerabilityPatterns() {
        // Initialize known vulnerability patterns
        this.vulnerabilityPatterns.set('memory_leak', {
            pattern: /new\s+\w+\(.*\)(?!.*\.close\(\)|.*\.dispose\(\)|.*\.cleanup\(\))/g,
            severity: 'high',
            description: 'Potential memory leak - object creation without cleanup',
            healingPattern: 'auto_cleanup_wrapper'
        });

        this.vulnerabilityPatterns.set('unhandled_promise', {
            pattern: /(?<!await\s+|\.catch\(|\.then\()[a-zA-Z_$][a-zA-Z0-9_$]*\([^)]*\)(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*\([^)]*\))*(?!\.catch\(|\.then\()/g,
            severity: 'medium',
            description: 'Potential unhandled promise rejection',
            healingPattern: 'promise_error_wrapper'
        });

        this.vulnerabilityPatterns.set('infinite_loop_risk', {
            pattern: /while\s*\(\s*true\s*\)|for\s*\(\s*;\s*;\s*\)/g,
            severity: 'critical',
            description: 'Potential infinite loop without break condition',
            healingPattern: 'loop_timeout_wrapper'
        });

        this.vulnerabilityPatterns.set('null_pointer_risk', {
            pattern: /\w+\.\w+(?!\s*&&|\s*\?\.)/g,
            severity: 'medium',
            description: 'Potential null pointer access without null check',
            healingPattern: 'null_safety_wrapper'
        });

        this.vulnerabilityPatterns.set('resource_not_closed', {
            pattern: /fs\.createReadStream\(|fs\.createWriteStream\(|new\s+WebSocket\(/g,
            severity: 'high',
            description: 'Resource opened without explicit close handling',
            healingPattern: 'resource_cleanup_wrapper'
        });
    }

    async analyzeCodeForVulnerabilities(code, filePath = 'unknown') {
        const analysis = {
            filePath,
            code,
            vulnerabilities: [],
            codeMetrics: this.calculateCodeMetrics(code),
            analysisTimestamp: Date.now()
        };

        // Pattern-based vulnerability detection
        for (const [vulnType, pattern] of this.vulnerabilityPatterns.entries()) {
            const matches = [...code.matchAll(pattern.pattern)];
            
            for (const match of matches) {
                analysis.vulnerabilities.push({
                    type: vulnType,
                    severity: pattern.severity,
                    description: pattern.description,
                    healingPattern: pattern.healingPattern,
                    location: {
                        line: this.getLineNumber(code, match.index),
                        column: this.getColumnNumber(code, match.index),
                        match: match[0]
                    },
                    confidence: this.calculateConfidence(vulnType, match[0])
                });
            }
        }

        // Advanced static analysis
        const advancedVulns = await this.performAdvancedAnalysis(code);
        analysis.vulnerabilities.push(...advancedVulns);

        // Sort vulnerabilities by severity and confidence
        analysis.vulnerabilities.sort((a, b) => {
            const severityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
            const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
            if (severityDiff !== 0) return severityDiff;
            return b.confidence - a.confidence;
        });

        this.analysisHistory.push(analysis);
        this.emit('code_analysis_completed', analysis);

        return analysis;
    }

    calculateCodeMetrics(code) {
        const lines = code.split('\n');
        const nonEmptyLines = lines.filter(line => line.trim().length > 0);
        
        return {
            totalLines: lines.length,
            codeLines: nonEmptyLines.length,
            complexity: this.calculateCyclomaticComplexity(code),
            functionCount: (code.match(/function\s+\w+|=>\s*{|class\s+\w+/g) || []).length,
            commentRatio: this.calculateCommentRatio(code),
            duplicateLines: this.findDuplicateLines(lines)
        };
    }

    calculateCyclomaticComplexity(code) {
        // Simplified cyclomatic complexity calculation
        const complexityKeywords = /\b(if|else|while|for|switch|case|catch|&&|\|\||\?)\b/g;
        const matches = code.match(complexityKeywords) || [];
        return matches.length + 1; // Base complexity of 1
    }

    calculateCommentRatio(code) {
        const commentLines = (code.match(/\/\/.*|\/\*[\s\S]*?\*\//g) || []).length;
        const totalLines = code.split('\n').length;
        return totalLines > 0 ? commentLines / totalLines : 0;
    }

    findDuplicateLines(lines) {
        const lineMap = new Map();
        let duplicates = 0;
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.length > 10) { // Only consider substantial lines
                lineMap.set(trimmed, (lineMap.get(trimmed) || 0) + 1);
            }
        }
        
        for (const count of lineMap.values()) {
            if (count > 1) duplicates += count - 1;
        }
        
        return duplicates;
    }

    getLineNumber(code, index) {
        return code.substring(0, index).split('\n').length;
    }

    getColumnNumber(code, index) {
        const lines = code.substring(0, index).split('\n');
        return lines[lines.length - 1].length + 1;
    }

    calculateConfidence(vulnType, matchText) {
        // Calculate confidence based on vulnerability type and context
        const baseConfidence = 0.7;
        
        // Adjust confidence based on context
        if (matchText.includes('try') || matchText.includes('catch')) {
            return baseConfidence * 0.5; // Lower confidence if already in error handling
        }
        
        if (matchText.includes('null') || matchText.includes('undefined')) {
            return baseConfidence * 1.2; // Higher confidence for explicit null handling
        }
        
        return Math.min(baseConfidence, 1.0);
    }

    async performAdvancedAnalysis(code) {
        const vulnerabilities = [];
        
        // Detect potential race conditions
        if (code.includes('setTimeout') && code.includes('setInterval')) {
            vulnerabilities.push({
                type: 'race_condition_risk',
                severity: 'medium',
                description: 'Potential race condition with mixed timers',
                healingPattern: 'timer_synchronization_wrapper',
                location: { line: 0, column: 0, match: 'timer_usage' },
                confidence: 0.6
            });
        }
        
        // Detect callback hell
        const callbackDepth = this.calculateCallbackDepth(code);
        if (callbackDepth > 3) {
            vulnerabilities.push({
                type: 'callback_hell',
                severity: 'medium',
                description: `Deep callback nesting (depth: ${callbackDepth})`,
                healingPattern: 'promise_chain_wrapper',
                location: { line: 0, column: 0, match: 'deep_callbacks' },
                confidence: 0.8
            });
        }
        
        return vulnerabilities;
    }

    calculateCallbackDepth(code) {
        // Simplified callback depth calculation
        const lines = code.split('\n');
        let maxDepth = 0;
        let currentDepth = 0;
        
        for (const line of lines) {
            const openBraces = (line.match(/\{/g) || []).length;
            const closeBraces = (line.match(/\}/g) || []).length;
            
            currentDepth += openBraces - closeBraces;
            maxDepth = Math.max(maxDepth, currentDepth);
        }
        
        return maxDepth;
    }
}

class VulnerabilityDetector extends EventEmitter {
    constructor() {
        super();
        this.detectionRules = new Map();
        this.falsePositiveFilters = new Map();
        this.initializeDetectionRules();
    }

    initializeDetectionRules() {
        // Advanced vulnerability detection rules
        this.detectionRules.set('sql_injection_risk', {
            pattern: /query\s*\(\s*["`'].*\$\{.*\}.*["`']\s*\)|exec\s*\(\s*["`'].*\+.*["`']\s*\)/g,
            severity: 'critical',
            description: 'Potential SQL injection vulnerability',
            mitigation: 'Use parameterized queries'
        });

        this.detectionRules.set('xss_risk', {
            pattern: /innerHTML\s*=\s*.*\+|document\.write\s*\(.*\+/g,
            severity: 'high',
            description: 'Potential XSS vulnerability',
            mitigation: 'Use textContent or sanitize input'
        });

        this.detectionRules.set('path_traversal_risk', {
            pattern: /fs\.(readFile|writeFile|unlink)\s*\(\s*.*\+.*\)/g,
            severity: 'high',
            description: 'Potential path traversal vulnerability',
            mitigation: 'Validate and sanitize file paths'
        });
    }

    async detectVulnerabilities(code, context = {}) {
        const vulnerabilities = [];
        
        for (const [ruleType, rule] of this.detectionRules.entries()) {
            const matches = [...code.matchAll(rule.pattern)];
            
            for (const match of matches) {
                // Apply false positive filters
                if (!this.isFalsePositive(ruleType, match[0], context)) {
                    vulnerabilities.push({
                        type: ruleType,
                        severity: rule.severity,
                        description: rule.description,
                        mitigation: rule.mitigation,
                        location: {
                            line: this.getLineNumber(code, match.index),
                            column: this.getColumnNumber(code, match.index),
                            match: match[0]
                        },
                        confidence: this.calculateDetectionConfidence(ruleType, match[0])
                    });
                }
            }
        }
        
        this.emit('vulnerabilities_detected', {
            vulnerabilities,
            context,
            timestamp: Date.now()
        });
        
        return vulnerabilities;
    }

    isFalsePositive(ruleType, matchText, context) {
        // Implement false positive filtering logic
        if (ruleType === 'sql_injection_risk' && matchText.includes('sanitize')) {
            return true; // Already sanitized
        }
        
        if (ruleType === 'xss_risk' && context.framework === 'react') {
            return true; // React handles XSS by default
        }
        
        return false;
    }

    calculateDetectionConfidence(ruleType, matchText) {
        // Calculate confidence based on rule type and context
        const baseConfidence = {
            'sql_injection_risk': 0.9,
            'xss_risk': 0.8,
            'path_traversal_risk': 0.85
        };
        
        return baseConfidence[ruleType] || 0.7;
    }

    getLineNumber(code, index) {
        return code.substring(0, index).split('\n').length;
    }

    getColumnNumber(code, index) {
        const lines = code.substring(0, index).split('\n');
        return lines[lines.length - 1].length + 1;
    }
}

class HealingPatternLibrary {
    constructor() {
        this.patterns = new Map();
        this.initializePatterns();
    }

    initializePatterns() {
        // Auto cleanup wrapper pattern
        this.patterns.set('auto_cleanup_wrapper', {
            name: 'Auto Cleanup Wrapper',
            description: 'Automatically cleanup resources when done',
            template: `
function withAutoCleanup(resourceFactory, operation) {
    let resource = null;
    try {
        resource = resourceFactory();
        return operation(resource);
    } finally {
        if (resource && typeof resource.cleanup === 'function') {
            resource.cleanup();
        } else if (resource && typeof resource.close === 'function') {
            resource.close();
        } else if (resource && typeof resource.dispose === 'function') {
            resource.dispose();
        }
    }
}`,
            usage: 'Wrap resource creation and usage in withAutoCleanup function'
        });

        // Promise error wrapper pattern
        this.patterns.set('promise_error_wrapper', {
            name: 'Promise Error Wrapper',
            description: 'Automatically handle promise rejections',
            template: `
function withErrorHandling(promiseFunction, errorHandler = console.error) {
    return async (...args) => {
        try {
            return await promiseFunction(...args);
        } catch (error) {
            errorHandler(error);
            throw error; // Re-throw if needed
        }
    };
}`,
            usage: 'Wrap async functions with withErrorHandling'
        });

        // Loop timeout wrapper pattern
        this.patterns.set('loop_timeout_wrapper', {
            name: 'Loop Timeout Wrapper',
            description: 'Prevent infinite loops with timeout protection',
            template: `
function withLoopTimeout(loopFunction, timeoutMs = 5000) {
    const startTime = Date.now();
    const originalFunction = loopFunction;
    
    return function(...args) {
        if (Date.now() - startTime > timeoutMs) {
            throw new Error('Loop timeout exceeded');
        }
        return originalFunction.apply(this, args);
    };
}`,
            usage: 'Wrap loop conditions with timeout protection'
        });

        // Null safety wrapper pattern
        this.patterns.set('null_safety_wrapper', {
            name: 'Null Safety Wrapper',
            description: 'Safe property access with null checking',
            template: `
function safeAccess(obj, path, defaultValue = null) {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
        if (current == null || typeof current !== 'object') {
            return defaultValue;
        }
        current = current[key];
    }
    
    return current !== undefined ? current : defaultValue;
}`,
            usage: 'Use safeAccess(obj, "prop.subprop") instead of obj.prop.subprop'
        });

        // Resource cleanup wrapper pattern
        this.patterns.set('resource_cleanup_wrapper', {
            name: 'Resource Cleanup Wrapper',
            description: 'Ensure resources are properly closed',
            template: `
class ResourceManager {
    constructor() {
        this.resources = new Set();
    }
    
    register(resource) {
        this.resources.add(resource);
        return resource;
    }
    
    cleanup() {
        for (const resource of this.resources) {
            try {
                if (typeof resource.close === 'function') {
                    resource.close();
                } else if (typeof resource.end === 'function') {
                    resource.end();
                } else if (typeof resource.destroy === 'function') {
                    resource.destroy();
                }
            } catch (error) {
                console.error('Resource cleanup error:', error);
            }
        }
        this.resources.clear();
    }
}`,
            usage: 'Register resources with ResourceManager and call cleanup()'
        });
    }

    getPattern(patternName) {
        return this.patterns.get(patternName);
    }

    getAllPatterns() {
        return Array.from(this.patterns.entries()).map(([name, pattern]) => ({
            name,
            ...pattern
        }));
    }

    findApplicablePatterns(vulnerabilities) {
        const applicablePatterns = new Set();
        
        for (const vuln of vulnerabilities) {
            if (vuln.healingPattern && this.patterns.has(vuln.healingPattern)) {
                applicablePatterns.add(vuln.healingPattern);
            }
        }
        
        return Array.from(applicablePatterns).map(name => ({
            name,
            ...this.patterns.get(name)
        }));
    }
}

class SelfHealingCodeGenerator extends EventEmitter {
    constructor(geminiApiKey) {
        super();
        this.geminiClient = new GoogleGenerativeAI(geminiApiKey);
        this.model = this.geminiClient.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        this.codeAnalyzer = new CodeAnalyzer();
        this.vulnerabilityDetector = new VulnerabilityDetector();
        this.healingPatternLibrary = new HealingPatternLibrary();
        
        this.generationHistory = [];
        this.setupEventHandlers();
        
        console.log('🔧 Self-Healing Code Generator initialized with Gemini AI');
    }

    setupEventHandlers() {
        this.codeAnalyzer.on('code_analysis_completed', (analysis) => {
            this.emit('analysis_completed', analysis);
        });
        
        this.vulnerabilityDetector.on('vulnerabilities_detected', (data) => {
            this.emit('vulnerabilities_detected', data);
        });
    }

    async generateSelfHealingWrapper(code, vulnerabilities, options = {}) {
        try {
            // Analyze code for additional context
            const analysis = await this.codeAnalyzer.analyzeCodeForVulnerabilities(code);
            
            // Find applicable healing patterns
            const applicablePatterns = this.healingPatternLibrary.findApplicablePatterns(vulnerabilities);
            
            // Generate healing wrapper using Gemini AI
            const healingWrapper = await this.generateWithGemini(code, vulnerabilities, applicablePatterns, options);
            
            // Validate generated code
            const validation = await this.validateGeneratedCode(healingWrapper);
            
            const result = {
                originalCode: code,
                healingWrapper,
                vulnerabilities,
                applicablePatterns,
                validation,
                generatedAt: Date.now(),
                options
            };
            
            this.generationHistory.push(result);
            this.emit('healing_wrapper_generated', result);
            
            return result;
        } catch (error) {
            console.error('❌ Self-healing wrapper generation failed:', error);
            this.emit('generation_failed', { error: error.message, code, vulnerabilities });
            throw error;
        }
    }

    async generateWithGemini(code, vulnerabilities, patterns, options) {
        const prompt = this.createHealingPrompt(code, vulnerabilities, patterns, options);
        
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const generatedCode = response.text();
            
            return this.extractCodeFromResponse(generatedCode);
        } catch (error) {
            console.error('❌ Gemini generation failed:', error);
            throw new Error(`Gemini AI generation failed: ${error.message}`);
        }
    }

    createHealingPrompt(code, vulnerabilities, patterns, options) {
        const vulnDescriptions = vulnerabilities.map(v => 
            `- ${v.type}: ${v.description} (severity: ${v.severity})`
        ).join('\n');
        
        const patternDescriptions = patterns.map(p => 
            `- ${p.name}: ${p.description}`
        ).join('\n');
        
        return `
You are an expert software engineer specializing in self-healing code generation. 
Your task is to create a robust, self-healing wrapper for the provided code that addresses the identified vulnerabilities.

ORIGINAL CODE:
\`\`\`javascript
${code}
\`\`\`

IDENTIFIED VULNERABILITIES:
${vulnDescriptions}

AVAILABLE HEALING PATTERNS:
${patternDescriptions}

REQUIREMENTS:
1. Create a self-healing wrapper that addresses ALL identified vulnerabilities
2. Maintain the original functionality while adding resilience
3. Use appropriate error handling, timeouts, and resource management
4. Include automatic recovery mechanisms where possible
5. Add comprehensive logging for debugging
6. Ensure the wrapper is production-ready and performant
7. Include JSDoc comments explaining the healing mechanisms

HEALING WRAPPER FEATURES TO INCLUDE:
- Automatic error recovery with exponential backoff
- Resource cleanup and memory leak prevention
- Timeout protection for long-running operations
- Null safety and defensive programming
- Circuit breaker pattern for external dependencies
- Graceful degradation on failures
- Performance monitoring and alerting

Please generate a complete, production-ready self-healing wrapper that transforms the vulnerable code into a resilient, self-recovering system.

Return only the JavaScript code with comprehensive comments explaining the healing mechanisms.
`;
    }

    extractCodeFromResponse(response) {
        // Extract JavaScript code from Gemini response
        const codeBlockRegex = /```(?:javascript|js)?\n([\s\S]*?)\n```/g;
        const matches = [...response.matchAll(codeBlockRegex)];
        
        if (matches.length > 0) {
            return matches[0][1].trim();
        }
        
        // If no code blocks found, return the entire response (might be just code)
        return response.trim();
    }

    async validateGeneratedCode(code) {
        const validation = {
            syntaxValid: false,
            vulnerabilitiesAddressed: 0,
            healingMechanisms: [],
            codeQuality: {},
            recommendations: []
        };
        
        try {
            // Basic syntax validation
            new Function(code);
            validation.syntaxValid = true;
        } catch (error) {
            validation.syntaxError = error.message;
        }
        
        // Check for healing mechanisms
        const healingKeywords = [
            'try', 'catch', 'finally', 'timeout', 'cleanup', 'recovery',
            'retry', 'fallback', 'circuit', 'breaker', 'monitor'
        ];
        
        for (const keyword of healingKeywords) {
            if (code.toLowerCase().includes(keyword)) {
                validation.healingMechanisms.push(keyword);
            }
        }
        
        // Analyze code quality
        validation.codeQuality = {
            hasErrorHandling: code.includes('try') && code.includes('catch'),
            hasResourceCleanup: code.includes('finally') || code.includes('cleanup'),
            hasTimeoutProtection: code.includes('timeout') || code.includes('setTimeout'),
            hasLogging: code.includes('console.') || code.includes('log'),
            hasComments: code.includes('//') || code.includes('/*')
        };
        
        return validation;
    }

    async injectHealingPatterns(code, patterns) {
        const injectedCode = code;
        const injectionResults = [];
        
        for (const pattern of patterns) {
            try {
                const injectionResult = await this.injectSinglePattern(injectedCode, pattern);
                injectionResults.push(injectionResult);
            } catch (error) {
                console.error(`❌ Pattern injection failed for ${pattern.name}:`, error);
                injectionResults.push({
                    pattern: pattern.name,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return {
            injectedCode,
            injectionResults,
            totalPatterns: patterns.length,
            successfulInjections: injectionResults.filter(r => r.success).length
        };
    }

    async injectSinglePattern(code, pattern) {
        // This would implement specific pattern injection logic
        // For now, return a simple success result
        return {
            pattern: pattern.name,
            success: true,
            injectionPoint: 'function_wrapper',
            modifications: ['added_error_handling', 'added_cleanup']
        };
    }

    getGenerationMetrics() {
        const totalGenerations = this.generationHistory.length;
        const successfulGenerations = this.generationHistory.filter(g => g.validation.syntaxValid).length;
        
        return {
            totalGenerations,
            successfulGenerations,
            successRate: totalGenerations > 0 ? successfulGenerations / totalGenerations : 0,
            averageVulnerabilitiesPerGeneration: this.generationHistory.reduce((sum, g) => sum + g.vulnerabilities.length, 0) / totalGenerations || 0,
            averageHealingMechanisms: this.generationHistory.reduce((sum, g) => sum + g.validation.healingMechanisms.length, 0) / totalGenerations || 0
        };
    }
}

export { SelfHealingCodeGenerator, CodeAnalyzer, VulnerabilityDetector, HealingPatternLibrary };
