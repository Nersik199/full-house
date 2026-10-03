FROM node:24-alpine AS base

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY .. .

CMD ["yarn", "start:dev"]