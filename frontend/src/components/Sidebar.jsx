import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, ChartBarIcon, CurrencyDollarIcon, CogIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-200 ${
      isActive ? 'bg-gray-300 font-bold' : ''
    }`;

  return (
    <aside className="w-64 bg-gray-100 p-4 border-r border-gray-200">
      <div className="text-2xl font-bold text-indigo-600 mb-8">
        Cashflow Vision
      </div>
      <nav className="space-y-2">
        <NavLink to="/dashboard" className={navLinkClasses}>
          <HomeIcon className="h-6 w-6 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/analytics" className={navLinkClasses}>
          <ChartBarIcon className="h-6 w-6 mr-3" />
          Analytics
        </NavLink>
        <NavLink to="/budgets" className={navLinkClasses}>
          <CurrencyDollarIcon className="h-6 w-6 mr-3" />
          Budgets
        </NavLink>
        <NavLink to="/settings" className={navLinkClasses}>
          <CogIcon className="h-6 w-6 mr-3" />
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
