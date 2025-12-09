import React from 'react';

const Dashboard = ({ expenses }) => {
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // Get recent expenses (last 5)
  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="dashboard-container">
      <div className="dashboard-summary">
        <div className="summary-card total-expenses">
          <h3>Total Expenses</h3>
          <p>${totalExpenses.toFixed(2)}</p>
        </div>

        <div className="summary-card expense-count">
          <h3>Number of Expenses</h3>
          <p>{expenses.length}</p>
        </div>
      </div>

      {Object.keys(expensesByCategory).length > 0 && (
        <div className="category-breakdown">
          <h3>Expenses by Category</h3>
          <div className="category-list">
            {Object.entries(expensesByCategory).map(([category, amount]) => (
              <div key={category} className="category-item">
                <span>{category}:</span>
                <span>${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentExpenses.length > 0 && (
        <div className="recent-expenses">
          <h3>Recent Expenses</h3>
          <div className="recent-expense-list">
            {recentExpenses.map(expense => (
              <div key={expense._id} className="recent-expense-item">
                <span>{expense.description}</span>
                <span>${expense.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;