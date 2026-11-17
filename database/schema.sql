-- =============================================================================
-- THERMAL POWER PLANT STORE & CRITICAL SPARES MANAGEMENT SYSTEM (SMS)
-- PostgreSQL 16+ Production DDL Schema (Optimized for GCP Cloud SQL + pgvector)
-- =============================================================================

-- Enable required enterprise extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- -----------------------------------------------------------------------------
-- DOMAIN ENUMS (Strict State Machine & Workflows)
-- -----------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM (
    'STOREKEEPER',
    'MAINTENANCE_ENGINEER',
    'SHIFT_IN_CHARGE',
    'QA_QC_ENGINEER',
    'HOD',
    'PLANT_HEAD',
    'SYSTEM_ADMIN'
);

CREATE TYPE department AS ENUM (
    'BOILER',
    'TURBINE_GENERATOR',
    'COAL_HANDLING',
    'ASH_HANDLING',
    'ELECTRICAL',
    'INSTRUMENTATION',
    'WATER_TREATMENT',
    'GENERAL'
);

CREATE TYPE plant_unit AS ENUM (
    'UNIT_1',
    'UNIT_2',
    'BALANCE_OF_PLANT',
    'COMMON'
);

CREATE TYPE abc_class AS ENUM ('A', 'B', 'C');
CREATE TYPE ved_class AS ENUM ('V', 'E', 'D');

CREATE TYPE rotable_status AS ENUM (
    'IN_STORE_READY',
    'INSTALLED_ACTIVE',
    'IN_WORKSHOP_REPAIR',
    'SENT_TO_VENDOR',
    'CONDEMNED_SCRAP'
);

CREATE TYPE indent_type AS ENUM (
    'REGULAR',
    'OVERHAUL',
    'EMERGENCY_BREAKDOWN'
);

CREATE TYPE indent_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'QA_PENDING',
    'APPROVED',
    'EMERGENCY_ISSUED',
    'COMPLETED',
    'REJECTED',
    'CANCELLED'
);

CREATE TYPE stock_transaction_type AS ENUM (
    'INWARD_GRN',
    'NORMAL_ISSUE',
    'EMERGENCY_ISSUE',
    'RETURN_TO_STORE',
    'ROTABLE_CHECKOUT',
    'ROTABLE_CHECKIN',
    'SCRAP_ADJUSTMENT',
    'INVENTORY_AUDIT'
);

CREATE TYPE qa_clearance_status AS ENUM (
    'PENDING',
    'PASSED',
    'FAILED_REJECTED',
    'PROVISIONAL'
);

CREATE TYPE po_status AS ENUM (
    'DRAFT',
    'ISSUED_TO_VENDOR',
    'PARTIALLY_DELIVERED',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE scrap_status AS ENUM (
    'CONDEMNED_PENDING_AUCTION',
    'AUCTIONED_DISPOSED',
    'SALVAGED_FOR_PARTS'
);

-- -----------------------------------------------------------------------------
-- 1. USERS & RBAC TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    department department NOT NULL,
    employee_id VARCHAR(30) UNIQUE,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 2. VENDORS (OEMs & Spares Suppliers)
-- -----------------------------------------------------------------------------
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_code VARCHAR(50) UNIQUE NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(25),
    address TEXT,
    gst_number VARCHAR(20),
    vendor_rating NUMERIC(3, 2) DEFAULT 4.00,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 3. WAREHOUSE LOCATIONS (4-Level Shelf Hierarchy: Zone -> Bay -> Rack -> Bin)
-- -----------------------------------------------------------------------------
CREATE TABLE warehouse_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone VARCHAR(10) NOT NULL,
    bay VARCHAR(10) NOT NULL,
    rack VARCHAR(10) NOT NULL,
    bin VARCHAR(10) NOT NULL,
    location_code VARCHAR(50) UNIQUE NOT NULL, -- Format: Z1-B04-R02-B12
    description VARCHAR(255),
    capacity_level INT DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 4. ITEMS CATALOG (With ABC-VED, Rotable, QA & pgvector Embeddings)
-- -----------------------------------------------------------------------------
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_code VARCHAR(50) UNIQUE NOT NULL,
    part_number VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    department department NOT NULL,
    uom VARCHAR(20) NOT NULL DEFAULT 'EA',
    abc_classification abc_class NOT NULL,
    ved_classification ved_class NOT NULL,
    min_stock_level INT NOT NULL DEFAULT 0,
    max_stock_level INT NOT NULL DEFAULT 100,
    reorder_point INT NOT NULL DEFAULT 10,
    safety_stock INT NOT NULL DEFAULT 5,
    is_rotable BOOLEAN DEFAULT FALSE,
    requires_qa_clearance BOOLEAN DEFAULT TRUE,
    shelf_life_days INT, -- Nullable for non-perishables (e.g. steel castings)
    qr_code_url TEXT,    -- GCS URL for printable QR
    image_url TEXT,      -- GCS URL for reference photo
    text_embedding vector(384), -- MiniLM-L6 384-dim semantic embedding
    image_embedding vector(512), -- CLIP ViT-B 512-dim visual embedding
    version INT DEFAULT 0, -- JPA @Version optimistic locking
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 5. ITEM STOCK (Actual Physical Inventory at Bin Level)
-- -----------------------------------------------------------------------------
CREATE TABLE item_stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE RESTRICT,
    location_id UUID NOT NULL REFERENCES warehouse_locations(id) ON DELETE RESTRICT,
    current_stock INT NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
    reserved_stock INT NOT NULL DEFAULT 0 CHECK (reserved_stock >= 0),
    unit_cost NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    batch_lot_number VARCHAR(50),
    next_calibration_due TIMESTAMP WITH TIME ZONE,
    expiry_date DATE,
    version INT DEFAULT 0, -- JPA @Version optimistic locking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_id, location_id)
);

