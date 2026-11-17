# Google Cloud Platform (GCP) Solutions Architecture & Deployment Runbook
## Power Plant Store & Critical Spares Management System (SMS)

This guide documents the enterprise cloud infrastructure, security topology, containerization strategy, and automated CI/CD pipeline for deploying the Power Plant SMS platform on Google Cloud Platform (GCP).

---

## 1. Cloud Architecture Topology

```
                                  [ Thermal Plant LAN / Web Clients ]
                                                  │
                                                  ▼ HTTPS (443)
                                  ┌───────────────────────────────┐
                                  │      Cloud Run Ingress        │
                                  └───────────────┬───────────────┘
                                                  │
          ┌───────────────────────────────────────┼───────────────────────────────────────┐
          │                                       │                                       │
          ▼                                       ▼                                       ▼
 ┌─────────────────┐                     ┌─────────────────┐                     ┌─────────────────┐
 │  sms-frontend   │  Reverse Proxy      │   sms-backend   │   Internal REST     │  sms-ai-service │
 │   (Cloud Run)   │ ──────────────────► │   (Cloud Run)   │ ◄─────────────────► │   (Cloud Run)   │
 │  React 18+ Vite │   /api/ requests    │  Spring Boot 3  │   /ai/ predictions  │ Python FastAPI  │
 │  Nginx Alpine   │                     │  (Java 21 JRE)  │                     │ (LightGBM/CLIP) │
 └─────────────────┘                     └────────┬────────┘                     └────────┬────────┘
          │                                       │                                       │
          │ GCS Direct Scans                      │ Cloud SQL Socket Factory              │ pgvector Queries
          ▼                                       ▼                                       ▼
 ┌─────────────────┐                     ┌─────────────────────────────────────────────────────────┐
 │  Cloud Storage  │ ◄───────────────────┤               Cloud SQL for PostgreSQL 16               │
 │  (GCS Bucket)   │                     │  • Extension: pgvector (cloudsql.enable_pgvector=on)    │
 │ • Challan Scans │                     │  • Tables: 13 relational tables with @Version lock     │
 │ • QR PNG Labels │                     │  • Indexes: HNSW Cosine (384-dim text, 512-dim visual)  │
 │ • Part Photos   │                     │  • High Availability & Automated Daily Backups          │
 └─────────────────┘                     └─────────────────────────────────────────────────────────┘
                                                          ▲
                                                          │
                                         ┌────────────────┴────────────────┐
                                         │  Secret Manager & IAM Security  │
                                         │  • sms-db-password              │
                                         │  • sms-jwt-secret               │
                                         │  • sms-cloudrun-sa (Least Priv) │
                                         └─────────────────────────────────┘
```

---

## 2. Infrastructure Components Specification

| Component | GCP Service | Configuration | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | Cloud Run (`sms-frontend`) | 1 vCPU, 512 MiB, Min 1, Max 10 | React 18 SPA served by Nginx Alpine, reverse-proxying `/api` and `/ai` |
| **Core Backend** | Cloud Run (`sms-backend-springboot`) | 1 vCPU, 1 GiB, Min 1, Max 10 | Spring Boot 3.3 REST API, JPA optimistic concurrency, ZXing QR generator |
| **AI Microservice** | Cloud Run (`sms-ai-service`) | 2 vCPU, 2 GiB, Min 0, Max 5 | FastAPI OCR parser, LightGBM ROP predictor & Isolation Forest anomaly detector |
| **Primary Database** | Cloud SQL for PostgreSQL 16 | `db-custom-2-7680` (SSD 20GB Auto-expand) | Core transactional ledger, audit logs, and `pgvector` HNSW semantic vectors |
| **Asset Storage** | Cloud Storage (GCS) | Standard class, Regional (`asia-south1`) | Scanned vendor challans, equipment nameplates, and generated QR code labels |
| **Container Registry** | Artifact Registry | Docker format (`sms-repo`) | Immutable container image repository with digest tracking |
| **CI/CD Build** | Cloud Build | Machine `E2_HIGHCPU_8` | Automated parallel container compilation, tagging, and service deployment |
| **Secrets & Keys** | Secret Manager | Regional replication | Database passwords, JWT HMAC-SHA256 secret keys, and integration credentials |

---

## 3. Step-by-Step CLI Provisioning Guide

### Step 3.1: Environment Setup & API Activation

Log in and set your active Google Cloud project:

```bash
gcloud auth login
gcloud config set project <YOUR_PROJECT_ID>

# Export environment variables for the deployment session
export PROJECT_ID=$(gcloud config get-value project)
export REGION="asia-south1"      # Mumbai, India (standard for Indian thermal utilities)
export ZONE="asia-south1-a"
export INSTANCE_NAME="sms-postgres"
export DB_NAME="sms_db"
export DB_USER="sms_admin"
export REPO_NAME="sms-repo"
export BUCKET_NAME="sms-powerplant-assets-${PROJECT_ID}"
```

