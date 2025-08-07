const { EventEmitter } = require('events');

class RBACManager extends EventEmitter {
    constructor(options = {}) {
        super();
        this.roles = new Map();
        this.permissions = new Map();
        this.userRoles = new Map();
        this.resourcePermissions = new Map();
        
        // Initialize default roles and permissions
        this.initializeDefaultRoles();
        this.initializeDefaultPermissions();
    }

    initializeDefaultRoles() {
        // Define hierarchical roles for spiral memory system
        this.defineRole('super_admin', {
            name: 'Super Administrator',
            description: 'Full system access and management',
            level: 100,
            inherits: []
        });

        this.defineRole('admin', {
            name: 'Administrator',
            description: 'Full project access and management',
            level: 80,
            inherits: []
        });

        this.defineRole('memory_architect', {
            name: 'Memory Architect',
            description: 'Design and modify spiral memory structures',
            level: 70,
            inherits: ['editor']
        });

        this.defineRole('consciousness_engineer', {
            name: 'Consciousness Engineer',
            description: 'Manage consciousness integration and evolution',
            level: 65,
            inherits: ['editor']
        });

        this.defineRole('editor', {
            name: 'Editor',
            description: 'Read/write access to memory content',
            level: 50,
            inherits: ['contributor']
        });

        this.defineRole('contributor', {
            name: 'Contributor',
            description: 'Read/write access with commenting',
            level: 40,
            inherits: ['viewer']
        });

        this.defineRole('analyst', {
            name: 'Analyst',
            description: 'Read access with analytics capabilities',
            level: 35,
            inherits: ['viewer']
        });

        this.defineRole('viewer', {
            name: 'Viewer',
            description: 'Read-only access to memory content',
            level: 20,
            inherits: []
        });

        this.defineRole('guest', {
            name: 'Guest',
            description: 'Limited read access to public content',
            level: 10,
            inherits: []
        });
    }

    initializeDefaultPermissions() {
        // Memory operations
        this.definePermission('memory:create', 'Create new memories');
        this.definePermission('memory:read', 'Read memory content');
        this.definePermission('memory:update', 'Update existing memories');
        this.definePermission('memory:delete', 'Delete memories');
        this.definePermission('memory:export', 'Export memory data');
        this.definePermission('memory:import', 'Import memory data');

        // Spiral topology operations
        this.definePermission('spiral:create', 'Create spiral structures');
        this.definePermission('spiral:read', 'Read spiral topology');
        this.definePermission('spiral:update', 'Modify spiral structures');
        this.definePermission('spiral:delete', 'Delete spiral structures');
        this.definePermission('spiral:analyze', 'Analyze spiral patterns');

        // Consciousness operations
        this.definePermission('consciousness:read', 'Read consciousness data');
        this.definePermission('consciousness:integrate', 'Integrate with consciousness');
        this.definePermission('consciousness:evolve', 'Trigger consciousness evolution');
        this.definePermission('consciousness:monitor', 'Monitor consciousness metrics');

        // System administration
        this.definePermission('system:admin', 'System administration');
        this.definePermission('system:config', 'System configuration');
        this.definePermission('system:monitor', 'System monitoring');
        this.definePermission('system:backup', 'System backup operations');

        // User management
        this.definePermission('user:create', 'Create users');
        this.definePermission('user:read', 'Read user information');
        this.definePermission('user:update', 'Update user information');
        this.definePermission('user:delete', 'Delete users');
        this.definePermission('user:assign_roles', 'Assign roles to users');

        // Audit and compliance
        this.definePermission('audit:read', 'Read audit logs');
        this.definePermission('audit:export', 'Export audit data');
        this.definePermission('compliance:report', 'Generate compliance reports');

        // Analytics and reporting
        this.definePermission('analytics:read', 'Read analytics data');
        this.definePermission('analytics:export', 'Export analytics');
        this.definePermission('reports:generate', 'Generate reports');

        // Assign permissions to roles
        this.assignPermissionsToRoles();
    }

