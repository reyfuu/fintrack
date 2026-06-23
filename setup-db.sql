-- ============================================
--  Fintrack - PostgreSQL Setup Script
--  User: audi | Password: 090393
-- ============================================

-- 1. Buat user audi jika belum ada
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'audi') THEN
    CREATE ROLE audi WITH LOGIN PASSWORD '090393';
    RAISE NOTICE 'User audi berhasil dibuat.';
  ELSE
    -- Update password jika user sudah ada
    ALTER ROLE audi WITH LOGIN PASSWORD '090393';
    RAISE NOTICE 'User audi sudah ada, password diupdate.';
  END IF;
END
$$;

-- 2. Buat database fintrack jika belum ada
SELECT 'CREATE DATABASE fintrack OWNER audi'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fintrack')\gexec

-- 3. Grant privileges
GRANT ALL PRIVILEGES ON DATABASE fintrack TO audi;