-- -----------------------------------------------------------------------------
-- 6. PURCHASE ORDERS
-- -----------------------------------------------------------------------------
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    po_date DATE NOT NULL,
    delivery_due_date DATE,
    total_value NUMERIC(18, 2) DEFAULT 0.00,
    status po_status NOT NULL DEFAULT 'ISSUED_TO_VENDOR',
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE po_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id),
    ordered_qty INT NOT NULL CHECK (ordered_qty > 0),
    unit_price NUMERIC(18, 2) NOT NULL,
    received_qty INT NOT NULL DEFAULT 0 CHECK (received_qty >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 7. GATE ENTRIES (Inward Logistics & Delivery Challan)
-- -----------------------------------------------------------------------------
CREATE TABLE gate_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gate_pass_number VARCHAR(50) UNIQUE NOT NULL,
    po_id UUID REFERENCES purchase_orders(id),
    vendor_id UUID REFERENCES vendors(id),
    vehicle_number VARCHAR(50) NOT NULL,
    driver_name VARCHAR(100),
    driver_phone VARCHAR(25),
    challan_number VARCHAR(100) NOT NULL,
    challan_date DATE NOT NULL,
    challan_gcs_url TEXT, -- Cloud Storage scan of supplier challan
    entry_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    security_officer_id UUID REFERENCES users(id),
    status VARCHAR(30) DEFAULT 'ENTERED_GATE',
    remarks TEXT
);

-- -----------------------------------------------------------------------------
-- 8. GOODS RECEIPT NOTES (GRN) & QA/QC CLEARANCE
-- -----------------------------------------------------------------------------
CREATE TABLE goods_receipt_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grn_number VARCHAR(50) UNIQUE NOT NULL,
    gate_entry_id UUID REFERENCES gate_entries(id),
    po_id UUID REFERENCES purchase_orders(id),
    qa_status qa_clearance_status NOT NULL DEFAULT 'PENDING',
    qa_engineer_id UUID REFERENCES users(id),
    qa_inspection_date TIMESTAMP WITH TIME ZONE,
    qa_remarks TEXT,
    test_certificate_url TEXT, -- Mill test / hydrostatic test certificate GCS URL
    received_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grn_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grn_id UUID NOT NULL REFERENCES goods_receipt_notes(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id),
    challan_qty INT NOT NULL CHECK (challan_qty >= 0),
    received_qty INT NOT NULL CHECK (received_qty >= 0),
    accepted_qty INT NOT NULL DEFAULT 0 CHECK (accepted_qty >= 0),
    rejected_qty INT NOT NULL DEFAULT 0 CHECK (rejected_qty >= 0),
    location_id UUID REFERENCES warehouse_locations(id),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 9. INDENTS (Material Requisition & Emergency Breakdown Override)
-- -----------------------------------------------------------------------------
CREATE TABLE indents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    indent_number VARCHAR(50) UNIQUE NOT NULL,
    department department NOT NULL,
    plant_unit plant_unit NOT NULL,
    work_order_number VARCHAR(50),
    indent_type indent_type NOT NULL DEFAULT 'REGULAR',
    priority VARCHAR(20) DEFAULT 'NORMAL',
    is_emergency_override BOOLEAN NOT NULL DEFAULT FALSE,
    emergency_justification TEXT,
    post_facto_approved BOOLEAN NOT NULL DEFAULT FALSE,
    post_facto_approved_by UUID REFERENCES users(id),
    post_facto_approval_time TIMESTAMP WITH TIME ZONE,
    post_facto_deadline TIMESTAMP WITH TIME ZONE,
    status indent_status NOT NULL DEFAULT 'DRAFT',
    requested_by UUID NOT NULL REFERENCES users(id),
    current_approver_role user_role,
    approver_id UUID REFERENCES users(id),
    approver_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE indent_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    indent_id UUID NOT NULL REFERENCES indents(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id),
    requested_qty INT NOT NULL CHECK (requested_qty > 0),
    issued_qty INT NOT NULL DEFAULT 0 CHECK (issued_qty >= 0),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 10. STOCK LEDGER (Append-Only Immutable Audit Log)
