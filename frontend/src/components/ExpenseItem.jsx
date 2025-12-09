import React from 'react';
import moment from 'moment'; // Using moment for consistent date formatting

const ExpenseItem = ({ expense, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this expense: ${expense.description}?`)) {
      onDelete(expense._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center hover:shadow-md transition-shadow duration-200 mb-3">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 text-lg">{expense.description}</h3>
        <p className="text-sm text-gray-500">{moment(expense.date).format('MMMM Do, YYYY')}</p>
        <p className="text-sm text-gray-600">Category: {expense.category}</p>
      </div>
      <div className="flex items-center">
        <p className="font-bold text-red-600 text-lg mr-4">-${expense.amount.toFixed(2)}</p>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 focus:outline-none"
          title="Delete Expense"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;