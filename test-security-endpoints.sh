#!/bin/bash

# Security Endpoints Acceptance Test Script
# Tests all security implementations for the Self-Coding system

set -e

echo "🔒 Self-Coding Security Endpoints Test Suite"
echo "============================================="

# Configuration
METRICS_URL="http://localhost:5000/metrics"
WEBSOCKET_URL="ws://localhost:5001"
CODE_GEN_URL="http://localhost:5000/api/code/generate"
PROM_API_KEY="${PROM_API_KEY:-test-api-key-123}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
pass_test() {
    echo -e "${GREEN}✅ PASS:${NC} $1"
    ((TESTS_PASSED++))
}

fail_test() {
    echo -e "${RED}❌ FAIL:${NC} $1"
    ((TESTS_FAILED++))
}

info() {
    echo -e "${YELLOW}ℹ️  INFO:${NC} $1"
}

# Test 1: Metrics endpoint without API key should return 401
echo ""
echo "Test 1: Metrics endpoint authentication"
echo "----------------------------------------"

info "Testing metrics endpoint without API key..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$METRICS_URL" || echo "000")
if [ "$RESPONSE" = "401" ]; then
    pass_test "Metrics endpoint correctly returns 401 without API key"
else
    fail_test "Metrics endpoint returned $RESPONSE instead of 401"
fi

# Test 2: Metrics endpoint with correct API key should succeed
info "Testing metrics endpoint with correct API key..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -H "x-api-key: $PROM_API_KEY" "$METRICS_URL" || echo "000")
if [ "$RESPONSE" = "200" ]; then
    pass_test "Metrics endpoint correctly returns 200 with valid API key"
else
    fail_test "Metrics endpoint returned $RESPONSE instead of 200 with valid API key"
fi

# Test 3: Metrics endpoint with wrong API key should return 401
info "Testing metrics endpoint with wrong API key..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -H "x-api-key: wrong-key" "$METRICS_URL" || echo "000")
if [ "$RESPONSE" = "401" ]; then
    pass_test "Metrics endpoint correctly returns 401 with wrong API key"
else
    fail_test "Metrics endpoint returned $RESPONSE instead of 401 with wrong API key"
fi

# Test 4: Code generation rate limiting
echo ""
echo "Test 4: Code generation rate limiting"
echo "-------------------------------------"

info "Testing code generation rate limiting (30 requests/minute)..."
SUCCESS_COUNT=0
RATE_LIMITED_COUNT=0

# Send 35 requests rapidly to test rate limiting
for i in {1..35}; do
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "x-api-key: $PROM_API_KEY" \
        -d '{"purpose":"test-rate-limit","type":"module"}' \
        "$CODE_GEN_URL" 2>/dev/null || echo "000")
    
    if [ "$RESPONSE" = "200" ]; then
        ((SUCCESS_COUNT++))
    elif [ "$RESPONSE" = "429" ]; then
        ((RATE_LIMITED_COUNT++))
    fi
    
    # Small delay to avoid overwhelming the server
    sleep 0.1
done

if [ $SUCCESS_COUNT -le 30 ] && [ $RATE_LIMITED_COUNT -gt 0 ]; then
    pass_test "Rate limiting working: $SUCCESS_COUNT successful, $RATE_LIMITED_COUNT rate-limited"
else
    fail_test "Rate limiting not working properly: $SUCCESS_COUNT successful, $RATE_LIMITED_COUNT rate-limited"
fi

# Test 5: Validate Prometheus alert rules
echo ""
echo "Test 5: Prometheus alert rules validation"
echo "-----------------------------------------"

if command -v promtool &> /dev/null; then
    info "Validating Prometheus alert rules..."
    if promtool check rules deploy/prometheus/alerts/selfcoding_rules.yml 2>/dev/null; then
        pass_test "Prometheus alert rules are valid"
    else
        fail_test "Prometheus alert rules validation failed"
    fi
else
    info "Promtool not available, skipping Prometheus rules validation"
fi

# Test 6: Validate Grafana dashboard JSON
echo ""
echo "Test 6: Grafana dashboard validation"
echo "------------------------------------"

info "Validating Grafana dashboard JSON..."
if python3 -m json.tool monitoring/grafana/selfcoding_dashboard.json > /dev/null 2>&1; then
    pass_test "Grafana dashboard JSON is valid"
else
    fail_test "Grafana dashboard JSON is invalid"
fi

# Test 7: Check for security files
echo ""
echo "Test 7: Security configuration files"
echo "------------------------------------"

FILES_TO_CHECK=(
    ".pre-commit-config.yaml"
    ".github/workflows/security-and-quality.yml"
    "audit-ci.json"
    "deploy/prometheus/alerts/selfcoding_rules.yml"
    "monitoring/grafana/selfcoding_dashboard.json"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        pass_test "Security file exists: $file"
    else
        fail_test "Security file missing: $file"
    fi
done

# Test 8: Check environment variables
echo ""
echo "Test 8: Environment configuration"
echo "---------------------------------"

if [ -n "$PROM_API_KEY" ]; then
    pass_test "PROM_API_KEY environment variable is set"
else
    fail_test "PROM_API_KEY environment variable is not set"
fi

# Test 9: WebSocket authentication (if WebSocket server is running)
echo ""
echo "Test 9: WebSocket authentication"
echo "--------------------------------"

info "Testing WebSocket authentication..."
# This is a simplified test - in practice you'd use a WebSocket client
if command -v wscat &> /dev/null; then
    # Test without API key (should fail)
    timeout 5s wscat -c "$WEBSOCKET_URL" 2>/dev/null && {
        fail_test "WebSocket connection succeeded without API key"
    } || {
        pass_test "WebSocket connection correctly rejected without API key"
    }
else
    info "wscat not available, skipping WebSocket authentication test"
fi

# Summary
echo ""
echo "🏁 Test Summary"
echo "==============="
echo -e "Tests passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Total tests:  $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! Security implementation is working correctly.${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  Some tests failed. Please review the security implementation.${NC}"
    exit 1
fi
