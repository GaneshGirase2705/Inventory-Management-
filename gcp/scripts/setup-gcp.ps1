# ==============================================================================
# Google Cloud Platform (GCP) Provisioning Script (PowerShell for Windows)
# Thermal Power Plant Store & Spares Management System (SMS)
# ==============================================================================

[CmdletBinding()]
param(
    [string]$ProjectId = $(gcloud config get-value project),
    [string]$Region = "asia-south1",
    [string]$InstanceName = "sms-postgres",
    [string]$DbName = "sms_db",
    [string]$DbUser = "sms_admin",
    [string]$DbPass = "PowerPlantSecurePass2026!",
    [string]$JwtSecret = "PowerPlantSmsThermalStoreSuperSecureSecretKey2026Exceeding256Bits!",
    [string]$RepoName = "sms-repo"
)

$ErrorActionPreference = "Stop"

Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host " Starting GCP Provisioning for Thermal Power Plant SMS" -ForegroundColor Cyan
Write-Host " Project ID : $ProjectId"
Write-Host " Region     : $Region"
Write-Host " Database   : PostgreSQL 16 + pgvector ($InstanceName)"
Write-Host " Bucket     : gs://sms-powerplant-assets-$ProjectId"
Write-Host " Repository : $Region-docker.pkg.dev/$ProjectId/$RepoName"
Write-Host "================================================================================" -ForegroundColor Cyan

# 1. Enable APIs
Write-Host "`n[Step 1/7] Enabling required GCP APIs..." -ForegroundColor Yellow
gcloud services enable `
    run.googleapis.com `
    sqladmin.googleapis.com `
    artifactregistry.googleapis.com `
    cloudbuild.googleapis.com `
    storage.googleapis.com `
    vpcaccess.googleapis.com `
    servicenetworking.googleapis.com `
    secretmanager.googleapis.com `
    --project=$ProjectId

# 2. Cloud Storage Bucket
$BucketName = "sms-powerplant-assets-$ProjectId"
Write-Host "`n[Step 2/7] Creating Cloud Storage bucket (gs://$BucketName)..." -ForegroundColor Yellow
$bucketExists = gcloud storage buckets describe "gs://$BucketName" --project=$ProjectId 2>&1
if ($LASTEXITCODE -ne 0) {
    gcloud storage buckets create "gs://$BucketName" `
        --project=$ProjectId `
        --location=$Region `
        --default-storage-class=STANDARD `
        --uniform-bucket-level-access
    Write-Host "✓ Cloud Storage bucket created." -ForegroundColor Green
} else {
    Write-Host "✓ Cloud Storage bucket already exists." -ForegroundColor Green
}

# 3. Artifact Registry Repository
Write-Host "`n[Step 3/7] Creating Artifact Registry repository ($RepoName)..." -ForegroundColor Yellow
$repoExists = gcloud artifacts repositories describe $RepoName --location=$Region --project=$ProjectId 2>&1
if ($LASTEXITCODE -ne 0) {
    gcloud artifacts repositories create $RepoName `
        --repository-format=docker `
        --location=$Region `
        --description="Thermal Power Plant SMS Docker Containers" `
        --project=$ProjectId
    Write-Host "✓ Artifact Registry repository created." -ForegroundColor Green
} else {
    Write-Host "✓ Artifact Registry repository already exists." -ForegroundColor Green
}

# 4. Cloud SQL PostgreSQL 16
Write-Host "`n[Step 4/7] Provisioning Cloud SQL PostgreSQL 16 with pgvector..." -ForegroundColor Yellow
$sqlExists = gcloud sql instances describe $InstanceName --project=$ProjectId 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating Cloud SQL instance '$InstanceName' (approx 5-7 min)..." -ForegroundColor Yellow
    gcloud sql instances create $InstanceName `
        --project=$ProjectId `
        --database-version=POSTGRES_16 `
        --tier=db-custom-2-7680 `
        --region=$Region `
        --storage-type=SSD `
        --storage-size=20GB `
        --storage-auto-increase `
        --enable-point-in-time-recovery `
        --database-flags="cloudsql.enable_pgvector=on,max_connections=100"

    gcloud sql databases create $DbName --instance=$InstanceName --project=$ProjectId
    gcloud sql users create $DbUser --instance=$InstanceName --password=$DbPass --project=$ProjectId
    Write-Host "✓ Cloud SQL instance configured." -ForegroundColor Green
} else {
    Write-Host "✓ Cloud SQL instance '$InstanceName' already exists." -ForegroundColor Green
}

$ConnectionName = (gcloud sql instances describe $InstanceName --project=$ProjectId --format="value(connectionName)")
Write-Host "Cloud SQL Connection Name: $ConnectionName" -ForegroundColor Cyan

# 5. Secret Manager
Write-Host "`n[Step 5/7] Creating Secrets in Secret Manager..." -ForegroundColor Yellow
foreach ($sec in @(@{Name="sms-db-password"; Val=$DbPass}, @{Name="sms-jwt-secret"; Val=$JwtSecret})) {
    $secExists = gcloud secrets describe $sec.Name --project=$ProjectId 2>&1
    if ($LASTEXITCODE -ne 0) {
        $sec.Val | gcloud secrets create $sec.Name --data-file=- --replication-policy=automatic --project=$ProjectId
        Write-Host "✓ Created secret $($sec.Name)" -ForegroundColor Green
    } else {
        Write-Host "✓ Secret $($sec.Name) already exists." -ForegroundColor Green
    }
}

# 6. Service Account & IAM Roles
Write-Host "`n[Step 6/7] Configuring Service Account & IAM..." -ForegroundColor Yellow
$SaEmail = "sms-cloudrun-sa@$ProjectId.iam.gserviceaccount.com"
$saExists = gcloud iam service-accounts describe $SaEmail --project=$ProjectId 2>&1
if ($LASTEXITCODE -ne 0) {
    gcloud iam service-accounts create "sms-cloudrun-sa" `
        --display-name="Thermal Power Plant SMS Service Account" `
        --project=$ProjectId
}

$roles = @(
    "roles/cloudsql.client",
    "roles/storage.objectAdmin",
    "roles/secretmanager.secretAccessor",
    "roles/logging.logWriter"
)
foreach ($role in $roles) {
    gcloud projects add-iam-policy-binding $ProjectId `
        --member="serviceAccount:$SaEmail" `
        --role=$role `
        --condition=None | Out-Null
}
Write-Host "✓ Service Account configured with least privilege roles." -ForegroundColor Green

# 7. Cloud Build Execution
Write-Host "`n[Step 7/7] Submitting Cloud Build for all 3 microservices..." -ForegroundColor Yellow
$RootDir = (Resolve-Path "$PSScriptRoot\..\..").Path
gcloud builds submit $RootDir `
    --config="$RootDir\gcp\cloudbuild.yaml" `
    --substitutions="_REGION=$Region,_REPOSITORY=$RepoName,_CLOUD_SQL_INSTANCE=$ConnectionName,_GCS_BUCKET=$BucketName,_DB_NAME=$DbName,_DB_USER=$DbUser,_DB_PASS=$DbPass" `
    --project=$ProjectId

Write-Host "`n================================================================================" -ForegroundColor Green
Write-Host " GCP DEPLOYMENT COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "================================================================================" -ForegroundColor Green
gcloud run services list --platform=managed --region=$Region --project=$ProjectId
