# Multi-stage build for the NestJS API

# Stage 1: build (tsc -> dist)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: runtime (prod deps only, run compiled JS)
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

# TypeORM runs migrations on boot (migrationsRun: true), so no separate step.
EXPOSE 3000
CMD ["node", "dist/main.js"]
