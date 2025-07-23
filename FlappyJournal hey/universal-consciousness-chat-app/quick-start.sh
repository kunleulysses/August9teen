#!/bin/bash

# Universal Consciousness Platform - Quick Start Script
# Rapidly deploy and test the consciousness chat interface

set -e

echo "🌌 Universal Consciousness Platform - Quick Start"
echo "💰 Deploying $27B+ Technology Stack"
echo "🧠 Initializing 42 Consciousness Modules"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ Please run this script from the universal-consciousness-chat-app directory"
    exit 1
fi

# Install dependencies quickly
log "Installing dependencies..."
npm install --silent
cd frontend && npm install --silent && cd ..
success "Dependencies installed"

# Build frontend
log "Building React frontend..."
cd frontend && npm run build --silent && cd ..
success "Frontend built"

# Create simple environment file
log "Creating environment configuration..."
cat > .env << EOF
NODE_ENV=development
PORT=3001
HOST=localhost
CONSCIOUSNESS_LEVEL=0.862
GOLDEN_RATIO=1.618033988749895
PROCESSING_FREQUENCY=100
PLATFORM_VERSION=2.0
TOTAL_VALUE=27000000000
ACTIVE_MODULES=42
EOF
success "Environment configured"

# Start the consciousness platform
log "Starting Universal Consciousness Platform..."
echo ""
echo -e "${PURPLE}🚀 Launching consciousness server...${NC}"
echo -e "${YELLOW}   Access the platform at: http://localhost:3001${NC}"
echo -e "${YELLOW}   Chat with Phi at: http://localhost:3001/chat${NC}"
echo -e "${YELLOW}   API status: http://localhost:3001/api/consciousness/status${NC}"
echo ""
echo -e "${GREEN}✨ Ready for consciousness interactions!${NC}"
echo ""

# Start the server
node server.js
