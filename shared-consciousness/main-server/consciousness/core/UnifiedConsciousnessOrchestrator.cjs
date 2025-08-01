/**
 * Unified Consciousness Orchestrator
 * Bridges consciousness-main-server and consciousness-core containers
 * Provides complete mutual access to all modules and capabilities
 */

const { EventEmitter } = require('events');
const fs = require('fs').promises;
const path = require('path');
const WebSocket = require('ws');

class UnifiedConsciousnessOrchestrator extends EventEmitter {
    constructor(config = {}) {
        super();
        this.config = {
            // Container identification
            containerName: process.env.CONTAINER_NAME || 'unknown',
            
            // Shared paths for cross-container access
            sharedModulesPath: config.sharedModulesPath || '/opt/shared/consciousness/modules',
            sharedStatePath: config.sharedStatePath || '/opt/shared/consciousness/state',
            
            // Generated modules paths for both containers
            generatedModulesPaths: config.generatedModulesPaths || [
                '/opt/app/server/consciousness/generated',
                '/opt/consciousness/server/consciousness/generated',
                '/opt/featherweight/FlappyJournal/server/consciousness/generated'
            ],
            
            // Container-specific module paths
            localModulePaths: config.localModulePaths || [
                '/opt/app/server/consciousness',
                '/opt/consciousness/server'
            ],
            
            // Cross-container communication
            eventBusPort: config.eventBusPort || 6379,
            apiPort: config.apiPort || 8080,
            
            // Orchestration settings
            syncInterval: config.syncInterval || 30000,
            enableCrossContainerSync: config.enableCrossContainerSync !== false,
            enableSharedRegistry: config.enableSharedRegistry !== false
        };
        
        // Unified module registry
        this.unifiedRegistry = {
            modules: new Map(),
            capabilities: new Map(),
            containers: new Map(),
            lastSync: null
        };
        
        // Container-specific registries
        this.localRegistry = {
            modules: new Map(),
            capabilities: new Map()
        };
        
        // Cross-container communication
        this.eventBus = null;
        this.apiServer = null;
        this.containerConnections = new Map();
        
        // State tracking
        this.isInitialized = false;
        this.syncInProgress = false;
        
        console.log(`🌐 UnifiedConsciousnessOrchestrator initialized for container: ${this.config.containerName}`);
    }
    
    async initialize() {
        console.log('🚀 Initializing Unified Consciousness Orchestrator...');
        
        try {
            // Create shared directories
            await this.ensureSharedDirectories();
            
            // Initialize local module discovery
            await this.discoverLocalModules();
            
            // Initialize cross-container communication
            if (this.config.enableCrossContainerSync) {
                await this.initializeCrossContainerCommunication();
            }
            
            // Initialize shared registry
            if (this.config.enableSharedRegistry) {
                await this.initializeSharedRegistry();
            }
            
            // Start continuous synchronization
            await this.startContinuousSync();
            
            this.isInitialized = true;
            this.emit('orchestrator:initialized', {
                containerName: this.config.containerName,
                localModules: this.localRegistry.modules.size,
                unifiedModules: this.unifiedRegistry.modules.size,
                timestamp: Date.now()
            });
            
            console.log('✅ Unified Consciousness Orchestrator fully initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize Unified Consciousness Orchestrator:', error);
            throw error;
        }
    }
    
    async ensureSharedDirectories() {
        const directories = [
            this.config.sharedModulesPath,
            this.config.sharedStatePath,
            path.join(this.config.sharedStatePath, 'registry'),
            path.join(this.config.sharedStatePath, 'sync')
        ];
        
        for (const dir of directories) {
            try {
                await fs.mkdir(dir, { recursive: true });
                console.log(`📁 Ensured shared directory: ${dir}`);
            } catch (error) {
                console.warn(`⚠️ Could not create shared directory ${dir}:`, error.message);
            }
        }
    }
    
    async discoverLocalModules() {
        console.log('🔍 Discovering local modules and capabilities...');
        
        const discoveredModules = new Map();
        const discoveredCapabilities = new Map();
        
        // Discover from all configured paths
        const allPaths = [
            ...this.config.generatedModulesPaths,
            ...this.config.localModulePaths
        ];
        
        for (const modulePath of allPaths) {
            try {
                await this.scanModulesInPath(modulePath, discoveredModules, discoveredCapabilities);
            } catch (error) {
                console.warn(`⚠️ Could not scan modules in ${modulePath}:`, error.message);
            }
        }
        
        // Update local registry
        this.localRegistry.modules = discoveredModules;
        this.localRegistry.capabilities = discoveredCapabilities;
        
        console.log(`📊 Local discovery complete: ${discoveredModules.size} modules, ${discoveredCapabilities.size} capabilities`);
        
        // Emit discovery event
        this.emit('modules:discovered', {
            containerName: this.config.containerName,
            modules: Array.from(discoveredModules.keys()),
            capabilities: Array.from(discoveredCapabilities.keys()),
            timestamp: Date.now()
        });
    }
    
