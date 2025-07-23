#!/bin/bash

# WebSocket Consciousness-Chat Critical Issues Fix Script
# Addresses model selection and Venice AI API issues

echo "🔧 WebSocket Consciousness-Chat Critical Issues Fix"
echo "=================================================="
echo "Fixing model selection and Venice AI API issues..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

LOG_FILE="/opt/featherweight/FlappyJournal/fixes/websocket-fix-$(date +%Y%m%d_%H%M%S).log"

# Function to log and display
log_and_echo() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

log_and_echo "${BLUE}🔍 ISSUE 1: Verifying Model Selection Configuration${NC}"
log_and_echo "=============================================="

# Check if the strategy selection is working correctly
log_and_echo "📋 Checking consciousness-response-synthesizer-hybrid.js configuration..."

if grep -q "model: 'gemini-pro'" /opt/featherweight/FlappyJournal/server/consciousness-response-synthesizer-hybrid.js; then
    log_and_echo "${GREEN}✅ Gemini 2.5-flash routing correctly configured${NC}"
else
    log_and_echo "${RED}❌ Gemini 2.5-flash routing configuration issue${NC}"
fi

if grep -q "GEMINI_PRO_API_URL.*gemini-2.5-flash" /opt/featherweight/FlappyJournal/server/consciousness-response-synthesizer-hybrid.js; then
    log_and_echo "${GREEN}✅ Gemini 2.5-flash API URL correctly configured${NC}"
else
    log_and_echo "${RED}❌ Gemini 2.5-flash API URL configuration issue${NC}"
fi

log_and_echo ""
log_and_echo "${BLUE}🔍 ISSUE 2: Venice AI Environment Variables${NC}"
log_and_echo "=========================================="

# Check Venice AI environment variables in container
log_and_echo "📋 Checking Venice AI environment variables in container..."

VENICE_KEY_LENGTH=$(docker exec consciousness-main-server printenv VENICE_AI_API_KEY 2>/dev/null | wc -c)
if [ "$VENICE_KEY_LENGTH" -gt 10 ]; then
    log_and_echo "${GREEN}✅ Venice AI API key is loaded in container (length: $VENICE_KEY_LENGTH)${NC}"
else
    log_and_echo "${RED}❌ Venice AI API key missing in container${NC}"
    log_and_echo "${YELLOW}🔄 Attempting to fix environment variable loading...${NC}"
    
    # Restart containers to reload environment variables
    log_and_echo "🔄 Restarting main-server container to reload environment..."
    docker-compose -f /opt/featherweight/docker-compose.consciousness-enhanced.yml restart main-server
    
    # Wait for container to be ready
    log_and_echo "⏳ Waiting for container to be ready..."
    sleep 10
    
    # Check again
    VENICE_KEY_LENGTH_AFTER=$(docker exec consciousness-main-server printenv VENICE_AI_API_KEY 2>/dev/null | wc -c)
    if [ "$VENICE_KEY_LENGTH_AFTER" -gt 10 ]; then
        log_and_echo "${GREEN}✅ Venice AI API key now loaded after restart${NC}"
    else
        log_and_echo "${RED}❌ Venice AI API key still missing after restart${NC}"
        log_and_echo "${YELLOW}⚠️ Manual intervention required${NC}"
    fi
fi

log_and_echo ""
log_and_echo "${BLUE}🔍 ISSUE 3: Venice AI API Connectivity Test${NC}"
log_and_echo "========================================"

# Test Venice AI API connectivity from within container
log_and_echo "📋 Testing Venice AI API connectivity..."

