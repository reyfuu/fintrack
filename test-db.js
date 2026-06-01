import dotenv from 'dotenv';
import pool from './server/db.js';

// Load .env configuration
dotenv.config();

async function runTest() {
  try {
    console.log('Testing saving data to database...');

    // 1. Insert a transaction
    const insertQuery = `
      INSERT INTO transactions (type, amount, category, date, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = ['income', 150000.00, 'Gaji/Salary', '2026-06-01', 'Gaji bulanan test db.js'];

    const insertResult = await pool.query(insertQuery, values);
    const newTransaction = insertResult.rows[0];
    console.log('✅ Success saving data!');
    console.log('Saved Transaction:', newTransaction);

    // 2. Fetch/Query the transactions
    const selectResult = await pool.query('SELECT * FROM transactions ORDER BY id DESC LIMIT 1;');
    console.log('✅ Success fetching data!');
    console.log('Latest Transaction in Database:', selectResult.rows[0]);

  } catch (err) {
    console.error('❌ Database operation failed:', err.message);
  } finally {
    // End the pool connection so script terminates
    await pool.end();
    console.log('Database pool closed.');
  }
}

runTest();
