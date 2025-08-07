const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');

class AuditLogger extends EventEmitter {
    constructor(options = {}) {
        super();
        this.logDir = options.logDir || path.join(process.cwd(), 'logs', 'audit');
        this.encryptionKey = options.encryptionKey || process.env.AUDIT_ENCRYPTION_KEY;
        this.signingKey = options.signingKey || process.env.AUDIT_SIGNING_KEY;
        this.maxLogSize = options.maxLogSize || 10 * 1024 * 1024; // 10MB
        this.retentionDays = options.retentionDays || 2555; // 7 years for compliance
        this.currentLogFile = null;
        this.logBuffer = [];
        this.flushInterval = options.flushInterval || 5000; // 5 seconds
        this.initialized = false;
        
        this.init();
    }

    async init() {
        try {
            await fs.mkdir(this.logDir, { recursive: true });
            this.currentLogFile = this.generateLogFileName();
            
            // Start periodic flush
            setInterval(() => this.flushLogs(), this.flushInterval);
            
            // Start daily cleanup
            setInterval(() => this.cleanupOldLogs(), 24 * 60 * 60 * 1000); // Daily
            
            this.initialized = true;
            this.emit('initialized');
            
            // Log the audit system initialization
            await this.logEvent('AUDIT_SYSTEM', 'INITIALIZED', {
                logDir: this.logDir,
                retentionDays: this.retentionDays,
                encryptionEnabled: !!this.encryptionKey
            });
            
        } catch (error) {
            this.emit('error', error);
            throw new Error(`Failed to initialize audit logger: ${error.message}`);
        }
    }

    generateLogFileName() {
        const date = new Date().toISOString().split('T')[0];
        return path.join(this.logDir, `audit-${date}.log`);
    }

    async logEvent(category, action, details = {}, userId = null, sessionId = null) {
        if (!this.initialized) {
            await new Promise(resolve => this.once('initialized', resolve));
        }

        const timestamp = new Date().toISOString();
        const eventId = crypto.randomUUID();
        
        const auditEvent = {
            eventId,
            timestamp,
            category,
            action,
            userId,
            sessionId,
            details,
            source: {
                ip: details.ip || 'unknown',
                userAgent: details.userAgent || 'unknown',
                service: 'spiral-memory'
            },
            integrity: null // Will be set after signing
        };

        // Sign the event for integrity
        if (this.signingKey) {
            const eventData = JSON.stringify({
                eventId,
                timestamp,
                category,
                action,
                userId,
                sessionId,
                details: JSON.stringify(details)
            });
            
            auditEvent.integrity = crypto
                .createHmac('sha256', this.signingKey)
                .update(eventData)
                .digest('hex');
        }

        // Encrypt sensitive details if encryption key is available
        if (this.encryptionKey && this.shouldEncrypt(category, details)) {
            auditEvent.details = await this.encryptData(JSON.stringify(details));
            auditEvent.encrypted = true;
        }

        this.logBuffer.push(auditEvent);
        
        // Emit event for real-time monitoring
        this.emit('auditEvent', auditEvent);
        
        return eventId;
    }

    shouldEncrypt(category, details) {
        // Encrypt sensitive categories and any details containing PII
        const sensitiveCategories = [
            'MEMORY_ACCESS', 'USER_DATA', 'AUTHENTICATION', 
            'AUTHORIZATION', 'DATA_EXPORT', 'ADMIN_ACTION'
        ];
        
        if (sensitiveCategories.includes(category)) {
            return true;
        }
        
        // Check for PII in details
        const detailsStr = JSON.stringify(details).toLowerCase();
        const piiPatterns = [
            'email', 'password', 'ssn', 'credit', 'phone', 
            'address', 'name', 'birth', 'medical'
        ];
        
        return piiPatterns.some(pattern => detailsStr.includes(pattern));
    }

    async encryptData(data) {
        if (!this.encryptionKey) return data;
        
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipher('aes-256-gcm', this.encryptionKey);
        cipher.setAAD(Buffer.from('spiral-memory-audit'));
        
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag();
        
        return {
            encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
            algorithm: 'aes-256-gcm'
        };
    }

    async decryptData(encryptedData) {
        if (!this.encryptionKey || typeof encryptedData === 'string') {
            return encryptedData;
        }
        
        const decipher = crypto.createDecipher('aes-256-gcm', this.encryptionKey);
        decipher.setAAD(Buffer.from('spiral-memory-audit'));
        decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
        
        let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    }

