FROM node:20-slim

WORKDIR /opt/consciousness

# Copy manifests first for cached install layer
COPY package*.json ./
COPY tsconfig.json ./

# Production deps only
RUN npm ci --omit=dev && npm cache clean --force;

# Copy source
COPY server ./server/
COPY shared ./shared/
COPY public ./public/
COPY *.js ./

EXPOSE 50051 4003 3002 5005

ENV NODE_ENV=production

WORKDIR /opt/consciousness/server

CMD ["node", "consciousness-conversations.js"]