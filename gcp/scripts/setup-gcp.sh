#!/usr/bin/env bash
# ==============================================================================
# Google Cloud Platform (GCP) Complete Infrastructure Provisioning Script
# Thermal Power Plant Store & Critical Spares Management System (SMS)
# Provisions: Cloud SQL (PostgreSQL 16 + pgvector), Cloud Storage, Artifact Registry,
#             Secret Manager, VPC Connector, and 3 Cloud Run Microservices.
# ==============================================================================

set -euo pipefail

# ------------------------------------------------------------------------------
# Configuration Variables (Modify for your GCP Environment)
# ------------------------------------------------------------------------------
PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project)}"
REGION="${GCP_REGION:-asia-south1}"              # Mumbai, India (standard for Indian power utilities)
ZONE="${REGION}-a"
INSTANCE_NAME="sms-postgres"
DB_NAME="sms_db"
DB_USER="sms_admin"
DB_PASS="${DB_PASSWORD:-PowerPlantSecurePass2026!}"
JWT_SECRET="${JWT_SECRET_KEY:-PowerPlantSmsThermalStoreSuperSecureSecretKey2026Exceeding256Bits!}"
BUCKET_NAME="sms-powerplant-assets-${PROJECT_ID}"
REPO_NAME="sms-repo"
VPC_NETWORK="default"
VPC_CONNECTOR="sms-vpc-connector"
SERVICE_ACCOUNT="sms-cloudrun-sa@${PROJECT_ID}.iam.gserviceaccount.com"

echo "================================================================================"
echo " Starting GCP Provisioning for Thermal Power Plant SMS"
echo " Project ID : ${PROJECT_ID}"
echo " Region     : ${REGION}"
echo " Database   : PostgreSQL 16 + pgvector (${INSTANCE_NAME})"
echo " Bucket     : gs://${BUCKET_NAME}"
echo " Repository : ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}"
echo "================================================================================"

# ------------------------------------------------------------------------------
# 1. Enable Required GCP Service APIs
# ------------------------------------------------------------------------------
echo ""
echo "[Step 1/8] Enabling required GCP APIs..."
gcloud services enable \
    run.googleapis.com \
    sqladmin.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    storage.googleapis.com \
    vpcaccess.googleapis.com \
    servicenetworking.googleapis.com \
    secretmanager.googleapis.com \
    compute.googleapis.com \
    --project="${PROJECT_ID}"

echo "✓ GCP APIs successfully enabled."

# ------------------------------------------------------------------------------
# 2. Provision Google Cloud Storage Bucket for Challans, QR Codes & Spares Photos
# ------------------------------------------------------------------------------
echo ""
echo "[Step 2/8] Creating Cloud Storage bucket (gs://${BUCKET_NAME})..."
if ! gcloud storage buckets describe "gs://${BUCKET_NAME}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
    gcloud storage buckets create "gs://${BUCKET_NAME}" \
        --project="${PROJECT_ID}" \
        --location="${REGION}" \
        --default-storage-class=STANDARD \
        --uniform-bucket-level-access

    # Configure CORS for browser-based delivery challan uploads
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    if [ -f "${SCRIPT_DIR}/cors.json" ]; then
        gcloud storage buckets update "gs://${BUCKET_NAME}" --cors-file="${SCRIPT_DIR}/cors.json"
    fi
    echo "✓ Cloud Storage bucket created with uniform access and CORS."
else
    echo "✓ Cloud Storage bucket already exists."
fi

# ------------------------------------------------------------------------------
# 3. Create Artifact Registry Docker Repository
# ------------------------------------------------------------------------------
echo ""
echo "[Step 3/8] Creating Artifact Registry repository (${REPO_NAME})..."
if ! gcloud artifacts repositories describe "${REPO_NAME}" --location="${REGION}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
    gcloud artifacts repositories create "${REPO_NAME}" \
        --repository-format=docker \
        --location="${REGION}" \
        --description="Thermal Power Plant SMS Docker Containers" \
        --project="${PROJECT_ID}"
    echo "✓ Artifact Registry repository created."
else
    echo "✓ Artifact Registry repository already exists."
fi

# ------------------------------------------------------------------------------
# 4. Provision Cloud SQL for PostgreSQL 16 with pgvector Extension
# ------------------------------------------------------------------------------
echo ""
echo "[Step 4/8] Provisioning Cloud SQL PostgreSQL 16 with pgvector..."
if ! gcloud sql instances describe "${INSTANCE_NAME}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
    echo "Creating Cloud SQL instance '${INSTANCE_NAME}' (this may take 5-7 minutes)..."
    gcloud sql instances create "${INSTANCE_NAME}" \
        --project="${PROJECT_ID}" \
        --database-version=POSTGRES_16 \
        --tier=db-custom-2-7680 \
        --region="${REGION}" \
        --zone="${ZONE}" \
        --storage-type=SSD \
        --storage-size=20GB \
        --storage-auto-increase \
        --backup-start-time=02:00 \
        --enable-point-in-time-recovery \
        --database-flags="cloudsql.enable_pgvector=on,max_connections=100"

    echo "Creating database '${DB_NAME}'..."
    gcloud sql databases create "${DB_NAME}" --instance="${INSTANCE_NAME}" --project="${PROJECT_ID}"

    echo "Creating user '${DB_USER}'..."
    gcloud sql users create "${DB_USER}" \
        --instance="${INSTANCE_NAME}" \
        --password="${DB_PASS}" \
        --project="${PROJECT_ID}"
    echo "✓ Cloud SQL instance and credentials configured."
