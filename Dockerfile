FROM node:alpine AS build
WORKDIR /
COPY . .
RUN npm ci && npm run build

FROM node:alpine
WORKDIR /app
COPY --from=build /dist .
ENTRYPOINT node /app/index.js

COPY package* ./
RUN npm ci --only=production

EXPOSE 3000
