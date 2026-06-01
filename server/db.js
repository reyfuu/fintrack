import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'fintrack',
  user: process.env.DB_USER || 'audi',
  password: process.env.DB_PASSWORD || '090393',
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
