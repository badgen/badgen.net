FROM node:24-alpine AS build
WORKDIR /src
COPY . .
RUN npm ci && BUILD_STANDALONE=1 npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
COPY --from=build /src/.next/standalone ./
COPY --from=build /src/.next/static ./.next/static
COPY --from=build /src/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
