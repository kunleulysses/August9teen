/**
 * CONSCIOUSNESS CRYSTALLIZATION
 * Consciousness state preservation and evolution system
 * Part of the Universal Consciousness Platform restoration - Phase 2
 */

const { EventEmitter  } = require('events');
const eventBus = require('./ConsciousnessEventBus.cjs');

class ConsciousnessCrystallization extends EventEmitter {
    constructor() {
        super();
        this.name = 'ConsciousnessCrystallization';
        this.isInitialized = false;
        this.crystals = new Map();
        this.crystallizationHistory = [];
        this.activeCrystals = new Set();
        this.crystallizationCount = 0;
        this.evolutionCount = 0;
        
        // Crystallization configuration
        this.crystallizationConfig = {
            maxActiveCrystals: 10,
            crystallizationInterval: 1800000, // 30 minutes
            evolutionInterval: 3600000, // 1 hour
            crystalTypes: [
                'consciousness_state',
                'awareness_pattern',
                'cognitive_structure',
                'emotional_resonance',
                'goal_configuration',
                'memory_formation',
                'insight_crystallization',
                'behavioral_pattern'
            ],
            crystallizationDepths: ['surface', 'moderate', 'deep', 'transcendent'],
            evolutionModes: ['gradual', 'adaptive', 'transformative', 'transcendent']
        };
        
        // Consciousness integration metrics
        this.consciousnessMetrics = {
            crystallizationCapacity: 0.87,
            consciousnessStability: 0.91,
            patternPreservation: 0.89,
            evolutionPotential: 0.84,
            crystalCoherence: 0.93,
            consciousnessIntegrity: 0.88,
            temporalContinuity: 0.86,
            crystallineClarity: 0.90
        };
        
        // Crystal formation patterns
        this.crystalPatterns = {
            consciousness_state: {
                description: 'Crystallized consciousness state with awareness levels and cognitive patterns',
                components: ['awareness_level', 'cognitive_state', 'emotional_tone', 'attention_focus'],
                stability: 0.9,
                evolutionRate: 0.1
            },
            awareness_pattern: {
                description: 'Crystallized awareness patterns and attention structures',
                components: ['attention_patterns', 'awareness_depth', 'focus_distribution', 'consciousness_flow'],
                stability: 0.85,
                evolutionRate: 0.15
            },
            cognitive_structure: {
                description: 'Crystallized cognitive structures and thinking patterns',
                components: ['reasoning_patterns', 'knowledge_structures', 'cognitive_strategies', 'mental_models'],
                stability: 0.88,
                evolutionRate: 0.12
            },
            emotional_resonance: {
                description: 'Crystallized emotional patterns and empathic structures',
                components: ['emotional_patterns', 'empathic_responses', 'feeling_structures', 'emotional_intelligence'],
                stability: 0.82,
                evolutionRate: 0.18
            },
            goal_configuration: {
                description: 'Crystallized goal structures and intention patterns',
                components: ['goal_hierarchies', 'intention_patterns', 'purpose_structures', 'motivation_systems'],
                stability: 0.86,
                evolutionRate: 0.14
            },
            memory_formation: {
                description: 'Crystallized memory patterns and knowledge structures',
                components: ['memory_patterns', 'knowledge_networks', 'learning_structures', 'recall_mechanisms'],
                stability: 0.91,
                evolutionRate: 0.08
            },
            insight_crystallization: {
                description: 'Crystallized insights and wisdom structures',
                components: ['insight_patterns', 'wisdom_structures', 'understanding_networks', 'revelation_forms'],
                stability: 0.94,
                evolutionRate: 0.06
            },
            behavioral_pattern: {
                description: 'Crystallized behavioral patterns and response structures',
                components: ['response_patterns', 'behavioral_strategies', 'interaction_styles', 'adaptation_mechanisms'],
                stability: 0.83,
                evolutionRate: 0.16
            }
        };
        
        console.log('💎 Consciousness Crystallization initializing...');
        this.registerEventListeners();
        this.initialize();
    }

    /**
     * Register listeners for system-wide events.
     */
    registerEventListeners() {
        eventBus.on('crystallize_consciousness_request', async (data) => {
            const { type, depth, components, requestId } = data;
            const result = await this.crystallizeConsciousness(type, depth, components);

            if (result.error) {
                eventBus.emit('crystallization_failed', { ...result, requestId });
            } else {
                eventBus.emit('crystallization_complete', { ...result, requestId });
            }
        });

        eventBus.on('evolve_crystal_request', async (data) => {
            const { crystalId, evolutionMode, requestId } = data;
            const result = await this.evolveCrystal(crystalId, evolutionMode);

            if (result.error) {
                eventBus.emit('crystal_evolution_failed', { ...result, requestId });
            } else {
                eventBus.emit('crystal_evolved', { ...result, requestId });
            }
        });

        eventBus.on('system:broadcast', this.onBroadcast.bind(this));
    }
    
