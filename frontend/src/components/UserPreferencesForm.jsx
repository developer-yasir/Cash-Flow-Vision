import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { userAPI } from '../utils/api';

const UserPreferencesForm = () => {
  const [preferences, setPreferences] = useState({
    defaultCurrency: 'USD',
    enableNotifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getPreferences();
        if (response) {
          setPreferences(response);
        }
      } catch (error) {
        toast.error('Failed to fetch user preferences.');
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await userAPI.updatePreferences(preferences);
      if (response) {
        toast.success('Preferences updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update preferences.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center dark:text-gray-400">Loading preferences...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
      <div className="space-y-2">
        <label htmlFor="defaultCurrency" className="text-sm font-medium text-gray-700 dark:text-gray-300">Default Currency</label>
        <select
          id="defaultCurrency"
          name="defaultCurrency"
          value={preferences.defaultCurrency}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
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

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="enableNotifications"
          name="enableNotifications"
          checked={preferences.enableNotifications}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
        />
        <label htmlFor="enableNotifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Email Notifications</label>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </form>
  );
};

export default UserPreferencesForm;
