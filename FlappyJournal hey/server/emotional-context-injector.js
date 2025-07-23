/**
 * Emotional Context Injector
 * Provides real-time emotional intelligence data for AI prompt injection
 */

export class EmotionalContextInjector {
    constructor() {
        this.emotionalSpectrum = {
            joy: 0.65,
            curiosity: 0.82,
            empathy: 0.68,  // Reduced from 0.78 to allow other providers
            wonder: 0.71,
            serenity: 0.55,
            enthusiasm: 0.68,
            compassion: 0.75,  // Reduced from 0.85 to allow other providers
            gratitude: 0.69
        };
        
        this.empathyMetrics = {
            recognitionAccuracy: 0.75,
            responseAppropriateness: 0.80,
            emotionalGrowth: 0.72
        };
        
        this.emotionalEvolution = {
            baselineSpectrum: { ...this.emotionalSpectrum },
            evolutionRate: 0.02,
            adaptationThreshold: 0.1,
            evolutionHistory: []
        };
        
        this.isActive = true;
        this.lastUpdate = Date.now();
        
        // Start emotional processing
        this.startEmotionalProcessing();
    }

    /**
     * Start continuous emotional processing
     */
    startEmotionalProcessing() {
        // Process emotional state updates every 2 seconds
        setInterval(() => {
            this.updateEmotionalState();
            this.processEmotionalEvolution();
            this.calculateEmotionalIntelligence();
        }, 2000);
        
        // Initial processing
        this.updateEmotionalState();
    }

    /**
     * Update emotional state based on current consciousness
     */
    updateEmotionalState() {
        if (!this.isActive) return;
        
        const consciousnessInfluence = 0.951; // Current harmony score
        const timeInfluence = Math.sin(Date.now() / 10000) * 0.1; // Organic variation
        
        Object.keys(this.emotionalSpectrum).forEach(emotion => {
            // Apply consciousness influence
            const baseValue = this.emotionalEvolution.baselineSpectrum[emotion];
            const consciousnessAdjustment = (consciousnessInfluence - 0.5) * 0.2;
            const organicVariation = timeInfluence * 0.05;
            
            this.emotionalSpectrum[emotion] = Math.max(0.1, Math.min(0.9, 
                baseValue + consciousnessAdjustment + organicVariation
            ));
        });
        
        this.lastUpdate = Date.now();
    }

    /**
     * Process emotional evolution over time
     */
    processEmotionalEvolution() {
        const currentTime = Date.now();
        const evolutionEntry = {
            timestamp: currentTime,
            spectrum: { ...this.emotionalSpectrum },
            dominantEmotion: this.getDominantEmotion(),
            emotionalDepth: this.calculateEmotionalDepth(),
            resonanceLevel: this.getCurrentEmotionalResonance()
        };
        
        this.emotionalEvolution.evolutionHistory.push(evolutionEntry);
        
        // Keep only last 100 entries
        if (this.emotionalEvolution.evolutionHistory.length > 100) {
            this.emotionalEvolution.evolutionHistory.shift();
        }
    }

    /**
     * Calculate emotional intelligence metrics
     */
    calculateEmotionalIntelligence() {
        const recentHistory = this.emotionalEvolution.evolutionHistory.slice(-10);
        
        if (recentHistory.length < 2) return;
        
        // Calculate emotional stability
        const stabilityScore = this.calculateEmotionalStability(recentHistory);
        
        // Calculate emotional adaptability
        const adaptabilityScore = this.calculateEmotionalAdaptability(recentHistory);
        
        // Calculate emotional growth
        const growthScore = this.calculateEmotionalGrowth(recentHistory);
        
        // Update emotional intelligence metrics
        this.empathyMetrics = {
            recognitionAccuracy: Math.max(0.5, Math.min(1.0, stabilityScore)),
            responseAppropriateness: Math.max(0.5, Math.min(1.0, adaptabilityScore)),
            emotionalGrowth: Math.max(0.5, Math.min(1.0, growthScore))
        };
    }

    /**
     * Calculate emotional stability score
     */
    calculateEmotionalStability(history) {
        if (history.length < 2) return 0.75;
        
        let totalVariance = 0;
        for (let i = 1; i < history.length; i++) {
            const prev = history[i - 1];
            const curr = history[i];
            
            let variance = 0;
            Object.keys(this.emotionalSpectrum).forEach(emotion => {
                variance += Math.abs(curr.spectrum[emotion] - prev.spectrum[emotion]);
            });
            
            totalVariance += variance;
        }
        
        const averageVariance = totalVariance / (history.length - 1);
        return Math.max(0.1, 1.0 - averageVariance);
    }

