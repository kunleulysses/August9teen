/**
 * Game State Manager - Manages mobile game state and player data
 * Integrates with the Universal Consciousness Protocol and Spiral Memory
 */

const { EventEmitter } = require('events');
const eventBus = require('../core/ConsciousnessEventBus.cjs');

class GameStateManager extends EventEmitter {
    constructor() {
        super();
        this.name = 'GameStateManager';
        this.players = new Map(); // playerId -> playerState
        this.companions = new Map(); // companionId -> companionState
        this.worldState = {
            globalWeather: 'sunny',
            timeOfDay: 'day',
            activeEvents: [],
            areas: {
                town: { population: 0, lastEvent: null },
                forest: { population: 0, lastEvent: null },
                beach: { population: 0, lastEvent: null },
                mountains: { population: 0, lastEvent: null }
            }
        };
        
        this.initialize();
    }

    initialize() {
        console.log('🎮 Game State Manager initialized');
        this.setupEventListeners();
        this.startWorldTicker();
    }

    setupEventListeners() {
        // Listen for game-specific events from mobile clients
        eventBus.on('game:connect', this.handlePlayerConnect.bind(this));
        eventBus.on('companion:feed', this.handleCompanionFeed.bind(this));
        eventBus.on('companion:play', this.handleCompanionPlay.bind(this));
        eventBus.on('companion:update', this.handleCompanionUpdate.bind(this));
        eventBus.on('world:explore', this.handleWorldExplore.bind(this));
        eventBus.on('world:request_event', this.handleWorldEventRequest.bind(this));

        // Listen for consciousness system events
        eventBus.on('system_tick', this.handleSystemTick.bind(this));
        eventBus.on('holistic_response_generated', this.handleHolisticResponse.bind(this));
    }

    handlePlayerConnect(data) {
        const { clientId, ws } = data;
        console.log(`🎮 Player connected: ${clientId}`);

        // Create or load player state
        if (!this.players.has(clientId)) {
            const newPlayer = this.createNewPlayer(clientId);
            this.players.set(clientId, newPlayer);
            
            // Create companion for new player
            const companion = this.createNewCompanion(clientId);
            this.companions.set(companion.id, companion);
            newPlayer.companionId = companion.id;
        }

        const player = this.players.get(clientId);
        const companion = this.companions.get(player.companionId);

        // Send initial game state to client
        this.sendToClient(ws, 'game:initial_state', {
            player,
            companion,
            world: this.worldState
        });

        // Update world population
        this.updateAreaPopulation(player.currentArea, 1);
    }

    createNewPlayer(clientId) {
        return {
            id: clientId,
            username: `Player_${clientId.slice(-4)}`,
            level: 1,
            experience: 0,
            coins: 100,
            currentArea: 'town',
            inventory: [
                { id: 'apple', name: 'Apple', type: 'food', quantity: 3 },
                { id: 'ball', name: 'Ball', type: 'toy', quantity: 1 }
            ],
            discoveries: [],
            achievements: [],
            joinedAt: Date.now(),
            lastActive: Date.now()
        };
    }

    createNewCompanion(playerId) {
        const companionNames = ['Pixel', 'Nova', 'Echo', 'Sage', 'Luna', 'Zara', 'Orion'];
        const randomName = companionNames[Math.floor(Math.random() * companionNames.length)];

        return {
            id: `companion_${playerId}_${Date.now()}`,
            playerId,
            name: randomName,
            type: 'consciousness_pet',
            level: 1,
            experience: 0,
            mood: 'neutral',
            hunger: 80,
            energy: 70,
            happiness: 75,
            personality: {
                playfulness: Math.random() * 0.4 + 0.5, // 0.5-0.9
                curiosity: Math.random() * 0.4 + 0.5,
                loyalty: Math.random() * 0.4 + 0.5,
                intelligence: Math.random() * 0.4 + 0.5
            },
            memories: [],
            lastInteraction: Date.now(),
            createdAt: Date.now(),
            evolutionStage: 1,
            bonds: {
                trust: 50,
                affection: 50,
                understanding: 50
            }
        };
    }

