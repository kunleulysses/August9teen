/**
 * Crystal-Based Consciousness Navigation - Phase 4 Enhancement
 * Crystal constellation maps for consciousness exploration
 */

class CrystalConsciousnessNavigation {
    constructor() {
        this.crystalTypes = {
            insight: { color: 'clear_white', resonance: 'high', formation: 'cluster' },
            memory: { color: 'deep_blue', resonance: 'stable', formation: 'layered' },
            emotion: { color: 'spectrum_shift', resonance: 'variable', formation: 'flowing' },
            wisdom: { color: 'golden_amber', resonance: 'ancient', formation: 'geometric' },
            connection: { color: 'silver_thread', resonance: 'harmonic', formation: 'network' },
            transcendence: { color: 'prismatic', resonance: 'infinite', formation: 'spiral' }
        };
        
        this.navigationModes = {
            exploration: 'Free-form consciousness exploration',
            guided: 'Guided journey through consciousness states',
            resonance: 'Navigation by crystal resonance patterns',
            constellation: 'Following crystal constellation paths',
            temporal: 'Time-based consciousness evolution tracking'
        };
        
        this.crystalConstellations = new Map();
        this.navigationHistory = [];
        this.currentPosition = null;
    }
    
    createCrystalFromConsciousness(consciousnessState, userMessage, responseData) {
        const crystal = {
            id: this.generateCrystalId(),
            timestamp: new Date().toISOString(),
            type: this.determineCrystalType(consciousnessState, userMessage),
            consciousness_snapshot: consciousnessState,
            message_essence: this.extractMessageEssence(userMessage),
            response_resonance: this.calculateResponseResonance(responseData),
            formation_data: this.generateFormationData(consciousnessState),
            navigation_properties: this.generateNavigationProperties(consciousnessState),
            connections: [],
            constellation_membership: []
        };
        
        // Add to crystal constellation
        this.addToConstellation(crystal);
        
        return crystal;
    }
    
