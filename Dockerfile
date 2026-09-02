# ================================
# 1️⃣ Build Stage
# ================================

FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ================================
# 2️⃣ Production Stage
# ================================

FROM node:24-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
# Copy built Remix app from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
#COPY --from=builder /app/.cache ./.cache
#COPY --from=builder /app/server.js ./server.js  
# If you have a custom server

# --- Runtime configuration ------------------------------------------------
# Baked defaults. Override per environment at `docker run` time, e.g.:
#   docker run -p 3000:3000 \
#     -e APP_ENV=production \
#     -e SESSION_SECRET=$(openssl rand -hex 32) \
#     -e USE_MOCK_DATA=false -e API_BASE_URL=https://api.morhaat.com \
#     morhaat-web-ui:latest
# In staging/production the server refuses to boot without SESSION_SECRET
# (and API_BASE_URL when USE_MOCK_DATA=false). See docs/CONFIGURATION.md.
ENV NODE_ENV=production
ENV APP_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info
ENV USE_MOCK_DATA=true

# Use non-root user
RUN addgroup -S remix && adduser -S remix -G remix
USER remix

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]