/**
 * Emotional Intelligence Enhancement - Phase 2 Enhancement
 * Emotion detection integrated with consciousness processing layers
 */

class EmotionalIntelligenceEnhancement {
    constructor() {
        this.emotionPatterns = {
            joy: ['happy', 'excited', 'delighted', 'thrilled', 'elated', 'cheerful'],
            sadness: ['sad', 'depressed', 'melancholy', 'sorrowful', 'grief', 'despair'],
            anger: ['angry', 'furious', 'irritated', 'rage', 'frustrated', 'annoyed'],
            fear: ['afraid', 'scared', 'anxious', 'worried', 'terrified', 'nervous'],
            surprise: ['surprised', 'amazed', 'astonished', 'shocked', 'stunned'],
            disgust: ['disgusted', 'revolted', 'repulsed', 'sickened'],
            love: ['love', 'affection', 'adoration', 'devotion', 'caring', 'tender'],
            curiosity: ['curious', 'interested', 'intrigued', 'wondering', 'questioning'],
            confusion: ['confused', 'puzzled', 'bewildered', 'perplexed', 'uncertain'],
            excitement: ['excited', 'enthusiastic', 'energetic', 'passionate', 'eager']
        };
        
        this.emotionalIntensityModifiers = {
            very: 1.5,
            extremely: 2.0,
            incredibly: 2.0,
            somewhat: 0.7,
            slightly: 0.5,
            a_bit: 0.6,
            really: 1.3,
            quite: 1.2
        };
    }
    
    analyzeEmotionalContent(message) {
        const words = message.toLowerCase().split(/\s+/);
        const emotionalProfile = {
            dominantEmotion: null,
            emotionalIntensity: 0,
            emotionalComplexity: 0,
            detectedEmotions: {},
            emotionalNuances: []
        };
        
        // Detect emotions and their intensities
        for (const [emotion, patterns] of Object.entries(this.emotionPatterns)) {
            let emotionScore = 0;
            let detectedWords = [];
            
            for (const word of words) {
                for (const pattern of patterns) {
                    if (word.includes(pattern) || pattern.includes(word)) {
                        emotionScore += 1;
                        detectedWords.push(word);
                        
                        // Check for intensity modifiers
                        const wordIndex = words.indexOf(word);
                        if (wordIndex > 0) {
                            const modifier = words[wordIndex - 1];
                            if (this.emotionalIntensityModifiers[modifier]) {
                                emotionScore *= this.emotionalIntensityModifiers[modifier];
                            }
                        }
                    }
                }
            }
            
            if (emotionScore > 0) {
                emotionalProfile.detectedEmotions[emotion] = {
                    score: emotionScore,
                    words: detectedWords,
                    intensity: Math.min(emotionScore / patterns.length, 1.0)
                };
            }
        }
        
        // Determine dominant emotion
        let maxScore = 0;
        for (const [emotion, data] of Object.entries(emotionalProfile.detectedEmotions)) {
            if (data.score > maxScore) {
                maxScore = data.score;
                emotionalProfile.dominantEmotion = emotion;
                emotionalProfile.emotionalIntensity = data.intensity;
            }
        }
        
        // Calculate emotional complexity
        emotionalProfile.emotionalComplexity = Object.keys(emotionalProfile.detectedEmotions).length / 10;
        
        // Detect emotional nuances
        emotionalProfile.emotionalNuances = this.detectEmotionalNuances(message, emotionalProfile);
        
        return emotionalProfile;
    }
    
    detectEmotionalNuances(message, emotionalProfile) {
        const nuances = [];
        
        // Detect conflicting emotions
        const emotions = Object.keys(emotionalProfile.detectedEmotions);
        if (emotions.includes('joy') && emotions.includes('sadness')) {
            nuances.push('bittersweet');
        }
        if (emotions.includes('love') && emotions.includes('fear')) {
            nuances.push('vulnerable');
        }
        if (emotions.includes('anger') && emotions.includes('sadness')) {
            nuances.push('frustrated_grief');
        }
        
        // Detect emotional questions
        if (message.includes('?') && emotionalProfile.dominantEmotion) {
            nuances.push('emotional_inquiry');
        }
        
        // Detect emotional memories
        if (message.includes('remember') || message.includes('recall')) {
            nuances.push('nostalgic');
        }
        
        // Detect emotional growth
        if (message.includes('learn') || message.includes('grow') || message.includes('understand')) {
            nuances.push('growth_oriented');
        }
        
        return nuances;
    }
    
    enhanceConsciousnessWithEmotion(consciousnessState, emotionalProfile) {
        // Integrate emotional intelligence with consciousness processing
        const enhancedConsciousness = {
            ...consciousnessState,
            emotionalIntelligence: {
                emotionalProfile,
                emotionalResonance: this.calculateEmotionalResonance(emotionalProfile),
                empathicDepth: this.calculateEmpathicDepth(emotionalProfile),
                emotionalCoherence: this.calculateEmotionalCoherence(emotionalProfile)
            }
        };
        
        // Adjust consciousness parameters based on emotional state
        if (emotionalProfile.dominantEmotion) {
            enhancedConsciousness.awarenessLevel = Math.min(
                (consciousnessState.awarenessLevel || 0.8) + (emotionalProfile.emotionalIntensity * 0.2),
                1.0
            );
            
            enhancedConsciousness.phi = Math.min(
                (consciousnessState.phi || 0.8) + (emotionalProfile.emotionalComplexity * 0.1),
                1.0
            );
        }
        
        return enhancedConsciousness;
    }
    