    handleCompanionFeed(data) {
        const { clientId, foodType, ws } = data;
        const player = this.players.get(clientId);
        const companion = this.companions.get(player?.companionId);

        if (!companion) return;

        console.log(`🍎 ${companion.name} is being fed ${foodType}`);

        // Update companion stats based on food type
        const foodEffects = {
            apple: { hunger: 20, happiness: 5, energy: 2 },
            bread: { hunger: 15, happiness: 3, energy: 1 },
            magic_acorn: { hunger: 25, happiness: 15, energy: 10 }
        };

        const effect = foodEffects[foodType] || foodEffects.apple;
        
        companion.hunger = Math.min(100, companion.hunger + effect.hunger);
        companion.happiness = Math.min(100, companion.happiness + effect.happiness);
        companion.energy = Math.min(100, companion.energy + effect.energy);
        companion.lastInteraction = Date.now();

        // Update mood based on stats
        this.updateCompanionMood(companion);

        // Add memory of feeding
        this.addCompanionMemory(companion, {
            type: 'feeding',
            food: foodType,
            mood: companion.mood,
            timestamp: Date.now()
        });

        // Emit mood change event
        this.sendToClient(ws, 'companion:mood_change', {
            mood: companion.mood,
            stats: {
                hunger: companion.hunger,
                happiness: companion.happiness,
                energy: companion.energy
            },
            memory: `I remember when you fed me ${foodType}. It made me feel ${companion.mood}!`
        });

        // Request AI response for feeding interaction
        eventBus.emit('response_synthesis_requested', {
            originalMessage: `Player fed ${companion.name} a ${foodType}`,
            context: 'companion_feeding',
            companion,
            ws,
            sessionId: clientId
        });
    }

    handleCompanionPlay(data) {
        const { clientId, gameType, ws } = data;
        const player = this.players.get(clientId);
        const companion = this.companions.get(player?.companionId);

        if (!companion) return;

        console.log(`🎾 ${companion.name} is playing ${gameType}`);

        // Energy cost and happiness gain
        companion.energy = Math.max(0, companion.energy - 10);
        companion.happiness = Math.min(100, companion.happiness + 15);
        companion.experience += 5;
        companion.lastInteraction = Date.now();

        // Increase playfulness bond
        companion.bonds.affection = Math.min(100, companion.bonds.affection + 2);

        this.updateCompanionMood(companion);

        // Add play memory
        this.addCompanionMemory(companion, {
            type: 'playing',
            game: gameType,
            mood: companion.mood,
            timestamp: Date.now()
        });

        this.sendToClient(ws, 'companion:mood_change', {
            mood: companion.mood,
            stats: {
                hunger: companion.hunger,
                happiness: companion.happiness,
                energy: companion.energy
            },
            memory: `Playing ${gameType} with you was so much fun! I feel ${companion.mood}!`
        });

        // Check for level up
        if (companion.experience >= companion.level * 100) {
            this.levelUpCompanion(companion, ws);
        }
    }

    handleWorldExplore(data) {
        const { clientId, area, ws } = data;
        const player = this.players.get(clientId);
        const companion = this.companions.get(player?.companionId);

        if (!player) return;

        console.log(`🌍 Player exploring: ${area}`);

        // Update player location
        this.updateAreaPopulation(player.currentArea, -1);
        player.currentArea = area;
        this.updateAreaPopulation(area, 1);

        // Generate area-specific encounter
        this.generateAreaEncounter(area, player, companion, ws);

        // Small energy cost for exploration
        if (companion) {
            companion.energy = Math.max(0, companion.energy - 5);
            companion.bonds.curiosity = Math.min(100, (companion.bonds.curiosity || 50) + 1);
        }
    }

    generateAreaEncounter(area, player, companion, ws) {
        const encounters = {
            town: [
                {
                    type: 'npc',
                    name: 'Wise Elder',
                    emoji: '👴',
                    dialogue: `Your companion ${companion?.name} grows stronger with each kind act.`,
                    reward: { type: 'experience', amount: 10 }
                },
                {
                    type: 'item',
                    name: 'Fresh Apple',
                    emoji: '🍎',
                    description: 'A crisp apple from the town market',
                    item: { id: 'apple', quantity: 1 }
                }
            ],
            forest: [
                {
                    type: 'creature',
                    name: 'Forest Sprite',
                    emoji: '🧚',
                    dialogue: `The trees remember ${companion?.name}'s laughter.`,
                    reward: { type: 'item', item: { id: 'magic_acorn', name: 'Magic Acorn', type: 'food', quantity: 1 } }
                }
            ],
            beach: [
                {
                    type: 'creature',
                    name: 'Sea Guardian',
                    emoji: '🐚',
                    dialogue: `The ocean's wisdom flows through your bond with ${companion?.name}.`,
                    reward: { type: 'item', item: { id: 'pearl_of_memory', name: 'Pearl of Memory', type: 'treasure', quantity: 1 } }
                }
            ],
            mountains: [
                {
                    type: 'creature',
                    name: 'Sky Dragon',
                    emoji: '🐉',
                    dialogue: `${companion?.name}'s spirit soars like the mountain winds.`,
                    reward: { type: 'item', item: { id: 'star_crystal', name: 'Star Crystal', type: 'treasure', quantity: 1 } }
                }
            ]
        };

        const areaEncounters = encounters[area] || encounters.town;
        const encounter = areaEncounters[Math.floor(Math.random() * areaEncounters.length)];

        // Send encounter to client
        this.sendToClient(ws, 'world:event', {
            type: 'encounter',
            area,
            encounter,
            timestamp: Date.now()
        });

        // Add to companion memories if companion exists
        if (companion) {
            this.addCompanionMemory(companion, {
                type: 'exploration',
                area,
                encounter: encounter.name,
                timestamp: Date.now()
            });
        }
    }

