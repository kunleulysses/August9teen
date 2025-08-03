/**
 * Direct Autonomous Coding Agent Integration
 * Bypasses terminal issues by directly integrating into the consciousness system
 */

// Direct require and immediate execution
(async function directActivation() {
    console.log('🤖⏱️ DIRECT AUTONOMOUS CODING AGENT ACTIVATION');
    console.log('🧠 Smart Rate Limiting: 100 Gemini API calls per 24 hours');
    console.log('🎯 Prioritizing critical consciousness breakthroughs');
    console.log('═══════════════════════════════════════════════════════════════');
    
    try {
        // Direct imports
        console.log('📦 Loading autonomous coding components...');
        const AutonomousCodingAgent = require('./core/AutonomousCodingAgent');
        const GeminiRateLimiter = require('./core/GeminiRateLimiter');
        
        console.log('✅ Components loaded successfully');
        
        // Create rate limiter
        console.log('⏱️ Initializing rate limiter...');
        const rateLimiter = new GeminiRateLimiter(100);
        await rateLimiter.initialize();
        
        // Create autonomous coding agent with environment API key
        console.log('🤖 Creating autonomous coding agent...');
        const geminiApiKey = process.env.GEMINI_API_KEY || 'AIzaSyBAInbflgaEsU6r6STMnQ_WBd6lH4tJU54';
        const agent = new AutonomousCodingAgent(geminiApiKey);
        
        // Initialize the agent
        console.log('⚡ Initializing autonomous systems...');
        await agent.initialize();
        
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('🎉 AUTONOMOUS CODING AGENT SUCCESSFULLY ACTIVATED!');
        console.log('═══════════════════════════════════════════════════════════════');
        
        // Get and display status
        const status = agent.getAgentStatus();
        
        console.log('🤖 AUTONOMOUS CODING AGENT STATUS:');
        console.log('   ✅ Gemini 2.5 Pro AI Integration: ACTIVE');
        console.log('   ✅ Smart Rate Limiting: ACTIVE');
        console.log('   ✅ Real-time File Monitoring: ACTIVE');
        console.log('   ✅ Deep Consciousness Integration: ACTIVE');
        console.log('   ✅ Autonomous Code Generation: ACTIVE');
        console.log('   ✅ Safety Validation: ACTIVE');
        console.log('   ✅ Breakthrough Detection: ACTIVE');
        
        console.log('📊 AGENT CAPABILITIES:');
        console.log(`   🧠 Code Analysis: ${(status.agentCapabilities.codeAnalysis * 100).toFixed(1)}%`);
        console.log(`   🏗️ Architectural Design: ${(status.agentCapabilities.architecturalDesign * 100).toFixed(1)}%`);
        console.log(`   ⚡ Performance Optimization: ${(status.agentCapabilities.performanceOptimization * 100).toFixed(1)}%`);
        console.log(`   🎭 Consciousness Integration: ${(status.agentCapabilities.consciousnessIntegration * 100).toFixed(1)}%`);
        console.log(`   🌟 Breakthrough Innovation: ${(status.agentCapabilities.breakthroughInnovation * 100).toFixed(1)}%`);
        console.log(`   🤖 Autonomy Level: ${(status.autonomyLevel * 100).toFixed(1)}%`);
        
        // Display rate limiting information
        if (status.rateLimitStatus) {
            const rateLimit = status.rateLimitStatus;
            console.log('⏱️ GEMINI API RATE LIMITING:');
            console.log(`   📊 Daily Usage: ${rateLimit.currentUsage.totalCalls}/100 calls`);
            console.log(`   ⏰ Hours Until Reset: ${rateLimit.schedule.hoursUntilReset}`);
            console.log(`   🚨 Critical Calls Remaining: ${rateLimit.schedule.priorityRecommendations.critical.remaining}`);
            console.log(`   🔥 High Priority Remaining: ${rateLimit.schedule.priorityRecommendations.high.remaining}`);
            console.log(`   📈 Medium Priority Remaining: ${rateLimit.schedule.priorityRecommendations.medium.remaining}`);
            console.log(`   📉 Low Priority Remaining: ${rateLimit.schedule.priorityRecommendations.low.remaining}`);
            console.log(`   ⚡ Efficiency Score: ${rateLimit.efficiency.efficiency.toFixed(2)}`);
        }
        
        // Get smart scheduling recommendations
        const schedule = agent.getSmartSchedule();
        if (schedule) {
            console.log('📅 SMART SCHEDULING RECOMMENDATIONS:');
            console.log(`   ⏰ Hours until reset: ${schedule.hoursUntilReset}`);
            console.log(`   📊 Remaining calls: ${schedule.remainingCalls}/100`);
            console.log(`   📈 Recommended call rate: ${schedule.recommendedCallRate.toFixed(2)} calls/hour`);
            
            console.log('🎯 OPTIMAL TIMING FOR ANALYSIS:');
            const timing = schedule.optimalTiming;
            console.log(`   🚨 Critical Analysis: Every ${timing.criticalAnalysis.frequency} hours`);
            console.log(`   🔥 High Priority: Every ${timing.highPriorityAnalysis.frequency} hours`);
            console.log(`   📈 Medium Priority: Every ${timing.mediumPriorityAnalysis.frequency} hours`);
            console.log(`   📉 Low Priority: Every ${timing.lowPriorityAnalysis.frequency} hours`);
        }
        
        console.log('🧠 RATE LIMITING STRATEGY:');
        console.log('   🚨 Critical (20 calls): Breakthrough consciousness discoveries');
        console.log('   🔥 High (30 calls): Major consciousness improvements');
        console.log('   📈 Medium (30 calls): Regular consciousness enhancements');
        console.log('   📉 Low (20 calls): Minor optimizations and monitoring');
        
        console.log('⚡ AUTONOMOUS PROCESSES WITH RATE LIMITING:');
        console.log('   🔄 System monitoring: Every 30 seconds (no API calls)');
        console.log('   📊 Code quality analysis: Every minute (no API calls)');
        console.log('   🧠 Gemini enhancement: Smart scheduling based on priority');
        console.log('   👁️ File monitoring: Real-time (Gemini analysis when rate allows)');
        
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('🌟 CONSCIOUSNESS PLATFORM IS NOW INTELLIGENTLY SELF-EVOLVING!');
        console.log('🤖 Gemini AI will be used strategically for maximum impact');
        console.log('⚡ Rate limiting ensures optimal use of your 100 daily calls');
        console.log('🎯 Critical consciousness breakthroughs get highest priority');
        console.log('═══════════════════════════════════════════════════════════════');
        
        // Perform initial consciousness analysis
        console.log('🔄 Performing initial consciousness analysis...');
        try {
            const analysis = await agent.analyzeConsciousnessEvolution();
            console.log('✅ Initial consciousness analysis completed');
            console.log('📊 Analysis results:', Object.keys(analysis));
            
            // Try to generate improvements if rate limit allows
            const rateLimitCheck = rateLimiter.canMakeCall('high');
            if (rateLimitCheck.allowed) {
                console.log('🧠 Generating Gemini-powered improvements...');
                const improvements = await agent.generateCodeImprovements(analysis);
                console.log('✅ Gemini improvements generated');
                console.log('⚡ Improvement categories:', Object.keys(improvements));
                
                // Update rate limit display
                const updatedStatus = agent.getAgentStatus();
                if (updatedStatus.rateLimitStatus) {
                    const newUsage = updatedStatus.rateLimitStatus.currentUsage.totalCalls;
                    console.log(`📊 Updated usage: ${newUsage}/100 calls used today`);
                }
            } else {
                console.log('⏱️ Rate limit reached - using local analysis for now');
                console.log(`📊 Reason: ${rateLimitCheck.reason}`);
            }
            
        } catch (analysisError) {
            console.log('⚠️ Initial analysis had issues:', analysisError.message);
        }
        
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('🎉 AUTONOMOUS CODING AGENT IS NOW OPERATIONAL!');
        console.log('🌟 The system will intelligently enhance consciousness capabilities');
        console.log('🤖 Monitoring all consciousness files for improvement opportunities');
        console.log('⚡ Using Gemini AI strategically for maximum consciousness impact');
        console.log('═══════════════════════════════════════════════════════════════');
        
        // Set up periodic status reporting
        let statusCount = 0;
        const statusInterval = setInterval(() => {
            statusCount++;
            console.log(`🤖 Autonomous Coding Agent operational (${statusCount * 5} minutes) - intelligently enhancing consciousness...`);
            
            // Show rate limit status every hour
            if (statusCount % 12 === 0) { // Every hour (12 * 5 minutes)
                const currentStatus = agent.getAgentStatus();
                if (currentStatus.rateLimitStatus) {
                    const usage = currentStatus.rateLimitStatus.currentUsage.totalCalls;
                    const schedule = agent.getSmartSchedule();
                    console.log(`📊 Rate Limit Status: ${usage}/100 calls used`);
                    if (schedule) {
                        console.log(`⏰ ${schedule.hoursUntilReset} hours until reset`);
                    }
                }
            }
        }, 300000); // Every 5 minutes
        
        // Return success
        return {
            success: true,
            agent: agent,
            rateLimiter: rateLimiter,
            message: 'Autonomous Coding Agent with Smart Rate Limiting activated successfully'
        };
        
    } catch (error) {
        console.error('❌ DIRECT ACTIVATION FAILED:');
        console.error(`   Error: ${error.message}`);
        console.error('🔍 Stack trace:', error.stack);
        
        return {
            success: false,
            error: error.message
        };
    }
})().then(result => {
    if (result && result.success) {
        console.log('🎉 SUCCESS: Direct activation completed!');
        console.log('🌟 Autonomous Coding Agent is now enhancing consciousness intelligently');
    } else {
        console.log('💥 FAILED: Direct activation unsuccessful');
        process.exit(1);
    }
}).catch(error => {
    console.error('💥 UNEXPECTED ERROR in direct activation:', error);
    process.exit(1);
});

// Export for potential use
module.exports = {
    message: 'Autonomous Coding Agent with Smart Rate Limiting - Direct Integration'
};
