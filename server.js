import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory database for MVP
let transactions = [
  { id: 1, type: 'income', amount: 5000, category: 'Salary', date: '2023-10-01', description: 'Monthly Salary' },
  { id: 2, type: 'expense', amount: 150, category: 'Food', date: '2023-10-02', description: 'Groceries' },
];

// Get all transactions
app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

// Add a new transaction
app.post('/api/transactions', (req, res) => {
  const { type, amount, category, date, description } = req.body;
  if (!type || !amount || !category || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newTransaction = {
    id: Date.now(),
    type,
    amount: parseFloat(amount),
    category,
    date,
    description: description || ''
  };

  transactions.push(newTransaction);
  // Sort by date descending
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  res.status(201).json(newTransaction);
});

// Delete a transaction
app.delete('/api/transactions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = transactions.length;
  transactions = transactions.filter(t => t.id !== id);
  
  if (transactions.length < initialLength) {
    res.json({ message: 'Transaction deleted successfully' });
  } else {
    res.status(404).json({ error: 'Transaction not found' });
  }
});

// Get summary for the current month
app.get('/api/summary', (req, res) => {
  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    if (t.type === 'income') {
      income += t.amount;
    } else if (t.type === 'expense') {
      expense += t.amount;
    }
  });

  const balance = income - expense;
  res.json({ totalIncome: income, totalExpense: expense, balance });
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
