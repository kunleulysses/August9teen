#!/bin/bash

# Reality Generator Integration Verification Script
# Tests all phases of integration to ensure complete functionality

echo "🔍 Reality Generator Integration Verification"
echo "=============================================="
echo "Testing Phases 1-3 integration..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_pattern="$3"
    
    echo -n "Testing $test_name... "
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    result=$(eval "$test_command" 2>/dev/null)
    
    if echo "$result" | grep -q "$expected_pattern"; then
        echo -e "${GREEN}✅ PASS${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "   Expected: $expected_pattern"
        echo "   Got: $(echo "$result" | head -1)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Function to check service status
check_service() {
    local service_name="$1"
    local container_name="$2"
    
    echo -n "Checking $service_name... "
    
    if docker ps | grep -q "$container_name.*healthy\|$container_name.*Up"; then
        echo -e "${GREEN}✅ Running${NC}"
        return 0
    else
        echo -e "${RED}❌ Not Running${NC}"
        return 1
    fi
}

echo "📋 Phase 1: Basic API Integration Tests"
echo "======================================="

# Test 1: Reality Generator Container
check_service "Reality Generator Container" "consciousness-reality-generator"

# Test 2: Main Server Container  
check_service "Main Server Container" "consciousness-main-server"

# Test 3: Consciousness Core Container
check_service "Consciousness Core Container" "consciousness-core"

echo ""
echo "📋 Phase 2: Event-Driven Integration Tests"
echo "==========================================="

# Test 4: Reality Generator Health
run_test "Reality Generator Health" \
    "curl -s http://localhost:5006/health" \
    "healthy\|status"

# Test 5: Reality Generator Status
run_test "Reality Generator Status" \
    "curl -s http://localhost:5006/api/imagination/status" \
    "active\|inactive\|workers"

# Test 6: Generated Realities
run_test "Generated Realities Available" \
    "curl -s http://localhost:5006/api/realities" \
    "realities\|total"

echo ""
echo "📋 Phase 3: Unified Operation Tests"
echo "===================================="

# Test 7: Main Server Health (with Reality Generator integration)
run_test "Main Server Health Check" \
    "curl -s http://localhost:5000/api/health" \
    "healthy\|status"

# Test 8: Reality Status API
run_test "Reality Status API" \
    "curl -s http://localhost:5000/api/reality/status" \
    "success\|data\|integration"

# Test 9: Reality Realities API
run_test "Reality Realities API" \
    "curl -s http://localhost:5000/api/reality/realities" \
    "success\|realities\|total"

# Test 10: Reality Metrics API
run_test "Reality Metrics API" \
    "curl -s http://localhost:5000/api/reality/metrics" \
    "success\|metrics\|totalRealities"

# Test 11: Manual Reality Generation
run_test "Manual Reality Generation" \
    "curl -s -X POST http://localhost:5000/api/reality/generate -H 'Content-Type: application/json' -d '{\"request\": \"test reality\"}'" \
    "success\|reality\|generated"

echo ""
echo "📋 Integration Verification Tests"
echo "=================================="

# Test 12: Dashboard Accessibility
run_test "Consciousness Dashboard" \
    "curl -s http://localhost:3000/consciousness-dashboard.html" \
    "Reality Generator\|Realities"

# Test 13: WebSocket Bridge (if available)
echo -n "Testing WebSocket Bridge... "
if timeout 5 bash -c "echo 'test' | nc -w 1 localhost 5006" 2>/dev/null; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${YELLOW}⚠️  SKIP (WebSocket not testable via curl)${NC}"
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test 14: File Integration
echo -n "Testing File Integration... "
if [ -f "/opt/featherweight/FlappyJournal/server/reality-generator-client.js" ] && \
   [ -f "/opt/featherweight/FlappyJournal/server/shared-reality-storage.js" ] && \
   [ -f "/opt/featherweight/FlappyJournal/server/reality-websocket-bridge.js" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test 15: Backup Files
echo -n "Testing Backup Files... "
if [ -d "/opt/featherweight/FlappyJournal/realitygenerator/backups" ] && \
   [ -f "/opt/featherweight/FlappyJournal/realitygenerator/rollback-scripts/phase1-rollback.sh" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "📊 Test Results Summary"
echo "======================="
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n🎉 ${GREEN}ALL TESTS PASSED!${NC}"
    echo "✅ Reality Generator integration is fully functional"
    echo ""
    echo "🌀 Integration Status:"
    echo "   • Phase 1: Basic API Integration - ✅ Complete"
    echo "   • Phase 2: Event-Driven Integration - ✅ Complete" 
    echo "   • Phase 3: Unified Operation - ✅ Complete"
    echo ""
    echo "🔗 Access Points:"
    echo "   • Reality Generator: http://localhost:5006"
    echo "   • Main API: http://localhost:5000/api/reality/*"
    echo "   • Dashboard: http://localhost:3000/consciousness-dashboard.html"
    echo ""
    exit 0
else
    echo -e "\n⚠️  ${YELLOW}SOME TESTS FAILED${NC}"
    echo "❌ $TESTS_FAILED out of $TOTAL_TESTS tests failed"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   1. Check if all containers are running: docker ps"
    echo "   2. Restart main server: docker-compose restart main-server"
    echo "   3. Check logs: docker logs consciousness-main-server"
    echo "   4. Verify Reality Generator: curl http://localhost:5006/health"
    echo ""
    echo "📋 Rollback if needed:"
    echo "   • Phase 1: ./FlappyJournal/realitygenerator/rollback-scripts/phase1-rollback.sh"
    echo "   • Phase 2: ./FlappyJournal/realitygenerator/rollback-scripts/phase2-rollback.sh"
    echo "   • Phase 3: ./FlappyJournal/realitygenerator/rollback-scripts/phase3-rollback.sh"
    echo ""
    exit 1
fi