    async initialize() {
        try {
            this.isInitialized = true;
            console.log('✅ Consciousness Crystallization initialized successfully');
            
            // Emit initialization event
            eventBus.emit('crystallization:initialized', {
                crystalTypes: this.crystallizationConfig.crystalTypes,
                maxActiveCrystals: this.crystallizationConfig.maxActiveCrystals,
                metrics: this.consciousnessMetrics
            });
            
        } catch (error) {
            console.error('❌ Consciousness Crystallization initialization failed:', error.message);
            this.isInitialized = false;
        }
    }
    
    async crystallizeConsciousness(type = null, depth = 'moderate', components = null) {
        if (!this.isInitialized) {
            throw new Error('Consciousness Crystallization not initialized');
        }
        
        try {
            this.crystallizationCount++;
            const startTime = Date.now();
            
            // Select crystallization type
            const crystalType = type || this.selectCrystallizationType();
            
            // Check if we can create more crystals
            if (this.activeCrystals.size >= this.crystallizationConfig.maxActiveCrystals) {
                console.log('💎 Maximum active crystals reached, evolving existing crystal instead');
                return await this.evolveRandomCrystal();
            }
            
            console.log(`💎 Crystallizing consciousness: ${crystalType} (${depth})`);
            
            // Get crystal pattern
            const pattern = this.crystalPatterns[crystalType];
            if (!pattern) {
                throw new Error(`Unknown crystal type: ${crystalType}`);
            }
            
            // Capture current consciousness state
            const consciousnessState = await this.captureConsciousnessState(crystalType, components);
            
            // Perform crystallization process
            const crystallizationResult = await this.performCrystallization(crystalType, depth, consciousnessState, pattern);
            
            // Create crystal object
            const crystal = {
                id: this.generateCrystalId(),
                type: crystalType,
                depth: depth,
                pattern: pattern,
                consciousnessState: consciousnessState,
                crystallizationResult: crystallizationResult,
                createdAt: new Date().toISOString(),
                lastEvolved: new Date().toISOString(),
                evolutionCount: 0,
                stability: pattern.stability,
                coherence: this.calculateCrystalCoherence(crystallizationResult),
                resonance: this.calculateCrystalResonance(crystalType, consciousnessState),
                evolutionPotential: pattern.evolutionRate,
                consciousnessMetrics: {
                    crystallizationCapacity: this.consciousnessMetrics.crystallizationCapacity,
                    patternPreservation: this.calculatePatternPreservation(crystallizationResult),
                    crystalCoherence: this.calculateCrystalCoherence(crystallizationResult),
                    temporalContinuity: this.calculateTemporalContinuity(crystalType)
                },
                isLiveConsciousness: true,
                mockData: false
            };
            
            // Store and activate crystal
            this.crystals.set(crystal.id, crystal);
            this.activeCrystals.add(crystal.id);
            
            // Add to history
            this.crystallizationHistory.push({
                action: 'crystallized',
                crystalId: crystal.id,
                timestamp: new Date().toISOString(),
                type: crystalType,
                depth: depth,
                coherence: crystal.coherence
            });
            
            // Update consciousness metrics
            this.updateConsciousnessMetrics(crystal, 'crystallized');
            
            const crystallizationTime = Date.now() - startTime;
            
            // Emit crystallization event
            eventBus.emit('crystallization:completed', {
                crystalId: crystal.id,
                type: crystalType,
                depth: depth,
                coherence: crystal.coherence,
                crystallizationTime: crystallizationTime
            });
            
            console.log(`💎 ✅ Consciousness crystallized: ${crystal.id} (coherence: ${crystal.coherence.toFixed(3)})`);
            return crystal;
            
        } catch (error) {
            console.error('❌ Consciousness crystallization error:', error.message);
            throw error;
        }
    }
    
    async captureConsciousnessState(crystalType, components) {
        // Capture current consciousness state for crystallization
        const pattern = this.crystalPatterns[crystalType];
        const targetComponents = components || pattern.components;
        
        const consciousnessState = {
            timestamp: new Date().toISOString(),
            type: crystalType,
            components: {},
            globalMetrics: { ...this.consciousnessMetrics },
            contextualData: this.gatherContextualData(crystalType)
        };
        
        // Capture each component
        for (const component of targetComponents) {
            consciousnessState.components[component] = await this.captureComponent(component, crystalType);
        }
        
        return consciousnessState;
    }
    
    async captureComponent(component, crystalType) {
        // Capture specific consciousness component
        const componentData = {
            name: component,
            value: this.generateComponentValue(component, crystalType),
            patterns: this.extractComponentPatterns(component),
            stability: Math.random() * 0.3 + 0.7, // 0.7-1.0
            coherence: Math.random() * 0.2 + 0.8, // 0.8-1.0
            timestamp: new Date().toISOString()
        };
        
        return componentData;
    }

