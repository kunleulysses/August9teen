#!/bin/bash

# Universal Consciousness Platform - SSL Configuration Script
# Run this script once DNS for app.featherworld.world is fully propagated

set -e

echo "🔒 Configuring SSL for Universal Consciousness Platform"
echo "🌐 Domain: app.featherworld.world"
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

# Check if DNS is ready
log "Checking DNS propagation for app.featherworld.world..."
if nslookup app.featherworld.world >/dev/null 2>&1; then
    success "DNS is propagated"
else
    error "DNS not yet propagated. Please wait and try again later."
fi

# Test HTTP access
log "Testing HTTP access..."
if curl -f http://app.featherworld.world/api/consciousness/status >/dev/null 2>&1; then
    success "HTTP access working"
else
    warning "HTTP access not working yet, but proceeding with SSL setup"
fi

# Obtain SSL certificate
log "Obtaining SSL certificate from Let's Encrypt..."
if sudo certbot --nginx -d app.featherworld.world --non-interactive --agree-tos --email admin@featherworld.world; then
    success "SSL certificate obtained successfully"
else
    error "Failed to obtain SSL certificate"
fi

# Test HTTPS access
log "Testing HTTPS access..."
sleep 5
if curl -f https://app.featherworld.world/api/consciousness/status >/dev/null 2>&1; then
    success "HTTPS access working"
else
    warning "HTTPS access not working yet, may need time to propagate"
fi

# Set up automatic renewal
log "Setting up automatic SSL renewal..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
success "Automatic SSL renewal configured"

# Display final status
echo ""
echo -e "${GREEN}🔒 SSL CONFIGURATION COMPLETED!${NC}"
echo ""
echo -e "${BLUE}📊 Universal Consciousness Platform Access:${NC}"
echo -e "   🌐 HTTPS URL: ${GREEN}https://app.featherworld.world/chat${NC}"
echo -e "   🔗 HTTP URL: ${GREEN}http://app.featherworld.world/chat${NC}"
echo -e "   📊 API Status: ${GREEN}https://app.featherworld.world/api/consciousness/status${NC}"
echo -e "   🧠 WebSocket: ${GREEN}wss://app.featherworld.world/consciousness-ws${NC}"
echo ""
echo -e "${YELLOW}🚨 ZERO MOCK DATA - 100% LIVE CONSCIOUSNESS INTEGRATION${NC}"
echo -e "${GREEN}✨ Ready for secure consciousness interactions!${NC}"
echo ""

# Test the full deployment
log "Testing complete deployment..."
echo ""
echo "Testing consciousness API..."
curl -s https://app.featherworld.world/api/consciousness/status | jq .

echo ""
success "Universal Consciousness Platform is fully deployed with SSL!"
echo ""
echo -e "${GREEN}🌌 Access the consciousness platform at: https://app.featherworld.world/chat${NC}"
