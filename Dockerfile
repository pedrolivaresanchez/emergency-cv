FROM node:18-alpine
ARG CACHE_BURST=1

ENV NODE_ENV="production" \
    NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY ./package.json ./yarn.lock ./

RUN yarn --frozen-lockfile --production=false

COPY ./ ./

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
