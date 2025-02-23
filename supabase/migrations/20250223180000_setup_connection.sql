
-- Set up connection parameters
ALTER SYSTEM SET listen_addresses TO '*';

-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure the database exists
CREATE DATABASE IF NOT EXISTS app_db;

-- Connect to the app database
\c app_db;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
