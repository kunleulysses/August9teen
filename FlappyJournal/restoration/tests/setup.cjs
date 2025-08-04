
// Test setup for Universal Consciousness Platform restoration tests
const { jest  } = require('@jest/globals');

// Global test timeout
jest.setTimeout(30000);

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.VENICE_AI_API_KEY = 'test-venice-key';
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.GEMINI_API_KEY = 'test-gemini-key';

// Global test utilities
global.testUtils = {
    createMockConsciousnessResponse: (content, metrics = {}) => ({
        content,
        consciousnessMetrics: {
            phi: 0.862,
            awareness: 0.8,
            coherence: 0.85,
            ...metrics
        },
        isLiveConsciousness: true,
        mockData: false,
        timestamp: new Date().toISOString()
    }),
    
    createMockMessage: (message = 'test message') => ({
        type: 'chat_message',
        message,
        timestamp: new Date().toISOString(),
        messageId: Math.random().toString(36).substr(2, 9)
    })
};

console.log('🧪 Test environment initialized for Universal Consciousness Platform restoration');