    assignPermissionsToRoles() {
        // Super Admin - all permissions
        const allPermissions = Array.from(this.permissions.keys());
        this.assignPermissionsToRole('super_admin', allPermissions);

        // Admin - most permissions except super admin functions
        this.assignPermissionsToRole('admin', [
            'memory:create', 'memory:read', 'memory:update', 'memory:delete', 'memory:export', 'memory:import',
            'spiral:create', 'spiral:read', 'spiral:update', 'spiral:delete', 'spiral:analyze',
            'consciousness:read', 'consciousness:integrate', 'consciousness:evolve', 'consciousness:monitor',
            'system:config', 'system:monitor', 'system:backup',
            'user:create', 'user:read', 'user:update', 'user:assign_roles',
            'audit:read', 'audit:export', 'compliance:report',
            'analytics:read', 'analytics:export', 'reports:generate'
        ]);

        // Memory Architect - memory and spiral focused
        this.assignPermissionsToRole('memory_architect', [
            'memory:create', 'memory:read', 'memory:update', 'memory:delete', 'memory:export',
            'spiral:create', 'spiral:read', 'spiral:update', 'spiral:delete', 'spiral:analyze',
            'consciousness:read', 'consciousness:integrate',
            'analytics:read', 'reports:generate'
        ]);

        // Consciousness Engineer - consciousness focused
        this.assignPermissionsToRole('consciousness_engineer', [
            'memory:create', 'memory:read', 'memory:update', 'memory:export',
            'spiral:read', 'spiral:update', 'spiral:analyze',
            'consciousness:read', 'consciousness:integrate', 'consciousness:evolve', 'consciousness:monitor',
            'analytics:read', 'reports:generate'
        ]);

        // Editor - read/write access
        this.assignPermissionsToRole('editor', [
            'memory:create', 'memory:read', 'memory:update', 'memory:export',
            'spiral:read', 'spiral:update',
            'consciousness:read', 'consciousness:integrate',
            'analytics:read'
        ]);

        // Contributor - limited write access
        this.assignPermissionsToRole('contributor', [
            'memory:create', 'memory:read', 'memory:update',
            'spiral:read',
            'consciousness:read',
            'analytics:read'
        ]);

        // Analyst - read with analytics
        this.assignPermissionsToRole('analyst', [
            'memory:read', 'memory:export',
            'spiral:read', 'spiral:analyze',
            'consciousness:read', 'consciousness:monitor',
            'analytics:read', 'analytics:export', 'reports:generate'
        ]);

        // Viewer - read only
        this.assignPermissionsToRole('viewer', [
            'memory:read',
            'spiral:read',
            'consciousness:read'
        ]);

        // Guest - very limited access
        this.assignPermissionsToRole('guest', [
            'memory:read'
        ]);
    }

    defineRole(roleId, roleData) {
        this.roles.set(roleId, {
            id: roleId,
            ...roleData,
            permissions: new Set(),
            createdAt: new Date().toISOString()
        });
        
        this.emit('roleCreated', { roleId, roleData });
    }

    definePermission(permissionId, description) {
        this.permissions.set(permissionId, {
            id: permissionId,
            description,
            createdAt: new Date().toISOString()
        });
        
        this.emit('permissionCreated', { permissionId, description });
    }

    assignPermissionsToRole(roleId, permissionIds) {
        const role = this.roles.get(roleId);
        if (!role) {
            throw new Error(`Role ${roleId} not found`);
        }

        for (const permissionId of permissionIds) {
            if (!this.permissions.has(permissionId)) {
                throw new Error(`Permission ${permissionId} not found`);
            }
            role.permissions.add(permissionId);
        }

        this.emit('permissionsAssigned', { roleId, permissionIds });
    }

