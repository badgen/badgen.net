FROM node:22-alpine AS build
WORKDIR /src
COPY . .
RUN npm ci && npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /src/.next ./.next
COPY --from=build /src/public ./public
COPY --from=build /src/package* ./
RUN npm ci --only=production

EXPOSE 3000
CMD ["npm", "start"]
