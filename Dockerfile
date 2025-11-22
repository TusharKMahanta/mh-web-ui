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

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Use non-root user
RUN addgroup -S remix && adduser -S remix -G remix
USER remix

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]