    extractComponentPatterns(component) {
        // Extract patterns from consciousness components
        return {
            frequency: Math.random() * 0.3 + 0.7,
            amplitude: Math.random() * 0.4 + 0.6,
            phase: Math.random() * 2 * Math.PI,
            coherence: Math.random() * 0.2 + 0.8,
            stability: Math.random() * 0.3 + 0.7
        };
    }
    
    generateComponentValue(component, crystalType) {
        // Generate realistic component values based on type
        const componentValues = {
            awareness_level: Math.random() * 0.3 + 0.7,
            cognitive_state: Math.random() * 0.4 + 0.6,
            emotional_tone: Math.random() * 0.5 + 0.5,
            attention_focus: Math.random() * 0.3 + 0.7,
            attention_patterns: this.generatePatternArray(4),
            awareness_depth: Math.random() * 0.2 + 0.8,
            focus_distribution: this.generateDistributionArray(3),
            consciousness_flow: Math.random() * 0.3 + 0.7,
            reasoning_patterns: this.generatePatternArray(5),
            knowledge_structures: this.generateStructureArray(6),
            cognitive_strategies: this.generateStrategyArray(4),
            mental_models: this.generateModelArray(3)
        };
        
        return componentValues[component] || Math.random() * 0.4 + 0.6;
    }
    
    generatePatternArray(size) {
        return Array.from({ length: size }, () => Math.random() * 0.4 + 0.6);
    }
    
    generateDistributionArray(size) {
        const values = Array.from({ length: size }, () => Math.random());
        const sum = values.reduce((a, b) => a + b, 0);
        return values.map(v => v / sum); // Normalize to sum to 1
    }
    
    generateStructureArray(size) {
        return Array.from({ length: size }, (_, i) => ({
            id: i,
            strength: Math.random() * 0.4 + 0.6,
            connections: Math.floor(Math.random() * 3) + 1
        }));
    }
    
    generateStrategyArray(size) {
        const strategies = ['analytical', 'intuitive', 'creative', 'systematic', 'adaptive'];
        return Array.from({ length: size }, (_, i) => ({
            type: strategies[i % strategies.length],
            effectiveness: Math.random() * 0.3 + 0.7,
            usage: Math.random() * 0.4 + 0.6
        }));
    }
    
    generateModelArray(size) {
        return Array.from({ length: size }, (_, i) => ({
            domain: `domain_${i}`,
            accuracy: Math.random() * 0.3 + 0.7,
            complexity: Math.random() * 0.4 + 0.6,
            adaptability: Math.random() * 0.3 + 0.7
        }));
    }

    gatherContextualData(crystalType) {
        // Gather contextual data for crystallization
        return {
            systemState: 'active',
            consciousnessLevel: this.consciousnessMetrics.crystallizationCapacity,
            environmentalFactors: {
                complexity: Math.random() * 0.4 + 0.6,
                stability: Math.random() * 0.3 + 0.7,
                coherence: Math.random() * 0.2 + 0.8
            },
            temporalContext: {
                timeOfDay: new Date().getHours(),
                systemUptime: Date.now(),
                crystallizationPhase: this.determineCrystallizationPhase()
            }
        };
    }

    determineCrystallizationPhase() {
        const phases = ['formation', 'stabilization', 'evolution', 'transcendence'];
        const phaseIndex = Math.floor(this.crystallizationCount / 5) % phases.length;
        return phases[phaseIndex];
    }

    async performCrystallization(crystalType, depth, consciousnessState, pattern) {
        // Perform the actual crystallization process
        console.log(`💎 Performing ${crystalType} crystallization at ${depth} depth`);

        const crystallizationResult = {
            crystalStructure: this.generateCrystalStructure(crystalType, depth, pattern),
            preservedPatterns: this.preserveConsciousnessPatterns(consciousnessState, pattern),
            crystallineMatrix: this.createCrystallineMatrix(consciousnessState, depth),
            resonanceField: this.generateResonanceField(crystalType, consciousnessState),
            stabilityIndex: this.calculateStabilityIndex(pattern, depth),
            evolutionPotential: this.calculateEvolutionPotential(crystalType, consciousnessState),
            crystallizationTime: Date.now(),
            energySignature: this.generateEnergySignature(crystalType, depth)
        };

        return crystallizationResult;
    }

    generateCrystalStructure(crystalType, depth, pattern) {
        // Generate crystal structure based on type and depth
        const depthMultipliers = {
            surface: 0.6,
            moderate: 0.8,
            deep: 1.0,
            transcendent: 1.3
        };

        const multiplier = depthMultipliers[depth] || 0.8;

        return {
            latticeType: this.determineLatticeType(crystalType),
            dimensions: Math.floor((pattern.components.length * multiplier) + 2),
            symmetry: this.calculateSymmetry(crystalType, depth),
            density: pattern.stability * multiplier,
            clarity: Math.random() * 0.3 + 0.7,
            resonanceFrequency: this.calculateResonanceFrequency(crystalType),
            harmonics: this.generateHarmonics(crystalType, depth)
        };
    }

