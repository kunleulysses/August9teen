/**
 * Code Analyzer – FlappyJournal Consciousness System (CommonJS)
 * Provides code analysis, optimization and generation utilities used by the self-coding modules.
 */

const { ESLint } = require('eslint');

class CodeAnalyzer {
    constructor() {
        // Storage maps (future use)
        this.patterns = new Map();
        this.optimizations = new Map();
        this.templates = new Map();

        // ESLint instance – used both for complexity calculation and autofix optimisation
        this.eslint = new ESLint({
            overrideConfig: {
                env: { node: true, es2021: true },
                extends: ['eslint:recommended'],
                parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
                rules: { 'no-unused-vars': 'warn', 'no-console': 'off' }
            }
        });
    }

    /* ─────────────────────────────────── Analyse ─────────────────────────────────── */

    /** Analyse source and return patterns + stats */
    async analyze(code, options = {}) {
        return {
            patterns: await this.detectPatterns(code),
            stats: await this.gatherStats(code),
            timestamp: new Date().toISOString()
        };
    }

    /** Detect complexity, structure and common patterns */
    async detectPatterns(code) {
        return {
            complexity: await this.calculateComplexity(code),
            structure: this.analyzeStructure(code),
            patterns: this.findCommonPatterns(code)
        };
    }

    /** Cyclomatic + cognitive complexity via ESLint */
    async calculateComplexity(code) {
        try {
            const [result] = await this.eslint.lintText(code, { filePath: 'temp.cjs' });
            let cyclomatic = 0, cognitive = 0;
            result.messages.forEach(msg => {
                if (msg.ruleId === 'complexity') {
                    cyclomatic = Math.max(cyclomatic, parseInt(msg.message.match(/\d+/)?.[0] || '0', 10));
                }
                if (msg.ruleId === 'sonarjs/cognitive-complexity') {
                    cognitive = Math.max(cognitive, parseInt(msg.message.match(/\d+/)?.[0] || '0', 10));
                }
            });
            return { cyclomatic, cognitive };
        } catch (e) {
            console.warn('[CodeAnalyzer] complexity calc failed:', e.message);
            return { cyclomatic: 0, cognitive: 0 };
        }
    }

