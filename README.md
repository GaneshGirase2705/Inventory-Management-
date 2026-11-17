# Thermal Power Plant Store & Critical Spares Management System (SMS)

Production-grade industrial store and critical spares management platform digitizing and automating the end-to-end store lifecycle with integrated AI capabilities, tailored for Thermal Power Plants (Boiler, Turbine Generator, Coal Handling Plant, Ash Handling Plant, Electrical, C&I, and Water Treatment Plant).

---

## 1. System Architecture

```
                                  [ Thermal Plant LAN / Mobile Devices ]
                                                    │
                                                    ▼
                                    ┌───────────────────────────────┐
                                    │  Industrial Control-Room PWA  │
                                    │    React 18+ Vite + Tailwind  │
                                    └───────┬───────────────┬───────┘
                                            │               │
                            REST API / Auth │               │ Vision OCR & Search
                                            ▼               ▼
                                    ┌───────────────┐ ┌────────────────┐
                                    │ Spring Boot 3 │ │ FastAPI AI Svc │
                                    │   (Java 21)   │ │ (Python 3.11)  │
                                    └───────┬───────┘ └───────┬────────┘
                                            │                 │
                           Optimistic Lock  │                 │ pgvector Cosine
                                            ▼                 ▼
                                    ┌──────────────────────────────────┐
                                    │   PostgreSQL 16 with pgvector    │
                                    │   13 Tables, HNSW Vector Index   │
                                    └──────────────────────────────────┘
```

---

## 2. Technology Stack

- **Core Backend:** Java 21, Spring Boot 3.3.0, Spring Data JPA / Hibernate, Spring Security (JWT & RBAC), HikariCP, Google Cloud SQL Socket Factory, Google Cloud Storage SDK, ZXing QR generator.
- **Database:** PostgreSQL 16 with `pgvector`, `uuid-ossp`, and `pg_trgm` extensions. HNSW cosine indexing for 384-dim text and 512-dim visual embeddings.
- **Frontend UI/UX:** React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, `html5-qrcode` camera scanner, printable 4" × 2" thermal QR bin labels.
- **AI Microservice:** Python 3.11, FastAPI, Sentence-Transformers (`all-MiniLM-L6-v2`), LightGBM Regressor, Scikit-Learn Isolation Forest, CPU PyTorch.
- **Cloud & DevOps (GCP):** Google Cloud Run (serverless containers), Cloud SQL for PostgreSQL, Cloud Storage (GCS), Artifact Registry, Cloud Build (`cloudbuild.yaml`), Secret Manager.

---

## 3. Monorepo Structure

```
Inventory Management/
├── backend/                       # Spring Boot 3 Java 21 REST API
│   ├── Dockerfile                 # Multi-stage Eclipse Temurin 21 build
│   ├── pom.xml                    # Maven dependencies
│   └── src/main/java/com/powerplant/sms/
│       ├── controller/            # Auth, Inventory, Indent, QR, Analytics
│       ├── service/               # StockTransactionService with @Version optimistic lock
│       ├── repository/            # 13 Spring Data JPA Repositories
│       ├── model/                 # JPA Entities & Enums
│       └── security/              # JWT Provider & RBAC Filters
├── frontend/                      # React 18 Industrial Control-Room UI
│   ├── Dockerfile                 # Multi-stage Node 20 build + Nginx Alpine
│   ├── nginx.conf                 # Upstream reverse proxy for /api and /ai
│   ├── docker-entrypoint.sh       # Dynamic envsubst port and host injector
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── components/Layout.jsx  # Dark-slate sidebar with live plant unit telemetry
│       ├── views/
│       │   ├── Dashboard.jsx      # Top KPIs, ABC-VED distribution, stock alerts
│       │   ├── Inventory.jsx      # 30 thermal spares with search & filter
│       │   ├── BinGrid.jsx        # 2D spatial warehouse map (Z1-B04-R02-B12)
│       │   ├── Scanner.jsx        # Camera/laser scanner + Emergency Breakdown Override
│       │   ├── QrModal.jsx        # Printable 4" x 2" thermal QR bin label
│       │   ├── Indents.jsx        # Digital indents & approval workflows
│       │   ├── Analytics.jsx      # LightGBM ROP predictions & Anomaly charts
│       │   └── Login.jsx          # JWT authentication
│       └── services/api.js        # Axios API client with offline fallback mock data
├── ai-service/                    # Python 3.11 FastAPI AI Microservice
│   ├── Dockerfile                 # CPU PyTorch + LightGBM + SentenceTransformer
│   ├── requirements.txt
│   └── app/
│       ├── main.py                # OCR challan parsing, semantic search & ROP
│       └── seed_data.py           # Synthetic MTBF consumption data generator
├── database/
│   ├── schema.sql                 # PostgreSQL 16 DDL with pgvector & HNSW indexes
│   └── data.sql                   # 30 Authentic thermal plant spares, users & POs
├── gcp/                           # Google Cloud Platform Deployment Suite
│   ├── cloudbuild.yaml            # Automated parallel Cloud Build pipeline
│   ├── README.md                  # Comprehensive GCP Solutions Architecture runbook
│   └── scripts/
│       ├── setup-gcp.sh           # Bash automated GCP provisioning script
│       ├── setup-gcp.ps1          # PowerShell automated GCP provisioning script
│       ├── deploy.sh              # Fast continuous redeployment script
│       └── cors.json              # GCS CORS configuration for challan uploads
└── docker-compose.yml             # Unified 1-click local stack orchestration
```