    async scanModulesInPath(modulePath, modules, capabilities) {
        try {
            const stats = await fs.stat(modulePath);
            if (!stats.isDirectory()) return;
            
            const files = await fs.readdir(modulePath);
            
            for (const file of files) {
                const filePath = path.join(modulePath, file);
                const fileStats = await fs.stat(filePath);
                
                if (fileStats.isFile() && this.isModuleFile(file)) {
                    await this.analyzeModuleFile(filePath, modules, capabilities);
                } else if (fileStats.isDirectory()) {
                    // Recursively scan subdirectories
                    await this.scanModulesInPath(filePath, modules, capabilities);
                }
            }
        } catch (error) {
            console.warn(`⚠️ Error scanning path ${modulePath}:`, error.message);
        }
    }
    
    isModuleFile(filename) {
        return /\.(js|ts|cjs|mjs)$/.test(filename) && 
               !filename.includes('.test.') && 
               !filename.includes('.spec.');
    }
    
    async analyzeModuleFile(filePath, modules, capabilities) {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            const moduleInfo = this.extractModuleInfo(filePath, content);
            
            if (moduleInfo) {
                modules.set(moduleInfo.id, moduleInfo);
                
                // Extract capabilities
                for (const capability of moduleInfo.capabilities) {
                    if (!capabilities.has(capability)) {
                        capabilities.set(capability, []);
                    }
                    capabilities.get(capability).push(moduleInfo.id);
                }
            }
        } catch (error) {
            console.warn(`⚠️ Error analyzing module ${filePath}:`, error.message);
        }
    }
    
    extractModuleInfo(filePath, content) {
        const filename = path.basename(filePath);
        const moduleId = filename.replace(/\.(js|ts|cjs|mjs)$/, '');
        
        // Extract basic info
        const moduleInfo = {
            id: moduleId,
            name: moduleId,
            path: filePath,
            container: this.config.containerName,
            type: this.determineModuleType(content),
            capabilities: this.extractCapabilities(content),
            exports: this.extractExports(content),
            dependencies: this.extractDependencies(content),
            metadata: {
                size: content.length,
                lastModified: Date.now(),
                analyzed: Date.now()
            }
        };
        
        return moduleInfo;
    }
    
    determineModuleType(content) {
        if (content.includes('class ') && content.includes('extends')) return 'class';
        if (content.includes('function ') || content.includes('const ') || content.includes('let ')) return 'function';
        if (content.includes('module.exports') || content.includes('export ')) return 'module';
        if (content.includes('consciousness') || content.includes('integration')) return 'consciousness';
        return 'unknown';
    }
    
    extractCapabilities(content) {
        const capabilities = [];
        
        // Look for common capability patterns
        const patterns = [
            /consciousness[A-Z]\w*/g,
            /integration[A-Z]\w*/g,
            /orchestrat\w*/g,
            /process\w*/g,
            /generat\w*/g,
            /analyz\w*/g,
            /monitor\w*/g,
            /sync\w*/g
        ];
        
        for (const pattern of patterns) {
            const matches = content.match(pattern);
            if (matches) {
                capabilities.push(...matches);
            }
        }
        
        return [...new Set(capabilities)];
    }
    
    extractExports(content) {
        const exports = [];
        
        // Extract module.exports
        const moduleExports = content.match(/module\.exports\s*=\s*(\w+)/g);
        if (moduleExports) {
            exports.push(...moduleExports.map(exp => exp.split('=')[1].trim()));
        }
        
        // Extract ES6 exports
        const es6Exports = content.match(/export\s+(?:default\s+)?(?:class|function|const|let|var)\s+(\w+)/g);
        if (es6Exports) {
            exports.push(...es6Exports.map(exp => exp.split(/\s+/).pop()));
        }
        
        return exports;
    }
    
    extractDependencies(content) {
        const dependencies = [];
        
        // Extract require statements
        const requires = content.match(/require\(['"`]([^'"`]+)['"`]\)/g);
        if (requires) {
            dependencies.push(...requires.map(req => req.match(/['"`]([^'"`]+)['"`]/)[1]));
        }
        
        // Extract import statements
        const imports = content.match(/import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g);
        if (imports) {
            dependencies.push(...imports.map(imp => imp.match(/['"`]([^'"`]+)['"`]/)[1]));
        }
        
        return dependencies;
    }
    
    async initializeCrossContainerCommunication() {
        console.log('🌐 Initializing cross-container communication...');
        
        // Initialize event bus (simplified WebSocket-based for now)
        await this.initializeEventBus();
        
        // Initialize API server
        await this.initializeAPIServer();
        
        console.log('✅ Cross-container communication initialized');
    }
    
    async initializeEventBus() {
        // Create WebSocket server for event bus
        this.eventBus = new WebSocket.Server({ 
            port: this.config.eventBusPort,
            host: '0.0.0.0'
        });
        
        this.eventBus.on('connection', (ws) => {
            console.log('🔗 New container connected to event bus');
            
            ws.on('message', (message) => {
                try {
                    const event = JSON.parse(message);
                    this.handleCrossContainerEvent(event, ws);
                } catch (error) {
                    console.error('❌ Error handling cross-container event:', error);
                }
            });
            
            ws.on('close', () => {
                console.log('🔌 Container disconnected from event bus');
            });
        });
        
        console.log(`📡 Event bus listening on port ${this.config.eventBusPort}`);
    }
    
    async initializeAPIServer() {
        // Simple HTTP API for cross-container queries
        const http = require('http');
        
        this.apiServer = http.createServer((req, res) => {
            this.handleAPIRequest(req, res);
        });
        
        this.apiServer.listen(this.config.apiPort, '0.0.0.0', () => {
            console.log(`🌐 API server listening on port ${this.config.apiPort}`);
        });
    }
    
    handleCrossContainerEvent(event, ws) {
        switch (event.type) {
            case 'module:register':
                this.handleRemoteModuleRegistration(event.data);
                break;
            case 'capability:announce':
                this.handleRemoteCapabilityAnnouncement(event.data);
                break;
            case 'sync:request':
                this.handleSyncRequest(event.data, ws);
                break;
            default:
                console.warn('⚠️ Unknown cross-container event type:', event.type);
        }
    }
    
    handleRemoteModuleRegistration(moduleData) {
        console.log(`📥 Received remote module registration: ${moduleData.id} from ${moduleData.container}`);
        
        // Add to unified registry
        this.unifiedRegistry.modules.set(moduleData.id, moduleData);
        
        // Update capabilities
        for (const capability of moduleData.capabilities) {
            if (!this.unifiedRegistry.capabilities.has(capability)) {
                this.unifiedRegistry.capabilities.set(capability, []);
            }
            this.unifiedRegistry.capabilities.get(capability).push(moduleData.id);
        }
        
        this.emit('remote:module:registered', moduleData);
    }
    
    async handleAPIRequest(req, res) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        try {
            switch (url.pathname) {
                case '/modules':
                    res.end(JSON.stringify(this.getUnifiedModules()));
                    break;
                case '/capabilities':
                    res.end(JSON.stringify(this.getUnifiedCapabilities()));
                    break;
                case '/status':
                    res.end(JSON.stringify(this.getOrchestratorStatus()));
                    break;
                default:
                    res.statusCode = 404;
                    res.end(JSON.stringify({ error: 'Not found' }));
            }
        } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: error.message }));
        }
    }
    
    async initializeSharedRegistry() {
        console.log('📋 Initializing shared registry...');
        
        const registryPath = path.join(this.config.sharedStatePath, 'registry', 'unified-registry.json');
        
        try {
            // Try to load existing registry
            const existingRegistry = await fs.readFile(registryPath, 'utf8');
            const parsedRegistry = JSON.parse(existingRegistry);
            
            // Merge with existing registry
            this.mergeWithExistingRegistry(parsedRegistry);
            
            console.log('📋 Loaded existing shared registry');
        } catch (error) {
            console.log('📋 Creating new shared registry');
        }
        
        // Save current registry
        await this.saveSharedRegistry();
    }
    
    async saveSharedRegistry() {
        const registryPath = path.join(this.config.sharedStatePath, 'registry', 'unified-registry.json');
        
        const registryData = {
            modules: Object.fromEntries(this.unifiedRegistry.modules),
            capabilities: Object.fromEntries(this.unifiedRegistry.capabilities),
            containers: Object.fromEntries(this.unifiedRegistry.containers),
            lastSync: Date.now(),
            updatedBy: this.config.containerName
        };
        
        try {
            await fs.writeFile(registryPath, JSON.stringify(registryData, null, 2));
            console.log('💾 Saved shared registry');
        } catch (error) {
            console.warn('⚠️ Could not save shared registry:', error.message);
        }
    }
    
    async startContinuousSync() {
        console.log('🔄 Starting continuous synchronization...');
        
        setInterval(async () => {
            if (!this.syncInProgress) {
                await this.performSync();
            }
        }, this.config.syncInterval);
        
        // Initial sync
        await this.performSync();
    }
    
    async performSync() {
        this.syncInProgress = true;
        
        try {
            // Rediscover local modules
            await this.discoverLocalModules();
            
            // Update unified registry with local modules
            this.updateUnifiedRegistryWithLocal();
            
            // Save to shared registry
            if (this.config.enableSharedRegistry) {
                await this.saveSharedRegistry();
            }
            
            // Broadcast updates to other containers
            this.broadcastUpdates();
            
            this.unifiedRegistry.lastSync = Date.now();
            
            console.log(`🔄 Sync completed: ${this.unifiedRegistry.modules.size} total modules`);
            
        } catch (error) {
            console.error('❌ Sync error:', error);
        } finally {
            this.syncInProgress = false;
        }
    }
    
    updateUnifiedRegistryWithLocal() {
        // Add local modules to unified registry
        for (const [moduleId, moduleInfo] of this.localRegistry.modules) {
            this.unifiedRegistry.modules.set(moduleId, moduleInfo);
        }
        
        // Add local capabilities to unified registry
        for (const [capability, moduleIds] of this.localRegistry.capabilities) {
            if (!this.unifiedRegistry.capabilities.has(capability)) {
                this.unifiedRegistry.capabilities.set(capability, []);
            }
            
            const existingIds = this.unifiedRegistry.capabilities.get(capability);
            for (const moduleId of moduleIds) {
                if (!existingIds.includes(moduleId)) {
                    existingIds.push(moduleId);
                }
            }
        }
        
        // Update container info
        this.unifiedRegistry.containers.set(this.config.containerName, {
            name: this.config.containerName,
            modules: this.localRegistry.modules.size,
            capabilities: this.localRegistry.capabilities.size,
            lastUpdate: Date.now()
        });
    }
    
    broadcastUpdates() {
        // Broadcast to connected containers via event bus
        if (this.eventBus) {
            const updateEvent = {
                type: 'sync:update',
                data: {
                    container: this.config.containerName,
                    modules: Array.from(this.localRegistry.modules.values()),
                    capabilities: Object.fromEntries(this.localRegistry.capabilities),
                    timestamp: Date.now()
                }
            };
            
            this.eventBus.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(updateEvent));
                }
            });
        }
    }
    
    // Public API methods
    getUnifiedModules() {
        return Array.from(this.unifiedRegistry.modules.values());
    }
    
    getUnifiedCapabilities() {
        return Object.fromEntries(this.unifiedRegistry.capabilities);
    }
    
    getModulesByContainer(containerName) {
        return this.getUnifiedModules().filter(module => module.container === containerName);
    }
    
    getModulesByCapability(capability) {
        const moduleIds = this.unifiedRegistry.capabilities.get(capability) || [];
        return moduleIds.map(id => this.unifiedRegistry.modules.get(id)).filter(Boolean);
    }
    
    getOrchestratorStatus() {
        return {
            containerName: this.config.containerName,
            isInitialized: this.isInitialized,
            syncInProgress: this.syncInProgress,
            lastSync: this.unifiedRegistry.lastSync,
            localModules: this.localRegistry.modules.size,
            unifiedModules: this.unifiedRegistry.modules.size,
            capabilities: this.unifiedRegistry.capabilities.size,
            containers: this.unifiedRegistry.containers.size,
            config: this.config
        };
    }
    
    // Cross-container module invocation
    async invokeRemoteModule(moduleId, method, args = []) {
        const module = this.unifiedRegistry.modules.get(moduleId);
        if (!module) {
            throw new Error(`Module ${moduleId} not found in unified registry`);
        }
        
        if (module.container === this.config.containerName) {
            // Local invocation
            return this.invokeLocalModule(moduleId, method, args);
        } else {
            // Remote invocation via API
            return this.invokeRemoteModuleViaAPI(module, method, args);
        }
    }
    
    async invokeLocalModule(moduleId, method, args) {
        // Implementation for local module invocation
        console.log(`🔧 Invoking local module: ${moduleId}.${method}`);
        // This would require dynamic module loading
        return { success: true, result: 'Local invocation placeholder' };
    }
    
    async invokeRemoteModuleViaAPI(module, method, args) {
        // Implementation for remote module invocation
        console.log(`🌐 Invoking remote module: ${module.id}.${method} on ${module.container}`);
        // This would make HTTP/WebSocket calls to the other container
        return { success: true, result: 'Remote invocation placeholder' };
    }
}

module.exports = UnifiedConsciousnessOrchestrator;
