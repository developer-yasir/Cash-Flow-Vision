const express = require('express');
const router = express.Router();
const {
  createRecurringExpense,
  getRecurringExpenses,
  getRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense
} = require('../controllers/recurring');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createRecurringExpense)
  .get(protect, getRecurringExpenses);

router.route('/:id')
  .get(protect, getRecurringExpense)
  .put(protect, updateRecurringExpense)
  .delete(protect, deleteRecurringExpense);

module.exports = router;