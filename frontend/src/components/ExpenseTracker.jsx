import React, { useState, useEffect } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import Dashboard from '../pages/Dashboard';
import '../styles/expenseTracker.css';
import axios from 'axios';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([
    'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Other'
  ]);

  // Fetch expenses from backend on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    }
  };

  const addExpense = async (expense) => {
    try {
      const response = await axios.post('http://localhost:5000/api/expenses', expense);
      setExpenses([response.data, ...expenses]);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  return (
    <div className="expense-tracker">
      <header>
        <h1>Cashflow Vision</h1>
        <p>Track and manage your expenses</p>
      </header>

      <main className="container">
        <Dashboard expenses={expenses} />
        <ExpenseForm
          onSubmit={addExpense}
          categories={categories}
        />
        <ExpenseList
          expenses={expenses}
          onDelete={deleteExpense}
          categories={categories}
        />
      </main>
    </div>
  );
};

export default ExpenseTracker;