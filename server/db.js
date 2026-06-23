import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Pastikan load .env dari root project (bukan dari CWD yang bisa berubah)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const { Pool } = pg;

// Snapshot nilai env sekarang — sebelum dotenvx sempat override ulang
const DB_HOST     = process.env.DB_HOST     || 'localhost';
const DB_PORT     = parseInt(process.env.DB_PORT) || 5432;
const DB_NAME     = process.env.DB_NAME     || 'fintrack';
const DB_USER     = process.env.DB_USER     || 'audi';
const DB_PASSWORD = process.env.DB_PASSWORD || '090393';

const pool = new Pool({
  host:     DB_HOST,
  port:     DB_PORT,
  database: DB_NAME,
  user:     DB_USER,
  password: DB_PASSWORD,
});

// Test koneksi saat startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Gagal terkoneksi ke PostgreSQL:', err.message);
    return;
  }
  release();
  console.log('✅ Terkoneksi ke PostgreSQL database:', process.env.DB_NAME || 'fintrack');
});

export default pool;
