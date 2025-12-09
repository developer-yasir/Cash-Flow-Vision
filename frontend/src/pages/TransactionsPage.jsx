import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import RecurringTransactionsList from '../components/RecurringTransactionsList'; // New import
import { exportCSV, expenseAPI, recurringAPI } from '../utils/api'; // Updated import

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [recurringExpenses, setRecurringExpenses] = useState([]); // New state
  const [loading, setLoading] = useState(true);
  const [activeTransactionTab, setActiveTransactionTab] = useState('all'); // 'all', 'expense', 'income'
  const [activeHistoryTab, setActiveHistoryTab] = useState('transactions'); // 'transactions' or 'recurring'
  const [categories] = useState([
    'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare',
    'Salary', 'Freelance', 'Investment', 'Gift', 'Other'
  ]);

  useEffect(() => {
    fetchData();
  }, [activeTransactionTab, activeHistoryTab]); // Re-fetch on tab change

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeHistoryTab === 'transactions') {
        let response;
        if (activeTransactionTab === 'expense' || activeTransactionTab === 'income') {
          response = await expenseAPI.getExpensesByType(activeTransactionTab);
        } else {
          response = await expenseAPI.getExpenses();
        }
        if (response) {
          setTransactions(Array.isArray(response.transactions) ? response.transactions : response);
        }
      } else if (activeHistoryTab === 'recurring') {
        const response = await recurringAPI.getRecurringExpenses();
        if (response) {
          setRecurringExpenses(Array.isArray(response.data) ? response.data : []);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      toast.error('Failed to fetch data.');
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

  const handleAddRecurringExpense = (recurringData) => { // New function
    const promise = recurringAPI.createRecurring(recurringData).then(response => {
      if (response) {
        setRecurringExpenses(prev => [response.data, ...prev]);
        setActiveHistoryTab('recurring'); // Switch to recurring tab after adding
        return 'Recurring expense added successfully!';
      }
      throw new Error('Failed to add recurring expense.');
    });

    toast.promise(promise, {
      loading: 'Adding recurring expense...',
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

  const handleDeleteRecurringExpense = (id) => { // New function
    const promise = recurringAPI.deleteRecurring(id).then(response => {
      if (response) {
        setRecurringExpenses(prev => prev.filter(re => re._id !== id));
        return 'Recurring expense deleted successfully!';
      }
      throw new Error('Failed to delete recurring expense.');
    });

    toast.promise(promise, {
      loading: 'Deleting recurring expense...',
      success: (message) => message,
      error: (err) => err.message,
    });
  };

  const handleExport = () => {
    exportCSV(activeTransactionTab !== 'all' ? activeTransactionTab : null);
    toast.success('Export started!');
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
        <p className="text-gray-600">Add, view, and manage your expenses and income.</p>
      </div>

      {/* Transaction Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <TransactionForm
          onAddTransaction={addTransaction}
          onAddRecurringExpense={handleAddRecurringExpense} // New prop
          categories={categories}
        />
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">History</h2>
          <div className="flex items-center gap-4">
            {/* History Type Tabs (Transactions/Recurring) */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-md">
                <button
                    onClick={() => setActiveHistoryTab('transactions')}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${activeHistoryTab === 'transactions' ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
                >
                    Transactions
                </button>
                <button
                    onClick={() => setActiveHistoryTab('recurring')}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${activeHistoryTab === 'recurring' ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
                >
                    Recurring
                </button>
            </div>
            
            {activeHistoryTab === 'transactions' && (
                <div className="flex gap-2">
                    <button onClick={() => setActiveTransactionTab('all')} className={`px-3 py-1 text-sm rounded-md ${activeTransactionTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>All</button>
                    <button onClick={() => setActiveTransactionTab('expense')} className={`px-3 py-1 text-sm rounded-md ${activeTransactionTab === 'expense' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Expenses</button>
                    <button onClick={() => setActiveTransactionTab('income')} className={`px-3 py-1 text-sm rounded-md ${activeTransactionTab === 'income' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Income</button>
                </div>
            )}
            
            <button onClick={fetchData} className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700">Refresh</button>
          </div>
        </div>

        {loading ? (
            <div className="text-center py-8 text-gray-600">Loading history...</div>
        ) : (
            <>
                {activeHistoryTab === 'transactions' ? (
                    <TransactionList
                        transactions={transactions}
                        onDelete={deleteTransaction}
                    />
                ) : (
                    <RecurringTransactionsList
                        recurringExpenses={recurringExpenses}
                        onDeleteRecurring={handleDeleteRecurringExpense}
                    />
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;