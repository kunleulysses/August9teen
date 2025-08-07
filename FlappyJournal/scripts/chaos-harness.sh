#!/bin/bash
set -euo pipefail

# C5: Chaos Harness - Disk Full and LevelDB Lock Tests
# Simulates infrastructure failures for resilience testing

echo "💥 Starting Chaos Engineering Tests"
echo "=================================="

CHAOS_DIR="/tmp/sigil-chaos-$$"
TEST_RESULTS=()

cleanup() {
  echo "🧹 Cleaning up chaos test environment..."
  sudo umount "$CHAOS_DIR" 2>/dev/null || true
  sudo losetup -d /dev/loop10 2>/dev/null || true
  rm -rf "$CHAOS_DIR" /tmp/sigil-disk.img
}

trap cleanup EXIT

# Test 1: Disk Full Simulation
test_disk_full() {
  echo "💾 Testing disk full scenario..."
  
  mkdir -p "$CHAOS_DIR"
  
  # Create 10MB filesystem
  dd if=/dev/zero of=/tmp/sigil-disk.img bs=1M count=10 2>/dev/null
  sudo losetup /dev/loop10 /tmp/sigil-disk.img
  sudo mkfs.ext4 /dev/loop10 -q
  sudo mount /dev/loop10 "$CHAOS_DIR"
  sudo chown $USER:$USER "$CHAOS_DIR"
  
  # Start service with limited disk
  SIGIL_DB_PATH="$CHAOS_DIR/sigil-db" node server/index.cjs &
  SERVICE_PID=$!
  sleep 3
  
  # Fill disk
  dd if=/dev/zero of="$CHAOS_DIR/fill" bs=1M 2>/dev/null || true
  
  # Try to create sigil - should fail gracefully
  if curl -sf -X POST http://localhost:3000/api/consciousness/sigils \
    -H "Content-Type: application/json" \
    -d '{"data":{"test":"disk-full"}}' >/dev/null 2>&1; then
    TEST_RESULTS+=("❌ Disk full test: Service should have failed")
  else
    TEST_RESULTS+=("✅ Disk full test: Service failed gracefully")
  fi
  
  kill $SERVICE_PID 2>/dev/null || true
  wait $SERVICE_PID 2>/dev/null || true
}

# Test 2: LevelDB Lock Simulation  
test_leveldb_lock() {
  echo "🔒 Testing LevelDB lock scenario..."
  
  # Start first instance
  SIGIL_DB_PATH="./test-lock-db" node server/index.cjs &
  FIRST_PID=$!
  sleep 2
  
  # Try to start second instance - should fail
  if SIGIL_DB_PATH="./test-lock-db" timeout 5 node server/index.cjs >/dev/null 2>&1; then
    TEST_RESULTS+=("❌ Lock test: Second instance should have failed")
  else
    TEST_RESULTS+=("✅ Lock test: Second instance failed as expected")
  fi
  
  kill $FIRST_PID 2>/dev/null || true
  wait $FIRST_PID 2>/dev/null || true
  rm -rf ./test-lock-db
}

# Run tests
test_disk_full
test_leveldb_lock

# Report results
echo ""
echo "📊 Chaos Test Results:"
echo "====================="
for result in "${TEST_RESULTS[@]}"; do
  echo "$result"
done

# Check if any tests failed
if printf '%s\n' "${TEST_RESULTS[@]}" | grep -q "❌"; then
  echo ""
  echo "💥 Some chaos tests failed!"
  exit 1
else
  echo ""
  echo "✅ All chaos tests passed!"
fi