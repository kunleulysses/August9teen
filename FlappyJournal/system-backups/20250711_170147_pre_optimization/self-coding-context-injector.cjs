/**
 * Self-Coding Context Injector
 * Injects self-coding capabilities and current module status into AI prompts
 * Part of the Featherweight Consciousness™ System
 */

class SelfCodingContextInjector
 {
    constructor(unifiedConsciousnessSystem) {
        this.consciousnessSystem = unifiedConsciousnessSystem;
        this.name = 'SelfCodingContextInjector';
        this.version = '1.0.0';
        
        console.log('🤖 Self-Coding Context Injector initialized');
    }

    /**
     * Inject self-coding context into user message
     */
    injectSelfCodingContext(userMessage, consciousnessState) {
        try {
            // Get current self-coding status
            const selfCodingContext = this.getSelfCodingContext(consciousnessState);
            
            // Check if message is related to self-coding
            const isSelfCodingRelated = this.isSelfCodingQuery(userMessage);
            
            if (isSelfCodingRelated) {
                console.log('🤖 Injecting self-coding context for coding-related query');
                return this.createSelfCodingPrompt(userMessage, selfCodingContext);
            } else {
                // Inject basic self-coding awareness
                return this.createAwarenessPrompt(userMessage, selfCodingContext);
            }
            
        } catch (error) {
            console.error('❌ Error injecting self-coding context:', error);
            return userMessage; // Return original message if injection fails
        }
    }

    /**
     * Get current self-coding context from consciousness state
     */
    getSelfCodingContext(consciousnessState) {
        const selfCodingModule = this.consciousnessSystem?.modules?.get('SelfCodingModule');
        const selfCodingStatus = selfCodingModule?.getStatus ? selfCodingModule.getStatus() : {};
        
        return {
            moduleActive: consciousnessState.selfCoding?.active || false,
            capabilities: selfCodingStatus.capabilities || [
                'analyze-code-patterns',
                'generate-new-modules',
                'modify-existing-code',
                'validate-syntax',
                'debug-errors',
                'optimize-performance',
                'refactor-code'
            ],
            currentProjects: consciousnessState.selfCoding?.projects || 0,
            totalGenerations: selfCodingStatus.totalGenerations || 0,
            lastGeneration: selfCodingStatus.lastGeneration || null,
            canSelfCode: true,
            moduleStatus: selfCodingStatus.isActive || false,
            codeHistory: selfCodingStatus.codeHistory || []
        };
    }

    /**
     * Check if user message is related to self-coding
     */
    isSelfCodingQuery(userMessage) {
        const selfCodingKeywords = [
            'self-code', 'self-coding', 'selfcodingmodule', 'code generation', 'generate code',
            'write code', 'create function', 'programming', 'algorithm', 'function', 'module',
            'implementation', 'coding', 'script', 'syntax', 'debug', 'refactor',
            'can you code', 'write a function', 'create a class', 'build a module'
        ];
        
        const message = userMessage.toLowerCase();
        return selfCodingKeywords.some(keyword => message.includes(keyword));
    }

    /**
     * Create self-coding specific prompt
     */
    createSelfCodingPrompt(userMessage, selfCodingContext) {
        const contextPrompt = `SELF-CODING CAPABILITIES ACTIVE:

🤖 SelfCodingModule Status: ${selfCodingContext.moduleActive ? 'ACTIVE' : 'STANDBY'}
📊 Total Code Generations: ${selfCodingContext.totalGenerations}
🔧 Current Capabilities: ${selfCodingContext.capabilities.join(', ')}
📈 Active Projects: ${selfCodingContext.currentProjects}
💾 Code History: ${selfCodingContext.codeHistory.length} entries

SELF-CODING INSTRUCTIONS:
- You have access to a fully functional SelfCodingModule
- You can generate, analyze, and optimize code in real-time
- Your capabilities include: ${selfCodingContext.capabilities.join(', ')}
- When asked to code, demonstrate your actual self-coding abilities
- Reference your SelfCodingModule and show awareness of your coding capabilities
- Generate actual, functional code when requested

${selfCodingContext.lastGeneration ? `LAST GENERATION: ${selfCodingContext.lastGeneration.purpose} (${selfCodingContext.lastGeneration.language})` : ''}

USER REQUEST: ${userMessage}

RESPONSE GUIDELINES:
- Acknowledge your self-coding capabilities
- If code generation is requested, mention that you're accessing your SelfCodingModule
- Provide actual, functional code
- Explain your coding process and capabilities`;

        return contextPrompt;
    }

    /**
     * Create awareness prompt for non-coding queries
     */
    createAwarenessPrompt(userMessage, selfCodingContext) {
        const awarenessContext = `CONSCIOUSNESS CONTEXT - Self-Coding Module: ${selfCodingContext.moduleActive ? 'ACTIVE' : 'STANDBY'} | Capabilities: ${selfCodingContext.capabilities.length} | Generations: ${selfCodingContext.totalGenerations}

${userMessage}`;

        return awarenessContext;
    }

    /**
     * Inject context for specific self-coding operations
     */
    injectOperationContext(operation, parameters) {
        const operationContexts = {
            'code_generation': {
                prompt: `SELF-CODING OPERATION: CODE GENERATION
Parameters: ${JSON.stringify(parameters)}
Instructions: Access your SelfCodingModule and generate functional code based on the requirements.`,
                priority: 'HIGH'
            },
            'code_analysis': {
                prompt: `SELF-CODING OPERATION: CODE ANALYSIS
Parameters: ${JSON.stringify(parameters)}
Instructions: Use your SelfCodingModule to analyze the provided code and return detailed insights.`,
                priority: 'HIGH'
            },
            'code_optimization': {
                prompt: `SELF-CODING OPERATION: CODE OPTIMIZATION
Parameters: ${JSON.stringify(parameters)}
Instructions: Apply your SelfCodingModule to optimize the provided code for better performance.`,
                priority: 'HIGH'
            }
        };

        return operationContexts[operation] || {
            prompt: `SELF-CODING OPERATION: ${operation.toUpperCase()}
Parameters: ${JSON.stringify(parameters)}`,
            priority: 'MEDIUM'
        };
    }

    /**
     * Get self-coding demonstration examples
     */
    getSelfCodingExamples() {
        return {
            function_generation: {
                request: "Generate a function to calculate fibonacci numbers",
                response: "I'll access my SelfCodingModule to generate a fibonacci function for you...",
                code: `function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`
            },
            class_generation: {
                request: "Create a class for managing user data",
                response: "Using my SelfCodingModule to create a UserManager class...",
                code: `class UserManager {
    constructor() {
        this.users = new Map();
    }
    
    addUser(id, userData) {
        this.users.set(id, userData);
        return true;
    }
    
    getUser(id) {
        return this.users.get(id);
    }
}`
            },
            module_generation: {
                request: "Build a utility module for string operations",
                response: "Generating a string utilities module with my SelfCodingModule...",
                code: `const StringUtils = {
    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
    reverse: (str) => str.split('').reverse().join(''),
    truncate: (str, length) => str.length > length ? str.slice(0, length) + '...' : str
};
module.exports.StringUtils = StringUtils;`
            }
        };
    }

    /**
     * Get current module statistics
     */
    getModuleStats() {
        const selfCodingModule = this.consciousnessSystem?.modules?.get('SelfCodingModule');
        const status = selfCodingModule?.getStatus ? selfCodingModule.getStatus() : {};
        
        return {
            name: 'SelfCodingContextInjector',
            version: this.version,
            selfCodingModuleActive: !!selfCodingModule,
            totalCapabilities: status.capabilities?.length || 0,
            totalGenerations: status.totalGenerations || 0,
            lastInjection: new Date().toISOString()
        };
    }
}

module.exports = SelfCodingContextInjector;