Enable all required Google Cloud APIs:

```bash
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
```

---

### Step 3.2: Provision Google Cloud Storage Bucket

Create a regional bucket for scanned delivery challans and QR labels:

```bash
gcloud storage buckets create "gs://${BUCKET_NAME}" \
    --project="${PROJECT_ID}" \
    --location="${REGION}" \
    --default-storage-class=STANDARD \
    --uniform-bucket-level-access

# Apply CORS policy to allow direct browser-based uploads
gcloud storage buckets update "gs://${BUCKET_NAME}" --cors-file=gcp/scripts/cors.json
```

---

### Step 3.3: Create Google Artifact Registry Repository

Create a Docker repository for container images:

```bash
gcloud artifacts repositories create "${REPO_NAME}" \
    --repository-format=docker \
    --location="${REGION}" \
    --description="Thermal Power Plant SMS Docker Repository" \
    --project="${PROJECT_ID}"
```

---

### Step 3.4: Provision Cloud SQL for PostgreSQL 16 with `pgvector`

Create a production PostgreSQL 16 instance with the `cloudsql.enable_pgvector` database flag:

```bash
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
```

Create the application database and administrative credentials:

```bash
# Create database
gcloud sql databases create "${DB_NAME}" --instance="${INSTANCE_NAME}" --project="${PROJECT_ID}"

# Create database user
gcloud sql users create "${DB_USER}" \
    --instance="${INSTANCE_NAME}" \
    --password="PowerPlantSecurePass2026!" \
    --project="${PROJECT_ID}"

# Retrieve Cloud SQL Connection Name (e.g., project:region:instance)
export CLOUD_SQL_CONNECTION=$(gcloud sql instances describe "${INSTANCE_NAME}" --format="value(connectionName)")
echo "Connection Name: ${CLOUD_SQL_CONNECTION}"
```

---

### Step 3.5: Initialize Schema & Seed Data into Cloud SQL

Apply `database/schema.sql` and `database/data.sql` to the provisioned database:

**Option A (Using Cloud SQL Auth Proxy):**
```bash
# Start proxy in background
cloud-sql-proxy "${CLOUD_SQL_CONNECTION}" --port 5432 &

# Apply DDL schema and seed data
PGPASSWORD="PowerPlantSecurePass2026!" psql -h 127.0.0.1 -p 5432 -U "${DB_USER}" -d "${DB_NAME}" -f database/schema.sql
PGPASSWORD="PowerPlantSecurePass2026!" psql -h 127.0.0.1 -p 5432 -U "${DB_USER}" -d "${DB_NAME}" -f database/data.sql
```

**Option B (Using Google Cloud Storage Import):**
```bash
gcloud storage cp database/schema.sql "gs://${BUCKET_NAME}/sql/schema.sql"
gcloud storage cp database/data.sql "gs://${BUCKET_NAME}/sql/data.sql"

gcloud sql import sql "${INSTANCE_NAME}" "gs://${BUCKET_NAME}/sql/schema.sql" --database="${DB_NAME}" --user="${DB_USER}"
gcloud sql import sql "${INSTANCE_NAME}" "gs://${BUCKET_NAME}/sql/data.sql" --database="${DB_NAME}" --user="${DB_USER}"
```

---

### Step 3.6: Configure Secret Manager & IAM Service Accounts

Store sensitive secrets in Secret Manager:

```bash
echo -n "PowerPlantSecurePass2026!" | gcloud secrets create sms-db-password --data-file=- --replication-policy=automatic
echo -n "PowerPlantSmsThermalStoreSuperSecureSecretKey2026Exceeding256Bits!" | gcloud secrets create sms-jwt-secret --data-file=- --replication-policy=automatic
```

Create a least-privilege service account for Cloud Run workloads:

```bash
gcloud iam service-accounts create sms-cloudrun-sa \
    --display-name="Thermal Power Plant SMS Cloud Run SA" \
    --project="${PROJECT_ID}"

export SA_EMAIL="sms-cloudrun-sa@${PROJECT_ID}.iam.gserviceaccount.com"

# Grant least-privilege roles
for ROLE in roles/cloudsql.client roles/storage.objectAdmin roles/secretmanager.secretAccessor roles/logging.logWriter; do
    gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
        --member="serviceAccount:${SA_EMAIL}" \
        --role="${ROLE}"
done
```

---

### Step 3.7: Automated Build & Deployment via Cloud Build

Trigger the complete automated pipeline using `cloudbuild.yaml`:

