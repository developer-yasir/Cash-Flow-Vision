const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['expense', 'income'],
    default: 'expense'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare',
      'Salary', 'Freelance', 'Investment', 'Gift', 'Other'
    ]
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'USD',
    uppercase: true
  },
  receipt: {
    type: String, // Path to receipt image
    default: null
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: null
  },
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);