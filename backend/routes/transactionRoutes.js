const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Add a new transaction (POST /api/transactions)
router.post('/', async (req, res) => {
  try {
    const { name, amount, type, category } = req.body;

    if (!name || !amount || !type || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newTransaction = new Transaction({ name, amount, type, category });
    const savedTransaction = await newTransaction.save();

    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error while adding transaction' });
  }
});

// Get all transactions (GET /api/transactions)
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving transactions' });
  }
});

// Delete all transactions (DELETE /api/transactions/deleteAll)
router.delete('/deleteAll', async (req, res) => {
  try {
    const result = await Transaction.deleteMany({});
    res.json({ message: 'All transactions deleted', result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete transactions' });
  }
});

// **Delete single transaction by ID** (DELETE /api/transactions/:id)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
});

// **Update transaction by ID** (PUT /api/transactions/:id)
router.put('/:id', async (req, res) => {
  try {
    const { name, amount, type, category } = req.body;

    if (!name || !amount || !type || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { name, amount, type, category },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction updated successfully', transaction: updatedTransaction });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update transaction' });
  }
});

module.exports = router;