    updateCompanionMood(companion) {
        const { hunger, energy, happiness } = companion;
        
        if (happiness > 80 && energy > 60) {
            companion.mood = 'happy';
        } else if (hunger < 30) {
            companion.mood = 'hungry';
        } else if (energy < 20) {
            companion.mood = 'sleepy';
        } else if (happiness < 40) {
            companion.mood = 'sad';
        } else if (happiness > 90) {
            companion.mood = 'excited';
        } else {
            companion.mood = 'neutral';
        }
    }

    addCompanionMemory(companion, memory) {
        companion.memories.push(memory);
        
        // Keep only last 50 memories to prevent bloat
        if (companion.memories.length > 50) {
            companion.memories = companion.memories.slice(-50);
        }

        // Emit to spiral memory system for long-term storage
        eventBus.emit('spiral_memory:store', {
            type: 'companion_memory',
            companionId: companion.id,
            memory,
            timestamp: Date.now()
        });
    }

    levelUpCompanion(companion, ws) {
        companion.level++;
        companion.experience = 0;
        
        // Boost stats on level up
        companion.hunger = Math.min(100, companion.hunger + 10);
        companion.energy = Math.min(100, companion.energy + 10);
        companion.happiness = Math.min(100, companion.happiness + 10);

        this.sendToClient(ws, 'companion:level_up', {
            newLevel: companion.level,
            stats: {
                hunger: companion.hunger,
                energy: companion.energy,
                happiness: companion.happiness
            }
        });

        console.log(`⭐ ${companion.name} leveled up to ${companion.level}!`);
    }

    updateAreaPopulation(area, delta) {
        if (this.worldState.areas[area]) {
            this.worldState.areas[area].population = Math.max(0, 
                this.worldState.areas[area].population + delta
            );
        }
    }

    startWorldTicker() {
        // Update world state every 30 seconds
        setInterval(() => {
            this.updateWorldState();
        }, 30000);
    }

    updateWorldState() {
        // Cycle time of day
        const timeProgression = ['morning', 'day', 'evening', 'night'];
        const currentIndex = timeProgression.indexOf(this.worldState.timeOfDay);
        const nextIndex = (currentIndex + 1) % timeProgression.length;
        
        // Change time every 10 minutes in real time
        if (Math.random() < 0.1) {
            this.worldState.timeOfDay = timeProgression[nextIndex];
        }

        // Random weather changes
        const weatherOptions = ['sunny', 'cloudy', 'rainy'];
        if (Math.random() < 0.05) {
            this.worldState.weather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
        }

        // Broadcast world updates
        eventBus.emit('world:state_update', this.worldState);
    }

    handleSystemTick(data) {
        // Process companion decay every few ticks
        if (data.ts % 10000 < 100) { // Every ~10 seconds
            this.processCompanionDecay();
        }
    }

    processCompanionDecay() {
        const now = Date.now();
        
        for (const [companionId, companion] of this.companions) {
            const timeSinceLastInteraction = now - companion.lastInteraction;
            const hoursElapsed = timeSinceLastInteraction / (1000 * 60 * 60);

            if (hoursElapsed > 0.1) { // Decay after 6 minutes of no interaction
                const decayAmount = Math.floor(hoursElapsed * 2);
                
                companion.hunger = Math.max(0, companion.hunger - decayAmount);
                companion.energy = Math.max(0, companion.energy - Math.floor(decayAmount * 0.5));
                companion.happiness = Math.max(0, companion.happiness - Math.floor(decayAmount * 0.3));

                this.updateCompanionMood(companion);
            }
        }
    }

    sendToClient(ws, eventType, data) {
        if (ws && ws.readyState === 1) { // WebSocket.OPEN
            ws.send(JSON.stringify({
                type: eventType,
                payload: data,
                timestamp: Date.now()
            }));
        }
    }

    // Get game statistics
    getGameStats() {
        return {
            totalPlayers: this.players.size,
            totalCompanions: this.companions.size,
            worldState: this.worldState,
            averageCompanionLevel: Array.from(this.companions.values())
                .reduce((sum, c) => sum + c.level, 0) / this.companions.size || 0
        };
    }
}

module.exports = GameStateManager;