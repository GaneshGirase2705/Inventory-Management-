#!/bin/sh
set -e

# Default backend and AI proxy targets if not specified
export BACKEND_PROXY_URL="${BACKEND_URL:-http://sms-backend:8080/api/}"
export AI_SERVICE_PROXY_URL="${AI_SERVICE_URL:-http://sms-ai-service:8000/api/v1/ai/}"
export LISTEN_PORT="${PORT:-8080}"

echo "Starting Nginx with upstream configuration:"
echo " - Listen Port: ${LISTEN_PORT}"
echo " - Backend Proxy: ${BACKEND_PROXY_URL}"
echo " - AI Service Proxy: ${AI_SERVICE_PROXY_URL}"

# Substitute environment variables into Nginx configuration
envsubst '${BACKEND_PROXY_URL} ${AI_SERVICE_PROXY_URL} ${LISTEN_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Execute standard Nginx command
exec "$@"
