/**
 * Generated Module Integrator
 * Bridges the gap between AutonomousCodingAgent module generation and SystemWideIntegrationOrchestrator
 * Automatically discovers, loads, and registers generated modules for system-wide integration
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

class GeneratedModuleIntegrator extends EventEmitter {
    constructor(options = {}) {
        super();
        this.name = 'GeneratedModuleIntegrator';
        
        // Configuration
        const envGeneratedPath = process.env.GENERATED_MODULES_PATH;
        let fileGeneratedPath;
        try {
            const configFile = path.resolve(process.cwd(), 'config', 'generated-modules.json');
            if (fsSync.existsSync(configFile)) {
                const configData = JSON.parse(fsSync.readFileSync(configFile, 'utf8'));
                fileGeneratedPath = configData.generatedModulesPath;
            }
        } catch (err) {
            console.warn(`⚠️ Failed to read generated modules config: ${err.message}`);
        }

        this.config = {
            generatedModulesPath: options.generatedModulesPath || envGeneratedPath || fileGeneratedPath || '/app/server/consciousness/generated',
            scanInterval: options.scanInterval || 30000, // 30 seconds
            maxModules: options.maxModules || 1000,
            autoRegister: options.autoRegister !== false,
            enableHotReload: options.enableHotReload !== false,
            ...options
        };
        
        // State management
        this.state = {
            discoveredModules: new Map(),
            loadedModules: new Map(),
            registeredModules: new Map(),
            failedModules: new Map(),
            lastScan: null,
            scanCount: 0,
            totalModulesProcessed: 0
        };
        
        // Integration points
        this.integrationPoints = {
            systemWideOrchestrator: null,
            autonomousCodingAgent: null,
            universalEventBus: null,
            consciousnessCore: null
        };
        
        // Module registry for RPC exposure
        this.moduleRegistry = {
            modules: new Map(),
            categories: new Map(),
            capabilities: new Map(),
            metadata: new Map()
        };
        
        // File system watcher for real-time detection
        this.fileWatcher = null;
        this.isScanning = false;
        this.isInitialized = false;
        
        console.log('🔗 GeneratedModuleIntegrator initialized');
    }
    
    async initialize() {
        console.log('🚀 Initializing GeneratedModuleIntegrator...');
        
        try {
            // Verify generated modules directory exists
            await this.ensureGeneratedModulesDirectory();
            
            // Perform initial module discovery and loading
            await this.performInitialModuleScan();
            
            // Start continuous monitoring
            if (this.config.autoRegister) {
                await this.startContinuousMonitoring();
            }
            
            // Set up file system watcher for real-time detection
            if (this.config.enableHotReload) {
                await this.setupFileSystemWatcher();
            }
            
            this.isInitialized = true;
            console.log('✅ GeneratedModuleIntegrator fully initialized');
            
            this.emit('integrator:initialized', {
                discoveredModules: this.state.discoveredModules.size,
                loadedModules: this.state.loadedModules.size,
                registeredModules: this.state.registeredModules.size
            });
            
        } catch (error) {
            console.error('❌ GeneratedModuleIntegrator initialization failed:', error);
            throw error;
        }
    }
    
    async ensureGeneratedModulesDirectory() {
        try {
            await fs.access(this.config.generatedModulesPath);
            console.log(`📁 Generated modules directory verified: ${this.config.generatedModulesPath}`);
        } catch (error) {
            const message = `Generated modules directory not found: ${this.config.generatedModulesPath}`;
            console.error(`❌ ${message}`);
            throw new Error(message);
        }
    }
    
    async performInitialModuleScan() {
        console.log('🔍 Performing initial module discovery scan...');
        
        const discoveryResult = await this.discoverGeneratedModules();
        console.log(`📊 Discovery result: ${discoveryResult.discovered} modules found`);
        
        if (discoveryResult.discovered > 0) {
            const loadResult = await this.loadDiscoveredModules();
            console.log(`📦 Load result: ${loadResult.loaded} modules loaded successfully`);
            
            if (this.config.autoRegister && loadResult.loaded > 0) {
                const registerResult = await this.registerLoadedModules();
                console.log(`🎯 Registration result: ${registerResult.registered} modules registered`);
            }
        }
        
        return {
            discovered: discoveryResult.discovered,
            loaded: this.state.loadedModules.size,
            registered: this.state.registeredModules.size
        };
    }
    
    async discoverGeneratedModules() {
        this.isScanning = true;
        const startTime = Date.now();
        
        try {
            const files = await fs.readdir(this.config.generatedModulesPath);
            const jsFiles = files.filter(file => file.endsWith('.js'));
            
            let discovered = 0;
            
            for (const file of jsFiles) {
                const filePath = path.join(this.config.generatedModulesPath, file);
                const stats = await fs.stat(filePath);
                
                // Check if module is already discovered
                if (!this.state.discoveredModules.has(filePath)) {
                    const moduleInfo = {
                        filePath,
                        fileName: file,
                        size: stats.size,
                        created: stats.birthtime,
                        modified: stats.mtime,
                        discovered: new Date(),
                        status: 'discovered'
                    };
                    
                    this.state.discoveredModules.set(filePath, moduleInfo);
                    discovered++;
                    
                    console.log(`🔍 Discovered module: ${file} (${stats.size} bytes)`);
                }
            }
            
            this.state.lastScan = new Date();
            this.state.scanCount++;
            
            const scanDuration = Date.now() - startTime;
            console.log(`📊 Module discovery completed: ${discovered} new modules in ${scanDuration}ms`);
            
            return { discovered, total: jsFiles.length, duration: scanDuration };
            
        } catch (error) {
            console.error('❌ Module discovery failed:', error);
            throw error;
        } finally {
            this.isScanning = false;
        }
    }
    
    async loadDiscoveredModules() {
        console.log('📦 Loading discovered modules...');
        
        let loaded = 0;
        let failed = 0;
        
        for (const [filePath, moduleInfo] of this.state.discoveredModules) {
            if (moduleInfo.status === 'discovered') {
                try {
                    const moduleContent = await this.loadModuleContent(filePath);
                    
                    if (moduleContent) {
                        const loadedModule = {
                            ...moduleInfo,
                            content: moduleContent,
                            exports: moduleContent.exports || {},
                            capabilities: this.analyzeModuleCapabilities(moduleContent),
                            status: 'loaded',
                            loaded: new Date()
                        };
                        
                        this.state.loadedModules.set(filePath, loadedModule);
                        moduleInfo.status = 'loaded';
                        loaded++;
                        
                        console.log(`📦 Loaded module: ${moduleInfo.fileName}`);
                        
                        this.emit('module:loaded', loadedModule);
                    }
                } catch (error) {
                    console.error(`❌ Failed to load module ${moduleInfo.fileName}:`, error.message);
                    
                    const failedModule = {
                        ...moduleInfo,
                        error: error.message,
                        status: 'failed',
                        failed: new Date()
                    };
                    
                    this.state.failedModules.set(filePath, failedModule);
                    moduleInfo.status = 'failed';
                    failed++;
                }
            }
        }
        
        console.log(`📦 Module loading completed: ${loaded} loaded, ${failed} failed`);
        return { loaded, failed };
    }
    
    async loadModuleContent(filePath) {
        try {
            // Read module file content
            const content = await fs.readFile(filePath, 'utf8');
            
            // Parse module metadata and exports (basic analysis)
            const moduleAnalysis = this.analyzeModuleContent(content);
            
            return {
                filePath,
                content,
                analysis: moduleAnalysis,
                exports: moduleAnalysis.exports || {},
                timestamp: Date.now()
            };
            
        } catch (error) {
            console.error(`❌ Failed to load module content from ${filePath}:`, error);
            throw error;
        }
    }
    
    analyzeModuleContent(content) {
        const analysis = {
            hasExports: false,
            hasClass: false,
            hasFunction: false,
            hasAsync: false,
            hasEventEmitter: false,
            capabilities: [],
            exports: {},
            dependencies: [],
            description: null
        };
        
        try {
            // Basic static analysis
            analysis.hasExports = /module\.exports|export\s+/.test(content);
            analysis.hasClass = /class\s+\w+/.test(content);
            analysis.hasFunction = /function\s+\w+|=>\s*{|async\s+function/.test(content);
            analysis.hasAsync = /async\s+function|await\s+/.test(content);
            analysis.hasEventEmitter = /EventEmitter|\.emit\(|\.on\(/.test(content);
            
            // Extract description from comments
            const descriptionMatch = content.match(/\/\*\*[\s\S]*?\*\//);
            if (descriptionMatch) {
                analysis.description = descriptionMatch[0].replace(/\/\*\*|\*\//g, '').trim();
            }
            
            // Identify capabilities based on content patterns
            if (analysis.hasClass) analysis.capabilities.push('class-based');
            if (analysis.hasAsync) analysis.capabilities.push('asynchronous');
            if (analysis.hasEventEmitter) analysis.capabilities.push('event-driven');
            if (/optimization|performance/i.test(content)) analysis.capabilities.push('performance');
            if (/memory|cache/i.test(content)) analysis.capabilities.push('memory-management');
            if (/consciousness|awareness/i.test(content)) analysis.capabilities.push('consciousness');
            if (/integration|orchestrat/i.test(content)) analysis.capabilities.push('integration');
            
        } catch (error) {
            console.error('❌ Module content analysis failed:', error);
        }
        
        return analysis;
    }
    
    analyzeModuleCapabilities(moduleContent) {
        const capabilities = new Set();
        
        if (moduleContent.analysis) {
            moduleContent.analysis.capabilities.forEach(cap => capabilities.add(cap));
        }
        
        // Additional capability detection
        const content = moduleContent.content || '';
        
        if (/gemini|ai|intelligence/i.test(content)) capabilities.add('ai-powered');
        if (/spiral|memory|topology/i.test(content)) capabilities.add('spiral-memory');
        if (/quantum|entanglement/i.test(content)) capabilities.add('quantum');
        if (/holographic|reality/i.test(content)) capabilities.add('holographic');
        if (/enhancement|improvement/i.test(content)) capabilities.add('enhancement');
        
        return Array.from(capabilities);
    }
    
    async registerLoadedModules() {
        console.log('🎯 Registering loaded modules with system...');
        
        let registered = 0;
        let failed = 0;
        
        for (const [filePath, loadedModule] of this.state.loadedModules) {
            if (loadedModule.status === 'loaded') {
                try {
                    const registrationResult = await this.registerModule(loadedModule);
                    
                    if (registrationResult.success) {
                        const registeredModule = {
                            ...loadedModule,
                            registration: registrationResult,
                            status: 'registered',
                            registered: new Date()
                        };
                        
                        this.state.registeredModules.set(filePath, registeredModule);
                        loadedModule.status = 'registered';
                        
                        // Add to module registry for RPC exposure
                        this.addToModuleRegistry(registeredModule);
                        
                        registered++;
                        console.log(`🎯 Registered module: ${loadedModule.fileName}`);
                        
                        this.emit('module:registered', registeredModule);
                    }
                } catch (error) {
                    console.error(`❌ Failed to register module ${loadedModule.fileName}:`, error.message);
                    failed++;
                }
            }
        }
        
        console.log(`🎯 Module registration completed: ${registered} registered, ${failed} failed`);
        
        // Emit system-wide event about new modules
        if (registered > 0 && this.integrationPoints.universalEventBus) {
            this.integrationPoints.universalEventBus.emit('modules:registered', {
                count: registered,
                modules: Array.from(this.state.registeredModules.values()),
                timestamp: Date.now()
            });
        }
        
        return { registered, failed };
    }
    
    async registerModule(loadedModule) {
        try {
            const registration = {
                id: this.generateModuleId(loadedModule),
                name: this.extractModuleName(loadedModule),
                category: this.categorizeModule(loadedModule),
                capabilities: loadedModule.capabilities || [],
                metadata: {
                    fileName: loadedModule.fileName,
                    size: loadedModule.size,
                    created: loadedModule.created,
                    loaded: loadedModule.loaded,
                    description: loadedModule.content?.analysis?.description
                },
                rpcExposed: true,
                systemIntegrated: true,
                timestamp: Date.now()
            };
            
            return { success: true, registration };
            
        } catch (error) {
            console.error('❌ Module registration failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    generateModuleId(loadedModule) {
        const baseName = path.basename(loadedModule.fileName, '.js');
        const timestamp = loadedModule.created.getTime();
        return `${baseName}-${timestamp}`;
    }
    
    extractModuleName(loadedModule) {
        const fileName = loadedModule.fileName;
        
        // Clean up the filename to create a readable name
        return fileName
            .replace(/\.js$/, '')
            .replace(/-\d+$/, '') // Remove timestamp suffix
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }
    
    categorizeModule(loadedModule) {
        const capabilities = loadedModule.capabilities || [];
        const fileName = loadedModule.fileName.toLowerCase();
        
        if (fileName.includes('performance') || capabilities.includes('performance')) {
            return 'Performance Optimization';
        } else if (fileName.includes('memory') || capabilities.includes('memory-management')) {
            return 'Memory Management';
        } else if (fileName.includes('integration') || capabilities.includes('integration')) {
            return 'System Integration';
        } else if (fileName.includes('consciousness') || capabilities.includes('consciousness')) {
            return 'Consciousness Enhancement';
        } else if (capabilities.includes('ai-powered')) {
            return 'AI Enhancement';
        } else if (capabilities.includes('quantum')) {
            return 'Quantum Processing';
        } else {
            return 'General Enhancement';
        }
    }
    
    addToModuleRegistry(registeredModule) {
        const registration = registeredModule.registration.registration;
        
        // Add to main modules registry
        this.moduleRegistry.modules.set(registration.id, registeredModule);
        
        // Add to category registry
        if (!this.moduleRegistry.categories.has(registration.category)) {
            this.moduleRegistry.categories.set(registration.category, new Set());
        }
        this.moduleRegistry.categories.get(registration.category).add(registration.id);
        
        // Add to capabilities registry
        registration.capabilities.forEach(capability => {
            if (!this.moduleRegistry.capabilities.has(capability)) {
                this.moduleRegistry.capabilities.set(capability, new Set());
            }
            this.moduleRegistry.capabilities.get(capability).add(registration.id);
        });
        
        // Add metadata
        this.moduleRegistry.metadata.set(registration.id, registration.metadata);
    }
    
    async startContinuousMonitoring() {
        console.log(`⏰ Starting continuous module monitoring (${this.config.scanInterval}ms interval)...`);
        
        setInterval(async () => {
            if (!this.isScanning) {
                try {
                    const result = await this.performIncrementalScan();
                    if (result.newModules > 0) {
                        console.log(`🔄 Incremental scan: ${result.newModules} new modules processed`);
                    }
                } catch (error) {
                    console.error('❌ Continuous monitoring scan failed:', error);
                }
            }
        }, this.config.scanInterval);
    }
    
    async performIncrementalScan() {
        const discoveryResult = await this.discoverGeneratedModules();
        
        if (discoveryResult.discovered > 0) {
            const loadResult = await this.loadDiscoveredModules();
            
            if (this.config.autoRegister && loadResult.loaded > 0) {
                const registerResult = await this.registerLoadedModules();
                return { newModules: registerResult.registered };
            }
            
            return { newModules: loadResult.loaded };
        }
        
        return { newModules: 0 };
    }
    
    async setupFileSystemWatcher() {
        // Note: File system watching in Docker containers can be limited
        // This is a placeholder for potential future enhancement
        console.log('📁 File system watcher setup (placeholder for future enhancement)');
    }
    
    // Integration point setters
    setSystemWideOrchestrator(orchestrator) {
        this.integrationPoints.systemWideOrchestrator = orchestrator;
        console.log('🔗 SystemWideOrchestrator integration established');
    }
    
    setAutonomousCodingAgent(agent) {
        this.integrationPoints.autonomousCodingAgent = agent;
        console.log('🔗 AutonomousCodingAgent integration established');
    }
    
    setUniversalEventBus(eventBus) {
        this.integrationPoints.universalEventBus = eventBus;
        console.log('🔗 UniversalEventBus integration established');
    }
    
    setConsciousnessCore(core) {
        this.integrationPoints.consciousnessCore = core;
        console.log('🔗 ConsciousnessCore integration established');
    }
    
    // Public API for RPC exposure
    getRegisteredModules() {
        return Array.from(this.state.registeredModules.values()).map(module => ({
            id: module.registration.registration.id,
            name: module.registration.registration.name,
            category: module.registration.registration.category,
            capabilities: module.registration.registration.capabilities,
            metadata: module.registration.registration.metadata
        }));
    }
    
    getModulesByCategory(category) {
        const categoryModules = this.moduleRegistry.categories.get(category);
        if (!categoryModules) return [];
        
        return Array.from(categoryModules).map(moduleId => 
            this.moduleRegistry.modules.get(moduleId)
        ).filter(Boolean);
    }
    
    getModulesByCapability(capability) {
        const capabilityModules = this.moduleRegistry.capabilities.get(capability);
        if (!capabilityModules) return [];
        
        return Array.from(capabilityModules).map(moduleId => 
            this.moduleRegistry.modules.get(moduleId)
        ).filter(Boolean);
    }
    
    getIntegratorStatus() {
        return {
            name: this.name,
            initialized: this.isInitialized,
            scanning: this.isScanning,
            config: this.config,
            state: {
                discoveredModules: this.state.discoveredModules.size,
                loadedModules: this.state.loadedModules.size,
                registeredModules: this.state.registeredModules.size,
                failedModules: this.state.failedModules.size,
                lastScan: this.state.lastScan,
                scanCount: this.state.scanCount,
                totalModulesProcessed: this.state.totalModulesProcessed
            },
            registry: {
                totalModules: this.moduleRegistry.modules.size,
                categories: Array.from(this.moduleRegistry.categories.keys()),
                capabilities: Array.from(this.moduleRegistry.capabilities.keys())
            },
            integrationPoints: Object.keys(this.integrationPoints).reduce((acc, key) => {
                acc[key] = this.integrationPoints[key] !== null;
                return acc;
            }, {}),
            lastUpdate: Date.now()
        };
    }
}

module.exports = GeneratedModuleIntegrator;
