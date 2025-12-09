import React from 'react';
import TransactionItem from './TransactionItem';

const TransactionList = ({ transactions, onDelete, onRefresh }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Transactions</h2>
          <p className="text-gray-600">No transactions recorded yet. Add your first transaction!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Transactions</h2>
        <button
          onClick={onRefresh}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>
      <div className="divide-y divide-gray-100">
        {transactions.map(transaction => (
          <TransactionItem
            key={transaction._id}
            transaction={transaction}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TransactionList;