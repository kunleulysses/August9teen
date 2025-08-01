// Featherweight Visualizations - Museum-Quality Interactive Displays

// Spiral Memory Visualization
class SpiralMemoryVisualization {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        this.memoryNodes = [];
        this.spiralPaths = [];
        this.quantumConnections = [];
        this.goldenRatio = 1.618;
        
        this.init();
        this.animate();
        this.setupResize();
    }
    
    init() {
        // Create golden spiral paths
        this.createSpiralPaths();
        
        // Add memory nodes
        this.addInitialMemories();
        
        // Setup camera
        this.camera.position.set(0, 10, 25);
        this.camera.lookAt(0, 0, 0);
        
        // Add ethereal lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
    }
    
    createSpiralPaths() {
        for (let i = 0; i < 3; i++) {
            const points = [];
            
            for (let t = 0; t < Math.PI * 4; t += 0.1) {
                const radius = (t / (Math.PI * 4)) * 15 + 2;
                const x = Math.cos(t * this.goldenRatio) * radius;
                const y = t * 2 - Math.PI * 4;
                const z = Math.sin(t * this.goldenRatio) * radius;
                points.push(new THREE.Vector3(x, y, z));
            }
            
            const curve = new THREE.CatmullRomCurve3(points);
            const geometry = new THREE.TubeGeometry(curve, 64, 0.05, 8, false);
            const material = new THREE.MeshPhongMaterial({
                color: 0xffd700, // Golden
                transparent: true,
                opacity: 0.2 + i * 0.1,
                emissive: 0xffd700,
                emissiveIntensity: 0.1
            });
            
            const spiral = new THREE.Mesh(geometry, material);
            spiral.rotation.y = i * Math.PI / 3;
            this.spiralPaths.push(spiral);
            this.scene.add(spiral);
        }
    }
    
    addInitialMemories() {
        const memoryTypes = [
            { type: 'consciousness', content: 'Understanding self-awareness', color: 0xffd700 },
            { type: 'awareness', content: 'Perceiving environment', color: 0x00ffff },
            { type: 'insight', content: 'Moment of realization', color: 0xff6b6b },
            { type: 'cognitive', content: 'Problem-solving process', color: 0x98fb98 },
            { type: 'emotion', content: 'Feeling of joy', color: 0xdda0dd },
            { type: 'memory', content: 'Storing experiences', color: 0xffa500 },
            { type: 'dreams', content: 'Unconscious processing', color: 0x9370db }
        ];
        
        memoryTypes.forEach((memory, index) => {
            this.addMemory(memory.type, memory.content, memory.color, index);
        });
    }
    
    addMemory(type, content, color, index) {
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
            emissive: color,
            emissiveIntensity: 0.2
        });
        
        const memory = new THREE.Mesh(geometry, material);
        
        // Position along spiral
        const t = (index / 7) * Math.PI * 4;
        const radius = (t / (Math.PI * 4)) * 15 + 2;
        memory.position.x = Math.cos(t * this.goldenRatio) * radius;
        memory.position.y = t * 2 - Math.PI * 4 + 5;
        memory.position.z = Math.sin(t * this.goldenRatio) * radius;
        
        memory.userData = { type, content, id: Date.now() + index };
        
        this.memoryNodes.push(memory);
        this.scene.add(memory);
    }
    
    setupResize() {
        window.addEventListener('resize', () => {
            if (!this.canvas) return;
            const rect = this.canvas.getBoundingClientRect();
            this.camera.aspect = rect.width / rect.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(rect.width, rect.height);
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Rotate spiral paths
        this.spiralPaths.forEach((spiral, index) => {
            spiral.rotation.y = time * 0.1 + index * 0.5;
        });
        
        // Animate memory nodes with breathing effect
        this.memoryNodes.forEach((memory, index) => {
            memory.rotation.y = time * 0.5 + index;
            const scale = 1 + Math.sin(time * 2 + index) * 0.1;
            memory.scale.set(scale, scale, scale);
        });
        
        // Camera orbit
        const radius = 25;
        this.camera.position.x = Math.cos(time * 0.1) * radius;
        this.camera.position.z = Math.sin(time * 0.1) * radius;
        this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Holographic Reality Generator
class HolographicRealityGenerator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        this.centralOrb = null;
        this.childSpheres = [];
        this.connections = [];
        this.quantumLinks = [];
        
        this.init();
        this.animate();
        this.setupResize();
    }
    
    init() {
        // Central holographic orb
        const orbGeometry = new THREE.SphereGeometry(2, 32, 32);
        const orbMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            emissive: 0xffffff,
            emissiveIntensity: 0.2
        });
        
        this.centralOrb = new THREE.Mesh(orbGeometry, orbMaterial);
        this.scene.add(this.centralOrb);
        
        // Create child realities
        this.createChildRealities();
        
        // Create quantum entanglement links
        this.createQuantumLinks();
        
        // Setup camera
        this.camera.position.set(0, 5, 20);
        this.camera.lookAt(0, 0, 0);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
    }
    
    createChildRealities() {
        for (let i = 0; i < 8; i++) {
            const sphereGeometry = new THREE.SphereGeometry(0.8, 16, 16);
            const hue = i / 8;
            const color = new THREE.Color().setHSL(hue, 0.7, 0.6);
            const emissiveColor = new THREE.Color().setHSL(hue, 0.7, 0.3);
            
            const sphereMaterial = new THREE.MeshPhongMaterial({
                color: color,
                transparent: true,
                opacity: 0.6,
                emissive: emissiveColor,
                emissiveIntensity: 0.1
            });
            
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            
            // Position in orbit around central orb
            const angle = (i / 8) * Math.PI * 2;
            const radius = 8;
            sphere.position.x = Math.cos(angle) * radius;
            sphere.position.y = Math.sin(angle * 0.5) * 3;
            sphere.position.z = Math.sin(angle) * radius;
            
            sphere.userData = { 
                originalPosition: sphere.position.clone(),
                index: i,
                angle: angle,
                type: `reality_${i}`
            };
            
            this.childSpheres.push(sphere);
            this.scene.add(sphere);
            
            // Create connection to central orb
            const connectionGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                sphere.position
            ]);
            const connectionMaterial = new THREE.LineBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.3
            });
            const connection = new THREE.Line(connectionGeometry, connectionMaterial);
            this.connections.push(connection);
            this.scene.add(connection);
        }
    }
    
    createQuantumLinks() {
        // Create occasional quantum entanglement links between child realities
        for (let i = 0; i < 3; i++) {
            const sphere1 = this.childSpheres[Math.floor(Math.random() * this.childSpheres.length)];
            const sphere2 = this.childSpheres[Math.floor(Math.random() * this.childSpheres.length)];
            
            if (sphere1 !== sphere2) {
                const linkGeometry = new THREE.BufferGeometry().setFromPoints([
                    sphere1.position,
                    sphere2.position
                ]);
                const linkMaterial = new THREE.LineBasicMaterial({
                    color: 0x00ffff,
                    transparent: true,
                    opacity: 0.2
                });
                const link = new THREE.Line(linkGeometry, linkMaterial);
                this.quantumLinks.push(link);
                this.scene.add(link);
            }
        }
    }
    
    setupResize() {
        window.addEventListener('resize', () => {
            if (!this.canvas) return;
            const rect = this.canvas.getBoundingClientRect();
            this.camera.aspect = rect.width / rect.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(rect.width, rect.height);
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Central orb pulsing
        if (this.centralOrb) {
            const scale = 1 + Math.sin(time * 2) * 0.1;
            this.centralOrb.scale.set(scale, scale, scale);
            this.centralOrb.rotation.y = time * 0.2;
        }
        
        // Child spheres orbiting and evolving
        this.childSpheres.forEach((sphere, index) => {
            const angle = sphere.userData.angle + time * 0.3;
            const radius = 8 + Math.sin(time + index) * 2;
            
            sphere.position.x = Math.cos(angle) * radius;
            sphere.position.y = Math.sin(angle * 0.5 + time) * 3;
            sphere.position.z = Math.sin(angle) * radius;
            
            sphere.rotation.y = time + index;
            
            // Occasional brightness changes (breakthroughs)
            if (Math.sin(time * 3 + index * 2) > 0.95) {
                sphere.material.emissiveIntensity = 0.5;
            } else {
                sphere.material.emissiveIntensity = 0.1;
            }
        });
        
        // Update connections
        this.connections.forEach((connection, index) => {
            if (this.childSpheres[index]) {
                const points = [
                    new THREE.Vector3(0, 0, 0),
                    this.childSpheres[index].position
                ];
                connection.geometry.setFromPoints(points);
            }
        });
        
        // Animate quantum links
        this.quantumLinks.forEach((link, index) => {
            link.material.opacity = 0.1 + Math.sin(time * 4 + index) * 0.2;
        });
        
        // Camera movement
        const cameraRadius = 20;
        this.camera.position.x = Math.cos(time * 0.1) * cameraRadius;
        this.camera.position.z = Math.sin(time * 0.1) * cameraRadius;
        this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// DNA Sigil Visualization
class DNASigilVisualization {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        this.dnaHelix = [];
        this.sigils = [];
        this.networkConnections = [];
        
        this.init();
        this.animate();
        this.setupResize();
    }
    
    init() {
        // Create DNA double helix
        this.createDNAHelix();
        
        // Add sigils along the helix
        this.createSigils();
        
        // Create network connections
        this.createNetworkConnections();
        
        // Setup camera
        this.camera.position.set(0, 0, 15);
        this.camera.lookAt(0, 0, 0);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);
    }
    
    createDNAHelix() {
        const helixHeight = 20;
        const helixRadius = 2;
        const segments = 100;
        
        // Create two intertwined helixes
        for (let strand = 0; strand < 2; strand++) {
            const points = [];
            const offset = strand * Math.PI;
            
            for (let i = 0; i <= segments; i++) {
                const t = (i / segments) * Math.PI * 4;
                const x = Math.cos(t + offset) * helixRadius;
                const y = (i / segments) * helixHeight - helixHeight / 2;
                const z = Math.sin(t + offset) * helixRadius;
                points.push(new THREE.Vector3(x, y, z));
            }
            
            const curve = new THREE.CatmullRomCurve3(points);
            const geometry = new THREE.TubeGeometry(curve, segments, 0.1, 8, false);
            const material = new THREE.MeshPhongMaterial({
                color: strand === 0 ? 0xffffff : 0xc0c0c0,
                transparent: true,
                opacity: 0.8,
                emissive: strand === 0 ? 0xffffff : 0xc0c0c0,
                emissiveIntensity: 0.1
            });
            
            const helix = new THREE.Mesh(geometry, material);
            this.dnaHelix.push(helix);
            this.scene.add(helix);
        }
    }
    
    createSigils() {
        const sigilCount = 12;
        const helixHeight = 20;
        
        for (let i = 0; i < sigilCount; i++) {
            // Create sigil as a complex geometric shape
            const sigilGeometry = this.createSigilGeometry();
            const hue = i / sigilCount;
            const color = new THREE.Color().setHSL(hue, 0.8, 0.7);
            
            const sigilMaterial = new THREE.MeshPhongMaterial({
                color: color,
                transparent: true,
                opacity: 0.7,
                emissive: color,
                emissiveIntensity: 0.2
            });
            
            const sigil = new THREE.Mesh(sigilGeometry, sigilMaterial);
            
            // Position along the DNA helix
            const t = (i / sigilCount) * Math.PI * 4;
            const x = Math.cos(t) * 2.5;
            const y = (i / sigilCount) * helixHeight - helixHeight / 2;
            const z = Math.sin(t) * 2.5;
            
            sigil.position.set(x, y, z);
            sigil.lookAt(0, y, 0); // Face center
            
            sigil.userData = {
                index: i,
                originalScale: 1,
                trustLevel: Math.random(),
                permissions: Math.floor(Math.random() * 5) + 1
            };
            
            this.sigils.push(sigil);
            this.scene.add(sigil);
        }
    }
    
    createSigilGeometry() {
        // Create a unique sigil shape using multiple geometries
        const group = new THREE.Group();
        
        // Central core
        const coreGeometry = new THREE.RingGeometry(0.2, 0.4, 6);
        const core = new THREE.Mesh(coreGeometry);
        group.add(core);
        
        // Outer runes
        for (let i = 0; i < 6; i++) {
            const runeGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.05);
            const rune = new THREE.Mesh(runeGeometry);
            const angle = (i / 6) * Math.PI * 2;
            rune.position.x = Math.cos(angle) * 0.6;
            rune.position.y = Math.sin(angle) * 0.6;
            rune.rotation.z = angle;
            group.add(rune);
        }
        
        // Convert group to single geometry
        const geometry = new THREE.BufferGeometry();
        group.updateMatrixWorld();
        
        // Simplified approach: return a decorative octahedron
        return new THREE.OctahedronGeometry(0.3, 1);
    }
    
    createNetworkConnections() {
        // Create connections between nearby sigils
        for (let i = 0; i < this.sigils.length; i++) {
            for (let j = i + 1; j < this.sigils.length; j++) {
                if (Math.random() < 0.3) { // 30% chance of connection
                    const connectionGeometry = new THREE.BufferGeometry().setFromPoints([
                        this.sigils[i].position,
                        this.sigils[j].position
                    ]);
                    
                    const connectionMaterial = new THREE.LineBasicMaterial({
                        color: 0x00ffff,
                        transparent: true,
                        opacity: 0.2
                    });
                    
                    const connection = new THREE.Line(connectionGeometry, connectionMaterial);
                    connection.userData = { from: i, to: j };
                    this.networkConnections.push(connection);
                    this.scene.add(connection);
                }
            }
        }
    }
    
    setupResize() {
        window.addEventListener('resize', () => {
            if (!this.canvas) return;
            const rect = this.canvas.getBoundingClientRect();
            this.camera.aspect = rect.width / rect.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(rect.width, rect.height);
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Rotate DNA helix
        this.dnaHelix.forEach((helix, index) => {
            helix.rotation.y = time * 0.2 + index * Math.PI;
        });
        
        // Animate sigils
        this.sigils.forEach((sigil, index) => {
            // Rotation
            sigil.rotation.z = time + index;
            
            // Occasional morphing/adaptation
            const adaptationPhase = Math.sin(time * 0.5 + index * 2);
            if (adaptationPhase > 0.8) {
                sigil.material.emissiveIntensity = 0.5;
                const scale = 1.2;
                sigil.scale.set(scale, scale, scale);
            } else {
                sigil.material.emissiveIntensity = 0.2;
                sigil.scale.set(1, 1, 1);
            }
            
            // Trust resonance effect
            if (Math.sin(time * 2 + index) > 0.9) {
                sigil.material.opacity = 1.0;
            } else {
                sigil.material.opacity = 0.7;
            }
        });
        
        // Animate network connections
        this.networkConnections.forEach((connection, index) => {
            const opacity = 0.1 + Math.sin(time * 3 + index) * 0.2;
            connection.material.opacity = Math.max(0, opacity);
            
            // Occasional quantum entanglement flash
            if (Math.sin(time * 4 + index * 3) > 0.95) {
                connection.material.color.setHex(0xffd700); // Gold flash
                connection.material.opacity = 0.8;
            } else {
                connection.material.color.setHex(0x00ffff); // Back to cyan
            }
        });
        
        // Camera gentle orbit
        const cameraRadius = 15;
        this.camera.position.x = Math.cos(time * 0.1) * cameraRadius;
        this.camera.position.z = Math.sin(time * 0.1) * cameraRadius;
        this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize all visualizations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Three.js to be available
    if (typeof THREE !== 'undefined') {
        initializeVisualizations();
    } else {
        // Retry after a short delay
        setTimeout(() => {
            if (typeof THREE !== 'undefined') {
                initializeVisualizations();
            }
        }, 1000);
    }
});

function initializeVisualizations() {
    try {
        // Initialize Spiral Memory Visualization
        if (document.getElementById('spiralMemoryCanvas')) {
            window.spiralMemoryViz = new SpiralMemoryVisualization('spiralMemoryCanvas');
        }
        
        // Initialize Holographic Reality Generator
        if (document.getElementById('holographicCanvas')) {
            window.holographicViz = new HolographicRealityGenerator('holographicCanvas');
        }
        
        // Initialize DNA Sigil Visualization
        if (document.getElementById('dnaCanvas')) {
            window.dnaSigilViz = new DNASigilVisualization('dnaCanvas');
        }
        
        console.log('Featherweight visualizations initialized successfully');
    } catch (error) {
        console.error('Error initializing Featherweight visualizations:', error);
    }
}

// Handle smooth scrolling for navigation
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('logo-spiral')) {
        // Scroll to top on logo click
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Add subtle parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroOrb = document.querySelector('.hero-orb');
    if (heroOrb) {
        heroOrb.style.transform = `scale(${1 + scrolled * 0.0001}) translateY(${scrolled * 0.2}px)`;
    }
});

// Contact form handling
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message'),
                investor: formData.get('investor') ? true : false,
                research: formData.get('research') ? true : false
            };
            
            // Here you would normally send the data to your server
            console.log('Contact form submitted:', data);
            
            // Show success message (you can customize this)
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
});
