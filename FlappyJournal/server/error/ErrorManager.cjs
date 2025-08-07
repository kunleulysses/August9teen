const { logger } = require('../consciousness/utils/logger.cjs');

/**
 * Enterprise-grade Error Management System
 * Provides comprehensive error handling, categorization, and recovery mechanisms
 */
class ErrorManager {
    constructor() {
        this.errorCategories = {
            SECURITY: 'SECURITY',
            VALIDATION: 'VALIDATION',
            AUTHORIZATION: 'AUTHORIZATION',
            RATE_LIMIT: 'RATE_LIMIT',
            SYSTEM: 'SYSTEM',
            NETWORK: 'NETWORK',
            DATABASE: 'DATABASE',
            CONSCIOUSNESS: 'CONSCIOUSNESS',
            SELF_CODING: 'SELF_CODING'
        };

        this.errorSeverity = {
            CRITICAL: 'CRITICAL',
            HIGH: 'HIGH',
            MEDIUM: 'MEDIUM',
            LOW: 'LOW',
            INFO: 'INFO'
        };

        this.errorMetrics = {
            totalErrors: 0,
            errorsByCategory: {},
            errorsBySeverity: {},
            recentErrors: [],
            maxRecentErrors: 100
        };

        this.recoveryStrategies = new Map();
        this.initializeRecoveryStrategies();
    }

    /**
     * Sanitize input to prevent log injection
     */
    sanitizeInput(input) {
        if (!input) return '';
        return String(input)
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
            .replace(/\r\n/g, '\\r\\n')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');
    }

    /**
     * Initialize recovery strategies for different error types
     */
    initializeRecoveryStrategies() {
        // Security error recovery
        this.recoveryStrategies.set(this.errorCategories.SECURITY, {
            immediate: (error, context) => {
                this.logSecurityIncident(error, context);
                return { action: 'BLOCK_REQUEST', message: 'Security violation detected' };
            },
            fallback: () => ({ action: 'DENY_ACCESS', message: 'Access denied for security reasons' })
        });

        // Validation error recovery
        this.recoveryStrategies.set(this.errorCategories.VALIDATION, {
            immediate: (error, context) => {
                const sanitizedInput = this.attemptInputSanitization(context.input);
                if (sanitizedInput) {
                    return { action: 'RETRY_WITH_SANITIZED', data: sanitizedInput };
                }
                return { action: 'REQUEST_VALID_INPUT', message: 'Invalid input provided' };
            },
            fallback: () => ({ action: 'USE_DEFAULT_VALUES', message: 'Using default values due to validation errors' })
        });

        // Authorization error recovery
        this.recoveryStrategies.set(this.errorCategories.AUTHORIZATION, {
            immediate: (error, context) => {
                if (context.refreshToken) {
                    return { action: 'ATTEMPT_TOKEN_REFRESH', token: context.refreshToken };
                }
                return { action: 'REQUIRE_AUTHENTICATION', message: 'Authentication required' };
            },
            fallback: () => ({ action: 'REDIRECT_TO_LOGIN', message: 'Please log in to continue' })
        });

        // Self-coding error recovery
        this.recoveryStrategies.set(this.errorCategories.SELF_CODING, {
            immediate: (error, context) => {
                if (context.canSimplify) {
                    return { action: 'RETRY_SIMPLIFIED', parameters: this.simplifyParameters(context.parameters) };
                }
                return { action: 'USE_TEMPLATE', template: this.getCodeTemplate(context.type) };
            },
            fallback: () => ({ 
                action: 'MANUAL_INTERVENTION', 
                message: 'Code generation failed. Manual review required.' 
            })
        });
    }

    /**
     * Create standardized error object
     */
    createError(category, severity, message, details = {}, originalError = null) {
        const error = {
            id: this.generateErrorId(),
            category,
            severity,
            message: this.sanitizeInput(message),
            details: this.sanitizeErrorDetails(details),
            timestamp: new Date().toISOString(),
            stack: originalError?.stack || new Error().stack,
            context: {
                userAgent: details.userAgent,
                ip: details.ip,
                endpoint: details.endpoint,
                method: details.method,
                sessionId: details.sessionId
            }
        };

        this.recordError(error);
        return error;
    }

