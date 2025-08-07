# Multi-stage build for optimized production image
FROM node:18-alpine AS builder

# Install security updates
RUN apk update && apk upgrade

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Install security updates and required packages
RUN apk update && apk upgrade && \
    apk add --no-cache curl tini && \
    rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
# Install any missing prod dependencies in runtime (dotenv, generative ai)
RUN npm install --omit=dev @google/generative-ai@^0.5.0 dotenv@^16.4.5
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy canonical sigil files only (A14)
COPY --from=builder --chown=nextjs:nodejs /app/server/sigil-identity.cjs ./server/sigil-identity.cjs
COPY --from=builder --chown=nextjs:nodejs /app/server/sigil-api.cjs ./server/sigil-api.cjs
COPY --from=builder --chown=nextjs:nodejs /app/server/consciousness/sigil-based-code-authenticator.cjs ./server/consciousness/sigil-based-code-authenticator.cjs
COPY --from=builder --chown=nextjs:nodejs /app/server/consciousness/persistence/LevelDBSigilAdapter.cjs ./server/consciousness/persistence/LevelDBSigilAdapter.cjs
COPY --from=builder --chown=nextjs:nodejs /app/server/consciousness/core/security/eventSign.cjs ./server/consciousness/core/security/eventSign.cjs
COPY --from=builder --chown=nextjs:nodejs /app/server/metrics/sigilMetrics.cjs ./server/metrics/sigilMetrics.cjs

# Copy remaining consciousness files
COPY --from=builder --chown=nextjs:nodejs /app/server/consciousness ./server/consciousness

# Switch to non-root user
USER nextjs

# Set environment variables for persistence
ENV SIGIL_DB_PATH=/var/lib/sigil-leveldb
ENV SIGIL_PORT=3000

# Create volume directories with proper ownership
RUN mkdir -p /var/lib/sigil-leveldb && \
    chown -R nextjs:nodejs /var/lib/sigil-leveldb

# Expose ports
EXPOSE 3000 5000 8080

# Health check for sigil-dna service
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${SIGIL_PORT:-3000}/healthz || exit 1

# Volume for persistent data
VOLUME ["/var/lib/sigil-leveldb"]

# Use tini as entrypoint for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Provide Gemini 2.5 API key (can be overridden at runtime)
ENV GEMINI_API_KEY="AIzaSyBAInbflgaEsU6r6STMnQ_WBd6lH4tJU54"

# Start the self-coding agent in background, then main server
CMD ["sh", "-c", "node server/consciousness/core/AutonomousCodingAgentBootstrap.cjs & node dist/index.js"]
