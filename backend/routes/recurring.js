const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// GET all recurring transactions - Protected
router.get('/', protect, async (req, res) => {
  try {
    // Only return recurring transactions for the authenticated user
    const recurringTransactions = await Transaction.find({ 
      isRecurring: true,
      user: req.user._id
    });
    res.json(recurringTransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET recurring transactions by pattern - Protected
router.get('/:pattern', protect, async (req, res) => {
  try {
    const pattern = req.params.pattern;
    const recurringTransactions = await Transaction.find({
      isRecurring: true,
      recurringPattern: pattern,
      user: req.user._id  // Only for the authenticated user
    });
    res.json(recurringTransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create recurring transaction - Protected
router.post('/', protect, async (req, res) => {
  try {
    // Ensure isRecurring is true when creating recurring transactions
    // Also associate with authenticated user
    const transactionData = {
      ...req.body,
      isRecurring: true,
      user: req.user._id  // Associate with authenticated user
    };
    
    const transaction = new Transaction(transactionData);
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update recurring transaction - Protected
router.put('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // Ensure user owns the transaction
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: 'Recurring transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE recurring transaction - Protected
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // Ensure user owns the transaction
      { isRecurring: false }, // Instead of deleting, we just mark as non-recurring
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: 'Recurring transaction not found' });
    }
    res.json({ message: 'Recurring transaction cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;