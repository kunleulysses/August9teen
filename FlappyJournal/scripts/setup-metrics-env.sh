#!/bin/bash

# Generate a secure random JWT secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Generate a secure random password for Prometheus
PROMETHEUS_AUTH_TOKEN="prom_$(openssl rand -hex 16)"

# Generate secure credentials for Prometheus and Grafana
PROMETHEUS_USER="prometheus"
PROMETHEUS_PASSWORD="$(openssl rand -base64 16)"
GRAFANA_USER="admin"
GRAFANA_PASSWORD="$(openssl rand -base64 16)"

# Rate limiting configuration
WS_RATE_LIMIT=100
WS_RATE_WINDOW=10
ALLOW_ANONYMOUS_WS=false

# Create .env file
cat > .env.metrics << EOL
# Authentication
JWT_SECRET=${JWT_SECRET}

# Rate Limiting
WS_RATE_LIMIT=${WS_RATE_LIMIT}
WS_RATE_WINDOW=${WS_RATE_WINDOW}
ALLOW_ANONYMOUS_WS=${ALLOW_ANONYMOUS_WS}

# Prometheus Configuration
PROMETHEUS_AUTH_TOKEN=${PROMETHEUS_AUTH_TOKEN}
PROMETHEUS_USER=${PROMETHEUS_USER}
PROMETHEUS_PASSWORD='${PROMETHEUS_PASSWORD}'

# Grafana Configuration
GRAFANA_USER=${GRAFANA_USER}
GRAFANA_PASSWORD='${GRAFANA_PASSWORD}'
EOL

# Set file permissions
chmod 600 .env.metrics

# Output instructions
echo "✅ Generated .env.metrics file with secure credentials"
echo ""
echo "🔐 Authentication & Metrics Setup Complete"
echo "====================================="
echo "JWT Secret: ${JWT_SECRET:0:8}... (truncated)"
echo "Prometheus Auth Token: ${PROMETHEUS_AUTH_TOKEN:0:8}... (truncated)"
echo "Prometheus User: ${PROMETHEUS_USER}"
echo "Prometheus Password: ${PROMETHEUS_PASSWORD}"
echo "Grafana User: ${GRAFANA_USER}"
echo "Grafana Password: ${GRAFANA_PASSWORD}"
echo ""
echo "📊 To start the metrics stack:"
echo "   docker-compose -f docker-compose.metrics.yml up -d"
echo ""
echo "🌐 Access the dashboards:"
echo "   - Grafana: http://localhost:3000"
echo "   - Prometheus: http://localhost:9090"
echo "   - WebSocket Server: ws://localhost:3001"
echo "   - Consciousness Core Metrics: http://localhost:3002/metrics"
echo ""
echo "🔒 For production, please:"
echo "   1. Store .env.metrics securely"
echo "   2. Rotate all secrets before production use"
echo "   3. Set ALLOW_ANONYMOUS_WS=false in production"

# Make the script executable
chmod +x scripts/setup-metrics-env.sh
