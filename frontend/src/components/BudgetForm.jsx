import React, { useState } from 'react';
import axios from 'axios';

const BudgetForm = ({ onBudgetAdded, categories, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Food',
    amount: '',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default: next month
    currency: 'USD'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Budget name is required';
    }

    if (!formData.amount) {
      newErrors.amount = 'Budget amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

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

        const response = await axios.post('http://localhost:5000/api/budgets', budgetData);
        setFormData({
          name: '',
          category: 'Food',
          amount: '',
          period: 'monthly',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          currency: 'USD'
        });
        
        if (onBudgetAdded) onBudgetAdded(response.data);
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Error adding budget:', error);
        if (error.response && error.response.data && error.response.data.error) {
          alert(`Error: ${error.response.data.error}`);
        } else {
          alert('Error adding budget. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="budget-form-container">
      <h2>Create New Budget</h2>
      <form onSubmit={handleSubmit} className="budget-form">
        <div className="form-group">
          <label htmlFor="name">Budget Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="e.g., Monthly Groceries"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className={errors.amount ? 'error' : ''}
              placeholder="0.00"
            />
            {errors.amount && <span className="error-message">{errors.amount}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="period">Period:</label>
            <select
              id="period"
              name="period"
              value={formData.period}
              onChange={handleChange}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="currency">Currency:</label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="INR">INR (₹)</option>
              <option value="CNY">CNY (¥)</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={errors.startDate ? 'error' : ''}
            />
            {errors.startDate && <span className="error-message">{errors.startDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={errors.endDate ? 'error' : ''}
            />
            {errors.endDate && <span className="error-message">{errors.endDate}</span>}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Budget'}
        </button>
      </form>
    </div>
  );
};

export default BudgetForm;