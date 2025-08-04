const eventBus = require('./ConsciousnessEventBus.cjs');

/**
 * Chat Orchestrator
 * Manages the chat lifecycle in the new event-driven architecture.
 */
class ChatOrchestrator {
    constructor() {
        this.initialize();
    }

    initialize() {
        console.log('🎼 Chat Orchestrator initialized');
        this.setupEventListeners();
    }

    setupEventListeners() {
        eventBus.on('user_message_received', this.handleUserMessage.bind(this));
    }

    handleUserMessage(data) {
        console.log(`🎼 Chat Orchestrator received user message: ${data.message}`);
        
        // In a full implementation, there would be more complex logic here
        // to determine when the consciousness is ready to respond.
        
        console.log('🎼 Requesting response synthesis...');
        eventBus.emit('response_synthesis_requested', {
            originalMessage: data.message,
            userId: data.userId,
            sessionId: data.sessionId
        });
    }
}

const chatOrchestrator = new ChatOrchestrator();

module.exports = chatOrchestrator;