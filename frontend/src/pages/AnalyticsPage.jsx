import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../utils/api';
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF69B4', '#ADFF2F', '#87CEEB'];

const AnalyticsPage = () => {
  const [spendingByCategory, setSpendingByCategory] = useState([]);
  const [cashFlowData, setCashFlowData] = useState([]);
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

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading analytics...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Financial Analytics</h2>

      {/* Date Range and Interval Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={handleStartDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={handleEndDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="interval" className="block text-sm font-medium text-gray-700">Interval</label>
          <select
            id="interval"
            value={interval}
            onChange={handleIntervalChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending by Category Pie Chart */}
        <div className="bg-gray-50 rounded-lg p-6 shadow-sm flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Spending by Category</h3>
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
            <p className="text-gray-600">No spending data for the selected period.</p>
          )}
        </div>

        {/* Cash Flow Line Chart */}
        <div className="bg-gray-50 rounded-lg p-6 shadow-sm flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Cash Flow (Income vs. Expenses)</h3>
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
            <p className="text-gray-600">No cash flow data for the selected period.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;