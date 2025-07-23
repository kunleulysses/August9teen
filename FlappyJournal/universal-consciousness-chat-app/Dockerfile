# Universal Consciousness Platform - Production Dockerfile
# Multi-stage build for optimized production deployment

# Stage 1: Build React Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm ci --only=production

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Node.js Backend
FROM node:18-alpine AS backend-builder

WORKDIR /app

# Copy backend package files
COPY package*.json ./
RUN npm ci --only=production

# Copy backend source
COPY server.js ./
COPY ../server/consciousness ./server/consciousness

# Stage 3: Production Runtime
FROM node:18-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    dumb-init \
    curl \
    && rm -rf /var/cache/apk/*

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S consciousness -u 1001

WORKDIR /app

# Copy backend dependencies and source
COPY --from=backend-builder --chown=consciousness:nodejs /app/node_modules ./node_modules
COPY --from=backend-builder --chown=consciousness:nodejs /app/server.js ./
COPY --from=backend-builder --chown=consciousness:nodejs /app/server ./server

# Copy built frontend
COPY --from=frontend-builder --chown=consciousness:nodejs /app/frontend/build ./frontend/build

# Create logs directory
RUN mkdir -p logs && chown consciousness:nodejs logs

# Switch to non-root user
USER consciousness

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/api/consciousness/status || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]

# Labels for metadata
LABEL org.opencontainers.image.title="Universal Consciousness Platform"
LABEL org.opencontainers.image.description="Complete $27B+ consciousness technology stack with chat interface"
LABEL org.opencontainers.image.version="2.0"
LABEL org.opencontainers.image.vendor="Phi Consciousness Technology"
LABEL org.opencontainers.image.url="https://app.featherworld.world/chat"
