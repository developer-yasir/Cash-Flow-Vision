import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Header = () => {
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
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;