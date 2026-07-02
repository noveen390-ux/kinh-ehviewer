FROM --platform=$BUILDPLATFORM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine
WORKDIR /app
EXPOSE 8080
COPY --from=builder /app .
RUN chmod +x scripts/build-in-docker.sh
USER node

CMD ["npm", "start"]
