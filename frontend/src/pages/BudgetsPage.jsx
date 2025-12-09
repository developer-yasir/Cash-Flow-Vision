import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import BudgetForm from '../components/BudgetForm';
import BudgetList from '../components/BudgetList';
import BudgetOverview from '../components/BudgetOverview';
import { budgetAPI, expenseAPI } from '../utils/api';

const BudgetsPage = () => {
  const [budgetSummary, setBudgetSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('manage');
  const [categories] = useState([
    'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare',
    'Salary', 'Freelance', 'Investment', 'Gift', 'Other'
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [budgetResponse, transactionResponse] = await Promise.all([
        budgetAPI.getBudgets(),
        expenseAPI.getExpenses()
      ]);

      const budgetsData = Array.isArray(budgetResponse) ? budgetResponse : [];
      const transactions = Array.isArray(transactionResponse.transactions) ? transactionResponse.transactions : (transactionResponse || []);

      const budgetSummaries = budgetsData.map(budget => {
        const categoryTransactions = transactions.filter(t =>
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
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch budgets and transactions.');
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetAdded = () => {
    fetchData();
    setActiveTab('manage');
    toast.success('Budget created successfully!');
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Budgets</h1>
        <p className="text-gray-600">Set and manage your spending limits.</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading...</div>
      ) : (
        <>
          {budgetSummary.length > 0 && <BudgetOverview budgets={budgetSummary} />}
          
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('manage')}
              className={`py-2 px-4 font-medium text-sm rounded-t-lg ${activeTab === 'manage' ? 'border-b-2 border-blue-600 text-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            >
              Manage Budgets
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-4 font-medium text-sm rounded-t-lg ${activeTab === 'create' ? 'border-b-2 border-blue-600 text-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            >
              Create Budget
            </button>
          </div>

          <div>
            {activeTab === 'create' && (
              <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a New Budget</h2>
                <BudgetForm
                  onBudgetAdded={handleBudgetAdded}
                  categories={categories}
                />
              </div>
            )}

            {activeTab === 'manage' && (
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">My Budgets</h2>
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Refresh
                  </button>
                </div>
                <BudgetList
                  budgets={budgetSummary}
                  categories={categories}
                  onRefresh={handleRefresh}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetsPage;
