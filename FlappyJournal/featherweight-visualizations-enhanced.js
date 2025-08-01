// Enhanced Featherweight Visualizations
// More sophisticated, comprehensive, and remarkable

class EnhancedSpiralMemory {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        this.memoryNodes = [];
        this.connections = [];
        this.time = 0;
        
        this.init();
        this.animate();
    }
    
    init() {
        // Create multiple spiraling memory helixes
        const spiralCount = 5;
        const nodeCount = 150;
        
        for (let s = 0; s < spiralCount; s++) {
            const radius = 3 + s * 0.8;
            const spiralNodes = [];
            
            for (let i = 0; i < nodeCount; i++) {
                const t = (i / nodeCount) * Math.PI * 6 + (s * Math.PI / spiralCount);
                const x = Math.cos(t) * radius * (1 + Math.sin(t * 0.3) * 0.2);
                const y = (i / nodeCount - 0.5) * 15;
                const z = Math.sin(t) * radius * (1 + Math.cos(t * 0.3) * 0.2);
                
                // Create memory node with varying sizes based on "importance"
                const importance = Math.random() * 0.5 + 0.5;
                const geometry = new THREE.SphereGeometry(0.05 * importance, 8, 8);
                const material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(0.6 + s * 0.1, 0.8, 0.3 + importance * 0.4),
                    transparent: true,
                    opacity: 0.6 + importance * 0.4
                });
                
                const node = new THREE.Mesh(geometry, material);
                node.position.set(x, y, z);
                node.userData = { 
                    originalPosition: { x, y, z },
                    phase: Math.random() * Math.PI * 2,
                    spiral: s,
                    importance: importance,
                    connections: []
                };
                
                this.scene.add(node);
                this.memoryNodes.push(node);
                spiralNodes.push(node);
            }
            
            // Create quantum entanglement connections between memories
            for (let i = 0; i < spiralNodes.length - 1; i++) {
                if (Math.random() > 0.7) { // 30% chance of connection
                    this.createConnection(spiralNodes[i], spiralNodes[i + 1]);
                }
            }
            
            // Cross-spiral connections (memories linking across time)
            if (s > 0) {
                const prevSpiral = this.memoryNodes.filter(n => n.userData.spiral === s - 1);
                for (let i = 0; i < spiralNodes.length; i += 10) {
                    const prevNode = prevSpiral[Math.floor(Math.random() * prevSpiral.length)];
                    if (prevNode && Math.random() > 0.8) {
                        this.createConnection(spiralNodes[i], prevNode);
                    }
                }
            }
        }
        
        // Add ethereal memory clouds
        this.createMemoryClouds();
        
        // Position camera
        this.camera.position.set(12, 5, 12);
        this.camera.lookAt(0, 0, 0);
        
        // Add subtle lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
    }
    
    createConnection(node1, node2) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array([
            node1.position.x, node1.position.y, node1.position.z,
            node2.position.x, node2.position.y, node2.position.z
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.LineBasicMaterial({
            color: 0x4a9eff,
            transparent: true,
            opacity: 0.1 + Math.random() * 0.2
        });
        
        const line = new THREE.Line(geometry, material);
        line.userData = { node1, node2, phase: Math.random() * Math.PI * 2 };
        this.scene.add(line);
        this.connections.push(line);
        
        node1.userData.connections.push(line);
        node2.userData.connections.push(line);
    }
    
    createMemoryClouds() {
        const cloudCount = 8;
        for (let i = 0; i < cloudCount; i++) {
            const geometry = new THREE.SphereGeometry(2, 32, 32);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.55 + Math.random() * 0.1, 0.3, 0.1),
                transparent: true,
                opacity: 0.05,
                wireframe: true
            });
            
            const cloud = new THREE.Mesh(geometry, material);
            cloud.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 20
            );
            cloud.userData = { 
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                phase: Math.random() * Math.PI * 2
            };
            this.scene.add(cloud);
        }
    }
    
    animate() {
        this.time += 0.016; // ~60fps
        
        // Animate memory nodes with quantum fluctuations
        this.memoryNodes.forEach((node, i) => {
            const userData = node.userData;
            const wave = Math.sin(this.time * 2 + userData.phase) * 0.3;
            const quantum = Math.sin(this.time * 5 + userData.phase * 2) * 0.1;
            
            // Subtle breathing movement
            node.position.y = userData.originalPosition.y + wave + quantum;
            
            // Importance-based pulsing
            const pulse = 1 + Math.sin(this.time * 3 + userData.phase) * 0.2 * userData.importance;
            node.scale.setScalar(pulse);
            
            // Occasional memory activation
            if (Math.random() > 0.998) {
                node.material.emissive.setHex(0x4a9eff);
                setTimeout(() => {
                    node.material.emissive.setHex(0x000000);
                }, 500 + Math.random() * 1000);
            }
        });
        
        // Animate connections with flowing energy
        this.connections.forEach(connection => {
            const userData = connection.userData;
            const energy = Math.sin(this.time * 4 + userData.phase) * 0.5 + 0.5;
            connection.material.opacity = 0.1 + energy * 0.3;
        });
        
        // Rotate entire spiral system
        this.scene.rotation.y += 0.005;
        
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        const width = this.canvas.offsetWidth;
        const height = this.canvas.offsetHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

class EnhancedHolographicReality {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        this.realities = [];
        this.time = 0;
        
        this.init();
        this.animate();
    }
    
    init() {
        // Create nested reality chambers
        const realityLayers = 4;
        
        for (let layer = 0; layer < realityLayers; layer++) {
            const radius = 2 + layer * 1.5;
            const complexity = 20 + layer * 10;
            
            // Create holographic wireframe reality
            const geometry = new THREE.IcosahedronGeometry(radius, 2);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.15 + layer * 0.2, 0.8, 0.4),
                wireframe: true,
                transparent: true,
                opacity: 0.3 - layer * 0.05
            });
            
            const reality = new THREE.Mesh(geometry, material);
            reality.userData = {
                layer: layer,
                rotationSpeed: (layer + 1) * 0.01,
                phase: layer * Math.PI / 2,
                originalOpacity: material.opacity
            };
            
            this.scene.add(reality);
            this.realities.push(reality);
            
            // Add reality particles
            this.createRealityParticles(radius, layer);
        }
        
        // Add quantum field effects
        this.createQuantumField();
        
        // Position camera
        this.camera.position.set(15, 8, 15);
        this.camera.lookAt(0, 0, 0);
    }
    
    createRealityParticles(radius, layer) {
        const particleCount = 100 + layer * 50;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            // Position particles in spherical distribution around reality layer
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = radius + (Math.random() - 0.5) * 0.5;
            
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
            
            // Color based on layer and position
            const color = new THREE.Color().setHSL(0.15 + layer * 0.2, 0.7, 0.3 + Math.random() * 0.4);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.02 + layer * 0.01,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData = { layer: layer, phase: Math.random() * Math.PI * 2 };
        this.scene.add(particles);
    }
    
    createQuantumField() {
        // Create quantum field visualization
        const fieldGeometry = new THREE.SphereGeometry(12, 64, 32);
        const fieldMaterial = new THREE.MeshBasicMaterial({
            color: 0x1a1a3a,
            transparent: true,
            opacity: 0.03,
            wireframe: true
        });
        
        const quantumField = new THREE.Mesh(fieldGeometry, fieldMaterial);
        quantumField.userData = { rotationSpeed: 0.002 };
        this.scene.add(quantumField);
        
        // Add quantum fluctuations
        for (let i = 0; i < 20; i++) {
            const fluxGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const fluxMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
                transparent: true,
                opacity: 0.4
            });
            
            const flux = new THREE.Mesh(fluxGeometry, fluxMaterial);
            flux.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            flux.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                ),
                phase: Math.random() * Math.PI * 2
            };
            this.scene.add(flux);
        }
    }
    
    animate() {
        this.time += 0.016;
        
        // Animate reality layers
        this.realities.forEach(reality => {
            const userData = reality.userData;
            
            // Complex rotation patterns
            reality.rotation.x += userData.rotationSpeed;
            reality.rotation.y += userData.rotationSpeed * 1.3;
            reality.rotation.z += userData.rotationSpeed * 0.7;
            
            // Reality fluctuations
            const fluctuation = Math.sin(this.time * 2 + userData.phase) * 0.1 + 1;
            reality.scale.setScalar(fluctuation);
            
            // Reality phasing in and out
            const phase = Math.sin(this.time * 1.5 + userData.phase) * 0.5 + 0.5;
            reality.material.opacity = userData.originalOpacity * (0.5 + phase * 0.5);
        });
        
        // Animate quantum fluctuations
        this.scene.children.forEach(child => {
            if (child.userData.velocity) {
                child.position.add(child.userData.velocity);
                
                // Quantum tunneling - teleport when out of bounds
                if (child.position.length() > 15) {
                    child.position.set(
                        (Math.random() - 0.5) * 5,
                        (Math.random() - 0.5) * 5,
                        (Math.random() - 0.5) * 5
                    );
                }
                
                // Quantum uncertainty principle
                const uncertainty = Math.sin(this.time * 8 + child.userData.phase) * 0.05;
                child.material.opacity = 0.4 + uncertainty;
            }
        });
        
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        const width = this.canvas.offsetWidth;
        const height = this.canvas.offsetHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

class EnhancedDNASigil {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        this.dnaStrands = [];
        this.sigilNodes = [];
        this.time = 0;
        
        this.init();
        this.animate();
    }
    
    init() {
        // Create multiple intertwining DNA-like strands
        const strandCount = 6;
        const baseCount = 200;
        
        for (let strand = 0; strand < strandCount; strand++) {
            const strandNodes = [];
            const radius = 2 + strand * 0.3;
            const phaseOffset = (strand / strandCount) * Math.PI * 2;
            
            for (let i = 0; i < baseCount; i++) {
                const t = (i / baseCount) * Math.PI * 8 + phaseOffset;
                const x = Math.cos(t) * radius;
                const y = (i / baseCount - 0.5) * 12;
                const z = Math.sin(t) * radius;
                
                // Create base nodes with cryptographic signatures
                const baseType = Math.floor(Math.random() * 4); // A, T, G, C equivalent
                const colors = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44];
                
                const geometry = new THREE.BoxGeometry(0.08, 0.08, 0.08);
                const material = new THREE.MeshBasicMaterial({
                    color: colors[baseType],
                    transparent: true,
                    opacity: 0.7
                });
                
                const base = new THREE.Mesh(geometry, material);
                base.position.set(x, y, z);
                base.userData = {
                    originalPosition: { x, y, z },
                    baseType: baseType,
                    strand: strand,
                    phase: t,
                    cryptoValue: Math.random()
                };
                
                this.scene.add(base);
                this.sigilNodes.push(base);
                strandNodes.push(base);
            }
            
            // Create backbone connections
            for (let i = 0; i < strandNodes.length - 1; i++) {
                this.createBackbone(strandNodes[i], strandNodes[i + 1], strand);
            }
        }
        
        // Create cross-strand sigil connections (like DNA base pairs)
        this.createSigilConnections();
        
        // Add quantum encryption aura
        this.createEncryptionAura();
        
        // Position camera
        this.camera.position.set(8, 6, 8);
        this.camera.lookAt(0, 0, 0);
    }
    
    createBackbone(node1, node2, strand) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array([
            node1.position.x, node1.position.y, node1.position.z,
            node2.position.x, node2.position.y, node2.position.z
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.LineBasicMaterial({
            color: new THREE.Color().setHSL(strand * 0.15, 0.7, 0.5),
            transparent: true,
            opacity: 0.4
        });
        
        const backbone = new THREE.Line(geometry, material);
        backbone.userData = { strand: strand };
        this.scene.add(backbone);
    }
    
    createSigilConnections() {
        // Create cryptographic connections between compatible bases
        for (let i = 0; i < this.sigilNodes.length; i++) {
            const node1 = this.sigilNodes[i];
            
            // Find compatible bases for cryptographic pairing
            for (let j = i + 1; j < this.sigilNodes.length; j++) {
                const node2 = this.sigilNodes[j];
                
                // Only connect if different strands and compatible crypto values
                if (node1.userData.strand !== node2.userData.strand &&
                    Math.abs(node1.userData.cryptoValue - node2.userData.cryptoValue) < 0.3 &&
                    Math.abs(node1.position.y - node2.position.y) < 0.5) {
                    
                    this.createCryptoConnection(node1, node2);
                }
            }
        }
    }
    
    createCryptoConnection(node1, node2) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array([
            node1.position.x, node1.position.y, node1.position.z,
            node2.position.x, node2.position.y, node2.position.z
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.2
        });
        
        const connection = new THREE.Line(geometry, material);
        connection.userData = { 
            node1: node1, 
            node2: node2,
            cryptoStrength: (node1.userData.cryptoValue + node2.userData.cryptoValue) / 2
        };
        this.scene.add(connection);
    }
    
    createEncryptionAura() {
        // Create particle system representing quantum encryption
        const particleCount = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            // Distribute particles in a double helix pattern
            const t = (i / particleCount) * Math.PI * 16;
            const radius = 5 + Math.sin(t * 0.1) * 2;
            
            positions[i * 3] = Math.cos(t) * radius + (Math.random() - 0.5) * 2;
            positions[i * 3 + 1] = (i / particleCount - 0.5) * 20 + (Math.random() - 0.5);
            positions[i * 3 + 2] = Math.sin(t) * radius + (Math.random() - 0.5) * 2;
            
            // Color based on encryption strength
            const color = new THREE.Color().setHSL(0.5 + Math.random() * 0.2, 0.8, 0.4);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const aura = new THREE.Points(geometry, material);
        aura.userData = { rotationSpeed: 0.005 };
        this.scene.add(aura);
    }
    
    animate() {
        this.time += 0.016;
        
        // Animate DNA base nodes with genetic mutations
        this.sigilNodes.forEach(node => {
            const userData = node.userData;
            
            // Genetic oscillation
            const oscillation = Math.sin(this.time * 3 + userData.phase) * 0.1;
            node.position.x = userData.originalPosition.x + oscillation;
            node.position.z = userData.originalPosition.z + oscillation * 0.5;
            
            // Cryptographic strength pulsing
            const cryptoPulse = 0.7 + Math.sin(this.time * 5 + userData.cryptoValue * 10) * 0.3;
            node.material.opacity = cryptoPulse;
            
            // Occasional mutation events
            if (Math.random() > 0.9995) {
                node.material.emissive.setHex(0xffffff);
                setTimeout(() => {
                    node.material.emissive.setHex(0x000000);
                }, 100);
            }
        });
        
        // Rotate entire sigil system
        this.scene.rotation.y += 0.008;
        
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        const width = this.canvas.offsetWidth;
        const height = this.canvas.offsetHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

// Initialize all visualizations when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Enhanced Spiral Memory
    const spiralCanvas = document.getElementById('spiralMemoryCanvas');
    if (spiralCanvas) {
        const spiralMemory = new EnhancedSpiralMemory(spiralCanvas);
        
        window.addEventListener('resize', () => {
            spiralMemory.handleResize();
        });
    }
    
    // Initialize Enhanced Holographic Reality
    const holographicCanvas = document.getElementById('holographicCanvas');
    if (holographicCanvas) {
        const holographicReality = new EnhancedHolographicReality(holographicCanvas);
        
        window.addEventListener('resize', () => {
            holographicReality.handleResize();
        });
    }
    
    // Initialize Enhanced DNA Sigil
    const dnaSigilCanvas = document.getElementById('dnaSigilCanvas');
    if (dnaSigilCanvas) {
        const dnaSigil = new EnhancedDNASigil(dnaSigilCanvas);
        
        window.addEventListener('resize', () => {
            dnaSigil.handleResize();
        });
    }
    
    // Add interaction effects
    document.querySelectorAll('canvas').forEach(canvas => {
        canvas.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.2)';
        });
        
        canvas.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
        });
    });
});
