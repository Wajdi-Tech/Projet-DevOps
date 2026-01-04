# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production --base-href /admin/

# Serve stage
FROM nginx:alpine

# Copy built Angular files to Nginx directory
# Note: Path depends on angular.json, usually dist/<project-name>/browser or dist/<project-name>
# Based on package.json, project name is "admin-dashboardv1"
# Copy built Angular files to Nginx directory (inside /admin folder to match base-href)
COPY --from=builder /app/dist/admin-dashboardv1/browser /usr/share/nginx/html/admin

# Copy custom nginx config if we had one (using default for now, but enabling SPA routing fix)
# We will create a simple nginx config to handle SPA routing (Redirect to index.html)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location /admin/ { \
    alias /usr/share/nginx/html/admin/; \
    try_files $uri $uri/ /admin/index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
