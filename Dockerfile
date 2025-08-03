# Stage 1: Builder
FROM node:24-alpine AS builder

WORKDIR /opt/app

# Install build tools & dependencies
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci

# Copy source code
COPY server ./server/
COPY shared ./shared/
COPY public ./public/
COPY *.js ./

# Build (assumes TypeScript/JS project)
RUN npm run build

# Prune dev dependencies
RUN npm prune --production && npm cache clean --force

# Stage 2: Production
FROM node:24-alpine AS prod

# Install minimal runtime dependencies
RUN apk add --no-cache ca-certificates curl

WORKDIR /opt/app

# Create non-root user nodeapp (uid 10001)
RUN adduser -D -u 10001 nodeapp

# Copy only necessary files from builder
COPY --from=builder /opt/app/node_modules ./node_modules
COPY --from=builder /opt/app/server ./server
COPY --from=builder /opt/app/shared ./shared
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/*.js ./

# Set ownership to nodeapp
RUN chown -R nodeapp:nodeapp /opt/app

# Switch to non-root user
USER nodeapp

# Expose required ports
EXPOSE 50051 4003 3002 5005

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5005/health || exit 1

# Environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Start the server (ensure this path is correct based on build output location)
CMD ["node", "server/consciousness-conversations.js"]