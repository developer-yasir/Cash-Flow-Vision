import React from 'react';
import moment from 'moment'; // Using moment for consistent date formatting

const TransactionItem = ({ transaction, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this ${transaction.type}: ${transaction.description}?`)) {
      onDelete(transaction._id);
    }
  };

  const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
    'INR': '₹',
    'CNY': '¥',
    'PKR': 'Rs'
  };

  const symbol = currencySymbols[transaction.currency] || transaction.currency;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center hover:shadow-md transition-shadow duration-200 mb-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-800 text-lg truncate">{transaction.description}</h3>
          {transaction.isRecurring && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Recurring ({transaction.recurringPattern})
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-1">
          <span className="inline-flex items-center">
            <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {moment(transaction.date).format('MMMM Do, YYYY')}
          </span>
          <span className="inline-flex items-center">
            <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {transaction.category}
          </span>
        </div>
        {transaction.receipt && (
          <div className="mt-2">
            <a
              href={`http://localhost:5000${transaction.receipt}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              View Receipt
            </a>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 ml-4">
        <span className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
          {transaction.type === 'income' ? '+' : '-'}{symbol}{transaction.amount.toFixed(2)}
        </span>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-600 focus:outline-none transition-colors"
          title="Delete Transaction"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;