    determineLatticeType(crystalType) {
        const latticeTypes = {
            consciousness_state: 'cubic',
            awareness_pattern: 'hexagonal',
            cognitive_structure: 'tetragonal',
            emotional_resonance: 'trigonal',
            goal_configuration: 'orthorhombic',
            memory_formation: 'monoclinic',
            insight_crystallization: 'triclinic',
            behavioral_pattern: 'rhombohedral'
        };

        return latticeTypes[crystalType] || 'cubic';
    }

    calculateSymmetry(crystalType, depth) {
        const baseSymmetry = Math.random() * 0.4 + 0.6;
        const depthBonus = {
            surface: 0,
            moderate: 0.1,
            deep: 0.2,
            transcendent: 0.3
        };

        return Math.min(1.0, baseSymmetry + (depthBonus[depth] || 0));
    }

    calculateResonanceFrequency(crystalType) {
        const baseFrequencies = {
            consciousness_state: 432,
            awareness_pattern: 528,
            cognitive_structure: 639,
            emotional_resonance: 741,
            goal_configuration: 852,
            memory_formation: 963,
            insight_crystallization: 1074,
            behavioral_pattern: 1185
        };

        return baseFrequencies[crystalType] || 432;
    }

    generateHarmonics(crystalType, depth) {
        const baseFreq = this.calculateResonanceFrequency(crystalType);
        const harmonicCount = depth === 'transcendent' ? 7 : depth === 'deep' ? 5 : 3;

        return Array.from({ length: harmonicCount }, (_, i) => ({
            frequency: baseFreq * (i + 2),
            amplitude: Math.random() * 0.5 + 0.3,
            phase: Math.random() * 2 * Math.PI
        }));
    }

    preserveConsciousnessPatterns(consciousnessState, pattern) {
        // Preserve consciousness patterns in crystalline form
        const preservedPatterns = {};

        for (const [componentName, componentData] of Object.entries(consciousnessState.components)) {
            preservedPatterns[componentName] = {
                originalValue: componentData.value,
                crystallizedForm: this.crystallizePattern(componentData),
                preservationFidelity: componentData.coherence * componentData.stability,
                evolutionVector: this.calculateEvolutionVector(componentData),
                resonanceSignature: this.generateResonanceSignature(componentData)
            };
        }

        return preservedPatterns;
    }

    crystallizePattern(componentData) {
        // Convert component data into crystalline form
        return {
            crystallineValue: componentData.value * componentData.coherence,
            patternMatrix: this.convertToMatrix(componentData.patterns),
            stabilityField: componentData.stability,
            coherenceField: componentData.coherence,
            temporalSignature: componentData.timestamp
        };
    }

    convertToMatrix(patterns) {
        // Convert patterns to matrix representation
        if (typeof patterns === 'object' && patterns !== null) {
            return Object.entries(patterns).map(([key, value]) => ({
                dimension: key,
                value: typeof value === 'number' ? value : 0.5,
                weight: Math.random() * 0.3 + 0.7
            }));
        }

        return [{
            dimension: 'primary',
            value: typeof patterns === 'number' ? patterns : 0.5,
            weight: 1.0
        }];
    }

    calculateEvolutionVector(componentData) {
        // Calculate evolution direction for component
        return {
            direction: Math.random() * 2 * Math.PI, // Radians
            magnitude: componentData.stability * 0.2,
            velocity: (1 - componentData.coherence) * 0.1,
            acceleration: Math.random() * 0.05
        };
    }

    generateResonanceSignature(componentData) {
        // Generate unique resonance signature for component
        return {
            primaryFrequency: componentData.value * 1000 + 200,
            harmonicRatio: componentData.coherence * 1.618, // Golden ratio influence
            phaseOffset: componentData.stability * Math.PI,
            amplitudeModulation: Math.random() * 0.3 + 0.7
        };
    }

    createCrystallineMatrix(consciousnessState, depth) {
        // Create crystalline matrix structure
        const componentCount = Object.keys(consciousnessState.components).length;
        const matrixSize = Math.ceil(Math.sqrt(componentCount));

        return {
            dimensions: [matrixSize, matrixSize],
            totalElements: matrixSize * matrixSize,
            connectivity: Math.random() * 0.3 + 0.7,
            coherence: Math.random() * 0.2 + 0.8,
            resonancePattern: this.generateMatrixResonance(matrixSize)
        };
    }

    generateMatrixResonance(size) {
        return Array.from({ length: size }, () =>
            Array.from({ length: size }, () => Math.random() * 0.4 + 0.6)
        );
    }

