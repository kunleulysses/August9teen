// API utility for AI-Fi frontend
const API_BASE = '/api/ai-fi';

class ApiClient {
    async request(endpoint, options = {}) {
        try {
            const defaultHeaders = { 'Content-Type': 'application/json' };
            let authHeader = {};
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('ai-fi-token');
                if (token && !options.headers?.Authorization) {
                    authHeader = { Authorization: `Bearer ${token}` };
                }
            }
            const response = await fetch(`${API_BASE}${endpoint}`, {
                headers: {
                    ...defaultHeaders,
                    ...authHeader,
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Request failed' }));
                throw new Error(error.error || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // Strategy Center APIs
    async getStrategicRecommendations() {
        return this.request('/tier2/ideas?filter=high-impact');
    }

    async getMarketSignals() {
        // Using intelligence endpoint for market signals
        return this.request('/intelligence');
    }

    async approveRecommendation(ideaId) {
        // In a real implementation, this would store the approval
        return { success: true, ideaId };
    }

    // Workshop APIs
    async getContentQueue() {
        // Would connect to a content generation service
        // For now, using transcendent endpoint as a demo
        return this.request('/consciousness/transcendent');
    }

    async approveContent(contentId) {
        return { success: true, contentId };
    }

    async rejectContent(contentId) {
        return { success: true, contentId };
    }

    // Chief of Staff APIs
    async sendChatMessage(message) {
        return this.request('/consciousness/orchestrate', {
            method: 'POST',
            body: JSON.stringify({
                task: message,
                context: 'chief_of_staff_chat',
            }),
        });
    }

    async getConsciousnessStatus() {
        return this.request('/consciousness/status');
    }

    // Evolution/Singularity APIs
    async getEvolutionStrategy() {
        return this.request('/consciousness/evolution');
    }

    async getSingularityStatus() {
        return this.request('/consciousness/singularity');
    }

    // Billing APIs
    async getBillingStatus(email) {
        const query = email ? `?email=${encodeURIComponent(email)}` : '';
        return this.request(`/billing/status${query}`);
    }

    async createCheckoutSession(email, plan) {
        return this.request('/billing/checkout', {
            method: 'POST',
            body: JSON.stringify({ email, plan }),
        });
    }

    // Auth APIs
    async register(email, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async me(token) {
        return this.request('/auth/me', {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
    }

    async getProfile(email) {
        return this.request(`/profile/${encodeURIComponent(email)}`);
    }

    async updateProfile(email, data) {
        return this.request(`/profile/${encodeURIComponent(email)}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async createProfile(data) {
        return this.request('/profile/create', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Connector APIs (placeholder-ready)
    async listConnectors(tenantId) {
        const query = tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : '';
        return this.request(`/connectors${query}`);
    }

    async connectConnector(connectorId, tenantId, config = {}) {
        return this.request(`/connectors/${encodeURIComponent(connectorId)}/connect`, {
            method: 'POST',
            body: JSON.stringify({ tenantId, config }),
        });
    }

    async disconnectConnector(connectorId, tenantId) {
        const query = tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : '';
        return this.request(`/connectors/${encodeURIComponent(connectorId)}${query}`, {
            method: 'DELETE'
        });
    }

    // Experience layer
    async getSelfHealingStatus(url) {
        const query = url ? `?url=${encodeURIComponent(url)}` : '';
        return this.request(`/experience/self-healing/status${query}`);
    }

    async triggerSelfHealing(url) {
        return this.request('/experience/self-healing/trigger', {
            method: 'POST',
            body: JSON.stringify({ url })
        });
    }

    async getPersonalizationRecommendations(persona) {
        const query = persona ? `?persona=${encodeURIComponent(persona)}` : '';
        return this.request(`/experience/personalization/recommendations${query}`);
    }

    async submitFeatureRequest(payload) {
        return this.request('/experience/feature-requests', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    async getConsciousnessState() {
        return this.request('/experience/consciousness/state');
    }

    async triggerSelfModification(signal = 'user_feedback') {
        return this.request('/experience/self-modification/trigger', {
            method: 'POST',
            body: JSON.stringify({ signal })
        });
    }

    async runDiagnostic(payload) {
        return this.request('/experience/diagnostic', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    // Enterprise onboarding
    async createOrg(payload) {
        return this.request('/enterprise/orgs', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    async configureOrgSso(orgId, payload) {
        return this.request(`/enterprise/orgs/${encodeURIComponent(orgId)}/sso`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    async inviteOrgMembers(orgId, invites) {
        return this.request(`/enterprise/orgs/${encodeURIComponent(orgId)}/invite`, {
            method: 'POST',
            body: JSON.stringify({ invites })
        });
    }

    async getOrgOverview(orgId) {
        return this.request(`/enterprise/orgs/${encodeURIComponent(orgId)}/overview`);
    }

    async getOrgIntegrations(orgId) {
        return this.request(`/enterprise/orgs/${encodeURIComponent(orgId)}/integrations`);
    }
}

export default new ApiClient();
