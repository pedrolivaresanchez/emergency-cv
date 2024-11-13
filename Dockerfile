# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY

# Build-time environment variables
ENV NEXT_TELEMETRY_DISABLED=1 \
    SUPABASE_URL=$SUPABASE_URL \
    SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN rm -rf .next

RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Run-time environment variables
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    SUPABASE_URL=$SUPABASE_URL \
    SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
