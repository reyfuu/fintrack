-- ============================================
--  Fintrack - Table Setup (jalankan di DB fintrack)
--  Connect: psql -U audi -d fintrack
-- ============================================

-- Tabel transactions
CREATE TABLE IF NOT EXISTS transactions (
  id          SERIAL PRIMARY KEY,
  type        VARCHAR(10)    NOT NULL CHECK (type IN ('income', 'expense')),
  amount      NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  category    VARCHAR(100)   NOT NULL,
  date        DATE           NOT NULL,
  description TEXT           DEFAULT '',
  wallet      VARCHAR(10)    NOT NULL DEFAULT 'cash' CHECK (wallet IN ('cash', 'digital')),
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Index untuk filter bulan dan wallet (performa query)
CREATE INDEX IF NOT EXISTS idx_transactions_date   ON transactions (date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions (wallet);

-- Grant akses ke user audi
GRANT ALL PRIVILEGES ON TABLE transactions TO audi;
GRANT USAGE, SELECT ON SEQUENCE transactions_id_seq TO audi;

-- Cek tabel berhasil dibuat
\d transactions
