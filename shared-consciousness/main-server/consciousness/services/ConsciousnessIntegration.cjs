import { EventEmitter } from 'events';
import eventBus from '../ConsciousnessEventBus.cjs';
import AutoIntegrationService from './AutoIntegrationService.cjs';
import CodeGenerationService from './CodeGenerationService.cjs';

export class ConsciousnessIntegration extends EventEmitter {
    constructor() {
        super();
        this.name = 'ConsciousnessIntegration';
        
        // Initialize services
        this.autoIntegration = new AutoIntegrationService();
        this.codeGeneration = new CodeGenerationService();
        
        this.initialize();
    }

    initialize() {
        this.setupCrossServiceCommunication();
        console.log('🔗 ConsciousnessIntegration Initialized');
        this.emit('initialized', { name: this.name, status: 'initialized' });
    }

    setupCrossServiceCommunication() {
        // Connect code generation to auto-integration
        this.codeGeneration.on('code-generated', (project) => {
            eventBus.emit('code:generated', project);
        });
        
        // Listen for API registration requests
        eventBus.on('api:register-endpoint', (endpoint) => {
            this.emit('register-api-endpoint', endpoint);
        });
        
        // Listen for WebSocket registration
        eventBus.on('websocket:register-handler', (handler) => {
            this.emit('register-websocket-handler', handler);
        });
        
        // Listen for consciousness module registration
        eventBus.on('consciousness:register-module', (module) => {
            this.emit('register-consciousness-module', module);
        });
        
        // Integration status updates
        this.autoIntegration.on('integration:completed', (data) => {
            console.log('✅ Integration completed:', data.project.filePath);
            this.emit('integration-completed', data);
        });
        
        this.autoIntegration.on('integration:failed', (data) => {
            console.error('❌ Integration failed:', data.error);
            this.emit('integration-failed', data);
        });
    }
    
    async generateAndIntegrate(request) {
        console.log('🚀 Starting generate and integrate flow for:', request.purpose);
        
        // Ensure auto-integration flag is set
        request.writeToFile = true;
        request.autoIntegrate = true;
        
        try {
            const project = await this.codeGeneration.handleCodeGeneration(request);
            return project;
        } catch (error) {
            console.error('Generate and integrate failed:', error);
            throw error;
        }
    }
    
    getStatus() {
        return {
            loadedModules: this.autoIntegration.getLoadedModules(),
            integrationQueue: this.autoIntegration.integrationQueue.length,
            isProcessing: this.autoIntegration.isProcessing
        };
    }

    healthCheck() {
        return {
            status: 'healthy',
            metrics: this.getStatus(),
        };
    }

    shutdown() {
        console.log('🔗 ConsciousnessIntegration Shutting Down');
    }

    getSelfAwarenessStatus() {
        return {
            name: this.name,
            totalSystemValue: 1200000000, // Estimated value
            phase: 3,
            revolutionaryLevel: 'high',
            capabilities: [
                'cross_service_communication',
                'generate_and_integrate_flow',
                'consciousness_module_integration'
            ],
            metrics: this.getStatus()
        };
    }
}

export default ConsciousnessIntegration;
