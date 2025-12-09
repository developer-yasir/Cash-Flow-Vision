import React from 'react';
import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="expense-list-container">
        <h2>Your Expenses</h2>
        <p>No expenses recorded yet. Add your first expense!</p>
      </div>
    );
  }

  return (
    <div className="expense-list-container">
      <h2>Your Expenses</h2>
      <div className="expense-list">
        {expenses.map(expense => (
          <ExpenseItem
            key={expense._id}
            expense={expense}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;