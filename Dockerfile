# Multi-stage build for smaller final image

# 🟢 Base image for dependencies
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 🟡 Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build:prod

# 🟣 Final production image
FROM node:18-alpine AS production
WORKDIR /app

# Copy only what you need
COPY --from=build /app/dist ./dist
COPY --from=build /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=build /app/package.json ./
COPY --from=base /app/node_modules ./node_modules

# Expose both frontend (Next.js) and backend ports
EXPOSE 3000 3001

# Start both processes
CMD ["sh", "-c", "npm run start:backend & cd apps/frontend && npm start"]
