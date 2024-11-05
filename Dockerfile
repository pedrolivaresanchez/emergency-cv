FROM node:18-alpine
ARG CACHE_BURST=1

# Add build arguments for Supabase
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Set environment variables
ENV NODE_ENV="production" \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

WORKDIR /app

COPY ./package.json ./yarn.lock ./

RUN yarn --frozen-lockfile --production=false

COPY ./ ./

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
