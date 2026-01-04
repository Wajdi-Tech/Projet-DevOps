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

# Default port for gestion-commandes
EXPOSE 5100

CMD ["node", "server.js"]
