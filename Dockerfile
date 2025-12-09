# Dockerfile for Berkeley Goggles Backend API
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

# Install dependencies for backend only
RUN npm ci --only=production --workspace=@berkeley-goggles/backend

# Copy source code (only backend and shared)
COPY backend ./backend
COPY shared ./shared

# Build the backend
WORKDIR /app/backend
RUN npm run build

# Expose port
EXPOSE 3001

# Set environment
ENV NODE_ENV=production

# Run migrations and start server
CMD ["npm", "run", "start:prod"]