else
    echo "✓ Cloud SQL instance '${INSTANCE_NAME}' already exists."
fi

CONNECTION_NAME=$(gcloud sql instances describe "${INSTANCE_NAME}" --project="${PROJECT_ID}" --format="value(connectionName)")
echo "Cloud SQL Connection Name: ${CONNECTION_NAME}"

# ------------------------------------------------------------------------------
# 5. Provision Secret Manager Secrets
# ------------------------------------------------------------------------------
echo ""
echo "[Step 5/8] Configuring Secret Manager..."
create_secret_if_missing() {
    local SECRET_ID=$1
    local SECRET_VAL=$2
    if ! gcloud secrets describe "${SECRET_ID}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
        echo -n "${SECRET_VAL}" | gcloud secrets create "${SECRET_ID}" \
            --data-file=- \
            --replication-policy="automatic" \
            --project="${PROJECT_ID}"
        echo "✓ Created secret '${SECRET_ID}'."
    else
        echo "✓ Secret '${SECRET_ID}' already exists."
    fi
}

create_secret_if_missing "sms-db-password" "${DB_PASS}"
create_secret_if_missing "sms-jwt-secret" "${JWT_SECRET}"

# ------------------------------------------------------------------------------
# 6. Configure Service Account & IAM Roles for Least Privilege
# ------------------------------------------------------------------------------
echo ""
echo "[Step 6/8] Configuring IAM Service Account..."
SA_NAME="sms-cloudrun-sa"
if ! gcloud iam service-accounts describe "${SERVICE_ACCOUNT}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
    gcloud iam service-accounts create "${SA_NAME}" \
        --display-name="Thermal Power Plant SMS Cloud Run Service Account" \
        --project="${PROJECT_ID}"
    echo "✓ Created Service Account '${SERVICE_ACCOUNT}'."
fi

# Assign least privilege roles to Cloud Run runtime
ROLES=(
    "roles/cloudsql.client"
    "roles/storage.objectAdmin"
    "roles/secretmanager.secretAccessor"
    "roles/logging.logWriter"
)

for ROLE in "${ROLES[@]}"; do
    gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
        --member="serviceAccount:${SERVICE_ACCOUNT}" \
        --role="${ROLE}" \
        --condition=None >/dev/null
done
echo "✓ IAM roles assigned: Cloud SQL Client, Storage Object Admin, Secret Accessor, Log Writer."

# ------------------------------------------------------------------------------
# 7. Configure Serverless VPC Access Connector
# ------------------------------------------------------------------------------
echo ""
echo "[Step 7/8] Configuring Serverless VPC Access Connector..."
if ! gcloud compute networks vpc-access connectors describe "${VPC_CONNECTOR}" --region="${REGION}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
    echo "Creating VPC Connector '${VPC_CONNECTOR}' (takes 2-3 minutes)..."
    gcloud compute networks vpc-access connectors create "${VPC_CONNECTOR}" \
        --network="${VPC_NETWORK}" \
        --region="${REGION}" \
        --range="10.8.0.0/28" \
        --min-instances=2 \
        --max-instances=3 \
        --machine-type=e2-micro \
        --project="${PROJECT_ID}" || echo "Note: If IP range conflicts, adjust --range parameter."
    echo "✓ Serverless VPC Access Connector created."
else
    echo "✓ VPC Connector '${VPC_CONNECTOR}' already exists."
fi

# ------------------------------------------------------------------------------
# 8. Build & Deploy Microservices via Google Cloud Build
# ------------------------------------------------------------------------------
echo ""
echo "[Step 8/8] Triggering automated build and Cloud Run deployment via Cloud Build..."
echo "Submitting build with substitutions..."
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

gcloud builds submit "${ROOT_DIR}" \
    --config="${ROOT_DIR}/gcp/cloudbuild.yaml" \
    --substitutions="_REGION=${REGION},_REPOSITORY=${REPO_NAME},_CLOUD_SQL_INSTANCE=${CONNECTION_NAME},_GCS_BUCKET=${BUCKET_NAME},_DB_NAME=${DB_NAME},_DB_USER=${DB_USER},_DB_PASS=${DB_PASS}" \
    --project="${PROJECT_ID}"

echo ""
echo "================================================================================"
echo " GCP DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "================================================================================"
echo "Cloud Run Service Endpoints:"
gcloud run services list --platform=managed --region="${REGION}" --project="${PROJECT_ID}"
echo "================================================================================"
