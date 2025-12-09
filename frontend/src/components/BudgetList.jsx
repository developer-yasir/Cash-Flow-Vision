import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { budgetAPI } from '../utils/api';

const BudgetList = ({ budgets, categories, onRefresh }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (budget) => {
    setEditingId(budget._id);
    setEditData({ ...budget, startDate: budget.startDate.split('T')[0], endDate: budget.endDate.split('T')[0] });
  };

  const handleSave = async (id) => {
    try {
      const response = await budgetAPI.updateBudget(id, editData);
      if(response) {
        setEditingId(null);
        setEditData({});
        toast.success('Budget updated successfully!');
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error('Error updating budget:', error);
      toast.error('Failed to update budget.');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        const response = await budgetAPI.deleteBudget(id);
        if(response) {
          toast.success('Budget deleted successfully!');
          if (onRefresh) onRefresh();
        }
      } catch (error) {
        console.error('Error deleting budget:', error);
        toast.error('Failed to delete budget.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-4">
      {budgets.length === 0 ? (
        <p className="text-center text-gray-500">No budgets created yet. Create one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map(budget => (
            <div key={budget._id} className="bg-white rounded-lg shadow-md p-5 transition-shadow duration-300 hover:shadow-lg">
              {editingId === budget._id ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800">Edit Budget</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Category</label>
                      <select
                        name="category"
                        value={editData.category || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Amount</label>
                      <input
                        type="number"
                        name="amount"
                        value={editData.amount || ''}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="text-sm font-medium text-gray-600">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={editData.startDate || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={editData.endDate || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-3">
                    <button onClick={() => handleSave(budget._id)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Save</button>
                    <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-800">{budget.name}</h3>
                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{budget.category}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Budget:</span> ${budget.amount.toFixed(2)}</p>
                    <p><span className="font-medium">Period:</span> {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}</p>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Spent: ${budget.spent ? budget.spent.toFixed(2) : '0.00'}</span>
                      <span>{budget.percentage ? budget.percentage.toFixed(1) : '0.0'}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          budget.percentage >= 90 ? 'bg-red-500' :
                          budget.percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(budget.percentage || 0, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-blue-600 mt-1">
                      <span>Remaining: ${budget.remaining ? budget.remaining.toFixed(2) : budget.amount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-3">
                    <button onClick={() => handleEdit(budget)} className="text-sm font-medium text-blue-600 hover:text-blue-800">Edit</button>
                    <button onClick={() => handleDelete(budget._id)} className="text-sm font-medium text-red-600 hover:text-red-800">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetList;