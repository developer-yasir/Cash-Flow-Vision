import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BudgetList = ({ categories }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/budgets');
      setBudgets(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setLoading(false);
    }
  };

  const handleEdit = (budget) => {
    setEditingId(budget._id);
    setEditData({ ...budget });
  };

  const handleSave = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/budgets/${id}`, editData);
      setBudgets(budgets.map(budget => budget._id === id ? response.data : budget));
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await axios.delete(`http://localhost:5000/api/budgets/${id}`);
        setBudgets(budgets.filter(budget => budget._id !== id));
      } catch (error) {
        console.error('Error deleting budget:', error);
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

  if (loading) {
    return <div className="loading">Loading budgets...</div>;
  }

  return (
    <div className="budget-list-container">
      <h2>My Budgets</h2>
      
      {budgets.length === 0 ? (
        <p className="no-budgets">No budgets created yet. Create your first budget!</p>
      ) : (
        <div className="budget-grid">
          {budgets.map(budget => (
            <div key={budget._id} className="budget-card">
              {editingId === budget._id ? (
                <div className="budget-edit-form">
                  <h3>Edit Budget</h3>
                  
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category:</label>
                      <select
                        name="category"
                        value={editData.category || ''}
                        onChange={handleChange}
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Amount:</label>
                      <input
                        type="number"
                        name="amount"
                        value={editData.amount || ''}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Period:</label>
                      <select
                        name="period"
                        value={editData.period || ''}
                        onChange={handleChange}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Currency:</label>
                      <select
                        name="currency"
                        value={editData.currency || ''}
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
                      <label>Start Date:</label>
                      <input
                        type="date"
                        name="startDate"
                        value={editData.startDate || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>End Date:</label>
                      <input
                        type="date"
                        name="endDate"
                        value={editData.endDate || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="button-group">
                    <button onClick={() => handleSave(budget._id)} className="save-btn">Save</button>
                    <button onClick={handleCancel} className="cancel-btn">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="budget-info">
                  <h3>{budget.name}</h3>
                  <div className="budget-details">
                    <p><span>Category:</span> {budget.category}</p>
                    <p><span>Budget:</span> {budget.currency} {budget.amount.toFixed(2)}</p>
                    <p><span>Period:</span> {budget.period}</p>
                    <p><span>Date:</span> {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}</p>
                  </div>
                  <div className="button-group">
                    <button onClick={() => handleEdit(budget)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(budget._id)} className="delete-btn">Delete</button>
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