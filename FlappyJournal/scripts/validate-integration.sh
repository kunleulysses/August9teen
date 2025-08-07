#!/bin/bash
set -euo pipefail

# Integration Validation Script
# Tests that all components work together properly

echo "🔧 Starting Full System Integration Validation"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

VALIDATION_RESULTS=()
TEST_PORT=3001

cleanup() {
  echo "🧹 Cleaning up test processes..."
  pkill -f "node.*server/index.cjs" || true
  rm -rf ./test-sigil-leveldb
}

trap cleanup EXIT

# Test 1: Build EventSign
echo "📦 Testing EventSign build..."
if npm run build:eventsign >/dev/null 2>&1; then
  VALIDATION_RESULTS+=("✅ EventSign build successful")
else
  VALIDATION_RESULTS+=("❌ EventSign build failed")
fi

# Test 2: Verify EventSign
echo "🔐 Testing EventSign verification..."
if npm run verify:eventsign >/dev/null 2>&1; then
  VALIDATION_RESULTS+=("✅ EventSign verification successful")
else
  VALIDATION_RESULTS+=("❌ EventSign verification failed")
fi

# Test 3: Start server
echo "🚀 Starting test server..."
SIGIL_PORT=$TEST_PORT SIGIL_DB_PATH=./test-sigil-leveldb node server/index.cjs &
SERVER_PID=$!
sleep 3

# Test 4: Health check
echo "🏥 Testing health endpoints..."
if curl -sf "http://localhost:$TEST_PORT/healthz" >/dev/null; then
  VALIDATION_RESULTS+=("✅ Health endpoint working")
else
  VALIDATION_RESULTS+=("❌ Health endpoint failed")
fi

if curl -sf "http://localhost:$TEST_PORT/readyz" >/dev/null; then
  VALIDATION_RESULTS+=("✅ Readiness endpoint working")
else
  VALIDATION_RESULTS+=("❌ Readiness endpoint failed")
fi

# Test 5: Metrics endpoint
echo "📊 Testing metrics endpoint..."
if curl -sf "http://localhost:$TEST_PORT/metrics" | grep -q "sigil_"; then
  VALIDATION_RESULTS+=("✅ Metrics endpoint working")
else
  VALIDATION_RESULTS+=("❌ Metrics endpoint failed")
fi

# Test 6: Integration tests
echo "🧪 Running integration tests..."
if npm test -- __tests__/integration/ >/dev/null 2>&1; then
  VALIDATION_RESULTS+=("✅ Integration tests passed")
else
  VALIDATION_RESULTS+=("❌ Integration tests failed")
fi

# Test 7: Storage driver tests
echo "💾 Testing storage drivers..."
if npm test -- __tests__/storage/ >/dev/null 2>&1; then
  VALIDATION_RESULTS+=("✅ Storage driver tests passed")
else
  VALIDATION_RESULTS+=("❌ Storage driver tests failed")
fi

# Stop server
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true

# Report results
echo ""
echo "📋 Integration Validation Results:"
echo "================================="
for result in "${VALIDATION_RESULTS[@]}"; do
  echo "$result"
done

# Check overall status
FAILED_COUNT=$(printf '%s\n' "${VALIDATION_RESULTS[@]}" | grep -c "❌" || true)
PASSED_COUNT=$(printf '%s\n' "${VALIDATION_RESULTS[@]}" | grep -c "✅" || true)

echo ""
echo "📊 Summary: $PASSED_COUNT passed, $FAILED_COUNT failed"

if [[ $FAILED_COUNT -gt 0 ]]; then
  echo -e "${RED}💥 Integration validation FAILED${NC}"
  echo "Please fix the failing components before considering production-ready."
  exit 1
else
  echo -e "${GREEN}🎉 Integration validation PASSED${NC}"
  echo "All components are properly integrated and working!"
fi