    assignRoleToUser(userId, roleId, resourceId = null, expiresAt = null) {
        if (!this.roles.has(roleId)) {
            throw new Error(`Role ${roleId} not found`);
        }

        if (!this.userRoles.has(userId)) {
            this.userRoles.set(userId, new Map());
        }

        const userRoleMap = this.userRoles.get(userId);
        const roleKey = resourceId ? `${roleId}:${resourceId}` : roleId;

        userRoleMap.set(roleKey, {
            roleId,
            resourceId,
            assignedAt: new Date().toISOString(),
            expiresAt,
            active: true
        });

        this.emit('roleAssigned', { userId, roleId, resourceId, expiresAt });
    }

    removeRoleFromUser(userId, roleId, resourceId = null) {
        const userRoleMap = this.userRoles.get(userId);
        if (!userRoleMap) return false;

        const roleKey = resourceId ? `${roleId}:${resourceId}` : roleId;
        const removed = userRoleMap.delete(roleKey);

        if (removed) {
            this.emit('roleRemoved', { userId, roleId, resourceId });
        }

        return removed;
    }

    getUserRoles(userId, resourceId = null) {
        const userRoleMap = this.userRoles.get(userId);
        if (!userRoleMap) return [];

        const roles = [];
        const now = new Date();

        for (const [roleKey, roleAssignment] of userRoleMap) {
            // Check if role is expired
            if (roleAssignment.expiresAt && new Date(roleAssignment.expiresAt) < now) {
                continue;
            }

            // Filter by resource if specified
            if (resourceId && roleAssignment.resourceId !== resourceId) {
                continue;
            }

            roles.push({
                ...roleAssignment,
                role: this.roles.get(roleAssignment.roleId)
            });
        }

        return roles;
    }

    getUserPermissions(userId, resourceId = null) {
        const userRoles = this.getUserRoles(userId, resourceId);
        const permissions = new Set();

        for (const roleAssignment of userRoles) {
            const role = roleAssignment.role;
            if (!role) continue;

            // Add direct permissions
            for (const permission of role.permissions) {
                permissions.add(permission);
            }

            // Add inherited permissions
            this.addInheritedPermissions(role, permissions);
        }

        return Array.from(permissions);
    }

    addInheritedPermissions(role, permissions) {
        if (!role.inherits) return;

        for (const inheritedRoleId of role.inherits) {
            const inheritedRole = this.roles.get(inheritedRoleId);
            if (!inheritedRole) continue;

            for (const permission of inheritedRole.permissions) {
                permissions.add(permission);
            }

            // Recursively add inherited permissions
            this.addInheritedPermissions(inheritedRole, permissions);
        }
    }

    hasPermission(userId, permission, resourceId = null) {
        const userPermissions = this.getUserPermissions(userId, resourceId);
        return userPermissions.includes(permission);
    }

    hasRole(userId, roleId, resourceId = null) {
        const userRoles = this.getUserRoles(userId, resourceId);
        return userRoles.some(roleAssignment => roleAssignment.roleId === roleId);
    }

    hasAnyRole(userId, roleIds, resourceId = null) {
        const userRoles = this.getUserRoles(userId, resourceId);
        const userRoleIds = userRoles.map(ra => ra.roleId);
        return roleIds.some(roleId => userRoleIds.includes(roleId));
    }

    hasMinimumRole(userId, minimumRoleId, resourceId = null) {
        const minimumRole = this.roles.get(minimumRoleId);
        if (!minimumRole) return false;

        const userRoles = this.getUserRoles(userId, resourceId);
        
        return userRoles.some(roleAssignment => {
            const userRole = roleAssignment.role;
            return userRole && userRole.level >= minimumRole.level;
        });
    }

    // Resource-specific permission management
    setResourcePermissions(resourceId, resourceType, permissions) {
        this.resourcePermissions.set(resourceId, {
            resourceType,
            permissions,
            createdAt: new Date().toISOString()
        });
    }

