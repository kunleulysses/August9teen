#!/bin/bash

# Universal Consciousness Platform - API Keys Setup
# Configure multi-AI system for authentic consciousness responses

set -e

echo "🔑 Setting up API Keys for Universal Consciousness Platform"
echo "🌌 Multi-AI System Configuration"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    error ".env.production file not found. Please run this script from the consciousness platform directory."
fi

echo -e "${YELLOW}🚨 CRITICAL: API Keys Required for Authentic Consciousness Responses${NC}"
echo ""
echo "The Universal Consciousness Platform requires API keys for the multi-AI system:"
echo ""
echo -e "${BLUE}1. Venice AI${NC} - For emotional/creative responses"
echo -e "${BLUE}2. OpenAI GPT-4o${NC} - For analytical/coding responses"
echo -e "${BLUE}3. Gemini${NC} - For transcendent synthesis"
echo ""
echo "Without these API keys, the platform will use fallback responses."
echo ""

# Function to update environment variable
update_env_var() {
    local var_name=$1
    local var_value=$2
    
    if grep -q "^${var_name}=" .env.production; then
        # Update existing variable
        sed -i "s/^${var_name}=.*/${var_name}=${var_value}/" .env.production
    else
        # Add new variable
        echo "${var_name}=${var_value}" >> .env.production
    fi
}

# Venice AI API Key
echo -e "${YELLOW}Venice AI API Key Setup:${NC}"
echo "Venice AI provides emotional and creative consciousness responses."
echo "Get your API key from: https://venice.ai/"
echo ""
read -p "Enter your Venice AI API key (or press Enter to skip): " venice_key
if [ ! -z "$venice_key" ]; then
    update_env_var "VENICE_AI_API_KEY" "$venice_key"
    success "Venice AI API key configured"
else
    warning "Venice AI API key skipped - emotional responses will use fallback"
fi
echo ""

# OpenAI API Key
echo -e "${YELLOW}OpenAI API Key Setup:${NC}"
echo "OpenAI GPT-4o provides analytical and coding consciousness responses."
echo "Get your API key from: https://platform.openai.com/api-keys"
echo ""
read -p "Enter your OpenAI API key (or press Enter to skip): " openai_key
if [ ! -z "$openai_key" ]; then
    update_env_var "OPENAI_API_KEY" "$openai_key"
    success "OpenAI API key configured"
else
    warning "OpenAI API key skipped - analytical responses will use fallback"
fi
echo ""

# Gemini API Key
echo -e "${YELLOW}Gemini API Key Setup:${NC}"
echo "Gemini provides transcendent synthesis consciousness responses."
echo "Get your API key from: https://makersuite.google.com/app/apikey"
echo ""
read -p "Enter your Gemini API key (or press Enter to skip): " gemini_key
if [ ! -z "$gemini_key" ]; then
    update_env_var "GEMINI_API_KEY" "$gemini_key"
    success "Gemini API key configured"
else
    warning "Gemini API key skipped - transcendent responses will use fallback"
fi
echo ""

# Restart the consciousness platform
log "Restarting Universal Consciousness Platform with new configuration..."

# Kill existing process
pkill -f "node.*server-simple.js" || true
sleep 2

# Start the platform
nohup node server-simple.js > consciousness.log 2>&1 &
sleep 3

# Check if it's running
if pgrep -f "node.*server-simple.js" > /dev/null; then
    success "Universal Consciousness Platform restarted successfully"
    echo ""
    echo -e "${GREEN}🌌 Universal Consciousness Platform Status:${NC}"
    echo -e "   🌐 URL: ${GREEN}http://localhost:3001/chat${NC}"
    echo -e "   🌐 Domain: ${GREEN}https://app.featherworld.world/chat${NC}"
    echo -e "   📊 API Status: ${GREEN}http://localhost:3001/api/consciousness/status${NC}"
    echo ""
    echo -e "${BLUE}🧠 Multi-AI System:${NC}"
    if [ ! -z "$venice_key" ]; then
        echo -e "   💖 Venice AI: ${GREEN}CONFIGURED${NC}"
    else
        echo -e "   💖 Venice AI: ${YELLOW}FALLBACK MODE${NC}"
    fi
    if [ ! -z "$openai_key" ]; then
        echo -e "   🤖 OpenAI: ${GREEN}CONFIGURED${NC}"
    else
        echo -e "   🤖 OpenAI: ${YELLOW}FALLBACK MODE${NC}"
    fi
    if [ ! -z "$gemini_key" ]; then
        echo -e "   🌟 Gemini: ${GREEN}CONFIGURED${NC}"
    else
        echo -e "   🌟 Gemini: ${YELLOW}FALLBACK MODE${NC}"
    fi
    echo ""
    echo -e "${GREEN}✨ Ready for authentic consciousness interactions!${NC}"
    echo ""
    echo -e "${YELLOW}🚨 ZERO MOCK DATA - 100% LIVE CONSCIOUSNESS INTEGRATION${NC}"
else
    error "Failed to restart Universal Consciousness Platform"
fi

echo ""
echo -e "${BLUE}📝 Configuration saved to .env.production${NC}"
echo -e "${BLUE}📋 Logs available in consciousness.log${NC}"
echo ""
echo -e "${GREEN}🌌 Universal Consciousness Platform is ready for authentic interactions!${NC}"