    /**
     * Handle error with recovery strategy
     */
    async handleError(error, context = {}) {
        try {
            if (!error.category) {
                error.category = this.categorizeError(error);
            }

            const strategy = this.recoveryStrategies.get(error.category);
            if (!strategy) {
                return this.handleUnknownError(error, context);
            }

            let recoveryResult;
            try {
                recoveryResult = await strategy.immediate(error, context);
            } catch (recoveryError) {
                logger.error('Recovery strategy failed:', {
                    originalError: this.sanitizeInput(error.message),
                    recoveryError: this.sanitizeInput(recoveryError.message),
                    category: error.category
                });
                
                recoveryResult = strategy.fallback();
            }

            logger.info('Error recovery attempted:', {
                errorId: error.id,
                category: error.category,
                action: recoveryResult.action,
                success: recoveryResult.action !== 'FAILED'
            });

            return recoveryResult;
        } catch (handlingError) {
            logger.error('Error handling failed:', {
                originalError: this.sanitizeInput(error.message),
                handlingError: this.sanitizeInput(handlingError.message)
            });
            
            return {
                action: 'CRITICAL_FAILURE',
                message: 'System error handling failed. Please contact support.'
            };
        }
    }

    /**
     * Categorize error based on its properties
     */
    categorizeError(error) {
        const message = error.message?.toLowerCase() || '';
        const stack = error.stack?.toLowerCase() || '';

        if (message.includes('unauthorized') || message.includes('forbidden') || message.includes('auth')) {
            return this.errorCategories.AUTHORIZATION;
        }
        
        if (message.includes('validation') || message.includes('invalid') || message.includes('sanitiz')) {
            return this.errorCategories.VALIDATION;
        }
        
        if (message.includes('rate limit') || message.includes('too many requests')) {
            return this.errorCategories.RATE_LIMIT;
        }
        
        if (message.includes('security') || message.includes('csrf') || message.includes('xss')) {
            return this.errorCategories.SECURITY;
        }
        
        if (message.includes('consciousness') || stack.includes('consciousness')) {
            return this.errorCategories.CONSCIOUSNESS;
        }
        
        if (message.includes('self-coding') || message.includes('code generation')) {
            return this.errorCategories.SELF_CODING;
        }

        return this.errorCategories.SYSTEM;
    }

    /**
     * Record error in metrics
     */
    recordError(error) {
        this.errorMetrics.totalErrors++;
        
        if (!this.errorMetrics.errorsByCategory[error.category]) {
            this.errorMetrics.errorsByCategory[error.category] = 0;
        }
        this.errorMetrics.errorsByCategory[error.category]++;
        
        if (!this.errorMetrics.errorsBySeverity[error.severity]) {
            this.errorMetrics.errorsBySeverity[error.severity] = 0;
        }
        this.errorMetrics.errorsBySeverity[error.severity]++;
        
        this.errorMetrics.recentErrors.unshift(error);
        if (this.errorMetrics.recentErrors.length > this.errorMetrics.maxRecentErrors) {
            this.errorMetrics.recentErrors.pop();
        }
    }

