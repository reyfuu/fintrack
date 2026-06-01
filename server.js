import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './server/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────
//  GET /api/transactions
//  Optional query: ?month=2025-10 (YYYY-MM)
// ─────────────────────────────────────────────
app.get('/api/transactions', async (req, res) => {
  try {
    const { month } = req.query;
    let query = 'SELECT * FROM transactions';
    const params = [];

    if (month) {
      // Filter by month, e.g. "2025-10"
      query += ` WHERE TO_CHAR(date, 'YYYY-MM') = $1`;
      params.push(month);
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/transactions error:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// ─────────────────────────────────────────────
//  POST /api/transactions
// ─────────────────────────────────────────────
app.post('/api/transactions', async (req, res) => {
  try {
    const { type, amount, category, date, description } = req.body;

    if (!type || !amount || !category || !date) {
      return res.status(400).json({ error: 'Field type, amount, category, dan date wajib diisi.' });
    }
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Type harus income atau expense.' });
    }
    if (parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Amount harus lebih dari 0.' });
    }

    const result = await pool.query(
      `INSERT INTO transactions (type, amount, category, date, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [type, parseFloat(amount), category.trim(), date, description?.trim() || '']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/transactions error:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// ─────────────────────────────────────────────
//  PUT /api/transactions/:id  (edit transaksi)
// ─────────────────────────────────────────────
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { type, amount, category, date, description } = req.body;

    if (!type || !amount || !category || !date) {
      return res.status(400).json({ error: 'Field type, amount, category, dan date wajib diisi.' });
    }

    const result = await pool.query(
      `UPDATE transactions
       SET type=$1, amount=$2, category=$3, date=$4, description=$5
       WHERE id=$6
       RETURNING *`,
      [type, parseFloat(amount), category.trim(), date, description?.trim() || '', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /api/transactions/:id error:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// ─────────────────────────────────────────────
//  DELETE /api/transactions/:id
// ─────────────────────────────────────────────
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query(
      'DELETE FROM transactions WHERE id=$1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan.' });
    }

    res.json({ message: 'Transaksi berhasil dihapus.', id: result.rows[0].id });
  } catch (err) {
    console.error('DELETE /api/transactions/:id error:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// ─────────────────────────────────────────────
//  GET /api/summary
//  Optional query: ?month=2025-10  (default: semua waktu)
// ─────────────────────────────────────────────
app.get('/api/summary', async (req, res) => {
  try {
    const { month } = req.query;
    let baseWhere = '';
    const params = [];

    if (month) {
      baseWhere = `WHERE TO_CHAR(date, 'YYYY-MM') = $1`;
      params.push(month);
    }

    const result = await pool.query(
      `SELECT
         COALESCE(SUM(CASE WHEN type='income'  THEN amount ELSE 0 END), 0) AS "totalIncome",
         COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END), 0) AS "totalExpense"
       FROM transactions ${baseWhere}`,
      params
    );

    const { totalIncome, totalExpense } = result.rows[0];
    res.json({
      totalIncome:  parseFloat(totalIncome),
      totalExpense: parseFloat(totalExpense),
      balance:      parseFloat(totalIncome) - parseFloat(totalExpense),
    });
  } catch (err) {
    console.error('GET /api/summary error:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// ─────────────────────────────────────────────
//  GET /api/summary/monthly  – ringkasan per bulan (untuk chart)
// ─────────────────────────────────────────────
app.get('/api/summary/monthly', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         TO_CHAR(date, 'YYYY-MM') AS month,
         COALESCE(SUM(CASE WHEN type='income'  THEN amount ELSE 0 END), 0) AS income,
         COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END), 0) AS expense
       FROM transactions
       GROUP BY TO_CHAR(date, 'YYYY-MM')
       ORDER BY month DESC
       LIMIT 12`
    );

    res.json(result.rows.map(r => ({
      month:   r.month,
      income:  parseFloat(r.income),
      expense: parseFloat(r.expense),
      balance: parseFloat(r.income) - parseFloat(r.expense),
    })));
  } catch (err) {
    console.error('GET /api/summary/monthly error:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Fintrack API running on http://localhost:${PORT}`);
});
