#!/usr/bin/env bash
# ==============================================================================
# Fast Continuous Deployment Script for Cloud Run Services
# Builds and deploys updated backend, AI service, or frontend containers.
# ==============================================================================

set -euo pipefail

PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project)}"
REGION="${GCP_REGION:-asia-south1}"
REPO_NAME="sms-repo"
SERVICE_NAME="${1:-all}"  # Options: all, backend, frontend, ai

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TAG="$(date +%Y%m%d%H%M%S)"

echo "Deploying Thermal Power Plant SMS target: ${SERVICE_NAME} to ${REGION}..."

deploy_ai() {
    echo ">> [1/3] Building & Deploying Python FastAPI AI Service..."
    local IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/sms-ai-service:${TAG}"
    gcloud builds submit "${ROOT_DIR}/ai-service" --tag="${IMAGE}" --project="${PROJECT_ID}"
    gcloud run deploy sms-ai-service \
        --image="${IMAGE}" \
        --region="${REGION}" \
        --platform=managed \
        --allow-unauthenticated \
        --memory=2Gi \
        --cpu=2 \
        --port=8000 \
        --project="${PROJECT_ID}"
    echo "✓ AI Service deployed."
}

deploy_backend() {
    echo ">> [2/3] Building & Deploying Spring Boot Backend..."
    local IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/sms-backend:${TAG}"
    local INSTANCE=$(gcloud sql instances describe sms-postgres --project="${PROJECT_ID}" --format="value(connectionName)")
    gcloud builds submit "${ROOT_DIR}/backend" --tag="${IMAGE}" --project="${PROJECT_ID}"
    gcloud run deploy sms-backend-springboot \
        --image="${IMAGE}" \
        --region="${REGION}" \
        --platform=managed \
        --allow-unauthenticated \
        --memory=1Gi \
        --cpu=1 \
        --port=8080 \
        --add-cloudsql-instances="${INSTANCE}" \
        --set-env-vars="SPRING_PROFILES_ACTIVE=gcp,CLOUD_SQL_INSTANCE=${INSTANCE},GCS_BUCKET_NAME=sms-powerplant-assets-${PROJECT_ID},GCS_ENABLED=true" \
        --project="${PROJECT_ID}"
    echo "✓ Spring Boot Backend deployed."
}

deploy_frontend() {
    echo ">> [3/3] Building & Deploying React + Nginx Frontend..."
    local IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/sms-frontend:${TAG}"
    local BACKEND_URL=$(gcloud run services describe sms-backend-springboot --region="${REGION}" --project="${PROJECT_ID}" --format="value(status.url)")
    local AI_URL=$(gcloud run services describe sms-ai-service --region="${REGION}" --project="${PROJECT_ID}" --format="value(status.url)")
    
    gcloud builds submit "${ROOT_DIR}/frontend" --tag="${IMAGE}" --project="${PROJECT_ID}"
    gcloud run deploy sms-frontend \
        --image="${IMAGE}" \
        --region="${REGION}" \
        --platform=managed \
        --allow-unauthenticated \
        --memory=512Mi \
        --cpu=1 \
        --port=8080 \
        --set-env-vars="BACKEND_URL=${BACKEND_URL}/api/,AI_SERVICE_URL=${AI_URL}/api/v1/ai/" \
        --project="${PROJECT_ID}"
    echo "✓ React Frontend deployed."
}

case "${SERVICE_NAME}" in
    ai)
        deploy_ai
        ;;
    backend)
        deploy_backend
        ;;
    frontend)
        deploy_frontend
        ;;
    all)
        deploy_ai
        deploy_backend
        deploy_frontend
        ;;
    *)
        echo "Usage: $0 [all|backend|frontend|ai]"
        exit 1
        ;;
esac

echo "Deployment complete! Live endpoints:"
gcloud run services list --platform=managed --region="${REGION}" --project="${PROJECT_ID}"
