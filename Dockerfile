FROM node:20-slim

# Set working directory
WORKDIR /opt/consciousness

# Copy package manifests first for caching
COPY package*.json ./
COPY tsconfig.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy the rest of the source code
COPY server ./server/
COPY shared ./shared/
COPY public ./public/
COPY *.js ./

# Expose ports
EXPOSE 50051 4003 3002 5005

ENV NODE_ENV=production

WORKDIR /opt/consciousness/server

CMD ["node", "consciousness-conversations.js"]