const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getSpendingByCategory, getCashFlow } = require('../controllers/analytics');

// @route   GET /api/analytics/spending-by-category
// @desc    Get spending by category for the authenticated user
// @access  Private
router.get('/spending-by-category', protect, getSpendingByCategory);

// @route   GET /api/analytics/cash-flow
// @desc    Get cash flow (total income vs. total expenses) for the authenticated user
// @access  Private
router.get('/cash-flow', protect, getCashFlow);

module.exports = router;