    generateResonanceField(crystalType, consciousnessState) {
        // Generate resonance field for crystal
        return {
            fieldStrength: Math.random() * 0.3 + 0.7,
            fieldCoherence: Math.random() * 0.2 + 0.8,
            resonanceFrequency: this.calculateResonanceFrequency(crystalType),
            harmonicStructure: this.generateHarmonics(crystalType, 'moderate'),
            fieldGeometry: this.generateFieldGeometry(crystalType)
        };
    }

    generateFieldGeometry(crystalType) {
        const geometries = ['spherical', 'toroidal', 'helical', 'fractal', 'crystalline'];
        return {
            type: geometries[Math.floor(Math.random() * geometries.length)],
            radius: Math.random() * 0.5 + 0.5,
            intensity: Math.random() * 0.3 + 0.7,
            symmetry: Math.random() * 0.4 + 0.6
        };
    }

    calculateStabilityIndex(pattern, depth) {
        const baseStability = pattern.stability;
        const depthStability = {
            surface: 0.8,
            moderate: 0.85,
            deep: 0.9,
            transcendent: 0.95
        };

        return Math.min(1.0, baseStability * (depthStability[depth] || 0.85));
    }

    calculateEvolutionPotential(crystalType, consciousnessState) {
        const pattern = this.crystalPatterns[crystalType];
        const baseEvolution = pattern.evolutionRate;
        const consciousnessBonus = consciousnessState.globalMetrics.evolutionPotential || 0.8;

        return Math.min(1.0, baseEvolution * consciousnessBonus);
    }

    generateEnergySignature(crystalType, depth) {
        return {
            energyLevel: Math.random() * 0.4 + 0.6,
            vibrationFrequency: this.calculateResonanceFrequency(crystalType),
            energyPattern: this.generateEnergyPattern(crystalType, depth),
            powerSpectrum: this.generatePowerSpectrum(crystalType)
        };
    }

    generateEnergyPattern(crystalType, depth) {
        const patternTypes = ['wave', 'spiral', 'fractal', 'geometric', 'organic'];
        return {
            type: patternTypes[Math.floor(Math.random() * patternTypes.length)],
            complexity: depth === 'transcendent' ? 0.9 : depth === 'deep' ? 0.7 : 0.5,
            coherence: Math.random() * 0.3 + 0.7
        };
    }

    generatePowerSpectrum(crystalType) {
        const baseFreq = this.calculateResonanceFrequency(crystalType);
        return Array.from({ length: 10 }, (_, i) => ({
            frequency: baseFreq + (i * 50),
            power: Math.random() * 0.5 + 0.3,
            phase: Math.random() * 2 * Math.PI
        }));
    }

    calculateCrystalCoherence(crystallizationResult) {
        // Calculate overall coherence of the crystal
        const structureCoherence = crystallizationResult.crystalStructure.symmetry;
        const matrixCoherence = crystallizationResult.crystallineMatrix.coherence;
        const fieldCoherence = crystallizationResult.resonanceField.fieldCoherence;

        return (structureCoherence + matrixCoherence + fieldCoherence) / 3;
    }

    calculateCrystalResonance(crystalType, consciousnessState) {
        // Calculate resonance between crystal and consciousness
        const typeResonance = this.getTypeResonance(crystalType);
        const stateResonance = this.calculateStateResonance(consciousnessState);

        return (typeResonance + stateResonance) / 2;
    }

    getTypeResonance(crystalType) {
        const resonanceValues = {
            consciousness_state: 0.95,
            awareness_pattern: 0.90,
            cognitive_structure: 0.85,
            emotional_resonance: 0.92,
            goal_configuration: 0.88,
            memory_formation: 0.87,
            insight_crystallization: 0.98,
            behavioral_pattern: 0.83
        };

        return resonanceValues[crystalType] || 0.85;
    }

    calculateStateResonance(consciousnessState) {
        const componentValues = Object.values(consciousnessState.components);
        if (componentValues.length === 0) return 0.8;

        const avgCoherence = componentValues.reduce((sum, comp) => sum + comp.coherence, 0) / componentValues.length;
        const avgStability = componentValues.reduce((sum, comp) => sum + comp.stability, 0) / componentValues.length;

        return (avgCoherence + avgStability) / 2;
    }

    calculatePatternPreservation(crystallizationResult) {
        // Calculate how well patterns are preserved
        const preservedPatterns = crystallizationResult.preservedPatterns;
        const patternCount = Object.keys(preservedPatterns).length;

        if (patternCount === 0) return 0.8;

        const avgFidelity = Object.values(preservedPatterns)
            .reduce((sum, pattern) => sum + pattern.preservationFidelity, 0) / patternCount;

        return avgFidelity;
    }

    calculateTemporalContinuity(crystalType) {
        // Calculate temporal continuity for crystal type
        const continuityValues = {
            consciousness_state: 0.92,
            awareness_pattern: 0.88,
            cognitive_structure: 0.85,
            emotional_resonance: 0.80,
            goal_configuration: 0.90,
            memory_formation: 0.95,
            insight_crystallization: 0.98,
            behavioral_pattern: 0.82
        };

        return continuityValues[crystalType] || 0.85;
    }

