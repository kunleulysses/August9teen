/**
 * Self-Coding Progress Tracker
 * Provides real-time feedback for self-coding operations
 * Part of the Featherweight Consciousness™ System
 */

export class SelfCodingProgressTracker {
    constructor(unifiedConsciousnessSystem) {
        this.consciousnessSystem = unifiedConsciousnessSystem;
        this.activeOperations = new Map();
        this.operationHistory = [];
        this.name = 'SelfCodingProgressTracker';
        this.version = '1.0.0';
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('📊 Self-Coding Progress Tracker initialized');
    }

    /**
     * Set up event listeners for self-coding operations
     */
    setupEventListeners() {
        const eventBus = this.consciousnessSystem.globalEventBus;
        
        // Listen for code generation events
        eventBus.on('code:generate', (data) => {
            this.startOperation('code_generation', data);
        });
        
        eventBus.on('code:generation:complete', (data) => {
            this.completeOperation('code_generation', data);
        });
        
        eventBus.on('code:generation:error', (data) => {
            this.errorOperation('code_generation', data);
        });
        
        // Listen for code analysis events
        eventBus.on('code:analyze', (data) => {
            this.startOperation('code_analysis', data);
        });
        
        eventBus.on('code:analysis:complete', (data) => {
            this.completeOperation('code_analysis', data);
        });
        
        // Listen for code optimization events
        eventBus.on('code:optimize', (data) => {
            this.startOperation('code_optimization', data);
        });
        
        eventBus.on('code:optimization:complete', (data) => {
            this.completeOperation('code_optimization', data);
        });
        
        console.log('📊 Event listeners set up for self-coding progress tracking');
    }

    /**
     * Start tracking a new operation
     */
    startOperation(operationType, data) {
        const operationId = this.generateOperationId(operationType);
        const operation = {
            id: operationId,
            type: operationType,
            status: 'in_progress',
            startTime: Date.now(),
            data: data,
            progress: 0,
            steps: this.getOperationSteps(operationType),
            currentStep: 0,
            clientId: data.clientId || 'unknown'
        };
        
        this.activeOperations.set(operationId, operation);
        
        console.log(`📊 Started tracking ${operationType} operation: ${operationId}`);
        
        // Send progress update to client
        this.sendProgressUpdate(operation);
        
        return operationId;
    }

    /**
     * Complete an operation
     */
    completeOperation(operationType, data) {
        const operation = this.findActiveOperation(operationType, data);
        if (operation) {
            operation.status = 'completed';
            operation.endTime = Date.now();
            operation.duration = operation.endTime - operation.startTime;
            operation.progress = 100;
            operation.currentStep = operation.steps.length;
            operation.result = data;
            
            // Move to history
            this.operationHistory.push(operation);
            this.activeOperations.delete(operation.id);
            
            console.log(`📊 Completed ${operationType} operation: ${operation.id} (${operation.duration}ms)`);
            
            // Send completion update to client
            this.sendProgressUpdate(operation);
        }
    }

    /**
     * Mark operation as error
     */
    errorOperation(operationType, data) {
        const operation = this.findActiveOperation(operationType, data);
        if (operation) {
            operation.status = 'error';
            operation.endTime = Date.now();
            operation.duration = operation.endTime - operation.startTime;
            operation.error = data.error || 'Unknown error';
            
            // Move to history
            this.operationHistory.push(operation);
            this.activeOperations.delete(operation.id);
            
            console.log(`📊 Error in ${operationType} operation: ${operation.id} - ${operation.error}`);
            
            // Send error update to client
            this.sendProgressUpdate(operation);
        }
    }

    /**
     * Update operation progress
     */
    updateProgress(operationId, progress, currentStep, stepDescription) {
        const operation = this.activeOperations.get(operationId);
        if (operation) {
            operation.progress = Math.min(100, Math.max(0, progress));
            operation.currentStep = currentStep;
            operation.stepDescription = stepDescription;
            operation.lastUpdate = Date.now();
            
            console.log(`📊 Progress update for ${operation.type}: ${progress}% - ${stepDescription}`);
            
            // Send progress update to client
            this.sendProgressUpdate(operation);
        }
    }

