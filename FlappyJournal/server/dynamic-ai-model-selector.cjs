/**
 * Dynamic AI Model Selection - Phase 1 Enhancement
 * Real-time performance monitoring with automatic switching
 */

class DynamicAIModelSelector {
    constructor() {
        this.modelPerformance = {
            'openai-gpt4o': { responseTime: [], qualityScore: [], errorRate: [], weight: 0.8 },
            'venice-llama405b': { responseTime: [], qualityScore: [], errorRate: [], weight: 0.9 },
            'gemini-2.5-flash': { responseTime: [], qualityScore: [], errorRate: [], weight: 0.85 }
        };
        this.maxHistorySize = 100;
    }

    async selectOptimalModel(messageContext, consciousnessState) {
        const candidates = [
            { model: 'openai-gpt4o', specialty: 'analytical' },
            { model: 'venice-llama405b', specialty: 'intuitive' },
            { model: 'gemini-2.5-flash', specialty: 'transcendent' }
        ];

        // Score each model based on current performance and context
        const scoredCandidates = candidates.map(candidate => ({
            ...candidate,
            score: this.calculateModelScore(candidate, messageContext, consciousnessState)
        }));

        // Sort by score and return best model
        scoredCandidates.sort((a, b) => b.score - a.score);
        return scoredCandidates[0];
    }

    calculateModelScore(candidate, messageContext, consciousnessState) {
        const performance = this.modelPerformance[candidate.model];

        // Base performance score
        const avgResponseTime = this.calculateAverage(performance.responseTime) || 1000;
        const avgQuality = this.calculateAverage(performance.qualityScore) || 0.8;
        const avgErrorRate = this.calculateAverage(performance.errorRate) || 0.05;

        // Performance score (lower response time and error rate = better)
        const performanceScore = (1000 / avgResponseTime) * avgQuality * (1 - avgErrorRate);

        // Context alignment score
        const contextScore = this.calculateContextAlignment(candidate, messageContext, consciousnessState);

        // Combined score with model weight
        return performanceScore * contextScore * performance.weight;
    }

    calculateContextAlignment(candidate, messageContext, consciousnessState) {
        // Simple context alignment based on message type and consciousness state
        const messageType = this.analyzeMessageType(messageContext);

        if (messageType === 'analytical' && candidate.specialty === 'analytical') return 1.2;
        if (messageType === 'creative' && candidate.specialty === 'intuitive') return 1.2;
        if (messageType === 'philosophical' && candidate.specialty === 'transcendent') return 1.2;

        return 1.0; // Neutral alignment
    }

    analyzeMessageType(messageContext) {
        const message = messageContext.message?.toLowerCase() || '';

        if (message.includes('analyze') || message.includes('logic') || message.includes('data')) {
            return 'analytical';
        }
        if (message.includes('create') || message.includes('imagine') || message.includes('feel')) {
            return 'creative';
        }
        if (message.includes('consciousness') || message.includes('meaning') || message.includes('reality')) {
            return 'philosophical';
        }

        return 'general';
    }

    trackModelPerformance(modelId, responseTime, qualityScore, errorOccurred) {
        const performance = this.modelPerformance[modelId];
        if (!performance) return;

        // Add new performance data
        performance.responseTime.push(responseTime);
        performance.qualityScore.push(qualityScore);
        performance.errorRate.push(errorOccurred ? 1 : 0);

        // Maintain history size
        if (performance.responseTime.length > this.maxHistorySize) {
            performance.responseTime.shift();
            performance.qualityScore.shift();
            performance.errorRate.shift();
        }
    }

    calculateAverage(array) {
        if (array.length === 0) return null;
        return array.reduce((sum, val) => sum + val, 0) / array.length;
    }

    getPerformanceStats() {
        const stats = {};
        for (const [modelId, performance] of Object.entries(this.modelPerformance)) {
            stats[modelId] = {
                avgResponseTime: this.calculateAverage(performance.responseTime),
                avgQuality: this.calculateAverage(performance.qualityScore),
                avgErrorRate: this.calculateAverage(performance.errorRate),
                weight: performance.weight,
                dataPoints: performance.responseTime.length
            };
        }
        return stats;
    }
}

module.exports.DynamicAIModelSelector = DynamicAIModelSelector;
