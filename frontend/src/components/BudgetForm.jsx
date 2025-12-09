import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { budgetAPI } from '../utils/api';

const BudgetForm = ({ onBudgetAdded, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Food',
    amount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Budget name is required';
    if (!formData.amount) newErrors.amount = 'Budget amount is required';
    else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be a positive number';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    else if (new Date(formData.endDate) < new Date(formData.startDate)) newErrors.endDate = 'End date cannot be before start date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const budgetData = {
          ...formData,
          amount: parseFloat(formData.amount)
        };
        const response = await budgetAPI.createBudget(budgetData);
        if(response) {
          if (onBudgetAdded) onBudgetAdded(response);
          // No need to reset form here, parent component will re-render
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to create budget.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">Budget Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full p-3 border rounded-md focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
          placeholder="e.g., Monthly Groceries"
        />
        {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            className={`w-full p-3 border rounded-md focus:ring-2 ${errors.amount ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
            placeholder="0.00"
          />
          {errors.amount && <span className="text-xs text-red-500">{errors.amount}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="startDate" className="text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:ring-2 ${errors.startDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
          />
          {errors.startDate && <span className="text-xs text-red-500">{errors.startDate}</span>}
        </div>
        <div className="space-y-2">
          <label htmlFor="endDate" className="text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:ring-2 ${errors.endDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
          />
          {errors.endDate && <span className="text-xs text-red-500">{errors.endDate}</span>}
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Budget'}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;