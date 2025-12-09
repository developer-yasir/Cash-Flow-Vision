import React from 'react';
import { Link } from 'react-router-dom';

const TopBudgets = ({ budgets }) => {
  // Sort budgets by percentage spent (descending) and take the top 3
  const topBudgets = [...budgets]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

  if (topBudgets.length === 0) {
    return null; // Don't render if there are no budgets to show
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Budgets Nearing Limit</h3>
      <div className="space-y-4">
        {topBudgets.map(budget => (
          <div key={budget._id}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-gray-800">{budget.name}</span>
              <span className="text-sm font-semibold text-red-600">{budget.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  budget.percentage >= 90 ? 'bg-red-500' :
                  budget.percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(budget.percentage, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-right">
              ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link to="/budgets" className="text-blue-600 hover:underline">
          View All Budgets
        </Link>
      </div>
    </div>
  );
};

export default TopBudgets;
