# Build stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o product-catalogue .

# Production stage
FROM alpine:latest

WORKDIR /app

# Install necessary packages (if any needed for runtime)
RUN apk --no-cache add ca-certificates

COPY --from=builder /app/product-catalogue .
COPY --from=builder /app/config ./config

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 4000

CMD ["./product-catalogue"]
