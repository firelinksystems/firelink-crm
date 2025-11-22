-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'technician',
    is_active BOOLEAN DEFAULT true,
    mfa_secret VARCHAR(100),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    postcode VARCHAR(20),
    country VARCHAR(100) DEFAULT 'UK',
    account_manager_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    postcode VARCHAR(20),
    contact_name VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    site_instructions TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE asset_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    inspection_frequency_months INTEGER DEFAULT 12,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    asset_type_id UUID REFERENCES asset_types(id),
    name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255),
    model VARCHAR(255),
    serial_number VARCHAR(255) UNIQUE,
    installation_date DATE,
    last_inspection_date DATE,
    next_inspection_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    location_description TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE contract_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    frequency_months INTEGER,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    contract_type_id UUID REFERENCES contract_types(id),
    start_date DATE NOT NULL,
    end_date DATE,
    value DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'active',
    auto_renew BOOLEAN DEFAULT true,
    terms_and_conditions TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE contract_sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(contract_id, site_id)
);

CREATE TABLE job_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    priority VARCHAR(50) DEFAULT 'medium',
    sla_hours INTEGER,
    default_estimated_hours DECIMAL(4,2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES contracts(id),
    job_type_id UUID REFERENCES job_types(id),
    assigned_technician_id UUID REFERENCES users(id),
    parent_job_id UUID REFERENCES jobs(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'scheduled',
    priority VARCHAR(50) DEFAULT 'medium',
    scheduled_date TIMESTAMP,
    scheduled_start_time TIMESTAMP,
    scheduled_end_time TIMESTAMP,
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    estimated_hours DECIMAL(4,2),
    actual_hours DECIMAL(4,2),
    customer_notes TEXT,
    internal_notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE job_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(job_id, asset_id)
);

CREATE TABLE form_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    form_schema JSONB NOT NULL,
    compliance_standard VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE job_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    form_template_id UUID REFERENCES form_templates(id),
    form_data JSONB NOT NULL,
    submitted_by UUID REFERENCES users(id),
    submitted_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE defects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES assets(id),
    reported_by UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'open',
    recommended_action TEXT,
    safety_implications BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE defect_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    defect_id UUID REFERENCES defects(id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL,
    caption VARCHAR(255),
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_scheduled_date ON jobs(scheduled_date);
CREATE INDEX idx_jobs_assigned_technician ON jobs(assigned_technician_id);
CREATE INDEX idx_assets_site_id ON assets(site_id);
CREATE INDEX idx_assets_next_inspection ON assets(next_inspection_date);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_end_date ON contracts(end_date);
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_sites_customer_id ON sites(customer_id);

-- Insert initial data
INSERT INTO asset_types (id, name, description, inspection_frequency_months) VALUES
(uuid_generate_v4(), 'Fire Alarm Control Panel', 'Main fire alarm control unit', 6),
(uuid_generate_v4(), 'Smoke Detector', 'Optical/ionization smoke detection device', 12),
(uuid_generate_v4(), 'Heat Detector', 'Fixed temperature or rate-of-rise detector', 12),
(uuid_generate_v4(), 'Manual Call Point', 'Break glass emergency call point', 12),
(uuid_generate_v4(), 'Sounders & Alarms', 'Audible warning devices', 12),
(uuid_generate_v4(), 'CCTV Camera', 'Surveillance camera unit', 12),
(uuid_generate_v4(), 'Access Control Reader', 'Card/fob/biometric reader', 12),
(uuid_generate_v4(), 'Fire Extinguisher', 'Portable fire fighting equipment', 12),
(uuid_generate_v4(), 'Emergency Lighting', 'Backup lighting system', 12);

INSERT INTO contract_types (id, name, frequency_months, description) VALUES
(uuid_generate_v4(), 'Quarterly Maintenance', 3, 'Full system inspection every 3 months'),
(uuid_generate_v4(), 'Six-Monthly Maintenance', 6, 'Comprehensive inspection every 6 months'),
(uuid_generate_v4(), 'Annual Maintenance', 12, 'Full system service annually'),
(uuid_generate_v4(), 'Ad-hoc Services', NULL, 'One-off repairs and installations');

INSERT INTO job_types (id, name, priority, sla_hours, default_estimated_hours) VALUES
(uuid_generate_v4(), 'Emergency Repair', 'emergency', 4, 2.0),
(uuid_generate_v4(), 'Routine Maintenance', 'medium', 48, 3.0),
(uuid_generate_v4(), 'Installation Project', 'low', 168, 8.0),
(uuid_generate_v4(), 'System Inspection', 'medium', 72, 4.0),
(uuid_generate_v4(), 'Defect Resolution', 'high', 24, 2.5);

-- Create admin user (password: admin123)
INSERT INTO users (id, email, password_hash, first_name, last_name, role) VALUES
(uuid_generate_v4(), 'admin@firelinksystem.com', '$2b$12$LQv3c1yqBWVHxkd0L8k7COYz6RZIqMgZL7D5Q39UcKTp7uWsrL0O6', 'FireLink', 'Admin', 'admin');
