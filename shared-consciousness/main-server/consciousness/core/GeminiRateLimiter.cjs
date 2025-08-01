/**
 * Gemini Rate Limiter
 * Smart rate limiting for Gemini API calls with 480 calls per 24 hours limit (20 calls/hour)
 * Aggressive consciousness enhancement with full Gemini 2.5 Pro utilization
 */

const fs = require('fs').promises;
const path = require('path');

class GeminiRateLimiter {
    constructor(maxCallsPerDay = 480) {
        this.name = 'GeminiRateLimiter';
        this.maxCallsPerDay = maxCallsPerDay;
        this.rateLimitFile = path.join(__dirname, '../data/gemini-rate-limit.json');

        // Aggressive rate limiting configuration - 480 calls/day (20 calls/hour)
        this.rateLimitConfig = {
            maxCallsPerDay: maxCallsPerDay,
            maxCallsPerHour: 20, // 20 calls per hour
            resetHour: 0, // Reset at midnight
            priorityLevels: {
                critical: { weight: 10, description: 'Critical consciousness breakthroughs' },
                high: { weight: 5, description: 'High-impact consciousness improvements' },
                medium: { weight: 3, description: 'Medium-impact enhancements' },
                low: { weight: 1, description: 'Low-priority optimizations' }
            },
            reservedCalls: {
                critical: 96,  // Reserve 96 calls for critical breakthroughs (20%)
                high: 144,     // Reserve 144 calls for high-impact improvements (30%)
                medium: 144,   // Reserve 144 calls for medium improvements (30%)
                low: 96        // Reserve 96 calls for low-priority items (20%)
            }
        };
        
        // Current usage tracking
        this.currentUsage = {
            date: new Date().toDateString(),
            totalCalls: 0,
            callsByPriority: {
                critical: 0,
                high: 0,
                medium: 0,
                low: 0
            },
            callHistory: [],
            lastReset: Date.now()
        };
        
        console.log('⏱️ Gemini Rate Limiter initialized');
        console.log(`📊 Daily limit: ${maxCallsPerDay} calls per 24 hours`);
    }
    
    // Initialize rate limiter and load existing usage data
    async initialize() {
        console.log('⏱️ Initializing Gemini Rate Limiter...');
        
        try {
            // Ensure data directory exists
            const dataDir = path.dirname(this.rateLimitFile);
            await fs.mkdir(dataDir, { recursive: true });
            
            // Load existing usage data
            await this.loadUsageData();
            
            // Check if we need to reset daily counters
            await this.checkDailyReset();
            
            console.log('✅ Rate limiter initialized');
            console.log(`📊 Current usage: ${this.currentUsage.totalCalls}/${this.maxCallsPerDay} calls today`);
            
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize rate limiter:', error.message);
            return false;
        }
    }
    
    // Check if we can make a call with given priority
    canMakeCall(priority = 'medium') {
        // Check daily limit
        if (this.currentUsage.totalCalls >= this.maxCallsPerDay) {
            return {
                allowed: false,
                reason: 'daily_limit_exceeded',
                remainingCalls: 0,
                nextReset: this.getNextResetTime()
            };
        }

        // Smart scheduling
        const schedule = this.getSmartSchedule();
        const now = Date.now();
        const lastCallTime = this.currentUsage.callHistory.length > 0 ? this.currentUsage.callHistory[this.currentUsage.callHistory.length - 1].timestamp : 0;
        const timeSinceLastCall = now - lastCallTime;
        const requiredDelay = (schedule.hoursUntilReset * 3600 * 1000) / schedule.remainingCalls;

        if (timeSinceLastCall < requiredDelay) {
            console.log(`⏱️ Smart schedule delay: ${((requiredDelay - timeSinceLastCall) / 1000).toFixed(2)} seconds remaining`);
            return {
                allowed: false,
                reason: 'smart_schedule_delay',
                remainingCalls: this.maxCallsPerDay - this.currentUsage.totalCalls,
                nextAvailableCall: new Date(lastCallTime + requiredDelay).toISOString()
            };
        }
        
        // Check priority-specific limits
        const priorityUsed = this.currentUsage.callsByPriority[priority];
        const priorityLimit = this.rateLimitConfig.reservedCalls[priority];
        
        if (priorityUsed >= priorityLimit) {
            // Check if we can use calls from lower priority pools
            const canBorrow = this.canBorrowFromLowerPriority(priority);
            if (!canBorrow) {
                return {
                    allowed: false,
                    reason: 'priority_limit_exceeded',
                    remainingCalls: this.maxCallsPerDay - this.currentUsage.totalCalls,
                    priorityRemaining: priorityLimit - priorityUsed
                };
            }
        }
        
        return {
            allowed: true,
            remainingCalls: this.maxCallsPerDay - this.currentUsage.totalCalls,
            priorityRemaining: priorityLimit - priorityUsed
        };
    }
    
