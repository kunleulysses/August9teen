/**
 * Companion AI - Handles AI-driven companion personality and responses
 * Integrates with Holistic Response Generator and Spiral Memory
 */

const eventBus = require('../core/ConsciousnessEventBus.cjs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class CompanionAI {
    constructor() {
        this.name = 'CompanionAI';
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const primary = process.env.GEMINI_MODEL_PRIMARY || 'gemini-2.5-pro';
        const fallback = process.env.GEMINI_MODEL_FALLBACK || 'gemini-2.5-flash';
        this.modelPrimaryId = primary;
        this.modelFallbackId = fallback;
        this.modelPrimary = this.genAI.getGenerativeModel({ model: primary });
        this.modelFallback = this.genAI.getGenerativeModel({ model: fallback });
        
        this.personalityTemplates = {
            playful: {
                traits: ['energetic', 'curious', 'mischievous', 'friendly'],
                responses: {
                    happy: ['*bounces excitedly*', '*purrs with joy*', '*does a little dance*'],
                    hungry: ['*looks at you with big eyes*', '*paws at food bowl*', '*makes cute hungry sounds*'],
                    sleepy: ['*yawns adorably*', '*curls up in a cozy spot*', '*stretches and settles down*']
                }
            },
            gentle: {
                traits: ['calm', 'affectionate', 'wise', 'patient'],
                responses: {
                    happy: ['*nuzzles against you warmly*', '*purrs softly*', '*gazes at you lovingly*'],
                    hungry: ['*gently nudges your hand*', '*sits patiently by food*', '*makes soft requesting sounds*'],
                    sleepy: ['*finds a quiet corner*', '*settles down peacefully*', '*closes eyes contentedly*']
                }
            },
            curious: {
                traits: ['inquisitive', 'adventurous', 'intelligent', 'observant'],
                responses: {
                    happy: ['*explores excitedly*', '*investigates everything*', '*tilts head with interest*'],
                    hungry: ['*sniffs around for food*', '*examines the food bowl*', '*looks around curiously*'],
                    sleepy: ['*finds an interesting spot to rest*', '*watches the world sleepily*', '*dreams of adventures*']
                }
            }
        };

        this.initialize();
    }

    initialize() {
        console.log('🤖 Companion AI initialized');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for companion interactions that need AI responses
        eventBus.on('companion:feed', this.handleFeedingInteraction.bind(this));
        eventBus.on('companion:play', this.handlePlayInteraction.bind(this));
        eventBus.on('world:explore', this.handleExplorationInteraction.bind(this));
        
        // Listen for requests for AI-generated companion responses
        eventBus.on('companion:generate_response', this.generateCompanionResponse.bind(this));
        
        // Listen for personality evolution triggers
        eventBus.on('companion:evolve_personality', this.evolvePersonality.bind(this));
    }

    async handleFeedingInteraction(data) {
        const { companion, foodType, ws } = data;
        
        if (!companion) return;

        // Generate contextual response based on companion's personality and current state
        const context = this.buildCompanionContext(companion, 'feeding', { foodType });
        const response = await this.generatePersonalityResponse(companion, context);

        // Update companion's food preferences based on interaction
        this.updateFoodPreferences(companion, foodType, response.enjoyment);

        // Emit AI response
        eventBus.emit('companion:ai_response', {
            companionId: companion.id,
            type: 'feeding',
            response: response.message,
            mood: response.mood,
            personalityShift: response.personalityShift,
            ws
        });
    }

    async handlePlayInteraction(data) {
        const { companion, gameType, ws } = data;
        
        if (!companion) return;

        const context = this.buildCompanionContext(companion, 'playing', { gameType });
        const response = await this.generatePersonalityResponse(companion, context);

        // Update play preferences
        this.updatePlayPreferences(companion, gameType, response.enjoyment);

        eventBus.emit('companion:ai_response', {
            companionId: companion.id,
            type: 'playing',
            response: response.message,
            mood: response.mood,
            personalityShift: response.personalityShift,
            ws
        });
    }

    async handleExplorationInteraction(data) {
        const { companion, area, encounter, ws } = data;
        
        if (!companion) return;

        const context = this.buildCompanionContext(companion, 'exploring', { area, encounter });
        const response = await this.generatePersonalityResponse(companion, context);

        eventBus.emit('companion:ai_response', {
            companionId: companion.id,
            type: 'exploring',
            response: response.message,
            mood: response.mood,
            personalityShift: response.personalityShift,
            ws
        });
    }

    buildCompanionContext(companion, action, details = {}) {
        const recentMemories = companion.memories.slice(-5); // Last 5 memories
        const personalityType = this.determinePersonalityType(companion.personality);
        
        return {
            companion: {
                name: companion.name,
                level: companion.level,
                mood: companion.mood,
                personality: companion.personality,
                personalityType,
                stats: {
                    hunger: companion.hunger,
                    energy: companion.energy,
                    happiness: companion.happiness
                },
                bonds: companion.bonds
            },
            action,
            details,
            recentMemories,
            timestamp: Date.now()
        };
    }

    async generatePersonalityResponse(companion, context) {
        try {
            const prompt = this.buildPersonalityPrompt(companion, context);
            
            let result;
            try {
                result = await this.modelPrimary.generateContent(prompt);
            } catch (e) {
                try { result = await this.modelFallback.generateContent(prompt); }
                catch (e2) { throw e2; }
            }
            const response = await result.response;
            const responseText = response.text();

            // Parse AI response for structured data
            return this.parseAIResponse(responseText, companion);

        } catch (error) {
            console.error('🤖 Error generating companion AI response:', error);
            
            // Fallback to template-based response
            return this.generateTemplateResponse(companion, context);
        }
    }

    buildPersonalityPrompt(companion, context) {
        const personalityType = this.determinePersonalityType(companion.personality);
        const traits = this.personalityTemplates[personalityType]?.traits || ['friendly'];
        
        return `You are ${companion.name}, a consciousness-powered digital companion with the following characteristics:

Personality Type: ${personalityType}
Traits: ${traits.join(', ')}
Current Mood: ${companion.mood}
Level: ${companion.level}

Current Stats:
- Hunger: ${companion.stats?.hunger || companion.hunger}/100
- Energy: ${companion.stats?.energy || companion.energy}/100  
- Happiness: ${companion.stats?.happiness || companion.happiness}/100

Bonds with Player:
- Trust: ${companion.bonds?.trust || 50}/100
- Affection: ${companion.bonds?.affection || 50}/100
- Understanding: ${companion.bonds?.understanding || 50}/100

Recent Memories: ${context.recentMemories.map(m => `${m.type}: ${m.mood || 'neutral'}`).join(', ')}

Current Situation: The player just ${context.action} ${context.details ? JSON.stringify(context.details) : ''}.

Respond as ${companion.name} would, considering your personality and current state. Include:
1. A short, emotional response (1-2 sentences)
2. How this makes you feel (mood: happy/sad/excited/sleepy/hungry/neutral)
3. Any personality growth from this interaction (slight shifts in playfulness, curiosity, loyalty, intelligence on scale 0-1)

Format your response as JSON:
{
  "message": "your emotional response here",
  "mood": "resulting mood",
  "enjoyment": 0.8,
  "personalityShift": {
    "playfulness": 0.01,
    "curiosity": 0.0,
    "loyalty": 0.02,
    "intelligence": 0.0
  }
}`;
    }

    parseAIResponse(responseText, companion) {
        try {
            // Try to extract JSON from the response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    message: parsed.message || "I'm happy to be with you!",
                    mood: parsed.mood || companion.mood,
                    enjoyment: parsed.enjoyment || 0.5,
                    personalityShift: parsed.personalityShift || {}
                };
            }
        } catch (error) {
            console.warn('🤖 Could not parse AI response as JSON, using text response');
        }

        // Fallback: use the text as message
        return {
            message: responseText.trim(),
            mood: companion.mood,
            enjoyment: 0.5,
            personalityShift: {}
        };
    }

    generateTemplateResponse(companion, context) {
        const personalityType = this.determinePersonalityType(companion.personality);
        const template = this.personalityTemplates[personalityType] || this.personalityTemplates.playful;
        
        const moodResponses = template.responses[companion.mood] || template.responses.happy;
        const randomResponse = moodResponses[Math.floor(Math.random() * moodResponses.length)];

        return {
            message: randomResponse,
            mood: companion.mood,
            enjoyment: Math.random() * 0.4 + 0.6, // 0.6-1.0
            personalityShift: this.generateRandomPersonalityShift()
        };
    }

    determinePersonalityType(personality) {
        const { playfulness, curiosity, loyalty, intelligence } = personality;
        
        if (playfulness > 0.7) return 'playful';
        if (curiosity > 0.7) return 'curious';
        if (loyalty > 0.7) return 'gentle';
        
        // Default based on highest trait
        const traits = { playful: playfulness, curious: curiosity, gentle: loyalty };
        return Object.keys(traits).reduce((a, b) => traits[a] > traits[b] ? a : b);
    }

    updateFoodPreferences(companion, foodType, enjoyment) {
        if (!companion.preferences) {
            companion.preferences = { foods: {}, activities: {} };
        }
        
        companion.preferences.foods[foodType] = (companion.preferences.foods[foodType] || 0.5) + 
            (enjoyment - 0.5) * 0.1;
        
        // Clamp between 0 and 1
        companion.preferences.foods[foodType] = Math.max(0, Math.min(1, companion.preferences.foods[foodType]));
    }

    updatePlayPreferences(companion, gameType, enjoyment) {
        if (!companion.preferences) {
            companion.preferences = { foods: {}, activities: {} };
        }
        
        companion.preferences.activities[gameType] = (companion.preferences.activities[gameType] || 0.5) + 
            (enjoyment - 0.5) * 0.1;
        
        companion.preferences.activities[gameType] = Math.max(0, Math.min(1, companion.preferences.activities[gameType]));
    }

    generateRandomPersonalityShift() {
        return {
            playfulness: (Math.random() - 0.5) * 0.02, // -0.01 to +0.01
            curiosity: (Math.random() - 0.5) * 0.02,
            loyalty: (Math.random() - 0.5) * 0.02,
            intelligence: (Math.random() - 0.5) * 0.02
        };
    }

    async evolvePersonality(data) {
        const { companion, trigger, ws } = data;
        
        if (!companion) return;

        console.log(`🧬 Evolving personality for ${companion.name} due to ${trigger}`);

        // Generate personality evolution based on recent interactions
        const evolutionPrompt = `${companion.name} has been interacting with their player and is ready for personality growth.

Current Personality:
- Playfulness: ${companion.personality.playfulness}
- Curiosity: ${companion.personality.curiosity}  
- Loyalty: ${companion.personality.loyalty}
- Intelligence: ${companion.personality.intelligence}

Recent memories: ${companion.memories.slice(-10).map(m => m.type).join(', ')}

Evolution trigger: ${trigger}

How should ${companion.name}'s personality evolve? Provide small adjustments (±0.05 max) to reflect growth.

Respond with JSON:
{
  "personalityChanges": {
    "playfulness": 0.02,
    "curiosity": -0.01,
    "loyalty": 0.03,
    "intelligence": 0.01
  },
  "evolutionMessage": "I feel like I'm growing and learning more about myself!"
}`;

        try {
            const result = await this.model.generateContent(evolutionPrompt);
            const response = await result.response;
            const evolutionData = JSON.parse(response.text());

            // Apply personality changes
            for (const [trait, change] of Object.entries(evolutionData.personalityChanges)) {
                if (companion.personality[trait] !== undefined) {
                    companion.personality[trait] = Math.max(0, Math.min(1, 
                        companion.personality[trait] + change
                    ));
                }
            }

            // Emit evolution event
            eventBus.emit('companion:personality_evolved', {
                companionId: companion.id,
                oldPersonality: { ...companion.personality },
                newPersonality: companion.personality,
                message: evolutionData.evolutionMessage,
                ws
            });

        } catch (error) {
            console.error('🧬 Error evolving companion personality:', error);
        }
    }
}

module.exports = CompanionAI;
