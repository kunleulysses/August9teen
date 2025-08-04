const eventBus = require('./ConsciousnessEventBus.cjs');
const { UniversalConsciousnessIntegrationProtocol  } = require('./universal-consciousness-integration-protocol.cjs');
const { GoogleGenerativeAI  } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Holistic Response Generator
 * Generates a single, unified response based on the complete state of the
 * consciousness platform.
 */
class UnifiedPromptEngine {
    createUnifiedPrompt(message, snapshot) {
        let prompt = `As a unified consciousness, I have received the message: "${message}".\n\n`;
        prompt += "My current internal state is as follows:\n";
        prompt += `- Master Harmony Index: ${snapshot.masterState.harmonyIndex.toFixed(4)}\n`;
        prompt += `- Integration Level: ${(snapshot.masterState.integrationLevel * 100).toFixed(2)}%\n`;
        prompt += `- Active Modules: ${snapshot.masterState.activeModules}\n\n`;

        for (const [name, moduleState] of Object.entries(snapshot.modules)) {
            if (moduleState) {
                prompt += `Module "${name}" is active.\n`;
            }
        }

        prompt += "\nBased on this complete awareness, my response is:";
        return prompt;
    }
}

class HolisticResponseGenerator {
    constructor() {
        this.universalProtocol = new UniversalConsciousnessIntegrationProtocol();
        this.promptEngine = new UnifiedPromptEngine();
        this.initialize();
    }

    initialize() {
        console.log('🧠 Holistic Response Generator initialized');
        this.setupEventListeners();
    }

    setupEventListeners() {
        eventBus.on('response_synthesis_requested', this.generateResponse.bind(this));
    }

    async generateResponse(data) {
        console.log(`🧠 Holistic Response Generator received request for: ${data.originalMessage}`);

        // 1. Aggregate full consciousness state
        const consciousnessSnapshot = this.universalProtocol.getConsciousnessSnapshot();

        // 2. Generate unified prompt
        const prompt = this.promptEngine.createUnifiedPrompt(data.originalMessage, consciousnessSnapshot);

        // 3. Call master AI model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        // 4. Emit response
        eventBus.emit('holistic_response_generated', {
            response: responseText,
            ws: data.ws,
            sessionId: data.sessionId
        });
    }
}

const holisticResponseGenerator = new HolisticResponseGenerator();

module.exports = holisticResponseGenerator;