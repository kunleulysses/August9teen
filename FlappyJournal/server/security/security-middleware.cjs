const jwt = require('jsonwebtoken');
const { RBACManager } = require('./rbac-manager.cjs');
const { AuditLogger } = require('./audit-logger.cjs');

class SecurityMiddleware {
    constructor(options = {}) {
        this.rbacManager = options.rbacManager || new RBACManager();
        this.auditLogger = options.auditLogger || new AuditLogger();
        this.jwtSecret = options.jwtSecret || process.env.JWT_SECRET;
        this.sessionSecret = options.sessionSecret || process.env.SESSION_SECRET;
        
        if (!this.jwtSecret) {
            console.warn('⚠️  JWT_SECRET not configured - JWT authentication disabled');
        }
    }

    // JWT Authentication Middleware
    authenticateJWT() {
        return async (req, res, next) => {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

            if (!token) {
                await this.auditLogger.logAuthenticationEvent('TOKEN_MISSING', null, req.sessionID, {
                    ip: req.ip,
                    userAgent: req.get('User-Agent'),
                    path: req.path
                });
                return res.status(401).json({ error: 'Access token required' });
            }

            try {
                const decoded = jwt.verify(token, this.jwtSecret);
                req.user = decoded;
                req.userId = decoded.sub || decoded.id;
                req.sessionId = req.sessionID || decoded.sessionId;

                await this.auditLogger.logAuthenticationEvent('TOKEN_VALID', req.userId, req.sessionId, {
                    ip: req.ip,
                    userAgent: req.get('User-Agent'),
                    path: req.path
                });

                next();
            } catch (error) {
                await this.auditLogger.logAuthenticationEvent('TOKEN_INVALID', null, req.sessionID, {
                    ip: req.ip,
                    userAgent: req.get('User-Agent'),
                    path: req.path,
                    error: error.message
                });
                return res.status(403).json({ error: 'Invalid or expired token' });
            }
        };
    }

    // Session Authentication Middleware
    authenticateSession() {
        return async (req, res, next) => {
            if (!req.session || !req.session.userId) {
                await this.auditLogger.logAuthenticationEvent('SESSION_MISSING', null, req.sessionID, {
                    ip: req.ip,
                    userAgent: req.get('User-Agent'),
                    path: req.path
                });
                return res.status(401).json({ error: 'Authentication required' });
            }

            req.userId = req.session.userId;
            req.user = req.session.user || { id: req.session.userId };

            await this.auditLogger.logAuthenticationEvent('SESSION_VALID', req.userId, req.sessionID, {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                path: req.path
            });

            next();
        };
    }

