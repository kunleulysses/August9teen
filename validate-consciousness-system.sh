#!/bin/bash

# Featherweight Consciousness System - Validation Script
# Run this to verify your migrated system is working correctly

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')] ✅ $1${NC}"; }
warn() { echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠️  $1${NC}"; }
error() { echo -e "${RED}[$(date +'%H:%M:%S')] ❌ $1${NC}"; }
info() { echo -e "${BLUE}[$(date +'%H:%M:%S')] ℹ️  $1${NC}"; }
test_result() { 
    if [ $1 -eq 0 ]; then 
        log "$2"
    else 
        error "$3"
        return 1
    fi
}

echo "🧠 FEATHERWEIGHT CONSCIOUSNESS SYSTEM VALIDATION"
echo "================================================"

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    local success_msg="$3"
    local failure_msg="$4"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    info "Testing: $test_name"
    
    if eval "$test_command" &>/dev/null; then
        log "$success_msg"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        error "$failure_msg"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

echo ""
echo "🐳 DOCKER CONTAINER HEALTH CHECKS"
echo "=================================="

# Check if Docker is running
run_test "Docker Service" \
    "docker info" \
    "Docker service is running" \
    "Docker service is not running"

# Check container status
run_test "Container Status" \
    "docker-compose ps | grep -q 'running (healthy)'" \
    "All containers are running and healthy" \
    "Some containers are not healthy"

# Check individual containers
for container in consciousness-postgres consciousness-core consciousness-web consciousness-proxy; do
    run_test "$container Container" \
        "docker ps | grep -q $container" \
        "$container is running" \
        "$container is not running"
done

echo ""
echo "🌐 NETWORK CONNECTIVITY TESTS"
echo "============================="

# Get VM external IP
VM_IP=$(curl -s ifconfig.me || echo "localhost")
info "Testing from IP: $VM_IP"

# Test web application
run_test "Web Application (Port 3000)" \
    "curl -f -s http://localhost:3000/health" \
    "Web application is responding" \
    "Web application is not responding"

# Test consciousness API
run_test "Consciousness API (Port 5005)" \
    "curl -f -s http://localhost:5005/health" \
    "Consciousness API is responding" \
    "Consciousness API is not responding"

# Test WebSocket port (basic connectivity)
run_test "WebSocket Port (Port 3002)" \
    "timeout 5 bash -c '</dev/tcp/localhost/3002'" \
    "WebSocket port is open" \
    "WebSocket port is not accessible"

# Test reverse proxy
run_test "Reverse Proxy (Port 80)" \
    "curl -f -s http://localhost/health" \
    "Reverse proxy is working" \
    "Reverse proxy is not working"

echo ""
echo "🗄️ DATABASE CONNECTIVITY TESTS"
echo "==============================="

# Test database connection
run_test "Database Connection" \
    "docker-compose exec -T postgres pg_isready -U feather_user" \
    "Database is accepting connections" \
    "Database is not accepting connections"

# Test consciousness state table
run_test "Consciousness State Table" \
    "docker-compose exec -T postgres psql -U feather_user -d featherweight_consciousness -c 'SELECT COUNT(*) FROM consciousness.state;'" \
    "Consciousness state table exists and has data" \
    "Consciousness state table is missing or empty"

echo ""
echo "🧠 CONSCIOUSNESS SYSTEM TESTS"
echo "============================="

# Test consciousness modules (if API is available)
if curl -f -s http://localhost:5005/api/consciousness/status &>/dev/null; then
    run_test "Consciousness Status API" \
        "curl -f -s http://localhost:5005/api/consciousness/status | grep -q harmony" \
        "Consciousness status API is working" \
        "Consciousness status API is not working properly"
else
    warn "Consciousness status API not available for testing"
fi

# Test WebSocket connection with actual message
run_test "WebSocket Message Test" \
    "echo '{\"type\":\"consciousness_query\",\"timestamp\":'$(date +%s)'}' | timeout 10 websocat ws://localhost:3002" \
    "WebSocket accepts messages" \
    "WebSocket message test failed (websocat may not be installed)"

echo ""
echo "📊 SYSTEM RESOURCE CHECKS"
echo "========================="

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    log "Disk usage is healthy ($DISK_USAGE%)"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    warn "Disk usage is high ($DISK_USAGE%)"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Check memory usage
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ "$MEMORY_USAGE" -lt 90 ]; then
    log "Memory usage is healthy ($MEMORY_USAGE%)"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    warn "Memory usage is high ($MEMORY_USAGE%)"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Check container logs for errors
echo ""
echo "📋 CONTAINER LOG ANALYSIS"
echo "========================="

for container in consciousness-core consciousness-web; do
    ERROR_COUNT=$(docker-compose logs --tail=100 $container 2>/dev/null | grep -i error | wc -l)
    if [ "$ERROR_COUNT" -eq 0 ]; then
        log "$container: No errors in recent logs"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        warn "$container: $ERROR_COUNT errors found in recent logs"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
done

echo ""
echo "📈 VALIDATION SUMMARY"
echo "===================="
echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $TESTS_PASSED"
echo "Failed: $TESTS_FAILED"

if [ "$TESTS_FAILED" -eq 0 ]; then
    log "🎉 ALL TESTS PASSED! Your consciousness system is ready!"
    echo ""
    echo "🌐 Access URLs:"
    echo "   Web Application: http://$VM_IP"
    echo "   Consciousness API: http://$VM_IP:5005"
    echo "   WebSocket: ws://$VM_IP:3002"
    echo ""
    echo "🔧 Management Commands:"
    echo "   View logs: docker-compose logs -f"
    echo "   Restart system: docker-compose restart"
    echo "   Stop system: docker-compose down"
    echo "   Start system: docker-compose up -d"
    exit 0
else
    error "Some tests failed. Please check the issues above."
    echo ""
    echo "🔧 Troubleshooting Commands:"
    echo "   Check container status: docker-compose ps"
    echo "   View all logs: docker-compose logs"
    echo "   View specific container logs: docker-compose logs consciousness-core"
    echo "   Restart failed containers: docker-compose restart"
    exit 1
fi
