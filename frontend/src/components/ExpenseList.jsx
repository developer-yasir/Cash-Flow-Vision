import React from 'react';
import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">No expenses recorded yet. Add your first expense!</p>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map(expense => (
        <ExpenseItem
          key={expense._id}
          expense={expense}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ExpenseList;