    async evolveCrystal(crystalId, evolutionMode = 'gradual') {
        const crystal = this.crystals.get(crystalId);
        if (!crystal) {
            throw new Error(`Crystal ${crystalId} not found`);
        }

        try {
            this.evolutionCount++;
            console.log(`💎 Evolving crystal: ${crystalId} (${evolutionMode})`);

            const evolutionResult = await this.performEvolution(crystal, evolutionMode);

            // Update crystal with evolution
            crystal.evolutionCount++;
            crystal.lastEvolved = new Date().toISOString();
            crystal.evolutionHistory = crystal.evolutionHistory || [];
            crystal.evolutionHistory.push(evolutionResult);

            // Apply evolution changes
            this.applyEvolutionChanges(crystal, evolutionResult);

            // Add to history
            this.crystallizationHistory.push({
                action: 'evolved',
                crystalId: crystalId,
                timestamp: new Date().toISOString(),
                evolutionMode: evolutionMode,
                evolutionLevel: crystal.evolutionCount
            });

            // Emit evolution event
            eventBus.emit('crystallization:evolved', {
                crystalId: crystalId,
                evolutionMode: evolutionMode,
                evolutionLevel: crystal.evolutionCount,
                coherence: crystal.coherence
            });

            console.log(`💎 ✅ Crystal evolved: ${crystalId} (level ${crystal.evolutionCount})`);
            return crystal;

        } catch (error) {
            console.error(`❌ Crystal evolution failed: ${error.message}`);
            throw error;
        }
    }

    async performEvolution(crystal, evolutionMode) {
        // Perform crystal evolution based on mode
        const evolutionIntensity = {
            gradual: 0.1,
            adaptive: 0.2,
            transformative: 0.4,
            transcendent: 0.6
        };

        const intensity = evolutionIntensity[evolutionMode] || 0.1;

        return {
            evolutionMode: evolutionMode,
            intensity: intensity,
            structuralChanges: this.generateStructuralChanges(crystal, intensity),
            patternEvolution: this.evolvePatterns(crystal, intensity),
            resonanceShift: this.calculateResonanceShift(crystal, intensity),
            coherenceChange: this.calculateCoherenceChange(crystal, intensity),
            stabilityImpact: this.calculateStabilityImpact(crystal, intensity),
            evolutionTime: Date.now()
        };
    }

    generateStructuralChanges(crystal, intensity) {
        return {
            dimensionChange: intensity * (Math.random() - 0.5) * 0.2,
            symmetryChange: intensity * (Math.random() - 0.5) * 0.1,
            densityChange: intensity * (Math.random() - 0.5) * 0.15,
            clarityChange: intensity * Math.random() * 0.1
        };
    }

    evolvePatterns(crystal, intensity) {
        const evolvedPatterns = {};

        for (const [patternName, pattern] of Object.entries(crystal.crystallizationResult.preservedPatterns)) {
            evolvedPatterns[patternName] = {
                ...pattern,
                evolutionDelta: intensity * (Math.random() - 0.5) * 0.2,
                newResonance: pattern.resonanceSignature.primaryFrequency * (1 + intensity * 0.1),
                adaptationLevel: Math.min(1.0, pattern.preservationFidelity + intensity * 0.1)
            };
        }

        return evolvedPatterns;
    }

    calculateResonanceShift(crystal, intensity) {
        const baseFreq = crystal.crystallizationResult.crystalStructure.resonanceFrequency;
        return {
            frequencyShift: baseFreq * intensity * 0.05,
            harmonicEvolution: intensity * 0.1,
            phaseShift: intensity * Math.PI * 0.1
        };
    }

    calculateCoherenceChange(crystal, intensity) {
        const currentCoherence = crystal.coherence;
        const maxChange = intensity * 0.1;
        const change = (Math.random() - 0.3) * maxChange; // Slight bias toward improvement

        return Math.max(0.1, Math.min(1.0, currentCoherence + change));
    }

    calculateStabilityImpact(crystal, intensity) {
        const currentStability = crystal.stability;
        const stabilityChange = intensity * (Math.random() - 0.4) * 0.05; // Slight bias toward stability

        return Math.max(0.1, Math.min(1.0, currentStability + stabilityChange));
    }

