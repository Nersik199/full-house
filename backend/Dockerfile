FROM node:24-slim AS base

FROM base AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY .. .


RUN yarn build

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=nodejs:nodejs package.json yarn.lock ./

RUN yarn install --production

COPY --chown=nodejs:nodejs --from=builder /app/dist ./dist

CMD ["node", "dist/main"]