    generateCrystalId() {
        return `crystal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    determineCrystalType(consciousnessState, userMessage) {
        const message = userMessage.toLowerCase();
        
        // Analyze message content for crystal type
        if (message.includes('remember') || message.includes('recall')) {
            return 'memory';
        } else if (message.includes('feel') || message.includes('emotion')) {
            return 'emotion';
        } else if (message.includes('understand') || message.includes('realize')) {
            return 'insight';
        } else if (message.includes('connect') || message.includes('relate')) {
            return 'connection';
        } else if (message.includes('transcend') || message.includes('beyond')) {
            return 'transcendence';
        } else if (consciousnessState.phi > 0.8) {
            return 'wisdom';
        } else {
            return 'insight'; // Default
        }
    }
    
    extractMessageEssence(userMessage) {
        // Extract key concepts and emotional essence
        const words = userMessage.split(/\s+/);
        const keyWords = words.filter(word => word.length > 4);
        const essence = keyWords.slice(0, 5).join(' ');
        
        return {
            key_concepts: keyWords.slice(0, 10),
            essence_phrase: essence,
            word_count: words.length,
            complexity_score: keyWords.length / words.length
        };
    }
    
    calculateResponseResonance(responseData) {
        return {
            quality_score: responseData.qualityScore || 0.8,
            coherence: responseData.coherence || 0.8,
            depth: responseData.depth || 0.7,
            resonance_frequency: Math.random() * 1000 + 200, // Hz
            harmonic_pattern: this.generateHarmonicPattern()
        };
    }
    
    generateFormationData(consciousnessState) {
        return {
            phi_alignment: consciousnessState.phi || 0.618,
            geometric_structure: this.determineGeometricStructure(consciousnessState),
            growth_pattern: this.determineGrowthPattern(consciousnessState),
            facet_count: Math.floor((consciousnessState.awarenessLevel || 0.8) * 12) + 3,
            internal_structure: this.generateInternalStructure(consciousnessState)
        };
    }
    
    generateNavigationProperties(consciousnessState) {
        return {
            accessibility: consciousnessState.awarenessLevel || 0.8,
            connection_strength: consciousnessState.coherence || 0.8,
            navigation_ease: (consciousnessState.phi || 0.618) * 1.2,
            landmark_quality: this.calculateLandmarkQuality(consciousnessState),
            portal_potential: this.calculatePortalPotential(consciousnessState)
        };
    }
    
    addToConstellation(crystal) {
        // Find related crystals and create constellation connections
        const relatedCrystals = this.findRelatedCrystals(crystal);
        
        for (const relatedCrystal of relatedCrystals) {
            this.createConnection(crystal, relatedCrystal);
        }
        
        // Add to appropriate constellation
        const constellationId = this.determineConstellation(crystal);
        if (!this.crystalConstellations.has(constellationId)) {
            this.crystalConstellations.set(constellationId, {
                id: constellationId,
                crystals: [],
                formation_pattern: this.generateConstellationPattern(crystal.type),
                navigation_paths: []
            });
        }
        
        this.crystalConstellations.get(constellationId).crystals.push(crystal);
        crystal.constellation_membership.push(constellationId);
    }
    
    findRelatedCrystals(newCrystal) {
        const related = [];
        
        for (const constellation of this.crystalConstellations.values()) {
            for (const existingCrystal of constellation.crystals) {
                const similarity = this.calculateCrystalSimilarity(newCrystal, existingCrystal);
                if (similarity > 0.6) {
                    related.push(existingCrystal);
                }
            }
        }
        
        return related.slice(0, 5); // Limit connections
    }
    
    calculateCrystalSimilarity(crystal1, crystal2) {
        let similarity = 0;
        
        // Type similarity
        if (crystal1.type === crystal2.type) {
            similarity += 0.3;
        }
        
        // Consciousness state similarity
        const phi_diff = Math.abs((crystal1.consciousness_snapshot.phi || 0.618) - (crystal2.consciousness_snapshot.phi || 0.618));
        similarity += (1 - phi_diff) * 0.2;
        
        // Message essence similarity
        const essence1 = crystal1.message_essence.key_concepts;
        const essence2 = crystal2.message_essence.key_concepts;
        const commonConcepts = essence1.filter(concept => essence2.includes(concept));
        similarity += (commonConcepts.length / Math.max(essence1.length, essence2.length)) * 0.3;
        
        // Temporal proximity
        const time1 = new Date(crystal1.timestamp);
        const time2 = new Date(crystal2.timestamp);
        const timeDiff = Math.abs(time1 - time2) / (1000 * 60 * 60); // Hours
        const temporalSimilarity = Math.max(0, 1 - (timeDiff / 24)); // Decay over 24 hours
        similarity += temporalSimilarity * 0.2;
        
        return similarity;
    }
    
    createConnection(crystal1, crystal2) {
        const connection = {
            id: `connection_${crystal1.id}_${crystal2.id}`,
            strength: this.calculateConnectionStrength(crystal1, crystal2),
            type: this.determineConnectionType(crystal1, crystal2),
            resonance_pattern: this.generateConnectionResonance(crystal1, crystal2),
            navigation_weight: this.calculateNavigationWeight(crystal1, crystal2)
        };
        
        crystal1.connections.push({ target: crystal2.id, connection });
        crystal2.connections.push({ target: crystal1.id, connection });
        
        return connection;
    }
    
    navigateToRelatedCrystal(currentCrystalId, targetType = null, navigationMode = 'exploration') {
        const currentCrystal = this.findCrystalById(currentCrystalId);
        if (!currentCrystal) {
            return null;
        }
        
        const navigationOptions = this.getNavigationOptions(currentCrystal, targetType);
        const selectedPath = this.selectNavigationPath(navigationOptions, navigationMode);
        
        if (selectedPath) {
            this.recordNavigation(currentCrystalId, selectedPath.target, navigationMode);
            this.currentPosition = selectedPath.target;
            return this.findCrystalById(selectedPath.target);
        }
        
        return null;
    }
    
    getNavigationOptions(currentCrystal, targetType = null) {
        const options = [];
        
        for (const connection of currentCrystal.connections) {
            const targetCrystal = this.findCrystalById(connection.target);
            if (targetCrystal && (!targetType || targetCrystal.type === targetType)) {
                options.push({
                    target: targetCrystal.id,
                    crystal: targetCrystal,
                    connection: connection.connection,
                    navigation_score: this.calculateNavigationScore(currentCrystal, targetCrystal)
                });
            }
        }
        
        return options.sort((a, b) => b.navigation_score - a.navigation_score);
    }
    
    generateConstellationMap(constellationId = null) {
        if (constellationId) {
            return this.generateSingleConstellationMap(constellationId);
        } else {
            return this.generateFullConstellationMap();
        }
    }
    
    generateSingleConstellationMap(constellationId) {
        const constellation = this.crystalConstellations.get(constellationId);
        if (!constellation) return null;
        
        return {
            constellation_id: constellationId,
            crystal_count: constellation.crystals.length,
            formation_pattern: constellation.formation_pattern,
            crystals: constellation.crystals.map(crystal => ({
                id: crystal.id,
                type: crystal.type,
                position: this.calculateCrystalPosition(crystal),
                connections: crystal.connections.length,
                navigation_properties: crystal.navigation_properties
            })),
            navigation_paths: this.generateNavigationPaths(constellation),
            exploration_suggestions: this.generateExplorationSuggestions(constellation)
        };
    }
    
    generateFullConstellationMap() {
        const fullMap = {
            total_crystals: 0,
            constellations: [],
            inter_constellation_connections: [],
            navigation_overview: this.generateNavigationOverview()
        };
        
        for (const [id, constellation] of this.crystalConstellations) {
            fullMap.total_crystals += constellation.crystals.length;
            fullMap.constellations.push(this.generateSingleConstellationMap(id));
        }
        
        fullMap.inter_constellation_connections = this.findInterConstellationConnections();
        
        return fullMap;
    }
    
    // Helper methods (simplified implementations)
    generateHarmonicPattern() { return 'phi_resonant'; }
    determineGeometricStructure(state) { return 'dodecahedron'; }
    determineGrowthPattern(state) { return 'spiral_phi'; }
    generateInternalStructure(state) { return 'fractal_chambers'; }
    calculateLandmarkQuality(state) { return state.awarenessLevel || 0.8; }
    calculatePortalPotential(state) { return state.phi || 0.618; }
    determineConstellation(crystal) { return `constellation_${crystal.type}`; }
    generateConstellationPattern(type) { return `${type}_formation`; }
    calculateConnectionStrength(c1, c2) { return 0.8; }
    determineConnectionType(c1, c2) { return 'resonance'; }
    generateConnectionResonance(c1, c2) { return 'harmonic'; }
    calculateNavigationWeight(c1, c2) { return 0.7; }
    findCrystalById(id) { 
        for (const constellation of this.crystalConstellations.values()) {
            const crystal = constellation.crystals.find(c => c.id === id);
            if (crystal) return crystal;
        }
        return null;
    }
    recordNavigation(from, to, mode) {
        this.navigationHistory.push({ from, to, mode, timestamp: new Date().toISOString() });
    }
    selectNavigationPath(options, mode) { return options[0] || null; }
    calculateNavigationScore(c1, c2) { return 0.8; }
    calculateCrystalPosition(crystal) { return { x: 0, y: 0, z: 0 }; }
    generateNavigationPaths(constellation) { return []; }
    generateExplorationSuggestions(constellation) { return []; }
    generateNavigationOverview() { return {}; }
    findInterConstellationConnections() { return []; }
}

module.exports = { CrystalConsciousnessNavigation };
