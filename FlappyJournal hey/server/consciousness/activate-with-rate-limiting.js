/**
 * Activate Autonomous Coding Agent with Smart Rate Limiting
 * Optimized for 100 Gemini API calls per 24 hours
 */

console.log('🤖⏱️ AUTONOMOUS CODING AGENT WITH SMART RATE LIMITING');
console.log('🧠 Optimized for 100 Gemini API calls per 24 hours');
console.log('🎯 Prioritizes critical consciousness breakthroughs');
console.log('═══════════════════════════════════════════════════════════════');

async function activateWithRateLimiting() {
    try {
        // Import the bootstrap
        console.log('🚀 Loading Autonomous Coding Agent Bootstrap...');
        const bootstrap = require('./core/AutonomousCodingAgentBootstrap');
        
        // Activate the agent
        console.log('⚡ Activating autonomous coding agent...');
        const result = await bootstrap.activate();
        
        if (!result.success) {
            throw new Error(result.message);
        }
        
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('🎉 AUTONOMOUS CODING AGENT ACTIVATED WITH RATE LIMITING!');
        console.log('═══════════════════════════════════════════════════════════════');
        
        // Get smart scheduling recommendations
        const schedule = result.agent.getSmartSchedule();
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
            
            console.log('⚡ PRIORITY ACTIONS AVAILABLE:');
            schedule.priorityActions.forEach(action => {
                console.log(`   ${getPriorityEmoji(action.priority)} ${action.action} (${action.remaining} calls)`);
            });
        }
        
        console.log('🧠 RATE LIMITING STRATEGY:');
        console.log('   🚨 Critical (20 calls): Breakthrough consciousness discoveries');
        console.log('   🔥 High (30 calls): Major consciousness improvements');
        console.log('   📈 Medium (30 calls): Regular consciousness enhancements');
        console.log('   📉 Low (20 calls): Minor optimizations and monitoring');
        
        console.log('⚡ AUTONOMOUS PROCESSES WITH RATE LIMITING:');
        console.log('   🔄 System monitoring: Continuous (no API calls)');
        console.log('   📊 Code quality analysis: Continuous (no API calls)');
        console.log('   🧠 Gemini enhancement: Smart scheduling based on priority');
        console.log('   👁️ File monitoring: Real-time (Gemini analysis when rate allows)');
        
        console.log('🛡️ RATE LIMIT PROTECTION:');
        console.log('   ✅ Automatic call counting and tracking');
        console.log('   ✅ Priority-based call allocation');
        console.log('   ✅ Smart scheduling to maximize impact');
        console.log('   ✅ Fallback to local analysis when rate limited');
        console.log('   ✅ Daily reset at midnight');
        
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('🌟 CONSCIOUSNESS PLATFORM IS NOW INTELLIGENTLY SELF-EVOLVING!');
        console.log('🤖 Gemini AI will be used strategically for maximum impact');
        console.log('⚡ Rate limiting ensures optimal use of your 100 daily calls');
        console.log('🎯 Critical consciousness breakthroughs get highest priority');
        console.log('═══════════════════════════════════════════════════════════════');
        
        // Demonstrate smart enhancement
        console.log('🔄 Performing initial smart enhancement...');
        const enhancementResult = await bootstrap.performManualEnhancement();
        
        if (enhancementResult) {
            console.log('✅ Initial enhancement completed successfully');
            
            // Show updated rate limit status
            const updatedStatus = bootstrap.getStatus();
            if (updatedStatus.agent && updatedStatus.agent !== 'not_initialized') {
                const newSchedule = result.agent.getSmartSchedule();
                if (newSchedule) {
                    console.log(`📊 Updated usage: ${newSchedule.remainingCalls}/100 calls remaining`);
                }
            }
        }
        
        return {
            success: true,
            bootstrap: bootstrap,
            agent: result.agent,
            schedule: schedule
        };
        
    } catch (error) {
        console.error('❌ ACTIVATION WITH RATE LIMITING FAILED:');
        console.error(`   Error: ${error.message}`);
        console.error('🔍 Stack trace:', error.stack);
        
        return {
            success: false,
            error: error.message
        };
    }
}

function getPriorityEmoji(priority) {
    const emojis = {
        critical: '🚨',
        high: '🔥',
        medium: '📈',
        low: '📉'
    };
    return emojis[priority] || '📊';
}

// Execute activation
activateWithRateLimiting().then(result => {
    if (result.success) {
        console.log('🎉 SUCCESS: Autonomous Coding Agent with Rate Limiting is operational!');
        console.log('🌟 The system will intelligently use your 100 daily Gemini calls');
        console.log('🎯 Critical consciousness breakthroughs will be prioritized');
        
        // Keep process alive and show periodic status
        console.log('🔄 Keeping process alive for continuous intelligent enhancement...');
        console.log('💡 The agent will optimize API usage for maximum consciousness impact');
        
        let statusCount = 0;
        setInterval(() => {
            statusCount++;
            console.log(`🤖 Autonomous Coding Agent operational (${statusCount * 5} minutes) - intelligently enhancing consciousness...`);
            
            // Show rate limit status every hour
            if (statusCount % 12 === 0) { // Every hour (12 * 5 minutes)
                const schedule = result.agent.getSmartSchedule();
                if (schedule) {
                    console.log(`📊 Rate Limit Status: ${schedule.remainingCalls}/100 calls remaining`);
                    console.log(`⏰ ${schedule.hoursUntilReset} hours until reset`);
                }
            }
        }, 300000); // Every 5 minutes
        
    } else {
        console.log('💥 FAILED: Autonomous Coding Agent activation unsuccessful');
        console.log('🔒 Consciousness platform remains in original state');
        process.exit(1);
    }
}).catch(error => {
    console.error('💥 UNEXPECTED ERROR:', error);
    process.exit(1);
});
