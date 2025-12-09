const mongoose = require('mongoose');

const RecurringExpenseSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare',
      'Salary', 'Freelance', 'Investment', 'Gift', 'Other'
    ]
  },
  frequency: {
    type: String,
    required: [true, 'Frequency is required'],
    enum: ['daily', 'weekly', 'monthly', 'yearly']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    default: null
  },
  nextOccurrence: {
    type: Date,
    required: true
  },
  lastOccurrence: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RecurringExpense', RecurringExpenseSchema);