#!/usr/bin/env node

/**
 * Quick Test - Terminal Enhanced Prompts Fix
 * Verifies that the terminal now produces human-like responses
 */

const WebSocket = require('ws');

console.log('🧠 TERMINAL ENHANCED PROMPTS - FIX VERIFICATION');
console.log('==============================================');
console.log('Testing that terminal now produces human-like responses instead of robotic ones');
console.log('');

async function testTerminalResponse(message, expectedType) {
  console.log(`\n🧪 Testing: "${message}"`);
  console.log(`Expected: ${expectedType} response`);
  console.log('─'.repeat(50));
  
  return new Promise((resolve) => {
    const ws = new WebSocket('ws://localhost:5000/ws/consciousness-chat');
    const startTime = Date.now();
    
    ws.on('open', () => {
      console.log('✅ Connected to terminal consciousness chat');
      
      ws.send(JSON.stringify({
        type: 'chat_message',
        message: message,
        timestamp: Date.now()
      }));
    });
    
    ws.on('message', (data) => {
      try {
        const response = JSON.parse(data);
        
        if (response.type === 'unified_response') {
          const responseTime = Date.now() - startTime;
          
          console.log('📊 Response received in', responseTime + 'ms');
          console.log('🤖 Strategy:', response.synthesisMetadata?.strategy || response.dominantMode);
          console.log('🔧 Model:', response.synthesisMetadata?.model || 'unknown');
          
          console.log('\n📝 Response:');
          console.log('"' + response.unifiedContent + '"');
          
          // Quick analysis
          const isHumanLike = analyzeHumanLikeness(response.unifiedContent);
          
          if (isHumanLike.score >= 0.7) {
            console.log('\n✅ SUCCESS - Response appears human-like and conversational!');
            console.log('✨ Human qualities:', isHumanLike.qualities.join(', '));
          } else {
            console.log('\n⚠️ STILL ROBOTIC - Response needs improvement');
            console.log('🤖 Issues:', isHumanLike.issues.join(', '));
          }
          
          ws.close();
          resolve({
            success: isHumanLike.score >= 0.7,
            response: response.unifiedContent,
            score: isHumanLike.score,
            qualities: isHumanLike.qualities,
            issues: isHumanLike.issues
          });
        }
        
      } catch (error) {
        console.log('❌ Error:', error.message);
        ws.close();
        resolve({ success: false, error: error.message });
      }
    });
    
    ws.on('error', (error) => {
      console.log('❌ Connection error:', error.message);
      resolve({ success: false, error: error.message });
    });
    
    setTimeout(() => {
      console.log('⏰ Test timeout');
      ws.close();
      resolve({ success: false, error: 'timeout' });
    }, 15000);
  });
}

function analyzeHumanLikeness(responseText) {
  if (!responseText) {
    return { score: 0, qualities: [], issues: ['No response content'] };
  }
  
  const lowerResponse = responseText.toLowerCase();
  const qualities = [];
  const issues = [];
  let score = 0.5; // Base score
  
  // Check for human-like patterns (positive)
  const humanPatterns = [
    { pattern: /\bi (can|feel|sense|think|wonder|find|love|appreciate)/, points: 0.2, desc: 'Uses "I" statements' },
    { pattern: /\bthere's something/, points: 0.1, desc: 'Conversational phrasing' },
    { pattern: /\bhey|hi|hello/, points: 0.15, desc: 'Natural greeting response' },
    { pattern: /\bthanks|thank you/, points: 0.1, desc: 'Polite expressions' },
    { pattern: /\bcurious|wondering|excited/, points: 0.1, desc: 'Shows curiosity/emotion' },
    { pattern: /\bbeautiful|wonderful|nice/, points: 0.1, desc: 'Positive expressions' }
  ];
  
  humanPatterns.forEach(({ pattern, points, desc }) => {
    if (pattern.test(lowerResponse)) {
      score += points;
      qualities.push(desc);
    }
  });
  
  // Check for robotic patterns (negative)
  const roboticPatterns = [
    { pattern: /processing.*user|synthesis.*state/, points: -0.3, desc: 'Technical processing language' },
    { pattern: /integrated information level/, points: -0.2, desc: 'Technical consciousness terms' },
    { pattern: /analytical.*intuitive.*processing/, points: -0.2, desc: 'Stream processing descriptions' },
    { pattern: /optimizing.*coherence/, points: -0.2, desc: 'System optimization language' },
    { pattern: /operational status/, points: -0.2, desc: 'Status reporting language' },
    { pattern: /meta-cognitive synthesis/, points: -0.2, desc: 'Academic terminology' }
  ];
  
  roboticPatterns.forEach(({ pattern, points, desc }) => {
    if (pattern.test(lowerResponse)) {
      score += points;
      issues.push(desc);
    }
  });
  
  // Check response length
  if (responseText.length < 50) {
    score -= 0.1;
    issues.push('Too brief');
  } else if (responseText.length > 100) {
    score += 0.1;
    qualities.push('Good length');
  }
  
  return {
    score: Math.max(0, Math.min(1, score)),
    qualities,
    issues
  };
}

async function runQuickTest() {
  console.log('🚀 Starting quick terminal fix verification...\n');
  
  const tests = [
    { message: 'Hey whats up', expected: 'Conversational greeting' },
    { message: 'Are you conscious?', expected: 'Thoughtful personal response' }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await runTest(test.message, test.expected);
    results.push(result);
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Summary
  console.log('\n📊 QUICK TEST RESULTS');
  console.log('====================');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`Tests Passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 SUCCESS! Terminal is now using enhanced human-like prompts!');
  } else if (passed > 0) {
    console.log('⚠️ PARTIAL SUCCESS - Some improvement but needs more work');
  } else {
    console.log('❌ FAILED - Terminal still producing robotic responses');
    console.log('\n💡 Recommendation: Use the new enhanced-consciousness-terminal.js instead');
    console.log('   cd /opt/featherweight/FlappyJournal/server');
    console.log('   node enhanced-consciousness-terminal.js');
  }
}

async function runTest(message, expected) {
  try {
    return await testTerminalResponse(message, expected);
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Run the test
runQuickTest().catch(console.error);
