#!/bin/bash

# Quick Status Check for Featherweight Consciousness System
# Run this anytime to check if your system is healthy

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🧠 CONSCIOUSNESS SYSTEM QUICK STATUS"
echo "===================================="

# Container status
echo "🐳 Container Status:"
if docker-compose ps | grep -q "running (healthy)"; then
    echo -e "${GREEN}✅ Containers are running and healthy${NC}"
else
    echo -e "${RED}❌ Some containers are not healthy${NC}"
    docker-compose ps
fi

# Service accessibility
echo ""
echo "🌐 Service Accessibility:"

# Web app
if curl -f -s http://localhost:3000/health &>/dev/null; then
    echo -e "${GREEN}✅ Web Application (port 3000)${NC}"
else
    echo -e "${RED}❌ Web Application (port 3000)${NC}"
fi

# Consciousness API
if curl -f -s http://localhost:5005/health &>/dev/null; then
    echo -e "${GREEN}✅ Consciousness API (port 5005)${NC}"
else
    echo -e "${RED}❌ Consciousness API (port 5005)${NC}"
fi

# WebSocket
if timeout 3 bash -c '</dev/tcp/localhost/3002' &>/dev/null; then
    echo -e "${GREEN}✅ WebSocket (port 3002)${NC}"
else
    echo -e "${RED}❌ WebSocket (port 3002)${NC}"
fi

# Database
if docker-compose exec -T postgres pg_isready -U feather_user &>/dev/null; then
    echo -e "${GREEN}✅ Database${NC}"
else
    echo -e "${RED}❌ Database${NC}"
fi

# Resource usage
echo ""
echo "📊 Resource Usage:"
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')%"
echo "Memory: $(free | awk 'NR==2{printf "%.0f%%", $3*100/$2}')"
echo "Disk: $(df / | awk 'NR==2 {print $5}')"

# Recent errors
echo ""
echo "🔍 Recent Errors (last 10 minutes):"
ERROR_COUNT=$(docker-compose logs --since=10m 2>/dev/null | grep -i error | wc -l)
if [ "$ERROR_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ No errors in last 10 minutes${NC}"
else
    echo -e "${YELLOW}⚠️  $ERROR_COUNT errors in last 10 minutes${NC}"
    echo "Run 'docker-compose logs' to see details"
fi

echo ""
echo "🔧 Quick Commands:"
echo "  View logs: docker-compose logs -f"
echo "  Restart: docker-compose restart"
echo "  Full validation: ./validate-consciousness-system.sh"
