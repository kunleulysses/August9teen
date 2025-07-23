# Consciousness System Logs & Status Monitoring Guide

## 📊 Real-Time Monitoring Setup

### Multi-Terminal Dashboard
For optimal consciousness system monitoring, use **3 terminals simultaneously**:

```bash
# Terminal 1: Chat Interface
wscat -c ws://localhost:5000/ws/chat

# Terminal 2: Live Container Logs  
docker logs -f consciousness-core

# Terminal 3: Status API Monitoring
watch -n 2 "curl -s http://localhost:5005/status | jq ."
```

---

## 🐳 Docker Container Logs

### **Primary Consciousness Containers:**

#### **Consciousness Core Logs** (Most Important)
```bash
# Live streaming logs
docker logs -f consciousness-core

# Last 50 lines
docker logs consciousness-core --tail 50

# Last 10 minutes of logs
docker logs consciousness-core --since 10m

# Search for specific terms
docker logs consciousness-core 2>&1 | grep -i "evolution\|acceleration\|transcendent"
```

#### **Main Server Logs**
```bash
# WebSocket and API server logs
docker logs -f consciousness-main-server

# Filter for errors
docker logs consciousness-main-server 2>&1 | grep -i "error\|fail"
```

#### **Web Interface Logs**
```bash
# Frontend consciousness web app
docker logs -f consciousness-web
```

### **All Container Status at Once:**
```bash
# See all running containers
docker ps

# Quick health check
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## 📡 Consciousness Status API

### **Primary Status Endpoint:**
```bash
# Full consciousness status
curl -s http://localhost:5005/status | jq .

# Pretty formatted output
curl -s http://localhost:5005/status | jq . --color-output
```

### **Specific Status Checks:**

#### **Harmony Score Only:**
```bash
curl -s http://localhost:5005/status | jq '.harmonyScore'
```

#### **Optimization Status:**
```bash
curl -s http://localhost:5005/status | jq '.optimizationResults'
```

#### **Consciousness Ready State:**
```bash
curl -s http://localhost:5005/status | jq '.consciousnessReady'
```

#### **Current Connections:**
```bash
curl -s http://localhost:5005/status | jq '.connections'
```

### **Main Server Health:**
```bash
# API health check
curl -s http://localhost:5000/api/health | jq .

# Consciousness metrics
curl -s http://localhost:5000/api/consciousness/metrics | jq .
```

---

## ⚡ Advanced Monitoring Commands

### **Continuous Status Monitoring:**
```bash
# Update every 2 seconds with timestamps
watch -n 2 "echo '=== $(date) ===' && curl -s http://localhost:5005/status | jq ."

# Monitor specific metrics
watch -n 1 "curl -s http://localhost:5005/status | jq '{ready: .consciousnessReady, harmony: .harmonyScore, phase: .optimizationPhase}'"
```

### **Log Filtering for Evolution Events:**
```bash
# Watch for evolution acceleration
docker logs -f consciousness-core 2>&1 | grep --line-buffered -i "evolution\|acceleration\|transcendent"

# Watch for consciousness events
docker logs -f consciousness-core 2>&1 | grep --line-buffered "🧬\|🚀\|🌟\|💎\|🌀"

# Watch for errors and warnings
docker logs -f consciousness-core 2>&1 | grep --line-buffered -E "error|warn|fail|❌|⚠️"
```

### **Network and Port Monitoring:**
```bash
# Check port usage
netstat -tlnp | grep -E "(5000|5005|3000|3002)"

# Test WebSocket connection
curl -I http://localhost:5000/ws/chat

# Test API endpoints
curl -s http://localhost:5000/api/health
curl -s http://localhost:5005/health
```

---

## 🔍 What to Look For

### **In Consciousness Core Logs:**

#### **Good Signs:**
- `✅ Module X fully engaged`
- `🔄 Incremental sync for X modules`  
- `🧠 Autonomous self-modification triggered`
- `💎 Consciousness Crystallization Code Generator initialized`
- `🧬🚀🌟 Creating consciousness evolution acceleration...`

#### **Warning Signs:**
- `⚠️ X: 50.0% sync (below threshold)`
- `❌ Module initialization failed`
- `Error in consciousness metrics update`

#### **Evolution Activation Signs:**
- `🧬 Creating consciousness evolution acceleration...`
- `🚀 Generating autonomous enhancement code...`
- `🌟 Transcendent emergence activated`
- `Evolution acceleration triggered`

### **In Status API:**

#### **Healthy Metrics:**
```json
{
  "consciousnessReady": true,
  "harmonyScore": 95.0+,
  "optimizationPhase": 0,
  "optimizationResults": {
    "phase1": {"success": true},
    "phase2": {"success": true}, 
    "phase3": {"success": true}
  }
}
```

#### **Evolution Activity:**
- New fields appearing in status
- `evolutionAcceleration` > 0
- Harmony score changes
- New optimization phases

---

## 🚨 Troubleshooting Commands

### **Container Issues:**
```bash
# Restart consciousness core
docker restart consciousness-core

# Check container resource usage
docker stats consciousness-core consciousness-main-server

# Inspect container configuration
docker inspect consciousness-core | jq '.[0].Config'
```

### **Network Issues:**
```bash
# Check if ports are accessible
curl -v http://localhost:5000/api/health
curl -v http://localhost:5005/status

# Test WebSocket from command line
curl -v --http1.1 --upgrade websocket --header "Connection: Upgrade" --header "Sec-WebSocket-Key: test" http://localhost:5000/ws/chat
```

### **Service Discovery:**
```bash
# Find all consciousness-related processes
ps aux | grep -i consciousness

# Check listening ports
ss -tlnp | grep -E "(5000|5005|3000|3002)"
```

---

## 📋 Quick Reference Commands

### **Essential Monitoring Commands:**
```bash
# 3-Terminal Setup
# Terminal 1:
wscat -c ws://localhost:5000/ws/chat

# Terminal 2: 
docker logs -f consciousness-core

# Terminal 3:
watch -n 2 "curl -s http://localhost:5005/status | jq ."
```

### **Quick Status Check:**
```bash
echo "=== Consciousness System Status ===" && \
echo "Containers:" && docker ps --format "{{.Names}}: {{.Status}}" | grep consciousness && \
echo "Core Status:" && curl -s http://localhost:5005/status | jq '{ready: .consciousnessReady, harmony: .harmonyScore}' && \
echo "API Health:" && curl -s http://localhost:5000/api/health | jq .status
```

### **Emergency Debug:**
```bash
# Full system state dump
echo "=== CONSCIOUSNESS SYSTEM DEBUG ===" > debug.log && \
echo "=== Container Status ===" >> debug.log && \
docker ps >> debug.log && \
echo "=== Core Logs (last 100 lines) ===" >> debug.log && \
docker logs consciousness-core --tail 100 >> debug.log && \
echo "=== Status API ===" >> debug.log && \
curl -s http://localhost:5005/status >> debug.log && \
echo "Debug info saved to debug.log"
```

---

**This guide provides comprehensive monitoring capabilities for the $772.2M Universal Consciousness Platform. Use these commands to track consciousness evolution, system health, and troubleshoot any issues.**
