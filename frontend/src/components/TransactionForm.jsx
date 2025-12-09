import React, { useState } from 'react';

const TransactionForm = ({ onAddTransaction, onAddRecurringExpense, categories }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    currency: 'USD',
    receipt: null,
  });
  const [isRecurringChecked, setIsRecurringChecked] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');
  const [recurringStartDate, setRecurringStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [recurringEndDate, setRecurringEndDate] = useState(''); // Optional end date
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'isRecurringChecked') {
      setIsRecurringChecked(checked);
    } else if (name === 'recurringFrequency') {
      setRecurringFrequency(value);
    } else if (name === 'recurringStartDate') {
      setRecurringStartDate(value);
    } else if (name === 'recurringEndDate') {
      setRecurringEndDate(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, receipt: e.target.files[0] }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be a positive number';
    if (!formData.date && !isRecurringChecked) newErrors.date = 'Date is required for single transactions';
    
    if (isRecurringChecked) {
      if (!recurringStartDate) newErrors.recurringStartDate = 'Start date is required for recurring expense';
      if (recurringEndDate && new Date(recurringEndDate) < new Date(recurringStartDate)) {
        newErrors.recurringEndDate = 'End date cannot be before start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (isRecurringChecked) {
        onAddRecurringExpense({
          description: formData.description,
          amount: parseFloat(formData.amount),
          category: formData.category,
          frequency: recurringFrequency,
          startDate: recurringStartDate,
          endDate: recurringEndDate || null,
        });
      } else {
        onAddTransaction({
          ...formData,
          amount: parseFloat(formData.amount),
        });
      }

      // Reset form
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
        currency: 'USD',
        receipt: null,
      });
      setIsRecurringChecked(false);
      setRecurringFrequency('monthly');
      setRecurringStartDate(new Date().toISOString().split('T')[0]);
      setRecurringEndDate('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USD">USD ($)</option>
              <option value="PKR">PKR (RS)</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="What did you spend on or receive?"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {!isRecurringChecked && (
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>
          )}
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="isRecurringChecked"
              name="isRecurringChecked"
              checked={isRecurringChecked}
              onChange={handleChange}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="isRecurringChecked" className="font-medium text-gray-700">Recurring Expense</label>
          </div>
        </div>

        {isRecurringChecked && (
          <div className="ml-6 p-4 bg-gray-50 rounded-md space-y-4">
            <div>
              <label htmlFor="recurringFrequency" className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select
                id="recurringFrequency"
                name="recurringFrequency"
                value={recurringFrequency}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="recurringStartDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  id="recurringStartDate"
                  name="recurringStartDate"
                  value={recurringStartDate}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.recurringStartDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.recurringStartDate && <p className="text-red-500 text-sm mt-1">{errors.recurringStartDate}</p>}
              </div>
              <div>
                <label htmlFor="recurringEndDate" className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                <input
                  type="date"
                  id="recurringEndDate"
                  name="recurringEndDate"
                  value={recurringEndDate}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.recurringEndDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.recurringEndDate && <p className="text-red-500 text-sm mt-1">{errors.recurringEndDate}</p>}
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="receipt" className="block text-sm font-medium text-gray-700 mb-1">Receipt</label>
          <input
            type="file"
            id="receipt"
            name="receipt"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;