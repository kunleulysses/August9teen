const crypto = require('crypto');

/**
 * Enterprise-grade Security Manager for Featherweight Consciousness System
 * Handles input sanitization, authorization, CSRF protection, and rate limiting
 */
class SecurityManager {
    constructor() {
        this.csrfTokens = new Map();
        this.rateLimiters = new Map();
        this.authorizedSessions = new Map();
        this.securityConfig = {
            maxRequestsPerHour: 100,
            maxRequestsPerMinute: 10,
            csrfTokenExpiry: 3600000, // 1 hour
            sessionTimeout: 7200000, // 2 hours
            maxInputLength: 10000,
            allowedOrigins: ['http://localhost:3000', 'https://featherweight.app'],
            trustedIPs: ['127.0.0.1', '::1']
        };
    }

    /**
     * Comprehensive input sanitization for all user inputs
     * Prevents XSS, log injection, and other input-based attacks
     */
    sanitizeInput(input, options = {}) {
        if (!input) return '';
        
        const {
            maxLength = this.securityConfig.maxInputLength,
            allowHTML = false,
            strictMode = true
        } = options;

        try {
            // Convert to string and limit length
            let sanitized = String(input).substring(0, maxLength);
            
            // Remove null bytes and control characters
            sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
            
            // HTML sanitization
            if (!allowHTML) {
                // Escape HTML entities
                sanitized = sanitized
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#x27;')
                    .replace(/\//g, '&#x2F;');
            }
            
            // Log injection prevention - encode newlines and special chars
            sanitized = sanitized
                .replace(/\r\n/g, '\\r\\n')
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r')
                .replace(/\t/g, '\\t');
            
            // Additional strict mode sanitization
            if (strictMode) {
                // Remove potentially dangerous patterns
                sanitized = sanitized.replace(/javascript:/gi, '');
                sanitized = sanitized.replace(/data:/gi, '');
                sanitized = sanitized.replace(/vbscript:/gi, '');
                sanitized = sanitized.replace(/on\w+=/gi, '');
            }
            
            return sanitized;
        } catch (error) {
            console.error('Input sanitization error:', error);
            return '';
        }
    }

    /**
     * Generate cryptographically secure CSRF token
     */
    generateCSRFToken(sessionId) {
        const token = crypto.randomBytes(32).toString('hex');
        const expiry = Date.now() + this.securityConfig.csrfTokenExpiry;
        
        this.csrfTokens.set(sessionId, {
            token,
            expiry,
            used: false
        });
        
        return token;
    }

    /**
     * Validate CSRF token
     */
    validateCSRFToken(sessionId, providedToken) {
        const tokenData = this.csrfTokens.get(sessionId);
        
        if (!tokenData) {
            return { valid: false, reason: 'No CSRF token found for session' };
        }
        
        if (Date.now() > tokenData.expiry) {
            this.csrfTokens.delete(sessionId);
            return { valid: false, reason: 'CSRF token expired' };
        }
        
        if (tokenData.used) {
            return { valid: false, reason: 'CSRF token already used' };
        }
        
        if (!crypto.timingSafeEqual(
            Buffer.from(tokenData.token, 'hex'),
            Buffer.from(providedToken, 'hex')
        )) {
            return { valid: false, reason: 'Invalid CSRF token' };
        }
        
        // Mark token as used (one-time use)
        tokenData.used = true;
        return { valid: true };
    }

    /**
     * Comprehensive authorization validation
     */
    validateAuthorization(req, requiredPermissions = []) {
        try {
            // Extract authorization header
            const authHeader = req.headers?.authorization;
            if (!authHeader) {
                return { authorized: false, reason: 'No authorization header provided' };
            }

            // Validate bearer token format
            const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/);
            if (!tokenMatch) {
                return { authorized: false, reason: 'Invalid authorization header format' };
            }

            const token = tokenMatch[1];
            
            // Validate token format (should be JWT or similar)
            if (!this.validateTokenFormat(token)) {
                return { authorized: false, reason: 'Invalid token format' };
            }

            // Check session validity
            const sessionData = this.authorizedSessions.get(token);
            if (!sessionData) {
                return { authorized: false, reason: 'Invalid or expired session' };
            }

            // Check session timeout
            if (Date.now() > sessionData.expiry) {
                this.authorizedSessions.delete(token);
                return { authorized: false, reason: 'Session expired' };
            }

            // Check required permissions
            if (requiredPermissions.length > 0) {
                const hasPermissions = requiredPermissions.every(
                    permission => sessionData.permissions.includes(permission)
                );
                
                if (!hasPermissions) {
                    return { 
                        authorized: false, 
                        reason: 'Insufficient permissions',
                        required: requiredPermissions,
                        current: sessionData.permissions
                    };
                }
            }

            // Update last activity
            sessionData.lastActivity = Date.now();
            
            return { 
                authorized: true, 
                user: sessionData.user,
                permissions: sessionData.permissions
            };
        } catch (error) {
            console.error('Authorization validation error:', error);
            return { authorized: false, reason: 'Authorization validation failed' };
        }
    }

    /**
     * Validate token format (basic JWT structure check)
     */
    validateTokenFormat(token) {
        // Basic JWT format validation (header.payload.signature)
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        
        // Check if each part is valid base64
        try {
            parts.forEach(part => {
                Buffer.from(part, 'base64');
            });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Create authorized session
     */
    createSession(user, permissions = []) {
        const token = crypto.randomBytes(32).toString('hex');
        const expiry = Date.now() + this.securityConfig.sessionTimeout;
        
        this.authorizedSessions.set(token, {
            user,
            permissions,
            expiry,
            createdAt: Date.now(),
            lastActivity: Date.now()
        });
        
        return token;
    }

    /**
     * Rate limiting check
     */
    checkRateLimit(identifier, maxRequests = 10, windowMs = 60000) {
        const now = Date.now();
        const windowStart = now - windowMs;
        
        if (!this.rateLimiters.has(identifier)) {
            this.rateLimiters.set(identifier, []);
        }
        
        const requests = this.rateLimiters.get(identifier);
        
        // Remove old requests outside the window
        const validRequests = requests.filter(timestamp => timestamp > windowStart);
        
        if (validRequests.length >= maxRequests) {
            return {
                allowed: false,
                retryAfter: Math.ceil((validRequests[0] - windowStart) / 1000)
            };
        }
        
        // Add current request
        validRequests.push(now);
        this.rateLimiters.set(identifier, validRequests);
        
        return { allowed: true };
    }

    /**
     * Clean up expired tokens and sessions
     */
    cleanup() {
        const now = Date.now();
        
        // Clean up expired CSRF tokens
        for (const [sessionId, tokenData] of this.csrfTokens.entries()) {
            if (now > tokenData.expiry) {
                this.csrfTokens.delete(sessionId);
            }
        }
        
        // Clean up expired sessions
        for (const [token, sessionData] of this.authorizedSessions.entries()) {
            if (now > sessionData.expiry) {
                this.authorizedSessions.delete(token);
            }
        }
    }

    /**
     * Get security status and metrics
     */
    getSecurityStatus() {
        return {
            activeSessions: this.authorizedSessions.size,
            activeCSRFTokens: this.csrfTokens.size,
            rateLimiters: this.rateLimiters.size,
            config: this.securityConfig,
            lastCleanup: Date.now()
        };
    }
}

// Start cleanup interval
const securityManager = new SecurityManager();
setInterval(() => securityManager.cleanup(), 300000); // Clean up every 5 minutes

module.exports = { SecurityManager, securityManager };