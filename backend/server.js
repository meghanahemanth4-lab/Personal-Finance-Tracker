require('dotenv').config(); // Load .env variables ASAP

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import models
const Transaction = require('./models/Transaction');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB with debug info
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(`✅ MongoDB connected to: ${process.env.MONGO_URI}`))
  .catch(err => console.error('❌ MongoDB error:', err));

// Default route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// Import API routes
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categories');

// Use routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);

// Dashboard totals route
app.get('/api/dashboard/totals', async (req, res) => {
  try {
    const transactions = await Transaction.find();

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      else if (t.type === 'expense') totalExpenses += t.amount;
    });

    const balance = totalIncome - totalExpenses;

    res.json({ totalIncome, totalExpenses, balance });
  } catch (error) {
    console.error('Error fetching dashboard totals:', error);
    res.status(500).json({ message: 'Error retrieving dashboard totals' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started at: http://localhost:${PORT}`);
});
