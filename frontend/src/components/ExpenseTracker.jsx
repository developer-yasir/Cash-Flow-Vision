import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import Dashboard from '../pages/Dashboard';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import { exportCSV, expenseAPI, recurringAPI } from '../utils/api';

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showBudgetSection, setShowBudgetSection] = useState(false);
  const [categories] = useState([
    'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare',
    'Salary', 'Freelance', 'Investment', 'Gift', 'Other'
  ]);

  // Fetch transactions from backend on component mount
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
    }
  };

  const addTransaction = async (transaction) => {
    try {
      const response = await expenseAPI.createExpense(transaction);
      if (response) {
        setTransactions([response, ...transactions]);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const response = await expenseAPI.deleteExpense(id);
      if (response) {
        setTransactions(transactions.filter(transaction => transaction._id !== id));
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  // Handle export with current filters
  const handleExport = () => {
    let type = null;
    if (activeTab !== 'all') {
      type = activeTab;
    }
    exportCSV(type, null, null, null);
  };

  // Handle export of specific category
  const handleExportCategory = (category) => {
    let type = null;
    if (activeTab !== 'all') {
      type = activeTab;
    }
    exportCSV(type, category, null, null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="text-xl text-gray-600">Loading transactions...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Cashflow Vision</h1>
          <p className="text-center text-blue-100 mt-2">Track and manage your expenses and income</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-lg shadow">
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Transactions
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'expense'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('expense')}
          >
            Expenses
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'income'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('income')}
          >
            Income
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              showBudgetSection
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setShowBudgetSection(!showBudgetSection)}
          >
            Budgets
          </button>
          <Link
            to="/analytics"
            className="px-4 py-2 rounded-md transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Analytics
          </Link>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg shadow">
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Export All {activeTab !== 'all' ? activeTab + ' ' : ''}Transactions
          </button>
          <div className="flex items-center gap-2">
            <span className="text-gray-700">Export by Category:</span>
            <select
              onChange={(e) => e.target.value && handleExportCategory(e.target.value)}
              defaultValue=""
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dashboard Section */}
        <div className="mb-8">
          <Dashboard transactions={transactions} />
        </div>

        {/* Transaction Form and List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <TransactionForm
              onSubmit={addTransaction}
              categories={categories}
            />
          </div>
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Transactions</h2>
                <button
                  onClick={fetchTransactions}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
              <TransactionList
                transactions={transactions}
                onDelete={deleteTransaction}
                categories={categories}
                onRefresh={fetchTransactions}
              />
            </div>
          </div>
        </div>

        {/* Budget Section */}
        {showBudgetSection && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <BudgetForm
              onBudgetAdded={() => {}}
              categories={categories}
              onRefresh={fetchTransactions}
            />
            <BudgetList
              categories={categories}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default ExpenseTracker;