import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { exportCSV, expenseAPI } from '../utils/api';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'expense', 'income'
  const [categories] = useState([
    'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare',
    'Salary', 'Freelance', 'Investment', 'Gift', 'Other'
  ]);

  useEffect(() => {
    fetchTransactions();
  }, [activeTab]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let response;
      if (activeTab === 'expense' || activeTab === 'income') {
        response = await expenseAPI.getExpensesByType(activeTab);
      } else {
        response = await expenseAPI.getExpenses();
      }
      if (response) {
        setTransactions(Array.isArray(response.transactions) ? response.transactions : response);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
      toast.error('Failed to fetch transactions.');
    }
  };

  const addTransaction = (transaction) => {
    const promise = expenseAPI.createExpense(transaction).then(response => {
      if (response) {
        setTransactions(prev => [response, ...prev]);
        return 'Transaction added successfully!';
      }
      throw new Error('Failed to add transaction.');
    });

    toast.promise(promise, {
      loading: 'Adding transaction...',
      success: (message) => message,
      error: (err) => err.message,
    });
  };

  const deleteTransaction = (id) => {
    const promise = expenseAPI.deleteExpense(id).then(response => {
      if (response) {
        setTransactions(prev => prev.filter(t => t._id !== id));
        return 'Transaction deleted successfully!';
      }
      throw new Error('Failed to delete transaction.');
    });

    toast.promise(promise, {
      loading: 'Deleting transaction...',
      success: (message) => message,
      error: (err) => err.message,
    });
  };

  const handleExport = () => {
    exportCSV(activeTab !== 'all' ? activeTab : null);
    toast.success('Export started!');
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading transactions...</div>;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        <p className="text-gray-600">Add, view, and manage your expenses and income.</p>
      </div>

      {/* Transaction Form */}
      <div className="mb-8">
        <TransactionForm
          onSubmit={addTransaction}
          categories={categories}
        />
      </div>

      {/* Transaction List with Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">History</h2>
          <div className="flex items-center gap-4">
            {/* Filter Tabs */}
            <div className="flex gap-2">
              <button onClick={() => setActiveTab('all')} className={`px-3 py-1 text-sm rounded-md ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>All</button>
              <button onClick={() => setActiveTab('expense')} className={`px-3 py-1 text-sm rounded-md ${activeTab === 'expense' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Expenses</button>
              <button onClick={() => setActiveTab('income')} className={`px-3 py-1 text-sm rounded-md ${activeTab === 'income' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Income</button>
            </div>
            <button onClick={handleExport} className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700">Export</button>
            <button onClick={fetchTransactions} className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700">Refresh</button>
          </div>
        </div>
        <TransactionList
          transactions={transactions}
          onDelete={deleteTransaction}
        />
      </div>
    </div>
  );
};

export default TransactionsPage;