const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// GET all budgets - Protected
router.get('/', protect, async (req, res) => {
  try {
    // Only return budgets for the authenticated user
    const budgets = await Budget.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single budget - Protected
router.get('/:id', protect, async (req, res) => {
  try {
    // Only return budget if it belongs to the authenticated user
    const budget = await Budget.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new budget - Protected
router.post('/', protect, async (req, res) => {
  try {
    const budgetData = { 
      ...req.body,
      user: req.user._id  // Associate budget with authenticated user
    };

    const budget = new Budget(budgetData);
    const savedBudget = await budget.save();

    // Update any existing transactions that match this budget's category for this user
    await Transaction.updateMany(
      { 
        category: budget.category,
        user: req.user._id  // Only update transactions for the authenticated user
      },
      { budgetId: savedBudget._id }
    );

    res.status(201).json(savedBudget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT (update) budget - Protected
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // Ensure user owns the budget
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBudget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json(updatedBudget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE budget - Protected
router.delete('/:id', protect, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id  // Ensure user owns the budget
    });
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Remove budgetId from related transactions for this user
    await Transaction.updateMany(
      { 
        budgetId: req.params.id,
        user: req.user._id  // Only update transactions for the authenticated user
      },
      { $unset: { budgetId: 1 } }
    );

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET budget summary for a specific category - Protected
router.get('/summary/:category', protect, async (req, res) => {
  try {
    const category = req.params.category;
    // Only return budgets for the authenticated user
    const budgets = await Budget.find({ 
      category,
      user: req.user._id 
    });

    if (!budgets.length) {
      return res.json({ message: 'No budgets found for this category' });
    }

    // For each budget, calculate how much has been spent in the budget period
    const budgetSummaries = await Promise.all(budgets.map(async (budget) => {
      // Define the date range for the current period based on the budget's period
      const now = new Date();
      let startDate = new Date(budget.startDate);
      let endDate = new Date(budget.endDate);

      // For monthly budgets, we should calculate the spending for the current month
      if (budget.period === 'monthly') {
        // Use the current month and year for comparison
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        startDate = new Date(currentYear, currentMonth, 1);
        endDate = new Date(currentYear, currentMonth + 1, 0);
      }

      // Calculate the total spending for this budget category in the current period for this user
      const transactions = await Transaction.find({
        category: budget.category,
        type: 'expense',
        user: req.user._id,  // Only transactions for the authenticated user
        date: { $gte: startDate, $lte: endDate }
      });

      const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        ...budget.toObject(),
        spent: totalSpent,
        remaining: budget.amount - totalSpent,
        percentage: (totalSpent / budget.amount) * 100
      };
    }));

    res.json(budgetSummaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;