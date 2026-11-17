# ==============================================================================
# Multi-Stage Dockerfile for React Frontend PWA
# Thermal Power Plant Store & Spares Management System (SMS)
# Target Platform: Google Cloud Run / Nginx Alpine Reverse Proxy
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Static Assets with Node.js 20
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications first for Docker cache optimization
COPY package*.json ./
RUN npm ci || npm install

# Copy source code and build configurations
COPY . .

# Build production bundle with Vite
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Serve Bundle with Lightweight Nginx Alpine & Cloud Run Port Binding
# ------------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runner

# Install envsubst for dynamic environment variable injection at runtime
RUN apk add --no-cache gettext

# Remove default Nginx welcome site
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copy static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx template and dynamic entrypoint script
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Cloud Run binds to $PORT (default 8080)
ENV PORT=8080 \
    BACKEND_URL=http://sms-backend:8080/api/ \
    AI_SERVICE_URL=http://sms-ai-service:8000/api/v1/ai/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/healthz || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