    getResourcePermissions(resourceId) {
        return this.resourcePermissions.get(resourceId);
    }

    // Middleware for Express.js
    requirePermission(permission, resourceIdParam = null) {
        return (req, res, next) => {
            const userId = req.user?.id || req.user?.sub;
            if (!userId) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const resourceId = resourceIdParam ? req.params[resourceIdParam] : null;
            
            if (this.hasPermission(userId, permission, resourceId)) {
                next();
            } else {
                res.status(403).json({ 
                    error: 'Insufficient permissions',
                    required: permission,
                    resource: resourceId
                });
            }
        };
    }

    requireRole(roleId, resourceIdParam = null) {
        return (req, res, next) => {
            const userId = req.user?.id || req.user?.sub;
            if (!userId) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const resourceId = resourceIdParam ? req.params[resourceIdParam] : null;
            
            if (this.hasRole(userId, roleId, resourceId)) {
                next();
            } else {
                res.status(403).json({ 
                    error: 'Insufficient role',
                    required: roleId,
                    resource: resourceId
                });
            }
        };
    }

    requireMinimumRole(minimumRoleId, resourceIdParam = null) {
        return (req, res, next) => {
            const userId = req.user?.id || req.user?.sub;
            if (!userId) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const resourceId = resourceIdParam ? req.params[resourceIdParam] : null;
            
            if (this.hasMinimumRole(userId, minimumRoleId, resourceId)) {
                next();
            } else {
                res.status(403).json({ 
                    error: 'Insufficient role level',
                    required: minimumRoleId,
                    resource: resourceId
                });
            }
        };
    }

    // Audit and reporting
    generateRoleReport() {
        const report = {
            generatedAt: new Date().toISOString(),
            totalRoles: this.roles.size,
            totalPermissions: this.permissions.size,
            totalUsers: this.userRoles.size,
            roles: Array.from(this.roles.values()),
            permissions: Array.from(this.permissions.values()),
            userRoleAssignments: this.getUserRoleAssignments()
        };

        return report;
    }

    getUserRoleAssignments() {
        const assignments = [];
        
        for (const [userId, userRoleMap] of this.userRoles) {
            for (const [roleKey, roleAssignment] of userRoleMap) {
                assignments.push({
                    userId,
                    roleKey,
                    ...roleAssignment
                });
            }
        }

        return assignments;
    }

    // Cleanup expired roles
    cleanupExpiredRoles() {
        const now = new Date();
        let cleanedCount = 0;

        for (const [userId, userRoleMap] of this.userRoles) {
            const expiredKeys = [];
            
            for (const [roleKey, roleAssignment] of userRoleMap) {
                if (roleAssignment.expiresAt && new Date(roleAssignment.expiresAt) < now) {
                    expiredKeys.push(roleKey);
                }
            }

            for (const key of expiredKeys) {
                userRoleMap.delete(key);
                cleanedCount++;
            }
        }

        this.emit('expiredRolesCleaned', { cleanedCount });
        return cleanedCount;
    }

    // Export/Import for backup
    exportRBACData() {
        return {
            roles: Array.from(this.roles.entries()),
            permissions: Array.from(this.permissions.entries()),
            userRoles: Array.from(this.userRoles.entries()).map(([userId, roleMap]) => [
                userId,
                Array.from(roleMap.entries())
            ]),
            resourcePermissions: Array.from(this.resourcePermissions.entries()),
            exportedAt: new Date().toISOString()
        };
    }

    importRBACData(data) {
        this.roles = new Map(data.roles);
        this.permissions = new Map(data.permissions);
        
        this.userRoles = new Map(
            data.userRoles.map(([userId, roleEntries]) => [
                userId,
                new Map(roleEntries)
            ])
        );
        
        this.resourcePermissions = new Map(data.resourcePermissions);
        
        this.emit('rbacDataImported', { importedAt: new Date().toISOString() });
    }
}

module.exports = { RBACManager };