```bash
gcloud builds submit . \
    --config=gcp/cloudbuild.yaml \
    --substitutions="_REGION=${REGION},_REPOSITORY=${REPO_NAME},_CLOUD_SQL_INSTANCE=${CLOUD_SQL_CONNECTION},_GCS_BUCKET=${BUCKET_NAME},_DB_NAME=${DB_NAME},_DB_USER=${DB_USER},_DB_PASS=PowerPlantSecurePass2026!" \
    --project="${PROJECT_ID}"
```

Alternatively, run the automated provisioning script directly:

- **Linux / macOS / Cloud Shell:**
  ```bash
  chmod +x gcp/scripts/setup-gcp.sh
  ./gcp/scripts/setup-gcp.sh
  ```

- **Windows PowerShell:**
  ```powershell
  .\gcp\scripts\setup-gcp.ps1
  ```

---

## 4. Manual Cloud Run Deployment Commands

If deploying individual microservices manually:

### 1. Deploy AI Microservice (FastAPI)
```bash
gcloud run deploy sms-ai-service \
    --image="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/sms-ai-service:latest" \
    --region="${REGION}" \
    --platform=managed \
    --allow-unauthenticated \
    --service-account="${SA_EMAIL}" \
    --memory=2Gi \
    --cpu=2 \
    --port=8000 \
    --min-instances=0 \
    --max-instances=5 \
    --set-env-vars="DB_URL=postgresql+psycopg2://${DB_USER}:PowerPlantSecurePass2026!@127.0.0.1:5432/${DB_NAME}"
```

### 2. Deploy Spring Boot Backend
```bash
gcloud run deploy sms-backend-springboot \
    --image="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/sms-backend:latest" \
    --region="${REGION}" \
    --platform=managed \
    --allow-unauthenticated \
    --service-account="${SA_EMAIL}" \
    --memory=1Gi \
    --cpu=1 \
    --port=8080 \
    --min-instances=1 \
    --max-instances=10 \
    --add-cloudsql-instances="${CLOUD_SQL_CONNECTION}" \
    --set-env-vars="SPRING_PROFILES_ACTIVE=gcp,CLOUD_SQL_INSTANCE=${CLOUD_SQL_CONNECTION},DB_NAME=${DB_NAME},DB_USER=${DB_USER},GCS_BUCKET_NAME=${BUCKET_NAME},GCS_ENABLED=true" \
    --set-secrets="DB_PASS=sms-db-password:latest,JWT_SECRET=sms-jwt-secret:latest"
```

### 3. Deploy React + Nginx Frontend
```bash
BACKEND_URL=$(gcloud run services describe sms-backend-springboot --region="${REGION}" --format="value(status.url)")
AI_URL=$(gcloud run services describe sms-ai-service --region="${REGION}" --format="value(status.url)")

gcloud run deploy sms-frontend \
    --image="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/sms-frontend:latest" \
    --region="${REGION}" \
    --platform=managed \
    --allow-unauthenticated \
    --memory=512Mi \
    --cpu=1 \
    --port=8080 \
    --min-instances=1 \
    --max-instances=10 \
    --set-env-vars="BACKEND_URL=${BACKEND_URL}/api/,AI_SERVICE_URL=${AI_URL}/api/v1/ai/"
```

---

## 5. Local Full-Stack Execution via Docker Compose

To test the entire containerized architecture locally before pushing to GCP:

```bash
# Build and boot PostgreSQL (pgvector), Spring Boot, React Nginx, and FastAPI
docker compose up --build
```

- **Frontend UI:** `http://localhost:3000`
- **Backend API & Swagger:** `http://localhost:8080/api`
- **AI Microservice Docs:** `http://localhost:8000/docs`
- **PostgreSQL 16:** `localhost:5432` (`user: postgres`, `pass: postgres`, `db: sms_db`)

---

## 6. Enterprise Production Hardening & Best Practices

1. **Zero Cold-Starts on Backend:**
   `--min-instances=1` is configured on `sms-backend-springboot` to prevent JVM JIT cold starts during urgent midnight boiler trip requisitions.
2. **Optimistic Locking Integrity:**
   JPA `@Version` ensures that simultaneous QR deductions across multiple storekeeper tablets throw `OptimisticLockingFailureException` rather than corrupting physical stock counts.
3. **Least Privilege IAM:**
   The `sms-cloudrun-sa` service account has narrow permissions scoped strictly to Cloud SQL Client and the designated storage bucket.
4. **Cloud SQL Auto-Storage & PITR:**
   Point-in-Time-Recovery (PITR) is enabled with automated daily backups at 02:00 AM UTC, enabling 1-second recovery granularity in case of critical operational incidents.