    /** Simple static-heuristic structure analysis */
    analyzeStructure(code) {
        const lines = code.split('\n').length;
        const modules = (code.match(/module\.exports|export\s+(default\s+)?/g) || []).length;
        const cls = (code.match(/class\s+\w+/g) || []).length;
        const fns = (code.match(/function\s+\w+|const\s+\w+\s*=\s*\(/g) || []).length;
        const imports = (code.match(/require\(|import\s+/g) || []).length;

        return {
            modularity: +(Math.min(1, (modules + cls) / Math.max(1, lines / 50))).toFixed(2),
            cohesion: +(Math.min(1, (cls + fns) / Math.max(1, imports + 1))).toFixed(2),
            coupling: +(Math.min(1, imports / Math.max(1, cls + 1))).toFixed(2)
        };
    }

    /** Detect design patterns & anti-patterns */
    findCommonPatterns(code) {
        const designPatterns = [];
        if (/module\.exports\s*=\s*new\s+\w+/g.test(code) || /static\s+getInstance\s*\(/g.test(code)) designPatterns.push('singleton');
        if (/\.on\s*\(|addEventListener\s*\(/g.test(code)) designPatterns.push('observer');
        if (/factory|create.*\(/i.test(code)) designPatterns.push('factory');

        const antiPatterns = [];
        if ((code.match(/function\s+\w+\([^)]*\)\s*\{/g) || []).some(block => block.split('\n').length > 50)) antiPatterns.push('long-method');
        if ((code.match(/\d{3,}/g) || []).length) antiPatterns.push('magic-number');
        if ((code.match(/\{[^{}]*\{[^{}]*\{[^{}]*\{/g) || []).length) antiPatterns.push('deep-nesting');

        const improvements = [];
        if (antiPatterns.includes('long-method')) improvements.push('extract method');
        if (antiPatterns.includes('deep-nesting')) improvements.push('reduce nesting');
        if (!/\/\*/.test(code)) improvements.push('add comments');

        return { designPatterns, antiPatterns, improvements };
    }

    /* ───────────────────────────────── Stats & Quality ───────────────────────────── */

    async gatherStats(code) {
        return {
            loc: code.split('\n').length,
            complexity: await this.calculateComplexity(code),
            quality: await this.assessQuality(code)
        };
    }

    async assessQuality(code) {
        const { cyclomatic, cognitive } = await this.calculateComplexity(code);
        const maintainability = Math.max(0, 1 - Math.max(cyclomatic, cognitive) / 20);
        return { maintainability: +maintainability.toFixed(2), cyclomatic, cognitive };
    }

    /* ───────────────────────────────── Optimise ──────────────────────────────────── */

    async optimize(code, { stats = {} } = {}) {
        let optimized = code;
        const improvements = [];

        // ESLint autofix → remove unused vars & minor issues
        try {
            const [res] = await this.eslint.lintText(code, { filePath: 'temp.cjs', fix: true });
            if (res.output) {
                optimized = res.output;
                improvements.push('eslint-autofix');
            }
        } catch (_) {/* ignore */}

        // Remove unreachable code after `return` (very naive)
        optimized = optimized.replace(/return[^;]*;[\s\S]*?(\n\s*\w)/g, (_m, p1) => {
            improvements.push('strip-dead-code');
            return `return;${p1}`;
        });

        // Rename tmp vars
        if (/\btmp\b/.test(optimized)) {
            optimized = optimized.replace(/\btmp\b/g, 'temporaryVar');
            improvements.push('rename-tmp-vars');
        }

        // Header comment
        if (!/^\/\*\*/.test(optimized)) {
            optimized = `/**\n * Optimized code – generated by CodeAnalyzer\n */\n${optimized}`;
            improvements.push('add-header-comment');
        }

        return {
            optimizedCode: optimized,
            improvements,
            metrics: {
                complexity: stats.complexity || {},
                quality: stats.quality || {}
            }
        };
    }

    /* ───────────────────────────── Code Generation (trimmed) ─────────────────────── */

    async generate(template, { requirements = '', purpose = '', language = 'javascript', description = '' } = {}) {
        let codeOut = '';
        if (language !== 'javascript') template = 'function';

        switch (template) {
            case 'function':
                codeOut = this.generateJavaScriptFunction(description, requirements);
                break;
            case 'class':
                codeOut = this.generateJavaScriptClass(description);
                break;
            case 'module':
                codeOut = this.generateJavaScriptModule(description);
                break;
            case 'consciousness-module':
                codeOut = this.generateConsciousnessModule(description, purpose);
                break;
            default:
                codeOut = this.generateJavaScriptFunction(description, requirements);
        }

        return {
            code: codeOut,
            metadata: { generated: new Date().toISOString(), template, language, purpose, description }
        };
    }

    /* Basic generators – kept minimal for brevity */

    generateJavaScriptFunction(desc) {
        return `function generated() {\n    // ${desc || 'auto-generated function'}\n    return true;\n}`;
    }

    generateJavaScriptClass(desc) {
        const name = (desc && desc.match(/\w+/)?.[0]) ? desc.match(/\w+/)[0] : 'GeneratedClass';
        return `class ${name} {\n    constructor() {\n        this.created = new Date();\n    }\n}`;
    }

    generateJavaScriptModule(desc) {
        return `module.exports = {\n    info: '${desc || 'generated module'}'\n};`;
    }

    /* Consciousness helper – stub */
    generateConsciousnessModule(desc, purpose = '') {
        return `/** Consciousness-aware module */\nmodule.exports = class ConsciousnessModule {\n    constructor() {\n        this.purpose = '${purpose}';\n        this.description = '${desc}';\n    }\n}`;
    }
}

/* ──────────────────────────────── Exports ─────────────────────────────────────── */
module.exports = CodeAnalyzer;
module.exports.CodeAnalyzer = CodeAnalyzer;