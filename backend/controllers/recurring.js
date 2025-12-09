const RecurringExpense = require('../models/RecurringExpense');
const Transaction = require('../models/Transaction'); // Import Transaction model

// Helper function to calculate next occurrence
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

// @desc    Create new recurring expense
// @route   POST /api/recurring
// @access  Private
const createRecurringExpense = async (req, res) => {
  try {
    const { description, amount, category, frequency, startDate, endDate } = req.body;

    const nextOccurrence = calculateNextOccurrence(startDate, frequency);

    const recurringExpense = await RecurringExpense.create({
      user: req.user.id,
      description,
      amount,
      category,
      frequency,
      startDate,
      endDate,
      nextOccurrence
    });

    res.status(201).json({
      success: true,
      data: recurringExpense
    });
  } catch (error) {
    console.error('Error creating recurring expense:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get all recurring expenses for user
// @route   GET /api/recurring
// @access  Private
const getRecurringExpenses = async (req, res) => {
  try {
    const recurringExpenses = await RecurringExpense.find({ user: req.user.id });
    res.status(200).json({
      success: true,
      data: recurringExpenses
    });
  } catch (error) {
    console.error('Error fetching recurring expenses:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single recurring expense by ID
// @route   GET /api/recurring/:id
// @access  Private
const getRecurringExpense = async (req, res) => {
  try {
    const recurringExpense = await RecurringExpense.findOne({ _id: req.params.id, user: req.user.id });

    if (!recurringExpense) {
      return res.status(404).json({ success: false, error: 'Recurring expense not found' });
    }

    res.status(200).json({
      success: true,
      data: recurringExpense
    });
  } catch (error) {
    console.error('Error fetching single recurring expense:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update recurring expense
// @route   PUT /api/recurring/:id
// @access  Private
const updateRecurringExpense = async (req, res) => {
  try {
    let recurringExpense = await RecurringExpense.findOne({ _id: req.params.id, user: req.user.id });

    if (!recurringExpense) {
      return res.status(404).json({ success: false, error: 'Recurring expense not found' });
    }

    const { description, amount, category, frequency, startDate, endDate } = req.body;

    // Recalculate nextOccurrence if startDate or frequency changes
    let updatedNextOccurrence = recurringExpense.nextOccurrence;
    if (startDate && new Date(startDate).getTime() !== recurringExpense.startDate.getTime() || frequency && frequency !== recurringExpense.frequency) {
        updatedNextOccurrence = calculateNextOccurrence(startDate || recurringExpense.startDate, frequency || recurringExpense.frequency);
    }


    recurringExpense = await RecurringExpense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        $set: {
          description,
          amount,
          category,
          frequency,
          startDate,
          endDate,
          nextOccurrence: updatedNextOccurrence
        }
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: recurringExpense
    });
  } catch (error) {
    console.error('Error updating recurring expense:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete recurring expense
// @route   DELETE /api/recurring/:id
// @access  Private
const deleteRecurringExpense = async (req, res) => {
  try {
    const recurringExpense = await RecurringExpense.findOne({ _id: req.params.id, user: req.user.id });

    if (!recurringExpense) {
      return res.status(404).json({ success: false, error: 'Recurring expense not found' });
    }

    await recurringExpense.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting recurring expense:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  createRecurringExpense,
  getRecurringExpenses,
  getRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense
};