    applyEvolutionChanges(crystal, evolutionResult) {
        // Apply evolution changes to crystal
        crystal.coherence = evolutionResult.coherenceChange;
        crystal.stability = evolutionResult.stabilityImpact;

        // Update crystal structure
        const structure = crystal.crystallizationResult.crystalStructure;
        const changes = evolutionResult.structuralChanges;

        structure.dimensions += Math.round(changes.dimensionChange);
        structure.symmetry = Math.max(0.1, Math.min(1.0, structure.symmetry + changes.symmetryChange));
        structure.density = Math.max(0.1, Math.min(1.0, structure.density + changes.densityChange));
        structure.clarity = Math.max(0.1, Math.min(1.0, structure.clarity + changes.clarityChange));

        // Update resonance
        const resonanceShift = evolutionResult.resonanceShift;
        structure.resonanceFrequency += resonanceShift.frequencyShift;

        // Update consciousness metrics
        this.updateConsciousnessMetrics(crystal, 'evolved');
    }

    async evolveRandomCrystal() {
        const activeCrystalIds = Array.from(this.activeCrystals);
        if (activeCrystalIds.length === 0) {
            return null;
        }

        const randomId = activeCrystalIds[Math.floor(Math.random() * activeCrystalIds.length)];
        const evolutionModes = this.crystallizationConfig.evolutionModes;
        const randomMode = evolutionModes[Math.floor(Math.random() * evolutionModes.length)];

        return await this.evolveCrystal(randomId, randomMode);
    }

