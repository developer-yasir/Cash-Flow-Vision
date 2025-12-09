import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Header = ({ title }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    const promise = authAPI.logout();
    toast.promise(promise, {
      loading: 'Logging out...',
      success: () => {
        logout();
        return 'Logged out successfully!';
      },
      error: 'Failed to log out.',
    });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;