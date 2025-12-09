import React, { useState, useEffect } from 'react';
import { analyticsAPI, budgetAPI } from '../utils/api';
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF69B4', '#ADFF2F', '#87CEEB', '#FF6347', '#4682B4'];

const AnalyticsPage = () => {
  const [spendingByCategory, setSpendingByCategory] = useState([]);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [budgetsForPeriod, setBudgetsForPeriod] = useState([]); // New state for filtered budgets
  const [budgetVsActualData, setBudgetVsActualData] = useState([]); // New state for budget vs actual chart
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interval, setInterval] = useState('monthly'); // 'daily', 'weekly', 'monthly'


  useEffect(() => {
    fetchAnalyticsData();
  }, [startDate, endDate, interval]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const categoryData = await analyticsAPI.getSpendingByCategory({ startDate, endDate });
      if (categoryData) {
        setSpendingByCategory(categoryData);
      }

      const flowData = await analyticsAPI.getCashFlow({ startDate, endDate, interval });
      if (flowData) {
        // Format cash flow data for recharts
        const formattedFlowData = flowData.map(item => ({
          name: `${item._id.year}-${item._id.month}${item._id.day ? `-${item._id.day}` : ''}`,
          income: item.totalIncome,
          expenses: item.totalExpenses,
          net: item.totalIncome - item.totalExpenses,
        })).sort((a,b) => new Date(a.name) - new Date(b.name)); // Sort by date

        setCashFlowData(formattedFlowData);
      }

      // Fetch and filter budgets
      const allBudgets = await budgetAPI.getBudgets();
      if (allBudgets) {
        const filteredBudgets = allBudgets.filter(budget => {
          const budgetStart = new Date(budget.startDate);
          const budgetEnd = new Date(budget.endDate);
          const periodStart = startDate ? new Date(startDate) : new Date(0); // Epoch for earliest date
          const periodEnd = endDate ? new Date(endDate) : new Date(); // Current date for latest date

          // Check for overlap:
          // Budget starts before or during periodEnd AND budget ends after or during periodStart
          return budgetStart <= periodEnd && budgetEnd >= periodStart;
        });
        setBudgetsForPeriod(filteredBudgets);

        // Prepare data for Budget vs. Actual chart
        const budgetVsActualMap = {};

        // Add budgeted amounts
        filteredBudgets.forEach(budget => {
          budgetVsActualMap[budget.category] = {
            category: budget.category,
            budgeted: (budgetVsActualMap[budget.category]?.budgeted || 0) + budget.amount,
            actual: budgetVsActualMap[budget.category]?.actual || 0,
          };
        });

        // Add actual spending
        categoryData.forEach(spending => {
          const categoryName = spending._id;
          budgetVsActualMap[categoryName] = {
            category: categoryName,
            budgeted: budgetVsActualMap[categoryName]?.budgeted || 0,
            actual: (budgetVsActualMap[categoryName]?.actual || 0) + spending.totalAmount,
          };
        });

        setBudgetVsActualData(Object.values(budgetVsActualMap));
      }

    } catch (err) {
      setError('Failed to fetch analytics data. Please try again.');
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);
  const handleIntervalChange = (e) => setInterval(e.target.value);

  const totalIncome = cashFlowData.reduce((acc, item) => acc + item.income, 0);
  const totalExpenses = cashFlowData.reduce((acc, item) => acc + item.expenses, 0);
  const netCashFlow = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netCashFlow / totalIncome) * 100 : 0;

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading analytics...</div>;
  }


  if (error) {
    return <div className="text-center py-8 text-red-600 dark:text-red-400">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8 dark:bg-gray-800 dark:text-gray-100 dark:shadow-none">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Financial Analytics</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-green-100 p-4 rounded-lg shadow dark:bg-green-800 dark:text-green-100 dark:shadow-none">
          <h4 className="text-sm font-medium text-green-800 dark:text-green-200">Total Income</h4>
          <p className="text-2xl font-bold text-green-900 dark:text-green-50">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow dark:bg-red-800 dark:text-red-100 dark:shadow-none">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-200">Total Expenses</h4>
          <p className="text-2xl font-bold text-red-900 dark:text-red-50">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg shadow dark:bg-blue-800 dark:text-blue-100 dark:shadow-none">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Net Cash Flow</h4>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-50">${netCashFlow.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow dark:bg-yellow-800 dark:text-yellow-100 dark:shadow-none">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Savings Rate</h4>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-50">{savingsRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Date Range and Interval Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={handleStartDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={handleEndDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          />
        </div>
        <div>
          <label htmlFor="interval" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interval</label>
          <select
            id="interval"
            value={interval}
            onChange={handleIntervalChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending by Category Pie Chart */}
        <div className="bg-gray-50 rounded-lg p-6 shadow-sm flex flex-col items-center dark:bg-gray-700 dark:text-gray-100 dark:shadow-none">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Spending by Category</h3>
          {spendingByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="totalAmount"
                  nameKey="_id"
                  label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                >
                  {spendingByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`}/>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No spending data for the selected period.</p>
          )}
        </div>

        {/* Cash Flow Line Chart */}
        <div className="bg-gray-50 rounded-lg p-6 shadow-sm flex flex-col items-center dark:bg-gray-700 dark:text-gray-100 dark:shadow-none">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Cash Flow (Income vs. Expenses)</h3>
          {cashFlowData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={cashFlowData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`}/>
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#82ca9d" name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="#8884d8" name="Expenses" />
                <Line type="monotone" dataKey="net" stroke="#FF8042" name="Net Flow" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No cash flow data for the selected period.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mt-8"> {/* New grid for Budget vs Actual */}
        {/* Budget vs. Actual Bar Chart */}
        <div className="bg-gray-50 rounded-lg p-6 shadow-sm flex flex-col items-center dark:bg-gray-700 dark:text-gray-100 dark:shadow-none">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Budget vs. Actual Spending</h3>
          {budgetVsActualData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={budgetVsActualData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`}/>
                <Legend />
                <Bar dataKey="budgeted" fill="#8884d8" name="Budgeted" />
                <Bar dataKey="actual" fill="#82ca9d" name="Actual Spending" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No budget or spending data for the selected period.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;