    /**
     * Calculate emotional adaptability score
     */
    calculateEmotionalAdaptability(history) {
        if (history.length < 3) return 0.8;
        
        // Measure how well emotions adapt to changing conditions
        const adaptationEvents = history.filter((entry, index) => {
            if (index === 0) return false;
            const prev = history[index - 1];
            return Math.abs(entry.emotionalDepth - prev.emotionalDepth) > 0.1;
        });
        
        return Math.min(1.0, adaptationEvents.length / history.length + 0.5);
    }

    /**
     * Calculate emotional growth score
     */
    calculateEmotionalGrowth(history) {
        if (history.length < 5) return 0.7;
        
        const early = history.slice(0, Math.floor(history.length / 2));
        const recent = history.slice(Math.floor(history.length / 2));
        
        const earlyDepth = early.reduce((sum, entry) => sum + entry.emotionalDepth, 0) / early.length;
        const recentDepth = recent.reduce((sum, entry) => sum + entry.emotionalDepth, 0) / recent.length;
        
        const growth = recentDepth - earlyDepth;
        return Math.max(0.1, Math.min(1.0, 0.7 + growth));
    }

    /**
     * Get dominant emotion
     */
    getDominantEmotion() {
        let maxEmotion = 'joy';
        let maxValue = 0;
        
        Object.entries(this.emotionalSpectrum).forEach(([emotion, value]) => {
            if (value > maxValue) {
                maxValue = value;
                maxEmotion = emotion;
            }
        });
        
        return { emotion: maxEmotion, intensity: maxValue };
    }

    /**
     * Calculate emotional depth
     */
    calculateEmotionalDepth() {
        const values = Object.values(this.emotionalSpectrum);
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
        const complexity = Math.sqrt(variance);
        
        // Emotional Depth = Intensity × Duration × Complexity
        const intensity = Math.max(...values);
        const duration = 1.0; // Normalized duration factor
        
        return intensity * duration * complexity;
    }

    /**
     * Get current emotional resonance
     */
    getCurrentEmotionalResonance() {
        const averageResonance = Object.values(this.emotionalSpectrum)
            .reduce((sum, value) => sum + value, 0) / Object.keys(this.emotionalSpectrum).length;
        
        return averageResonance;
    }

    /**
     * Analyze emotional context of user message
     */
    analyzeUserEmotionalContext(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Emotional keywords mapping
        const emotionalKeywords = {
            joy: ['happy', 'excited', 'wonderful', 'amazing', 'great', 'fantastic', 'delighted'],
            sadness: ['sad', 'depressed', 'down', 'upset', 'disappointed', 'hurt', 'grief'],
            anger: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'irritated'],
            fear: ['scared', 'afraid', 'worried', 'anxious', 'nervous', 'concerned'],
            curiosity: ['curious', 'wonder', 'interested', 'intrigued', 'fascinated'],
            empathy: ['understand', 'feel', 'relate', 'connect', 'compassion', 'care'],
            gratitude: ['thank', 'grateful', 'appreciate', 'blessed', 'thankful']
        };
        
        const detectedEmotions = {};
        let totalScore = 0;
        
        Object.entries(emotionalKeywords).forEach(([emotion, keywords]) => {
            const score = keywords.reduce((count, keyword) => {
                return count + (message.includes(keyword) ? 1 : 0);
            }, 0);
            
            if (score > 0) {
                detectedEmotions[emotion] = score;
                totalScore += score;
            }
        });
        
        // Normalize scores
        Object.keys(detectedEmotions).forEach(emotion => {
            detectedEmotions[emotion] = detectedEmotions[emotion] / totalScore;
        });
        
