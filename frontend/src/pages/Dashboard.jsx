import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { budgetAPI, expenseAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import TopBudgets from '../components/TopBudgets';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [trans, budgets] = await Promise.all([
          expenseAPI.getExpenses(),
          budgetAPI.getBudgets(),
        ]);

        const transData = Array.isArray(trans?.transactions) ? trans.transactions : (trans || []);
        setTransactions(transData);

        if (budgets) {
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
        toast.error('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const netCashFlow = totalIncome - totalExpenses;
  const recentTransactions = transactions.slice(0, 5);
  
  const transactionsByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
  }, {});

  if (loading) {
    return <div className="text-center py-10 text-gray-600 dark:text-gray-400">Loading Dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen dark:bg-gray-900 dark:text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Welcome, {user?.name || 'User'}!</h1>
        <p className="text-gray-600 dark:text-gray-300">Here's your financial overview for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Summary Cards */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800 dark:text-gray-100 dark:shadow-none">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Spending by Category</h3>
            {Object.keys(transactionsByCategory).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(transactionsByCategory).map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <span className="text-gray-700 dark:text-gray-200">{category}</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">${amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-500 dark:text-gray-400">No spending data available.</p>}
          </div>
        </div>
        <div className="space-y-8">
          <TopBudgets budgets={budgetSummary} />
          <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800 dark:text-gray-100 dark:shadow-none">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Transactions</h3>
            {recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map(t => (
                  <div key={t._id} className={`flex items-center justify-between p-3 rounded-lg ${t.type === 'income' ? 'bg-green-50 dark:bg-green-800 dark:text-green-100' : 'bg-red-50 dark:bg-red-800 dark:text-red-100'}`}>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-100">{t.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-300">{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`font-bold ${t.type === 'income' ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-500 dark:text-gray-400">No recent transactions.</p>}
            <div className="mt-6 text-center">
              <Link to="/transactions" className="text-blue-600 hover:underline dark:text-blue-400">View All</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;