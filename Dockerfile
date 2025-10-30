# Use Node.js 18 on Debian slim for better Next.js compatibility
FROM node:18-bullseye-slim AS base
WORKDIR /app

# Install OS deps needed by Prisma/Next (openssl, ca-certs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Install dependencies separately for better caching
COPY package*.json ./
# Install with devDependencies for build (tailwind/postcss)
RUN (npm ci) || (npm install)

# Copy the rest of the app
COPY . .

# Generate Prisma client and build Next.js
ENV NODE_OPTIONS=--max-old-space-size=2048
RUN npx prisma generate && npm run build
# Remove devDependencies for runtime
RUN npm prune --omit=dev

# Runtime stage
FROM node:18-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built app and production node_modules
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package*.json ./
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public

# Expose port and start
ENV PORT=3000
EXPOSE 3000
CMD ["sh", "-c", "next start -p ${PORT} -H 0.0.0.0"]
