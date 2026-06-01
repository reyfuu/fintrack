-- Fintrack Database Schema
-- Run: psql -U postgres -d fintrack -f server/schema.sql

CREATE TABLE IF NOT EXISTS transactions (
  id          BIGSERIAL     PRIMARY KEY,
  type        VARCHAR(10)   NOT NULL CHECK (type IN ('income', 'expense')),
  amount      NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  category    VARCHAR(100)  NOT NULL,
  date        DATE          NOT NULL,
  description TEXT          DEFAULT '',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Index untuk mempercepat sort dan filter by date
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions (type);
