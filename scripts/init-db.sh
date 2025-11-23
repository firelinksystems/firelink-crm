#!/bin/bash
set -e

# Initialize database with extensions and basic setup
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    
    -- Create additional users or roles if needed
    -- GRANT specific permissions here
    
    -- Log initialization
    SELECT 'Database initialized successfully' as status;
EOSQL
