FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache curl bash git python3 make g++

# Set working directory
WORKDIR /opt/consciousness

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies (production only)
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY server ./server/
COPY shared ./shared/
COPY public ./public/
COPY *.js ./

# Create necessary directories
RUN mkdir -p /var/log/consciousness /opt/consciousness/data

# Set permissions
RUN chown -R node:node /opt/consciousness /var/log/consciousness

# Expose ports
EXPOSE 50051 4003 3002 5005

# Environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Build step (generate dist bundle)
RUN npm run build

# Change working directory to server before start
WORKDIR /opt/consciousness/server

CMD ["node", "consciousness-conversations.js"]
