import React from 'react';

const ExpenseItem = ({ expense, onDelete }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this expense: ${expense.description}?`)) {
      onDelete(expense._id);
    }
  };

  return (
    <div className="expense-item">
      <div className="expense-info">
        <h3>{expense.description}</h3>
        <p className="expense-date">{formatDate(expense.date)}</p>
        <p className="expense-category">Category: {expense.category}</p>
      </div>
      <div className="expense-amount-delete">
        <p className="expense-amount">${expense.amount.toFixed(2)}</p>
        <button
          onClick={handleDelete}
          className="delete-btn"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;