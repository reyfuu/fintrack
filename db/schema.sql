-- Fintrack database schema
-- Apply with the UNPOOLED (direct) Neon connection string, not the -pooler host:
--   psql "$DATABASE_URL_UNPOOLED" -f db/schema.sql
--
-- The wallet column was originally bolted on with ALTER TABLE; it is folded into
-- CREATE TABLE here because the Neon database is provisioned fresh.

CREATE TABLE IF NOT EXISTS transactions (
  id          BIGSERIAL     PRIMARY KEY,
  type        VARCHAR(10)   NOT NULL CHECK (type IN ('income', 'expense')),
  amount      NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  category    VARCHAR(100)  NOT NULL,
  date        DATE          NOT NULL,
  description TEXT          DEFAULT '',
  wallet      VARCHAR(10)   NOT NULL DEFAULT 'cash' CHECK (wallet IN ('cash', 'digital')),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Sort/filter by date is the dashboard's hot path; type and wallet back the filters.
CREATE INDEX IF NOT EXISTS idx_transactions_date   ON transactions (date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type   ON transactions (type);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions (wallet);