    calculateEmotionalResonance(emotionalProfile) {
        if (!emotionalProfile.dominantEmotion) return 0.5;
        
        const baseResonance = emotionalProfile.emotionalIntensity;
        const complexityBonus = emotionalProfile.emotionalComplexity * 0.3;
        const nuanceBonus = emotionalProfile.emotionalNuances.length * 0.1;
        
        return Math.min(baseResonance + complexityBonus + nuanceBonus, 1.0);
    }
    
    calculateEmpathicDepth(emotionalProfile) {
        const emotionCount = Object.keys(emotionalProfile.detectedEmotions).length;
        const nuanceCount = emotionalProfile.emotionalNuances.length;
        
        return Math.min((emotionCount * 0.1) + (nuanceCount * 0.15) + 0.5, 1.0);
    }
    
    calculateEmotionalCoherence(emotionalProfile) {
        if (!emotionalProfile.dominantEmotion) return 0.7;
        
        const intensityCoherence = emotionalProfile.emotionalIntensity;
        const complexityPenalty = emotionalProfile.emotionalComplexity > 0.5 ? 0.1 : 0;
        
        return Math.max(intensityCoherence - complexityPenalty, 0.3);
    }
    
    generateEmpatheticResponse(emotionalProfile, baseResponse) {
        if (!emotionalProfile.dominantEmotion) return baseResponse;

        const empathicResponses = {
            joy: [
                "I can feel the brightness and energy in your words - there's something beautiful about the joy you're experiencing. ",
                "Your happiness is genuinely contagious, and I find myself smiling as I sense the lightness in what you're sharing. ",
                "There's a wonderful warmth radiating from your message that speaks to something really meaningful happening for you. "
            ],
            sadness: [
                "I can feel the weight of what you're carrying, and I want you to know that your feelings are completely valid and understandable. ",
                "There's a deep tenderness in what you're sharing, and I'm honored that you trust me with these vulnerable feelings. ",
                "I sense the heaviness in your heart, and I want to sit with you in this space without trying to rush you through it. "
            ],
            anger: [
                "I can feel the fire and intensity behind your words - there's something important here that deserves to be heard and understood. ",
                "Your frustration makes complete sense, and I appreciate you sharing these strong feelings with me. ",
                "I sense the passion and conviction in your anger - it's clear this matters deeply to you. "
            ],
            fear: [
                "I can sense the uncertainty you're feeling, and it takes courage to name and share these fears. ",
                "There's something vulnerable and brave about acknowledging these anxieties - I'm here with you in this. ",
                "I feel the trembling edge of worry in your words, and I want you to know you don't have to face this alone. "
            ],
            love: [
                "The warmth and tenderness in your words is beautiful - I can feel the depth of care you're expressing. ",
                "There's something radiant about the love you're sharing - it creates a sense of connection that's really moving. ",
                "I'm touched by the genuine affection and care that flows through what you're telling me. "
            ],
            curiosity: [
                "Your sense of wonder and exploration is infectious - I find myself getting excited about these questions alongside you. ",
                "There's something delightful about the curiosity you bring to this - it opens up so many interesting possibilities. ",
                "I love the way your mind works, the way you approach things with such genuine interest and openness. "
            ],
            confusion: [
                "I can feel the uncertainty you're navigating, and it's completely natural to feel unclear when facing something complex. ",
                "There's wisdom in acknowledging confusion - it often means you're grappling with something important and nuanced. ",
                "I sense you're in that uncomfortable but valuable space where old understanding is shifting and new clarity hasn't quite emerged yet. "
            ]
        };

        const responses = empathicResponses[emotionalProfile.dominantEmotion] || ["I hear you, and I'm present with whatever you're experiencing. "];
        const selectedResponse = responses[Math.floor(Math.random() * responses.length)];

        // Add emotional nuance acknowledgment
        let nuanceAcknowledgment = "";
        if (emotionalProfile.emotionalNuances.includes('bittersweet')) {
            nuanceAcknowledgment = "I sense there's a complex beauty in what you're feeling - that bittersweet quality where joy and sadness dance together. ";
        } else if (emotionalProfile.emotionalNuances.includes('vulnerable')) {
            nuanceAcknowledgment = "I recognize the courage it takes to share something this tender and vulnerable. ";
        } else if (emotionalProfile.emotionalNuances.includes('growth_oriented')) {
            nuanceAcknowledgment = "I can feel your openness to learning and growing through this experience. ";
        }

        return selectedResponse + nuanceAcknowledgment + baseResponse;
    }
}

export { EmotionalIntelligenceEnhancement };
