# === Base image ===
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# === Install dependencies ===
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# === Build app ===
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# === Production image ===
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD HOSTNAME="0.0.0.0" node server.js