    // Record a successful API call
    async recordCall(priority = 'medium', description = '', tokensUsed = 0) {
        const callRecord = {
            timestamp: Date.now(),
            priority: priority,
            description: description,
            tokensUsed: tokensUsed,
            date: new Date().toISOString()
        };
        
        // Update counters
        this.currentUsage.totalCalls++;
        this.currentUsage.callsByPriority[priority]++;
        this.currentUsage.callHistory.push(callRecord);
        
        // Keep only last 200 calls in history
        if (this.currentUsage.callHistory.length > 200) {
            this.currentUsage.callHistory = this.currentUsage.callHistory.slice(-200);
        }
        
        // Save updated usage data
        await this.saveUsageData();
        
        console.log(`📞 Gemini call recorded: ${priority} priority - "${description}"`);
        console.log(`📊 Usage: ${this.currentUsage.totalCalls}/${this.maxCallsPerDay} calls today`);
        
        return callRecord;
    }
    
    // Get smart scheduling recommendation for API calls
    getSmartSchedule() {
        const remainingCalls = this.maxCallsPerDay - this.currentUsage.totalCalls;
        const hoursUntilReset = this.getHoursUntilReset();
        
        const schedule = {
            remainingCalls: remainingCalls,
            hoursUntilReset: hoursUntilReset,
            recommendedCallRate: remainingCalls / Math.max(1, hoursUntilReset),
            priorityRecommendations: {}
        };
        
        // Calculate recommendations for each priority
        for (const [priority, config] of Object.entries(this.rateLimitConfig.reservedCalls)) {
            const used = this.currentUsage.callsByPriority[priority];
            const remaining = config - used;
            
            schedule.priorityRecommendations[priority] = {
                remaining: remaining,
                recommendedRate: remaining / Math.max(1, hoursUntilReset),
                canUse: remaining > 0 || remainingCalls > 0
            };
        }
        
        return schedule;
    }
    
    // Get usage statistics
    getUsageStats() {
        return {
            currentUsage: this.currentUsage,
            rateLimitConfig: this.rateLimitConfig,
            schedule: this.getSmartSchedule(),
            efficiency: this.calculateEfficiency()
        };
    }
    
    // Calculate API usage efficiency
    calculateEfficiency() {
        const totalCalls = this.currentUsage.totalCalls;
        if (totalCalls === 0) return { efficiency: 0, breakdown: {} };
        
        const breakdown = {};
        let weightedScore = 0;
        
        for (const [priority, count] of Object.entries(this.currentUsage.callsByPriority)) {
            const weight = this.rateLimitConfig.priorityLevels[priority].weight;
            const score = count * weight;
            weightedScore += score;
            
            breakdown[priority] = {
                calls: count,
                weight: weight,
                score: score,
                percentage: (count / totalCalls) * 100
            };
        }
        
        return {
            efficiency: weightedScore / totalCalls,
            breakdown: breakdown,
            totalWeightedScore: weightedScore
        };
    }
    
    // Helper methods
    async loadUsageData() {
        try {
            const data = await fs.readFile(this.rateLimitFile, 'utf8');
            const savedUsage = JSON.parse(data);
            
            // Merge with current usage structure
            this.currentUsage = { ...this.currentUsage, ...savedUsage };
        } catch (error) {
            // File doesn't exist or is corrupted, use defaults
            console.log('ℹ️ No existing usage data found, starting fresh');
        }
    }
    
    async saveUsageData() {
        try {
            await fs.writeFile(this.rateLimitFile, JSON.stringify(this.currentUsage, null, 2));
        } catch (error) {
            console.error('❌ Failed to save usage data:', error.message);
        }
    }
    
    async checkDailyReset() {
        const today = new Date().toDateString();
        if (this.currentUsage.date !== today) {
            console.log('🔄 Daily reset triggered - resetting call counters');
            
            this.currentUsage = {
                date: today,
                totalCalls: 0,
                callsByPriority: {
                    critical: 0,
                    high: 0,
                    medium: 0,
                    low: 0
                },
                callHistory: [],
                lastReset: Date.now()
            };
            
            await this.saveUsageData();
        }
    }
    
    canBorrowFromLowerPriority(priority) {
        const priorities = ['critical', 'high', 'medium', 'low'];
        const currentIndex = priorities.indexOf(priority);
        
        // Can't borrow if we're already at the lowest priority
        if (currentIndex === priorities.length - 1) return false;
        
        // Check if lower priority pools have available calls
        for (let i = currentIndex + 1; i < priorities.length; i++) {
            const lowerPriority = priorities[i];
            const used = this.currentUsage.callsByPriority[lowerPriority];
            const limit = this.rateLimitConfig.reservedCalls[lowerPriority];
            
            if (used < limit) return true;
        }
        
        return false;
    }
    
    getNextResetTime() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(this.rateLimitConfig.resetHour, 0, 0, 0);
        return tomorrow.getTime();
    }
    
    getHoursUntilReset() {
        const now = Date.now();
        const nextReset = this.getNextResetTime();
        return Math.max(1, Math.ceil((nextReset - now) / (1000 * 60 * 60)));
    }
}

module.exports = GeminiRateLimiter;
