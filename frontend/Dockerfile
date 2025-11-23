# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create non-root user
RUN addgroup -g 1001 -S nginxgroup
RUN adduser -S nginxuser -u 1001

# Change ownership
RUN chown -R nginxuser:nginxgroup /usr/share/nginx/html
RUN chown -R nginxuser:nginxgroup /var/cache/nginx
RUN chown -R nginxuser:nginxgroup /var/log/nginx
RUN chown -R nginxuser:nginxgroup /etc/nginx/conf.d

# Create nginx pid directory and set permissions
RUN touch /var/run/nginx.pid
RUN chown -R nginxuser:nginxgroup /var/run/nginx.pid

# Switch to non-root user
USER nginxuser

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
