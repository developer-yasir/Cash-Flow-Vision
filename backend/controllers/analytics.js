const Transaction = require('../models/Transaction');

// @desc    Get spending by category for the authenticated user
// @route   GET /api/analytics/spending-by-category
// @access  Private
exports.getSpendingByCategory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = { user: req.user.id, type: 'expense' };

    if (startDate && endDate) {
      match.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const spendingByCategory = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    res.json(spendingByCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get cash flow (total income vs. total expenses) for the authenticated user
// @route   GET /api/analytics/cash-flow
// @access  Private
exports.getCashFlow = async (req, res) => {
  try {
    const { startDate, endDate, interval } = req.query; // interval could be 'daily', 'weekly', 'monthly'
    const match = { user: req.user.id };

    if (startDate && endDate) {
      match.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Determine the grouping key based on the interval
    let groupFormat;
    switch (interval) {
      case 'daily':
        groupFormat = { year: { $year: '$date' }, month: { $month: '$date' }, day: { $dayOfMonth: '$date' } };
        break;
      case 'weekly':
        groupFormat = { year: { $year: '$date' }, week: { $week: '$date' } };
        break;
      case 'monthly':
      default: // Default to monthly if no valid interval is provided
        groupFormat = { year: { $year: '$date' }, month: { $month: '$date' } };
        break;
    }

    const cashFlow = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: groupFormat,
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
            }
          },
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
            }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.week": 1 } }
    ]);

    res.json(cashFlow);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};