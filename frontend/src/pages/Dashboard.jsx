import React, { useState, useEffect } from 'react';
import { budgetAPI, expenseAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const trans = await expenseAPI.getExpenses();
        if (trans) {
          setTransactions(Array.isArray(trans.transactions) ? trans.transactions : trans);
        }

        const budgets = await budgetAPI.getBudgets();
        if (budgets) {
          // The budget calculation logic requires transactions, so it runs after fetching them.
          const transData = Array.isArray(trans.transactions) ? trans.transactions : trans;
          const budgetSummaries = budgets.map(budget => {
            const categoryTransactions = transData.filter(t => 
              t.category === budget.category && 
              t.type === 'expense' && 
              new Date(t.date) >= new Date(budget.startDate) && 
              new Date(t.date) <= new Date(budget.endDate)
            );
            const totalSpent = categoryTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
            return {
              ...budget,
              spent: totalSpent,
              remaining: budget.amount - totalSpent,
              percentage: budget.amount > 0 ? (totalSpent / budget.amount) * 100 : 0
            };
          });
          setBudgetSummary(budgetSummaries);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total expenses and income
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const netCashFlow = totalIncome - totalExpenses;

  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);
  
  const transactionsByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
  }, {});

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading Dashboard...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">Total Income</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className={`bg-gradient-to-r p-6 rounded-lg shadow border-l-4 ${netCashFlow >= 0 ? 'from-green-50 to-green-100 border-green-500' : 'from-red-50 to-red-100 border-red-500'}`}>
          <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">Net Cash Flow</h3>
          <p className={`text-3xl font-bold mt-2 ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>${netCashFlow.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-lg shadow border-l-4 border-indigo-500">
          <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">Transactions</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{transactions.length}</p>
        </div>
      </div>
      
      {/* Budget Summary Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Budget Tracking</h3>
        {budgetSummary.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetSummary.map(budget => (
              <div key={budget._id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-800">{budget.name}</h4>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{budget.category}</span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>${budget.spent.toFixed(2)} of ${budget.amount.toFixed(2)}</span>
                    <span>{budget.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${budget.percentage >= 90 ? 'bg-red-500' : budget.percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min(budget.percentage, 100)}%` }}></div>
                  </div>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-green-600">Spent: ${budget.spent.toFixed(2)}</span>
                  <span className={budget.remaining >= 0 ? 'text-blue-600' : 'text-red-600'}>Remaining: ${budget.remaining.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700">
            <p>No budgets set. Create a budget to start tracking your spending!</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Transactions by Category</h3>
          <div className="space-y-3">
            {Object.entries(transactionsByCategory).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">{category}</span>
                <span className="font-medium">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map(transaction => (
              <div key={transaction._id} className={`flex justify-between items-center p-3 rounded-lg ${transaction.type === 'income' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div>
                  <p className="font-medium text-gray-800">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
                <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;