    // Combined Authentication (JWT or Session)
    authenticate() {
        return async (req, res, next) => {
            // Try JWT first
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];

            if (token && this.jwtSecret) {
                try {
                    const decoded = jwt.verify(token, this.jwtSecret);
                    req.user = decoded;
                    req.userId = decoded.sub || decoded.id;
                    req.sessionId = req.sessionID || decoded.sessionId;

                    await this.auditLogger.logAuthenticationEvent('JWT_AUTH_SUCCESS', req.userId, req.sessionId, {
                        ip: req.ip,
                        userAgent: req.get('User-Agent'),
                        path: req.path
                    });

                    return next();
                } catch (jwtError) {
                    // JWT failed, try session
                }
            }

            // Try session authentication
            if (req.session && req.session.userId) {
                req.userId = req.session.userId;
                req.user = req.session.user || { id: req.session.userId };

                await this.auditLogger.logAuthenticationEvent('SESSION_AUTH_SUCCESS', req.userId, req.sessionID, {
                    ip: req.ip,
                    userAgent: req.get('User-Agent'),
                    path: req.path
                });

                return next();
            }

            // Both authentication methods failed
            await this.auditLogger.logAuthenticationEvent('AUTH_FAILED', null, req.sessionID, {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                path: req.path,
                hasToken: !!token,
                hasSession: !!(req.session && req.session.userId)
            });

            return res.status(401).json({ error: 'Authentication required' });
        };
    }

    // Permission-based authorization
    requirePermission(permission, resourceParam = null) {
        return async (req, res, next) => {
            if (!req.userId) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const resourceId = resourceParam ? req.params[resourceParam] : null;
            
            if (this.rbacManager.hasPermission(req.userId, permission, resourceId)) {
                await this.auditLogger.logAuthorizationEvent('PERMISSION_GRANTED', req.userId, req.sessionId, permission, {
                    resource: resourceId,
                    ip: req.ip,
                    path: req.path
                });
                next();
            } else {
                await this.auditLogger.logAuthorizationEvent('PERMISSION_DENIED', req.userId, req.sessionId, permission, {
                    resource: resourceId,
                    ip: req.ip,
                    path: req.path
                });
                res.status(403).json({ 
                    error: 'Insufficient permissions',
                    required: permission,
                    resource: resourceId
                });
            }
        };
    }

    // Role-based authorization
    requireRole(roleId, resourceParam = null) {
        return async (req, res, next) => {
            if (!req.userId) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const resourceId = resourceParam ? req.params[resourceParam] : null;
            
            if (this.rbacManager.hasRole(req.userId, roleId, resourceId)) {
                await this.auditLogger.logAuthorizationEvent('ROLE_GRANTED', req.userId, req.sessionId, roleId, {
                    resource: resourceId,
                    ip: req.ip,
                    path: req.path
                });
                next();
            } else {
                await this.auditLogger.logAuthorizationEvent('ROLE_DENIED', req.userId, req.sessionId, roleId, {
                    resource: resourceId,
                    ip: req.ip,
                    path: req.path
                });
                res.status(403).json({ 
                    error: 'Insufficient role',
                    required: roleId,
                    resource: resourceId
                });
            }
        };
    }

    // Minimum role level authorization
    requireMinimumRole(minimumRoleId, resourceParam = null) {
        return async (req, res, next) => {
            if (!req.userId) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const resourceId = resourceParam ? req.params[resourceParam] : null;
            
            if (this.rbacManager.hasMinimumRole(req.userId, minimumRoleId, resourceId)) {
                await this.auditLogger.logAuthorizationEvent('MIN_ROLE_GRANTED', req.userId, req.sessionId, minimumRoleId, {
                    resource: resourceId,
                    ip: req.ip,
                    path: req.path
                });
                next();
            } else {
                await this.auditLogger.logAuthorizationEvent('MIN_ROLE_DENIED', req.userId, req.sessionId, minimumRoleId, {
                    resource: resourceId,
                    ip: req.ip,
                    path: req.path
                });
                res.status(403).json({ 
                    error: 'Insufficient role level',
                    required: minimumRoleId,
                    resource: resourceId
                });
            }
        };
    }

    // Rate limiting middleware
    rateLimit(options = {}) {
        const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
        const maxRequests = options.max || 100;
        const requests = new Map();

        return async (req, res, next) => {
            const key = req.userId || req.ip;
            const now = Date.now();
            const windowStart = now - windowMs;

            // Clean old entries
            const userRequests = requests.get(key) || [];
            const validRequests = userRequests.filter(time => time > windowStart);

            if (validRequests.length >= maxRequests) {
                await this.auditLogger.logSecurityViolation('RATE_LIMIT_EXCEEDED', req.userId, req.sessionId, {
                    ip: req.ip,
                    path: req.path,
                    requestCount: validRequests.length,
                    limit: maxRequests,
                    windowMs
                });

                return res.status(429).json({
                    error: 'Too many requests',
                    retryAfter: Math.ceil((validRequests[0] + windowMs - now) / 1000)
                });
            }

            validRequests.push(now);
            requests.set(key, validRequests);
            next();
        };
    }

    // Security headers middleware
    securityHeaders() {
        return (req, res, next) => {
            // Content Security Policy
            res.setHeader('Content-Security-Policy', 
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data: https:; " +
                "connect-src 'self' ws: wss:; " +
                "font-src 'self'; " +
                "object-src 'none'; " +
                "media-src 'self'; " +
                "frame-src 'none';"
            );

            // Other security headers
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
            res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

            // HSTS (only in production with HTTPS)
            if (process.env.NODE_ENV === 'production' && req.secure) {
                res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
            }

            next();
        };
    }

    // Input validation middleware
    validateInput(schema) {
        return async (req, res, next) => {
            try {
                // Basic validation - can be extended with Joi, Yup, or other validation libraries
                if (schema.body) {
                    this.validateObject(req.body, schema.body, 'body');
                }
                if (schema.query) {
                    this.validateObject(req.query, schema.query, 'query');
                }
                if (schema.params) {
                    this.validateObject(req.params, schema.params, 'params');
                }

                next();
            } catch (error) {
                await this.auditLogger.logSecurityViolation('INPUT_VALIDATION_FAILED', req.userId, req.sessionId, {
                    ip: req.ip,
                    path: req.path,
                    error: error.message,
                    invalidData: this.sanitizeForLogging(req.body)
                });

                res.status(400).json({
                    error: 'Invalid input',
                    details: error.message
                });
            }
        };
    }

    validateObject(obj, schema, location) {
        for (const [key, rules] of Object.entries(schema)) {
            const value = obj[key];

            if (rules.required && (value === undefined || value === null)) {
                throw new Error(`${location}.${key} is required`);
            }

            if (value !== undefined && value !== null) {
                if (rules.type && typeof value !== rules.type) {
                    throw new Error(`${location}.${key} must be of type ${rules.type}`);
                }

                if (rules.minLength && value.length < rules.minLength) {
                    throw new Error(`${location}.${key} must be at least ${rules.minLength} characters`);
                }

                if (rules.maxLength && value.length > rules.maxLength) {
                    throw new Error(`${location}.${key} must be at most ${rules.maxLength} characters`);
                }

                if (rules.pattern && !rules.pattern.test(value)) {
                    throw new Error(`${location}.${key} format is invalid`);
                }
            }
        }
    }

    sanitizeForLogging(data) {
        if (!data || typeof data !== 'object') return data;

        const sanitized = { ...data };
        const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];

        for (const field of sensitiveFields) {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        }

        return sanitized;
    }

    // CORS middleware with security considerations
    cors(options = {}) {
        const allowedOrigins = options.origins || ['http://localhost:3000', 'http://localhost:5000'];
        const allowedMethods = options.methods || ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
        const allowedHeaders = options.headers || ['Content-Type', 'Authorization', 'X-Requested-With'];

        return (req, res, next) => {
            const origin = req.headers.origin;

            if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
                res.setHeader('Access-Control-Allow-Origin', origin || '*');
            }

            res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '));
            res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '));
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

            if (req.method === 'OPTIONS') {
                return res.status(200).end();
            }

            next();
        };
    }

    // Audit logging for all requests
    auditRequests() {
        return async (req, res, next) => {
            const startTime = Date.now();

            // Log request
            await this.auditLogger.logEvent('HTTP_REQUEST', 'REQUEST_START', {
                method: req.method,
                path: req.path,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                contentLength: req.get('Content-Length'),
                authenticated: !!req.userId
            }, req.userId, req.sessionId);

            // Override res.end to log response
            const originalEnd = res.end;
            res.end = async function(chunk, encoding) {
                const duration = Date.now() - startTime;
                
                await this.auditLogger.logEvent('HTTP_REQUEST', 'REQUEST_END', {
                    method: req.method,
                    path: req.path,
                    statusCode: res.statusCode,
                    duration,
                    responseSize: res.get('Content-Length')
                }, req.userId, req.sessionId);

                originalEnd.call(this, chunk, encoding);
            }.bind(this);

            next();
        };
    }
}

module.exports = { SecurityMiddleware };