---

## 4. Default Seed Users & RBAC Roles

The system is pre-seeded with 7 authentic thermal power plant roles. All user accounts share the default seed password: `password123`.

| Username / Email | Role | Operational Jurisdiction |
| :--- | :--- | :--- |
| `admin@powerplant.com` | `SYSTEM_ADMIN` | Plant IT & System Administration |
| `store.head@powerplant.com` | `STORE_MANAGER` | Store Management, High-Value Approvals |
| `store.keeper1@powerplant.com` | `STORE_KEEPER` | GRN Receipts, Physical Binning, QR Deductions |
| `qa.engineer@powerplant.com` | `QA_QC_ENGINEER` | Metallurgical & Hydrostatic Test Clearances |
| `boiler.incharge@powerplant.com` | `HOD_MAINTENANCE` | Department Indents, Overhaul Requisitions |
| `boiler.engineer@powerplant.com` | `MAINTENANCE_ENGINEER` | Digital Indent Initiation & Work Orders |
| `sce.shift1@powerplant.com` | `SHIFT_CHARGE_ENGINEER` | **Emergency Breakdown Override** (Midnight Trips) |

---

## 5. Core Thermal Power Plant Workflows

### Module 1: Inward Logistics & Digital GRN
- **Gate Entry:** Digital capture of PO number, supplier, vehicle number, and uploaded challan scans.
- **QA/QC Clearance:** Verification of Mill Test Certificates (MTC) and hydrostatic pressure ratings (SA-182 F91, SA-213 T91) before stock enters active inventory.
- **Thermal QR Labeling:** ZXing-generated 4" × 2" thermal sticker printed directly at the gate.

### Module 2: Warehouse Binning & ABC-VED Matrix
- **4-Level Shelf Hierarchy:** Physical coordinate mapping (`Zone -> Bay -> Rack -> Bin`, e.g. `Z1-B04-R02-B12`).
- **ABC Analysis:** Monetary classification (High, Medium, Low value).
- **VED Analysis:** Plant operational criticality:
  - **Vital (V):** Spares whose unavailability halts power generation (e.g., Boiler Feed Pump mechanical seals, Turbine trip solenoid valves).
  - **Essential (E):** Spares causing load derating (e.g., Coal mill grinding rollers, PA fan blades).
  - **Desirable (D):** General piping consumables and sealants.
- **Shelf-Life & Calibration:** Automated alerts for rubber O-rings, spiral-wound gaskets, and calibrated pressure gauges.

### Module 3: Requisition, Approval & QR Issue
- **Digital Indents:** Departmental indents (Boiler, Turbine, CHP, AHP, Electrical, C&I, WTP) mapped to Plant Units (Unit 1, Unit 2, BoP) and Work Orders.
- **Emergency Breakdown Override (Midnight Trip):** Instant material issue authorized by the Shift Charge Engineer (SCE) with mandatory 24-hour post-facto HOD approval.
- **Concurrency Protection:** Optimistic locking via JPA `@Version` ensuring zero race conditions during simultaneous mobile tablet deductions.

### Module 4: Returns, Rotable Spares & Scrap Ledger
- **Rotable Spares Lifecycle:** Tracking heavy assemblies across states (`IN_STORE`, `ISSUED_TO_PLANT`, `UNDER_REPAIR`, `CONDEMNED`).
- **Overhaul Surplus Returns:** Re-binning of unused spares back into warehouse stock via QR scan.
- **Scrap & Condemnation Ledger:** Immutable audit trail for scrap auction valuation.

---

## 6. How to Run Locally

### Option A: Complete Docker Compose (Recommended)
Spin up the entire stack with a single command:

```bash
docker compose up --build
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Spring Boot Backend:** [http://localhost:8080/api](http://localhost:8080/api)
- **FastAPI AI Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **PostgreSQL 16:** `localhost:5432`

---

### Option B: Local Standalone Development

#### 1. Database Setup
```bash
# Ensure PostgreSQL 16 is running with pgvector
psql -U postgres -c "CREATE DATABASE sms_db;"
psql -U postgres -d sms_db -f database/schema.sql
psql -U postgres -d sms_db -f database/data.sql
```

#### 2. Spring Boot Backend
```bash
cd backend
# Using Java 21/22
mvn spring-boot:run
```

#### 3. FastAPI AI Microservice
```bash
cd ai-service
python -m venv venv
# Windows: venv\Scripts\activate | Linux: source venv/bin/activate
pip install -r requirements.txt
python app/seed_data.py
uvicorn app.main:app --reload --port 8000
```

#### 4. React Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 7. Google Cloud Platform (GCP) Deployment

For the complete GCP solutions architecture runbook, refer to [gcp/README.md](file:///c:/Users/Gauravi/OneDrive/Desktop/Inventory%20Management/gcp/README.md).

### Quick Deployment via Script:
- **Linux / Cloud Shell:**
  ```bash
  chmod +x gcp/scripts/setup-gcp.sh
  ./gcp/scripts/setup-gcp.sh
  ```
- **Windows PowerShell:**
  ```powershell
  .\gcp\scripts\setup-gcp.ps1
  ```
