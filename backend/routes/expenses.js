const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const RecurringExpense = require('../models/RecurringExpense'); // Added import
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');

// Helper function to calculate next occurrence (Moved to top)
const calculateNextOccurrence = (startDate, frequency) => {
    const date = new Date(startDate);
    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
    return date;
};

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// GET all transactions (expenses and income) - Protected
router.get('/', protect, async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Only return transactions for the authenticated user
    let filter = { user: req.user._id };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single transaction - Protected
router.get('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new transaction - Protected
router.post('/', protect, upload.single('receipt'), async (req, res) => {
  try {
    const { isRecurring, frequency, startDate, endDate, ...rest } = req.body;

    const transactionData = {
      ...rest,
      user: req.user._id,  // Associate transaction with authenticated user
    };

    // Add receipt file path if uploaded
    if (req.file) {
      transactionData.receipt = `/uploads/${req.file.filename}`;
    }

    // If it's a recurring expense, create an entry in RecurringExpense
    if (isRecurring) { 
      const nextOccurrence = calculateNextOccurrence(startDate, frequency);
      await RecurringExpense.create({
        user: req.user._id,
        description: transactionData.description,
        amount: transactionData.amount,
        category: transactionData.category,
        frequency,
        startDate,
        endDate,
        nextOccurrence,
      });
      // Do not set isRecurring or recurringPattern on the Transaction
      // as it represents a single instance of a potentially recurring item.
      // These fields will default to false/null in the Transaction model.
    }

    const transaction = new Transaction(transactionData);
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT (update) transaction - Protected
router.put('/:id', protect, upload.single('receipt'), async (req, res) => {
  try {
    const transactionData = { ...req.body };

    // Add receipt file path if uploaded
    if (req.file) {
      transactionData.receipt = `/uploads/${req.file.filename}`;
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // Ensure user owns the transaction
      transactionData,
      { new: true, runValidators: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE transaction - Protected
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id  // Ensure user owns the transaction
    });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET transactions by type (expense or income) - Protected
router.get('/type/:type', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      type: req.params.type,
      user: req.user._id  // Only return transactions for authenticated user
    })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET recurring transactions - Protected
router.get('/recurring/:pattern?', protect, async (req, res) => {
  try {
    const pattern = req.params.pattern;
    // Only return recurring transactions for the authenticated user
    const filter = {
      isRecurring: true,
      user: req.user._id
    };

    if (pattern) {
      filter.recurringPattern = pattern;
    }

    const recurringTransactions = await Transaction.find(filter);
    res.json(recurringTransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export transactions as CSV - Protected
router.get('/export/csv', protect, async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    // Only export transactions for the authenticated user
    let filter = { user: req.user._id };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    // Create CSV content
    const headers = ['ID', 'Description', 'Amount', 'Type', 'Category', 'Date', 'Currency', 'Receipt', 'Is Recurring', 'Recurring Pattern', 'Budget ID', 'Created At', 'Updated At'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(transaction => [
        transaction._id,
        `"${transaction.description.replace(/"/g, '""')}"`, // Escape quotes in description
        transaction.amount,
        transaction.type,
        transaction.category,
        transaction.date.toISOString().split('T')[0],
        transaction.currency,
        transaction.receipt || '',
        transaction.isRecurring,
        transaction.recurringPattern || '',
        transaction.budgetId || '',
        transaction.createdAt.toISOString().split('T')[0],
        transaction.updatedAt.toISOString().split('T')[0]
      ].join(','))
    ].join('\n');

    // Set headers for CSV download
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename=transactions.csv');

    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;