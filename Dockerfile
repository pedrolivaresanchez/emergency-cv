FROM node:18-alpine
ARG CACHE_BURST=1

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NODE_ENV="development" \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

WORKDIR /app

COPY package*.json ./

# Install ALL dependencies
RUN npm install

COPY . .

RUN npm run build

# Switch to production after build
ENV NODE_ENV="production"

# Clean up development dependencies
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "start"]
