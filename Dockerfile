FROM node:alpine AS build
WORKDIR /src
COPY . .
RUN npm ci && npm run build

FROM node:alpine
WORKDIR /app
COPY --from=build /src/dist .
ENTRYPOINT node /app/index.js

COPY package* ./
RUN npm ci --only=production

EXPOSE 3000