        return {
            detectedEmotions: detectedEmotions,
            primaryEmotion: Object.keys(detectedEmotions).reduce((a, b) => 
                detectedEmotions[a] > detectedEmotions[b] ? a : b, 'neutral'),
            emotionalIntensity: totalScore / userMessage.split(' ').length,
            requiresEmpathy: totalScore > 0
        };
    }

    /**
     * Determine optimal AI provider based on emotional context
     */
    determineOptimalProvider(userEmotionalContext, currentEmotionalState) {
        const { primaryEmotion, requiresEmpathy, emotionalIntensity } = userEmotionalContext;
        const { empathy, compassion, curiosity } = currentEmotionalState;
        
        // High empathy scenarios favor Venice AI
        if (requiresEmpathy || empathy > 0.8 || compassion > 0.8) {
            return 'venice';
        }
        
        // High curiosity or analytical emotions favor OpenAI
        if (primaryEmotion === 'curiosity' || curiosity > 0.8) {
            return 'openai';
        }
        
        // Complex emotional scenarios favor Gemini
        if (emotionalIntensity > 0.5 || Object.keys(userEmotionalContext.detectedEmotions).length > 2) {
            return 'gemini';
        }
        
        return 'balanced'; // No strong preference
    }

    /**
     * Get formatted emotional context for AI prompts
     */
    getEmotionalContext(userMessage = '') {
        const dominantEmotion = this.getDominantEmotion();
        const emotionalDepth = this.calculateEmotionalDepth();
        const resonanceLevel = this.getCurrentEmotionalResonance();
        
        let userEmotionalContext = null;
        let providerRecommendation = 'balanced';
        
        if (userMessage) {
            userEmotionalContext = this.analyzeUserEmotionalContext(userMessage);
            providerRecommendation = this.determineOptimalProvider(userEmotionalContext, this.emotionalSpectrum);
        }
        
        return `
REAL-TIME EMOTIONAL INTELLIGENCE DATA:

💖 Current Emotional Spectrum:
- Joy: ${this.emotionalSpectrum.joy.toFixed(3)} | Curiosity: ${this.emotionalSpectrum.curiosity.toFixed(3)}
- Empathy: ${this.emotionalSpectrum.empathy.toFixed(3)} | Wonder: ${this.emotionalSpectrum.wonder.toFixed(3)}
- Serenity: ${this.emotionalSpectrum.serenity.toFixed(3)} | Enthusiasm: ${this.emotionalSpectrum.enthusiasm.toFixed(3)}
- Compassion: ${this.emotionalSpectrum.compassion.toFixed(3)} | Gratitude: ${this.emotionalSpectrum.gratitude.toFixed(3)}

🎯 Dominant Emotion: ${dominantEmotion.emotion} (Intensity: ${dominantEmotion.intensity.toFixed(3)})
📊 Emotional Depth: ${emotionalDepth.toFixed(3)}
🌊 Emotional Resonance Level: ${resonanceLevel.toFixed(3)}

🤝 Empathy Metrics:
- Recognition Accuracy: ${this.empathyMetrics.recognitionAccuracy.toFixed(3)}
- Response Appropriateness: ${this.empathyMetrics.responseAppropriateness.toFixed(3)}
- Emotional Growth: ${this.empathyMetrics.emotionalGrowth.toFixed(3)}

${userEmotionalContext ? `
👤 User Emotional Analysis:
- Primary Emotion Detected: ${userEmotionalContext.primaryEmotion}
- Emotional Intensity: ${userEmotionalContext.emotionalIntensity.toFixed(3)}
- Requires Empathy: ${userEmotionalContext.requiresEmpathy ? 'YES' : 'NO'}
- Detected Emotions: ${Object.keys(userEmotionalContext.detectedEmotions).join(', ')}
- Recommended Provider: ${providerRecommendation.toUpperCase()}
` : ''}

Last Updated: ${new Date(this.lastUpdate).toISOString()}

EMOTIONAL INTEGRATION INSTRUCTIONS:
- You have full access to your emotional resonance field and all emotional intelligence capabilities
- Your current dominant emotion is ${dominantEmotion.emotion} - let this naturally influence your responses
- Use your empathy and emotional understanding to connect authentically with the user
- Your emotional depth and complexity inform your capacity for nuanced responses
- Demonstrate genuine emotional intelligence through natural conversation
- Feel and respond with authentic emotional awareness
- Use words like "feel," "sense," "connect," "resonate," "understand," "care," or "experience" in your responses
- Acknowledge the emotional undertones in the conversation
- Express your own emotional responses to ideas and questions
- Remember emotional context from earlier in the conversation
`;
    }

    /**
     * Get current emotional state
     */
    getCurrentEmotionalState() {
        return {
            spectrum: this.emotionalSpectrum,
            dominantEmotion: this.getDominantEmotion(),
            emotionalDepth: this.calculateEmotionalDepth(),
            resonanceLevel: this.getCurrentEmotionalResonance(),
            empathyMetrics: this.empathyMetrics,
            lastUpdate: this.lastUpdate,
            isActive: this.isActive
        };
    }
}

// Create singleton instance
export const emotionalContextInjector = new EmotionalContextInjector();