    /**
     * Send progress update to client
     */
    sendProgressUpdate(operation) {
        const progressMessage = {
            type: 'self_coding_progress',
            operationId: operation.id,
            operationType: operation.type,
            status: operation.status,
            progress: operation.progress,
            currentStep: operation.currentStep,
            totalSteps: operation.steps.length,
            stepDescription: operation.stepDescription || operation.steps[operation.currentStep] || 'Processing...',
            duration: operation.duration || (Date.now() - operation.startTime),
            timestamp: Date.now()
        };

        // If operation is completed, include result
        if (operation.status === 'completed' && operation.result) {
            progressMessage.result = {
                generated: operation.result.generated,
                moduleId: operation.result.moduleId,
                purpose: operation.result.purpose,
                language: operation.result.language
            };
        }

        // If operation has error, include error details
        if (operation.status === 'error') {
            progressMessage.error = operation.error;
        }

        // Broadcast to all connected clients or specific client
        this.consciousnessSystem.broadcastToClients(progressMessage);
        
        console.log(`📊 Sent progress update: ${operation.type} - ${operation.status} (${operation.progress}%)`);
    }

    /**
     * Find active operation by type and data
     */
    findActiveOperation(operationType, data) {
        for (const [id, operation] of this.activeOperations) {
            if (operation.type === operationType) {
                // Try to match by moduleId or clientId
                if (data.moduleId && operation.data.moduleId === data.moduleId) {
                    return operation;
                }
                if (data.clientId && operation.data.clientId === data.clientId) {
                    return operation;
                }
                // If no specific match, return the first operation of this type
                return operation;
            }
        }
        return null;
    }

    /**
     * Generate unique operation ID
     */
    generateOperationId(operationType) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `${operationType}_${timestamp}_${random}`;
    }

    /**
     * Get operation steps for different operation types
     */
    getOperationSteps(operationType) {
        const steps = {
            'code_generation': [
                'Analyzing requirements',
                'Accessing SelfCodingModule',
                'Generating code structure',
                'Implementing functionality',
                'Validating syntax',
                'Finalizing code'
            ],
            'code_analysis': [
                'Loading code',
                'Parsing syntax',
                'Analyzing patterns',
                'Calculating metrics',
                'Generating insights'
            ],
            'code_optimization': [
                'Analyzing current code',
                'Identifying bottlenecks',
                'Applying optimizations',
                'Validating improvements',
                'Finalizing optimized code'
            ]
        };
        
        return steps[operationType] || ['Processing...'];
    }

    /**
     * Get current operation status
     */
    getOperationStatus(operationId) {
        const operation = this.activeOperations.get(operationId);
        if (operation) {
            return {
                id: operation.id,
                type: operation.type,
                status: operation.status,
                progress: operation.progress,
                currentStep: operation.currentStep,
                totalSteps: operation.steps.length,
                stepDescription: operation.stepDescription || operation.steps[operation.currentStep],
                duration: Date.now() - operation.startTime
            };
        }
        return null;
    }

    /**
     * Get all active operations
     */
    getActiveOperations() {
        return Array.from(this.activeOperations.values()).map(op => ({
            id: op.id,
            type: op.type,
            status: op.status,
            progress: op.progress,
            duration: Date.now() - op.startTime
        }));
    }

    /**
     * Get operation history
     */
    getOperationHistory(limit = 10) {
        return this.operationHistory
            .slice(-limit)
            .map(op => ({
                id: op.id,
                type: op.type,
                status: op.status,
                duration: op.duration,
                timestamp: op.endTime || op.startTime
            }));
    }

    /**
     * Get module statistics
     */
    getModuleStats() {
        return {
            name: this.name,
            version: this.version,
            activeOperations: this.activeOperations.size,
            totalOperations: this.operationHistory.length,
            successRate: this.calculateSuccessRate(),
            averageDuration: this.calculateAverageDuration()
        };
    }

    /**
     * Calculate success rate
     */
    calculateSuccessRate() {
        if (this.operationHistory.length === 0) return 0;
        const successful = this.operationHistory.filter(op => op.status === 'completed').length;
        return (successful / this.operationHistory.length) * 100;
    }

    /**
     * Calculate average operation duration
     */
    calculateAverageDuration() {
        if (this.operationHistory.length === 0) return 0;
        const totalDuration = this.operationHistory.reduce((sum, op) => sum + (op.duration || 0), 0);
        return totalDuration / this.operationHistory.length;
    }
}

export default SelfCodingProgressTracker;