-- -----------------------------------------------------------------------------
CREATE TABLE stock_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_uuid UUID UNIQUE NOT NULL,
    transaction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    transaction_type stock_transaction_type NOT NULL,
    item_id UUID NOT NULL REFERENCES items(id),
    location_id UUID REFERENCES warehouse_locations(id),
    reference_doc_number VARCHAR(50) NOT NULL, -- GRN Number or Indent Number
    qty_in INT NOT NULL DEFAULT 0 CHECK (qty_in >= 0),
    qty_out INT NOT NULL DEFAULT 0 CHECK (qty_out >= 0),
    balance_after INT NOT NULL CHECK (balance_after >= 0),
    performed_by UUID NOT NULL REFERENCES users(id),
    remarks TEXT
);

-- -----------------------------------------------------------------------------
-- 11. ROTABLE SPARES (Serialized Heavy Equipment Tracking)
-- -----------------------------------------------------------------------------
CREATE TABLE rotable_spares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES items(id),
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    current_status rotable_status NOT NULL DEFAULT 'IN_STORE_READY',
    plant_unit plant_unit NOT NULL,
    current_equipment_tag VARCHAR(100), -- e.g. "BFP-1A", "FD-FAN-2B"
    location_id UUID REFERENCES warehouse_locations(id),
    last_overhaul_date DATE,
    next_overhaul_due DATE,
    accumulated_running_hours INT DEFAULT 0,
    overhaul_count INT DEFAULT 0,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 12. SCRAP & CONDEMNATION LEDGER (Audit Trail for Decommissioned Spares)
-- -----------------------------------------------------------------------------
CREATE TABLE scrap_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scrap_lot_number VARCHAR(50) UNIQUE NOT NULL,
    item_id UUID NOT NULL REFERENCES items(id),
    rotable_id UUID REFERENCES rotable_spares(id),
    condemned_date DATE NOT NULL,
    condemnation_reason TEXT NOT NULL,
    estimated_salvage_value NUMERIC(18, 2) DEFAULT 0.00,
    scrap_status scrap_status NOT NULL DEFAULT 'CONDEMNED_PENDING_AUCTION',
    auction_batch_id VARCHAR(50),
    approved_by_hod_id UUID NOT NULL REFERENCES users(id),
    scrap_certificate_url TEXT, -- GCS URL
    disposal_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 13. CONSUMPTION HISTORY (AI Training Table: MTBF, Outages & Anomaly Detection)
-- -----------------------------------------------------------------------------
CREATE TABLE consumption_history (
    id BIGSERIAL PRIMARY KEY,
    component_name VARCHAR(100) NOT NULL,
    plant_unit VARCHAR(50) NOT NULL,
    consumption_date DATE NOT NULL,
    daily_usage NUMERIC(12, 4) NOT NULL,
    running_hours NUMERIC(6, 2) NOT NULL,
    failure_event BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- INDEXES (Performance, Text Search & HNSW Vector Indexes)
-- -----------------------------------------------------------------------------
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_dept ON users(department);

CREATE INDEX idx_locations_code ON warehouse_locations(location_code);
CREATE INDEX idx_locations_zone ON warehouse_locations(zone);

CREATE INDEX idx_items_code ON items(item_code);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_abc ON items(abc_classification);
CREATE INDEX idx_items_ved ON items(ved_classification);
CREATE INDEX idx_items_trgm_name ON items USING gin (name gin_trgm_ops);

CREATE INDEX idx_stock_item ON item_stock(item_id);
CREATE INDEX idx_stock_location ON item_stock(location_id);
CREATE INDEX idx_stock_expiry ON item_stock(expiry_date);
CREATE INDEX idx_stock_calibration ON item_stock(next_calibration_due);

CREATE INDEX idx_indents_number ON indents(indent_number);
CREATE INDEX idx_indents_status ON indents(status);
CREATE INDEX idx_indents_emergency ON indents(is_emergency_override);
CREATE INDEX idx_indents_dept_unit ON indents(department, plant_unit);

CREATE INDEX idx_ledger_item_time ON stock_ledger(item_id, transaction_timestamp DESC);
CREATE INDEX idx_ledger_ref_doc ON stock_ledger(reference_doc_number);

CREATE INDEX idx_rotable_serial ON rotable_spares(serial_number);
CREATE INDEX idx_rotable_status ON rotable_spares(current_status);

CREATE INDEX idx_consumption_comp_date ON consumption_history(component_name, consumption_date);

-- HNSW Vector Indexes (Cosine Distance) for AI Semantic & Visual Retrieval
CREATE INDEX idx_items_text_vec ON items USING hnsw (text_embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_items_image_vec ON items USING hnsw (image_embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);
