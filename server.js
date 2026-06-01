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
    const { month, wallet } = req.query;
    let query = 'SELECT * FROM transactions';
    const params = [];
    const conditions = [];

    if (month) {
      params.push(month);
      conditions.push(`TO_CHAR(date, 'YYYY-MM') = $${params.length}`);
    }

    if (wallet && ['cash', 'digital'].includes(wallet)) {
      params.push(wallet);
      conditions.push(`wallet = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
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
    const { type, amount, category, date, description, wallet } = req.body;

    if (!type || !amount || !category || !date) {
      return res.status(400).json({ error: 'Field type, amount, category, dan date wajib diisi.' });
    }
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Type harus income atau expense.' });
    }
    if (parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Amount harus lebih dari 0.' });
    }

    const walletValue = ['cash', 'digital'].includes(wallet) ? wallet : 'cash';

    const result = await pool.query(
      `INSERT INTO transactions (type, amount, category, date, description, wallet)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [type, parseFloat(amount), category.trim(), date, description?.trim() || '', walletValue]
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
    const { type, amount, category, date, description, wallet } = req.body;

    if (!type || !amount || !category || !date) {
      return res.status(400).json({ error: 'Field type, amount, category, dan date wajib diisi.' });
    }

    const walletValue = ['cash', 'digital'].includes(wallet) ? wallet : 'cash';

    const result = await pool.query(
      `UPDATE transactions
       SET type=$1, amount=$2, category=$3, date=$4, description=$5, wallet=$6
       WHERE id=$7
       RETURNING *`,
      [type, parseFloat(amount), category.trim(), date, description?.trim() || '', walletValue, id]
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
    const { month, wallet } = req.query;
    const conditions = [];
    const params = [];

    if (month) {
      params.push(month);
      conditions.push(`TO_CHAR(date, 'YYYY-MM') = $${params.length}`);
    }

    if (wallet && ['cash', 'digital'].includes(wallet)) {
      params.push(wallet);
      conditions.push(`wallet = $${params.length}`);
    }

    const baseWhere = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

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
//  GET /api/summary/wallets  – saldo per wallet
// ─────────────────────────────────────────────
app.get('/api/summary/wallets', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         wallet,
         COALESCE(SUM(CASE WHEN type='income'  THEN amount ELSE 0 END), 0) AS "totalIncome",
         COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END), 0) AS "totalExpense"
       FROM transactions
       GROUP BY wallet`
    );

    const summary = { cash: { totalIncome: 0, totalExpense: 0, balance: 0 }, digital: { totalIncome: 0, totalExpense: 0, balance: 0 } };
    result.rows.forEach(r => {
      const inc = parseFloat(r.totalIncome);
      const exp = parseFloat(r.totalExpense);
      summary[r.wallet] = { totalIncome: inc, totalExpense: exp, balance: inc - exp };
    });

    res.json(summary);
  } catch (err) {
    console.error('GET /api/summary/wallets error:', err);
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
