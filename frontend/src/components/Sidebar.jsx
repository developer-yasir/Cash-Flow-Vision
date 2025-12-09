import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, ChartBarIcon, CurrencyDollarIcon, CogIcon, WalletIcon } from '@heroicons/react/24/outline'; // Added WalletIcon

const Sidebar = () => {
  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-3 text-lg rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-white p-5 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
      <div>
        <div className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 mb-10 text-center">
          Cashflow Vision
        </div>
        <nav className="space-y-4">
          <NavLink to="/" className={navLinkClasses}>
            <HomeIcon className="h-6 w-6 mr-4" />
            Dashboard
          </NavLink>
          <NavLink to="/transactions" className={navLinkClasses}> {/* Added Transactions link */}
            <WalletIcon className="h-6 w-6 mr-4" />
            Transactions
          </NavLink>
          <NavLink to="/budgets" className={navLinkClasses}>
            <CurrencyDollarIcon className="h-6 w-6 mr-4" />
            Budgets
          </NavLink>
          <NavLink to="/analytics" className={navLinkClasses}>
            <ChartBarIcon className="h-6 w-6 mr-4" />
            Analytics
          </NavLink>
          <NavLink to="/settings" className={navLinkClasses}>
            <CogIcon className="h-6 w-6 mr-4" />
            Settings
          </NavLink>
        </nav>
      </div>
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2023 Cashflow Vision
      </div>
    </aside>
  );
};

export default Sidebar;
