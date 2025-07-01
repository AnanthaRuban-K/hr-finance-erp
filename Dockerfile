FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY apps/backend/package*.json ./apps/backend/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build both apps
RUN npm run build

# Expose both ports
EXPOSE 3000 3001

# Start both services (you'll need a process manager)
CMD ["npm", "run", "start:production"]