    async flushLogs() {
        if (this.logBuffer.length === 0) return;
        
        const logsToFlush = [...this.logBuffer];
        this.logBuffer = [];
        
        try {
            const logEntries = logsToFlush.map(event => JSON.stringify(event)).join('\n') + '\n';
            await fs.appendFile(this.currentLogFile, logEntries, 'utf8');
            
            // Check if we need to rotate the log file
            const stats = await fs.stat(this.currentLogFile);
            if (stats.size > this.maxLogSize) {
                await this.rotateLogFile();
            }
            
        } catch (error) {
            // Put logs back in buffer if write failed
            this.logBuffer.unshift(...logsToFlush);
            this.emit('error', error);
        }
    }

    async rotateLogFile() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const rotatedFile = this.currentLogFile.replace('.log', `-${timestamp}.log`);
        
        try {
            await fs.rename(this.currentLogFile, rotatedFile);
            this.currentLogFile = this.generateLogFileName();
            
            await this.logEvent('AUDIT_SYSTEM', 'LOG_ROTATED', {
                oldFile: rotatedFile,
                newFile: this.currentLogFile
            });
            
        } catch (error) {
            this.emit('error', error);
        }
    }

    async cleanupOldLogs() {
        try {
            const files = await fs.readdir(this.logDir);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);
            
            for (const file of files) {
                if (!file.startsWith('audit-') || !file.endsWith('.log')) continue;
                
                const filePath = path.join(this.logDir, file);
                const stats = await fs.stat(filePath);
                
                if (stats.mtime < cutoffDate) {
                    await fs.unlink(filePath);
                    await this.logEvent('AUDIT_SYSTEM', 'LOG_DELETED', {
                        file: file,
                        reason: 'retention_policy'
                    });
                }
            }
            
        } catch (error) {
            this.emit('error', error);
        }
    }

    async searchLogs(criteria = {}) {
        const { startDate, endDate, category, action, userId, eventId } = criteria;
        const results = [];
        
        try {
            const files = await fs.readdir(this.logDir);
            const logFiles = files.filter(f => f.startsWith('audit-') && f.endsWith('.log'));
            
            for (const file of logFiles) {
                const filePath = path.join(this.logDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                const lines = content.split('\n').filter(line => line.trim());
                
                for (const line of lines) {
                    try {
                        const event = JSON.parse(line);
                        
                        // Apply filters
                        if (startDate && new Date(event.timestamp) < new Date(startDate)) continue;
                        if (endDate && new Date(event.timestamp) > new Date(endDate)) continue;
                        if (category && event.category !== category) continue;
                        if (action && event.action !== action) continue;
                        if (userId && event.userId !== userId) continue;
                        if (eventId && event.eventId !== eventId) continue;
                        
                        // Decrypt if needed
                        if (event.encrypted && event.details) {
                            event.details = await this.decryptData(event.details);
                            if (typeof event.details === 'string') {
                                event.details = JSON.parse(event.details);
                            }
                        }
                        
                        results.push(event);
                        
                    } catch (parseError) {
                        // Skip malformed log entries
                        continue;
                    }
                }
            }
            
            return results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
        } catch (error) {
            this.emit('error', error);
            throw new Error(`Failed to search logs: ${error.message}`);
        }
    }

    async generateComplianceReport(startDate, endDate, format = 'json') {
        const logs = await this.searchLogs({ startDate, endDate });
        
        const report = {
            reportId: crypto.randomUUID(),
            generatedAt: new Date().toISOString(),
            period: { startDate, endDate },
            totalEvents: logs.length,
            categories: {},
            users: {},
            securityEvents: [],
            dataAccess: [],
            adminActions: [],
            errors: []
        };

        // Analyze logs
        for (const log of logs) {
            // Count by category
            report.categories[log.category] = (report.categories[log.category] || 0) + 1;
            
            // Count by user
            if (log.userId) {
                report.users[log.userId] = (report.users[log.userId] || 0) + 1;
            }
            
            // Categorize events
            if (['AUTHENTICATION', 'AUTHORIZATION', 'SECURITY_VIOLATION'].includes(log.category)) {
                report.securityEvents.push(log);
            }
            
            if (['MEMORY_ACCESS', 'DATA_EXPORT', 'DATA_IMPORT'].includes(log.category)) {
                report.dataAccess.push(log);
            }
            
            if (log.category === 'ADMIN_ACTION') {
                report.adminActions.push(log);
            }
            
            if (log.action.includes('ERROR') || log.action.includes('FAILED')) {
                report.errors.push(log);
            }
        }

        if (format === 'csv') {
            return this.formatReportAsCSV(report);
        }
        
        return report;
    }

    formatReportAsCSV(report) {
        const headers = ['Timestamp', 'Category', 'Action', 'User ID', 'Session ID', 'Details'];
        const rows = [headers.join(',')];
        
        // Add all events to CSV
        const allEvents = [
            ...report.securityEvents,
            ...report.dataAccess,
            ...report.adminActions,
            ...report.errors
        ];
        
        for (const event of allEvents) {
            const row = [
                event.timestamp,
                event.category,
                event.action,
                event.userId || '',
                event.sessionId || '',
                JSON.stringify(event.details).replace(/"/g, '""')
            ];
            rows.push(row.join(','));
        }
        
        return rows.join('\n');
    }

    async verifyLogIntegrity(eventId) {
        if (!this.signingKey) {
            throw new Error('Signing key not configured - cannot verify integrity');
        }
        
        const events = await this.searchLogs({ eventId });
        if (events.length === 0) {
            throw new Error(`Event ${eventId} not found`);
        }
        
        const event = events[0];
        if (!event.integrity) {
            throw new Error('Event does not have integrity signature');
        }
        
        const eventData = JSON.stringify({
            eventId: event.eventId,
            timestamp: event.timestamp,
            category: event.category,
            action: event.action,
            userId: event.userId,
            sessionId: event.sessionId,
            details: JSON.stringify(event.details)
        });
        
        const expectedSignature = crypto
            .createHmac('sha256', this.signingKey)
            .update(eventData)
            .digest('hex');
        
        return event.integrity === expectedSignature;
    }

    // Spiral Memory specific audit methods
    async logMemoryOperation(operation, memoryId, userId, sessionId, details = {}) {
        return await this.logEvent('MEMORY_OPERATION', operation, {
            memoryId,
            ...details
        }, userId, sessionId);
    }

    async logMemoryAccess(memoryId, userId, sessionId, accessType = 'READ', details = {}) {
        return await this.logEvent('MEMORY_ACCESS', accessType, {
            memoryId,
            accessTime: new Date().toISOString(),
            ...details
        }, userId, sessionId);
    }

    async logSpiralTopologyChange(spiralId, changeType, userId, sessionId, details = {}) {
        return await this.logEvent('SPIRAL_TOPOLOGY', changeType, {
            spiralId,
            changeTime: new Date().toISOString(),
            ...details
        }, userId, sessionId);
    }

    async logConsciousnessEvent(eventType, userId, sessionId, details = {}) {
        return await this.logEvent('CONSCIOUSNESS', eventType, {
            eventTime: new Date().toISOString(),
            ...details
        }, userId, sessionId);
    }

    async logSecurityViolation(violationType, userId, sessionId, details = {}) {
        return await this.logEvent('SECURITY_VIOLATION', violationType, {
            violationTime: new Date().toISOString(),
            severity: details.severity || 'HIGH',
            ...details
        }, userId, sessionId);
    }

    async logAdminAction(action, adminUserId, targetUserId, sessionId, details = {}) {
        return await this.logEvent('ADMIN_ACTION', action, {
            adminUserId,
            targetUserId,
            actionTime: new Date().toISOString(),
            ...details
        }, adminUserId, sessionId);
    }

    async logDataExport(exportType, userId, sessionId, details = {}) {
        return await this.logEvent('DATA_EXPORT', exportType, {
            exportTime: new Date().toISOString(),
            recordCount: details.recordCount || 0,
            ...details
        }, userId, sessionId);
    }

    async logAuthenticationEvent(eventType, userId, sessionId, details = {}) {
        return await this.logEvent('AUTHENTICATION', eventType, {
            authTime: new Date().toISOString(),
            ...details
        }, userId, sessionId);
    }

    async logAuthorizationEvent(eventType, userId, sessionId, resource, details = {}) {
        return await this.logEvent('AUTHORIZATION', eventType, {
            resource,
            authTime: new Date().toISOString(),
            ...details
        }, userId, sessionId);
    }

    // Graceful shutdown
    async shutdown() {
        await this.flushLogs();
        this.emit('shutdown');
    }
}

module.exports = { AuditLogger };