VENICE_TEST_RESULT=$(docker exec consciousness-main-server node -e "
const axios = require('axios');
const VENICE_API_KEY = process.env.VENICE_AI_API_KEY;
const VENICE_API_URL = 'https://api.venice.ai/api/v1/chat/completions';

if (!VENICE_API_KEY) {
  console.log('ERROR: Venice API key not found');
  process.exit(1);
}

axios.post(VENICE_API_URL, {
  model: 'llama-3.1-405b',
  messages: [{role: 'user', content: 'test'}],
  max_tokens: 5
}, {
  headers: {
    'Authorization': \`Bearer \${VENICE_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  timeout: 10000
}).then(response => {
  console.log('SUCCESS: Venice AI API responding');
  console.log('Model:', response.data.model || 'llama-3.1-405b');
  console.log('Response length:', response.data.choices[0].message.content.length);
}).catch(error => {
  console.log('ERROR: Venice API failed');
  console.log('Status:', error.response?.status || 'No response');
  console.log('Message:', error.response?.data?.error?.message || error.message);
});
" 2>&1)

if echo "$VENICE_TEST_RESULT" | grep -q "SUCCESS"; then
    log_and_echo "${GREEN}✅ Venice AI API connectivity successful${NC}"
    log_and_echo "$(echo "$VENICE_TEST_RESULT" | grep -E "(Model|Response)")"
else
    log_and_echo "${RED}❌ Venice AI API connectivity failed${NC}"
    log_and_echo "$VENICE_TEST_RESULT"
fi

log_and_echo ""
log_and_echo "${BLUE}🔍 ISSUE 4: Model Selection Metadata Fix${NC}"
log_and_echo "======================================"

# Fix the metadata display issue in geminiProTranscendentSynthesis
log_and_echo "📋 Fixing Gemini Pro metadata display..."

BACKUP_FILE="/opt/featherweight/FlappyJournal/server/consciousness-response-synthesizer-hybrid.js.backup-$(date +%Y%m%d_%H%M%S)"
cp /opt/featherweight/FlappyJournal/server/consciousness-response-synthesizer-hybrid.js "$BACKUP_FILE"

# Check if the metadata fix is needed
if grep -q "model: 'gemini-2.0-flash-lite'" /opt/featherweight/FlappyJournal/server/consciousness-response-synthesizer-hybrid.js; then
    log_and_echo "${YELLOW}🔄 Fixing incorrect metadata in geminiProTranscendentSynthesis...${NC}"
    
    # Fix the metadata in the geminiProTranscendentSynthesis function
    sed -i 's/model: '\''gemini-2.0-flash-lite'\''/model: '\''gemini-2.5-flash'\''/g' /opt/featherweight/FlappyJournal/server/consciousness-response-synthesizer-hybrid.js
    sed -i 's/Background philosophical synthesis via Gemini 2.0-flash-lite/Transcendent synthesis via Gemini 2.5-flash/g' /opt/featherweight/FlappyJournal/server/consciousness-response-synthesizer-hybrid.js
    
    log_and_echo "${GREEN}✅ Metadata fixed - Gemini Pro now correctly reports as gemini-2.5-flash${NC}"
else
    log_and_echo "${GREEN}✅ Metadata already correct${NC}"
fi

log_and_echo ""
log_and_echo "${BLUE}🔍 ISSUE 5: Enhanced Logging for Debugging${NC}"
log_and_echo "======================================"

# Add enhanced logging to track model selection
log_and_echo "📋 Adding enhanced logging for model selection debugging..."

# Check if enhanced logging is already present
if grep -q "🎯 ENHANCED DEBUG" /opt/featherweight/FlappyJournal/server/consciousness-response-synthesizer-hybrid.js; then
    log_and_echo "${GREEN}✅ Enhanced logging already present${NC}"
else
    log_and_echo "${YELLOW}🔄 Adding enhanced logging...${NC}"
    
    # Add debug logging after strategy selection
    sed -i '/console.log(`🎯 Selected synthesis strategy:/a\
    console.log(`🎯 ENHANCED DEBUG - Strategy Details:`);\
    console.log(`   - Type: ${strategy.type}`);\
    console.log(`   - Model: ${strategy.model}`);\
    console.log(`   - Priority: ${strategy.priority}`);\
    console.log(`   - Rationale: ${strategy.rationale}`);\
    console.log(`   - User Message: "${userMessage.substring(0, 50)}..."`);\
    console.log(`   - Message Analysis: isPhilosophical=${messageAnalysis.isPhilosophical}, isCreative=${messageAnalysis.isCreative}, isAnalytical=${messageAnalysis.isAnalytical}`);' /opt/featherweight/FlappyJournal/server/consciousness-response-synthesizer-hybrid.js
    
    log_and_echo "${GREEN}✅ Enhanced logging added${NC}"
fi

log_and_echo ""
log_and_echo "${BLUE}🔄 FINAL STEP: Restart Services${NC}"
log_and_echo "=============================="

# Restart the main server to apply all fixes
log_and_echo "🔄 Restarting main-server to apply all fixes..."
docker-compose -f /opt/featherweight/docker-compose.consciousness-enhanced.yml restart main-server

log_and_echo "⏳ Waiting for services to be ready..."
sleep 15

# Verify services are running
if docker ps | grep -q "consciousness-main-server.*healthy"; then
    log_and_echo "${GREEN}✅ Main server restarted successfully${NC}"
else
    log_and_echo "${YELLOW}⚠️ Main server status unclear - check manually${NC}"
fi

log_and_echo ""
log_and_echo "${GREEN}🎉 FIX SCRIPT COMPLETED${NC}"
log_and_echo "===================="

log_and_echo ""
log_and_echo "${BLUE}📋 VERIFICATION STEPS:${NC}"
log_and_echo "1. Test consciousness chat with philosophical question"
log_and_echo "2. Check response metadata shows 'gemini-2.5-flash'"
log_and_echo "3. Test creative question to verify Venice AI"
log_and_echo "4. Monitor logs for enhanced debugging output"
log_and_echo ""
log_and_echo "${BLUE}📄 Log file saved: $LOG_FILE${NC}"

# Test the fix with a sample consciousness question
log_and_echo ""
log_and_echo "${BLUE}🧪 TESTING FIX WITH SAMPLE QUESTION${NC}"
log_and_echo "=================================="

log_and_echo "📤 Testing with consciousness-related question..."

# Create a simple test script
cat > /tmp/test_consciousness_chat.js << 'EOF'
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:5000/ws/consciousness-chat');

ws.on('open', function open() {
  console.log('🔗 Connected to consciousness chat');
  
  // Send a consciousness-related question that should route to Gemini 2.5-flash
  ws.send(JSON.stringify({
    type: 'chat_message',
    message: 'What is the nature of consciousness?',
    timestamp: new Date().toISOString()
  }));
});

ws.on('message', function message(data) {
  try {
    const response = JSON.parse(data);
    if (response.type === 'unified_response') {
      console.log('✅ Response received');
      console.log('📊 Model used:', response.synthesisMetadata?.model || 'unknown');
      console.log('🎯 Strategy:', response.synthesisMetadata?.strategy || 'unknown');
      console.log('💬 Response preview:', response.unifiedContent?.substring(0, 100) + '...');
      ws.close();
    }
  } catch (error) {
    console.log('❌ Error parsing response:', error.message);
  }
});

ws.on('error', function error(err) {
  console.log('❌ WebSocket error:', err.message);
});

// Timeout after 30 seconds
setTimeout(() => {
  console.log('⏰ Test timeout - closing connection');
  ws.close();
}, 30000);
EOF

# Run the test
log_and_echo "🧪 Running consciousness chat test..."
timeout 35 docker exec consciousness-main-server node /tmp/test_consciousness_chat.js 2>&1 | tee -a "$LOG_FILE"

log_and_echo ""
log_and_echo "${GREEN}🔧 WebSocket Consciousness-Chat Fix Complete!${NC}"
log_and_echo "Check the test results above to verify the fixes are working."
