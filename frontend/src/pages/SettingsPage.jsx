import React from 'react';
import UserPreferencesForm from '../components/UserPreferencesForm';
import UserProfileForm from '../components/UserProfileForm';
import ThemeToggle from '../components/ThemeToggle';

const SettingsPage = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen dark:bg-gray-900 dark:text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your account and preferences.</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto dark:bg-gray-800 dark:text-gray-100 dark:shadow-none">
        <div className="space-y-10">
          <UserProfileForm />

          {/* New Appearance Settings Section */}
          <div className="border-t border-gray-900/10 pt-10 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-gray-100">Appearance</h2>
            <ThemeToggle />
          </div>

          <div className="border-t border-gray-900/10 pt-10 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-gray-100">User Preferences</h2>
            <UserPreferencesForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
