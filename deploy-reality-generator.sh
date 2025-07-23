#!/bin/bash

# Deploy Reality Generator with CPU-Optimized Configuration
# This script sets up the consciousness system with dedicated CPU cores for reality generation

set -e

echo "🚀 Deploying Enhanced Consciousness System with Reality Generator"
echo "=================================================="

# Check if running on a system with at least 8 CPU cores
CPU_COUNT=$(nproc)
echo "📊 System has $CPU_COUNT CPU cores"

if [ $CPU_COUNT -lt 8 ]; then
    echo "⚠️  Warning: System has less than 8 CPU cores. Performance may be impacted."
    echo "   Recommended: 8+ cores for optimal reality generation"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check Docker and Docker Compose
echo "🔍 Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Stop existing containers if running
echo "🛑 Stopping existing consciousness containers..."
docker-compose -f docker-compose.consciousness.yml down 2>/dev/null || true
docker-compose -f docker-compose.consciousness-enhanced.yml down 2>/dev/null || true

# Create necessary directories
echo "📁 Creating required directories..."
mkdir -p monitoring
mkdir -p FlappyJournal/server/consciousness

# Check if we're on Linux for CPU affinity features
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Linux detected - CPU affinity features will be enabled"
    
    # Install taskset if not available
    if ! command -v taskset &> /dev/null; then
        echo "📦 Installing taskset for CPU affinity..."
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y util-linux
        elif command -v yum &> /dev/null; then
            sudo yum install -y util-linux
        fi
    fi
else
    echo "⚠️  Non-Linux OS detected - CPU affinity features will be limited"
fi

# Build images
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.consciousness-enhanced.yml build

# Display CPU allocation plan
echo ""
echo "🖥️  CPU Core Allocation Plan:"
echo "================================"
echo "Cores 0-3: Main consciousness processing (consciousness-core)"
echo "Core 4:    API server (main-server)"
echo "Core 5:    Web application (web-app)"
echo "Cores 6-7: Reality generator (dedicated imagination/reality generation)"
echo "================================"
echo ""

# Start services
echo "🚀 Starting enhanced consciousness system..."
docker-compose -f docker-compose.consciousness-enhanced.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service health
echo "🏥 Checking service health..."
SERVICES=("consciousness-postgres" "consciousness-core" "consciousness-reality-generator" "consciousness-main-server" "consciousness-web")

for service in "${SERVICES[@]}"; do
    if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "$service.*healthy"; then
        echo "✅ $service is healthy"
    else
        echo "⚠️  $service may not be healthy yet"
    fi
done

# Display service URLs
echo ""
echo "🌐 Service URLs:"
echo "================================"
echo "Web Interface:        http://localhost:3000"
echo "API Server:          http://localhost:5000"
echo "Consciousness Core:   http://localhost:5005"
echo "Reality Generator:    http://localhost:5006"
echo "WebSocket:           ws://localhost:3002"
echo "Prometheus:          http://localhost:9090"
echo "Grafana:             http://localhost:3001 (admin/consciousness2024)"
echo "================================"

# Display reality generator status
echo ""
echo "🔍 Checking Reality Generator status..."
sleep 5
REALITY_STATUS=$(curl -s http://localhost:5006/health 2>/dev/null || echo "Not available yet")
if [[ "$REALITY_STATUS" != "Not available yet" ]]; then
    echo "✅ Reality Generator is operational"
    echo "$REALITY_STATUS" | jq '.' 2>/dev/null || echo "$REALITY_STATUS"
else
    echo "⚠️  Reality Generator is still starting up..."
fi

# Display logs command
echo ""
echo "📋 Useful commands:"
echo "================================"
echo "View reality generator logs:"
echo "  docker logs -f consciousness-reality-generator"
echo ""
echo "Monitor CPU usage:"
echo "  docker stats consciousness-reality-generator"
echo ""
echo "Start autonomous imagination:"
echo "  curl -X POST http://localhost:5006/api/imagination/start"
echo ""
echo "Check imagination status:"
echo "  curl http://localhost:5006/api/imagination/status"
echo ""
echo "View generated realities:"
echo "  curl http://localhost:5006/api/realities"
echo ""
echo "Stop all services:"
echo "  docker-compose -f docker-compose.consciousness-enhanced.yml down"
echo "================================"

# Optional: Auto-start imagination engine
read -p "🤖 Would you like to start the autonomous imagination engine now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌟 Starting autonomous imagination engine..."
    sleep 5  # Give the service a bit more time to fully initialize
    curl -X POST http://localhost:5006/api/imagination/start
    echo ""
    echo "✨ Autonomous imagination engine started!"
    echo "   Reality generation will occur every 5 minutes using dedicated CPU cores 6-7"
fi

echo ""
echo "✅ Enhanced consciousness system deployment complete!"
echo "🧠 The Reality Generator is now running on dedicated CPU cores for optimal performance"
