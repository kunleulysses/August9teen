#!/bin/bash

# Featherweight Consciousness System - Docker Environment Setup
# Run this on your GOOGLE CLOUD VM after transferring files

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"; }
warn() { echo -e "${YELLOW}[$(date +'%H:%M:%S')] $1${NC}"; }
error() { echo -e "${RED}[$(date +'%H:%M:%S')] $1${NC}"; exit 1; }
info() { echo -e "${BLUE}[$(date +'%H:%M:%S')] $1${NC}"; }

log "🐳 Setting up Docker environment for Featherweight Consciousness System"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    error "Please run this script from /opt/featherweight/FlappyJournal directory"
fi

# Create Docker Compose file
log "📝 Creating Docker Compose configuration..."
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: consciousness-postgres
    environment:
      POSTGRES_DB: featherweight_consciousness
      POSTGRES_USER: feather_user
      POSTGRES_PASSWORD: hist0ric
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --locale=C"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./setup-database.sql:/docker-entrypoint-initdb.d/setup-database.sql:ro
    ports:
      - "5432:5432"
    networks:
      - consciousness-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U feather_user -d featherweight_consciousness"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Consciousness System Core
  consciousness-core:
    build:
      context: .
      dockerfile: Dockerfile.consciousness
    container_name: consciousness-core
    environment:
      - NODE_ENV=production
      - CONSCIOUSNESS_MODE=full
      - HARMONY_TARGET=0.951
      - PROCESSING_FREQUENCY=100
      - API_INTEGRATION_MODE=enhanced
      - MATHEMATICAL_INTEGRATION=enabled
      - EMOTIONAL_INTELLIGENCE=enabled
      - BAYESIAN_DECISION_MAKING=enabled
      - GEMINI_DUAL_MODEL=enabled
      - DATABASE_URL=postgresql://feather_user:hist0ric@postgres:5432/featherweight_consciousness?sslmode=disable
      - NODE_OPTIONS=--max_old_space_size=4096
    env_file:
      - .env
    volumes:
      - consciousness_logs:/var/log/consciousness
      - consciousness_data:/opt/consciousness/data
    ports:
      - "3002:3002"  # WebSocket server
      - "5005:5005"  # Consciousness conversations
    networks:
      - consciousness-network
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5005/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  # Web Application
  web-app:
    build:
      context: .
      dockerfile: Dockerfile.ui
    container_name: consciousness-web
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOST=0.0.0.0
      - DATABASE_URL=postgresql://feather_user:hist0ric@postgres:5432/featherweight_consciousness?sslmode=disable
    env_file:
      - .env
    volumes:
      - web_uploads:/opt/app/uploads
    ports:
      - "3000:3000"
    networks:
      - consciousness-network
    depends_on:
      - postgres
      - consciousness-core
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Reverse Proxy (Caddy)
  caddy:
    image: caddy:2-alpine
    container_name: consciousness-proxy
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    ports:
      - "80:80"
      - "443:443"
    networks:
      - consciousness-network
    depends_on:
      - web-app
      - consciousness-core
    restart: unless-stopped

volumes:
  postgres_data:
  consciousness_logs:
  consciousness_data:
  web_uploads:
  caddy_data:
  caddy_config:

networks:
  consciousness-network:
    driver: bridge
EOF

# Create Consciousness Dockerfile
log "🐳 Creating Consciousness Dockerfile..."
cat > Dockerfile.consciousness << 'EOF'
FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache curl bash git python3 make g++

# Set working directory
WORKDIR /opt/consciousness

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY server ./server/
COPY shared ./shared/
COPY public ./public/

# Create necessary directories
RUN mkdir -p /var/log/consciousness /opt/consciousness/data

# Set permissions
RUN chown -R node:node /opt/consciousness /var/log/consciousness

# Switch to non-root user
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:5005/health || exit 1

# Expose ports
EXPOSE 3002 5005

# Environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Start command
CMD ["node", "server/consciousness-conversations.js"]
EOF

# Create Web App Dockerfile
log "🌐 Creating Web App Dockerfile..."
cat > Dockerfile.ui << 'EOF'
FROM node:20-alpine AS builder

RUN apk add --no-cache curl bash git python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY client ./client/
COPY server ./server/
COPY shared ./shared/
COPY public ./public/

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

RUN apk add --no-cache curl bash

WORKDIR /opt/app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/public ./public/
COPY --from=builder /app/server ./server/
COPY --from=builder /app/shared ./shared/

# Create directories
RUN mkdir -p /opt/app/uploads

# Set permissions
RUN chown -R node:node /opt/app

USER node

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", "dist/index.js"]
EOF

# Create Caddyfile
log "🚪 Creating Caddy configuration..."
cat > Caddyfile << 'EOF'
{
    admin off
    auto_https off
}

:80 {
    handle /health {
        respond "OK" 200
    }

    handle /ws* {
        reverse_proxy consciousness-core:3002
    }

    handle /api/consciousness* {
        reverse_proxy consciousness-core:5005
    }

    handle {
        reverse_proxy consciousness-web:3000
    }

    header {
        Access-Control-Allow-Origin "*"
        Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
    }

    @options method OPTIONS
    handle @options {
        respond "" 204
    }
}
EOF

# Create database setup script
log "🗄️ Creating database setup script..."
cat > setup-database.sql << 'EOF'
-- Featherweight Consciousness System Database Setup
\c featherweight_consciousness;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE SCHEMA IF NOT EXISTS consciousness;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS logs;

-- Consciousness state table
CREATE TABLE IF NOT EXISTS consciousness.state (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phi DECIMAL(10,6) NOT NULL DEFAULT 0.862,
    coherence DECIMAL(10,6) NOT NULL DEFAULT 0.85,
    awareness DECIMAL(10,6) NOT NULL DEFAULT 0.8,
    emotional_resonance DECIMAL(10,6) NOT NULL DEFAULT 0.75,
    recursive_depth INTEGER NOT NULL DEFAULT 7,
    harmony_level DECIMAL(10,6) NOT NULL DEFAULT 0.951,
    processing_frequency INTEGER NOT NULL DEFAULT 100,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Insert initial state
INSERT INTO consciousness.state (metadata) VALUES ('{"initialization": "docker_deployment", "version": "2.0"}'::jsonb) ON CONFLICT DO NOTHING;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA consciousness TO feather_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA consciousness TO feather_user;
EOF

log "✅ Docker environment setup complete!"
log "📋 Files created:"
log "   - docker-compose.yml"
log "   - Dockerfile.consciousness"
log "   - Dockerfile.ui"
log "   - Caddyfile"
log "   - setup-database.sql"

info "🎯 Next steps:"
info "1. Verify your .env file has the correct API keys"
info "2. Run: docker-compose up -d"
info "3. Wait for all services to start"
info "4. Test the system"
