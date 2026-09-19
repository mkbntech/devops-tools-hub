FROM node:22-bookworm-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    build-essential \
 && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY server.js ./
COPY src/ ./src/
COPY public/ ./public/
COPY views/ ./views/
COPY scripts/ ./scripts/
RUN mkdir -p data && chown -R node:node /app
USER node
EXPOSE 4000
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s \
  CMD node -e "require('http').get('http://localhost:4000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"
CMD ["node", "server.js"]
