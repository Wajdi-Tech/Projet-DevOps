# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

# Default port for user-authentication
EXPOSE 5000

# Use direct node command instead of npm scripts if start script is missing or use default
CMD ["node", "server.js"]