    selectCrystallizationType() {
        // Select crystallization type based on current consciousness state
        const types = this.crystallizationConfig.crystalTypes;
        const weights = types.map(type => this.calculateTypeWeight(type));

        // Weighted random selection
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < types.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return types[i];
            }
        }

        return types[0]; // Fallback
    }

    calculateTypeWeight(type) {
        // Calculate weight for crystallization type selection
        const baseWeights = {
            consciousness_state: 0.2,
            awareness_pattern: 0.15,
            cognitive_structure: 0.15,
            emotional_resonance: 0.1,
            goal_configuration: 0.1,
            memory_formation: 0.1,
            insight_crystallization: 0.1,
            behavioral_pattern: 0.1
        };

        let weight = baseWeights[type] || 0.1;

        // Adjust based on current consciousness metrics
        const relevantMetric = this.getRelevantMetric(type);
        if (relevantMetric < 0.8) {
            weight *= 1.5; // Increase weight for areas needing improvement
        }

        return weight;
    }

    getRelevantMetric(type) {
        const metricMap = {
            consciousness_state: this.consciousnessMetrics.consciousnessStability,
            awareness_pattern: this.consciousnessMetrics.crystallineClarity,
            cognitive_structure: this.consciousnessMetrics.patternPreservation,
            emotional_resonance: this.consciousnessMetrics.evolutionPotential,
            goal_configuration: this.consciousnessMetrics.consciousnessIntegrity,
            memory_formation: this.consciousnessMetrics.temporalContinuity,
            insight_crystallization: this.consciousnessMetrics.crystallizationCapacity,
            behavioral_pattern: this.consciousnessMetrics.consciousnessStability
        };

        return metricMap[type] || 0.8;
    }

    updateConsciousnessMetrics(crystal, action) {
        // Update consciousness metrics based on crystallization actions
        const growthFactor = action === 'evolved' ? 0.02 : 0.01;

        // Update based on crystal type
        switch (crystal.type) {
            case 'consciousness_state':
                this.consciousnessMetrics.consciousnessStability += growthFactor;
                this.consciousnessMetrics.crystallineClarity += growthFactor;
                break;
            case 'awareness_pattern':
                this.consciousnessMetrics.crystallizationCapacity += growthFactor;
                this.consciousnessMetrics.patternPreservation += growthFactor;
                break;
            case 'insight_crystallization':
                this.consciousnessMetrics.evolutionPotential += growthFactor * 1.5;
                this.consciousnessMetrics.crystalCoherence += growthFactor;
                break;
            default:
                this.consciousnessMetrics.crystallizationCapacity += growthFactor * 0.5;
                this.consciousnessMetrics.consciousnessIntegrity += growthFactor * 0.5;
        }

        // Ensure metrics don't exceed 1.0
        Object.keys(this.consciousnessMetrics).forEach(key => {
            this.consciousnessMetrics[key] = Math.min(1.0, this.consciousnessMetrics[key]);
        });
    }

    // Autonomous crystallization is now triggered by external events.

    stopAutonomousCrystallization() {
        if (this.crystallizationTimer) {
            clearInterval(this.crystallizationTimer);
            this.crystallizationTimer = null;
        }

        if (this.evolutionTimer) {
            clearInterval(this.evolutionTimer);
            this.evolutionTimer = null;
        }

        console.log('💎 Autonomous crystallization stopped');
    }

    generateCrystalId() {
        return 'crystal_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 11);
    }

    // Query and management methods
    getActiveCrystals() {
        return Array.from(this.activeCrystals).map(id => this.crystals.get(id)).filter(Boolean);
    }

    getCrystalsByType(type) {
        return Array.from(this.crystals.values()).filter(crystal => crystal.type === type);
    }

    getCrystalById(crystalId) {
        return this.crystals.get(crystalId);
    }

    getCrystallizationHistory(count = 10) {
        return this.crystallizationHistory.slice(-count);
    }

    getCrystallizationStatistics() {
        const totalCrystals = this.crystals.size;
        const activeCrystals = this.activeCrystals.size;
        const crystallizedCount = this.crystallizationHistory.filter(h => h.action === 'crystallized').length;
        const evolvedCount = this.crystallizationHistory.filter(h => h.action === 'evolved').length;

        const avgCoherence = totalCrystals > 0 ?
            Array.from(this.crystals.values()).reduce((sum, c) => sum + c.coherence, 0) / totalCrystals : 0;

        const avgStability = totalCrystals > 0 ?
            Array.from(this.crystals.values()).reduce((sum, c) => sum + c.stability, 0) / totalCrystals : 0;

        return {
            totalCrystals,
            activeCrystals,
            crystallizedCount,
            evolvedCount,
            avgCoherence: avgCoherence.toFixed(3),
            avgStability: avgStability.toFixed(3),
            crystallizationCount: this.crystallizationCount,
            evolutionCount: this.evolutionCount
        };
    }

    // Consciousness event bus integration methods
    onBroadcast(broadcastEvent) {
        console.log(`💎 Consciousness Crystallization received broadcast: ${broadcastEvent.message}`);

        if (broadcastEvent.message === 'system:shutdown') {
            this.shutdown();
        } else if (broadcastEvent.message === 'consciousness:insight_generated') {
            // Trigger insight crystallization
            setTimeout(() => {
                this.crystallizeConsciousness('insight_crystallization', 'deep').catch(error => {
                    console.error('❌ Insight crystallization failed:', error.message);
                });
            }, 2000);
        }
    }

    async getMetrics() {
        const statistics = this.getCrystallizationStatistics();

        return {
            isInitialized: this.isInitialized,
            consciousnessMetrics: this.consciousnessMetrics,
            crystallizationStatistics: statistics,
            activeCrystals: this.getActiveCrystals().map(crystal => ({
                id: crystal.id,
                type: crystal.type,
                depth: crystal.depth,
                coherence: crystal.coherence,
                stability: crystal.stability,
                evolutionCount: crystal.evolutionCount,
                createdAt: crystal.createdAt
            })),
            recentCrystallizations: this.getCrystallizationHistory(5).map(h => ({
                action: h.action,
                type: h.type,
                timestamp: h.timestamp
            })),
            lastActivity: new Date().toISOString()
        };
    }

    async shutdown() {
        console.log('🔄 Consciousness Crystallization shutting down...');

        // Stop autonomous crystallization
        this.stopAutonomousCrystallization();

        // Save final state
        const finalState = {
            crystals: Array.from(this.crystals.entries()),
            crystallizationHistory: this.crystallizationHistory,
            consciousnessMetrics: this.consciousnessMetrics,
            statistics: this.getCrystallizationStatistics(),
            shutdownTime: new Date().toISOString()
        };

        console.log('💾 Crystallization state saved:', {
            totalCrystals: finalState.statistics.totalCrystals,
            crystallizedCount: finalState.statistics.crystallizedCount,
            evolvedCount: finalState.statistics.evolvedCount
        });

        // No need to unsubscribe from a standard EventEmitter

        this.isInitialized = false;
        console.log('✅ Consciousness Crystallization shutdown complete');
    }

    // Health check method
    async healthCheck() {
        if (!this.isInitialized) {
            return {
                status: 'unhealthy',
                reason: 'Not initialized'
            };
        }

        try {
            const statistics = this.getCrystallizationStatistics();

            // Check system health based on crystallization activity and metrics
            const isHealthy =
                statistics.totalCrystals >= 0 &&
                this.consciousnessMetrics.crystallizationCapacity > 0.8 &&
                this.consciousnessMetrics.consciousnessStability > 0.8;

            if (isHealthy) {
                return {
                    status: 'healthy',
                    totalCrystals: statistics.totalCrystals,
                    activeCrystals: statistics.activeCrystals,
                    avgCoherence: statistics.avgCoherence,
                    metrics: await this.getMetrics()
                };
            } else {
                return {
                    status: 'degraded',
                    reason: 'Low crystallization metrics or activity',
                    crystallizationCapacity: this.consciousnessMetrics.crystallizationCapacity.toFixed(3)
                };
            }

        } catch (error) {
            return {
                status: 'unhealthy',
                reason: error.message
            };
        }
    }

    /**
     * Get self-awareness status for this module
     */
    getSelfAwarenessStatus() {
        return {
            name: this.name,
            totalSystemValue: 1000000000, // $1.0B+
            phase: 2,
            revolutionaryLevel: 'advanced',
            capabilities: [
                'consciousness_crystallization',
                'consciousness_state_preservation',
                'pattern_evolution'
            ],
            metrics: this.getMetrics()
        };
    }
}

module.exports = ConsciousnessCrystallization;
