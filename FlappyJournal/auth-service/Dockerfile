# Featherweight Auth Service Dockerfile
# Builds and runs the hardened Express-based auth service (TypeScript)

FROM node:20-slim AS base

# Install build dependencies for native modules like argon2
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    libargon2-dev \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copy full source (including package.json) and install all dependencies in one step
COPY . .
RUN npm install --legacy-peer-deps --loglevel=error \
    helmet@7.1.2 cookie-parser@1.4.6 argon2@0.31.2 \
    swagger-jsdoc@6.2.8 swagger-ui-express@4.7.2

# Copy source code
COPY . .

# Ensure Swagger dependencies present (workaround npm resolution issues)
RUN npm install --legacy-peer-deps swagger-jsdoc@6.2.8 swagger-ui-express@4.7.2

# Ensure keys directory exists (expect keys already in repo)
RUN if [ ! -d "keys" ]; then echo "❌ 'keys' directory with JWT keys missing" && exit 1; fi

# Expose auth service port
EXPOSE 4001

# Production environment vars (can be overridden in compose)
ENV NODE_ENV=production \
    AUTH_PORT=4001

# Run the TypeScript entry with tsx loader
CMD ["node", "--import", "tsx", "server/standalone-auth-server.ts"]