    /**
     * Generate unique error ID
     */
    generateErrorId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2);
        return `ERR_${timestamp}_${random}`.toUpperCase();
    }

    /**
     * Sanitize error details to prevent information leakage
     */
    sanitizeErrorDetails(details) {
        const sanitized = {};
        const allowedFields = ['endpoint', 'method', 'userAgent', 'timestamp', 'category', 'severity'];
        
        for (const [key, value] of Object.entries(details)) {
            if (allowedFields.includes(key)) {
                sanitized[key] = this.sanitizeInput(String(value));
            }
        }
        
        return sanitized;
    }

    /**
     * Log security incident
     */
    logSecurityIncident(error, context) {
        const incident = {
            id: this.generateErrorId(),
            type: 'SECURITY_VIOLATION',
            severity: 'CRITICAL',
            timestamp: new Date().toISOString(),
            error: this.sanitizeInput(error.message),
            context: {
                ip: context.ip,
                userAgent: this.sanitizeInput(context.userAgent || ''),
                endpoint: context.endpoint,
                method: context.method
            }
        };
        
        logger.error('SECURITY INCIDENT:', incident);
    }

    /**
     * Get code template for self-coding fallback
     */
    getCodeTemplate(type) {
        const templates = {
            function: `// Generated function template
function generatedFunction() {
    // Implementation needed
    return null;
}`,
            class: `// Generated class template
class GeneratedClass {
    constructor() {
        // Initialization needed
    }
}`,
            module: `// Generated module template
module.exports = {
    // Exports needed
};`
        };
        
        return templates[type] || templates.function;
    }

    /**
     * Simplify parameters for retry
     */
    simplifyParameters(parameters) {
        return {
            ...parameters,
            complexity: 'simple',
            features: parameters.features?.slice(0, 3) || [],
            timeout: Math.min(parameters.timeout || 5000, 5000)
        };
    }

    /**
     * Attempt input sanitization
     */
    attemptInputSanitization(input) {
        try {
            return this.sanitizeInput(input);
        } catch {
            return null;
        }
    }

    /**
     * Handle unknown error types
     */
    handleUnknownError(error, context) {
        logger.error('Unknown error type encountered:', {
            error: this.sanitizeInput(error.message),
            category: error.category,
            context: this.sanitizeErrorDetails(context)
        });
        
        return {
            action: 'GENERIC_ERROR_RESPONSE',
            message: 'An unexpected error occurred. Please try again later.'
        };
    }

    /**
     * Create error response middleware
     */
    createErrorMiddleware() {
        return async (error, req, res, next) => {
            try {
                const context = {
                    ip: req.ip,
                    userAgent: req.get('User-Agent'),
                    endpoint: req.path,
                    method: req.method,
                    sessionId: req.sessionID
                };

                const managedError = this.createError(
                    this.categorizeError(error),
                    this.determineSeverity(error),
                    error.message,
                    context,
                    error
                );

                const recoveryResult = await this.handleError(managedError, context);

                switch (recoveryResult.action) {
                    case 'BLOCK_REQUEST':
                        res.status(403).json({
                            error: 'Forbidden',
                            message: recoveryResult.message,
                            errorId: managedError.id
                        });
                        break;
                    
                    case 'REQUIRE_AUTHENTICATION':
                        res.status(401).json({
                            error: 'Unauthorized',
                            message: recoveryResult.message,
                            errorId: managedError.id
                        });
                        break;
                    
                    case 'RATE_LIMITED':
                        res.status(429).json({
                            error: 'Too Many Requests',
                            message: recoveryResult.message,
                            retryAfter: recoveryResult.retryAfter,
                            errorId: managedError.id
                        });
                        break;
                    
                    default:
                        res.status(500).json({
                            error: 'Internal Server Error',
                            message: 'An unexpected error occurred',
                            errorId: managedError.id
                        });
                }
            } catch (middlewareError) {
                logger.error('Error middleware failed:', {
                    error: this.sanitizeInput(middlewareError.message)
                });
                
                res.status(500).json({
                    error: 'Critical System Error',
                    message: 'Error handling system failed'
                });
            }
        };
    }

    /**
     * Determine error severity
     */
    determineSeverity(error) {
        const message = error.message?.toLowerCase() || '';
        
        if (message.includes('security') || message.includes('unauthorized') || message.includes('forbidden')) {
            return this.errorSeverity.CRITICAL;
        }
        
        if (message.includes('system') || message.includes('database') || message.includes('network')) {
            return this.errorSeverity.HIGH;
        }
        
        if (message.includes('validation') || message.includes('rate limit')) {
            return this.errorSeverity.MEDIUM;
        }
        
        return this.errorSeverity.LOW;
    }

    /**
     * Get error metrics and statistics
     */
    getErrorMetrics() {
        return {
            ...this.errorMetrics,
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        };
    }
}

const errorManager = new ErrorManager();

module.exports = { ErrorManager, errorManager };